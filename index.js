const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

// Import modules
const { parseMessage } = require('./lib/parser');
const { askDeepSeek } = require('./lib/askDeepSeek');
const { logMessage } = require('./lib/logger');
const { isValidMessage, isITQuestion, isOwnerMessage } = require('./lib/utils');

// Global variables
let sock;
let botActive = process.env.BOT_ACTIVE === 'true';
const ownerNumber = process.env.OWNER_NUMBER;
let isReconnecting = false; // Prevent multiple reconnection attempts

// Rate limit config
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 menit
const RATE_LIMIT_MAX = 8;
const userRateLimits = new Map(); // key: sender, value: [timestamps[]]

// Memory management: clean old rate limit entries
setInterval(() => {
    const now = Date.now();
    for (const [sender, timestamps] of userRateLimits.entries()) {
        const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
        if (recent.length === 0) {
            userRateLimits.delete(sender);
        } else {
            userRateLimits.set(sender, recent);
        }
    }
}, 300000); // Clean every 5 minutes

// Ensure directories exist
async function ensureDirectories() {
    await fs.ensureDir('auth_info');
    await fs.ensureDir('logs');

    const logFile = path.join('logs', 'log.json');
    if (!await fs.pathExists(logFile)) {
        await fs.writeJson(logFile, []);
    }
}

// Rate limit checker
function isRateLimited(sender) {
    const now = Date.now();
    const timestamps = userRateLimits.get(sender) || [];

    // Filter timestamps to only include within window
    const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

    if (recent.length >= RATE_LIMIT_MAX) {
        return true;
    }

    recent.push(now);
    userRateLimits.set(sender, recent);
    return false;
}

// Handle incoming messages
async function handleMessage(msg) {
    try {
        const messageInfo = parseMessage(msg);
        if (!messageInfo) return;

        const { sender, text, messageId, timestamp } = messageInfo;

        await logMessage('incoming', sender, text, messageId, timestamp);

        // Bot command (from owner only)
        if (isOwnerMessage(sender, ownerNumber)) {
            const command = text.toLowerCase();
            
            if (command === '/bot on' || command === '/on') {
                botActive = true;
                await sock.sendMessage(sender, { text: '✅ Bot telah diaktifkan' });
                await logMessage('outgoing', sender, '✅ Bot telah diaktifkan', null, Date.now());
                return;
            } else if (command === '/bot off' || command === '/off') {
                botActive = false;
                await sock.sendMessage(sender, { text: '❌ Bot telah dinonaktifkan' });
                await logMessage('outgoing', sender, '❌ Bot telah dinonaktifkan', null, Date.now());
                return;
            } else if (command === '/status') {
                const status = botActive ? 'Aktif ✅' : 'Nonaktif ❌';
                await sock.sendMessage(sender, { text: `Status Bot: ${status}` });
                await logMessage('outgoing', sender, `Status Bot: ${status}`, null, Date.now());
                return;
            }
        }

        if (!botActive) return;

        if (!isValidMessage(msg) || !isITQuestion(text)) return;

        if (msg.message.imageMessage) {
            const reply = "Maaf, saya belum bisa memproses gambar saat ini.";
            await sock.sendMessage(sender, { text: reply });
            await logMessage('outgoing', sender, reply, null, Date.now());
            return;
        }

        // ✅ Rate limit check
        if (isRateLimited(sender)) {
            const warning = "⚠️ Kamu mengirim pesan terlalu cepat. Tunggu sebentar ya sebelum bertanya lagi.";
            await sock.sendMessage(sender, { text: warning });
            await logMessage('outgoing', sender, warning, null, Date.now());
            return;
        }

        // Check if sock is connected before sending presence
        if (sock && sock.user) {
            await sock.sendPresenceUpdate('composing', sender);
        }

        const aiResponse = await askDeepSeek(text);

        if (aiResponse) {
            await sock.sendMessage(sender, { text: aiResponse });
            await logMessage('outgoing', sender, aiResponse, null, Date.now());
        }

        // Check if sock is connected before sending presence
        if (sock && sock.user) {
            await sock.sendPresenceUpdate('available', sender);
        }

    } catch (error) {
        console.error('Error handling message:', error);
        // Safe logging with fallback
        try {
            await logMessage('error', null, error.message, null, Date.now());
        } catch (logError) {
            console.error('Failed to log error:', logError);
        }
    }
}

// Connect to WhatsApp
async function connectToWhatsApp() {
    try {
        await ensureDirectories();

        const { state, saveCreds } = await useMultiFileAuthState('auth_info');

        sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger: require('pino')({ level: 'silent' }),
            browser: ['IT Helper Bot', 'Chrome', '1.0.0']
        });

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                console.log('\n' + '\x1b[33m' + '╔═══════════════════════════════════════════════════════════════╗' + '\x1b[0m');
                console.log('\x1b[33m' + '║                    📱 SCAN QR CODE TO LOGIN                    ║' + '\x1b[0m');
                console.log('\x1b[33m' + '╚═══════════════════════════════════════════════════════════════╝' + '\x1b[0m');
                qrcode.generate(qr, { small: true });
                console.log('\n\x1b[36m📲 Langkah:\x1b[0m');
                console.log('\x1b[32m   1. Buka WhatsApp di HP\x1b[0m');
                console.log('\x1b[32m   2. Menu > Perangkat Tertaut\x1b[0m');
                console.log('\x1b[32m   3. Tautkan Perangkat\x1b[0m');
                console.log('\x1b[32m   4. Scan QR code di atas\x1b[0m\n');
            }

            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('❌ Koneksi terputus:', lastDisconnect?.error);

                if (shouldReconnect && !isReconnecting) {
                    isReconnecting = true;
                    console.log('🔄 Mencoba reconnect...');
                    setTimeout(() => {
                        isReconnecting = false;
                        connectToWhatsApp();
                    }, 5000);
                } else {
                    console.log('🚪 Logged out, silakan restart aplikasi');
                }
            } else if (connection === 'open') {
                isReconnecting = false; // Reset reconnection flag
                console.log('\n' + '\x1b[32m' + '╔═══════════════════════════════════════╗' + '\x1b[0m');
                console.log('\x1b[32m' + '║        ✅ CONNECTED TO WHATSAPP!       ║' + '\x1b[0m');
                console.log('\x1b[32m' + '╚═══════════════════════════════════════╝' + '\x1b[0m');
                console.log(`\x1b[36m🤖 Bot Status: ${botActive ? '\x1b[32mAktif ✅' : '\x1b[31mNonaktif ❌'}\x1b[0m`);
                if (ownerNumber && ownerNumber !== 'your_whatsapp_number_here') {
                    console.log(`\x1b[33m👤 Owner: ${ownerNumber}\x1b[0m`);
                } else {
                    console.log(`\x1b[31m⚠️  Owner: Not configured (check .env)\x1b[0m`);
                }
                console.log('\x1b[36m📱 Bot siap menerima pesan IT!\x1b[0m\n');
            }
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('messages.upsert', async ({ messages }) => {
            for (const msg of messages) {
                if (msg.key.fromMe) continue;
                await handleMessage(msg);
            }
        });

    } catch (error) {
        console.error('Error connecting to WhatsApp:', error);
        setTimeout(connectToWhatsApp, 10000);
    }
}

process.on('SIGINT', async () => {
    console.log('\n🛑 Menghentikan bot...');
    if (sock) {
        await sock.logout();
    }
    process.exit(0);
});

// ASCII Art Banner
console.log('\n\x1b[36m' + `
╔═══════════════════════════════════════════════════════════════╗
║                    🤖 WHATSAPP IT HELPER BOT 🤖                ║
║                         ⚡ DEEPSEEK POWERED ⚡                  ║
╚═══════════════════════════════════════════════════════════════╝
` + '\x1b[0m');

console.log('\x1b[32m🚀 Memulai IT Helper Bot...\x1b[0m');
console.log('\x1b[33m📧 Dibuat oleh: Firdaus Yusuf\x1b[0m');
console.log('\x1b[35m🤖 AI Models: Mistral 7B → DeepSeek R1\x1b[0m');
console.log('\x1b[36m💡 Ready to help with IT problems!\x1b[0m\n');

connectToWhatsApp();
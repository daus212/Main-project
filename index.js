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

// Rate limit config
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 menit
const RATE_LIMIT_MAX = 8;
const userRateLimits = new Map(); // key: sender, value: [timestamps[]]

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
            if (text.toLowerCase() === '/bot on') {
                botActive = true;
                await sock.sendMessage(sender, { text: '✅ Bot telah diaktifkan' });
                await logMessage('outgoing', sender, '✅ Bot telah diaktifkan', null, Date.now());
                return;
            } else if (text.toLowerCase() === '/bot off') {
                botActive = false;
                await sock.sendMessage(sender, { text: '❌ Bot telah dinonaktifkan' });
                await logMessage('outgoing', sender, '❌ Bot telah dinonaktifkan', null, Date.now());
                return;
            } else if (text.toLowerCase() === '/status') {
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

        await sock.sendPresenceUpdate('composing', sender);

        const aiResponse = await askDeepSeek(text);

        if (aiResponse) {
            await sock.sendMessage(sender, { text: aiResponse });
            await logMessage('outgoing', sender, aiResponse, null, Date.now());
        }

        await sock.sendPresenceUpdate('available', sender);

    } catch (error) {
        console.error('Error handling message:', error);
        await logMessage('error', null, error.message, null, Date.now());
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
                console.log('\n🔗 Scan QR code ini untuk login WhatsApp:\n');
                qrcode.generate(qr, { small: true });
                console.log('\n📱 Buka WhatsApp > Perangkat Tertaut > Tautkan Perangkat\n');
            }

            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('❌ Koneksi terputus:', lastDisconnect?.error);

                if (shouldReconnect) {
                    console.log('🔄 Mencoba reconnect...');
                    setTimeout(connectToWhatsApp, 5000);
                } else {
                    console.log('🚪 Logged out, silakan restart aplikasi');
                }
            } else if (connection === 'open') {
                console.log('✅ Berhasil terhubung ke WhatsApp!');
                console.log(`🤖 Bot Status: ${botActive ? 'Aktif' : 'Nonaktif'}`);
                if (ownerNumber) {
                    console.log(`👤 Owner: ${ownerNumber}`);
                }
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

console.log('🚀 Memulai IT Helper Bot...');
console.log('📧 Dibuat oleh: Firdaus Yusuf');
console.log('🤖 AI Models: Mistral 7B → DeepSeek R1');
console.log('⚡ Strategy: Cepat untuk ringan, Dalam untuk kompleks\n');

connectToWhatsApp();
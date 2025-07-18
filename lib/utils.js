/**
 * Utility functions untuk WhatsApp bot
 */

// Kata kunci IT yang valid
const IT_KEYWORDS = [
    // Hardware
    'komputer', 'laptop', 'pc', 'hardware', 'ram', 'processor', 'cpu', 'gpu', 'motherboard',
    'harddisk', 'ssd', 'hdd', 'power supply', 'cooling', 'fan', 'thermal', 'overclock',
    
    // Software
    'software', 'aplikasi', 'program', 'windows', 'linux', 'macos', 'android', 'ios',
    'driver', 'update', 'install', 'uninstall', 'antivirus', 'firewall', 'registry',
    
    // Jaringan
    'internet', 'wifi', 'network', 'jaringan', 'router', 'modem', 'dns', 'ip', 'ping',
    'bandwidth', 'speed', 'connection', 'ethernet', 'lan', 'wan', 'vpn', 'port',
    
    // Troubleshooting
    'error', 'bug', 'crash', 'freeze', 'slow', 'lambat', 'hang', 'restart', 'reboot',
    'recovery', 'backup', 'restore', 'format', 'troubleshoot', 'debug', 'fix',
    
    // Web Development
    'website', 'html', 'css', 'javascript', 'php', 'mysql', 'database', 'server',
    'hosting', 'domain', 'ssl', 'https', 'api', 'framework', 'responsive',
    
    // Security
    'password', 'security', 'malware', 'virus', 'hack', 'phishing', 'spam',
    'encryption', 'firewall', 'backup', 'recovery', 'vulnerability',
    
    // Mobile
    'smartphone', 'android', 'iphone', 'tablet', 'mobile', 'app', 'playstore',
    'appstore', 'root', 'jailbreak', 'custom rom', 'firmware',
    
    // General IT
    'teknologi', 'digital', 'cyber', 'data', 'cloud', 'storage', 'sync',
    'email', 'printer', 'scanner', 'usb', 'bluetooth', 'wireless'
];

// Kata kunci yang menunjukkan bukan pertanyaan IT
const NON_IT_KEYWORDS = [
    'politik', 'agama', 'gosip', 'artis', 'selebriti', 'musik', 'film', 'olahraga',
    'sepak bola', 'basket', 'kuliner', 'makanan', 'resep', 'kesehatan', 'obat',
    'dokter', 'rumah sakit', 'penyakit', 'cinta', 'pacaran', 'nikah', 'keluarga',
    'keuangan', 'investasi', 'saham', 'crypto', 'bitcoin', 'trading', 'bisnis',
    'jual', 'beli', 'harga', 'diskon', 'promo', 'travel', 'wisata', 'liburan'
];

// Validasi apakah pesan valid untuk diproses
function isValidMessage(msg) {
    try {
        // Skip jika tidak ada message
        if (!msg || !msg.message) return false;
        
        // Skip jika dari bot sendiri
        if (msg.key.fromMe) return false;
        
        // Skip jika pesan grup (opsional, bisa diaktifkan jika ingin support grup)
        if (msg.key.remoteJid.includes('@g.us')) return false;
        
        // Skip jika pesan broadcast
        if (msg.key.remoteJid === 'status@broadcast') return false;
        
        // Skip jika pesan sistem
        if (msg.messageStubType) return false;
        
        return true;
        
    } catch (error) {
        console.error('Error validating message:', error);
        return false;
    }
}

// Cek apakah pertanyaan berkaitan dengan IT
function isITQuestion(text) {
    try {
        if (!text || typeof text !== 'string') return false;
        
        const textLower = text.toLowerCase();
        
        // Cek apakah mengandung kata kunci non-IT (langsung reject)
        const hasNonITKeyword = NON_IT_KEYWORDS.some(keyword => 
            textLower.includes(keyword.toLowerCase())
        );
        
        if (hasNonITKeyword) return false;
        
        // Cek apakah mengandung kata kunci IT
        const hasITKeyword = IT_KEYWORDS.some(keyword => 
            textLower.includes(keyword.toLowerCase())
        );
        
        // Cek pattern pertanyaan IT umum
        const questionPatterns = [
            /bagaimana cara.*?(install|update|fix|repair|setting|konfigurasi)/i,
            /kenapa.*?(error|crash|lambat|hang|freeze|tidak bisa)/i,
            /gimana.*?(mengatasi|memperbaiki|setting|install)/i,
            /apa itu.*?(software|hardware|aplikasi|program|virus)/i,
            /cara.*?(mengatasi|memperbaiki|install|update|setting)/i,
            /masalah.*?(komputer|laptop|internet|jaringan|software)/i,
            /solusi.*?(error|crash|lambat|hang|freeze)/i
        ];
        
        const hasQuestionPattern = questionPatterns.some(pattern => 
            pattern.test(textLower)
        );
        
        return hasITKeyword || hasQuestionPattern;
        
    } catch (error) {
        console.error('Error checking IT question:', error);
        return false;
    }
}

// Cek apakah pesan dari owner
function isOwnerMessage(sender, ownerNumber) {
    try {
        if (!ownerNumber || !sender) return false;
        
        // Normalisasi nomor (hilangkan karakter khusus)
        const normalizedSender = sender.replace(/[^\d]/g, '');
        const normalizedOwner = ownerNumber.replace(/[^\d]/g, '');
        
        return normalizedSender.includes(normalizedOwner) || 
               normalizedOwner.includes(normalizedSender);
        
    } catch (error) {
        console.error('Error checking owner message:', error);
        return false;
    }
}

// Format nomor WhatsApp
function formatPhoneNumber(number) {
    try {
        // Hapus semua karakter non-digit
        let cleaned = number.replace(/\D/g, '');
        
        // Tambahkan kode negara jika belum ada
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.substring(1);
        } else if (!cleaned.startsWith('62')) {
            cleaned = '62' + cleaned;
        }
        
        return cleaned + '@s.whatsapp.net';
        
    } catch (error) {
        console.error('Error formatting phone number:', error);
        return number;
    }
}

// Bersihkan text dari karakter khusus
function cleanText(text) {
    try {
        if (!text || typeof text !== 'string') return '';
        
        return text
            .replace(/[\u200B-\u200D\uFEFF]/g, '') // Hapus zero-width characters
            .replace(/\s+/g, ' ') // Normalisasi spasi
            .trim();
            
    } catch (error) {
        console.error('Error cleaning text:', error);
        return text;
    }
}

// Cek apakah bot sedang dalam maintenance
function isMaintenanceMode() {
    try {
        const fs = require('fs-extra');
        const path = require('path');
        const maintenanceFile = path.join(process.cwd(), 'maintenance.lock');
        
        return fs.existsSync(maintenanceFile);
        
    } catch (error) {
        console.error('Error checking maintenance mode:', error);
        return false;
    }
}

// Dapatkan informasi sistem
function getSystemInfo() {
    try {
        const os = require('os');
        
        return {
            platform: os.platform(),
            arch: os.arch(),
            uptime: Math.floor(process.uptime()),
            memory: {
                total: Math.round(os.totalmem() / 1024 / 1024),
                free: Math.round(os.freemem() / 1024 / 1024),
                usage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
            },
            nodeVersion: process.version,
            processUptime: Math.floor(process.uptime())
        };
        
    } catch (error) {
        console.error('Error getting system info:', error);
        return null;
    }
}

module.exports = {
    isValidMessage,
    isITQuestion,
    isOwnerMessage,
    formatPhoneNumber,
    cleanText,
    isMaintenanceMode,
    getSystemInfo,
    IT_KEYWORDS,
    NON_IT_KEYWORDS
};
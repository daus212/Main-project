/**
 * Parser untuk pesan WhatsApp
 * Mengekstrak informasi penting dari pesan masuk
 */

function parseMessage(msg) {
    try {
        // Skip jika pesan kosong atau tidak valid
        if (!msg || !msg.message || !msg.key) {
            return null;
        }

        // Skip jika pesan dari bot sendiri
        if (msg.key.fromMe) {
            return null;
        }

        // Ekstrak informasi pesan
        const messageId = msg.key.id;
        const sender = msg.key.remoteJid;
        const timestamp = msg.messageTimestamp * 1000;
        
        // Ekstrak text dari berbagai tipe pesan
        let text = '';
        
        if (msg.message.conversation) {
            text = msg.message.conversation;
        } else if (msg.message.extendedTextMessage) {
            text = msg.message.extendedTextMessage.text;
        } else if (msg.message.imageMessage && msg.message.imageMessage.caption) {
            text = msg.message.imageMessage.caption;
        } else if (msg.message.videoMessage && msg.message.videoMessage.caption) {
            text = msg.message.videoMessage.caption;
        } else if (msg.message.documentMessage && msg.message.documentMessage.caption) {
            text = msg.message.documentMessage.caption;
        }

        // Bersihkan text dari karakter yang tidak diinginkan
        text = text.trim();
        
        // Skip jika text kosong
        if (!text) {
            return null;
        }

        return {
            messageId,
            sender,
            text,
            timestamp,
            messageType: getMessageType(msg.message)
        };

    } catch (error) {
        console.error('Error parsing message:', error);
        return null;
    }
}

function getMessageType(message) {
    if (message.conversation) return 'text';
    if (message.extendedTextMessage) return 'text';
    if (message.imageMessage) return 'image';
    if (message.videoMessage) return 'video';
    if (message.audioMessage) return 'audio';
    if (message.documentMessage) return 'document';
    if (message.stickerMessage) return 'sticker';
    if (message.locationMessage) return 'location';
    if (message.contactMessage) return 'contact';
    return 'unknown';
}

module.exports = {
    parseMessage,
    getMessageType
};
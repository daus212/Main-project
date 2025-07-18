/**
 * Logger untuk menyimpan log chat ke file JSON
 */

const fs = require('fs-extra');
const path = require('path');

const LOG_FILE = path.join('logs', 'log.json');

// Fungsi untuk log message
async function logMessage(type, sender, message, messageId, timestamp) {
    try {
        // Ensure log directory exists
        await fs.ensureDir('logs');
        
        // Load existing logs
        let logs = [];
        if (await fs.pathExists(LOG_FILE)) {
            logs = await fs.readJson(LOG_FILE);
        }

        // Create log entry
        const logEntry = {
            timestamp: timestamp || Date.now(),
            date: new Date(timestamp || Date.now()).toISOString(),
            type: type, // 'incoming', 'outgoing', 'error', 'system'
            sender: sender,
            message: message,
            messageId: messageId
        };

        // Add to logs
        logs.push(logEntry);

        // Keep only last 1000 logs to prevent file from getting too large
        if (logs.length > 1000) {
            logs = logs.slice(-1000);
        }

        // Save logs
        await fs.writeJson(LOG_FILE, logs, { spaces: 2 });

        // Console log
        const senderInfo = sender ? ` from ${sender.split('@')[0]}` : '';
        console.log(`[${new Date().toLocaleTimeString()}] ${type.toUpperCase()}${senderInfo}: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);

    } catch (error) {
        console.error('Error logging message:', error);
    }
}

// Fungsi untuk mendapatkan statistik log
async function getLogStats() {
    try {
        if (!await fs.pathExists(LOG_FILE)) {
            return {
                totalMessages: 0,
                incomingMessages: 0,
                outgoingMessages: 0,
                errors: 0,
                uniqueSenders: 0
            };
        }

        const logs = await fs.readJson(LOG_FILE);
        const senders = new Set();
        
        const stats = {
            totalMessages: logs.length,
            incomingMessages: logs.filter(log => log.type === 'incoming').length,
            outgoingMessages: logs.filter(log => log.type === 'outgoing').length,
            errors: logs.filter(log => log.type === 'error').length,
            uniqueSenders: 0
        };

        logs.forEach(log => {
            if (log.sender && log.type === 'incoming') {
                senders.add(log.sender);
            }
        });

        stats.uniqueSenders = senders.size;

        return stats;

    } catch (error) {
        console.error('Error getting log stats:', error);
        return null;
    }
}

// Fungsi untuk mendapatkan log terbaru
async function getRecentLogs(limit = 50) {
    try {
        if (!await fs.pathExists(LOG_FILE)) {
            return [];
        }

        const logs = await fs.readJson(LOG_FILE);
        return logs.slice(-limit);

    } catch (error) {
        console.error('Error getting recent logs:', error);
        return [];
    }
}

// Fungsi untuk clear logs
async function clearLogs() {
    try {
        await fs.writeJson(LOG_FILE, []);
        console.log('✅ Logs berhasil dihapus');
    } catch (error) {
        console.error('Error clearing logs:', error);
    }
}

module.exports = {
    logMessage,
    getLogStats,
    getRecentLogs,
    clearLogs
};
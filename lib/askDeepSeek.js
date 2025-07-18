/**
 * Integrasi dengan OpenRouter API untuk DeepSeek Chat
 */

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

// Konfigurasi API
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME || 'deepseek/deepseek-chat';
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS) || 600;
const TEMPERATURE = parseFloat(process.env.TEMPERATURE) || 0.7;
const TOP_P = parseFloat(process.env.TOP_P) || 0.9;
const PRESENCE_PENALTY = parseFloat(process.env.PRESENCE_PENALTY) || 0.3;
const FREQUENCY_PENALTY = parseFloat(process.env.FREQUENCY_PENALTY) || 0.2;
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT;

// Load knowledge base
async function loadKnowledgeBase() {
    try {
        const kbPath = path.join(__dirname, 'knowledgebase.json');
        if (await fs.pathExists(kbPath)) {
            return await fs.readJson(kbPath);
        }
        return {};
    } catch (error) {
        console.error('Error loading knowledge base:', error);
        return {};
    }
}

// Save knowledge base
async function saveKnowledgeBase(kb) {
    try {
        const kbPath = path.join(__dirname, 'knowledgebase.json');
        await fs.writeJson(kbPath, kb, { spaces: 2 });
    } catch (error) {
        console.error('Error saving knowledge base:', error);
    }
}

// Kirim pertanyaan ke DeepSeek Chat
async function askDeepSeek(question) {
    try {
        // Validasi API key
        if (!API_KEY || API_KEY === 'your_openrouter_api_key_here') {
            console.error('❌ OpenRouter API key belum diatur di .env');
            return null;
        }

        // Load knowledge base untuk konteks tambahan
        const knowledgeBase = await loadKnowledgeBase();
        
        // Cek apakah ada jawaban di knowledge base
        const questionLower = question.toLowerCase();
        for (const [key, value] of Object.entries(knowledgeBase)) {
            if (questionLower.includes(key.toLowerCase())) {
                console.log('📚 Menggunakan knowledge base lokal');
                return value;
            }
        }

        // Siapkan payload untuk API
        const payload = {
            model: MODEL_NAME,
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: question
                }
            ],
            max_tokens: MAX_TOKENS,
            temperature: TEMPERATURE,
            top_p: TOP_P,
            presence_penalty: PRESENCE_PENALTY,
            frequency_penalty: FREQUENCY_PENALTY
        };

        // Kirim request ke OpenRouter
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', payload, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://github.com/firdausyusuf/whatsapp-bot',
                'X-Title': 'IT Helper Bot'
            },
            timeout: 30000 // 30 detik timeout
        });

        // Ekstrak jawaban
        const answer = response.data.choices[0].message.content.trim();
        
        // Log usage
        console.log(`🔍 Query: ${question.substring(0, 50)}...`);
        console.log(`💬 Response: ${answer.substring(0, 100)}...`);
        console.log(`💰 Tokens: ${response.data.usage?.total_tokens || 'N/A'}`);

        return answer;

    } catch (error) {
        console.error('Error asking DeepSeek:', error.message);
        
        // Handle specific errors
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;
            
            if (status === 401) {
                console.error('❌ API key tidak valid');
                return 'Maaf, terjadi masalah dengan konfigurasi bot. Silakan hubungi admin.';
            } else if (status === 429) {
                console.error('❌ Rate limit exceeded');
                return 'Maaf, bot sedang sibuk. Silakan coba lagi dalam beberapa menit.';
            } else if (status === 500) {
                console.error('❌ Server error');
                return 'Maaf, terjadi gangguan server. Silakan coba lagi nanti.';
            }
            
            console.error('API Error:', data);
        } else if (error.code === 'ECONNABORTED') {
            console.error('❌ Request timeout');
            return 'Maaf, response terlalu lama. Silakan coba dengan pertanyaan yang lebih singkat.';
        }

        return null;
    }
}

// Tambah pengetahuan baru ke knowledge base
async function addToKnowledgeBase(keyword, answer) {
    try {
        const kb = await loadKnowledgeBase();
        kb[keyword] = answer;
        await saveKnowledgeBase(kb);
        console.log(`📚 Menambahkan ke knowledge base: ${keyword}`);
    } catch (error) {
        console.error('Error adding to knowledge base:', error);
    }
}

module.exports = {
    askDeepSeek,
    addToKnowledgeBase,
    loadKnowledgeBase
};
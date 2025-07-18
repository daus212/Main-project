/**
 * Integrasi dengan OpenRouter API - Dual Model System
 * Primary: Mistral 7B untuk pertanyaan ringan
 * Fallback: DeepSeek R1 untuk troubleshooting kompleks
 */

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

// Konfigurasi API
const API_KEY = process.env.OPENROUTER_API_KEY;
const PRIMARY_MODEL = process.env.PRIMARY_MODEL || 'mistralai/mistral-7b-instruct';
const FALLBACK_MODEL = process.env.FALLBACK_MODEL || 'deepseek/deepseek-r1';
const MAX_TOKENS_PRIMARY = parseInt(process.env.MAX_TOKENS_PRIMARY) || 400;
const MAX_TOKENS_FALLBACK = parseInt(process.env.MAX_TOKENS_FALLBACK) || 800;
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

// Deteksi apakah pertanyaan butuh troubleshooting kompleks
function needsComplexTroubleshooting(question) {
    const complexKeywords = [
        'error', 'crash', 'freeze', 'hang', 'blue screen', 'bsod',
        'tidak bisa boot', 'gagal install', 'corrupt', 'rusak',
        'virus', 'malware', 'recovery', 'backup restore',
        'registry', 'system file', 'driver bermasalah',
        'troubleshoot', 'diagnosa', 'advanced', 'komplex'
    ];
    
    const questionLower = question.toLowerCase();
    return complexKeywords.some(keyword => questionLower.includes(keyword));
}

// Evaluasi apakah response dari primary model cukup baik
function isGoodResponse(response) {
    if (!response || response.length < 20) return false;
    
    // Cek apakah response generic atau tidak membantu
    const badResponses = [
        'maaf saya tidak tahu',
        'tidak bisa membantu',
        'di luar kemampuan saya',
        'coba hubungi teknisi',
        'saya tidak yakin',
        'kurang informasi'
    ];
    
    const responseLower = response.toLowerCase();
    return !badResponses.some(bad => responseLower.includes(bad));
}

// Kirim request ke OpenRouter
async function sendToOpenRouter(question, model, maxTokens, attempt = 1) {
    try {
        const payload = {
            model: model,
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
            max_tokens: maxTokens,
            temperature: TEMPERATURE,
            top_p: TOP_P,
            presence_penalty: PRESENCE_PENALTY,
            frequency_penalty: FREQUENCY_PENALTY
        };

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', payload, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://github.com/firdausyusuf/whatsapp-bot',
                'X-Title': 'IT Helper Bot'
            },
            timeout: 30000
        });

        const answer = response.data.choices[0].message.content.trim();
        const usage = response.data.usage;
        
        console.log(`🤖 Model: ${model} (attempt ${attempt})`);
        console.log(`🔍 Query: ${question.substring(0, 50)}...`);
        console.log(`💬 Response: ${answer.substring(0, 80)}...`);
        console.log(`💰 Tokens: ${usage?.total_tokens || 'N/A'}`);
        
        return answer;

    } catch (error) {
        console.error(`Error with ${model}:`, error.message);
        throw error;
    }
}

// Fungsi utama untuk ask dengan dual model system
async function askDeepSeek(question) {
    try {
        // Validasi API key
        if (!API_KEY || API_KEY === 'your_openrouter_api_key_here') {
            console.error('❌ OpenRouter API key belum diatur di .env');
            return 'Maaf, terjadi masalah dengan konfigurasi bot. Silakan hubungi admin.';
        }

        // Cek knowledge base terlebih dahulu
        const knowledgeBase = await loadKnowledgeBase();
        const questionLower = question.toLowerCase();
        
        for (const [key, value] of Object.entries(knowledgeBase)) {
            if (questionLower.includes(key.toLowerCase())) {
                console.log('📚 Menggunakan knowledge base lokal');
                return value;
            }
        }

        // Tentukan strategy berdasarkan kompleksitas
        const needsComplexModel = needsComplexTroubleshooting(question);
        
        if (needsComplexModel) {
            console.log('🔧 Pertanyaan troubleshooting kompleks, langsung ke DeepSeek R1');
            return await sendToOpenRouter(question, FALLBACK_MODEL, MAX_TOKENS_FALLBACK, 1);
        }

        // Coba dengan Mistral 7B terlebih dahulu
        console.log('💡 Mencoba dengan Mistral 7B...');
        try {
            const primaryResponse = await sendToOpenRouter(question, PRIMARY_MODEL, MAX_TOKENS_PRIMARY, 1);
            
            // Evaluasi response quality
            if (isGoodResponse(primaryResponse)) {
                console.log('✅ Mistral 7B berhasil memberikan jawaban yang baik');
                return primaryResponse;
            } else {
                console.log('⚠️ Response Mistral kurang memadai, switching ke DeepSeek R1...');
            }
            
        } catch (error) {
            console.log('❌ Mistral 7B gagal, switching ke DeepSeek R1...');
        }

        // Fallback ke DeepSeek R1
        console.log('🧠 Menggunakan DeepSeek R1 untuk analisis mendalam...');
        const fallbackResponse = await sendToOpenRouter(question, FALLBACK_MODEL, MAX_TOKENS_FALLBACK, 2);
        
        // Tambahkan indikator bahwa ini menggunakan model advanced
        return fallbackResponse;

    } catch (error) {
        console.error('Error in dual model system:', error.message);
        
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

        return 'Maaf, terjadi kesalahan teknis. Silakan coba lagi nanti.';
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

// Fungsi untuk mendapatkan statistik penggunaan model
function getModelStats() {
    // Bisa dikembangkan untuk tracking usage stats
    return {
        primaryModelUsage: 0,
        fallbackModelUsage: 0,
        knowledgeBaseHits: 0
    };
}

module.exports = {
    askDeepSeek,
    addToKnowledgeBase,
    loadKnowledgeBase,
    needsComplexTroubleshooting,
    getModelStats
};
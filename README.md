# IT Helper Bot - WhatsApp Chatbot

Bot WhatsApp otomatis yang membantu menjawab pertanyaan seputar IT ringan menggunakan AI DeepSeek Chat melalui OpenRouter API.

## 🧠 **Dual AI Model System:**

Bot menggunakan strategi cerdas dengan 2 model AI:

### 🚀 **Mistral 7B (Primary)**
- **Untuk:** Pertanyaan IT ringan dan umum
- **Keunggulan:** Cepat, efisien, hemat cost
- **Contoh:** "Cara install driver", "WiFi lemot", "Shortcut keyboard"

### 🔧 **DeepSeek R1 (Fallback)**  
- **Untuk:** Troubleshooting kompleks dan error handling
- **Keunggulan:** Analisis mendalam, reasoning kuat
- **Contoh:** "Blue screen error", "System corrupt", "Advanced troubleshooting"

### 🎯 **Auto-Switch Logic:**
1. **Deteksi Kompleksitas** - Bot otomatis deteksi tingkat kesulitan
2. **Mistral First** - Coba model ringan dulu untuk efisiensi  
3. **Quality Check** - Evaluasi kualitas response
4. **Smart Fallback** - Switch ke DeepSeek R1 jika dibutuhkan

## 🤖 Fitur

- ✅ **Otomatis menjawab pertanyaan IT** - Hanya merespons pertanyaan yang berkaitan dengan teknologi
- ✅ **AI DeepSeek Chat** - Powered by model DeepSeek via OpenRouter API
- ✅ **Command Control** - Toggle bot on/off lewat command WhatsApp
- ✅ **Knowledge Base Lokal** - Menyimpan jawaban untuk pertanyaan umum
- ✅ **Logging Lengkap** - Semua chat tersimpan dalam file JSON
- ✅ **QR Code Login** - Mudah connect dengan WhatsApp
- ✅ **Auto Reconnect** - Otomatis connect ulang jika terputus
- ✅ **Arsitektur Modular** - Kode terstruktur dan mudah dikembangkan

## 📁 Struktur Proyek

```
whatsapp-bot/
├── index.js                    # Entry point utama
├── package.json               # Dependencies
├── .env                       # Konfigurasi API key
├── lib/
│   ├── parser.js              # Parsing pesan WhatsApp
│   ├── askDeepSeek.js         # Integrasi OpenRouter API
│   ├── logger.js              # System logging
│   ├── utils.js               # Fungsi utilitas
│   └── knowledgebase.json     # Knowledge base lokal
├── logs/
│   └── log.json              # File log chat
├── auth_info/                 # Session WhatsApp (auto-generated)
└── README.md                  # Dokumentasi
```

## 🚀 Instalasi

### 1. Clone atau Download Proyek
```bash
git clone https://github.com/daus212/Main-project
cd Main-project
```

### 2. Install Dependencies
```bash
dalam project folder (Main-project) jalankan npm install
```

### 3. Konfigurasi Environment
Edit file `.env` dan isi dengan konfigurasi Anda:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Bot Configuration
BOT_ACTIVE=true
BOT_NAME=IT Helper Bot
OWNER_NUMBER=your number  # Nomor WhatsApp owner (opsional)

# DeepSeek Model Configuration
MODEL_NAME=deepseek/deepseek-chat
MAX_TOKENS=600
TEMPERATURE=0.7
TOP_P=0.9
PRESENCE_PENALTY=0.3
FREQUENCY_PENALTY=0.2
```

### 4. Dapatkan OpenRouter API Key
1. Daftar di [OpenRouter.ai](https://openrouter.ai/)
2. Masuk ke dashboard
3. Buat API key baru
4. Copy dan paste ke file `.env`

### 5. Jalankan Bot
```bash
npm start
```

Atau untuk development:
```bash
npm run dev
```

## 📱 Cara Penggunaan

### Login WhatsApp
1. Jalankan bot dengan `npm start`
2. Scan QR code yang muncul di terminal menggunakan WhatsApp
3. Bot akan otomatis connect dan siap digunakan

### Command untuk Owner
Jika Anda sudah set `OWNER_NUMBER` di .env, Anda bisa menggunakan command:

- `/bot on` - Mengaktifkan bot
- `/bot off` - Menonaktifkan bot  
- `/status` - Cek status bot

### Pertanyaan yang Dijawab
Bot hanya akan merespons pertanyaan yang berkaitan dengan:
- Hardware komputer/laptop
- Software dan aplikasi
- Jaringan dan internet
- Troubleshooting IT
- Web development
- Security dan malware
- Mobile device (Android/iOS)

### Contoh Pertanyaan
- "Kenapa laptop saya lambat?"
- "Bagaimana cara install driver?"
- "WiFi tidak bisa connect"
- "Cara mengatasi blue screen?"
- "Internet lemot bagaimana?"

## 🔧 Kustomisasi

### Menambah Knowledge Base
Edit file `lib/knowledgebase.json` untuk menambah jawaban otomatis:

```json
{
  "keyword": "Jawaban untuk keyword tersebut",
  "install chrome": "Cara install Chrome: 1. Buka google.com/chrome ..."
}
```

### Mengubah Model AI
Ganti `MODEL_NAME` di file `.env` dengan model lain yang tersedia di OpenRouter:
- `deepseek/deepseek-chat` (default)
- `openai/gpt-4o-mini`
- `anthropic/claude-3-haiku`
- dll.

### Menambah Kata Kunci IT
Edit array `IT_KEYWORDS` di `lib/utils.js` untuk menambah kata kunci yang dikenali sebagai pertanyaan IT.

## 📊 Monitoring

### Cek Log
Log tersimpan di `logs/log.json` dalam format JSON dengan informasi:
- Timestamp
- Tipe pesan (incoming/outgoing/error)
- Sender
- Isi pesan
- Message ID

### Statistik Bot
Bot akan menampilkan informasi di console:
- Jumlah pesan masuk/keluar
- Penggunaan token AI
- Status connection
- Error yang terjadi

## 🛠️ Troubleshooting

### Bot Tidak Merespons
1. Cek apakah `BOT_ACTIVE=true` di .env
2. Pastikan pertanyaan mengandung kata kunci IT
3. Cek log di `logs/log.json` untuk error

### QR Code Tidak Muncul
1. Pastikan terminal mendukung karakter UTF-8
2. Coba restart aplikasi
3. Hapus folder `auth_info` dan scan ulang

### API Error
1. Pastikan API key OpenRouter valid
2. Cek saldo/kredit di dashboard OpenRouter
3. Periksa connection internet

### Memory Usage Tinggi
1. Restart aplikasi secara berkala
2. Kurangi `MAX_TOKENS` di .env
3. Hapus log lama secara manual

## 🔒 Security

- Jangan share file `.env` yang berisi API key
- Gunakan nomor WhatsApp khusus untuk bot
- Backup session di folder `auth_info` secara berkala
- Monitor penggunaan API untuk menghindari over-usage

## 📝 Pengembangan

### Menambah Fitur
1. Buat file baru di folder `lib/`
2. Import di `index.js`
3. Tambahkan handler di function `handleMessage`

### Testing
```bash
# Install nodemon untuk development
npm install -g nodemon

# Jalankan dengan auto-reload
npm run dev
```

### Deployment
Bot bisa dijalankan di:
- VPS/Server Linux
- Windows dengan Node.js
- Docker container
- Heroku (gratis dengan batasan)

## 🤝 Kontribusi

Dibuat oleh **Firdaus Yusuf** untuk membantu menjawab pertanyaan IT ringan secara otomatis.

## 📄 Lisensi

MIT License - Bebas digunakan dan dimodifikasi.

## 📞 Support

Jika ada pertanyaan atau bug, silakan buat issue di repository ini.

---

**Happy Coding! 🚀**

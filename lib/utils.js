const IT_KEYWORDS = [
  "laptop", "komputer", "pc", "printer", "wifi", "bluetooth", "monitor", "layar",
  "baterai", "charger", "colokan", "keyboard", "mouse", "speaker", "ram", "cpu",
  "ssd", "hdd", "os", "windows", "linux", "debian", "ubuntu", "virus", "lemot", "hang",
  "ngelag", "not responding", "bootloop", "install ulang", "servis", "recovery",
  "network", "jaringan", "nggak nyala", "mati total", "layar hitam", "restart sendiri",
  "gagal boot", "system error", "troubleshoot", "reset", "bios", "fan", "overheat",
  "update windows", "layar biru", "keyboard error", "touchpad", "browsing", "lemot banget",
  "nggak konek", "nggak detect", "ngga nyala", "error 0x", "booting", "koneksi", "wifi putus",
  "internet lemot", "nggak bisa connect", "data hilang", "file kehapus", "layar pecah",
  "suhu panas", "kipas nyala terus", "bunyi bip", "enggak muncul", "enggak tampil",
  "nggak tampil", "engga kedetek", "enggak terdeteksi", "patah-patah", "ngefreeze", "shutdown sendiri"
];

const NON_IT_KEYWORDS = [
  "cinta", "galau", "mantan", "makan", "ngopi", "main bola", "tiktok", "pacar", "nongkrong", 
  "curhat", "keuangan", "meme", "viral", "artis", "gosip", "liburan", "kpop", "drakor", 
  "nonton", "game ml", "bucin", "mabar", "nasi padang"
];

const QUESTION_PATTERNS = [
  "gimana", "kenapa", "bagaimana", "kok bisa", "apa yang", "mengapa", "kenapa ya", 
  "kenapa sih", "kenapa tiba-tiba", "boleh tanya", "mau tanya", "tanya dong", "ada solusi", 
  "ada cara", "gimana cara", "gmn", "gmna", "cara ngatasin", "cara benerin", "cara fix"
];

function normalizeText(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

function isITQuestion(text) {
  // Input validation
  if (!text || typeof text !== 'string') {
    return false;
  }

  const normalizedText = normalizeText(text);

  const hasITKeyword = IT_KEYWORDS.some(keyword => normalizedText.includes(keyword));
  const hasNonITKeyword = NON_IT_KEYWORDS.some(keyword => normalizedText.includes(keyword));
  const hasQuestionPattern = QUESTION_PATTERNS.some(pattern => normalizedText.includes(pattern));

  const relevanceScore = (hasITKeyword ? 1 : 0) + (hasQuestionPattern ? 1 : 0);

  if (hasNonITKeyword && relevanceScore < 2) return false; // strong signal bukan IT
  return relevanceScore >= 1; // fleksibel, tapi tetap aman
}

function isValidMessage(message) {
  if (!message.message || message.key.fromMe) return false;
  if (message.key.remoteJid?.endsWith("@g.us")) return false;
  if (message.message.protocolMessage) return false;
  return true;
}

function isOwnerMessage(sender, ownerNumber) {
  // Input validation
  if (!sender || typeof sender !== 'string') {
    return false;
  }
  
  if (!ownerNumber || ownerNumber === 'your_whatsapp_number_here') {
    return false;
  }
  
  // Normalize both numbers (remove @s.whatsapp.net suffix and any formatting)
  const normalizedSender = sender.replace('@s.whatsapp.net', '').replace(/\D/g, '');
  const normalizedOwner = ownerNumber.replace(/\D/g, '');
  
  return normalizedSender === normalizedOwner;
}

module.exports = {
  isITQuestion,
  isValidMessage,
  isOwnerMessage,
};
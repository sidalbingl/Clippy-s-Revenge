# 🇹🇷 Nasıl Çalıştırılır?

## İlk Kurulum (Sadece Bir Kez)

### 1. Node.js Yükle
- [nodejs.org](https://nodejs.org/) adresine git
- "LTS" versiyonunu indir (önerilen)
- Kur (Next, Next, Finish)
- Terminal aç ve kontrol et:
```bash
node --version
# v18.x.x veya üzeri görmeli
```

### 2. Projeyi Hazırla
Terminal'de proje klasörüne git ve:
```bash
npm install
```
⏳ Bu 2-3 dakika sürebilir, bekle...

## Her Seferinde (Uygulamayı Başlatma)

```bash
npm run dev
```

Bu komut:
1. ✅ React uygulamasını başlatır (Vite)
2. ✅ Electron penceresini açar
3. ✅ Dosya izlemeyi başlatır (MCP)

Birkaç saniye sonra sağ alt köşede Clippy'yi göreceksin!

## Test Etme Yöntemleri

### Yöntem 1: Dev Controls (En Kolay) 🎮

1. Sağ üstteki **[DEV]** butonuna tıkla
2. Test butonlarından birini seç:
   - **[LOW]** → Hafif hakaret
   - **[MED]** → Orta hakaret + sarsma
   - **[HIGH]** → Ağır hakaret + tüm efektler

### Yöntem 2: Gerçek Kod Testi 📝

1. Proje klasöründe `test.js` dosyası oluştur
2. Kötü kod yaz:
```javascript
console.log("test");  // Clippy bunu sevmez

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {  // İç içe döngü!
    console.log(i * 42);  // Magic number!
  }
}
```
3. Kaydet (Ctrl+S)
4. Clippy tepki verecek! 💥

### Yöntem 3: Otomatik Testler 🧪

```bash
# Response engine testleri
npm run test:response

# Kullanım örnekleri
npm run example:response
```

## Ne Göreceksin?

### Düşük Severity (Low)
```
💬 "I see you're writing code. Need help making it worse?"
😐 Normal Clippy
```

### Orta Severity (Medium)
```
💬 "console.log again? Truly elite debugging technique."
😠 Turuncu gözler
🔄 Sarsma efekti
```

### Yüksek Severity (High)
```
💬 "This code is the real horror story here."
😡 Kırmızı gözler
🔄 Yoğun sarsma
⚡ Glitch efekti
🔴 Kırmızı flaş
```

## Sorun Giderme

### "npm: command not found"
Node.js yüklü değil → [nodejs.org](https://nodejs.org/) adresinden indir

### "Port 5173 already in use"
Başka bir uygulama portu kullanıyor:
```bash
npx kill-port 5173
npm run dev
```

### Electron açılmıyor
Her şeyi sıfırla:
```bash
npm run reinstall
npm run dev
```

### Clippy tepki vermiyor
1. Terminal'de "[MCP]" loglarını kontrol et
2. Dev Controls'deki test butonlarını dene
3. Dosya uzantısının `.js`, `.ts`, `.jsx`, `.tsx`, `.py` olduğundan emin ol

## Özelleştirme

### Hakaret Mesajlarını Değiştir
`src/mcp/responseEngine/insults.ts` dosyasını aç ve düzenle!

### Renkleri Değiştir
`tailwind.config.js` ve `src/renderer/index.css` dosyalarını düzenle.

### Yeni Efekt Ekle
`src/renderer/hooks/effects/` klasörüne bak.

## Daha Fazla Bilgi

- 📖 **Detaylı Rehber**: `GETTING_STARTED.md`
- ⚡ **Hızlı Başlangıç**: `QUICK_START.md`
- 🧪 **Test Senaryoları**: `TEST_SCENARIOS.md`
- 📚 **Teknik Dokümantasyon**: `README.md`

## Yardımcı Komutlar

```bash
# Uygulamayı başlat
npm run dev

# Response engine testleri
npm run test:response

# Kullanım örnekleri
npm run example:response

# Production build
npm run build

# Her şeyi sıfırla
npm run reinstall
```

## Video Gibi Adımlar

1. ✅ Terminal aç
2. ✅ `npm install` yaz, Enter'a bas
3. ☕ Kahve iç (2-3 dakika)
4. ✅ `npm run dev` yaz, Enter'a bas
5. ⏳ Birkaç saniye bekle
6. 🎉 Clippy göründü!
7. 🎮 [DEV] butonuna tıkla
8. 🔴 [HIGH] Test butonuna bas
9. 💥 Clippy çıldırsın!

Başarılar! 🚀👻📎

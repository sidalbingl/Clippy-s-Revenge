# ⚡ Hızlı Başlangıç (5 Dakika)

## 1️⃣ Kurulum (2 dakika)

```bash
# Bağımlılıkları yükle
npm install
```

Kahve molası ver ☕ - Bu biraz sürecek...

## 2️⃣ Çalıştır (30 saniye)

```bash
# Uygulamayı başlat
npm run dev
```

Şunları göreceksin:
- ✅ Vite dev server başladı (http://localhost:5173)
- ✅ Electron penceresi açıldı
- ✅ Sağ alt köşede Clippy görünüyor

## 3️⃣ Test Et (2 dakika)

### Yöntem 1: Dev Controls (En Kolay)

1. Sağ üstteki **[DEV]** butonuna tıkla
2. **[HIGH] Test** butonuna bas
3. 💥 Clippy çıldıracak!

### Yöntem 2: Gerçek Kod Analizi

Proje klasöründe `test.js` dosyası oluştur:

```javascript
// test.js
console.log("Merhaba");  // Clippy bunu sevmeyecek

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {  // İç içe döngü!
    console.log(i * 42);  // Magic number!
  }
}
```

Dosyayı kaydet → Clippy tepki verecek! 🔥

## 4️⃣ Response Engine'i Test Et (30 saniye)

```bash
# Testleri çalıştır
npm run test:response

# Örnekleri gör
npm run example:response
```

## 🎯 Ne Beklemeli?

### Low Severity (Düşük)
- 💬 Hafif sarkastik mesaj
- 😐 Sakin Clippy
- ✨ Efekt yok

### Medium Severity (Orta)
- 💬 Daha sert mesaj
- 😠 Sinirli Clippy (turuncu gözler)
- 🔄 Sarsma efekti

### High Severity (Yüksek)
- 💬 Çok sert mesaj
- 😡 Öfkeli Clippy (kırmızı gözler)
- 🔄 Yoğun sarsma
- ⚡ Glitch efekti
- 🔴 Kırmızı flaş

## 🐛 Sorun mu Var?

### Electron açılmıyor
```bash
npm run reinstall
npm run dev
```

### Port hatası
```bash
npx kill-port 5173
npm run dev
```

### Hiçbir şey çalışmıyor
```bash
# Her şeyi sıfırla
rm -rf node_modules dist
npm install
npm run dev
```

## 📝 Özelleştirme

### Insult'ları Değiştir
`src/mcp/responseEngine/insults.ts` dosyasını aç ve istediğin gibi düzenle!

### Yeni Efekt Ekle
`src/renderer/hooks/effects/` klasörüne bak.

### UI'ı Değiştir
`src/renderer/components/` klasöründeki dosyaları düzenle.

## 🚀 Sonraki Adımlar

1. ✅ Uygulamayı çalıştırdın
2. ✅ Test ettin
3. 📖 Şimdi `GETTING_STARTED.md` dosyasını oku
4. 🎨 Kodu özelleştir
5. 🏗️ Build al: `npm run build`

Tebrikler! Clippy artık senin kodunu yargılıyor! 👻📎

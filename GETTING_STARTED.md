# Clippy's Revenge - Başlangıç Rehberi

Bu rehber, projeyi ilk kez çalıştıracaklar için adım adım talimatlar içerir.

## Ön Gereksinimler

Bilgisayarınızda şunlar yüklü olmalı:
- **Node.js** (v18 veya üzeri) - [nodejs.org](https://nodejs.org/)
- **npm** (Node.js ile birlikte gelir)
- Bir kod editörü (VS Code önerilir)

Node.js yüklü mü kontrol et:
```bash
node --version
npm --version
```

## Adım 1: Bağımlılıkları Yükle

Proje klasöründe terminal aç ve şunu çalıştır:

```bash
npm install
```

Bu komut tüm gerekli paketleri yükler (React, Electron, Tailwind, vb.). İlk seferde 2-3 dakika sürebilir.

## Adım 2: Projeyi Geliştirme Modunda Çalıştır

```bash
npm run dev
```

Bu komut iki şeyi başlatır:
1. **Vite dev server** (React uygulaması için)
2. **Electron uygulaması** (masaüstü penceresi)

Birkaç saniye sonra şöyle bir pencere açılacak:
- Sağ alt köşede küçük, şeffaf bir pencere
- İçinde Clippy karakteri
- Sağ üstte "[DEV]" butonu

## Adım 3: Test Et

### Manuel Test (Dev Controls ile)

1. Sağ üstteki **[DEV]** butonuna tıkla
2. Test butonlarını göreceksin:
   - **[LOW] Test** - Hafif hakaret
   - **[MED] Test** - Orta seviye hakaret + sarsma efekti
   - **[HIGH] Test** - Ağır hakaret + sarsma + glitch + kırmızı flaş

Her butona tıkladığında Clippy'nin tepkisini göreceksin!

### Otomatik Test (Dosya İzleme)

Uygulama çalışırken, proje klasöründe bir `.js`, `.ts`, `.jsx`, `.tsx` veya `.py` dosyası oluştur veya düzenle:

```javascript
// test.js
console.log("test");  // Bu console.log'u Clippy görecek!

function test() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {  // İç içe döngü!
      console.log(i, j);
    }
  }
}

const x = 42;  // Magic number!
```

Dosyayı kaydet (Ctrl+S / Cmd+S) ve Clippy'nin tepkisini izle!

## Adım 4: Response Engine'i Test Et

Response engine'in doğru çalıştığını test etmek için:

```bash
npx ts-node src/mcp/responseEngine/responseEngine.test.ts
```

Veya örnek kullanımları görmek için:

```bash
npx ts-node src/mcp/responseEngine/example.ts
```

## Sorun Giderme

### "npm: command not found"
Node.js yüklü değil. [nodejs.org](https://nodejs.org/) adresinden indir.

### "Port 5173 already in use"
Başka bir Vite projesi çalışıyor. Onu kapat veya:
```bash
npx kill-port 5173
npm run dev
```

### Electron penceresi açılmıyor
1. Terminal'de hata mesajlarını kontrol et
2. `npm install` komutunu tekrar çalıştır
3. `node_modules` klasörünü sil ve tekrar `npm install` yap

### Clippy tepki vermiyor
1. Dev Controls'deki test butonlarını dene
2. Terminal'de "[MCP]" ile başlayan logları kontrol et
3. Dosya değişikliklerinin `.js`, `.ts`, `.jsx`, `.tsx`, `.py` uzantılı olduğundan emin ol

## Proje Yapısı Hızlı Bakış

```
clippys-revenge/
├── src/
│   ├── main/              # Electron ana süreç
│   ├── renderer/          # React UI
│   └── mcp/              # Kod analizi + response engine
├── package.json          # Bağımlılıklar
└── README.md            # Detaylı dokümantasyon
```

## Sonraki Adımlar

1. **Kodu İncele**: `src/renderer/App.tsx` dosyasından başla
2. **Insult'ları Özelleştir**: `src/mcp/responseEngine/insults.ts` dosyasını düzenle
3. **Yeni Efektler Ekle**: `src/renderer/hooks/effects/` klasörüne bak
4. **Build Al**: `npm run build` ile production build oluştur

## Yardım

Sorun yaşarsan:
1. Terminal'deki hata mesajlarını oku
2. `README.md` dosyasındaki detaylı dokümantasyona bak
3. Console'u aç (F12) ve hataları kontrol et

Keyifli kodlamalar! 👻📎

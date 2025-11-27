# 🔧 Hata Çözümü

## Karşılaştığın Hata

```
Error launching app
Unable to find Electron app at D:\Masaüstü\kiro
Cannot find module 'D:\Masaüstü\kiro\dist\main.js'
```

## Neden Oluyor?

TypeScript dosyaları henüz JavaScript'e derlenmemiş. Electron `dist/main.js` dosyasını arıyor ama bulamıyor.

## Çözüm

### Adım 1: Yeni Paketi Yükle

```bash
npm install
```

Bu komut `wait-on` paketini yükleyecek (package.json'a ekledim).

### Adım 2: İlk Derlemeyi Yap

```bash
npm run build:main
```

Bu komut TypeScript dosyalarını derleyip `dist` klasörüne koyacak.

### Adım 3: Uygulamayı Başlat

```bash
npm run dev
```

Artık çalışmalı! 🎉

## Alternatif Çözüm (Daha Basit)

Eğer hala sorun yaşıyorsan, adım adım dene:

```bash
# 1. TypeScript'i derle
npx tsc -p tsconfig.main.json

# 2. Başka bir terminal aç ve Vite'ı başlat
npm run dev:renderer

# 3. Üçüncü bir terminal aç ve Electron'u başlat
npm start
```

## Gelecekte

Artık `npm run dev` komutu şunları yapacak:
1. ✅ TypeScript'i derle
2. ✅ TypeScript watch mode başlat (değişiklikleri otomatik derle)
3. ✅ Vite dev server başlat
4. ✅ Electron'u başlat (dist/main.js hazır olunca)

## Hala Çalışmıyorsa

### Çözüm 1: Her Şeyi Sıfırla

```bash
# Tüm derlenmiş dosyaları sil
rmdir /s /q dist
rmdir /s /q node_modules

# Yeniden yükle
npm install

# Derle
npm run build:main

# Başlat
npm run dev
```

### Çözüm 2: Manuel Derleme

```bash
# TypeScript'i derle
npx tsc -p tsconfig.main.json

# Kontrol et
dir dist

# main.js dosyası görünmeli
# Şimdi başlat
npm run dev
```

## Kontrol Listesi

Çalışmıyorsa şunları kontrol et:

- [ ] `node_modules` klasörü var mı?
- [ ] `npm install` çalıştırdın mı?
- [ ] `dist` klasörü oluştu mu?
- [ ] `dist/main.js` dosyası var mı?
- [ ] Terminal'de başka hata var mı?

## Yardım

Hala sorun varsa:
1. Terminal'deki TÜM hata mesajlarını kopyala
2. `dist` klasörünün içeriğini kontrol et
3. `npm run build:main` komutunun çıktısını kontrol et

Başarılar! 🚀

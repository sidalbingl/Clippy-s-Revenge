# 🧪 Test Senaryoları

Bu dosya, Clippy's Revenge uygulamasını test etmek için hazır senaryolar içerir.

## Senaryo 1: Console Log Testi

**Amaç**: Console.log kullanımını tespit etme

**Adımlar**:
1. Proje klasöründe `test-console.js` dosyası oluştur
2. Şu kodu yaz:
```javascript
function debugFunction() {
  console.log("Debug message");
  console.warn("Warning message");
  console.error("Error message");
}
```
3. Dosyayı kaydet (Ctrl+S)

**Beklenen Sonuç**:
- ⚠️ Medium severity
- 💬 "console.log again? Truly elite debugging technique."
- 😠 Turuncu gözler
- 🔄 Sarsma efekti

---

## Senaryo 2: Magic Numbers Testi

**Amaç**: Açıklamasız sayıları tespit etme

**Adımlar**:
1. `test-magic.js` dosyası oluştur
2. Şu kodu yaz:
```javascript
const timeout = 5000;  // Magic number!
const maxRetries = 42;  // Magic number!
const buffer = 256;  // Magic number!

function calculate() {
  return 3.14159 * 2.71828;  // Daha fazla magic number!
}
```
3. Dosyayı kaydet

**Beklenen Sonuç**:
- ⚠️ Medium severity
- 💬 "Nothing says 'I gave up' like unexplained numbers."
- 😠 Turuncu gözler
- 🔄 Sarsma efekti

---

## Senaryo 3: İç İçe Döngüler (Nested Loops)

**Amaç**: Karmaşık iç içe yapıları tespit etme

**Adımlar**:
1. `test-nested.js` dosyası oluştur
2. Şu kodu yaz:
```javascript
function processMatrix() {
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      for (let k = 0; k < 100; k++) {  // 3 seviye iç içe!
        console.log(i, j, k);
      }
    }
  }
}
```
3. Dosyayı kaydet

**Beklenen Sonuç**:
- 🔴 High severity
- 💬 "Nested loops? Bold move. Wrong, but bold."
- 😡 Kırmızı gözler
- 🔄 Yoğun sarsma
- ⚡ Glitch efekti
- 🔴 Kırmızı flaş

---

## Senaryo 4: Uzun Fonksiyon

**Amaç**: Çok uzun fonksiyonları tespit etme

**Adımlar**:
1. `test-long.js` dosyası oluştur
2. 100+ satırlık bir fonksiyon yaz (aşağıdaki gibi):
```javascript
function veryLongFunction() {
  // 1. satır
  const a = 1;
  // 2. satır
  const b = 2;
  // ... 100 satır daha
  // Her satıra bir şeyler ekle
  return a + b;
}
```
3. Dosyayı kaydet

**Beklenen Sonuç**:
- ⚠️ Medium/High severity
- 💬 "This function is so big it should pay rent."
- 😠/😡 Turuncu veya kırmızı gözler
- 🔄 Sarsma efekti

---

## Senaryo 5: Mükemmel Kod (Kontrol Testi)

**Amaç**: Temiz kodun düşük severity verdiğini doğrulama

**Adımlar**:
1. `test-clean.js` dosyası oluştur
2. Şu kodu yaz:
```javascript
const MAX_RETRIES = 3;
const TIMEOUT_MS = 1000;

function fetchData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => handleError(error));
}

function handleError(error) {
  // Proper error handling
  return null;
}
```
3. Dosyayı kaydet

**Beklenen Sonuç**:
- ✅ Low severity
- 💬 "Interesting approach. By 'interesting' I mean questionable."
- 😐 Normal gözler
- ✨ Efekt yok

---

## Senaryo 6: Kombinasyon (En Kötü Kod)

**Amaç**: Tüm sorunları bir arada test etme

**Adımlar**:
1. `test-nightmare.js` dosyası oluştur
2. Şu kodu yaz:
```javascript
function terribleCode() {
  console.log("Starting");  // Console log
  
  for (let i = 0; i < 100; i++) {  // İç içe döngü
    for (let j = 0; j < 100; j++) {
      const x = 42;  // Magic number
      const y = 3.14159;  // Magic number
      console.log(x * y);  // Daha fazla console.log
      
      if (i > 50) {
        if (j > 50) {
          if (x > 40) {  // İç içe if
            console.log("Deep nesting");
          }
        }
      }
    }
  }
  
  return 999;  // Magic number
}

// 50+ satır daha ekle...
```
3. Dosyayı kaydet

**Beklenen Sonuç**:
- 🔴 High severity
- 💬 "This code is the real horror story here. And console.log AND magic numbers? Really?"
- 😡 Kırmızı gözler
- 🔄 Maksimum sarsma
- ⚡ Glitch efekti
- 🔴 Kırmızı flaş
- 💀 Clippy çıldıracak!

---

## Senaryo 7: Dev Controls Testi

**Amaç**: Manuel test butonlarını kontrol etme

**Adımlar**:
1. Uygulamayı çalıştır: `npm run dev`
2. Sağ üstteki **[DEV]** butonuna tıkla
3. Sırayla test et:
   - **[LOW] Test** → Hafif tepki
   - **[MED] Test** → Orta tepki + sarsma
   - **[HIGH] Test** → Maksimum tepki + tüm efektler

**Beklenen Sonuç**:
- Her buton farklı severity seviyesini tetiklemeli
- Efektler görünür olmalı
- Mesajlar speech bubble'da görünmeli

---

## Senaryo 8: İnaktivite Testi

**Amaç**: 5 dakika hareketsizlik sonrası uyarı

**Adımlar**:
1. Uygulamayı çalıştır
2. 5 dakika hiçbir dosya kaydetme
3. Bekle...

**Beklenen Sonuç**:
- ⏰ 5 dakika sonra
- 💬 "Still there? Should I call an ambulance for your productivity?"
- 😠 Annoyed emotion
- 🔄 Bounce animasyonu

**Not**: Bu test uzun sürer, sabırlı ol!

---

## Senaryo 9: Response Engine Unit Testleri

**Amaç**: Response engine'in doğru çalıştığını doğrulama

**Adımlar**:
```bash
npm run test:response
```

**Beklenen Sonuç**:
```
=== Response Engine Tests ===

Test Group: severityToEmotion
✓ Low severity maps to idle
✓ Medium severity maps to annoyed
✓ High severity maps to furious

...

=== Test Summary ===
Passed: 20+
Failed: 0
Total: 20+

✓ All tests passed!
```

---

## Senaryo 10: Response Engine Örnekleri

**Amaç**: Response engine kullanım örneklerini görme

**Adımlar**:
```bash
npm run example:response
```

**Beklenen Sonuç**:
Farklı severity ve metadata kombinasyonları için örnek çıktılar göreceksin.

---

## 🎯 Test Checklist

Tüm senaryoları test ettikten sonra:

- [ ] Console log tespiti çalışıyor
- [ ] Magic number tespiti çalışıyor
- [ ] İç içe döngü tespiti çalışıyor
- [ ] Uzun fonksiyon tespiti çalışıyor
- [ ] Temiz kod düşük severity veriyor
- [ ] Kombinasyon testi maksimum tepki veriyor
- [ ] Dev controls çalışıyor
- [ ] İnaktivite uyarısı çalışıyor (opsiyonel)
- [ ] Unit testler geçiyor
- [ ] Örnekler çalışıyor

## 🐛 Sorun Bildirme

Bir test başarısız olursa:
1. Terminal'deki hata mesajlarını kaydet
2. Console'u aç (F12) ve hataları kontrol et
3. Hangi senaryo başarısız oldu not et
4. Beklenen vs gerçek sonucu karşılaştır

## 💡 İpuçları

- **Hızlı test**: Dev Controls kullan
- **Gerçekçi test**: Gerçek kod dosyaları oluştur
- **Otomatik test**: Unit testleri çalıştır
- **Debug**: Terminal ve Console loglarını takip et
- **Performans**: Çok büyük dosyalar oluşturma (1000+ satır)

Mutlu testler! 🧪👻

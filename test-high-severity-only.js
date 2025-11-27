// Test: HIGH SEVERITY ONLY (no MockMode)
// This should trigger ONLY highwrong.wav, NOT scarylaugh.wav

function criticalPerformanceIssue() {
  // 5 seviye nested loop - O(n^5) - KRİTİK PERFORMANS SORUNU!
  for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < 1000; j++) {
      for (let k = 0; k < 1000; k++) {
        for (let l = 0; l < 1000; l++) {
          for (let m = 0; m < 1000; m++) {
            // Bu kod milyarlarca kez çalışacak!
            processData(i, j, k, l, m);
          }
        }
      }
    }
  }
}

function complexBusinessLogic(data) {
  // Çok karmaşık iş mantığı - yüksek complexity
  if (data.status === 'active') {
    if (data.user.role === 'admin') {
      if (data.permissions.includes('write')) {
        if (data.environment === 'production') {
          if (data.security.level > 5) {
            if (data.audit.enabled) {
              // 6 seviye nested if - BAKIM KÂBUSU!
              return processSecureData(data);
            }
          }
        }
      }
    }
  }
  return null;
}

function anotherComplexFunction(input) {
  // Daha fazla karmaşıklık
  let result = 0;
  
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] > 0) {
        if (input[i][j] < 100) {
          result += input[i][j];
        } else {
          result -= input[i][j];
        }
      }
    }
  }
  
  return result;
}

// NOT: Bu dosyada:
// - Saçma değişken isimleri YOK (a, b, lol, wtf)
// - Console.log spam YOK
// - var kullanımı YOK
// - Boş catch YOK
// - if(true) gibi beginner hatalar YOK
// - Meme değişkenler YOK
// - Pointless logic YOK
//
// SADECE kritik teknik sorunlar var:
// - Çok yüksek complexity (15+)
// - Derin nested loops
// - Performans katili kod
//
// Beklenen: SADECE highwrong.wav çalmalı, scarylaugh.wav ÇALMAMALI!

// Test: HIGH SEVERITY + MOCKMODE (both sounds)
// This should trigger BOTH highwrong.wav AND scarylaugh.wav

function terribleCode() {
  // Hem kritik hem utanç verici!
  
  // MOCKMODE: Meme değişkenler
  const wtf = "what the heck";
  const lol = "laughing";
  const yolo = "you only live once";
  
  // HIGH SEVERITY: 5 seviye nested loop
  for (let i = 0; i < 1000; i++) {
    console.log("Level 1");  // MOCKMODE: Console spam başlıyor
    for (let j = 0; j < 1000; j++) {
      console.log("Level 2");
      for (let k = 0; k < 1000; k++) {
        console.log("Level 3");
        for (let l = 0; l < 1000; l++) {
          console.log("Level 4");
          for (let m = 0; m < 1000; m++) {
            console.log("Level 5");  // 10+ console.log!
            
            // MOCKMODE: Beginner mistake
            if (true) {
              const a = i;  // MOCKMODE: Silly variable
              const b = j;  // MOCKMODE: Silly variable
              
              // MOCKMODE: Comparing to itself
              if (a == a) {
                console.log(wtf + lol + yolo);
              }
            }
          }
        }
      }
    }
  }
}

// MOCKMODE: Pointless logic
function alwaysTrue() {
  return true;
}

// MOCKMODE: Old TODO
// TODO: Fix this mess - 2018

// NOT: Bu dosyada HER ŞEY var:
// - Kritik complexity (15+) ✓
// - Derin nested loops ✓
// - Console.log spam (10+) ✓
// - Meme değişkenler (wtf, lol, yolo) ✓
// - Silly değişkenler (a, b) ✓
// - Beginner mistakes (if(true), if(a==a)) ✓
// - Pointless logic (alwaysTrue) ✓
// - Old TODO ✓
//
// Beklenen: highwrong.wav + scarylaugh.wav (İKİSİ DE!)

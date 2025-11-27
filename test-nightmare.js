function totalChaos() {
    // Silly names
    let a = 1;
    let lol = 42;
    let omg = "why";

    // Spam logs
    for (let i = 0; i < 12; i++) {
        console.log("spam", i);
    }

    // Nested IFs
    if (a == 1) {
        if (lol == 42) {
            if (omg == "why") {
                if (true) {
                    console.log("deep");
                }
            }
        }
    }
}

totalChaos();

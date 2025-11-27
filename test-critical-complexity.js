// Test: CRITICAL complexity (should trigger HIGH severity, NOT laugh)

function criticalComplexity() {
  // Deep nested loops - PERFORMANCE NIGHTMARE
  for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < 1000; j++) {
      for (let k = 0; k < 1000; k++) {
        for (let l = 0; l < 1000; l++) {
          // This is O(n^4) - CRITICAL!
          processData(i, j, k, l);
        }
      }
    }
  }

  // Multiple complex conditions
  if (condition1) {
    if (condition2) {
      if (condition3) {
        if (condition4) {
          if (condition5) {
            // Deep nesting - MAINTENANCE HELL
          }
        }
      }
    }
  }
}

// This should trigger HIGH severity (critical) but NOT laugh!

// Test: Pointless logic (MockMode)

// Function that just returns a constant
function alwaysTrue() {
  return true;
}

function alwaysFalse() {
  return false;
}

function meaninglessNumber() {
  return 42;
}

// Explicit return true/false pattern
function isValid(value) {
  if (value > 0) {
    return true;
  }
  return false;
}

// This should trigger MockMode! 🤦

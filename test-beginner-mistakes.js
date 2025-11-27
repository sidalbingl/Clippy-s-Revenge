// Test: Beginner-level mistakes (MockMode)

// Useless condition
if (true) {
  console.log("This always runs");
}

if (false) {
  console.log("This never runs");
}

// Comparing variable to itself
const x = 5;
if (x == x) {
  console.log("Of course it equals itself!");
}

// Unreachable code
function test() {
  return "first";
  return "unreachable";
}

// Old TODO comment
// TODO: Fix this bug - 2019

// This should trigger MockMode! 😈

// Test: Lazy/Rookie Mistakes (should trigger LAUGH, not high severity)

// Using var instead of let/const (old JS)
var oldStyle = "I'm living in 2010";

// Using == instead of ===
if (x == 5) {
  console.log("loose equality!");
}

// Empty catch block (swallowing errors)
try {
  something();
} catch (e) {
}

// This should trigger LAUGH (embarrassing) but NOT high severity!

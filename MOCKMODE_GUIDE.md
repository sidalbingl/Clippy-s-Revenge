# 🎭 MockMode - Complete Guide

## What is MockMode?

MockMode is a **completely separate behavior layer** that triggers when code is **embarrassing, absurd, or typical of a beginner** - NOT for technical severity issues.

When MockMode activates:
- 😈 Plays scary laugh sound
- 💬 Shows mocking insult message
- 🎯 Triggers ONCE per file save
- ⚡ Independent from severity system

---

## 🎯 MockMode Triggers

### 1. Beginner-Level Mistakes 📚

**Patterns**:
- `if (true) { ... }` - Useless condition
- `if (false) { ... }` - Dead code
- `if (x == x)` - Comparing variable to itself
- Unreachable code after return
- Old TODO comments (year < 2024)

**Example**: `test-beginner-mistakes.js`
```javascript
if (true) {
  console.log("Always runs");
}

if (x == x) {
  console.log("Of course!");
}

// TODO: Fix this - 2019
```

**MockMode Message**: "Beginner mistakes detected - did you copy this from Stack Overflow blindly? 📚"

---

### 2. Meme/Joke Variable Names 🤡

**Patterns**:
- `wtf`, `lol`, `omg`, `idk`
- `a1`, `aaaa`, `foofoo`
- `yolo`, `lmao`

**Example**: `test-meme-variables.js`
```javascript
const wtf = "what";
const yolo = "you only live once";
const lmao = "laughing";
const aaaa = "screaming";
```

**MockMode Message**: "Meme variable names detected - is this code or a joke? 🤡"

---

### 3. Pointless Logic 🤦

**Patterns**:
- Functions that just return constants
- Explicit `return true; return false;` pattern
- Functions that do nothing meaningful

**Example**: `test-pointless-logic.js`
```javascript
function alwaysTrue() {
  return true;
}

function isValid(x) {
  if (x > 0) {
    return true;
  }
  return false;
}
```

**MockMode Message**: "Pointless logic detected - why even write this function? 🤦"

---

### 4. Console.log Spam 🔫

**Pattern**: 10+ console.log statements

**Example**: `test-console-spam.js`
```javascript
console.log("1");
console.log("2");
// ... 10+ console.logs
```

**MockMode Message**: "Console.log spam detected - are you debugging with a machine gun? 🔫"

---

### 5. Silly Variable Names 🐱

**Patterns**: `a`, `b`, `c`, `x1`, `temp123`, `foo`, `bar`, `asdf`

**Example**: `test-silly-variables.js`
```javascript
const a = 1;
const b = 2;
const temp123 = "temporary";
```

**MockMode Message**: "Silly variable names detected - did a cat walk on your keyboard? 🐱"

---

### 6. Lazy Mistakes 🥠

**Patterns**:
- Using `var` (old JS)
- Using `==` instead of `===`
- Empty catch blocks

**Example**: `test-lazy-mistakes.js`
```javascript
var oldStyle = "2010";
if (x == 5) {}
try {} catch (e) {}
```

**MockMode Message**: "Rookie mistakes detected - did you learn coding from a fortune cookie? 🥠"

---

### 7. Magic Number Spam 🎰

**Pattern**: 5+ unexplained numbers

**Example**:
```javascript
const timeout = 5000;
const retries = 42;
const buffer = 256;
const limit = 999;
const offset = 128;
```

**MockMode Message**: "Magic number spam - are these lottery numbers or code? 🎰"

---

### 8. Pointless Nesting 🏠

**Pattern**: 3+ nested if statements

**Example**: `test-nested-ifs.js`
```javascript
if (a) {
  if (b) {
    if (c) {
      // Too deep!
    }
  }
}
```

**MockMode Message**: "Pointless nesting detected - building a house of cards? 🏠"

---

## 🔄 How MockMode Works

```
File Saved
    ↓
Code Analyzer runs
    ↓
MockMode Detector checks patterns (BEFORE severity)
    ↓
shouldMock() evaluates
    ↓
If ANY pattern matches:
  - Set shouldLaugh = true
  - Add laughReason
    ↓
MCP sends event with MockMode flag
    ↓
Renderer receives event
    ↓
Plays severity sound (low/medium/high)
    ↓
Then plays laugh sound (scarylaugh.wav)
    ↓
😈 MOCKMODE ACTIVATED!
```

---

## 🎵 Sound Behavior

### MockMode OFF (Normal Code):
```
Save file → Severity sound only
Example: mediumwrong.wav
```

### MockMode ON (Embarrassing Code):
```
Save file → Severity sound + Laugh sound
Example: lowwrong.wav + scarylaugh.wav
```

### Both Critical + MockMode:
```
Save file → High severity + Laugh
Example: highwrong.wav + scarylaugh.wav
```

---

## 🧪 Testing

### Test Each Trigger:

1. **Beginner Mistakes**:
   ```bash
   # Save test-beginner-mistakes.js
   # Should hear: severity sound + laugh
   ```

2. **Meme Variables**:
   ```bash
   # Save test-meme-variables.js
   # Should hear: severity sound + laugh
   ```

3. **Pointless Logic**:
   ```bash
   # Save test-pointless-logic.js
   # Should hear: severity sound + laugh
   ```

4. **Console Spam**:
   ```bash
   # Save test-console-spam.js
   # Should hear: severity sound + laugh
   ```

### Console Output:

```
[Analyzer] 😈 LAUGH DETECTED: Beginner mistakes detected...
[Analyzer] Patterns: console=false, silly=false, lazy=false, magic=false, nesting=false

[MCP] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[MCP] 📊 Severity: LOW
[MCP] 💬 Message: ...
[MCP] 😈 LAUGH MODE: Beginner mistakes detected - did you copy this from Stack Overflow blindly? 📚
[MCP] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Clippy] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Clippy] 📥 Received event:
[Clippy]    Severity: low
[Clippy]    shouldLaugh: true
[Clippy]    laughReason: Beginner mistakes detected...
[Clippy] 😈 ACTIVATING LAUGH MODE!
[Clippy] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[App] Mocking mode - playing scary laugh
[AudioEngine] Playing scary laugh - mocking mode activated
```

---

## 🎯 Key Features

### ✅ Independent from Severity
- MockMode can trigger on ANY severity (low/medium/high)
- Severity system remains unchanged
- No conflicts or overrides

### ✅ Once Per Save
- Laugh plays only once per file save
- Even if multiple patterns match
- Prevents audio spam

### ✅ Clean Integration
- No duplicate code
- Extends existing system
- Minimal changes

### ✅ Extensible
- Easy to add new patterns
- Just add detection function
- Update `shouldMock()` logic

---

## 🔧 Customization

### Add New MockMode Trigger:

1. Add detection function in `laughDetector.ts`:
```typescript
function detectMyPattern(content: string): boolean {
  return content.includes('something embarrassing');
}
```

2. Update `LaughMetadata`:
```typescript
export interface LaughMetadata {
  // ... existing fields
  hasMyPattern: boolean;
}
```

3. Update `analyzeLaughPatterns()`:
```typescript
const hasMyPattern = detectMyPattern(content);

if (hasMyPattern) {
  laughReason = 'My custom mocking message!';
}

return {
  // ... other fields
  hasMyPattern,
};
```

4. Update `shouldMock()`:
```typescript
export function shouldMock(metadata: LaughMetadata): boolean {
  return metadata.hasBeginnerMistakes ||
         // ... other checks
         metadata.hasMyPattern;
}
```

---

## 💡 Philosophy

MockMode should feel like:
- **"Did you really just write that?"**
- **"This is embarrassingly bad"**
- **"Are you trolling me?"**

It's not about technical complexity - it's about **absurdity and rookie mistakes**!

---

## 📊 Summary

- ✅ 8 MockMode triggers (beginner, meme, pointless, etc.)
- ✅ Completely independent from severity
- ✅ Plays laugh AFTER severity sound
- ✅ Once per file save
- ✅ Clean, minimal code changes
- ✅ Easy to extend

Test it now with the provided test files! 😈

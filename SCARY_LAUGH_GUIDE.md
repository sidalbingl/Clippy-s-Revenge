# 🎃 Scary Laugh Activation Guide

## When Does It Play?

The `scarylaugh.wav` plays when **ALL** these conditions are met:

### 1. High Severity Code
- Complexity score > 10, OR
- Console logs + Magic numbers together

### 2. Multiple Issues (2 or more)
At least 2 of these must be true:
- ✓ Has console.log statements
- ✓ Has magic numbers (unexplained constants)
- ✓ Has nested loops (complexity > 5)

## 🧪 Test Cases

### ✅ WILL Trigger Laugh

**Test 1: Nested Loops + Console + Magic Numbers**
```javascript
for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    console.log(i * 42);  // 3 issues!
  }
}
```
- ✓ Nested loops (complexity)
- ✓ console.log
- ✓ Magic number (42)
- 🎃 **LAUGH PLAYS!**

**Test 2: Console Logs + Magic Numbers + High Complexity**
```javascript
function badCode() {
  console.log("start");
  const timeout = 5000;  // magic number
  const retries = 42;    // magic number
  
  for (let i = 0; i < retries; i++) {
    console.log(i);
  }
}
```
- ✓ console.log (multiple)
- ✓ Magic numbers
- 🎃 **LAUGH PLAYS!**

### ❌ Will NOT Trigger Laugh

**Test 1: Only Nested Loops**
```javascript
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    // code
  }
}
```
- ✓ Nested loops
- ❌ Only 1 issue
- 🔇 No laugh (just highwrong.wav)

**Test 2: Only Console Logs**
```javascript
console.log("test");
console.log("test2");
```
- ✓ console.log
- ❌ Only 1 issue
- 🔇 No laugh (just mediumwrong.wav)

## 🎯 How to Test Right Now

1. **Save your test-nightmare.js file** (it has multiple issues)
2. **Listen for**:
   - First: `highwrong.wav` (severity sound)
   - Then: `scarylaugh.wav` (mocking sound) 👻

3. **Check console** for:
   ```
   [Clippy] Mocking mode activated - multiple code smells detected!
   ```

## 🔧 Troubleshooting

### Not hearing the laugh?

1. **Check console logs** - Look for "[Clippy] Mocking mode activated"
2. **Verify file has multiple issues**:
   - Open test-nightmare.js
   - Make sure it has nested loops + console.log + magic numbers
3. **Check browser console** (F12) for audio errors
4. **Verify sound file exists**: `public/sounds/scarylaugh.wav`

### Hearing it too often?

Increase the threshold in `codeQualityAnalyzer.ts`:
```typescript
if (result.insultSeverity === 'high' && issueCount >= 3) { // Change 2 to 3
```

### Want it more often?

Decrease the threshold:
```typescript
if (result.insultSeverity === 'high' && issueCount >= 1) { // Change 2 to 1
```

## 📊 Current Logic

```
File Saved
    ↓
Analyze Code
    ↓
Count Issues:
  - Console logs? +1
  - Magic numbers? +1
  - Nested loops? +1
    ↓
High Severity + 2+ Issues?
    ↓
YES → Add [MOCK] marker
    ↓
Renderer detects [MOCK]
    ↓
🎃 SCARY LAUGH PLAYS!
```

## 💡 Philosophy

The scary laugh should feel like:
- **"I can't believe you wrote this"**
- **"This is hilariously bad"**
- **"You're being mocked by a paperclip"**

It's not just bad code - it's **embarrassingly** bad code with multiple rookie mistakes!

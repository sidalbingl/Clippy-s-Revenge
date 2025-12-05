# Contributing to Evil Clippy

Thanks for your interest in contributing to Evil Clippy! This project was built for Kiroween 2025 and is open for community contributions.

## 🎃 Project Philosophy

Evil Clippy combines:
- **Helpful feedback** with **dark humor**
- **Technical accuracy** with **sarcastic delivery**
- **Horror aesthetics** with **smooth performance**

All contributions should maintain this balance.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/evil-clippy.git
   cd evil-clippy
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment**
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY
   ```
5. **Run development mode**
   ```bash
   npm run dev:renderer  # Terminal 1
   npm start             # Terminal 2
   ```

## 💡 Ways to Contribute

### 1. Add New Insults/Responses
Edit `src/mcp/services/geminiService.ts` → `buildPrompt()` method

**Guidelines:**
- Keep it sarcastic but helpful
- Include technical advice
- Max 2 short sentences
- Match severity level (LOW/MEDIUM/HIGH)

### 2. Create New Visual Effects
Add to `src/renderer/components/` or `src/renderer/hooks/effects/`

**Requirements:**
- 60fps performance
- Horror/dark theme
- Severity-appropriate intensity
- Smooth animations

### 3. Improve AI Analysis
Enhance `src/mcp/analyzers/smartAnalyzer.ts` or `codeQualityAnalyzer.ts`

**Ideas:**
- Better pattern detection
- More accurate severity classification
- Language-specific analysis
- Performance optimizations

### 4. Add Language Support
Extend personality to other languages

**What to add:**
- Localized responses in `geminiService.ts`
- Cultural horror references
- Language detection logic

### 5. Documentation
Improve README, add tutorials, create guides

## 📝 Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Formatting**: Prettier (run `npm run format`)
- **Linting**: ESLint (run `npm run lint`)

## 🧪 Testing

Before submitting:
1. Test with various code files
2. Verify all severity levels work
3. Check visual effects render smoothly
4. Ensure fallback works without API key

## 📋 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow existing patterns
   - Test thoroughly

3. **Commit with dark humor** (optional but encouraged)
   ```bash
   git commit -m "feat: blood now drips in sync with developer tears"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Describe what you changed
   - Explain why it's better
   - Include screenshots/GIFs for UI changes
   - Reference any related issues

## 🎨 Design Guidelines

### Visual Effects
- **Performance First**: 60fps on low-end hardware
- **Horror Theme**: Dark colors, blood, glitch, distortion
- **Purposeful**: Effects should communicate severity
- **Smooth**: Use CSS animations, avoid JavaScript when possible

### Personality
- **Sarcastic**: Mock the code, not the developer
- **Helpful**: Always include technical advice
- **Brief**: Max 2 short sentences
- **Dark Humor**: Halloween/horror references encouraged

### Code Quality
- **Type-Safe**: Use TypeScript properly
- **Modular**: Small, focused functions
- **Documented**: Comments for complex logic
- **Tested**: Verify edge cases

## 🐛 Bug Reports

Found a bug? Open an issue with:
- **Description**: What happened?
- **Expected**: What should happen?
- **Steps**: How to reproduce?
- **Environment**: OS, Node version, etc.
- **Screenshots**: If applicable

## 💬 Feature Requests

Have an idea? Open an issue with:
- **Problem**: What needs improvement?
- **Solution**: Your proposed feature
- **Alternatives**: Other approaches considered
- **Examples**: Similar features elsewhere

## 🎃 Kiro Integration

When contributing, consider using Kiro IDE features:
- **Vibe Coding**: Chat with Kiro for rapid prototyping
- **Specs**: Document complex features before coding
- **Steering**: Maintain Evil Clippy's personality
- **Hooks**: Automate testing and workflows

## 📜 Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on the code, not the person
- Keep it fun (we're building a sarcastic AI after all)

## 🙏 Recognition

Contributors will be:
- Listed in README
- Credited in release notes
- Thanked profusely (with dark humor)

## 📞 Questions?

- Open an issue for discussion
- Check existing issues first
- Be patient, maintainers are volunteers

---

**Thanks for contributing to Evil Clippy! May your code be roast-free. 🎃👻**

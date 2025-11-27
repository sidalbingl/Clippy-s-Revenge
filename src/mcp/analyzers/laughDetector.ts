/**
 * Laugh Detector - Detects EMBARRASSING and FUNNY code patterns
 * Completely separate from critical technical issues
 */

export interface LaughMetadata {
  hasConsoleSpam: boolean;
  hasSillyVariables: boolean;
  hasPointlessNesting: boolean;
  hasLazyMistakes: boolean;
  hasMagicNumberSpam: boolean;
  hasBeginnerMistakes: boolean;
  hasMemeVariables: boolean;
  hasPointlessLogic: boolean;
  laughReason?: string;
}

/**
 * Detect console.log spam (10+ instances)
 * This is LAZY debugging, not a critical issue
 */
function detectConsoleSpam(content: string): boolean {
  const consoleMatches = content.match(/console\.(log|warn|error|debug|info)/g);
  return consoleMatches ? consoleMatches.length >= 10 : false;
}

/**
 * Detect silly or meaningless variable names
 * EMBARRASSING rookie mistakes
 */
function detectSillyVariables(content: string): boolean {
  const sillyNames = [
    /\b[abc]\b/g,           // Single letters a, b, c
    /\bx1\b/g,              // x1
    /\btemp\d+\b/g,         // temp123, temp1, etc.
    /\blol\b/gi,            // lol (case insensitive)
    /\bomg\b/gi,            // omg
    /\bidk\b/gi,            // idk
    /\bzzz\b/gi,            // zzz
    /\bfoo\b/gi,            // foo
    /\bbar\b/gi,            // bar
    /\basdf\b/gi,           // asdf (keyboard mashing)
    /\btest\d+\b/gi,        // test1, test2
  ];

  return sillyNames.some(pattern => pattern.test(content));
}

/**
 * Detect meme or joke variable names
 * MOCKING-worthy names
 */
function detectMemeVariables(content: string): boolean {
  const memeNames = [
    /\bwtf\b/gi,            // wtf
    /\ba1\b/g,              // a1
    /\baaaa+\b/gi,          // aaaa, aaaaa
    /\bfoofoo\b/gi,         // foofoo
    /\byolo\b/gi,           // yolo
    /\blmao\b/gi,           // lmao
  ];

  return memeNames.some(pattern => pattern.test(content));
}

/**
 * Detect beginner-level mistakes
 * EMBARRASSING rookie errors
 */
function detectBeginnerMistakes(content: string): boolean {
  // if (true) or if (false)
  const hasUselessCondition = /if\s*\(\s*(true|false)\s*\)/.test(content);
  
  // Comparing variable to itself: if (x == x)
  const hasSelfComparison = /if\s*\(\s*(\w+)\s*[=!]=\s*\1\s*\)/.test(content);
  
  // Unreachable code after return
  const hasUnreachableCode = /return\s+[^;]+;\s*\n\s*return/.test(content);
  
  // Old TODO comments (contains "TODO" with year < 2024)
  const hasOldTodo = /TODO.*20(1\d|2[0-3])/.test(content);
  
  return hasUselessCondition || hasSelfComparison || hasUnreachableCode || hasOldTodo;
}

/**
 * Detect pointless logic patterns
 * MOCKING-worthy code structure
 */
function detectPointlessLogic(content: string): boolean {
  // Functions that just return constants
  const hasConstantReturn = /function\s+\w+\s*\([^)]*\)\s*{\s*return\s+(true|false|null|undefined|\d+)\s*;\s*}/.test(content);
  
  // Explicit return true/false pattern
  const hasExplicitBoolReturn = /if\s*\([^)]+\)\s*{\s*return\s+true\s*;\s*}\s*return\s+false/.test(content);
  
  return hasConstantReturn || hasExplicitBoolReturn;
}

/**
 * Detect pointless if nesting (3+ levels)
 * This is LAZY logic, not complex algorithms
 */
function detectPointlessNesting(content: string): boolean {
  // Look for simple nested ifs (not complex business logic)
  const lines = content.split('\n');
  let maxNestLevel = 0;
  let currentNestLevel = 0;

  for (const line of lines) {
    if (/\bif\s*\(/.test(line)) {
      currentNestLevel++;
      maxNestLevel = Math.max(maxNestLevel, currentNestLevel);
    }
    
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    currentNestLevel += openBraces - closeBraces;
    currentNestLevel = Math.max(0, currentNestLevel);
  }

  return maxNestLevel >= 3;
}

/**
 * Detect lazy/rookie mistakes
 * EMBARRASSING old-school or careless coding
 */
function detectLazyMistakes(content: string): boolean {
  // Check for var usage (old JS - should use let/const)
  const hasVar = /\bvar\b/.test(content);
  
  // Check for == instead of === (loose equality)
  const hasLooseEquality = /[^=!]==[^=]/.test(content);
  
  // Check for empty catch blocks (swallowing errors)
  const hasEmptyCatch = /catch\s*\([^)]*\)\s*{\s*}/.test(content);
  
  return hasVar || hasLooseEquality || hasEmptyCatch;
}

/**
 * Detect excessive magic numbers (5+ unexplained numbers)
 * LAZY - should use constants
 */
function detectMagicNumberSpam(content: string): boolean {
  const magicNumberPattern = /(?<![a-zA-Z0-9_])(?!0|1|-1|100)(?:\d{2,}|\d+\.\d+)(?![a-zA-Z0-9_])/g;
  const matches = content.match(magicNumberPattern);
  return matches ? matches.length >= 5 : false;
}

/**
 * Analyze code for EMBARRASSING laugh-worthy patterns (MockMode)
 * These are FUNNY/ABSURD mistakes, not critical technical issues
 */
export function analyzeLaughPatterns(content: string): LaughMetadata {
  const hasConsoleSpam = detectConsoleSpam(content);
  const hasSillyVariables = detectSillyVariables(content);
  const hasPointlessNesting = detectPointlessNesting(content);
  const hasLazyMistakes = detectLazyMistakes(content);
  const hasMagicNumberSpam = detectMagicNumberSpam(content);
  const hasBeginnerMistakes = detectBeginnerMistakes(content);
  const hasMemeVariables = detectMemeVariables(content);
  const hasPointlessLogic = detectPointlessLogic(content);

  let laughReason: string | undefined;

  // Priority order for laugh reasons (most embarrassing first)
  if (hasBeginnerMistakes) {
    laughReason = 'Beginner mistakes detected - did you copy this from Stack Overflow blindly? 📚';
  } else if (hasMemeVariables) {
    laughReason = 'Meme variable names detected - is this code or a joke? 🤡';
  } else if (hasPointlessLogic) {
    laughReason = 'Pointless logic detected - why even write this function? 🤦';
  } else if (hasConsoleSpam) {
    laughReason = 'Console.log spam detected - are you debugging with a machine gun? 🔫';
  } else if (hasSillyVariables) {
    laughReason = 'Silly variable names detected - did a cat walk on your keyboard? 🐱';
  } else if (hasLazyMistakes) {
    laughReason = 'Rookie mistakes detected - did you learn coding from a fortune cookie? 🥠';
  } else if (hasMagicNumberSpam) {
    laughReason = 'Magic number spam - are these lottery numbers or code? 🎰';
  } else if (hasPointlessNesting) {
    laughReason = 'Pointless nesting detected - building a house of cards? 🏠';
  }

  return {
    hasConsoleSpam,
    hasSillyVariables,
    hasPointlessNesting,
    hasLazyMistakes,
    hasMagicNumberSpam,
    hasBeginnerMistakes,
    hasMemeVariables,
    hasPointlessLogic,
    laughReason,
  };
}

/**
 * Determine if MockMode should be triggered
 * Returns true if ANY EMBARRASSING/ABSURD pattern is detected
 * 
 * IMPORTANT: MockMode is for FUNNY/ABSURD mistakes, not technical severity!
 * - Beginner mistakes = embarrassing rookie errors
 * - Meme variables = joke code
 * - Pointless logic = why does this exist?
 * - Console spam = lazy debugging
 * - Silly names = unprofessional
 * - Lazy mistakes = rookie errors
 * - Magic numbers = no documentation
 * - Pointless nesting = bad logic
 */
export function shouldLaugh(metadata: LaughMetadata): boolean {
  return metadata.hasBeginnerMistakes ||
         metadata.hasMemeVariables ||
         metadata.hasPointlessLogic ||
         metadata.hasConsoleSpam || 
         metadata.hasSillyVariables || 
         metadata.hasPointlessNesting ||
         metadata.hasLazyMistakes ||
         metadata.hasMagicNumberSpam;
}

/**
 * Alias for shouldLaugh - more semantic name for MockMode
 */
export function shouldMock(metadata: LaughMetadata): boolean {
  return shouldLaugh(metadata);
}

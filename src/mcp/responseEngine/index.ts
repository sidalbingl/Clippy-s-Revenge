import {
  LOW_SEVERITY_INSULTS,
  MEDIUM_SEVERITY_INSULTS,
  HIGH_SEVERITY_INSULTS,
  INACTIVITY_INSULTS,
  InsultCategory,
} from './insults';

export type Severity = 'low' | 'medium' | 'high';
export type Emotion = 'idle' | 'annoyed' | 'furious';

export interface CodeMetadata {
  containsConsoleLogs?: boolean;
  containsMagicNumbers?: boolean;
  hasHighComplexity?: boolean;
  hasNestedLoops?: boolean;
  isLongFunction?: boolean;
}

export interface ResponseOutput {
  message: string;
  emotion: Emotion;
}

/**
 * Select a random item from an array
 */
export function selectRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Map severity to emotion according to persona spec
 */
export function severityToEmotion(severity: Severity): Emotion {
  const emotionMap: Record<Severity, Emotion> = {
    low: 'idle',
    medium: 'annoyed',
    high: 'furious',
  };
  return emotionMap[severity];
}

/**
 * Get the appropriate insult category based on severity
 */
function getInsultCategory(severity: Severity): InsultCategory {
  switch (severity) {
    case 'high':
      return HIGH_SEVERITY_INSULTS;
    case 'medium':
      return MEDIUM_SEVERITY_INSULTS;
    case 'low':
    default:
      return LOW_SEVERITY_INSULTS;
  }
}

/**
 * Select the most appropriate insult based on code metadata
 */
function selectInsultByMetadata(
  category: InsultCategory,
  metadata: CodeMetadata
): string {
  // Prioritize specific issues over general insults
  if (metadata.hasNestedLoops && category.nested.length > 0) {
    return selectRandom(category.nested);
  }
  
  if (metadata.isLongFunction && category.longFunction.length > 0) {
    return selectRandom(category.longFunction);
  }
  
  if (metadata.hasHighComplexity && category.complexity.length > 0) {
    return selectRandom(category.complexity);
  }
  
  if (metadata.containsConsoleLogs && category.consoleLogs.length > 0) {
    return selectRandom(category.consoleLogs);
  }
  
  if (metadata.containsMagicNumbers && category.magicNumbers.length > 0) {
    return selectRandom(category.magicNumbers);
  }
  
  // Fallback to general insults
  return selectRandom(category.general);
}

/**
 * Generate a response based on severity and code metadata
 * This is the main entry point for the response engine
 * 
 * @param severity - The severity level of the code issue
 * @param metadata - Optional metadata about the code quality issues
 * @returns ResponseOutput with message and emotion
 */
export function generateResponse(
  severity: Severity,
  metadata: CodeMetadata = {}
): ResponseOutput {
  const category = getInsultCategory(severity);
  const message = selectInsultByMetadata(category, metadata);
  const emotion = severityToEmotion(severity);
  
  return {
    message,
    emotion,
  };
}

/**
 * Generate an inactivity warning message
 */
export function generateInactivityResponse(): ResponseOutput {
  return {
    message: selectRandom(INACTIVITY_INSULTS),
    emotion: 'annoyed',
  };
}

/**
 * Combine multiple issues into a single message
 * Useful when multiple code quality issues are detected
 */
export function generateCombinedResponse(
  severity: Severity,
  metadata: CodeMetadata
): ResponseOutput {
  const category = getInsultCategory(severity);
  let message = selectInsultByMetadata(category, metadata);
  
  // Add additional commentary for multiple issues
  const issues: string[] = [];
  
  if (metadata.containsConsoleLogs) {
    issues.push("console.log");
  }
  if (metadata.containsMagicNumbers) {
    issues.push("magic numbers");
  }
  if (metadata.hasNestedLoops) {
    issues.push("nested loops");
  }
  
  // If multiple issues, add a snarky suffix
  if (issues.length > 1) {
    const suffix = ` And ${issues.slice(0, 2).join(" AND ")}? Really?`;
    message += suffix;
  } else if (issues.length === 1) {
    const suffixes = [
      " Also, nice job with the ",
      " Plus, I see you've added ",
      " And let's not forget the ",
    ];
    message += selectRandom(suffixes) + issues[0] + ".";
  }
  
  return {
    message,
    emotion: severityToEmotion(severity),
  };
}

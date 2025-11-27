import * as fs from 'fs';
import { analyzeLaughPatterns, shouldLaugh, LaughMetadata } from './laughDetector';

export interface CodeQualityResult {
  lines: number;
  complexityScore: number;
  containsConsoleLogs: boolean;
  containsMagicNumbers: boolean;
  insultSeverity: 'low' | 'medium' | 'high';
  laughMetadata?: LaughMetadata;
  shouldTriggerLaugh?: boolean;
}

export async function analyzeCodeQuality(filePath: string): Promise<CodeQualityResult> {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const lines = content.split('\n').length;
    
    // Check for console.logs
    const containsConsoleLogs = /console\.(log|warn|error|debug|info)/g.test(content);
    
    // Check for magic numbers (numbers that aren't 0, 1, -1, or 100)
    const magicNumberPattern = /(?<![a-zA-Z0-9_])(?!0|1|-1|100)(?:\d{2,}|\d+\.\d+)(?![a-zA-Z0-9_])/g;
    const containsMagicNumbers = magicNumberPattern.test(content);
    
    // Calculate complexity score
    let complexityScore = 0;
    
    // Nested loops/conditionals
    const nestedPatterns = [
      /for\s*\([^)]*\)\s*{[^}]*for\s*\(/g,
      /while\s*\([^)]*\)\s*{[^}]*while\s*\(/g,
      /if\s*\([^)]*\)\s*{[^}]*if\s*\(/g,
    ];
    
    nestedPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) complexityScore += matches.length * 3;
    });
    
    // Long functions (more than 50 lines)
    const functionPattern = /(?:function|=>|\bdef\b)[^{]*{/g;
    const functions = content.match(functionPattern);
    if (functions && lines > 50) {
      complexityScore += Math.floor(lines / 50) * 2;
    }
    
    // Multiple return statements
    const returnCount = (content.match(/\breturn\b/g) || []).length;
    if (returnCount > 3) {
      complexityScore += returnCount - 3;
    }
    
    // Determine severity - CRITICAL TECHNICAL ISSUES ONLY
    // High severity = dangerous, performance-killing, security risks
    let insultSeverity: 'low' | 'medium' | 'high' = 'low';
    
    // HIGH: Critical technical problems
    // - Very high complexity (15+) = performance nightmare
    // - Deep nesting (complexity > 10) = maintenance hell
    if (complexityScore >= 15) {
      insultSeverity = 'high';
    } 
    // MEDIUM: Moderate technical issues
    // - Moderate complexity (8-14)
    // - Some code smells
    else if (complexityScore >= 8 || (containsConsoleLogs && containsMagicNumbers)) {
      insultSeverity = 'medium';
    }
    // LOW: Minor issues
    else if (complexityScore > 3 || containsConsoleLogs || containsMagicNumbers) {
      insultSeverity = 'low';
    }
    
    // Analyze laugh patterns (INDEPENDENT from severity)
    const laughMetadata = analyzeLaughPatterns(content);
    const shouldTriggerLaugh = shouldLaugh(laughMetadata);
    
    // Debug logging
    if (shouldTriggerLaugh) {
      console.log(`[Analyzer] 😈 LAUGH DETECTED: ${laughMetadata.laughReason}`);
      console.log(`[Analyzer] Patterns: console=${laughMetadata.hasConsoleSpam}, silly=${laughMetadata.hasSillyVariables}, lazy=${laughMetadata.hasLazyMistakes}, magic=${laughMetadata.hasMagicNumberSpam}, nesting=${laughMetadata.hasPointlessNesting}`);
    }
    
    console.log(`[Analyzer] Severity: ${insultSeverity}, Laugh: ${shouldTriggerLaugh}, Reason: ${laughMetadata.laughReason || 'none'}`);
    
    return {
      lines,
      complexityScore,
      containsConsoleLogs,
      containsMagicNumbers,
      insultSeverity,
      laughMetadata,
      shouldTriggerLaugh,
    };
  } catch (error) {
    console.error('Error analyzing file:', error);
    return {
      lines: 0,
      complexityScore: 0,
      containsConsoleLogs: false,
      containsMagicNumbers: false,
      insultSeverity: 'low',
    };
  }
}

export function generateInsultMessage(result: CodeQualityResult, filePath: string): string {
  // Import response engine dynamically to avoid circular dependencies
  const { generateCombinedResponse } = require('../responseEngine');
  
  // Map CodeQualityResult to metadata format
  const metadata = {
    containsConsoleLogs: result.containsConsoleLogs,
    containsMagicNumbers: result.containsMagicNumbers,
    hasHighComplexity: result.complexityScore > 10,
    hasNestedLoops: result.complexityScore > 5,
    isLongFunction: result.lines > 50,
  };
  
  const response = generateCombinedResponse(result.insultSeverity, metadata);
  
  // Add marker for mocking mode if multiple issues detected
  const issueCount = [
    result.containsConsoleLogs,
    result.containsMagicNumbers,
    result.complexityScore > 5,
  ].filter(Boolean).length;
  
  if (result.insultSeverity === 'high' && issueCount >= 2) {
    // Add special marker that triggers laugh
    return response.message + ' [MOCK]';
  }
  
  return response.message;
}

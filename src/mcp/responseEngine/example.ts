/**
 * Example usage of the Response Engine
 * This file demonstrates how to use the response engine in your code
 */

import {
  generateResponse,
  generateInactivityResponse,
  generateCombinedResponse,
  severityToEmotion,
} from './index';

// Example 1: Basic response generation
console.log('=== Example 1: Basic Response ===');
const basicResponse = generateResponse('medium');
console.log(basicResponse);
// Output: { message: "Are you trying to summon undefined behavior?", emotion: "annoyed" }

// Example 2: Response with metadata
console.log('\n=== Example 2: Response with Console Logs ===');
const consoleLogResponse = generateResponse('high', {
  containsConsoleLogs: true,
});
console.log(consoleLogResponse);
// Output: { message: "console.log in production code? Are you serious right now?", emotion: "furious" }

// Example 3: Response with multiple issues
console.log('\n=== Example 3: Multiple Issues ===');
const multipleIssuesResponse = generateCombinedResponse('high', {
  containsConsoleLogs: true,
  containsMagicNumbers: true,
  hasNestedLoops: true,
});
console.log(multipleIssuesResponse);
// Output: { message: "Nesting this deep should require a permit. And console.log AND magic numbers? Really?", emotion: "furious" }

// Example 4: Inactivity response
console.log('\n=== Example 4: Inactivity ===');
const inactivityResponse = generateInactivityResponse();
console.log(inactivityResponse);
// Output: { message: "Still there? Should I call an ambulance for your productivity?", emotion: "annoyed" }

// Example 5: Severity to emotion mapping
console.log('\n=== Example 5: Severity Mapping ===');
console.log('low ->', severityToEmotion('low'));       // idle
console.log('medium ->', severityToEmotion('medium')); // annoyed
console.log('high ->', severityToEmotion('high'));     // furious

// Example 6: All metadata flags
console.log('\n=== Example 6: All Metadata ===');
const allMetadataResponse = generateResponse('high', {
  containsConsoleLogs: true,
  containsMagicNumbers: true,
  hasHighComplexity: true,
  hasNestedLoops: true,
  isLongFunction: true,
});
console.log(allMetadataResponse);
// Will prioritize nested loops insult

// Example 7: Integration with code analyzer
console.log('\n=== Example 7: Integration Pattern ===');
interface AnalysisResult {
  severity: 'low' | 'medium' | 'high';
  lines: number;
  complexityScore: number;
  containsConsoleLogs: boolean;
  containsMagicNumbers: boolean;
}

function processAnalysisResult(result: AnalysisResult) {
  const metadata = {
    containsConsoleLogs: result.containsConsoleLogs,
    containsMagicNumbers: result.containsMagicNumbers,
    hasHighComplexity: result.complexityScore > 10,
    hasNestedLoops: result.complexityScore > 5,
    isLongFunction: result.lines > 50,
  };

  return generateCombinedResponse(result.severity, metadata);
}

const mockAnalysis: AnalysisResult = {
  severity: 'medium',
  lines: 75,
  complexityScore: 8,
  containsConsoleLogs: true,
  containsMagicNumbers: false,
};

const integratedResponse = processAnalysisResult(mockAnalysis);
console.log(integratedResponse);

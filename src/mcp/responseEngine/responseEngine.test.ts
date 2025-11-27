/**
 * Simple test runner for the response engine
 * Run with: node -r ts-node/register src/mcp/responseEngine/responseEngine.test.ts
 * Or compile and run: tsc && node dist/mcp/responseEngine/responseEngine.test.js
 */

import {
    generateResponse,
    generateInactivityResponse,
    generateCombinedResponse,
    selectRandom,
    severityToEmotion,
} from './index';

// Simple test utilities
let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, message: string) {
    if (condition) {
        console.log(`✓ ${message}`);
        testsPassed++;
    } else {
        console.error(`✗ ${message}`);
        testsFailed++;
    }
}

function assertEqual<T>(actual: T, expected: T, message: string) {
    if (actual === expected) {
        console.log(`✓ ${message}`);
        testsPassed++;
    } else {
        console.error(`✗ ${message}`);
        console.error(`  Expected: ${expected}`);
        console.error(`  Actual: ${actual}`);
        testsFailed++;
    }
}

function assertContains(text: string, substring: string, message: string) {
    if (text.toLowerCase().includes(substring.toLowerCase())) {
        console.log(`✓ ${message}`);
        testsPassed++;
    } else {
        console.error(`✗ ${message}`);
        console.error(`  Text does not contain: ${substring}`);
        testsFailed++;
    }
}

// Run tests
console.log('=== Response Engine Tests ===\n');

// Test 1: severityToEmotion
console.log('Test Group: severityToEmotion');
assertEqual(severityToEmotion('low'), 'idle', 'Low severity maps to idle');
assertEqual(severityToEmotion('medium'), 'annoyed', 'Medium severity maps to annoyed');
assertEqual(severityToEmotion('high'), 'furious', 'High severity maps to furious');

// Test 2: selectRandom
console.log('\nTest Group: selectRandom');
const singleItem = selectRandom(['only']);
assertEqual(singleItem, 'only', 'Handles single item array');

const multipleItems = selectRandom(['a', 'b', 'c']);
assert(['a', 'b', 'c'].includes(multipleItems), 'Returns item from array');

// Test 3: generateResponse
console.log('\nTest Group: generateResponse');
const lowResponse = generateResponse('low');
assert(lowResponse.message.length > 0, 'Low severity returns non-empty message');
assertEqual(lowResponse.emotion, 'idle', 'Low severity returns idle emotion');

const mediumResponse = generateResponse('medium');
assert(mediumResponse.message.length > 0, 'Medium severity returns non-empty message');
assertEqual(mediumResponse.emotion, 'annoyed', 'Medium severity returns annoyed emotion');

const highResponse = generateResponse('high');
assert(highResponse.message.length > 0, 'High severity returns non-empty message');
assertEqual(highResponse.emotion, 'furious', 'High severity returns furious emotion');

// Test 4: generateResponse with metadata
console.log('\nTest Group: generateResponse with metadata');
const consoleLogResponse = generateResponse('medium', { containsConsoleLogs: true });
assertContains(consoleLogResponse.message, 'console', 'Console log metadata triggers console-related insult');

const magicNumberResponse = generateResponse('medium', { containsMagicNumbers: true });
assert(
    consoleLogResponse.message.toLowerCase().includes('magic') ||
    consoleLogResponse.message.toLowerCase().includes('number'),
    'Magic number metadata triggers number-related insult'
);

const nestedResponse = generateResponse('high', { hasNestedLoops: true });
assert(
    nestedResponse.message.toLowerCase().includes('nest') ||
    nestedResponse.message.toLowerCase().includes('loop') ||
    nestedResponse.message.toLowerCase().includes('indent'),
    'Nested loop metadata triggers nesting-related insult'
);

// Test 5: generateInactivityResponse
console.log('\nTest Group: generateInactivityResponse');
const inactivityResponse = generateInactivityResponse();
assert(inactivityResponse.message.length > 0, 'Inactivity returns non-empty message');
assertEqual(inactivityResponse.emotion, 'annoyed', 'Inactivity returns annoyed emotion');

// Test 6: generateCombinedResponse
console.log('\nTest Group: generateCombinedResponse');
const combinedResponse = generateCombinedResponse('high', {
    containsConsoleLogs: true,
    containsMagicNumbers: true,
});
assert(combinedResponse.message.length > 0, 'Combined response returns non-empty message');
assert(
    combinedResponse.message.includes('AND') || combinedResponse.message.includes('and'),
    'Combined response mentions multiple issues'
);

// Test 7: Edge cases
console.log('\nTest Group: Edge cases');
const emptyMetadata = generateResponse('low', {});
assert(emptyMetadata.message.length > 0, 'Handles empty metadata');
assertEqual(emptyMetadata.emotion, 'idle', 'Empty metadata returns correct emotion');

const allFalseMetadata = generateResponse('medium', {
    containsConsoleLogs: false,
    containsMagicNumbers: false,
    hasHighComplexity: false,
    hasNestedLoops: false,
    isLongFunction: false,
});
assert(allFalseMetadata.message.length > 0, 'Handles all false metadata');

const allTrueMetadata = generateResponse('high', {
    containsConsoleLogs: true,
    containsMagicNumbers: true,
    hasHighComplexity: true,
    hasNestedLoops: true,
    isLongFunction: true,
});
assert(allTrueMetadata.message.length > 0, 'Handles all true metadata');

// Test 8: Response structure
console.log('\nTest Group: Response structure');
const structureTest = generateResponse('medium');
assert('message' in structureTest, 'Response has message property');
assert('emotion' in structureTest, 'Response has emotion property');
assert(typeof structureTest.message === 'string', 'Message is a string');
assert(typeof structureTest.emotion === 'string', 'Emotion is a string');

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);
console.log(`Total: ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
    console.log('\n✓ All tests passed!');
    process.exit(0);
} else {
    console.log(`\n✗ ${testsFailed} test(s) failed`);
    process.exit(1);
}

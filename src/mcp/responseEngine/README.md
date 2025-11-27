# Response Engine

Non-AI deterministic response system for Evil Clippy.

## Overview

The response engine generates sarcastic, developer-focused insults based on code quality analysis. It uses predefined insult lists organized by severity and issue type.

## Architecture

```
responseEngine/
├── index.ts           # Main engine logic
├── insults.ts         # Predefined insult collections
├── responseEngine.test.ts  # Unit tests
└── README.md          # This file
```

## Usage

### Basic Response Generation

```typescript
import { generateResponse } from './responseEngine';

const response = generateResponse('high', {
  containsConsoleLogs: true,
  hasNestedLoops: true,
});

console.log(response);
// {
//   message: "Nested loops? Bold move. Wrong, but bold.",
//   emotion: "furious"
// }
```

### Combined Response (Multiple Issues)

```typescript
import { generateCombinedResponse } from './responseEngine';

const response = generateCombinedResponse('medium', {
  containsConsoleLogs: true,
  containsMagicNumbers: true,
});

console.log(response);
// {
//   message: "Are you trying to summon undefined behavior? And console.log AND magic numbers? Really?",
//   emotion: "annoyed"
// }
```

### Inactivity Response

```typescript
import { generateInactivityResponse } from './responseEngine';

const response = generateInactivityResponse();
// {
//   message: "Still there? Should I call an ambulance for your productivity?",
//   emotion: "annoyed"
// }
```

## API

### `generateResponse(severity, metadata?)`

Main entry point for generating responses.

**Parameters:**
- `severity`: `'low' | 'medium' | 'high'`
- `metadata`: Optional `CodeMetadata` object

**Returns:** `ResponseOutput` with `message` and `emotion`

### `generateCombinedResponse(severity, metadata)`

Generates response with additional commentary for multiple issues.

**Parameters:**
- `severity`: `'low' | 'medium' | 'high'`
- `metadata`: `CodeMetadata` object

**Returns:** `ResponseOutput` with enhanced message

### `generateInactivityResponse()`

Generates a response for user inactivity.

**Returns:** `ResponseOutput` with inactivity message

### `severityToEmotion(severity)`

Maps severity to emotion.

**Parameters:**
- `severity`: `'low' | 'medium' | 'high'`

**Returns:** `'idle' | 'annoyed' | 'furious'`

### `selectRandom(array)`

Utility function to select random item from array.

**Parameters:**
- `array`: Array of any type

**Returns:** Random item from array

## Insult Categories

Each severity level has insults organized by issue type:

- `general`: Generic insults
- `consoleLogs`: Console.log specific
- `magicNumbers`: Magic number specific
- `complexity`: High complexity specific
- `nested`: Nested loop specific
- `longFunction`: Long function specific

## Metadata Priority

When multiple metadata flags are set, insults are selected in this priority order:

1. Nested loops
2. Long functions
3. High complexity
4. Console logs
5. Magic numbers
6. General (fallback)

## Extending the System

### Adding New Insults

Edit `insults.ts` and add to the appropriate category:

```typescript
export const MEDIUM_SEVERITY_INSULTS: InsultCategory = {
  general: [
    "Your new insult here",
    // ... existing insults
  ],
  // ... other categories
};
```

### Adding New Metadata Types

1. Update `CodeMetadata` interface in `index.ts`
2. Add new insult category to `InsultCategory` in `insults.ts`
3. Update `selectInsultByMetadata` logic in `index.ts`

### Future AI Integration

To add AI-generated responses:

1. Create `aiResponseEngine.ts`
2. Implement same interface as `generateResponse`
3. Add feature flag to switch between deterministic and AI modes
4. Use deterministic as fallback when AI fails

```typescript
// Future implementation
export async function generateAIResponse(
  severity: Severity,
  metadata: CodeMetadata
): Promise<ResponseOutput> {
  try {
    // Call LLM API
    return await callLLM(severity, metadata);
  } catch (error) {
    // Fallback to deterministic
    return generateResponse(severity, metadata);
  }
}
```

## Testing

Run unit tests:

```bash
npm test src/mcp/responseEngine/responseEngine.test.ts
```

All functions are pure and deterministic (given same random seed), making them easy to test.

## Performance

- **Fast**: No API calls, pure JavaScript
- **Deterministic**: Same inputs = same outputs (with same random seed)
- **Zero latency**: Instant response generation
- **No dependencies**: Uses only built-in JavaScript features

## Tone Guidelines

All insults follow these rules:
- Sarcastic and condescending
- Developer-focused humor
- Slightly threatening but never abusive
- Passive-aggressive
- Educational (points out actual issues)

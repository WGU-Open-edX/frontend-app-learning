# XBlock Completion System

This completion system provides automatic and manual completion tracking for React-based xblock components, matching the behavior of the Django edX platform.

## Features

- **Automatic completion on view** (for HTML blocks)
- **Manual completion tracking** (for videos, problems)
- **Configurable completion modes**
- **Visual completion indicators**
- **Reusable across all xblock types**
- **Error handling and retry logic**

## Basic Usage

### 1. Import the Completion Hook

```tsx
import { useXblockCompletion, CompletionConfigs } from './useXblockCompletion';
```

### 2. Add to Your XBlock Component

```tsx
const MyXblock = ({ blockId, courseId, unitId }: XblockProps) => {
  // Use predefined configuration or create custom
  const completion = useXblockCompletion(blockId, courseId, unitId, CompletionConfigs.html);
  
  return (
    <div 
      className="xblock-student_view"
      data-completion-enabled={completion ? "true" : "false"}
    >
      {/* Your xblock content */}
      {completion.isComplete && <div>✓ Complete</div>}
    </div>
  );
};
```

## Predefined Configurations

### HTML Blocks (Auto-complete on view)
```tsx
const completion = useXblockCompletion(blockId, courseId, unitId, CompletionConfigs.html);
// Completes after 2 seconds of viewing, minimum 1 second view time
```

### Video Blocks (Manual completion)
```tsx
const completion = useXblockCompletion(blockId, courseId, unitId, CompletionConfigs.video);

// Mark complete when video reaches 80% or ends
const handleTimeUpdate = () => {
  if (video.currentTime / video.duration >= 0.8) {
    completion.markComplete(1.0);
  }
};
```

### Problem Blocks (Manual completion)
```tsx
const completion = useXblockCompletion(blockId, courseId, unitId, CompletionConfigs.problem);

// Mark complete when problem is submitted successfully
const handleSubmit = async () => {
  const success = await submitProblem();
  if (success) {
    completion.markComplete(1.0);
  }
};
```

## Custom Configurations

```tsx
// Custom completion config
const customConfig = {
  mode: 'view' as const,     // 'view' or 'manual'
  delay: 5000,               // Wait 5 seconds before auto-complete
  minViewTime: 3000,         // Require 3 seconds of viewing
  enabled: true              // Enable/disable completion tracking
};

const completion = useXblockCompletion(blockId, courseId, unitId, customConfig);
```

## Advanced Usage

### Conditional Completion

```tsx
const MyXblock = ({ blockId, courseId, unitId, completionEnabled }: XblockProps) => {
  const completion = useXblockCompletion(blockId, courseId, unitId, {
    ...CompletionConfigs.html,
    enabled: completionEnabled  // Conditionally enable
  });
  
  return (
    <div>
      {/* Content */}
      {completion.isSubmitting && <div>Saving progress...</div>}
      {completion.error && <div>Error: {completion.error}</div>}
    </div>
  );
};
```

### Progress-Based Completion

```tsx
const InteractiveXblock = ({ blockId, courseId, unitId }: XblockProps) => {
  const completion = useXblockCompletion(blockId, courseId, unitId, CompletionConfigs.manual);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Mark complete when progress reaches 100%
    if (progress >= 100 && !completion.isComplete) {
      completion.markComplete(1.0);
    }
  }, [progress, completion]);
  
  return (
    <div>
      <div>Progress: {progress}%</div>
      <button onClick={() => setProgress(p => p + 10)}>
        Make Progress
      </button>
    </div>
  );
};
```

## API Reference

### `useXblockCompletion(blockId, courseId, unitId, config)`

**Returns**: `CompletionState`

```typescript
interface CompletionState {
  isComplete: boolean;        // Whether block is marked complete
  isSubmitting: boolean;      // Whether completion is being submitted
  error: string | null;       // Any completion error
  markComplete: (value?: number) => Promise<void>; // Manual completion function
}
```

### Configuration Options

```typescript
interface CompletionConfig {
  mode: 'view' | 'manual';    // Completion mode
  delay?: number;             // Auto-completion delay (ms)
  minViewTime?: number;       // Minimum view time required (ms)
  enabled?: boolean;          // Enable/disable tracking
}
```

## Visual Indicators

The completion system provides built-in visual indicators:

- **✓ Complete**: Green badge when completed
- **% watched/viewed**: Blue progress indicator
- **⚠ Completion Error**: Red error indicator
- **Marking complete...**: Blue loading indicator

## Backend Integration

The completion system automatically calls the xblock's `publish_completion` handler:

```javascript
// POST to: /courses/{courseId}/xblock/{blockId}/handler/publish_completion
{
  "completion": 1.0  // 0.0 to 1.0 completion value
}
```

This matches the Django edX platform behavior and integrates with the existing completion service infrastructure.

## Best Practices

1. **Use appropriate modes**: 'view' for content blocks, 'manual' for interactive blocks
2. **Set reasonable delays**: Don't complete too quickly (confusing) or too slowly (frustrating)
3. **Handle errors gracefully**: Show error states and allow retry
4. **Test completion tracking**: Verify completion is properly recorded
5. **Consider mobile UX**: Ensure completion indicators work on all screen sizes

## Migration from Django Templates

When migrating from Django HTML templates to React components:

1. **HTML blocks**: Replace `data-mark-completed-on-view-after-delay` with `CompletionConfigs.html`
2. **Video blocks**: Replace completion logic in video players with `completion.markComplete()`
3. **Problem blocks**: Add `completion.markComplete()` to submission handlers
4. **Custom blocks**: Convert existing completion logic to use the completion hook

This system provides full compatibility with the existing edX completion infrastructure while offering a modern React-based developer experience.
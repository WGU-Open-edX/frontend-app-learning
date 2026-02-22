import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import { updateModel } from '../generic/model-store';

export interface CompletionConfig {
  /** Completion mode - 'view' for completion on view, 'manual' for manual completion */
  mode: 'view' | 'manual';
  /** Delay in milliseconds before marking as complete (for view mode) */
  delay?: number;
  /** Minimum viewing time required (for view mode) */
  minViewTime?: number;
  /** Whether to track completion at all */
  enabled?: boolean;
}

export interface CompletionState {
  /** Whether the block has been marked as complete */
  isComplete: boolean;
  /** Whether completion is currently in progress */
  isSubmitting: boolean;
  /** Any error that occurred during completion */
  error: string | null;
  /** Manual function to mark as complete */
  markComplete: (completionValue?: number) => Promise<void>;
}

/**
 * Hook for tracking xblock completion in React components
 * Supports both automatic completion on view and manual completion
 */
export const useXblockCompletion = (
  blockId: string,
  courseId: string,
  unitId: string,
  config: CompletionConfig = { mode: 'view', delay: 2000, enabled: true }
): CompletionState => {
  const dispatch = useDispatch();
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track viewing state
  const viewStartTime = useRef<number | null>(null);
  const completionTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasBeenMarkedComplete = useRef(false);

  /**
   * Send completion to the backend
   */
  const submitCompletion = async (completionValue: number = 1.0): Promise<void> => {
    if (hasBeenMarkedComplete.current || !config.enabled) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const baseUrl = getSiteConfig().lmsBaseUrl; 
      const completionUrl = `${baseUrl}/courses/${courseId}/xblock/${blockId}/handler/publish_completion`;
      
      await getAuthenticatedHttpClient().post(completionUrl, {
        completion: completionValue
      });

      setIsComplete(true);
      hasBeenMarkedComplete.current = true;
      
      // Update Redux store to reflect completion in sidebar immediately
      if (unitId && dispatch) {
        dispatch(updateModel({
          modelType: 'units',
          model: {
            id: unitId,
            complete: true,
          },
        }));
      }
      
    } catch (err) {
      console.error('Error submitting xblock completion:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit completion');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Manual completion function
   */
  const markComplete = async (completionValue: number = 1.0): Promise<void> => {
    await submitCompletion(completionValue);
  };

  /**
   * Start tracking view time (for view-based completion)
   */
  const startViewTracking = (): void => {
    if (config.mode !== 'view' || !config.enabled || hasBeenMarkedComplete.current) {
      return;
    }

    viewStartTime.current = Date.now();
    
    // Set timeout for automatic completion
    if (completionTimeout.current) {
      clearTimeout(completionTimeout.current);
    }
    
    completionTimeout.current = setTimeout(() => {
      // Check if minimum view time has been met
      const viewDuration = viewStartTime.current ? Date.now() - viewStartTime.current : 0;
      const minTime = config.minViewTime || 0;
      
      if (viewDuration >= minTime) {
        submitCompletion(1.0);
      }
    }, config.delay || 2000);
  };

  /**
   * Stop tracking view time
   */
  const stopViewTracking = (): void => {
    if (completionTimeout.current) {
      clearTimeout(completionTimeout.current);
      completionTimeout.current = null;
    }
    viewStartTime.current = null;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopViewTracking();
    };
  }, []);

  // Auto-start tracking for view-based completion
  useEffect(() => {
    if (config.mode === 'view' && config.enabled) {
      startViewTracking();
    } else {
      // Stop tracking if completion is disabled
      stopViewTracking();
    }
    
    return () => {
      if (config.mode === 'view') {
        stopViewTracking();
      }
    };
  }, [config.mode, config.enabled, blockId, courseId, unitId]);

  return {
    isComplete,
    isSubmitting,
    error,
    markComplete,
  };
};

/**
 * Preset configurations for common xblock types
 */
export const CompletionConfigs = {
  /** HTML blocks - complete on view after 2 seconds */
  html: {
    mode: 'view' as const,
    delay: 2000,
    minViewTime: 1000,
    enabled: true,
  },
  
  /** Video blocks - manual completion based on video progress */
  video: {
    mode: 'manual' as const,
    enabled: true,
  },
  
  /** Problem blocks - manual completion when submitted */
  problem: {
    mode: 'manual' as const,
    enabled: true,
  },
  
  /** Discussion blocks - complete on view */
  discussion: {
    mode: 'view' as const,
    delay: 1000,
    enabled: true,
  },
} as const;
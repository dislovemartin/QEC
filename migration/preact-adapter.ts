/**
 * Preact Adaptation Layer for QEC-SFT Components
 * Provides compatibility shims for React components
 */

import { h, ComponentType } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';

// React to Preact component adapter
export function adaptReactComponent<T extends object>(
  ReactComponent: ComponentType<T>
): ComponentType<T> {
  return function PreactAdapter(props: T) {
    return h(ReactComponent as any, props);
  };
}

// Hook compatibility shims
export const useEnhancedQecPipeline = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [aiStatus, setAiStatus] = useState<'checking' | 'available' | 'unavailable' | 'unknown'>('unknown');

  const runEnhancedPipeline = useCallback(async (lsu: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Integration with ACGS-PGP backend
      const response = await fetch('/api/v1/qec/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lsu })
      });
      
      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAIStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/ai/status');
      const status = await response.json();
      setAiStatus(status.available ? 'available' : 'unavailable');
      return status.available;
    } catch {
      setAiStatus('unavailable');
      return false;
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    runEnhancedPipeline,
    isLoading,
    error,
    result,
    clearResult,
    aiStatus,
    checkAIStatus
  };
};

// Style compatibility layer
export const styleAdapter = {
  convertTailwindToCSS: (className: string): string => {
    // Map common Tailwind classes to CSS-in-JS styles
    const mappings: Record<string, string> = {
      'bg-black': 'background-color: #000000',
      'text-white': 'color: #ffffff',
      'p-4': 'padding: 1rem',
      'rounded-lg': 'border-radius: 0.5rem',
      'shadow-lg': 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      // Add more mappings as needed
    };
    
    return mappings[className] || '';
  }
};
import { useState, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export const useEnhancedQecPipeline = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<'checking' | 'available' | 'unavailable' | 'unknown'>('unknown');
  const [progress, setProgress] = useState(0);

  // Convex mutations and queries
  const runSimulationMutation = useMutation(api.qec.runEnhancedSimulation);
  const latestResult = useQuery(api.qec.getLatestResult, {});
  const clearResultsMutation = useMutation(api.qec.clearResults);

  const checkAIStatus = useCallback(async () => {
    setAiStatus('checking');
    try {
      // Check if Convex backend is available
      const hasAvailableProvider = !!import.meta.env.VITE_CONVEX_URL;
      setAiStatus(hasAvailableProvider ? 'available' : 'unavailable');
      return hasAvailableProvider;
    } catch (error) {
      console.error('Convex status check failed:', error);
      setAiStatus('unavailable');
      return false;
    }
  }, []);

  const runEnhancedPipeline = useCallback(async (lsu: string) => {
    if (!lsu.trim()) {
      setError('LSU cannot be empty');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 20, 95));
    }, 300);

    try {
      // Check AI service status first
      await checkAIStatus();
      
      // Generate a unique run ID
      const runId = `enhanced-run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Run the enhanced QEC simulation via Convex
      await runSimulationMutation({ 
        lsu, 
        runId,
        aiProvider: 'convex-enhanced'
      });
      
      setProgress(100);
    } catch (err) {
      console.error('Enhanced pipeline execution failed:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during Convex-enhanced pipeline execution');
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setProgress(0);
    }
  }, [checkAIStatus]);

  const clearResult = useCallback(() => {
    clearResultsMutation({});
    setError(null);
    setProgress(0);
  }, [clearResultsMutation]);

  return {
    runEnhancedPipeline,
    isLoading,
    error,
    result: latestResult,
    clearResult,
    aiStatus,
    checkAIStatus,
    progress
  };
};
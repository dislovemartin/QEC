import { useState, useCallback } from 'react';
import { enhancedQecSimulation } from '../services/qec-simulation-enhanced';
import { CertifiedArtifactPackage } from '../types/qec-types';

export const useQecPipeline = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CertifiedArtifactPackage | null>(null);
  const [useAI, setUseAI] = useState(false);

  const runPipeline = useCallback(async (lsu: string, enableAI: boolean = false) => {
    if (!lsu.trim()) {
      setError('LSU cannot be empty');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setUseAI(enableAI);

    try {
      // Generate a unique run ID
      const runId = `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, enableAI ? 1000 : 500));
      
      // Run the enhanced QEC simulation
      const simulationResult = await enhancedQecSimulation.runSimulation(lsu, runId, enableAI);
      
      setResult(simulationResult);
    } catch (err) {
      console.error('Pipeline execution failed:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during pipeline execution');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
    setUseAI(false);
  }, []);

  return {
    runPipeline,
    isLoading,
    error,
    result,
    clearResult,
    useAI
  };
};
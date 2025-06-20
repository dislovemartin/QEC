import { useState, useCallback } from 'react';
import { enhancedQecSimulation } from '../services/enhanced-qec-simulation';
import { multiAIOrchestrator } from '../services/multi-ai-orchestrator';
import { CertifiedArtifactPackage } from '../types/qec-types';

export const useEnhancedQecPipeline = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CertifiedArtifactPackage | null>(null);
  const [aiStatus, setAiStatus] = useState<'checking' | 'available' | 'unavailable' | 'unknown'>('unknown');

  const checkAIStatus = useCallback(async () => {
    setAiStatus('checking');
    try {
      // Refresh provider status in multi-AI orchestrator
      await multiAIOrchestrator.refreshProviderStatus();
      const config = multiAIOrchestrator.getProviderConfig();
      
      // Determine overall AI status
      const hasAvailableProvider = config.nvidia.available || config.groq.available;
      setAiStatus(hasAvailableProvider ? 'available' : 'unavailable');
      return hasAvailableProvider;
    } catch (error) {
      console.error('AI status check failed:', error);
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
    setResult(null);

    try {
      // Check AI service status first
      await checkAIStatus();
      
      // Generate a unique run ID
      const runId = `enhanced-run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Run the enhanced QEC simulation with multi-AI orchestration
      const simulationResult = await enhancedQecSimulation.runEnhancedSimulation(lsu, runId);
      
      setResult(simulationResult);
    } catch (err) {
      console.error('Enhanced pipeline execution failed:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during multi-AI enhanced pipeline execution');
    } finally {
      setIsLoading(false);
    }
  }, [checkAIStatus]);

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
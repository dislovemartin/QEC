import React, { useState, useEffect } from 'react';
import { Play, Loader2, Brain, Zap, AlertTriangle, CheckCircle, Cpu, Settings } from 'lucide-react';

interface EnhancedQecPipelineRunnerProps {
  onSubmit: (lsu: string) => void;
  isLoading: boolean;
  error: string | null;
  onClear: () => void;
  hasResult: boolean;
  aiStatus: 'checking' | 'available' | 'unavailable' | 'unknown';
  onCheckAIStatus: () => Promise<boolean>;
}

const EnhancedQecPipelineRunner: React.FC<EnhancedQecPipelineRunnerProps> = ({ 
  onSubmit, 
  isLoading, 
  error, 
  onClear, 
  hasResult,
  aiStatus,
  onCheckAIStatus
}) => {
  const [lsu, setLsu] = useState('All financial transactions over $10,000 must be approved by two authorized managers before processing.');
  const [showAIDetails, setShowAIDetails] = useState(false);

  useEffect(() => {
    onCheckAIStatus();
  }, [onCheckAIStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lsu.trim()) {
      onSubmit(lsu.trim());
    }
  };

  const getStatusDisplay = () => {
    switch (aiStatus) {
      case 'available':
        return (
          <div className="status-indicator status-available">
            <CheckCircle className="h-4 w-4" />
            AI Services Online
          </div>
        );
      case 'checking':
        return (
          <div className="status-indicator">
            <div className="loading-spinner" />
            Connecting to AI...
          </div>
        );
      case 'unavailable':
        return (
          <div className="status-indicator status-unavailable">
            <AlertTriangle className="h-4 w-4" />
            Local Processing
          </div>
        );
      default:
        return (
          <div className="status-indicator">
            <Cpu className="h-4 w-4" />
            System Ready
          </div>
        );
    }
  };

  return (
    <div className="panel p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Brain className="h-6 w-6 accent" />
            Governance Policy Generator
          </h2>
          
          <div className="flex items-center gap-4">
            {getStatusDisplay()}
            <button
              onClick={() => setShowAIDetails(!showAIDetails)}
              className="btn-secondary !px-3 !py-2"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showAIDetails && (
          <div className="surface-1 p-4 rounded-lg mb-6 animate-slide-down">
            <h3 className="text-sm font-semibold text-secondary mb-3">Processing Engine Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary">Semantic Analysis</span>
                <span className="accent">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">Policy Generation</span>
                <span className="accent">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">Security Validation</span>
                <span className="accent">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">Compliance Checking</span>
                <span className="accent">Active</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-secondary leading-relaxed">
          Enter your governance requirement in plain English. Our advanced AI engine will generate production-ready policies with 
          quantum-inspired semantic validation and comprehensive security analysis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="lsu" className="block text-sm font-medium text-secondary">
            Governance Requirement
          </label>
          <textarea
            id="lsu"
            value={lsu}
            onChange={(e) => setLsu(e.target.value)}
            className="input-field h-32 resize-none"
            placeholder="Describe your governance requirement..."
            disabled={isLoading}
          />
          <div className="text-xs text-muted flex items-center justify-between">
            <span>{lsu.length} characters</span>
            <span>Minimum 10 characters required</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            type="submit"
            disabled={isLoading || lsu.trim().length < 10}
            className="btn-primary flex items-center gap-3 text-base w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner" />
                Generating Policy...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Generate Policy
              </>
            )}
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCheckAIStatus}
              disabled={isLoading}
              className="btn-secondary flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Check Status
            </button>

            {hasResult && (
              <button
                type="button"
                onClick={onClear}
                className="btn-secondary"
              >
                Clear Results
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              {error}
            </p>
          </div>
        )}

        {aiStatus === 'unavailable' && (
          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm flex items-center gap-2">
              <Cpu className="h-4 w-4 flex-shrink-0" />
              Running on local processing engine. For enhanced AI capabilities, configure API access in settings.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default EnhancedQecPipelineRunner;
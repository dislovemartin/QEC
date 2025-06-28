import React, { useState, useEffect } from 'react';
import { Play, Loader2, Brain, Zap, AlertTriangle, CheckCircle, Cpu, Settings, HelpCircle, RotateCcw } from 'lucide-react';

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
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  useEffect(() => {
    onCheckAIStatus();
  }, [onCheckAIStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lsu.trim()) {
      onSubmit(lsu.trim());
    }
  };

  const handleClearResults = () => {
    if (hasResult && window.confirm('This will clear all generated results. Are you sure?')) {
      onClear();
    } else if (!hasResult) {
      onClear();
    }
  };

  const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setShowTooltip(content)}
        onMouseLeave={() => setShowTooltip(null)}
        className="cursor-help"
      >
        {children}
      </div>
      {showTooltip === content && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 w-64 text-center">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );

  const getStatusDisplay = () => {
    switch (aiStatus) {
      case 'available':
        return (
          <div className="status-indicator status-available">
            <CheckCircle className="h-4 w-4" />
            <Tooltip content="AI providers (NVIDIA/Groq) are connected and ready for enhanced analysis">
              AI Enhanced Mode
            </Tooltip>
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
            <Tooltip content="AI services unavailable. Using high-quality local processing algorithms">
              Local Processing Mode
            </Tooltip>
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
            <Tooltip content="Enter your governance requirement in plain English. Our AI will generate production-ready policies with comprehensive validation">
              <HelpCircle className="h-4 w-4 text-muted cursor-help" />
            </Tooltip>
          </h2>
          
          <div className="flex items-center gap-4">
            {getStatusDisplay()}
            <button
              onClick={() => setShowAIDetails(!showAIDetails)}
              className="btn-secondary !px-3 !py-2"
              title="View processing engine details"
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
          Enter your governance requirement in plain English. Our AI engine will generate production-ready policies with 
          semantic fault tolerance validation and comprehensive multi-dimensional analysis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label htmlFor="lsu" className="block text-sm font-medium text-secondary">
              Governance Requirement (LSU)
            </label>
            <Tooltip content="LSU = Logical Semantic Unit. Describe your governance rule in clear, natural language. Example: 'All user data must be encrypted at rest and in transit'">
              <HelpCircle className="h-3 w-3 text-muted cursor-help" />
            </Tooltip>
          </div>
          <textarea
            id="lsu"
            value={lsu}
            onChange={(e) => setLsu(e.target.value)}
            className="input-field h-32 resize-none"
            placeholder="Example: All API requests must be authenticated and rate-limited to 100 requests per minute per user..."
            disabled={isLoading}
          />
          <div className="text-xs text-muted flex items-center justify-between">
            <span>{lsu.length} characters</span>
            <span>Minimum 10 characters • Be specific for better results</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Primary Action */}
          <button
            type="submit"
            disabled={isLoading || lsu.trim().length < 10}
            className="btn-primary flex items-center gap-3 text-base w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner" />
                <span>
                  Generating Policy...
                  <span className="block text-sm font-normal opacity-75">This may take a few moments</span>
                </span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Generate Production Policy
              </>
            )}
          </button>

          {/* Secondary Actions */}
          <div className="flex gap-3 w-full sm:w-auto">
            {hasResult && (
              <button
                type="button"
                onClick={handleClearResults}
                className="btn-secondary flex items-center gap-2 text-sm"
                title="Clear all results and start over"
              >
                <RotateCcw className="h-4 w-4" />
                New Analysis
              </button>
            )}
            
            <button
              type="button"
              onClick={onCheckAIStatus}
              disabled={isLoading}
              className="btn-secondary flex items-center gap-2 text-sm"
              title="Refresh AI service status"
            >
              <Zap className="h-4 w-4" />
              {isLoading ? 'Checking...' : 'Refresh Status'}
            </button>
          </div>
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-300 mb-1">Generation Failed</h4>
                <p className="text-red-300 text-sm mb-2">{error}</p>
                <div className="text-red-200 text-xs">
                  <strong>Suggested actions:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Simplify your requirement and try again</li>
                    <li>Check your internet connection</li>
                    <li>Refresh the page if the issue persists</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Information */}
        {aiStatus === 'unavailable' && (
          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Cpu className="h-4 w-4 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-300 mb-1">Local Processing Mode</h4>
                <p className="text-blue-200 text-sm">
                  Using high-quality local algorithms. For AI-enhanced capabilities with NVIDIA/Groq models, 
                  configure API access in your environment settings.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EnhancedQecPipelineRunner;
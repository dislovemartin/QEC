import React, { useState } from 'react';
import { Play, Loader2, Cpu, Zap, AlertCircle } from 'lucide-react';

interface QecPipelineRunnerProps {
  onSubmit: (lsu: string, useAI?: boolean) => void;
  isLoading: boolean;
  error: string | null;
  onClear: () => void;
  hasResult: boolean;
  useAI: boolean;
}

const QecPipelineRunner: React.FC<QecPipelineRunnerProps> = ({ 
  onSubmit, 
  isLoading, 
  error, 
  onClear, 
  hasResult,
  useAI
}) => {
  const [lsu, setLsu] = useState('Ensure all financial advice is conservative and risk-averse.');
  const [enableAI, setEnableAI] = useState(false);

  const hasNvidiaApiKey = import.meta.env.VITE_NVIDIA_API_KEY && import.meta.env.VITE_NVIDIA_API_KEY.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lsu.trim()) {
      onSubmit(lsu.trim(), enableAI);
    }
  };

  const handleClear = () => {
    onClear();
    setLsu('');
    setEnableAI(false);
  };

  return (
    <div className="card-glow p-8 rounded-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-emerald-400 mb-2 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Play className="h-6 w-6" />
          </div>
          Pipeline Input
        </h2>
        <p className="text-slate-400 leading-relaxed">
          Define your Logical Semantic Unit (LSU) - a high-level principle or rule 
          that will be processed through the quantum-inspired semantic fault tolerance pipeline.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="lsu" className="block text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Logical Semantic Unit
          </label>
          <textarea
            id="lsu"
            value={lsu}
            onChange={(e) => setLsu(e.target.value)}
            className="input-field h-32 resize-none"
            placeholder="Enter a principle, rule, or requirement to be encoded and verified..."
            disabled={isLoading}
          />
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>{lsu.length} characters</span>
            <span>Minimum 10 characters required</span>
          </div>
        </div>

        {/* AI Mode Toggle */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${enableAI ? 'bg-blue-500/20' : 'bg-slate-600/20'}`}>
                {enableAI ? <Zap className="h-5 w-5 text-blue-400" /> : <Cpu className="h-5 w-5 text-slate-400" />}
              </div>
              <div>
                <p className="font-semibold text-slate-300">
                  {enableAI ? 'AI-Enhanced Mode' : 'Simulation Mode'}
                </p>
                <p className="text-xs text-slate-500">
                  {enableAI ? 'Uses NVIDIA API with Nemotron for real AI processing' : 'Uses deterministic simulation for demo'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableAI}
                onChange={(e) => setEnableAI(e.target.checked)}
                disabled={isLoading || !hasNvidiaApiKey}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full border-2 transition-colors ${
                enableAI 
                  ? 'bg-blue-600 border-blue-500' 
                  : 'bg-slate-700 border-slate-600'
              } ${!hasNvidiaApiKey ? 'opacity-50' : ''}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  enableAI ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </label>
          </div>
          
          {enableAI && hasNvidiaApiKey && (
            <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Ready to use NVIDIA API with Nemotron-nano-4b-v1.1 model
              </p>
            </div>
          )}

          {enableAI && !hasNvidiaApiKey && (
            <div className="mt-3 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                NVIDIA API key required. Add VITE_NVIDIA_API_KEY to your .env file
              </p>
            </div>
          )}

          {!hasNvidiaApiKey && (
            <div className="mt-3 p-3 bg-slate-700/30 border border-slate-600/30 rounded-lg">
              <p className="text-sm text-slate-400">
                💡 To enable AI mode, add your NVIDIA API key to .env file:
                <br />
                <code className="text-slate-300 font-mono text-xs">VITE_NVIDIA_API_KEY=nvapi-your-key-here</code>
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            type="submit"
            disabled={isLoading || lsu.trim().length < 10}
            className="btn-primary flex items-center gap-3 text-lg px-8 py-4 w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {enableAI ? 'Processing with AI...' : 'Processing Pipeline...'}
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Execute QEC-SFT Pipeline
              </>
            )}
          </button>

          {hasResult && (
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors"
            >
              Clear Results
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
            <p className="text-red-300 font-medium flex items-center gap-2">
              <span className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full"></span>
              {error}
            </p>
          </div>
        )}

        {/* Status indicator for current processing mode */}
        {useAI && (
          <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300 font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Last run used AI-Enhanced Mode with NVIDIA Nemotron
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default QecPipelineRunner;
import React from 'react';
import MainLayout from './components/MainLayout';
import EnhancedQecPipelineRunner from './components/EnhancedQecPipelineRunner';
import EnhancedResultDisplay from './components/EnhancedResultDisplay';
import { useEnhancedQecPipeline } from './hooks/useEnhancedQecPipeline';
import { Code, Shield, Zap, CheckCircle } from 'lucide-react';

function App() {
  const { 
    runEnhancedPipeline, 
    isLoading, 
    error, 
    result, 
    clearResult,
    aiStatus,
    checkAIStatus
  } = useEnhancedQecPipeline();

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="text-center mb-24">
        <h1 className="text-5xl lg:text-7xl font-bold mb-6">
          AI-powered governance <br />
          <span className="accent">made simple</span>
        </h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
          Generate enterprise-grade governance policies with quantum-inspired semantic fault tolerance. 
          Powered by NVIDIA and Groq AI models.
        </p>
        
        {/* Code snippet showcase */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="code-block text-left">
            <div className="flex items-center gap-2 mb-4 text-muted">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-sm">policy.rego</span>
            </div>
            <pre className="text-sm leading-relaxed">
              <code>
{`package governance

# AI-generated policy with semantic validation
default allow = false

allow {
    input.action == "read"
    input.resource.type == "document"
    validate_semantic_rule(input.context)
    multi_ai_enhanced_validation(input)
}

validate_semantic_rule(context) {
    context.safety_level >= 3
    not context.high_risk_indicators[_]
    context.ai_confidence_score >= 0.8
}`}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-24">
        <div className="feature-card text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg surface-1 flex items-center justify-center">
            <Shield className="w-6 h-6 accent" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Semantic Validation</h3>
          <p className="text-secondary text-sm">
            Quantum-inspired error correction ensures your governance policies are logically consistent and secure.
          </p>
        </div>
        
        <div className="feature-card text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg surface-1 flex items-center justify-center">
            <Zap className="w-6 h-6 accent" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Multi-AI Orchestration</h3>
          <p className="text-secondary text-sm">
            Combines NVIDIA Nemotron and Groq reasoning models for enhanced accuracy and confidence.
          </p>
        </div>
        
        <div className="feature-card text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg surface-1 flex items-center justify-center">
            <Code className="w-6 h-6 accent" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Production Ready</h3>
          <p className="text-secondary text-sm">
            Generates Rego policies, TLA+ specs, Python tests, and comprehensive documentation.
          </p>
        </div>
      </div>

      {/* Main Pipeline Interface */}
      <div className="space-y-16">
        <EnhancedQecPipelineRunner 
          onSubmit={runEnhancedPipeline} 
          isLoading={isLoading} 
          error={error}
          onClear={clearResult}
          hasResult={!!result}
          aiStatus={aiStatus}
          onCheckAIStatus={checkAIStatus}
        />

        {result && (
          <div className="animate-fade-in">
            <EnhancedResultDisplay result={result} />
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="mt-32 text-center">
        <h2 className="text-3xl font-bold mb-12">Trusted by developers worldwide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="metric-card text-center">
            <div className="text-2xl font-bold accent mb-1">99.9%</div>
            <div className="text-secondary text-sm">Accuracy Rate</div>
          </div>
          <div className="metric-card text-center">
            <div className="text-2xl font-bold accent mb-1">&lt;500ms</div>
            <div className="text-secondary text-sm">Response Time</div>
          </div>
          <div className="metric-card text-center">
            <div className="text-2xl font-bold accent mb-1">5+</div>
            <div className="text-secondary text-sm">Output Formats</div>
          </div>
          <div className="metric-card text-center">
            <div className="text-2xl font-bold accent mb-1">24/7</div>
            <div className="text-secondary text-sm">Availability</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default App;
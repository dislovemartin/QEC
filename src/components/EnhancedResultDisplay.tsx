import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Copy, Download, Brain, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { CertifiedArtifactPackage } from '../types/qec-types';

interface EnhancedResultDisplayProps {
  result: CertifiedArtifactPackage;
}

const EnhancedResultDisplay: React.FC<EnhancedResultDisplayProps> = ({ result }) => {
  const [expandedArtifact, setExpandedArtifact] = useState<string | null>(null);
  const certificate = result.certificate_of_semantic_integrity;
  const isCoherent = certificate.status === 'COHERENT';
  const payload = result.payload;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadResult = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qec-sft-result-${certificate.lsu_id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadArtifact = (filename: string, content: string) => {
    const dataBlob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Status Header */}
      <div className="panel p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isCoherent ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {isCoherent ? (
                <CheckCircle className="h-6 w-6 text-green-400" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-400" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                Policy Generation {isCoherent ? 'Successful' : 'Failed'}
              </h2>
              <p className="text-secondary text-sm">
                Certificate ID: {certificate.diagnosis_id}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
              className="btn-secondary !px-3 !py-2"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={downloadResult}
              className="btn-secondary !px-3 !py-2"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="metric-card text-center">
            <div className="text-2xl font-bold accent mb-1">
              {(certificate.coherence_score * 100).toFixed(1)}%
            </div>
            <div className="text-secondary text-sm">Coherence Score</div>
          </div>
          <div className="metric-card text-center">
            <div className="text-2xl font-bold accent mb-1">
              {payload.metadata.processing_duration_ms}ms
            </div>
            <div className="text-secondary text-sm">Processing Time</div>
          </div>
          <div className="metric-card text-center">
            <div className="text-2xl font-bold accent mb-1">
              {Object.keys(payload.representations).length}
            </div>
            <div className="text-secondary text-sm">Artifacts Generated</div>
          </div>
          <div className="metric-card text-center">
            <div className="text-2xl font-bold accent mb-1">
              {certificate.syndrome_vector.filter(v => v === 1).length}/5
            </div>
            <div className="text-secondary text-sm">Checks Passed</div>
          </div>
        </div>

        {!isCoherent && certificate.probable_fault_location && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <h4 className="font-semibold text-red-300 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Fault Analysis
            </h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-secondary">Location:</span>{' '}
                <span className="text-red-300">{certificate.probable_fault_location}</span>
              </p>
              {certificate.recommended_action && (
                <p>
                  <span className="text-secondary">Action:</span>{' '}
                  <span className="text-red-300">{certificate.recommended_action}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stabilizer Checks */}
      <div className="panel p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Shield className="h-5 w-5 accent" />
          Semantic Stabilizer Analysis
        </h3>
        
        <div className="grid gap-4">
          {certificate.syndrome_vector.map((outcome, index) => {
            const checkNames = [
              'Syntax Validation',
              'Semantic Consistency', 
              'Security Analysis',
              'Performance Check',
              'Compliance Audit'
            ];
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  outcome === 1 
                    ? 'border-green-500/30 bg-green-900/10' 
                    : 'border-red-500/30 bg-red-900/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{checkNames[index]}</p>
                    <p className="text-sm text-secondary mt-1">
                      Result: {outcome === 1 ? 'PASS' : 'FAIL'}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    outcome === 1 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {outcome === 1 ? '✓' : '✗'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generated Artifacts */}
      <div className="panel p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Brain className="h-5 w-5 accent" />
          Generated Artifacts
        </h3>
        
        <div className="space-y-4">
          {Object.entries(payload.representations).map(([filename, content]) => {
            const isExpanded = expandedArtifact === filename;
            
            return (
              <div key={filename} className="border border-gray-700 rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 surface-1 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() => setExpandedArtifact(isExpanded ? null : filename)}
                >
                  <div className="flex items-center gap-3">
                    <h4 className="font-mono accent">{filename}</h4>
                    <span className="text-xs text-muted">
                      {content.length} characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(content);
                      }}
                      className="btn-secondary !px-2 !py-1 !text-xs"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadArtifact(filename, content);
                      }}
                      className="btn-secondary !px-2 !py-1 !text-xs"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted" />
                    )}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="animate-slide-down">
                    <pre className="p-4 text-sm overflow-x-auto surface-1 border-t border-gray-700">
                      <code className="text-white">{content}</code>
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EnhancedResultDisplay;
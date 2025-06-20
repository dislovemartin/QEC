import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Copy, Download, ChevronDown, ChevronUp, Lightbulb, ExternalLink, Zap } from 'lucide-react';
import { CertifiedArtifactPackage } from '../types/qec-types';
import { JsonView } from 'react-json-view-lite';

interface ResultDisplayProps {
  result: CertifiedArtifactPackage;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const certificate = result.certificate_of_semantic_integrity;
  const isCoherent = certificate.status === 'COHERENT';
  const payload = result.payload;
  const syndrome = result.certificate_of_semantic_integrity;
  const failedChecks = syndrome.syndrome_vector
    .map((outcome, index) => ({ outcome, index }))
    .filter(item => item.outcome === -1);

  const [expandedDiagnosis, setExpandedDiagnosis] = useState<Set<number>>(new Set());

  const toggleDiagnosis = (index: number) => {
    const newExpanded = new Set(expandedDiagnosis);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDiagnosis(newExpanded);
  };

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

  const isAiMode = payload.metadata.ai_mode === 'NVIDIA-Nemotron';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Status Header */}
      <div className={`card-glow p-8 rounded-2xl border-2 ${
        isCoherent 
          ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-900/20 to-emerald-800/10' 
          : 'border-red-500/50 bg-gradient-to-br from-red-900/20 to-red-800/10'
      }`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              isCoherent ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}>
              {isCoherent ? (
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-red-400" />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-slate-200">Status:</span>
                <span className={isCoherent ? 'text-emerald-400' : 'text-red-400'}>
                  {certificate.status}
                </span>
              </h2>
              <p className="text-slate-400 mt-1">
                Certificate ID: <span className="font-mono text-sm">{certificate.diagnosis_id}</span>
              </p>
              {isAiMode && (
                <p className="text-blue-400 mt-1 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">AI-Enhanced with {payload.metadata.model_used}</span>
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              title="Copy JSON"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={downloadResult}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              title="Download Result"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Coherence Score</p>
            <p className="text-2xl font-bold">
              {(certificate.coherence_score * 100).toFixed(1)}%
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Processing Time</p>
            <p className="text-2xl font-bold">
              {payload.metadata.processing_duration_ms}ms
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">SDE Version</p>
            <p className="text-lg font-mono">
              {certificate.sde_version}
            </p>
          </div>
        </div>

        {!isCoherent && certificate.probable_fault_location && (
          <div className="mt-6 p-4 bg-red-900/30 border border-red-500/30 rounded-lg">
            <h4 className="font-semibold text-red-300 mb-2">Fault Analysis</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-slate-400">Location:</span>{' '}
                <span className="font-mono text-red-300">{certificate.probable_fault_location}</span>
              </p>
              {certificate.recommended_action && (
                <p>
                  <span className="text-slate-400">Action:</span>{' '}
                  <span className="text-red-300">{certificate.recommended_action}</span>
                </p>
              )}
              {certificate.risk_assessment && (
                <div className="mt-3 pt-3 border-t border-red-500/20">
                  <p className="font-semibold text-red-300 mb-1">Risk Assessment</p>
                  <p className="text-red-200">{certificate.risk_assessment.impact_analysis}</p>
                  <p className="text-red-200 mt-1">{certificate.risk_assessment.mitigation_strategy}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Syndrome Vector Visualization */}
      <div className="card-glow p-8 rounded-2xl">
        <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
          <Shield className="h-6 w-6" />
          Semantic Syndrome Analysis
          {isAiMode && (
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full flex items-center gap-1">
              <Zap className="h-3 w-3" />
              AI-Enhanced
            </span>
          )}
        </h3>
        
        <div className="grid gap-4">
          {certificate.syndrome_vector.map((outcome, index) => {
            const stabilizer = result.payload.representations ? {
              name: `Stabilizer Check #${index + 1}`,
              description: ['Syntax validation', 'Semantic consistency', 'Security analysis', 'Performance check', 'Compliance audit'][index] || 'Unknown check',
              detailed_diagnosis: undefined
            } : undefined;

            // Get detailed diagnosis if available
            const detailedDiagnosis = syndrome.stabilizer_map && syndrome.stabilizer_map[index]?.detailed_diagnosis;
            const isFailed = outcome === -1;
            const isExpanded = expandedDiagnosis.has(index);

            return (
              <div 
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  outcome === 1 
                    ? 'border-emerald-500 bg-emerald-900/20' 
                    : 'border-red-500 bg-red-900/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">
                      {stabilizer?.name || `Stabilizer Check #${index + 1}`}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {stabilizer?.description || 'Semantic stabilizer validation'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Outcome: {outcome === 1 ? 'PASS' : 'FAIL'}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    outcome === 1 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {outcome === 1 ? '+1' : '-1'}
                  </div>
                </div>

                {/* Detailed AI Diagnosis Section */}
                {isFailed && detailedDiagnosis && (
                  <div className="mt-4">
                    <button
                      onClick={() => toggleDiagnosis(index)}
                      className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors bg-amber-900/20 hover:bg-amber-900/30 px-3 py-2 rounded-lg w-full"
                    >
                      <Lightbulb className="h-4 w-4" />
                      <span className="font-medium">
                        {detailedDiagnosis.ai_generated ? 'AI-Enhanced Diagnosis' : 'Detailed Diagnosis'}
                      </span>
                      <div className="ml-auto transition-transform duration-200">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-4 bg-slate-800/50 rounded-lg border border-amber-500/20 animate-slide-down">
                        <div className="space-y-4">
                          {/* Issue Explanation */}
                          <div>
                            <h5 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
                              🔍 Issue Analysis
                              {detailedDiagnosis.ai_generated && (
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                  AI-Generated
                                </span>
                              )}
                            </h5>
                            <p className="text-slate-300 text-sm leading-relaxed">
                              {detailedDiagnosis.issue_explanation}
                            </p>
                          </div>

                          {/* Remediation Steps */}
                          <div>
                            <h5 className="font-semibold text-emerald-300 mb-2">
                              🛠️ Remediation Steps
                            </h5>
                            <ul className="space-y-1">
                              {detailedDiagnosis.remediation_steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="text-emerald-400 font-bold mt-0.5">
                                    {stepIndex + 1}.
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Relevant Artifact */}
                          {detailedDiagnosis.relevant_artifact && (
                            <div>
                              <h5 className="font-semibold text-cyan-300 mb-2">
                                📄 Relevant Artifact
                              </h5>
                              <div className="flex items-center gap-2">
                                <code className="bg-slate-700 text-cyan-300 px-2 py-1 rounded text-sm">
                                  {detailedDiagnosis.relevant_artifact}
                                </code>
                                {payload.representations[detailedDiagnosis.relevant_artifact] && (
                                  <button
                                    onClick={() => downloadArtifact(
                                      detailedDiagnosis.relevant_artifact!,
                                      payload.representations[detailedDiagnosis.relevant_artifact!]
                                    )}
                                    className="text-cyan-400 hover:text-cyan-300 p-1"
                                    title="Download artifact"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Confidence Score */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                            <span className="text-slate-400 text-xs">
                              {detailedDiagnosis.ai_generated ? 'AI Confidence' : 'Analysis Confidence'}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className={`w-16 h-2 rounded-full bg-slate-700 overflow-hidden`}>
                                <div 
                                  className={`h-full transition-all duration-300 ${
                                    detailedDiagnosis.confidence >= 70 ? 'bg-emerald-400' :
                                    detailedDiagnosis.confidence >= 50 ? 'bg-amber-400' : 'bg-red-400'
                                  }`}
                                  style={{ width: `${detailedDiagnosis.confidence}%` }}
                                />
                              </div>
                              <span className="text-slate-300 text-xs font-medium">
                                {detailedDiagnosis.confidence}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Generated Artifacts */}
      <div className="card-glow p-8 rounded-2xl">
        <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-3">
          📦 Generated Artifacts
          {isAiMode && (
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full flex items-center gap-1">
              <Zap className="h-3 w-3" />
              AI-Generated
            </span>
          )}
        </h3>
        
        <div className="space-y-4">
          {Object.entries(payload.representations).map(([filename, content]) => (
            <div key={filename} className="border border-slate-700 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-slate-800/50">
                <h4 className="font-mono text-cyan-400">{filename}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(content)}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition-colors flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                  <button
                    onClick={() => downloadArtifact(filename, content)}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition-colors flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </div>
              </div>
              <pre className="p-4 text-sm overflow-x-auto bg-slate-900/50 max-h-64">
                <code className="text-slate-300">{content}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Certificate JSON */}
      <div className="card-glow p-8 rounded-2xl">
        <h3 className="text-xl font-bold text-purple-400 mb-6">Complete Certificate Package</h3>
        <div className="bg-slate-900/50 rounded-lg p-4 overflow-auto max-h-96">
          <JsonView 
            data={result} 
            style={{
              container: 'font-mono text-sm',
              basicChildStyle: 'ml-4',
              label: 'text-cyan-400 font-semibold',
              clickableLabel: 'text-cyan-300 hover:text-cyan-200 cursor-pointer',
              nullValue: 'text-slate-500',
              undefinedValue: 'text-slate-500',
              stringValue: 'text-emerald-300',
              numberValue: 'text-amber-300',
              booleanValue: 'text-purple-400',
              otherValue: 'text-slate-300',
              punctuation: 'text-slate-400'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
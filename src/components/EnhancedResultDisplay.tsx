import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Copy, Download, Brain, ChevronDown, ChevronUp, ExternalLink, HelpCircle, FileText, Code, TestTube, BookOpen, TrendingUp } from 'lucide-react';
import { CertifiedArtifactPackage } from '../types/qec-types';

interface EnhancedResultDisplayProps {
  result: CertifiedArtifactPackage;
}

const EnhancedResultDisplay: React.FC<EnhancedResultDisplayProps> = ({ result }) => {
  const [expandedArtifact, setExpandedArtifact] = useState<string | null>(null);
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  const certificate = result.certificate_of_semantic_integrity;
  const isCoherent = certificate.status === 'COHERENT';
  const payload = result.payload;

  // Safely access syndrome_vector with fallback
  const syndromeVector = certificate.syndrome_vector || [];
  const failedChecks = syndromeVector
    .map((outcome, index) => ({ outcome, index }))
    .filter(item => item.outcome === -1);

  const copyToClipboard = async (text: string, label: string = 'content') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${label} copied!`);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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

  const getCheckIcon = (checkName: string) => {
    if (checkName.toLowerCase().includes('syntax')) return <Code className="h-4 w-4" />;
    if (checkName.toLowerCase().includes('semantic')) return <Brain className="h-4 w-4" />;
    if (checkName.toLowerCase().includes('security')) return <Shield className="h-4 w-4" />;
    if (checkName.toLowerCase().includes('performance')) return <TrendingUp className="h-4 w-4" />;
    if (checkName.toLowerCase().includes('compliance')) return <FileText className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getCheckExplanation = (checkName: string, outcome: number) => {
    const explanations = {
      'Syntax Validation': outcome === 1 
        ? 'All generated code follows proper syntax rules and can be parsed without errors.'
        : 'Generated code contains syntax errors that prevent proper parsing.',
      'Semantic Consistency': outcome === 1
        ? 'The policy logic correctly implements the intended governance requirement with no contradictions.'
        : 'The policy contains logical inconsistencies or doesn\'t fully match the requirement.',
      'Security Analysis': outcome === 1
        ? 'No security vulnerabilities detected. Access controls and data protection are properly implemented.'
        : 'Potential security issues identified that could lead to unauthorized access or data exposure.',
      'Performance Check': outcome === 1
        ? 'Policy execution should meet performance requirements with acceptable response times.'
        : 'Policy may have performance issues that could impact system responsiveness.',
      'Compliance Audit': outcome === 1
        ? 'Policy meets regulatory requirements and organizational compliance standards.'
        : 'Policy may not fully comply with applicable regulations or standards.'
    };
    return explanations[checkName as keyof typeof explanations] || 'Validation check completed.';
  };

  const getArtifactIcon = (filename: string) => {
    if (filename.includes('.rego')) return <Code className="h-4 w-4 text-blue-400" />;
    if (filename.includes('.tla')) return <FileText className="h-4 w-4 text-purple-400" />;
    if (filename.includes('.py')) return <TestTube className="h-4 w-4 text-green-400" />;
    if (filename.includes('.md')) return <BookOpen className="h-4 w-4 text-yellow-400" />;
    return <FileText className="h-4 w-4" />;
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
            {copySuccess && (
              <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                {copySuccess}
              </div>
            )}
            <button
              onClick={() => copyToClipboard(JSON.stringify(result, null, 2), 'Full result')}
              className="btn-secondary !px-3 !py-2"
              title="Copy complete result as JSON"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={downloadResult}
              className="btn-secondary !px-3 !py-2"
              title="Download complete analysis report"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="metric-card text-center">
            <div className="text-2xl font-bold accent mb-1">
              <Tooltip content="Measures how well the generated policy aligns with your requirement and maintains internal consistency. Higher is better.">
                {(certificate.coherence_score * 100).toFixed(1)}%
              </Tooltip>
            </div>
            <div className="text-secondary text-sm flex items-center justify-center gap-1">
              Alignment Score
              <HelpCircle className="h-3 w-3 cursor-help" />
            </div>
          </div>
          <div className="metric-card text-center">
            <div className="text-2xl font-bold accent mb-1">
              <Tooltip content="Time taken to generate and validate the complete policy package">
                {payload.metadata.processing_duration_ms < 1000 
                  ? `${payload.metadata.processing_duration_ms}ms`
                  : `${(payload.metadata.processing_duration_ms / 1000).toFixed(1)}s`
                }
              </Tooltip>
            </div>
            <div className="text-secondary text-sm">Processing Time</div>
          </div>
          <div className="metric-card text-center">
            <div className="text-2xl font-bold accent mb-1">
              <Tooltip content="Number of different code artifacts generated (policy code, tests, documentation, etc.)">
                {Object.keys(payload.representations).length}
              </Tooltip>
            </div>
            <div className="text-secondary text-sm">Artifacts Generated</div>
          </div>
          <div className="metric-card text-center">
            <div className="text-2xl font-bold accent mb-1">
              <Tooltip content="Number of validation checks that passed out of total checks performed">
                <span className={syndromeVector.filter(v => v === 1).length === syndromeVector.length ? 'text-green-400' : 'text-yellow-400'}>
                  {syndromeVector.filter(v => v === 1).length}/{syndromeVector.length || 5}
                </span>
              </Tooltip>
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
              <div className="mt-3 pt-3 border-t border-red-500/30">
                <p className="text-red-200 text-xs">
                  <strong>Next Steps:</strong> Review the failed validation checks below, address the identified issues, 
                  and re-run the analysis with an updated requirement.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stabilizer Checks */}
      <div className="panel p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Shield className="h-5 w-5 accent" />
          Policy Validation Checks
          <Tooltip content="Comprehensive validation of your generated policy across multiple quality dimensions">
            <HelpCircle className="h-4 w-4 text-muted cursor-help" />
          </Tooltip>
        </h3>
        
        <div className="grid gap-4">
          {syndromeVector.map((outcome, index) => {
            const checkNames = [
              'Syntax Validation',
              'Semantic Consistency', 
              'Security Analysis',
              'Performance Check',
              'Compliance Audit'
            ];
            
            const checkName = checkNames[index] || `Check #${index + 1}`;
            const isExpanded = expandedCheck === checkName;
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  outcome === 1 
                    ? 'border-green-500/30 bg-green-900/10' 
                    : 'border-red-500/30 bg-red-900/10'
                }`}
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedCheck(isExpanded ? null : checkName)}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      {getCheckIcon(checkName)}
                      <div>
                        <p className="font-medium">{checkName}</p>
                        <p className="text-sm text-secondary mt-1">
                          Status: <span className={outcome === 1 ? 'text-green-400' : 'text-red-400'}>
                            {outcome === 1 ? 'PASSED' : 'FAILED'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      outcome === 1 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {outcome === 1 ? '✓' : '✗'}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted" />
                    )}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-600 animate-slide-down">
                    <p className="text-sm text-secondary leading-relaxed">
                      {getCheckExplanation(checkName, outcome)}
                    </p>
                    {outcome === -1 && (
                      <div className="mt-3 p-3 bg-red-900/20 rounded-lg">
                        <p className="text-red-300 text-sm font-medium mb-2">Remediation Suggestions:</p>
                        <ul className="text-red-200 text-sm space-y-1">
                          <li>• Review and refine your governance requirement</li>
                          <li>• Ensure requirements are specific and unambiguous</li>
                          <li>• Consider breaking complex rules into simpler components</li>
                        </ul>
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
      <div className="panel p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Brain className="h-5 w-5 accent" />
          Generated Artifacts
          <Tooltip content="Complete set of implementation files generated from your governance requirement">
            <HelpCircle className="h-4 w-4 text-muted cursor-help" />
          </Tooltip>
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
                    {getArtifactIcon(filename)}
                    <h4 className="font-mono accent">{filename}</h4>
                    <span className="text-xs text-muted bg-gray-800 px-2 py-1 rounded">
                      {content.length.toLocaleString()} chars
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(content, filename);
                      }}
                      className="btn-secondary !px-2 !py-1 !text-xs hover:bg-gray-600"
                      title={`Copy ${filename} to clipboard`}
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadArtifact(filename, content);
                      }}
                      className="btn-secondary !px-2 !py-1 !text-xs hover:bg-gray-600"
                      title={`Download ${filename}`}
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
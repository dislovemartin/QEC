import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const QECAnalysisPanel = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [lsu, setLsu] = useState('All financial transactions over $10,000 must be approved by two authorized managers.');
  const [error, setError] = useState(null);

  const runQECAnalysis = async () => {
    if (!lsu.trim()) {
      setError('Please enter a governance requirement');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/v1/qec/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          lsu: lsu,
          analysis_type: 'full',
          ai_provider_preference: 'hybrid',
          integration_mode: 'opa'
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div class="qec-analysis-panel">
      <div class="panel-header">
        <h2>🧠 QEC-SFT Policy Generator</h2>
        <p>AI-powered governance policy generation with semantic fault tolerance</p>
      </div>

      <div class="input-section">
        <label for="lsu-input">Governance Requirement (LSU)</label>
        <textarea
          id="lsu-input"
          value={lsu}
          onInput={(e) => setLsu(e.target.value)}
          placeholder="Enter your governance requirement in plain English..."
          disabled={isAnalyzing}
        />
        
        <button 
          onClick={runQECAnalysis}
          disabled={isAnalyzing || !lsu.trim()}
          class={`analyze-btn ${isAnalyzing ? 'analyzing' : ''}`}
        >
          {isAnalyzing ? (
            <>
              <div class="spinner"></div>
              Analyzing...
            </>
          ) : (
            '🚀 Generate Policy'
          )}
        </button>
      </div>

      {error && (
        <div class="error-message">
          <span class="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {analysisResult && (
        <div class="analysis-results">
          <div class="result-header">
            <h3>Analysis Results</h3>
            <span class={`status-badge ${analysisResult.compliance_status.toLowerCase()}`}>
              {analysisResult.compliance_status}
            </span>
          </div>

          <div class="metrics-grid">
            <div class="metric">
              <div class="metric-value">
                {(analysisResult.qec_result?.certificate_of_semantic_integrity?.coherence_score * 100 || 0).toFixed(1)}%
              </div>
              <div class="metric-label">Coherence Score</div>
            </div>
            
            <div class="metric">
              <div class="metric-value">
                {analysisResult.qec_result?.payload?.metadata?.processing_duration_ms || 0}ms
              </div>
              <div class="metric-label">Processing Time</div>
            </div>
            
            <div class="metric">
              <div class="metric-value">
                {Object.keys(analysisResult.qec_result?.payload?.representations || {}).length}
              </div>
              <div class="metric-label">Artifacts Generated</div>
            </div>
          </div>

          <div class="artifacts-section">
            <h4>Generated Artifacts</h4>
            <div class="artifacts-grid">
              {Object.entries(analysisResult.qec_result?.payload?.representations || {}).map(([filename, content]) => (
                <div key={filename} class="artifact-card">
                  <div class="artifact-header">
                    <span class="filename">{filename}</span>
                    <button 
                      class="download-btn"
                      onClick={() => downloadArtifact(filename, content)}
                    >
                      📥
                    </button>
                  </div>
                  <div class="artifact-preview">
                    {content.substring(0, 150)}...
                  </div>
                </div>
              ))}
            </div>
          </div>

          {analysisResult.opa_policy && (
            <div class="opa-policy-section">
              <h4>Generated OPA Policy</h4>
              <div class="policy-actions">
                <button class="deploy-btn" onClick={() => deployToOPA(analysisResult.opa_policy)}>
                  🚀 Deploy to OPA
                </button>
                <button class="validate-btn" onClick={() => validatePolicy(analysisResult.opa_policy)}>
                  ✅ Validate Policy
                </button>
              </div>
              <pre class="policy-preview">
                <code>{analysisResult.opa_policy.substring(0, 500)}...</code>
              </pre>
            </div>
          )}

          <div class="recommendations-section">
            <h4>Recommendations</h4>
            <ul>
              {analysisResult.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const downloadArtifact = (filename, content) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const deployToOPA = async (policy) => {
  try {
    const response = await fetch('/api/v1/opa/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policy })
    });
    
    if (response.ok) {
      alert('Policy deployed successfully to OPA!');
    } else {
      alert('Failed to deploy policy');
    }
  } catch (error) {
    alert('Error deploying policy: ' + error.message);
  }
};

const validatePolicy = async (policy) => {
  try {
    const response = await fetch('/api/v1/opa/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policy })
    });
    
    const result = await response.json();
    if (result.valid) {
      alert('Policy validation successful!');
    } else {
      alert('Policy validation failed: ' + (result.errors || 'Unknown error'));
    }
  } catch (error) {
    alert('Error validating policy: ' + error.message);
  }
};

export default QECAnalysisPanel;
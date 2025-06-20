import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const EnhancedAuditTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAuditLogs();
    // Set up real-time updates
    const interval = setInterval(fetchAuditLogs, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch(`/api/v1/audit/logs?filter=${filter}&limit=20`);
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getDecisionIcon = (decision) => {
    return decision === 'ALLOW' ? '✅' : '❌';
  };

  const getModelIcon = (modelName) => {
    if (modelName.includes('qec-sft')) return '🧠';
    if (modelName.includes('opa')) return '📋';
    return '🤖';
  };

  const getComplianceColor = (status) => {
    const colors = {
      'COMPLIANT': 'compliant',
      'NON_COMPLIANT': 'non-compliant', 
      'REVIEW_REQUIRED': 'review-required'
    };
    return colors[status] || 'unknown';
  };

  if (loading) {
    return (
      <div class="audit-loading">
        <div class="spinner-large"></div>
        <p>Loading audit logs...</p>
      </div>
    );
  }

  return (
    <div class="enhanced-audit-table">
      <div class="audit-header">
        <h2>📊 Enhanced Governance Audit Trail</h2>
        <div class="audit-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            class="filter-select"
          >
            <option value="all">All Decisions</option>
            <option value="qec-enhanced">QEC-Enhanced</option>
            <option value="traditional">Traditional OPA</option>
            <option value="failed">Failed Only</option>
            <option value="recent">Last 24h</option>
          </select>
          <button class="refresh-btn" onClick={fetchAuditLogs}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Type</th>
              <th>Model/System</th>
              <th>Policy Path</th>
              <th>Decision</th>
              <th>Compliance</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.decision_id} class={`audit-row ${log.enhanced ? 'qec-enhanced' : ''}`}>
                <td class="timestamp">
                  <div class="time-display">
                    {formatTimestamp(log.timestamp)}
                  </div>
                </td>
                
                <td class="model-type">
                  <span class="model-icon">
                    {getModelIcon(log.model_name)}
                  </span>
                  <div class="model-info">
                    <div class="model-name">{log.model_name}</div>
                    {log.enhanced && (
                      <div class="enhancement-badge">QEC-Enhanced</div>
                    )}
                  </div>
                </td>
                
                <td class="policy-path">
                  <code>{log.policy_path}</code>
                  {log.ai_confidence && (
                    <div class="confidence-bar">
                      <div 
                        class="confidence-fill" 
                        style={`width: ${log.ai_confidence * 100}%`}
                      ></div>
                      <span class="confidence-text">
                        {(log.ai_confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </td>
                
                <td class="decision">
                  <span class={`decision-badge ${log.decision.toLowerCase()}`}>
                    {getDecisionIcon(log.decision)} {log.decision}
                  </span>
                  {log.processing_time_ms && (
                    <div class="processing-time">
                      {log.processing_time_ms}ms
                    </div>
                  )}
                </td>
                
                <td class="compliance">
                  {log.compliance_status && (
                    <span class={`compliance-badge ${getComplianceColor(log.compliance_status)}`}>
                      {log.compliance_status}
                    </span>
                  )}
                </td>
                
                <td class="details">
                  {log.violations && log.violations.length > 0 ? (
                    <div class="violations">
                      <span class="violation-count">
                        {log.violations.length} violation(s)
                      </span>
                      <div class="violation-tooltip">
                        {log.violations.map((violation, index) => (
                          <div key={index} class="violation-item">
                            {violation}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span class="no-violations">✅ Clean</span>
                  )}
                </td>
                
                <td class="actions">
                  <div class="action-buttons">
                    <button 
                      class="btn-secondary"
                      onClick={() => viewDetails(log)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    {log.enhanced && (
                      <button 
                        class="btn-secondary"
                        onClick={() => viewQECAnalysis(log)}
                        title="View QEC Analysis"
                      >
                        🧠
                      </button>
                    )}
                    <button 
                      class="btn-secondary"
                      onClick={() => replayDecision(log)}
                      title="Replay Decision"
                    >
                      🔄
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div class="no-logs">
          <p>No audit logs found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

// Helper functions
const viewDetails = (log) => {
  // Open detailed view modal
  window.dispatchEvent(new CustomEvent('openModal', {
    detail: {
      type: 'auditDetails',
      data: log
    }
  }));
};

const viewQECAnalysis = (log) => {
  // Open QEC analysis details
  window.dispatchEvent(new CustomEvent('openModal', {
    detail: {
      type: 'qecAnalysis', 
      data: log
    }
  }));
};

const replayDecision = async (log) => {
  try {
    const response = await fetch(`/api/v1/audit/${log.decision_id}/replay`, {
      method: 'POST'
    });
    
    if (response.ok) {
      alert('Decision replayed successfully');
    } else {
      alert('Failed to replay decision');
    }
  } catch (error) {
    alert('Error replaying decision: ' + error.message);
  }
};

export default EnhancedAuditTable;
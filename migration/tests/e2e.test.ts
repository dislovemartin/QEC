/**
 * End-to-End Test Suite for Migration Validation
 */

import { describe, test, expect } from 'vitest';

describe('End-to-End Migration Validation', () => {
  
  test('Complete Workflow: LSU → QEC Analysis → OPA Policy → Deployment', async () => {
    const testLSU = 'Database access must be logged and require two-factor authentication.';
    
    // Step 1: Submit LSU for analysis
    const analysisResponse = await fetch('/api/v1/qec/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lsu: testLSU,
        analysis_type: 'security',
        integration_mode: 'opa'
      })
    });
    
    expect(analysisResponse.ok).toBe(true);
    const analysis = await analysisResponse.json();
    
    // Step 2: Verify analysis results
    expect(analysis).toHaveProperty('analysis_id');
    expect(analysis).toHaveProperty('opa_policy');
    expect(analysis.compliance_status).toBeOneOf(['COMPLIANT', 'NON_COMPLIANT', 'REVIEW_REQUIRED']);
    
    // Step 3: Validate generated OPA policy
    if (analysis.opa_policy) {
      const policyValidation = await fetch('/api/v1/opa/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policy: analysis.opa_policy
        })
      });
      
      expect(policyValidation.ok).toBe(true);
      const validation = await policyValidation.json();
      expect(validation.valid).toBe(true);
    }
    
    // Step 4: Check audit trail entry
    const auditResponse = await fetch(`/api/v1/audit/${analysis.audit_trail_id}`);
    expect(auditResponse.ok).toBe(true);
    
    const auditEntry = await auditResponse.json();
    expect(auditEntry.decision_id).toBe(analysis.analysis_id);
    expect(auditEntry.model_name).toBe('qec-sft-enhanced');
  });

  test('Dashboard Integration: Real-time Analysis Display', async () => {
    // This would test the integration with the ACGS-PGP dashboard
    // to ensure QEC-SFT results are properly displayed
    
    const testLSU = 'All user actions must be authorized and audited.';
    
    // Submit analysis
    const response = await fetch('/api/v1/qec/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lsu: testLSU,
        analysis_type: 'compliance'
      })
    });
    
    const analysis = await response.json();
    
    // Check if analysis appears in dashboard data
    const dashboardResponse = await fetch('/api/v1/dashboard/recent-decisions');
    const dashboardData = await dashboardResponse.json();
    
    const analysisEntry = dashboardData.find((entry: any) => 
      entry.decision_id === analysis.analysis_id
    );
    
    expect(analysisEntry).toBeDefined();
    expect(analysisEntry.model_name).toBe('qec-sft-enhanced');
  });

  test('CI/CD Pipeline Integration', async () => {
    // Simulate CI/CD pipeline triggering QEC analysis
    const pipelineTrigger = {
      git_commit: 'abc123',
      branch: 'feature/new-policy',
      lsu: 'API access requires valid authentication token and rate limiting.',
      analysis_type: 'security',
      pipeline_id: 'test-pipeline-123'
    };
    
    const response = await fetch('/api/v1/cicd/qec-gate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pipelineTrigger)
    });
    
    expect(response.ok).toBe(true);
    const result = await response.json();
    
    expect(result).toHaveProperty('gate_decision'); // PASS/FAIL
    expect(result).toHaveProperty('analysis_summary');
    expect(result).toHaveProperty('deployment_approved');
    
    // For security analysis, deployment should only be approved for compliant results
    if (result.compliance_status === 'COMPLIANT') {
      expect(result.deployment_approved).toBe(true);
    } else {
      expect(result.deployment_approved).toBe(false);
    }
  });

  test('Monitoring and Alerting Integration', async () => {
    // Test integration with Prometheus/Grafana monitoring
    
    // Submit multiple analyses to generate metrics
    const analyses = await Promise.all([
      fetch('/api/v1/qec/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lsu: 'Test LSU 1',
          analysis_type: 'full'
        })
      }),
      fetch('/api/v1/qec/analyze', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lsu: 'Test LSU 2',
          analysis_type: 'security'
        })
      })
    ]);
    
    // Wait for metrics to be recorded
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if QEC metrics are available in Prometheus format
    const metricsResponse = await fetch('/metrics');
    expect(metricsResponse.ok).toBe(true);
    
    const metricsText = await metricsResponse.text();
    
    // Verify QEC-specific metrics are present
    expect(metricsText).toContain('qec_analysis_total');
    expect(metricsText).toContain('qec_analysis_duration_seconds');
    expect(metricsText).toContain('qec_compliance_status_total');
  });
});
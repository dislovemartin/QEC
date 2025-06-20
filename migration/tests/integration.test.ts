/**
 * Integration Test Suite for QEC-SFT → ACGS-PGP Migration
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { qecBridgeService } from '../api-bridge';
import { ACGSPGPIntegration } from '../backend-integration';

describe('QEC-SFT Migration Integration Tests', () => {
  let acgsIntegration: ACGSPGPIntegration;
  
  beforeEach(() => {
    acgsIntegration = new ACGSPGPIntegration();
  });

  test('Bridge Service - Full Analysis Pipeline', async () => {
    const request = {
      lsu: 'All financial transactions over $10,000 must be approved by two authorized managers.',
      analysis_type: 'full' as const,
      ai_provider_preference: 'hybrid' as const,
      integration_mode: 'opa' as const
    };

    const response = await qecBridgeService.processGovernanceRequest(request);

    // Verify response structure
    expect(response).toHaveProperty('analysis_id');
    expect(response).toHaveProperty('qec_result');
    expect(response).toHaveProperty('opa_policy');
    expect(response.compliance_status).toBeOneOf(['COMPLIANT', 'NON_COMPLIANT', 'REVIEW_REQUIRED']);
    expect(response.recommendations).toBeInstanceOf(Array);
    expect(response.recommendations.length).toBeGreaterThan(0);
  });

  test('OPA Policy Generation', async () => {
    const mockQECResult = {
      certificate_of_semantic_integrity: {
        diagnosis_id: 'test-123',
        status: 'COHERENT',
        coherence_score: 0.85,
        syndrome_vector: [1, 1, 1, 1, 1]
      }
    };

    const policy = qecBridgeService['generateOPAPolicy'](mockQECResult, 'security');
    
    // Verify policy contains required elements
    expect(policy).toContain('package acgs.qec.security');
    expect(policy).toContain('default allow = false');
    expect(policy).toContain('qec_coherence_validated');
    expect(policy).toContain('security_requirements_met');
  });

  test('Compliance Assessment Logic', async () => {
    const coherentResult = {
      certificate_of_semantic_integrity: {
        status: 'COHERENT',
        coherence_score: 0.9
      }
    };

    const incoherentResult = {
      certificate_of_semantic_integrity: {
        status: 'INCOHERENT', 
        coherence_score: 0.3
      }
    };

    const marginResult = {
      certificate_of_semantic_integrity: {
        status: 'COHERENT',
        coherence_score: 0.6
      }
    };

    expect(qecBridgeService['assessCompliance'](coherentResult)).toBe('COMPLIANT');
    expect(qecBridgeService['assessCompliance'](incoherentResult)).toBe('NON_COMPLIANT');
    expect(qecBridgeService['assessCompliance'](marginResult)).toBe('REVIEW_REQUIRED');
  });

  test('Error Handling and Fallback', async () => {
    const invalidRequest = {
      lsu: '', // Empty LSU should trigger error handling
      analysis_type: 'full' as const,
      integration_mode: 'opa' as const
    };

    const response = await qecBridgeService.processGovernanceRequest(invalidRequest);
    
    expect(response.compliance_status).toBe('REVIEW_REQUIRED');
    expect(response.recommendations).toContain('Manual review required due to analysis error');
    expect(response.qec_result).toBeNull();
  });
});

describe('Preact Component Adaptation Tests', () => {
  test('React to Preact Component Adapter', () => {
    // Mock React component
    const MockReactComponent = (props: { title: string }) => {
      return `<div>${props.title}</div>`;
    };

    const adaptedComponent = adaptReactComponent(MockReactComponent);
    
    expect(adaptedComponent).toBeDefined();
    expect(typeof adaptedComponent).toBe('function');
  });

  test('Enhanced QEC Pipeline Hook Adaptation', async () => {
    const hook = useEnhancedQecPipeline();
    
    expect(hook).toHaveProperty('runEnhancedPipeline');
    expect(hook).toHaveProperty('isLoading');
    expect(hook).toHaveProperty('error');
    expect(hook).toHaveProperty('result');
    expect(hook).toHaveProperty('aiStatus');
    expect(hook).toHaveProperty('checkAIStatus');
    
    expect(typeof hook.runEnhancedPipeline).toBe('function');
    expect(typeof hook.checkAIStatus).toBe('function');
    expect(hook.isLoading).toBe(false);
    expect(hook.error).toBeNull();
  });
});

describe('Performance and Load Tests', () => {
  test('Concurrent Analysis Requests', async () => {
    const requests = Array.from({ length: 10 }, (_, i) => ({
      lsu: `Test requirement ${i}`,
      analysis_type: 'full' as const,
      integration_mode: 'standalone' as const
    }));

    const startTime = Date.now();
    const responses = await Promise.all(
      requests.map(req => qecBridgeService.processGovernanceRequest(req))
    );
    const endTime = Date.now();

    // All requests should complete successfully
    expect(responses).toHaveLength(10);
    responses.forEach(response => {
      expect(response).toHaveProperty('analysis_id');
      expect(response.compliance_status).toBeOneOf(['COMPLIANT', 'NON_COMPLIANT', 'REVIEW_REQUIRED']);
    });

    // Performance check - should complete within reasonable time
    const totalTime = endTime - startTime;
    expect(totalTime).toBeLessThan(60000); // Less than 60 seconds for 10 concurrent requests
  });

  test('Large LSU Processing', async () => {
    const largeLSU = 'A'.repeat(10000); // 10KB LSU
    
    const request = {
      lsu: largeLSU,
      analysis_type: 'full' as const,
      integration_mode: 'opa' as const
    };

    const startTime = Date.now();
    const response = await qecBridgeService.processGovernanceRequest(request);
    const endTime = Date.now();

    expect(response).toHaveProperty('analysis_id');
    expect(endTime - startTime).toBeLessThan(30000); // Less than 30 seconds
  });
});
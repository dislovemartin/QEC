// Core data types for the QEC-SFT Platform
// These represent the formal schemas of the constitutional artifacts

export interface EnhancedAnalysisResult {
  primaryAnalysis: any;
  reasoningAnalysis?: any;
  hybridInsights?: any;
  traditionalAnalysis: any;
  hybridScore: number;
  confidence: number;
  providerUsed: 'nvidia' | 'groq' | 'hybrid';
}

export interface DetailedDiagnosis {
  issue_explanation: string;
  remediation_steps: string[];
  relevant_artifact?: string;
  confidence: number;
  ai_generated: boolean;
}

export interface SemanticSyndrome {
  lsu_id: string;
  syndrome_id?: string;
  detected_errors?: string[];
  confidence_score?: number;
  ai_provider_used?: 'nvidia' | 'groq' | 'hybrid';
  stabilizer_map: {
    name: string;
    outcome: 1 | -1;
    description: string;
    confidence: number;
    detailed_diagnosis?: DetailedDiagnosis;
  }[];
  stabilizer_measurements?: {
    stabilizer_name: string;
    measurement_result: number;
    expected_result: number;
    deviation: number;
    weight: number;
  }[];
  vector: (1 | -1)[];
  coherence_score: number;
  correction_applied?: boolean;
  timestamp?: string;
  metadata?: {
    analysis_method?: string;
    reasoning_enabled?: boolean;
    hybrid_score?: number;
    warnings?: string[];
  };
}

export interface CertificateOfSemanticIntegrity {
  diagnosis_id: string;
  certificate_id?: string;
  lsu_id: string;
  status: "COHERENT" | "INCOHERENT";
  certified_at: string; // ISO 8601 date string
  confidence_level?: number;
  syndrome_vector: (1 | -1)[];
  sde_version: string;
  coherence_score: number;
  probable_fault_location?: string;
  recommended_action?: string;
  ai_reasoning_summary?: string;
  semantic_violations?: {
    violation_type: string;
    description: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    suggested_correction: string;
  }[];
  corrective_artifacts?: string[];
  issuance_timestamp?: string;
  expiry_timestamp?: string;
  signature_metadata?: {
    signing_algorithm: string;
    ai_model_version: string;
    confidence_threshold: number;
    multi_ai_consensus?: boolean;
  };
  risk_assessment: {
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    impact_analysis: string;
    mitigation_strategy: string;
  };
}

export interface CertifiedArtifactPackage {
  payload: {
    artifact_id: string;
    artifact_type: "rego_policy" | "safety_protocol" | "governance_rule";
    artifact_body: string;
    lsu_id: string;
    representations: Record<string, string>;
    metadata: {
      creation_timestamp: string;
      processing_duration_ms: number;
      version: string;
      ai_mode?: string;
      model_used?: string;
    };
  };
  certificate_of_semantic_integrity: CertificateOfSemanticIntegrity;
  signature: {
    key_id: string;
    algorithm: string;
    value: string;
    timestamp: string;
  };
}

export interface PipelineRun {
  runId: string;
  lsu: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  startTime: string;
  endTime?: string;
  result?: CertifiedArtifactPackage;
  error?: string;
}

export interface StabilizerCheck {
  name: string;
  description: string;
  category: "syntax" | "semantic" | "security" | "performance" | "compliance";
  weight: number;
  expected_outcome: 1 | -1;
}
// Core data types for the QEC-SFT Platform
// These represent the formal schemas of the constitutional artifacts

export interface DetailedDiagnosis {
  issue_explanation: string;
  remediation_steps: string[];
  relevant_artifact?: string;
  confidence: number;
  ai_generated: boolean;
}

export interface SemanticSyndrome {
  lsu_id: string;
  stabilizer_map: {
    name: string;
    outcome: 1 | -1;
    description: string;
    confidence: number;
    detailed_diagnosis?: DetailedDiagnosis;
  }[];
  vector: (1 | -1)[];
  coherence_score: number;
}

export interface CertificateOfSemanticIntegrity {
  diagnosis_id: string;
  lsu_id: string;
  status: "COHERENT" | "INCOHERENT";
  certified_at: string; // ISO 8601 date string
  syndrome_vector: (1 | -1)[];
  sde_version: string;
  coherence_score: number;
  probable_fault_location?: string;
  recommended_action?: string;
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
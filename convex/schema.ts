import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  certifiedArtifactPackages: defineTable({
    // Main payload structure
    payload: v.object({
      artifact_id: v.string(),
      artifact_type: v.union(
        v.literal("rego_policy"), 
        v.literal("safety_protocol"), 
        v.literal("governance_rule")
      ),
      artifact_body: v.string(),
      lsu_id: v.string(),
      representations: v.record(v.string(), v.string()), // Record<string, string>
      metadata: v.object({
        creation_timestamp: v.string(),
        processing_duration_ms: v.number(),
        version: v.string(),
        ai_mode: v.optional(v.string()),
        model_used: v.optional(v.string()),
      }),
    }),
    
    // Certificate of semantic integrity
    certificate_of_semantic_integrity: v.object({
      diagnosis_id: v.string(),
      certificate_id: v.optional(v.string()),
      lsu_id: v.string(),
      status: v.union(v.literal("COHERENT"), v.literal("INCOHERENT")),
      certified_at: v.string(),
      confidence_level: v.optional(v.number()),
      syndrome_vector: v.array(v.union(v.literal(1), v.literal(-1))),
      sde_version: v.string(),
      coherence_score: v.number(),
      probable_fault_location: v.optional(v.string()),
      recommended_action: v.optional(v.string()),
      ai_reasoning_summary: v.optional(v.string()),
      semantic_violations: v.optional(v.array(v.object({
        violation_type: v.string(),
        description: v.string(),
        severity: v.union(
          v.literal("LOW"), 
          v.literal("MEDIUM"), 
          v.literal("HIGH"), 
          v.literal("CRITICAL")
        ),
        suggested_correction: v.string(),
      }))),
      corrective_artifacts: v.optional(v.array(v.string())),
      issuance_timestamp: v.optional(v.string()),
      expiry_timestamp: v.optional(v.string()),
      signature_metadata: v.optional(v.object({
        signing_algorithm: v.string(),
        ai_model_version: v.string(),
        confidence_threshold: v.number(),
        multi_ai_consensus: v.optional(v.boolean()),
      })),
      risk_assessment: v.object({
        severity: v.union(
          v.literal("LOW"), 
          v.literal("MEDIUM"), 
          v.literal("HIGH"), 
          v.literal("CRITICAL")
        ),
        impact_analysis: v.string(),
        mitigation_strategy: v.string(),
      }),
    }),
    
    // Digital signature
    signature: v.object({
      key_id: v.string(),
      algorithm: v.string(),
      value: v.string(),
      timestamp: v.string(),
    }),
    
    // Additional metadata for querying
    lsu_input: v.string(), // Store original LSU for searching
    created_at: v.number(), // Unix timestamp for efficient sorting
    ai_provider_used: v.optional(v.string()),
    user_id: v.optional(v.string()), // For future user management
  })
    .index("by_lsu_id", ["lsu_input"])
    .index("by_created_at", ["created_at"])
    .index("by_user", ["user_id"])
    .index("by_status", ["certificate_of_semantic_integrity.status"]),
    
  // Table for storing AI analysis results
  aiAnalysisResults: defineTable({
    analysis_id: v.string(),
    lsu_input: v.string(),
    provider: v.union(v.literal("nvidia"), v.literal("groq"), v.literal("hybrid")),
    analysis_type: v.string(),
    result: v.any(), // Flexible storage for different AI response formats
    confidence: v.number(),
    processing_time_ms: v.number(),
    created_at: v.number(),
    success: v.boolean(),
    error_message: v.optional(v.string()),
  })
    .index("by_analysis_id", ["analysis_id"])
    .index("by_provider", ["provider"])
    .index("by_created_at", ["created_at"]),
    
  // Table for storing pipeline runs
  pipelineRuns: defineTable({
    run_id: v.string(),
    lsu_input: v.string(),
    status: v.union(
      v.literal("PENDING"), 
      v.literal("PROCESSING"), 
      v.literal("COMPLETED"), 
      v.literal("FAILED")
    ),
    start_time: v.number(),
    end_time: v.optional(v.number()),
    ai_provider_used: v.optional(v.string()),
    error_message: v.optional(v.string()),
    result_id: v.optional(v.id("certifiedArtifactPackages")),
    user_id: v.optional(v.string()),
  })
    .index("by_run_id", ["run_id"])
    .index("by_status", ["status"])
    .index("by_start_time", ["start_time"])
    .index("by_user", ["user_id"]),
});
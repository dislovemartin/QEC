export interface NvidiaResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface NvidiaRequest {
  model: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface DetailedStabilizerDiagnosis {
  issue_explanation: string;
  remediation_steps: string[];
  relevant_artifact?: string;
  confidence: number;
}

export class NvidiaClient {
  private baseUrl: string;
  private apiKey: string;
  private modelName: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
    this.apiKey = import.meta.env.VITE_NVIDIA_API_KEY || '';
    this.modelName = import.meta.env.VITE_NVIDIA_MODEL || 'mistralai/mistral-nemotron';

    if (!this.apiKey) {
      console.warn('NVIDIA API key not found. Set VITE_NVIDIA_API_KEY in your .env file');
    }
  }

  async isApiAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('NVIDIA API key not configured');
      return false;
    }

    try {
      // Test with a simple completion to verify the model works
      const testResponse = await this.generateCompletion(
        'Hello', 
        'You are a helpful assistant. Respond briefly.',
        { temperature: 0.1, max_tokens: 10 }
      );
      return testResponse.choices && testResponse.choices.length > 0;
    } catch (error) {
      console.warn('NVIDIA API availability check failed:', error);
      return false;
    }
  }

  async generateCompletion(
    prompt: string,
    systemPrompt?: string,
    options: Partial<NvidiaRequest> = {}
  ): Promise<NvidiaResponse> {
    if (!this.apiKey) {
      throw new Error('NVIDIA API key not configured. Please set VITE_NVIDIA_API_KEY in your .env file');
    }

    const messages: NvidiaRequest['messages'] = [];
    
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }
    
    messages.push({
      role: 'user',
      content: prompt
    });

    // Use Mistral Nemotron optimal parameters
    const requestBody: NvidiaRequest = {
      model: this.modelName,
      messages,
      temperature: 0.6,      // Mistral Nemotron sweet spot
      max_tokens: 4096,      // Maximum available
      top_p: 0.7,           // Balanced creativity/focus
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false,
      ...options
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NVIDIA API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json() as NvidiaResponse;
  }

  async generateRepresentation(
    lsu: string,
    representationType: 'rego' | 'tla' | 'python' | 'markdown'
  ): Promise<string> {
    const systemPrompts = {
      rego: `You are an expert in Open Policy Agent (OPA) Rego policy language. Your task is to generate production-ready, secure, and maintainable Rego policies that implement governance requirements. Focus on clear logic, proper input validation, and security best practices.`,
      
      tla: `You are an expert in TLA+ formal specification language. Your task is to create precise, mathematically rigorous formal specifications that model governance requirements. Include proper module structure, state variables, invariants, and temporal properties.`,
      
      python: `You are an expert Python developer specializing in comprehensive testing and validation. Your task is to create robust, thorough test suites that validate governance requirements. Use pytest framework with proper fixtures, parameterization, and edge case coverage.`,
      
      markdown: `You are a technical documentation specialist. Your task is to create comprehensive, well-structured documentation for governance requirements. Include clear explanations, implementation details, compliance considerations, and practical guidance.`
    };

    const prompts = {
      rego: `Create a complete, production-ready Rego policy that implements this governance requirement:

"${lsu}"

Your policy must include:
- Proper package declaration following OPA conventions
- Clear allow/deny rules with explicit logic
- Comprehensive input validation and sanitization
- Helper functions for complex business logic
- Error handling for edge cases and invalid inputs
- Security considerations and access controls
- Performance optimization where applicable
- Comments explaining the business logic

Generate only the Rego policy code, making it ready for immediate deployment.`,

      tla: `Create a formal TLA+ specification that precisely models this governance requirement:

"${lsu}"

Your specification must include:
- Complete module declaration with descriptive naming
- All necessary state variables with proper typing
- Init predicate defining valid initial states
- Next predicate capturing all valid state transitions
- Safety properties that must always hold
- Liveness properties ensuring progress
- Invariants that constrain system behavior
- Mathematical precision suitable for formal verification

Generate only the TLA+ specification code, making it mathematically rigorous.`,

      python: `Create a comprehensive Python test suite that thoroughly validates this governance requirement:

"${lsu}"

Your test suite must include:
- pytest framework with proper test structure
- Test fixtures for common data and scenarios
- Positive test cases that should pass validation
- Negative test cases that should fail validation
- Boundary condition and edge case testing
- Parameterized tests for multiple input combinations
- Integration tests for end-to-end validation
- Performance tests for scalability concerns
- Clear test documentation and assertions
- Mock objects for external dependencies where needed

Generate only the Python test code, making it production-ready.`,

      markdown: `Create comprehensive technical documentation for this governance requirement:

"${lsu}"

Your documentation must include:
- Clear executive summary and purpose statement
- Detailed requirement analysis and interpretation
- Implementation approach and architectural decisions
- Step-by-step deployment and configuration guidance
- Verification and validation procedures
- Compliance mapping to relevant standards/regulations
- Risk analysis and mitigation strategies
- Troubleshooting guide for common issues
- Maintenance and update procedures
- References to related policies and dependencies

Generate only the Markdown documentation, making it suitable for technical and business stakeholders.`
    };

    const response = await this.generateCompletion(
      prompts[representationType],
      systemPrompts[representationType],
      { 
        temperature: representationType === 'markdown' ? 0.6 : 0.4, // Slightly lower for code
        max_tokens: 3000,
        top_p: 0.8
      }
    );

    return response.choices[0]?.message?.content || '';
  }

  async analyzeSemanticConsistency(
    lsu: string,
    representations: Record<string, string>
  ): Promise<{
    isConsistent: boolean;
    confidence: number;
    issues: string[];
    analysis: string;
  }> {
    const systemPrompt = `You are an expert semantic analyst with deep expertise in cross-representation consistency validation. Your role is to analyze multiple implementations of the same governance requirement and identify any semantic inconsistencies, logical contradictions, or implementation gaps. Provide precise, actionable feedback.`;

    const prompt = `Perform a thorough semantic consistency analysis for this governance requirement:

**Original Requirement (LSU):** "${lsu}"

**Generated Representations:**
${Object.entries(representations).map(([type, content]) => `
=== ${type.toUpperCase()} REPRESENTATION ===
${content}

`).join('\n')}

**Analysis Requirements:**
1. Verify all representations implement the same core logical requirement
2. Identify any semantic contradictions or inconsistencies between representations
3. Check if implementation approaches are logically compatible
4. Assess completeness - are there gaps in any representation?
5. Evaluate if the collective representations fully satisfy the original LSU

**Response Format:**
Provide your analysis as a JSON object with this exact structure:
{
  "isConsistent": boolean,
  "confidence": number (0-100),
  "issues": ["specific issue 1", "specific issue 2", "..."],
  "analysis": "detailed explanation of your findings and reasoning"
}

Focus on semantic correctness rather than syntax. Consider the logical flow, business rules, and intended behavior.`;

    const response = await this.generateCompletion(prompt, systemPrompt, {
      temperature: 0.3,
      max_tokens: 1500,
      top_p: 0.8
    });

    try {
      const content = response.choices[0]?.message?.content || '{}';
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonText);
        return {
          isConsistent: Boolean(parsed.isConsistent),
          confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 0)),
          issues: Array.isArray(parsed.issues) ? parsed.issues : [],
          analysis: String(parsed.analysis || 'No analysis provided')
        };
      }
    } catch (error) {
      console.warn('Failed to parse semantic consistency response:', error);
    }

    // Fallback response
    return {
      isConsistent: false,
      confidence: 25,
      issues: ['Unable to complete semantic analysis due to response parsing error'],
      analysis: 'Automated semantic analysis failed - manual review is strongly recommended'
    };
  }

  async performSecurityAnalysis(
    representations: Record<string, string>
  ): Promise<{
    hasSecurityIssues: boolean;
    severity: 'low' | 'medium' | 'high' | 'critical';
    vulnerabilities: string[];
    recommendations: string[];
  }> {
    const systemPrompt = `You are a cybersecurity expert specializing in governance policy security analysis. Your expertise covers access control vulnerabilities, injection attacks, privilege escalation, data exposure risks, and compliance security requirements. Provide thorough, actionable security assessments.`;

    const prompt = `Conduct a comprehensive security analysis of these governance policy representations:

${Object.entries(representations).map(([type, content]) => `
=== ${type.toUpperCase()} REPRESENTATION ===
${content}

`).join('\n')}

**Security Analysis Focus Areas:**
1. **Access Control**: Check for privilege escalation vulnerabilities, insufficient authorization checks, role-based access control issues
2. **Input Validation**: Identify injection attack vectors, insufficient sanitization, data validation bypasses
3. **Authentication**: Assess authentication mechanisms, session management, credential handling
4. **Data Protection**: Look for information disclosure risks, inadequate data encryption, logging security issues
5. **Logic Flaws**: Find business logic vulnerabilities that could be exploited
6. **Compliance**: Evaluate adherence to security standards and regulatory requirements

**Response Format:**
Provide your analysis as a JSON object with this exact structure:
{
  "hasSecurityIssues": boolean,
  "severity": "low|medium|high|critical",
  "vulnerabilities": ["specific vulnerability 1", "specific vulnerability 2", "..."],
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "..."]
}

Be specific about vulnerabilities and provide concrete, implementable recommendations.`;

    const response = await this.generateCompletion(prompt, systemPrompt, {
      temperature: 0.3,
      max_tokens: 1500,
      top_p: 0.8
    });

    try {
      const content = response.choices[0]?.message?.content || '{}';
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonText);
        return {
          hasSecurityIssues: Boolean(parsed.hasSecurityIssues),
          severity: ['low', 'medium', 'high', 'critical'].includes(parsed.severity) 
            ? parsed.severity : 'medium',
          vulnerabilities: Array.isArray(parsed.vulnerabilities) ? parsed.vulnerabilities : [],
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : []
        };
      }
    } catch (error) {
      console.warn('Failed to parse security analysis response:', error);
    }

    // Fallback response
    return {
      hasSecurityIssues: true,
      severity: 'medium',
      vulnerabilities: ['Automated security analysis could not be completed'],
      recommendations: [
        'Conduct manual security code review',
        'Validate all input parameters and data flows',
        'Review access control mechanisms and authorization logic',
        'Test for common injection vulnerabilities',
        'Ensure compliance with applicable security standards'
      ]
    };
  }

  async generateEnhancedDiagnosis(
    lsu: string,
    failedChecks: string[],
    representations: Record<string, string>
  ): Promise<{
    rootCause: string;
    impactAssessment: string;
    mitigationStrategy: string;
    recommendedActions: string[];
  }> {
    const systemPrompt = `You are an expert system diagnostician and governance policy troubleshooter. Your role is to analyze policy implementation failures, identify root causes, assess business impact, and provide actionable remediation strategies. Focus on practical, implementable solutions.`;

    const prompt = `Analyze this governance policy implementation failure and provide comprehensive remediation guidance:

**Original Governance Requirement:** "${lsu}"

**Failed Stability Checks:** ${failedChecks.join(', ')}

**Generated Policy Representations:**
${Object.entries(representations).map(([type, content]) => `
=== ${type.toUpperCase()} ===
${content.length > 800 ? content.substring(0, 800) + '...[truncated]' : content}

`).join('\n')}

**Diagnostic Requirements:**
1. **Root Cause Analysis**: Identify the primary reason for stability check failures
2. **Impact Assessment**: Evaluate business, operational, and compliance implications
3. **Mitigation Strategy**: Develop an overall approach to resolve the issues
4. **Action Plan**: Provide specific, prioritized remediation steps

**Response Format:**
Provide your analysis as a JSON object with this exact structure:
{
  "rootCause": "primary technical/logical cause of the failures",
  "impactAssessment": "detailed assessment of business and operational impact",
  "mitigationStrategy": "comprehensive strategy to address root cause and prevent recurrence",
  "recommendedActions": ["prioritized action 1", "prioritized action 2", "prioritized action 3", "..."]
}

Focus on actionable insights that a development/operations team can implement immediately.`;

    try {
      const response = await this.generateCompletion(prompt, systemPrompt, {
        temperature: 0.4,
        max_tokens: 1200,
        top_p: 0.8
      });

      const content = response.choices[0]?.message?.content || '{}';
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonText);
        return {
          rootCause: String(parsed.rootCause || 'Root cause analysis could not be completed'),
          impactAssessment: String(parsed.impactAssessment || 'Impact assessment requires manual analysis'),
          mitigationStrategy: String(parsed.mitigationStrategy || 'Systematic manual review and remediation required'),
          recommendedActions: Array.isArray(parsed.recommendedActions) 
            ? parsed.recommendedActions : [
                'Review and validate all failed stability checks',
                'Perform manual analysis of policy representations',
                'Consult with domain experts for requirement clarification',
                'Re-implement policies with corrected logic'
              ]
        };
      }
    } catch (error) {
      console.warn('Failed to generate enhanced diagnosis:', error);
    }

    return {
      rootCause: 'Automated diagnosis system encountered an error',
      impactAssessment: 'Manual impact analysis required due to diagnostic system limitations',
      mitigationStrategy: 'Implement manual review process with domain experts to identify and address policy implementation issues',
      recommendedActions: [
        'Conduct manual review of all policy representations',
        'Validate business logic against original requirements',
        'Perform thorough testing of policy implementations',
        'Re-run stability checks after corrections',
        'Document lessons learned for future implementations'
      ]
    };
  }

  async getDetailedStabilizerDiagnosis(
    lsu: string,
    failedStabilizerName: string,
    representations: Record<string, string>,
    issueDescription: string
  ): Promise<DetailedStabilizerDiagnosis> {
    const systemPrompt = `You are an expert governance policy diagnostician specializing in semantic fault tolerance analysis. Your role is to provide detailed, actionable diagnostics for specific stabilizer check failures. Focus on practical remediation guidance that technical teams can implement immediately.`;

    const prompt = `Provide a detailed diagnosis for this specific stabilizer check failure:

**Governance Requirement (LSU):** "${lsu}"

**Failed Stabilizer:** ${failedStabilizerName}

**Issue Description:** ${issueDescription}

**Generated Policy Artifacts:**
${Object.entries(representations).map(([type, content]) => `
=== ${type.toUpperCase()} ===
${content.length > 600 ? content.substring(0, 600) + '...[truncated]' : content}

`).join('\n')}

**Diagnosis Requirements:**
1. **Issue Explanation**: Provide a clear, technical explanation of why this specific stabilizer check failed
2. **Remediation Steps**: List concrete, actionable steps to fix the identified issue
3. **Relevant Artifact**: Identify which generated artifact (policy.rego, specification.tla, test_suite.py, documentation.md) is most relevant to this failure
4. **Confidence Assessment**: Evaluate your confidence in this diagnosis (0-100)

**Response Format:**
Provide your analysis as a JSON object with this exact structure:
{
  "issue_explanation": "clear explanation of the specific issue causing this stabilizer failure",
  "remediation_steps": ["step 1", "step 2", "step 3", "..."],
  "relevant_artifact": "policy.rego|specification.tla|test_suite.py|documentation.md",
  "confidence": number (0-100)
}

Focus on specific, implementable solutions rather than general advice.`;

    try {
      const response = await this.generateCompletion(prompt, systemPrompt, {
        temperature: 0.3,
        max_tokens: 800,
        top_p: 0.8
      });

      const content = response.choices[0]?.message?.content || '{}';
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonText);
        return {
          issue_explanation: String(parsed.issue_explanation || 'Issue analysis could not be completed'),
          remediation_steps: Array.isArray(parsed.remediation_steps) 
            ? parsed.remediation_steps 
            : ['Review the failed stabilizer check manually', 'Consult technical documentation', 'Consider expert consultation'],
          relevant_artifact: ['policy.rego', 'specification.tla', 'test_suite.py', 'documentation.md'].includes(parsed.relevant_artifact)
            ? parsed.relevant_artifact 
            : 'policy.rego',
          confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 70))
        };
      }
    } catch (error) {
      console.warn(`Failed to generate detailed diagnosis for ${failedStabilizerName}:`, error);
    }

    // Fallback response
    return {
      issue_explanation: `The ${failedStabilizerName} check failed. ${issueDescription}. Detailed AI analysis could not be completed, requiring manual investigation.`,
      remediation_steps: [
        'Review the generated artifacts for obvious issues',
        'Validate against established patterns and best practices',
        'Consider consulting domain experts for complex cases',
        'Test any changes thoroughly before re-running the pipeline'
      ],
      relevant_artifact: failedStabilizerName.includes('security') ? 'policy.rego' :
                        failedStabilizerName.includes('performance') ? 'test_suite.py' :
                        failedStabilizerName.includes('compliance') ? 'documentation.md' :
                        'policy.rego',
      confidence: 40
    };
  }
}

export const nvidiaClient = new NvidiaClient();
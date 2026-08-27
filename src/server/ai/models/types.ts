/**
 * ENTIREFM AI PROVIDER & MODEL ROUTING ARCHITECTURE (Phase 0M)
 * =============================================================
 * Canonical types for provider-neutral model execution, fallback chains,
 * structured output enforcement, and tool sandboxing.
 *
 * Governance:
 *   - Provider-neutral: OpenAI, Anthropic Claude, Google Gemini, Deterministic Fallback
 *   - API keys are strictly server-side (never leaked to browser)
 *   - Models never receive raw database / SQL access
 *   - All operational model outputs are validated structured JSON
 */

export type AIProviderType = 'OPENAI' | 'ANTHROPIC' | 'GEMINI' | 'DETERMINISTIC';

export type ModelExecutionStatus =
  | 'LIVE'
  | 'FALLBACK'
  | 'DISABLED'
  | 'FAILED'
  | 'NOT_CONFIGURED';

export type ModelTaskType =
  | 'FAST_TRIAGE'
  | 'SCOPE_INTERPRETATION'
  | 'REASONING'
  | 'VERIFICATION'
  | 'GENERAL';

export interface ModelMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  toolCallId?: string;
  name?: string;
}

export interface ToolParameterSchema {
  type: string;
  properties?: Record<string, {
    type: string;
    description?: string;
    enum?: string[];
    items?: Record<string, any>;
  }>;
  required?: string[];
  description?: string;
}

export interface ModelToolDefinition {
  name: string;
  description: string;
  parameters: ToolParameterSchema;
}

export interface ModelToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

export interface ModelUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costGbp: number;
  latencyMs: number;
}

export interface ModelRequest {
  systemPrompt?: string;
  prompt?: string;
  messages?: ModelMessage[];
  temperature?: number;
  maxTokens?: number;
  responseJsonSchema?: Record<string, any>;
  tools?: ModelToolDefinition[];
  preferredProvider?: AIProviderType;
  preferredModel?: string;
  correlationId?: string;
  agentCode?: string;
  deterministicFallbackOutput?: Record<string, any>;
}

export interface ModelResponse<T = Record<string, any>> {
  provider: AIProviderType;
  modelName: string;
  status: ModelExecutionStatus;
  rawText?: string;
  structuredOutput: T;
  toolCalls?: ModelToolCall[];
  usage: ModelUsage;
  errorMessage?: string;
  disagreementDetected?: boolean;
  secondModelOutput?: T;
}

export interface DualModelVerificationResult<T = Record<string, any>> {
  agreed: boolean;
  primaryResult: ModelResponse<T>;
  secondaryResult: ModelResponse<T>;
  consensusOutput: T;
  divergenceReasons: string[];
}

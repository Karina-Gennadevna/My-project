// ─── Domain types ────────────────────────────────────────────────────────────

export type Module = 'K' | 'A' | 'Q' | 'S'
export type QuestionType = 'scale' | 'boolean' | 'choice'
export type RiskLevel = 'P0' | 'P1' | 'P2'
export type MaturityLevel = 'chaotic' | 'fragmented' | 'managed' | 'systemic' | 'mature'
export type AssessmentStatus = 'draft' | 'completed'

export interface ScaleOption {
  value: number
  label: string
  description?: string
}

export interface ChoiceOption {
  value: number
  label: string
}

export interface RiskIndicator {
  threshold: number       // score <= threshold triggers this risk
  level: RiskLevel
  label: string           // short risk description
  description: string     // detailed explanation
}

export interface Question {
  id: string
  module: Module
  criterionId: string
  criterionLabel: string
  text: string
  tooltip?: string
  type: QuestionType
  options?: ChoiceOption[]   // for 'choice' type
  scoring: boolean           // true = contributes to module score (max 5)
  riskIndicator?: RiskIndicator
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

export interface ModuleScore {
  module: Module
  label: string
  score: number             // 0–30
  maxScore: number          // 30
  percentage: number        // 0–100
}

export interface Risk {
  id: string
  level: RiskLevel
  module: Module
  label: string
  description: string
  questionId: string
  score: number
}

export interface AssessmentResult {
  totalScore: number          // 0–120
  maturityLevel: MaturityLevel
  maturityLabel: string
  modules: Record<Module, ModuleScore>
  risks: Risk[]
  p0Risks: Risk[]
}

// ─── Report ──────────────────────────────────────────────────────────────────

export interface ReportSection {
  title: string
  content: string
}

export interface Roadmap {
  next14days: string[]
  next60days: string[]
  next6months: string[]
}

export interface Report {
  assessmentId: string
  result: AssessmentResult
  executiveSummary: string
  moduleInterpretations: Record<Module, string>
  roadmap: Roadmap
  aiLayerRecommendations: string
  answers: Record<string, number>
}

// ─── API / session ───────────────────────────────────────────────────────────

export interface SessionUser {
  id: string
  email: string
  role: string
}

export interface ApiResponse<T = void> {
  data?: T
  error?: string
}

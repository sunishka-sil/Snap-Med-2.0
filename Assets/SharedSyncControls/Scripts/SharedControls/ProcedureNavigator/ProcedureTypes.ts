export type NextTarget = number | "DONE"

export interface NextCondition {
  condition: string
  next: NextTarget
}

export interface TimerConfig {
  label: string
  duration: number       // seconds
  onComplete: string
  persist: boolean
}

export interface StepTool {
  checklist?: { items: string[] }
  timer?: TimerConfig[]
  reminder?: { items: string[] }
}

export interface ProcedureStep {
  step: number
  action: string
  tool?: StepTool
  next: NextCondition[]
}

export interface Procedure {
  procedure: string
  steps: ProcedureStep[]
  filename?: string
  timestamp?: string
  is_active?: boolean
}
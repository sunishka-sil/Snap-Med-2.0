import { Procedure } from "./ProcedureTypes"

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export class ProcedureValidator {

  static validate(data: unknown): ValidationResult {
    const errors: string[] = []

    // Must be an object
    if (typeof data !== "object" || data === null) {
      return { valid: false, errors: ["Root must be an object"] }
    }

    const obj = data as Record<string, unknown>

    // Required top-level fields
    if (typeof obj.procedure !== "string" || obj.procedure.trim() === "") {
      errors.push("Missing or invalid field: 'procedure' (must be a non-empty string)")
    }

    if (!Array.isArray(obj.steps)) {
      errors.push("Missing or invalid field: 'steps' (must be an array)")
      // Can't validate steps further, return early
      return { valid: false, errors }
    }

    // Validate each step
    obj.steps.forEach((step: unknown, index: number) => {
      const prefix = `steps[${index}]`

      if (typeof step !== "object" || step === null) {
        errors.push(`${prefix}: must be an object`)
        return
      }

      const s = step as Record<string, unknown>

      if (typeof s.step !== "number") {
        errors.push(`${prefix}.step: must be a number`)
      }

      if (typeof s.action !== "string" || s.action.trim() === "") {
        errors.push(`${prefix}.action: must be a non-empty string`)
      }

      if (!Array.isArray(s.next)) {
        errors.push(`${prefix}.next: must be an array`)
      } else {
        // Validate each next condition
        s.next.forEach((n: unknown, ni: number) => {
          const nPrefix = `${prefix}.next[${ni}]`

          if (typeof n !== "object" || n === null) {
            errors.push(`${nPrefix}: must be an object`)
            return
          }

          const nextObj = n as Record<string, unknown>

          if (typeof nextObj.condition !== "string") {
            errors.push(`${nPrefix}.condition: must be a string`)
          }

          const nextVal = nextObj.next
          const validNext =
            typeof nextVal === "number" ||
            nextVal === "DONE"

          if (!validNext) {
            errors.push(`${nPrefix}.next: must be a number or "DONE", got ${JSON.stringify(nextVal)}`)
          }
        })
      }

      // Validate optional tool block if present
      if (s.tool !== undefined) {
        ProcedureValidator.validateTool(s.tool, `${prefix}.tool`, errors)
      }
    })

    return { valid: errors.length === 0, errors }
  }

  private static validateTool(
    tool: unknown,
    prefix: string,
    errors: string[]
  ): void {
    if (typeof tool !== "object" || tool === null) {
      errors.push(`${prefix}: must be an object`)
      return
    }

    const t = tool as Record<string, unknown>

    // Validate checklist if present
    if (t.checklist !== undefined) {
      const cl = t.checklist as Record<string, unknown>
      if (!Array.isArray(cl.items) || !cl.items.every(i => typeof i === "string")) {
        errors.push(`${prefix}.checklist.items: must be an array of strings`)
      }
    }

    // Validate reminder if present
    if (t.reminder !== undefined) {
      const r = t.reminder as Record<string, unknown>
      if (!Array.isArray(r.items) || !r.items.every(i => typeof i === "string")) {
        errors.push(`${prefix}.reminder.items: must be an array of strings`)
      }
    }

    // Validate timers if present
    if (t.timer !== undefined) {
      if (!Array.isArray(t.timer)) {
        errors.push(`${prefix}.timer: must be an array`)
      } else {
        t.timer.forEach((timer: unknown, ti: number) => {
          const tPrefix = `${prefix}.timer[${ti}]`

          if (typeof timer !== "object" || timer === null) {
            errors.push(`${tPrefix}: must be an object`)
            return
          }

          const tm = timer as Record<string, unknown>

          if (typeof tm.label !== "string") {
            errors.push(`${tPrefix}.label: must be a string`)
          }
          if (typeof tm.duration !== "number" || tm.duration <= 0) {
            errors.push(`${tPrefix}.duration: must be a positive number`)
          }
          if (tm.onComplete !== undefined && typeof tm.onComplete !== "string") {
            errors.push(`${tPrefix}.onComplete: must be a string`)
          }
          if (tm.persist !== undefined && typeof tm.persist !== "boolean") {
            errors.push(`${tPrefix}.persist: must be a boolean`)
          }
        })
      }
    }
  }
}
import { ProcedureNavigatorInput } from "./ProcedureNavigatorInput"
import { ProcedureValidator } from "./ProcedureValidator"
import { Procedure, ProcedureStep, NextTarget } from "./ProcedureTypes"

export class ProcedureNavigator {
  private procedure: Procedure
  private currentStep: ProcedureStep
  private activeTimerHandle: any = null

  private checkedIndices: Set<number> = new Set()
  private stepHistory: number[] = []

  private readonly onStepChanged: ((step: ProcedureStep) => void)[] = []
  private readonly onProcedureComplete: (() => void)[] = []
  private readonly onChecklistChanged: ((checklistState: string) => void)[] = []
  private readonly onConditionChosen: ((conditionIndex: number) => void)[] = []
  private readonly onTimerTick: ((remaining: number) => void)[] = []

  constructor(
    private readonly input: ProcedureNavigatorInput,
    private readonly scriptRef: BaseScriptComponent,
    procedureJson: unknown
  ) {
    print("[ProcedureNavigator] constructor called")
    print("[ProcedureNavigator] procedureJson type: " + typeof procedureJson)
    print("[ProcedureNavigator] procedureJson: " + JSON.stringify(procedureJson))

    const result = ProcedureValidator.validate(procedureJson)
    print("[ProcedureNavigator] validation valid: " + result.valid)
    if (!result.valid) {
      result.errors.forEach(err => print(`[ProcedureNavigator] Validation error: ${err}`))
      throw new Error(`Invalid procedure JSON: ${result.errors.length} error(s). Check logs.`)
    }

    this.procedure = procedureJson as Procedure
    print("[ProcedureNavigator] procedure set: " + this.procedure.procedure)
    print("[ProcedureNavigator] steps count: " + this.procedure.steps.length)

    // Navigation
    if (input.nextButton) input.nextButton.onTriggerDown.add(this.onNextPinched)
    if (input.backButton) input.backButton.onTriggerDown.add(this.onBackPinched)
    if (input.doneButton) input.doneButton.onTriggerDown.add(this.onDonePinched)

    // Hide / restore
    if (input.hideButton) input.hideButton.onTriggerDown.add(this.onHidePinched)
    if (input.restoreButton) input.restoreButton.onTriggerDown.add(this.onRestorePinched)

    // Condition buttons
    if (input.conditionButtons) {
      input.conditionButtons.forEach((btn, index) => {
        if (btn) btn.onTriggerDown.add(() => this.onConditionPinched(index))
      })
    }

    // Checklist item buttons — tap to toggle strikethrough
    if (input.checklistItemButtons) {
      input.checklistItemButtons.forEach((btn, index) => {
        if (btn) btn.onTriggerDown.add(() => this.toggleChecklistItem(index))
      })
    }

    // Start hidden
    if (input.root) input.root.enabled = false
    if (input.minimizedRoot) input.minimizedRoot.enabled = false
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  start() {
    print("[ProcedureNavigator] start() called")
    if (this.input.root) {
      print("[ProcedureNavigator] root found, enabling")
      this.input.root.enabled = true
    } else {
      print("[ProcedureNavigator] root is NULL — not wired in inspector")
    }
    this.goToStep(1)
  }

  stop() {
    if (this.input.root) this.input.root.enabled = false
    if (this.input.minimizedRoot) this.input.minimizedRoot.enabled = false
    this.clearTimer()
  }

  // ─── Subscriptions ────────────────────────────────────────────────────────

  subscribeOnStepChanged(cb: (step: ProcedureStep) => void) {
    this.onStepChanged.push(cb)
  }

  subscribeOnComplete(cb: () => void) {
    this.onProcedureComplete.push(cb)
  }

  subscribeOnChecklistChanged(cb: (checklistState: string) => void) {
    this.onChecklistChanged.push(cb)
  }

  subscribeOnConditionChosen(cb: (conditionIndex: number) => void) {
    this.onConditionChosen.push(cb)
  }

  subscribeOnTimerTick(cb: (remaining: number) => void) {
    this.onTimerTick.push(cb)
  }

  // ─── Public Sync Methods ──────────────────────────────────────────────────

  goToStep(stepNumber: number) {
    print("[ProcedureNavigator] goToStep called with: " + stepNumber)

    // Skip if already on this step — prevents double render from sync feedback
    if (this.currentStep && this.currentStep.step === stepNumber) {
      print("[ProcedureNavigator] already on step " + stepNumber + ", skipping")
      return
    }

    const step = this.procedure.steps.find(s => s.step === stepNumber)
    print("[ProcedureNavigator] step found: " + JSON.stringify(step))
    if (!step) {
      print("[ProcedureNavigator] step NOT found, returning")
      return
    }

    if (this.currentStep) {
      this.stepHistory.push(this.currentStep.step)
    }

    this.currentStep = step
    this.checkedIndices = new Set()
    this.clearTimer()
    this.renderStep(step)
    this.onStepChanged.forEach(cb => cb(step))
  }

  updateChecklistState(checklistState: string) {
    this.checkedIndices = new Set(
      checklistState.split(",").filter(s => s !== "").map(Number)
    )
    this.renderChecklistState()
  }

  followCondition(conditionIndex: number) {
    this.onConditionPinched(conditionIndex)
  }

  syncTimer(remaining: number) {
    if (this.input.timerText) this.input.timerText.text = this.formatTime(remaining)
  }

  toggleChecklistItem(index: number) {
    if (this.checkedIndices.has(index)) {
      this.checkedIndices.delete(index)
    } else {
      this.checkedIndices.add(index)
    }
    const state = Array.from(this.checkedIndices).join(",")
    this.onChecklistChanged.forEach(cb => cb(state))
    this.renderChecklistState()
  }

  // ─── Private Rendering ────────────────────────────────────────────────────

  private renderStep(step: ProcedureStep) {
    print("[ProcedureNavigator] renderStep: " + step.action)

    // Title
    if (this.input.stepTitleText) {
      this.input.stepTitleText.text = `Step ${step.step}: ${step.action}`
      print("[ProcedureNavigator] stepTitleText set to: " + this.input.stepTitleText.text)
    } else {
      print("[ProcedureNavigator] stepTitleText is NULL")
    }

    // Checklist
    const items = step.tool?.checklist?.items ?? []
    print("[ProcedureNavigator] checklist items count: " + items.length)
    if (this.input.checklistItemTexts) {
      this.input.checklistItemTexts.forEach((textComp, i) => {
        if (!textComp) return
        const hasItem = i < items.length
        textComp.text = hasItem ? items[i] : ""
        const obj = textComp.getSceneObject()
        if (obj) obj.enabled = hasItem
      })
    }
    // Reset all checklist button colors to white on new step
    if (this.input.checklistItemButtons) {
      this.input.checklistItemButtons.forEach((btn, i) => {
        if (!btn) return
        const sceneObj = btn.getSceneObject()
        if (!sceneObj) return
        const meshVisual = sceneObj.getComponent("Component.RenderMeshVisual")
        if (!meshVisual) return
        meshVisual.mainMaterial.mainPass.baseColor = new vec4(1.0, 1.0, 1.0, 1.0)
      })
    }
    if (this.input.checklistContainer) {
      this.input.checklistContainer.enabled = items.length > 0
    }

    // Reminder
    if (this.input.reminderRoot) {
      if (step.tool?.reminder) {
        if (this.input.reminderText) {
          this.input.reminderText.text = "💡 " + step.tool.reminder.items.join("  |  ")
        }
        this.input.reminderRoot.enabled = true
      } else {
        this.input.reminderRoot.enabled = false
      }
    }

    // Timer
    if (this.input.timerRoot) {
      if (step.tool?.timer) {
        const timerConfig = step.tool.timer[0]
        if (this.input.timerLabelText) this.input.timerLabelText.text = timerConfig.label
        this.input.timerRoot.enabled = true
        this.startTimer(timerConfig.duration, timerConfig.onComplete)
      } else {
        this.input.timerRoot.enabled = false
      }
    }

    // Buttons
    const isBranching = step.next.length > 1
    const isDone = step.next.length === 1 && step.next[0].next === "DONE"
    print("[ProcedureNavigator] isBranching: " + isBranching + " isDone: " + isDone)

    if (this.input.nextButtonRoot) this.input.nextButtonRoot.enabled = !isBranching && !isDone
    if (this.input.doneButtonRoot) this.input.doneButtonRoot.enabled = isDone
    if (this.input.backButtonRoot) this.input.backButtonRoot.enabled = this.stepHistory.length > 0

    if (this.input.conditionButtonRoots) {
      this.input.conditionButtonRoots.forEach((root, i) => {
        if (!root) return
        const hasBranch = isBranching && i < step.next.length
        root.enabled = hasBranch
        if (hasBranch && this.input.conditionButtonLabels?.[i]) {
          this.input.conditionButtonLabels[i].text = step.next[i].condition
        }
      })
    }
  }

  private renderChecklistState() {
    if (!this.input.checklistItemTexts) return
    this.input.checklistItemTexts.forEach((textComp, i) => {
      if (!textComp) return
      const obj = textComp.getSceneObject()
      if (!obj || !obj.enabled) return
      const base = this.currentStep.tool?.checklist?.items[i] ?? ""
      textComp.text = base
    })

    // Update button colors based on checked state
    if (!this.input.checklistItemButtons) return
    this.input.checklistItemButtons.forEach((btn, i) => {
      if (!btn) return
      const isChecked = this.checkedIndices.has(i)
      // Access the button's background mesh to change color
      const sceneObj = btn.getSceneObject()
      if (!sceneObj) return
      const meshVisual = sceneObj.getComponent("Component.RenderMeshVisual")
      if (!meshVisual) return
      // Green when checked, white when unchecked
      meshVisual.mainMaterial.mainPass.baseColor = isChecked
        ? new vec4(0.2, 0.8, 0.2, 1.0)
        : new vec4(1.0, 1.0, 1.0, 1.0)
    })
  }

  // ─── Timer ────────────────────────────────────────────────────────────────

  private startTimer(seconds: number, onCompleteLabel: string) {
    let elapsed = 0
    this.activeTimerHandle = this.scriptRef.createEvent("UpdateEvent")
    this.activeTimerHandle.bind(() => {
      elapsed += getDeltaTime()
      const remaining = Math.max(0, seconds - Math.floor(elapsed))
      if (this.input.timerText) this.input.timerText.text = this.formatTime(remaining)
      this.onTimerTick.forEach(cb => cb(remaining))
      if (remaining === 0) {
        this.clearTimer()
        if (this.input.timerText) this.input.timerText.text = onCompleteLabel
      }
    })
  }

  private clearTimer() {
    if (this.activeTimerHandle) {
      this.activeTimerHandle = null
    }
  }

  private formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}`
  }

  // ─── Button Handlers ──────────────────────────────────────────────────────

  // Public helpers so other scripts (e.g. voice navigation) can trigger
  // the same behaviour as pressing the Next / Back buttons.
  public triggerNext(): void {
    print("[ProcedureNavigator] triggerNext called from external script")
    this.onNextPinched()
  }

  public triggerBack(): void {
    print("[ProcedureNavigator] triggerBack called from external script")
    this.onBackPinched()
  }

  private onNextPinched = (): void => {
    print("[ProcedureNavigator] Next pressed")
    const nextCondition = this.currentStep.next[0]
    this.navigateTo(nextCondition.next)
  }

  private onBackPinched = (): void => {
    print("[ProcedureNavigator] Back pressed")
    if (this.stepHistory.length === 0) return
    const previousStep = this.stepHistory.pop()
    const step = this.procedure.steps.find(s => s.step === previousStep)
    if (!step) return
    this.currentStep = step
    this.checkedIndices = new Set()
    this.clearTimer()
    this.renderStep(step)
    this.onStepChanged.forEach(cb => cb(step))
  }

  private onDonePinched = (): void => {
    print("[ProcedureNavigator] Done pressed")
    this.onProcedureComplete.forEach(cb => cb())
    this.stop()
  }

  private onHidePinched = (): void => {
    print("[ProcedureNavigator] Hide pressed")
    if (this.input.root) this.input.root.enabled = false
    if (this.input.minimizedRoot) this.input.minimizedRoot.enabled = true
  }

  private onRestorePinched = (): void => {
    print("[ProcedureNavigator] Restore pressed")
    if (this.input.minimizedRoot) this.input.minimizedRoot.enabled = false
    if (this.input.root) this.input.root.enabled = true
  }

  private onConditionPinched = (index: number): void => {
    print("[ProcedureNavigator] Condition pressed: " + index)
    const nextCondition = this.currentStep.next[index]
    if (!nextCondition) return
    this.onConditionChosen.forEach(cb => cb(index))
    this.navigateTo(nextCondition.next)
  }

  private navigateTo(target: NextTarget) {
    print("[ProcedureNavigator] navigateTo: " + target)
    if (target === "DONE") {
      this.onProcedureComplete.forEach(cb => cb())
      this.stop()
    } else {
      this.goToStep(target)
    }
  }
}
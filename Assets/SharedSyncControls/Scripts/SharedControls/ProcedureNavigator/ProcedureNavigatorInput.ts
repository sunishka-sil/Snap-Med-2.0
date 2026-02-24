import { RectangleButton } from 'SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton';

@component
export class ProcedureNavigatorInput extends BaseScriptComponent {

  // Root scene object — enabled/disabled to show/hide the entire UI
  @input
  readonly root: SceneObject

  // Displays "Step N: Action Name" at the top
  @input
  readonly stepTitleText: Text

  // Container that holds all checklist item scene objects
  @input
  readonly checklistContainer: SceneObject

  // Individual checklist item Text components
  @input
  readonly checklistItemTexts: Text[]

  // Tappable buttons for each checklist item — triggers toggleChecklistItem
  @input
  readonly checklistItemButtons: RectangleButton[]

  // Displays the reminder hint line
  @input
  readonly reminderText: Text

  // Root object for the reminder line — hidden when no reminder exists
  @input
  readonly reminderRoot: SceneObject

  // Displays the timer countdown value (e.g. "4")
  @input
  readonly timerText: Text

  // Displays the timer label (e.g. "Arm Drift Assessment")
  @input
  readonly timerLabelText: Text

  // Root object for the timer panel — hidden when no timer exists on the step
  @input
  readonly timerRoot: SceneObject

  // Moves forward through linear steps
  @input
  readonly nextButton: RectangleButton

  // Root object for the next button — hidden on branching steps
  @input
  readonly nextButtonRoot: SceneObject

  // Moves backward to the previous step in history
  @input
  readonly backButton: RectangleButton

  // Root object for the back button — hidden on step 1
  @input
  readonly backButtonRoot: SceneObject

  // Shown when the procedure reaches DONE
  @input
  readonly doneButton: RectangleButton

  // Root object for done button — hidden during procedure
  @input
  readonly doneButtonRoot: SceneObject

  // Hides/minimizes the UI panel
  @input
  readonly hideButton: RectangleButton

  // The minimized UI shown when panel is hidden
  @input
  readonly minimizedRoot: SceneObject

  // Restores the full UI from minimized state
  @input
  readonly restoreButton: RectangleButton

  // Condition buttons for branching steps (max 3)
  @input
  readonly conditionButtons: RectangleButton[]

  // Root objects for each condition button — hidden/shown per step
  @input
  readonly conditionButtonRoots: SceneObject[]

  // Text labels on each condition button
  @input
  readonly conditionButtonLabels: Text[]
}
// Enum to define keys used in the real-time data store for synchronization
export enum RealtimeStoreKeys {
  // The current step number all users are on
  STEP = "STEP_NUMBER",

  // The remaining timer value (in seconds) for steps that have a timer tool
  TIMER = "TIMER_VALUE",

  // The procedure being run (e.g. "Stroke Assessment" / "Cardiac Arrest Management")
  // Allows all users to load the same JSON procedure on session join
  PROCEDURE_NAME = "PROCEDURE_NAME",

  // Tracks which checklist items have been checked off (comma-separated indices e.g. "0,2,3")
  // Lets all users see the same items ticked in real time
  CHECKLIST_STATE = "CHECKLIST_STATE",

  // The index of the condition chosen at a branching step (e.g. step 5 in cardiac arrest)
  // Syncs which branch the lead user picked so followers navigate the same path
  CONDITION_INDEX = "CONDITION_INDEX"
}
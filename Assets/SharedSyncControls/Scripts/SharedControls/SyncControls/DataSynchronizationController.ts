import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {ProcedureNavigator} from "../ProcedureNavigator/ProcedureNavigator"
import {RealtimeStoreKeys} from "./RealtimeStoreKeys"

// The DataSynchronizationController class is responsible for managing data synchronization
// of the ProcedureNavigator across multiple users in a session, ensuring all users
// stay on the same step, see the same checklist state, follow the same branching
// decisions, and share the same timer value in real time.
export class DataSynchronizationController {
  // Identifier for the real-time data store used for synchronization
  private readonly STORE_ID: string = "SharedProcedureControls"

  // Reference to the real-time data store
  private realtimeStore: GeneralDataStore

  // Flag to check if a new store was created
  private isNewStoreCreated: boolean = false

  // Constructor initializes the controller with the procedure navigator
  constructor(
    private readonly procedureNavigator: ProcedureNavigator
  ) {}

  // Method to start the synchronization process
  start() {
    this.createRealtimeStore(() => {
      if (this.isNewStoreCreated) {
        // New store — write initial values so late joiners can sync from them
        this.realtimeStore.putInt(RealtimeStoreKeys.STEP, 1)
        this.realtimeStore.putString(RealtimeStoreKeys.PROCEDURE_NAME, "")
        this.realtimeStore.putString(RealtimeStoreKeys.CHECKLIST_STATE, "")
        this.realtimeStore.putInt(RealtimeStoreKeys.CONDITION_INDEX, -1)
        this.realtimeStore.putFloat(RealtimeStoreKeys.TIMER, 0)
      } else {
        // Store already exists — sync this user's navigator to the current state
        this.procedureNavigator.goToStep(
          this.realtimeStore.getInt(RealtimeStoreKeys.STEP)
        )
        this.procedureNavigator.updateChecklistState(
          this.realtimeStore.getString(RealtimeStoreKeys.CHECKLIST_STATE)
        )
      }

      // Subscribe to real-time store updates from other users
      SessionController.getInstance().onRealtimeStoreUpdated.add(this.onRealtimeStoreUpdated)

      // When the local user navigates to a new step, broadcast it
      this.procedureNavigator.subscribeOnStepChanged((step) => {
        this.realtimeStore.putInt(RealtimeStoreKeys.STEP, step.step)
        // Clear checklist state on step change
        this.realtimeStore.putString(RealtimeStoreKeys.CHECKLIST_STATE, "")
        // Reset condition index on step change
        this.realtimeStore.putInt(RealtimeStoreKeys.CONDITION_INDEX, -1)
      })

      // When the local user checks a checklist item, broadcast the updated state
      this.procedureNavigator.subscribeOnChecklistChanged((checklistState: string) => {
        this.realtimeStore.putString(RealtimeStoreKeys.CHECKLIST_STATE, checklistState)
      })

      // When the local user picks a condition at a branching step, broadcast the index
      this.procedureNavigator.subscribeOnConditionChosen((conditionIndex: number) => {
        this.realtimeStore.putInt(RealtimeStoreKeys.CONDITION_INDEX, conditionIndex)
      })

      // When the timer ticks, broadcast the remaining seconds
      this.procedureNavigator.subscribeOnTimerTick((remaining: number) => {
        this.realtimeStore.putFloat(RealtimeStoreKeys.TIMER, remaining)
      })
    })
  }

  // Method to create or find an existing real-time data store
  private createRealtimeStore(onStoreCreated: () => void) {
    this.realtimeStore = this.findRealtimeStore()
    if (!this.realtimeStore) {
      this.isNewStoreCreated = true
      const storeOpts = RealtimeStoreCreateOptions.create()
      storeOpts.persistence = RealtimeStoreCreateOptions.Persistence.Persist
      storeOpts.ownership = RealtimeStoreCreateOptions.Ownership.Unowned
      storeOpts.allowOwnershipTakeOver = false
      storeOpts.storeId = this.STORE_ID
      SessionController.getInstance()
        .getSession()
        .createRealtimeStore(
          storeOpts,
          (store) => {
            this.realtimeStore = store
            onStoreCreated()
          },
          () => {}
        )
    } else {
      onStoreCreated()
    }
  }

  // Method to find an existing real-time data store with the specified store ID
  private findRealtimeStore(): GeneralDataStore | null {
    for (const store of SessionController.getInstance().getSession().allRealtimeStores) {
      if (
        SessionController.getInstance()
          .getSession()
          .getRealtimeStoreInfo(store).storeId === this.STORE_ID
      ) {
        return store
      }
    }
    return null
  }

  // Method to handle updates to the real-time store from other users
  private onRealtimeStoreUpdated = (
    session: MultiplayerSession,
    store: GeneralDataStore,
    key: string,
    updateInfo: ConnectedLensModule.RealtimeStoreUpdateInfo
  ) => {
    // Ignore updates from the local user to avoid feedback loops
    if (
      updateInfo.updaterInfo.connectionId ===
      SessionController.getInstance().getLocalUserInfo().connectionId
    ) {
      return
    }

    switch (key) {
      // Another user moved to a new step — navigate locally
      case RealtimeStoreKeys.STEP:
        const newStep = this.realtimeStore.getInt(key)
        print(`[DataSynchronizationController] received step update: ${newStep}`)
        this.procedureNavigator.goToStep(newStep)
        break

      // Another user checked/unchecked a checklist item — update local checklist UI
      case RealtimeStoreKeys.CHECKLIST_STATE:
        this.procedureNavigator.updateChecklistState(this.realtimeStore.getString(key))
        break

      // Another user picked a branch condition — follow the same path
      case RealtimeStoreKeys.CONDITION_INDEX:
        const conditionIndex = this.realtimeStore.getInt(key)
        if (conditionIndex !== -1) {
          this.procedureNavigator.followCondition(conditionIndex)
        }
        break

      // Another user's timer tick — sync the local timer display
      case RealtimeStoreKeys.TIMER:
        this.procedureNavigator.syncTimer(this.realtimeStore.getFloat(key))
        break
    }
  }
}
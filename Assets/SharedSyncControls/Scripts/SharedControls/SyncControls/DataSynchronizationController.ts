import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {ProcedureNavigator} from "../ProcedureNavigator/ProcedureNavigator"
import {RealtimeStoreKeys} from "./RealtimeStoreKeys"

export class DataSynchronizationController {
  private readonly STORE_ID: string = "SharedProcedureControls"
  private realtimeStore: GeneralDataStore
  private isNewStoreCreated: boolean = false

  constructor(
    private readonly procedureNavigator: ProcedureNavigator
  ) {}

  start() {
    print("[DataSynchronizationController] start() called")
    this.createRealtimeStore(() => {
      print("[DataSynchronizationController] store ready, isNew: " + this.isNewStoreCreated)

      if (this.isNewStoreCreated) {
        // First user — write initial values then start navigator at step 1
        print("[DataSynchronizationController] new store, initializing at step 1")
        this.realtimeStore.putInt(RealtimeStoreKeys.STEP, 1)
        this.realtimeStore.putString(RealtimeStoreKeys.PROCEDURE_NAME, "")
        this.realtimeStore.putString(RealtimeStoreKeys.CHECKLIST_STATE, "")
        this.realtimeStore.putInt(RealtimeStoreKeys.CONDITION_INDEX, -1)
        this.realtimeStore.putFloat(RealtimeStoreKeys.TIMER, 0)

        // Start navigator — first user always starts at step 1
        this.procedureNavigator.start()

      } else {
        // Late joiner — read current state from store and sync to it
        const currentStep = this.realtimeStore.getInt(RealtimeStoreKeys.STEP)
        const checklistState = this.realtimeStore.getString(RealtimeStoreKeys.CHECKLIST_STATE)
        print("[DataSynchronizationController] existing store, syncing to step: " + currentStep)

        // Start navigator first so root is enabled, then jump to current step
        this.procedureNavigator.start()
        this.procedureNavigator.goToStep(currentStep)
        if (checklistState) {
          this.procedureNavigator.updateChecklistState(checklistState)
        }
      }

      // Subscribe to real-time store updates from other users
      SessionController.getInstance().onRealtimeStoreUpdated.add(this.onRealtimeStoreUpdated)

      // Broadcast step changes to other users
      this.procedureNavigator.subscribeOnStepChanged((step) => {
        print("[DataSynchronizationController] broadcasting step: " + step.step)
        this.realtimeStore.putInt(RealtimeStoreKeys.STEP, step.step)
        this.realtimeStore.putString(RealtimeStoreKeys.CHECKLIST_STATE, "")
        this.realtimeStore.putInt(RealtimeStoreKeys.CONDITION_INDEX, -1)
      })

      // Broadcast checklist changes
      this.procedureNavigator.subscribeOnChecklistChanged((checklistState: string) => {
        this.realtimeStore.putString(RealtimeStoreKeys.CHECKLIST_STATE, checklistState)
      })

      // Broadcast condition choices
      this.procedureNavigator.subscribeOnConditionChosen((conditionIndex: number) => {
        this.realtimeStore.putInt(RealtimeStoreKeys.CONDITION_INDEX, conditionIndex)
      })

      // Broadcast timer ticks
      this.procedureNavigator.subscribeOnTimerTick((remaining: number) => {
        this.realtimeStore.putFloat(RealtimeStoreKeys.TIMER, remaining)
      })
    })
  }

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
            print("[DataSynchronizationController] store created")
            this.realtimeStore = store
            onStoreCreated()
          },
          () => {
            print("[DataSynchronizationController] store creation FAILED")
          }
        )
    } else {
      print("[DataSynchronizationController] existing store found")
      onStoreCreated()
    }
  }

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

  private onRealtimeStoreUpdated = (
    session: MultiplayerSession,
    store: GeneralDataStore,
    key: string,
    updateInfo: ConnectedLensModule.RealtimeStoreUpdateInfo
  ) => {
    // Ignore updates from the local user
    if (
      updateInfo.updaterInfo.connectionId ===
      SessionController.getInstance().getLocalUserInfo().connectionId
    ) {
      return
    }

    print("[DataSynchronizationController] received update for key: " + key)

    switch (key) {
      case RealtimeStoreKeys.STEP:
        const newStep = this.realtimeStore.getInt(key)
        print("[DataSynchronizationController] remote step update: " + newStep)
        this.procedureNavigator.goToStep(newStep)
        break

      case RealtimeStoreKeys.CHECKLIST_STATE:
        this.procedureNavigator.updateChecklistState(this.realtimeStore.getString(key))
        break

      case RealtimeStoreKeys.CONDITION_INDEX:
        const conditionIndex = this.realtimeStore.getInt(key)
        if (conditionIndex !== -1) {
          this.procedureNavigator.followCondition(conditionIndex)
        }
        break

      case RealtimeStoreKeys.TIMER:
        this.procedureNavigator.syncTimer(this.realtimeStore.getFloat(key))
        break
    }
  }
}
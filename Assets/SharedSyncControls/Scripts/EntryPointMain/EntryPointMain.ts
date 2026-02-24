import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {DataSynchronizationController} from "../SharedControls/SyncControls/DataSynchronizationController"
import {ProcedureNavigator} from "../SharedControls/ProcedureNavigator/ProcedureNavigator"
import {ProcedureNavigatorInput} from "../SharedControls/ProcedureNavigator/ProcedureNavigatorInput"
import {strokeProcedure} from "../Procedures/stroke"
import {cardiacArrestProcedure} from "../Procedures/cardiacArrest"
import {intubationProcedure} from "../Procedures/intubation"
//import {appleCuttingProcedure} from "../Procedures/appleCutting"

// Enum for selecting a procedure from the Lens Studio inspector.
// To add a new procedure: add an entry here, import its .ts file above,
// and add a case in resolveProcedure() below.
export enum ProcedureIndex {
  STROKE         = 0,
  CARDIAC_ARREST = 1,
  INTUBATION     = 2,
  APPLE_CUTTING  = 3,
}

// The EntryPointMain class initializes the ProcedureNavigator with whichever
// procedure is selected via the inspector, then synchronizes all navigation
// state across users in the session via DataSynchronizationController.
@component
export class EntryPointMain extends BaseScriptComponent {

  // UI scene object bindings for the procedure navigator
  @input
  readonly procedureNavigatorInput: ProcedureNavigatorInput

  // Set this in the Lens Studio inspector to choose which procedure runs:
  //   0 = Stroke Assessment
  //   1 = Cardiac Arrest Management
  //   2 = Intubation
  //   3 = Apple Cutting Task
  @input
  readonly procedureIndex: number = ProcedureIndex.STROKE

  private procedureNavigator: ProcedureNavigator
  private dataSynchronizationController: DataSynchronizationController

  // Lifecycle method called when the component is initialized
  onAwake() {
    print("[EntryPointMain] onAwake called")

    const procedureJson = this.resolveProcedure(this.procedureIndex)
    print("[EntryPointMain] procedureJson resolved")

    this.procedureNavigator = new ProcedureNavigator(
      this.procedureNavigatorInput,
      this,
      procedureJson
    )
    print("[EntryPointMain] ProcedureNavigator created")

    this.dataSynchronizationController = new DataSynchronizationController(
      this.procedureNavigator
    )
    print("[EntryPointMain] DataSynchronizationController created")

    print("[EntryPointMain] calling procedureNavigator.start()")
    this.procedureNavigator.start()
    print("[EntryPointMain] procedureNavigator.start() done")

    SessionController.getInstance().notifyOnReady(() => {
      print("[EntryPointMain] session ready, starting sync")
      this.dataSynchronizationController.start()
    })
  }

  // Starts navigator and sync controller once the session is ready
  private onStart() {
    this.procedureNavigator.start()
    this.dataSynchronizationController.start()
  }

  // Maps a ProcedureIndex value to its procedure data.
  // To add a new procedure: import its .ts file above and add a case here.
  private resolveProcedure(index: number): unknown {
    switch (index) {
      case ProcedureIndex.STROKE:
        print(`[EntryPointMain] Loading: Stroke Assessment`)
        return strokeProcedure
      
      case ProcedureIndex.CARDIAC_ARREST:
        print(`[EntryPointMain] Loading: Cardiac Arrest`)
        return cardiacArrestProcedure

      case ProcedureIndex.INTUBATION:
        print(`[EntryPointMain] Loading: Intubation`)
        return intubationProcedure


      default:
        print(`[EntryPointMain] Unknown procedureIndex: ${index}, defaulting to Stroke Assessment`)
        return strokeProcedure
    }
  }
}
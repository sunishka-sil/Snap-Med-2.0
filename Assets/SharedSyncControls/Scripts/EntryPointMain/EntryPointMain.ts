import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {DataSynchronizationController} from "../SharedControls/SyncControls/DataSynchronizationController"
import {ProcedureNavigator} from "../SharedControls/ProcedureNavigator/ProcedureNavigator"
import {ProcedureNavigatorInput} from "../SharedControls/ProcedureNavigator/ProcedureNavigatorInput"
import {strokeProcedure} from "../Procedures/stroke"
import {cardiacArrestProcedure} from "../Procedures/cardiacArrest"
import {intubationProcedure} from "../Procedures/intubation"
//import {appleCuttingProcedure} from "../Procedures/appleCutting"

export enum ProcedureIndex {
  STROKE         = 0,
  CARDIAC_ARREST = 1,
  INTUBATION     = 2,
  APPLE_CUTTING  = 3,
}

@component
export class EntryPointMain extends BaseScriptComponent {

  @input
  readonly procedureNavigatorInput: ProcedureNavigatorInput

  // Set in inspector: 0=Stroke, 1=Cardiac Arrest, 2=Intubation, 3=Apple Cutting
  @input
  readonly procedureIndex: number = ProcedureIndex.STROKE

  private procedureNavigator: ProcedureNavigator
  private dataSynchronizationController: DataSynchronizationController

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

    // DataSynchronizationController owns calling start() on the navigator
    // so the UI always initialises at the right step for both solo and multiplayer
    SessionController.getInstance().notifyOnReady(() => {
      print("[EntryPointMain] session ready, starting sync")
      this.dataSynchronizationController.start()
    })
  }

  private resolveProcedure(index: number): unknown {
    switch (index) {
      case ProcedureIndex.STROKE:
        print("[EntryPointMain] Loading: Stroke Assessment")
        return strokeProcedure
      case ProcedureIndex.CARDIAC_ARREST:
        print("[EntryPointMain] Loading: Cardiac Arrest Management")
        return cardiacArrestProcedure
      case ProcedureIndex.INTUBATION:
        print("[EntryPointMain] Loading: Intubation")
        return intubationProcedure
      //case ProcedureIndex.APPLE_CUTTING:
        //print("[EntryPointMain] Loading: Apple Cutting Task")
        //return appleCuttingProcedure
      default:
        print("[EntryPointMain] Unknown index: " + index + ", defaulting to Stroke")
        return strokeProcedure
    }
  }
}
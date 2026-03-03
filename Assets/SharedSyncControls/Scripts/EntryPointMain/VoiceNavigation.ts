import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {EntryPointMain} from "./EntryPointMain"

// Runtime handle to start/stop transcribing. The AsrModule *namespace*
// (used below for options/types) is provided globally by Lens Studio.
const asrRuntimeModule = require("LensStudio:AsrModule")

@component
export class VoiceNavigation extends BaseScriptComponent {

  // We resolve EntryPointMain via its static instance to ensure
  // we always talk to the same one that owns the live UI.
  private entryPoint: EntryPointMain | null = null

  private asrModule = asrRuntimeModule

  onAwake(): void {
    print("[VoiceNavigation] onAwake called")

    SessionController.getInstance().notifyOnReady(() => {
      print("[VoiceNavigation] session ready, waiting for EntryPointMain")

      const waitEvent = this.createEvent("UpdateEvent")
      waitEvent.bind(() => {
        const entry = EntryPointMain.getInstance()
        if (!entry) {
          // EntryPointMain.onAwake has not run yet
          return
        }

        if (!entry.isNavigatorReady()) {
          // Navigator not fully initialised yet
          return
        }

        this.entryPoint = entry
        print("[VoiceNavigation] EntryPointMain + navigator ready, starting ASR session")
        this.startAsrSession()
        waitEvent.enabled = false
      })
    })
  }

  private startAsrSession(): void {
    if (!AsrModule || !AsrModule.AsrTranscriptionOptions) {
      print("[VoiceNavigation] AsrModule or AsrTranscriptionOptions is undefined – ASR will NOT run")
      return
    }

    const options = AsrModule.AsrTranscriptionOptions.create()
    options.silenceUntilTerminationMs = 1000
    options.mode = AsrModule.AsrMode.HighAccuracy

    options.onTranscriptionUpdateEvent.add((eventArgs) =>
      this.onTranscriptionUpdate(eventArgs)
    )
    options.onTranscriptionErrorEvent.add((eventArgs) =>
      this.onTranscriptionError(eventArgs)
    )

    print("[VoiceNavigation] Calling startTranscribing()")
    this.asrModule.startTranscribing(options)
    print("[VoiceNavigation] ASR session started")
  }

  private stopAsrSession(): void {
    this.asrModule.stopTranscribing()
    print("[VoiceNavigation] ASR session stopped")
  }

  private onTranscriptionUpdate(eventArgs: AsrModule.TranscriptionUpdateEvent): void {
    // Log every callback so you know if speech is being detected at all.
    // We intentionally ignore eventArgs.isFinal and trigger on ANY update
    // that contains our keywords.
    const rawText = eventArgs.text ? eventArgs.text : ""
    print("[VoiceNavigation] onTranscriptionUpdate raw='" + rawText + "', isFinal=" + eventArgs.isFinal)

    if (!this.entryPoint) {
      print("[VoiceNavigation] Received transcription but entryPoint is missing")
      return
    }

    const text = rawText ? rawText.trim().toLowerCase() : ""
    if (!text) {
      print("[VoiceNavigation] Transcript was empty")
      return
    }

    print("[VoiceNavigation] Final transcription: " + text)

    if (text.indexOf("next") !== -1) {
      print("[VoiceNavigation] Detected keyword 'next'")
      this.entryPoint.goToNextStepFromVoice()
    } else if (text.indexOf("back") !== -1) {
      print("[VoiceNavigation] Detected keyword 'back'")
      this.entryPoint.goToPreviousStepFromVoice()
    }
  }

  private onTranscriptionError(errorCode: AsrModule.AsrStatusCode): void {
    print("[VoiceNavigation] ASR error: " + errorCode)
    switch (errorCode) {
      case AsrModule.AsrStatusCode.InternalError:
        print("[VoiceNavigation] stopTranscribing: Internal Error")
        break
      case AsrModule.AsrStatusCode.Unauthenticated:
        print("[VoiceNavigation] stopTranscribing: Unauthenticated")
        break
      case AsrModule.AsrStatusCode.NoInternet:
        print("[VoiceNavigation] stopTranscribing: No Internet")
        break
      default:
        break
    }
  }

  onDestroy(): void {
    this.stopAsrSession()
  }
}


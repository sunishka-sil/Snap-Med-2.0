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
  private lastFinalTranscript: string = ""

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
    const rawText = eventArgs.text ? eventArgs.text : ""
    // print("[VoiceNavigation] onTranscriptionUpdate raw='" + rawText + "', isFinal=" + eventArgs.isFinal)

    // Only act on FINAL transcripts to avoid multiple triggers
    // from the same utterance while ASR is refining its guess.
    if (!eventArgs.isFinal) {
      return
    }

    if (!this.entryPoint) {
      print("[VoiceNavigation] Received transcription but entryPoint is missing")
      return
    }

    const text = rawText ? rawText.trim().toLowerCase() : ""
    if (!text) {
      print("[VoiceNavigation] Transcript was empty")
      return
    }

    // De-duplicate: if ASR sends the same final text twice in a row,
    // only handle it once.
    if (text === this.lastFinalTranscript) {
      print("[VoiceNavigation] Final transcript unchanged, ignoring duplicate")
      return
    }
    this.lastFinalTranscript = text

    // print("[VoiceNavigation] Final transcription: " + text)

    // Only respond to the standalone words "next" or "back"
    const hasNext = /\bnext\b/.test(text)
    const hasBack = /\bback\b/.test(text)

    if (hasNext && !hasBack) {
      print("[VoiceNavigation] Detected keyword 'next'")
      this.entryPoint.goToNextStepFromVoice()
    } else if (hasBack && !hasNext) {
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


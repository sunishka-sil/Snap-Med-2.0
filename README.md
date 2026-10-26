# SNAP-Med 2.0

**Augmented-reality procedure guidance for medical emergencies, built for Snap Spectacles.**

<!-- DEMO VIDEO: replace the line below with the link GitHub gives you after drag-and-dropping SNAP-med.webm here -->
https://github.com/sunishka-sil/Snap-Med-2.0/blob/c8a7201e03d61602d5837c483e3dc0577c8fbfdc/Assets/SNAP-med.webm

SNAP-Med overlays a step-by-step clinical procedure panel in the wearer's field of view. It is designed so that a team of responders, each wearing Spectacles, can follow the same protocol together in real time. When one person advances a step, ticks off a checklist item or picks a branch, every other headset in the session updates to match. Wearers can move through the procedure hands-free with the voice commands **"next"** and **"back"**.

The project is part of PhD-led research at AIRLab exploring AR use cases in emergency medicine.

---

## Features

- **Data-driven procedures.** Each protocol is a plain TypeScript/JSON object made of steps, checklists, reminders, timers and branches, so new procedures can be added without touching the UI code.
- **Branching logic.** A step can offer up to three condition buttons (for example, "shockable rhythm" vs. "non-shockable") that route to different next steps.
- **Interactive checklists.** Tap an item to mark it done (it turns green). Checklist state is shared across the session.
- **Step timers.** A countdown runs on steps that need timing (such as a CPR cycle or an arm-drift test) and shows a completion label when it ends.
- **Contextual reminders.** A hint line gives quick clinical tips for the current step.
- **Multi-device sync.** Built on Spectacles Sync Kit's real-time store. The first user starts the session at step 1, and anyone who joins later is brought straight to the current step and checklist state.
- **Voice navigation.** Uses Lens Studio's ASR module (high-accuracy mode) and responds only to final transcripts containing the standalone words "next" or "back".
- **Minimise / restore.** The panel can be collapsed out of the way and brought back.
- **Schema validation.** Procedures are validated on load, and clear errors are logged if a file is malformed.

## Included procedures

| Index | Procedure | Steps |
|---|---|---|
| 0 | Stroke Assessment (FAST) | 7 |
| 1 | Cardiac Arrest Management | 11 |
| 2 | Intubation Procedure | 13 |
| 3 | Apple Preparation *(non-clinical demo for user studies)* | 4 |

`initiateALL.ts` also defines a combined "Medical Training Simulator" with a home menu that branches into all four procedures. It is not wired into `EntryPointMain` yet.

---

## Tech stack

- **Lens Studio 5.15** (TypeScript components)
- **Snap Spectacles**
- [Spectacles Interaction Kit](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/get-started) for hand interaction
- [Spectacles UI Kit](https://developers.snap.com/spectacles) for buttons (`RectangleButton`)
- [Spectacles Sync Kit](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-sync-kit/getting-started) for multiplayer sessions and real-time stores
- LSTween and the Liquid Glass UI Pack for UI animation and styling
- Lens Studio `AsrModule` for speech recognition

## Project structure

```
Assets/
├── Scene.scene                          # Main Lens scene
└── SharedSyncControls/
    ├── Assets/                          # Materials, shaders and textures for the UI
    └── Scripts/
        ├── EntryPointMain/
        │   ├── EntryPointMain.ts        # Loads the chosen procedure, wires navigator + sync
        │   └── VoiceNavigation.ts       # "next" / "back" voice commands via ASR
        ├── SharedControls/
        │   ├── ProcedureNavigator/
        │   │   ├── ProcedureNavigator.ts       # Step rendering, buttons, timers, history
        │   │   ├── ProcedureNavigatorInput.ts  # Inspector bindings for all UI elements
        │   │   ├── ProcedureTypes.ts           # Procedure / step / tool type definitions
        │   │   └── ProcedureValidator.ts       # Runtime schema validation
        │   └── SyncControls/
        │       ├── DataSynchronizationController.ts  # Real-time store read/write
        │       └── RealtimeStoreKeys.ts              # Keys shared across devices
        └── Procedures/                  # stroke, cardiacArrest, intubation, apple, initiateALL
Packages/                                # Spectacles Interaction, UI and Sync Kits, LSTween
```

### How it fits together

1. `EntryPointMain` reads `procedureIndex` from the Inspector, loads that procedure and creates a `ProcedureNavigator` plus a `DataSynchronizationController`.
2. When the Sync Kit session is ready, the sync controller either creates the shared store (first user, starts at step 1) or reads the existing one (later joiners jump to the current step).
3. Local actions such as step changes, checklist toggles, branch choices and timer ticks are written to the store. Updates from other users are applied to the local navigator, and the user's own echoes are ignored.
4. `VoiceNavigation` waits until the navigator is ready, starts ASR and calls the same next/back handlers that the buttons use.

---

## Getting started

### Prerequisites

- [Lens Studio](https://ar.snap.com/lens-studio) **5.15 or later**
- [Git LFS](https://git-lfs.com/). All files under `Assets/` and `Packages/` are stored with LFS.
- Snap Spectacles paired with your Lens Studio account (optional; the Preview panel works for most testing)

### Setup

```bash
git lfs install
git clone https://github.com/sunishka-sil/Snap-Med-2.0.git
cd Snap-Med-2.0
git lfs pull
```

1. Open `SharedSyncControls.esproj` in Lens Studio.
2. In the Scene Hierarchy, select the object with the **EntryPointMain** component.
3. Set **Procedure Index** to the procedure you want: `0` Stroke, `1` Cardiac Arrest, `2` Intubation, `3` Apple Preparation.
4. Check that every field on **ProcedureNavigatorInput** is assigned (text components, buttons and root objects). Missing bindings are logged in the Logger panel.
5. Preview in Lens Studio, or push to Spectacles.

### Testing multiplayer

To test sync, use Lens Studio's multi-user preview or push the Lens to two or more pairs of Spectacles and join the same session. Advancing a step or ticking an item on one device should appear on the others straight away.

> Voice navigation needs an internet connection on device. ASR errors such as `NoInternet` and `Unauthenticated` are printed to the Logger.

---

## Adding a new procedure

1. Create `Assets/SharedSyncControls/Scripts/Procedures/myProcedure.ts`:

```ts
export const myProcedure = {
  procedure: "My Procedure",
  steps: [
    {
      step: 1,
      action: "Prepare",
      tool: {
        checklist: { items: ["Gather equipment", "Confirm patient identity"] },
        reminder:  { items: ["Wash hands before starting."] },
        timer: [{ label: "Prep time", duration: 30, onComplete: "Time's up", persist: false }]
      },
      next: [{ condition: "", next: 2 }]
    },
    {
      step: 2,
      action: "Assess",
      next: [
        { condition: "Stable",   next: 3 },
        { condition: "Unstable", next: "DONE" }
      ]
    },
    {
      step: 3,
      action: "Finish",
      next: [{ condition: "", next: "DONE" }]
    }
  ]
}
```

2. Import it in `EntryPointMain.ts`, add a value to the `ProcedureIndex` enum and add a matching `case` in `resolveProcedure()`.

### Procedure schema

| Field | Type | Notes |
|---|---|---|
| `procedure` | `string` | Display name (required) |
| `steps[].step` | `number` | Unique step ID |
| `steps[].action` | `string` | Shown as "Step N: Action" |
| `steps[].tool.checklist.items` | `string[]` | Optional |
| `steps[].tool.reminder.items` | `string[]` | Optional, joined with `\|` |
| `steps[].tool.timer[]` | `{ label, duration, onComplete, persist }` | Optional; only the first timer is used |
| `steps[].next[]` | `{ condition, next }` | One entry = linear Next button; 2–3 entries = branch buttons; `next: "DONE"` ends the procedure |

---

## Disclaimer

SNAP-Med is a research prototype. It is **not** a certified medical device, and its procedures are not a substitute for clinical training or official protocols.

## Acknowledgements

Developed for AIRLab's research on augmented reality in emergency medicine. Built with Snap's Spectacles frameworks.

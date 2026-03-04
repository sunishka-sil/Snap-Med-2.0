export const procedureData = {
  procedure: "Medical Training Simulator",
  steps: [

    // ─── HOME (0) ──────────────────────────────────────────────────────────
    {
      step: 0,
      action: "Welcome — Choose a Procedure",
      tool: {
        reminder: {
          items: ["Select a procedure below to begin training."]
        }
      },
      next: [
        { condition: "Stroke Assessment",    next: 100 },
        { condition: "Cardiac Arrest",       next: 200 },
        { condition: "Intubation",           next: 300 },
        { condition: "Apple Cutting Task",   next: 400 }
      ]
    },

    // ─── STROKE (100-106) ─────────────────────────────────────────────────
    {
      step: 100,
      action: "Introduction",
      tool: {
        checklist: {
          items: [
            "Introduce yourself and your role",
            "Explain assessment to patient (e.g., 'I will be checking for signs of stroke')"
          ]
        },
        reminder: { items: ["Maintain eye contact and speak calmly."] }
      },
      next: [{ condition: "", next: 101 }]
    },
    {
      step: 101,
      action: "Facial Droop (F)",
      tool: {
        checklist: {
          items: [
            "Ask patient to smile or show teeth",
            "Observe for facial asymmetry or unilateral drooping"
          ]
        },
        reminder: { items: ["Look for uneven smile, eyelid droop, or flattening on one side."] }
      },
      next: [{ condition: "", next: 102 }]
    },
    {
      step: 102,
      action: "Arm Drift (A)",
      tool: {
        checklist: {
          items: [
            "Ask patient to raise both arms",
            "Ensure palms are facing up",
            "Hold for 10 seconds"
          ]
        },
        timer: [{
          label: "Arm Drift Assessment",
          duration: 10,
          onComplete: "Assess for drift",
          persist: false
        }],
        reminder: { items: ["Watch for one arm drifting downward or pronating."] }
      },
      next: [{ condition: "", next: 103 }]
    },
    {
      step: 103,
      action: "Speech (S)",
      tool: {
        checklist: {
          items: [
            "Ask patient to repeat a simple phrase (e.g., 'The sky is blue')",
            "Assess for slurred speech, aphasia, or inability to speak"
          ]
        },
        reminder: { items: ["If unclear, ask patient to name a simple object or follow a one-step command."] }
      },
      next: [{ condition: "", next: 104 }]
    },
    {
      step: 104,
      action: "Time Last Known Well (T)",
      tool: {
        checklist: {
          items: [
            "Ask: 'What time did the symptoms start?'",
            "Ask: 'When was the patient last known to be normal?'"
          ]
        },
        reminder: { items: ["Record exact clock time whenever possible."] }
      },
      next: [{ condition: "", next: 105 }]
    },
    {
      step: 105,
      action: "Blood Glucose Check",
      tool: {
        checklist: {
          items: [
            "Check blood glucose OR verbalize need to check immediately",
            "Interpret result"
          ]
        },
        reminder: { items: ["Hypoglycemia can mimic stroke."] }
      },
      next: [{ condition: "", next: 106 }]
    },
    {
      step: 106,
      action: "Medication & Team Summary",
      tool: {
        checklist: {
          items: [
            "Ask about anticoagulant (blood thinner) use",
            "Verbalize FAST findings",
            "Verbalize last known well time",
            "Communicate glucose result to team/recording"
          ]
        }
      },
      next: [{ condition: "Complete — Return Home", next: 0 }]
    },

    // ─── CARDIAC ARREST (200-210) ─────────────────────────────────────────
    {
      step: 200,
      action: "Initial Safety & Assessment",
      tool: {
        checklist: {
          items: [
            "Check for responsiveness",
            "Bring AED to the bedside",
            "Position backboard behind patient"
          ]
        },
        reminder: { items: ["Ensure mannequin is on a firm surface before starting compressions."] }
      },
      next: [{ condition: "Unresponsive", next: 201 }]
    },
    {
      step: 201,
      action: "Pulse & Breathing Check",
      tool: {
        checklist: {
          items: [
            "Assess pulse (no more than 10 seconds)",
            "Assess for normal breathing"
          ]
        },
        timer: [{
          label: "Pulse Check (Max 10 Seconds)",
          duration: 10,
          onComplete: "Begin CPR if no pulse",
          persist: false
        }],
        reminder: { items: ["Agonal gasps are NOT normal breathing."] }
      },
      next: [
        { condition: "No Pulse / Abnormal Breathing", next: 202 },
        { condition: "Pulse Present",                 next: 210 }
      ]
    },
    {
      step: 202,
      action: "Begin CPR",
      tool: {
        checklist: {
          items: [
            "Start compressions (30:2 ratio)",
            "Compress at 100-120 per minute",
            "Compress depth 2-2.4 inches (5-6 cm)",
            "Allow the chest to fully rise before the next compression"
          ]
        },
        reminder: { items: ["Minimize interruptions in compressions."] }
      },
      next: [{ condition: "AED Arrives", next: 203 }]
    },
    {
      step: 203,
      action: "AED Setup",
      tool: {
        checklist: {
          items: [
            "Turn on AED",
            "Apply pads (continue compressions if possible)",
            "Connect pads to AED"
          ]
        },
        reminder: { items: ["Do not delay compressions while preparing AED."] }
      },
      next: [{ condition: "Ready to Analyze", next: 204 }]
    },
    {
      step: 204,
      action: "Rhythm Analysis",
      tool: {
        checklist: {
          items: [
            "Stop compressions",
            "Ensure everyone is clear of patient",
            "Analyze rhythm"
          ]
        }
      },
      next: [
        { condition: "Shockable (VF/pVT)",           next: 205 },
        { condition: "Non-Shockable (Asystole/PEA)", next: 206 }
      ]
    },
    {
      step: 205,
      action: "Deliver Shock",
      tool: {
        checklist: {
          items: [
            "Clear patient",
            "Deliver shock",
            "Immediately resume compressions (do not check pulse)"
          ]
        }
      },
      next: [{ condition: "Resume CPR", next: 206 }]
    },
    {
      step: 206,
      action: "CPR Cycle (2 Minutes)",
      tool: {
        checklist: {
          items: [
            "Perform high-quality compressions",
            "Switch compressor if available",
            "Confirm IV access",
            "Administer Epinephrine every 3-5 minutes"
          ]
        },
        timer: [{
          label: "2-Minute CPR Cycle",
          duration: 120,
          onComplete: "Stop for rhythm check",
          persist: true
        }],
        reminder: {
          items: [
            "IV access is already available on the mannequin. Check the arm.",
            "Avoid pauses longer than 10 seconds."
          ]
        }
      },
      next: [{ condition: "Cycle Complete", next: 207 }]
    },
    {
      step: 207,
      action: "Rhythm & Pulse Check",
      tool: {
        checklist: {
          items: [
            "Stop compressions",
            "Check rhythm",
            "Check pulse if organized rhythm",
            "Switch compressor"
          ]
        }
      },
      next: [
        { condition: "Shockable",     next: 208 },
        { condition: "Non-Shockable", next: 209 },
        { condition: "ROSC",          next: 210 }
      ]
    },
    {
      step: 208,
      action: "Shock Delivery",
      tool: {
        checklist: {
          items: [
            "Clear patient",
            "Deliver shock",
            "Resume compressions immediately"
          ]
        }
      },
      next: [{ condition: "Resume CPR", next: 209 }]
    },
    {
      step: 209,
      action: "Resume CPR / Medications",
      tool: {
        checklist: {
          items: [
            "Resume high-quality compressions",
            "Continue medication timing"
          ]
        }
      },
      next: [{ condition: "Next Cycle", next: 206 }]
    },
    {
      step: 210,
      action: "Post-ROSC Care",
      tool: {
        checklist: {
          items: [
            "Monitor vital signs",
            "Maintain SpO2 between 92-98%",
            "Treat hypotension (fluids/pressors as indicated)"
          ]
        },
        reminder: { items: ["Avoid hyperventilation."] }
      },
      next: [{ condition: "Complete — Return Home", next: 0 }]
    },

    // ─── INTUBATION (300-311) ─────────────────────────────────────────────
    {
      step: 300,
      action: "Initial Setup",
      tool: {
        checklist: {
          items: [
            "Bring airway equipment to bedside",
            "Check baseline SpO2 on the monitor"
          ]
        },
        reminder: {
          items: [
            "Baseline SpO2 before any intervention should be around 80%.",
            "Say: 'I am preparing to secure the airway.'",
            "Ensure all necessary equipment is ready before starting."
          ]
        }
      },
      next: [{ condition: "", next: 301 }]
    },
    {
      step: 301,
      action: "Open and Prepare the Airway",
      tool: {
        checklist: {
          items: [
            "Tilt head back and lift chin",
            "Insert an appropriately sized OPA",
            "Provide oxygen using mask and bag",
            "Re-check SpO2 after ventilation"
          ]
        },
        reminder: {
          items: [
            "Measure OPA from the corner of the mouth to the angle of the jaw.",
            "After OPA and bagging, SpO2 should rise to around 85%."
          ]
        }
      },
      next: [
        { condition: "Improved",   next: 302 },
        { condition: "Low SpO2",   next: 311 },
        { condition: "Awake",      next: 308 }
      ]
    },
    {
      step: 302,
      action: "Prepare Tube and Give Medication",
      tool: {
        checklist: {
          items: [
            "Confirm IV access (already present on mannequin arm)",
            "Check that the breathing tube cuff inflates",
            "Give sleep medication",
            "Give paralysis medication"
          ]
        },
        timer: [{
          label: "Medication Onset (Wait for Relaxation)",
          duration: 60,
          onComplete: "Check jaw relaxation before attempting",
          persist: false
        }],
        reminder: {
          items: [
            "Do not attempt intubation until the jaw is relaxed.",
            "Continue monitoring oxygen levels."
          ]
        }
      },
      next: [{ condition: "", next: 303 }]
    },
    {
      step: 303,
      action: "Intubation Attempt",
      tool: {
        checklist: {
          items: [
            "Insert laryngoscope",
            "Look for vocal cords",
            "Insert breathing tube through cords",
            "Inflate cuff",
            "Attach bag and give breaths"
          ]
        },
        timer: [{
          label: "Attempt Time Limit",
          duration: 30,
          onComplete: "Stop attempt and re-oxygenate",
          persist: false
        }],
        reminder: {
          items: [
            "Limit each attempt to 30 seconds.",
            "If oxygen drops, stop and give breaths with mask."
          ]
        }
      },
      next: [
        { condition: "Success", next: 307 },
        { condition: "Fail",    next: 304 }
      ]
    },
    {
      step: 304,
      action: "Failed Attempt — Re-oxygenate",
      tool: {
        checklist: {
          items: [
            "Remove tube",
            "Resume mask ventilation (two hands if possible)",
            "Adjust head position",
            "Ensure chest rises with each breath",
            "Re-check SpO2 while ventilating"
          ]
        },
        reminder: { items: ["Oxygenation is more important than repeated attempts."] }
      },
      next: [
        { condition: "Good Ventilation", next: 311 },
        { condition: "Poor Ventilation", next: 305 }
      ]
    },
    {
      step: 305,
      action: "Insert Rescue Airway Device",
      tool: {
        checklist: {
          items: [
            "Insert supraglottic airway device (LMA or i-gel)",
            "Give breaths",
            "Look for chest rise",
            "Re-check SpO2"
          ]
        }
      },
      next: [
        { condition: "Good Ventilation", next: 311 },
        { condition: "Cannot Ventilate", next: 306 }
      ]
    },
    {
      step: 306,
      action: "Emergency Surgical Airway",
      tool: {
        checklist: {
          items: [
            "Say out loud: 'Cannot intubate, cannot ventilate'",
            "Perform emergency surgical airway procedure",
            "Insert tube",
            "Give breaths",
            "Re-check SpO2"
          ]
        },
        reminder: {
          items: [
            "This is a life-threatening emergency.",
            "Act quickly and clearly."
          ]
        }
      },
      next: [
        { condition: "Success", next: 307 },
        { condition: "Fail",    next: 310 }
      ]
    },
    {
      step: 307,
      action: "Confirm Tube Placement",
      tool: {
        checklist: {
          items: [
            "Check for consistent chest rise",
            "Secure the tube",
            "Start sedation",
            "Check SpO2 after intubation"
          ]
        },
        reminder: {
          items: [
            "After successful intubation, SpO2 should rise to around 99%.",
            "Say out loud: 'Tube confirmed and secured.'",
            "Document tube depth if markings are available."
          ]
        }
      },
      next: [{ condition: "Complete — Return Home", next: 0 }]
    },
    {
      step: 308,
      action: "Awake Intubation Strategy",
      tool: {
        checklist: {
          items: [
            "Explain procedure to patient",
            "Apply numbing medication to airway",
            "Prepare flexible scope",
            "Ensure backup plan is ready"
          ]
        }
      },
      next: [{ condition: "", next: 309 }]
    },
    {
      step: 309,
      action: "Awake Attempt Result",
      next: [
        { condition: "Success", next: 307 },
        { condition: "Fail",    next: 311 }
      ]
    },
    {
      step: 310,
      action: "Failure Management",
      tool: {
        checklist: {
          items: [
            "Maximize oxygen delivery",
            "Reattempt emergency airway if possible"
          ]
        }
      },
      next: [{ condition: "Complete — Return Home", next: 0 }]
    },
    {
      step: 311,
      action: "Ventilating — Decide Next Action",
      tool: {
        checklist: {
          items: [
            "Continue giving oxygen",
            "Confirm chest rise with ventilation",
            "Confirm SpO2 is improving or stable",
            "Reassess next airway plan"
          ]
        },
        reminder: {
          items: [
            "Do not retry until oxygenation is stable.",
            "If SpO2 remains low, continue ventilation before attempting again."
          ]
        }
      },
      next: [
        { condition: "Retry Intubation", next: 303 },
        { condition: "Stop",             next: 0   }
      ]
    },

    // ─── APPLE CUTTING (400-403) ──────────────────────────────────────────
    {
      step: 400,
      action: "Get the Apple",
      tool: {
        checklist: {
          items: [
            "Use voice command to continue to the next step",
            "Reach for the apple"
          ]
        },
        reminder: { items: ["Verbally state what you are about to do."] }
      },
      next: [{ condition: "Apple Acquired", next: 401 }]
    },
    {
      step: 401,
      action: "Get the Knife",
      tool: {
        checklist: {
          items: [
            "Use hand gestures to continue to the next step",
            "Obtain the knife"
          ]
        },
        reminder: { items: ["Verbally state what you are about to do."] }
      },
      next: [{ condition: "Knife Acquired", next: 402 }]
    },
    {
      step: 402,
      action: "Cut the Apple",
      tool: {
        checklist: {
          items: ["Cut the apple using the knife"]
        },
        timer: [{
          label: "Cutting Duration",
          duration: 20,
          onComplete: "Cut Complete",
          persist: false
        }],
        reminder: { items: ["Verbally state what you are about to do."] }
      },
      next: [{ condition: "Cut Complete", next: 403 }]
    },
    {
      step: 403,
      action: "Place Apple on Plate",
      tool: {
        checklist: {
          items: ["Place sliced apple onto plate"]
        },
        reminder: { items: ["Verbally state what you are about to do."] }
      },
      next: [
        { condition: "Cut Another Apple",    next: 400 },
        { condition: "Complete — Return Home", next: 0 }
      ]
    }
  ]
}
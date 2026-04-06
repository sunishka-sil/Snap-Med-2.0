export const cardiacArrestProcedure = {
  "procedure": "Cardiac Arrest Management",
  "steps": [
    {
      "step": 1,
      "action": "Initial Safety & Assessment",
      "tool": {
        "checklist": {
          "items": [
            "Check for responsiveness",
            "Bring AED to the bedside",
            "Position backboard behind patient"
          ]
        },
        "reminder": {
          "items": [
            "Ensure mannequin is on a firm surface before starting compressions."
          ]
        }
      },
      "next": [
        {
          "condition": "Unresponsive",
          "next": 2
        }
      ]
    },
    {
      "step": 2,
      "action": "Pulse & Breathing Check",
      "tool": {
        "checklist": {
          "items": [
            "Assess pulse (no more than 10 seconds)",
            "Assess for normal breathing"
          ]
        },
        "timer": [
          {
            "label": "Pulse Check (Max 10 Seconds)",
            "duration": 10,
            "onComplete": "Begin CPR if no pulse",
            "persist": false
          }
        ],
        "reminder": {
          "items": [
            "Agonal gasps are NOT normal breathing."
          ]
        }
      },
      "next": [
        {
          "condition": "No Pulse / Abnormal Breathing",
          "next": 3
        },
        {
          "condition": "Pulse Present",
          "next": "DONE"
        }
      ]
    },
    {
      "step": 3,
      "action": "Begin CPR",
      "tool": {
        "checklist": {
          "items": [
            "Start compressions (30:2 ratio)",
            "Compress at 100-120 per minute",
            "Compress depth 2-2.4 inches (5-6 cm)",
            "Allow the chest to fully rise before the next compression"
          ]
        },
        "reminder": {
          "items": [
            "Minimize interruptions in compressions."
          ]
        }
      },
      "next": [
        {
          "condition": "AED Arrives",
          "next": 4
        }
      ]
    },
    {
      "step": 4,
      "action": "AED Setup",
      "tool": {
        "checklist": {
          "items": [
            "Turn on AED",
            "Apply pads (continue compressions if possible)",
            "Connect pads to AED"
          ]
        },
        "reminder": {
          "items": [
            "Do not delay compressions while preparing AED."
          ]
        }
      },
      "next": [
        {
          "condition": "Ready to Analyze",
          "next": 5
        }
      ]
    },
    {
      "step": 5,
      "action": "Rhythm Analysis",
      "tool": {
        "checklist": {
          "items": [
            "Stop compressions",
            "Ensure everyone is clear of patient",
            "Analyze rhythm"
          ]
        }
      },
      "next": [
        {
          "condition": "Shockable (VF/pVT)",
          "next": 6
        },
        {
          "condition": "Non-Shockable (Asystole/PEA)",
          "next": 7
        }
      ]
    },
    {
      "step": 6,
      "action": "Deliver Shock",
      "tool": {
        "checklist": {
          "items": [
            "Clear patient",
            "Deliver shock",
            "Immediately resume compressions (do not check pulse)"
          ]
        }
      },
      "next": [
        {
          "condition": "Resume CPR",
          "next": 7
        }
      ]
    },
    {
      "step": 7,
      "action": "CPR Cycle (2 Minutes)",
      "tool": {
        "checklist": {
          "items": [
            "Perform high-quality compressions",
            "Switch compressor if available",
            "Confirm IV access",
            "Administer Epinephrine every 3-5 minutes"
          ]
        },
        "timer": [
          {
            "label": "2-Minute CPR Cycle",
            "duration": 120,
            "onComplete": "Stop for rhythm check",
            "persist": true
          }
        ],
        "reminder": {
          "items": [
            "IV access is available, Check the arm.",
            "Avoid pauses longer than 10 seconds."
          ]
        }
      },
      "next": [
        {
          "condition": "Cycle Complete",
          "next": 8
        }
      ]
    },
    {
      "step": 8,
      "action": "Rhythm & Pulse Check",
      "tool": {
        "checklist": {
          "items": [
            "Stop compressions",
            "Check rhythm",
            "Check pulse if organized rhythm",
            "Switch compressor"
          ]
        }
      },
      "next": [
        {
          "condition": "Shockable",
          "next": 9
        },
        {
          "condition": "Non-Shockable",
          "next": 10
        },
        {
          "condition": "ROSC (Resumed Cardiac Activity)",
          "next": 11
        }
      ]
    },
    {
      "step": 9,
      "action": "Shock Delivery",
      "tool": {
        "checklist": {
          "items": [
            "Clear patient",
            "Deliver shock",
            "Resume compressions immediately"
          ]
        }
      },
      "next": [
        {
          "condition": "Resume CPR",
          "next": 10
        }
      ]
    },
    {
      "step": 10,
      "action": "Resume CPR / Medications",
      "tool": {
        "checklist": {
          "items": [
            "Resume high-quality compressions",
            "Continue medication timing"
          ]
        }
      },
      "next": [
        {
          "condition": "Next Cycle",
          "next": 7
        }
      ]
    },
    {
      "step": 11,
      "action": "Post-ROSC Care",
      "tool": {
        "checklist": {
          "items": [
            "Monitor vital signs",
            "Maintain SpO2 between 92-98%",
            "Treat hypotension (fluids/pressors as indicated)"
          ]
        },
        "reminder": {
          "items": [
            "Avoid hyperventilation."
          ]
        }
      },
      "next": [
        {
          "condition": "Complete",
          "next": "DONE"
        }
      ]
    }
  ]
}

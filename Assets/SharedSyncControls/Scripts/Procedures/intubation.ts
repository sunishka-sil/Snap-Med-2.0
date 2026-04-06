export const intubationProcedure = {
  "procedure": "Intubation Procedure",
  "steps": [
    {
      "step": 1,
      "action": "Initial Setup",
      "tool": {
        "checklist": {
          "items": [
            "Bring airway equipment to bedside",
            "Check baseline SpO2 on the monitor", 
            "Confirm baseline Sp02 is around 80% before intervention", 
            "Verbalise: 'I am preparing to secure the airway'", 
            "Ensure all necessary equipment is ready before starting."
          ]
        },
        "reminder": {
          "items": [
            
          ]
        }
      },
      "next": [
        { "condition": "", "next": 2 }
      ]
    },
    {
      "step": 2,
      "action": "Open and Prepare the Airway",
      "tool": {
        "checklist": {
          "items": [
            "Tilt head back and lift chin",
            "Insert an appropriately sized OPA",
            "Provide oxygen using mask and bag",
            "Re-check SpO2 after ventilation (should be ~85%)"
          ]
        },
        "reminder": {
          "items": [
            "Measure OPA from the corner of the mouth to the angle of the jaw."
          ]
        }
      },
      "next": [
        { "condition": "improved", "next": 3 },
        { "condition": "low", "next": 12 },
        { "condition": "awake", "next": 9 }
      ]
    },
    {
      "step": 3,
      "action": "Prepare Tube and Give Medication",
      "tool": {
        "checklist": {
          "items": [
            "Confirm IV access (already present on mannequin arm)",
            "Check that the breathing tube cuff inflates",
            "Give sleep medication",
            "Give paralysis medication"
          ]
        },
        "timer": [
          {
            "label": "Medication Onset (Wait for Relaxation)",
            "duration": 60,
            "onComplete": "Check jaw relaxation before attempting",
            "persist": false
          }
        ],
        "reminder": {
          "items": [
            "Do not attempt intubation until jaw is relaxed.",
            "Continue monitoring O2 levels."
          ]
        }
      },
      "next": [
        { "condition": "", "next": 4 }
      ]
    },
    {
      "step": 4,
      "action": "Intubation Attempt",
      "tool": {
        "checklist": {
          "items": [
            "Insert laryngoscope",
            "Look for vocal cords",
            "Insert breathing tube through cords",
            "Inflate cuff",
            "Attach bag and give breaths"
          ]
        },
        "timer": [
          {
            "label": "Attempt Time Limit",
            "duration": 30,
            "onComplete": "Stop attempt and re-oxygenate",
            "persist": false
          }
        ],
        "reminder": {
          "items": [
            "Limit each attempt to 30 seconds.",
            "If oxygen drops, stop and give breaths with mask."
          ]
        }
      },
      "next": [
        { "condition": "Success", "next": 8 },
        { "condition": "Fail", "next": 5 }
      ]
    },
    {
      "step": 5,
      "action": "If Attempt Fails - Re-oxygenate",
      "tool": {
        "checklist": {
          "items": [
            "Remove tube",
            "Resume mask ventilation (two hands if possible)",
            "Adjust head position",
            "Ensure chest rises with each breath",
            "Re-check SpO2 while ventilating"
          ]
        },
        "reminder": {
          "items": [
            "Oxygenation is more important than repeated attempts."
          ]
        }
      },
      "next": [
        { "condition": "Good Ventilation", "next": 12 },
        { "condition": "Poor Ventilation", "next": 6 }
      ]
    },
    {
      "step": 6,
      "action": "Insert Rescue Airway Device",
      "tool": {
        "checklist": {
          "items": [
            "Insert supraglottic airway device (LMA or i-gel)",
            "Give breaths",
            "Look for chest rise",
            "Re-check SpO2"
          ]
        }
      },
      "next": [
        { "condition": "Good Ventilation", "next": 12 },
        { "condition": "Cannot Ventilate", "next": 7 }
      ]
    },
    {
      "step": 7,
      "action": "Emergency Surgical Airway",
      "tool": {
        "checklist": {
          "items": [
            "Say out loud: 'Cannot intubate, cannot ventilate'",
            "Perform emergency surgical airway procedure",
            "Insert tube",
            "Give breaths",
            "Re-check SpO2"
          ]
        },
        "reminder": {
          "items": [
            "This is a life-threatening emergency.",
            "Act quickly and clearly."
          ]
        }
      },
      "next": [
        { "condition": "Success", "next": 8 },
        { "condition": "Fail", "next": 11 }
      ]
    },
    {
      "step": 8,
      "action": "Confirm Tube Placement",
      "tool": {
        "checklist": {
          "items": [
            "Check for consistent chest rise",
            "Secure the tube",
            "Say out loud: 'Tube Confirmed and Secured'",
            "Start sedation",
            "Check SpO2 after successful intubation (should rise to ~99%)"
          ]
        },
        "reminder": {
          "items": [
            "Document tube depth if markings are available."
          ]
        }
      },
      "next": [
        { "condition": "", "next": "DONE" }
      ]
    },
    {
      "step": 9,
      "action": "Awake Intubation Strategy",
      "tool": {
        "checklist": {
          "items": [
            "Explain procedure to patient",
            "Apply numbing medication to airway",
            "Prepare flexible scope",
            "Ensure backup plan is ready"
          ]
        }
      },
      "next": [
        { "condition": "", "next": 10 }
      ]
    },
    {
      "step": 10,
      "action": "Awake Attempt Result",
      "next": [
        { "condition": "Success", "next": 8 },
        { "condition": "Fail", "next": 12 }
      ]
    },
    {
      "step": 11,
      "action": "Failure Management",
      "tool": {
        "checklist": {
          "items": [
            "Maximize oxygen delivery",
            "Reattempt emergency airway if possible"
          ]
        }
      },
      "next": [
        { "condition": "", "next": "DONE" }
      ]
    },
    {
      "step": 12,
      "action": "Ventilating - Decide Next Action",
      "tool": {
        "checklist": {
          "items": [
            "Continue giving oxygen",
            "Confirm chest rise with ventilation",
            "Confirm SpO2 is improving or stable",
            "Reassess next airway plan",
            "Do not retry until oxygenation is stable.",
          ]
        },
        "reminder": {
          "items": [
            "If SpO2 remains low, continue ventilation before attempting again."
          ]
        }
      },
      "next": [
        { "condition": "Retry Intubation", "next": 4 },
        { "condition": "Stop", "next": "DONE" }
      ]
    }
  ]
}


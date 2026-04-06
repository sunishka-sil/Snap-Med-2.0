export const strokeProcedure = {
  "procedure": "Stroke Assessment (FAST)",
  "steps": [
    {
      "step": 1,
      "action": "Introduction",
      "tool": { 
        "checklist": {
          "items": [
            "Introduce yourself and your role",
            "Explain assessment to patient",
            "(e.g., 'I will be checking for signs of stroke')"
          ]
        },
        "reminder": {
          "items": [
            "Maintain eye contact and speak calmly."
          ]
        }
      },
      "next": [
        {
          "condition": "",
          "next": 2
        }
      ]
    },
    {
      "step": 2,
      "action": "Facial Droop (F)",
      "tool": {
        "checklist": {
          "items": [
            "Ask patient to smile or show teeth",
            "Observe for facial asymmetry or unilateral drooping"
          ]
        },
        "reminder": {
          "items": [
            "Look for uneven smile, eyelid droop, or flattening on one side."
          ]
        }
      },
      "next": [
        {
          "condition": "",
          "next": 3
        }
      ]
    },
    {
      "step": 3,
      "action": "Arm Drift (A)",
      "tool": {
        "checklist": {
          "items": [
            "Ask patient to raise both arms",
            "Ensure palms are facing up",
            "Hold for 10 seconds"
          ]
        },
        "timer": [
          {
            "label": "Arm Drift Assessment",
            "duration": 10,
            "onComplete": "Assess for drift",
            "persist": false
          }
        ],
        "reminder": {
          "items": [
            "Watch for one arm drifting downward or pronating."
          ]
        }
      },
      "next": [
        {
          "condition": "",
          "next": 4
        }
      ]
    },
    {
      "step": 4,
      "action": "Speech (S)",
      "tool": {
        "checklist": {
          "items": [
            "Ask patient to repeat a simple phrase (e.g., 'The sky is blue')",
            "Assess for slurred speech, aphasia, or inability to speak"
          ]
        },
        "reminder": {
          "items": [
            "If unclear, ask patient to name a simple object or follow a one-step command."
          ]
        }
      },
      "next": [
        {
          "condition": "",
          "next": 5
        }
      ]
    },
    {
      "step": 5,
      "action": "Time Last Known Well (T)",
      "tool": {
        "checklist": {
          "items": [
            "Ask: 'What time did the symptoms start?'",
            "Ask: 'When was the patient last known to be normal?'"
          ]
        },
        "reminder": {
          "items": [
            "Record exact clock time whenever possible."
          ]
        }
      },
      "next": [
        {
          "condition": "",
          "next": 6
        }
      ]
    },
    {
      "step": 6,
      "action": "Blood Glucose Check",
      "tool": {
        "checklist": {
          "items": [
            "Check blood glucose OR verbalize need to check immediately",
            "Interpret result"
          ]
        },
        "reminder": {
          "items": [
            "Hypoglycemia can mimic stroke."
          ]
        }
      },
      "next": [
        {
          "condition": "",
          "next": 7
        }
      ]
    },
    {
      "step": 7,
      "action": "Medication & Team Summary",
      "tool": {
        "checklist": {
          "items": [
            "Ask about anticoagulant (blood thinner) use",
            "Verbalize FAST findings",
            "Verbalize last known well time",
            "Communicate glucose result to team/recording"
          ]
        }
      },
      "next": [
        {
          "condition": "",
          "next": "DONE"
        }
      ]
    }
  ],
  "filename": "stroke.json",
  "timestamp": "2026-03-01T00:00:00.000Z",
  "is_active": true
}

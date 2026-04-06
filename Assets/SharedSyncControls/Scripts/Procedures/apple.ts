export const appleCutting = {
  "procedure": "Apple Preparation",
  "steps": [
    {
      "step": 1,
      "action": "Get the Apple",
      "tool": {
        "checklist": {
          "items": [
            "Pretend there is an Apple in front of you.", 
            "Reach for the apple", 
            "Use voice command to continue to the next step",
            "Eg: Say to your headset: 'NEXT' or 'BACK'"
          ]
        },
        "reminder": {
          "items": [
            "Verbally state every action.", 
            "Eg: 'I am reaching for the apple.'"
          ]
        }
      },
      "next": [
        {
          "condition": "Apple Acquired",
          "next": 2
        }
      ]
    },
    {
      "step": 2,
      "action": "Get the Knife",
      "tool": {
        "checklist": {
          "items": [
            "Obtain the knife", 
            "Use gestural pinch to continue to the next step",
            "Eg: lift your arm, pinch where the 'NEXT' button is located."
          ]
        },
        "reminder": {
          "items": [
            "Verbally state what step of the apple-cutting you are at."
          ]
        }
      },
      "next": [
        {
          "condition": "Knife Acquired",
          "next": 3
        }
      ]
    },
    {
      "step": 3,
      "action": "Cut the Apple",
      "tool": {
        "checklist": {
          "items": [
            "Cut the apple using the knife", 
            "Continuously Verbalize your actions"
          ]
        },
        "reminder": {
          "items": [
            "You can use both voice commands & gestures for 'Next' and 'Back' navigation"
          ]
        },
        "timer": [
          {
            "label": "Cutting Duration",
            "duration": 20,
            "onComplete": "Cut Complete",
            "persist": false
          }
        ]
      },
      "next": [
        {
          "condition": "Cut Complete",
          "next": 4
        }
      ]
    },
    {
      "step": 4,
      "action": "Place Apple on Plate",
      "tool": {
        "checklist": {
          "items": [
            "Place sliced apple onto plate",
            "Use gestures to interact with the options below & proceed."
          ]
        },
        "reminder": {
          "items": [
            "You can use only gesture navigation for Show, Hide & Option Buttons."
          ]
        }
      },
      "next": [
        {
          "condition": "Cut Another Apple",
          "next": 1
        },
        {
          "condition": "Done",
          "next": "DONE"
        }
      ]
    }
  ],
  "filename": "apple_demo.json",
  "is_active": true
}


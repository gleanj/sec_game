# Incident Response: The Game

An interactive terminal-based incident response training simulation where your decisions determine the fate of a company under cyberattack.

## Overview

You are the lead incident responder for CyberCorp Industries, facing a critical ransomware attack at 2:47 AM. Every decision you make will impact the outcome - from initial detection to final remediation. Can you save the company?

## Features

- **4 Critical Scenarios**: Navigate through detection, communication, ransom decisions, and remediation
- **Multiple Endings**: 4 different endings based on your performance
  - Exemplary Response (Security Hero)
  - Successful Response (Crisis Averted)
  - Survival (Barely Made It)
  - Critical Failure (Catastrophic Breach)
- **Scoring System**: Earn points for effective decisions, lose points for poor choices
- **Reputation Tracking**: Your decisions affect company reputation
- **Real Incident Response Decisions**: Based on actual IR best practices
- **Colorful Terminal Interface**: ANSI colors for an immersive experience
- **Replay Value**: Different choices lead to different outcomes

## How to Play

### Quick Start

```bash
# Make the script executable
chmod +x incident_response_game.py

# Run the game
./incident_response_game.py

# Or use Python directly
python3 incident_response_game.py
```

### Requirements

- Python 3.6 or higher
- Terminal with ANSI color support (most modern terminals)
- No external dependencies required!

### Gameplay

1. **Read Each Scenario Carefully**: The game presents realistic incident response scenarios
2. **Make Your Choice**: Enter the number (1-4) corresponding to your decision
3. **See the Consequences**: Your choices immediately affect the situation
4. **Track Your Progress**: Monitor your score, reputation, and time elapsed
5. **Multiple Endings**: The final outcome depends on your total score and reputation

### Scoring Guide

- **180+ points & 80+ reputation**: Exemplary Response
- **120+ points & 60+ reputation**: Successful Response
- **60+ points & 40+ reputation**: Survival
- **Below 60 points or 40 reputation**: Critical Failure

## Scenarios Overview

### Scenario 1: Suspicious Alert
The initial detection of ransomware activity. How quickly and effectively do you respond?

**Key Decision**: Balancing speed with thoroughness in your initial response.

### Scenario 2: Communication Crisis
Managing stakeholder communications while the incident is ongoing.

**Key Decision**: Who to notify first and how to manage the crisis communications.

### Scenario 3: The Ransom Demand
Facing the ethical and practical dilemma of a ransom payment.

**Key Decision**: To pay or not to pay - and how to recover.

### Scenario 4: Root Cause Analysis
Understanding how the breach happened and preventing future incidents.

**Key Decision**: Comprehensive security improvements vs. targeted fixes.

## Tips for Success

1. **Think Like an Incident Responder**: Consider containment, eradication, and recovery
2. **Balance Speed and Accuracy**: Some situations require immediate action, others need investigation
3. **Communicate Effectively**: Keeping stakeholders informed is crucial
4. **Never Pay Ransoms**: There's always a better way (hint!)
5. **Learn from Each Playthrough**: Try different approaches to see all endings

## Learning Objectives

This game teaches core incident response concepts:

- **Initial Detection & Triage**: Recognizing and prioritizing threats
- **Containment Strategies**: Isolating threats without causing unnecessary disruption
- **Stakeholder Communication**: Managing crisis communications effectively
- **Legal & Compliance**: Understanding notification requirements
- **Ransom Decisions**: Ethical and practical considerations
- **Root Cause Analysis**: Preventing future incidents
- **Defense in Depth**: Multi-layered security approach

## Educational Use

Perfect for:

- Security awareness training
- Incident response team exercises
- Cybersecurity education
- Tabletop exercise preparation
- Understanding IR decision-making
- Team discussions on IR strategies

## Technical Details

### Game State Tracking

The game tracks multiple variables:
- **Score**: Points earned/lost based on decisions
- **Reputation**: Company reputation percentage
- **Time Elapsed**: Minutes since incident start
- **Containment Level**: How well the threat is contained
- **Decisions Made**: Complete history of your choices

### Color Coding

- **Green**: Positive outcomes and good choices
- **Yellow**: Warnings and neutral information
- **Red**: Negative outcomes and critical alerts
- **Cyan**: Information and system messages
- **Blue**: Special notifications

## Customization

Want to modify the game? The code is well-structured and commented:

- **Add New Scenarios**: Add functions following the `scenario_X()` pattern
- **Adjust Scoring**: Modify point values in each scenario
- **Create New Endings**: Edit the `calculate_ending()` function
- **Change Difficulty**: Adjust thresholds for different endings

## Example Playthrough

```
=================================================================
               INCIDENT RESPONSE: THE GAME
=================================================================

MISSION BRIEFING
------------------------------------------------------------------

You are the lead incident responder for CyberCorp Industries.
Your decisions will determine the fate of the company.

HOW TO PLAY:
  • Read each scenario carefully
  • Choose your response by entering the number (1, 2, 3, etc.)
  • Your choices affect the outcome and your final score
  • There are multiple endings based on your decisions

...

FINAL STATISTICS:
  Total Score: 210 points
  Final Reputation: 95%
  Time to Resolution: 185 minutes (3 hours)
  Containment Level: 80%

YOUR DECISION PATH:
  • Initial Response: 3
  • Communication: 1
  • Ransom: 4
  • Prevention: 4
```

## Contributing

Feel free to:
- Add new scenarios
- Improve existing decision paths
- Enhance the terminal UI
- Add more endings
- Translate to other languages

## License

This is an educational tool - free to use for training and learning purposes.

## About

Created for security professionals, by security professionals. Based on real-world incident response experiences and best practices.

**Stay vigilant! Stay secure!**

---

For questions, improvements, or to share your high score, feel free to contribute!

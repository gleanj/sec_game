#!/usr/bin/env python3
"""
Incident Response: The Game
An interactive terminal-based incident response training simulation
"""

import sys
import time
import os

# ANSI color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# Game state
class GameState:
    def __init__(self):
        self.score = 0
        self.decisions = []
        self.time_elapsed = 0
        self.containment_level = 0
        self.reputation = 100
        self.systems_affected = 0

def clear_screen():
    """Clear the terminal screen"""
    os.system('cls' if os.name == 'nt' else 'clear')

def slow_print(text, delay=0.03, color=''):
    """Print text with a typewriter effect"""
    for char in text:
        sys.stdout.write(color + char + Colors.ENDC)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def fast_print(text, color=''):
    """Print text instantly with color"""
    print(color + text + Colors.ENDC)

def print_header():
    """Display game header"""
    clear_screen()
    print(Colors.BOLD + Colors.CYAN + "=" * 70)
    print("               INCIDENT RESPONSE: THE GAME")
    print("=" * 70 + Colors.ENDC)
    print()

def print_separator():
    """Print a visual separator"""
    print(Colors.CYAN + "-" * 70 + Colors.ENDC)

def show_instructions():
    """Display game instructions"""
    print_header()
    fast_print("MISSION BRIEFING", Colors.BOLD + Colors.YELLOW)
    print_separator()
    print()
    fast_print("You are the lead incident responder for CyberCorp Industries.", Colors.CYAN)
    fast_print("Your decisions will determine the fate of the company.", Colors.CYAN)
    print()
    fast_print("HOW TO PLAY:", Colors.BOLD + Colors.GREEN)
    fast_print("  • Read each scenario carefully", Colors.GREEN)
    fast_print("  • Choose your response by entering the number (1, 2, 3, etc.)", Colors.GREEN)
    fast_print("  • Your choices affect the outcome and your final score", Colors.GREEN)
    fast_print("  • There are multiple endings based on your decisions", Colors.GREEN)
    print()
    fast_print("SCORING:", Colors.BOLD + Colors.YELLOW)
    fast_print("  • Quick, effective responses earn more points", Colors.YELLOW)
    fast_print("  • Poor choices can cost you points and damage reputation", Colors.YELLOW)
    fast_print("  • Your goal: Contain the incident and protect the company", Colors.YELLOW)
    print()
    print_separator()
    input(Colors.BOLD + "\nPress ENTER to begin your shift..." + Colors.ENDC)

def get_choice(options):
    """Get and validate user choice"""
    while True:
        print()
        choice = input(Colors.BOLD + Colors.GREEN + "Your decision: " + Colors.ENDC).strip()

        if choice.isdigit() and 1 <= int(choice) <= len(options):
            return int(choice)
        else:
            fast_print(f"Invalid choice. Please enter a number between 1 and {len(options)}", Colors.RED)

def display_scenario(title, description, state):
    """Display a scenario"""
    print()
    print_separator()
    fast_print(f"\n{title}", Colors.BOLD + Colors.RED)
    print_separator()
    print()
    slow_print(description, 0.02, Colors.CYAN)
    print()
    fast_print(f"⏰ Time Elapsed: {state.time_elapsed} minutes | "
               f"🎯 Score: {state.score} | "
               f"📊 Reputation: {state.reputation}%", Colors.YELLOW)

def scenario_1(state):
    """Initial Detection - Ransomware Alert"""
    display_scenario(
        "📧 SCENARIO 1: SUSPICIOUS ALERT",
        "It's 2:47 AM. Your phone buzzes with an alert from the SIEM system.\n"
        "Multiple endpoints are showing unusual encryption activity and file extensions\n"
        "are being changed to '.encrypted'. The help desk is starting to receive calls\n"
        "from the night shift about inaccessible files.\n\n"
        "This looks like a ransomware attack in progress!",
        state
    )

    fast_print("What is your FIRST action?", Colors.BOLD + Colors.YELLOW)
    print()
    fast_print("1. Immediately shut down the entire network to stop the spread", Colors.GREEN)
    fast_print("2. Investigate further to understand the scope before taking action", Colors.GREEN)
    fast_print("3. Isolate affected systems and preserve evidence while investigating", Colors.GREEN)
    fast_print("4. Wait until morning when the full team is available", Colors.GREEN)

    choice = get_choice([1, 2, 3, 4])
    state.decisions.append(f"Initial Response: {choice}")

    if choice == 1:
        state.time_elapsed += 5
        state.score += 30
        state.containment_level = 60
        state.reputation -= 10
        fast_print("\n⚠️  You shut down the network immediately.", Colors.YELLOW)
        fast_print("The ransomware spread is halted, but business operations are completely stopped.", Colors.YELLOW)
        fast_print("The CEO is furious about the unplanned downtime.", Colors.RED)
        fast_print("+30 points for quick action, -10 reputation for business impact", Colors.CYAN)
    elif choice == 2:
        state.time_elapsed += 25
        state.score += 10
        state.containment_level = 20
        state.systems_affected = 50
        fast_print("\n❌ While investigating, the ransomware spreads to 50 more systems!", Colors.RED)
        fast_print("You've lost valuable time. The attack is now widespread.", Colors.RED)
        fast_print("+10 points for gathering information, but significant damage occurred", Colors.CYAN)
    elif choice == 3:
        state.time_elapsed += 10
        state.score += 50
        state.containment_level = 80
        fast_print("\n✅ Excellent choice! You isolate affected systems using network segmentation.", Colors.GREEN)
        fast_print("Evidence is preserved for forensics, and the spread is contained.", Colors.GREEN)
        fast_print("+50 points for balanced response", Colors.CYAN)
    else:  # choice == 4
        state.time_elapsed += 300
        state.score -= 50
        state.containment_level = 0
        state.systems_affected = 200
        state.reputation -= 40
        fast_print("\n🔥 DISASTER! By morning, 200+ systems are encrypted!", Colors.RED)
        fast_print("Critical business data is lost. This will be difficult to recover from.", Colors.RED)
        fast_print("-50 points and -40 reputation for delayed response", Colors.RED)

    input(Colors.BOLD + "\nPress ENTER to continue..." + Colors.ENDC)
    return choice

def scenario_2(state, prev_choice):
    """Communication and Escalation"""
    display_scenario(
        "📞 SCENARIO 2: COMMUNICATION CRISIS",
        "The incident is now partially contained. Your phone is ringing off the hook.\n"
        "The CEO, CISO, legal team, and PR department all want updates.\n"
        "The media has somehow caught wind of the situation.\n\n"
        "You also need to decide about notifying affected customers and regulatory bodies.",
        state
    )

    fast_print("Who do you notify FIRST?", Colors.BOLD + Colors.YELLOW)
    print()
    fast_print("1. Alert the executive team and legal counsel immediately", Colors.GREEN)
    fast_print("2. Focus on technical remediation first, communicate later", Colors.GREEN)
    fast_print("3. Contact law enforcement and regulatory bodies right away", Colors.GREEN)
    fast_print("4. Prepare a public statement to get ahead of the story", Colors.GREEN)

    choice = get_choice([1, 2, 3, 4])
    state.decisions.append(f"Communication: {choice}")

    if choice == 1:
        state.time_elapsed += 15
        state.score += 40
        state.reputation += 10
        fast_print("\n✅ Smart move! Legal counsel helps navigate compliance requirements.", Colors.GREEN)
        fast_print("The executive team coordinates resources to support your response.", Colors.GREEN)
        fast_print("+40 points and +10 reputation for proper escalation", Colors.CYAN)
    elif choice == 2:
        state.time_elapsed += 5
        state.score += 20
        state.reputation -= 20
        fast_print("\n⚠️  Technical progress is good, but stakeholders are frustrated.", Colors.YELLOW)
        fast_print("Legal issues may arise from delayed notification.", Colors.YELLOW)
        fast_print("+20 points for focus, -20 reputation for poor communication", Colors.CYAN)
    elif choice == 3:
        state.time_elapsed += 30
        state.score += 35
        state.reputation += 5
        fast_print("\n✅ Law enforcement is engaged and regulatory requirements are met.", Colors.GREEN)
        fast_print("However, executive team feels blindsided.", Colors.YELLOW)
        fast_print("+35 points and +5 reputation", Colors.CYAN)
    else:  # choice == 4
        state.time_elapsed += 45
        state.score -= 20
        state.reputation -= 30
        fast_print("\n❌ The premature public statement backfires!", Colors.RED)
        fast_print("Without legal review, you've exposed the company to liability.", Colors.RED)
        fast_print("Stock price drops 15% on the news.", Colors.RED)
        fast_print("-20 points and -30 reputation", Colors.RED)

    input(Colors.BOLD + "\nPress ENTER to continue..." + Colors.ENDC)
    return choice

def scenario_3(state, prev_choices):
    """Ransom Decision"""
    display_scenario(
        "💰 SCENARIO 3: THE RANSOM DEMAND",
        "A ransom note appears on all encrypted systems:\n\n"
        "'Your files are encrypted. Pay 50 Bitcoin ($2.1M USD) within 48 hours\n"
        "or the decryption key will be destroyed. We have exfiltrated your data\n"
        "and will release it publicly if you involve law enforcement.'\n\n"
        "Your backup systems were also compromised - only 60% of data can be restored.\n"
        "The executive team is pressuring you for a recommendation.",
        state
    )

    fast_print("What do you recommend?", Colors.BOLD + Colors.YELLOW)
    print()
    fast_print("1. Pay the ransom immediately to minimize downtime", Colors.GREEN)
    fast_print("2. Refuse to pay, restore from backups, and rebuild compromised systems", Colors.GREEN)
    fast_print("3. Negotiate with attackers while preparing recovery options", Colors.GREEN)
    fast_print("4. Engage a specialized incident response firm to handle this", Colors.GREEN)

    choice = get_choice([1, 2, 3, 4])
    state.decisions.append(f"Ransom: {choice}")

    if choice == 1:
        state.time_elapsed += 20
        state.score -= 30
        state.reputation -= 25
        fast_print("\n💸 The ransom is paid... but there's a problem.", Colors.YELLOW)
        fast_print("The attackers provide a faulty decryption key. Only 40% of files recover.", Colors.RED)
        fast_print("You've funded criminal activity and still lost most of your data.", Colors.RED)
        fast_print("The FBI is disappointed. Board members question your judgment.", Colors.RED)
        fast_print("-30 points and -25 reputation", Colors.RED)
    elif choice == 2:
        state.time_elapsed += 120
        state.score += 50
        state.reputation += 15
        fast_print("\n✅ Excellent! You refuse to negotiate with criminals.", Colors.GREEN)
        fast_print("It takes 5 days, but 60% of data is restored from backups.", Colors.GREEN)
        fast_print("The remaining systems are rebuilt from scratch with improved security.", Colors.GREEN)
        fast_print("The company takes a strong public stance against ransomware.", Colors.GREEN)
        fast_print("+50 points and +15 reputation for ethical response", Colors.CYAN)
    elif choice == 3:
        state.time_elapsed += 60
        state.score += 10
        state.reputation -= 5
        fast_print("\n⚠️  You buy time through negotiation while working on recovery.", Colors.YELLOW)
        fast_print("Eventually, you restore from backups without paying.", Colors.GREEN)
        fast_print("However, the negotiation tactics were risky and ethically questionable.", Colors.YELLOW)
        fast_print("+10 points, -5 reputation", Colors.CYAN)
    else:  # choice == 4
        state.time_elapsed += 30
        state.score += 60
        state.reputation += 20
        fast_print("\n✅ OUTSTANDING! The IR firm brings expertise and resources.", Colors.GREEN)
        fast_print("They quickly identify the ransomware variant and find a decryption tool.", Colors.GREEN)
        fast_print("70% of data is recovered without paying the ransom!", Colors.GREEN)
        fast_print("Their forensic analysis reveals how the attackers got in.", Colors.GREEN)
        fast_print("+60 points and +20 reputation for bringing in experts", Colors.CYAN)

    input(Colors.BOLD + "\nPress ENTER to continue..." + Colors.ENDC)
    return choice

def scenario_4(state, prev_choices):
    """Root Cause and Prevention"""
    display_scenario(
        "🔍 SCENARIO 4: ROOT CAUSE ANALYSIS",
        "The immediate crisis is over. Now you need to understand how this happened.\n\n"
        "Forensic analysis reveals three potential entry points:\n"
        "A) Phishing email opened by accounting employee\n"
        "B) Unpatched VPN server with known vulnerability\n"
        "C) Compromised third-party vendor credentials\n\n"
        "You need to prevent this from happening again.",
        state
    )

    fast_print("What is your remediation priority?", Colors.BOLD + Colors.YELLOW)
    print()
    fast_print("1. Implement comprehensive security awareness training for all staff", Colors.GREEN)
    fast_print("2. Accelerate patch management and vulnerability scanning programs", Colors.GREEN)
    fast_print("3. Review and strengthen all third-party vendor security controls", Colors.GREEN)
    fast_print("4. Implement all of the above with a phased security improvement plan", Colors.GREEN)

    choice = get_choice([1, 2, 3, 4])
    state.decisions.append(f"Prevention: {choice}")

    if choice == 1:
        state.time_elapsed += 45
        state.score += 25
        fast_print("\n✅ Security awareness training is launched company-wide.", Colors.GREEN)
        fast_print("However, the technical vulnerabilities remain unaddressed.", Colors.YELLOW)
        fast_print("+25 points - good but incomplete response", Colors.CYAN)
    elif choice == 2:
        state.time_elapsed += 45
        state.score += 25
        fast_print("\n✅ Patch management is improved, but people remain vulnerable.", Colors.GREEN)
        fast_print("Human error is still the weakest link.", Colors.YELLOW)
        fast_print("+25 points - good but incomplete response", Colors.CYAN)
    elif choice == 3:
        state.time_elapsed += 45
        state.score += 25
        fast_print("\n✅ Third-party risks are addressed with new vendor controls.", Colors.GREEN)
        fast_print("But internal vulnerabilities still exist.", Colors.YELLOW)
        fast_print("+25 points - good but incomplete response", Colors.CYAN)
    else:  # choice == 4
        state.time_elapsed += 120
        state.score += 70
        state.reputation += 25
        fast_print("\n✅ EXCEPTIONAL! You develop a comprehensive security improvement plan.", Colors.GREEN)
        fast_print("All attack vectors are addressed through a multi-layered defense strategy:", Colors.GREEN)
        fast_print("  • Monthly security awareness training", Colors.CYAN)
        fast_print("  • Automated patch management within 48 hours of release", Colors.CYAN)
        fast_print("  • Third-party security assessments and monitoring", Colors.CYAN)
        fast_print("  • Enhanced detection and response capabilities", Colors.CYAN)
        fast_print("The board approves increased security budget based on your recommendations.", Colors.GREEN)
        fast_print("+70 points and +25 reputation for comprehensive approach", Colors.CYAN)

    input(Colors.BOLD + "\nPress ENTER to see final results..." + Colors.ENDC)
    return choice

def calculate_ending(state):
    """Determine the ending based on final score and choices"""
    if state.score >= 180 and state.reputation >= 80:
        return "EXEMPLARY"
    elif state.score >= 120 and state.reputation >= 60:
        return "SUCCESS"
    elif state.score >= 60 and state.reputation >= 40:
        return "SURVIVAL"
    else:
        return "FAILURE"

def show_ending(state, ending_type):
    """Display the game ending"""
    print_header()

    if ending_type == "EXEMPLARY":
        fast_print("🏆 EXEMPLARY RESPONSE - SECURITY HERO! 🏆", Colors.BOLD + Colors.GREEN)
        print_separator()
        print()
        fast_print("Your exceptional incident response has saved the company!", Colors.GREEN)
        fast_print("", "")
        fast_print("OUTCOME:", Colors.BOLD + Colors.CYAN)
        fast_print("✅ Incident contained with minimal data loss", Colors.GREEN)
        fast_print("✅ Attackers identified and reported to law enforcement", Colors.GREEN)
        fast_print("✅ Comprehensive security improvements implemented", Colors.GREEN)
        fast_print("✅ Company reputation strengthened by transparent handling", Colors.GREEN)
        fast_print("✅ Industry recognition for incident response excellence", Colors.GREEN)
        print()
        fast_print("CAREER IMPACT:", Colors.BOLD + Colors.YELLOW)
        fast_print("🎖️  You're promoted to Chief Information Security Officer", Colors.GREEN)
        fast_print("🎤 You're invited to speak at major security conferences", Colors.GREEN)
        fast_print("📰 Featured in cybersecurity publications as a case study", Colors.GREEN)

    elif ending_type == "SUCCESS":
        fast_print("✅ SUCCESSFUL RESPONSE - CRISIS AVERTED", Colors.BOLD + Colors.GREEN)
        print_separator()
        print()
        fast_print("You successfully navigated a major security incident.", Colors.GREEN)
        fast_print("", "")
        fast_print("OUTCOME:", Colors.BOLD + Colors.CYAN)
        fast_print("✅ Incident contained with moderate impact", Colors.GREEN)
        fast_print("✅ Most critical systems recovered", Colors.GREEN)
        fast_print("✅ Security improvements in progress", Colors.GREEN)
        fast_print("⚠️  Some reputation damage, but company remains stable", Colors.YELLOW)
        print()
        fast_print("CAREER IMPACT:", Colors.BOLD + Colors.YELLOW)
        fast_print("👍 Management recognizes your solid performance", Colors.GREEN)
        fast_print("📈 Budget approved for security team expansion", Colors.GREEN)
        fast_print("🎯 You've proven yourself capable under pressure", Colors.GREEN)

    elif ending_type == "SURVIVAL":
        fast_print("⚠️  SURVIVAL - YOU MADE IT THROUGH... BARELY", Colors.BOLD + Colors.YELLOW)
        print_separator()
        print()
        fast_print("The company survives, but it was a close call.", Colors.YELLOW)
        fast_print("", "")
        fast_print("OUTCOME:", Colors.BOLD + Colors.CYAN)
        fast_print("⚠️  Incident eventually contained, but with significant damage", Colors.YELLOW)
        fast_print("⚠️  Major data loss and business disruption", Colors.YELLOW)
        fast_print("⚠️  Customer trust damaged", Colors.YELLOW)
        fast_print("❌ Legal and regulatory consequences", Colors.RED)
        print()
        fast_print("CAREER IMPACT:", Colors.BOLD + Colors.YELLOW)
        fast_print("📉 You keep your job, but you're on thin ice", Colors.YELLOW)
        fast_print("📚 Mandatory additional training required", Colors.YELLOW)
        fast_print("👀 Close oversight from senior management", Colors.YELLOW)

    else:  # FAILURE
        fast_print("❌ CRITICAL FAILURE - CATASTROPHIC BREACH ❌", Colors.BOLD + Colors.RED)
        print_separator()
        print()
        fast_print("Your incident response was inadequate. The consequences are severe.", Colors.RED)
        fast_print("", "")
        fast_print("OUTCOME:", Colors.BOLD + Colors.CYAN)
        fast_print("❌ Widespread system compromise and data loss", Colors.RED)
        fast_print("❌ Customer data leaked to the dark web", Colors.RED)
        fast_print("❌ Massive regulatory fines incoming", Colors.RED)
        fast_print("❌ Company stock price crashes 40%", Colors.RED)
        fast_print("❌ Multiple lawsuits filed", Colors.RED)
        print()
        fast_print("CAREER IMPACT:", Colors.BOLD + Colors.YELLOW)
        fast_print("💼 You are asked to resign", Colors.RED)
        fast_print("📰 The breach becomes a cautionary tale in the industry", Colors.RED)
        fast_print("🔄 Time to update your resume...", Colors.RED)

    print()
    print_separator()
    fast_print(f"\nFINAL STATISTICS:", Colors.BOLD + Colors.CYAN)
    fast_print(f"  Total Score: {state.score} points", Colors.YELLOW)
    fast_print(f"  Final Reputation: {state.reputation}%", Colors.YELLOW)
    fast_print(f"  Time to Resolution: {state.time_elapsed} minutes ({state.time_elapsed // 60} hours)", Colors.YELLOW)
    fast_print(f"  Containment Level: {state.containment_level}%", Colors.YELLOW)
    print()

    fast_print("YOUR DECISION PATH:", Colors.BOLD + Colors.CYAN)
    for decision in state.decisions:
        fast_print(f"  • {decision}", Colors.CYAN)

    print()
    print_separator()

def play_game():
    """Main game loop"""
    show_instructions()

    state = GameState()

    # Scenario progression
    choice1 = scenario_1(state)
    choice2 = scenario_2(state, choice1)
    choice3 = scenario_3(state, [choice1, choice2])
    choice4 = scenario_4(state, [choice1, choice2, choice3])

    # Determine and show ending
    ending = calculate_ending(state)
    show_ending(state, ending)

    # Play again?
    print()
    play_again = input(Colors.BOLD + Colors.GREEN +
                      "Would you like to play again and try a different approach? (y/n): " +
                      Colors.ENDC).strip().lower()

    if play_again == 'y' or play_again == 'yes':
        play_game()
    else:
        print()
        fast_print("Thanks for playing! Stay vigilant, security professional! 🛡️", Colors.CYAN)
        print()

def main():
    """Entry point"""
    try:
        play_game()
    except KeyboardInterrupt:
        print()
        fast_print("\n\nGame interrupted. Stay safe out there! 🛡️", Colors.YELLOW)
        print()
        sys.exit(0)

if __name__ == "__main__":
    main()

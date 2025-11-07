// ===================================================================
// INCIDENT RESPONSE: THE GAME - Browser Edition
// Game Engine and Logic
// ===================================================================

class GameEngine {
    constructor() {
        this.state = {
            score: 0,
            reputation: 100,
            timeElapsed: 0,
            containmentLevel: 0,
            systemsAffected: 0,
            decisions: [],
            currentScenario: 0,
            difficulty: 'normal',
            achievements: []
        };

        this.difficultySettings = {
            easy: { timeMultiplier: 0.7, hintLevel: 2, scoreMultiplier: 0.8 },
            normal: { timeMultiplier: 1.0, hintLevel: 1, scoreMultiplier: 1.0 },
            hard: { timeMultiplier: 1.3, hintLevel: 0, scoreMultiplier: 1.2 }
        };

        this.scenarios = this.initializeScenarios();
        this.achievements = this.initializeAchievements();
        this.init();
    }

    init() {
        // Set up event listeners
        this.setupEventListeners();

        // Check for saved games
        this.checkSavedGames();

        // Initialize screens
        this.showScreen('welcome-screen');
    }

    setupEventListeners() {
        // Start game button
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.startGame();
        });

        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.state.difficulty = e.currentTarget.dataset.difficulty;
            });
        });

        // Continue button
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.nextScenario();
        });

        // Play again button
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.resetGame();
        });

        // Share button
        document.getElementById('share-btn').addEventListener('click', () => {
            this.shareResults();
        });
    }

    initializeScenarios() {
        return [
            {
                id: 1,
                title: 'INITIAL DETECTION',
                subtitle: 'Suspicious Alert',
                text: `It's 2:47 AM. Your phone buzzes with an alert from the SIEM system.\n\nMultiple endpoints are showing unusual encryption activity and file extensions are being changed to '.encrypted'. The help desk is starting to receive calls from the night shift about inaccessible files.\n\nThis looks like a ransomware attack in progress!`,
                alert: '🚨 CRITICAL ALERT: Ransomware activity detected on 15 endpoints',
                question: 'What is your FIRST action?',
                choices: [
                    {
                        text: 'Immediately shut down the entire network to stop the spread',
                        outcome: {
                            score: 30,
                            reputation: -10,
                            time: 5,
                            containment: 60,
                            feedback: {
                                type: 'warning',
                                title: 'Network Shutdown',
                                text: 'You shut down the network immediately. The ransomware spread is halted, but business operations are completely stopped. The CEO is furious about the unplanned downtime.',
                                details: '+30 points for quick action, -10 reputation for business impact'
                            }
                        }
                    },
                    {
                        text: 'Investigate further to understand the scope before taking action',
                        outcome: {
                            score: 10,
                            reputation: 0,
                            time: 25,
                            containment: 20,
                            systemsAffected: 50,
                            feedback: {
                                type: 'error',
                                title: 'Delayed Response',
                                text: 'While investigating, the ransomware spreads to 50 more systems! You\'ve lost valuable time. The attack is now widespread.',
                                details: '+10 points for gathering information, but significant damage occurred'
                            }
                        }
                    },
                    {
                        text: 'Isolate affected systems and preserve evidence while investigating',
                        outcome: {
                            score: 50,
                            reputation: 0,
                            time: 10,
                            containment: 80,
                            feedback: {
                                type: 'success',
                                title: 'Excellent Choice!',
                                text: 'You isolate affected systems using network segmentation. Evidence is preserved for forensics, and the spread is contained.',
                                details: '+50 points for balanced response'
                            },
                            achievement: 'quick_thinker'
                        }
                    },
                    {
                        text: 'Wait until morning when the full team is available',
                        outcome: {
                            score: -50,
                            reputation: -40,
                            time: 300,
                            containment: 0,
                            systemsAffected: 200,
                            feedback: {
                                type: 'critical',
                                title: 'DISASTER!',
                                text: 'By morning, 200+ systems are encrypted! Critical business data is lost. This will be difficult to recover from.',
                                details: '-50 points and -40 reputation for delayed response'
                            }
                        }
                    }
                ]
            },
            {
                id: 2,
                title: 'COMMUNICATION CRISIS',
                subtitle: 'Stakeholder Management',
                text: `The incident is now partially contained. Your phone is ringing off the hook.\n\nThe CEO, CISO, legal team, and PR department all want updates. The media has somehow caught wind of the situation.\n\nYou also need to decide about notifying affected customers and regulatory bodies.`,
                alert: '📞 Multiple stakeholders demanding immediate updates',
                question: 'Who do you notify FIRST?',
                choices: [
                    {
                        text: 'Alert the executive team and legal counsel immediately',
                        outcome: {
                            score: 40,
                            reputation: 10,
                            time: 15,
                            feedback: {
                                type: 'success',
                                title: 'Smart Move!',
                                text: 'Legal counsel helps navigate compliance requirements. The executive team coordinates resources to support your response.',
                                details: '+40 points and +10 reputation for proper escalation'
                            },
                            achievement: 'team_player'
                        }
                    },
                    {
                        text: 'Focus on technical remediation first, communicate later',
                        outcome: {
                            score: 20,
                            reputation: -20,
                            time: 5,
                            feedback: {
                                type: 'warning',
                                title: 'Technical Focus',
                                text: 'Technical progress is good, but stakeholders are frustrated. Legal issues may arise from delayed notification.',
                                details: '+20 points for focus, -20 reputation for poor communication'
                            }
                        }
                    },
                    {
                        text: 'Contact law enforcement and regulatory bodies right away',
                        outcome: {
                            score: 35,
                            reputation: 5,
                            time: 30,
                            feedback: {
                                type: 'success',
                                title: 'Compliance First',
                                text: 'Law enforcement is engaged and regulatory requirements are met. However, executive team feels blindsided.',
                                details: '+35 points and +5 reputation'
                            }
                        }
                    },
                    {
                        text: 'Prepare a public statement to get ahead of the story',
                        outcome: {
                            score: -20,
                            reputation: -30,
                            time: 45,
                            feedback: {
                                type: 'critical',
                                title: 'Premature Disclosure',
                                text: 'The premature public statement backfires! Without legal review, you\'ve exposed the company to liability. Stock price drops 15% on the news.',
                                details: '-20 points and -30 reputation'
                            }
                        }
                    }
                ]
            },
            {
                id: 3,
                title: 'THE RANSOM DEMAND',
                subtitle: 'Ethical Dilemma',
                text: `A ransom note appears on all encrypted systems:\n\n"Your files are encrypted. Pay 50 Bitcoin ($2.1M USD) within 48 hours or the decryption key will be destroyed. We have exfiltrated your data and will release it publicly if you involve law enforcement."\n\nYour backup systems were also compromised - only 60% of data can be restored. The executive team is pressuring you for a recommendation.`,
                alert: '💰 RANSOM DEMAND: $2.1M USD - 48 hours remaining',
                question: 'What do you recommend?',
                choices: [
                    {
                        text: 'Pay the ransom immediately to minimize downtime',
                        outcome: {
                            score: -30,
                            reputation: -25,
                            time: 20,
                            feedback: {
                                type: 'critical',
                                title: 'Payment Failed',
                                text: 'The ransom is paid... but there\'s a problem. The attackers provide a faulty decryption key. Only 40% of files recover. You\'ve funded criminal activity and still lost most of your data. The FBI is disappointed.',
                                details: '-30 points and -25 reputation'
                            }
                        }
                    },
                    {
                        text: 'Refuse to pay, restore from backups, and rebuild compromised systems',
                        outcome: {
                            score: 50,
                            reputation: 15,
                            time: 120,
                            feedback: {
                                type: 'success',
                                title: 'Ethical Response!',
                                text: 'You refuse to negotiate with criminals. It takes 5 days, but 60% of data is restored from backups. The remaining systems are rebuilt from scratch with improved security. The company takes a strong public stance against ransomware.',
                                details: '+50 points and +15 reputation for ethical response'
                            },
                            achievement: 'ethical_responder'
                        }
                    },
                    {
                        text: 'Negotiate with attackers while preparing recovery options',
                        outcome: {
                            score: 10,
                            reputation: -5,
                            time: 60,
                            feedback: {
                                type: 'warning',
                                title: 'Risky Strategy',
                                text: 'You buy time through negotiation while working on recovery. Eventually, you restore from backups without paying. However, the negotiation tactics were risky and ethically questionable.',
                                details: '+10 points, -5 reputation'
                            }
                        }
                    },
                    {
                        text: 'Engage a specialized incident response firm to handle this',
                        outcome: {
                            score: 60,
                            reputation: 20,
                            time: 30,
                            feedback: {
                                type: 'success',
                                title: 'OUTSTANDING!',
                                text: 'The IR firm brings expertise and resources. They quickly identify the ransomware variant and find a decryption tool. 70% of data is recovered without paying the ransom! Their forensic analysis reveals how the attackers got in.',
                                details: '+60 points and +20 reputation for bringing in experts'
                            },
                            achievement: 'expert_consulted'
                        }
                    }
                ]
            },
            {
                id: 4,
                title: 'ROOT CAUSE ANALYSIS',
                subtitle: 'Prevention & Remediation',
                text: `The immediate crisis is over. Now you need to understand how this happened.\n\nForensic analysis reveals three potential entry points:\nA) Phishing email opened by accounting employee\nB) Unpatched VPN server with known vulnerability\nC) Compromised third-party vendor credentials\n\nYou need to prevent this from happening again.`,
                alert: '🔍 Three attack vectors identified - all must be addressed',
                question: 'What is your remediation priority?',
                choices: [
                    {
                        text: 'Implement comprehensive security awareness training for all staff',
                        outcome: {
                            score: 25,
                            reputation: 0,
                            time: 45,
                            feedback: {
                                type: 'warning',
                                title: 'Partial Solution',
                                text: 'Security awareness training is launched company-wide. However, the technical vulnerabilities remain unaddressed.',
                                details: '+25 points - good but incomplete response'
                            }
                        }
                    },
                    {
                        text: 'Accelerate patch management and vulnerability scanning programs',
                        outcome: {
                            score: 25,
                            reputation: 0,
                            time: 45,
                            feedback: {
                                type: 'warning',
                                title: 'Technical Focus',
                                text: 'Patch management is improved, but people remain vulnerable. Human error is still the weakest link.',
                                details: '+25 points - good but incomplete response'
                            }
                        }
                    },
                    {
                        text: 'Review and strengthen all third-party vendor security controls',
                        outcome: {
                            score: 25,
                            reputation: 0,
                            time: 45,
                            feedback: {
                                type: 'warning',
                                title: 'Supply Chain Security',
                                text: 'Third-party risks are addressed with new vendor controls. But internal vulnerabilities still exist.',
                                details: '+25 points - good but incomplete response'
                            }
                        }
                    },
                    {
                        text: 'Implement all of the above with a phased security improvement plan',
                        outcome: {
                            score: 70,
                            reputation: 25,
                            time: 120,
                            containment: 100,
                            feedback: {
                                type: 'success',
                                title: 'EXCEPTIONAL!',
                                text: 'You develop a comprehensive security improvement plan. All attack vectors are addressed through a multi-layered defense strategy:\n\n• Monthly security awareness training\n• Automated patch management within 48 hours\n• Third-party security assessments\n• Enhanced detection and response capabilities\n\nThe board approves increased security budget based on your recommendations.',
                                details: '+70 points and +25 reputation for comprehensive approach'
                            },
                            achievement: 'defense_in_depth'
                        }
                    }
                ]
            },
            {
                id: 5,
                title: 'THREAT INTELLIGENCE',
                subtitle: 'Advanced Threat Hunting',
                text: `Your threat intelligence team has identified suspicious activity that predates the ransomware attack.\n\nAdvanced Persistent Threat (APT) indicators suggest the attackers may have been in your network for weeks, possibly exfiltrating sensitive data.\n\nYou need to determine the full scope of the compromise.`,
                alert: '🎯 APT activity detected - potential long-term compromise',
                question: 'How do you proceed with threat hunting?',
                choices: [
                    {
                        text: 'Immediately disconnect all systems and perform full forensic imaging',
                        outcome: {
                            score: 20,
                            reputation: -15,
                            time: 240,
                            feedback: {
                                type: 'warning',
                                title: 'Overly Aggressive',
                                text: 'Complete shutdown provides forensic integrity but causes massive business disruption. The investigation is thorough but costly.',
                                details: '+20 points, -15 reputation for business impact'
                            }
                        }
                    },
                    {
                        text: 'Deploy EDR/XDR solutions and conduct live forensics while monitoring',
                        outcome: {
                            score: 55,
                            reputation: 10,
                            time: 72,
                            feedback: {
                                type: 'success',
                                title: 'Balanced Approach',
                                text: 'You deploy advanced detection tools and hunt for threats while maintaining business operations. Live forensics reveals the full attack timeline and additional compromised systems.',
                                details: '+55 points and +10 reputation'
                            },
                            achievement: 'threat_hunter'
                        }
                    },
                    {
                        text: 'Focus only on the ransomware, ignore the potential APT activity',
                        outcome: {
                            score: -40,
                            reputation: -30,
                            time: 10,
                            feedback: {
                                type: 'critical',
                                title: 'Critical Oversight',
                                text: 'Three months later, you discover the attackers still had access. Sensitive intellectual property was stolen. A second, more devastating attack occurs.',
                                details: '-40 points and -30 reputation for incomplete response'
                            }
                        }
                    },
                    {
                        text: 'Bring in specialized APT hunting team with threat intelligence',
                        outcome: {
                            score: 65,
                            reputation: 15,
                            time: 96,
                            feedback: {
                                type: 'success',
                                title: 'Expert Analysis',
                                text: 'The APT hunting team identifies a nation-state affiliated threat group. They find backdoors, lateral movement, and data staging. All persistence mechanisms are eliminated. Threat intelligence is shared with industry peers.',
                                details: '+65 points and +15 reputation'
                            },
                            achievement: 'apt_hunter'
                        }
                    }
                ]
            },
            {
                id: 6,
                title: 'REGULATORY COMPLIANCE',
                subtitle: 'Legal & Compliance Response',
                text: `Your legal team has determined that customer PII was accessed during the breach.\n\nYou must comply with GDPR, CCPA, and industry-specific regulations. Regulatory bodies are asking questions. Customer notification deadlines are approaching.\n\nHow you handle this will determine legal exposure and customer trust.`,
                alert: '⚖️ Legal compliance deadlines approaching - 72 hours to notify',
                question: 'What is your compliance strategy?',
                choices: [
                    {
                        text: 'Delay notifications until you have complete information',
                        outcome: {
                            score: -45,
                            reputation: -40,
                            time: 168,
                            feedback: {
                                type: 'critical',
                                title: 'Compliance Violation',
                                text: 'You miss regulatory deadlines. GDPR fines of €20M are imposed. Class action lawsuits are filed. Customer trust is permanently damaged.',
                                details: '-45 points and -40 reputation - severe legal consequences'
                            }
                        }
                    },
                    {
                        text: 'Provide immediate transparent disclosure with what you know',
                        outcome: {
                            score: 50,
                            reputation: 20,
                            time: 24,
                            feedback: {
                                type: 'success',
                                title: 'Transparent Response',
                                text: 'You meet all deadlines with honest, transparent communication. Customers appreciate the honesty. Regulators acknowledge your cooperation. Media coverage is more favorable.',
                                details: '+50 points and +20 reputation for transparency'
                            },
                            achievement: 'transparent_leader'
                        }
                    },
                    {
                        text: 'Notify only the minimum required by law, downplay the breach',
                        outcome: {
                            score: 10,
                            reputation: -25,
                            time: 72,
                            feedback: {
                                type: 'warning',
                                title: 'Minimal Compliance',
                                text: 'You meet legal minimums but customers feel deceived when full scope is revealed. Investigative journalists uncover details you tried to hide. Trust is damaged.',
                                details: '+10 points, -25 reputation for lack of transparency'
                            }
                        }
                    },
                    {
                        text: 'Work with legal team on comprehensive compliance plan with customer support',
                        outcome: {
                            score: 60,
                            reputation: 25,
                            time: 48,
                            feedback: {
                                type: 'success',
                                title: 'Exemplary Compliance',
                                text: 'You exceed regulatory requirements. Offer free credit monitoring, identity theft protection, and dedicated support line. Regulators cite you as a best practice example. Customer retention remains high.',
                                details: '+60 points and +25 reputation for going above and beyond'
                            },
                            achievement: 'compliance_champion'
                        }
                    }
                ]
            }
        ];
    }

    initializeAchievements() {
        return {
            quick_thinker: { name: 'Quick Thinker', description: 'Made the optimal choice in the initial detection', icon: '⚡' },
            team_player: { name: 'Team Player', description: 'Effectively coordinated with stakeholders', icon: '🤝' },
            ethical_responder: { name: 'Ethical Responder', description: 'Refused to negotiate with criminals', icon: '⚖️' },
            expert_consulted: { name: 'Expert Consulted', description: 'Brought in specialized expertise', icon: '🎓' },
            defense_in_depth: { name: 'Defense in Depth', description: 'Implemented comprehensive security controls', icon: '🛡️' },
            threat_hunter: { name: 'Threat Hunter', description: 'Successfully identified APT activity', icon: '🎯' },
            apt_hunter: { name: 'APT Hunter', description: 'Eliminated advanced persistent threats', icon: '🔍' },
            transparent_leader: { name: 'Transparent Leader', description: 'Provided honest, timely communication', icon: '💎' },
            compliance_champion: { name: 'Compliance Champion', description: 'Exceeded regulatory requirements', icon: '🏆' },
            perfect_score: { name: 'Perfect Response', description: 'Achieved maximum score', icon: '⭐' },
            speed_runner: { name: 'Speed Runner', description: 'Completed response in minimal time', icon: '⏱️' },
            reputation_master: { name: 'Reputation Master', description: 'Maintained 100%+ reputation', icon: '👑' }
        };
    }

    startGame() {
        this.state.difficulty = document.querySelector('.difficulty-btn.active').dataset.difficulty;
        this.state.currentScenario = 0;
        this.showScreen('game-screen');
        this.loadScenario(0);
    }

    loadScenario(index) {
        if (index >= this.scenarios.length) {
            this.endGame();
            return;
        }

        const scenario = this.scenarios[index];
        this.state.currentScenario = index;

        // Update UI
        document.getElementById('scenario-number').textContent = `SCENARIO ${scenario.id}`;
        document.getElementById('scenario-title').textContent = scenario.title;

        // Typewriter effect for scenario text
        this.typewriterEffect('scenario-text', scenario.text);

        // Show alert if exists
        if (scenario.alert) {
            document.getElementById('alert-box').style.display = 'flex';
            document.getElementById('alert-text').textContent = scenario.alert;
        }

        // Load choices
        this.loadChoices(scenario);

        // Hide feedback
        document.getElementById('feedback-container').style.display = 'none';

        // Update HUD
        this.updateHUD();

        // Save game state
        this.saveGame();
    }

    typewriterEffect(elementId, text, speed = 20) {
        const element = document.getElementById(elementId);
        element.textContent = '';
        let index = 0;

        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };

        type();
    }

    loadChoices(scenario) {
        const container = document.getElementById('choices-container');
        container.innerHTML = '';

        scenario.choices.forEach((choice, index) => {
            const choiceBtn = document.createElement('button');
            choiceBtn.className = 'choice-btn';
            choiceBtn.innerHTML = `
                <div class="choice-number">${index + 1}</div>
                <div class="choice-text">${choice.text}</div>
                <div class="choice-arrow">→</div>
            `;

            choiceBtn.addEventListener('click', () => {
                this.makeChoice(choice, index);
            });

            container.appendChild(choiceBtn);
        });
    }

    makeChoice(choice, choiceIndex) {
        const scenario = this.scenarios[this.state.currentScenario];
        const outcome = choice.outcome;
        const settings = this.difficultySettings[this.state.difficulty];

        // Apply outcome
        this.state.score += Math.round(outcome.score * settings.scoreMultiplier);
        this.state.reputation += outcome.reputation || 0;
        this.state.timeElapsed += Math.round(outcome.time * settings.timeMultiplier);
        this.state.containmentLevel = outcome.containment || this.state.containmentLevel;
        this.state.systemsAffected += outcome.systemsAffected || 0;

        // Record decision
        this.state.decisions.push({
            scenario: scenario.id,
            scenarioTitle: scenario.title,
            choice: choiceIndex + 1,
            choiceText: choice.text,
            outcome: outcome.feedback.type
        });

        // Check for achievement
        if (outcome.achievement) {
            this.unlockAchievement(outcome.achievement);
        }

        // Show feedback
        this.showFeedback(outcome.feedback);

        // Add to timeline
        this.addToTimeline(scenario, choice, outcome);

        // Update HUD
        this.updateHUD();

        // Hide choices
        document.getElementById('choices-container').style.display = 'none';
    }

    showFeedback(feedback) {
        const container = document.getElementById('feedback-container');
        const content = document.getElementById('feedback-content');

        let feedbackHTML = `
            <div class="feedback-${feedback.type}">
                <div class="feedback-title">${feedback.title}</div>
                <div class="feedback-text">${feedback.text}</div>
                <div class="feedback-details">${feedback.details}</div>
            </div>
        `;

        content.innerHTML = feedbackHTML;
        container.style.display = 'block';

        // Scroll to feedback
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    addToTimeline(scenario, choice, outcome) {
        const timeline = document.getElementById('timeline-items');

        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item outcome-${outcome.feedback.type}`;
        timelineItem.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-title">${scenario.title}</div>
                <div class="timeline-choice">${choice.text}</div>
                <div class="timeline-time">${this.state.timeElapsed}m elapsed</div>
            </div>
        `;

        timeline.appendChild(timelineItem);
    }

    nextScenario() {
        this.state.currentScenario++;
        document.getElementById('choices-container').style.display = 'flex';
        this.loadScenario(this.state.currentScenario);
    }

    updateHUD() {
        document.getElementById('score-display').textContent = this.state.score;
        document.getElementById('reputation-display').textContent = `${this.state.reputation}%`;
        document.getElementById('time-display').textContent = `${this.state.timeElapsed}m`;

        const containmentLevel = Math.max(0, Math.min(100, this.state.containmentLevel));
        document.getElementById('containment-fill').style.width = `${containmentLevel}%`;
        document.getElementById('containment-text').textContent = `${containmentLevel}%`;

        // Color coding for reputation
        const repDisplay = document.getElementById('reputation-display');
        if (this.state.reputation >= 80) {
            repDisplay.style.color = '#00ff88';
        } else if (this.state.reputation >= 50) {
            repDisplay.style.color = '#ffd700';
        } else {
            repDisplay.style.color = '#ff4444';
        }
    }

    unlockAchievement(achievementId) {
        if (!this.state.achievements.includes(achievementId)) {
            this.state.achievements.push(achievementId);
            this.showAchievementNotification(achievementId);
        }
    }

    showAchievementNotification(achievementId) {
        const achievement = this.achievements[achievementId];
        // You can add a toast notification here
        console.log(`Achievement unlocked: ${achievement.name}`);
    }

    endGame() {
        // Check for additional achievements
        if (this.state.score >= 300) {
            this.unlockAchievement('perfect_score');
        }
        if (this.state.timeElapsed <= 200) {
            this.unlockAchievement('speed_runner');
        }
        if (this.state.reputation >= 100) {
            this.unlockAchievement('reputation_master');
        }

        this.showResults();
    }

    showResults() {
        this.showScreen('results-screen');

        const ending = this.calculateEnding();

        // Display ending
        document.getElementById('ending-rank').textContent = ending.rank;
        document.getElementById('ending-title').textContent = ending.title;
        document.getElementById('outcome-description').innerHTML = ending.description;

        // Display stats
        document.getElementById('final-score').textContent = this.state.score;
        document.getElementById('final-reputation').textContent = `${this.state.reputation}%`;
        document.getElementById('final-time').textContent = `${Math.floor(this.state.timeElapsed / 60)}h ${this.state.timeElapsed % 60}m`;
        document.getElementById('final-containment').textContent = `${this.state.containmentLevel}%`;

        // Display achievements
        if (this.state.achievements.length > 0) {
            document.getElementById('achievements-section').style.display = 'block';
            const achievementsList = document.getElementById('achievements-list');
            achievementsList.innerHTML = '';

            this.state.achievements.forEach(achId => {
                const ach = this.achievements[achId];
                const achElement = document.createElement('div');
                achElement.className = 'achievement-item';
                achElement.innerHTML = `
                    <div class="achievement-icon">${ach.icon}</div>
                    <div class="achievement-details">
                        <div class="achievement-name">${ach.name}</div>
                        <div class="achievement-desc">${ach.description}</div>
                    </div>
                `;
                achievementsList.appendChild(achElement);
            });
        }

        // Display decision summary
        const summaryItems = document.getElementById('summary-items');
        summaryItems.innerHTML = '';

        this.state.decisions.forEach(decision => {
            const item = document.createElement('div');
            item.className = `summary-item outcome-${decision.outcome}`;
            item.innerHTML = `
                <div class="summary-scenario">${decision.scenarioTitle}</div>
                <div class="summary-choice">Choice ${decision.choice}: ${decision.choiceText}</div>
            `;
            summaryItems.appendChild(item);
        });
    }

    calculateEnding() {
        const score = this.state.score;
        const reputation = this.state.reputation;

        if (score >= 300 && reputation >= 80) {
            return {
                rank: 'EXEMPLARY',
                title: 'SECURITY HERO',
                description: `
                    <p>Your exceptional incident response has saved the company!</p>
                    <ul>
                        <li>✅ Incident contained with minimal data loss</li>
                        <li>✅ Attackers identified and reported to law enforcement</li>
                        <li>✅ Comprehensive security improvements implemented</li>
                        <li>✅ Company reputation strengthened by transparent handling</li>
                        <li>✅ Industry recognition for incident response excellence</li>
                    </ul>
                    <p class="career-impact">🎖️ You're promoted to Chief Information Security Officer</p>
                `
            };
        } else if (score >= 200 && reputation >= 60) {
            return {
                rank: 'SUCCESS',
                title: 'CRISIS AVERTED',
                description: `
                    <p>You successfully navigated a major security incident.</p>
                    <ul>
                        <li>✅ Incident contained with moderate impact</li>
                        <li>✅ Most critical systems recovered</li>
                        <li>✅ Security improvements in progress</li>
                        <li>⚠️ Some reputation damage, but company remains stable</li>
                    </ul>
                    <p class="career-impact">👍 Management recognizes your solid performance</p>
                `
            };
        } else if (score >= 100 && reputation >= 40) {
            return {
                rank: 'SURVIVAL',
                title: 'BARELY MADE IT',
                description: `
                    <p>The company survives, but it was a close call.</p>
                    <ul>
                        <li>⚠️ Incident eventually contained, but with significant damage</li>
                        <li>⚠️ Major data loss and business disruption</li>
                        <li>⚠️ Customer trust damaged</li>
                        <li>❌ Legal and regulatory consequences</li>
                    </ul>
                    <p class="career-impact">📉 You keep your job, but you're on thin ice</p>
                `
            };
        } else {
            return {
                rank: 'FAILURE',
                title: 'CATASTROPHIC BREACH',
                description: `
                    <p>Your incident response was inadequate. The consequences are severe.</p>
                    <ul>
                        <li>❌ Widespread system compromise and data loss</li>
                        <li>❌ Customer data leaked to the dark web</li>
                        <li>❌ Massive regulatory fines incoming</li>
                        <li>❌ Company stock price crashes 40%</li>
                        <li>❌ Multiple lawsuits filed</li>
                    </ul>
                    <p class="career-impact">💼 You are asked to resign</p>
                `
            };
        }
    }

    resetGame() {
        this.state = {
            score: 0,
            reputation: 100,
            timeElapsed: 0,
            containmentLevel: 0,
            systemsAffected: 0,
            decisions: [],
            currentScenario: 0,
            difficulty: 'normal',
            achievements: []
        };

        document.getElementById('timeline-items').innerHTML = '';
        this.showScreen('welcome-screen');
    }

    shareResults() {
        const ending = this.calculateEnding();
        const text = `I just completed Incident Response: The Game!\n\nEnding: ${ending.rank}\nScore: ${this.state.score}\nReputation: ${this.state.reputation}%\nAchievements: ${this.state.achievements.length}\n\nCan you do better?`;

        if (navigator.share) {
            navigator.share({
                title: 'Incident Response: The Game',
                text: text
            });
        } else {
            navigator.clipboard.writeText(text);
            alert('Results copied to clipboard!');
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    saveGame() {
        localStorage.setItem('ir_game_save', JSON.stringify({
            state: this.state,
            timestamp: Date.now()
        }));
    }

    checkSavedGames() {
        const saved = localStorage.getItem('ir_game_save');
        if (saved) {
            const data = JSON.parse(saved);
            // Could add UI to continue saved game
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new GameEngine();
});

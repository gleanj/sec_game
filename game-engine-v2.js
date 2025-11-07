/**
 * CyberSim Pro - World-Class Incident Response Training Platform
 * Version 2.0 - Enterprise Edition
 *
 * Advanced game engine with state machine, tool simulations, and professional features
 */

class CyberSimEngine {
  constructor() {
    this.version = '2.0.0';
    this.state = this.initializeState();
    this.tools = new ToolSimulator();
    this.mentor = new AIMentor();
    this.analytics = new AnalyticsEngine();
    this.scenarios = new ScenarioLibrary();
    this.progression = new ProgressionSystem();
    this.multiplayer = new MultiplayerManager();
    this.evidence = new EvidenceSystem();
    this.timeline = new TimelineReconstructor();
    this.network = new NetworkVisualizer();
    this.compliance = new ComplianceTracker();

    this.initializeEventListeners();
    this.loadPlayerProfile();
  }

  initializeState() {
    return {
      // Core game state
      gameMode: 'campaign', // campaign, challenge, multiplayer, training
      difficulty: 'normal',
      currentScenario: null,
      phase: 'detection', // detection, containment, eradication, recovery, lessons_learned

      // Player stats
      player: {
        id: this.generatePlayerId(),
        name: '',
        level: 1,
        xp: 0,
        rank: 'Junior SOC Analyst',
        skillPoints: 0,
        certifications: [],
        completedScenarios: [],
        achievements: [],
        statistics: {
          totalPlayTime: 0,
          scenariosCompleted: 0,
          perfectScores: 0,
          averageResponseTime: 0,
          decisionsCorrect: 0,
          decisionsTotal: 0
        }
      },

      // Current session
      session: {
        score: 0,
        reputation: 100,
        timeElapsed: 0,
        budget: 100000,
        containmentLevel: 0,
        systemsCompromised: 0,
        dataLoss: 0,
        downtime: 0,
        stakeholderConfidence: 100,
        teamMorale: 100,
        mediaAttention: 0,
        legalRisk: 0,
        regulatoryRisk: 0
      },

      // Decisions and timeline
      decisions: [],
      evidenceCollected: [],
      toolsUsed: [],
      attackTimeline: [],
      communicationLog: [],

      // Active elements
      activeAlerts: [],
      availableTools: [],
      unlockedFeatures: [],

      // Team (multiplayer)
      team: null,
      teammates: [],

      // Settings
      settings: {
        showHints: true,
        autoSave: true,
        soundEnabled: true,
        realtimeMode: false,
        mentorEnabled: true,
        difficultyAdaptive: false
      }
    };
  }

  generatePlayerId() {
    return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  initializeEventListeners() {
    // Handle page visibility for auto-pause
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state.session.gameRunning) {
        this.pauseGame();
      }
    });

    // Auto-save every 30 seconds
    if (this.state.settings.autoSave) {
      setInterval(() => this.saveGame(), 30000);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  }

  handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 's':
          e.preventDefault();
          this.saveGame();
          break;
        case 'h':
          e.preventDefault();
          this.mentor.showHint();
          break;
        case 't':
          e.preventDefault();
          this.timeline.toggleView();
          break;
        case 'n':
          e.preventDefault();
          this.network.toggleTopology();
          break;
      }
    }
  }

  async loadPlayerProfile() {
    const saved = localStorage.getItem('cybersim_profile_v2');
    if (saved) {
      try {
        const profile = JSON.parse(saved);
        this.state.player = { ...this.state.player, ...profile };
        this.progression.updateUI();
      } catch (e) {
        console.error('Failed to load player profile:', e);
      }
    }
  }

  saveGame() {
    try {
      // Save player profile
      localStorage.setItem('cybersim_profile_v2', JSON.stringify(this.state.player));

      // Save current session
      localStorage.setItem('cybersim_session_v2', JSON.stringify({
        state: this.state,
        timestamp: Date.now()
      }));

      this.showNotification('Game saved successfully', 'success');
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      this.showNotification('Failed to save game', 'error');
      return false;
    }
  }

  loadGame() {
    const saved = localStorage.getItem('cybersim_session_v2');
    if (!saved) return false;

    try {
      const { state, timestamp } = JSON.parse(saved);

      // Check if save is too old (> 7 days)
      if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
        if (!confirm('Saved game is over 7 days old. Load anyway?')) {
          return false;
        }
      }

      this.state = { ...this.state, ...state };
      this.resumeScenario();
      this.showNotification('Game loaded successfully', 'success');
      return true;
    } catch (e) {
      console.error('Load failed:', e);
      return false;
    }
  }

  startScenario(scenarioId, options = {}) {
    const scenario = this.scenarios.getScenario(scenarioId);
    if (!scenario) {
      console.error('Scenario not found:', scenarioId);
      return;
    }

    // Check if player meets requirements
    if (!this.progression.meetsRequirements(scenario.requirements)) {
      this.showNotification('You must reach level ' + scenario.requirements.level + ' to unlock this scenario', 'warning');
      return;
    }

    // Initialize scenario state
    this.state.currentScenario = scenario;
    this.state.phase = 'briefing';
    this.resetSessionState();

    // Apply difficulty modifiers
    this.applyDifficultySettings();

    // Generate dynamic elements
    if (scenario.dynamic) {
      this.scenarios.generateDynamicElements(scenario);
    }

    // Initialize scenario-specific tools
    this.tools.initializeForScenario(scenario);

    // Start analytics tracking
    this.analytics.startSession(scenarioId);

    // Show briefing
    this.showBriefing(scenario);

    // Start mentor if enabled
    if (this.state.settings.mentorEnabled) {
      this.mentor.introduce(scenario);
    }

    this.saveGame();
  }

  resetSessionState() {
    this.state.session = {
      score: 0,
      reputation: 100,
      timeElapsed: 0,
      budget: 100000,
      containmentLevel: 0,
      systemsCompromised: 0,
      dataLoss: 0,
      downtime: 0,
      stakeholderConfidence: 100,
      teamMorale: 100,
      mediaAttention: 0,
      legalRisk: 0,
      regulatoryRisk: 0,
      gameRunning: false,
      startTime: null
    };

    this.state.decisions = [];
    this.state.evidenceCollected = [];
    this.state.toolsUsed = [];
    this.state.attackTimeline = [];
    this.state.communicationLog = [];
    this.state.activeAlerts = [];
  }

  applyDifficultySettings() {
    const multipliers = {
      easy: { time: 0.7, score: 0.8, budget: 1.5, hints: 3 },
      normal: { time: 1.0, score: 1.0, budget: 1.0, hints: 2 },
      hard: { time: 1.3, score: 1.2, budget: 0.7, hints: 1 },
      expert: { time: 1.5, score: 1.5, budget: 0.5, hints: 0 }
    };

    const settings = multipliers[this.state.difficulty];
    this.state.difficultyMultipliers = settings;
  }

  showBriefing(scenario) {
    const briefingHTML = `
      <div class="briefing-container">
        <div class="briefing-header">
          <h1>⚠️ INCIDENT ALERT</h1>
          <div class="alert-level ${scenario.severity}">${scenario.severity.toUpperCase()}</div>
        </div>

        <div class="briefing-content">
          <div class="info-section">
            <h2>Scenario</h2>
            <p class="scenario-title">${scenario.title}</p>
            <p class="scenario-desc">${scenario.description}</p>
          </div>

          <div class="info-grid">
            <div class="info-box">
              <h3>Attack Type</h3>
              <p>${scenario.attackType}</p>
            </div>
            <div class="info-box">
              <h3>Industry</h3>
              <p>${scenario.industry}</p>
            </div>
            <div class="info-box">
              <h3>Systems Affected</h3>
              <p>${scenario.systemsAffected} systems</p>
            </div>
            <div class="info-box">
              <h3>Initial Detection</h3>
              <p>${scenario.detectionMethod}</p>
            </div>
          </div>

          <div class="objectives-section">
            <h2>Your Objectives</h2>
            <ul class="objectives-list">
              ${scenario.objectives.map(obj => `<li>${obj}</li>`).join('')}
            </ul>
          </div>

          <div class="compliance-section">
            <h3>Compliance Frameworks</h3>
            <div class="compliance-tags">
              ${scenario.frameworks.map(fw => `<span class="tag">${fw}</span>`).join('')}
            </div>
          </div>

          <div class="resources-section">
            <h2>Available Resources</h2>
            <div class="resource-grid">
              <div>
                <strong>Budget:</strong> $${this.state.session.budget.toLocaleString()}
              </div>
              <div>
                <strong>Team:</strong> ${scenario.teamSize} analysts
              </div>
              <div>
                <strong>Tools:</strong> ${scenario.availableTools.length} security tools
              </div>
            </div>
          </div>
        </div>

        <div class="briefing-footer">
          <button class="btn-primary" onclick="game.beginIncidentResponse()">
            Begin Incident Response
          </button>
          <button class="btn-secondary" onclick="game.showScenarioDetails()">
            Review Details
          </button>
        </div>
      </div>
    `;

    this.showModal(briefingHTML);
  }

  beginIncidentResponse() {
    this.closeModal();
    this.state.phase = 'detection';
    this.state.session.gameRunning = true;
    this.state.session.startTime = Date.now();

    // Show main game interface
    this.renderGameInterface();

    // Start first phase
    this.startDetectionPhase();

    // Start time tracking
    this.startTimer();

    // Show initial alerts
    this.showInitialAlerts();
  }

  renderGameInterface() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
      <div class="game-interface">
        <!-- Top Navigation -->
        <nav class="top-nav">
          <div class="nav-left">
            <h1 class="game-title">CyberSim Pro</h1>
            <span class="scenario-name">${this.state.currentScenario.title}</span>
          </div>
          <div class="nav-center">
            <div class="phase-indicator">
              <span class="phase-label">Phase:</span>
              <span class="phase-value">${this.formatPhase(this.state.phase)}</span>
            </div>
          </div>
          <div class="nav-right">
            <button class="icon-btn" onclick="game.mentor.showHint()" title="Get Hint (Ctrl+H)">
              💡
            </button>
            <button class="icon-btn" onclick="game.saveGame()" title="Save Game (Ctrl+S)">
              💾
            </button>
            <button class="icon-btn" onclick="game.showSettings()">
              ⚙️
            </button>
          </div>
        </nav>

        <!-- Main Content Grid -->
        <div class="main-grid">
          <!-- Left Sidebar - Tools & Resources -->
          <aside class="left-sidebar">
            <div class="sidebar-section">
              <h3>Security Tools</h3>
              <div id="tools-panel" class="tools-panel"></div>
            </div>

            <div class="sidebar-section">
              <h3>Evidence Locker</h3>
              <div id="evidence-panel" class="evidence-panel"></div>
            </div>

            <div class="sidebar-section">
              <h3>Team Status</h3>
              <div id="team-panel" class="team-panel"></div>
            </div>
          </aside>

          <!-- Center - Main Content Area -->
          <main class="main-content">
            <!-- HUD - Stats Display -->
            <div class="hud">
              <div class="hud-stat">
                <span class="stat-label">Score</span>
                <span class="stat-value" id="score">0</span>
              </div>
              <div class="hud-stat">
                <span class="stat-label">Reputation</span>
                <span class="stat-value" id="reputation">100</span>
              </div>
              <div class="hud-stat">
                <span class="stat-label">Time</span>
                <span class="stat-value" id="time">00:00</span>
              </div>
              <div class="hud-stat">
                <span class="stat-label">Containment</span>
                <span class="stat-value" id="containment">0%</span>
              </div>
              <div class="hud-stat">
                <span class="stat-label">Budget</span>
                <span class="stat-value" id="budget">$100k</span>
              </div>
              <div class="hud-stat">
                <span class="stat-label">Confidence</span>
                <span class="stat-value" id="confidence">100%</span>
              </div>
            </div>

            <!-- Main Action Area -->
            <div id="action-area" class="action-area">
              <!-- Dynamic content goes here -->
            </div>

            <!-- Decision Panel -->
            <div id="decision-panel" class="decision-panel">
              <!-- Choices appear here -->
            </div>
          </main>

          <!-- Right Sidebar - Alerts & Timeline -->
          <aside class="right-sidebar">
            <div class="sidebar-section">
              <h3>Active Alerts</h3>
              <div id="alerts-panel" class="alerts-panel"></div>
            </div>

            <div class="sidebar-section">
              <h3>Attack Timeline</h3>
              <div id="timeline-panel" class="timeline-panel"></div>
            </div>

            <div class="sidebar-section">
              <h3>Network Map</h3>
              <div id="network-panel" class="network-panel"></div>
            </div>
          </aside>
        </div>

        <!-- Bottom Bar - Communications -->
        <div class="bottom-bar">
          <div class="comm-tabs">
            <button class="tab-btn active" data-tab="logs">System Logs</button>
            <button class="tab-btn" data-tab="comms">Communications</button>
            <button class="tab-btn" data-tab="intel">Threat Intel</button>
            <button class="tab-btn" data-tab="notes">Investigation Notes</button>
          </div>
          <div id="bottom-content" class="bottom-content">
            <div class="terminal-output" id="terminal-output"></div>
          </div>
        </div>
      </div>
    `;

    this.initializeUI();
  }

  initializeUI() {
    // Initialize all UI components
    this.tools.renderToolsPanel();
    this.evidence.renderEvidencePanel();
    this.timeline.renderTimeline();
    this.network.renderNetworkMap();
    this.updateHUD();

    // Setup tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.switchBottomTab(e.target.dataset.tab);
      });
    });
  }

  switchBottomTab(tab) {
    const content = document.getElementById('bottom-content');
    switch(tab) {
      case 'logs':
        content.innerHTML = '<div class="terminal-output" id="terminal-output"></div>';
        this.tools.showSystemLogs();
        break;
      case 'comms':
        content.innerHTML = '<div class="communications-view" id="comms-view"></div>';
        this.showCommunications();
        break;
      case 'intel':
        content.innerHTML = '<div class="intel-feed" id="intel-feed"></div>';
        this.showThreatIntel();
        break;
      case 'notes':
        content.innerHTML = '<div class="notes-editor" id="notes-editor"></div>';
        this.showInvestigationNotes();
        break;
    }
  }

  startDetectionPhase() {
    const scenario = this.state.currentScenario;

    this.showPhaseTransition('Detection & Analysis',
      'Initial incident detected. Your objective is to determine the scope and nature of the attack.'
    );

    setTimeout(() => {
      this.displayDetectionScenario();
    }, 2000);
  }

  displayDetectionScenario() {
    const scenario = this.state.currentScenario;
    const phase = scenario.phases.detection;

    const actionHTML = `
      <div class="scenario-content">
        <div class="situation-report">
          <h2>🚨 Situation Report</h2>
          <div class="sitrep-content">
            ${phase.narrative}
          </div>
        </div>

        <div class="initial-findings">
          <h3>Initial Findings</h3>
          <ul class="findings-list">
            ${phase.initialFindings.map(finding => `
              <li class="finding-item ${finding.severity}">
                <span class="finding-icon">${this.getSeverityIcon(finding.severity)}</span>
                <span class="finding-text">${finding.text}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="investigation-prompt">
          <h3>What is your first action?</h3>
          <p class="prompt-hint">Choose wisely - your initial response sets the tone for the entire incident.</p>
        </div>
      </div>
    `;

    document.getElementById('action-area').innerHTML = actionHTML;
    this.displayChoices(phase.choices);
  }

  displayChoices(choices) {
    const decisionPanel = document.getElementById('decision-panel');

    const choicesHTML = choices.map((choice, index) => `
      <div class="choice-card" data-choice="${index}">
        <div class="choice-header">
          <span class="choice-icon">${choice.icon || '🎯'}</span>
          <h4 class="choice-title">${choice.title}</h4>
        </div>
        <p class="choice-description">${choice.description}</p>
        <div class="choice-meta">
          ${choice.cost ? `<span class="meta-tag">💰 Cost: $${choice.cost.toLocaleString()}</span>` : ''}
          ${choice.time ? `<span class="meta-tag">⏱️ Time: ${choice.time}min</span>` : ''}
          ${choice.difficulty ? `<span class="meta-tag difficulty-${choice.difficulty}">Difficulty: ${choice.difficulty}</span>` : ''}
          ${choice.recommended ? `<span class="meta-tag recommended">✅ Recommended</span>` : ''}
        </div>
        <button class="choice-btn" onclick="game.makeDecision(${index})">
          Select This Action
        </button>
      </div>
    `).join('');

    decisionPanel.innerHTML = `<div class="choices-grid">${choicesHTML}</div>`;
  }

  makeDecision(choiceIndex) {
    const phase = this.state.currentScenario.phases[this.state.phase];
    const choice = phase.choices[choiceIndex];

    if (!choice) {
      console.error('Invalid choice index:', choiceIndex);
      return;
    }

    // Record decision
    this.recordDecision(choice, choiceIndex);

    // Apply outcome
    this.applyOutcome(choice.outcome);

    // Show feedback
    this.showDecisionFeedback(choice);

    // Progress to next decision or phase
    setTimeout(() => {
      this.progressGame(choice);
    }, 3000);
  }

  recordDecision(choice, index) {
    const decision = {
      timestamp: Date.now(),
      phase: this.state.phase,
      choiceIndex: index,
      choiceTitle: choice.title,
      outcome: choice.outcome,
      stateBefore: { ...this.state.session }
    };

    this.state.decisions.push(decision);
    this.analytics.trackDecision(decision);
  }

  applyOutcome(outcome) {
    // Apply all stat changes
    Object.keys(outcome).forEach(key => {
      if (key === 'feedback' || key === 'achievement' || key === 'unlocks') return;

      if (this.state.session[key] !== undefined) {
        this.state.session[key] += outcome[key];

        // Clamp values
        if (key === 'reputation' || key === 'containmentLevel' ||
            key === 'stakeholderConfidence' || key === 'teamMorale') {
          this.state.session[key] = Math.max(0, Math.min(100, this.state.session[key]));
        }
      }
    });

    // Check for achievement
    if (outcome.achievement) {
      this.progression.unlockAchievement(outcome.achievement);
    }

    // Check for unlocks
    if (outcome.unlocks) {
      outcome.unlocks.forEach(unlock => {
        this.unlockFeature(unlock);
      });
    }

    // Update UI
    this.updateHUD();

    // Save game
    this.saveGame();
  }

  showDecisionFeedback(choice) {
    const outcome = choice.outcome;
    const feedback = outcome.feedback || {};

    const feedbackHTML = `
      <div class="feedback-overlay">
        <div class="feedback-content ${feedback.type || 'info'}">
          <div class="feedback-icon">${this.getFeedbackIcon(feedback.type)}</div>
          <h3>${feedback.title || 'Decision Made'}</h3>
          <p>${feedback.message || 'Processing your decision...'}</p>

          ${feedback.details ? `
            <div class="feedback-details">
              <h4>Impact Analysis:</h4>
              <ul>
                ${feedback.details.map(detail => `<li>${detail}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="stat-changes">
            ${this.renderStatChanges(outcome)}
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', feedbackHTML);

    // Auto-remove after delay
    setTimeout(() => {
      const overlay = document.querySelector('.feedback-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500);
      }
    }, 2500);
  }

  renderStatChanges(outcome) {
    const stats = [];

    const statConfig = {
      score: { icon: '⭐', label: 'Score', positive: true },
      reputation: { icon: '👥', label: 'Reputation', positive: true },
      timeElapsed: { icon: '⏱️', label: 'Time', positive: false },
      budget: { icon: '💰', label: 'Budget', positive: true },
      containmentLevel: { icon: '🛡️', label: 'Containment', positive: true },
      stakeholderConfidence: { icon: '📊', label: 'Confidence', positive: true },
      teamMorale: { icon: '👥', label: 'Morale', positive: true }
    };

    Object.keys(outcome).forEach(key => {
      if (statConfig[key] && outcome[key] !== 0) {
        const config = statConfig[key];
        const value = outcome[key];
        const isPositive = config.positive ? value > 0 : value < 0;
        const arrow = isPositive ? '↑' : '↓';
        const className = isPositive ? 'positive' : 'negative';

        stats.push(`
          <div class="stat-change ${className}">
            <span class="stat-icon">${config.icon}</span>
            <span class="stat-label">${config.label}</span>
            <span class="stat-value">${arrow} ${Math.abs(value)}</span>
          </div>
        `);
      }
    });

    return stats.join('');
  }

  progressGame(choice) {
    // Determine next step based on choice and game state
    if (choice.nextPhase) {
      this.transitionToPhase(choice.nextPhase);
    } else if (choice.nextDecision) {
      this.showNextDecision(choice.nextDecision);
    } else if (this.isPhaseComplete()) {
      this.advanceToNextPhase();
    } else {
      this.continueCurrentPhase();
    }
  }

  updateHUD() {
    const s = this.state.session;

    this.updateElement('score', s.score);
    this.updateElement('reputation', s.reputation);
    this.updateElement('time', this.formatTime(s.timeElapsed));
    this.updateElement('containment', s.containmentLevel + '%');
    this.updateElement('budget', '$' + (s.budget / 1000).toFixed(0) + 'k');
    this.updateElement('confidence', s.stakeholderConfidence + '%');
  }

  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  formatPhase(phase) {
    return phase.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  getSeverityIcon(severity) {
    const icons = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢',
      info: 'ℹ️'
    };
    return icons[severity] || '⚪';
  }

  getFeedbackIcon(type) {
    const icons = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      critical: '🚨',
      info: 'ℹ️'
    };
    return icons[type] || '💡';
  }

  showPhaseTransition(phaseTitle, description) {
    const transitionHTML = `
      <div class="phase-transition">
        <div class="transition-content">
          <h1 class="transition-title">${phaseTitle}</h1>
          <p class="transition-desc">${description}</p>
          <div class="transition-loader"></div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', transitionHTML);

    setTimeout(() => {
      const transition = document.querySelector('.phase-transition');
      if (transition) {
        transition.style.opacity = '0';
        setTimeout(() => transition.remove(), 500);
      }
    }, 2000);
  }

  showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        ${content}
      </div>
    `;
    document.body.appendChild(modal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });
  }

  closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.style.opacity = '0';
      setTimeout(() => modal.remove(), 300);
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span class="notification-icon">${this.getFeedbackIcon(type)}</span>
      <span class="notification-message">${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.state.session.gameRunning) {
        this.state.session.timeElapsed++;
        this.updateElement('time', this.formatTime(this.state.session.timeElapsed));
      }
    }, 60000); // Update every minute
  }

  pauseGame() {
    this.state.session.gameRunning = false;
    this.showNotification('Game paused', 'info');
  }

  resumeGame() {
    this.state.session.gameRunning = true;
    this.showNotification('Game resumed', 'success');
  }
}

// Initialize global game instance
let game = null;

document.addEventListener('DOMContentLoaded', () => {
  game = new CyberSimEngine();
  console.log('CyberSim Pro v2.0 initialized');
});

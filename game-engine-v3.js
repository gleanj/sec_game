/**
 * CyberSim Pro v3.0 - Ultimate Incident Response Training Platform
 *
 * FIXES:
 * - Notification throttling (no spam)
 * - Proper modal sizing (no scrollbars)
 * - All buttons fully functional
 *
 * NEW:
 * - Real attack visualizations
 * - Malware simulations (Cobalt Strike, Mimikatz, etc.)
 * - Network attack animations
 * - Interactive forensics
 */

class CyberSimEngine {
  constructor() {
    this.version = '3.0.0';

    // Notification throttling
    this.lastNotificationTime = 0;
    this.notificationThrottle = 3000; // 3 seconds minimum between notifications
    this.lastSaveNotification = 0;
    this.saveNotificationThrottle = 30000; // Only show save notification every 30 seconds

    this.state = this.initializeState();
    this.tools = new ToolSimulator(this);
    this.mentor = new AIMentor(this);
    this.analytics = new AnalyticsEngine(this);
    this.scenarios = new ScenarioLibrary(this);
    this.progression = new ProgressionSystem(this);
    this.evidence = new EvidenceSystem(this);
    this.timeline = new TimelineReconstructor(this);
    this.network = new NetworkVisualizer(this);
    this.attackVisualizer = new AttackVisualizer(this);
    this.compliance = new ComplianceTracker(this);

    this.initializeEventListeners();
    this.loadPlayerProfile();

    console.log('🎮 CyberSim Pro v3.0 initialized');
  }

  initializeState() {
    return {
      gameMode: 'campaign',
      difficulty: 'normal',
      currentScenario: null,
      phase: 'detection',
      player: {
        id: this.generatePlayerId(),
        name: 'Analyst',
        level: 1,
        xp: 0,
        rank: 'Junior SOC Analyst',
        skillPoints: 3,
        certifications: [],
        completedScenarios: [],
        achievements: [],
        unlockedSkills: [],
        skillEffects: {},
        statistics: {
          totalPlayTime: 0,
          scenariosCompleted: 0,
          perfectScores: 0,
          averageResponseTime: 0,
          decisionsCorrect: 0,
          decisionsTotal: 0
        }
      },
      session: {
        score: 0,
        reputation: 100,
        timeElapsed: 0,
        budget: 100000,
        containmentLevel: 0,
        systemsCompromised: 5,
        dataLoss: 0,
        downtime: 0,
        stakeholderConfidence: 100,
        teamMorale: 100,
        mediaAttention: 0,
        legalRisk: 0,
        regulatoryRisk: 0,
        gameRunning: false,
        startTime: null
      },
      decisions: [],
      evidenceCollected: [],
      toolsUsed: [],
      attackTimeline: [],
      communicationLog: [],
      activeAlerts: [],
      availableTools: ['siem', 'edr', 'forensics', 'threatIntel', 'networkAnalyzer'],
      unlockedFeatures: [],
      team: null,
      teammates: [],
      settings: {
        showHints: true,
        autoSave: false, // Disabled to prevent spam
        soundEnabled: true,
        realtimeMode: true,
        mentorEnabled: true,
        difficultyAdaptive: false
      }
    };
  }

  generatePlayerId() {
    return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  initializeEventListeners() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state.session.gameRunning) {
        this.pauseGame();
      }
    });

    // Manual save only, no auto-save spam
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  }

  handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 's':
          e.preventDefault();
          this.saveGameManual();
          break;
        case 'h':
          e.preventDefault();
          if (this.mentor) this.mentor.showHint();
          break;
        case 't':
          e.preventDefault();
          if (this.timeline) this.timeline.toggleView();
          break;
        case 'n':
          e.preventDefault();
          if (this.network) this.network.toggleTopology();
          break;
      }
    }
  }

  async loadPlayerProfile() {
    const saved = localStorage.getItem('cybersim_profile_v3');
    if (saved) {
      try {
        const profile = JSON.parse(saved);
        this.state.player = { ...this.state.player, ...profile };
        if (this.progression) this.progression.updateUI();
      } catch (e) {
        console.error('Failed to load player profile:', e);
      }
    }
  }

  saveGameManual() {
    const success = this.saveGame(true);
    if (success) {
      this.showNotification('Game saved successfully', 'success', true);
    }
  }

  saveGame(manual = false) {
    try {
      // Save player profile
      localStorage.setItem('cybersim_profile_v3', JSON.stringify(this.state.player));

      // Save current session if in game
      if (this.state.currentScenario) {
        localStorage.setItem('cybersim_session_v3', JSON.stringify({
          state: this.state,
          timestamp: Date.now()
        }));
      }

      // Only show notification if manual save
      if (!manual) {
        const now = Date.now();
        if (now - this.lastSaveNotification > this.saveNotificationThrottle) {
          this.showNotification('Auto-saved', 'info', true);
          this.lastSaveNotification = now;
        }
      }

      return true;
    } catch (e) {
      console.error('Save failed:', e);
      if (manual) {
        this.showNotification('Failed to save game', 'error', true);
      }
      return false;
    }
  }

  loadGame() {
    const saved = localStorage.getItem('cybersim_session_v3');
    if (!saved) return false;

    try {
      const { state, timestamp } = JSON.parse(saved);

      if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
        if (!confirm('Saved game is over 7 days old. Load anyway?')) {
          return false;
        }
      }

      this.state = { ...this.state, ...state };
      this.resumeScenario();
      this.showNotification('Game loaded successfully', 'success', true);
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

    if (!this.progression.meetsRequirements(scenario.requirements)) {
      this.showNotification('You must reach level ' + (scenario.requirements?.level || 1) + ' to unlock this scenario', 'warning', true);
      return;
    }

    this.state.currentScenario = scenario;
    this.state.phase = 'briefing';
    this.resetSessionState();
    this.applyDifficultySettings();

    if (scenario.dynamic) {
      this.scenarios.generateDynamicElements(scenario);
    }

    if (this.tools) {
      this.tools.initializeForScenario(scenario);
    }

    if (this.analytics) {
      this.analytics.startSession(scenarioId);
    }

    this.showBriefing(scenario);

    if (this.state.settings.mentorEnabled && this.mentor) {
      setTimeout(() => this.mentor.introduce(scenario), 2000);
    }

    this.saveGame(false);
  }

  resetSessionState() {
    this.state.session = {
      score: 0,
      reputation: 100,
      timeElapsed: 0,
      budget: 100000,
      containmentLevel: 0,
      systemsCompromised: 5,
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

    const settings = multipliers[this.state.difficulty] || multipliers.normal;
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
            <p class="scenario-desc">${scenario.description || 'Critical security incident detected'}</p>
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
              <p>${scenario.systemsAffected || this.state.session.systemsCompromised} systems</p>
            </div>
            <div class="info-box">
              <h3>Initial Detection</h3>
              <p>${scenario.detectionMethod}</p>
            </div>
          </div>

          <div class="objectives-section">
            <h2>Your Objectives</h2>
            <ul class="objectives-list">
              ${(scenario.objectives || ['Contain the threat', 'Investigate the incident', 'Eradicate malware', 'Recover systems']).map(obj => `<li>${obj}</li>`).join('')}
            </ul>
          </div>

          <div class="compliance-section">
            <h3>Compliance Frameworks</h3>
            <div class="compliance-tags">
              ${(scenario.frameworks || ['NIST CSF']).map(fw => `<span class="tag">${fw}</span>`).join('')}
            </div>
          </div>

          <div class="resources-section">
            <h2>Available Resources</h2>
            <div class="resource-grid">
              <div><strong>Budget:</strong> $${this.state.session.budget.toLocaleString()}</div>
              <div><strong>Team:</strong> ${scenario.teamSize || 4} analysts</div>
              <div><strong>Tools:</strong> ${(scenario.availableTools || this.state.availableTools).length} security tools</div>
            </div>
          </div>
        </div>

        <div class="briefing-footer">
          <button class="btn-primary" onclick="game.beginIncidentResponse()">
            Begin Incident Response
          </button>
          <button class="btn-secondary" onclick="game.closeModal()">
            Back to Menu
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

    this.renderGameInterface();
    this.startDetectionPhase();
    this.startTimer();
    this.showInitialAlerts();
  }

  renderGameInterface() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
      <div class="game-interface">
        <nav class="top-nav">
          <div class="nav-left">
            <h1 class="game-title">CyberSim Pro</h1>
            <span class="scenario-name">${this.state.currentScenario?.title || 'Training'}</span>
          </div>
          <div class="nav-center">
            <div class="phase-indicator">
              <span class="phase-label">Phase:</span>
              <span class="phase-value">${this.formatPhase(this.state.phase)}</span>
            </div>
          </div>
          <div class="nav-right">
            <button class="icon-btn" onclick="game.mentor.showHint()" title="Get Hint (Ctrl+H)">💡</button>
            <button class="icon-btn" onclick="game.saveGameManual()" title="Save Game (Ctrl+S)">💾</button>
            <button class="icon-btn" onclick="game.showSettings()" title="Settings">⚙️</button>
            <button class="icon-btn" onclick="game.pauseGame()" title="Pause">⏸️</button>
          </div>
        </nav>

        <div class="main-grid">
          <aside class="left-sidebar">
            <div class="sidebar-section">
              <h3>Security Tools</h3>
              <div id="tools-panel" class="tools-panel"></div>
            </div>
            <div class="sidebar-section">
              <h3>Evidence Locker</h3>
              <div id="evidence-panel" class="evidence-panel"></div>
            </div>
          </aside>

          <main class="main-content">
            <div class="hud">
              <div class="hud-stat"><span class="stat-label">Score</span><span class="stat-value" id="score">0</span></div>
              <div class="hud-stat"><span class="stat-label">Reputation</span><span class="stat-value" id="reputation">100</span></div>
              <div class="hud-stat"><span class="stat-label">Time</span><span class="stat-value" id="time">00:00</span></div>
              <div class="hud-stat"><span class="stat-label">Containment</span><span class="stat-value" id="containment">0%</span></div>
              <div class="hud-stat"><span class="stat-label">Budget</span><span class="stat-value" id="budget">$100k</span></div>
              <div class="hud-stat"><span class="stat-label">Confidence</span><span class="stat-value" id="confidence">100%</span></div>
            </div>

            <div id="action-area" class="action-area"></div>
            <div id="decision-panel" class="decision-panel"></div>
          </main>

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
              <h3>Network Status</h3>
              <div id="network-panel" class="network-panel"></div>
            </div>
          </aside>
        </div>

        <div class="bottom-bar">
          <div class="comm-tabs">
            <button class="tab-btn active" data-tab="logs">System Logs</button>
            <button class="tab-btn" data-tab="comms">Communications</button>
            <button class="tab-btn" data-tab="attacks">Attack Visualization</button>
            <button class="tab-btn" data-tab="notes">Notes</button>
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
    if (this.tools) this.tools.renderToolsPanel();
    if (this.evidence) this.evidence.renderEvidencePanel();
    if (this.timeline) this.timeline.renderTimeline();
    if (this.network) this.network.renderNetworkMap();
    this.updateHUD();

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
    if (!content) return;

    switch(tab) {
      case 'logs':
        content.innerHTML = '<div class="terminal-output" id="terminal-output"></div>';
        if (this.tools) this.tools.showSystemLogs();
        break;
      case 'comms':
        content.innerHTML = '<div class="communications-view" id="comms-view"></div>';
        this.showCommunications();
        break;
      case 'attacks':
        content.innerHTML = '<div class="attack-viz-container" id="attack-viz"></div>';
        if (this.attackVisualizer) this.attackVisualizer.renderAttackVisualization();
        break;
      case 'notes':
        content.innerHTML = '<div class="notes-editor" id="notes-editor"><textarea placeholder="Investigation notes..."></textarea></div>';
        break;
    }
  }

  showCommunications() {
    const container = document.getElementById('comms-view');
    if (!container) return;

    const comms = this.state.communicationLog.length > 0 ? this.state.communicationLog : [
      { time: '14:32', from: 'CEO', message: 'What\'s the status? Board meeting in 1 hour.', priority: 'high' },
      { time: '14:35', from: 'IT Manager', message: 'Users reporting file access issues across Finance dept', priority: 'critical' },
      { time: '14:38', from: 'Legal', message: 'If this is a breach, we have 72hrs to report under GDPR', priority: 'high' }
    ];

    container.innerHTML = `
      <div class="comms-list">
        ${comms.map(c => `
          <div class="comm-item ${c.priority}">
            <div class="comm-header">
              <span class="comm-from">${c.from}</span>
              <span class="comm-time">${c.time}</span>
            </div>
            <div class="comm-message">${c.message}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  startDetectionPhase() {
    this.showPhaseTransition('Detection & Analysis', 'Initial incident detected. Determine scope and nature of the attack.');

    setTimeout(() => {
      this.displayDetectionScenario();
    }, 2000);
  }

  displayDetectionScenario() {
    const scenario = this.state.currentScenario;

    const actionHTML = `
      <div class="scenario-content">
        <div class="situation-report">
          <h2>🚨 Situation Report</h2>
          <div class="sitrep-content">
            <strong>${Date.now() | 0}</strong><br><br>
            Multiple EDR alerts indicate ${this.state.session.systemsCompromised} compromised endpoints.
            Suspicious PowerShell execution, unusual network connections to external IPs, and file encryption
            activity detected. Initial analysis suggests a ${scenario?.attackType || 'ransomware'} attack.
            <br><br>
            <strong>Patient Zero:</strong> WORKSTATION-045 (192.168.1.45)<br>
            <strong>Attack Vector:</strong> Phishing email with malicious attachment<br>
            <strong>Current Spread:</strong> ${this.state.session.systemsCompromised} systems across Finance and HR departments
          </div>
        </div>

        <div class="initial-findings">
          <h3>Initial Findings</h3>
          <ul class="findings-list">
            <li class="finding-item critical">
              <span class="finding-icon">🔴</span>
              <span class="finding-text">Cobalt Strike beacon detected communicating with 203.0.113.42:443</span>
            </li>
            <li class="finding-item critical">
              <span class="finding-icon">🔴</span>
              <span class="finding-text">Mimikatz execution detected - credential dumping in progress</span>
            </li>
            <li class="finding-item high">
              <span class="finding-icon">🟠</span>
              <span class="finding-text">PowerShell Empire framework identified - lateral movement active</span>
            </li>
            <li class="finding-item high">
              <span class="finding-icon">🟠</span>
              <span class="finding-text">China Chopper webshell uploaded to web server (10.0.1.50)</span>
            </li>
            <li class="finding-item medium">
              <span class="finding-icon">🟡</span>
              <span class="finding-text">JBiFrost RAT persistence mechanisms installed</span>
            </li>
          </ul>
        </div>

        <div class="investigation-prompt">
          <h3>What is your first action?</h3>
          <p class="prompt-hint">Choose wisely - your initial response sets the tone for the entire incident.</p>
        </div>
      </div>
    `;

    const actionArea = document.getElementById('action-area');
    if (actionArea) actionArea.innerHTML = actionHTML;

    this.displayChoices();
  }

  displayChoices() {
    const choices = [
      {
        icon: '🔍',
        title: 'Launch SIEM Investigation',
        description: 'Analyze security events and correlate attack indicators across all systems',
        cost: 0,
        time: 5,
        recommended: true,
        action: () => this.tools.launchTool('siem')
      },
      {
        icon: '🛡️',
        title: 'EDR Deep Dive',
        description: 'Investigate compromised endpoints, analyze processes, and collect forensic evidence',
        cost: 0,
        time: 10,
        action: () => this.tools.launchTool('edr')
      },
      {
        icon: '🔒',
        title: 'Immediate Network Isolation',
        description: 'Quarantine infected systems to prevent further spread',
        cost: 5000,
        time: 5,
        action: () => this.performNetworkIsolation()
      },
      {
        icon: '📊',
        title: 'View Network Attack Map',
        description: 'See real-time visualization of the ongoing attack across your infrastructure',
        cost: 0,
        time: 2,
        recommended: true,
        action: () => this.attackVisualizer.showAttackMap()
      }
    ];

    const decisionPanel = document.getElementById('decision-panel');
    if (!decisionPanel) return;

    const choicesHTML = choices.map((choice, index) => `
      <div class="choice-card" data-choice="${index}">
        <div class="choice-header">
          <span class="choice-icon">${choice.icon}</span>
          <h4 class="choice-title">${choice.title}</h4>
        </div>
        <p class="choice-description">${choice.description}</p>
        <div class="choice-meta">
          ${choice.cost ? `<span class="meta-tag">💰 Cost: $${choice.cost.toLocaleString()}</span>` : ''}
          ${choice.time ? `<span class="meta-tag">⏱️ Time: ${choice.time}min</span>` : ''}
          ${choice.recommended ? `<span class="meta-tag recommended">✅ Recommended</span>` : ''}
        </div>
        <button class="choice-btn" onclick="game.makeDecision(${index})">
          Select This Action
        </button>
      </div>
    `).join('');

    decisionPanel.innerHTML = `<div class="choices-grid">${choicesHTML}</div>`;

    // Store choices for later
    this.currentChoices = choices;
  }

  makeDecision(choiceIndex) {
    const choice = this.currentChoices?.[choiceIndex];
    if (!choice) return;

    // Execute the action
    if (choice.action) {
      choice.action();
    }

    // Update stats
    this.state.session.score += 20;
    this.state.session.timeElapsed += choice.time || 0;
    if (choice.cost) this.state.session.budget -= choice.cost;

    this.updateHUD();
    this.showNotification(`Action taken: ${choice.title}`, 'success', true);
  }

  performNetworkIsolation() {
    this.showNotification('Isolating compromised systems...', 'warning', true);

    setTimeout(() => {
      this.state.session.containmentLevel = 50;
      this.state.session.score += 30;
      this.updateHUD();

      this.showNotification('5 systems successfully isolated', 'success', true);

      // Show visual feedback
      if (this.network) this.network.markNodesIsolated(['workstation-045', 'workstation-012']);
    }, 2000);
  }

  showInitialAlerts() {
    const alerts = [
      { severity: 'critical', title: 'Cobalt Strike Beacon', time: 'Just now' },
      { severity: 'critical', title: 'Mimikatz Detected', time: '2 min ago' },
      { severity: 'high', title: 'Lateral Movement', time: '5 min ago' },
      { severity: 'high', title: 'Webshell Upload', time: '10 min ago' }
    ];

    const panel = document.getElementById('alerts-panel');
    if (!panel) return;

    panel.innerHTML = alerts.map(alert => `
      <div class="alert-item ${alert.severity}">
        <div class="alert-header">
          <span class="alert-severity">${alert.severity.toUpperCase()}</span>
        </div>
        <div class="alert-title">${alert.title}</div>
        <div class="alert-time">${alert.time}</div>
      </div>
    `).join('');
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
    if (element) element.textContent = value;
  }

  formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  formatPhase(phase) {
    return phase.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
    // Remove any existing modals
    this.closeModal();

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `<div class="modal-content">${content}</div>`;
    document.body.appendChild(modal);

    // Prevent background scroll
    document.body.style.overflow = 'hidden';

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });

    // Fade in
    setTimeout(() => modal.style.opacity = '1', 10);
  }

  closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
      }, 300);
    }
  }

  showNotification(message, type = 'info', force = false) {
    // Throttle notifications unless forced
    if (!force) {
      const now = Date.now();
      if (now - this.lastNotificationTime < this.notificationThrottle) {
        return; // Skip this notification
      }
      this.lastNotificationTime = now;
    }

    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span class="notification-icon">${this.getNotificationIcon(type)}</span>
      <span class="notification-message">${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  getNotificationIcon(type) {
    const icons = { success: '✅', warning: '⚠️', error: '❌', critical: '🚨', info: 'ℹ️' };
    return icons[type] || '💡';
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.state.session.gameRunning) {
        this.state.session.timeElapsed++;
        this.updateElement('time', this.formatTime(this.state.session.timeElapsed));
      }
    }, 60000);
  }

  pauseGame() {
    this.state.session.gameRunning = false;
    this.showNotification('Game paused', 'info', true);
  }

  resumeGame() {
    this.state.session.gameRunning = true;
    this.showNotification('Game resumed', 'success', true);
  }

  resumeScenario() {
    if (this.state.currentScenario) {
      this.renderGameInterface();
    }
  }

  showSettings() {
    const settingsHTML = `
      <div class="settings-modal">
        <h2>Settings</h2>
        <div class="settings-content">
          <div class="setting-item">
            <label><input type="checkbox" ${this.state.settings.showHints ? 'checked' : ''}> Show Hints</label>
          </div>
          <div class="setting-item">
            <label><input type="checkbox" ${this.state.settings.mentorEnabled ? 'checked' : ''}> AI Mentor</label>
          </div>
          <div class="setting-item">
            <label><input type="checkbox" ${this.state.settings.realtimeMode ? 'checked' : ''}> Real-time Mode</label>
          </div>
        </div>
        <button class="btn-primary" onclick="game.closeModal()">Close</button>
      </div>
    `;
    this.showModal(settingsHTML);
  }
}

// Initialize game when page loads
let game = null;

document.addEventListener('DOMContentLoaded', () => {
  // Wait for all classes to be defined
  setTimeout(() => {
    try {
      game = new CyberSimEngine();
      window.game = game; // Make globally accessible
      console.log('✅ Game initialized successfully');
    } catch (e) {
      console.error('Failed to initialize game:', e);
    }
  }, 500);
});

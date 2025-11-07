/**
 * Supporting Systems - AI Mentor, Evidence, Timeline, Analytics, etc.
 */

// ============================================================================
// AI MENTOR SYSTEM
// ============================================================================
class AIMentor {
  constructor() {
    this.enabled = true;
    this.hintsGiven = 0;
    this.maxHints = 3;
  }

  introduce(scenario) {
    if (!this.enabled) return;

    const intro = `
      <div class="mentor-message">
        <div class="mentor-avatar">🧑‍💼</div>
        <div class="mentor-content">
          <h3>AI Mentor Activated</h3>
          <p>I'm here to help guide you through this incident. Need assistance? Press Ctrl+H for hints.</p>
          <p><strong>Tip:</strong> ${this.getScenarioTip(scenario)}</p>
        </div>
      </div>
    `;

    this.showMentorMessage(intro);
  }

  getScenarioTip(scenario) {
    const tips = {
      ransomware_001: 'Ransomware spreads fast - containment is your first priority!',
      apt_001: 'APTs are patient - don\'t alert them to your investigation',
      ddos_001: 'Check if the DDoS is covering another attack',
      insider_001: 'Gather evidence carefully - legal will need it',
      supply_chain_001: 'Coordinate with the vendor and other affected organizations'
    };

    return tips[scenario.id] || 'Think through the incident response lifecycle: Detect, Contain, Eradicate, Recover';
  }

  showHint() {
    if (this.hintsGiven >= this.maxHints) {
      game.showNotification('No more hints available for this scenario', 'warning');
      return;
    }

    const hint = this.getContextualHint();
    this.hintsGiven++;

    const hintHTML = `
      <div class="mentor-hint">
        <div class="mentor-avatar">💡</div>
        <div class="mentor-content">
          <h3>Hint ${this.hintsGiven}/${this.maxHints}</h3>
          <p>${hint}</p>
        </div>
      </div>
    `;

    this.showMentorMessage(hintHTML);
  }

  getContextualHint() {
    const phase = game.state.phase;
    const scenario = game.state.currentScenario;

    const hints = {
      detection: [
        'Use your SIEM to correlate events and identify patient zero',
        'Check EDR for process execution timelines',
        'Look for common indicators: unusual processes, network connections, file modifications'
      ],
      containment: [
        'Isolate compromised systems before they spread the attack',
        'Balance containment with business continuity needs',
        'Network segmentation can prevent lateral movement'
      ],
      investigation: [
        'Collect forensic evidence before remediation destroys it',
        'Build a timeline of attacker activities',
        'Identify all persistence mechanisms'
      ],
      eradication: [
        'Ensure you\'ve identified all compromised systems',
        'Remove malware AND backdoors - both are important',
        'Consider reimaging heavily compromised systems'
      ],
      recovery: [
        'Verify backups before restoring',
        'Restore from known-good backups',
        'Implement additional controls to prevent re-infection'
      ]
    };

    const phaseHints = hints[phase] || hints.detection;
    return phaseHints[Math.floor(Math.random() * phaseHints.length)];
  }

  showMentorMessage(html) {
    const container = document.getElementById('action-area');
    if (!container) return;

    const message = document.createElement('div');
    message.className = 'mentor-message-container';
    message.innerHTML = html;

    container.insertBefore(message, container.firstChild);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      message.style.opacity = '0';
      setTimeout(() => message.remove(), 500);
    }, 10000);
  }

  provideDecisionGuidance(choices) {
    if (!this.enabled) return;

    // Analyze choices and provide subtle guidance
    const recommendedChoice = choices.find(c => c.recommended);
    if (recommendedChoice && Math.random() > 0.5) {
      game.showNotification('💡 The mentor is thinking...', 'info');
    }
  }
}

// ============================================================================
// EVIDENCE SYSTEM
// ============================================================================
class EvidenceSystem {
  constructor() {
    this.evidence = [];
    this.categories = ['logs', 'forensics', 'network', 'malware', 'ioc', 'communications'];
  }

  collect(type, description, metadata = {}) {
    const evidenceItem = {
      id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type,
      description: description,
      timestamp: Date.now(),
      collectedBy: game.state.player.name || 'Analyst',
      metadata: metadata,
      chainOfCustody: [
        {
          action: 'collected',
          timestamp: Date.now(),
          actor: game.state.player.name || 'Analyst'
        }
      ]
    };

    this.evidence.push(evidenceItem);
    game.state.evidenceCollected.push(evidenceItem);

    game.showNotification(`Evidence collected: ${description}`, 'success');
    this.renderEvidencePanel();

    // Award XP for evidence collection
    game.progression.addXP(50);

    return evidenceItem;
  }

  renderEvidencePanel() {
    const panel = document.getElementById('evidence-panel');
    if (!panel) return;

    if (this.evidence.length === 0) {
      panel.innerHTML = '<div class="empty-state">No evidence collected yet</div>';
      return;
    }

    const evidenceHTML = `
      <div class="evidence-list">
        ${this.evidence.map(item => `
          <div class="evidence-item" data-id="${item.id}">
            <div class="evidence-icon">${this.getEvidenceIcon(item.type)}</div>
            <div class="evidence-info">
              <div class="evidence-desc">${item.description}</div>
              <div class="evidence-meta">${new Date(item.timestamp).toLocaleTimeString()}</div>
            </div>
            <button class="evidence-view-btn" onclick="game.evidence.viewEvidence('${item.id}')">
              View
            </button>
          </div>
        `).join('')}
      </div>
      <div class="evidence-actions">
        <button class="btn-small" onclick="game.evidence.exportEvidence()">
          📥 Export All
        </button>
        <button class="btn-small" onclick="game.evidence.generateReport()">
          📄 Generate Report
        </button>
      </div>
    `;

    panel.innerHTML = evidenceHTML;
  }

  getEvidenceIcon(type) {
    const icons = {
      logs: '📝',
      forensics: '🔬',
      network: '🌐',
      malware: '🦠',
      ioc: '🎯',
      communications: '💬',
      process: '⚙️',
      alert: '🚨'
    };
    return icons[type] || '📎';
  }

  viewEvidence(evidenceId) {
    const item = this.evidence.find(e => e.id === evidenceId);
    if (!item) return;

    const detailsHTML = `
      <div class="evidence-details">
        <h2>Evidence Details</h2>
        <div class="detail-grid">
          <div class="detail-item">
            <strong>Type:</strong> ${item.type}
          </div>
          <div class="detail-item">
            <strong>Collected:</strong> ${new Date(item.timestamp).toLocaleString()}
          </div>
          <div class="detail-item">
            <strong>Collected By:</strong> ${item.collectedBy}
          </div>
          <div class="detail-item full-width">
            <strong>Description:</strong> ${item.description}
          </div>
          ${Object.keys(item.metadata).length > 0 ? `
            <div class="detail-item full-width">
              <strong>Metadata:</strong>
              <pre>${JSON.stringify(item.metadata, null, 2)}</pre>
            </div>
          ` : ''}
          <div class="detail-item full-width">
            <strong>Chain of Custody:</strong>
            <ul>
              ${item.chainOfCustody.map(entry => `
                <li>${entry.action} by ${entry.actor} at ${new Date(entry.timestamp).toLocaleString()}</li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;

    game.showModal(detailsHTML);
  }

  exportEvidence() {
    const exportData = {
      incident: game.state.currentScenario?.id,
      timestamp: Date.now(),
      analyst: game.state.player.name,
      evidence: this.evidence
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evidence_${Date.now()}.json`;
    a.click();

    game.showNotification('Evidence exported successfully', 'success');
  }

  generateReport() {
    game.showNotification('Generating evidence report...', 'info');
    // In full implementation, would generate PDF report
  }
}

// ============================================================================
// TIMELINE RECONSTRUCTOR
// ============================================================================
class TimelineReconstructor {
  constructor() {
    this.events = [];
    this.viewMode = 'chronological'; // or 'attack_chain'
  }

  addEvent(timestamp, category, description, severity = 'info') {
    const event = {
      timestamp: timestamp,
      category: category,
      description: description,
      severity: severity
    };

    this.events.push(event);
    this.events.sort((a, b) => a.timestamp - b.timestamp);

    this.renderTimeline();
  }

  renderTimeline() {
    const panel = document.getElementById('timeline-panel');
    if (!panel) return;

    if (this.events.length === 0) {
      panel.innerHTML = '<div class="empty-state">No timeline events yet</div>';
      return;
    }

    const timelineHTML = `
      <div class="timeline-controls">
        <button class="timeline-mode-btn ${this.viewMode === 'chronological' ? 'active' : ''}"
                onclick="game.timeline.setViewMode('chronological')">
          Chronological
        </button>
        <button class="timeline-mode-btn ${this.viewMode === 'attack_chain' ? 'active' : ''}"
                onclick="game.timeline.setViewMode('attack_chain')">
          Attack Chain
        </button>
      </div>
      <div class="timeline-events">
        ${this.events.map(event => `
          <div class="timeline-event ${event.severity}">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-time">${this.formatTimestamp(event.timestamp)}</div>
              <div class="timeline-category">${event.category}</div>
              <div class="timeline-description">${event.description}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    panel.innerHTML = timelineHTML;
  }

  formatTimestamp(timestamp) {
    if (typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleTimeString();
    }
    return timestamp;
  }

  setViewMode(mode) {
    this.viewMode = mode;
    this.renderTimeline();
  }

  toggleView() {
    this.viewMode = this.viewMode === 'chronological' ? 'attack_chain' : 'chronological';
    this.renderTimeline();
  }

  reconstructAttackChain() {
    // Analyze events to build MITRE ATT&CK chain
    // Initial Access -> Execution -> Persistence -> Privilege Escalation -> etc.
  }
}

// ============================================================================
// NETWORK VISUALIZER
// ============================================================================
class NetworkVisualizer {
  constructor() {
    this.topology = null;
    this.compromisedNodes = [];
  }

  initialize(scenario) {
    this.topology = this.generateTopology(scenario);
    this.renderNetworkMap();
  }

  generateTopology(scenario) {
    // Generate network topology based on scenario
    return {
      nodes: [
        { id: 'internet', label: 'Internet', type: 'external', compromised: false },
        { id: 'firewall', label: 'Firewall', type: 'security', compromised: false },
        { id: 'dmz', label: 'DMZ', type: 'zone', compromised: false },
        { id: 'internal', label: 'Internal Network', type: 'zone', compromised: false },
        { id: 'workstation-045', label: 'WS-045', type: 'endpoint', compromised: true },
        { id: 'fileserver-01', label: 'FS-01', type: 'server', compromised: true },
        { id: 'dc-01', label: 'DC-01', type: 'server', compromised: false }
      ],
      connections: [
        { from: 'internet', to: 'firewall' },
        { from: 'firewall', to: 'dmz' },
        { from: 'firewall', to: 'internal' },
        { from: 'internal', to: 'workstation-045' },
        { from: 'internal', to: 'fileserver-01' },
        { from: 'internal', to: 'dc-01' },
        { from: 'workstation-045', to: 'fileserver-01', suspicious: true }
      ]
    };
  }

  renderNetworkMap() {
    const panel = document.getElementById('network-panel');
    if (!panel) return;

    const mapHTML = `
      <div class="network-map">
        <svg viewBox="0 0 300 400" class="network-svg">
          ${this.renderNodes()}
          ${this.renderConnections()}
        </svg>
        <div class="network-legend">
          <div class="legend-item">
            <span class="node-indicator normal"></span> Normal
          </div>
          <div class="legend-item">
            <span class="node-indicator compromised"></span> Compromised
          </div>
          <div class="legend-item">
            <span class="node-indicator suspicious"></span> Suspicious
          </div>
        </div>
      </div>
    `;

    panel.innerHTML = mapHTML;
  }

  renderNodes() {
    if (!this.topology) return '';

    return this.topology.nodes.map((node, i) => {
      const y = 50 + (i * 50);
      const x = node.type === 'external' ? 150 : 100 + (Math.random() * 100);

      return `
        <g class="network-node ${node.compromised ? 'compromised' : 'normal'}">
          <circle cx="${x}" cy="${y}" r="15" />
          <text x="${x}" y="${y + 30}" text-anchor="middle" class="node-label">
            ${node.label}
          </text>
        </g>
      `;
    }).join('');
  }

  renderConnections() {
    if (!this.topology) return '';

    return this.topology.connections.map(conn => {
      const fromNode = this.topology.nodes.find(n => n.id === conn.from);
      const toNode = this.topology.nodes.find(n => n.id === conn.to);

      if (!fromNode || !toNode) return '';

      return `
        <line class="connection ${conn.suspicious ? 'suspicious' : ''}"
              x1="150" y1="50" x2="150" y2="100" />
      `;
    }).join('');
  }

  toggleTopology() {
    // Toggle between different topology views
  }

  markNodeCompromised(nodeId) {
    if (this.topology) {
      const node = this.topology.nodes.find(n => n.id === nodeId);
      if (node) {
        node.compromised = true;
        this.renderNetworkMap();
      }
    }
  }
}

// ============================================================================
// ANALYTICS ENGINE
// ============================================================================
class AnalyticsEngine {
  constructor() {
    this.sessions = [];
    this.currentSession = null;
  }

  startSession(scenarioId) {
    this.currentSession = {
      scenarioId: scenarioId,
      startTime: Date.now(),
      endTime: null,
      decisions: [],
      toolsUsed: [],
      evidence: [],
      outcome: null
    };
  }

  trackDecision(decision) {
    if (this.currentSession) {
      this.currentSession.decisions.push(decision);
    }
  }

  trackToolUse(tool) {
    if (this.currentSession) {
      this.currentSession.toolsUsed.push({
        tool: tool,
        timestamp: Date.now()
      });
    }
  }

  endSession(outcome) {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      this.currentSession.outcome = outcome;
      this.sessions.push(this.currentSession);
      this.currentSession = null;
    }
  }

  generateReport() {
    // Generate analytics report
    return {
      totalSessions: this.sessions.length,
      averageScore: this.calculateAverageScore(),
      averageTime: this.calculateAverageTime(),
      decisionAccuracy: this.calculateDecisionAccuracy(),
      mostUsedTools: this.getMostUsedTools()
    };
  }

  calculateAverageScore() {
    if (this.sessions.length === 0) return 0;
    const total = this.sessions.reduce((sum, s) => sum + (s.outcome?.score || 0), 0);
    return total / this.sessions.length;
  }

  calculateAverageTime() {
    if (this.sessions.length === 0) return 0;
    const total = this.sessions.reduce((sum, s) => {
      return sum + (s.endTime - s.startTime);
    }, 0);
    return total / this.sessions.length;
  }

  calculateDecisionAccuracy() {
    // Calculate percentage of optimal decisions
    return 0;
  }

  getMostUsedTools() {
    const toolCounts = {};
    this.sessions.forEach(session => {
      session.toolsUsed.forEach(use => {
        toolCounts[use.tool] = (toolCounts[use.tool] || 0) + 1;
      });
    });
    return toolCounts;
  }
}

// ============================================================================
// MULTIPLAYER MANAGER
// ============================================================================
class MultiplayerManager {
  constructor() {
    this.mode = 'solo'; // solo, cooperative, competitive
    this.team = null;
    this.teammates = [];
  }

  createTeam(teamName) {
    this.team = {
      name: teamName,
      id: `team_${Date.now()}`,
      members: [game.state.player],
      score: 0,
      rank: 'Unranked'
    };

    game.showNotification(`Team "${teamName}" created!`, 'success');
  }

  joinTeam(teamId) {
    // In full implementation, would connect to multiplayer server
    game.showNotification('Multiplayer features coming soon!', 'info');
  }

  inviteTeammate(email) {
    game.showNotification('Multiplayer features coming soon!', 'info');
  }
}

// ============================================================================
// COMPLIANCE TRACKER
// ============================================================================
class ComplianceTracker {
  constructor() {
    this.frameworks = ['NIST CSF', 'ISO 27001', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOC 2', 'CMMC'];
    this.requirements = {};
  }

  trackCompliance(framework, requirement, met) {
    if (!this.requirements[framework]) {
      this.requirements[framework] = {};
    }

    this.requirements[framework][requirement] = met;
  }

  getComplianceScore(framework) {
    const reqs = this.requirements[framework];
    if (!reqs) return 0;

    const total = Object.keys(reqs).length;
    const met = Object.values(reqs).filter(v => v).length;

    return total > 0 ? (met / total) * 100 : 0;
  }

  generateComplianceReport() {
    const report = {};

    this.frameworks.forEach(framework => {
      report[framework] = this.getComplianceScore(framework);
    });

    return report;
  }
}

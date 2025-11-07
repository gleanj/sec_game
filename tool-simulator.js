/**
 * Security Tool Simulators
 * SIEM, EDR, Network Monitor, and more
 */

class SecurityToolSimulator {
  constructor(game) {
    this.game = game;
    this.tools = {
      siem: new SIEMSimulator(game),
      edr: new EDRSimulator(game),
      networkMonitor: new NetworkMonitor(game),
      iocAnalyzer: new IOCAnalyzer(game)
    };
  }

  getTool(toolName) {
    return this.tools[toolName] || null;
  }

  openTool(toolName) {
    const tool = this.getTool(toolName);
    if (tool) {
      tool.open();
    } else {
      this.game.ui.showToast(`Tool "${toolName}" not found`, 'error');
    }
  }
}

/**
 * SIEM Simulator (Security Information and Event Management)
 */
class SIEMSimulator {
  constructor(game) {
    this.game = game;
  }

  open() {
    const scenario = this.game.state.game.currentScenario;
    if (!scenario) {
      this.game.ui.showToast('No active scenario', 'warning');
      return;
    }

    // Get all evidence from current phase
    const currentPhase = this.getCurrentPhase();
    const evidence = currentPhase ? currentPhase.evidence || [] : [];

    const content = `
      <div class="tool-simulator siem-tool">
        <div class="tool-header">
          <h2>🔍 SIEM - Security Information & Event Management</h2>
          <div class="tool-meta">
            <span class="meta-badge">Splunk Enterprise</span>
            <span class="meta-time">Real-time monitoring</span>
          </div>
        </div>

        <div class="tool-search">
          <input type="text" placeholder="Search events... (e.g., 'lsass', 'beacon', 'powershell')"
                 class="siem-search-input"
                 oninput="game.filterSIEMEvents(this.value)">
          <button class="ultra-btn ultra-btn-sm ultra-btn-primary" onclick="game.runSIEMQuery()">
            Search
          </button>
        </div>

        <div class="tool-filters">
          <button class="filter-btn active" onclick="game.filterSIEMByType('all')">All Events</button>
          <button class="filter-btn" onclick="game.filterSIEMByType('network')">Network</button>
          <button class="filter-btn" onclick="game.filterSIEMByType('host')">Host</button>
          <button class="filter-btn" onclick="game.filterSIEMByType('email')">Email</button>
          <button class="filter-btn" onclick="game.filterSIEMByType('critical')">Critical Only</button>
        </div>

        <div class="tool-timeline">
          <h3>Event Timeline</h3>
          ${this.renderTimeline(evidence)}
        </div>

        <div class="tool-body" id="siem-events">
          ${this.renderEvents(evidence)}
        </div>

        <div class="tool-footer">
          <button class="ultra-btn ultra-btn-secondary" onclick="game.exportSIEMLogs()">
            Export Logs
          </button>
          <button class="ultra-btn ultra-btn-secondary" onclick="game.analyzeSIEMPatterns()">
            Analyze Patterns
          </button>
          <button class="ultra-btn ultra-btn-primary" onclick="game.correlateSIEMEvents()">
            Correlate Events
          </button>
        </div>
      </div>
    `;

    this.game.ui.showModal(content, { size: 'xlarge' });
  }

  getCurrentPhase() {
    const scenario = this.game.state.game.currentScenario;
    if (!scenario || !scenario.phases) return null;

    const phaseName = this.game.state.game.phase || scenario.phases[0]?.name;
    return scenario.phases.find(p => p.name === phaseName);
  }

  renderTimeline(evidence) {
    if (!evidence || evidence.length === 0) {
      return '<p class="empty-state">No events in current timeline</p>';
    }

    const sorted = [...evidence].sort((a, b) =>
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    return `
      <div class="timeline-container">
        ${sorted.map((ev, idx) => `
          <div class="timeline-event" onclick="game.highlightSIEMEvent('${ev.id}')">
            <div class="timeline-marker ${ev.type}"></div>
            <div class="timeline-time">${new Date(ev.timestamp).toLocaleTimeString()}</div>
            <div class="timeline-desc">${ev.description}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderEvents(evidence) {
    if (!evidence || evidence.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">📊</div>
          <h3>No Events Found</h3>
          <p>Try adjusting your search filters or check if there's an active scenario</p>
        </div>
      `;
    }

    return evidence.map(ev => this.renderEvent(ev)).join('');
  }

  renderEvent(ev) {
    const severity = this.determineEventSeverity(ev);
    const iocBadges = ev.iocs ? ev.iocs.map(ioc =>
      `<span class="ioc-badge">${ioc}</span>`
    ).join('') : '';

    return `
      <div class="siem-event ${severity}" id="siem-event-${ev.id}">
        <div class="event-header">
          <div class="event-severity ${severity}">${severity.toUpperCase()}</div>
          <div class="event-time">${ev.timestamp}</div>
          <div class="event-type">${ev.type}</div>
        </div>

        <div class="event-description">
          ${ev.description}
        </div>

        <div class="event-details">
          ${this.renderEventDetails(ev.details)}
        </div>

        ${iocBadges ? `<div class="event-iocs">${iocBadges}</div>` : ''}

        <div class="event-actions">
          <button class="ultra-btn ultra-btn-sm" onclick="game.analyzeEvidence('${ev.id}')">
            Analyze
          </button>
          <button class="ultra-btn ultra-btn-sm" onclick="game.viewIOCDetails('${ev.iocs ? ev.iocs[0] : ''}')">
            View IOCs
          </button>
          <button class="ultra-btn ultra-btn-sm ultra-btn-success" onclick="game.markEvidenceFound('${ev.id}')">
            Mark as Key Evidence
          </button>
        </div>
      </div>
    `;
  }

  renderEventDetails(details) {
    if (!details) return '';

    return Object.entries(details).map(([key, value]) => `
      <div class="detail-row">
        <span class="detail-key">${key.replace(/_/g, ' ')}:</span>
        <span class="detail-value"><code>${value}</code></span>
      </div>
    `).join('');
  }

  determineEventSeverity(ev) {
    if (ev.iocs && ev.iocs.some(ioc => typeof ioc === 'string' &&
        ['cobalt_strike', 'mimikatz', 'ransomware'].includes(ioc.toLowerCase()))) {
      return 'critical';
    }
    if (ev.type === 'network' || ev.type === 'process') {
      return 'high';
    }
    return 'medium';
  }
}

/**
 * EDR Simulator (Endpoint Detection and Response)
 */
class EDRSimulator {
  constructor(game) {
    this.game = game;
  }

  open() {
    const scenario = this.game.state.game.currentScenario;
    if (!scenario) {
      this.game.ui.showToast('No active scenario', 'warning');
      return;
    }

    const currentPhase = this.getCurrentPhase();
    const evidence = currentPhase ? currentPhase.evidence || [] : [];

    // Filter for host-based evidence
    const hostEvidence = evidence.filter(ev =>
      ev.type === 'host' || ev.type === 'process' || ev.type === 'edr_alert'
    );

    const content = `
      <div class="tool-simulator edr-tool">
        <div class="tool-header">
          <h2>🛡️ EDR - Endpoint Detection & Response</h2>
          <div class="tool-meta">
            <span class="meta-badge">CrowdStrike Falcon</span>
            <span class="meta-status status-active">Active</span>
          </div>
        </div>

        <div class="edr-dashboard">
          <div class="edr-stat-card">
            <div class="stat-value">${hostEvidence.length}</div>
            <div class="stat-label">Active Alerts</div>
          </div>
          <div class="edr-stat-card critical">
            <div class="stat-value">${hostEvidence.filter(e => e.iocs && e.iocs.includes('mimikatz')).length}</div>
            <div class="stat-label">Critical Threats</div>
          </div>
          <div class="edr-stat-card">
            <div class="stat-value">245</div>
            <div class="stat-label">Monitored Endpoints</div>
          </div>
        </div>

        <div class="tool-tabs">
          <button class="tab-btn active" onclick="game.showEDRTab('alerts')">Alerts</button>
          <button class="tab-btn" onclick="game.showEDRTab('processes')">Process Tree</button>
          <button class="tab-btn" onclick="game.showEDRTab('memory')">Memory Analysis</button>
          <button class="tab-btn" onclick="game.showEDRTab('network')">Network Connections</button>
        </div>

        <div class="tool-body" id="edr-content">
          ${this.renderAlerts(hostEvidence)}
        </div>

        <div class="tool-footer">
          <button class="ultra-btn ultra-btn-danger" onclick="game.isolateEndpoint()">
            Isolate Endpoint
          </button>
          <button class="ultra-btn ultra-btn-primary" onclick="game.killMaliciousProcess()">
            Kill Process
          </button>
          <button class="ultra-btn ultra-btn-secondary" onclick="game.collectForensics()">
            Collect Forensics
          </button>
        </div>
      </div>
    `;

    this.game.ui.showModal(content, { size: 'xlarge' });
  }

  getCurrentPhase() {
    const scenario = this.game.state.game.currentScenario;
    if (!scenario || !scenario.phases) return null;

    const phaseName = this.game.state.game.phase || scenario.phases[0]?.name;
    return scenario.phases.find(p => p.name === phaseName);
  }

  renderAlerts(evidence) {
    if (!evidence || evidence.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">✅</div>
          <h3>No Active Alerts</h3>
          <p>All endpoints are healthy</p>
        </div>
      `;
    }

    return `
      <div class="edr-alerts">
        ${evidence.map(ev => this.renderAlert(ev)).join('')}
      </div>
    `;
  }

  renderAlert(ev) {
    const severity = ev.iocs && (ev.iocs.includes('mimikatz') || ev.iocs.includes('cobalt_strike'))
      ? 'critical' : 'high';

    return `
      <div class="edr-alert ${severity}">
        <div class="alert-header">
          <span class="alert-severity ${severity}">${severity}</span>
          <span class="alert-time">${ev.timestamp}</span>
        </div>
        <div class="alert-title">${ev.description}</div>
        <div class="alert-details">
          ${this.renderAlertDetails(ev.details)}
        </div>
        <div class="alert-actions">
          <button class="ultra-btn ultra-btn-sm" onclick="game.investigateAlert('${ev.id}')">
            Investigate
          </button>
          <button class="ultra-btn ultra-btn-sm ultra-btn-danger" onclick="game.respondToThreat('${ev.id}')">
            Respond
          </button>
        </div>
      </div>
    `;
  }

  renderAlertDetails(details) {
    if (!details) return '';

    return Object.entries(details).map(([key, value]) => `
      <div class="detail-line">
        <strong>${key}:</strong> <code>${value}</code>
      </div>
    `).join('');
  }
}

/**
 * Network Monitor
 */
class NetworkMonitor {
  constructor(game) {
    this.game = game;
  }

  open() {
    const scenario = this.game.state.game.currentScenario;
    if (!scenario) {
      this.game.ui.showToast('No active scenario', 'warning');
      return;
    }

    const currentPhase = this.getCurrentPhase();
    const evidence = currentPhase ? currentPhase.evidence || [] : [];
    const networkEvidence = evidence.filter(ev => ev.type === 'network');

    const content = `
      <div class="tool-simulator network-tool">
        <div class="tool-header">
          <h2>📡 Network Monitor</h2>
          <div class="tool-meta">
            <span class="meta-badge">Wireshark / Zeek</span>
            <span class="meta-status status-capturing">Capturing</span>
          </div>
        </div>

        <div class="network-stats">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <div class="stat-value">1.2 GB</div>
              <div class="stat-label">Traffic Captured</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⚠️</div>
            <div class="stat-info">
              <div class="stat-value">${networkEvidence.length}</div>
              <div class="stat-label">Suspicious Connections</div>
            </div>
          </div>
        </div>

        <div class="tool-body">
          ${this.renderNetworkConnections(networkEvidence)}
        </div>

        <div class="tool-footer">
          <button class="ultra-btn ultra-btn-primary" onclick="game.analyzeBeaconing()">
            Detect Beaconing
          </button>
          <button class="ultra-btn ultra-btn-secondary" onclick="game.exportPCAP()">
            Export PCAP
          </button>
        </div>
      </div>
    `;

    this.game.ui.showModal(content, { size: 'large' });
  }

  getCurrentPhase() {
    const scenario = this.game.state.game.currentScenario;
    if (!scenario || !scenario.phases) return null;

    const phaseName = this.game.state.game.phase || scenario.phases[0]?.name;
    return scenario.phases.find(p => p.name === phaseName);
  }

  renderNetworkConnections(evidence) {
    if (!evidence || evidence.length === 0) {
      return '<div class="empty-state">No suspicious network traffic detected</div>';
    }

    return `
      <div class="network-connections">
        ${evidence.map(ev => `
          <div class="network-connection">
            <div class="connection-header">
              <span class="connection-icon">🔗</span>
              <span class="connection-time">${ev.timestamp}</span>
            </div>
            <div class="connection-details">
              <div class="connection-row">
                <strong>Source:</strong> ${ev.details.source || 'Unknown'}
              </div>
              <div class="connection-row">
                <strong>Destination:</strong> ${ev.details.destination || 'Unknown'}
              </div>
              <div class="connection-row">
                <strong>Protocol:</strong> ${ev.details.protocol || 'Unknown'}
              </div>
              ${ev.details.pattern ? `
                <div class="connection-row alert">
                  <strong>Pattern:</strong> ${ev.details.pattern}
                </div>
              ` : ''}
            </div>
            <div class="connection-actions">
              <button class="ultra-btn ultra-btn-sm" onclick="game.blockConnection('${ev.id}')">
                Block
              </button>
              <button class="ultra-btn ultra-btn-sm" onclick="game.analyzeConnection('${ev.id}')">
                Analyze
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

/**
 * IOC Analyzer
 */
class IOCAnalyzer {
  constructor(game) {
    this.game = game;
  }

  open() {
    const iocLibrary = this.game.iocLibrary;
    const allIOCs = iocLibrary ? Object.keys(iocLibrary.iocs) : [];

    const content = `
      <div class="tool-simulator ioc-tool">
        <div class="tool-header">
          <h2>🔬 IOC Library & Threat Intelligence</h2>
          <p class="tool-subtitle">Indicators of Compromise backed by real threat intelligence</p>
        </div>

        <div class="ioc-search">
          <input type="text" placeholder="Search IOCs... (e.g., 'Cobalt Strike', 'Mimikatz')"
                 class="ioc-search-input"
                 oninput="game.searchIOCs(this.value)">
        </div>

        <div class="tool-body" id="ioc-list">
          ${this.renderIOCList(allIOCs)}
        </div>
      </div>
    `;

    this.game.ui.showModal(content, { size: 'xlarge' });
  }

  renderIOCList(iocIds) {
    const iocLibrary = this.game.iocLibrary;
    if (!iocLibrary || !iocIds || iocIds.length === 0) {
      return '<div class="empty-state">No IOCs available</div>';
    }

    return `
      <div class="ioc-grid">
        ${iocIds.map(id => {
          const ioc = iocLibrary.getIOC(id);
          if (!ioc) return '';

          return `
            <div class="ioc-card" onclick="game.viewIOCDetails('${id}')">
              <div class="ioc-card-header ${ioc.severity}">
                <h3>${ioc.name}</h3>
                <span class="severity-badge ${ioc.severity}">${ioc.severity}</span>
              </div>
              <div class="ioc-card-body">
                <p class="ioc-category">${ioc.category}</p>
                <p class="ioc-description">${ioc.description}</p>
                <div class="ioc-stats">
                  <div class="ioc-stat">
                    <span class="stat-label">Network IOCs:</span>
                    <span class="stat-value">${ioc.networkIOCs.length}</span>
                  </div>
                  <div class="ioc-stat">
                    <span class="stat-label">Host IOCs:</span>
                    <span class="stat-value">${ioc.hostIOCs.length}</span>
                  </div>
                  <div class="ioc-stat">
                    <span class="stat-label">Threat Actors:</span>
                    <span class="stat-value">${ioc.threatActors.length}</span>
                  </div>
                </div>
              </div>
              <div class="ioc-card-footer">
                <button class="ultra-btn ultra-btn-sm ultra-btn-primary">
                  View Details
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SecurityToolSimulator, SIEMSimulator, EDRSimulator, NetworkMonitor, IOCAnalyzer };
}

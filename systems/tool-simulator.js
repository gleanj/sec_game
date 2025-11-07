/**
 * Tool Simulator - Realistic Security Tool Interfaces
 * Simulates SIEM, EDR, Firewall, IDS/IPS, Forensics, and more
 */

class ToolSimulator {
  constructor() {
    this.availableTools = {
      siem: new SIEMSimulator(),
      edr: new EDRSimulator(),
      firewall: new FirewallSimulator(),
      ids: new IDSSimulator(),
      forensics: new ForensicsToolkit(),
      threatIntel: new ThreatIntelFeed(),
      emailAnalyzer: new EmailAnalyzer(),
      networkAnalyzer: new NetworkAnalyzer(),
      logAnalyzer: new LogAnalyzer(),
      malwareAnalysis: new MalwareAnalyzer()
    };

    this.activeTool = null;
    this.toolHistory = [];
  }

  initializeForScenario(scenario) {
    // Enable tools based on scenario requirements
    const enabledTools = scenario.availableTools || Object.keys(this.availableTools);

    enabledTools.forEach(toolName => {
      if (this.availableTools[toolName]) {
        this.availableTools[toolName].initialize(scenario);
      }
    });

    this.renderToolsPanel();
  }

  renderToolsPanel() {
    const panel = document.getElementById('tools-panel');
    if (!panel) return;

    const toolsHTML = Object.entries(this.availableTools).map(([name, tool]) => `
      <div class="tool-card ${tool.enabled ? '' : 'disabled'}" data-tool="${name}">
        <div class="tool-icon">${tool.icon}</div>
        <div class="tool-info">
          <div class="tool-name">${tool.name}</div>
          <div class="tool-status ${tool.status}">${tool.status}</div>
        </div>
        <button class="tool-launch-btn" onclick="game.tools.launchTool('${name}')"
                ${!tool.enabled ? 'disabled' : ''}>
          Launch
        </button>
      </div>
    `).join('');

    panel.innerHTML = toolsHTML;
  }

  launchTool(toolName) {
    const tool = this.availableTools[toolName];
    if (!tool || !tool.enabled) {
      game.showNotification('Tool not available', 'warning');
      return;
    }

    this.activeTool = tool;
    this.toolHistory.push({
      tool: toolName,
      timestamp: Date.now(),
      duration: 0
    });

    tool.launch();
  }

  showSystemLogs() {
    const output = document.getElementById('terminal-output');
    if (!output) return;

    const logs = this.generateSystemLogs();
    output.innerHTML = `
      <div class="terminal">
        <div class="terminal-header">
          <span>System Logs - Last 24 Hours</span>
          <div class="terminal-controls">
            <button onclick="game.tools.filterLogs('error')">Errors Only</button>
            <button onclick="game.tools.filterLogs('warning')">Warnings</button>
            <button onclick="game.tools.filterLogs('all')">All</button>
            <button onclick="game.tools.exportLogs()">Export</button>
          </div>
        </div>
        <div class="terminal-body">
          ${logs.map(log => `
            <div class="log-entry ${log.level}">
              <span class="log-time">${log.timestamp}</span>
              <span class="log-level">[${log.level.toUpperCase()}]</span>
              <span class="log-source">${log.source}</span>
              <span class="log-message">${log.message}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  generateSystemLogs() {
    // Generate realistic system logs based on current scenario
    const scenario = game.state.currentScenario;
    if (!scenario) return [];

    return scenario.systemLogs || this.getDefaultLogs();
  }

  getDefaultLogs() {
    return [
      { timestamp: '2025-11-07 14:32:15', level: 'error', source: 'Firewall', message: 'Unusual outbound connection detected: 192.168.1.45 -> 203.0.113.42:443' },
      { timestamp: '2025-11-07 14:31:48', level: 'warning', source: 'AV', message: 'Suspicious process execution: powershell.exe -encodedCommand' },
      { timestamp: '2025-11-07 14:30:22', level: 'error', source: 'EDR', message: 'Lateral movement detected: WMI execution from WORKSTATION-05' },
      { timestamp: '2025-11-07 14:28:55', level: 'critical', source: 'SIEM', message: 'Multiple failed login attempts detected on domain controller' },
      { timestamp: '2025-11-07 14:25:10', level: 'warning', source: 'Network', message: 'High volume of DNS queries to suspicious domains' },
      { timestamp: '2025-11-07 14:20:33', level: 'info', source: 'Firewall', message: 'Port scan detected from internal host 192.168.1.45' },
      { timestamp: '2025-11-07 14:15:42', level: 'error', source: 'EDR', message: 'File encryption activity detected on multiple endpoints' },
      { timestamp: '2025-11-07 14:10:18', level: 'critical', source: 'SIEM', message: 'Ransomware IOCs matched: file extensions .locked observed' }
    ];
  }
}

class SIEMSimulator {
  constructor() {
    this.name = 'SIEM Dashboard';
    this.icon = '📊';
    this.enabled = true;
    this.status = 'online';
  }

  initialize(scenario) {
    this.scenario = scenario;
    this.generateAlerts();
  }

  launch() {
    const siemHTML = `
      <div class="tool-window siem-window">
        <div class="tool-window-header">
          <h2>🔍 SIEM Dashboard - Security Information & Event Management</h2>
          <button onclick="game.tools.closeTool()" class="close-btn">×</button>
        </div>

        <div class="siem-content">
          <!-- Statistics Overview -->
          <div class="siem-stats-grid">
            <div class="stat-box critical">
              <div class="stat-number">${this.alerts.critical.length}</div>
              <div class="stat-label">Critical Alerts</div>
            </div>
            <div class="stat-box high">
              <div class="stat-number">${this.alerts.high.length}</div>
              <div class="stat-label">High Priority</div>
            </div>
            <div class="stat-box medium">
              <div class="stat-number">${this.alerts.medium.length}</div>
              <div class="stat-label">Medium Priority</div>
            </div>
            <div class="stat-box info">
              <div class="stat-number">${this.alerts.low.length}</div>
              <div class="stat-label">Low Priority</div>
            </div>
          </div>

          <!-- Alert Timeline -->
          <div class="siem-section">
            <h3>Alert Timeline - Last 24 Hours</h3>
            <div class="timeline-chart">
              <canvas id="alert-timeline-chart"></canvas>
            </div>
          </div>

          <!-- Recent Alerts Table -->
          <div class="siem-section">
            <h3>Recent Security Events</h3>
            <div class="siem-controls">
              <input type="text" placeholder="Search alerts..." class="siem-search">
              <select class="siem-filter">
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="high">High Only</option>
              </select>
            </div>
            <div class="alerts-table">
              ${this.renderAlertsTable()}
            </div>
          </div>

          <!-- IOC Matching -->
          <div class="siem-section">
            <h3>Indicator of Compromise (IOC) Matching</h3>
            <div class="ioc-matches">
              ${this.renderIOCMatches()}
            </div>
          </div>

          <!-- Actions -->
          <div class="siem-actions">
            <button class="btn-secondary" onclick="game.tools.siem.exportAlerts()">
              📥 Export Alerts
            </button>
            <button class="btn-secondary" onclick="game.tools.siem.correlateEvents()">
              🔗 Correlate Events
            </button>
            <button class="btn-primary" onclick="game.tools.siem.investigateAlert()">
              🔍 Investigate Selected
            </button>
          </div>
        </div>
      </div>
    `;

    game.showModal(siemHTML);
    this.initializeCharts();
  }

  generateAlerts() {
    this.alerts = {
      critical: [
        {
          id: 'ALT-2025-001',
          time: '14:32:15',
          rule: 'Ransomware Behavior Detected',
          source: '192.168.1.45',
          destination: 'Multiple Endpoints',
          description: 'Mass file encryption activity detected across network shares',
          iocs: ['File extension: .locked', 'Process: unknown.exe', 'Network: SMB traffic spike']
        },
        {
          id: 'ALT-2025-002',
          time: '14:28:55',
          rule: 'Brute Force Attack',
          source: '192.168.1.45',
          destination: 'DC01.corp.local',
          description: 'Multiple failed authentication attempts to domain controller',
          iocs: ['Event ID: 4625', 'Failed logins: 247', 'Duration: 5 minutes']
        }
      ],
      high: [
        {
          id: 'ALT-2025-003',
          time: '14:30:22',
          rule: 'Lateral Movement Detected',
          source: 'WORKSTATION-05',
          destination: '10.0.0.0/24',
          description: 'WMI-based lateral movement across multiple hosts',
          iocs: ['WMI process creation', 'Admin share access', 'PsExec activity']
        }
      ],
      medium: [],
      low: []
    };
  }

  renderAlertsTable() {
    const allAlerts = [
      ...this.alerts.critical,
      ...this.alerts.high,
      ...this.alerts.medium,
      ...this.alerts.low
    ];

    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Alert ID</th>
            <th>Rule</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Severity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${allAlerts.map(alert => `
            <tr class="alert-row">
              <td>${alert.time}</td>
              <td><code>${alert.id}</code></td>
              <td>${alert.rule}</td>
              <td><code>${alert.source}</code></td>
              <td><code>${alert.destination}</code></td>
              <td><span class="severity-badge critical">Critical</span></td>
              <td>
                <button class="btn-small" onclick="game.tools.siem.viewDetails('${alert.id}')">
                  View
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  renderIOCMatches() {
    const iocs = [
      { type: 'IP Address', value: '203.0.113.42', threat: 'Known C2 Server', confidence: 'High' },
      { type: 'File Hash', value: 'a3f4b2c1d5e6f7a8...', threat: 'Ransomware Payload', confidence: 'High' },
      { type: 'Domain', value: 'evil-domain.xyz', threat: 'Malware Distribution', confidence: 'Medium' },
      { type: 'Process', value: 'unknown.exe', threat: 'Suspicious Executable', confidence: 'Medium' }
    ];

    return `
      <table class="ioc-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Indicator</th>
            <th>Threat</th>
            <th>Confidence</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${iocs.map(ioc => `
            <tr>
              <td>${ioc.type}</td>
              <td><code>${ioc.value}</code></td>
              <td>${ioc.threat}</td>
              <td><span class="confidence-badge ${ioc.confidence.toLowerCase()}">${ioc.confidence}</span></td>
              <td>
                <button class="btn-small" onclick="game.evidence.collect('ioc', '${ioc.value}')">
                  Collect
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  initializeCharts() {
    // Initialize chart visualization (simplified for now)
    // In full implementation, would use Chart.js or similar
  }

  viewDetails(alertId) {
    const alert = this.findAlert(alertId);
    if (!alert) return;

    const detailsHTML = `
      <div class="alert-details">
        <h2>Alert Details: ${alert.id}</h2>
        <div class="detail-grid">
          <div class="detail-item">
            <strong>Rule:</strong> ${alert.rule}
          </div>
          <div class="detail-item">
            <strong>Time:</strong> ${alert.time}
          </div>
          <div class="detail-item">
            <strong>Source:</strong> ${alert.source}
          </div>
          <div class="detail-item">
            <strong>Destination:</strong> ${alert.destination}
          </div>
          <div class="detail-item full-width">
            <strong>Description:</strong> ${alert.description}
          </div>
          <div class="detail-item full-width">
            <strong>IOCs Detected:</strong>
            <ul>
              ${alert.iocs.map(ioc => `<li>${ioc}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="detail-actions">
          <button class="btn-primary" onclick="game.evidence.collect('alert', '${alert.id}')">
            Add to Evidence
          </button>
          <button class="btn-secondary" onclick="game.tools.siem.createTicket('${alert.id}')">
            Create Incident Ticket
          </button>
        </div>
      </div>
    `;

    game.showModal(detailsHTML);
  }

  findAlert(alertId) {
    const allAlerts = [
      ...this.alerts.critical,
      ...this.alerts.high,
      ...this.alerts.medium,
      ...this.alerts.low
    ];

    return allAlerts.find(alert => alert.id === alertId);
  }
}

class EDRSimulator {
  constructor() {
    this.name = 'EDR Console';
    this.icon = '🖥️';
    this.enabled = true;
    this.status = 'online';
  }

  initialize(scenario) {
    this.scenario = scenario;
  }

  launch() {
    const edrHTML = `
      <div class="tool-window edr-window">
        <div class="tool-window-header">
          <h2>🛡️ EDR Console - Endpoint Detection & Response</h2>
          <button onclick="game.tools.closeTool()" class="close-btn">×</button>
        </div>

        <div class="edr-content">
          <!-- Endpoint Status Overview -->
          <div class="edr-overview">
            <div class="endpoint-stats">
              <div class="stat-card">
                <div class="stat-value">247</div>
                <div class="stat-label">Total Endpoints</div>
              </div>
              <div class="stat-card healthy">
                <div class="stat-value">239</div>
                <div class="stat-label">Healthy</div>
              </div>
              <div class="stat-card warning">
                <div class="stat-value">3</div>
                <div class="stat-label">Warnings</div>
              </div>
              <div class="stat-card critical">
                <div class="stat-value">5</div>
                <div class="stat-label">Critical</div>
              </div>
            </div>
          </div>

          <!-- Compromised Endpoints -->
          <div class="edr-section">
            <h3>🚨 Compromised Endpoints</h3>
            <div class="endpoints-list">
              ${this.renderCompromisedEndpoints()}
            </div>
          </div>

          <!-- Process Analysis -->
          <div class="edr-section">
            <h3>Suspicious Processes</h3>
            <div class="process-list">
              ${this.renderSuspiciousProcesses()}
            </div>
          </div>

          <!-- Network Connections -->
          <div class="edr-section">
            <h3>Active Network Connections</h3>
            <div class="connections-list">
              ${this.renderNetworkConnections()}
            </div>
          </div>

          <!-- Actions -->
          <div class="edr-actions">
            <button class="btn-danger" onclick="game.tools.edr.isolateEndpoints()">
              🔒 Isolate Selected Endpoints
            </button>
            <button class="btn-warning" onclick="game.tools.edr.killProcess()">
              ⛔ Terminate Process
            </button>
            <button class="btn-primary" onclick="game.tools.edr.collectForensics()">
              🔬 Collect Forensic Data
            </button>
          </div>
        </div>
      </div>
    `;

    game.showModal(edrHTML);
  }

  renderCompromisedEndpoints() {
    const endpoints = [
      { name: 'WORKSTATION-045', ip: '192.168.1.45', user: 'jsmith', status: 'critical', threat: 'Ransomware Execution' },
      { name: 'WORKSTATION-012', ip: '192.168.1.12', user: 'bjones', status: 'critical', threat: 'Lateral Movement' },
      { name: 'SERVER-FILESVR-01', ip: '10.0.1.50', user: 'SYSTEM', status: 'critical', threat: 'Data Exfiltration' },
      { name: 'WORKSTATION-033', ip: '192.168.1.33', user: 'mwilson', status: 'warning', threat: 'Suspicious Process' },
      { name: 'WORKSTATION-089', ip: '192.168.1.89', user: 'rdavis', status: 'warning', threat: 'Unauthorized Access' }
    ];

    return endpoints.map(endpoint => `
      <div class="endpoint-card ${endpoint.status}">
        <div class="endpoint-header">
          <span class="endpoint-name">${endpoint.name}</span>
          <span class="endpoint-status ${endpoint.status}">${endpoint.status.toUpperCase()}</span>
        </div>
        <div class="endpoint-details">
          <div><strong>IP:</strong> ${endpoint.ip}</div>
          <div><strong>User:</strong> ${endpoint.user}</div>
          <div><strong>Threat:</strong> ${endpoint.threat}</div>
        </div>
        <div class="endpoint-actions">
          <button class="btn-small" onclick="game.tools.edr.viewEndpoint('${endpoint.name}')">
            Details
          </button>
          <button class="btn-small btn-danger" onclick="game.tools.edr.isolate('${endpoint.name}')">
            Isolate
          </button>
        </div>
      </div>
    `).join('');
  }

  renderSuspiciousProcesses() {
    const processes = [
      { endpoint: 'WORKSTATION-045', process: 'unknown.exe', pid: 4532, cpu: '45%', memory: '512MB', parent: 'explorer.exe', threat: 'High' },
      { endpoint: 'WORKSTATION-045', process: 'powershell.exe', pid: 7821, cpu: '12%', memory: '128MB', parent: 'unknown.exe', threat: 'High' },
      { endpoint: 'WORKSTATION-012', process: 'wmic.exe', pid: 3344, cpu: '8%', memory: '64MB', parent: 'cmd.exe', threat: 'Medium' }
    ];

    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Process</th>
            <th>PID</th>
            <th>CPU</th>
            <th>Memory</th>
            <th>Parent Process</th>
            <th>Threat Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${processes.map(proc => `
            <tr>
              <td>${proc.endpoint}</td>
              <td><code>${proc.process}</code></td>
              <td>${proc.pid}</td>
              <td>${proc.cpu}</td>
              <td>${proc.memory}</td>
              <td><code>${proc.parent}</code></td>
              <td><span class="threat-badge ${proc.threat.toLowerCase()}">${proc.threat}</span></td>
              <td>
                <button class="btn-small" onclick="game.tools.edr.analyzeProcess(${proc.pid})">
                  Analyze
                </button>
                <button class="btn-small btn-danger" onclick="game.tools.edr.killProcess(${proc.pid})">
                  Kill
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  renderNetworkConnections() {
    const connections = [
      { endpoint: 'WORKSTATION-045', local: '192.168.1.45:49823', remote: '203.0.113.42:443', protocol: 'HTTPS', status: 'Established', suspicious: true },
      { endpoint: 'WORKSTATION-045', local: '192.168.1.45:49824', remote: '185.220.101.42:443', protocol: 'HTTPS', status: 'Established', suspicious: true },
      { endpoint: 'SERVER-FILESVR-01', local: '10.0.1.50:445', remote: '192.168.1.45:51234', protocol: 'SMB', status: 'Established', suspicious: false }
    ];

    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Local Address</th>
            <th>Remote Address</th>
            <th>Protocol</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${connections.map(conn => `
            <tr class="${conn.suspicious ? 'suspicious' : ''}">
              <td>${conn.endpoint}</td>
              <td><code>${conn.local}</code></td>
              <td><code>${conn.remote}</code></td>
              <td>${conn.protocol}</td>
              <td>${conn.status}</td>
              <td>
                <button class="btn-small" onclick="game.tools.edr.blockConnection('${conn.remote}')">
                  Block
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  isolateEndpoints() {
    game.showNotification('Isolating compromised endpoints from network...', 'warning');

    setTimeout(() => {
      game.applyOutcome({
        score: 30,
        containmentLevel: 25,
        timeElapsed: 5,
        feedback: {
          type: 'success',
          title: 'Endpoints Isolated',
          message: '5 compromised endpoints have been isolated from the network',
          details: [
            'Network connections terminated',
            'Further lateral movement prevented',
            'Systems remain accessible for investigation'
          ]
        }
      });
    }, 2000);
  }

  killProcess(pid) {
    game.showNotification(`Terminating process ${pid}...`, 'info');

    setTimeout(() => {
      game.applyOutcome({
        score: 15,
        containmentLevel: 10,
        timeElapsed: 2,
        feedback: {
          type: 'success',
          title: 'Process Terminated',
          message: `Malicious process (PID: ${pid}) has been terminated`,
          details: [
            'Process execution halted',
            'Child processes also terminated',
            'File samples collected for analysis'
          ]
        }
      });

      game.evidence.collect('process', `PID ${pid} - unknown.exe`);
    }, 1500);
  }

  collectForensics() {
    game.showNotification('Collecting forensic artifacts...', 'info');

    setTimeout(() => {
      game.applyOutcome({
        score: 25,
        timeElapsed: 15,
        feedback: {
          type: 'success',
          title: 'Forensics Collected',
          message: 'Comprehensive forensic data gathered from endpoints',
          details: [
            'Memory dumps captured',
            'Disk images acquired',
            'Registry hives exported',
            'Event logs collected',
            'Network packet captures saved'
          ]
        }
      });

      // Add multiple evidence items
      game.evidence.collect('forensics', 'Memory dump - WORKSTATION-045');
      game.evidence.collect('forensics', 'Disk image - WORKSTATION-045');
      game.evidence.collect('forensics', 'Registry analysis results');
    }, 3000);
  }
}

class FirewallSimulator {
  constructor() {
    this.name = 'Firewall Manager';
    this.icon = '🔥';
    this.enabled = true;
    this.status = 'online';
  }

  initialize(scenario) {
    this.scenario = scenario;
  }

  launch() {
    // Similar implementation for firewall management
    game.showNotification('Firewall Manager - Coming in next update', 'info');
  }
}

class IDSSimulator {
  constructor() {
    this.name = 'IDS/IPS Console';
    this.icon = '🚦';
    this.enabled = true;
    this.status = 'online';
  }

  initialize(scenario) {
    this.scenario = scenario;
  }

  launch() {
    game.showNotification('IDS/IPS Console - Coming in next update', 'info');
  }
}

class ForensicsToolkit {
  constructor() {
    this.name = 'Forensics Toolkit';
    this.icon = '🔬';
    this.enabled = true;
    this.status = 'online';
  }

  initialize(scenario) {
    this.scenario = scenario;
  }

  launch() {
    game.showNotification('Forensics Toolkit - Coming in next update', 'info');
  }
}

class ThreatIntelFeed {
  constructor() {
    this.name = 'Threat Intelligence';
    this.icon = '🌐';
    this.enabled = true;
    this.status = 'online';
  }

  initialize(scenario) {
    this.scenario = scenario;
  }

  launch() {
    game.showNotification('Threat Intelligence Feed - Coming in next update', 'info');
  }
}

class EmailAnalyzer {
  constructor() {
    this.name = 'Email Analyzer';
    this.icon = '📧';
    this.enabled = true;
    this.status = 'online';
  }

  initialize(scenario) {
    this.scenario = scenario;
  }

  launch() {
    game.showNotification('Email Analyzer - Coming in next update', 'info');
  }
}

class NetworkAnalyzer {
  constructor() {
    this.name = 'Network Analyzer';
    this.icon = '🌐';
    this.enabled = true;
    this.status = 'online';
  }

  initialize(scenario) {
    this.scenario = scenario;
  }

  launch() {
    game.showNotification('Network Analyzer - Coming in next update', 'info');
  }
}

class LogAnalyzer {
  constructor() {
    this.name = 'Log Analyzer';
    this.icon = '📝';
    this.enabled = true;
    this.status = 'online';
  }

  initialize(scenario) {
    this.scenario = scenario;
  }

  launch() {
    game.showNotification('Log Analyzer - Coming in next update', 'info');
  }
}

class MalwareAnalyzer {
  constructor() {
    this.name = 'Malware Sandbox';
    this.icon = '🦠';
    this.enabled = true;
    this.status = 'online';
  }

  initialize(scenario) {
    this.scenario = scenario;
  }

  launch() {
    game.showNotification('Malware Sandbox - Coming in next update', 'info');
  }
}

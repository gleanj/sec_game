/**
 * Scenario Library - 20+ Diverse Cybersecurity Incidents
 * Based on real-world attack patterns and MITRE ATT&CK framework
 */

class ScenarioLibrary {
  constructor() {
    this.scenarios = this.loadAllScenarios();
    this.completedScenarios = [];
  }

  loadAllScenarios() {
    return {
      // 1. RANSOMWARE ATTACK
      ransomware_001: {
        id: 'ransomware_001',
        title: 'Operation LockDown - Ransomware Outbreak',
        description: 'A sophisticated ransomware attack has encrypted critical systems across your organization',
        attackType: 'Ransomware',
        severity: 'critical',
        industry: 'Healthcare',
        difficulty: 'normal',
        estimatedTime: 45,
        requirements: { level: 1, cert: null },
        systemsAffected: 45,
        detectionMethod: 'EDR Alert',
        frameworks: ['NIST CSF', 'HIPAA', 'ISO 27001'],
        objectives: [
          'Identify patient zero and infection vector',
          'Contain the spread to prevent further encryption',
          'Determine if data was exfiltrated',
          'Decide whether to pay ransom or restore from backups',
          'Ensure patient care systems remain operational'
        ],
        teamSize: 6,
        availableTools: ['siem', 'edr', 'forensics', 'threatIntel', 'networkAnalyzer'],

        phases: {
          detection: {
            narrative: `
              **11:32 AM - Monday**

              Your EDR solution has triggered multiple critical alerts. Users across the organization
              are reporting they cannot access files - instead seeing ransom notes demanding $2.5 million
              in Bitcoin. The attack appears to have started in the Finance department but has rapidly
              spread to over 45 workstations and 3 file servers.

              As Lead Incident Responder at MedCare Hospital, you must act quickly. Patient records are
              encrypted, and medical staff cannot access critical systems. The ransomware note claims data
              was exfiltrated before encryption. Time is critical - what is your first move?
            `,
            initialFindings: [
              { severity: 'critical', text: '45 workstations reporting file encryption' },
              { severity: 'critical', text: '3 file servers encrypted - including patient records database' },
              { severity: 'high', text: 'Suspicious PowerShell execution detected on multiple endpoints' },
              { severity: 'high', text: 'Unusual outbound traffic to 203.0.113.42 (known C2 server)' },
              { severity: 'medium', text: 'Phishing email with malicious attachment received 6 hours ago' }
            ],
            choices: [
              {
                icon: '🔒',
                title: 'Immediate Network Segmentation',
                description: 'Isolate infected systems and segment the network to prevent further spread. Priority on containing the outbreak.',
                cost: 5000,
                time: 10,
                difficulty: 'medium',
                recommended: true,
                outcome: {
                  score: 50,
                  reputation: 5,
                  timeElapsed: 10,
                  containmentLevel: 40,
                  budget: -5000,
                  stakeholderConfidence: 5,
                  feedback: {
                    type: 'success',
                    title: 'Excellent Containment',
                    message: 'Network segmentation prevented further spread. No additional systems encrypted.',
                    details: [
                      'Infected systems isolated successfully',
                      'Clean systems protected from lateral movement',
                      'Network traffic analysis enabled',
                      'Time bought for investigation and recovery'
                    ]
                  }
                },
                nextPhase: 'investigation'
              },
              {
                icon: '🔍',
                title: 'Deep Investigation First',
                description: 'Launch comprehensive forensic investigation to understand the full scope before taking containment actions.',
                cost: 15000,
                time: 30,
                difficulty: 'hard',
                outcome: {
                  score: 30,
                  reputation: -10,
                  timeElapsed: 30,
                  containmentLevel: 10,
                  systemsCompromised: 25,
                  budget: -15000,
                  stakeholderConfidence: -15,
                  feedback: {
                    type: 'warning',
                    title: 'Investigation Delayed Containment',
                    message: 'While investigating, ransomware spread to 25 additional systems.',
                    details: [
                      'Comprehensive forensic data collected',
                      'Attack vector identified: phishing email',
                      'However, delay allowed further encryption',
                      'Executive leadership expressing concern'
                    ]
                  }
                },
                nextPhase: 'investigation'
              },
              {
                icon: '💰',
                title: 'Prepare Ransom Payment',
                description: 'Contact legal and begin cryptocurrency acquisition process while assessing alternatives.',
                cost: 2500000,
                time: 15,
                difficulty: 'easy',
                outcome: {
                  score: -20,
                  reputation: -25,
                  timeElapsed: 15,
                  containmentLevel: 5,
                  legalRisk: 40,
                  stakeholderConfidence: -20,
                  mediaAttention: 30,
                  feedback: {
                    type: 'error',
                    title: 'Premature Ransom Consideration',
                    message: 'Preparing payment before exhausting recovery options signals weakness.',
                    details: [
                      'Legal team advises against payment (funds terrorism)',
                      'No guarantee decryption keys will work',
                      'FBI discourages ransom payments',
                      'Backups have not been assessed yet',
                      'News of potential payment leaked to media'
                    ]
                  }
                },
                nextPhase: 'investigation'
              },
              {
                icon: '📞',
                title: 'External Incident Response Team',
                description: 'Immediately engage external cybersecurity incident response consultants with ransomware expertise.',
                cost: 50000,
                time: 20,
                difficulty: 'easy',
                recommended: true,
                outcome: {
                  score: 40,
                  reputation: 10,
                  timeElapsed: 20,
                  containmentLevel: 30,
                  budget: -50000,
                  stakeholderConfidence: 10,
                  teamMorale: 15,
                  feedback: {
                    type: 'success',
                    title: 'Expert Assistance Secured',
                    message: 'External IR team on-site within 2 hours with specialized tools and expertise.',
                    details: [
                      'Ransomware variant identified: REvil 2.0',
                      'Known decryption methods being evaluated',
                      'Forensic investigation accelerated',
                      'Your team augmented with specialists',
                      'Free decryption tool may be available'
                    ]
                  },
                  unlocks: ['expert_mode', 'advanced_forensics']
                },
                nextPhase: 'investigation'
              }
            ]
          },
          // Additional phases would be defined here
          investigation: {
            narrative: 'Containment measures in place. Now determine the full scope...',
            choices: []
          }
        },

        learningObjectives: [
          'Understand the kill chain of ransomware attacks',
          'Practice rapid incident triage and prioritization',
          'Learn proper network segmentation techniques',
          'Understand ransom payment considerations and ethics',
          'Apply NIST CSF Respond and Recover functions'
        ],

        mitreAttack: ['T1486', 'T1083', 'T1027', 'T1059.001', 'T1071.001'],

        debrief: {
          overview: 'Ransomware attacks require rapid response and difficult decisions...',
          keyLessons: [],
          recommendations: []
        }
      },

      // 2. ADVANCED PERSISTENT THREAT (APT)
      apt_001: {
        id: 'apt_001',
        title: 'Silent Compromise - APT Discovery',
        description: 'A state-sponsored APT group has established long-term persistence in your network',
        attackType: 'Advanced Persistent Threat',
        severity: 'critical',
        industry: 'Defense Contractor',
        difficulty: 'expert',
        estimatedTime: 90,
        requirements: { level: 5, cert: 'GCIH' },
        systemsAffected: 12,
        detectionMethod: 'Threat Intel Report',
        frameworks: ['NIST CSF', 'CMMC', 'ISO 27001'],
        objectives: [
          'Identify all compromised systems without alerting attackers',
          'Determine data exfiltration scope',
          'Map attacker infrastructure and tactics',
          'Plan coordinated remediation to remove all persistence',
          'Preserve evidence for law enforcement'
        ],
        teamSize: 10,
        availableTools: ['siem', 'edr', 'forensics', 'threatIntel', 'networkAnalyzer', 'malwareAnalysis'],

        learningObjectives: [
          'APT hunting methodologies',
          'Living off the land techniques detection',
          'Coordinated remediation strategies',
          'Attribution and threat intelligence'
        ],

        mitreAttack: ['T1078', 'T1133', 'T1547', 'T1070', 'T1048']
      },

      // 3. DDOS ATTACK
      ddos_001: {
        id: 'ddos_001',
        title: 'Traffic Storm - DDoS Mitigation',
        description: 'Massive distributed denial of service attack overwhelming your infrastructure',
        attackType: 'DDoS',
        severity: 'critical',
        industry: 'E-Commerce',
        difficulty: 'normal',
        estimatedTime: 30,
        requirements: { level: 2, cert: null },
        systemsAffected: 8,
        detectionMethod: 'Network Monitoring',
        frameworks: ['NIST CSF', 'PCI-DSS'],
        objectives: [
          'Identify attack vectors and traffic patterns',
          'Implement mitigation without affecting legitimate users',
          'Determine if DDoS is covering another attack',
          'Coordinate with ISP and DDoS mitigation service',
          'Maintain business operations during attack'
        ],
        teamSize: 5,
        availableTools: ['networkAnalyzer', 'firewall', 'threatIntel'],

        learningObjectives: [
          'DDoS attack types and mitigation',
          'Traffic analysis and filtering',
          'Cloud-based DDoS protection',
          'Business continuity during attacks'
        ],

        mitreAttack: ['T1498', 'T1499']
      },

      // 4. INSIDER THREAT
      insider_001: {
        id: 'insider_001',
        title: 'Malicious Insider - Data Exfiltration',
        description: 'A disgruntled employee is stealing sensitive intellectual property',
        attackType: 'Insider Threat',
        severity: 'high',
        industry: 'Technology',
        difficulty: 'hard',
        estimatedTime: 60,
        requirements: { level: 3, cert: null },
        systemsAffected: 5,
        detectionMethod: 'DLP Alert',
        frameworks: ['NIST CSF', 'ISO 27001'],
        objectives: [
          'Identify the insider and their access level',
          'Determine what data has been exfiltrated',
          'Gather evidence while maintaining operational security',
          'Coordinate with HR and legal teams',
          'Prevent further data loss without tipping off insider'
        ],
        teamSize: 4,
        availableTools: ['siem', 'dlp', 'forensics', 'emailAnalyzer'],

        learningObjectives: [
          'Insider threat detection patterns',
          'User behavior analytics',
          'Legal and HR coordination',
          'Evidence preservation for prosecution'
        ],

        mitreAttack: ['T1020', 'T1048', 'T1041', 'T1567']
      },

      // 5. SUPPLY CHAIN COMPROMISE
      supply_chain_001: {
        id: 'supply_chain_001',
        title: 'Trojan Update - Supply Chain Attack',
        description: 'Malicious code discovered in trusted software update from third-party vendor',
        attackType: 'Supply Chain',
        severity: 'critical',
        industry: 'Financial Services',
        difficulty: 'expert',
        estimatedTime: 120,
        requirements: { level: 6, cert: null },
        systemsAffected: 234,
        detectionMethod: 'Threat Intelligence',
        frameworks: ['NIST CSF', 'PCI-DSS', 'SOC 2'],
        objectives: [
          'Identify all systems with compromised software',
          'Determine attacker capabilities and actions taken',
          'Coordinate with software vendor and other victims',
          'Remove backdoor without disrupting operations',
          'Assess regulatory reporting requirements'
        ],
        teamSize: 12,
        availableTools: ['siem', 'edr', 'forensics', 'malwareAnalysis', 'threatIntel'],

        learningObjectives: [
          'Supply chain risk management',
          'Software integrity verification',
          'Coordinated disclosure',
          'Large-scale remediation'
        ],

        mitreAttack: ['T1195', 'T1554', 'T1574']
      },

      // 6. BUSINESS EMAIL COMPROMISE
      bec_001: {
        id: 'bec_001',
        title: 'Executive Impersonation - BEC Fraud',
        description: 'Attacker impersonating CEO requests urgent wire transfer',
        attackType: 'Business Email Compromise',
        severity: 'high',
        industry: 'Manufacturing',
        difficulty: 'normal',
        estimatedTime: 30,
        requirements: { level: 2, cert: null },
        systemsAffected: 3,
        detectionMethod: 'Finance Team Report',
        frameworks: ['NIST CSF'],
        objectives: [
          'Verify if CEO email account is compromised',
          'Stop fraudulent transaction before funds transfer',
          'Identify how attacker gained access',
          'Assess scope of email compromise',
          'Implement additional email security controls'
        ],
        teamSize: 3,
        availableTools: ['emailAnalyzer', 'siem', 'forensics'],

        learningObjectives: [
          'BEC attack patterns',
          'Email authentication (SPF, DKIM, DMARC)',
          'Social engineering detection',
          'Financial fraud prevention'
        ],

        mitreAttack: ['T1566.002', 'T1534', 'T1114']
      },

      // 7. WEB APPLICATION ATTACK
      webapp_001: {
        id: 'webapp_001',
        title: 'SQL Injection - Database Breach',
        description: 'SQL injection vulnerability actively exploited on customer portal',
        attackType: 'Web Application Attack',
        severity: 'critical',
        industry: 'Retail',
        difficulty: 'normal',
        estimatedTime: 45,
        requirements: { level: 2, cert: null },
        systemsAffected: 2,
        detectionMethod: 'WAF Alert',
        frameworks: ['OWASP Top 10', 'PCI-DSS', 'GDPR'],
        objectives: [
          'Stop active exploitation immediately',
          'Determine scope of database access',
          'Identify compromised customer records',
          'Patch vulnerability and verify fix',
          'Assess breach notification requirements'
        ],
        teamSize: 4,
        availableTools: ['waf', 'siem', 'forensics', 'logAnalyzer'],

        learningObjectives: [
          'SQL injection detection and prevention',
          'Web application firewall configuration',
          'Database security',
          'GDPR breach notification'
        ],

        mitreAttack: ['T1190', 'T1212']
      },

      // 8. ZERO-DAY EXPLOITATION
      zeroday_001: {
        id: 'zeroday_001',
        title: 'Unknown Threat - Zero-Day Response',
        description: 'Exploitation of unknown vulnerability in critical infrastructure',
        attackType: 'Zero-Day Exploit',
        severity: 'critical',
        industry: 'Energy',
        difficulty: 'expert',
        estimatedTime: 90,
        requirements: { level: 7, cert: 'GCIA' },
        systemsAffected: 15,
        detectionMethod: 'Anomaly Detection',
        frameworks: ['NIST CSF', 'NERC CIP'],
        objectives: [
          'Identify the vulnerability being exploited',
          'Develop temporary mitigation without patch',
          'Coordinate with vendor for emergency patch',
          'Protect critical infrastructure systems',
          'Share intelligence with industry partners'
        ],
        teamSize: 8,
        availableTools: ['siem', 'edr', 'forensics', 'malwareAnalysis', 'networkAnalyzer'],

        learningObjectives: [
          'Zero-day vulnerability response',
          'Exploit analysis',
          'Virtual patching techniques',
          'Coordinated vulnerability disclosure'
        ],

        mitreAttack: ['T1068', 'T1211']
      },

      // 9. CRYPTOJACKING
      cryptojacking_001: {
        id: 'cryptojacking_001',
        title: 'Hidden Miners - Cryptojacking Campaign',
        description: 'Cryptocurrency mining malware consuming cloud resources',
        attackType: 'Cryptojacking',
        severity: 'medium',
        industry: 'Cloud Services',
        difficulty: 'normal',
        estimatedTime: 30,
        requirements: { level: 2, cert: null },
        systemsAffected: 47,
        detectionMethod: 'Performance Monitoring',
        frameworks: ['NIST CSF', 'CSA CCM'],
        objectives: [
          'Identify mining malware and affected instances',
          'Determine initial access vector',
          'Calculate financial impact',
          'Remove miners and prevent re-infection',
          'Optimize cloud security posture'
        ],
        teamSize: 3,
        availableTools: ['siem', 'edr', 'cloudSecurityTools', 'malwareAnalysis'],

        learningObjectives: [
          'Cloud security best practices',
          'Cryptojacking detection',
          'Container security',
          'Resource usage monitoring'
        ],

        mitreAttack: ['T1496']
      },

      // 10. SOCIAL ENGINEERING CAMPAIGN
      social_eng_001: {
        id: 'social_eng_001',
        title: 'Voice Phishing - Vishing Attack Wave',
        description: 'Coordinated vishing campaign targeting employees for credentials',
        attackType: 'Social Engineering',
        severity: 'high',
        industry: 'Healthcare',
        difficulty: 'normal',
        estimatedTime: 45,
        requirements: { level: 2, cert: null },
        systemsAffected: 23,
        detectionMethod: 'Employee Reports',
        frameworks: ['NIST CSF', 'HIPAA'],
        objectives: [
          'Identify compromised accounts',
          'Reset credentials for affected users',
          'Determine attacker objectives',
          'Conduct emergency security awareness training',
          'Implement additional authentication controls'
        ],
        teamSize: 4,
        availableTools: ['siem', 'idm', 'emailAnalyzer'],

        learningObjectives: [
          'Social engineering attack vectors',
          'Credential compromise response',
          'MFA implementation',
          'Security awareness training'
        ],

        mitreAttack: ['T1598', 'T1589', 'T1078']
      },

      // Additional scenarios 11-20 would follow similar structure...
      // I'll create abbreviated versions for space

      // 11. DATA EXFILTRATION
      exfil_001: {
        id: 'exfil_001',
        title: 'Midnight Transfer - Data Exfiltration',
        attackType: 'Data Exfiltration',
        severity: 'critical',
        industry: 'Legal Services',
        difficulty: 'hard',
        requirements: { level: 4, cert: null }
      },

      // 12. LATERAL MOVEMENT
      lateral_001: {
        id: 'lateral_001',
        title: 'Network Creep - Lateral Movement Detection',
        attackType: 'Lateral Movement',
        severity: 'high',
        industry: 'Government',
        difficulty: 'hard',
        requirements: { level: 4, cert: null }
      },

      // 13. PRIVILEGE ESCALATION
      privesc_001: {
        id: 'privesc_001',
        title: 'Root Access - Privilege Escalation',
        attackType: 'Privilege Escalation',
        severity: 'critical',
        industry: 'Banking',
        difficulty: 'expert',
        requirements: { level: 5, cert: null }
      },

      // 14. CLOUD BREACH
      cloud_001: {
        id: 'cloud_001',
        title: 'Misconfigured Bucket - Cloud Data Leak',
        attackType: 'Cloud Misconfiguration',
        severity: 'critical',
        industry: 'SaaS Provider',
        difficulty: 'normal',
        requirements: { level: 3, cert: null }
      },

      // 15. IOT BOTNET
      iot_001: {
        id: 'iot_001',
        title: 'Smart Device Siege - IoT Botnet',
        attackType: 'IoT Compromise',
        severity: 'high',
        industry: 'Smart Building',
        difficulty: 'normal',
        requirements: { level: 2, cert: null }
      },

      // 16. PHYSICAL BREACH
      physical_001: {
        id: 'physical_001',
        title: 'Tailgating Incident - Physical Security Breach',
        attackType: 'Physical Breach',
        severity: 'high',
        industry: 'Data Center',
        difficulty: 'normal',
        requirements: { level: 2, cert: null }
      },

      // 17. THIRD-PARTY BREACH
      third_party_001: {
        id: 'third_party_001',
        title: 'Vendor Compromise - Third-Party Breach',
        attackType: 'Third-Party Risk',
        severity: 'high',
        industry: 'Healthcare',
        difficulty: 'hard',
        requirements: { level: 4, cert: null }
      },

      // 18. MOBILE DEVICE COMPROMISE
      mobile_001: {
        id: 'mobile_001',
        title: 'Rogue Device - Mobile Compromise',
        attackType: 'Mobile Device Compromise',
        severity: 'medium',
        industry: 'Enterprise',
        difficulty: 'normal',
        requirements: { level: 2, cert: null }
      },

      // 19. CERTIFICATE COMPROMISE
      cert_001: {
        id: 'cert_001',
        title: 'Trust Broken - Certificate Authority Breach',
        attackType: 'Certificate Compromise',
        severity: 'critical',
        industry: 'Certificate Authority',
        difficulty: 'expert',
        requirements: { level: 7, cert: null }
      },

      // 20. API ABUSE
      api_001: {
        id: 'api_001',
        title: 'Broken Authentication - API Abuse',
        attackType: 'API Security',
        severity: 'high',
        industry: 'FinTech',
        difficulty: 'normal',
        requirements: { level: 3, cert: null }
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

  getScenariosByIndustry(industry) {
    return Object.values(this.scenarios).filter(s => s.industry === industry);
  }

  getAvailableScenarios(playerLevel) {
    return Object.values(this.scenarios).filter(s =>
      !s.requirements || s.requirements.level <= playerLevel
    );
  }

  generateDynamicElements(scenario) {
    // Add procedural generation for replayability
    if (scenario.dynamic) {
      // Randomize IP addresses
      // Vary attack timing
      // Adjust difficulty parameters
      // Mix up evidence locations
    }
  }
}

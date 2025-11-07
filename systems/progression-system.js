/**
 * Progression System - Skill Trees, Leveling, Achievements
 * RPG-style character progression for incident responders
 */

class ProgressionSystem {
  constructor() {
    this.ranks = [
      { level: 1, title: 'Junior SOC Analyst', xpRequired: 0, skillPoints: 3 },
      { level: 2, title: 'SOC Analyst', xpRequired: 1000, skillPoints: 2 },
      { level: 3, title: 'Senior SOC Analyst', xpRequired: 2500, skillPoints: 2 },
      { level: 4, title: 'Lead Security Analyst', xpRequired: 5000, skillPoints: 3 },
      { level: 5, title: 'Incident Response Specialist', xpRequired: 10000, skillPoints: 3 },
      { level: 6, title: 'Senior IR Specialist', xpRequired: 18000, skillPoints: 2 },
      { level: 7, title: 'IR Team Lead', xpRequired: 30000, skillPoints: 3 },
      { level: 8, title: 'Principal Security Engineer', xpRequired: 50000, skillPoints: 3 },
      { level: 9, title: 'Security Architect', xpRequired: 80000, skillPoints: 2 },
      { level: 10, title: 'Chief Security Officer', xpRequired: 120000, skillPoints: 5 }
    ];

    this.skillTree = this.initializeSkillTree();
    this.achievements = this.initializeAchievements();
    this.certifications = this.initializeCertifications();
  }

  initializeSkillTree() {
    return {
      detection: {
        name: 'Detection & Analysis',
        icon: '🔍',
        skills: [
          {
            id: 'log_analysis_basic',
            name: 'Basic Log Analysis',
            description: 'Improve log analysis efficiency by 20%',
            cost: 1,
            requires: null,
            effect: { logAnalysisSpeed: 1.2, logInsight: 1.1 }
          },
          {
            id: 'log_analysis_advanced',
            name: 'Advanced Log Analysis',
            description: 'Master log correlation and pattern recognition',
            cost: 2,
            requires: 'log_analysis_basic',
            effect: { logAnalysisSpeed: 1.5, logInsight: 1.3 }
          },
          {
            id: 'siem_mastery',
            name: 'SIEM Mastery',
            description: 'Unlock advanced SIEM features and queries',
            cost: 3,
            requires: 'log_analysis_advanced',
            effect: { siemEfficiency: 1.5, alertAccuracy: 1.25 }
          },
          {
            id: 'threat_hunting',
            name: 'Threat Hunting',
            description: 'Proactively hunt for threats before they trigger alerts',
            cost: 3,
            requires: 'siem_mastery',
            effect: { detectHiddenThreats: true, timeToDetect: 0.8 }
          },
          {
            id: 'behavioral_analysis',
            name: 'Behavioral Analysis',
            description: 'Detect anomalies through user and entity behavior analytics',
            cost: 2,
            requires: 'threat_hunting',
            effect: { anomalyDetection: 1.4, falsePositiveReduction: 1.3 }
          }
        ]
      },

      containment: {
        name: 'Containment & Mitigation',
        icon: '🛡️',
        skills: [
          {
            id: 'network_isolation',
            name: 'Network Isolation',
            description: 'Quickly isolate compromised systems',
            cost: 1,
            requires: null,
            effect: { containmentSpeed: 1.3, lateralMovementPrevention: 1.2 }
          },
          {
            id: 'endpoint_quarantine',
            name: 'Endpoint Quarantine',
            description: 'Advanced EDR quarantine capabilities',
            cost: 2,
            requires: 'network_isolation',
            effect: { quarantineEfficiency: 1.5, dataLossPrevention: 1.2 }
          },
          {
            id: 'firewall_mastery',
            name: 'Firewall Mastery',
            description: 'Expert firewall rule management',
            cost: 2,
            requires: 'network_isolation',
            effect: { firewallEfficiency: 1.4, blockingAccuracy: 1.3 }
          },
          {
            id: 'rapid_response',
            name: 'Rapid Response',
            description: 'Reduce response time by 30%',
            cost: 3,
            requires: ['endpoint_quarantine', 'firewall_mastery'],
            effect: { responseTime: 0.7, containmentLevel: 1.3 }
          }
        ]
      },

      forensics: {
        name: 'Forensics & Investigation',
        icon: '🔬',
        skills: [
          {
            id: 'disk_forensics',
            name: 'Disk Forensics',
            description: 'Analyze disk images and file systems',
            cost: 2,
            requires: null,
            effect: { forensicSpeed: 1.2, evidenceQuality: 1.3 }
          },
          {
            id: 'memory_forensics',
            name: 'Memory Forensics',
            description: 'Analyze RAM dumps for active threats',
            cost: 2,
            requires: 'disk_forensics',
            effect: { malwareDetection: 1.4, rootkitDetection: 1.5 }
          },
          {
            id: 'network_forensics',
            name: 'Network Forensics',
            description: 'Analyze packet captures and traffic flows',
            cost: 2,
            requires: 'disk_forensics',
            effect: { networkAnalysisSpeed: 1.3, c2Detection: 1.4 }
          },
          {
            id: 'malware_reverse',
            name: 'Malware Reverse Engineering',
            description: 'Reverse engineer malicious code',
            cost: 3,
            requires: 'memory_forensics',
            effect: { malwareUnderstanding: 1.5, iocExtraction: 1.4 }
          },
          {
            id: 'timeline_reconstruction',
            name: 'Timeline Reconstruction',
            description: 'Build comprehensive attack timelines',
            cost: 3,
            requires: ['network_forensics', 'memory_forensics'],
            effect: { timelineAccuracy: 1.5, attackChainVisibility: 1.4 }
          }
        ]
      },

      communication: {
        name: 'Communication & Leadership',
        icon: '💼',
        skills: [
          {
            id: 'stakeholder_management',
            name: 'Stakeholder Management',
            description: 'Improve stakeholder confidence retention',
            cost: 1,
            requires: null,
            effect: { stakeholderConfidence: 1.2, reputationLoss: 0.8 }
          },
          {
            id: 'crisis_communication',
            name: 'Crisis Communication',
            description: 'Master crisis communication protocols',
            cost: 2,
            requires: 'stakeholder_management',
            effect: { crisisHandling: 1.4, mediaRelations: 1.3 }
          },
          {
            id: 'team_coordination',
            name: 'Team Coordination',
            description: 'Improve team efficiency and morale',
            cost: 2,
            requires: 'stakeholder_management',
            effect: { teamMorale: 1.3, taskEfficiency: 1.2 }
          },
          {
            id: 'executive_reporting',
            name: 'Executive Reporting',
            description: 'Communicate technical issues to executives',
            cost: 2,
            requires: 'crisis_communication',
            effect: { executiveSatisfaction: 1.4, budgetApproval: 1.3 }
          },
          {
            id: 'incident_commander',
            name: 'Incident Commander',
            description: 'Lead large-scale incident response operations',
            cost: 3,
            requires: ['team_coordination', 'executive_reporting'],
            effect: { overallEfficiency: 1.3, stressReduction: 1.4 }
          }
        ]
      },

      recovery: {
        name: 'Recovery & Resilience',
        icon: '🔄',
        skills: [
          {
            id: 'backup_restoration',
            name: 'Backup Restoration',
            description: 'Efficient backup recovery procedures',
            cost: 1,
            requires: null,
            effect: { recoverySpeed: 1.3, dataRecovery: 1.2 }
          },
          {
            id: 'system_hardening',
            name: 'System Hardening',
            description: 'Strengthen systems against re-infection',
            cost: 2,
            requires: 'backup_restoration',
            effect: { reinfectionPrevention: 1.5, systemSecurity: 1.3 }
          },
          {
            id: 'business_continuity',
            name: 'Business Continuity',
            description: 'Maintain operations during incidents',
            cost: 2,
            requires: 'backup_restoration',
            effect: { downtimeReduction: 1.4, businessImpact: 0.7 }
          },
          {
            id: 'disaster_recovery',
            name: 'Disaster Recovery',
            description: 'Comprehensive DR plan execution',
            cost: 3,
            requires: ['system_hardening', 'business_continuity'],
            effect: { fullRecoverySpeed: 1.5, dataLossPrevention: 1.4 }
          }
        ]
      },

      intelligence: {
        name: 'Threat Intelligence',
        icon: '🌐',
        skills: [
          {
            id: 'osint_gathering',
            name: 'OSINT Gathering',
            description: 'Collect open-source threat intelligence',
            cost: 1,
            requires: null,
            effect: { intelAccuracy: 1.2, threatAwareness: 1.3 }
          },
          {
            id: 'ioc_analysis',
            name: 'IOC Analysis',
            description: 'Analyze and utilize indicators of compromise',
            cost: 2,
            requires: 'osint_gathering',
            effect: { iocMatching: 1.4, threatIdentification: 1.3 }
          },
          {
            id: 'ttp_mapping',
            name: 'TTP Mapping',
            description: 'Map attacks to MITRE ATT&CK framework',
            cost: 2,
            requires: 'ioc_analysis',
            effect: { attackUnderstanding: 1.4, mitigationEffectiveness: 1.3 }
          },
          {
            id: 'threat_actor_profiling',
            name: 'Threat Actor Profiling',
            description: 'Profile and track threat actor groups',
            cost: 3,
            requires: 'ttp_mapping',
            effect: { attribution: 1.5, predictiveDefense: 1.4 }
          }
        ]
      }
    };
  }

  initializeAchievements() {
    return [
      {
        id: 'first_incident',
        name: 'First Response',
        description: 'Complete your first incident',
        icon: '🎖️',
        rarity: 'common',
        points: 100,
        unlocked: false
      },
      {
        id: 'perfect_score',
        name: 'Perfect Response',
        description: 'Complete a scenario with 100% score',
        icon: '💯',
        rarity: 'rare',
        points: 500,
        unlocked: false
      },
      {
        id: 'speed_runner',
        name: 'Speed Runner',
        description: 'Complete incident in under 30 minutes',
        icon: '⚡',
        rarity: 'rare',
        points: 400,
        unlocked: false
      },
      {
        id: 'forensic_expert',
        name: 'Forensic Expert',
        description: 'Collect all evidence in a scenario',
        icon: '🔬',
        rarity: 'uncommon',
        points: 300,
        unlocked: false
      },
      {
        id: 'containment_master',
        name: 'Containment Master',
        description: 'Achieve 100% containment',
        icon: '🛡️',
        rarity: 'rare',
        points: 400,
        unlocked: false
      },
      {
        id: 'stakeholder_savior',
        name: 'Stakeholder Savior',
        description: 'Maintain 100% stakeholder confidence',
        icon: '📊',
        rarity: 'rare',
        points: 400,
        unlocked: false
      },
      {
        id: 'budget_conscious',
        name: 'Budget Conscious',
        description: 'Complete incident under budget',
        icon: '💰',
        rarity: 'uncommon',
        points: 250,
        unlocked: false
      },
      {
        id: 'all_scenarios',
        name: 'Incident Master',
        description: 'Complete all scenarios',
        icon: '👑',
        rarity: 'legendary',
        points: 2000,
        unlocked: false
      },
      {
        id: 'expert_level',
        name: 'Expert Difficulty',
        description: 'Complete expert difficulty scenario',
        icon: '💀',
        rarity: 'epic',
        points: 750,
        unlocked: false
      },
      {
        id: 'no_casualties',
        name: 'Zero Data Loss',
        description: 'Complete ransomware scenario with zero data loss',
        icon: '🔒',
        rarity: 'rare',
        points: 500,
        unlocked: false
      },
      {
        id: 'apt_hunter',
        name: 'APT Hunter',
        description: 'Successfully neutralize an APT',
        icon: '🎯',
        rarity: 'epic',
        points: 800,
        unlocked: false
      },
      {
        id: 'team_player',
        name: 'Team Player',
        description: 'Complete 5 multiplayer incidents',
        icon: '👥',
        rarity: 'uncommon',
        points: 300,
        unlocked: false
      },
      {
        id: 'certification_ready',
        name: 'Certification Ready',
        description: 'Earn all in-game certifications',
        icon: '📜',
        rarity: 'legendary',
        points: 1500,
        unlocked: false
      },
      {
        id: 'mentor',
        name: 'The Mentor',
        description: 'Complete 10 scenarios without using hints',
        icon: '🧠',
        rarity: 'epic',
        points: 1000,
        unlocked: false
      },
      {
        id: 'swiss_army_knife',
        name: 'Swiss Army Knife',
        description: 'Use every security tool available',
        icon: '🔧',
        rarity: 'rare',
        points: 400,
        unlocked: false
      }
    ];
  }

  initializeCertifications() {
    return [
      {
        id: 'gcih',
        name: 'Cyber Incident Handler (GCIH)',
        description: 'Equivalent to SANS GCIH certification',
        requirements: {
          level: 5,
          scenarios: ['ransomware_001', 'apt_001', 'ddos_001'],
          minScore: 80
        },
        benefits: {
          xpBonus: 1.2,
          scenarioUnlocks: ['expert_level']
        },
        earned: false
      },
      {
        id: 'cissp',
        name: 'Security Professional (CISSP)',
        description: 'Equivalent to (ISC)² CISSP certification',
        requirements: {
          level: 7,
          scenarios: 'all_normal',
          achievements: 5
        },
        benefits: {
          xpBonus: 1.3,
          leadershipBonus: 1.2
        },
        earned: false
      },
      {
        id: 'ceh',
        name: 'Ethical Hacker (CEH)',
        description: 'Equivalent to EC-Council CEH',
        requirements: {
          level: 4,
          scenarios: ['webapp_001', 'network_001', 'wireless_001']
        },
        benefits: {
          attackInsight: 1.3
        },
        earned: false
      }
    ];
  }

  addXP(amount) {
    const player = game.state.player;
    player.xp += amount;

    // Check for level up
    const nextRank = this.ranks.find(r => r.level === player.level + 1);
    if (nextRank && player.xp >= nextRank.xpRequired) {
      this.levelUp();
    }

    this.updateUI();
  }

  levelUp() {
    const player = game.state.player;
    player.level++;

    const newRank = this.ranks.find(r => r.level === player.level);
    if (newRank) {
      player.rank = newRank.title;
      player.skillPoints += newRank.skillPoints;

      game.showNotification(`🎉 Level Up! You are now ${newRank.title}`, 'success');

      // Show level up modal
      this.showLevelUpModal(newRank);
    }
  }

  showLevelUpModal(rank) {
    const modal = `
      <div class="levelup-modal">
        <div class="levelup-content">
          <h1 class="levelup-title">🎊 LEVEL UP! 🎊</h1>
          <div class="rank-display">
            <div class="rank-badge">
              <div class="rank-level">${rank.level}</div>
            </div>
            <div class="rank-info">
              <h2>${rank.title}</h2>
              <p>You've earned ${rank.skillPoints} skill points!</p>
            </div>
          </div>
          <div class="levelup-stats">
            <p>Total XP: ${game.state.player.xp}</p>
            <p>Skill Points Available: ${game.state.player.skillPoints}</p>
          </div>
          <div class="levelup-actions">
            <button class="btn-primary" onclick="game.progression.showSkillTree()">
              Spend Skill Points
            </button>
            <button class="btn-secondary" onclick="game.closeModal()">
              Later
            </button>
          </div>
        </div>
      </div>
    `;

    game.showModal(modal);
  }

  showSkillTree() {
    game.closeModal();

    const skillTreeHTML = `
      <div class="skilltree-window">
        <div class="skilltree-header">
          <h2>🌳 Skill Tree</h2>
          <div class="skillpoints-display">
            Available Points: <span class="skillpoints">${game.state.player.skillPoints}</span>
          </div>
          <button onclick="game.closeModal()" class="close-btn">×</button>
        </div>

        <div class="skilltree-content">
          ${Object.entries(this.skillTree).map(([category, data]) => `
            <div class="skill-category">
              <h3 class="category-title">
                <span class="category-icon">${data.icon}</span>
                ${data.name}
              </h3>
              <div class="skills-list">
                ${data.skills.map(skill => this.renderSkill(skill)).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    game.showModal(skillTreeHTML);
  }

  renderSkill(skill) {
    const player = game.state.player;
    const unlocked = player.unlockedSkills?.includes(skill.id) || false;
    const canUnlock = this.canUnlockSkill(skill);

    return `
      <div class="skill-node ${unlocked ? 'unlocked' : ''} ${canUnlock ? 'available' : 'locked'}">
        <div class="skill-header">
          <span class="skill-name">${skill.name}</span>
          <span class="skill-cost">${skill.cost} SP</span>
        </div>
        <div class="skill-description">${skill.description}</div>
        ${!unlocked && canUnlock ? `
          <button class="skill-unlock-btn" onclick="game.progression.unlockSkill('${skill.id}')">
            Unlock
          </button>
        ` : ''}
        ${unlocked ? '<div class="skill-status">✓ Unlocked</div>' : ''}
      </div>
    `;
  }

  canUnlockSkill(skill) {
    const player = game.state.player;

    // Check skill points
    if (player.skillPoints < skill.cost) return false;

    // Check if already unlocked
    if (player.unlockedSkills?.includes(skill.id)) return false;

    // Check prerequisites
    if (skill.requires) {
      if (Array.isArray(skill.requires)) {
        return skill.requires.every(req => player.unlockedSkills?.includes(req));
      } else {
        return player.unlockedSkills?.includes(skill.requires);
      }
    }

    return true;
  }

  unlockSkill(skillId) {
    const skill = this.findSkill(skillId);
    if (!skill || !this.canUnlockSkill(skill)) return;

    const player = game.state.player;

    // Deduct skill points
    player.skillPoints -= skill.cost;

    // Unlock skill
    if (!player.unlockedSkills) player.unlockedSkills = [];
    player.unlockedSkills.push(skillId);

    // Apply effects
    if (!player.skillEffects) player.skillEffects = {};
    Object.assign(player.skillEffects, skill.effect);

    game.showNotification(`Unlocked: ${skill.name}`, 'success');
    game.saveGame();

    // Refresh skill tree display
    this.showSkillTree();
  }

  findSkill(skillId) {
    for (const category of Object.values(this.skillTree)) {
      const skill = category.skills.find(s => s.id === skillId);
      if (skill) return skill;
    }
    return null;
  }

  unlockAchievement(achievementId) {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    achievement.unlocked = true;
    game.state.player.achievements.push(achievementId);

    // Add XP reward
    this.addXP(achievement.points);

    // Show achievement notification
    this.showAchievementNotification(achievement);

    game.saveGame();
  }

  showAchievementNotification(achievement) {
    const notification = `
      <div class="achievement-notification ${achievement.rarity}">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
          <div class="achievement-rarity">${achievement.rarity.toUpperCase()}</div>
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-desc">${achievement.description}</div>
          <div class="achievement-points">+${achievement.points} XP</div>
        </div>
      </div>
    `;

    const elem = document.createElement('div');
    elem.innerHTML = notification;
    elem.className = 'achievement-popup';
    document.body.appendChild(elem);

    setTimeout(() => {
      elem.classList.add('show');
    }, 100);

    setTimeout(() => {
      elem.classList.remove('show');
      setTimeout(() => elem.remove(), 500);
    }, 5000);
  }

  meetsRequirements(requirements) {
    if (!requirements) return true;

    const player = game.state.player;

    if (requirements.level && player.level < requirements.level) {
      return false;
    }

    if (requirements.cert && !player.certifications.includes(requirements.cert)) {
      return false;
    }

    return true;
  }

  updateUI() {
    // Update player stats in UI
    const displays = {
      'player-level': game.state.player.level,
      'player-rank': game.state.player.rank,
      'player-xp': game.state.player.xp,
      'player-sp': game.state.player.skillPoints
    };

    Object.entries(displays).forEach(([id, value]) => {
      const elem = document.getElementById(id);
      if (elem) elem.textContent = value;
    });
  }
}

// AURA AI Central Coordinator
import { audio } from './audio.js';
import { visual } from './canvas.js';

class AuraApp {
  constructor() {
    this.activePage = 'hero';
    this.memoryTags = [
      "Prefers UPI payments",
      "Travels every December",
      "Saves 35% after salary",
      "Long-term goal: Buy House",
      "Avoids high premium insurance",
      "High cash-back seeker"
    ];
    this.actionsQueue = [
      { id: 'sip', title: 'Save $150 More Every Month', category: 'Investment', desc: 'You got a raise! We suggest saving 33% of this extra money.', impact: '+$18,500 (10 yrs)', confidence: '96%', icon: 'trending-up' },
      { id: 'power', title: 'Switch to a Cheaper Electricity Plan', category: 'Savings', desc: 'Found a cheaper local electricity company with a discount.', impact: '+$180/yr savings', confidence: '92%', icon: 'zap' },
      { id: 'sub', title: 'Cancel Unused App Subscriptions', category: 'Savings', desc: "Found 3 apps you haven't used in the last 90 days.", impact: '+$45/mo savings', confidence: '99%', icon: 'trash-2' },
      { id: 'insurance', title: 'Get Tokyo Travel Insurance', category: 'Travel', desc: 'Found a Tokyo trip in your calendar. Here is a discounted travel insurance.', impact: 'Secures $25k risk', confidence: '94%', icon: 'plane' },
      { id: 'tax', title: 'Save More on Taxes', category: 'Investment', desc: 'Put more into retirement to pay less taxes.', impact: '+$400 immediate return', confidence: '95%', icon: 'award' }
    ];
    this.agentStates = [
      { id: 'analyst', name: 'Budget Planner AI', task: 'Finding the best investment plans...', status: 'WORKING', speed: 92, mem: '1.2 GB', confidence: 98, typeLog: 'Checking files to find where you can save and grow money...' },
      { id: 'behavior', name: 'Spending Assistant AI', task: 'Checking daily spending...', status: 'LEARNING', speed: 78, mem: '0.9 GB', confidence: 95, typeLog: 'Checking trips and monthly bills...' },
      { id: 'life', name: 'Future Calculator AI', task: 'Checking home loan options...', status: 'PREDICTING', speed: 85, mem: '1.5 GB', confidence: 94, typeLog: 'Estimating future savings and goals...' },
      { id: 'fraud', name: 'Security Guard AI', task: 'Checking card payments for safety...', status: 'SAFEGUARDING', speed: 99, mem: '2.1 GB', confidence: 99, typeLog: 'Scanning payment locations to prevent theft...' },
      { id: 'invest', name: 'Investment Helper AI', task: 'Updating investments...', status: 'OPTIMIZING', speed: 89, mem: '1.8 GB', confidence: 97, typeLog: 'Calculating monthly investment shares...' }
    ];
    this.stats = {
      saved: 380,
      fraudBlocked: 12,
      futureSurplus: 84350
    };
  }

  init() {
    this.setupNavigation();
    this.setupSidebarToggle();
    this.setupSoundHooks();
    this.setupTelemetryClock();
    this.setupAgentSimulators();
    this.setupActionCenter();
    this.setupMemoryControls();
    this.setupFutureSimulator();
    this.setupTimelineInteraction();
    this.setupEmergencyControls();
    this.setupProfileControls();
    this.renderWorkforce();
    
    // Initialize Canvas systems
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) visual.initBackground(bgCanvas);
    
    const globeCanvas = document.getElementById('globe-canvas');
    if (globeCanvas) visual.initGlobe(globeCanvas);
    
    visual.tick();
  }

  // SOUND HOOKUPS
  setupSoundHooks() {
    // Attach subtle hover sound to all clickables
    document.body.addEventListener('mouseover', (e) => {
      const target = e.target.closest('button, .nav-item, .scenario-option, .memory-tag, .timeline-item');
      if (target) {
        audio.playTick();
      }
    });

    // Interaction handler to unlock audio context in standard browsers
    document.body.addEventListener('click', () => {
      audio.resume();
    });
  }

  // CLOCK TELEMETRY
  setupTelemetryClock() {
    const timeEl = document.getElementById('header-time');
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      
      const formatter = new Intl.DateTimeFormat('en-IN', options);
      const parts = formatter.formatToParts(now);
      
      let year, month, day, hour, minute, second;
      parts.forEach(p => {
        if (p.type === 'year') year = p.value;
        if (p.type === 'month') month = p.value;
        if (p.type === 'day') day = p.value;
        if (p.type === 'hour') hour = p.value;
        if (p.type === 'minute') minute = p.value;
        if (p.type === 'second') second = p.value;
      });
      
      timeEl.textContent = `${year}-${month}-${day} ${hour}:${minute}:${second} IST`;
    };
    setInterval(updateTime, 1000);
    updateTime();
  }

  // SPA PAGE TRANSITIONS
  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetPage = item.getAttribute('data-page');
        this.navigateTo(targetPage);
      });
    });

    // Hero Landing CTA
    const launchBtn = document.getElementById('btn-launch-ai');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        audio.playSuccess();
        document.body.classList.remove('fullscreen-mode');
        this.navigateTo('briefing');
      });
    }

    // Briefing Continue CTA
    const briefingBtn = document.getElementById('btn-briefing-continue');
    if (briefingBtn) {
      briefingBtn.addEventListener('click', () => {
        this.navigateTo('mission-control');
      });
    }
  }

  // SIDEBAR TOGGLING CONTROLS
  setupSidebarToggle() {
    const closeBtn = document.getElementById('btn-close-sidebar');
    const openBtn = document.getElementById('btn-open-sidebar');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.body.classList.add('sidebar-collapsed');
        audio.playSelect();
      });
    }

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        document.body.classList.remove('sidebar-collapsed');
        audio.playSelect();
      });
    }
  }

  navigateTo(pageId) {
    if (pageId === this.activePage) return;
    audio.playSelect();

    const activeView = document.querySelector('.page-view.active');
    if (activeView) activeView.classList.remove('active');

    const targetView = document.getElementById(`page-${pageId}`);
    if (targetView) targetView.classList.add('active');

    // Update Sidebar state
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav) activeNav.classList.remove('active');

    const targetNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (targetNav) targetNav.classList.add('active');

    this.activePage = pageId;


  }

  // AGENT TELEMETRY UPDATES
  setupAgentSimulators() {
    this.renderAgents();

    // Tick loops to fluctuate CPU levels and logs
    setInterval(() => {
      this.agentStates.forEach(agent => {
        // Random fluctuate speeds, confidence and memory slightly
        agent.speed = Math.min(100, Math.max(50, agent.speed + Math.floor(Math.random() * 11) - 5));
        agent.confidence = Math.min(99, Math.max(90, agent.confidence + (Math.random() > 0.5 ? 1 : -1)));
        
        // Randomize active logs to make them feel organic
        const actionPools = {
          analyst: ["Checking savings plans...", "Checking fund balances...", "Finding investment options...", "Calculated possible gains"],
          behavior: ["Checking shopping charges...", "Comparing weekly bills...", "Checking app subscriptions...", "Found weekend spend increase"],
          life: ["Checking home loan rates...", "Estimating savings growth...", "Calculating wedding costs...", "Checked car loan details"],
          fraud: ["Verifying payment safety...", "Checking browser location...", "Scanning checkout charges...", "Verifying card details"],
          invest: ["Calculating monthly savings...", "Checking interest rates...", "Selecting low-fee funds...", "Balancing investments"]
        };
        const pool = actionPools[agent.id] || ["Processing data..."];
        agent.typeLog = pool[Math.floor(Math.random() * pool.length)];
      });
      this.renderAgents();
    }, 3000);
  }

  renderAgents() {
    const grid = document.getElementById('agents-grid');
    if (!grid || this.activePage !== 'mission-control') return;

    grid.innerHTML = this.agentStates.map(agent => `
      <div class="glass-card agent-node-card">
        <div class="agent-header">
          <div class="agent-identity">
            <span class="agent-dot-glow ${agent.status.toLowerCase()}"></span>
            <h3>${agent.name}</h3>
          </div>
          <span class="agent-status-badge">${agent.status}</span>
        </div>
        <div class="agent-card-body">
          <p style="margin-bottom: 8px;"><strong>Active Task:</strong> ${agent.task}</p>
          <div class="agent-thinking-log">
            &gt; ${agent.typeLog}
          </div>
        </div>
        <div class="agent-telemetry">
          <div class="telemetry-item">
            <label>CPU Utilization</label>
            <span>${agent.speed}%</span>
            <div class="telemetry-progress-track">
              <div class="telemetry-progress-fill" style="width: ${agent.speed}%"></div>
            </div>
          </div>
          <div class="telemetry-item">
            <label>Confidence</label>
            <span>${agent.confidence}%</span>
            <div class="telemetry-progress-track">
              <div class="telemetry-progress-fill" style="width: ${agent.confidence}%; background: var(--cyan-glow)"></div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ACTION CENTER QUEUE
  setupActionCenter() {
    this.renderActionQueue();
  }

  renderActionQueue() {
    const container = document.getElementById('action-queue-container');
    if (!container) return;

    if (this.actionsQueue.length === 0) {
      container.innerHTML = `
        <div class="glass-card" style="text-align: center; padding: 40px;">
          <i data-lucide="check-circle" class="text-emerald" style="width: 48px; height: 48px; margin: 0 auto 16px auto;"></i>
          <h3>All Actions Approved</h3>
          <p style="color: #64748b; font-size: 13px; margin-top: 8px;">The AI Workforce has synced all allocations. Excellent work!</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    container.innerHTML = this.actionsQueue.map(action => `
      <div class="glass-card action-card" id="action-card-${action.id}">
        <div class="action-info">
          <div class="action-icon">
            <i data-lucide="${action.icon}"></i>
          </div>
          <div class="action-details">
            <h3>${action.title}</h3>
            <p>${action.desc}</p>
            <span class="action-impact-badge">${action.impact}</span>
          </div>
        </div>
        
        <div class="action-meta">
          <div class="action-confidence">Confidence: ${action.confidence}</div>
          <div class="action-buttons">
            <button class="btn-action-approve" data-id="${action.id}">Approve</button>
            <button class="btn-action-modify" data-id="${action.id}">Modify</button>
            <button class="btn-action-reject" data-id="${action.id}">Reject</button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach actions
    container.querySelectorAll('.btn-action-approve').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleActionApprove(e.target.getAttribute('data-id')));
    });
    container.querySelectorAll('.btn-action-reject').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleActionReject(e.target.getAttribute('data-id')));
    });
    container.querySelectorAll('.btn-action-modify').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleActionModify(e.target.getAttribute('data-id')));
    });

    lucide.createIcons();
  }

  handleActionApprove(id) {
    audio.playSuccess();
    const card = document.getElementById(`action-card-${id}`);
    if (card) {
      card.style.transform = 'translateX(100px)';
      card.style.opacity = '0';
      setTimeout(() => {
        this.actionsQueue = this.actionsQueue.filter(item => item.id !== id);
        
        // Update Impact Stats dynamically
        this.stats.saved += 65;
        this.stats.futureSurplus += 8500;
        this.updateGlobalStats();
        
        this.renderActionQueue();
      }, 300);
    }
  }

  handleActionReject(id) {
    audio.playAlert();
    const card = document.getElementById(`action-card-${id}`);
    if (card) {
      card.style.transform = 'translateX(-100px)';
      card.style.opacity = '0';
      setTimeout(() => {
        this.actionsQueue = this.actionsQueue.filter(item => item.id !== id);
        this.renderActionQueue();
      }, 300);
    }
  }

  handleActionModify(id) {
    audio.playSelect();
    const newAmount = prompt("Enter modified monthly value:", "$120");
    if (newAmount) {
      const item = this.actionsQueue.find(x => x.id === id);
      if (item) {
        item.title = item.title.replace(/\$\d+/, newAmount);
        item.desc = `User adjusted baseline value. Recalculated index allocation to ${newAmount}/mo.`;
        this.renderActionQueue();
      }
    }
  }

  updateGlobalStats() {
    // Briefing saved counter
    const briefSaved = document.getElementById('briefing-saved-counter');
    if (briefSaved) briefSaved.textContent = `$${this.stats.saved.toFixed(2)}`;

    // Impact panel indicators
    const impSaved = document.getElementById('impact-savings-counter');
    if (impSaved) impSaved.textContent = `$${this.stats.saved.toFixed(2)}`;

    const impFraud = document.getElementById('impact-fraud-counter');
    if (impFraud) impFraud.textContent = this.stats.fraudBlocked;

    const impSurplus = document.getElementById('impact-surplus-counter');
    if (impSurplus) impSurplus.textContent = `$${this.stats.futureSurplus.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  }

  // FUTURE SIMULATOR SCENARIOS
  setupFutureSimulator() {
    const scenarioOpts = document.querySelectorAll('.scenario-option');
    const downSlider = document.getElementById('slider-down-payment');
    const monthlySlider = document.getElementById('slider-monthly-add');

    const updateCalculations = () => {
      const activeScenario = document.querySelector('.scenario-option.active').getAttribute('data-scenario');
      const downVal = parseInt(downSlider.value);
      const monthlyVal = parseInt(monthlySlider.value);

      // Render sliders text
      document.getElementById('val-slider-down').textContent = `$${downVal.toLocaleString()}`;
      document.getElementById('val-slider-monthly').textContent = `$${monthlyVal.toLocaleString()}`;

      // Simulate calculations
      let multiplier = 1.0;
      if (activeScenario === 'car') multiplier = 0.85;
      if (activeScenario === 'house') multiplier = 1.4;
      if (activeScenario === 'marriage') multiplier = 0.95;
      if (activeScenario === 'tour') multiplier = 0.7;

      const baseVal = downVal * 4 + monthlyVal * 120;
      const netA = baseVal * 0.9 * multiplier;
      const netB = baseVal * 1.35 * multiplier;
      const netC = baseVal * 1.7 * multiplier;

      // Update counters
      document.getElementById('stat-a-net').textContent = `$${Math.round(netA).toLocaleString()}`;
      document.getElementById('stat-b-net').textContent = `$${Math.round(netB).toLocaleString()}`;
      document.getElementById('stat-c-net').textContent = `$${Math.round(netC).toLocaleString()}`;

      // Redraw SVG chart paths beautifully based on variables
      const pathA = document.getElementById('chart-path-a');
      const pathB = document.getElementById('chart-path-b');
      const pathC = document.getElementById('chart-path-c');

      // Adjust control points to make graph flex on slide
      const flexH = Math.min(180, Math.max(30, 180 - (monthlyVal / 30)));
      const flexD = Math.min(150, Math.max(20, 160 - (downVal / 1000)));

      pathA.setAttribute('d', `M 0 180 Q 125 ${flexH + 20} 250 ${flexH} T 500 ${flexD + 30}`);
      pathB.setAttribute('d', `M 0 180 Q 125 ${flexH - 10} 250 ${flexH - 30} T 500 ${flexD}`);
      pathC.setAttribute('d', `M 0 180 Q 125 ${flexH - 30} 250 ${flexH - 60} T 500 ${flexD - 30}`);
    };

    scenarioOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        audio.playSelect();
        document.querySelector('.scenario-option.active').classList.remove('active');
        opt.classList.add('active');
        updateCalculations();
      });
    });

    downSlider.addEventListener('input', updateCalculations);
    monthlySlider.addEventListener('input', updateCalculations);

    // Initial run
    updateCalculations();
  }

  // AI MEMORY CONTROLS
  setupMemoryControls() {
    this.renderMemoryTags();

    const addBtn = document.getElementById('btn-add-memory');
    const textInput = document.getElementById('input-new-memory');

    if (addBtn && textInput) {
      addBtn.addEventListener('click', () => {
        const val = textInput.value.trim();
        if (val) {
          audio.playSuccess();
          this.memoryTags.push(val);
          textInput.value = '';
          this.renderMemoryTags();
        }
      });
    }
  }

  renderMemoryTags() {
    const container = document.getElementById('memory-tags-container');
    if (!container) return;

    container.innerHTML = this.memoryTags.map((tag, idx) => `
      <div class="memory-tag ${idx === this.memoryTags.length - 1 ? 'highlight' : ''}">
        <span>${tag}</span>
        <button class="btn-tag-delete" data-index="${idx}">
          <i data-lucide="x"></i>
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.btn-tag-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-index'));
        audio.playAlert();
        this.memoryTags.splice(idx, 1);
        this.renderMemoryTags();
      });
    });

    lucide.createIcons();
  }



  // LIFE TIMELINE ACCORDION INTERACTIONS
  setupTimelineInteraction() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      item.addEventListener('click', () => {
        audio.playSelect();
        const isAlreadyExpanded = item.classList.contains('expanded');
        
        // Collapse all items
        timelineItems.forEach(el => el.classList.remove('expanded'));
        
        // If not already expanded, expand the clicked one
        if (!isAlreadyExpanded) {
          item.classList.add('expanded');
        }
      });
    });
  }

  // EMERGENCY SYSTEM CONTROLS
  setupEmergencyControls() {
    const triggerBtn = document.getElementById('btn-trigger-emergency');
    const overlay = document.getElementById('emergency-overlay');
    const freezeBtn = document.getElementById('btn-emergency-freeze');
    const authBtn = document.getElementById('btn-emergency-authorize');
    const bypassBtn = document.getElementById('btn-emergency-bypass');

    if (triggerBtn && overlay) {
      triggerBtn.addEventListener('click', () => {
        audio.playAlert();
        overlay.classList.add('active');
        
        // Loop low beep alert sounds while warning is open
        const alertLoop = setInterval(() => {
          if (overlay.classList.contains('active')) {
            audio.playAlert();
          } else {
            clearInterval(alertLoop);
          }
        }, 1200);
      });
    }

    const closeOverlay = () => {
      audio.playSelect();
      overlay.classList.remove('active');
    };

    if (freezeBtn) {
      freezeBtn.addEventListener('click', () => {
        audio.playSuccess();
        alert("SECURITY TRIGGERED: AI HAS SUSPENDED CREDIT VEHICLES. RE-VERIFY VIA BIO-IDENTIFICATION.");
        this.stats.fraudBlocked++;
        this.updateGlobalStats();
        overlay.classList.remove('active');
      });
    }

    if (authBtn) authBtn.addEventListener('click', closeOverlay);
    if (bypassBtn) bypassBtn.addEventListener('click', closeOverlay);
  }

  // WORKFORCE DIRECTORY DISPLAY
  renderWorkforce() {
    const container = document.getElementById('workforce-container');
    if (!container) return;

    const workforce = [
      { role: 'Lead Manager AI', initial: 'LM', desc: 'Combines advice from all other AI helpers to give you the final recommendations.', mem: '4.8 GB', key: 'SYS-ROOT-0', activity: 'Writing your daily update...' },
      { role: 'Budget Planner AI', initial: 'BP', desc: 'Helps you save on taxes, checks your credit rating, and matches investments.', mem: '2.4 GB', key: 'FP-V4.2', activity: 'Finding ways to pay less tax...' },
      { role: 'Spending Tracker AI', initial: 'ST', desc: 'Finds quick increases in spending, unused apps, and bills.', mem: '1.8 GB', key: 'BA-V1.9', activity: 'Scanning subscription charges...' },
      { role: 'Investment Helper AI', initial: 'IH', desc: 'Calculates simple ways to buy and grow investment funds monthly.', mem: '3.2 GB', key: 'IS-V3.0', activity: 'Calculating monthly investments...' },
      { role: 'Security Guard AI', initial: 'SG', desc: 'Instantly checks where card transactions happen to prevent theft.', mem: '2.0 GB', key: 'FI-V12.1', activity: 'Verifying payment location details...' },
      { role: 'Goal Tracker AI', initial: 'GT', desc: 'Keeps track of important future costs, home loans, and savings.', mem: '1.6 GB', key: 'LC-V2.5', activity: 'Checking home loan rates...' }
    ];

    container.innerHTML = workforce.map(emp => `
      <div class="glass-card employee-card">
        <div class="employee-header">
          <div class="employee-avatar-wrapper">
            <div class="employee-avatar">${emp.initial}</div>
            <div class="employee-avatar-pulse"></div>
          </div>
          <div class="employee-identity">
            <h3>${emp.role}</h3>
            <p>ID: ${emp.key}</p>
          </div>
        </div>
        <div class="employee-task-box">
          <label>Current Task</label>
          <span>${emp.activity}</span>
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px; line-height: 1.5;">${emp.desc}</p>
        <div class="employee-meta-row">
          <span>Memory Used: ${emp.mem}</span>
          <span style="color: var(--cyan-glow)">Status: Active & Secure</span>
        </div>
      </div>
    `).join('');

    lucide.createIcons();
  }

  // PROFILE EDITOR CONTROLS
  setupProfileControls() {
    const userPanel = document.querySelector('.user-panel');
    const overlay = document.getElementById('profile-overlay');
    const saveBtn = document.getElementById('btn-save-profile');
    const cancelBtn = document.getElementById('btn-cancel-profile');
    const nameInput = document.getElementById('input-profile-name');
    const syncSelect = document.getElementById('select-profile-sync');

    if (userPanel && overlay) {
      userPanel.addEventListener('click', () => {
        audio.playSelect();
        const currentName = document.querySelector('.user-details h4').textContent;
        if (nameInput) nameInput.value = currentName;
        overlay.style.display = 'flex';
      });
    }

    const closeOverlay = () => {
      audio.playSelect();
      overlay.style.display = 'none';
    };

    if (cancelBtn) cancelBtn.addEventListener('click', closeOverlay);

    if (saveBtn && nameInput && syncSelect) {
      saveBtn.addEventListener('click', () => {
        const newName = nameInput.value.trim();
        if (newName) {
          audio.playSuccess();
          
          const words = newName.split(/\s+/);
          let initials = "";
          if (words[0]) initials += words[0][0].toUpperCase();
          if (words[1]) initials += words[1][0].toUpperCase();
          if (!initials) initials = "AI";

          const avatar = document.querySelector('.user-avatar');
          if (avatar) avatar.textContent = initials;

          const nameHeader = document.querySelector('.user-details h4');
          if (nameHeader) nameHeader.textContent = newName;

          const syncStateText = document.querySelector('.user-details p');
          if (syncStateText) syncStateText.textContent = `ACCOUNT SYNC: ${syncSelect.value}`;

          const greetingText = document.querySelector('#page-briefing h2');
          if (greetingText) {
            const firstName = words[0];
            greetingText.textContent = `Good Morning ${firstName}`;
          }

          overlay.style.display = 'none';
        }
      });
    }
  }
}

export const app = new AuraApp();
window.addEventListener('DOMContentLoaded', () => app.init());

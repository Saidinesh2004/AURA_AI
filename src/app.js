// AURA Wealth Central Coordinator - Full Integrated Version
import { audio } from './audio.js';
import { visual } from './canvas.js';

class AuraApp {
  constructor() {
    this.activePage = 'hero';

    // Personal Assistant Stats (in Rupees ₹)
    this.stats = {
      saved: 18500, // Monthly saved amount
      fraudBlocked: 0, // Suspicious charges frozen
      futureSurplus: 2450000, // 10-year projected surplus
      leadsCrawled: 42, // Banker Leads count
      qualifiedVolume: 2.4, // Banker qualified volume in Cr
      conversionRate: 87.5
    };

    // AI Suggestions (Action Center Queue)
    this.actionsQueue = [
      { id: 'sip', title: 'Save ₹8,000 More Every Month', category: 'Investment', desc: 'You got a salary bump! We suggest auto-routing 35% of this extra money.', impact: '+₹9.8 Lakhs (10 yrs)', confidence: '96%', icon: 'trending-up' },
      { id: 'sub', title: 'Cancel Unused SaaS Subscriptions', category: 'Savings', desc: 'Identified 3 active subscriptions you haven\'t logged into in 60 days.', impact: '+₹3,400/mo savings', confidence: '99%', icon: 'trash-2' },
      { id: 'insurance', title: 'Switch to Cheaper Health Insurance', category: 'Wealth Protection', desc: 'Found an equivalent term plan matching your parameters with lower premium.', impact: '+₹1,200/mo savings', confidence: '92%', icon: 'shield' },
      { id: 'fd', title: 'Move Surplus Cash to High-Yield FD', category: 'Investment', desc: 'Surplus cash sitting in savings account can yield 8.10% in AURA FD.', impact: '₹8,100 extra return/yr', confidence: '95%', icon: 'landmark' }
    ];

    // AI Memory Matrix tags
    this.memoryTags = [
      "Prefers UPI payments",
      "Invests in ELSS tax savers",
      "FD target duration: 1-3 years",
      "Pre-approved limits preferred",
      "Avoids high card joining fees",
      "Seeks high cash-back on dining"
    ];

    // Operational Telemetry of background agents
    this.agentStates = [
      { id: 'hunter', name: 'Lead Discovery Agent', task: 'Crawling MCA registrar & Indian social intent triggers...', status: 'CRAWLING', speed: 92, mem: '1.4 GB', confidence: 96, typeLog: 'Monitoring MCA new business registrations in Delhi/NCR and Bengaluru...' },
      { id: 'risk', name: 'CIBIL Rating & Verification Agent', task: 'Performing secure soft credit pulls...', status: 'ONLINE', speed: 85, mem: '1.2 GB', confidence: 99, typeLog: 'Awaiting PAN authentication triggers to connect CIBIL portal...' },
      { id: 'compliance', name: 'PAN & KYC Compliance Agent', task: 'Validating PAN format & Aadhaar V-KYC queues...', status: 'MONITORING', speed: 78, mem: '1.0 GB', confidence: 98, typeLog: 'Monitoring regulatory KYC check compliance according to RBI sandbox rules...' },
      { id: 'customizer', name: 'Hyper-Personalization Agent', task: 'Optimizing Rupee (₹) limits & FD rates...', status: 'ONLINE', speed: 89, mem: '1.6 GB', confidence: 95, typeLog: 'Standing by to recalculate personalized cashback tiers and custom FD yield...' }
    ];

    // Banker Discovered Leads (India)
    this.bankerLeads = [
      { id: 'lead1', name: 'Aditya Sharma', location: 'Bengaluru', cibil: 785, intent: 94, product: 'Business Credit Line', status: 'Discovered', checked: true, profile: 'MCA: Registered startup "AuraTech Solutions" 10 days ago.' },
      { id: 'lead2', name: 'Priya Nair', location: 'Mumbai', cibil: 812, intent: 89, product: 'Home Loan', status: 'Pre-Qualified', checked: true, profile: 'Property Portal: Searched for 2BHK flat in Bandra.' },
      { id: 'lead3', name: 'Rohan Gupta', location: 'Delhi NCR', cibil: 720, intent: 78, product: 'Fixed Deposit', status: 'Discovered', checked: false, profile: 'LinkedIn: Updated job title to Director of Product.' },
      { id: 'lead4', name: 'Deepak Kumar', location: 'Hyderabad', cibil: 650, intent: 82, product: 'Personal Loan', status: 'Under Review', checked: false, profile: 'Salary Sync: Frequent debit triggers, seeks consolidation.' }
    ];

    // Conversational Onboarding State
    this.onboardStep = 0;
    this.onboardData = { product: '', name: '', income: '', goal: '' };
  }

  init() {
    this.setupNavigation();
    this.setupSidebarToggle();
    this.setupSoundHooks();
    this.setupTelemetryClock();
    
    // Core Panel Init
    this.setupOnboardingChat();
    this.setupActionCenter();
    this.setupFutureSimulator();
    this.setupMemoryControls();
    this.setupTimelineInteraction();
    this.setupEmergencyControls();
    this.setupProfileControls();
    
    // Initialize Canvas systems
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) visual.initBackground(bgCanvas);
    
    const globeCanvas = document.getElementById('globe-canvas');
    if (globeCanvas) visual.initGlobe(globeCanvas);
    
    visual.tick();

    // Set initial system stats
    this.updateGlobalStats();

    // Setup Agent telemetry logs
    this.setupAgentSimulators();
    this.addBankerConsoleLine('System', 'AURA Agentic Network initialized successfully.');
    this.addBankerConsoleLine('Lead Discovery Agent', 'MCA crawler active in major Indian tech hubs.');
  }

  // --- STYLE & SOUND HOOKUPS ---
  setupSoundHooks() {
    document.body.addEventListener('mouseover', (e) => {
      const target = e.target.closest('button, .nav-item, .chat-option-btn, .btn-action-sm, .scenario-option, .memory-tag');
      if (target) audio.playTick();
    });

    document.body.addEventListener('click', () => {
      audio.resume();
    });
  }

  // --- TELEMETRY IST CLOCK ---
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
      if (timeEl) timeEl.textContent = `${year}-${month}-${day} ${hour}:${minute}:${second} IST`;
    };
    setInterval(updateTime, 1000);
    updateTime();
  }

  // --- ROUTING / NAVIGATIONAL SYSTEM ---
  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetPage = item.getAttribute('data-page');
        this.navigateTo(targetPage);
      });
    });

    // Hero Start Platform Button
    const launchBtn = document.getElementById('btn-launch-ai');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        audio.playSuccess();
        document.body.classList.remove('fullscreen-mode');
        this.navigateTo('onboard');
      });
    }

    // Daily Briefing Continue CTA -> Actions Page
    const briefingBtn = document.getElementById('btn-briefing-continue');
    if (briefingBtn) {
      briefingBtn.addEventListener('click', () => {
        this.navigateTo('action-center');
      });
    }
  }

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

    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav) activeNav.classList.remove('active');

    const targetNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (targetNav) targetNav.classList.add('active');

    this.activePage = pageId;

    // Trigger page renders
    if (pageId === 'agents') this.renderAgents();
    else if (pageId === 'action-center') this.renderActionQueue();
    else if (pageId === 'memory') this.renderMemoryTags();
  }

  // --- CONVERSATIONAL ONBOARDING FLOW ---
  setupOnboardingChat() {
    const sendBtn = document.getElementById('btn-send-message');
    const userInput = document.getElementById('chat-user-input');

    if (sendBtn) sendBtn.addEventListener('click', () => this.handleUserMessageSubmit());
    if (userInput) {
      userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleUserMessageSubmit();
      });
    }
    this.restartOnboardingFlow();
  }

  restartOnboardingFlow() {
    this.onboardStep = 0;
    this.onboardData = { product: '', name: '', income: '', goal: '' };
    
    const chatBody = document.getElementById('onboard-chat-body');
    if (chatBody) chatBody.innerHTML = '';

    const reasoningList = document.getElementById('onboard-reasoning-list');
    if (reasoningList) {
      reasoningList.innerHTML = `
        <div class="reasoning-step">
          <span class="agent">Onboarding Agent:</span>
          <span class="text">Waiting for user to choose a financial product...</span>
        </div>
      `;
    }

    this.updateCardUI('default');

    this.appendAssistantMessage(
      `Namaste! I am AURA, your Agentic Onboarding Specialist. I coordinate with our background verification and credit check systems to qualify you for premium limits and yield options. <br><br>Which financial product would you like to explore today?`,
      ['Premium Credit Card', 'High-Yield Fixed Deposit', 'Home Loan']
    );
  }

  appendAssistantMessage(text, options = []) {
    const chatBody = document.getElementById('onboard-chat-body');
    if (!chatBody) return;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble assistant';
    bubble.innerHTML = `<span class="sender-label">Aura Concierge</span>${text}`;
    chatBody.appendChild(bubble);

    const optionsContainer = document.getElementById('chat-quick-options');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      if (options.length > 0) {
        options.forEach(opt => {
          const btn = document.createElement('button');
          btn.className = 'chat-option-btn';
          btn.textContent = opt;
          btn.addEventListener('click', () => this.handleQuickOptionClick(opt));
          optionsContainer.appendChild(btn);
        });
      }
    }

    chatBody.scrollTop = chatBody.scrollHeight;
    audio.playSelect();
  }

  appendUserMessage(text) {
    const chatBody = document.getElementById('onboard-chat-body');
    if (!chatBody) return;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.innerHTML = `<span class="sender-label">You</span>${text}`;
    chatBody.appendChild(bubble);

    chatBody.scrollTop = chatBody.scrollHeight;
    audio.playTick();
  }

  appendReasoningLog(agentName, text) {
    const list = document.getElementById('onboard-reasoning-list');
    if (!list) return;

    const step = document.createElement('div');
    step.className = 'reasoning-step';
    step.innerHTML = `<span class="agent">${agentName}:</span><span class="text">${text}</span>`;
    list.appendChild(step);
    list.scrollTop = list.scrollHeight;
  }

  handleQuickOptionClick(optionText) {
    this.appendUserMessage(optionText);
    this.processOnboardingStep(optionText);
  }

  handleUserMessageSubmit() {
    const input = document.getElementById('chat-user-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    this.appendUserMessage(text);
    input.value = '';
    
    const optionsContainer = document.getElementById('chat-quick-options');
    if (optionsContainer) optionsContainer.innerHTML = '';

    this.processOnboardingStep(text);
  }

  processOnboardingStep(input) {
    const checkKYCEnabled = document.getElementById('chk-auto-kyc')?.checked !== false;
    const checkCIBILEnabled = document.getElementById('chk-cibil-check')?.checked !== false;
    const checkLiveOffersEnabled = document.getElementById('chk-live-offers')?.checked !== false;

    if (this.onboardStep === 0) {
      this.onboardData.product = input;
      this.onboardStep = 1;
      this.appendReasoningLog('Product Customizer Agent', `Eligibility template selected: "${input}".`);
      
      setTimeout(() => {
        this.appendAssistantMessage(`Perfect! To run a secure eligibility check, could you please tell me your full name (as printed on your PAN card)?`);
      }, 600);

    } else if (this.onboardStep === 1) {
      this.onboardData.name = input;
      this.onboardStep = 2;

      this.appendReasoningLog('PAN & KYC Compliance Agent', `PAN name captured: "${input}". Validating format...`);
      if (checkKYCEnabled) {
        this.appendReasoningLog('PAN & KYC Compliance Agent', `Soft PAN Verification lookup status: OK.`);
      }

      const cardHolder = document.getElementById('card-holder-display');
      if (cardHolder) cardHolder.textContent = input.toUpperCase();

      setTimeout(() => {
        this.appendAssistantMessage(
          `Great to meet you, ${input}! To estimate your credit capacity, what is your approximate monthly net salary?`,
          ['Under ₹50,000', '₹50,000 - ₹1.5 Lakhs', '₹1.5 Lakhs - ₹3 Lakhs', 'Above ₹3 Lakhs']
        );
      }, 700);

    } else if (this.onboardStep === 2) {
      this.onboardData.income = input;
      this.onboardStep = 3;

      let scoreEstimate = 785;
      if (input.includes('Under ₹50,000')) scoreEstimate = 690;
      else if (input.includes('₹50,000 - ₹1.5 Lakhs')) scoreEstimate = 755;
      else if (input.includes('₹1.5 Lakhs - ₹3 Lakhs')) scoreEstimate = 790;
      else if (input.includes('Above ₹3 Lakhs')) scoreEstimate = 825;

      this.onboardData.estimatedCIBIL = scoreEstimate;

      if (checkCIBILEnabled) {
        this.appendReasoningLog('CIBIL Rating Agent', `Initializing soft pull of credit ratings database...`);
        this.appendReasoningLog('CIBIL Rating Agent', `Credit report returned CIBIL Score: ${scoreEstimate} (${scoreEstimate >= 750 ? 'Excellent' : 'Good'} Rating).`);
      } else {
        this.appendReasoningLog('CIBIL Rating Agent', `CIBIL pre-check skipped in settings.`);
      }

      setTimeout(() => {
        this.appendAssistantMessage(
          `Thank you! What is your primary spending category or financial goal? This allows us to optimize your limits.`,
          ['Shopping & UPI Spends', 'Tax Saving & High Yield FDs', 'Property & Home Acquisition', 'Business Growth Capital']
        );
      }, 700);

    } else if (this.onboardStep === 3) {
      this.onboardData.goal = input;
      this.onboardStep = 4;

      this.appendReasoningLog('Hyper-Personalization Agent', `Aggregating variables. Goal matches reward tier: "${input}".`);
      if (checkLiveOffersEnabled) {
        this.appendReasoningLog('Hyper-Personalization Agent', `Adjusting interest rates and merchant cashbacks in Rupees (₹) live.`);
      }

      // Add to banker leads
      const newLead = {
        id: 'lead_' + Date.now(),
        name: this.onboardData.name,
        location: 'Bengaluru (Direct)',
        cibil: this.onboardData.estimatedCIBIL || 785,
        intent: 99,
        product: this.onboardData.product,
        status: 'Pre-Qualified',
        checked: true,
        profile: `Customer Intake: Income bracket ${this.onboardData.income}. Goal: ${this.onboardData.goal}.`
      };
      this.bankerLeads.unshift(newLead);
      this.stats.leadsCrawled += 1;

      let tier = 'silver';
      if (this.onboardData.income.includes('1.5 Lakhs') || this.onboardData.income.includes('3 Lakhs')) tier = 'gold';
      if (this.onboardData.income.includes('Above ₹3 Lakhs')) tier = 'platinum';

      this.updateCardUI(tier, this.onboardData.product);

      let addedVolume = 0.05; // 5L
      if (tier === 'gold') addedVolume = 0.20; // 20L
      if (tier === 'platinum') addedVolume = 0.75; // 75L
      this.stats.qualifiedVolume += (addedVolume / 10);
      this.updateBankerMetricsDisplay();

      this.addBankerConsoleLine('Lead Discovery Agent', `New Qualified Lead: "${newLead.name}" qualified for ${newLead.product}. Volume: ₹${(addedVolume * 10).toFixed(1)} Lakhs.`);

      setTimeout(() => {
        this.appendAssistantMessage(
          `🎉 Pre-qualification successful, ${this.onboardData.name}! <br><br>You qualify for our **AURA ${tier.toUpperCase()}** product tier. Your personalized credit limit/rate has been computed in the preview card.<br><br>Would you like to accept this offer and proceed to KYC?`,
          ['Accept & Begin Video KYC', 'Modify Details', 'Start Over']
        );
        audio.playSuccess();
      }, 1200);

    } else if (this.onboardStep === 4) {
      if (input.includes('Accept')) {
        this.onboardStep = 5;
        this.appendReasoningLog('PAN & KYC Compliance Agent', `Customer accepted pre-approved offer. Routing V-KYC pipeline...`);
        this.appendReasoningLog('PAN & KYC Compliance Agent', `RBI Compliance check synced: Aadhaar verification pending V-KYC confirmation.`);
        
        setTimeout(() => {
          this.appendAssistantMessage(
            `Excellent! Your digital card is active. We have sent a secure link to your registered mobile number.<br><br>Please click it to complete your Aadhaar-based Video KYC (V-KYC) with our agent. Thank you for choosing AURA Wealth!`,
            ['Restart Onboarding']
          );
          audio.playSuccess();
        }, 800);
      } else {
        this.restartOnboardingFlow();
      }
    } else if (this.onboardStep === 5) {
      this.restartOnboardingFlow();
    }
  }

  updateCardUI(tier, product = 'Credit Card') {
    const cardEl = document.getElementById('qualified-card');
    const cardNumberEl = document.getElementById('card-number-display');
    const cardTierEl = document.getElementById('card-tier-display');
    const benefitsTitle = document.getElementById('benefits-title');
    const benefitsList = document.getElementById('benefits-list');

    if (!cardEl) return;

    cardEl.classList.remove('silver', 'gold', 'platinum');

    if (tier === 'default') {
      cardEl.className = 'premium-credit-card silver';
      if (cardNumberEl) cardNumberEl.textContent = 'XXXX XXXX XXXX XXXX';
      if (cardTierEl) cardTierEl.textContent = 'SILVER TIER';
      if (benefitsTitle) benefitsTitle.textContent = 'Select product in chat...';
      if (benefitsList) {
        benefitsList.innerHTML = `<li><i data-lucide="shield-check"></i>Complete chat to get pre-qualification checks.</li>`;
      }
    } else {
      cardEl.classList.add(tier);
      if (cardTierEl) cardTierEl.textContent = `AURA ${tier.toUpperCase()}`;

      let cardNo = '4532 8821 9011 4322';
      if (tier === 'gold') cardNo = '4532 9901 8872 1045';
      if (tier === 'platinum') cardNo = '5012 3045 7781 9922';
      if (cardNumberEl) cardNumberEl.textContent = cardNo;

      if (product.includes('Fixed Deposit')) {
        let fdRate = '7.25% p.a.';
        let benefits = [];
        if (tier === 'silver') {
          fdRate = '7.25% p.a.';
          benefits = [
            'Fixed deposit rate: 7.25% p.a.',
            'Quarterly payout options available',
            'Additional 0.5% for Senior Citizens'
          ];
        } else if (tier === 'gold') {
          fdRate = '7.65% p.a.';
          benefits = [
            'Special rate match: 7.65% p.a.',
            'Flexible lock-in and interest options',
            'Overdraft facility up to 90% of FD value'
          ];
        } else {
          fdRate = '8.10% p.a.';
          benefits = [
            'Premium rate: 8.10% p.a.',
            'Multi-tenure yield optimization',
            'Zero premature withdrawal penalty after 6 mos'
          ];
        }
        if (benefitsTitle) benefitsTitle.textContent = `High-Yield FD: ${fdRate}`;
        if (benefitsList) {
          benefitsList.innerHTML = benefits.map(b => `<li><i data-lucide="shield-check"></i>${b}</li>`).join('');
        }
      } else if (product.includes('Home Loan')) {
        let loanRate = '8.55% p.a.';
        let benefits = [];
        if (tier === 'silver') {
          loanRate = '8.55% p.a.';
          benefits = [
            'Approved loan limit: Up to ₹45 Lakhs',
            'Floating rate: 8.55% p.a.',
            'Low processing fee of 0.25% of loan value'
          ];
        } else if (tier === 'gold') {
          loanRate = '8.40% p.a.';
          benefits = [
            'Approved loan limit: Up to ₹1.5 Crore',
            'Floating rate: 8.40% p.a.',
            'Zero processing fee for women applicants'
          ];
        } else {
          loanRate = '8.25% p.a.';
          benefits = [
            'Approved loan limit: Up to ₹5 Crore',
            'Floating rate: 8.25% p.a.',
            'Zero processing fee & fast track 24hr sanction'
          ];
        }
        if (benefitsTitle) benefitsTitle.textContent = `Home Loan Approved: ${loanRate}`;
        if (benefitsList) {
          benefitsList.innerHTML = benefits.map(b => `<li><i data-lucide="shield-check"></i>${b}</li>`).join('');
        }
      } else {
        // Credit Card
        let limitVal = '₹1.5 Lakhs';
        let benefits = [];
        if (tier === 'silver') {
          limitVal = '₹1.5 Lakhs';
          benefits = [
            'Approved Limit: ₹1.5 Lakhs',
            '1.5% cashback on UPI transactions',
            'Zero joining fee & wallet insurance'
          ];
        } else if (tier === 'gold') {
          limitVal = '₹5 Lakhs';
          benefits = [
            'Approved Limit: ₹5 Lakhs',
            '3% cashback on Amazon & Flipkart spends',
            '1 complimentary domestic lounge visit per quarter'
          ];
        } else {
          limitVal = '₹15 Lakhs';
          benefits = [
            'Approved Limit: ₹15 Lakhs',
            '5% cashback on Travel & Merchant Dining',
            'Unlimited domestic & international lounge access'
          ];
        }
        if (benefitsTitle) benefitsTitle.textContent = `Credit Card Limit: ${limitVal}`;
        if (benefitsList) {
          benefitsList.innerHTML = benefits.map(b => `<li><i data-lucide="shield-check"></i>${b}</li>`).join('');
        }
      }
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }



  addBankerConsoleLine(agentName, message, type = 'normal') {
    const logsEl = document.getElementById('banker-console-logs');
    if (!logsEl) return;

    const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
    let msgClass = '';
    if (type === 'success') msgClass = 'success';
    if (type === 'alert') msgClass = 'alert';

    const logLine = document.createElement('div');
    logLine.className = 'console-line';
    logLine.innerHTML = `
      <span class="console-time">[${time}]</span>
      <span class="console-agent">${agentName}:</span>
      <span class="console-msg ${msgClass}">${message}</span>
    `;

    logsEl.appendChild(logLine);
    logsEl.scrollTop = logsEl.scrollHeight;

    while (logsEl.children.length > 50) {
      logsEl.removeChild(logsEl.firstChild);
    }
  }

  // --- SUGGESTIONS (ACTION CENTER) ---
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
          <h3>All Suggestions Approved</h3>
          <p style="color: #64748b; font-size: 13px; margin-top: 8px;">The AURA Agent Network has synchronized all savings and investment recommendations.</p>
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
        const item = this.actionsQueue.find(x => x.id === id);
        if (item) {
          // Add to monthly savings
          let val = 1200;
          if (id === 'sip') val = 8000;
          else if (id === 'sub') val = 3400;
          else if (id === 'fd') val = 675; // 8100/12
          this.stats.saved += val;
          this.stats.futureSurplus += val * 120;
          this.updateGlobalStats();
        }
        this.actionsQueue = this.actionsQueue.filter(item => item.id !== id);
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
    const newAmount = prompt("Enter modified monthly amount (e.g. ₹5,000):", "₹5,000");
    if (newAmount) {
      const item = this.actionsQueue.find(x => x.id === id);
      if (item) {
        item.title = item.title.replace(/₹\d+[\,\d+]*/, newAmount);
        item.desc = `User adjusted baseline recommendations. Custom allocation set to ${newAmount}/mo.`;
        this.renderActionQueue();
      }
    }
  }

  updateGlobalStats() {
    const briefSaved = document.getElementById('briefing-saved-counter');
    if (briefSaved) briefSaved.textContent = `₹${this.stats.saved.toLocaleString('en-IN')}`;
  }

  // --- SAVINGS SIMULATOR ---
  setupFutureSimulator() {
    const scenarioOpts = document.querySelectorAll('.scenario-option');
    const downSlider = document.getElementById('slider-down-payment');
    const monthlySlider = document.getElementById('slider-monthly-add');

    const updateCalculations = () => {
      const activeScenario = document.querySelector('.scenario-option.active').getAttribute('data-scenario');
      const downVal = parseInt(downSlider.value);
      const monthlyVal = parseInt(monthlySlider.value);

      document.getElementById('val-slider-down').textContent = `₹${downVal.toLocaleString('en-IN')}`;
      document.getElementById('val-slider-monthly').textContent = `₹${monthlyVal.toLocaleString('en-IN')}`;

      let multiplier = 1.0;
      if (activeScenario === 'car') multiplier = 0.85;
      if (activeScenario === 'house') multiplier = 1.4;
      if (activeScenario === 'marriage') multiplier = 0.95;
      if (activeScenario === 'tour') multiplier = 0.75;

      const baseVal = downVal + monthlyVal * 120;
      const netA = baseVal * 1.05 * multiplier;
      const netB = baseVal * 1.35 * multiplier;
      const netC = baseVal * 1.65 * multiplier;

      document.getElementById('stat-a-net').textContent = `₹${Math.round(netA).toLocaleString('en-IN')}`;
      document.getElementById('stat-b-net').textContent = `₹${Math.round(netB).toLocaleString('en-IN')}`;
      document.getElementById('stat-c-net').textContent = `₹${Math.round(netC).toLocaleString('en-IN')}`;

      const pathA = document.getElementById('chart-path-a');
      const pathB = document.getElementById('chart-path-b');
      const pathC = document.getElementById('chart-path-c');

      const flexH = Math.min(180, Math.max(30, 180 - (monthlyVal / 600)));
      const flexD = Math.min(150, Math.max(20, 160 - (downVal / 20000)));

      if (pathA) pathA.setAttribute('d', `M 0 180 Q 125 ${flexH + 20} 250 ${flexH} T 500 ${flexD + 35}`);
      if (pathB) pathB.setAttribute('d', `M 0 180 Q 125 ${flexH - 10} 250 ${flexH - 30} T 500 ${flexD}`);
      if (pathC) pathC.setAttribute('d', `M 0 180 Q 125 ${flexH - 30} 250 ${flexH - 60} T 500 ${flexD - 35}`);
    };

    scenarioOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        audio.playSelect();
        document.querySelector('.scenario-option.active').classList.remove('active');
        opt.classList.add('active');
        updateCalculations();
      });
    });

    if (downSlider) downSlider.addEventListener('input', updateCalculations);
    if (monthlySlider) monthlySlider.addEventListener('input', updateCalculations);

    updateCalculations();
  }

  // --- AI MEMORY PREFERENCES ---
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
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        audio.playAlert();
        this.memoryTags.splice(idx, 1);
        this.renderMemoryTags();
      });
    });

    lucide.createIcons();
  }

  // --- ACCORDION TIMELINE MAP ---
  setupTimelineInteraction() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      item.addEventListener('click', () => {
        audio.playSelect();
        const isAlreadyExpanded = item.classList.contains('expanded');
        timelineItems.forEach(el => el.classList.remove('expanded'));
        if (!isAlreadyExpanded) {
          item.classList.add('expanded');
        }
      });
    });
  }

  // --- SECURITY EMERGENCY OVERLAY ---
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
        alert("SECURITY FREEZE TRIGGERED: AI HAS SUSPENDED CREDIT CARDS & UPI CHANNELS. AUTHENTICATE IN-PERSON TO RE-ENABLE.");
        this.stats.fraudBlocked++;
        this.addBankerConsoleLine('Security Guard AI', 'FRAUD PREVENTED: Account cards and sync links frozen.', 'alert');
        overlay.classList.remove('active');
      });
    }

    if (authBtn) authBtn.addEventListener('click', closeOverlay);
    if (bypassBtn) bypassBtn.addEventListener('click', closeOverlay);
  }

  // --- USER PROFILE CONFIGURE MODAL ---
  setupProfileControls() {
    const userPanel = document.getElementById('btn-user-panel');
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

          // Briefing Greeting update
          const greetingText = document.getElementById('briefing-user-greeting');
          if (greetingText) greetingText.textContent = `Namaste ${words[0]}`;

          overlay.style.display = 'none';
        }
      });
    }
  }

  // --- AGENT TELEMETRY SYSTEM FLUTTER ---
  setupAgentSimulators() {
    this.renderBankerAgentsList();

    setInterval(() => {
      this.agentStates.forEach(agent => {
        agent.speed = Math.min(100, Math.max(50, agent.speed + Math.floor(Math.random() * 11) - 5));
        agent.confidence = Math.min(99, Math.max(90, agent.confidence + (Math.random() > 0.5 ? 1 : -1)));

        const actionPools = {
          hunter: [
            "Crawling MCA filings in Delhi NCR...",
            "Searching Twitter for keywords: 'home loan Mumbai'...",
            "Crawling startup registries in Bangalore...",
            "Discovered new intent signal from GSTIN registry update."
          ],
          risk: [
            "Awaiting credit pull triggers...",
            "Querying CIBIL soft credit pre-check scores...",
            "Updating default risk probability maps...",
            "Validating debt-to-income limits."
          ],
          compliance: [
            "Verifying PAN format and Aadhaar verification queues...",
            "Monitoring RBI sandbox regulation updates...",
            "Validating KYC digital signature verification...",
            "Syncing Secure KYC Routine: OK."
          ],
          customizer: [
            "Awaiting client intake data...",
            "Optimizing FD rate tiers against current RBI repo rate...",
            "Personalizing cashback limit schedules...",
            "Recalculating Home Loan interest rates."
          ]
        };

        const pool = actionPools[agent.id] || ["Processing background operations..."];
        const oldLog = agent.typeLog;
        agent.typeLog = pool[Math.floor(Math.random() * pool.length)];

        if (Math.random() > 0.6 && agent.typeLog !== oldLog) {
          this.addBankerConsoleLine(agent.name, agent.typeLog, Math.random() > 0.85 ? 'success' : 'normal');
        }
      });

      this.renderAgents();
      this.renderBankerAgentsList();
    }, 4000);
  }

  renderBankerAgentsList() {
    const listEl = document.getElementById('banker-agents-list');
    if (!listEl) return;

    listEl.innerHTML = this.agentStates.map(agent => `
      <div class="agent-mini-card">
        <div class="agent-mini-info">
          <i data-lucide="cpu" style="width: 14px; height: 14px;"></i>
          <div>
            <div class="agent-mini-name">${agent.name}</div>
            <div class="agent-mini-status">${agent.task.substring(0, 36)}...</div>
          </div>
        </div>
        <span class="agent-mini-badge badge-working">ACTIVE</span>
      </div>
    `).join('');

    lucide.createIcons();
  }

  renderAgents() {
    const grid = document.getElementById('agents-grid');
    if (!grid || this.activePage !== 'agents') return;

    grid.innerHTML = this.agentStates.map(agent => `
      <div class="glass-card agent-node-card">
        <div class="agent-header">
          <div class="agent-identity">
            <span class="agent-dot-glow working"></span>
            <h3>${agent.name}</h3>
          </div>
          <span class="agent-status-badge badge-working">${agent.status}</span>
        </div>
        <div class="agent-card-body">
          <p style="margin-bottom: 8px;"><strong>Active Task:</strong> ${agent.task}</p>
          <div class="agent-thinking-log" style="border-left-color: var(--emerald-glow);">
            &gt; ${agent.typeLog}
          </div>
        </div>
        <div class="agent-telemetry">
          <div class="telemetry-item">
            <label>CPU Utilization</label>
            <span>${agent.speed}%</span>
            <div class="telemetry-progress-track">
              <div class="telemetry-progress-fill" style="width: ${agent.speed}%; background: linear-gradient(90deg, var(--emerald-glow), var(--gold-glow));"></div>
            </div>
          </div>
          <div class="telemetry-item">
            <label>Confidence Score</label>
            <span>${agent.confidence}%</span>
            <div class="telemetry-progress-track">
              <div class="telemetry-progress-fill" style="width: ${agent.confidence}%; background: var(--emerald-glow)"></div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
}

export const app = new AuraApp();
window.addEventListener('DOMContentLoaded', () => app.init());

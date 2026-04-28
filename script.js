/* ============================================================
   NEXUS — script.js — by Saurav
   Ultra-futuristic cyberpunk premium portfolio
   ============================================================ */

'use strict';

// ============================================================
// PRELOADER
// ============================================================
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const preFill   = document.getElementById('preFill');
  const preText   = document.getElementById('preText');

  const messages = [
    'INITIALIZING SYSTEM...',
    'LOADING NEXUS CORE...',
    'CONNECTING MODULES...',
    'CALIBRATING INTERFACE...',
    'SYSTEM READY.'
  ];

  let progress = 0;
  let msgIndex = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress > 100) progress = 100;
    preFill.style.width = progress + '%';

    // Update message
    const msgThreshold = (msgIndex + 1) * 20;
    if (progress >= msgThreshold && msgIndex < messages.length - 1) {
      msgIndex++;
      preText.textContent = messages[msgIndex];
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('hidden');
        // Trigger hero animations
        document.body.style.overflow = '';
        animateHeroEntry();
      }, 400);
    }
  }, 60);

  document.body.style.overflow = 'hidden';
})();

function animateHeroEntry() {
  // Hero content is already CSS-animated via animation-delay
}

// ============================================================
// DYNAMIC TAGLINE (Time-Based)
// ============================================================
(function setTagline() {
  const hour = new Date().getHours();
  const el   = document.getElementById('heroTagline');
  if (!el) return;

  let taglines;
  if (hour >= 5 && hour < 12) {
    taglines = ['> Start Building Your Future_', '> Rise. Code. Conquer._', '> New Day. New Skills._'];
  } else if (hour >= 12 && hour < 17) {
    taglines = ['> Keep Pushing Your Limits_', '> Execute. Iterate. Grow._', '> Afternoon Grind Mode ON_'];
  } else if (hour >= 17 && hour < 21) {
    taglines = ['> Ship Something Today_', '> Code Into the Sunset_', '> Evening: The Builder\'s Hour_'];
  } else {
    taglines = ['> Hack the System. Build Skills._', '> Night Owls Build Empires._', '> Dark Mode. Dark Hours. Ship Code._'];
  }

  let tagIdx = 0;
  function typeTagline(text) {
    let i = 0;
    el.textContent = '';
    const typing = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) {
        clearInterval(typing);
        setTimeout(() => {
          eraseLine(text);
        }, 2600);
      }
    }, 60);
  }

  function eraseLine(text) {
    let i = text.length;
    const erasing = setInterval(() => {
      el.textContent = text.slice(0, --i);
      if (i <= 0) {
        clearInterval(erasing);
        tagIdx = (tagIdx + 1) % taglines.length;
        setTimeout(() => typeTagline(taglines[tagIdx]), 400);
      }
    }, 30);
  }

  setTimeout(() => typeTagline(taglines[0]), 1800);
})();

// ============================================================
// CUSTOM CURSOR
// ============================================================
(function initCursor() {
  const dot   = document.getElementById('cursorDot');
  const ring  = document.getElementById('cursorRing');
  const trail = document.getElementById('cursorTrail');
  if (!dot || !ring) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  let lastTrail = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    const now = Date.now();
    if (now - lastTrail > 40) {
      lastTrail = now;
      const t = document.createElement('div');
      t.className = 'trail-dot';
      t.style.left = mx + 'px';
      t.style.top  = my + 'px';
      trail.appendChild(t);
      setTimeout(() => t.remove(), 600);
    }
  });

  // Smooth ring follow
  function followRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(followRing);
  }
  followRing();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .btn, .service-card, .project-card, .tag, kbd, .contact-link, .coming-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

// ============================================================
// NAVBAR — scroll + mobile
// ============================================================
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const ham      = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  });

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      ham.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === current) link.classList.add('active');
  });
}

// ============================================================
// PARTICLE CANVAS — Hero Background
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: 0, y: 0 };
  const PARTICLE_COUNT = window.innerWidth < 768 ? 50 : 100;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.15;
      this.color = Math.random() > 0.5 ? '0,240,255' : '122,92,255';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Mouse repel
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        this.x += dx / dist * 1.5;
        this.y += dy / dist * 1.5;
      }
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,240,255,${(1 - d/120) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(loop);
  }
  loop();
})();

// ============================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Trigger skill circles when skills section visible
        if (e.target.closest('#skills') || e.target.classList.contains('skill-item')) {
          setTimeout(animateSkills, 300);
        }
        // Trigger coming soon progress bars
        if (e.target.classList.contains('coming-card')) {
          e.target.classList.add('visible');
        }
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => obs.observe(el));
})();

// ============================================================
// SKILL CIRCLES — SVG animation
// ============================================================
let skillsAnimated = false;
function animateSkills() {
  if (skillsAnimated) return;

  // Inject SVG gradient
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = 'position:absolute;width:0;height:0';
  svg.innerHTML = `<defs>
    <linearGradient id="skillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7A5CFF"/>
      <stop offset="100%" stop-color="#00F0FF"/>
    </linearGradient>
  </defs>`;
  document.body.prepend(svg);

  const circles = document.querySelectorAll('.skill-circle');
  circles.forEach(circle => {
    const pct    = parseInt(circle.getAttribute('data-pct'));
    const fill   = circle.querySelector('.fill');
    const pctEl  = circle.querySelector('.skill-pct');
    const circum = 2 * Math.PI * 52; // r=52
    const offset = circum - (pct / 100) * circum;

    setTimeout(() => {
      fill.style.strokeDashoffset = offset;
      // Animate number
      let current = 0;
      const step = pct / 60;
      const counter = setInterval(() => {
        current += step;
        if (current >= pct) { current = pct; clearInterval(counter); }
        pctEl.textContent = Math.round(current) + '%';
      }, 25);
    }, 200);
  });

  skillsAnimated = true;
}

// Also trigger via IntersectionObserver on #skills section
(function observeSkills() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) animateSkills(); });
  }, { threshold: 0.2 });
  obs.observe(skillsSection);
})();

// ============================================================
// HERO PARALLAX (mouse)
// ============================================================
(function initParallax() {
  const heroContent = document.getElementById('heroContent');
  if (!heroContent) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    heroContent.style.transform = `translate(${dx * 8}px, ${dy * 6}px)`;
  });
})();

// ============================================================
// MAGNETIC BUTTONS
// ============================================================
(function initMagnetic() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.25;
      const dy   = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

// ============================================================
// CARD TILT EFFECT
// ============================================================
(function initTilt() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const cx   = rect.width  / 2;
      const cy   = rect.height / 2;
      const rx   = (y - cy) / cy * -8;
      const ry   = (x - cx) / cx *  8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ============================================================
// TERMINAL
// ============================================================
(function initTerminal() {
  const body   = document.getElementById('terminalBody');
  const input  = document.getElementById('terminalInput');
  if (!body || !input) return;

  const DB = {
    about: [
      { text: '╔══════════════════════════════╗', type: 'highlight' },
      { text: '║      NEXUS // ABOUT          ║', type: 'highlight' },
      { text: '╚══════════════════════════════╝', type: 'highlight' },
      { text: 'Name    : Saurav' },
      { text: 'Role    : Tech Educator & Ethical Hacker' },
      { text: 'Vision  : Make tech education accessible for all' },
      { text: 'Based   : India 🇮🇳' },
      { text: 'Mission : Build skills. Build futures. Build NEXUS.' },
    ],
    services: [
      { text: '┌─ NEXUS SERVICES ────────────────────────', type: 'highlight' },
      { text: '│ [01] Computer Classes         — Beginner to Advanced' },
      { text: '│ [02] Ethical Hacking Training — Cybersecurity Mastery' },
      { text: '│ [03] Skill Development        — Freelancing & Branding' },
      { text: '│ [04] Web Development          — Build Real Projects' },
      { text: '└─────────────────────────────────────────', type: 'highlight' },
    ],
    contact: [
      { text: '──── CONTACT NEXUS ────', type: 'highlight' },
      { text: '📧 Email     : sauravsimariya4321@gmail.com' },
      { text: '📸 Instagram : @indian_zord' },
      { text: '🌐 Website   : nexus.by.saurav' },
      { text: '🟢 Status    : Available for Projects', type: 'success' },
    ],
    help: [
      { text: 'NEXUS COMMAND INTERFACE v2.0', type: 'highlight' },
      { text: '────────────────────────────' },
      { text: '  about    →  info about Saurav & NEXUS' },
      { text: '  services →  list all services' },
      { text: '  contact  →  display contact details' },
      { text: '  skills   →  show skill breakdown' },
      { text: '  status   →  check system status' },
      { text: '  clear    →  clear terminal' },
      { text: '  hack     →  🤫 secret' },
      { text: '────────────────────────────' },
    ],
    skills: [
      { text: '── SKILL MATRIX ──────────────────────────', type: 'highlight' },
      { text: '  Web Development    ▓▓▓▓▓▓▓▓▓░  88%' },
      { text: '  Ethical Hacking    ▓▓▓▓▓▓▓▓░░  82%' },
      { text: '  Teaching           ▓▓▓▓▓▓▓▓▓░  90%' },
      { text: '  Branding           ▓▓▓▓▓▓▓▓░░  78%' },
      { text: '  Freelancing        ▓▓▓▓▓▓▓▓▓░  85%' },
      { text: '──────────────────────────────────────────', type: 'highlight' },
    ],
    status: [
      { text: '● NEXUS SYSTEM STATUS', type: 'success' },
      { text: '  [✔] Core Online', type: 'success' },
      { text: '  [✔] Services: Active' },
      { text: '  [✔] Founder: Saurav (Available)' },
      { text: '  [~] Computer Classes: 75% Ready', type: 'highlight' },
      { text: '  [~] Hacking Course: 55% Ready', type: 'highlight' },
    ],
    hack: [
      { text: '⚠  INITIATING BREACH PROTOCOL...', type: 'error' },
      { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%', type: 'error' },
      { text: 'ACCESS GRANTED. Welcome, operative. 🎯', type: 'success' },
      { text: '"Knowledge is the most powerful exploit." — Saurav', type: 'highlight' },
    ],
  };

  function addLine(text, type = '') {
    const line = document.createElement('div');
    line.className = 't-line t-output' + (type ? ' ' + type : '');
    line.textContent = text;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  function addPromptLine(cmd) {
    const line = document.createElement('div');
    line.className = 't-line';
    line.innerHTML = `<span class="t-prompt">nexus@system:~$</span> <span class="t-cmd">${cmd}</span>`;
    body.appendChild(line);
  }

  async function typeLines(lines) {
    for (const l of lines) {
      await new Promise(res => setTimeout(res, 60));
      addLine(l.text, l.type || '');
    }
    body.scrollTop = body.scrollHeight;
  }

  input.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;
    const cmd = input.value.trim().toLowerCase();
    if (!cmd) return;
    input.value = '';

    addPromptLine(cmd);

    if (cmd === 'clear') {
      body.innerHTML = '';
      return;
    }

    const data = DB[cmd];
    if (data) {
      await typeLines(data);
    } else {
      addLine(`Command not found: "${cmd}". Type 'help' for commands.`, 'error');
    }
    body.scrollTop = body.scrollHeight;
  });
})();

// ============================================================
// CONTACT FORM
// ============================================================
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate
    const name    = document.getElementById('fname').value.trim();
    const email   = document.getElementById('femail').value.trim();
    const interest= document.getElementById('finterest').value;
    const message = document.getElementById('fmessage').value.trim();

    if (!name || !email || !interest || !message) return;

    // Animate button
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Sending...';

    setTimeout(() => {
      btn.style.display = 'none';
      success.style.display = 'block';
      form.reset();
      setTimeout(() => {
        success.style.display = 'none';
        btn.style.display = '';
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = 'Send Message';
      }, 5000);
    }, 1500);
  });
})();

// ============================================================
// CHAT WIDGET
// ============================================================
(function initChat() {
  const toggle   = document.getElementById('chatToggle');
  const box      = document.getElementById('chatBox');
  const closeBtn = document.getElementById('chatClose');
  const messages = document.getElementById('chatMessages');
  const input    = document.getElementById('chatInput');
  const send     = document.getElementById('chatSend');
  if (!toggle) return;

  let isOpen = false;

  const RESPONSES = [
    "Sure! I'd love to help. What are you interested in? 🚀",
    "Sounds great! Reach me at sauravsimariya4321@gmail.com",
    "Ethical Hacking courses are coming soon! Stay tuned 🔐",
    "Computer Classes are launching shortly. Drop a message!",
    "Freelancing guidance is part of our Skill Dev program 🌟",
    "You can also DM me on Instagram @indian_zord 📸",
    "NEXUS is all about empowering you with real tech skills 💻",
  ];
  let rIdx = 0;

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      box.style.display = 'flex';
      requestAnimationFrame(() => box.classList.add('open'));
    } else {
      box.classList.remove('open');
      setTimeout(() => { box.style.display = 'none'; }, 300);
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    box.classList.remove('open');
    setTimeout(() => { box.style.display = 'none'; }, 300);
  });

  function appendMsg(text, type) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg ' + type;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    appendMsg(text, 'user');
    input.value = '';

    setTimeout(() => {
      appendMsg(RESPONSES[rIdx % RESPONSES.length], 'bot');
      rIdx++;
    }, 800);
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
})();

// ============================================================
// BUTTON RIPPLE
// ============================================================
(function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const r = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      r.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(255,255,255,0.25);
        border-radius:50%;
        transform:scale(0);
        animation:rippleAnim 0.5s ease-out forwards;
        pointer-events:none;
      `;
      // Inject keyframes if not already
      if (!document.getElementById('rippleStyle')) {
        const s = document.createElement('style');
        s.id = 'rippleStyle';
        s.textContent = `@keyframes rippleAnim {
          to { transform: scale(2.5); opacity: 0; }
        }`;
        document.head.appendChild(s);
      }
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });
})();

// ============================================================
// STATUS BAR — duplicate for seamless marquee
// ============================================================
(function initStatusMarquee() {
  const inner = document.querySelector('.status-inner');
  if (!inner) return;
  // Clone for seamless loop
  const clone = inner.cloneNode(true);
  inner.parentElement.appendChild(clone);
})();

// ============================================================
// SMOOTH SCROLL for anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

// ============================================================
// PAGE VISIBILITY — pause heavy animations when hidden
// ============================================================
document.addEventListener('visibilitychange', () => {
  // Canvas loop already uses rAF, which pauses automatically
});

// ============================================================
// INIT — ensure scrolled state on load
// ============================================================
window.addEventListener('load', () => {
  updateActiveNav();
  if (window.scrollY > 60) {
    document.getElementById('navbar')?.classList.add('scrolled');
  }
});

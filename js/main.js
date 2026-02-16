/* ==========================================
   MochaLulu — Interactive JS
   ========================================== */

// Prevent browser from restoring scroll position on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  initBootSequence();
  initThemeToggle();
  initLocalTime();
  initScrollReveal();
  initFloatingNav();
  initStartMenu();
  initFAQ();
  initContactForm();
  initSmoothScroll();
  initParallaxShapes();
  initTypingEffect();
  initSmoothSectionTransitions();
});

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  // Add .reveal to animatable elements
  const selectors = [
    '.about-grid',
    '.link-card',
    '.work-card',
    '.faq-item',
    '.contact-wrapper',
    '.section-title'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ---------- OS Taskbar ---------- */
function initFloatingNav() {
  const taskbar = document.getElementById('taskbar');
  const sections = document.querySelectorAll('section[id]');
  const apps = taskbar.querySelectorAll('.taskbar-app');
  const clockEl = document.getElementById('taskbarClock');

  const heroHeight = document.getElementById('home').offsetHeight;

  // Show/hide taskbar on scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > heroHeight * 0.4) {
      taskbar.classList.add('visible');
    } else {
      taskbar.classList.remove('visible');
    }

    // Hide scroll hint after scrolling
    const scrollHint = document.querySelector('.scroll-hint');
    if (scrollHint) {
      scrollHint.style.opacity = scrollY > 80 ? '0' : '';
      scrollHint.style.pointerEvents = scrollY > 80 ? 'none' : '';
    }

    // Active section detection
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) {
        current = section.id;
      }
    });

    apps.forEach(app => {
      app.classList.remove('active');
      if (app.dataset.section === current) {
        app.classList.add('active');
      }
    });
  });

  // Taskbar clock (Kuala Lumpur time)
  function updateTaskbarClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kuala_Lumpur',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const dateStr = now.toLocaleDateString('en-US', {
      timeZone: 'Asia/Kuala_Lumpur',
      month: 'short',
      day: 'numeric'
    });
    clockEl.textContent = `${timeStr}  ${dateStr}`;
  }
  updateTaskbarClock();
  setInterval(updateTaskbarClock, 30000);
}

/* ---------- FAQ Accordion ---------- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => i.classList.remove('open'));

      // Open clicked (if it wasn't already open)
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Animate button
    const btn = form.querySelector('.btn-submit');
    btn.textContent = 'sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Trigger error popup after fake loading
    setTimeout(() => {
      btn.innerHTML = '<span>send message</span><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
      btn.disabled = false;
      btn.style.opacity = '1';
      showError404('Contact Form');
    }, 1500);
  });
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ---------- Parallax Background Shapes ---------- */
function initParallaxShapes() {
  const shapes = document.querySelectorAll('.shape');
  
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 8;
      const rotateSpeed = (i + 1) * 2;
      shape.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${x * rotateSpeed}deg)`;
    });
  });
}

/* ---------- Typing Effect for Role ---------- */
function initTypingEffect() {
  const roleEl = document.querySelector('.hero-role');
  if (!roleEl) return;

  const text = roleEl.textContent;
  roleEl.textContent = '';
  roleEl.style.borderRight = '2px solid var(--primary-light)';

  let i = 0;
  const typeInterval = setInterval(() => {
    roleEl.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(typeInterval);
      // Blink cursor then remove
      setTimeout(() => {
        roleEl.style.borderRight = 'none';
      }, 2000);
    }
  }, 80);
}

/* ---------- Error 404 Popup ---------- */
function showError404(socialName) {
  const overlay = document.getElementById('errorOverlay');
  const win = document.getElementById('errorWindow');
  const detail = document.getElementById('errorDetail');

  detail.textContent = `Cannot resolve "${socialName}" — this social link does not exist or has not been configured.`;

  overlay.classList.add('visible');
  win.classList.add('visible');

  // Play a subtle audio beep (system error sound feel)
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 440;
    osc.type = 'square';
    gain.gain.value = 0.08;
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) { /* silent fail */ }
}

function closeError404(event) {
  // If called from overlay click, only close if clicking the overlay itself
  if (event && event.target && event.target.id !== 'errorOverlay') return;

  const overlay = document.getElementById('errorOverlay');
  const win = document.getElementById('errorWindow');

  overlay.classList.remove('visible');
  win.classList.remove('visible');
}

function shakeErrorWindow() {
  const win = document.getElementById('errorWindow');
  win.classList.remove('shake');
  // Force reflow to restart animation
  void win.offsetWidth;
  win.classList.add('shake');
}

function retryError() {
  shakeErrorWindow();
  // Change the detail text for fun
  const detail = document.getElementById('errorDetail');
  const messages = [
    'Nice try! Still NULL though.',
    'ERROR: Social media not found. Have you tried turning it off and on again?',
    'Connection refused. MochaLulu is too busy petting cats.',
    'FATAL: Social link returned undefined. This is expected behavior.',
    'Retry attempt failed. Maybe try again in 404 years?',
    'ACCESS DENIED. The social media hamster is on break.',
    'Error persists. Consider bribing MochaLulu with coffee.',
    'Link.exe has stopped responding. Blame the firewall.',
  ];
  detail.textContent = messages[Math.floor(Math.random() * messages.length)];
}

/* ---------- OS Boot Sequence ---------- */
function initBootSequence() {
  // Skip boot if returning visitor (session)
  if (sessionStorage.getItem('booted')) {
    const bootScreen = document.getElementById('bootScreen');
    if (bootScreen) bootScreen.classList.add('done');
    return;
  }

  document.body.classList.add('boot-active');

  const lines = [
    { text: 'BIOS v4.04 — MochaLulu Systems Inc.', delay: 0, color: '#a29bfe' },
    { text: 'Checking hardware... OK', delay: 500, color: '#00b894' },
    { text: 'Loading kernel: mochalulu_os_x64.bin', delay: 900, color: '#dfe6e9' },
    { text: 'Initializing cat_meme_driver.sys......... OK', delay: 1400, color: '#00b894' },
    { text: 'Mounting /dev/coffee ............... OK', delay: 1900, color: '#00b894' },
    { text: 'Starting sysadmin_services.d', delay: 2500, color: '#dfe6e9' },
    { text: '  → nginx.service          [ACTIVE]', delay: 2900, color: '#00b894' },
    { text: '  → docker.service         [ACTIVE]', delay: 3200, color: '#00b894' },
    { text: '  → ssh.service            [ACTIVE]', delay: 3500, color: '#00b894' },
    { text: '  → firewall.service       [ACTIVE]', delay: 3800, color: '#fdcb6e' },
    { text: 'Loading user profile: MochaLulu', delay: 4300, color: '#a29bfe' },
    { text: 'Welcome back, Ahmad Asyraf! ☕', delay: 4800, color: '#6c5ce7' },
    { text: '', delay: 5200 },
    { text: 'System ready. Launching desktop...', delay: 5500, color: '#00b894' },
  ];

  const container = document.getElementById('bootLines');
  const progressFill = document.getElementById('bootProgressFill');
  const bootScreen = document.getElementById('bootScreen');
  const totalDuration = 6200;

  lines.forEach(({ text, delay, color }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.textContent = text;
      if (color) line.style.color = color;
      container.appendChild(line);
      container.scrollTop = container.scrollHeight;
      // Update progress bar
      const progress = Math.min((delay / totalDuration) * 100, 100);
      progressFill.style.width = progress + '%';
    }, delay);
  });

  setTimeout(() => {
    progressFill.style.width = '100%';
  }, totalDuration - 400);

  setTimeout(() => {
    bootScreen.classList.add('done');
    document.body.classList.remove('boot-active');
    sessionStorage.setItem('booted', 'true');
  }, totalDuration);
}

/* ---------- Theme Toggle ---------- */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');

  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';

    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem('theme', next);

    // Fun click feedback
    toggle.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => {
      toggle.style.transform = '';
    }, 400);
  });
}

/* ---------- Local Time Display ---------- */
function initLocalTime() {
  const timeEl = document.getElementById('localTime');
  if (!timeEl) return;

  function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kuala_Lumpur',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    timeEl.textContent = `${timeStr} — Kuala Lumpur`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ---------- Smooth Section Transitions ---------- */
function initSmoothSectionTransitions() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
  );

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
  });
}

/* ---------- Start Menu ---------- */
const pageLoadTime = Date.now();

function initStartMenu() {
  const menu = document.getElementById('startMenu');
  const btn = document.getElementById('startBtn');

  // Detect visitor OS
  const osEl = document.getElementById('smOS');
  const ua = navigator.userAgent;
  if (/Windows/.test(ua)) osEl.textContent = 'Windows';
  else if (/Mac/.test(ua)) osEl.textContent = 'macOS';
  else if (/Linux/.test(ua)) osEl.textContent = 'Linux';
  else if (/Android/.test(ua)) osEl.textContent = 'Android';
  else if (/iPhone|iPad/.test(ua)) osEl.textContent = 'iOS';
  else osEl.textContent = 'Unknown';

  // Detect browser
  const brEl = document.getElementById('smBrowser');
  if (/Edg\//.test(ua)) brEl.textContent = 'Edge';
  else if (/Chrome/.test(ua)) brEl.textContent = 'Chrome';
  else if (/Firefox/.test(ua)) brEl.textContent = 'Firefox';
  else if (/Safari/.test(ua)) brEl.textContent = 'Safari';
  else brEl.textContent = 'Other';

  // Uptime counter
  function updateUptime() {
    const diff = Math.floor((Date.now() - pageLoadTime) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    let str = '';
    if (h > 0) str += h + 'h ';
    if (m > 0 || h > 0) str += m + 'm ';
    str += s + 's';
    document.getElementById('smUptime').textContent = str;
  }
  setInterval(updateUptime, 1000);

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) {
      closeStartMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeStartMenu();
    }
  });
}

function toggleStartMenu() {
  const menu = document.getElementById('startMenu');
  const btn = document.getElementById('startBtn');
  menu.classList.toggle('open');
  btn.classList.toggle('active');
}

function closeStartMenu() {
  const menu = document.getElementById('startMenu');
  const btn = document.getElementById('startBtn');
  menu.classList.remove('open');
  btn.classList.remove('active');
}

function startMenuShutdown() {
  closeStartMenu();
  // Show boot screen as "shutdown" effect
  const boot = document.getElementById('bootScreen');
  if (boot) {
    boot.style.display = 'flex';
    boot.style.opacity = '1';
    const termLines = boot.querySelectorAll('.boot-line');
    termLines.forEach(l => l.remove());
    const terminal = boot.querySelector('.boot-terminal');
    const progress = boot.querySelector('.boot-progress-fill');
    if (progress) progress.style.width = '0%';

    const msgs = [
      'Saving cat memes to disk...',
      'Flushing system buffers...',
      'Closing connection to the void...',
      'Powering down...'
    ];
    msgs.forEach((msg, i) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'boot-line';
        line.textContent = '> ' + msg;
        terminal.appendChild(line);
      }, i * 600);
    });
    setTimeout(() => {
      boot.style.background = '#000';
      terminal.style.display = 'none';
      const offMsg = document.createElement('div');
      offMsg.style.cssText = 'color:#555;font-family:var(--font-mono);font-size:0.9rem;';
      offMsg.textContent = 'It is now safe to close your browser.';
      boot.querySelector('.boot-window').appendChild(offMsg);
    }, 2800);
  }
}

function startMenuRestart() {
  closeStartMenu();
  sessionStorage.removeItem('booted');
  location.reload();
}

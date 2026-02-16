/* ==========================================
   MochaLulu — Interactive JS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBootSequence();
  initThemeToggle();
  initLocalTime();
  initScrollReveal();
  initFloatingNav();
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

/* ---------- Floating Nav ---------- */
function initFloatingNav() {
  const nav = document.getElementById('floatingNav');
  const sections = document.querySelectorAll('section[id]');
  const links = nav.querySelectorAll('.fnav-link');

  // Show/hide on scroll
  let lastScroll = 0;
  const heroHeight = document.getElementById('home').offsetHeight;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > heroHeight * 0.6) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }

    // Active section detection
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) {
        current = section.id;
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });

    lastScroll = scrollY;
  });
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
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Animate button
    const btn = form.querySelector('.btn-submit');
    btn.textContent = 'sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Simulate send
    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('show');
    }, 1200);
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
    { text: 'Checking hardware... OK', delay: 300, color: '#00b894' },
    { text: 'Loading kernel: mochalulu_os_x64.bin', delay: 500, color: '#dfe6e9' },
    { text: 'Initializing cat_meme_driver.sys......... OK', delay: 800, color: '#00b894' },
    { text: 'Mounting /dev/coffee ............... OK', delay: 1100, color: '#00b894' },
    { text: 'Starting sysadmin_services.d', delay: 1400, color: '#dfe6e9' },
    { text: '  → nginx.service          [ACTIVE]', delay: 1600, color: '#00b894' },
    { text: '  → docker.service         [ACTIVE]', delay: 1750, color: '#00b894' },
    { text: '  → ssh.service            [ACTIVE]', delay: 1900, color: '#00b894' },
    { text: '  → firewall.service       [ACTIVE]', delay: 2050, color: '#fdcb6e' },
    { text: 'Loading user profile: MochaLulu', delay: 2300, color: '#a29bfe' },
    { text: 'Welcome back, MochaLulu! ☕', delay: 2600, color: '#6c5ce7' },
    { text: '', delay: 2800 },
    { text: 'System ready. Launching desktop...', delay: 2900, color: '#00b894' },
  ];

  const container = document.getElementById('bootLines');
  const progressFill = document.getElementById('bootProgressFill');
  const bootScreen = document.getElementById('bootScreen');
  const totalDuration = 3400;

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
    const hours = now.getHours();
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'local';
    const shortTz = tz.split('/').pop().replace(/_/g, ' ');
    timeEl.textContent = `${h12}:${mins}:${secs} ${ampm} — ${shortTz}`;
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

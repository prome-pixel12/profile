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
  initAvatarEasterEgg();
  initWeatherWidget();
});

/* ---------- Faah Sound ---------- */
const faahAudio = new Audio('audio/faah.mp3');
faahAudio.preload = 'auto';
faahAudio.volume = 0.5;

function playFaah() {
  try {
    faahAudio.currentTime = 0;
    faahAudio.play().catch(() => {});
  } catch (e) { /* silent fail */ }
}

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

  // Play faah sound on error
  playFaah();
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
    playFaah();
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
      playFaah();
      const offMsg = document.createElement('div');
      offMsg.style.cssText = 'color:#555;font-family:var(--font-mono);font-size:0.9rem;';
      offMsg.textContent = 'It is now safe to close your browser.';
      boot.querySelector('.boot-window').appendChild(offMsg);
    }, 2800);
  }
}

function startMenuRestart() {
  closeStartMenu();
  playFaah();
  sessionStorage.removeItem('booted');
  location.reload();
}

/* ---------- Avatar Easter Egg ---------- */
function initAvatarEasterEgg() {
  const avatar = document.querySelector('.hero .avatar');
  if (!avatar) return;

  let clickCount = 0;
  let clickTimer = null;

  avatar.style.cursor = 'pointer';

  avatar.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimer);

    if (clickCount >= 5) {
      clickCount = 0;
      playFaah();
      // Spin the avatar for fun
      avatar.style.transition = 'transform 0.6s ease';
      avatar.style.transform = 'rotate(360deg) scale(1.2)';
      setTimeout(() => {
        avatar.style.transform = '';
      }, 700);
    }

    clickTimer = setTimeout(() => {
      clickCount = 0;
    }, 1500);
  });
}

/* ---------- Rider Weather Widget ---------- */
function initWeatherWidget() {
  const fab = document.getElementById('weatherFab');
  const panel = document.getElementById('weatherPanel');
  const scrim = document.getElementById('weatherScrim');
  if (!fab || !panel) return;

  let fetched = false;

  function openPanel() {
    panel.classList.add('open');
    fab.classList.add('active');
    if (scrim) scrim.classList.add('open');
    if (!fetched) {
      fetchWeatherData();
      fetched = true;
    }
  }

  function closePanel() {
    panel.classList.remove('open');
    fab.classList.remove('active');
    if (scrim) scrim.classList.remove('open');
  }

  fab.addEventListener('click', () => {
    panel.classList.contains('open') ? closePanel() : openPanel();
  });

  // Close on scrim click
  if (scrim) {
    scrim.addEventListener('click', closePanel);
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && !fab.contains(e.target) && e.target !== scrim) {
      closePanel();
    }
  });
}

function getWeatherEmoji(code) {
  if (code <= 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 65) return '🌧️';
  if (code <= 67) return '🌨️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  if (code <= 95) return '⛈️';
  return '⛈️';
}

function getWeatherDesc(code) {
  if (code <= 0) return 'Clear';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 55) return 'Drizzle';
  if (code <= 65) return 'Rain';
  if (code <= 67) return 'Freezing Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain Showers';
  if (code <= 86) return 'Snow Showers';
  if (code <= 95) return 'Thunderstorm';
  return 'Severe Storm';
}

async function fetchWeatherData() {
  const body = document.getElementById('weatherBody');

  // Cyberjaya: 2.9213, 101.6559 | Jln Klang Lama: 3.0985, 101.6680
  const urls = [
    'https://api.open-meteo.com/v1/forecast?latitude=2.9213&longitude=101.6559&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=precipitation_probability,precipitation,weather_code&timezone=Asia%2FKuala_Lumpur&forecast_days=1',
    'https://api.open-meteo.com/v1/forecast?latitude=3.0985&longitude=101.6680&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=precipitation_probability,precipitation,weather_code&timezone=Asia%2FKuala_Lumpur&forecast_days=1'
  ];

  try {
    const [cyberjaya, klangLama] = await Promise.all(urls.map(u => fetch(u).then(r => r.json())));

    const now = new Date();
    const currentHour = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur', hour: 'numeric', hour12: false }));

    // Current conditions
    const cyb = cyberjaya.current;
    const kl = klangLama.current;

    // Get next 5 hours of forecast (use the worse of the two locations)
    const hourlyRows = [];
    for (let i = 0; i < 5; i++) {
      const h = currentHour + i;
      if (h >= 24) break;
      const cybProb = cyberjaya.hourly.precipitation_probability[h];
      const klProb = klangLama.hourly.precipitation_probability[h];
      const cybPrecip = cyberjaya.hourly.precipitation[h];
      const klPrecip = klangLama.hourly.precipitation[h];
      const worstCode = Math.max(cyberjaya.hourly.weather_code[h], klangLama.hourly.weather_code[h]);

      const timeLabel = new Date(cyberjaya.hourly.time[h]).toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kuala_Lumpur', hour: 'numeric', hour12: true
      });

      hourlyRows.push({
        time: timeLabel,
        icon: getWeatherEmoji(worstCode),
        prob: Math.max(cybProb, klProb),
        precip: Math.max(cybPrecip, klPrecip).toFixed(1)
      });
    }

    // Determine advisory verdict
    const maxProb = Math.max(...hourlyRows.map(r => r.prob));
    const maxPrecip = Math.max(...hourlyRows.map(r => parseFloat(r.precip)));
    const isRainy = maxProb >= 50 || maxPrecip >= 1.0;
    const isStormy = cyb.weather_code >= 80 || kl.weather_code >= 80;

    // Rider tips based on conditions
    let tips = [];
    if (isStormy) {
      tips = [
        { icon: '🧥', text: 'Full raincoat & waterproof gear mandatory' },
        { icon: '⚠️', text: 'Thunderstorm active — consider delaying travel' },
        { icon: '👁️', text: 'Reduced visibility — use headlights, ride slow' },
        { icon: '🛣️', text: 'MEX puddle buildup likely on flat sections' },
        { icon: '🏍️', text: 'Keep safe distance from trucks — spray hazard' },
      ];
    } else if (isRainy) {
      tips = [
        { icon: '🧥', text: 'Bring raincoat — rain likely during your ride' },
        { icon: '🛣️', text: 'Wet roads — reduce speed on MEX curves' },
        { icon: '👁️', text: 'Visor may fog up — crack it slightly for airflow' },
        { icon: '🏍️', text: 'Avoid painted road markings — slippery when wet' },
        { icon: '☕', text: 'Warm up with coffee when you arrive!' },
      ];
    } else {
      tips = [
        { icon: '😎', text: 'Clear skies — enjoy the ride!' },
        { icon: '🧴', text: 'Sunny — sunscreen if riding without jacket' },
        { icon: '💧', text: 'Stay hydrated — 28°C+ heat' },
        { icon: '🛣️', text: 'MEX should be smooth — watch for usual traffic' },
        { icon: '🏍️', text: 'Good riding conditions — stay alert!' },
      ];
    }

    let verdictText, verdictClass;
    if (isStormy) {
      verdictText = '⛈️ RAINCOAT ON — Thunderstorm active!';
      verdictClass = 'rain';
    } else if (isRainy) {
      verdictText = '🌧️ RAINCOAT RECOMMENDED — Rain expected';
      verdictClass = 'rain';
    } else {
      verdictText = '☀️ NO RAINCOAT NEEDED — Clear conditions';
      verdictClass = 'clear';
    }

    body.innerHTML = `
      <div class="weather-route">
        <div class="weather-location">
          <div class="weather-location-label">Cyberjaya</div>
          <div class="weather-location-icon">${getWeatherEmoji(cyb.weather_code)}</div>
          <div class="weather-location-temp">${Math.round(cyb.temperature_2m)}°</div>
          <div class="weather-location-desc">${getWeatherDesc(cyb.weather_code)}</div>
        </div>
        <div class="weather-location">
          <div class="weather-location-label">Jln Klang Lama</div>
          <div class="weather-location-icon">${getWeatherEmoji(kl.weather_code)}</div>
          <div class="weather-location-temp">${Math.round(kl.temperature_2m)}°</div>
          <div class="weather-location-desc">${getWeatherDesc(kl.weather_code)}</div>
        </div>
      </div>

      <div class="weather-advisory">
        <div class="weather-advisory-title">🏍️ Rider Advisory — via MEX</div>
        <div class="weather-advisory-verdict ${verdictClass}">${verdictText}</div>
      </div>

      <div class="weather-hourly">
        <div class="weather-hourly-title">Next ${hourlyRows.length} Hours</div>
        ${hourlyRows.map(r => `
          <div class="weather-hourly-row">
            <span class="time">${r.time}</span>
            <span class="icon">${r.icon}</span>
            <span class="prob">${r.prob}%</span>
            <span class="precip">${r.precip} mm</span>
          </div>
        `).join('')}
      </div>

      <div class="weather-tips">
        <div class="weather-tips-title">🏍️ Rider Tips</div>
        ${tips.map(t => `
          <div class="weather-tip">
            <span class="weather-tip-icon">${t.icon}</span>
            <span>${t.text}</span>
          </div>
        `).join('')}
      </div>

      <div class="weather-updated">Last updated: ${now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kuala_Lumpur', hour: 'numeric', minute: '2-digit', hour12: true })} MYT</div>
    `;
  } catch (err) {
    body.innerHTML = `<div class="weather-error">⚠️ Failed to fetch weather data.<br>Try again later.<br><small>${err.message}</small></div>`;
  }
}

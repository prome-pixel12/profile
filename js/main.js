/* ==========================================
   MochaLulu — Interactive JS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initFloatingNav();
  initFAQ();
  initContactForm();
  initSmoothScroll();
  initParallaxShapes();
  initTypingEffect();
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

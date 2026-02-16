/* ==========================================
   MochaLulu — Window Manager JS
   Desktop OS-style pop-up windows
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const windowManager = new WindowManager();
  windowManager.init();
  initClock();
  initFAQ();
  initContactForm();
  initParallax();
  initTypingEffect();
});

/* ==========================================
   WINDOW MANAGER
   ========================================== */
class WindowManager {
  constructor() {
    this.windows = {};
    this.openOrder = [];
    this.zIndexBase = 100;
    this.activeWindow = null;
    this.dragState = null;
    this.staggerOffset = 0;
  }

  init() {
    // Collect all windows
    document.querySelectorAll('.window').forEach(win => {
      const name = win.dataset.window;
      this.windows[name] = {
        el: win,
        name,
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        position: null, // stored position before maximize
      };
    });

    // Desktop icon clicks
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.addEventListener('click', () => {
        const name = icon.dataset.window;
        this.openWindow(name);
      });
    });

    // Window dot buttons (close, minimize, maximize)
    document.querySelectorAll('.window-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const win = dot.closest('.window');
        const name = win.dataset.window;
        const action = dot.dataset.action;
        if (action === 'close') this.closeWindow(name);
        else if (action === 'minimize') this.minimizeWindow(name);
        else if (action === 'maximize') this.toggleMaximize(name);
      });
    });

    // Bring window to front on click
    document.querySelectorAll('.window').forEach(win => {
      win.addEventListener('mousedown', () => {
        this.bringToFront(win.dataset.window);
      });
    });

    // Drag setup
    this.initDrag();

    // Overlay click closes top-most window on mobile
    document.getElementById('overlay').addEventListener('click', () => {
      if (this.openOrder.length > 0) {
        const topWindow = this.openOrder[this.openOrder.length - 1];
        this.closeWindow(topWindow);
      }
    });

    // Keyboard: Escape closes top window
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.openOrder.length > 0) {
        const topWindow = this.openOrder[this.openOrder.length - 1];
        this.closeWindow(topWindow);
      }
    });
  }

  /* ---------- OPEN ---------- */
  openWindow(name) {
    const w = this.windows[name];
    if (!w) return;

    if (w.isOpen && w.isMinimized) {
      this.restoreWindow(name);
      return;
    }

    if (w.isOpen) {
      this.bringToFront(name);
      return;
    }

    // Position the window centered with stagger
    const el = w.el;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const elWidth = Math.min(el.offsetWidth || 480, vw * 0.92);
    const elHeight = Math.min(el.offsetHeight || 400, vh * 0.8);

    this.staggerOffset = (this.staggerOffset + 1) % 5;
    const stagger = this.staggerOffset * 30;

    el.style.left = Math.max(10, (vw - elWidth) / 2 + stagger) + 'px';
    el.style.top = Math.max(10, (vh - elHeight) / 2 - 40 + stagger) + 'px';

    el.classList.remove('closing', 'minimizing', 'restoring');
    el.classList.add('open');
    w.isOpen = true;
    w.isMinimized = false;

    this.openOrder.push(name);
    this.bringToFront(name);
    this.updateTaskbar();
    this.updateOverlay();
  }

  /* ---------- CLOSE ---------- */
  closeWindow(name) {
    const w = this.windows[name];
    if (!w || !w.isOpen) return;

    const el = w.el;
    el.classList.add('closing');

    setTimeout(() => {
      el.classList.remove('open', 'closing', 'maximized');
      w.isOpen = false;
      w.isMinimized = false;
      w.isMaximized = false;
      this.openOrder = this.openOrder.filter(n => n !== name);
      this.updateTaskbar();
      this.updateOverlay();
      if (this.activeWindow === name) this.activeWindow = null;
    }, 250);
  }

  /* ---------- MINIMIZE ---------- */
  minimizeWindow(name) {
    const w = this.windows[name];
    if (!w || !w.isOpen) return;

    const el = w.el;
    el.classList.add('minimizing');
    w.isMinimized = true;

    setTimeout(() => {
      el.classList.remove('open', 'minimizing');
      this.updateTaskbar();
      this.updateOverlay();
    }, 300);
  }

  /* ---------- RESTORE ---------- */
  restoreWindow(name) {
    const w = this.windows[name];
    if (!w) return;

    const el = w.el;
    el.classList.remove('closing', 'minimizing');
    el.classList.add('open', 'restoring');
    w.isMinimized = false;

    setTimeout(() => {
      el.classList.remove('restoring');
    }, 300);

    this.bringToFront(name);
    this.updateTaskbar();
    this.updateOverlay();
  }

  /* ---------- MAXIMIZE ---------- */
  toggleMaximize(name) {
    const w = this.windows[name];
    if (!w || !w.isOpen) return;

    const el = w.el;

    if (w.isMaximized) {
      el.classList.remove('maximized');
      if (w.position) {
        el.style.left = w.position.left;
        el.style.top = w.position.top;
        el.style.width = w.position.width;
      }
      w.isMaximized = false;
    } else {
      w.position = {
        left: el.style.left,
        top: el.style.top,
        width: el.style.width,
      };
      el.classList.add('maximized');
      w.isMaximized = true;
    }
  }

  /* ---------- Z-ORDER ---------- */
  bringToFront(name) {
    this.zIndexBase += 1;
    const w = this.windows[name];
    if (w) {
      w.el.style.zIndex = this.zIndexBase;
      this.activeWindow = name;
      this.updateTaskbar();
    }
  }

  /* ---------- TASKBAR ---------- */
  updateTaskbar() {
    const container = document.getElementById('taskbarWindows');
    container.innerHTML = '';

    this.openOrder.forEach(name => {
      const w = this.windows[name];
      if (!w || !w.isOpen) return;

      const btn = document.createElement('button');
      btn.classList.add('taskbar-btn');
      if (this.activeWindow === name && !w.isMinimized) btn.classList.add('active');
      if (w.isMinimized) btn.classList.add('minimized');
      btn.textContent = name;

      btn.addEventListener('click', () => {
        if (w.isMinimized) {
          this.restoreWindow(name);
        } else if (this.activeWindow === name) {
          this.minimizeWindow(name);
        } else {
          this.bringToFront(name);
        }
      });

      container.appendChild(btn);
    });
  }

  /* ---------- OVERLAY ---------- */
  updateOverlay() {
    const overlay = document.getElementById('overlay');
    const hasOpenVisible = this.openOrder.some(name => {
      const w = this.windows[name];
      return w && w.isOpen && !w.isMinimized;
    });

    // Only show overlay on mobile
    if (window.innerWidth <= 768 && hasOpenVisible) {
      overlay.classList.add('show');
    } else {
      overlay.classList.remove('show');
    }
  }

  /* ---------- DRAG ---------- */
  initDrag() {
    document.addEventListener('mousedown', (e) => this.onDragStart(e));
    document.addEventListener('mousemove', (e) => this.onDragMove(e));
    document.addEventListener('mouseup', () => this.onDragEnd());

    // Touch events
    document.addEventListener('touchstart', (e) => this.onDragStart(e), { passive: false });
    document.addEventListener('touchmove', (e) => this.onDragMove(e), { passive: false });
    document.addEventListener('touchend', () => this.onDragEnd());
  }

  onDragStart(e) {
    const target = e.target.closest('[data-drag="true"]');
    if (!target) return;

    // Don't drag if clicking dots
    if (e.target.closest('.window-dot')) return;

    const win = target.closest('.window');
    if (!win) return;

    const name = win.dataset.window;
    const w = this.windows[name];
    if (w && w.isMaximized) return; // don't drag maximized windows

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    this.dragState = {
      window: win,
      name,
      startX: clientX,
      startY: clientY,
      origLeft: parseInt(win.style.left) || 0,
      origTop: parseInt(win.style.top) || 0,
    };

    this.bringToFront(name);
    if (e.touches) e.preventDefault();
  }

  onDragMove(e) {
    if (!this.dragState) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - this.dragState.startX;
    const dy = clientY - this.dragState.startY;

    const newLeft = this.dragState.origLeft + dx;
    const newTop = Math.max(0, this.dragState.origTop + dy); // don't go above viewport

    this.dragState.window.style.left = newLeft + 'px';
    this.dragState.window.style.top = newTop + 'px';

    if (e.touches) e.preventDefault();
  }

  onDragEnd() {
    this.dragState = null;
  }
}

/* ==========================================
   CLOCK
   ========================================== */
function initClock() {
  const clockEl = document.getElementById('taskbarClock');
  function update() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    clockEl.textContent = `${h}:${m}`;
  }
  update();
  setInterval(update, 30000);
}

/* ==========================================
   FAQ ACCORDION
   ========================================== */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all siblings
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ==========================================
   CONTACT FORM
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.querySelector('span').textContent = 'sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('show');
    }, 1000);
  });
}

/* ==========================================
   PARALLAX SHAPES
   ========================================== */
function initParallax() {
  const shapes = document.querySelectorAll('.shape');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 6;
      shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });
}

/* ==========================================
   TYPING EFFECT
   ========================================== */
function initTypingEffect() {
  const roleEl = document.querySelector('.hero-role');
  if (!roleEl) return;

  const text = roleEl.textContent;
  roleEl.textContent = '';
  roleEl.style.borderRight = '2px solid var(--primary-light)';

  let i = 0;
  const interval = setInterval(() => {
    roleEl.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      setTimeout(() => { roleEl.style.borderRight = 'none'; }, 1800);
    }
  }, 70);
}

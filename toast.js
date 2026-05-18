/**
 * Toast Notification System - Core Engine
 * Fix: progress bar resumes correctly after hover-pause
 */

const toastIcons = {
  success: 'bi-check-circle-fill',
  error:   'bi-x-octagon-fill',
  warning: 'bi-exclamation-triangle-fill',
  info:    'bi-info-circle-fill',
  confirm: 'bi-question-diamond-fill'
};

function showToast(type = 'info', title = '', message = '', duration = 4500) {

  const validTypes = ['success', 'error', 'warning', 'info', 'confirm'];
  if (!validTypes.includes(type)) type = 'info';

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const isConfirm = type === 'confirm';

  const actionsHTML = isConfirm
    ? `<div class="toast-actions">
         <button class="toast-btn toast-btn-ok">Confirm</button>
         <button class="toast-btn toast-btn-cancel">Cancel</button>
       </div>`
    : '';

  const progressHTML = isConfirm ? '' : `<div class="toast-progress"></div>`;

  const toast = document.createElement('div');
  toast.className = `custom-toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon-orb">
      <i class="bi ${toastIcons[type]}"></i>
    </div>
    <div class="toast-body">
      <div class="toast-title">${escapeHTML(title)}</div>
      <span class="toast-message">${escapeHTML(message)}</span>
      ${actionsHTML}
    </div>
    <button class="toast-close-btn" aria-label="Close">
      <i class="bi bi-x-lg"></i>
    </button>
    ${progressHTML}
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-close-btn');

  // ── Confirm Toast ──────────────────────────────────────────
  if (isConfirm) {
    return new Promise((resolve) => {
      toast.querySelector('.toast-btn-ok').addEventListener('click', () => {
        removeToast(toast); resolve(true);
      });
      toast.querySelector('.toast-btn-cancel').addEventListener('click', () => {
        removeToast(toast); resolve(false);
      });
      closeBtn.addEventListener('click', () => {
        removeToast(toast); resolve(false);
      });
    });
  }

  // ── Timed Toast with Hover-Pause ───────────────────────────
  const bar = toast.querySelector('.toast-progress');
  let remaining = duration;
  let startAt;
  let timer;
  let paused = false;

  /**
   * THE FIX:
   * Step 1 — Set the bar to its CURRENT scaleX (frozen position) with no transition.
   * Step 2 — In the NEXT frame, apply the transition + scaleX(0).
   * This forces the browser to register the start point before animating.
   * Without step 1, the browser skips from 1 → 0 ignoring the frozen midpoint.
   */
  function runTimer(ms) {
    if (ms <= 0) { removeToast(toast); return; }

    // Step 1: Snapshot current position — no transition
    const currentScale = getCurrentScale(bar);
    bar.style.transition = 'none';
    bar.style.transform = `scaleX(${currentScale})`;

    // Step 2: Next frame — animate from current position → 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = `transform ${ms}ms linear`;
        bar.style.transform = 'scaleX(0)';
      });
    });

    timer = setTimeout(() => removeToast(toast), ms);
  }

  // Read the real computed scaleX from the matrix
  function getCurrentScale(el) {
    const style = window.getComputedStyle(el);
    const transform = style.transform;
    if (!transform || transform === 'none') return 1;
    // matrix(a, b, c, d, tx, ty) — scaleX is 'a'
    const matrix = transform.match(/matrix\(([^)]+)\)/);
    if (matrix) {
      const values = matrix[1].split(',');
      return parseFloat(values[0]);
    }
    return 1;
  }

  // Kick off
  startAt = Date.now();
  runTimer(remaining);

  // PAUSE — mouse enters
  toast.addEventListener('mouseenter', () => {
    if (paused) return;
    paused = true;
    clearTimeout(timer);

    // Deduct elapsed time
    remaining = Math.max(0, remaining - (Date.now() - startAt));

    // Freeze bar visually at exact current position
    const frozenScale = getCurrentScale(bar);
    bar.style.transition = 'none';
    bar.style.transform = `scaleX(${frozenScale})`;
  });

  // RESUME — mouse leaves
  toast.addEventListener('mouseleave', () => {
    if (!paused) return;
    paused = false;
    startAt = Date.now();
    runTimer(remaining);
  });

  // Manual close
  closeBtn.addEventListener('click', () => {
    clearTimeout(timer);
    removeToast(toast);
  });
}
//toast
function removeToast(toastEl) {
  toastEl.classList.add('hide');
  toastEl.addEventListener('animationend', (e) => {
    if (e.animationName === 'toastOut') {
      toastEl.remove();
      const container = document.getElementById('toast-container');
      if (container && container.children.length === 0) {
        container.remove();
      }
    }
  }, { once: true });
}

function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g,
    t => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t])
  );
}
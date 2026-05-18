/**
 * Toast Notification System - Core Engine
 */

const toastIcons = {
    success: 'bi-check-circle-fill',
    error:   'bi-x-octagon-fill',
    warning: 'bi-exclamation-triangle-fill',
    info:    'bi-info-circle-fill',
    confirm: 'bi-question-diamond-fill'
  };
  
  function showToast(type = 'info', title = '', message = '', duration = 4500) {
    // Validate type
    const validTypes = ['success', 'error', 'warning', 'info', 'confirm'];
    if (!validTypes.includes(type)) type = 'info';
  
    // Get or create container
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
  
    // Build toast element
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon-orb">
        <i class="bi ${toastIcons[type]}"></i>
      </div>
      <div class="toast-body">
        <div class="toast-title">${escapeHTML(title)}</div>
        <p class="toast-message">${escapeHTML(message)}</p>
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
          removeToast(toast);
          resolve(true);
        });
        toast.querySelector('.toast-btn-cancel').addEventListener('click', () => {
          removeToast(toast);
          resolve(false);
        });
        closeBtn.addEventListener('click', () => {
          removeToast(toast);
          resolve(false);
        });
      });
    }
  
    // ── Timed Toast with Hover-Pause ───────────────────────────
    const bar = toast.querySelector('.toast-progress');
    let remaining = duration;
    let startAt;
    let timer;
  
    function runTimer(ms) {
      // Kick off CSS progress bar shrink
      bar.style.transition = `transform ${ms}ms linear`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        bar.style.transform = 'scaleX(0)';
      }));
      timer = setTimeout(() => removeToast(toast), ms);
    }
  
    // Start on mount
    startAt = Date.now();
    runTimer(remaining);
  
    // Pause on hover
    toast.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      remaining = Math.max(0, remaining - (Date.now() - startAt));
  
      // Freeze bar at current visual position
      const currentTransform = getComputedStyle(bar).transform;
      bar.style.transition = 'none';
      bar.style.transform = currentTransform;
    });
  
    // Resume on mouse leave
    toast.addEventListener('mouseleave', () => {
      startAt = Date.now();
      runTimer(remaining);
    });
  
    // Manual close
    closeBtn.addEventListener('click', () => {
      clearTimeout(timer);
      removeToast(toast);
    });
  }
  
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
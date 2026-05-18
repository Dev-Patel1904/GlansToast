/**
 * Toast Notification System - Core Engine
 */

const toastIcons = {
   success: 'bi-check-circle-fill',
   error: 'bi-x-circle-fill',
   warning: 'bi-exclamation-triangle-fill',
   info: 'bi-info-circle-fill',
   confirm: 'bi-question-circle-fill'
};

function showToast(type, title, message, duration = 4000) {
   let container = document.getElementById('toast-container');
   if (!container) {
       container = document.createElement('div');
       container.id = 'toast-container';
       document.body.appendChild(container);
   }

   const validTypes = ['success', 'error', 'warning', 'info', 'confirm'];
   if (!validTypes.includes(type)) type = 'info';

   const toast = document.createElement('div');
   toast.className = `custom-toast toast-${type}`;

   let actionButtonsHtml = '';
   let progressBarHtml = `<div class="toast-progress"></div>`;
   
   if (type === 'confirm') {
       progressBarHtml = ''; 
       actionButtonsHtml = `
           <div class="toast-actions">
               <button class="toast-btn toast-btn-ok" id="toast-btn-ok">OK</button>
               <button class="toast-btn toast-btn-cancel" id="toast-btn-cancel">Cancel</button>
           </div>
       `;
   }

   toast.innerHTML = `
       <div class="toast-icon-wrapper">
           <i class="bi ${toastIcons[type]}"></i>
       </div>
       <div class="toast-content">
           <div class="toast-title">${escapeHTML(title)}</div>
           <p class="toast-message">${escapeHTML(message)}</p>
           ${actionButtonsHtml}
       </div>
       <button class="toast-close-btn" aria-label="Close">
           <i class="bi bi-x-lg"></i>
       </button>
       ${progressBarHtml}
   `;

   container.appendChild(toast);

   const closeBtn = toast.querySelector('.toast-close-btn');
   
   // Core Logic Integration for Confirm vs Normal Timed Toasts
   if (type === 'confirm') {
       return new Promise((resolve) => {
           toast.querySelector('#toast-btn-ok').addEventListener('click', () => {
               removeToast(toast);
               resolve(true);
           });

           toast.querySelector('#toast-btn-cancel').addEventListener('click', () => {
               removeToast(toast);
               resolve(false);
           });

           closeBtn.addEventListener('click', () => {
               removeToast(toast);
               resolve(false);
           });
       });
   } else {
       // --- HOVER PAUSE LIFE-CYCLE SCHEDULER ENGINE ---
       let dismissTimeout;
       let remainingTime = duration;
       let startTime = Date.now();
       const progressBar = toast.querySelector('.toast-progress');

       // Function to start or resume the countdown animation/timer
       const startTimer = (timeTarget) => {
           progressBar.style.transition = `transform ${timeTarget}ms linear`;
           requestAnimationFrame(() => {
               progressBar.style.transform = 'scaleX(0)';
           });
           
           dismissTimeout = setTimeout(() => removeToast(toast), timeTarget);
       };

       // Initialize the first execution
       startTimer(remainingTime);

       // Event: Mouse enters Toast bounding layer (PAUSE)
       toast.addEventListener('mouseenter', () => {
           clearTimeout(dismissTimeout);
           
           // Calculate precisely how long the toast ran before getting hovered
           remainingTime -= Date.now() - startTime;
           
           // Read current evaluated computational width to lock it instantly
           const computedStyle = window.getComputedStyle(progressBar);
           const currentTransform = computedStyle.getPropertyValue('transform');
           
           // Freeze visual state directly via matrix transformation properties
           progressBar.style.transition = 'none';
           progressBar.style.transform = currentTransform;
       });

       // Event: Mouse leaves Toast bounding layer (RESUME)
       toast.addEventListener('mouseleave', () => {
           startTime = Date.now(); // Reset baseline checkpoint timestamp
           startTimer(remainingTime); // Resume countdown with remaining millisecond allocation
       });

       // Click Manual Exit Control Handler
       closeBtn.addEventListener('click', () => {
           clearTimeout(dismissTimeout);
           removeToast(toast);
       });
   }
}

function removeToast(toastElement) {
   toastElement.classList.add('hide');
   toastElement.addEventListener('animationend', (e) => {
       if (e.animationName === 'toastSlideOut') {
           toastElement.remove();
           const container = document.getElementById('toast-container');
           if (container && container.childNodes.length === 0) {
               container.remove();
           }
       }
   });
}

function escapeHTML(str) {
   return str.replace(/[&<>'"]/g, 
       tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
   );
}
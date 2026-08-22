export function showToast(message, type = 'info', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} fade-in-down`;

  let icon = 'ℹ';
  if (type === 'success') icon = '✓';
  if (type === 'warning') icon = '⚠';
  if (type === 'error') icon = '✗';

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">${message}</div>
    <button class="toast-close">✕</button>
    <div class="toast-progress-bar"></div>
  `;

  container.appendChild(toast);

  const progressBar = toast.querySelector('.toast-progress-bar');
  progressBar.style.transition = `width ${duration}ms linear`;
  
  // Trigger reflow
  toast.offsetHeight;
  progressBar.style.width = '0%';

  let timeoutId;

  const removeToast = () => {
    toast.classList.replace('fade-in-down', 'fade-out');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  };

  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(timeoutId);
    removeToast();
  });

  timeoutId = setTimeout(() => {
    removeToast();
  }, duration);
}

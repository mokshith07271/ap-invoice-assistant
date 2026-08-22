export function showModal(options) {
  return new Promise((resolve) => {
    const {
      title = 'Confirm',
      message = '',
      icon = '❓',
      type = 'confirm',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      showTextarea = false,
      textareaPlaceholder = 'Add a note...',
      textareaRequired = false
    } = options;

    const overlay = document.createElement('div');
    overlay.className = 'modal-backdrop fade-in';

    const modal = document.createElement('div');
    modal.className = 'modal scale-in';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    const btnClass = type === 'danger' ? 'btn-danger' : (type === 'warning' ? 'btn-warning' : 'btn-primary');

    modal.innerHTML = `
      <div class="modal-icon">${icon}</div>
      <h3 class="modal-title">${title}</h3>
      <div class="modal-message">${message}</div>
      ${showTextarea ? `<textarea class="modal-textarea" placeholder="${textareaPlaceholder}" ${textareaRequired ? 'required' : ''}></textarea>` : ''}
      <div class="modal-actions">
        <button class="btn btn-cancel">${cancelText}</button>
        <button class="btn ${btnClass} btn-confirm">${confirmText}</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const textarea = showTextarea ? modal.querySelector('.modal-textarea') : null;
    const btnConfirm = modal.querySelector('.btn-confirm');
    const btnCancel = modal.querySelector('.btn-cancel');

    if (showTextarea && textareaRequired) {
      btnConfirm.disabled = true;
      textarea.addEventListener('input', () => {
        btnConfirm.disabled = textarea.value.trim().length === 0;
      });
    }

    const cleanup = () => {
      modal.classList.replace('scale-in', 'scale-out');
      overlay.classList.replace('fade-in', 'fade-out');
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
      document.removeEventListener('keydown', handleKeydown);
    };

    const handleConfirm = () => {
      if (showTextarea && textareaRequired && textarea.value.trim().length === 0) return;
      cleanup();
      resolve({ confirmed: true, text: textarea ? textarea.value.trim() : null });
    };

    const handleCancel = () => {
      cleanup();
      resolve({ confirmed: false });
    };

    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    btnConfirm.addEventListener('click', handleConfirm);
    btnCancel.addEventListener('click', handleCancel);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) handleCancel();
    });
    document.addEventListener('keydown', handleKeydown);

    // Focus trap setup
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      });
      if (showTextarea) {
        textarea.focus();
      } else {
        btnConfirm.focus();
      }
    }
  });
}

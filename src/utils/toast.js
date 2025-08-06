// Simple toast implementation using DOM manipulation
const createToast = (message, type) => {
  const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const toast = document.createElement('div');
  toast.id = toastId;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    min-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
  `;

  toast.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <span>${message}</span>
      <button onclick="document.getElementById('${toastId}').remove()" style="
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 12px;
        opacity: 0.8;
      ">&times;</button>
    </div>
  `;

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (document.getElementById(toastId)) {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.getElementById(toastId)) {
          toast.remove();
        }
      }, 300);
    }
  }, 5000);

  return toastId;
};

// Simple toast utility for development
// You can replace this with a proper toast library like react-toastify later

export const toast = {
  success: (message) => {
    console.log('SUCCESS:', message);
    return createToast(message, 'success');
  },
  error: (message) => {
    console.log('ERROR:', message);
    return createToast(message, 'error');
  },
  info: (message) => {
    console.log('INFO:', message);
    return createToast(message, 'info');
  }
};

// Additional toast functions for compatibility
export const showSuccessToast = (message) => {
  console.log('SUCCESS:', message);
  return createToast(message, 'success');
};

export const showErrorToast = (message) => {
  console.error('ERROR:', message);
  return createToast(message, 'error');
};

export const showLoadingToast = (message) => {
  console.log('LOADING:', message);
  const toastId = createToast(message, 'info');
  return toastId;
};

export const updateToast = (id, message, type = 'info') => {
  console.log(`UPDATE TOAST ${id}:`, message, `(${type})`);
  // Remove the old toast
  const oldToast = document.getElementById(id);
  if (oldToast) {
    oldToast.remove();
  }
  // Create new toast with updated message
  return createToast(message, type);
};
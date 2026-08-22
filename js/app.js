import { store } from './state.js';
import { initRouter } from './router.js';
import { renderDashboard } from './views/dashboard.js';
import { renderUpload } from './views/upload.js';
import { renderAnalysis } from './views/analysis.js';
import { renderResults } from './views/results.js';
import { renderApproval } from './views/approval.js';
import { renderSourceViewer } from './components/source-viewer.js';
import { renderChat } from './components/chat.js';

/**
 * Renders the active view based on current hash and state.
 */
function renderCurrentView() {
  const hash = window.location.hash || '#/';
  const [fullPath, queryString] = hash.substring(1).split('?');
  const parts = fullPath.split('/').filter(Boolean);
  const baseRoute = parts[0] || 'dashboard';
  const id = parts[1];
  const queryParams = {};
  if (queryString) {
    new URLSearchParams(queryString).forEach((v, k) => queryParams[k] = v);
  }

  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.route) {
      link.classList.toggle('active', link.dataset.route === baseRoute);
    }
  });

  // Render the appropriate view
  switch (baseRoute) {
    case 'upload':
      renderUpload();
      break;
    case 'analysis':
      renderAnalysis();
      break;
    case 'results':
      renderResults(id);
      break;
    case 'approval':
      renderApproval(id, queryParams.action);
      break;
    case 'dashboard':
    default:
      renderDashboard();
      break;
  }

  // Scroll to top on view change
  const main = document.querySelector('#app-main');
  if (main) main.scrollTop = 0;
}

/**
 * Initialize the application
 */
function init() {
  // Clear stale session state so each load starts fresh
  try { sessionStorage.removeItem('ap_invoice_state'); } catch(e) {}

  // Initialize global UI components (Source Viewer & Chat Bot)
  renderSourceViewer();
  renderChat();

  // Listen for hash changes to re-render
  window.addEventListener('hashchange', renderCurrentView);

  // Set default hash if none
  if (!window.location.hash || window.location.hash === '#') {
    window.location.hash = '#/';
  }

  // Always do an explicit initial render
  renderCurrentView();

  console.log('AP Invoice Assistant initialized cleanly');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

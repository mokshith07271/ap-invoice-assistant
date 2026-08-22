import { store } from './state.js';

/**
 * Initializes the hash-based SPA router.
 * Listens for hashchange events and updates the application state.
 */
export function initRouter() {
  function handleHashChange() {
    const hash = window.location.hash || '#/';
    // Extract path and query string (e.g. #/results?id=INV-123)
    const [fullPath, queryString] = hash.substring(1).split('?');
    
    // Parse query params
    const queryParams = {};
    if (queryString) {
      const params = new URLSearchParams(queryString);
      for (const [key, value] of params.entries()) {
        queryParams[key] = value;
      }
    }
    
    // Route matching
    const parts = fullPath.split('/').filter(Boolean);
    const baseRoute = parts[0] || 'dashboard';
    const id = parts[1] || queryParams.id;
    
    let view = 'dashboard';
    
    switch (baseRoute) {
      case 'dashboard':
        view = 'dashboard';
        break;
      case 'upload':
        view = 'upload';
        break;
      case 'analysis':
        view = 'analysis';
        break;
      case 'results':
        view = 'results';
        break;
      case 'approval':
        view = 'approval';
        break;
      default:
        view = 'dashboard';
    }
    
    store.setState({ 
      currentView: view,
      ...(id ? { currentInvoice: id } : {})
    });
  }
  
  // Listen for navigation events
  window.addEventListener('hashchange', handleHashChange);
  
  // Handle initial load
  if (!window.location.hash) {
    window.location.hash = '#/';
  } else {
    handleHashChange();
  }
}

/**
 * Programmatically navigate to a path.
 * Forces a hashchange dispatch if target path equals current hash so views re-render instantly.
 * @param {string} path - The path to navigate to (e.g. '#/' or '/results/123')
 */
export function navigateTo(path) {
  const targetHash = path.startsWith('#') ? path : `#${path}`;
  if (window.location.hash === targetHash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = targetHash;
  }
}

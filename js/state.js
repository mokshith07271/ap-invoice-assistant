const STORAGE_KEY = 'ap_invoice_state';

export function createStore(initialState) {
  let state = { ...initialState };
  
  // Try to load from session storage on init
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      state = { ...state, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load state from sessionStorage', e);
  }

  const listeners = new Map();
  const globalListeners = new Set();
  
  /**
   * Get the current state
   * @returns {Object} current state
   */
  function getState() {
    return state;
  }
  
  /**
   * Update the state and notify listeners
   * @param {Object} partialState - the state properties to update
   */
  function setState(partialState) {
    state = { ...state, ...partialState };
    
    // Persist to session storage
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state to sessionStorage', e);
    }
    
    // Notify key listeners
    for (const key in partialState) {
      if (listeners.has(key)) {
        listeners.get(key).forEach(callback => callback(state[key], state));
      }
    }
    
    // Notify global listeners
    globalListeners.forEach(callback => callback(state));
  }
  
  /**
   * Subscribe to changes on a specific state key
   * @param {string} key - the state key to watch
   * @param {Function} callback - function to call when key changes
   * @returns {Function} unsubscribe function
   */
  function subscribe(key, callback) {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }
    listeners.get(key).add(callback);
    
    return () => {
      if (listeners.has(key)) {
        listeners.get(key).delete(callback);
      }
    };
  }
  
  /**
   * Subscribe to all state changes
   * @param {Function} callback - function to call on any state change
   * @returns {Function} unsubscribe function
   */
  function subscribeAll(callback) {
    globalListeners.add(callback);
    return () => {
      globalListeners.delete(callback);
    };
  }
  
  return {
    getState,
    setState,
    subscribe,
    subscribeAll
  };
}

// Initial state definition — Starts with 0 mock invoices. Real projects added upon upload.
const defaultState = {
  currentView: 'dashboard',
  invoices: [],
  currentInvoice: null,
  uploadedInvoice: null,
  uploadedPO: null,
  analysisStatus: 'idle',
  analysisSteps: [],
  chatMessages: [],
  chatOpen: false,
  sourceViewerOpen: false,
  sourceViewerData: null,
  toasts: [],
};

// Export singleton store
export const store = createStore(defaultState);

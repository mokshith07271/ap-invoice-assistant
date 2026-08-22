import { store } from '../state.js';
import { createAIProvider } from '../ai-provider.js';
import { openSourceViewer } from './source-viewer.js';

let chatPanel;
let messagesArea;
let suggestionsArea;
let inputEl;
let lastView = null;
let lastActiveInvoiceId = null;
const provider = createAIProvider();

export function renderChat() {
  const container = document.body;

  // Singleton toggle button — Pure Text
  let toggleBtn = document.querySelector('.chat-toggle-btn');
  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'chat-toggle-btn';
    toggleBtn.innerHTML = 'Ask AI';
    toggleBtn.style.display = 'none';
    toggleBtn.addEventListener('click', () => {
      store.setState({ chatOpen: true });
    });
    container.appendChild(toggleBtn);
  }

  // Singleton chat panel
  let panel = document.querySelector('.chat-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.className = 'chat-panel';
    panel.style.display = 'none';

    panel.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-info">
          <div>
            <div class="chat-title">AP Assistant</div>
            <div class="chat-subtitle">Your invoice review assistant</div>
          </div>
        </div>
        <div class="chat-header-actions" style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="chat-clear-btn" id="chat-clear-trigger" title="Clear chat history" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #ccc; cursor: pointer; font-size: 0.8rem; padding: 4px 10px; border-radius: 6px;">Clear</button>
          <button type="button" class="chat-close-btn" aria-label="Close chat">✕</button>
        </div>
      </div>
      <div class="chat-messages"></div>
      <div class="chat-suggestions"></div>
      <form class="chat-input-area" id="chat-submit-form" action="javascript:void(0);">
        <input type="text" class="chat-input" placeholder="Ask e.g. Why was invoice #123 flagged?" autocomplete="off" />
        <button type="button" class="chat-send-btn" id="chat-send-trigger" aria-label="Send">➤</button>
      </form>
    `;
    container.appendChild(panel);

    // Close button
    panel.querySelector('.chat-close-btn').addEventListener('click', () => {
      store.setState({ chatOpen: false });
    });

    // Clear chat button
    panel.querySelector('#chat-clear-trigger').addEventListener('click', () => {
      const msgs = panel.querySelector('.chat-messages');
      if (msgs) msgs.innerHTML = '';
      store.setState({ chatMessages: [] });
      initializeChat();
    });

    const inputElement = panel.querySelector('.chat-input');
    const sendButtonElement = panel.querySelector('#chat-send-trigger');
    const formElement = panel.querySelector('#chat-submit-form');

    // Central send action
    const handleSendAction = async () => {
      const text = inputElement.value.trim();
      if (!text) return;

      inputElement.value = '';
      appendMessage('user', text);
      await processUserMessage(text);
    };

    sendButtonElement.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleSendAction();
    });

    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleSendAction();
    });

    inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSendAction();
      }
    });

    // Subscribe to state changes for open/close
    store.subscribe('chatOpen', (isOpen) => {
      const hasInvoice = !!(store.getState().currentInvoice || (store.getState().invoices && store.getState().invoices.length > 0));
      if (isOpen && hasInvoice) {
        panel.style.display = 'flex';
        toggleBtn.style.display = 'none';
        const msgs = panel.querySelector('.chat-messages');
        if (msgs && msgs.children.length === 0) {
          initializeChat();
        }
        setTimeout(() => inputElement.focus(), 100);
      } else {
        panel.style.display = 'none';
        if (hasInvoice) {
          toggleBtn.style.display = 'flex';
        } else {
          toggleBtn.style.display = 'none';
        }
      }
    });
  }

  chatPanel = panel;
  messagesArea = panel.querySelector('.chat-messages');
  suggestionsArea = panel.querySelector('.chat-suggestions');
  inputEl = panel.querySelector('.chat-input');

  // Track view & invoice changes to update chat context
  store.subscribeAll((state) => {
    const current = state.currentInvoice;
    const invId = (current && typeof current === 'object') ? (current.id || current.invoiceId) : (typeof current === 'string' ? current : null);
    const view = state.currentView || 'dashboard';
    const hasInvoices = state.invoices && state.invoices.length > 0;

    const toggleBtnEl = document.querySelector('.chat-toggle-btn');
    if (!invId && !hasInvoices) {
      if (toggleBtnEl) toggleBtnEl.style.display = 'none';
      if (chatPanel) chatPanel.style.display = 'none';
    } else if (!state.chatOpen) {
      if (toggleBtnEl) toggleBtnEl.style.display = 'flex';
    }

    if ((view !== lastView) || (view !== 'dashboard' && invId && invId !== lastActiveInvoiceId)) {
      lastView = view;
      lastActiveInvoiceId = invId;
      if (messagesArea) messagesArea.innerHTML = '';
      store.setState({ chatMessages: [] });
      if (state.chatOpen) {
        initializeChat();
      }
    }
  });

  // Sync initial state & visibility
  const hasInvoice = !!(store.getState().currentInvoice || (store.getState().invoices && store.getState().invoices.length > 0));
  if (hasInvoice) {
    if (store.getState().chatOpen) {
      chatPanel.style.display = 'flex';
      if (toggleBtn) toggleBtn.style.display = 'none';
      if (messagesArea && messagesArea.children.length === 0) {
        initializeChat();
      }
    } else {
      if (toggleBtn) toggleBtn.style.display = 'flex';
    }
  } else {
    if (toggleBtn) toggleBtn.style.display = 'none';
    if (chatPanel) chatPanel.style.display = 'none';
  }
}

function initializeChat() {
  const state = store.getState();
  const currentView = state.currentView || 'dashboard';
  const isProjectView = currentView === 'results' || currentView === 'approval' || currentView === 'analysis';
  const invoice = isProjectView ? state.currentInvoice : null;

  let initialMsg = '';
  let suggestions = [];

  if (!isProjectView || !invoice) {
    initialMsg = "Hi! I'm your AP Assistant. Select an invoice project below or click 'Upload' to start a new document review.";
    suggestions = ["Why was invoice #123 flagged?", "How does 3-way matching work?", "What exceptions can you find?"];
  } else if (invoice.exceptions && invoice.exceptions.length > 0) {
    const invId = invoice.id || invoice.invoiceId || 'INV-123';
    initialMsg = `Hi! I've started an AI review session for ${invId}. I found ${invoice.exceptions.length} exception(s) that need your attention. You can ask me:`;
    suggestions = [`Why was invoice ${invId} flagged?`, "What is the price difference?", "Which items don't match?", "Show me the source evidence"];
  } else {
    const invId = invoice.id || invoice.invoiceId || 'this invoice';
    initialMsg = `Hi! I've started an AI review session for ${invId}. All line items match the PO perfectly. Feel free to ask me anything.`;
    suggestions = [`Why was invoice ${invId} flagged?`, "Show me what matched", "Show me the line items"];
  }

  appendMessage('ai', initialMsg);
  updateSuggestions(suggestions);
}

function updateSuggestions(suggestions) {
  if (!suggestionsArea) suggestionsArea = document.querySelector('.chat-suggestions');
  if (!suggestionsArea) return;

  suggestionsArea.innerHTML = '';
  suggestions.forEach(text => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chat-suggestion-chip';
    chip.textContent = text;
    chip.addEventListener('click', () => {
      openChatWithQuestion(text);
    });
    suggestionsArea.appendChild(chip);
  });
}

export function openChatWithQuestion(question) {
  renderChat();
  store.setState({ chatOpen: true });
  if (chatPanel) chatPanel.style.display = 'flex';
  
  appendMessage('user', question);
  processUserMessage(question);
}

async function processUserMessage(text) {
  updateSuggestions([]);
  if (!messagesArea) messagesArea = document.querySelector('.chat-messages');
  if (!messagesArea) return;

  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'chat-message ai chat-typing';
  typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  messagesArea.appendChild(typingIndicator);
  scrollToBottom();

  const context = { invoice: store.getState().currentInvoice };
  
  try {
    const response = await provider.chat(text, context);
    typingIndicator.remove();
    
    appendMessage('ai', response.content, response.evidence, response.sourceLinks);
    if (response.suggestions) {
      updateSuggestions(response.suggestions);
    }
  } catch (error) {
    typingIndicator.remove();
    appendMessage('ai', "I'm sorry, I encountered an error processing your request.");
  }
}

function appendMessage(role, text, evidence = null, sourceLinks = null) {
  if (!messagesArea) messagesArea = document.querySelector('.chat-messages');
  if (!messagesArea) return;

  const msgEl = document.createElement('div');
  msgEl.className = `chat-message ${role}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'chat-message-content';
  msgEl.appendChild(contentDiv);

  messagesArea.appendChild(msgEl);
  scrollToBottom();

  if (role === 'ai') {
    // Live Word-by-Word Streaming Animation
    const words = text.split(' ');
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      if (currentIdx < words.length) {
        contentDiv.innerHTML = words.slice(0, currentIdx + 1).join(' ');
        currentIdx++;
        scrollToBottom();
      } else {
        clearInterval(interval);
        contentDiv.innerHTML = text;
        
        // Append evidence box
        if (evidence && evidence.length > 0) {
          const evDiv = document.createElement('div');
          evDiv.className = 'chat-message-evidence fadeInUp';
          evDiv.innerHTML = evidence.map(item => `<div class="evidence-item"><strong>${item.label}:</strong> ${item.value}</div>`).join('');
          msgEl.appendChild(evDiv);
        }

        // Append source links
        if (sourceLinks && sourceLinks.length > 0) {
          const linksDiv = document.createElement('div');
          linksDiv.className = 'chat-message-source-links fadeInUp';
          sourceLinks.forEach(link => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn-source-link';
            btn.textContent = link.label;
            btn.addEventListener('click', () => {
              const sourceData = link.data || {
                invoiceId: link.invoiceId || 'INV-123',
                poId: link.poId || 'PO-1001',
                item: link.item || 'Laptop (Dell Latitude 5540)',
                field: link.field || 'Unit Price',
                invoiceValue: link.invoiceValue || '₹55,000',
                poValue: link.poValue || '₹50,000',
                invoiceSource: link.invoiceSource || { page: 1, lineItem: 3, confidence: 0.95 },
                poSource: link.poSource || { page: 1, lineItem: 2, confidence: 0.98 }
              };
              openSourceViewer(sourceData);
            });
            linksDiv.appendChild(btn);
          });
          msgEl.appendChild(linksDiv);
        }

        scrollToBottom();
      }
    }, 15);
  } else {
    contentDiv.textContent = text;
  }

  const messages = store.getState().chatMessages || [];
  store.setState({ chatMessages: [...messages, { role, text, evidence, sourceLinks }] });
}

function scrollToBottom() {
  if (!messagesArea) messagesArea = document.querySelector('.chat-messages');
  if (messagesArea) {
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }
}

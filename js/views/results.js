import { store } from '../state.js';
import { navigateTo } from '../router.js';
import { sampleInvoices } from '../data/mock-data.js';
import { renderExceptionCard } from '../components/exception-card.js';
import { renderDataTable } from '../components/data-table.js';
import { renderChat } from '../components/chat.js';
import { showModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function renderResults(invoiceId) {
  const container = document.querySelector('#app-main');
  if (!container) return;

  const invoices = store.getState().invoices || [];
  let invoice = invoices.find(inv => inv.id === invoiceId);
  
  if (!invoice) {
    // Fallback to currentInvoice in store or sampleInvoices
    const current = store.getState().currentInvoice;
    if (current && current.id === invoiceId) {
      invoice = current;
    } else {
      invoice = sampleInvoices.find(inv => inv.id === invoiceId);
    }
  }
  
  if (invoice && invoice.analysisResult) {
    invoice = { ...invoice, ...invoice.analysisResult };
  }

  if (!invoice) {
    container.innerHTML = `
      <div class="results-container text-center py-5 fadeInUp">
        <h2>Invoice Not Found</h2>
        <p class="text-muted mt-2">The requested invoice ID "${invoiceId}" does not exist or has been deleted.</p>
        <button class="btn btn-primary mt-4" id="btn-back-dash">Back to Dashboard</button>
      </div>
    `;
    const backBtn = container.querySelector('#btn-back-dash');
    if (backBtn) backBtn.addEventListener('click', () => navigateTo('#/dashboard'));
    return;
  }

  const exceptions = invoice.exceptions || [];
  const matches = invoice.matches || [
    { field: "Vendor", invoiceValue: invoice.vendor, poValue: invoice.vendor, status: "match" },
    { field: "Currency", invoiceValue: "INR", poValue: "INR", status: "match" },
    { field: "Tax Rate", invoiceValue: "18%", poValue: "18%", status: "match" },
    { field: "PO Reference", invoiceValue: invoice.poId || "PO-1001", poValue: invoice.poId || "PO-1001", status: "match" }
  ];

  let headerMessage = "🎉 Good news! Everything matches the purchase order.";
  if (exceptions.length > 0) {
    headerMessage = `I found ${exceptions.length} thing${exceptions.length > 1 ? 's' : ''} that need your attention. The invoice doesn't completely match the purchase order.`;
  }

  container.innerHTML = `
    <div class="results-container pb-5">
      <div class="results-header fadeInUp">
        <div class="d-flex justify-content-between align-items-start">
          <h2>${headerMessage}</h2>
          <button class="btn btn-ghost btn-sm text-danger" id="btn-delete-invoice" title="Delete invoice">
            🗑️ Delete Invoice
          </button>
        </div>
        <div class="invoice-meta d-flex gap-3 mt-3">
          <span><strong>ID:</strong> ${invoice.id}</span>
          <span><strong>Vendor:</strong> ${invoice.vendor}</span>
          <span><strong>Date:</strong> ${invoice.date}</span>
          <span><strong>Amount:</strong> ${invoice.amount}</span>
        </div>
        <div class="summary-stats mt-3 d-flex gap-2">
          <span class="badge badge-success rounded-pill px-3 py-2">${matches.length} matches</span>
          ${exceptions.length > 0 ? `<span class="badge badge-warning rounded-pill px-3 py-2">${exceptions.length} exceptions</span>` : ''}
        </div>
      </div>

      <div class="matches-section mt-5 fadeInUp" style="animation-delay: 0.1s">
        <h3>What matched</h3>
        <ul class="match-list list-unstyled mt-3">
          ${matches.map((m, i) => {
            const text = typeof m === 'string' ? m : `${m.field} matches${m.invoiceValue ? ' (' + m.invoiceValue + ')' : ''}`;
            return `<li class="match-item mb-2 fadeInUp" style="animation-delay: ${0.2 + i * 0.1}s">✓ ${text}</li>`;
          }).join('')}
        </ul>
      </div>

      ${exceptions.length > 0 ? `
        <div class="exceptions-section mt-5 fadeInUp" style="animation-delay: 0.3s">
          <h3>Needs your attention</h3>
          <div id="exceptions-container" class="mt-3"></div>
        </div>
      ` : ''}

      <div class="line-items-section mt-5 fadeInUp" style="animation-delay: 0.4s">
        <h3>Line Items</h3>
        <div id="line-items-container" class="mt-3"></div>
      </div>

      <div class="action-bar mt-5 p-3 rounded bg-light d-flex gap-2 fadeInUp" style="animation-delay: 0.5s">
        <button class="btn btn-success" data-action="approve">Approve Invoice</button>
        <button class="btn btn-secondary" data-action="review">Request Review</button>
        <button class="btn btn-danger" data-action="reject">Reject/Flag</button>
      </div>

      <button class="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4 shadow-lg p-3" style="width: auto; border-radius: 30px !important; z-index: 1000;" id="btn-chat-toggle">🤖 Ask AI</button>
      <div id="chat-panel-container"></div>
    </div>
  `;

  // Exception cards
  if (exceptions.length > 0) {
    const exContainer = container.querySelector('#exceptions-container');
    exceptions.forEach(ex => {
      const exWrapper = document.createElement('div');
      exWrapper.className = 'mb-3';
      renderExceptionCard(ex, exWrapper);
      exContainer.appendChild(exWrapper);
    });
  }

  // Data table
  if (invoice.lineItems && invoice.lineItems.length > 0) {
    renderDataTable(invoice.lineItems, container.querySelector('#line-items-container'));
  }

  // Delete button
  const deleteBtn = container.querySelector('#btn-delete-invoice');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      const res = await showModal({
        title: `Delete Invoice ${invoice.id}?`,
        message: `Are you sure you want to delete ${invoice.id}? This action cannot be undone.`,
        icon: '🗑️',
        type: 'danger',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      });

      if (res.confirmed) {
        const currentInvoices = store.getState().invoices || [];
        const updated = currentInvoices.filter(inv => inv.id !== invoice.id);
        store.setState({ invoices: updated, currentInvoice: null });
        showToast(`✓ Invoice ${invoice.id} deleted`, 'info');
        navigateTo('#/dashboard');
      }
    });
  }

  // Action buttons
  container.querySelectorAll('.action-bar .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      navigateTo(`#/approval/${invoice.id}?action=${action}`);
    });
  });

  // Chat toggle
  const chatToggle = container.querySelector('#btn-chat-toggle');
  chatToggle.addEventListener('click', () => {
    store.setState({ chatOpen: true });
    renderChat(container.querySelector('#chat-panel-container'));
  });
}

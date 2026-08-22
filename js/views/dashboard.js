import { store } from '../state.js';
import { navigateTo } from '../router.js';
import { getDashboardStats } from '../data/mock-data.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';

export function renderDashboard() {
  const container = document.querySelector('#app-main');
  if (!container) return;
  container.innerHTML = '';

  const now = new Date();
  
  // Calculate Indian Standard Time (IST - Asia/Kolkata)
  const hourIST = parseInt(new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    hour12: false
  }).format(now), 10);

  let greeting = 'Good morning';

  if (hourIST >= 4 && hourIST < 12) {
    greeting = 'Good morning';
  } else if (hourIST >= 12 && hourIST < 17) {
    greeting = 'Good afternoon';
  } else if (hourIST >= 17 && hourIST < 22) {
    greeting = 'Good evening';
  } else {
    greeting = 'Working late? Good evening';
  }

  const invoices = store.getState().invoices || [];
  const stats = getDashboardStats(invoices);

  let html = `
    <div class="dashboard-container fadeInUp">
      <div class="greeting-section d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2>${greeting}</h2>
        </div>
        ${invoices.length > 0 ? `
          <button class="btn btn-secondary btn-sm" id="btn-clear-all" title="Delete all invoices">
            Clear All
          </button>
        ` : ''}
      </div>
  `;

  if (invoices.length > 0) {
    const hasRejected = stats.rejected > 0;
    html += `
      <div class="dashboard-stats">
        <div class="stat-card fadeInUp" style="animation-delay: 0.1s">
          <div class="stat-card-value">${stats.total}</div>
          <div class="stat-card-label">Total Invoices</div>
        </div>
        <div class="stat-card fadeInUp" style="animation-delay: 0.2s">
          <div class="stat-card-value">${stats.needsReview}</div>
          <div class="stat-card-label">Needs Review</div>
        </div>
        <div class="stat-card fadeInUp" style="animation-delay: 0.3s">
          <div class="stat-card-value">${stats.matched}</div>
          <div class="stat-card-label">Matched</div>
        </div>
        <div class="stat-card fadeInUp" style="animation-delay: 0.4s">
          <div class="stat-card-value">${hasRejected ? stats.rejected : stats.flagged}</div>
          <div class="stat-card-label">${hasRejected ? 'Rejected' : 'Flagged'}</div>
        </div>
      </div>

      <div class="recent-invoices fadeInUp" style="animation-delay: 0.5s">
        <div class="mb-3">
          <h3>Recent Invoices</h3>
        </div>
        <table class="invoices-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${invoices.map(inv => `
              <tr class="invoice-row" data-id="${inv.id}">
                <td><strong>${inv.id}</strong></td>
                <td>${inv.vendor}</td>
                <td>${inv.amount}</td>
                <td>${inv.date}</td>
                <td><span class="badge badge-${getBadgeClass(inv.status)}">${inv.status.replace('_', ' ')}</span></td>
                <td style="text-align: right;" onclick="event.stopPropagation();">
                  <button class="btn btn-ghost btn-sm btn-delete-row" data-id="${inv.id}" title="Delete ${inv.id}">
                    Delete
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="upload-cta-container mt-4 d-flex justify-content-center">
          <button class="btn btn-primary" id="btn-upload-new">Upload New Invoice</button>
        </div>
      </div>
    `;
  } else {
    html += `
      <div class="empty-state fadeInUp" style="animation-delay: 0.2s">
        <p class="empty-state-text">No invoices queued for review right now. Upload an invoice and its purchase order to get started.</p>
        <div class="d-flex justify-content-center">
          <button class="btn btn-primary" id="btn-upload-first">Upload Invoice & PO</button>
        </div>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;

  // Invoice row clicks to open details
  const invoiceRows = container.querySelectorAll('.invoice-row');
  invoiceRows.forEach(row => {
    row.addEventListener('click', () => {
      navigateTo('#/results/' + row.dataset.id);
    });
  });

  // Individual Delete buttons
  container.querySelectorAll('.btn-delete-row').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const res = await showModal({
        title: `Delete Invoice ${id}?`,
        message: `Are you sure you want to delete ${id}? This action cannot be undone.`,
        type: 'danger',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      });

      if (res.confirmed) {
        const currentInvoices = store.getState().invoices || [];
        const updated = currentInvoices.filter(inv => inv.id !== id);
        store.setState({ invoices: updated });
        showToast(`✓ Invoice ${id} deleted`, 'info');
        renderDashboard();
      }
    });
  });

  // Clear All button
  const clearAllBtn = container.querySelector('#btn-clear-all');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', async () => {
      const res = await showModal({
        title: 'Delete All Invoices?',
        message: 'Are you sure you want to remove all invoices from the workspace? You can upload new ones anytime.',
        type: 'danger',
        confirmText: 'Clear All',
        cancelText: 'Cancel'
      });

      if (res.confirmed) {
        store.setState({ invoices: [] });
        showToast('✓ All invoices removed', 'info');
        renderDashboard();
      }
    });
  }

  // Upload buttons
  const uploadBtn = container.querySelector('#btn-upload-new') || container.querySelector('#btn-upload-first');
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => navigateTo('#/upload'));
  }
}

function getBadgeClass(status) {
  if (status === 'matched') return 'success';
  if (status === 'needs_review' || status === 'flagged') return 'warning';
  if (status === 'rejected') return 'danger';
  return 'secondary';
}

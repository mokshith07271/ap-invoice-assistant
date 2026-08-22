import { store } from '../state.js';
import { navigateTo } from '../router.js';
import { getInvoiceById, sampleInvoices } from '../data/mock-data.js';
import { showToast } from '../components/toast.js';

export function renderApproval(invoiceId, action) {
  const container = document.querySelector('#app-main');
  if (!container) return;

  const invoices = store.getState().invoices || [];
  let invoice = invoices.find(inv => inv.id === invoiceId);
  
  if (!invoice) {
    const current = store.getState().currentInvoice;
    if (current && (current.id === invoiceId || current.invoiceId === invoiceId)) {
      invoice = current;
    } else {
      invoice = getInvoiceById(invoiceId, sampleInvoices);
    }
  }
  
  if (invoice && invoice.analysisResult) {
    invoice = { ...invoice, ...invoice.analysisResult };
  }

  if (!invoice) {
    container.innerHTML = `
      <div class="approval-container text-center py-5 fadeInUp">
        <h3>Invoice Not Found</h3>
        <p class="text-muted">The requested invoice ID "${invoiceId}" was not found.</p>
        <button class="btn btn-primary mt-3" id="btn-err-dash">Back to Dashboard</button>
      </div>
    `;
    const errBtn = container.querySelector('#btn-err-dash');
    if (errBtn) errBtn.addEventListener('click', () => navigateTo('#/'));
    return;
  }

  const exceptionsCount = invoice.exceptions ? invoice.exceptions.length : 0;
  let content = '';

  if (action === 'approve') {
    if (exceptionsCount > 0) {
      content = `
        <div class="card p-4 warning-card bg-warning bg-opacity-10 border-warning fadeInUp">
          <h3>Before approving: ⚠ ${exceptionsCount} exception(s) still need attention.</h3>
          <p>Are you sure you want to approve this invoice despite the price/quantity differences?</p>
          <div class="actions mt-4 d-flex gap-2">
            <button class="btn btn-secondary" id="btn-back">Go Back to Review</button>
            <button class="btn btn-success" id="btn-confirm">Approve Invoice</button>
          </div>
        </div>
      `;
    } else {
      content = `
        <div class="card p-4 fadeInUp border-0 shadow-sm">
          <h3>You're about to approve ${invoice.id}.</h3>
          <p>This will mark the invoice as verified and matched in Accounts Payable.</p>
          <div class="actions mt-4 d-flex gap-2">
            <button class="btn btn-secondary" id="btn-back">Go Back</button>
            <button class="btn btn-success" id="btn-confirm">Confirm Approval</button>
          </div>
        </div>
      `;
    }
  } else if (action === 'review') {
    content = `
      <div class="card p-4 border-0 shadow-sm fadeInUp">
        <h3>Request additional review for ${invoice.id}?</h3>
        <p>This will flag the invoice for a manager or procurement lead to review.</p>
        <textarea class="form-control mt-3 p-3" id="review-notes" placeholder="Add optional notes for the reviewer..." rows="3" style="width: 100%; background: #12151c; color: #fff; border: 1px solid #333; border-radius: 8px;"></textarea>
        <div class="actions mt-4 d-flex gap-2">
          <button class="btn btn-secondary" id="btn-back">Go Back</button>
          <button class="btn btn-primary" id="btn-confirm">Send for Review</button>
        </div>
      </div>
    `;
  } else if (action === 'reject') {
    content = `
      <div class="card p-4 border-danger shadow-sm fadeInUp">
        <h3 class="text-danger">You're about to reject ${invoice.id}.</h3>
        <p>Please provide a reason for rejecting this invoice.</p>
        <textarea class="form-control mt-3 p-3" id="reject-reason" placeholder="Required reason for rejection (e.g. Unapproved price overrun)..." rows="3" style="width: 100%; background: #12151c; color: #fff; border: 1px solid #333; border-radius: 8px;"></textarea>
        <div class="actions mt-4 d-flex gap-2">
          <button class="btn btn-secondary" id="btn-back">Go Back</button>
          <button class="btn btn-danger" id="btn-confirm">Reject Invoice</button>
        </div>
      </div>
    `;
  } else {
    content = `<div>Unknown action</div>`;
  }

  container.innerHTML = `
    <div class="approval-container p-4 max-w-600 mx-auto" style="max-width: 600px; margin: 40px auto;">
      ${content}
    </div>
  `;

  const btnBack = container.querySelector('#btn-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      navigateTo(`#/results/${invoiceId}`);
    });
  }

  const btnConfirm = container.querySelector('#btn-confirm');
  if (btnConfirm) {
    btnConfirm.addEventListener('click', () => {
      if (action === 'reject') {
        const reasonEl = container.querySelector('#reject-reason');
        const reason = reasonEl ? reasonEl.value : '';
        if (!reason.trim()) {
          alert("Please provide a reason for rejection.");
          return;
        }
      }

      let newStatus = 'matched';
      let successMsg = "";

      if (action === 'approve') {
        newStatus = 'matched';
        successMsg = `✓ Invoice ${invoice.id} approved successfully!`;
      } else if (action === 'review') {
        newStatus = 'needs_review';
        successMsg = `📋 Review requested for ${invoice.id}. Flagged for manager review.`;
      } else if (action === 'reject') {
        newStatus = 'rejected';
        successMsg = `✗ Invoice ${invoice.id} rejected. Decision recorded.`;
      }

      // Update both current invoice and the master invoices array in state
      const currentInvoices = store.getState().invoices || [];
      let updatedInvoices = currentInvoices.map(inv => {
        if (inv.id === invoice.id || inv.invoiceId === invoice.id) {
          return { ...inv, status: newStatus };
        }
        return inv;
      });

      // If invoice was not in list, add it
      if (!updatedInvoices.find(inv => inv.id === invoice.id)) {
        updatedInvoices = [{ ...invoice, status: newStatus }, ...updatedInvoices];
      }

      invoice.status = newStatus;
      store.setState({ 
        currentInvoice: invoice,
        invoices: updatedInvoices 
      });

      showToast(successMsg, action === 'reject' ? 'warning' : 'success');

      container.innerHTML = `
        <div class="success-state p-5 text-center fadeInUp" style="max-width: 600px; margin: 40px auto;">
          <div class="display-1 mb-3" style="font-size: 3rem;">${action === 'approve' ? '✅' : (action === 'review' ? '📋' : '❌')}</div>
          <h3 class="mb-4">${successMsg}</h3>
          <button class="btn btn-primary" id="btn-dashboard">Back to Dashboard</button>
        </div>
      `;

      const dashBtn = container.querySelector('#btn-dashboard');
      if (dashBtn) {
        dashBtn.addEventListener('click', () => {
          navigateTo('#/');
        });
      }
    });
  }
}

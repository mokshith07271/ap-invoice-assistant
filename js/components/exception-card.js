import { openSourceViewer } from './source-viewer.js';
import { openChatWithQuestion } from './chat.js';

export function renderExceptionCard(exception, container) {
  const card = document.createElement('div');
  const isError = exception.severity === 'high' || exception.severity === 'error';
  card.className = `exception-card card-accent-left ${isError ? 'error' : 'warning'} fade-in-up`;
  
  const icon = isError ? '❌' : '⚠';
  const typeLabel = exception.type || 'Value';

  card.innerHTML = `
    <div class="exception-header">
      <div class="exception-title">
        <span class="exception-icon">${icon}</span>
        ${typeLabel} difference
      </div>
      <span class="exception-badge ${isError ? 'badge-error' : 'badge-warning'}">${exception.severity || 'medium'}</span>
    </div>
    <div class="exception-body">
      <div class="exception-item"><strong>${exception.item || 'Unknown Item'}</strong></div>
      <div class="exception-grid">
        <div class="exception-row">
          <span>Invoice</span>
          <span class="value-right">${exception.invoiceValue || '-'}</span>
        </div>
        <div class="exception-row">
          <span>Purchase Order</span>
          <span class="value-right">${exception.poValue || '-'}</span>
        </div>
        <div class="exception-row diff-row">
          <span>Difference</span>
          <span class="value-right diff-value">
            ${exception.difference || '-'} 
            <span class="diff-percent">${exception.differencePercent ? '(' + exception.differencePercent + ')' : ''}</span>
          </span>
        </div>
      </div>
      <div class="exception-explanation" style="display: none;">
        <p class="text-muted">${exception.explanation || 'Values do not match between the invoice and purchase order.'}</p>
      </div>
    </div>
    <div class="exception-actions" style="display: none;">
      <button class="btn-ghost btn-view-source">View Source</button>
      <button class="btn-ghost btn-ask-ai">Ask AI</button>
    </div>
  `;

  let expanded = false;
  const body = card.querySelector('.exception-body');
  const explanation = card.querySelector('.exception-explanation');
  const actions = card.querySelector('.exception-actions');

  body.addEventListener('click', (e) => {
    // Don't toggle if clicking on a button
    if (e.target.tagName.toLowerCase() === 'button') return;
    expanded = !expanded;
    explanation.style.display = expanded ? 'block' : 'none';
    actions.style.display = expanded ? 'flex' : 'none';
  });

  card.querySelector('.btn-view-source').addEventListener('click', (e) => {
    e.stopPropagation();
    openSourceViewer({
      invoiceId: exception.invoiceId,
      poId: exception.poId,
      item: exception.item,
      field: exception.field,
      invoiceValue: exception.invoiceValue,
      poValue: exception.poValue,
      invoiceSource: exception.invoiceSource,
      poSource: exception.poSource
    });
  });

  card.querySelector('.btn-ask-ai').addEventListener('click', (e) => {
    e.stopPropagation();
    const q = `Why is the ${exception.item} ${exception.field || 'value'} different between ${exception.invoiceId || 'the invoice'} and ${exception.poId || 'the PO'}?`;
    openChatWithQuestion(q);
  });

  container.appendChild(card);
}

export function renderSourceViewer() {
  const container = document.createElement('div');
  container.id = 'source-viewer-container';
  document.body.appendChild(container);
}

export function openSourceViewer(data) {
  const container = document.getElementById('source-viewer-container') || document.body;
  
  const overlay = document.createElement('div');
  overlay.className = 'source-panel-backdrop fade-in';
  
  const panel = document.createElement('div');
  panel.className = 'source-panel slide-in-left';
  
  const { invoiceId, poId, item, field, invoiceValue, poValue, invoiceSource, poSource } = data;

  const renderConfidence = (conf) => {
    if (typeof conf !== 'number') return '';
    const confPercent = Math.round(conf * 100);
    const isLow = confPercent < 80;
    return `
      <div class="source-confidence ${isLow ? 'warning' : ''}">
        <div class="confidence-bar-bg">
          <div class="confidence-bar-fill" style="width: ${confPercent}%"></div>
        </div>
        <span class="confidence-text">${confPercent}% Match Confidence</span>
        ${isLow ? '<div class="confidence-warning">I am not completely confident about this value. Please verify.</div>' : ''}
      </div>
    `;
  };

  panel.innerHTML = `
    <div class="source-panel-header">
      <h2>Source Evidence</h2>
      <button class="source-panel-close">✕</button>
    </div>
    <div class="source-panel-content">
      <div class="source-section">
        <div class="source-section-title">📄 Invoice ${invoiceId || 'Document'}</div>
        <div class="source-page-ref">Page ${invoiceSource?.page || 1}</div>
        <div class="source-field-label">Line Item: ${item || 'N/A'}</div>
        <div class="source-field">Field: ${field || 'N/A'}</div>
        <div class="source-field-value">${invoiceValue || 'N/A'}</div>
        ${renderConfidence(invoiceSource?.confidence)}
      </div>

      <div class="source-section">
        <div class="source-section-title">📄 Purchase Order ${poId || 'Document'}</div>
        <div class="source-page-ref">Page ${poSource?.page || 1}</div>
        <div class="source-field-label">Line Item: ${item || 'N/A'}</div>
        <div class="source-field">Field: ${field || 'N/A'}</div>
        <div class="source-field-value">${poValue || 'N/A'}</div>
        ${renderConfidence(poSource?.confidence)}
      </div>

      <div class="source-comparison-summary">
        <h3>Comparison</h3>
        <div class="comparison-grid">
          <div>
            <div class="comparison-label">Invoice</div>
            <div class="comparison-val ${invoiceValue !== poValue ? 'highlight' : ''}">${invoiceValue}</div>
          </div>
          <div>
            <div class="comparison-label">PO</div>
            <div class="comparison-val">${poValue}</div>
          </div>
        </div>
      </div>
    </div>
  `;

  overlay.appendChild(panel);
  container.appendChild(overlay);

  const closeViewer = () => {
    panel.classList.replace('slide-in-left', 'slide-out-left');
    overlay.classList.replace('fade-in', 'fade-out');
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 300);
  };

  panel.querySelector('.source-panel-close').addEventListener('click', closeViewer);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeViewer();
  });
}

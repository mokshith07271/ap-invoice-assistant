import { store } from '../state.js';
import { navigateTo } from '../router.js';
import { renderFileUpload } from '../components/file-upload.js';
import { showToast } from '../components/toast.js';

export function renderUpload() {
  const container = document.querySelector('#app-main');
  if (!container) return;
  
  let currentStep = 1;

  function renderStep() {
    container.innerHTML = `
      <div class="upload-container fadeInUp">
        <div class="upload-stepper">
          <div class="upload-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}">Upload Invoice</div>
          <div class="upload-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}">Upload Purchase Order</div>
          <div class="upload-step ${currentStep >= 3 ? 'active' : ''}">Ready to Analyze</div>
        </div>
        <div class="upload-step-content" id="upload-step-content"></div>
      </div>
    `;

    const contentContainer = container.querySelector('#upload-step-content');

    if (currentStep === 1) {
      contentContainer.innerHTML = `
        <div class="step-message fadeInUp">Let's start by uploading your invoice.</div>
        <div id="invoice-upload-zone" class="fadeInUp" style="animation-delay: 0.1s"></div>
      `;
      renderFileUpload('#invoice-upload-zone', {
        accept: '.pdf,.png,.jpg,.jpeg',
        label: 'Drop your invoice here',
        icon: '📄',
        formats: 'PDF • PNG • JPG',
        onFileSelected: (fileInfo) => {
          store.setState({ uploadedInvoice: fileInfo });
          showToast('✓ Invoice received', 'success'); 
          currentStep = 2;
          renderStep();
        }
      });
    } else if (currentStep === 2) {
      contentContainer.innerHTML = `
        <div class="step-message fadeInUp">Great! Now upload the matching purchase order.</div>
        <div id="po-upload-zone" class="fadeInUp" style="animation-delay: 0.1s"></div>
        <div class="step-actions mt-3 fadeInUp" style="animation-delay: 0.2s">
            <button class="btn btn-secondary" id="btn-back-1">Back</button>
        </div>
      `;
      renderFileUpload('#po-upload-zone', {
        accept: '.pdf,.png,.jpg,.jpeg',
        label: 'Drop your PO here',
        icon: '📋',
        formats: 'PDF • PNG • JPG',
        onFileSelected: (fileInfo) => {
          store.setState({ uploadedPO: fileInfo });
          showToast('✓ Purchase order received', 'success'); 
          currentStep = 3;
          renderStep();
        }
      });
      container.querySelector('#btn-back-1').addEventListener('click', () => { currentStep = 1; renderStep(); });
    } else if (currentStep === 3) {
      const state = store.getState();
      contentContainer.innerHTML = `
        <div class="step-message fadeInUp">I've received both documents. I'll now compare the invoice with the purchase order and look for quantity, price, tax, and other exceptions.</div>
        <div class="file-previews fadeInUp" style="animation-delay: 0.1s">
          <div class="file-preview">📄 Invoice: ${state.uploadedInvoice?.name || 'Invoice.pdf'}</div>
          <div class="file-preview">📋 PO: ${state.uploadedPO?.name || 'PO.pdf'}</div>
        </div>
        <div class="step-actions mt-3 fadeInUp" style="animation-delay: 0.2s">
          <button class="btn btn-secondary" id="btn-back-2">Back</button>
          <button class="btn btn-primary" id="btn-analyze">Analyze Documents</button>
        </div>
      `;
      container.querySelector('#btn-back-2').addEventListener('click', () => { currentStep = 2; renderStep(); });
      container.querySelector('#btn-analyze').addEventListener('click', () => navigateTo('#/analysis'));
    }
  }

  renderStep();
}

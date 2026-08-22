import { store } from '../state.js';
import { navigateTo } from '../router.js';
import { createAIProvider } from '../ai-provider.js';

export function renderAnalysis() {
  const container = document.querySelector('#app-main');
  if (!container) return;

  const steps = [
    { title: "Reading invoice", detail: "Extracting text and data", delay: 800, msg: "I'm reading the invoice now..." },
    { title: "Extracting line items", detail: "Identifying products, quantities, prices", delay: 1200, msg: "I've found some line items. Let me extract the details..." },
    { title: "Reading purchase order", detail: "Loading PO details", delay: 600, msg: "Now reading the purchase order..." },
    { title: "Comparing quantities and prices", detail: "Checking each line item", delay: 1500, msg: "Comparing the quantities and prices..." },
    { title: "Checking tax and totals", detail: "Verifying tax rates and amounts", delay: 800, msg: "Almost done. Checking tax calculations..." },
    { title: "Preparing your review", detail: "Generating summary", delay: 600, msg: "Wrapping things up..." }
  ];

  container.innerHTML = `
    <div class="analysis-container fadeInUp">
      <h2 class="analysis-message" id="ai-message">Analyzing your documents...</h2>
      <div class="analysis-stepper" id="stepper-container">
        ${steps.map((step, idx) => `
          <div class="analysis-step pending" id="step-${idx}">
            <div class="analysis-step-icon">○</div>
            <div class="analysis-step-text">
              <div class="step-title">${step.title}</div>
              <div class="step-detail">${step.detail}</div>
            </div>
            ${idx < steps.length - 1 ? '<div class="analysis-step-line"></div>' : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  let currentStepIdx = 0;
  const aiMessageEl = container.querySelector('#ai-message');

  function runNextStep() {
    if (currentStepIdx > 0) {
      const prevStepEl = container.querySelector(`#step-${currentStepIdx - 1}`);
      prevStepEl.classList.remove('active', 'pending');
      prevStepEl.classList.add('completed');
      prevStepEl.querySelector('.analysis-step-icon').textContent = '✓';
    }

    if (currentStepIdx < steps.length) {
      const step = steps[currentStepIdx];
      const stepEl = container.querySelector(`#step-${currentStepIdx}`);
      stepEl.classList.remove('pending');
      stepEl.classList.add('active');
      stepEl.querySelector('.analysis-step-icon').textContent = '⟳';
      
      aiMessageEl.textContent = step.msg;

      setTimeout(() => {
        currentStepIdx++;
        runNextStep();
      }, step.delay);
    } else {
      aiMessageEl.textContent = "All done! Let me show you what I found.";
      finishAnalysis();
    }
  }

  async function finishAnalysis() {
    try {
      const provider = createAIProvider();
      const result = await provider.analyzeDocuments();
      store.setState({ currentInvoice: result, analysisStatus: 'completed' });
      
      const invoices = store.getState().invoices || [];
      if (!invoices.find(i => i.id === result.id)) {
        store.setState({ invoices: [result, ...invoices] });
      }

      setTimeout(() => {
        navigateTo('#/results/' + (result.id || 'INV-123'));
      }, 800);
    } catch (e) {
      aiMessageEl.textContent = "Oops, something went wrong.";
      const btn = document.createElement('button');
      btn.textContent = "Try Again";
      btn.className = "btn btn-primary mt-3";
      btn.onclick = () => renderAnalysis();
      container.appendChild(btn);
    }
  }

  setTimeout(runNextStep, 500);
}

import { openSourceViewer } from './source-viewer.js';
import { openChatWithQuestion } from './chat.js';

export function renderDataTable(lineItems, container) {
  container.innerHTML = '';
  
  const wrapper = document.createElement('div');
  wrapper.className = 'data-table-wrapper';

  const filterContainer = document.createElement('div');
  filterContainer.className = 'data-table-filters';
  
  const filters = ['All', 'Matches', 'Mismatches'];
  let currentFilter = 'All';
  let sortCol = null;
  let sortAsc = true;

  const renderContent = () => {
    wrapper.innerHTML = '';
    
    // Setup tabs
    const tabsRow = document.createElement('div');
    tabsRow.className = 'data-table-tabs';
    filters.forEach(f => {
      const btn = document.createElement('button');
      btn.className = `tab-btn ${currentFilter === f ? 'active' : ''}`;
      btn.textContent = f;
      btn.addEventListener('click', () => {
        currentFilter = f;
        renderContent();
      });
      tabsRow.appendChild(btn);
    });
    wrapper.appendChild(tabsRow);

    const table = document.createElement('table');
    table.className = 'data-table';
    
    const thead = document.createElement('thead');
    const cols = [
      { key: 'item', label: 'Item' },
      { key: 'invoiceQty', label: 'Invoice Qty' },
      { key: 'poQty', label: 'PO Qty' },
      { key: 'invoicePrice', label: 'Invoice Price' },
      { key: 'poPrice', label: 'PO Price' },
      { key: 'status', label: 'Status' }
    ];

    const trHead = document.createElement('tr');
    cols.forEach(c => {
      const th = document.createElement('th');
      th.textContent = c.label;
      if (sortCol === c.key) {
        th.textContent += sortAsc ? ' ↑' : ' ↓';
      }
      th.addEventListener('click', () => {
        if (sortCol === c.key) {
          sortAsc = !sortAsc;
        } else {
          sortCol = c.key;
          sortAsc = true;
        }
        renderContent();
      });
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    
    let filteredItems = lineItems;
    if (currentFilter === 'Matches') {
      filteredItems = lineItems.filter(i => i.status === 'match');
    } else if (currentFilter === 'Mismatches') {
      filteredItems = lineItems.filter(i => i.status !== 'match');
    }

    if (sortCol) {
      filteredItems.sort((a, b) => {
        let valA = a[sortCol];
        let valB = b[sortCol];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    filteredItems.forEach(item => {
      const tr = document.createElement('tr');
      tr.className = item.status === 'mismatch' ? 'row-mismatch' : 'row-match';
      
      const statusIcon = item.status === 'match' ? '<span style="color: green;">✓</span>' : '<span style="color: orange;">⚠</span>';
      
      tr.innerHTML = `
        <td>${item.item}</td>
        <td>${item.invoiceQty}</td>
        <td>${item.poQty}</td>
        <td>${item.invoicePrice}</td>
        <td>${item.poPrice}</td>
        <td>${statusIcon}</td>
      `;

      const detailTr = document.createElement('tr');
      detailTr.className = 'row-detail';
      detailTr.style.display = 'none';
      const detailTd = document.createElement('td');
      detailTd.colSpan = 6;
      
      detailTd.innerHTML = `
        <div class="row-detail-card">
          <h4>${item.item} Details</h4>
          <div class="detail-grid">
            <div class="detail-col">
              <strong>Invoice</strong>
              <div>Qty: ${item.invoiceQty}</div>
              <div>Price: ${item.invoicePrice}</div>
              <div>Total: ${item.invoiceTotal || '-'}</div>
            </div>
            <div class="detail-col">
              <strong>PO</strong>
              <div>Qty: ${item.poQty}</div>
              <div>Price: ${item.poPrice}</div>
              <div>Total: ${item.poTotal || '-'}</div>
            </div>
          </div>
          <div class="detail-actions">
            <button class="btn-ghost btn-view-source">View Source</button>
            <button class="btn-ghost btn-ask-ai">Ask AI</button>
          </div>
        </div>
      `;

      detailTd.querySelector('.btn-view-source').addEventListener('click', () => {
        openSourceViewer({
          item: item.item,
          invoiceValue: item.invoicePrice,
          poValue: item.poPrice,
          field: 'Price'
        });
      });

      detailTd.querySelector('.btn-ask-ai').addEventListener('click', () => {
        openChatWithQuestion(`Tell me about the line item "${item.item}".`);
      });

      detailTr.appendChild(detailTd);

      tr.addEventListener('click', () => {
        const isExpanded = detailTr.style.display === 'table-row';
        detailTr.style.display = isExpanded ? 'none' : 'table-row';
      });

      tbody.appendChild(tr);
      tbody.appendChild(detailTr);
    });

    table.appendChild(tbody);
    wrapper.appendChild(table);
  };

  renderContent();
  container.appendChild(wrapper);
}

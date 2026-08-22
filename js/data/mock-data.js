export const sampleInvoices = [
  {
    id: 'INV-123',
    vendor: 'Dell Suppliers',
    poId: 'PO-1001',
    date: '2026-08-15',
    amount: '₹8,39,832',
    status: 'needs_review',
    exceptionCount: 2,
    matchCount: 4,
    analysisResult: {
      invoiceId: 'INV-123',
      poId: 'PO-1001',
      vendor: 'Dell Suppliers',
      invoiceDate: '2026-08-15',
      invoiceAmount: '₹7,52,400',
      currency: 'INR',
      matches: [
        { field: 'Vendor', invoiceValue: 'Dell Suppliers', poValue: 'Dell Suppliers', status: 'match' },
        { field: 'Currency', invoiceValue: 'INR', poValue: 'INR', status: 'match' },
        { field: 'Tax Rate', invoiceValue: '18%', poValue: '18%', status: 'match' },
        { field: 'PO Reference', invoiceValue: 'PO-1001', poValue: 'PO-1001', status: 'match' },
      ],
      exceptions: [
        {
          id: 'exc-1',
          type: 'price',
          severity: 'warning',
          item: 'Laptop (Dell Latitude 5540)',
          field: 'Unit Price',
          invoiceValue: '₹55,000',
          poValue: '₹50,000',
          difference: '₹5,000 per unit',
          differencePercent: '+10%',
          explanation: 'The invoice unit price for the laptop is ₹5,000 higher than the agreed purchase order price. This could indicate a price revision or an error.',
          invoiceSource: { page: 1, lineItem: 3, confidence: 0.95 },
          poSource: { page: 1, lineItem: 2, confidence: 0.98 },
        },
        {
          id: 'exc-2',
          type: 'quantity',
          severity: 'warning',
          item: 'Laptop (Dell Latitude 5540)',
          field: 'Quantity',
          invoiceValue: '12',
          poValue: '10',
          difference: '+2 units',
          differencePercent: '+20%',
          explanation: 'The invoice lists 12 laptop units, but the purchase order only authorized 10 units. The 2 extra units may need additional approval.',
          invoiceSource: { page: 1, lineItem: 3, confidence: 0.92 },
          poSource: { page: 1, lineItem: 2, confidence: 0.97 },
        },
      ],
      lineItems: [
        { item: 'Laptop (Dell Latitude 5540)', invoiceQty: 12, poQty: 10, invoicePrice: '₹55,000', poPrice: '₹50,000', invoiceTotal: '₹6,60,000', poTotal: '₹5,00,000', status: 'mismatch' },
        { item: 'Wireless Mouse', invoiceQty: 20, poQty: 20, invoicePrice: '₹500', poPrice: '₹500', invoiceTotal: '₹10,000', poTotal: '₹10,000', status: 'match' },
        { item: 'Mechanical Keyboard', invoiceQty: 10, poQty: 10, invoicePrice: '₹2,500', poPrice: '₹2,500', invoiceTotal: '₹25,000', poTotal: '₹25,000', status: 'match' },
        { item: 'USB-C Monitor Stand', invoiceQty: 5, poQty: 5, invoicePrice: '₹3,200', poPrice: '₹3,200', invoiceTotal: '₹16,000', poTotal: '₹16,000', status: 'match' },
      ],
      summary: {
        totalInvoiceAmount: '₹8,39,832',
        totalPOAmount: '₹6,50,180',
        taxRate: '18%',
        taxAmount: '₹1,28,832',
        subtotalDifference: '₹1,89,652',
      }
    }
  },
  {
    id: 'INV-124',
    vendor: 'ABC Supplies',
    poId: 'PO-1002',
    date: '2026-08-14',
    amount: '₹1,25,000',
    status: 'matched',
    exceptionCount: 0,
    matchCount: 5,
    analysisResult: {
      invoiceId: 'INV-124',
      poId: 'PO-1002',
      vendor: 'ABC Supplies',
      invoiceDate: '2026-08-14',
      invoiceAmount: '₹1,25,000',
      currency: 'INR',
      matches: [
        { field: 'Vendor', invoiceValue: 'ABC Supplies', poValue: 'ABC Supplies', status: 'match' },
        { field: 'Currency', invoiceValue: 'INR', poValue: 'INR', status: 'match' },
        { field: 'Tax Rate', invoiceValue: '18%', poValue: '18%', status: 'match' },
        { field: 'PO Reference', invoiceValue: 'PO-1002', poValue: 'PO-1002', status: 'match' },
        { field: 'Delivery Date', invoiceValue: '2026-08-10', poValue: '2026-08-10', status: 'match' },
      ],
      exceptions: [],
      lineItems: [
        { item: 'Office Chairs', invoiceQty: 5, poQty: 5, invoicePrice: '₹18,000', poPrice: '₹18,000', invoiceTotal: '₹90,000', poTotal: '₹90,000', status: 'match' },
        { item: 'Desk Lamps', invoiceQty: 10, poQty: 10, invoicePrice: '₹2,500', poPrice: '₹2,500', invoiceTotal: '₹25,000', poTotal: '₹25,000', status: 'match' },
        { item: 'Stationery Kit', invoiceQty: 25, poQty: 25, invoicePrice: '₹200', poPrice: '₹200', invoiceTotal: '₹5,000', poTotal: '₹5,000', status: 'match' }
      ],
      summary: {
        totalInvoiceAmount: '₹1,25,000',
        totalPOAmount: '₹1,25,000',
        taxRate: '18%',
        taxAmount: '₹19,067',
        subtotalDifference: '₹0',
      }
    }
  },
  {
    id: 'INV-125',
    vendor: 'XYZ Corp',
    poId: 'PO-1003',
    date: '2026-08-13',
    amount: '₹3,45,600',
    status: 'needs_review',
    exceptionCount: 1,
    matchCount: 4,
    analysisResult: {
      invoiceId: 'INV-125',
      poId: 'PO-1003',
      vendor: 'XYZ Corp',
      invoiceDate: '2026-08-13',
      invoiceAmount: '₹3,45,600',
      currency: 'INR',
      matches: [
        { field: 'Vendor', invoiceValue: 'XYZ Corp', poValue: 'XYZ Corp', status: 'match' },
        { field: 'Currency', invoiceValue: 'INR', poValue: 'INR', status: 'match' },
        { field: 'Tax Rate', invoiceValue: '18%', poValue: '18%', status: 'match' },
        { field: 'PO Reference', invoiceValue: 'PO-1003', poValue: 'PO-1003', status: 'match' },
      ],
      exceptions: [
        {
          id: 'exc-3',
          type: 'quantity',
          severity: 'warning',
          item: 'Printer Cartridges',
          field: 'Quantity',
          invoiceValue: '50',
          poValue: '40',
          difference: '+10 units',
          differencePercent: '+25%',
          explanation: 'The invoice lists 50 printer cartridges, but the purchase order authorized 40 units.',
          invoiceSource: { page: 1, lineItem: 1, confidence: 0.99 },
          poSource: { page: 1, lineItem: 1, confidence: 0.98 },
        }
      ],
      lineItems: [
        { item: 'Printer Cartridges', invoiceQty: 50, poQty: 40, invoicePrice: '₹800', poPrice: '₹800', invoiceTotal: '₹40,000', poTotal: '₹32,000', status: 'mismatch' },
        { item: 'A4 Paper Reams', invoiceQty: 100, poQty: 100, invoicePrice: '₹350', poPrice: '₹350', invoiceTotal: '₹35,000', poTotal: '₹35,000', status: 'match' },
        { item: 'Binding Supplies', invoiceQty: 20, poQty: 20, invoicePrice: '₹450', poPrice: '₹450', invoiceTotal: '₹9,000', poTotal: '₹9,000', status: 'match' }
      ],
      summary: {
        totalInvoiceAmount: '₹99,120',
        totalPOAmount: '₹89,680',
        taxRate: '18%',
        taxAmount: '₹15,120',
        subtotalDifference: '₹8,000',
      }
    }
  }
];

/**
 * Retrieve a specific invoice by its ID from a given array or sample data
 */
export function getInvoiceById(id, list = null) {
  const invoices = list || sampleInvoices;
  return invoices.find(invoice => invoice.id === id);
}

/**
 * Get aggregated statistics for an array of invoices
 */
export function getDashboardStats(list = []) {
  const invoices = list || [];
  return {
    total: invoices.length,
    needsReview: invoices.filter(i => i.status === 'needs_review' || i.status === 'flagged').length,
    matched: invoices.filter(i => i.status === 'matched').length,
    flagged: invoices.filter(i => i.status === 'flagged').length,
  };
}

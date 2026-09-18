import { DeliveryOrder, CustomerProfile } from '@/types/delivery';

export function generateInvoiceHTML(order: DeliveryOrder, customer?: CustomerProfile | null): string {
  const trackingNo = order.trackingNumber || order.id;
  const customerName = customer ? `${customer.firstName} ${customer.lastName}` : (order.receiver?.fullName || 'Valued Consignee');
  const customerPhone = customer?.phone || order.receiver?.phone || '+234 803 456 7890';
  const customerEmail = customer?.email || 'client@swiftlogistics.ng';
  const customerAddress = order.receiver?.address ? `${order.receiver.address}, ${order.receiver.city}` : (order.destinationAddress || 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos');
  const originAddress = order.sender?.address ? `${order.sender.address}, ${order.sender.city}` : (order.originAddress || 'Mainland Regional Distribution Depot, Ikeja, Lagos');
  
  const payment = order.payment || order.paymentDetails || {
    subtotal: 12500,
    deliveryFee: 2500,
    serviceFee: 500,
    vat: 1125,
    insurance: 1500,
    discount: 0,
    total: 17625,
    isPaid: false,
    paidDate: '',
  };

  const isPaid = payment.isPaid ?? false;
  const itemDesc = order.packageInfo?.description || order.itemDescription || 'Priority Commercial Cargo Consignment';
  const category = order.packageInfo?.category || order.packageCategory || 'Express Delivery';
  const weight = order.packageInfo?.weight || order.weightKg || 3.2;

  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const subtotal = payment.subtotal || payment.baseFare || 12500;
  const deliveryFee = payment.deliveryFee || payment.distanceFare || 2500;
  const serviceFee = payment.serviceFee || payment.weightFare || 500;
  const insurance = payment.insurance || 1500;
  const discount = payment.discount || 0;
  const vat = payment.vat || Math.round((subtotal + deliveryFee + serviceFee + insurance) * 0.075);
  const total = payment.total || (subtotal + deliveryFee + serviceFee + insurance + vat - discount);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Swift Logistics - Official Tax Invoice ${trackingNo}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #ffffff;
      color: #0f172a;
      padding: 40px;
      font-size: 13px;
      line-height: 1.5;
    }

    .invoice-container {
      max-width: 820px;
      margin: 0 auto;
      border: 1px solid #e2e8f0;
      padding: 44px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      position: relative;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }

    .brand h1 {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand .badge {
      display: inline-block;
      background: #10b981;
      color: #ffffff;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .company-sub {
      color: #64748b;
      font-size: 11px;
      margin-top: 6px;
      line-height: 1.45;
    }

    .inv-meta {
      text-align: right;
    }

    .inv-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .inv-number {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      color: #059669;
      font-size: 14px;
      margin-top: 4px;
    }

    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 28px;
      background: #f8fafc;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #edf2f7;
    }

    .party-title {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 6px;
    }

    .party-name {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
    }

    .party-detail {
      font-size: 12px;
      color: #475569;
      line-height: 1.45;
    }

    .waybill-strip {
      background: #0f172a;
      color: #ffffff;
      border-radius: 10px;
      padding: 14px 18px;
      margin-bottom: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .strip-item label {
      display: block;
      font-size: 9px;
      text-transform: uppercase;
      color: #94a3b8;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 3px;
    }

    .strip-item .value {
      font-size: 13px;
      font-weight: 700;
      color: #f8fafc;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      margin-bottom: 24px;
    }

    th {
      background: #f1f5f9;
      padding: 11px 14px;
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e2e8f0;
    }

    td {
      padding: 12px 14px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 12.5px;
      color: #334155;
    }

    .item-desc {
      font-weight: 600;
      color: #0f172a;
    }

    .item-sub {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }

    .text-right {
      text-align: right;
    }

    .summary-grid {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 24px;
    }

    .summary-box {
      width: 320px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 9px 14px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 12px;
    }

    .summary-row.total-row {
      background: #0f172a;
      color: #ffffff;
      padding: 13px 14px;
      font-size: 14px;
      font-weight: 800;
    }

    .stamp-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px dashed #cbd5e1;
      padding-top: 20px;
      margin-top: 20px;
    }

    .stamp {
      border: 2px solid ${isPaid ? '#059669' : '#d97706'};
      color: ${isPaid ? '#059669' : '#d97706'};
      padding: 6px 16px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      display: inline-block;
      transform: rotate(-2deg);
    }

    .barcode-block {
      text-align: right;
    }

    .barcode-svg {
      font-family: monospace;
      font-size: 16px;
      letter-spacing: 3px;
      font-weight: bold;
      color: #0f172a;
    }

    .footer-note {
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
      margin-top: 28px;
      line-height: 1.5;
    }

    @media print {
      body {
        padding: 0;
        background: none;
      }
      .invoice-container {
        border: none;
        box-shadow: none;
        padding: 16px;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header-row">
      <div class="brand">
        <h1>SWIFT LOGISTICS <span class="badge">NIGERIA</span></h1>
        <div class="company-sub">
          <strong>Swift Logistics Nigeria Limited</strong> • RC: 1892842<br>
          Federal Inland Revenue Service (FIRS) TIN: 24891029-0001<br>
          Headquarters: Plot 14 Admiralty Way, Lekki Phase 1, Lagos State<br>
          Customer Service: +234 800 794 3853 • support@swiftlogistics.ng
        </div>
      </div>
      <div class="inv-meta">
        <div class="inv-title">TAX INVOICE</div>
        <div class="inv-number">INV-2026-${trackingNo}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Date: ${dateStr}</div>
        <div style="font-size: 11px; font-weight: 700; color: ${isPaid ? '#059669' : '#d97706'}; margin-top: 2px;">
          ${isPaid ? 'PAID IN FULL' : 'PAYMENT PENDING'}
        </div>
      </div>
    </div>

    <div class="parties-grid">
      <div>
        <div class="party-title">Consignee (Deliver To)</div>
        <div class="party-name">${customerName}</div>
        <div class="party-detail">${customerAddress}</div>
        <div class="party-detail">Tel: ${customerPhone}</div>
        <div class="party-detail">Email: ${customerEmail}</div>
      </div>
      <div>
        <div class="party-title">Origin Logistics Bay</div>
        <div class="party-name">Swift Regional Hub</div>
        <div class="party-detail">${originAddress}</div>
        <div class="party-detail">Driver: ${order.driver?.name || 'Assigned Courier'} (${order.driver?.vehiclePlate || 'Fleet Van'})</div>
        <div class="party-detail">ETA: ${order.estimatedDelivery || 'Today'}</div>
      </div>
    </div>

    <div class="waybill-strip">
      <div class="strip-item">
        <label>Waybill No.</label>
        <div class="value" style="font-family: monospace; font-size: 13px;">${trackingNo}</div>
      </div>
      <div class="strip-item">
        <label>Classification</label>
        <div class="value">${category}</div>
      </div>
      <div class="strip-item">
        <label>Weight</label>
        <div class="value">${weight} KG</div>
      </div>
      <div class="strip-item">
        <label>Transit Cover</label>
        <div class="value" style="color: #34d399;">₦2,500,000 Insured</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Service Item & Description</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Rate (₦)</th>
          <th class="text-right">Amount (₦)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="item-desc">${itemDesc}</div>
            <div class="item-sub">Priority Express Freight Handling • Origin to Destination Handover</div>
          </td>
          <td class="text-right">1</td>
          <td class="text-right">${subtotal.toLocaleString()}</td>
          <td class="text-right">${subtotal.toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <div class="item-desc">Intra-State / Interstate Express Transit</div>
            <div class="item-sub">Real-time GPS Telemetry & Secure Handover</div>
          </td>
          <td class="text-right">1</td>
          <td class="text-right">${deliveryFee.toLocaleString()}</td>
          <td class="text-right">${deliveryFee.toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <div class="item-desc">Logistics Handling & Platform Security</div>
            <div class="item-sub">Cloud dispatch, OTP gate pass validation</div>
          </td>
          <td class="text-right">1</td>
          <td class="text-right">${serviceFee.toLocaleString()}</td>
          <td class="text-right">${serviceFee.toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <div class="item-desc">Cargo Protection & Indemnity Policy</div>
            <div class="item-sub">Up to ₦2,500,000 compensation guarantee</div>
          </td>
          <td class="text-right">1</td>
          <td class="text-right">${insurance.toLocaleString()}</td>
          <td class="text-right">${insurance.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    <div class="summary-grid">
      <div class="summary-box">
        <div class="summary-row">
          <span style="color: #64748b;">Gross Subtotal:</span>
          <strong>₦${(subtotal + deliveryFee + serviceFee + insurance).toLocaleString()}</strong>
        </div>
        ${discount > 0 ? `
        <div class="summary-row">
          <span style="color: #64748b;">Promo Discount (SWIFT20):</span>
          <strong style="color: #10b981;">-₦${discount.toLocaleString()}</strong>
        </div>` : ''}
        <div class="summary-row">
          <span style="color: #64748b;">FIRS Statutory VAT (7.5%):</span>
          <strong>₦${vat.toLocaleString()}</strong>
        </div>
        <div class="summary-row total-row">
          <span>TOTAL ${isPaid ? 'PAID' : 'DUE'}:</span>
          <span>₦${total.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <div class="stamp-container">
      <div>
        <div class="stamp">
          ${isPaid ? '✓ VERIFIED • PAID IN FULL' : 'PENDING SETTLEMENT'}<br>
          <span style="font-size: 9px; font-weight: normal; letter-spacing: 0.5px;">${payment.paidDate || 'WAYBILL: ' + trackingNo}</span>
        </div>
      </div>
      <div class="barcode-block">
        <div class="barcode-svg">||| | |||| | ||||| ||| ||</div>
        <div style="font-family: monospace; font-size: 11px; color: #475569; margin-top: 2px;">${trackingNo}</div>
      </div>
    </div>

    <div class="footer-note">
      Thank you for choosing Swift Logistics Nigeria Limited. This document serves as an official electronic tax receipt under the Nigerian Tax Administration Act. For claims or inquiries, quote Waybill <strong>${trackingNo}</strong> to support@swiftlogistics.ng or call +234 800 794 3853.
    </div>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 24px;">
    <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 12px 28px; font-size: 14px; font-weight: 700; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
      🖨️ Print / Save Official PDF
    </button>
  </div>
</body>
</html>`;
}

export function printOrderReceipt(order: DeliveryOrder, customer?: CustomerProfile | null): void {
  if (typeof window === 'undefined') return;

  const html = generateInvoiceHTML(order, customer);
  const printWindow = window.open('', '_blank', 'width=920,height=840');

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 400);
    };
  } else {
    // Fallback: hidden iframe print
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  }
}

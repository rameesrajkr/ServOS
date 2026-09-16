import React, { useState } from 'react';
import {
  Receipt,
  QrCode,
  CreditCard,
  Banknote,
  BedDouble,
  Printer,
  Share2,
  Percent,
  CheckCircle2,
  Split,
  Search,
  X,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const BillingView: React.FC = () => {
  const { config, orders, processPayment } = useApp();

  // Pending checkout bills
  const pendingOrders = orders.filter(
    (o) => !o.isPaid && (o.status === 'billing_requested' || o.status === 'served' || o.status === 'ready')
  );

  const completedOrders = orders.filter((o) => o.isPaid);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    pendingOrders[0] || null
  );

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash' | 'card' | 'room_charge'>('upi');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [splitCount, setSplitCount] = useState<number>(1);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Settle active calculation
  const target = selectedOrder || pendingOrders[0];

  const subtotal = target ? target.subtotal : 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * config.taxRate) / 100;
  const serviceCharge = (taxableAmount * config.serviceChargeRate) / 100;
  const finalTotal = taxableAmount + taxAmount + serviceCharge;

  const perPersonAmount = splitCount > 1 ? (finalTotal / splitCount).toFixed(0) : finalTotal.toFixed(0);

  const handleSettle = () => {
    if (!target) return;
    processPayment(target.id, paymentMethod);
    setShowReceiptModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="h-6 w-6 text-[#0F5D73]" />
            Cashier & Payment Settlement
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Pending guest bills, tax calculations, UPI QR, and automated folio charging
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
            {pendingOrders.length} Pending Bills
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Queue of Pending Bills */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col justify-between max-h-[750px]">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                Checkout Queue
              </h3>
              <span className="text-xs text-gray-400">{pendingOrders.length} tickets</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[580px] pr-1">
              {pendingOrders.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2 opacity-80" />
                  <p>All bills settled</p>
                </div>
              ) : (
                pendingOrders.map((ord) => {
                  const isSelected = target?.id === ord.id;
                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#0F5D73] bg-teal-50/50 shadow-xs'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-900">{ord.orderNumber}</span>
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-700">
                            {ord.tableNumber ? `Table ${ord.tableNumber}` : ord.orderType.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-500">
                          {ord.items.length} items • {ord.waiterName || 'Staff'}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-xs text-gray-900">
                          {config.currencySymbol}
                          {ord.totalAmount.toFixed(0)}
                        </div>
                        <span className="text-[10px] text-amber-600 font-semibold">
                          {ord.elapsedMinutes}m ago
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Billing Inspector & Payment Panel */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          {target ? (
            <div className="space-y-6">
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">
                      Invoice for {target.orderNumber}
                    </h2>
                    <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-[#0F5D73]">
                      {target.tableNumber ? `Table ${target.tableNumber}` : target.orderType.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Server: {target.waiterName || 'Staff'} • {target.guestCount || 2} Diners •{' '}
                    {new Date(target.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSplitModal(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Split className="h-3.5 w-3.5" />
                    <span>Split Bill ({splitCount > 1 ? `${splitCount}x` : 'Off'})</span>
                  </button>
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {target.items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3">
                          <span className="font-semibold text-gray-900">{item.name}</span>
                          {item.selectedVariant && (
                            <div className="text-[10px] text-gray-500">{item.selectedVariant.name}</div>
                          )}
                          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                            <div className="text-[10px] text-teal-700">
                              +{item.selectedModifiers.map((m) => m.name).join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center font-bold text-gray-700">{item.quantity}</td>
                        <td className="p-3 text-right text-gray-600">
                          {config.currencySymbol}
                          {item.unitPrice}
                        </td>
                        <td className="p-3 text-right font-bold text-gray-900">
                          {config.currencySymbol}
                          {item.unitPrice * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Taxes, Discount & Total Calculation Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Select Payment Tender
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-[#0F5D73] bg-teal-50 text-[#0F5D73] shadow-xs'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <QrCode className="h-4 w-4" />
                      <span>Instant UPI QR</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                        paymentMethod === 'cash'
                          ? 'border-[#0F5D73] bg-teal-50 text-[#0F5D73] shadow-xs'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Banknote className="h-4 w-4" />
                      <span>Cash Tender</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#0F5D73] bg-teal-50 text-[#0F5D73] shadow-xs'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>POS Card</span>
                    </button>
                    {config.enabledModules.includes('room_service') && (
                      <button
                        onClick={() => setPaymentMethod('room_charge')}
                        className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                          paymentMethod === 'room_charge'
                            ? 'border-[#0F5D73] bg-teal-50 text-[#0F5D73] shadow-xs'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <BedDouble className="h-4 w-4" />
                        <span>Room Folio</span>
                      </button>
                    )}
                  </div>

                  {/* QR Preview if UPI */}
                  {paymentMethod === 'upi' && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50/50 p-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white p-1 shadow-xs border border-teal-200">
                        <QrCode className="h-10 w-10 text-teal-900" />
                      </div>
                      <div className="text-[11px] text-teal-900">
                        <div className="font-bold">Scan to Pay via GPay / PhonePe / Paytm</div>
                        <div className="text-teal-700 mt-0.5">VPA: serveos.merchant@icici</div>
                        <div className="font-bold text-xs mt-0.5 text-gray-900">
                          Amount: {config.currencySymbol}{finalTotal.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Calculation breakdown */}
                <div className="rounded-xl bg-gray-50 p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      {config.currencySymbol}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Discount percentage input */}
                  <div className="flex items-center justify-between text-gray-600 py-1">
                    <span className="flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      Discount %:
                    </span>
                    <div className="flex items-center gap-1">
                      {[0, 5, 10, 15].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => setDiscountPercent(pct)}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            discountPercent === pct
                              ? 'bg-[#0F5D73] text-white'
                              : 'bg-white text-gray-700 border'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount savings:</span>
                      <span>
                        - {config.currencySymbol}
                        {discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {config.taxRate > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>GST ({config.taxRate}%):</span>
                      <span className="font-medium text-gray-900">
                        {config.currencySymbol}
                        {taxAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {config.serviceChargeRate > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Service Charge ({config.serviceChargeRate}%):</span>
                      <span className="font-medium text-gray-900">
                        {config.currencySymbol}
                        {serviceCharge.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Final Payable:</span>
                    <span className="text-[#0F5D73]">
                      {config.currencySymbol}
                      {finalTotal.toFixed(0)}
                    </span>
                  </div>

                  {splitCount > 1 && (
                    <div className="flex justify-between text-xs font-bold text-purple-700 pt-1">
                      <span>Per Person ({splitCount} Diners):</span>
                      <span>
                        {config.currencySymbol}
                        {perPersonAmount}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Final Settle Action */}
              <button
                id="btn-complete-payment"
                onClick={handleSettle}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F5D73] py-3 text-sm font-bold text-white shadow-md hover:bg-[#0c4a5c]"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>
                  Complete Payment • {config.currencySymbol}{finalTotal.toFixed(0)} via{' '}
                  {paymentMethod.toUpperCase()}
                </span>
              </button>
            </div>
          ) : (
            <div className="py-24 text-center text-gray-400 text-xs">
              Select an order from the queue to inspect and settle bill
            </div>
          )}
        </div>
      </div>

      {/* Split Bill Calculator Modal */}
      {showSplitModal && target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowSplitModal(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-bold text-sm text-gray-900">Split Bill Calculator</h3>
              <button onClick={() => setShowSplitModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center py-3">
              <div className="text-xs text-gray-500 mb-1">Total Bill Amount</div>
              <div className="text-2xl font-extrabold text-gray-900">
                {config.currencySymbol}{finalTotal.toFixed(0)}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                className="h-9 w-9 rounded-lg border border-gray-200 bg-gray-50 text-base font-bold"
              >
                -
              </button>
              <div className="text-center">
                <span className="text-xl font-bold text-[#0F5D73]">{splitCount}</span>
                <span className="block text-[10px] text-gray-400 uppercase">Diners</span>
              </div>
              <button
                onClick={() => setSplitCount(splitCount + 1)}
                className="h-9 w-9 rounded-lg border border-gray-200 bg-gray-50 text-base font-bold"
              >
                +
              </button>
            </div>

            <div className="rounded-xl bg-teal-50 p-3 text-center">
              <span className="text-xs text-teal-800">Each Diner Pays:</span>
              <div className="text-xl font-bold text-teal-900">
                {config.currencySymbol}{perPersonAmount}
              </div>
            </div>

            <button
              onClick={() => setShowSplitModal(false)}
              className="w-full rounded-xl bg-[#0F5D73] py-2 text-xs font-bold text-white hover:bg-[#0c4a5c]"
            >
              Apply Split
            </button>
          </div>
        </div>
      )}

      {/* Tax Invoice / Print Preview Modal */}
      {showReceiptModal && target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowReceiptModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-[#0F5D73]">Tax Invoice</span>
              <button onClick={() => setShowReceiptModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-center border-b border-dashed border-gray-200 pb-3">
              <h3 className="font-extrabold text-base text-gray-900">{config.name}</h3>
              <p className="text-xs text-gray-500">{config.tagline}</p>
              <p className="text-[11px] text-gray-400 mt-1">
                Receipt #{target.orderNumber} • Date: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-1 text-xs">
              {target.items.map((it) => (
                <div key={it.id} className="flex justify-between">
                  <span>{it.quantity}× {it.name}</span>
                  <span className="font-semibold">{config.currencySymbol}{it.unitPrice * it.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-200 pt-2 space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{config.currencySymbol}{subtotal.toFixed(0)}</span>
              </div>
              {taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>Tax GST ({config.taxRate}%):</span>
                  <span>{config.currencySymbol}{taxAmount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-gray-900 pt-1 border-t">
                <span>Paid via {paymentMethod.toUpperCase()}:</span>
                <span>{config.currencySymbol}{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            <p className="text-center text-[10px] text-gray-400 italic pt-2">
              Thank you for dining with {config.name}!
            </p>

            <button
              onClick={() => setShowReceiptModal(false)}
              className="w-full rounded-xl bg-gray-900 py-2 text-xs font-bold text-white hover:bg-black"
            >
              Print & Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

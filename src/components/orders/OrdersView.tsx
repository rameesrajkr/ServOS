import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Receipt,
  ChefHat,
  Filter,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

export const OrdersView: React.FC = () => {
  const { config, orders, updateOrderStatus, requestBill, setActiveModule } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statuses = [
    { id: 'all', label: 'All Orders' },
    { id: 'new', label: 'New' },
    { id: 'preparing', label: 'In Kitchen' },
    { id: 'ready', label: 'Ready' },
    { id: 'billing_requested', label: 'Billing Requested' },
    { id: 'completed', label: 'Settled' },
  ];

  const filteredOrders = orders.filter((ord) => {
    const matchStatus =
      selectedStatus === 'all'
        ? true
        : selectedStatus === 'preparing'
        ? ord.status === 'preparing' || ord.status === 'new'
        : ord.status === selectedStatus;

    const matchSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.tableNumber && ord.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ord.guestName && ord.guestName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'ready':
        return 'bg-emerald-100 text-emerald-800';
      case 'preparing':
        return 'bg-amber-100 text-amber-800';
      case 'billing_requested':
        return 'bg-rose-100 text-rose-800 font-bold animate-pulse';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-[#0F5D73]" />
            Live Customer Orders
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Real-time tracking of active dine-in, takeaway, and room service tickets
          </p>
        </div>

        <button
          onClick={() => setActiveModule('pos')}
          className="flex items-center gap-1.5 rounded-lg bg-[#0F5D73] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c4a5c]"
        >
          <Plus className="h-4 w-4" />
          <span>New Order</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {statuses.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                selectedStatus === st.id
                  ? 'bg-[#0F5D73] text-white shadow-xs font-bold'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search order # or table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-3 py-1.5 text-xs focus:border-[#0F5D73] focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((ord) => (
          <div
            key={ord.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs hover:border-[#0F5D73] transition-all"
          >
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                <div>
                  <span className="font-extrabold text-sm text-gray-900">{ord.orderNumber}</span>
                  <div className="text-xs font-semibold text-[#0F5D73]">
                    {ord.tableNumber
                      ? `Table ${ord.tableNumber}`
                      : ord.roomNumber
                      ? `Room ${ord.roomNumber}`
                      : ord.orderType.toUpperCase()}
                  </div>
                </div>

                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${getStatusBadge(ord.status)}`}>
                  {ord.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 mb-4 text-xs">
                {ord.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-700">
                    <span>
                      <span className="font-bold text-gray-900">{item.quantity}×</span> {item.name}
                    </span>
                    <span className="text-gray-500">
                      {config.currencySymbol}
                      {item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Meta & Actions */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-gray-500">
                  {ord.elapsedMinutes}m ago • {ord.waiterName || 'Staff'}
                </span>
                <span className="font-extrabold text-sm text-gray-900">
                  {config.currencySymbol}
                  {ord.totalAmount.toFixed(0)}
                </span>
              </div>

              <div className="flex gap-2">
                {ord.status === 'ready' && (
                  <button
                    onClick={() => requestBill(ord.id)}
                    className="flex-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 py-1.5 text-xs font-bold hover:bg-rose-100"
                  >
                    Request Bill
                  </button>
                )}
                {ord.status === 'billing_requested' && (
                  <button
                    onClick={() => setActiveModule('billing')}
                    className="flex-1 rounded-lg bg-[#0F5D73] text-white py-1.5 text-xs font-bold hover:bg-[#0c4a5c]"
                  >
                    Go to Billing
                  </button>
                )}
                {ord.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'ready')}
                    className="flex-1 rounded-lg bg-emerald-600 text-white py-1.5 text-xs font-bold hover:bg-emerald-700"
                  >
                    Mark Ready
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

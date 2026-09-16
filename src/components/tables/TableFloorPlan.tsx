import React, { useState } from 'react';
import {
  Grid3X3,
  Users,
  Clock,
  Receipt,
  Plus,
  ArrowRightLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RestaurantTable, TableSection, TableStatus } from '../../types';

export const TableFloorPlan: React.FC = () => {
  const {
    config,
    tables,
    orders,
    updateTableStatus,
    requestBill,
    setSelectedTableForPOS,
    setActiveModule,
    currentUser,
  } = useApp();

  const [activeSection, setActiveSection] = useState<string>('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('All');
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [transferTarget, setTransferTarget] = useState<string>('T05');

  const sections = ['All', 'Indoor', 'Outdoor', 'Family', 'VIP', 'Private Dining'];
  const statuses = ['All', 'available', 'occupied', 'billing', 'reserved', 'cleaning'];

  const filteredTables = tables.filter((t) => {
    const matchSection = activeSection === 'All' || t.section === activeSection;
    const matchStatus = activeStatusFilter === 'All' || t.status === activeStatusFilter;
    return matchSection && matchStatus;
  });

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return 'border-emerald-200 bg-white hover:border-emerald-400 text-emerald-800';
      case 'occupied':
        return 'border-amber-300 bg-amber-50/20 hover:border-amber-400 text-amber-800';
      case 'billing':
        return 'border-rose-300 bg-rose-50/40 hover:border-rose-400 text-rose-800';
      case 'reserved':
        return 'border-blue-200 bg-blue-50/30 hover:border-blue-300 text-blue-800';
      case 'cleaning':
        return 'border-purple-200 bg-purple-50/30 text-purple-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-500';
    }
  };

  const getBadgeStyle = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-800';
      case 'occupied':
        return 'bg-amber-100 text-amber-800 font-bold';
      case 'billing':
        return 'bg-rose-100 text-rose-800 font-bold animate-pulse';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      case 'cleaning':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Find active order for selected table
  const activeOrder = selectedTable?.currentOrderId
    ? orders.find((o) => o.id === selectedTable.currentOrderId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Grid3X3 className="h-6 w-6 text-[#0F5D73]" />
            Floor Plan & Table Management
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Real-time visual table turnover, occupancy pacing, and seating assignments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedTableForPOS('T01');
              setActiveModule('pos');
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[#0F5D73] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c4a5c]"
          >
            <Plus className="h-4 w-4" />
            <span>Open Order</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs (Sections & Statuses) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
        {/* Sections */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <span className="text-xs font-semibold text-gray-500 mr-2">Section:</span>
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              className={`rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                activeSection === sec
                  ? 'bg-[#0F5D73] text-white shadow-xs font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <span className="text-xs font-semibold text-gray-500 mr-2">Status:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatusFilter(st)}
              className={`rounded-lg px-2.5 py-1 text-xs capitalize whitespace-nowrap transition-all ${
                activeStatusFilter === st
                  ? 'bg-gray-900 text-white font-bold'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
        {filteredTables.map((tbl) => {
          const tableOrder = tbl.currentOrderId
            ? orders.find((o) => o.id === tbl.currentOrderId)
            : null;
          const isReady = tableOrder?.status === 'ready';

          return (
            <div
              key={tbl.id}
              onClick={() => setSelectedTable(tbl)}
              className={`flex flex-col justify-between rounded-2xl border-2 p-3.5 cursor-pointer shadow-xs transition-all hover:scale-[1.02] ${getStatusColor(
                tbl.status
              )} ${isReady ? 'ring-2 ring-emerald-400 animate-pulse' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-extrabold text-gray-900">{tbl.tableNumber}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getBadgeStyle(
                      tbl.status
                    )}`}
                  >
                    {isReady ? 'READY' : tbl.status}
                  </span>
                </div>

                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>
                      {tbl.status === 'occupied' ? `${tbl.guestCount || 2} seated` : `${tbl.capacity} max`}
                    </span>
                  </div>
                  <div>Section: {tbl.section}</div>
                  {tbl.assignedStaffName && (
                    <div className="text-teal-800 font-medium">By: {tbl.assignedStaffName}</div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 text-xs">
                {tbl.status === 'occupied' || tbl.status === 'billing' ? (
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-gray-900">
                      {config.currencySymbol}
                      {tbl.currentOrderAmount || 0}
                    </span>
                    <span className="text-[10px] text-amber-700 flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" />
                      {tbl.elapsedMinutes || 10}m
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-700">Ready to seat</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Inspection Modal / Drawer */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setSelectedTable(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl z-10 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    Table {selectedTable.tableNumber}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${getBadgeStyle(
                      selectedTable.status
                    )}`}
                  >
                    {selectedTable.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {selectedTable.section} Section • Capacity: {selectedTable.capacity} guests
                </p>
              </div>
              <button
                onClick={() => setSelectedTable(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Active Order Breakdown */}
            {activeOrder ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700 bg-gray-50 p-2.5 rounded-xl">
                  <span>Order {activeOrder.orderNumber}</span>
                  <span>{activeOrder.items.length} items ordered</span>
                  <span>{activeOrder.elapsedMinutes}m elapsed</span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-xs">
                  {activeOrder.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-2"
                    >
                      <div>
                        <span className="font-bold text-gray-900">{it.quantity}×</span>{' '}
                        <span className="text-gray-800 font-medium">{it.name}</span>
                        {it.notes && (
                          <div className="text-[10px] text-amber-600">Note: {it.notes}</div>
                        )}
                      </div>
                      <span className="font-bold text-gray-900">
                        {config.currencySymbol}
                        {it.unitPrice * it.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-sm font-bold">
                  <span>Total Amount:</span>
                  <span className="text-teal-900">
                    {config.currencySymbol}
                    {activeOrder.totalAmount.toFixed(0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-gray-500">
                Table currently has no active order.
              </div>
            )}

            {/* Actions for this table */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedTableForPOS(selectedTable.tableNumber);
                    setActiveModule('pos');
                    setSelectedTable(null);
                  }}
                  className="rounded-xl bg-[#0F5D73] py-2.5 text-xs font-bold text-white hover:bg-[#0c4a5c]"
                >
                  {selectedTable.status === 'available' ? 'Open & Order Food' : 'Add More Dishes'}
                </button>

                {activeOrder && selectedTable.status !== 'billing' && (
                  <button
                    onClick={() => {
                      requestBill(activeOrder.id);
                      setSelectedTable(null);
                    }}
                    className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 py-2.5 text-xs font-bold hover:bg-rose-100"
                  >
                    Request Bill for Checkout
                  </button>
                )}

                {selectedTable.status === 'cleaning' && (
                  <button
                    onClick={() => {
                      updateTableStatus(selectedTable.id, 'available');
                      setSelectedTable(null);
                    }}
                    className="col-span-2 rounded-xl bg-emerald-600 text-white py-2.5 text-xs font-bold hover:bg-emerald-700"
                  >
                    Mark Clean & Available
                  </button>
                )}
              </div>

              {/* Status manual override */}
              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-gray-500">Manual Status Change:</span>
                <select
                  value={selectedTable.status}
                  onChange={(e) => {
                    updateTableStatus(selectedTable.id, e.target.value as TableStatus);
                    setSelectedTable((prev) =>
                      prev ? { ...prev, status: e.target.value as TableStatus } : null
                    );
                  }}
                  className="rounded-md border border-gray-200 px-2 py-1 text-xs font-semibold"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="billing">Billing</option>
                  <option value="reserved">Reserved</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="out_of_service">Out of Service</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

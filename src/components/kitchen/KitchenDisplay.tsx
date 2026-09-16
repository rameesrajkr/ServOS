import React, { useState } from 'react';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Sliders,
  Utensils,
  Flame,
  Coffee,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const KitchenDisplay: React.FC = () => {
  const {
    config,
    orders,
    updateOrderStatus,
    updateKitchenItemStatus,
  } = useApp();

  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const stations = [
    { id: 'all', label: 'All Stations' },
    { id: 'main', label: 'Main Kitchen' },
    { id: 'grill', label: 'Grill & Tandoor' },
    { id: 'bakery', label: 'Breads & Bakery' },
    { id: 'beverage', label: 'Beverage Bar' },
    { id: 'dessert', label: 'Dessert' },
  ];

  // Active tickets in kitchen
  const activeKitchenOrders = orders.filter(
    (o) => o.status === 'new' || o.status === 'preparing' || o.status === 'ready'
  );

  // Filter orders by station if needed
  const filteredOrders = activeKitchenOrders.filter((ord) => {
    if (selectedStation === 'all') return true;
    return ord.items.some((item) => item.station === selectedStation);
  });

  const getTimerBadge = (minutes: number) => {
    if (minutes > 20) {
      return 'bg-rose-500 text-white animate-pulse';
    }
    if (minutes > 10) {
      return 'bg-amber-500 text-white';
    }
    return 'bg-emerald-500 text-white';
  };

  return (
    <div className="space-y-6">
      {/* KDS Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-[#0F5D73]" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Kitchen Display System (KDS)</h1>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-[#0F5D73]">
              Live Expediter
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Real-time ticket pacing, prep stations routing, and modifier alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound alert cue */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              soundEnabled
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-gray-200 bg-gray-50 text-gray-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>{soundEnabled ? 'Chime ON' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Station Navigation Filter */}
      <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-2xl border border-gray-200 shadow-xs overflow-x-auto no-scrollbar">
        {stations.map((st) => (
          <button
            key={st.id}
            onClick={() => setSelectedStation(st.id)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStation === st.id
                ? 'bg-[#0F5D73] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Tickets Grid */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
          <h3 className="text-base font-bold text-gray-900">Kitchen Queue is Clear</h3>
          <p className="text-xs text-gray-500 mt-1">All tickets have been cooked and dispatched.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredOrders.map((ord) => {
            const isReady = ord.status === 'ready';
            const relevantItems =
              selectedStation === 'all'
                ? ord.items
                : ord.items.filter((i) => i.station === selectedStation);

            return (
              <div
                key={ord.id}
                className={`flex flex-col justify-between rounded-2xl border-2 p-4 shadow-sm transition-all bg-white ${
                  isReady
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : ord.status === 'preparing'
                    ? 'border-amber-300'
                    : 'border-gray-200'
                }`}
              >
                <div>
                  {/* Ticket Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                    <div>
                      <span className="font-extrabold text-sm text-gray-900">
                        {ord.orderNumber}
                      </span>
                      <div className="text-xs font-bold text-[#0F5D73]">
                        {ord.tableNumber
                          ? `Table ${ord.tableNumber}`
                          : ord.roomNumber
                          ? `Room ${ord.roomNumber}`
                          : ord.orderType.toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${getTimerBadge(
                          ord.elapsedMinutes
                        )}`}
                      >
                        <Clock className="h-3 w-3" />
                        {ord.elapsedMinutes}m
                      </span>
                    </div>
                  </div>

                  {/* Waiter info / Guest count */}
                  <div className="flex justify-between text-[11px] text-gray-500 mb-3 bg-gray-50 p-1.5 rounded-lg">
                    <span>Server: {ord.waiterName || 'Staff'}</span>
                    <span>Guests: {ord.guestCount || 2}</span>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2 mb-4">
                    {relevantItems.map((item) => {
                      const itemIsReady = item.status === 'ready';

                      return (
                        <div
                          key={item.id}
                          onClick={() =>
                            updateKitchenItemStatus(
                              ord.id,
                              item.id,
                              itemIsReady ? 'preparing' : 'ready'
                            )
                          }
                          className={`flex items-start justify-between rounded-lg p-2 text-xs cursor-pointer border transition-all ${
                            itemIsReady
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 line-through opacity-75'
                              : 'bg-white border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5 font-bold">
                              <span className="text-[#0F5D73] font-extrabold">{item.quantity}×</span>
                              <span>{item.name}</span>
                            </div>

                            {item.selectedVariant && (
                              <div className="text-[10px] text-gray-500">
                                {item.selectedVariant.name}
                              </div>
                            )}

                            {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                              <div className="text-[10px] text-teal-700">
                                + {item.selectedModifiers.map((m) => m.name).join(', ')}
                              </div>
                            )}

                            {item.notes && (
                              <div className="mt-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                                Note: {item.notes}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] uppercase font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                              {item.station}
                            </span>
                            {itemIsReady && (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ticket action buttons */}
                <div className="pt-3 border-t border-gray-100 flex gap-2">
                  {ord.status === 'new' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'preparing')}
                      className="w-full rounded-xl bg-amber-500 py-2 text-xs font-bold text-white hover:bg-amber-600"
                    >
                      Start Cooking
                    </button>
                  )}

                  {ord.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'ready')}
                      className="w-full rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      Mark Entire Ticket Ready
                    </button>
                  )}

                  {ord.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'served')}
                      className="w-full rounded-xl bg-[#0F5D73] py-2 text-xs font-bold text-white hover:bg-[#0c4a5c]"
                    >
                      Dispatched / Served
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

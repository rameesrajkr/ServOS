import React, { useState } from 'react';
import {
  BedDouble,
  Clock,
  User,
  ShoppingBag,
  Plus,
  CheckCircle2,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RoomServiceView: React.FC = () => {
  const { config, orders, setActiveModule } = useApp();

  // Active room service orders
  const roomOrders = orders.filter((o) => o.orderType === 'room_service');

  // Hotel rooms mock status
  const hotelRooms = [
    { room: '1204', guest: 'Mr. Arun Kumar', tier: 'Platinum VIP', status: 'Dining Active', billTotal: 1850 },
    { room: '1402', guest: 'Dr. Sarah Jenkins', tier: 'Gold VIP', status: 'Room Occupied', billTotal: 0 },
    { room: '1008', guest: 'Mr. David Zhang', tier: 'Silver', status: 'Room Occupied', billTotal: 0 },
    { room: '1105', guest: 'Ms. Priya Menon', tier: 'Standard', status: 'Dining Active', billTotal: 920 },
    { room: '0901', guest: 'Capt. R. Thomas', tier: 'Gold VIP', status: 'Room Occupied', billTotal: 0 },
    { room: '1501', guest: 'Presidential Suite', tier: 'Diamond VIP', status: 'Room Occupied', billTotal: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BedDouble className="h-6 w-6 text-[#0F5D73]" />
            In-Room Dining & Hotel Guest Folio
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Five-star guest room service, tray delivery expediter, and PMS folio charge integration
          </p>
        </div>

        <button
          onClick={() => setActiveModule('pos')}
          className="flex items-center gap-1.5 rounded-lg bg-[#0F5D73] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c4a5c]"
        >
          <Plus className="h-4 w-4" />
          <span>New Room Order</span>
        </button>
      </div>

      {/* Active In-Room Orders */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 mb-3">Active Room Delivery Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomOrders.map((ord) => (
            <div
              key={ord.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div>
                  <span className="font-extrabold text-sm text-[#0F5D73]">Room {ord.roomNumber}</span>
                  <div className="text-xs text-gray-700 font-semibold">{ord.guestName}</div>
                </div>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-[#0F5D73] border border-teal-100">
                  {ord.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                {ord.items.map((it) => (
                  <div key={it.id} className="flex justify-between">
                    <span>{it.quantity}× {it.name}</span>
                    <span className="font-semibold">{config.currencySymbol}{it.unitPrice * it.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">Total:</span>
                <span className="font-extrabold text-sm text-gray-900">
                  {config.currencySymbol}{ord.totalAmount.toFixed(0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Rooms Overview */}
      <div className="mt-8">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Occupied Rooms & Folio Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {hotelRooms.map((rm) => (
            <div
              key={rm.room}
              className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs space-y-2 hover:border-[#0F5D73] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-gray-900">Rm {rm.room}</span>
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-gray-600">
                  {rm.tier}
                </span>
              </div>
              <div className="text-xs font-semibold text-gray-800 line-clamp-1">{rm.guest}</div>
              <div className="text-[11px] text-gray-500">{rm.status}</div>
              <div className="pt-2 border-t border-gray-100 text-right">
                <span className="font-bold text-xs text-[#0F5D73]">
                  {config.currencySymbol}{rm.billTotal}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

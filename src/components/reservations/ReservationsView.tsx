import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Users,
  Plus,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Reservation } from '../../types';

export const ReservationsView: React.FC = () => {
  const { reservations, addReservation, updateReservationStatus, tables } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCount, setGuestCount] = useState(4);
  const [time, setTime] = useState('19:30');
  const [tableNumber, setTableNumber] = useState('T06');
  const [specialRequests, setSpecialRequests] = useState('');

  const handleSave = () => {
    if (!guestName) return;
    addReservation({
      guestName,
      guestPhone,
      guestCount,
      date: new Date().toISOString().split('T')[0],
      time,
      tableNumber,
      specialRequests,
    });
    setShowAddModal(false);
    setGuestName('');
    setGuestPhone('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-[#0F5D73]" />
            Guest Reservations & Waitlist
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Table booking calendar, guest arrival times, dietary preferences, and seating allocations
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#0F5D73] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c4a5c]"
        >
          <Plus className="h-4 w-4" />
          <span>New Reservation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.map((res) => (
          <div
            key={res.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                <span className="font-bold text-sm text-gray-900">{res.guestName}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    res.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : res.status === 'waitlist'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {res.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    Time:
                  </span>
                  <span className="font-bold text-gray-900">{res.time} ({res.date})</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-gray-400" />
                    Party Size:
                  </span>
                  <span className="font-bold text-gray-900">{res.guestCount} Guests</span>
                </div>

                {res.tableNumber && (
                  <div className="flex items-center justify-between">
                    <span>Allocated Table:</span>
                    <span className="font-bold text-[#0F5D73] bg-teal-50 px-2 py-0.5 rounded">
                      {res.tableNumber}
                    </span>
                  </div>
                )}

                {res.guestPhone && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      Contact:
                    </span>
                    <span>{res.guestPhone}</span>
                  </div>
                )}

                {res.specialRequests && (
                  <div className="mt-2 rounded-lg bg-gray-50 p-2 text-[11px] text-gray-600 italic">
                    "{res.specialRequests}"
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex gap-2">
              {res.status !== 'seated' && (
                <button
                  onClick={() => updateReservationStatus(res.id, 'seated')}
                  className="flex-1 rounded-lg bg-emerald-600 text-white py-1.5 text-xs font-bold hover:bg-emerald-700"
                >
                  Seat Guests
                </button>
              )}
              {res.status !== 'cancelled' && (
                <button
                  onClick={() => updateReservationStatus(res.id, 'cancelled')}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-bold text-sm text-gray-900">Book Table Reservation</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Guest Name</label>
                <input
                  type="text"
                  placeholder="e.g. Meera Varma"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 focus:border-[#0F5D73]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98470 12345"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2 focus:border-[#0F5D73]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Guest Count</label>
                  <input
                    type="number"
                    min="1"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 p-2 focus:border-[#0F5D73]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2 focus:border-[#0F5D73]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Table</label>
                  <select
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2 focus:border-[#0F5D73]"
                  >
                    {tables.map((t) => (
                      <option key={t.id} value={t.tableNumber}>
                        {t.tableNumber} ({t.section})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Special Notes / Dietary</label>
                <input
                  type="text"
                  placeholder="e.g. Anniversary celebration, quiet corner"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 focus:border-[#0F5D73]"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full rounded-xl bg-[#0F5D73] py-2.5 text-xs font-bold text-white hover:bg-[#0c4a5c]"
            >
              Confirm Table Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

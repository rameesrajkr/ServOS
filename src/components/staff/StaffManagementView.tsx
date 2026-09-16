import React, { useState } from 'react';
import {
  Users2,
  Shield,
  Key,
  Clock,
  CheckCircle2,
  UserCheck,
  UserMinus,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StaffManagementView: React.FC = () => {
  const { staffMembers, switchUser, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStaff = staffMembers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users2 className="h-6 w-6 text-[#0F5D73]" />
            Staff Roster & Terminal Access
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Role assignments, table section ownership, shift attendance, and fast-terminal PIN keys
          </p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => {
          const isCurrent = currentUser.id === staff.id;

          return (
            <div
              key={staff.id}
              className={`rounded-2xl border p-5 shadow-xs transition-all bg-white flex flex-col justify-between ${
                isCurrent ? 'border-[#0F5D73] ring-2 ring-[#0F5D73]/20' : 'border-gray-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                      {staff.name}
                      {isCurrent && (
                        <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-[#0F5D73]">
                          Logged In
                        </span>
                      )}
                    </h3>
                    <span className="text-xs font-semibold capitalize text-[#0F5D73]">
                      {staff.role}
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      staff.isOnShift ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {staff.isOnShift ? 'ON SHIFT' : 'OFF SHIFT'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Key className="h-3 w-3 text-gray-400" />
                      Terminal PIN:
                    </span>
                    <span className="font-mono font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                      {staff.pin}
                    </span>
                  </div>

                  {staff.assignedSections && staff.assignedSections.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span>Assigned Sections:</span>
                      <span className="font-semibold text-gray-800">
                        {staff.assignedSections.join(', ')}
                      </span>
                    </div>
                  )}

                  {staff.assignedTables && staff.assignedTables.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span>Assigned Tables:</span>
                      <span className="font-semibold text-gray-800">
                        {staff.assignedTables.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <button
                  disabled={isCurrent}
                  onClick={() => switchUser(staff.id)}
                  className="w-full rounded-xl bg-gray-100 py-2 text-xs font-bold text-gray-800 hover:bg-gray-200 disabled:opacity-40"
                >
                  {isCurrent ? 'Current Session' : `Switch to ${staff.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

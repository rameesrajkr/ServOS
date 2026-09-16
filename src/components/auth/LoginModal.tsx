import React, { useState } from 'react';
import { Lock, UserCheck, KeyRound, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../lib/mockData';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginWithPin, currentUser } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'pin' | 'email'>('pin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isLoginModalOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
      if (nextPin.length === 4) {
        const success = loginWithPin(nextPin);
        if (!success) {
          setError(true);
          setTimeout(() => setPin(''), 600);
        } else {
          setPin('');
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleQuickSelectUser = (userPin: string) => {
    loginWithPin(userPin);
    setPin('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsLoginModalOpen(false)}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#0F5D73] mb-3">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">ServeOS Terminal Access</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Switch staff profile or enter 4-digit PIN for instant terminal access
          </p>
        </div>

        {/* Tab switcher: PIN Terminal vs Email */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pin')}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              activeTab === 'pin' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
            }`}
          >
            Staff PIN Terminal
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              activeTab === 'email' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
            }`}
          >
            Admin Credentials
          </button>
        </div>

        {activeTab === 'pin' ? (
          <div>
            {/* PIN Dots Display */}
            <div className="flex justify-center items-center gap-3 my-4">
              {[0, 1, 2, 3].map((idx) => {
                const filled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`h-4 w-4 rounded-full border-2 transition-all ${
                      error
                        ? 'border-rose-500 bg-rose-500 animate-pulse'
                        : filled
                        ? 'border-[#0F5D73] bg-[#0F5D73] scale-110'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                );
              })}
            </div>

            {error && (
              <p className="text-center text-xs text-rose-500 font-medium mb-3">
                Invalid PIN code. Try selecting a user below.
              </p>
            )}

            {/* Numeric Keypad for POS terminal touch */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-6">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigit(digit)}
                  className="flex h-12 items-center justify-center rounded-xl bg-gray-50 text-base font-semibold text-gray-800 hover:bg-gray-100 active:scale-95 transition-all shadow-xs border border-gray-200"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={() => setPin('')}
                className="flex h-12 items-center justify-center rounded-xl bg-gray-50 text-xs font-semibold text-gray-500 hover:bg-gray-100 active:scale-95 border border-gray-200"
              >
                C
              </button>
              <button
                onClick={() => handleDigit('0')}
                className="flex h-12 items-center justify-center rounded-xl bg-gray-50 text-base font-semibold text-gray-800 hover:bg-gray-100 active:scale-95 border border-gray-200"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="flex h-12 items-center justify-center rounded-xl bg-gray-50 text-xs font-semibold text-gray-500 hover:bg-gray-100 active:scale-95 border border-gray-200"
              >
                ⌫
              </button>
            </div>

            {/* Quick Demo Staff Login buttons */}
            <div className="border-t border-gray-100 pt-4">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Fast Switch (Staff Directory)
              </span>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickSelectUser(u.pin)}
                    className={`flex items-center gap-2 rounded-lg border p-2 text-left text-xs transition-all ${
                      currentUser.id === u.id
                        ? 'border-[#0F5D73] bg-teal-50/50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-700">
                      {u.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-gray-900">{u.name}</div>
                      <div className="text-[10px] text-gray-500">
                        {u.role.replace('_', ' ')} • PIN: {u.pin}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Address or Phone
              </label>
              <input
                type="email"
                placeholder="manager@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#0F5D73] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#0F5D73] focus:outline-hidden"
              />
            </div>
            <button
              onClick={() => {
                loginWithPin('1111');
              }}
              className="w-full rounded-lg bg-[#0F5D73] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0c4a5c]"
            >
              Sign In to Organization
            </button>
            <p className="text-center text-[11px] text-gray-400">
              Demo bypass: Clicking Sign In authenticates as Rahul Nair (Owner)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

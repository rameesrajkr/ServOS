import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  Building2,
  Lock,
  ChevronDown,
  Sliders,
  Clock,
  User,
  LogOut,
  Eye,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RestaurantType, Role } from '../../types';
import {
  RESTAURANT_TYPES_CATALOG,
  getRolesForRestaurantType,
} from '../../lib/config/rolesAndPresets';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onToggleMobileSidebar,
}) => {
  const {
    config,
    currentUser,
    session,
    switchRestaurantPreset,
    switchRole,
    setIsSearchOpen,
    setIsOnboardingOpen,
    setIsLoginModalOpen,
    logout,
    notifications,
    unreadNotificationCount,
    markNotificationsRead,
    changeOutlet,
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showOutletMenu, setShowOutletMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const outletRef = useRef<HTMLDivElement>(null);

  const handleToggle = onToggleSidebar || onToggleMobileSidebar || (() => {});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
      if (outletRef.current && !outletRef.current.contains(event.target as Node)) {
        setShowOutletMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rolesForCurrentType = getRolesForRestaurantType(config.type);

  const currentOutlet =
    config.outlets.find((o) => o.id === config.currentOutletId) ||
    config.outlets[0] || {
      id: 'main',
      name: 'Main Location',
      type: 'Primary Outlet',
    };

  return (
    <header className="h-[72px] min-h-[72px] max-h-[72px] w-full border-b border-gray-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md flex items-center justify-between z-40 sticky top-0 box-border shrink-0">
      {/* LEFT: Branch, Preview, Role selectors */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        {/* Mobile menu toggle */}
        <button
          id="btn-mobile-sidebar-toggle"
          onClick={handleToggle}
          aria-label="Toggle navigation menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-5 w-5" />
        </button>

        {/* 1. Branch / Location Selector */}
        <div className="relative shrink-0" ref={outletRef}>
          <button
            id="btn-outlet-selector"
            onClick={() => {
              if (config.outlets.length > 1) {
                setShowOutletMenu(!showOutletMenu);
              }
            }}
            className={`flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50/80 px-2.5 text-xs font-semibold text-gray-700 transition-colors shadow-2xs whitespace-nowrap ${
              config.outlets.length > 1
                ? 'hover:bg-gray-100 hover:text-gray-900 cursor-pointer'
                : 'cursor-default'
            }`}
            title="Current Branch / Location"
          >
            <Building2 className="h-3.5 w-3.5 text-[#0F5D73] shrink-0" />
            <span className="max-w-[120px] sm:max-w-[140px] truncate">
              {currentOutlet?.name || 'Main Location'}
            </span>
            {config.outlets.length > 1 && (
              <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
            )}
          </button>

          {showOutletMenu && config.outlets.length > 1 && (
            <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl z-50">
              <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                Select Branch / Location
              </div>
              {config.outlets.map((outlet) => (
                <button
                  key={outlet.id}
                  id={`btn-select-outlet-${outlet.id}`}
                  onClick={() => {
                    changeOutlet(outlet.id);
                    setShowOutletMenu(false);
                  }}
                  className={`flex w-full flex-col rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                    outlet.id === config.currentOutletId
                      ? 'bg-teal-50 text-[#0F5D73] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold">{outlet.name}</span>
                  <span className="text-[11px] text-gray-500">{outlet.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Preview selector: [PREVIEW: Multi-Outlet] */}
        <div className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50/80 px-2.5 text-xs shadow-2xs shrink-0">
          <Eye className="h-3.5 w-3.5 text-[#0F5D73] shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
            PREVIEW:
          </span>
          <select
            id="select-restaurant-preset"
            value={config.type}
            onChange={(e) => switchRestaurantPreset(e.target.value as RestaurantType)}
            className="bg-transparent font-semibold text-gray-800 text-xs focus:outline-none cursor-pointer pr-1"
            title="Switch Restaurant Preset"
          >
            {RESTAURANT_TYPES_CATALOG.map((t) => (
              <option key={t.type} value={t.type}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Role selector: [Branch Cashier] */}
        <div className="hidden md:flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50/80 px-2.5 text-xs shadow-2xs shrink-0">
          <User className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <select
            id="select-user-role"
            value={currentUser.role}
            onChange={(e) => switchRole(e.target.value as Role)}
            className="bg-transparent font-semibold text-gray-800 text-xs focus:outline-none cursor-pointer pr-1"
            title="Switch User Role"
          >
            {rolesForCurrentType.map((r) => (
              <option key={r.role} value={r.role}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CENTER: Flexible Spacing */}
      <div className="flex-1 min-w-2" />

      {/* RIGHT: Search, Wizard, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Search Field */}
        <button
          id="btn-global-search"
          onClick={() => setIsSearchOpen(true)}
          className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-600 hover:bg-gray-100 w-32 sm:w-40 md:w-48 lg:w-56 xl:w-60 transition-all shrink-0 shadow-2xs"
          aria-label="Global Search"
        >
          <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span className="truncate text-gray-500">Search...</span>
          <kbd className="ml-auto hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-400 sm:inline-block shrink-0">
            ⌘K
          </kbd>
        </button>

        {/* Wizard Button */}
        <button
          id="btn-onboarding-trigger"
          onClick={() => setIsOnboardingOpen(true)}
          title="Configure Restaurant Wizard"
          className="hidden md:flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs shrink-0"
        >
          <Sliders className="h-3.5 w-3.5 text-[#0F5D73] shrink-0" />
          <span>Wizard</span>
        </button>

        {/* Notification Button */}
        <div className="relative shrink-0" ref={notifRef}>
          <button
            id="btn-notifications"
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              if (!showNotifMenu && unreadNotificationCount > 0) {
                markNotificationsRead();
              }
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 shrink-0" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-2xs pointer-events-none">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-900">Notifications</span>
                <span className="text-[11px] text-gray-500">{notifications.length} updates</span>
              </div>
              <div className="mt-2 max-h-72 space-y-2 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-lg p-2 text-xs transition-colors ${
                      n.isRead ? 'bg-white hover:bg-gray-50' : 'bg-teal-50/60 border border-teal-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{n.title}</span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {n.time}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-600 text-[11px]">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Control */}
        <button
          id="btn-staff-pin-modal"
          onClick={() => setIsLoginModalOpen(true)}
          className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white pl-2 pr-2.5 text-xs font-medium text-gray-800 hover:bg-gray-50 shadow-2xs shrink-0 max-w-[170px] sm:max-w-[210px]"
          title="Staff Profile & PIN Lock"
        >
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="h-6 w-6 rounded-full object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0F5D73]/15 text-[#0F5D73] text-[11px] font-bold">
              {currentUser.name.charAt(0)}
            </div>
          )}
          <div className="text-left min-w-0 flex-1 hidden sm:block">
            <div className="leading-tight font-semibold text-gray-900 text-xs truncate">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-gray-500 uppercase font-medium truncate">
              {session?.roleTitle || currentUser.role.replace('_', ' ')}
            </div>
          </div>
          <Lock className="h-3 w-3 text-gray-400 shrink-0 ml-0.5" />
        </button>

        {/* Sign Out / Exit to Welcome Flow */}
        <button
          id="btn-header-logout"
          onClick={logout}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-rose-600 hover:bg-rose-50 shadow-2xs transition-colors shrink-0"
          title="Sign Out / Switch Shift"
          aria-label="Sign Out"
        >
          <LogOut className="h-4 w-4 shrink-0" />
        </button>
      </div>
    </header>
  );
};

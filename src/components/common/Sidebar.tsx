import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  ShoppingBag,
  Grid3X3,
  ChefHat,
  Receipt,
  UtensilsCrossed,
  Boxes,
  CalendarDays,
  BedDouble,
  Users,
  UserCheck,
  Truck,
  BarChart3,
  Building2,
  ShieldCheck,
  SlidersHorizontal,
  X,
  Store,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_MODULES, ROLE_ALLOWED_MODULES } from '../../lib/config/modules';
import { ModuleId } from '../../types';

interface SidebarProps {
  isOpen?: boolean;
  mobileOpen?: boolean;
  onClose?: () => void;
  onCloseMobile?: () => void;
}

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  Calculator,
  ShoppingBag,
  Grid3X3,
  ChefHat,
  Receipt,
  UtensilsCrossed,
  Boxes,
  CalendarDays,
  BedDouble,
  Users,
  UserCheck,
  Truck,
  BarChart3,
  Building2,
  ShieldCheck,
  SlidersHorizontal,
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  mobileOpen,
  onClose,
  onCloseMobile,
}) => {
  const isDrawerOpen = isOpen ?? mobileOpen ?? false;
  const handleClose = onClose || onCloseMobile || (() => {});

  const {
    config,
    currentUser,
    session,
    activeModule,
    setActiveModule,
    orders,
    tables,
    inventory,
    logout,
  } = useApp();

  // Filter modules based on restaurant configuration AND user role
  const allowedForRole = ROLE_ALLOWED_MODULES[currentUser.role] || [];
  const visibleModuleIds = config.enabledModules.filter((modId) =>
    allowedForRole.includes(modId)
  );

  // Dynamic label overrides tailored to role
  const getCustomLabel = (modId: ModuleId, defaultLabel: string): string => {
    if (modId === 'tables' && (currentUser.role === 'waiter' || currentUser.role === 'captain')) {
      return 'My Tables';
    }
    if (modId === 'kitchen' && (currentUser.role === 'chef' || currentUser.role === 'kitchen_staff' || currentUser.role === 'sous_chef')) {
      return 'Kitchen Display';
    }
    if (modId === 'billing' && (currentUser.role === 'cashier' || currentUser.role === 'billing_staff')) {
      return 'Billing & Cash';
    }
    if (modId === 'dashboard' && currentUser.role === 'owner') {
      return 'Executive Overview';
    }
    return defaultLabel;
  };

  // Dynamic counts for notification badges
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'new' || o.status === 'preparing'
  ).length;
  const kitchenTicketsCount = orders.filter((o) => o.status === 'preparing').length;
  const pendingBillsCount = orders.filter((o) => o.status === 'billing_requested').length;
  const lowStockCount = inventory.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock').length;

  const getBadge = (modId: ModuleId) => {
    if (modId === 'orders' && pendingOrdersCount > 0) {
      return (
        <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800">
          {pendingOrdersCount}
        </span>
      );
    }
    if (modId === 'kitchen' && kitchenTicketsCount > 0) {
      return (
        <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
          {kitchenTicketsCount}
        </span>
      );
    }
    if (modId === 'billing' && pendingBillsCount > 0) {
      return (
        <span className="ml-auto rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-800">
          {pendingBillsCount}
        </span>
      );
    }
    if (modId === 'inventory' && lowStockCount > 0) {
      return (
        <span className="ml-auto rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200">
          {lowStockCount} alert{lowStockCount > 1 ? 's' : ''}
        </span>
      );
    }
    return null;
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-white text-gray-800">
      <div className="flex flex-col min-h-0 flex-1">
        {/* Restaurant Identity inside Sidebar */}
        <div className="border-b border-gray-100 p-4 bg-white shrink-0">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F5D73] text-white font-bold text-base shadow-2xs">
                {config.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-gray-900 leading-snug break-words">
                  {config.name}
                </h2>
                <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5" title={config.tagline}>
                  {config.tagline}
                </p>
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 border border-teal-200 uppercase tracking-wide">
                    {config.type.replace('_', ' ')}
                  </span>
                  {config.outlets.length > 1 && (
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
                      {config.outlets.length} Outlets
                    </span>
                  )}
                </div>
              </div>
            </div>
            {isDrawerOpen && (
              <button
                onClick={handleClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 lg:hidden shrink-0 mt-0.5"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Navigation Items */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto min-h-0">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Workspace
          </div>
          {visibleModuleIds.map((modId) => {
            const def = ALL_MODULES[modId];
            if (!def) return null;
            const IconComponent = ICON_MAP[def.icon] || LayoutDashboard;
            const isActive = activeModule === modId;
            const label = getCustomLabel(modId, def.label);

            return (
              <button
                key={modId}
                id={`nav-${modId}`}
                onClick={() => {
                  setActiveModule(modId);
                  if (isDrawerOpen) handleClose();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#0F5D73] text-white shadow-xs font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <IconComponent
                  className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-600'}`}
                />
                <span className="truncate">{label}</span>
                {getBadge(modId)}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="border-t border-gray-200 p-3 bg-gray-50/70">
        <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-gray-200 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-xs font-bold shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-gray-900 leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-gray-600 uppercase font-medium">
                {session?.roleTitle || currentUser.role.replace('_', ' ')}
              </p>
              {session?.assignedTables && (
                <p className="text-[9px] text-amber-700 font-medium truncate">
                  Tables: {session.assignedTables.join(', ')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out / Switch Staff"
            className="rounded p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white h-full overflow-hidden">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={handleClose}
          />
          <div className="relative flex w-72 max-w-full flex-1 flex-col bg-white shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

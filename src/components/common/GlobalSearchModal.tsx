import React, { useState, useEffect } from 'react';
import { Search, X, ShoppingBag, Grid3X3, UtensilsCrossed, Users, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, orders, tables, menuItems, customers, setActiveModule } =
    useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchedOrders = cleanQuery
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(cleanQuery) ||
          (o.tableNumber && o.tableNumber.toLowerCase().includes(cleanQuery)) ||
          (o.guestName && o.guestName.toLowerCase().includes(cleanQuery))
      )
    : orders.slice(0, 3);

  const matchedTables = cleanQuery
    ? tables.filter(
        (t) =>
          t.tableNumber.toLowerCase().includes(cleanQuery) ||
          t.section.toLowerCase().includes(cleanQuery) ||
          t.status.toLowerCase().includes(cleanQuery)
      )
    : tables.slice(0, 3);

  const matchedMenu = cleanQuery
    ? menuItems.filter(
        (m) =>
          m.name.toLowerCase().includes(cleanQuery) ||
          m.category.toLowerCase().includes(cleanQuery)
      )
    : menuItems.slice(0, 4);

  const matchedCustomers = cleanQuery
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(cleanQuery) ||
          c.phone.toLowerCase().includes(cleanQuery)
      )
    : [];

  const handleSelect = (module: any) => {
    setActiveModule(module);
    setIsSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/50">
          <Search className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search orders, tables, dishes, or guests (e.g. T01, Biryani, #MK-102)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Orders Section */}
          {matchedOrders.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Orders</span>
              </div>
              <div className="space-y-1">
                {matchedOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => handleSelect('orders')}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 cursor-pointer text-xs"
                  >
                    <div>
                      <span className="font-semibold text-gray-900">{ord.orderNumber}</span>
                      <span className="text-gray-600 ml-2">
                        {ord.tableNumber ? `Table ${ord.tableNumber}` : ord.orderType.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                        {ord.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tables Section */}
          {matchedTables.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                <Grid3X3 className="h-3.5 w-3.5" />
                <span>Tables & Floor</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {matchedTables.map((tbl) => (
                  <div
                    key={tbl.id}
                    onClick={() => handleSelect('tables')}
                    className="flex flex-col rounded-lg border border-gray-200 p-2.5 hover:border-[#0F5D73] hover:bg-teal-50/40 cursor-pointer text-xs transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{tbl.tableNumber}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                          tbl.status === 'occupied'
                            ? 'bg-amber-100 text-amber-800'
                            : tbl.status === 'billing'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {tbl.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-600 mt-1">
                      {tbl.section} • {tbl.capacity} seats
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu Dishes Section */}
          {matchedMenu.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                <UtensilsCrossed className="h-3.5 w-3.5" />
                <span>Menu Items</span>
              </div>
              <div className="space-y-1">
                {matchedMenu.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('menu')}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <span className="text-[11px] text-gray-600">({item.category})</span>
                    </div>
                    <span className="font-semibold text-gray-900">₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer CRM Section */}
          {matchedCustomers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                <Users className="h-3.5 w-3.5" />
                <span>Guests & CRM</span>
              </div>
              <div className="space-y-1">
                {matchedCustomers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect('customers')}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 cursor-pointer text-xs"
                  >
                    <div>
                      <span className="font-medium text-gray-900">{c.name}</span>
                      <span className="text-gray-600 ml-2">{c.phone}</span>
                    </div>
                    <span className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-800 border border-teal-200">
                      {c.vipTier || 'Guest'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2.5 text-[11px] text-gray-600">
          <span>Search anywhere across ServeOS</span>
          <div className="flex items-center gap-2">
            <span>Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start justify-between rounded-xl border p-3.5 shadow-lg backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-emerald-50/95 text-emerald-900'
              : toast.type === 'warning'
              ? 'border-amber-200 bg-amber-50/95 text-amber-900'
              : toast.type === 'error'
              ? 'border-rose-200 bg-rose-50/95 text-rose-900'
              : 'border-blue-200 bg-blue-50/95 text-blue-900'
          }`}
        >
          <div className="pr-2">
            <p className="text-xs font-semibold leading-snug">{toast.message}</p>
            {toast.submessage && (
              <p className="mt-0.5 text-[11px] opacity-90">{toast.submessage}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="rounded p-0.5 opacity-60 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

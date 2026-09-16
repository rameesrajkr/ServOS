import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Grid3X3,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Receipt,
  ChefHat,
  Clock,
  CheckCircle2,
  DollarSign,
  Coffee,
  Boxes,
  ArrowRight,
  Sparkles,
  Building2,
  PhoneCall,
  Percent,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdaptiveDashboard: React.FC = () => {
  const {
    config,
    currentUser,
    orders,
    tables,
    inventory,
    reservations,
    roomService,
    setActiveModule,
    requestBill,
    updateOrderStatus,
    adjustStock,
    setSelectedTableForPOS,
  } = useApp();

  // Metrics calculations
  const totalRevenue = config.outlets.reduce((acc, out) => acc + out.revenueToday, 0);
  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const totalOrderCount = orders.length;
  const avgOrderValue =
    totalOrderCount > 0
      ? Math.round(
          orders.reduce((sum, o) => sum + o.totalAmount, 0) / Math.max(1, totalOrderCount)
        )
      : 0;

  const occupiedTables = tables.filter((t) => t.status === 'occupied' || t.status === 'billing');
  const occupancyRate =
    tables.length > 0 ? Math.round((occupiedTables.length / tables.length) * 100) : 0;

  const lowStockItems = inventory.filter(
    (i) => i.status === 'low_stock' || i.status === 'out_of_stock'
  );

  const pendingBills = orders.filter((o) => o.status === 'billing_requested');
  const kitchenTickets = orders.filter((o) => o.status === 'new' || o.status === 'preparing');

  // My tables for waiter
  const myTables =
    currentUser.role === 'waiter' && currentUser.assignedTables
      ? tables.filter((t) => currentUser.assignedTables?.includes(t.tableNumber))
      : tables;

  // 1. CHEF DASHBOARD
  if (currentUser.role === 'chef' || currentUser.role === 'kitchen_staff') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-[#0F5D73]" />
              Kitchen Expediter Queue
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Active tickets requiring preparation, cooking, and plating
            </p>
          </div>
          <button
            onClick={() => setActiveModule('kitchen')}
            className="flex items-center gap-2 rounded-lg bg-[#0F5D73] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c4a5c]"
          >
            Open Full KDS Screen
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Quick KDS Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Pending Tickets</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{kitchenTickets.length}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Grill Station</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {orders.flatMap((o) => o.items).filter((i) => i.station === 'grill' && i.status !== 'ready').length}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Main Range</span>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {orders.flatMap((o) => o.items).filter((i) => i.station === 'main' && i.status !== 'ready').length}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Avg Prep Time</span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">11m</div>
          </div>
        </div>

        {/* Active Kitchen Tickets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kitchenTickets.map((ord) => (
            <div
              key={ord.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                  <div>
                    <span className="font-bold text-gray-900 text-sm">{ord.orderNumber}</span>
                    <span className="ml-2 text-xs font-semibold text-[#0F5D73] bg-teal-50 px-2 py-0.5 rounded-md">
                      {ord.tableNumber ? `Table ${ord.tableNumber}` : ord.orderType.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                    <Clock className="h-3 w-3" />
                    <span>{ord.elapsedMinutes}m ago</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {ord.items.map((item) => (
                    <div key={item.id} className="text-xs flex items-start justify-between">
                      <div>
                        <span className="font-bold text-gray-800">{item.quantity}×</span>{' '}
                        <span className="text-gray-900 font-medium">{item.name}</span>
                        {item.notes && (
                          <div className="text-[11px] text-amber-600 italic">Note: {item.notes}</div>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-600 uppercase font-bold bg-gray-100 px-1.5 py-0.5 rounded">
                        {item.station}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => updateOrderStatus(ord.id, 'preparing')}
                  className="flex-1 rounded-lg bg-amber-100 text-amber-800 py-2 text-xs font-semibold hover:bg-amber-200"
                >
                  Start Prep
                </button>
                <button
                  onClick={() => updateOrderStatus(ord.id, 'ready')}
                  className="flex-1 rounded-lg bg-emerald-600 text-white py-2 text-xs font-semibold hover:bg-emerald-700"
                >
                  Mark Ready
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. WAITER DASHBOARD
  if (currentUser.role === 'waiter') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              My Tables & Floor Service
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Station: {currentUser.assignedSection || 'Indoor'} Section •{' '}
              {myTables.length} Tables Assigned
            </p>
          </div>
          <button
            onClick={() => setActiveModule('pos')}
            className="flex items-center gap-2 rounded-lg bg-[#0F5D73] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c4a5c]"
          >
            <Plus className="h-4 w-4" />
            New Table Order
          </button>
        </div>

        {/* My Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {myTables.map((tbl) => {
            const tableOrder = orders.find((o) => o.id === tbl.currentOrderId);
            const isReady = tableOrder?.status === 'ready';

            return (
              <div
                key={tbl.id}
                className={`rounded-2xl border p-4 shadow-xs transition-all flex flex-col justify-between ${
                  isReady
                    ? 'border-emerald-400 bg-emerald-50/40 ring-2 ring-emerald-300'
                    : tbl.status === 'occupied'
                    ? 'border-amber-200 bg-white'
                    : tbl.status === 'billing'
                    ? 'border-rose-200 bg-rose-50/30'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">{tbl.tableNumber}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        isReady
                          ? 'bg-emerald-500 text-white animate-pulse'
                          : tbl.status === 'occupied'
                          ? 'bg-amber-100 text-amber-800'
                          : tbl.status === 'billing'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isReady ? 'FOOD READY!' : tbl.status.toUpperCase()}
                    </span>
                  </div>

                  {tbl.status !== 'available' && tableOrder ? (
                    <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Guests:</span>
                        <span className="font-semibold text-gray-900">{tbl.guestCount || 2} Pax</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Order Total:</span>
                        <span className="font-bold text-gray-900">
                          {config.currencySymbol}
                          {tableOrder.totalAmount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Elapsed Time:</span>
                        <span className="font-medium text-amber-700">
                          {tableOrder.elapsedMinutes} mins
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-gray-600">
                      Table available ({tbl.capacity} seats)
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  {tbl.status === 'available' ? (
                    <button
                      onClick={() => {
                        setSelectedTableForPOS(tbl.tableNumber);
                        setActiveModule('pos');
                      }}
                      className="w-full rounded-lg bg-[#0F5D73] py-2 text-xs font-semibold text-white hover:bg-[#0c4a5c]"
                    >
                      Open & Order
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setSelectedTableForPOS(tbl.tableNumber);
                          setActiveModule('pos');
                        }}
                        className="flex-1 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Add Items
                      </button>
                      {tbl.currentOrderId && tbl.status !== 'billing' && (
                        <button
                          onClick={() => requestBill(tbl.currentOrderId!)}
                          className="flex-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 py-1.5 text-xs font-semibold hover:bg-rose-100"
                        >
                          Request Bill
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. CASHIER DASHBOARD
  if (currentUser.role === 'cashier') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Receipt className="h-6 w-6 text-[#0F5D73]" />
              Cashier & Billing Settlement
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Live checkout queue • {pendingBills.length} tickets awaiting payment settlement
            </p>
          </div>
          <button
            onClick={() => setActiveModule('billing')}
            className="flex items-center gap-2 rounded-lg bg-[#0F5D73] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c4a5c]"
          >
            Open Billing Terminal
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Pending Bills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingBills.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
              <h3 className="text-sm font-bold text-gray-900">All bills cleared</h3>
              <p className="text-xs text-gray-600 mt-1">
                No tables are currently requesting checkout.
              </p>
            </div>
          ) : (
            pendingBills.map((ord) => (
              <div
                key={ord.id}
                className="rounded-2xl border border-rose-200 bg-white p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                    <div>
                      <span className="font-bold text-gray-900">{ord.orderNumber}</span>
                      <span className="ml-2 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-xs">
                        Table {ord.tableNumber || 'Takeaway'}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-gray-900">
                      {config.currencySymbol}
                      {ord.totalAmount.toFixed(0)}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Items Count:</span>
                      <span className="font-semibold text-gray-800">{ord.items.length} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waiter in charge:</span>
                      <span className="font-semibold text-gray-800">{ord.waiterName || 'Staff'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Requested:</span>
                      <span className="font-medium text-gray-500">{ord.elapsedMinutes}m ago</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModule('billing')}
                  className="w-full rounded-lg bg-[#0F5D73] py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c4a5c]"
                >
                  Process Settle & Print Bill
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // 4. INVENTORY DASHBOARD
  if (currentUser.role === 'inventory_staff') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Boxes className="h-6 w-6 text-[#0F5D73]" />
              Stock & Inventory Control
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Ingredient buffers, replenishment warnings, and supplier restocks
            </p>
          </div>
          <button
            onClick={() => setActiveModule('inventory')}
            className="flex items-center gap-2 rounded-lg bg-[#0F5D73] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c4a5c]"
          >
            Inventory Master
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Low Stock Warning Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 shadow-xs flex flex-col justify-between ${
                item.status === 'out_of_stock'
                  ? 'border-rose-300 bg-rose-50/40'
                  : item.status === 'low_stock'
                  ? 'border-amber-300 bg-amber-50/30'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.status === 'out_of_stock'
                        ? 'bg-rose-500 text-white'
                        : item.status === 'low_stock'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-gray-900 my-2">
                  {item.currentStock} {item.unit}
                </div>
                <div className="text-xs text-gray-600 space-y-0.5">
                  <div>Min buffer: {item.minThreshold} {item.unit}</div>
                  <div>Supplier: {item.supplierName}</div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 mt-2 border-t border-gray-100">
                <button
                  onClick={() => adjustStock(item.id, 5)}
                  className="flex-1 rounded-lg bg-[#0F5D73] py-1.5 text-xs font-semibold text-white hover:bg-[#0c4a5c]"
                >
                  + Add 5 {item.unit}
                </button>
                <button
                  onClick={() => adjustStock(item.id, -1)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  -1
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. OWNER / MANAGER / ENTERPRISE DASHBOARD (Adaptive!)
  const isThattukada = config.type === 'thattukada';
  const isHotel = config.type === 'hotel_fb' || config.type === 'multi_outlet';

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isThattukada
              ? 'Thattukada Business Hub'
              : isHotel
              ? 'Executive F&B & Outlets Command'
              : 'Restaurant Operations & Revenue'}
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            {config.name} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-quick-new-order"
            onClick={() => setActiveModule('pos')}
            className="flex items-center gap-1.5 rounded-lg bg-[#0F5D73] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c4a5c]"
          >
            <Plus className="h-4 w-4" />
            <span>New Order</span>
          </button>
          <button
            onClick={() => setActiveModule('reports')}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs"
          >
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            <span>Reports</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-gray-600">
            <span>Today's Revenue</span>
            <span className="flex items-center text-emerald-600 font-semibold text-[11px]">
              +14.2%
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-gray-900">
            {config.currencySymbol}
            {totalRevenue.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-gray-600">Across active registers</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-gray-600">
            <span>Orders Placed</span>
            <ShoppingBag className="h-4 w-4 text-[#0F5D73]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-gray-900">
            {totalOrderCount}
          </div>
          <p className="mt-1 text-[11px] text-gray-600">
            {activeOrders.length} currently active in kitchen
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-gray-600">
            <span>Avg Order Value (AOV)</span>
            <Percent className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-gray-900">
            {config.currencySymbol}
            {avgOrderValue}
          </div>
          <p className="mt-1 text-[11px] text-gray-600">High margin guest spending</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-gray-600">
            <span>{isThattukada ? 'Active Tokens' : 'Table Occupancy'}</span>
            <Grid3X3 className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-gray-900">
            {isThattukada ? activeOrders.length : `${occupancyRate}%`}
          </div>
          <p className="mt-1 text-[11px] text-gray-600">
            {isThattukada
              ? 'Tokens waiting'
              : `${occupiedTables.length} of ${tables.length} tables seated`}
          </p>
        </div>
      </div>

      {/* Hotel Multi-Outlet Breakdown (If Hotel F&B enabled) */}
      {isHotel && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#0F5D73]" />
                Multi-Outlet F&B Performance
              </h2>
              <p className="text-xs text-gray-600">
                Live turnover across restaurant dining rooms, terrace, and pool bar
              </p>
            </div>
            <button
              onClick={() => setActiveModule('outlets')}
              className="text-xs font-semibold text-[#0F5D73] hover:underline"
            >
              Manage Outlets
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {config.outlets.map((outlet) => (
              <div
                key={outlet.id}
                className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900">{outlet.name}</span>
                  <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-teal-800">
                    {outlet.code}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {config.currencySymbol}
                  {outlet.revenueToday.toLocaleString()}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 pt-1 border-t border-gray-200">
                  <span>{outlet.activeOrdersCount} live tickets</span>
                  <span>{outlet.tablesCount} tables</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Operational Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Orders & Fast Action Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Orders List */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Live Active Orders</h2>
                <p className="text-xs text-gray-600">
                  Real-time status tracking from kitchen prep to settlement
                </p>
              </div>
              <button
                onClick={() => setActiveModule('orders')}
                className="text-xs font-semibold text-[#0F5D73] hover:underline flex items-center gap-1"
              >
                View all orders
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {activeOrders.slice(0, 5).map((ord) => (
                <div
                  key={ord.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-gray-200 p-3 hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-[#0F5D73] font-bold text-xs">
                      {ord.tableNumber || 'TK'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">{ord.orderNumber}</span>
                        <span className="text-xs text-gray-600">
                          {ord.tableNumber ? `Table ${ord.tableNumber}` : ord.orderType.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600">
                        {ord.items.map((it) => `${it.quantity}× ${it.name}`).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-right">
                      <div className="font-bold text-xs text-gray-900">
                        {config.currencySymbol}
                        {ord.totalAmount.toFixed(0)}
                      </div>
                      <div className="text-[10px] text-gray-600">{ord.elapsedMinutes}m ago</div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        ord.status === 'ready'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'billing_requested'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <h2 className="text-sm font-bold text-gray-900 mb-1">Top Selling Items</h2>
            <p className="text-xs text-gray-600 mb-4">Volume drivers and kitchen demand today</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'Thalassery Chicken Biryani', count: 38, rev: '₹11,020', pct: 85 },
                { name: 'Malabar Flaky Porotta', count: 94, rev: '₹5,640', pct: 95 },
                { name: 'Slow-Roasted Beef Roast', count: 26, rev: '₹6,240', pct: 65 },
                { name: 'Spiced Sulaimani Tea', count: 72, rev: '₹2,520', pct: 75 },
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className="font-bold text-teal-800">{item.rev}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-gray-600">
                    <span>{item.count} orders today</span>
                    <span>{item.pct}% popularity</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0F5D73]"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Operational Alerts & Low Stock */}
        <div className="space-y-6">
          {/* Low Stock Watch */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Low Stock Thresholds
              </h2>
              <button
                onClick={() => setActiveModule('inventory')}
                className="text-xs text-[#0F5D73] font-semibold hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {lowStockItems.length === 0 ? (
                <p className="text-xs text-gray-600 py-3">All stock levels look healthy.</p>
              ) : (
                lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/40 p-2.5 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-[11px] text-gray-600">
                        {item.currentStock} {item.unit} left (min: {item.minThreshold})
                      </div>
                    </div>
                    <button
                      onClick={() => adjustStock(item.id, 5)}
                      className="rounded-md bg-white border border-gray-200 px-2.5 py-1 text-[11px] font-bold text-gray-800 hover:bg-gray-50 shadow-xs"
                    >
                      + Restock
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-gray-900">Immediate Operations</h2>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setActiveModule('pos')}
                className="flex items-center justify-between rounded-xl border border-gray-200 p-3 text-left hover:bg-gray-50 text-xs font-semibold text-gray-800"
              >
                <span>Launch Quick POS</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
              {config.enabledModules.includes('tables') && (
                <button
                  onClick={() => setActiveModule('tables')}
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-3 text-left hover:bg-gray-50 text-xs font-semibold text-gray-800"
                >
                  <span>Interactive Floor Plan</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              )}
              {config.enabledModules.includes('kitchen') && (
                <button
                  onClick={() => setActiveModule('kitchen')}
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-3 text-left hover:bg-gray-50 text-xs font-semibold text-gray-800"
                >
                  <span>Kitchen Display (KDS)</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              )}
              {config.enabledModules.includes('billing') && (
                <button
                  onClick={() => setActiveModule('billing')}
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-3 text-left hover:bg-gray-50 text-xs font-semibold text-gray-800"
                >
                  <span>Cashier Settlement</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ChefHat,
  Receipt,
  Utensils,
  Coffee,
  ShoppingBag,
  BedDouble,
  Sliders,
  Check,
  X,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem, MenuItemModifier, MenuItemVariant, OrderItem, OrderType } from '../../types';

export const POSView: React.FC = () => {
  const {
    config,
    menuItems,
    tables,
    createOrder,
    setActiveModule,
    selectedTableForPOS,
    setSelectedTableForPOS,
    processPayment,
  } = useApp();

  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [selectedTable, setSelectedTable] = useState<string>(selectedTableForPOS || 'T04');
  const [roomNumber, setRoomNumber] = useState('1204');
  const [guestName, setGuestName] = useState('Mr. Arun Kumar');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);

  // Variant/modifier selection modal state
  const [activeItemForCustomization, setActiveItemForCustomization] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | undefined>(undefined);
  const [selectedModifiers, setSelectedModifiers] = useState<MenuItemModifier[]>([]);
  const [itemNotes, setItemNotes] = useState('');

  // Categories extraction
  const categories = ['All', ...Array.from(new Set(menuItems.map((m) => m.category)))];

  // Filtered menu
  const filteredMenu = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenCustomizer = (item: MenuItem) => {
    if ((item.variants && item.variants.length > 0) || (item.modifiers && item.modifiers.length > 0)) {
      setActiveItemForCustomization(item);
      setSelectedVariant(item.variants ? item.variants[0] : undefined);
      setSelectedModifiers([]);
      setItemNotes('');
    } else {
      // Add directly
      addToCart(item);
    }
  };

  const addToCart = (
    item: MenuItem,
    variant?: MenuItemVariant,
    modifiers?: MenuItemModifier[],
    notes?: string
  ) => {
    const unitPrice = variant ? variant.price : item.price;
    const modsTotal = (modifiers || []).reduce((sum, m) => sum + m.price, 0);
    const finalPrice = unitPrice + modsTotal;

    const existingIndex = cart.findIndex(
      (c) =>
        c.menuItemId === item.id &&
        c.selectedVariant?.id === variant?.id &&
        JSON.stringify(c.selectedModifiers) === JSON.stringify(modifiers)
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      const newOrderItem: OrderItem = {
        id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        menuItemId: item.id,
        name: item.name,
        unitPrice: finalPrice,
        quantity: 1,
        selectedVariant: variant,
        selectedModifiers: modifiers,
        notes: notes || '',
        station: item.station,
        status: 'pending',
      };
      setCart([...cart, newOrderItem]);
    }

    setActiveItemForCustomization(null);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((it) => it.id !== itemId));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const taxAmount = (subtotal * config.taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  // Dispatch flow 1: Send to Kitchen (Dine-in / Room Service)
  const handleSendToKitchen = () => {
    if (cart.length === 0) return;

    createOrder({
      orderType,
      tableNumber: orderType === 'dine_in' ? selectedTable : undefined,
      roomNumber: orderType === 'room_service' ? roomNumber : undefined,
      guestName: orderType === 'room_service' ? guestName : undefined,
      guestCount,
      items: cart,
      subtotal,
      taxAmount,
      totalAmount,
    });

    setCart([]);
    setSelectedTableForPOS(null);
    setActiveModule('kitchen');
  };

  // Dispatch flow 2: Instant Checkout (Takeaway / Small Food Shop)
  const handleInstantPayment = () => {
    if (cart.length === 0) return;

    const created = createOrder({
      orderType: 'takeaway',
      items: cart,
      subtotal,
      taxAmount,
      totalAmount,
    });

    processPayment(created.id, 'upi');
    setCart([]);
    setActiveModule('orders');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      {/* Left 2 Cols: Menu Selection & Categories */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs overflow-hidden">
        {/* Top bar: Order Type selector & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          {/* Order Types */}
          <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setOrderType('dine_in')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                orderType === 'dine_in'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Utensils className="h-3.5 w-3.5" />
              <span>Dine-in</span>
            </button>
            <button
              onClick={() => setOrderType('takeaway')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                orderType === 'takeaway'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Takeaway</span>
            </button>
            {config.enabledModules.includes('room_service') && (
              <button
                onClick={() => setOrderType('room_service')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  orderType === 'room_service'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <BedDouble className="h-3.5 w-3.5" />
                <span>Room Service</span>
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 py-1.5 text-xs focus:border-[#0F5D73] focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Dynamic Context Header (Table selector or Room input) */}
        <div className="py-2.5 flex items-center gap-3 border-b border-gray-100 text-xs">
          {orderType === 'dine_in' && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Select Table:</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-bold text-[#0F5D73]"
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.tableNumber}>
                    {t.tableNumber} ({t.section} • {t.capacity}p) {t.status === 'occupied' ? '• Occupied' : ''}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1 ml-3">
                <span className="text-gray-500">Guests:</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-12 rounded-lg border border-gray-200 px-1.5 py-0.5 text-center text-xs font-semibold"
                />
              </div>
            </div>
          )}

          {orderType === 'room_service' && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-700">Room:</span>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-xs font-bold text-[#0F5D73]"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-700">Guest:</span>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-44 rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium"
                />
              </div>
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0F5D73] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 pt-2">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenCustomizer(item)}
              className={`flex flex-col justify-between rounded-xl border p-3 cursor-pointer transition-all hover:shadow-sm ${
                item.isAvailable
                  ? 'border-gray-200 bg-white hover:border-[#0F5D73] hover:bg-teal-50/20'
                  : 'border-gray-200 bg-gray-50 opacity-60 pointer-events-none'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{item.name}</h4>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-tight">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                <span className="font-extrabold text-xs text-gray-900">
                  {config.currencySymbol}
                  {item.price}
                </span>
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-[#0F5D73] border border-teal-100">
                  + Add
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Col: Cart & Instant Checkout Panel */}
      <div className="w-full lg:w-80 shrink-0 bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Active Order</h3>
              <span className="text-[11px] text-gray-500">
                {orderType === 'dine_in'
                  ? `Table ${selectedTable}`
                  : orderType === 'room_service'
                  ? `Room ${roomNumber}`
                  : 'Takeaway Counter'}
              </span>
            </div>
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-bold text-[#0F5D73]">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          {/* Cart Items List */}
          <div className="space-y-2.5 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                <ShoppingBag className="mx-auto h-8 w-8 mb-2 opacity-40" />
                <p>No items in cart</p>
                <p className="text-[11px]">Click items from menu to add</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-semibold text-gray-900 pr-1">{item.name}</div>
                    <div className="font-bold text-gray-900">
                      {config.currencySymbol}
                      {(item.unitPrice * item.quantity).toFixed(0)}
                    </div>
                  </div>

                  {item.selectedVariant && (
                    <div className="text-[10px] text-gray-500">{item.selectedVariant.name}</div>
                  )}

                  {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                    <div className="text-[10px] text-teal-800">
                      +{item.selectedModifiers.map((m) => m.name).join(', ')}
                    </div>
                  )}

                  {item.notes && (
                    <div className="text-[10px] text-amber-600 italic">Note: {item.notes}</div>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-200/60">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex h-5 w-5 items-center justify-center rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                      >
                        <Minus className="h-2.5 w-2.5" />
                      </button>
                      <span className="font-bold text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex h-5 w-5 items-center justify-center rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                      >
                        <Plus className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calculations & Actions */}
        <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                {config.currencySymbol}
                {subtotal.toFixed(0)}
              </span>
            </div>
            {config.taxRate > 0 && (
              <div className="flex justify-between text-[11px]">
                <span>Taxes ({config.taxRate}% GST)</span>
                <span>
                  {config.currencySymbol}
                  {taxAmount.toFixed(0)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1 border-t border-gray-100">
              <span>Total Bill</span>
              <span className="text-teal-900">
                {config.currencySymbol}
                {totalAmount.toFixed(0)}
              </span>
            </div>
          </div>

          {orderType === 'dine_in' || orderType === 'room_service' ? (
            <button
              id="btn-send-to-kitchen"
              disabled={cart.length === 0}
              onClick={handleSendToKitchen}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F5D73] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0c4a5c] disabled:opacity-50"
            >
              <ChefHat className="h-4 w-4" />
              <span>Send to Kitchen ({selectedTable})</span>
            </button>
          ) : (
            <button
              id="btn-instant-pay"
              disabled={cart.length === 0}
              onClick={handleInstantPayment}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
            >
              <CreditCard className="h-4 w-4" />
              <span>Instant Pay & Close (UPI / Cash)</span>
            </button>
          )}
        </div>
      </div>

      {/* Customizer / Modifiers Modal */}
      {activeItemForCustomization && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setActiveItemForCustomization(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-bold text-sm text-gray-900">
                Customize {activeItemForCustomization.name}
              </h3>
              <button
                onClick={() => setActiveItemForCustomization(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Variants */}
            {activeItemForCustomization.variants && activeItemForCustomization.variants.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Choose Size / Variant
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {activeItemForCustomization.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`rounded-lg border p-2 text-left text-xs ${
                        selectedVariant?.id === v.id
                          ? 'border-[#0F5D73] bg-teal-50 text-[#0F5D73] font-bold'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div>{v.name}</div>
                      <div className="text-[11px] opacity-80">
                        {config.currencySymbol}
                        {v.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Modifiers */}
            {activeItemForCustomization.modifiers &&
              activeItemForCustomization.modifiers.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Add-ons & Substitutions
                  </label>
                  <div className="space-y-1.5">
                    {activeItemForCustomization.modifiers.map((m) => {
                      const isChecked = selectedModifiers.some((sm) => sm.id === m.id);
                      return (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedModifiers((prev) =>
                              isChecked ? prev.filter((sm) => sm.id !== m.id) : [...prev, m]
                            );
                          }}
                          className={`flex w-full items-center justify-between rounded-lg border p-2 text-xs ${
                            isChecked
                              ? 'border-teal-400 bg-teal-50/60 font-semibold text-teal-900'
                              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span>{m.name}</span>
                          <span className="text-gray-500">
                            +{config.currencySymbol}
                            {m.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Preparation Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kitchen Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Less spicy, dressing on side"
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-[#0F5D73] focus:outline-hidden"
              />
            </div>

            <button
              onClick={() =>
                addToCart(
                  activeItemForCustomization,
                  selectedVariant,
                  selectedModifiers,
                  itemNotes
                )
              }
              className="w-full rounded-xl bg-[#0F5D73] py-2.5 text-xs font-bold text-white hover:bg-[#0c4a5c]"
            >
              Add to Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

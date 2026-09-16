import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Customer,
  InventoryItem,
  MenuItem,
  ModuleId,
  NotificationItem,
  Order,
  OrderStatus,
  Reservation,
  RestaurantConfig,
  RestaurantTable,
  RestaurantType,
  Role,
  RoomServiceOrder,
  TableStatus,
  User,
  UserSession,
} from '../types';
import {
  DEMO_CUSTOMERS,
  DEMO_INVENTORY,
  DEMO_MENU_ITEMS,
  DEMO_ORDERS,
  DEMO_RESERVATIONS,
  DEMO_ROOM_SERVICE,
  DEMO_TABLES,
  DEMO_USERS,
  RESTAURANT_PRESETS,
} from '../lib/mockData';
import { ALL_MODULES, DEFAULT_MODULES_BY_TYPE, ROLE_ALLOWED_MODULES } from '../lib/config/modules';
import {
  createSession,
  getRoleDefaultModule,
  getRolesForRestaurantType,
} from '../lib/config/rolesAndPresets';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  submessage?: string;
}

interface AppContextType {
  config: RestaurantConfig;
  currentUser: User;
  activeModule: ModuleId;
  isAuthenticated: boolean;
  session: UserSession | null;
  selectedRestaurantType: RestaurantType;
  selectedRole: Role | null;
  selectedRoleTitle: string;
  orders: Order[];
  tables: RestaurantTable[];
  menuItems: MenuItem[];
  inventory: InventoryItem[];
  reservations: Reservation[];
  roomService: RoomServiceOrder[];
  customers: Customer[];
  staff: User[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  toasts: ToastNotification[];
  isSearchOpen: boolean;
  isOnboardingOpen: boolean;
  isLoginModalOpen: boolean;
  selectedTableForPOS: string | null;

  // Actions
  setActiveModule: (module: ModuleId) => void;
  setSelectedRestaurantType: (type: RestaurantType) => void;
  setSelectedRole: (role: Role | null) => void;
  setSelectedRoleTitle: (title: string) => void;
  setIsAuthenticated: (auth: boolean) => void;
  loginWithSession: (sessionData: { user: User; config: RestaurantConfig; roleTitle?: string }) => void;
  switchRestaurantPreset: (type: RestaurantType) => void;
  switchRole: (role: Role) => void;
  loginWithPin: (pin: string) => boolean;
  logout: () => void;
  toggleModule: (moduleId: ModuleId) => void;
  createOrder: (order: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateKitchenItemStatus: (
    orderId: string,
    itemId: string,
    status: 'pending' | 'preparing' | 'ready' | 'served'
  ) => void;
  requestBill: (orderId: string) => void;
  processPayment: (orderId: string, method: 'cash' | 'upi' | 'card' | 'room_charge') => void;
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  adjustStock: (itemId: string, delta: number) => void;
  toggleMenuItemAvailability: (itemId: string) => void;
  addReservation: (res: Partial<Reservation>) => void;
  updateReservationStatus: (resId: string, status: Reservation['status']) => void;
  updateRoomServiceStatus: (id: string, status: RoomServiceOrder['status']) => void;
  changeOutlet: (outletId: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  setIsLoginModalOpen: (open: boolean) => void;
  setSelectedTableForPOS: (tableNumber: string | null) => void;
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  markNotificationsRead: () => void;
  applyOnboardingConfig: (newConfig: RestaurantConfig) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<RestaurantConfig>(RESTAURANT_PRESETS.restaurant);
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]); // default Owner
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [session, setSession] = useState<UserSession | null>(null);
  const [selectedRestaurantType, setSelectedRestaurantType] = useState<RestaurantType>('restaurant');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRoleTitle, setSelectedRoleTitle] = useState<string>('');
  const [activeModule, setActiveModuleState] = useState<ModuleId>('dashboard');
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [tables, setTables] = useState<RestaurantTable[]>(DEMO_TABLES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEMO_MENU_ITEMS);
  const [inventory, setInventory] = useState<InventoryItem[]>(DEMO_INVENTORY);
  const [reservations, setReservations] = useState<Reservation[]>(DEMO_RESERVATIONS);
  const [roomService, setRoomService] = useState<RoomServiceOrder[]>(DEMO_ROOM_SERVICE);
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [staff, setStaff] = useState<User[]>(DEMO_USERS);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedTableForPOS, setSelectedTableForPOS] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Low Stock Alert',
      message: 'Fresh Farm Chicken is below minimum buffer (4.5 kg left)',
      time: '10m ago',
      type: 'stock',
      isRead: false,
    },
    {
      id: 'notif-2',
      title: 'Order Ready',
      message: 'Table T01 items ready at Grill & Beverage stations',
      time: '15m ago',
      type: 'kitchen',
      isRead: false,
    },
    {
      id: 'notif-3',
      title: 'VIP Reservation',
      message: 'Rajeev & Anita Nambiar arriving at 19:30 (Table T06)',
      time: '1h ago',
      type: 'reservation',
      isRead: true,
    },
  ]);

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setActiveModule = (mod: ModuleId) => {
    setActiveModuleState(mod);
  };

  // Switch restaurant preset (Thattukada, Cafe, Restaurant, Fine Dining, Hotel F&B, etc.)
  const switchRestaurantPreset = (type: RestaurantType) => {
    const preset = RESTAURANT_PRESETS[type] || RESTAURANT_PRESETS.restaurant;
    setConfig(preset);
    setSelectedRestaurantType(type);

    if (session) {
      const updatedSession = createSession(currentUser, preset, session.roleTitle);
      setSession(updatedSession);
    }

    // If active module is not enabled in this preset, default to role's module or dashboard
    const roleMod = getRoleDefaultModule(currentUser.role);
    if (preset.enabledModules.includes(roleMod)) {
      setActiveModule(roleMod);
    } else if (!preset.enabledModules.includes(activeModule)) {
      setActiveModule('dashboard');
    }

    addToast({
      type: 'info',
      message: `Switched to ${preset.name}`,
      submessage: `Configuration: ${preset.tagline}`,
    });
  };

  // Switch Role (Demo Preview)
  const switchRole = (role: Role) => {
    const rolesForType = getRolesForRestaurantType(config.type);
    const matchedOption = rolesForType.find((r) => r.role === role);

    const targetUser: User = matchedOption
      ? {
          id: `usr-${role}-${Date.now().toString().slice(-4)}`,
          name: matchedOption.demoUser.name,
          email: matchedOption.demoUser.email,
          phone: matchedOption.demoUser.phone,
          pin: matchedOption.defaultPin,
          role,
          assignedSection: matchedOption.demoUser.assignedSection,
          assignedTables: matchedOption.demoUser.assignedTables,
        }
      : DEMO_USERS.find((u) => u.role === role) || {
          ...DEMO_USERS[0],
          role,
          name: `Staff (${role.replace('_', ' ').toUpperCase()})`,
        };

    setCurrentUser(targetUser);
    setSelectedRole(role);
    const roleTitle = matchedOption?.title || role.replace('_', ' ').toUpperCase();
    setSelectedRoleTitle(roleTitle);

    const updatedSession = createSession(targetUser, config, roleTitle);
    setSession(updatedSession);

    // Redirect to default module for this role
    const defaultMod = getRoleDefaultModule(role);
    if (config.enabledModules.includes(defaultMod)) {
      setActiveModule(defaultMod);
    } else {
      setActiveModule('dashboard');
    }

    addToast({
      type: 'success',
      message: `Role switched to ${roleTitle}`,
      submessage: `Active user: ${targetUser.name}`,
    });
  };

  // Login with full session data (from Entry Flow)
  const loginWithSession = (sessionData: {
    user: User;
    config: RestaurantConfig;
    roleTitle?: string;
  }) => {
    const { user, config: restaurantConfig, roleTitle } = sessionData;
    setConfig(restaurantConfig);
    setCurrentUser(user);
    setSelectedRestaurantType(restaurantConfig.type);
    setSelectedRole(user.role);
    setSelectedRoleTitle(roleTitle || user.role.replace('_', ' ').toUpperCase());

    const newSession = createSession(user, restaurantConfig, roleTitle);
    setSession(newSession);
    setIsAuthenticated(true);

    // Role-based redirection per Step 6
    const defaultModule = getRoleDefaultModule(user.role);
    if (restaurantConfig.enabledModules.includes(defaultModule)) {
      setActiveModule(defaultModule);
    } else {
      setActiveModule('dashboard');
    }

    addToast({
      type: 'success',
      message: `Welcome, ${user.name}!`,
      submessage: `Connected to ${restaurantConfig.name} (${newSession.roleTitle})`,
    });
  };

  // Staff PIN Login
  const loginWithPin = (pin: string): boolean => {
    // Check in current type's roles first
    const rolesForType = getRolesForRestaurantType(config.type);
    const matchedRole = rolesForType.find((r) => r.defaultPin === pin);

    if (matchedRole) {
      const user: User = {
        id: `usr-${matchedRole.role}-${Date.now().toString().slice(-4)}`,
        name: matchedRole.demoUser.name,
        email: matchedRole.demoUser.email,
        phone: matchedRole.demoUser.phone,
        pin: matchedRole.defaultPin,
        role: matchedRole.role,
        assignedSection: matchedRole.demoUser.assignedSection,
        assignedTables: matchedRole.demoUser.assignedTables,
      };

      loginWithSession({
        user,
        config,
        roleTitle: matchedRole.title,
      });
      setIsLoginModalOpen(false);
      return true;
    }

    // Fallback check in DEMO_USERS
    const foundUser = DEMO_USERS.find((u) => u.pin === pin);
    if (foundUser) {
      loginWithSession({
        user: foundUser,
        config,
        roleTitle: foundUser.role.replace('_', ' ').toUpperCase(),
      });
      setIsLoginModalOpen(false);
      return true;
    }

    return false;
  };

  // Logout / Switch User: returns to Welcome / Login entry flow
  const logout = () => {
    setIsAuthenticated(false);
    setSession(null);
    setIsLoginModalOpen(false);
    addToast({
      type: 'info',
      message: 'Signed out of ServeOS',
      submessage: 'Terminal session ended.',
    });
  };

  // Live Module Toggle
  const toggleModule = (moduleId: ModuleId) => {
    setConfig((prev) => {
      const exists = prev.enabledModules.includes(moduleId);
      const updated = exists
        ? prev.enabledModules.filter((m) => m !== moduleId)
        : [...prev.enabledModules, moduleId];
      return {
        ...prev,
        enabledModules: updated,
      };
    });

    addToast({
      type: 'info',
      message: `Module ${ALL_MODULES[moduleId]?.label || moduleId} ${
        config.enabledModules.includes(moduleId) ? 'disabled' : 'enabled'
      }`,
    });
  };

  // End-to-End Order Creation
  const createOrder = (orderData: Partial<Order>): Order => {
    const orderNum = `#MK-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      orderType: orderData.orderType || 'dine_in',
      tableNumber: orderData.tableNumber,
      roomNumber: orderData.roomNumber,
      guestName: orderData.guestName,
      guestPhone: orderData.guestPhone,
      guestCount: orderData.guestCount || 2,
      items: orderData.items || [],
      status: 'preparing',
      subtotal: orderData.subtotal || 0,
      taxAmount: orderData.taxAmount || 0,
      discountAmount: orderData.discountAmount || 0,
      totalAmount: orderData.totalAmount || 0,
      waiterId: currentUser.id,
      waiterName: currentUser.name,
      outletId: config.currentOutletId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elapsedMinutes: 1,
      isPaid: false,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // If dine-in, update table status
    if (newOrder.tableNumber) {
      setTables((prev) =>
        prev.map((tbl) =>
          tbl.tableNumber === newOrder.tableNumber
            ? {
                ...tbl,
                status: 'occupied',
                currentOrderId: newOrder.id,
                currentOrderAmount: newOrder.totalAmount,
                guestCount: newOrder.guestCount,
                elapsedMinutes: 1,
              }
            : tbl
        )
      );
    }

    // Add notification for kitchen
    setNotifications((prev) => [
      {
        id: `notif-ord-${Date.now()}`,
        title: `New Order ${newOrder.orderNumber}`,
        message: `${newOrder.tableNumber ? `Table ${newOrder.tableNumber}` : newOrder.orderType.toUpperCase()} - ${
          newOrder.items.length
        } items sent to kitchen`,
        time: 'Just now',
        type: 'order',
        isRead: false,
      },
      ...prev,
    ]);

    addToast({
      type: 'success',
      message: `Order ${newOrder.orderNumber} sent to Kitchen!`,
      submessage: `${newOrder.items.length} items routed to prep stations`,
    });

    return newOrder;
  };

  // Update order status
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            updatedAt: new Date().toISOString(),
            items:
              status === 'ready'
                ? ord.items.map((it) => ({ ...it, status: 'ready' }))
                : ord.items,
          };
        }
        return ord;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder && targetOrder.tableNumber) {
      if (status === 'billing_requested') {
        setTables((prev) =>
          prev.map((tbl) =>
            tbl.tableNumber === targetOrder.tableNumber ? { ...tbl, status: 'billing' } : tbl
          )
        );
      }
    }

    addToast({
      type: 'info',
      message: `Order status updated to ${status.replace('_', ' ').toUpperCase()}`,
    });
  };

  // Update individual kitchen item
  const updateKitchenItemStatus = (
    orderId: string,
    itemId: string,
    status: 'pending' | 'preparing' | 'ready' | 'served'
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedItems = ord.items.map((it) => (it.id === itemId ? { ...it, status } : it));
          const allReady = updatedItems.every((it) => it.status === 'ready' || it.status === 'served');
          return {
            ...ord,
            items: updatedItems,
            status: allReady ? 'ready' : ord.status,
          };
        }
        return ord;
      })
    );
  };

  // Request Bill (Waiter action)
  const requestBill = (orderId: string) => {
    updateOrderStatus(orderId, 'billing_requested');
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder?.tableNumber) {
      setTables((prev) =>
        prev.map((tbl) =>
          tbl.tableNumber === targetOrder.tableNumber ? { ...tbl, status: 'billing' } : tbl
        )
      );
    }

    setNotifications((prev) => [
      {
        id: `notif-bill-${Date.now()}`,
        title: `Bill Requested: Table ${targetOrder?.tableNumber || 'Takeaway'}`,
        message: `Order ${targetOrder?.orderNumber} (${config.currencySymbol}${targetOrder?.totalAmount.toFixed(0)}) ready for cashier checkout`,
        time: 'Just now',
        type: 'billing',
        isRead: false,
      },
      ...prev,
    ]);

    addToast({
      type: 'warning',
      message: `Bill Requested for Table ${targetOrder?.tableNumber || ''}`,
      submessage: 'Cashier alerted for bill generation',
    });
  };

  // Process Payment (Cashier action)
  const processPayment = (
    orderId: string,
    method: 'cash' | 'upi' | 'card' | 'room_charge'
  ) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'completed',
              isPaid: true,
              paymentMethod: method,
              updatedAt: new Date().toISOString(),
            }
          : ord
      )
    );

    // Free up table or mark for cleaning
    if (targetOrder.tableNumber) {
      setTables((prev) =>
        prev.map((tbl) =>
          tbl.tableNumber === targetOrder.tableNumber
            ? {
                ...tbl,
                status: 'cleaning',
                currentOrderId: undefined,
                currentOrderAmount: undefined,
                guestCount: undefined,
              }
            : tbl
        )
      );
    }

    // Update outlet revenue
    setConfig((prev) => ({
      ...prev,
      outlets: prev.outlets.map((out) =>
        out.id === prev.currentOutletId
          ? {
              ...out,
              revenueToday: out.revenueToday + targetOrder.totalAmount,
              activeOrdersCount: Math.max(0, out.activeOrdersCount - 1),
            }
          : out
      ),
    }));

    setNotifications((prev) => [
      {
        id: `notif-pay-${Date.now()}`,
        title: `Payment Received: ${targetOrder.orderNumber}`,
        message: `${config.currencySymbol}${targetOrder.totalAmount.toFixed(0)} settled via ${method.toUpperCase()}`,
        time: 'Just now',
        type: 'billing',
        isRead: false,
      },
      ...prev,
    ]);

    addToast({
      type: 'success',
      message: `Payment Settled: ${config.currencySymbol}${targetOrder.totalAmount.toFixed(0)}`,
      submessage: `Method: ${method.toUpperCase()} • Table marked for cleaning`,
    });
  };

  const updateTableStatus = (tableId: string, status: TableStatus) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status } : t))
    );
  };

  const adjustStock = (itemId: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(0, item.currentStock + delta);
          let newStatus: InventoryItem['status'] = 'in_stock';
          if (newQty === 0) newStatus = 'out_of_stock';
          else if (newQty <= item.minThreshold) newStatus = 'low_stock';
          return {
            ...item,
            currentStock: newQty,
            status: newStatus,
          };
        }
        return item;
      })
    );
  };

  const toggleMenuItemAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const addReservation = (res: Partial<Reservation>) => {
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      guestName: res.guestName || 'Walk-in Guest',
      guestPhone: res.guestPhone || '',
      guestEmail: res.guestEmail,
      guestCount: res.guestCount || 2,
      date: res.date || new Date().toISOString().split('T')[0],
      time: res.time || '19:00',
      tableNumber: res.tableNumber,
      status: 'confirmed',
      specialRequests: res.specialRequests,
      outletId: config.currentOutletId,
    };
    setReservations((prev) => [newRes, ...prev]);
    addToast({
      type: 'success',
      message: `Reservation confirmed for ${newRes.guestName}`,
      submessage: `${newRes.date} at ${newRes.time} (${newRes.guestCount} guests)`,
    });
  };

  const updateReservationStatus = (resId: string, status: Reservation['status']) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status } : r))
    );
  };

  const updateRoomServiceStatus = (id: string, status: RoomServiceOrder['status']) => {
    setRoomService((prev) =>
      prev.map((rs) => (rs.id === id ? { ...rs, status } : rs))
    );
    addToast({
      type: 'info',
      message: `Room Service delivery status updated to ${status.toUpperCase()}`,
    });
  };

  const changeOutlet = (outletId: string) => {
    setConfig((prev) => ({
      ...prev,
      currentOutletId: outletId,
    }));
    const outlet = config.outlets.find((o) => o.id === outletId);
    if (outlet) {
      addToast({
        type: 'info',
        message: `Switched outlet to: ${outlet.name}`,
      });
    }
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const applyOnboardingConfig = (newConfig: RestaurantConfig) => {
    setConfig(newConfig);
    setIsOnboardingOpen(false);
    setActiveModule('dashboard');
    addToast({
      type: 'success',
      message: `Restaurant "${newConfig.name}" configured!`,
      submessage: `Your tailored workspace is ready with ${newConfig.enabledModules.length} active modules.`,
    });
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        config,
        currentUser,
        activeModule,
        isAuthenticated,
        session,
        selectedRestaurantType,
        selectedRole,
        selectedRoleTitle,
        orders,
        tables,
        menuItems,
        inventory,
        reservations,
        roomService,
        customers,
        staff,
        notifications,
        unreadNotificationCount,
        toasts,
        isSearchOpen,
        isOnboardingOpen,
        isLoginModalOpen,
        selectedTableForPOS,
        setActiveModule,
        setSelectedRestaurantType,
        setSelectedRole,
        setSelectedRoleTitle,
        setIsAuthenticated,
        loginWithSession,
        switchRestaurantPreset,
        switchRole,
        loginWithPin,
        logout,
        toggleModule,
        createOrder,
        updateOrderStatus,
        updateKitchenItemStatus,
        requestBill,
        processPayment,
        updateTableStatus,
        adjustStock,
        toggleMenuItemAvailability,
        addReservation,
        updateReservationStatus,
        updateRoomServiceStatus,
        changeOutlet,
        setIsSearchOpen,
        setIsOnboardingOpen,
        setIsLoginModalOpen,
        setSelectedTableForPOS,
        addToast,
        removeToast,
        markNotificationsRead,
        applyOnboardingConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

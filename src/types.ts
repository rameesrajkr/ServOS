export type RestaurantType =
  | 'thattukada'
  | 'cafe'
  | 'bakery'
  | 'qsr'
  | 'restaurant'
  | 'fine_dining'
  | 'cloud_kitchen'
  | 'hotel_fb'
  | 'multi_outlet';

export type ServiceModel =
  | 'dine_in'
  | 'takeaway'
  | 'pickup'
  | 'delivery'
  | 'counter_service'
  | 'table_service'
  | 'room_service'
  | 'reservations'
  | 'qr_ordering';

export type StaffModel =
  | 'solo' // One person handles everything
  | 'multi_table' // One person handles multiple tables
  | 'assigned_tables' // Staff assigned to specific tables
  | 'section_based' // Staff assigned to sections
  | 'self_service'
  | 'hybrid';

export type ModuleId =
  | 'dashboard'
  | 'pos'
  | 'orders'
  | 'tables'
  | 'reservations'
  | 'kitchen'
  | 'billing'
  | 'menu'
  | 'inventory'
  | 'customers'
  | 'staff'
  | 'room_service'
  | 'procurement'
  | 'reports'
  | 'outlets'
  | 'audit_logs'
  | 'settings';

export type Role =
  | 'owner'
  | 'admin'
  | 'manager'
  | 'restaurant_manager'
  | 'waiter'
  | 'captain'
  | 'steward'
  | 'cashier'
  | 'billing_staff'
  | 'chef'
  | 'sous_chef'
  | 'barista'
  | 'kitchen_staff'
  | 'staff'
  | 'inventory_staff'
  | 'inventory_manager'
  | 'fb_director'
  | 'accountant';

export type Permission =
  | 'view_dashboard'
  | 'create_order'
  | 'view_orders'
  | 'cancel_order'
  | 'view_tables'
  | 'manage_tables'
  | 'view_kitchen'
  | 'update_kitchen_status'
  | 'manage_billing'
  | 'process_payment'
  | 'issue_refund'
  | 'manage_menu'
  | 'view_inventory'
  | 'adjust_stock'
  | 'manage_staff'
  | 'view_reports'
  | 'view_finance'
  | 'manage_reservations'
  | 'manage_room_service'
  | 'manage_modules'
  | 'manage_outlets';

export interface UserSession {
  userId: string;
  userName: string;
  restaurantId: string;
  restaurantType: RestaurantType;
  role: Role;
  roleTitle: string;
  permissions: Permission[];
  enabledModules: ModuleId[];
  outlet: string;
  assignedSection?: string;
  assignedTables?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  pin: string;
  role: Role;
  avatarUrl?: string;
  assignedTables?: string[];
  assignedSection?: string;
  outletId?: string;
}

export interface Outlet {
  id: string;
  name: string;
  code: string;
  type: string;
  address: string;
  tablesCount: number;
  activeOrdersCount: number;
  revenueToday: number;
}

export interface RestaurantConfig {
  id: string;
  name: string;
  type: RestaurantType;
  tagline: string;
  currency: string;
  currencySymbol: string;
  serviceModels: ServiceModel[];
  staffModel: StaffModel;
  enabledModules: ModuleId[];
  outlets: Outlet[];
  currentOutletId: string;
  taxRate: number; // e.g. 5% GST
  serviceChargeRate: number;
  brandColor?: string;
}

export interface MenuItemVariant {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemModifier {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  isAvailable: boolean;
  isVeg: boolean;
  prepTimeMinutes: number;
  station: 'main' | 'grill' | 'bakery' | 'beverage' | 'dessert' | 'bar';
  variants?: MenuItemVariant[];
  modifiers?: MenuItemModifier[];
  imageUrl?: string;
  outletIds?: string[];
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  selectedVariant?: MenuItemVariant;
  selectedModifiers?: MenuItemModifier[];
  notes?: string;
  station: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

export type OrderStatus =
  | 'new'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'billing_requested'
  | 'completed'
  | 'cancelled';

export type OrderType =
  | 'dine_in'
  | 'takeaway'
  | 'pickup'
  | 'delivery'
  | 'room_service';

export interface Order {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  tableNumber?: string;
  roomNumber?: string;
  guestName?: string;
  guestPhone?: string;
  guestCount?: number;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  waiterId?: string;
  waiterName?: string;
  outletId: string;
  createdAt: string;
  updatedAt: string;
  elapsedMinutes: number;
  paymentMethod?: 'cash' | 'upi' | 'card' | 'room_charge';
  isPaid: boolean;
}

export type TableStatus =
  | 'available'
  | 'occupied'
  | 'reserved'
  | 'waiting'
  | 'billing'
  | 'cleaning'
  | 'out_of_service';

export type TableSection =
  | 'Indoor'
  | 'Outdoor'
  | 'Family'
  | 'VIP'
  | 'Private Dining';

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
  section: TableSection;
  assignedStaffId?: string;
  assignedStaffName?: string;
  currentOrderId?: string;
  currentOrderAmount?: number;
  guestCount?: number;
  elapsedMinutes?: number;
  outletId: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  guestCount: number;
  date: string;
  time: string;
  tableNumber?: string;
  status: 'confirmed' | 'checked_in' | 'seated' | 'cancelled' | 'waitlist';
  specialRequests?: string;
  outletId: string;
}

export interface RoomServiceOrder {
  id: string;
  roomNumber: string;
  guestName: string;
  orderId: string;
  orderNumber: string;
  status: 'ordered' | 'preparing' | 'delivering' | 'delivered' | 'billed';
  totalAmount: number;
  deliveryTimeEstimated: string;
  chargedToFolio: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'ingredients' | 'dairy' | 'meat' | 'beverage' | 'packaging' | 'produce';
  currentStock: number;
  unit: string;
  minThreshold: number;
  costPerUnit: number;
  lastRestocked: string;
  supplierName: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalVisits: number;
  totalSpent: number;
  loyaltyPoints: number;
  favoriteItems: string[];
  preferences?: string;
  vipTier?: 'Silver' | 'Gold' | 'Platinum';
  lastVisit: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'kitchen' | 'stock' | 'billing' | 'reservation';
  isRead: boolean;
  targetRole?: Role[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  details: string;
  outletId: string;
}

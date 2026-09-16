import { ModuleId, Permission, RestaurantConfig, RestaurantType, Role, User, UserSession } from '../../types';
import { ROLE_PERMISSIONS, ROLE_ALLOWED_MODULES } from './modules';

export interface RestaurantTypeOption {
  type: RestaurantType;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  iconName: string;
  recommendedRole: Role;
}

export interface RoleOption {
  role: Role;
  title: string;
  description: string;
  iconName: string;
  defaultRedirect: ModuleId;
  defaultPin: string;
  demoUser: {
    name: string;
    email: string;
    phone: string;
    assignedSection?: string;
    assignedTables?: string[];
  };
}

export const RESTAURANT_TYPES_CATALOG: RestaurantTypeOption[] = [
  {
    type: 'thattukada',
    title: 'Thattukada',
    badge: 'Fast Food Stall',
    tagline: 'Simple, fast food service',
    description: 'Ultra-fast counter orders, instant UPI QR receipts, and quick preparation workflow.',
    iconName: 'Store',
    recommendedRole: 'owner',
  },
  {
    type: 'cafe',
    title: 'Café',
    badge: 'Artisan Cafe',
    tagline: 'Coffee, bakery & counter service',
    description: 'Espresso bar orders, barista display, pastry retail inventory, and customer tabs.',
    iconName: 'Coffee',
    recommendedRole: 'owner',
  },
  {
    type: 'bakery',
    title: 'Bakery',
    badge: 'Bakeshop & Retail',
    tagline: 'Fresh bakes, retail & pre-orders',
    description: 'Batch production, front retail sales, barcode billing, and custom cake orders.',
    iconName: 'Croissant',
    recommendedRole: 'owner',
  },
  {
    type: 'qsr',
    title: 'QSR / Fast Food',
    badge: 'Quick Service',
    tagline: 'High volume, speedy counter & takeaway',
    description: 'High-velocity order punch, token callouts, kitchen bump bar, and combo deals.',
    iconName: 'Burger',
    recommendedRole: 'owner',
  },
  {
    type: 'restaurant',
    title: 'Restaurant',
    badge: 'Full Service Dining',
    tagline: 'Dine-in, takeaway and table service',
    description: 'Interactive floor plan, waiter table ordering, KDS routing, and bill split.',
    iconName: 'Utensils',
    recommendedRole: 'owner',
  },
  {
    type: 'fine_dining',
    title: 'Fine Dining',
    badge: 'Luxury Gastronomy',
    tagline: 'Reservations, tables and guest experience',
    description: 'Course sequencing, sommelier cellar pairing, captain guest relations, and VIP seating.',
    iconName: 'Wine',
    recommendedRole: 'restaurant_manager',
  },
  {
    type: 'cloud_kitchen',
    title: 'Cloud Kitchen',
    badge: 'Ghost & Virtual Brands',
    tagline: 'Delivery aggregators & virtual brands',
    description: 'Multi-brand single-screen pipeline, Swiggy/Zomato auto-accept, and dispatch tags.',
    iconName: 'Pizza',
    recommendedRole: 'owner',
  },
  {
    type: 'hotel_fb',
    title: 'Hotel / F&B',
    badge: 'Enterprise Hospitality',
    tagline: 'Multi-outlet and advanced hospitality operations',
    description: 'Room service trolley tracking, room folio charge, multiple dining outlets & banquet P&L.',
    iconName: 'Hotel',
    recommendedRole: 'fb_director',
  },
  {
    type: 'multi_outlet',
    title: 'Multi-Outlet',
    badge: 'Restaurant Chain',
    tagline: 'Central commissary & branch network control',
    description: 'Centralized recipe catalog, branch inventory requisition, and consolidated financials.',
    iconName: 'Building2',
    recommendedRole: 'owner',
  },
];

export const RESTAURANT_ROLES_MAP: Record<RestaurantType, RoleOption[]> = {
  thattukada: [
    {
      role: 'owner',
      title: 'Owner',
      description: 'Full oversight: daily cash totals, menu prices, and quick settings.',
      iconName: 'Crown',
      defaultRedirect: 'dashboard',
      defaultPin: '1234',
      demoUser: {
        name: 'Kasim M.',
        email: 'kasim.owner@serveos.com',
        phone: '+91 98470 12340',
      },
    },
    {
      role: 'billing_staff',
      title: 'Billing Staff',
      description: 'Fast single-tap billing, instant UPI QR generation, and receipt print.',
      iconName: 'Receipt',
      defaultRedirect: 'billing',
      defaultPin: '1235',
      demoUser: {
        name: 'Bilal H.',
        email: 'bilal.bill@serveos.com',
        phone: '+91 98470 12341',
      },
    },
    {
      role: 'staff',
      title: 'Staff',
      description: 'Counter order queue, preparation checkoffs, and customer handovers.',
      iconName: 'UserCheck',
      defaultRedirect: 'orders',
      defaultPin: '1236',
      demoUser: {
        name: 'Shaji K.',
        email: 'shaji.staff@serveos.com',
        phone: '+91 98470 12342',
      },
    },
  ],

  cafe: [
    {
      role: 'owner',
      title: 'Owner',
      description: 'Sales analytics, menu margins, beans inventory, and revenue tracking.',
      iconName: 'Crown',
      defaultRedirect: 'dashboard',
      defaultPin: '1111',
      demoUser: {
        name: 'Maya Rao',
        email: 'maya.cafe@serveos.com',
        phone: '+91 98470 22001',
      },
    },
    {
      role: 'manager',
      title: 'Manager',
      description: 'Manage daily restaurant operations, barista shifts & cash balance.',
      iconName: 'ShieldCheck',
      defaultRedirect: 'dashboard',
      defaultPin: '2222',
      demoUser: {
        name: 'Kavita Sundar',
        email: 'kavita.mgr@serveos.com',
        phone: '+91 98470 22002',
      },
    },
    {
      role: 'cashier',
      title: 'Cashier',
      description: 'Front counter ordering, takeaway cups, and split tender bills.',
      iconName: 'Receipt',
      defaultRedirect: 'billing',
      defaultPin: '5555',
      demoUser: {
        name: 'Nikhil Roy',
        email: 'nikhil.cashier@serveos.com',
        phone: '+91 98470 22003',
      },
    },
    {
      role: 'barista',
      title: 'Barista',
      description: 'Espresso station display, oat/almond milk modifier alerts, and drink queue.',
      iconName: 'Coffee',
      defaultRedirect: 'kitchen',
      defaultPin: '4444',
      demoUser: {
        name: 'Devan S.',
        email: 'devan.barista@serveos.com',
        phone: '+91 98470 22004',
      },
    },
    {
      role: 'kitchen_staff',
      title: 'Kitchen Staff',
      description: 'Pastry bakehouse, hot breakfast ticket pacing, and brunch orders.',
      iconName: 'ChefHat',
      defaultRedirect: 'kitchen',
      defaultPin: '4445',
      demoUser: {
        name: 'Sunil Thomas',
        email: 'sunil.kitchen@serveos.com',
        phone: '+91 98470 22005',
      },
    },
  ],

  bakery: [
    {
      role: 'owner',
      title: 'Owner',
      description: 'Bakeshop oversight, daily retail receipts, and production profit.',
      iconName: 'Crown',
      defaultRedirect: 'dashboard',
      defaultPin: '1111',
      demoUser: {
        name: 'Thomas Varghese',
        email: 'thomas.bakery@serveos.com',
        phone: '+91 98470 33001',
      },
    },
    {
      role: 'manager',
      title: 'Manager',
      description: 'Manage counter staff, custom pre-orders, and display stock levels.',
      iconName: 'ShieldCheck',
      defaultRedirect: 'dashboard',
      defaultPin: '2222',
      demoUser: {
        name: 'Rekha Pillai',
        email: 'rekha.mgr@serveos.com',
        phone: '+91 98470 33002',
      },
    },
    {
      role: 'cashier',
      title: 'Cashier',
      description: 'Quick retail billing, packaged goods scanning, and payments.',
      iconName: 'Receipt',
      defaultRedirect: 'billing',
      defaultPin: '5555',
      demoUser: {
        name: 'Jithin Paul',
        email: 'jithin.cashier@serveos.com',
        phone: '+91 98470 33003',
      },
    },
    {
      role: 'chef',
      title: 'Pastry Chef',
      description: 'Ovens schedule, bulk ingredient batch prep, and cake customization.',
      iconName: 'ChefHat',
      defaultRedirect: 'kitchen',
      defaultPin: '4444',
      demoUser: {
        name: 'Chef Celine',
        email: 'celine.pastry@serveos.com',
        phone: '+91 98470 33004',
      },
    },
    {
      role: 'staff',
      title: 'Counter Staff',
      description: 'Order packing, pre-order pickup dispatch, and shelf replenishment.',
      iconName: 'UserCheck',
      defaultRedirect: 'orders',
      defaultPin: '3333',
      demoUser: {
        name: 'Lijo V.',
        email: 'lijo.staff@serveos.com',
        phone: '+91 98470 33005',
      },
    },
  ],

  qsr: [
    {
      role: 'owner',
      title: 'Owner',
      description: 'Turnover rate, hourly throughput, labor efficiency, and gross margins.',
      iconName: 'Crown',
      defaultRedirect: 'dashboard',
      defaultPin: '1111',
      demoUser: {
        name: 'Faizal Khan',
        email: 'faizal.qsr@serveos.com',
        phone: '+91 98470 44001',
      },
    },
    {
      role: 'manager',
      title: 'Manager',
      description: 'Speed-of-service pacing, register reconciliation, and crew shifts.',
      iconName: 'ShieldCheck',
      defaultRedirect: 'dashboard',
      defaultPin: '2222',
      demoUser: {
        name: 'Sonia Jacob',
        email: 'sonia.mgr@serveos.com',
        phone: '+91 98470 44002',
      },
    },
    {
      role: 'cashier',
      title: 'Cashier',
      description: 'High-speed touchscreen order entry, combo upsell, and customer tokens.',
      iconName: 'Receipt',
      defaultRedirect: 'billing',
      defaultPin: '5555',
      demoUser: {
        name: 'Akash Babu',
        email: 'akash.qsr@serveos.com',
        phone: '+91 98470 44003',
      },
    },
    {
      role: 'chef',
      title: 'Kitchen Line Cook',
      description: 'Fry and grill display, burger assembly, and bump bar expediting.',
      iconName: 'ChefHat',
      defaultRedirect: 'kitchen',
      defaultPin: '4444',
      demoUser: {
        name: 'Rajesh K.',
        email: 'rajesh.cook@serveos.com',
        phone: '+91 98470 44004',
      },
    },
    {
      role: 'staff',
      title: 'Crew Member',
      description: 'Tray assembly, customer counter callout, and dispatch bags.',
      iconName: 'UserCheck',
      defaultRedirect: 'orders',
      defaultPin: '3333',
      demoUser: {
        name: 'Anil C.',
        email: 'anil.crew@serveos.com',
        phone: '+91 98470 44005',
      },
    },
  ],

  restaurant: [
    {
      role: 'owner',
      title: 'Owner',
      description: 'Full restaurant oversight: daily revenue, table turns, food cost & profit.',
      iconName: 'Crown',
      defaultRedirect: 'dashboard',
      defaultPin: '1111',
      demoUser: {
        name: 'Rahul Nair',
        email: 'rahul.owner@serveos.com',
        phone: '+91 98470 11223',
      },
    },
    {
      role: 'manager',
      title: 'Manager',
      description: 'Manage daily restaurant operations, table occupancy, staff & disputes.',
      iconName: 'ShieldCheck',
      defaultRedirect: 'dashboard',
      defaultPin: '2222',
      demoUser: {
        name: 'Priya Menon',
        email: 'priya.manager@serveos.com',
        phone: '+91 98471 22334',
      },
    },
    {
      role: 'waiter',
      title: 'Waiter',
      description: 'Manage tables, orders and guest requests.',
      iconName: 'Users',
      defaultRedirect: 'tables',
      defaultPin: '3333',
      demoUser: {
        name: 'Arun K.',
        email: 'arun.waiter@serveos.com',
        phone: '+91 98472 33445',
        assignedSection: 'Indoor',
        assignedTables: ['T01', 'T02', 'T03', 'T04'],
      },
    },
    {
      role: 'cashier',
      title: 'Cashier',
      description: 'Handle bills, settlement and payments.',
      iconName: 'Receipt',
      defaultRedirect: 'billing',
      defaultPin: '5555',
      demoUser: {
        name: 'Ananya Sharma',
        email: 'ananya.cashier@serveos.com',
        phone: '+91 98474 55667',
      },
    },
    {
      role: 'chef',
      title: 'Chef',
      description: 'Manage kitchen orders and preparation.',
      iconName: 'ChefHat',
      defaultRedirect: 'kitchen',
      defaultPin: '4444',
      demoUser: {
        name: 'Chef Anton Cruz',
        email: 'anton.chef@serveos.com',
        phone: '+91 98473 44556',
      },
    },
    {
      role: 'kitchen_staff',
      title: 'Kitchen Staff',
      description: 'Line station prep, frying, roti counter, and ticket completion.',
      iconName: 'UtensilsCrossed',
      defaultRedirect: 'kitchen',
      defaultPin: '4445',
      demoUser: {
        name: 'Manoj Kumar',
        email: 'manoj.line@serveos.com',
        phone: '+91 98473 44557',
      },
    },
    {
      role: 'inventory_staff',
      title: 'Inventory Staff',
      description: 'Stock buffer audits, procurement indents, and supplier deliveries.',
      iconName: 'Boxes',
      defaultRedirect: 'inventory',
      defaultPin: '5557',
      demoUser: {
        name: 'Suresh Madhavan',
        email: 'suresh.stock@serveos.com',
        phone: '+91 98475 66778',
      },
    },
  ],

  fine_dining: [
    {
      role: 'owner',
      title: 'Owner',
      description: 'Brand prestige, Michelin pacing standards, high-ticket beverage yield.',
      iconName: 'Crown',
      defaultRedirect: 'dashboard',
      defaultPin: '1111',
      demoUser: {
        name: 'Lord Henry Sterling',
        email: 'sterling.owner@serveos.com',
        phone: '+91 98470 66001',
      },
    },
    {
      role: 'restaurant_manager',
      title: 'Restaurant Manager',
      description: 'Floor pacing, VIP guest preferences, table reservations & table turnaround.',
      iconName: 'ShieldCheck',
      defaultRedirect: 'dashboard',
      defaultPin: '2222',
      demoUser: {
        name: 'Laurent Mercier',
        email: 'laurent.mgr@serveos.com',
        phone: '+91 98470 66002',
      },
    },
    {
      role: 'captain',
      title: 'Captain',
      description: 'Section supervision, course progression, sommelier coordination & billing.',
      iconName: 'UserCheck',
      defaultRedirect: 'tables',
      defaultPin: '3334',
      demoUser: {
        name: 'Captain Joseph',
        email: 'joseph.captain@serveos.com',
        phone: '+91 98470 66003',
        assignedSection: 'Private Dining',
        assignedTables: ['T11', 'T12', 'T13', 'T14'],
      },
    },
    {
      role: 'waiter',
      title: 'Waiter',
      description: 'Discreet table service, course serving timing, and sommelier orders.',
      iconName: 'Users',
      defaultRedirect: 'tables',
      defaultPin: '3333',
      demoUser: {
        name: 'Vincent Paul',
        email: 'vincent.waiter@serveos.com',
        phone: '+91 98470 66004',
        assignedSection: 'Indoor',
        assignedTables: ['T01', 'T02', 'T03'],
      },
    },
    {
      role: 'chef',
      title: 'Chef',
      description: 'Executive culinary orchestrator, plating pass standards & course pacing.',
      iconName: 'ChefHat',
      defaultRedirect: 'kitchen',
      defaultPin: '4444',
      demoUser: {
        name: 'Chef Alain B.',
        email: 'alain.exec@serveos.com',
        phone: '+91 98470 66005',
      },
    },
    {
      role: 'sous_chef',
      title: 'Sous Chef',
      description: 'Station timing, garde manger, hot line expediting & prep lists.',
      iconName: 'UtensilsCrossed',
      defaultRedirect: 'kitchen',
      defaultPin: '4446',
      demoUser: {
        name: 'Chef Marc D.',
        email: 'marc.sous@serveos.com',
        phone: '+91 98470 66006',
      },
    },
    {
      role: 'cashier',
      title: 'Cashier',
      description: 'Discreet leather-folder bill presentation, multi-currency & corporate ledger.',
      iconName: 'Receipt',
      defaultRedirect: 'billing',
      defaultPin: '5555',
      demoUser: {
        name: 'Aditi V.',
        email: 'aditi.cashier@serveos.com',
        phone: '+91 98470 66007',
      },
    },
    {
      role: 'inventory_manager',
      title: 'Inventory Manager',
      description: 'Vintage cellar tracking, imported truffles/caviars & dry-age cold rooms.',
      iconName: 'Boxes',
      defaultRedirect: 'inventory',
      defaultPin: '6665',
      demoUser: {
        name: 'Sommelier George',
        email: 'george.cellar@serveos.com',
        phone: '+91 98470 66008',
      },
    },
  ],

  cloud_kitchen: [
    {
      role: 'owner',
      title: 'Owner',
      description: 'Multi-brand cloud kitchen sales, aggregator commission margins & ROI.',
      iconName: 'Crown',
      defaultRedirect: 'dashboard',
      defaultPin: '1111',
      demoUser: {
        name: 'Sameer Verma',
        email: 'sameer.cloud@serveos.com',
        phone: '+91 98470 77001',
      },
    },
    {
      role: 'manager',
      title: 'Kitchen Manager',
      description: 'Multi-brand order flow, packaging queue, and delivery rider handovers.',
      iconName: 'ShieldCheck',
      defaultRedirect: 'dashboard',
      defaultPin: '2222',
      demoUser: {
        name: 'Farhan Azim',
        email: 'farhan.mgr@serveos.com',
        phone: '+91 98470 77002',
      },
    },
    {
      role: 'chef',
      title: 'Head Line Cook',
      description: 'Unified KDS for 4 virtual brands, timer triggers & recipe adherence.',
      iconName: 'ChefHat',
      defaultRedirect: 'kitchen',
      defaultPin: '4444',
      demoUser: {
        name: 'Chef Danish',
        email: 'danish.cook@serveos.com',
        phone: '+91 98470 77003',
      },
    },
    {
      role: 'inventory_staff',
      title: 'Stock Officer',
      description: 'Central dry store batches, packaging material buffers & supplier indents.',
      iconName: 'Boxes',
      defaultRedirect: 'inventory',
      defaultPin: '5557',
      demoUser: {
        name: 'Roshan Mathew',
        email: 'roshan.stock@serveos.com',
        phone: '+91 98470 77004',
      },
    },
    {
      role: 'staff',
      title: 'Packaging Staff',
      description: 'Order bag sealing, tamper-proof stickers, and driver OTP validation.',
      iconName: 'UserCheck',
      defaultRedirect: 'orders',
      defaultPin: '3333',
      demoUser: {
        name: 'Nitin J.',
        email: 'nitin.pack@serveos.com',
        phone: '+91 98470 77005',
      },
    },
  ],

  hotel_fb: [
    {
      role: 'owner',
      title: 'Owner',
      description: 'Hotel board F&B revenues, GOP, banquet bookings & capital expenditures.',
      iconName: 'Crown',
      defaultRedirect: 'dashboard',
      defaultPin: '1111',
      demoUser: {
        name: 'Rajiv Singhania',
        email: 'singhania.owner@serveos.com',
        phone: '+91 98470 88001',
      },
    },
    {
      role: 'fb_director',
      title: 'F&B Director',
      description: 'Multi-outlet and advanced hospitality operations oversight across all restaurants.',
      iconName: 'Building2',
      defaultRedirect: 'dashboard',
      defaultPin: '6666',
      demoUser: {
        name: 'Alexander Vance',
        email: 'alexander.fb@serveos.com',
        phone: '+91 98476 77889',
      },
    },
    {
      role: 'restaurant_manager',
      title: 'Restaurant Manager',
      description: 'Dining room management, VIP guests, banquet coordination & shift operations.',
      iconName: 'ShieldCheck',
      defaultRedirect: 'dashboard',
      defaultPin: '7777',
      demoUser: {
        name: 'Vikramaditya Roy',
        email: 'vikram.hotel@serveos.com',
        phone: '+91 98470 88003',
      },
    },
    {
      role: 'captain',
      title: 'Captain',
      description: 'Section pacing, VIP table supervision, and room service floor orders.',
      iconName: 'UserCheck',
      defaultRedirect: 'tables',
      defaultPin: '8889',
      demoUser: {
        name: 'Captain Sebastian',
        email: 'sebastian.cap@serveos.com',
        phone: '+91 98470 88004',
        assignedSection: 'VIP',
        assignedTables: ['T01', 'T02', 'T03'],
      },
    },
    {
      role: 'waiter',
      title: 'Waiter',
      description: 'Manage tables, orders, in-room dining trays and guest requests.',
      iconName: 'Users',
      defaultRedirect: 'tables',
      defaultPin: '8888',
      demoUser: {
        name: 'Arun V.',
        email: 'arun.hotel@serveos.com',
        phone: '+91 98470 88005',
        assignedSection: 'VIP',
        assignedTables: ['T01', 'T02', 'T03'],
      },
    },
    {
      role: 'chef',
      title: 'Chef',
      description: 'Manage kitchen orders, banquet preparation & 24/7 room service menu.',
      iconName: 'ChefHat',
      defaultRedirect: 'kitchen',
      defaultPin: '9999',
      demoUser: {
        name: 'Executive Chef Marcus',
        email: 'chef.marcus@serveos.com',
        phone: '+91 98470 88006',
      },
    },
    {
      role: 'sous_chef',
      title: 'Sous Chef',
      description: 'Line production, banquet prep and culinary station expediting.',
      iconName: 'UtensilsCrossed',
      defaultRedirect: 'kitchen',
      defaultPin: '9998',
      demoUser: {
        name: 'Sous Chef Tariq',
        email: 'tariq.sous@serveos.com',
        phone: '+91 98470 88007',
      },
    },
    {
      role: 'steward',
      title: 'Steward',
      description: 'Tray clearing, room service retrieval, banquet cutlery & pantry support.',
      iconName: 'BedDouble',
      defaultRedirect: 'tables',
      defaultPin: '8887',
      demoUser: {
        name: 'Deepak Mohan',
        email: 'deepak.steward@serveos.com',
        phone: '+91 98470 88008',
      },
    },
    {
      role: 'cashier',
      title: 'Cashier',
      description: 'Handle guest billing, PMS hotel room folio settlement & corporate invoices.',
      iconName: 'Receipt',
      defaultRedirect: 'billing',
      defaultPin: '7778',
      demoUser: {
        name: 'Sneha N.',
        email: 'sneha.cashier@serveos.com',
        phone: '+91 98470 88009',
      },
    },
    {
      role: 'inventory_manager',
      title: 'Inventory Manager',
      description: 'Central hotel commissary, bulk procurement & daily par-stock replenishments.',
      iconName: 'Boxes',
      defaultRedirect: 'inventory',
      defaultPin: '6667',
      demoUser: {
        name: 'Harish Nair',
        email: 'harish.store@serveos.com',
        phone: '+91 98470 88010',
      },
    },
    {
      role: 'accountant',
      title: 'Accountant',
      description: 'Daily night audit, tax reconciliation, revenue ledger & outlet P&L.',
      iconName: 'BarChart3',
      defaultRedirect: 'reports',
      defaultPin: '6668',
      demoUser: {
        name: 'Girish Menon CA',
        email: 'girish.audit@serveos.com',
        phone: '+91 98470 88011',
      },
    },
  ],

  multi_outlet: [
    {
      role: 'owner',
      title: 'Owner',
      description: 'Consolidated chain P&L, multi-branch expansion, franchise royalty & EBITDA.',
      iconName: 'Crown',
      defaultRedirect: 'dashboard',
      defaultPin: '1111',
      demoUser: {
        name: 'Vikramaditya Group',
        email: 'vikram.group@serveos.com',
        phone: '+91 98470 99001',
      },
    },
    {
      role: 'manager',
      title: 'Operations Manager',
      description: 'Central chain operations, branch audit standards, and regional staff training.',
      iconName: 'ShieldCheck',
      defaultRedirect: 'dashboard',
      defaultPin: '2222',
      demoUser: {
        name: 'Anjali Panicker',
        email: 'anjali.ops@serveos.com',
        phone: '+91 98470 99002',
      },
    },
    {
      role: 'fb_director',
      title: 'F&B Director',
      description: 'Corporate recipe rollout, central commissary menu items & QA taste tests.',
      iconName: 'Building2',
      defaultRedirect: 'dashboard',
      defaultPin: '6666',
      demoUser: {
        name: 'Chef Director Roy',
        email: 'roy.director@serveos.com',
        phone: '+91 98470 99003',
      },
    },
    {
      role: 'cashier',
      title: 'Branch Cashier',
      description: 'Flagship branch counter register, corporate billing, and day settlement.',
      iconName: 'Receipt',
      defaultRedirect: 'billing',
      defaultPin: '5555',
      demoUser: {
        name: 'Pranav K.',
        email: 'pranav.chain@serveos.com',
        phone: '+91 98470 99004',
      },
    },
    {
      role: 'inventory_manager',
      title: 'Commissary Manager',
      description: 'Central factory bulk purchases, internal branch dispatch & warehouse transfer.',
      iconName: 'Boxes',
      defaultRedirect: 'inventory',
      defaultPin: '6667',
      demoUser: {
        name: 'Sanjeev Kumar',
        email: 'sanjeev.commissary@serveos.com',
        phone: '+91 98470 99005',
      },
    },
    {
      role: 'accountant',
      title: 'Accountant',
      description: 'Multi-branch consolidated balance sheet, GST consolidation & inter-company billing.',
      iconName: 'BarChart3',
      defaultRedirect: 'reports',
      defaultPin: '6668',
      demoUser: {
        name: 'Ramesh Shenoy CPA',
        email: 'ramesh.cpa@serveos.com',
        phone: '+91 98470 99006',
      },
    },
  ],
};

export const getRolesForRestaurantType = (type: RestaurantType): RoleOption[] => {
  return RESTAURANT_ROLES_MAP[type] || RESTAURANT_ROLES_MAP.restaurant;
};

export const getRoleDefaultModule = (role: Role): ModuleId => {
  switch (role) {
    case 'owner':
    case 'admin':
    case 'manager':
    case 'restaurant_manager':
    case 'fb_director':
      return 'dashboard';
    case 'waiter':
    case 'captain':
    case 'steward':
      return 'tables';
    case 'chef':
    case 'sous_chef':
    case 'barista':
    case 'kitchen_staff':
      return 'kitchen';
    case 'cashier':
    case 'billing_staff':
      return 'billing';
    case 'inventory_staff':
    case 'inventory_manager':
      return 'inventory';
    case 'staff':
      return 'orders';
    case 'accountant':
      return 'reports';
    default:
      return 'dashboard';
  }
};

export const createSession = (
  user: User,
  config: RestaurantConfig,
  roleTitle?: string
): UserSession => {
  const currentOutlet = config.outlets.find((o) => o.id === config.currentOutletId) || config.outlets[0];
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  const allowed = ROLE_ALLOWED_MODULES[user.role] || [];
  const enabledModules = config.enabledModules.filter((m) => allowed.includes(m));

  return {
    userId: user.id,
    userName: user.name,
    restaurantId: config.id,
    restaurantType: config.type,
    role: user.role,
    roleTitle: roleTitle || user.role.replace('_', ' ').toUpperCase(),
    permissions,
    enabledModules: enabledModules.length > 0 ? enabledModules : config.enabledModules,
    outlet: currentOutlet?.name || 'Main Outlet',
    assignedSection: user.assignedSection,
    assignedTables: user.assignedTables,
  };
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { GlobalSearchModal, ToastContainer } from './components/common/GlobalSearchModal';
import { LoginModal } from './components/auth/LoginModal';
import { OnboardingWizard } from './components/auth/OnboardingWizard';
import { EntryFlow } from './components/auth/EntryFlow';
import { AdaptiveDashboard } from './components/dashboard/AdaptiveDashboard';
import { POSView } from './components/pos/POSView';
import { KitchenDisplay } from './components/kitchen/KitchenDisplay';
import { TableFloorPlan } from './components/tables/TableFloorPlan';
import { BillingView } from './components/billing/BillingView';
import { OrdersView } from './components/orders/OrdersView';
import { MenuManagement } from './components/menu/MenuManagement';
import { InventoryView } from './components/inventory/InventoryView';
import { ReservationsView } from './components/reservations/ReservationsView';
import { RoomServiceView } from './components/roomservice/RoomServiceView';
import { CustomerCRMView } from './components/customers/CustomerCRMView';
import { StaffManagementView } from './components/staff/StaffManagementView';
import { ReportsAnalyticsView } from './components/reports/ReportsAnalyticsView';
import { ModulesSettingsView } from './components/settings/ModulesSettingsView';
import {
  Globe,
  Truck,
  QrCode,
  Wine,
  CalendarCheck,
  Building2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeModule, setActiveModule, config, isAuthenticated } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If user is not yet logged in, present the premium Entry / Onboarding flow
  if (!isAuthenticated) {
    return (
      <>
        <EntryFlow />
        <ToastContainer />
      </>
    );
  }

  // Render view corresponding to activeModule
  const renderModuleView = () => {
    switch (activeModule) {
      case 'dashboard':
        return <AdaptiveDashboard />;
      case 'pos':
        return <POSView />;
      case 'kitchen':
        return <KitchenDisplay />;
      case 'tables':
        return <TableFloorPlan />;
      case 'billing':
        return <BillingView />;
      case 'orders':
        return <OrdersView />;
      case 'menu':
        return <MenuManagement />;
      case 'inventory':
        return <InventoryView />;
      case 'reservations':
        return <ReservationsView />;
      case 'room_service':
        return <RoomServiceView />;
      case 'customers':
        return <CustomerCRMView />;
      case 'staff':
        return <StaffManagementView />;
      case 'reports':
        return <ReportsAnalyticsView />;
      case 'settings':
        return <ModulesSettingsView />;

      // Specialized pluggable modules
      case 'online_ordering':
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Globe className="h-6 w-6 text-[#0F5D73]" />
                Direct Online Ordering & Web Storefront
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                Zero-commission white-label digital ordering web link and mobile web app
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4 max-w-xl">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-gray-500">Live Store URL</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-2 border border-gray-200 text-xs">
                <code className="flex-1 font-mono text-[#0F5D73]">https://order.serveos.io/{config.name.toLowerCase().replace(/\s+/g, '-')}/menu</code>
                <button
                  onClick={() => setActiveModule('pos')}
                  className="rounded-lg bg-[#0F5D73] text-white px-3 py-1 font-bold text-xs hover:bg-[#0c4a5c]"
                >
                  Test Order
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Direct online orders flow directly into the POS queue and automatically print to the kitchen KDS.
              </p>
            </div>
          </div>
        );

      case 'delivery':
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Truck className="h-6 w-6 text-[#0F5D73]" />
                Delivery Fleet & Aggregator Dispatch
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                Direct in-house driver dispatching and automatic aggregator sync (Swiggy, Zomato, UberEats)
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
                <span className="text-xs text-gray-500 font-semibold">Active Riders on Road</span>
                <div className="text-2xl font-bold text-gray-900 mt-1">4 Drivers</div>
                <div className="text-xs text-emerald-600 mt-1">Avg 24m delivery turnaround</div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
                <span className="text-xs text-gray-500 font-semibold">Aggregator Auto-Accept</span>
                <div className="text-2xl font-bold text-emerald-600 mt-1">ONLINE</div>
                <div className="text-xs text-gray-500 mt-1">Syncing Swiggy & Zomato orders</div>
              </div>
            </div>
          </div>
        );

      case 'qr_menu':
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <QrCode className="h-6 w-6 text-[#0F5D73]" />
                Contactless Dine-in QR Code Generator
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                Generate printable table QR stands for guests to scan, browse menu, and pay directly
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs max-w-lg space-y-4">
              <div className="flex items-center justify-center p-6 bg-teal-50/50 rounded-xl border border-teal-100">
                <div className="text-center space-y-2">
                  <div className="inline-block rounded-2xl bg-white p-3 shadow-md border border-teal-200">
                    <QrCode className="h-28 w-28 text-teal-900" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">Table T04 Stand</h3>
                  <p className="text-xs text-gray-500">Scan with iPhone or Android camera to order</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sommelier':
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Wine className="h-6 w-6 text-[#0F5D73]" />
                Sommelier Cellar & Beverage Pairing
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                Vintage cellar tracking, bin locations, temperature monitoring, and culinary food pairing suggestions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
                <h3 className="font-bold text-sm text-gray-900">Château Margaux 2015</h3>
                <p className="text-xs text-gray-500">Bordeaux Grand Cru • Bin #A-14</p>
                <div className="mt-2 text-xs font-semibold text-teal-800">
                  Pairing: Tenderloin Steak Frites
                </div>
                <div className="mt-3 text-right font-bold text-sm text-gray-900">₹24,500 / btl</div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
                <h3 className="font-bold text-sm text-gray-900">Sula Dindori Reserve Shiraz</h3>
                <p className="text-xs text-gray-500">Nashik Valley • Bin #B-02</p>
                <div className="mt-2 text-xs font-semibold text-teal-800">
                  Pairing: Kozhikode Dum Biryani
                </div>
                <div className="mt-3 text-right font-bold text-sm text-gray-900">₹3,200 / btl</div>
              </div>
            </div>
          </div>
        );

      case 'multi_outlet':
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="h-6 w-6 text-[#0F5D73]" />
                Enterprise Multi-Outlet Central Chain Control
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                Centralized recipe pushes, commissary stock requisition, and multi-branch consolidated P&L
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-gray-900">Main Restaurant - Dining Room</h3>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">ONLINE</span>
                </div>
                <p className="text-xs text-gray-500">Today Sales: ₹1,48,200 • 34 tables</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-gray-900">Rooftop Sky Lounge & Bar</h3>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">ONLINE</span>
                </div>
                <p className="text-xs text-gray-500">Today Sales: ₹86,400 • 18 cocktail booths</p>
              </div>
            </div>
          </div>
        );

      default:
        return <AdaptiveDashboard />;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F7F8FA] text-gray-900 flex flex-col overflow-hidden antialiased">
      {/* Global Top Navigation Header - Fixed 72px */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Workspace Body Area below 72px Header */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Responsive Adaptive Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F7F8FA] min-h-0">
          <div className="max-w-7xl mx-auto">{renderModuleView()}</div>
        </main>
      </div>

      {/* Global Modals */}
      <LoginModal />
      <GlobalSearchModal />
      <OnboardingWizard />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

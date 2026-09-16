import React, { useState } from 'react';
import {
  Check,
  Store,
  Coffee,
  Utensils,
  Wine,
  Hotel,
  Building2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Sliders,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ModuleId, RestaurantConfig, RestaurantType, ServiceModel, StaffModel } from '../../types';
import { ALL_MODULES, DEFAULT_MODULES_BY_TYPE } from '../../lib/config/modules';

export const OnboardingWizard: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, applyOnboardingConfig } = useApp();

  const [step, setStep] = useState(1);
  const [restaurantName, setRestaurantName] = useState('My New Hospitality Venue');
  const [selectedType, setSelectedType] = useState<RestaurantType>('restaurant');
  const [selectedServices, setSelectedServices] = useState<ServiceModel[]>([
    'dine_in',
    'takeaway',
    'table_service',
  ]);
  const [selectedStaffModel, setSelectedStaffModel] = useState<StaffModel>('assigned_tables');
  const [outletCount, setOutletCount] = useState<'1' | '2-5' | '6-20' | '20+'>('1');
  const [selectedModules, setSelectedModules] = useState<ModuleId[]>(
    DEFAULT_MODULES_BY_TYPE.restaurant
  );

  if (!isOnboardingOpen) return null;

  const handleTypeSelect = (type: RestaurantType) => {
    setSelectedType(type);
    // automatically recommend modules based on selected type
    const recommended = DEFAULT_MODULES_BY_TYPE[type] || DEFAULT_MODULES_BY_TYPE.restaurant;
    setSelectedModules(recommended);
  };

  const toggleService = (svc: ServiceModel) => {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const toggleModule = (mod: ModuleId) => {
    setSelectedModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handleFinish = () => {
    const isMulti = outletCount !== '1' || selectedType === 'hotel_fb' || selectedType === 'multi_outlet';
    const config: RestaurantConfig = {
      id: `rest-custom-${Date.now()}`,
      name: restaurantName || 'ServeOS Venue',
      type: selectedType,
      tagline: `Configured via ServeOS Engine • ${selectedType.replace('_', ' ').toUpperCase()}`,
      currency: 'INR',
      currencySymbol: '₹',
      serviceModels: selectedServices,
      staffModel: selectedStaffModel,
      enabledModules: selectedModules,
      outlets: [
        {
          id: 'outlet-primary',
          name: `${restaurantName} (Main Outlet)`,
          code: 'OUT-01',
          type: selectedType,
          address: 'Primary Location',
          tablesCount: selectedType === 'thattukada' ? 4 : 16,
          activeOrdersCount: 2,
          revenueToday: 12000,
        },
        ...(isMulti
          ? [
              {
                id: 'outlet-secondary',
                name: `${restaurantName} (Branch 2)`,
                code: 'OUT-02',
                type: selectedType,
                address: 'Secondary Location',
                tablesCount: 12,
                activeOrdersCount: 1,
                revenueToday: 8500,
              },
            ]
          : []),
      ],
      currentOutletId: 'outlet-primary',
      taxRate: selectedType === 'thattukada' ? 0 : 5,
      serviceChargeRate: selectedType === 'fine_dining' || selectedType === 'hotel_fb' ? 10 : 0,
    };

    applyOnboardingConfig(config);
  };

  const businessTypes: { type: RestaurantType; title: string; desc: string }[] = [
    { type: 'thattukada', title: 'Thattukada / Food Stall', desc: 'Single operator, fast cash/UPI billing, simple stock' },
    { type: 'cafe', title: 'Café & Bakery', desc: 'Counter POS, size/milk variants, espresso bar queue' },
    { type: 'qsr', title: 'QSR / Fast Food', desc: 'Rapid tokens, kitchen prep queue, takeaway' },
    { type: 'restaurant', title: 'Family Restaurant', desc: 'Dine-in floor plan, Captain/Waiter order taking, KDS' },
    { type: 'fine_dining', title: 'Fine Dining Estate', desc: 'Multi-course, reservations, sommelier, table pacing' },
    { type: 'cloud_kitchen', title: 'Cloud Kitchen', desc: 'Multi-brand digital orders, packaging & inventory dispatch' },
    { type: 'hotel_fb', title: 'Hotel F&B & Suites', desc: 'Outlets, Room Service, Room Folio charge, Banquets' },
    { type: 'multi_outlet', title: 'Multi-Outlet Chain', desc: 'Centralized menu, inventory procurement & outlet comparison' },
  ];

  const serviceOptions: { id: ServiceModel; label: string }[] = [
    { id: 'dine_in', label: 'Dine-in' },
    { id: 'takeaway', label: 'Takeaway' },
    { id: 'pickup', label: 'Pickup' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'counter_service', label: 'Counter Service' },
    { id: 'table_service', label: 'Table Service' },
    { id: 'room_service', label: 'Room Service' },
    { id: 'reservations', label: 'Reservations & Waitlist' },
    { id: 'qr_ordering', label: 'QR Ordering' },
  ];

  const staffModels: { id: StaffModel; title: string; desc: string }[] = [
    { id: 'solo', title: 'I handle everything', desc: 'Single owner/worker handles ordering, cooking, and payment' },
    { id: 'multi_table', title: 'One person handles multiple tables', desc: 'Waiters roam and service any active table' },
    { id: 'assigned_tables', title: 'Staff are assigned to specific tables', desc: 'Table-specific waiter responsibility (T01-T05)' },
    { id: 'section_based', title: 'Staff assigned to sections', desc: 'Captains manage zones (Indoor, Outdoor, VIP)' },
    { id: 'self_service', title: 'Self-service / Counter pickup', desc: 'Customer orders at POS terminal and collects ticket' },
    { id: 'hybrid', title: 'Hybrid Model', desc: 'Mix of counter pickup and table hospitality' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOnboardingOpen(false)}
      />

      <div className="relative w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Top Header & Progress */}
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-teal-100 px-2 py-0.5 text-xs font-bold text-[#0F5D73]">
                  Step {step} of 6
                </span>
                <h2 className="text-base font-bold text-gray-900">ServeOS Configuration Wizard</h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                One universal engine • Only the features your business needs
              </p>
            </div>
            <button
              onClick={() => setIsOnboardingOpen(false)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="my-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0F5D73] transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content Area */}
        <div className="overflow-y-auto py-2 pr-1 flex-1">
          {/* STEP 1: Business Type */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Venue / Business Name
                </label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="e.g. Malabar Spice, Brew Bistro, Grand Continental"
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-[#0F5D73] focus:outline-hidden"
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  What type of business do you run?
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  This sets baseline recommended modules and operational layout.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {businessTypes.map((item) => {
                    const isSelected = selectedType === item.type;
                    return (
                      <button
                        key={item.type}
                        onClick={() => handleTypeSelect(item.type)}
                        className={`flex flex-col rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? 'border-[#0F5D73] bg-teal-50/50 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-gray-900">{item.title}</span>
                          {isSelected && <Check className="h-4 w-4 text-[#0F5D73]" />}
                        </div>
                        <span className="text-[11px] text-gray-500 mt-1 leading-snug">
                          {item.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Service Model */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  How do you serve customers?
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Select all channels and service models that apply.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {serviceOptions.map((svc) => {
                    const isChecked = selectedServices.includes(svc.id);
                    return (
                      <button
                        key={svc.id}
                        onClick={() => toggleService(svc.id)}
                        className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs font-semibold transition-all ${
                          isChecked
                            ? 'border-[#0F5D73] bg-teal-50/60 text-[#0F5D73]'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{svc.label}</span>
                        {isChecked && <Check className="h-4 w-4 shrink-0 text-[#0F5D73]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Staff Operating Model */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  How does your team work?
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Dictates whether the waiter/cashier screen shows all tables, assigned tables, or solo mode.
                </p>
                <div className="space-y-2.5">
                  {staffModels.map((model) => {
                    const isSelected = selectedStaffModel === model.id;
                    return (
                      <button
                        key={model.id}
                        onClick={() => setSelectedStaffModel(model.id)}
                        className={`flex w-full items-start justify-between rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? 'border-[#0F5D73] bg-teal-50/50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs text-gray-900">{model.title}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{model.desc}</div>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-[#0F5D73] shrink-0 mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Number of Outlets */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  How many outlets or dining venues do you operate?
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Multi-outlet configurations automatically activate central outlet switching and comparisons.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: '1', label: '1 Outlet', desc: 'Single location venue' },
                    { id: '2-5', label: '2 – 5 Outlets', desc: 'Growing local group' },
                    { id: '6-20', label: '6 – 20 Outlets', desc: 'Regional brand chain' },
                    { id: '20+', label: '20+ Outlets', desc: 'Enterprise F&B scale' },
                  ].map((o) => {
                    const isSelected = outletCount === o.id;
                    return (
                      <button
                        key={o.id}
                        onClick={() => setOutletCount(o.id as any)}
                        className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all ${
                          isSelected
                            ? 'border-[#0F5D73] bg-teal-50 text-[#0F5D73] shadow-xs'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Building2 className="h-5 w-5 mb-2 opacity-70" />
                        <span className="font-bold text-xs">{o.label}</span>
                        <span className="text-[10px] text-gray-500 mt-1">{o.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Recommended Modules Selection */}
          {step === 5 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Recommended Modules for {selectedType.replace('_', ' ').toUpperCase()}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Toggle capabilities on or off. You can always change this in Settings.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#0F5D73] bg-teal-50 px-2 py-1 rounded-md">
                  {selectedModules.length} enabled
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {Object.values(ALL_MODULES).map((mod) => {
                  const isEnabled = selectedModules.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                        isEnabled
                          ? 'border-teal-300 bg-teal-50/40 text-gray-900'
                          : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border mt-0.5 ${
                          isEnabled
                            ? 'bg-[#0F5D73] border-[#0F5D73] text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isEnabled && <Check className="h-3 w-3" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-gray-900">{mod.label}</div>
                        <div className="text-[10px] text-gray-500 truncate">{mod.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Ready & Launch */}
          {step === 6 && (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-[#0F5D73]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Your Restaurant is Ready!</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                ServeOS has configured your tailored workspace for <b>{restaurantName}</b> with{' '}
                <b>{selectedModules.length} operational modules</b> tailored to your staff model.
              </p>

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 max-w-md mx-auto text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Business Archetype:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedType.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Staff Operating Model:</span>
                  <span className="font-semibold text-gray-900">{selectedStaffModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Outlets Configured:</span>
                  <span className="font-semibold text-gray-900">{outletCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Enabled Modules:</span>
                  <span className="font-semibold text-teal-800">
                    {selectedModules.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 rounded-lg bg-[#0F5D73] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c4a5c]"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 rounded-lg bg-[#0F5D73] px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#0c4a5c]"
            >
              <span>Launch Workspace</span>
              <Sparkles className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

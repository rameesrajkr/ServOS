import React, { useState } from 'react';
import {
  Store,
  Coffee,
  Utensils,
  UtensilsCrossed,
  Wine,
  Pizza,
  Hotel,
  Building2,
  Crown,
  ShieldCheck,
  Users,
  UserCheck,
  ChefHat,
  Receipt,
  Boxes,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  KeyRound,
  Sparkles,
  Flame,
  Layers,
  Check,
  Smartphone,
  Mail,
  RefreshCw,
  Clock,
  BedDouble,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RestaurantType, Role, User } from '../../types';
import { RESTAURANT_PRESETS } from '../../lib/mockData';
import {
  RESTAURANT_TYPES_CATALOG,
  getRolesForRestaurantType,
  getRoleDefaultModule,
  RoleOption,
} from '../../lib/config/rolesAndPresets';
import { ALL_MODULES, ROLE_ALLOWED_MODULES } from '../../lib/config/modules';

type FlowStep = 'welcome' | 'select_type' | 'select_role' | 'auth' | 'loading';

export const EntryFlow: React.FC = () => {
  const { loginWithSession, switchRestaurantPreset } = useApp();

  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome');
  const [selectedType, setSelectedType] = useState<RestaurantType>('restaurant');
  const [selectedRoleOption, setSelectedRoleOption] = useState<RoleOption | null>(null);

  // Authentication inputs
  const [authMethod, setAuthMethod] = useState<'pin' | 'credentials'>('pin');
  const [pin, setPin] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Loading sequence state
  const [loadingPhase, setLoadingPhase] = useState<number>(0);

  // Helper for icons
  const getIconForType = (iconName: string) => {
    switch (iconName) {
      case 'Store':
        return <Store className="w-6 h-6" />;
      case 'Coffee':
        return <Coffee className="w-6 h-6" />;
      case 'Croissant':
      case 'Cake':
        return <UtensilsCrossed className="w-6 h-6" />;
      case 'Burger':
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      case 'Utensils':
        return <Utensils className="w-6 h-6" />;
      case 'Wine':
        return <Wine className="w-6 h-6" />;
      case 'Pizza':
        return <Pizza className="w-6 h-6" />;
      case 'Hotel':
        return <Hotel className="w-6 h-6" />;
      case 'Building2':
        return <Building2 className="w-6 h-6" />;
      default:
        return <Store className="w-6 h-6" />;
    }
  };

  const getIconForRole = (iconName: string) => {
    switch (iconName) {
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-teal-600" />;
      case 'ChefHat':
        return <ChefHat className="w-5 h-5 text-orange-600" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-emerald-600" />;
      case 'Boxes':
        return <Boxes className="w-5 h-5 text-indigo-600" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-purple-600" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-cyan-700" />;
      case 'BedDouble':
        return <BedDouble className="w-5 h-5 text-indigo-700" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-blue-700" />;
      default:
        return <Users className="w-5 h-5 text-slate-600" />;
    }
  };

  // Roles available for selected restaurant type
  const availableRoles = getRolesForRestaurantType(selectedType);

  // Step 1: Start Flow
  const handleGetStarted = () => {
    setCurrentStep('select_type');
  };

  // Step 2: Choose type and advance
  const handleSelectType = (type: RestaurantType) => {
    setSelectedType(type);
    switchRestaurantPreset(type);
    // Pre-select first role for this type
    const roles = getRolesForRestaurantType(type);
    setSelectedRoleOption(roles[0] || null);
    setCurrentStep('select_role');
  };

  // Step 3: Choose role and advance to auth
  const handleSelectRole = (roleOption: RoleOption) => {
    setSelectedRoleOption(roleOption);
    setPin(roleOption.defaultPin);
    setEmailInput(roleOption.demoUser.email);
    setPasswordInput('••••••••');
    setAuthError(null);
    setCurrentStep('auth');
  };

  // Pin Keypad Handler
  const handleKeypadPress = (digit: string) => {
    setAuthError(null);
    if (digit === 'C') {
      setPin('');
      return;
    }
    if (digit === 'DEL') {
      setPin((prev) => prev.slice(0, -1));
      return;
    }
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
    }
  };

  // Step 4 -> 5: Authenticate & Load Workspace
  const handleAuthenticate = () => {
    if (!selectedRoleOption) return;

    if (authMethod === 'pin') {
      if (pin.length < 4) {
        setAuthError('Please enter a 4-digit PIN');
        return;
      }
      // Demo validation: accept matching defaultPin or demo PINs
      if (pin !== selectedRoleOption.defaultPin && pin !== '1234' && pin !== '1111' && pin !== '2222' && pin !== '3333' && pin !== '4444' && pin !== '5555' && pin !== '6666' && pin !== '7777' && pin !== '8888' && pin !== '9999') {
        setAuthError(`Invalid PIN. Hint: Use demo PIN ${selectedRoleOption.defaultPin}`);
        return;
      }
    }

    // Begin Loading Animation Sequence (Load User Account -> Permissions -> Modules -> Workspace)
    setCurrentStep('loading');
    setLoadingPhase(1);

    setTimeout(() => {
      setLoadingPhase(2);
    }, 450);

    setTimeout(() => {
      setLoadingPhase(3);
    }, 900);

    setTimeout(() => {
      setLoadingPhase(4);
    }, 1350);

    setTimeout(() => {
      // Finalize Session Login
      const preset = RESTAURANT_PRESETS[selectedType] || RESTAURANT_PRESETS.restaurant;
      const user: User = {
        id: `user-${selectedRoleOption.role}-${Date.now().toString().slice(-4)}`,
        name: selectedRoleOption.demoUser.name,
        email: selectedRoleOption.demoUser.email,
        phone: selectedRoleOption.demoUser.phone,
        pin: selectedRoleOption.defaultPin,
        role: selectedRoleOption.role,
        assignedSection: selectedRoleOption.demoUser.assignedSection,
        assignedTables: selectedRoleOption.demoUser.assignedTables,
      };

      loginWithSession({
        user,
        config: preset,
        roleTitle: selectedRoleOption.title,
      });
    }, 1800);
  };

  // Quick direct demo preset & role launcher
  const handleQuickDemoLaunch = (type: RestaurantType, role: Role) => {
    const roles = getRolesForRestaurantType(type);
    const matched = roles.find((r) => r.role === role) || roles[0];
    setSelectedType(type);
    setSelectedRoleOption(matched);
    setPin(matched.defaultPin);

    const preset = RESTAURANT_PRESETS[type] || RESTAURANT_PRESETS.restaurant;
    const user: User = {
      id: `usr-${matched.role}-${Date.now().toString().slice(-4)}`,
      name: matched.demoUser.name,
      email: matched.demoUser.email,
      phone: matched.demoUser.phone,
      pin: matched.defaultPin,
      role: matched.role,
      assignedSection: matched.demoUser.assignedSection,
      assignedTables: matched.demoUser.assignedTables,
    };

    loginWithSession({
      user,
      config: preset,
      roleTitle: matched.title,
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-800 flex flex-col justify-between selection:bg-[#0F5D73]/15">
      {/* Top Brand Header */}
      <header className="w-full bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#0F5D73] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            S
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl text-slate-900 tracking-tight">ServeOS</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-[#0F5D73]/10 text-[#0F5D73] px-2 py-0.5 rounded-full">
                Adaptive POS & Ops
              </span>
            </div>
          </div>
        </div>

        {/* Top Right Quick Demo Shortcuts */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 hidden md:inline">Instant Sandbox:</span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleQuickDemoLaunch('thattukada', 'owner')}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              title="Test Thattukada Street Stall"
            >
              Thattukada
            </button>
            <button
              onClick={() => handleQuickDemoLaunch('restaurant', 'waiter')}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              title="Test Waiter Floor & Table Order"
            >
              Waiter View
            </button>
            <button
              onClick={() => handleQuickDemoLaunch('restaurant', 'chef')}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              title="Test Kitchen KDS"
            >
              Chef KDS
            </button>
            <button
              onClick={() => handleQuickDemoLaunch('hotel_fb', 'fb_director')}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#0F5D73]/10 text-[#0F5D73] hover:bg-[#0F5D73]/20 transition-colors"
              title="Test 5-Star Hotel F&B Director"
            >
              5-Star F&B
            </button>
          </div>
        </div>
      </header>

      {/* Main Multi-Step Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* Step 1: Welcome Screen */}
        {currentStep === 'welcome' && (
          <div className="max-w-3xl mx-auto w-full text-center space-y-8 animate-fadeIn">
            {/* Tagline & Headline */}
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F5D73]/10 text-[#0F5D73] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation Restaurant Operating System</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Run your restaurant, <br />
                <span className="text-[#0F5D73]">your way.</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl mx-auto font-normal">
                One platform that adapts to your restaurant and your team. From street stalls to 5-star hotel luxury dining.
              </p>
            </div>

            {/* Value Cards: Adaptive Capabilities */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0F5D73]/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Adaptive Archetypes</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Morphes POS, floor plans, and tax rules for Thattukada, Cafe, QSR, Fine Dining & Hotels.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0F5D73]/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Role Personalization</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Waiters get live tables, Chefs get high-speed KDS, Cashiers get rapid billing, Owners get real-time P&L.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0F5D73]/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Zero Setup Clutter</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Instant 4-digit staff PIN login. No complex enterprise onboarding or delayed configuration.
                </p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                id="btn-get-started"
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0F5D73] hover:bg-[#0b4859] text-white font-semibold text-base shadow-sm transition-all flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="btn-quick-signin"
                onClick={() => {
                  setSelectedType('restaurant');
                  const roles = getRolesForRestaurantType('restaurant');
                  setSelectedRoleOption(roles[0]);
                  setPin(roles[0].defaultPin);
                  setCurrentStep('auth');
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-base border border-slate-300 shadow-2xs transition-all cursor-pointer"
              >
                Quick Staff Sign In
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Restaurant Type */}
        {currentStep === 'select_type' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Breadcrumb */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <button
                onClick={() => setCurrentStep('welcome')}
                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Welcome
              </button>
              <div className="text-xs font-semibold text-slate-400">Step 1 of 3: Business Type</div>
            </div>

            <div className="text-center max-w-xl mx-auto space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                What type of restaurant do you run?
              </h2>
              <p className="text-sm text-slate-500">
                We customize menus, floor layouts, service modes, and tax settings for your archetype.
              </p>
            </div>

            {/* 9 Restaurant Types Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {RESTAURANT_TYPES_CATALOG.map((item) => {
                const isSelected = selectedType === item.type;
                return (
                  <div
                    key={item.type}
                    onClick={() => handleSelectType(item.type)}
                    className={`relative text-left p-4.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#0F5D73] ring-2 ring-[#0F5D73]/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#0F5D73] text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {getIconForType(item.iconName)}
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.badge}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0F5D73]" />}
                      </div>
                      <p className="text-xs font-medium text-[#0F5D73] mt-0.5">{item.tagline}</p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Selected Archetype: <strong className="text-slate-800 capitalize">{selectedType.replace('_', ' ')}</strong>
              </span>
              <button
                id="btn-continue-to-role"
                onClick={() => {
                  const roles = getRolesForRestaurantType(selectedType);
                  setSelectedRoleOption(roles[0]);
                  setCurrentStep('select_role');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#0F5D73] hover:bg-[#0b4859] text-white font-semibold text-sm shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Continue to Roles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select User Role */}
        {currentStep === 'select_role' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Breadcrumb */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <button
                onClick={() => setCurrentStep('select_type')}
                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Restaurant Type
              </button>
              <div className="text-xs font-semibold text-slate-400">Step 2 of 3: Role Workspace</div>
            </div>

            <div className="text-center max-w-xl mx-auto space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-medium">
                <span>Restaurant Archetype:</span>
                <strong className="capitalize text-slate-900">{selectedType.replace('_', ' ')}</strong>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                What’s your role?
              </h2>
              <p className="text-sm text-slate-500">
                We’ll customize your workspace, navigation menus, and permissions based on what you do.
              </p>
            </div>

            {/* Dynamic Roles for Current Restaurant Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {availableRoles.map((item) => {
                const isSelected = selectedRoleOption?.role === item.role;
                const defaultModuleInfo = ALL_MODULES[item.defaultRedirect];

                return (
                  <div
                    key={item.role}
                    onClick={() => handleSelectRole(item)}
                    className={`relative text-left p-4.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#0F5D73] ring-2 ring-[#0F5D73]/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        {getIconForRole(item.iconName)}
                      </div>
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        PIN: {item.defaultPin}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0F5D73]" />}
                      </div>

                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Redirect indicator badge */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Primary Workspace:</span>
                        <span className="font-medium text-[#0F5D73] bg-[#0F5D73]/5 px-2 py-0.5 rounded">
                          {defaultModuleInfo?.label || item.defaultRedirect}
                        </span>
                      </div>

                      {item.demoUser.assignedTables && (
                        <div className="mt-1.5 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center justify-between">
                          <span>Assigned Tables:</span>
                          <span className="font-semibold">{item.demoUser.assignedTables.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Click any role card to proceed to verification.
              </span>
              <button
                onClick={() => {
                  if (selectedRoleOption) handleSelectRole(selectedRoleOption);
                }}
                disabled={!selectedRoleOption}
                className="px-6 py-2.5 rounded-xl bg-[#0F5D73] hover:bg-[#0b4859] disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Continue with {selectedRoleOption?.title || 'Role'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Authentication Screen */}
        {currentStep === 'auth' && selectedRoleOption && (
          <div className="max-w-md mx-auto w-full space-y-6 animate-fadeIn">
            {/* Header & Breadcrumb */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <button
                onClick={() => setCurrentStep('select_role')}
                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Change Role
              </button>
              <div className="text-xs font-semibold text-slate-400">Step 3 of 3: Authentication</div>
            </div>

            {/* Role Profile Header Box */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#0F5D73]/10 text-[#0F5D73] flex items-center justify-center font-bold text-xl">
                  {selectedRoleOption.title.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    Signing in as
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">
                    {selectedRoleOption.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedRoleOption.demoUser.name} • {selectedType.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-[#0F5D73] bg-[#0F5D73]/10 px-2.5 py-1 rounded-full">
                  Verified Staff
                </span>
              </div>
            </div>

            {/* Authentication Tabs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-center p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('pin');
                    setAuthError(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                    authMethod === 'pin'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>4-Digit Staff PIN</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('credentials');
                    setAuthError(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                    authMethod === 'credentials'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email & Password</span>
                </button>
              </div>

              {/* PIN Input Mode */}
              {authMethod === 'pin' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-2">Enter staff security PIN to unlock workspace</p>
                    {/* PIN Dots */}
                    <div className="flex items-center justify-center space-x-3 my-3">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full transition-all ${
                            pin.length > i
                              ? 'bg-[#0F5D73] scale-110 ring-4 ring-[#0F5D73]/15'
                              : 'bg-slate-200 border border-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* On-Screen Touch Keypad */}
                  <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleKeypadPress(val)}
                        className={`h-12 rounded-xl text-base font-semibold transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
                          val === 'C'
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs'
                            : val === 'DEL'
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80 shadow-2xs'
                        }`}
                      >
                        {val === 'DEL' ? '⌫' : val}
                      </button>
                    ))}
                  </div>

                  {/* 1-Click Demo Fill Hint */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setPin(selectedRoleOption.defaultPin);
                        setAuthError(null);
                      }}
                      className="text-xs text-[#0F5D73] hover:underline font-medium inline-flex items-center space-x-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Demo Mode: Click to fill PIN ({selectedRoleOption.defaultPin})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Email / Password Mode */}
              {authMethod === 'credentials' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Staff Email / Phone
                    </label>
                    <input
                      type="text"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0F5D73] focus:ring-2 focus:ring-[#0F5D73]/15 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0F5D73] focus:ring-2 focus:ring-[#0F5D73]/15 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Pre-populated with verified staff account for quick demonstration.
                  </p>
                </div>
              )}

              {authError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
                  {authError}
                </div>
              )}

              {/* Sign In Button */}
              <button
                id="btn-sign-in"
                type="button"
                onClick={handleAuthenticate}
                className="w-full py-3 rounded-xl bg-[#0F5D73] hover:bg-[#0b4859] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Sign In to Workspace</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Loading & Personalizing Workspace Interstitial */}
        {currentStep === 'loading' && selectedRoleOption && (
          <div className="max-w-md mx-auto w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6 animate-fadeIn">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#0F5D73]/10 text-[#0F5D73] flex items-center justify-center font-bold text-2xl animate-pulse">
                S
              </div>
              <RefreshCw className="w-6 h-6 text-[#0F5D73] absolute -top-1 -right-1 animate-spin" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Personalizing Workspace</h3>
              <p className="text-xs text-slate-500">
                Setting up security boundaries and loading role-tailored modules
              </p>
            </div>

            {/* Checklist of phases */}
            <div className="space-y-3 text-left max-w-xs mx-auto text-xs">
              <div className="flex items-center space-x-2.5">
                {loadingPhase >= 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className={loadingPhase >= 1 ? 'font-medium text-slate-900' : 'text-slate-400'}>
                  Loaded user: {selectedRoleOption.demoUser.name}
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                {loadingPhase >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className={loadingPhase >= 2 ? 'font-medium text-slate-900' : 'text-slate-400'}>
                  Verifying permissions for {selectedRoleOption.title}...
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                {loadingPhase >= 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className={loadingPhase >= 3 ? 'font-medium text-slate-900' : 'text-slate-400'}>
                  Enabling {ROLE_ALLOWED_MODULES[selectedRoleOption.role]?.length || 6} role-approved modules...
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                {loadingPhase >= 4 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className={loadingPhase >= 4 ? 'font-medium text-slate-900' : 'text-slate-400'}>
                  Opening {ALL_MODULES[selectedRoleOption.defaultRedirect]?.label || 'Workspace'}...
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white">
        ServeOS Hospitality Platform • Multi-Tenant Adaptive Engine • Active Session Isolation
      </footer>
    </div>
  );
};

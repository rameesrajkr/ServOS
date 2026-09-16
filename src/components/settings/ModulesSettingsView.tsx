import React, { useState } from 'react';
import {
  Sliders,
  Check,
  Zap,
  Sparkles,
  Building2,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_MODULE_DEFINITIONS } from '../../lib/config/modules';
import { ModuleId, RestaurantType } from '../../types';

export const ModulesSettingsView: React.FC = () => {
  const { config, toggleModule, switchRestaurantPreset, applyOnboardingConfig } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'core', 'operations', 'management', 'enterprise'];

  const filteredModules = ALL_MODULE_DEFINITIONS.filter(
    (m) => activeCategory === 'all' || m.category === activeCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sliders className="h-6 w-6 text-[#0F5D73]" />
            Operating System Configuration & Modules
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Universal adaptive architecture: turn capabilities on or off with zero code redeployments
          </p>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Instant Archetype Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(
            [
              {
                type: 'thattukada' as RestaurantType,
                title: 'Thattukada / Food Stall',
                desc: 'Fast single-screen POS + UPI + KDS only',
              },
              {
                type: 'cafe' as RestaurantType,
                title: 'Artisan Cafe / Bakery',
                desc: 'POS + Counter + Inventory + Customers',
              },
              {
                type: 'fine_dining' as RestaurantType,
                title: 'Fine Dining Restaurant',
                desc: 'Floor plan + Sommelier + Reservations + Split bill',
              },
              {
                type: 'hotel_fb' as RestaurantType,
                title: '5-Star Hotel & Enterprise',
                desc: 'Room service + Multi-outlet + Folio billing',
              },
            ] as const
          ).map((preset) => {
            const isCurrent = config.type === preset.type;
            return (
              <button
                key={preset.type}
                onClick={() => switchRestaurantPreset(preset.type)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  isCurrent
                    ? 'border-[#0F5D73] bg-teal-50/60 ring-2 ring-[#0F5D73]/20'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900">{preset.title}</span>
                  {isCurrent && <Check className="h-4 w-4 text-[#0F5D73]" />}
                </div>
                <p className="text-[11px] text-gray-500 mt-1 leading-snug">{preset.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tax and Currency Config */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Currency Symbol</label>
          <input
            type="text"
            value={config.currencySymbol}
            onChange={(e) =>
              applyOnboardingConfig({
                ...config,
                currencySymbol: e.target.value,
              })
            }
            className="w-full rounded-lg border border-gray-200 p-2 text-xs font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">GST / Tax Rate (%)</label>
          <input
            type="number"
            value={config.taxRate}
            onChange={(e) =>
              applyOnboardingConfig({
                ...config,
                taxRate: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-gray-200 p-2 text-xs font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Service Charge (%)</label>
          <input
            type="number"
            value={config.serviceChargeRate}
            onChange={(e) =>
              applyOnboardingConfig({
                ...config,
                serviceChargeRate: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-gray-200 p-2 text-xs font-bold"
          />
        </div>
      </div>

      {/* Modules Engine Toggle Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">
            System Modules ({config.enabledModules.length} Active / {ALL_MODULE_DEFINITIONS.length} Available)
          </h2>

          <div className="flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? 'bg-[#0F5D73] text-white shadow-xs font-bold'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredModules.map((mod) => {
            const isEnabled = config.enabledModules.includes(mod.id);
            const isCore = mod.id === 'pos' || mod.id === 'dashboard';

            return (
              <div
                key={mod.id}
                className={`rounded-2xl border p-4 shadow-xs flex flex-col justify-between transition-all bg-white ${
                  isEnabled ? 'border-teal-300' : 'border-gray-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-gray-900">{mod.label}</span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gray-500">
                      {mod.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">{mod.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-500">
                    {isEnabled ? 'Active in Workspace' : 'Disabled'}
                  </span>
                  <button
                    disabled={isCore}
                    onClick={() => toggleModule(mod.id)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                      isEnabled
                        ? 'bg-[#0F5D73] text-white hover:bg-[#0c4a5c]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } disabled:opacity-40`}
                  >
                    {isCore ? 'Required' : isEnabled ? 'Enabled' : 'Enable'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

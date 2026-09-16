import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem } from '../../types';

export const MenuManagement: React.FC = () => {
  const { config, menuItems, toggleMenuItemAvailability } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ['All', ...Array.from(new Set(menuItems.map((m) => m.category)))];

  const filteredItems = menuItems.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-[#0F5D73]" />
            Menu Catalog & Recipe Engineering
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Manage dishes, preparation stations, portion variants, modifiers, and 86-lists
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#0F5D73] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c4a5c]"
        >
          <Plus className="h-4 w-4" />
          <span>Add Dish</span>
        </button>
      </div>

      {/* Category tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0F5D73] text-white shadow-xs font-bold'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-3 py-1.5 text-xs focus:border-[#0F5D73] focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Menu items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col justify-between rounded-2xl border p-4 shadow-xs transition-all bg-white ${
              item.isAvailable ? 'border-gray-200' : 'border-rose-200 bg-gray-50/70 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
                </div>
                <span className="font-extrabold text-sm text-gray-900">
                  {config.currencySymbol}
                  {item.price}
                </span>
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                {item.description}
              </p>

              {/* Station and Prep time tags */}
              <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-3">
                <span className="rounded bg-gray-100 px-2 py-0.5 uppercase font-bold text-gray-600">
                  {item.station}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.prepTimeMinutes} mins
                </span>
                <span className="text-gray-400">• {item.category}</span>
              </div>

              {/* Variants & Modifiers indicators */}
              {(item.variants || item.modifiers) && (
                <div className="space-y-1 mb-3 pt-2 border-t border-gray-100 text-[11px]">
                  {item.variants && (
                    <div className="text-gray-600">
                      <span className="font-semibold">Variants:</span>{' '}
                      {item.variants.map((v) => `${v.name} (${config.currencySymbol}${v.price})`).join(', ')}
                    </div>
                  )}
                  {item.modifiers && (
                    <div className="text-teal-800">
                      <span className="font-semibold">Add-ons:</span>{' '}
                      {item.modifiers.map((m) => `${m.name} (+${config.currencySymbol}${m.price})`).join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Toggle 86 / Availability */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                {item.isAvailable ? 'In Stock (Available)' : '86’d (Sold Out)'}
              </span>
              <button
                onClick={() => toggleMenuItemAvailability(item.id)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                  item.isAvailable
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                }`}
              >
                {item.isAvailable ? 'Active' : 'Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Add Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-bold text-sm text-gray-900">Add New Recipe / Dish</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kozhikode Halwa Ice Cream"
                  className="w-full rounded-lg border border-gray-200 p-2 focus:border-[#0F5D73] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select className="w-full rounded-lg border border-gray-200 p-2 focus:border-[#0F5D73]">
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    placeholder="250"
                    className="w-full rounded-lg border border-gray-200 p-2 focus:border-[#0F5D73]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Kitchen Prep Station</label>
                <select className="w-full rounded-lg border border-gray-200 p-2 focus:border-[#0F5D73]">
                  <option value="main">Main Kitchen</option>
                  <option value="grill">Grill & Tandoor</option>
                  <option value="bakery">Breads & Bakery</option>
                  <option value="beverage">Beverage Bar</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Ingredients and culinary notes..."
                  className="w-full rounded-lg border border-gray-200 p-2 focus:border-[#0F5D73]"
                />
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(false)}
              className="w-full rounded-xl bg-[#0F5D73] py-2.5 text-xs font-bold text-white hover:bg-[#0c4a5c]"
            >
              Save to Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

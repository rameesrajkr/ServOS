import React, { useState } from 'react';
import {
  Users,
  Search,
  Star,
  Award,
  Heart,
  Phone,
  Mail,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerCRMView: React.FC = () => {
  const { config, customers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTier, setActiveTier] = useState<string>('all');

  const filteredCustomers = customers.filter((c) => {
    const matchTier = activeTier === 'all' || c.vipTier === activeTier;
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);
    return matchTier && matchSearch;
  });

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gold':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-teal-50 text-[#0F5D73] border-teal-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-[#0F5D73]" />
            Guest Profiles & Loyalty CRM
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            VIP tiers, dining history, favorite recipes, dietary restrictions, and loyalty points
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-1">
          {['all', 'platinum', 'gold', 'silver', 'standard'].map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all ${
                activeTier === tier
                  ? 'bg-[#0F5D73] text-white shadow-xs font-bold'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-3 py-1.5 text-xs focus:border-[#0F5D73] focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:border-[#0F5D73] transition-all"
          >
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{cust.name}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <span>{cust.phone}</span>
                    {cust.email && <span>• {cust.email}</span>}
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${getTierBadge(
                    cust.vipTier
                  )}`}
                >
                  {cust.vipTier}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 p-2.5 rounded-xl text-xs mb-3">
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase">Visits</span>
                  <span className="font-extrabold text-gray-900">{cust.totalVisits}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase">Total Spend</span>
                  <span className="font-extrabold text-gray-900">
                    {config.currencySymbol}{cust.totalSpend.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase">Points</span>
                  <span className="font-extrabold text-[#0F5D73]">{cust.loyaltyPoints}</span>
                </div>
              </div>

              {/* Favorites & Tags */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1 text-gray-600">
                  <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                  <span className="font-medium">Favorites:</span>{' '}
                  <span className="text-gray-800">{cust.favoriteItems.join(', ')}</span>
                </div>

                {cust.dietaryPreferences && cust.dietaryPreferences.length > 0 && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <span className="font-medium">Dietary:</span>
                    <div className="flex gap-1">
                      {cust.dietaryPreferences.map((d) => (
                        <span key={d} className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] text-[#0F5D73]">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 mt-3 text-right">
              <span className="text-[11px] text-gray-400">Last visited: {cust.lastVisited}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

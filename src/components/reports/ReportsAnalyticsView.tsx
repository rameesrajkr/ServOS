import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  Calendar,
  Building2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsAnalyticsView: React.FC = () => {
  const { config, orders } = useApp();
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');

  // Metrics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.isPaid ? o.totalAmount : 0), 0);
  const paidOrdersCount = orders.filter((o) => o.isPaid).length;
  const aov = paidOrdersCount > 0 ? (totalRevenue / paidOrdersCount).toFixed(0) : '0';

  // Hourly distribution mock
  const hourlyData = [
    { hour: '11 AM', sales: 4200 },
    { hour: '12 PM', sales: 12400 },
    { hour: '1 PM', sales: 24800 },
    { hour: '2 PM', sales: 18200 },
    { hour: '3 PM', sales: 6100 },
    { hour: '5 PM', sales: 8900 },
    { hour: '7 PM', sales: 21500 },
    { hour: '8 PM', sales: 32400 },
    { hour: '9 PM', sales: 28100 },
    { hour: '10 PM', sales: 11200 },
  ];

  const maxSales = Math.max(...hourlyData.map((d) => d.sales));

  const topDishes = [
    { name: 'Kozhikode Dum Biryani', count: 68, revenue: 23800 },
    { name: 'Tenderloin Steak Frites', count: 34, revenue: 28900 },
    { name: 'Iced Spanish Latte', count: 72, revenue: 17280 },
    { name: 'Ghee Roast Dosa', count: 94, revenue: 11280 },
    { name: 'Truffle Porcini Risotto', count: 28, revenue: 20160 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-[#0F5D73]" />
            Business Intelligence & RevPASH
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Real-time revenue performance, hourly peak sales, seat utilization, and menu profitability
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 text-xs font-semibold">
          {(['today', 'week', 'month'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`rounded-lg px-3 py-1 capitalize transition-all ${
                dateRange === r ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Gross Sales</span>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">
            {config.currencySymbol}{totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            +18.4% vs last {dateRange}
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Paid Orders</span>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">{paidOrdersCount}</div>
          <span className="text-[11px] text-gray-400 mt-1 inline-block">
            Avg {aov} {config.currencySymbol} / guest check
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Table Turnover Pacing</span>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">42 mins</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            8m faster than target
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Estimated RevPASH</span>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">
            {config.currencySymbol}385
          </div>
          <span className="text-[11px] text-teal-700 font-semibold mt-1 inline-block">
            Peak seat efficiency
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Sales Bar Chart */}
        <div className="lg:col-span-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <h3 className="font-bold text-sm text-gray-900">Hourly Sales Distribution</h3>
            <span className="text-xs text-gray-400">Peak dining windows</span>
          </div>

          <div className="flex items-end gap-3 h-52 pt-6 px-2">
            {hourlyData.map((d) => {
              const heightPct = (d.sales / maxSales) * 100;
              return (
                <div key={d.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-gray-700 transition-opacity">
                    {config.currencySymbol}{(d.sales / 1000).toFixed(1)}k
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full rounded-t-lg bg-[#0F5D73] transition-all group-hover:bg-[#0c4a5c]"
                  />
                  <span className="text-[10px] text-gray-400 whitespace-nowrap mt-1">{d.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Recipes by Revenue */}
        <div className="lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-bold text-sm text-gray-900">Top Culinary Sellers</h3>
              <span className="text-xs text-gray-400">By Gross</span>
            </div>

            <div className="space-y-3">
              {topDishes.map((dish, i) => (
                <div key={dish.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-400">#{i + 1}</span>
                    <div>
                      <span className="font-semibold text-gray-800 line-clamp-1">{dish.name}</span>
                      <span className="text-[11px] text-gray-400">{dish.count} plates</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-gray-900">
                    {config.currencySymbol}{dish.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

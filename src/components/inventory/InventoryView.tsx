import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  Plus,
  Minus,
  Truck,
  Trash2,
  CheckCircle2,
  Search,
  ArrowDownRight,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';

export const InventoryView: React.FC = () => {
  const { config, inventory, adjustStock } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWastageModal, setShowWastageModal] = useState(false);

  const categories = ['all', 'ingredients', 'meat', 'dairy', 'beverage', 'packaging'];

  const filteredInventory = inventory.filter((item) => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const lowStockCount = inventory.filter(
    (i) => i.status === 'low_stock' || i.status === 'out_of_stock'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Boxes className="h-6 w-6 text-[#0F5D73]" />
            Stock & Inventory Operations
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Real-time stock buffers, reorder thresholds, supplier traceability, and waste logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          {lowStockCount > 0 && (
            <span className="rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              {lowStockCount} Items Below Threshold
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === cat
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
            placeholder="Search stock item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-3 py-1.5 text-xs focus:border-[#0F5D73] focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="p-3.5">Item Name & Category</th>
              <th className="p-3.5">Current Stock</th>
              <th className="p-3.5">Buffer Threshold</th>
              <th className="p-3.5">Unit Cost</th>
              <th className="p-3.5">Supplier & Restock</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Stock Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="p-3.5">
                  <div className="font-bold text-gray-900">{item.name}</div>
                  <div className="text-[11px] text-gray-500 uppercase">{item.category}</div>
                </td>
                <td className="p-3.5">
                  <span className="text-sm font-extrabold text-gray-900">
                    {item.currentStock} {item.unit}
                  </span>
                </td>
                <td className="p-3.5 text-gray-600">
                  {item.minThreshold} {item.unit}
                </td>
                <td className="p-3.5 font-medium text-gray-700">
                  {config.currencySymbol}
                  {item.costPerUnit} / {item.unit}
                </td>
                <td className="p-3.5">
                  <div className="text-gray-900 font-medium">{item.supplierName}</div>
                  <div className="text-[10px] text-gray-400">Last: {item.lastRestocked}</div>
                </td>
                <td className="p-3.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      item.status === 'out_of_stock'
                        ? 'bg-rose-500 text-white'
                        : item.status === 'low_stock'
                        ? 'bg-amber-100 text-amber-800 font-extrabold'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => adjustStock(item.id, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 shadow-xs"
                      title="Consume 1 unit"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => adjustStock(item.id, 5)}
                      className="rounded-lg bg-[#0F5D73] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#0c4a5c] shadow-xs"
                      title="Replenish stock"
                    >
                      + 5 {item.unit}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

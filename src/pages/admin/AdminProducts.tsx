import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, AlertTriangle, Check, Edit2 } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { StorageService } from '../../services/storage';
import { RetailProduct } from '../../types';

export const AdminProducts: React.FC = () => {
  const { products } = useSalon();
  const [productList, setProductList] = useState<RetailProduct[]>(products);

  const handleAdjustStock = (productId: string, delta: number) => {
    const updated = productList.map((p) => {
      if (p.id === productId) {
        const nextStock = Math.max(0, p.stock + delta);
        return { ...p, stock: nextStock, inStock: nextStock > 0 };
      }
      return p;
    });
    setProductList(updated);
    StorageService.saveProducts(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif-title font-semibold text-[#26231E]">
            Retail & Apothecary Inventory
          </h1>
          <p className="text-xs text-[#77716C] pt-0.5">
            Monitor product stock quantities, retail prices, and inventory levels in Karachi.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E0D8] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F4] text-[#77716C] border-b border-[#E7E0D8] uppercase tracking-wider text-[10px] font-semibold">
            <tr>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Brand & Category</th>
              <th className="py-3 px-4">Volume</th>
              <th className="py-3 px-4">Retail Price</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Quick Stock Stepper</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF8F4]">
            {productList.map((prod) => (
              <tr key={prod.id} className="hover:bg-[#FAF8F4] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover border border-[#E7E0D8] shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-[#26231E]">{prod.name}</div>
                      <div className="text-[11px] text-[#77716C] line-clamp-1 max-w-xs">{prod.description}</div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-[#77716C]">
                  <div>{prod.brand}</div>
                  <div className="text-[10px] text-[#A77A7E]">{prod.category}</div>
                </td>

                <td className="py-3.5 px-4 font-mono text-[#77716C]">
                  {prod.size}
                </td>

                <td className="py-3.5 px-4 font-bold text-[#26231E]">
                  Rs. {prod.price.toLocaleString()}
                </td>

                <td className="py-3.5 px-4">
                  <span className={`font-mono font-bold text-sm ${prod.stock < 10 ? 'text-amber-700' : 'text-[#26231E]'}`}>
                    {prod.stock} units
                  </span>
                  {prod.stock < 10 && (
                    <span className="text-[10px] text-amber-700 block flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3 h-3" /> Low stock
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      prod.inStock ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {prod.inStock ? 'In Stock' : 'Sold Out'}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleAdjustStock(prod.id, -1)}
                      className="w-7 h-7 rounded border border-[#E7E0D8] bg-white flex items-center justify-center hover:bg-[#FAF8F4]"
                      title="Decrease Stock"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleAdjustStock(prod.id, 1)}
                      className="w-7 h-7 rounded border border-[#E7E0D8] bg-white flex items-center justify-center hover:bg-[#FAF8F4]"
                      title="Increase Stock"
                    >
                      <Plus className="w-3.5 h-3.5" />
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

import React from 'react';
import { Product } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';
import { Plus, SlidersHorizontal, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onCustomize: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onCustomize }) => {
  const { addToCart, showToast } = useRestaurant();

  const hasOptions = product.optionGroups && product.optionGroups.length > 0;

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasOptions) {
      onCustomize(product);
    } else {
      addToCart({
        productOrDeal: product,
        isDeal: false,
        quantity: 1,
      });
    }
  };

  // Convert dietary tags to clean unboxed label
  const tagsMap: Record<string, string> = {
    'chef-special': "Chef's Special",
    bestseller: 'Bestseller',
    halal: 'Halal',
    vegetarian: 'Vegetarian',
    spicy: 'Spicy',
  };

  const tagLabels = product.dietary.map((d) => tagsMap[d] || d);

  return (
    <div
      onClick={() => onCustomize(product)}
      className="group bg-white rounded-2xl border border-[#E8E2DA] overflow-hidden hover:border-[#B64E35]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Image Container */}
        <div className="relative h-48 sm:h-52 w-full bg-[#FAF8F4] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

          {/* Spice indicators if any */}
          {product.spiceLevel !== undefined && product.spiceLevel > 0 && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-0.5 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md text-white text-[11px] font-medium">
              <Flame className="w-3 h-3 text-[#B64E35]" />
              <span>{product.spiceLevel === 1 ? 'Mild' : product.spiceLevel === 2 ? 'Medium' : 'Fiery'}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-2">
          {/* Clean Unboxed Metadata */}
          {tagLabels.length > 0 && (
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#B64E35] uppercase tracking-wider">
              {tagLabels.slice(0, 2).map((label, idx) => (
                <React.Fragment key={label}>
                  {idx > 0 && <span className="text-[#E8E2DA]" aria-hidden="true">·</span>}
                  <span>{label}</span>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-serif font-bold text-lg text-[#25231F] leading-snug group-hover:text-[#B64E35] transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#77736D] line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Portion indicator if defined */}
          {product.portionSize && (
            <div className="text-[11px] text-[#77736D]/80">
              {product.portionSize}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Price & Add Button */}
      <div className="p-4 sm:p-5 pt-0 flex items-center justify-between gap-3 border-t border-[#FAF8F4] mt-2">
        <div>
          <span className="text-[11px] text-[#77736D] block">Price</span>
          <span className="text-base font-bold text-[#25231F] font-sans">
            Rs. {product.price.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAction}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
            hasOptions
              ? 'bg-[#FAF8F4] hover:bg-[#F5E9E2] text-[#B64E35] border border-[#E8E2DA]'
              : 'bg-[#B64E35] hover:bg-[#9B3F28] text-white active:scale-95'
          }`}
        >
          {hasOptions ? (
            <>
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Customize
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add
            </>
          )}
        </button>
      </div>
    </div>
  );
};

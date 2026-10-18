import React, { useState, useEffect } from 'react';
import { Product, Deal, CartSelectedOption } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';
import { X, Plus, Minus, Check, Flame, AlertCircle } from 'lucide-react';

interface ProductCustomizerModalProps {
  item: Product | Deal | null;
  isDeal?: boolean;
  onClose: () => void;
}

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  item,
  isDeal = false,
  onClose,
}) => {
  const { addToCart } = useRestaurant();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<CartSelectedOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize default options when item opens
  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setSpecialInstructions('');
    setValidationError(null);

    const initial: CartSelectedOption[] = [];
    if (item.optionGroups) {
      item.optionGroups.forEach((group) => {
        // Pick default choice if available
        const defaultChoice = group.choices.find((c) => c.isDefault) || (group.required ? group.choices[0] : null);
        if (defaultChoice) {
          initial.push({
            groupId: group.id,
            groupName: group.name,
            choiceId: defaultChoice.id,
            choiceName: defaultChoice.name,
            price: defaultChoice.price,
          });
        }
      });
    }
    setSelectedOptions(initial);
  }, [item]);

  if (!item) return null;

  // Calculate current unit price
  const extraOptionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const currentUnitPrice = item.price + extraOptionsPrice;
  const currentTotalPrice = currentUnitPrice * quantity;

  // Handle single selection (radio-like)
  const handleSingleSelect = (group: { id: string; name: string }, choice: { id: string; name: string; price: number }) => {
    setValidationError(null);
    setSelectedOptions((prev) => {
      const filtered = prev.filter((o) => o.groupId !== group.id);
      return [
        ...filtered,
        {
          groupId: group.id,
          groupName: group.name,
          choiceId: choice.id,
          choiceName: choice.name,
          price: choice.price,
        },
      ];
    });
  };

  // Handle multi selection (checkbox-like)
  const handleMultiSelect = (
    group: { id: string; name: string; maxSelect: number },
    choice: { id: string; name: string; price: number }
  ) => {
    setValidationError(null);
    setSelectedOptions((prev) => {
      const alreadySelected = prev.some((o) => o.groupId === group.id && o.choiceId === choice.id);
      if (alreadySelected) {
        return prev.filter((o) => !(o.groupId === group.id && o.choiceId === choice.id));
      }
      const currentInGroup = prev.filter((o) => o.groupId === group.id);
      if (group.maxSelect && currentInGroup.length >= group.maxSelect) {
        // Replace or keep
        return prev;
      }
      return [
        ...prev,
        {
          groupId: group.id,
          groupName: group.name,
          choiceId: choice.id,
          choiceName: choice.name,
          price: choice.price,
        },
      ];
    });
  };

  const handleAddToCart = () => {
    // Validate required groups
    if (item.optionGroups) {
      for (const group of item.optionGroups) {
        const selectedInGroup = selectedOptions.filter((o) => o.groupId === group.id);
        if (group.required && selectedInGroup.length < group.minSelect) {
          setValidationError(`Please select your preference for "${group.name}".`);
          return;
        }
      }
    }

    addToCart({
      productOrDeal: item,
      isDeal,
      quantity,
      selectedOptions,
      specialInstructions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8E2DA] flex flex-col max-h-[92vh]">
        {/* Modal Image & Close */}
        <div className="relative h-56 sm:h-64 w-full bg-[#FAF8F4] overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#25231F] flex items-center justify-center backdrop-blur-xs transition-colors shadow-sm"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl sm:text-2xl font-serif font-bold drop-shadow-sm">
              {item.name}
            </h3>
            <div className="text-sm font-semibold text-white/90 mt-0.5">
              Base: Rs. {item.price.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <p className="text-xs sm:text-sm text-[#77736D] leading-relaxed">
            {item.description}
          </p>

          {/* Option Groups */}
          {item.optionGroups && item.optionGroups.map((group) => {
            const isSingle = group.maxSelect === 1;
            const currentSelected = selectedOptions.filter((o) => o.groupId === group.id);

            return (
              <div key={group.id} className="space-y-3 pt-3 border-t border-[#E8E2DA]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#25231F]">
                    {group.name}
                  </span>
                  <span className="text-[11px] text-[#77736D]">
                    {group.required ? (
                      <span className="text-[#B64E35] font-medium">Required</span>
                    ) : (
                      <span>Optional (up to {group.maxSelect})</span>
                    )}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.choices.map((choice) => {
                    const isChecked = currentSelected.some((c) => c.choiceId === choice.id);

                    return (
                      <div
                        key={choice.id}
                        onClick={() =>
                          isSingle
                            ? handleSingleSelect(group, choice)
                            : handleMultiSelect(group, choice)
                        }
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#F5E9E2]/60 border-[#B64E35] text-[#25231F]'
                            : 'bg-white border-[#E8E2DA] hover:border-[#77736D]/40 text-[#25231F]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-${
                              isSingle ? 'full' : 'md'
                            } border flex items-center justify-center ${
                              isChecked
                                ? 'bg-[#B64E35] border-[#B64E35] text-white'
                                : 'border-[#E8E2DA]'
                            }`}
                          >
                            {isChecked && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span className="text-xs sm:text-sm font-medium">{choice.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-[#77736D]">
                          {choice.price > 0 ? `+Rs. ${choice.price}` : 'Free'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Instructions */}
          <div className="space-y-2 pt-3 border-t border-[#E8E2DA]">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#25231F] block">
              Special Instructions
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less oil, extra green chillies, packing separately..."
              className="w-full text-xs sm:text-sm p-3 bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl focus:outline-none focus:border-[#B64E35] text-[#25231F] resize-none"
            />
          </div>

          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Modal Footer: Quantity & Submit */}
        <div className="p-4 sm:p-6 border-t border-[#E8E2DA] bg-[#FAF8F4] flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center bg-white border border-[#E8E2DA] rounded-xl p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#77736D] hover:text-[#25231F] hover:bg-[#FAF8F4] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs sm:text-sm font-bold text-[#25231F]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#77736D] hover:text-[#25231F] hover:bg-[#FAF8F4] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to order CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-between"
          >
            <span>Add to Order</span>
            <span className="font-bold">Rs. {currentTotalPrice.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

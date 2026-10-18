import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Branch, DeliveryArea, OrderType } from '../../types';
import {
  MapPin,
  Bike,
  ShoppingBag,
  Navigation,
  Check,
  Clock,
  AlertTriangle,
  X,
  Loader2,
  ChevronRight
} from 'lucide-react';

export const BranchSelectorModal: React.FC = () => {
  const {
    config,
    branches,
    deliveryAreas,
    orderType,
    setOrderType,
    selectedBranch,
    selectedDeliveryArea,
    attemptChangeBranch,
    isBranchModalOpen,
    closeBranchModal,
    cartCount,
    showToast,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<OrderType>(orderType);
  const [tempBranchId, setTempBranchId] = useState<string>(selectedBranch?.id || branches[0]?.id || '');
  const [tempAreaId, setTempAreaId] = useState<string>(selectedDeliveryArea?.id || deliveryAreas[0]?.id || '');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Sync state whenever modal opens
  useEffect(() => {
    if (isBranchModalOpen) {
      setActiveTab(orderType);
      if (selectedBranch) setTempBranchId(selectedBranch.id);
      if (selectedDeliveryArea) setTempAreaId(selectedDeliveryArea.id);
      setLocationStatus(null);
    }
  }, [isBranchModalOpen, orderType, selectedBranch, selectedDeliveryArea]);

  // When area changes in Delivery mode, auto-select corresponding branch
  useEffect(() => {
    if (activeTab === 'delivery' && tempAreaId) {
      const area = deliveryAreas.find((a) => a.id === tempAreaId);
      if (area && area.assignedBranchId) {
        setTempBranchId(area.assignedBranchId);
      }
    }
  }, [tempAreaId, activeTab, deliveryAreas]);

  if (!isBranchModalOpen) return null;

  const currentChosenBranch = branches.find((b) => b.id === tempBranchId);
  const currentChosenArea = deliveryAreas.find((a) => a.id === tempAreaId);

  // Geolocation handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser. Please select your neighborhood manually.');
      showToast('Geolocation not supported.', 'warning');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Locating your position in Karachi...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;

        // Calculate nearest branch based on Haversine distance
        let nearestBranch: Branch = branches[0];
        let minDistance = Infinity;

        branches.forEach((branch) => {
          const dLat = (branch.coordinates.lat - latitude) * (Math.PI / 180);
          const dLng = (branch.coordinates.lng - longitude) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latitude * (Math.PI / 180)) *
              Math.cos(branch.coordinates.lat * (Math.PI / 180)) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const dist = 6371 * c; // Earth radius in km

          if (dist < minDistance) {
            minDistance = dist;
            nearestBranch = branch;
          }
        });

        // Find best matching area for this branch
        const matchedArea = deliveryAreas.find((a) => a.assignedBranchId === nearestBranch.id) || deliveryAreas[0];

        setTempBranchId(nearestBranch.id);
        if (matchedArea) {
          setTempAreaId(matchedArea.id);
        }
        setLocationStatus(`Located near ${nearestBranch.area}. Assigned to ${nearestBranch.name}.`);
        showToast(`Located near ${nearestBranch.name}`, 'success');
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve location. Please choose your area from the list.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please select your neighborhood manually.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location lookup timed out. Please choose your area manually.';
        }
        setLocationStatus(msg);
        showToast(msg, 'warning');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleConfirm = () => {
    if (!currentChosenBranch) return;

    if (activeTab === 'delivery' && !currentChosenArea) {
      showToast('Please select your delivery neighborhood.', 'error');
      return;
    }

    setOrderType(activeTab);
    attemptChangeBranch(currentChosenBranch, activeTab === 'delivery' ? currentChosenArea : null);
    closeBranchModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8E2DA] flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#E8E2DA] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B64E35] font-semibold">
              {config.name}
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#25231F] mt-0.5">
              Select Your Order Type
            </h2>
          </div>
          <button
            onClick={closeBranchModal}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#77736D] hover:text-[#25231F] hover:bg-[#FAF8F4] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Order Type Segmented Control */}
          <div className="grid grid-cols-2 p-1.5 bg-[#FAF8F4] rounded-xl border border-[#E8E2DA]">
            <button
              type="button"
              onClick={() => setActiveTab('delivery')}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'delivery'
                  ? 'bg-white text-[#B64E35] shadow-sm'
                  : 'text-[#77736D] hover:text-[#25231F]'
              }`}
            >
              <Bike className="w-4 h-4" />
              Delivery
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pickup')}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'pickup'
                  ? 'bg-white text-[#B64E35] shadow-sm'
                  : 'text-[#77736D] hover:text-[#25231F]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Takeaway / Pick-Up
            </button>
          </div>

          {/* Delivery Mode View */}
          {activeTab === 'delivery' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="area-select" className="text-xs font-semibold uppercase tracking-wider text-[#77736D]">
                    Delivery Neighborhood (Karachi)
                  </label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B64E35] hover:text-[#9B3F28] transition-colors disabled:opacity-50"
                  >
                    {isLocating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Navigation className="w-3.5 h-3.5" />
                    )}
                    Use Current Location
                  </button>
                </div>

                <div className="relative">
                  <select
                    id="area-select"
                    value={tempAreaId}
                    onChange={(e) => setTempAreaId(e.target.value)}
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-3 text-sm text-[#25231F] font-medium focus:outline-none focus:border-[#B64E35] focus:ring-1 focus:ring-[#B64E35] transition-colors appearance-none cursor-pointer"
                  >
                    {deliveryAreas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name} — Rs. {area.deliveryFee} Delivery
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-4 h-4 text-[#77736D] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {locationStatus && (
                  <p className="mt-2 text-xs text-[#77736D] bg-[#FAF8F4] p-2.5 rounded-lg border border-[#E8E2DA]">
                    {locationStatus}
                  </p>
                )}
              </div>

              {/* Serviceability Card */}
              {currentChosenBranch && currentChosenArea && (
                <div className="bg-[#F5E9E2]/50 border border-[#B64E35]/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold text-[#B64E35] uppercase tracking-wider">
                        Serving Kitchen
                      </div>
                      <h4 className="text-base font-serif font-bold text-[#25231F]">
                        {currentChosenBranch.name}
                      </h4>
                      <p className="text-xs text-[#77736D] mt-0.5">{currentChosenBranch.address}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <Check className="w-3 h-3" /> Kitchen Open
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#B64E35]/15 text-xs">
                    <div>
                      <span className="text-[#77736D] block">Est. Arrival</span>
                      <span className="font-semibold text-[#25231F]">
                        {currentChosenArea.estMinutes}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#77736D] block">Delivery Fee</span>
                      <span className="font-semibold text-[#25231F]">
                        Rs. {currentChosenArea.deliveryFee}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#77736D] block">Min. Order</span>
                      <span className="font-semibold text-[#25231F]">
                        Rs. {currentChosenArea.minOrder}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pick-Up Mode View */}
          {activeTab === 'pickup' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#77736D] block">
                Select Pickup Branch
              </label>

              <div className="space-y-2.5">
                {branches
                  .filter((b) => b.supportedOrderTypes.includes('pickup'))
                  .map((branch) => {
                    const isSelected = tempBranchId === branch.id;
                    return (
                      <div
                        key={branch.id}
                        onClick={() => setTempBranchId(branch.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#F5E9E2]/50 border-[#B64E35] shadow-xs'
                            : 'bg-white border-[#E8E2DA] hover:border-[#77736D]/40'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-base text-[#25231F]">
                                {branch.name}
                              </span>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-[#B64E35]" />
                              )}
                            </div>
                            <p className="text-xs text-[#77736D] mt-1">{branch.address}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-[#77736D]">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {branch.hours}
                              </span>
                              <span>Ready in: {branch.estPickupTimeMinutes}</span>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? 'border-[#B64E35] bg-[#B64E35] text-white'
                                : 'border-[#E8E2DA]'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Cart Warning if branch changed with existing items */}
          {cartCount > 0 && selectedBranch && selectedBranch.id !== tempBranchId && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                You have {cartCount} item(s) in your cart. Switching kitchen branch will update delivery fees and ensure fresh availability.
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E8E2DA] bg-[#FAF8F4] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={closeBranchModal}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#77736D] hover:text-[#25231F] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center justify-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-xs transition-all active:scale-[0.98]"
          >
            Confirm & Start Ordering
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

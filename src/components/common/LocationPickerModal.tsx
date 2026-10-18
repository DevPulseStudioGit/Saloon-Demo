import React, { useEffect, useState } from 'react';
import { Check, MapPin, Navigation, X } from 'lucide-react';
import { Branch } from '../../types';

interface LocationPickerModalProps {
  branches: Branch[];
  selectedBranchId: string;
  isOpen: boolean;
  isFirstVisit?: boolean;
  onSelect: (branchId: string) => void;
  onClose: () => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  branches,
  selectedBranchId,
  isOpen,
  isFirstVisit = false,
  onSelect,
  onClose
}) => {
  const [pendingBranchId, setPendingBranchId] = useState(selectedBranchId);
  const [locationMessage, setLocationMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPendingBranchId(selectedBranchId);
      setLocationMessage('');
    }
  }, [isOpen, selectedBranchId]);

  if (!isOpen) return null;

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location access is not supported. Please choose a studio below.');
      return;
    }

    setLocationMessage('We use your location only to help you choose a nearby studio.');
    navigator.geolocation.getCurrentPosition(
      () => setLocationMessage('Thanks. Please choose the studio that works best for you.'),
      () => setLocationMessage('Location access was unavailable. You can choose a studio manually.')
    );
  };

  const handleConfirm = () => {
    if (!pendingBranchId) return;
    onSelect(pendingBranchId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#26231E]/60 p-4 backdrop-blur-sm motion-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-picker-title"
        className="motion-scale-in w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E7E0D8] bg-[#F7F4EF] shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-[#E7E0D8] p-6 sm:p-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A77A7E]">
              Luma Atelier Karachi
            </span>
            <h2 id="location-picker-title" className="mt-2 font-serif-title text-3xl font-semibold text-[#26231E]">
              Choose your preferred studio
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#77716C]">
              {isFirstVisit
                ? 'Select a studio to see the most relevant availability and make booking easier.'
                : 'Your studio selection will guide availability and booking options across the website.'}
            </p>
          </div>
          {!isFirstVisit && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-[#77716C] transition-colors hover:bg-white hover:text-[#26231E]"
              aria-label="Close location picker"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <button
            type="button"
            onClick={handleUseLocation}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#A77A7E] transition-colors hover:text-[#26231E]"
          >
            <Navigation className="h-4 w-4" />
            Use my location to help me decide
          </button>
          {locationMessage && <p className="text-xs text-[#77716C]">{locationMessage}</p>}

          <div className="grid gap-4 sm:grid-cols-2">
            {branches.filter((branch) => branch.active).map((branch) => {
              const isSelected = pendingBranchId === branch.id;
              return (
                <button
                  type="button"
                  key={branch.id}
                  onClick={() => setPendingBranchId(branch.id)}
                  className={`group rounded-xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isSelected
                      ? 'border-[#A77A7E] bg-white shadow-md'
                      : 'border-[#E7E0D8] bg-white/60 hover:border-[#C8A96A]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9DADA]/60 text-[#A77A7E]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                      isSelected ? 'border-[#A77A7E] bg-[#A77A7E] text-white' : 'border-[#D7CEC5] text-transparent'
                    }`}>
                      <Check className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif-title text-xl font-semibold text-[#26231E]">{branch.name}</h3>
                  <p className="mt-1 text-sm font-medium text-[#A77A7E]">{branch.area}</p>
                  <p className="mt-3 text-xs leading-5 text-[#77716C]">{branch.address}</p>
                  <p className="mt-2 text-xs text-[#77716C]">{branch.hours}</p>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full rounded-md bg-[#26231E] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3D3730] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!pendingBranchId}
          >
            Continue to Luma Atelier
          </button>
        </div>
      </div>
    </div>
  );
};

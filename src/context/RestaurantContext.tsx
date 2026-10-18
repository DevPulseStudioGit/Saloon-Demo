import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  RestaurantConfig,
  Branch,
  DeliveryArea,
  CartItem,
  OrderType,
  Product,
  Deal,
  CartSelectedOption
} from '../types';
import { StorageService, subscribeToStorageChanges } from '../services/storage';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

interface RestaurantContextType {
  config: RestaurantConfig;
  branches: Branch[];
  deliveryAreas: DeliveryArea[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch) => void;
  selectedDeliveryArea: DeliveryArea | null;
  setSelectedDeliveryArea: (area: DeliveryArea | null) => void;
  isBranchModalOpen: boolean;
  openBranchModal: () => void;
  closeBranchModal: () => void;
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartTotal: number;
  addToCart: (params: {
    productOrDeal: Product | Deal;
    isDeal?: boolean;
    quantity: number;
    selectedOptions?: CartSelectedOption[];
    specialInstructions?: string;
  }) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  // Branch change safeguard
  attemptChangeBranch: (newBranch: Branch, newArea?: DeliveryArea | null) => boolean;
  // Route state
  currentPath: string;
  navigateTo: (path: string) => void;
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (text: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'dineframe_active_cart_v1';
const ORDER_CONTEXT_KEY = 'dineframe_order_context_v1';

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Live Config & Storage Data
  const [config, setConfig] = useState<RestaurantConfig>(() => StorageService.getConfig());
  const [branches, setBranches] = useState<Branch[]>(() => StorageService.getBranches());
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>(() => StorageService.getDeliveryAreas());

  // Subscribe to storage modifications (e.g. settings saved in Admin)
  useEffect(() => {
    const unsubscribe = subscribeToStorageChanges(() => {
      setConfig(StorageService.getConfig());
      setBranches(StorageService.getBranches());
      setDeliveryAreas(StorageService.getDeliveryAreas());
    });
    return unsubscribe;
  }, []);

  // Sync custom theme CSS variables to :root
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', config.theme.primaryColor);
    document.documentElement.style.setProperty('--primary-hover', config.theme.primaryHover);
    document.documentElement.style.setProperty('--bg-color', config.theme.backgroundColor);
  }, [config.theme]);

  // Order Context (Branch & Order Type)
  const [orderType, setOrderTypeState] = useState<OrderType>(() => {
    try {
      const saved = localStorage.getItem(ORDER_CONTEXT_KEY);
      if (saved) return JSON.parse(saved).orderType || 'delivery';
    } catch {}
    return 'delivery';
  });

  const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(() => {
    try {
      const saved = localStorage.getItem(ORDER_CONTEXT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const found = StorageService.getBranches().find((b) => b.id === parsed.branchId);
        if (found) return found;
      }
    } catch {}
    // Default to first active branch
    return StorageService.getBranches().find((b) => b.active) || null;
  });

  const [selectedDeliveryArea, setSelectedDeliveryAreaState] = useState<DeliveryArea | null>(() => {
    try {
      const saved = localStorage.getItem(ORDER_CONTEXT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const found = StorageService.getDeliveryAreas().find((a) => a.id === parsed.deliveryAreaId);
        if (found) return found;
      }
    } catch {}
    return StorageService.getDeliveryAreas().find((a) => a.active) || null;
  });

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Save Cart & Order context to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(
        ORDER_CONTEXT_KEY,
        JSON.stringify({
          orderType,
          branchId: selectedBranch?.id,
          deliveryAreaId: selectedDeliveryArea?.id,
        })
      );
    } catch {}
  }, [orderType, selectedBranch, selectedDeliveryArea]);

  // Navigation state (Clean pushState routing)
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Branch Modal Triggers
  const openBranchModal = useCallback(() => setIsBranchModalOpen(true), []);
  const closeBranchModal = useCallback(() => setIsBranchModalOpen(false), []);

  const setOrderType = useCallback((type: OrderType) => {
    setOrderTypeState(type);
  }, []);

  const setSelectedBranch = useCallback((branch: Branch) => {
    setSelectedBranchState(branch);
  }, []);

  const setSelectedDeliveryArea = useCallback((area: DeliveryArea | null) => {
    setSelectedDeliveryAreaState(area);
  }, []);

  // Cart operations
  const addToCart = useCallback(
    ({
      productOrDeal,
      isDeal = false,
      quantity,
      selectedOptions = [],
      specialInstructions = '',
    }: {
      productOrDeal: Product | Deal;
      isDeal?: boolean;
      quantity: number;
      selectedOptions?: CartSelectedOption[];
      specialInstructions?: string;
    }) => {
      // Calculate unit price: base price + selected options extra
      const optionsTotal = selectedOptions.reduce((acc, opt) => acc + opt.price, 0);
      const unitPrice = productOrDeal.price + optionsTotal;

      // Unique hash ID for this specific combination of item + options + instructions
      const optionsHash = selectedOptions
        .map((o) => `${o.groupId}:${o.choiceId}`)
        .sort()
        .join('|');
      const cartItemId = `${productOrDeal.id}-${optionsHash}-${specialInstructions.trim()}`;

      setCart((prev) => {
        const existingIdx = prev.findIndex((item) => item.cartItemId === cartItemId);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx].quantity += quantity;
          return updated;
        }
        const newItem: CartItem = {
          cartItemId,
          productId: productOrDeal.id,
          isDeal,
          name: productOrDeal.name,
          basePrice: productOrDeal.price,
          unitPrice,
          quantity,
          image: productOrDeal.image,
          selectedOptions,
          specialInstructions: specialInstructions.trim() || undefined,
        };
        return [...prev, newItem];
      });

      showToast(`Added ${quantity}x "${productOrDeal.name}" to your order.`, 'success');
    },
    [showToast]
  );

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Branch change with cart inspection
  const attemptChangeBranch = useCallback(
    (newBranch: Branch, newArea?: DeliveryArea | null): boolean => {
      setSelectedBranchState(newBranch);
      if (newArea !== undefined) {
        setSelectedDeliveryAreaState(newArea);
      }
      showToast(`Location set to ${newBranch.name}.`, 'info');
      return true;
    },
    [showToast]
  );

  // Cart Computations
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const cartDeliveryFee = useMemo(() => {
    if (orderType === 'pickup') return 0;
    if (selectedDeliveryArea) return selectedDeliveryArea.deliveryFee;
    if (selectedBranch) return selectedBranch.deliveryFee;
    return config.pricing.standardDeliveryFee;
  }, [orderType, selectedDeliveryArea, selectedBranch, config.pricing.standardDeliveryFee]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + cartDeliveryFee;
  }, [cartSubtotal, cartDeliveryFee]);

  const value = useMemo(
    () => ({
      config,
      branches,
      deliveryAreas,
      orderType,
      setOrderType,
      selectedBranch,
      setSelectedBranch,
      selectedDeliveryArea,
      setSelectedDeliveryArea,
      isBranchModalOpen,
      openBranchModal,
      closeBranchModal,
      cart,
      cartCount,
      cartSubtotal,
      cartDeliveryFee,
      cartTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      attemptChangeBranch,
      currentPath,
      navigateTo,
      toasts,
      showToast,
      dismissToast,
    }),
    [
      config,
      branches,
      deliveryAreas,
      orderType,
      setOrderType,
      selectedBranch,
      setSelectedBranch,
      selectedDeliveryArea,
      setSelectedDeliveryArea,
      isBranchModalOpen,
      openBranchModal,
      closeBranchModal,
      cart,
      cartCount,
      cartSubtotal,
      cartDeliveryFee,
      cartTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      attemptChangeBranch,
      currentPath,
      navigateTo,
      toasts,
      showToast,
      dismissToast,
    ]
  );

  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>;
};

export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

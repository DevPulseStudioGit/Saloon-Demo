import { CartItem, Order, OrderCustomer, OrderType, PaymentMethod, Branch, DeliveryArea } from '../types';
import { StorageService } from './storage';

export interface OrderValidationResult {
  valid: boolean;
  errors: string[];
  recalculatedSubtotal: number;
  deliveryFee: number;
  taxAmount: number;
  total: number;
  branch?: Branch;
  deliveryArea?: DeliveryArea;
  sanitizedItems: CartItem[];
}

export function validateAndCalculateOrder(params: {
  orderType: OrderType;
  branchId: string;
  items: CartItem[];
  customer: OrderCustomer;
  deliveryAreaId?: string;
}): OrderValidationResult {
  const errors: string[] = [];
  const { orderType, branchId, items, customer, deliveryAreaId } = params;

  if (!items || items.length === 0) {
    errors.push('Your cart is empty. Please add items before checking out.');
  }

  // 1. Validate branch
  const branch = StorageService.getBranchById(branchId);
  if (!branch) {
    errors.push('Selected branch does not exist or is unavailable.');
  } else if (!branch.active) {
    errors.push(`Branch "${branch.name}" is currently closed or inactive.`);
  } else if (!branch.supportedOrderTypes.includes(orderType)) {
    errors.push(`Branch "${branch.name}" does not support ${orderType}.`);
  }

  // 2. Validate delivery area if delivery mode
  let deliveryArea: DeliveryArea | undefined;
  let deliveryFee = 0;
  if (orderType === 'delivery') {
    if (!customer.address || customer.address.trim().length < 5) {
      errors.push('Please provide a complete street address for delivery.');
    }
    if (deliveryAreaId) {
      const areas = StorageService.getDeliveryAreas();
      deliveryArea = areas.find((a) => a.id === deliveryAreaId);
      if (!deliveryArea) {
        errors.push('Selected delivery area is invalid.');
      } else if (!deliveryArea.active) {
        errors.push(`Delivery to ${deliveryArea.name} is currently suspended.`);
      } else {
        deliveryFee = deliveryArea.deliveryFee;
      }
    } else if (branch) {
      deliveryFee = branch.deliveryFee;
    }
  }

  // 3. Customer info validation
  if (!customer.name || customer.name.trim().length < 2) {
    errors.push('Please enter your full name.');
  }
  if (!customer.phone || customer.phone.trim().length < 9) {
    errors.push('Please enter a valid Pakistani contact phone number.');
  }

  // 4. Server-side price recalculation & item validation
  let recalculatedSubtotal = 0;
  const sanitizedItems: CartItem[] = [];

  const products = StorageService.getProducts();
  const deals = StorageService.getDeals();

  for (const item of items) {
    if (item.quantity <= 0) continue;

    if (item.isDeal) {
      const deal = deals.find((d) => d.id === item.productId);
      if (!deal) {
        errors.push(`Deal "${item.name}" is no longer available.`);
        continue;
      }
      if (!deal.isAvailable) {
        errors.push(`Deal "${deal.name}" is currently sold out.`);
        continue;
      }
      // Calculate selected options for deal
      let optionTotal = 0;
      const validOptions = [];
      if (item.selectedOptions && deal.optionGroups) {
        for (const sel of item.selectedOptions) {
          const group = deal.optionGroups.find((g) => g.id === sel.groupId);
          const choice = group?.choices.find((c) => c.id === sel.choiceId);
          if (choice) {
            optionTotal += choice.price;
            validOptions.push({
              groupId: group!.id,
              groupName: group!.name,
              choiceId: choice.id,
              choiceName: choice.name,
              price: choice.price,
            });
          }
        }
      }
      const unitPrice = deal.price + optionTotal;
      const itemSubtotal = unitPrice * item.quantity;
      recalculatedSubtotal += itemSubtotal;

      sanitizedItems.push({
        ...item,
        basePrice: deal.price,
        unitPrice,
        selectedOptions: validOptions,
        image: deal.image,
      });
    } else {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        errors.push(`Dish "${item.name}" could not be verified in our menu.`);
        continue;
      }
      if (!product.isAvailable) {
        errors.push(`Dish "${product.name}" is sold out at this moment.`);
        continue;
      }

      // Check branch restriction if any
      if (product.branchIds && product.branchIds.length > 0 && branch) {
        if (!product.branchIds.includes(branch.id)) {
          errors.push(`Dish "${product.name}" is not served at ${branch.name}.`);
        }
      }

      // Validate required option groups
      let optionTotal = 0;
      const validOptions = [];
      if (product.optionGroups) {
        for (const group of product.optionGroups) {
          const selectedInGroup = item.selectedOptions?.filter((s) => s.groupId === group.id) || [];
          if (group.required && selectedInGroup.length < group.minSelect) {
            errors.push(`Please select required choices for "${group.name}" on "${product.name}".`);
          }
          if (group.maxSelect && selectedInGroup.length > group.maxSelect) {
            errors.push(`Too many choices selected for "${group.name}".`);
          }
          for (const sel of selectedInGroup) {
            const choice = group.choices.find((c) => c.id === sel.choiceId);
            if (choice) {
              optionTotal += choice.price;
              validOptions.push({
                groupId: group.id,
                groupName: group.name,
                choiceId: choice.id,
                choiceName: choice.name,
                price: choice.price,
              });
            }
          }
        }
      }

      const unitPrice = product.price + optionTotal;
      const itemSubtotal = unitPrice * item.quantity;
      recalculatedSubtotal += itemSubtotal;

      sanitizedItems.push({
        ...item,
        basePrice: product.price,
        unitPrice,
        selectedOptions: validOptions,
        image: product.image,
      });
    }
  }

  // 5. Check minimum order
  const minRequired = orderType === 'delivery' ? (deliveryArea?.minOrder || branch?.minOrder || 0) : 0;
  if (recalculatedSubtotal < minRequired) {
    errors.push(`Minimum order amount for this location is Rs. ${minRequired}. Please add more items.`);
  }

  const taxAmount = 0; // standard inclusive tax
  const total = recalculatedSubtotal + (orderType === 'delivery' ? deliveryFee : 0) + taxAmount;

  return {
    valid: errors.length === 0,
    errors,
    recalculatedSubtotal,
    deliveryFee: orderType === 'delivery' ? deliveryFee : 0,
    taxAmount,
    total,
    branch,
    deliveryArea,
    sanitizedItems,
  };
}

export function executeOrderCreation(params: {
  orderType: OrderType;
  branchId: string;
  items: CartItem[];
  customer: OrderCustomer;
  deliveryAreaId?: string;
  paymentMethod: PaymentMethod;
}): { success: boolean; order?: Order; errors?: string[] } {
  const validation = validateAndCalculateOrder(params);
  if (!validation.valid || !validation.branch) {
    return { success: false, errors: validation.errors };
  }

  const randomRefDigits = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const year = now.getFullYear();
  const orderReference = `DF-${year}-${randomRefDigits}`;

  const estTime =
    params.orderType === 'delivery'
      ? validation.deliveryArea?.estMinutes || validation.branch.estDeliveryTimeMinutes
      : validation.branch.estPickupTimeMinutes;

  const newOrder: Order = {
    id: `ord-${Date.now()}-${randomRefDigits}`,
    orderReference,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    orderType: params.orderType,
    branchId: validation.branch.id,
    branchName: validation.branch.name,
    branchPhone: validation.branch.phone,
    customer: params.customer,
    items: validation.sanitizedItems,
    subtotal: validation.recalculatedSubtotal,
    deliveryFee: validation.deliveryFee,
    taxAmount: validation.taxAmount,
    total: validation.total,
    paymentMethod: params.paymentMethod,
    paymentStatus: params.paymentMethod === 'card_online' ? 'paid' : 'pending',
    status: 'pending',
    statusHistory: [
      {
        status: 'pending',
        timestamp: now.toISOString(),
        note: `Order registered via online portal for ${validation.branch.name}. Kitchen notified.`,
      },
    ],
    estimatedDeliveryOrPickupTime: estTime,
  };

  StorageService.createOrder(newOrder);

  return {
    success: true,
    order: newOrder,
  };
}

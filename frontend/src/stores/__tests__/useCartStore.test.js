import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCartStore } from '../useCartStore';

// Mock axios and toast to avoid side effects
vi.mock('../../libs/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useCartStore Logic Unit Tests', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useCartStore.setState({
      cart: [],
      coupon: null,
      total: 0,
      subtotal: 0,
      isCouponApplied: false
    });
  });

  it('should calculate subtotal and total correctly for multiple items', () => {
    const mockCart = [
      { _id: '1', price: 100, quantity: 2 }, // 200
      { _id: '2', price: 50, quantity: 1 },  // 50
    ];
    
    useCartStore.setState({ cart: mockCart });
    useCartStore.getState().calculateTotals();

    const state = useCartStore.getState();
    
    expect(state.subtotal).toBe(250);
    // Total = subtotal (250) - discount (0) + shipping (15) = 265
    expect(state.total).toBe(265);
  });

  it('should correctly apply a 20% discount coupon', () => {
    const mockCart = [
      { _id: '1', price: 100, quantity: 1 }, // 100
    ];
    const mockCoupon = { discountPercentage: 20 };
    
    useCartStore.setState({ cart: mockCart, coupon: mockCoupon });
    useCartStore.getState().calculateTotals();

    const state = useCartStore.getState();
    
    expect(state.subtotal).toBe(100);
    // Discount = 100 * 0.2 = 20
    // Total = 100 - 20 + 15 = 95
    expect(state.total).toBe(95);
  });

  it('should handle empty cart totals', () => {
    useCartStore.setState({ cart: [] });
    useCartStore.getState().calculateTotals();

    const state = useCartStore.getState();
    
    expect(state.subtotal).toBe(0);
    expect(state.total).toBe(15); // Just shipping
  });
});

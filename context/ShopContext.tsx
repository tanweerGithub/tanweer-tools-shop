import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order, PaymentMethod } from '../types';
import { MOCK_PRODUCTS, VALID_COUPONS } from '../constants';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  orders: Order[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  login: (user: User) => void;
  logout: () => void;
  placeOrder: (cart: CartItem[], subtotal: number, total: number, paymentMethod: PaymentMethod) => Order;
  cartTotal: number;
  subtotal: number;
  discount: number;
  couponCode: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);

  // Load cart, user, and orders from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedCart = localStorage.getItem('cart');
    const storedOrders = localStorage.getItem('orders');
    const storedCouponCode = localStorage.getItem('couponCode');
    const storedDiscount = localStorage.getItem('discount');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    if (storedCouponCode) setCouponCode(JSON.parse(storedCouponCode));
    if (storedDiscount) setDiscount(JSON.parse(storedDiscount));
  }, []);

  // Update local storage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('couponCode', JSON.stringify(couponCode));
  }, [couponCode]);

  useEffect(() => {
    localStorage.setItem('discount', JSON.stringify(discount));
  }, [discount]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const login = (userData: User) => setUser(userData);
  const logout = () => {
    setUser(null);
    setCouponCode('');
    setDiscount(0);
    clearCart();
  };

  const placeOrder = (cart: CartItem[], subtotal: number, total: number, paymentMethod: PaymentMethod) => {
    const newOrder: Order = {
      id: new Date().getTime().toString(),
      date: new Date().toISOString(),
      items: cart,
      subtotal,
      total,
      paymentMethod,
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setCouponCode('');
    setDiscount(0);
    return newOrder;
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartTotal = subtotal - discount;

  const applyCoupon = (code: string): { success: boolean, message: string } => {
    if (VALID_COUPONS[code]) {
      const discountPercentage = VALID_COUPONS[code];
      const calculatedDiscount = (subtotal * discountPercentage) / 100;
      setDiscount(calculatedDiscount);
      setCouponCode(code);
      return { success: true, message: `${discountPercentage}% coupon applied successfully!` };
    } else {
      setDiscount(0);
      setCouponCode('');
      return { success: false, message: 'Invalid coupon code.' };
    }
  };


  return (
    <ShopContext.Provider value={{
      products,
      cart,
      user,
      orders,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      login,
      logout,
      placeOrder,
      cartTotal,
      subtotal,
      discount,
      couponCode,
      applyCoupon
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};

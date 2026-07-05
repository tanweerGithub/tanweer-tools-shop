export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
}

export enum PaymentMethod {
  CreditCard = 'Credit Card',
  BankTransfer = 'Bank Transfer',
  GiftCard = 'Gift Card'
}
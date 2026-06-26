import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "01J2K3L4M5",
    name: "Combination Pliers",
    description: "Heavy-duty high leverage combination pliers with bi-material handle.",
    price: 14.15,
    category: "Hand Tools",
    image: "https://dummyimage.com/600x400/4b5563/ffffff&text=Combination+Pliers",
    stock: 50
  },
  {
    id: "01J2K3L4M6",
    name: "Bolt Cutters",
    description: "Industrial grade bolt cutters for cutting chains, padlocks, bolts and wire mesh.",
    price: 48.41,
    category: "Hand Tools",
    image: "https://dummyimage.com/600x400/4b5563/ffffff&text=Bolt+Cutters",
    stock: 20
  },
  {
    id: "01J2K3L4M7",
    name: "Claw Hammer",
    description: "20oz curved claw hammer with fiberglass handle for shock reduction.",
    price: 12.00,
    category: "Hand Tools",
    image: "https://dummyimage.com/600x400/4b5563/ffffff&text=Claw+Hammer",
    stock: 100
  },
  {
    id: "01J2K3L4M8",
    name: "Sledgehammer",
    description: "10lb sledgehammer with 34-inch fiberglass handle.",
    price: 25.50,
    category: "Power Tools",
    image: "https://dummyimage.com/600x400/4b5563/ffffff&text=Sledgehammer",
    stock: 15
  },
  {
    id: "01J2K3L4M9",
    name: "Slip Joint Pliers",
    description: "6-inch slip joint pliers with double-dipped handles for comfort.",
    price: 9.17,
    category: "Hand Tools",
    image: "https://dummyimage.com/600x400/4b5563/ffffff&text=Slip+Joint+Pliers",
    stock: 45
  },
  {
    id: "01J2K3L4N0",
    name: "Thor Hammer",
    description: "A replica of Mjolnir. Only worthy testers may wield it.",
    price: 109.99,
    category: "Novelty",
    image: "https://dummyimage.com/600x400/4b5563/ffffff&text=Thor+Hammer",
    stock: 1
  },
  {
    id: "01J2K3L4N1",
    name: "Safety Goggles",
    description: "Anti-fog safety glasses with impact resistance.",
    price: 5.50,
    category: "Safety Gear",
    image: "https://dummyimage.com/600x400/4b5563/ffffff&text=Safety+Goggles",
    stock: 200
  },
  {
    id: "01J2K3L4N2",
    name: "Tape Measure",
    description: "25ft heavy duty tape measure with magnetic hook.",
    price: 8.25,
    category: "Measurement",
    image: "https://dummyimage.com/600x400/4b5563/ffffff&text=Tape+Measure",
    stock: 60
  }
];

export const VALID_COUPONS = {
  'TEST10': 10, // 10% off
  'OFF20': 20,  // 20% off
};

export const DEMO_CREDENTIALS = {
  username: "tanweer@test.com",
  password: "tanweer123"
};
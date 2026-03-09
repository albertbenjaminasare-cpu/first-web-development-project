
import { Product } from './types';

export interface HumanizedProduct extends Product {
  isNichoPick?: boolean;
}

export const PRODUCTS: HumanizedProduct[] = [
  {
    id: '1',
    name: "Executive Oxford Shoes",
    description: "Hand-picked for the modern professional. These Oxfords are perfect for the office, church, or any formal event in Tadi.",
    price: 450,
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
    isNichoPick: true
  },
  {
    id: '2',
    name: "Urban Street Sneakers",
    description: "Durable, stylish, and built for the hustle. These sneakers will keep you looking fresh on the streets of Takoradi.",
    price: 320,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: "Premium Leather Slippers",
    description: "Comfort meets class. Perfect for casual outings or relaxing at home. Made with high-quality local leather.",
    price: 150,
    category: 'Slippers',
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=800&auto=format&fit=crop',
    isNichoPick: true
  },
  {
    id: '4',
    name: "Durable School Backpack",
    description: "Spacious and strong, perfect for students. Built to last through the school year with multiple compartments.",
    price: 250,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    name: "Slim-Fit Oxford Shirt",
    description: "A classic top for any occasion. High-quality cotton that stays crisp and cool in the heat.",
    price: 180,
    category: 'Tops',
    image: 'https://images.unsplash.com/photo-1596755094514-f87034a264c6?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    name: "Tailored Chino Trousers",
    description: "The perfect down for your smart-casual look. Versatile, durable, and very comfortable.",
    price: 220,
    category: 'Downs',
    image: 'https://images.unsplash.com/photo-1624371414361-e6709482435e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '7',
    name: "Nicho's Signature Collection",
    description: "A specially curated set including a watch, a belt, and a wallet. The ultimate gift for yourself or a brother.",
    price: 650,
    category: 'Collections',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    isNichoPick: true
  },
  {
    id: '8',
    name: "Casual Graphic Tee",
    description: "Soft cotton with a unique design. Perfect for a relaxed weekend in the city.",
    price: 85,
    category: 'Tops',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '9',
    name: "Classic Long Sleeve Shirt",
    description: "Elegant and comfortable. A versatile piece for both formal and casual settings.",
    price: 195,
    category: 'Tops',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '10',
    name: "Genuine Leather Belt",
    description: "A timeless accessory. Made from premium leather with a sturdy buckle.",
    price: 120,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '11',
    name: "Cozy Urban Hoodie",
    description: "Soft, warm, and stylish. Perfect for cool evenings or a relaxed street look.",
    price: 280,
    category: 'Tops',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'
  }
];

export const CATEGORIES: string[] = ['All', 'Collections', 'Slippers', 'Bags', 'Accessories', 'Shoes', 'Footwear', 'Tops', 'Downs'];

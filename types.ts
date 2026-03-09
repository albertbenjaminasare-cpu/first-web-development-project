
export type Category = 'All' | 'Collections' | 'Slippers' | 'Bags' | 'Accessories' | 'Shoes' | 'Footwear' | 'Tops' | 'Downs';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

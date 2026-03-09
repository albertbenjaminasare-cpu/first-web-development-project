
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { HumanizedProduct } from '../constants';

interface ProductCardProps {
  product: HumanizedProduct;
  onAddToCart: (product: HumanizedProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] bg-stone-100 mb-6">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
          <button 
            onClick={() => onAddToCart(product)}
            className="w-14 h-14 rounded-full bg-white text-green-950 flex items-center justify-center shadow-xl hover:bg-yellow-500 transition-all transform hover:scale-110 active:scale-95"
          >
            <ShoppingBag size={20} />
          </button>
          <button className="w-14 h-14 rounded-full bg-white text-green-950 flex items-center justify-center shadow-xl hover:text-red-500 transition-all transform hover:scale-110 active:scale-95">
            <Heart size={20} />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          {product.isNichoPick && (
            <span className="bg-yellow-500 text-green-950 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
              <Star size={12} fill="currentColor" />
              Nicho's Pick
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 px-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg font-serif font-bold text-green-950 leading-tight group-hover:text-yellow-600 transition-colors">
            {product.name}
          </h3>
        </div>
        <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
          {product.category}
        </p>
        <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 font-medium">
          {product.description}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;

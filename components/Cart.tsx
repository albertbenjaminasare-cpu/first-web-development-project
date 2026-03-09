
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2, Phone } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onConfirm: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onConfirm }) => {
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-green-950/60 backdrop-blur-sm" 
          />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-3xl font-serif text-green-950">Your Bag</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mt-1">
                      {items.length} Items Selected
                    </p>
                  </div>
                  <button onClick={onClose} className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center text-stone-400 hover:text-green-950 hover:bg-stone-50 transition-all">
                    <X size={20} />
                  </button>
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center">
                    <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center text-stone-200 mb-8">
                      <ShoppingBag size={40} />
                    </div>
                    <p className="text-stone-500 font-serif text-xl mb-8">Your bag is empty, boss!</p>
                    <button 
                      onClick={onClose}
                      className="bg-green-950 text-yellow-500 font-black px-10 py-4 rounded-full shadow-xl uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {items.map((item) => (
                      <motion.div 
                        layout
                        key={item.id} 
                        className="flex gap-6"
                      >
                        <div className="w-24 h-32 shrink-0 rounded-2xl overflow-hidden bg-stone-100 shadow-md">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start gap-4">
                              <h4 className="font-serif font-bold text-green-950 leading-tight">{item.name}</h4>
                              <button 
                                onClick={() => onRemove(item.id)}
                                className="text-stone-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-1">{item.category}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center bg-stone-50 rounded-full p-1 border border-stone-100">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full text-stone-500 transition-all"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center font-black text-green-950 text-xs">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full text-stone-500 transition-all"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="font-serif font-black text-green-950 text-[10px] uppercase tracking-widest">Price on Request</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-8 border-t border-stone-100 bg-stone-50/50">
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-stone-400 text-xs font-bold uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="text-green-950">TBD</span>
                    </div>
                    <div className="flex justify-between items-center text-stone-400 text-xs font-bold uppercase tracking-widest">
                      <span>Delivery (Tadi)</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                      <span className="font-serif text-2xl text-green-950">Total</span>
                      <span className="font-serif text-2xl font-black text-green-950 italic">Confirming...</span>
                    </div>
                  </div>

                  <div className="bg-green-950 p-6 rounded-[32px] mb-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-yellow-500/20 transition-all"></div>
                    <div className="flex gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-yellow-500/30">
                        <img 
                          src="image.jpg" 
                          alt="Nicho" 
                          className="w-full h-full object-cover" 
                          width="48"
                          height="48"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-green-50/80 font-medium text-sm leading-relaxed">
                        <span className="text-yellow-500 font-bold block mb-2 uppercase tracking-widest text-[10px]">Nicho's Note:</span>
                        "I'll call you personally to confirm your order and talk about delivery. Quality is guaranteed!"
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={onConfirm}
                    className="w-full bg-yellow-500 hover:bg-green-950 hover:text-white text-green-950 font-black py-5 rounded-full shadow-2xl transition-all transform active:scale-[0.98] uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
                  >
                    <Phone size={16} />
                    Confirm Order With Nicho
                  </button>
                  <p className="mt-6 text-center text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                    Or WhatsApp: 0534540757
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Cart;

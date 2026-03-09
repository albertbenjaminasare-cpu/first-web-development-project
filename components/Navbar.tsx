
import React from 'react';
import { ShoppingBag, Menu, Search, User } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  cartCount: number;
  onCartToggle: () => void;
  isScrolled: boolean;
  user: FirebaseUser | null;
  onLogin: () => void;
  onProfileToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartToggle, isScrolled, user, onLogin, onProfileToggle }) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${
      isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-12">
          <a href="#" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-black text-xl transition-all duration-500 ${
              isScrolled ? 'bg-green-950 text-yellow-500' : 'bg-white text-green-950'
            }`}>
              N
            </div>
            <h1 className={`text-xl font-serif font-black tracking-tighter transition-all duration-500 ${
              isScrolled ? 'text-green-950' : 'text-white'
            }`}>
              Nicho's Quality Wears
            </h1>
          </a>

          <div className={`hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
            isScrolled ? 'text-stone-500' : 'text-white/60'
          }`}>
            <a href="#" className="hover:text-yellow-500 transition-colors">Home</a>
            <a href="#shop" className="hover:text-yellow-500 transition-colors">Shop</a>
            <a href="#about" className="hover:text-yellow-500 transition-colors">About</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <button 
              onClick={onProfileToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                isScrolled 
                  ? 'border-stone-200 text-green-950 hover:bg-stone-50' 
                  : 'border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <img 
                src={user.photoURL || ''} 
                alt="" 
                className="w-6 h-6 rounded-full" 
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Session</span>
            </button>
          ) : (
            <button 
              onClick={onLogin}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px] transition-all ${
                isScrolled 
                  ? 'bg-green-950 text-yellow-500 shadow-lg hover:scale-105' 
                  : 'bg-white text-green-950 hover:bg-yellow-500'
              }`}
            >
              <User size={14} />
              Login
            </button>
          )}
          
          <button 
            onClick={onCartToggle}
            className={`relative flex items-center gap-3 px-5 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest transition-all duration-500 ${
              isScrolled 
                ? 'bg-green-950 text-white shadow-lg shadow-green-900/20' 
                : 'bg-white text-green-950'
            }`}
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:block">Bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-green-950 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>

          <button className={`md:hidden p-2 transition-all duration-500 ${
            isScrolled ? 'text-green-950' : 'text-white'
          }`}>
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShoppingBag, Instagram, Facebook, Twitter, ArrowRight, Star, Heart, Menu, X, ChevronRight, User, LogOut, MessageSquare, Send } from 'lucide-react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import { PRODUCTS, CATEGORIES } from './constants';
import { Product, CartItem, Category } from './types';
import { auth, signInWithGoogle, db, submitInterest, sendMessage } from './firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, collection, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Auth & Profile State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthLoading(false);
      
      if (firebaseUser) {
        // Listen to user profile
        const unsubscribeProfile = onSnapshot(doc(db, 'users', firebaseUser.uid), (doc) => {
          if (doc.exists()) {
            setUserProfile(doc.data());
          }
        });
        return () => unsubscribeProfile();
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribeAuth();
    };
  }, []);

  // Chat listener
  useEffect(() => {
    if (user && isChatOpen) {
      // For simplicity, chatId is just the user's UID for a direct chat with Nicho
      const chatId = user.uid; 
      const q = query(
        collection(db, `chats/${chatId}/messages`),
        orderBy('createdAt', 'asc'),
        limit(50)
      );
      
      const unsubscribeChat = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      });
      
      return () => unsubscribeChat();
    }
  }, [user, isChatOpen]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsProfileOpen(false);
      setIsChatOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    try {
      await sendMessage(user.uid, 'admin', newMessage);
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleConfirmOrder = async () => {
    if (!user) {
      handleLogin();
      return;
    }
    
    try {
      // Submit interest for each item in cart
      for (const item of cartItems) {
        await submitInterest(user.email!, item.category, item.id, item.name);
      }
      alert("Nicho has received your list! He will call you soon.");
      setCartItems([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error("Failed to confirm order", error);
      alert("Something went wrong. Please try again or call Nicho.");
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] selection:bg-yellow-400 selection:text-green-950">
      <Navbar 
        cartCount={totalItems} 
        onCartToggle={() => setIsCartOpen(true)} 
        isScrolled={isScrolled} 
        user={user}
        onLogin={handleLogin}
        onProfileToggle={() => setIsProfileOpen(true)}
      />

      {/* Hero Section - Editorial Style */}
      <header className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-green-950">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop" 
            alt="Fashion Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-950/80 via-transparent to-green-950"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="inline-block text-yellow-500 font-bold uppercase tracking-[0.4em] text-xs mb-8">
                Est. 2024 • Takoradi, Ghana
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="font-serif text-[15vw] md:text-[12vw] leading-[0.8] text-white uppercase tracking-tighter mb-12"
            >
              Style <br/>
              <span className="text-yellow-500 italic">Redefined</span> <br/>
              By Nicho
            </motion.h1>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col md:flex-row items-start md:items-center gap-10"
            >
              <p className="text-xl text-green-50/70 max-w-md leading-relaxed">
                Premium quality wears at prices that respect your hustle. From the heart of Tadi to your doorstep.
              </p>
              <div className="flex gap-4">
                <a href="#shop" className="bg-yellow-500 text-green-950 font-black px-10 py-5 rounded-full shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1 uppercase text-xs tracking-widest">
                  Shop Collection
                </a>
                <a href="tel:0534540757" className="flex items-center gap-3 text-white font-bold border border-white/20 px-8 py-5 rounded-full hover:bg-white/10 transition-all uppercase text-xs tracking-widest">
                  <Phone size={16} />
                  Call Nicho
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[20%] hidden lg:block"
        >
          <div className="w-64 h-80 rounded-[40px] overflow-hidden border-8 border-white/10 shadow-2xl rotate-6">
            <img 
              src="image.jpg" 
              className="w-full h-full object-cover" 
              alt="Nicholas Asare" 
              width="256"
              height="320"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </header>

      {/* Categories Bar */}
      <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-100 py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-2">
            <span className="text-[10px] uppercase tracking-widest font-black text-stone-400 shrink-0">Filter By:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as Category)}
                className={`text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all px-4 py-2 rounded-full ${
                  activeCategory === cat 
                    ? 'bg-green-950 text-yellow-500 shadow-lg' 
                    : 'text-stone-500 hover:text-green-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Shop Grid */}
      <main className="container mx-auto px-6 py-24" id="shop">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <span className="text-yellow-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">New Arrivals</span>
            <h2 className="text-5xl md:text-7xl font-serif text-green-950 leading-tight">
              Curated <br/> <span className="italic">Excellence</span>
            </h2>
          </div>
          <p className="text-stone-500 max-w-xs font-medium leading-relaxed">
            Every piece is hand-selected by Nicholas to ensure it meets the highest standards of Tadi style.
          </p>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200"
          >
            <p className="text-stone-400 italic font-serif text-2xl">Coming soon to the collection...</p>
          </motion.div>
        )}
      </main>

      {/* About Nicho - Split Layout */}
      <section className="py-32 bg-green-950 text-white overflow-hidden" id="about">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <motion.div 
                whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
                viewport={{ once: true }}
                className="relative z-10 rounded-[60px] overflow-hidden aspect-[4/5] shadow-2xl"
              >
                <img 
                  src="image.jpg" 
                  alt="Nicholas Asare" 
                  className="w-full h-full object-cover"
                  width="800"
                  height="1000"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-green-500 rounded-full blur-3xl opacity-10"></div>
            </div>

            <div className="space-y-12">
              <div>
                <span className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-6 block">The Man Behind The Brand</span>
                <h2 className="text-6xl md:text-8xl font-serif leading-none mb-8">
                  Nicho's <br/> <span className="italic text-yellow-500">Promise</span>
                </h2>
                <p className="text-xl text-green-50/60 leading-relaxed font-light">
                  "In Takoradi, we value two things: quality and honesty. I started this shop to bring those values to fashion. I don't just sell clothes; I build relationships. When you wear Nicho's, you're wearing a piece of Tadi's heart."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-3xl font-serif mb-2">100%</h4>
                  <p className="text-xs uppercase tracking-widest text-stone-500 font-bold">Authentic Quality</p>
                </div>
                <div>
                  <h4 className="text-3xl font-serif mb-2">5k+</h4>
                  <p className="text-xs uppercase tracking-widest text-stone-500 font-bold">Happy Brothers</p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-green-950">
                  <Star fill="currentColor" />
                </div>
                <div>
                  <p className="text-lg font-serif italic">"The best prices in Western Region, period."</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-stone-500 mt-1">— Kofi, Regular Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-32 pb-12 border-t border-stone-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-4xl font-serif text-green-950 mb-8">Nicho's <br/> Quality Wears</h2>
              <p className="text-stone-500 max-w-sm leading-relaxed mb-10">
                Bringing affordable luxury to the streets of Takoradi. Quality you can trust, prices you can afford.
              </p>
              <div className="flex gap-6">
                <a href="#" className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-green-950 hover:text-white transition-all">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-green-950 hover:text-white transition-all">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-green-950 hover:text-white transition-all">
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.3em] font-black text-stone-300 mb-8">Quick Links</h4>
              <ul className="space-y-4 font-bold text-sm">
                <li><a href="#" className="text-stone-600 hover:text-green-950 transition-colors">Home</a></li>
                <li><a href="#shop" className="text-stone-600 hover:text-green-950 transition-colors">Shop All</a></li>
                <li><a href="#about" className="text-stone-600 hover:text-green-950 transition-colors">About Nicholas</a></li>
                <li><a href="#" className="text-stone-600 hover:text-green-950 transition-colors">Delivery Info</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.3em] font-black text-stone-300 mb-8">Contact Us</h4>
              <ul className="space-y-4 font-bold text-sm">
                <li className="flex items-center gap-3 text-stone-600">
                  <Phone size={16} className="text-yellow-600" />
                  0534540757
                </li>
                <li className="text-stone-400 font-medium">
                  Takoradi Market Circle,<br/> Western Region, Ghana
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
              © {new Date().getFullYear()} Nicho's Quality Wears. All Rights Reserved.
            </p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-stone-300">
              <a href="#" className="hover:text-green-950">Privacy Policy</a>
              <a href="#" className="hover:text-green-950">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Profile Sidebar */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-[110] overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="absolute inset-0 bg-green-950/60 backdrop-blur-sm" 
            />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
              >
                <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                  <h2 className="text-2xl font-serif text-green-950">My Profile</h2>
                  <button onClick={() => setIsProfileOpen(false)} className="p-2 text-stone-400 hover:text-green-950 transition">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8">
                  {userProfile ? (
                    <div className="space-y-10">
                      <div className="flex items-center gap-6">
                        <img 
                          src={userProfile.photoURL} 
                          alt={userProfile.displayName} 
                          className="w-20 h-20 rounded-full border-4 border-stone-100 shadow-lg" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-green-950">{userProfile.displayName}</h3>
                          <p className="text-stone-400 text-sm">{userProfile.email}</p>
                          <span className="inline-block bg-yellow-100 text-yellow-700 text-[10px] font-black px-2 py-1 rounded mt-2 uppercase tracking-widest">
                            {userProfile.role}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsChatOpen(true);
                          }}
                          className="w-full flex items-center justify-between p-6 bg-stone-50 rounded-3xl hover:bg-stone-100 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-950 text-yellow-500 rounded-2xl flex items-center justify-center">
                              <MessageSquare size={20} />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-green-950">Talk to Nicho</p>
                              <p className="text-xs text-stone-400">Direct message for orders</p>
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-stone-300 group-hover:text-green-950 transition-colors" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-stone-400 italic">Loading your profile...</p>
                    </div>
                  )}
                </div>
                
                <div className="p-8 border-t border-stone-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 text-red-500 font-bold uppercase tracking-widest text-xs hover:text-red-700 transition"
                  >
                    <LogOut size={16} />
                    Logout from Session
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Sidebar */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-[120] overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="absolute inset-0 bg-green-950/60 backdrop-blur-sm" 
            />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
              >
                <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-green-950 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-green-950 font-black overflow-hidden border border-yellow-500/30">
                      <img 
                        src="image.jpg" 
                        alt="Nicho" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h2 className="font-serif text-lg">Chat with Nicho</h2>
                      <p className="text-[10px] uppercase tracking-widest text-yellow-500 font-bold">Online Now</p>
                    </div>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="p-2 text-white/60 hover:text-white transition">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-stone-50">
                  {messages.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-stone-400 italic text-sm">Start a conversation with Nicho about your style!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.senderUid === user?.uid ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${
                          msg.senderUid === user?.uid 
                            ? 'bg-green-950 text-white rounded-tr-none' 
                            : 'bg-white text-green-950 shadow-sm rounded-tl-none border border-stone-100'
                        }`}>
                          {msg.text}
                          <p className={`text-[8px] mt-2 uppercase tracking-widest font-bold ${
                            msg.senderUid === user?.uid ? 'text-white/40' : 'text-stone-300'
                          }`}>
                            {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <form onSubmit={handleSendMessage} className="p-6 border-t border-stone-100 bg-white flex gap-4">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-stone-100 border-none rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-green-950 outline-none"
                  />
                  <button 
                    type="submit"
                    className="w-12 h-12 bg-green-950 text-yellow-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onConfirm={handleConfirmOrder}
      />
    </div>
  );
};

export default App;

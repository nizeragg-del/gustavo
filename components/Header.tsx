import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  cartCount: number;
  onCategorySelect?: (filter: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage, cartCount, onCategorySelect }) => {
  
  const handleNavClick = (filter: string) => {
    if (onCategorySelect) {
        onCategorySelect(filter);
    } else {
        setCurrentPage('CATEGORIES');
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-background-dark/95 backdrop-blur-md px-6 md:px-10 lg:px-40 py-4">
      <div className="flex items-center gap-8">
        <button onClick={() => setCurrentPage('HOME')} className="flex items-center gap-2 text-primary group">
          <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">sports_soccer</span>
          <h2 className="text-white text-xl font-black leading-tight tracking-[-0.015em] uppercase">Arena Golaço</h2>
        </button>
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => handleNavClick('Nacional')} className="text-white hover:text-primary transition-colors text-sm font-medium">Nacionais</button>
          <button onClick={() => handleNavClick('Internacional')} className="text-white hover:text-primary transition-colors text-sm font-medium">Internacionais</button>
          <button onClick={() => handleNavClick('Retrô')} className="text-white hover:text-primary transition-colors text-sm font-medium">Retrô</button>
          <button onClick={() => handleNavClick('Seleções')} className="text-white hover:text-primary transition-colors text-sm font-medium">Seleções</button>
        </nav>
      </div>
      
      <div className="flex flex-1 justify-end gap-6 items-center">
        <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64 group">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-transparent group-focus-within:border-primary/50 transition-colors">
            <div className="text-white/60 flex border-none bg-white/10 items-center justify-center pl-4 rounded-l-lg">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-white focus:outline-0 bg-white/10 h-full placeholder:text-white/40 px-4 pl-2 text-sm font-normal" 
              placeholder="Buscar camisas..."
            />
          </div>
        </label>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setCurrentPage('CART')}
            className="relative flex items-center justify-center rounded-lg h-10 w-10 bg-white/10 text-white hover:bg-primary/20 hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-background-dark text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setCurrentPage('PROFILE')}
            className="flex items-center justify-center rounded-lg h-10 w-10 bg-white/10 text-white hover:bg-primary/20 hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
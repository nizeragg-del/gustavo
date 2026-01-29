import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  cartCount: number;
  onCategorySelect?: (filter: string) => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage, cartCount, onCategorySelect, onProfileClick }) => {

  const handleNavClick = (filter: string) => {
    if (onCategorySelect) {
      onCategorySelect(filter);
    } else {
      setCurrentPage('CATEGORIES');
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-100 bg-white/95 backdrop-blur-md px-6 md:px-10 lg:px-40 py-4 shadow-sm">
      <div className="flex items-center gap-8">
        <button onClick={() => setCurrentPage('HOME')} className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">sports_soccer</span>
          <h2 className="text-slate-900 text-xl font-black leading-tight tracking-tight uppercase italic">Arena Golaço</h2>
        </button>
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => handleNavClick('Nacional')} className="text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-tight">Nacionais</button>
          <button onClick={() => handleNavClick('Internacional')} className="text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-tight">Internacionais</button>
          <button onClick={() => handleNavClick('Retrô')} className="text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-tight">Retrô</button>
          <button onClick={() => handleNavClick('Seleções')} className="text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-tight">Seleções</button>
        </nav>
      </div>

      <div className="flex flex-1 justify-end gap-6 items-center">
        <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64 group">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full border border-slate-200 group-focus-within:border-primary transition-colors bg-slate-50">
            <div className="text-slate-400 flex border-none items-center justify-center pl-4">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-slate-900 focus:outline-0 bg-transparent h-full placeholder:text-slate-400 px-4 pl-2 text-sm font-medium"
              placeholder="Buscar camisas..."
            />
          </div>
        </label>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentPage('CART')}
            className="relative flex items-center justify-center rounded-xl h-11 w-11 bg-slate-50 text-slate-700 hover:bg-primary/10 hover:text-primary transition-all border border-slate-200"
          >
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={onProfileClick}
            className="flex items-center justify-center rounded-xl h-11 w-11 bg-slate-50 text-slate-700 hover:bg-primary/10 hover:text-primary transition-all border border-slate-200"
          >
            <span className="material-symbols-outlined text-2xl">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
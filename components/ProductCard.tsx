import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart }) => {
  return (
    <div className="group flex flex-col gap-5 cursor-pointer" onClick={onClick}>
      <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-primary/20">
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url("${product.image}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {product.isNew && (
          <div className="absolute top-4 left-4 bg-primary text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            NOVO
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="absolute bottom-6 left-6 right-6 bg-white text-slate-900 h-14 rounded-2xl font-black opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center gap-2 hover:bg-primary hover:text-white shadow-2xl active:scale-95 uppercase italic tracking-tight"
        >
          <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
          Comprar
        </button>
      </div>
      <div className="flex flex-col gap-1 px-2">
        <p className="text-primary text-[10px] uppercase font-black tracking-[0.2em]">{product.brand}</p>
        <h3 className="text-slate-900 text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight">{product.name}</h3>
        <div className="flex items-center gap-3 mt-2">
          <p className="text-slate-900 text-2xl font-black tracking-tight italic">R$ {product.price.toFixed(2)}</p>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
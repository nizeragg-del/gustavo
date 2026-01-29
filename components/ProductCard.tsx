import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart }) => {
  return (
    <div className="group flex flex-col gap-4 min-w-[280px] flex-1 cursor-pointer" onClick={onClick}>
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/5">
        <div 
            className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110" 
            style={{ backgroundImage: `url("${product.image}")` }}
        />
        {product.isNew && (
          <div className="absolute top-4 right-4 bg-primary text-background-dark font-bold text-xs px-2 py-1 rounded">
            NEW
          </div>
        )}
        <button 
            onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
            }}
            className="absolute bottom-4 left-4 right-4 bg-white text-background-dark h-10 rounded-lg font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all flex items-center justify-center gap-2 hover:bg-primary"
        >
          <span className="material-symbols-outlined text-sm">add_shopping_cart</span> 
          Adicionar
        </button>
      </div>
      <div>
        <p className="text-white/60 text-xs uppercase tracking-widest font-medium">{product.brand}</p>
        <h3 className="text-white text-lg font-bold group-hover:text-primary transition-colors">{product.name}</h3>
        <p className="text-primary text-xl font-black mt-1">R$ {product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
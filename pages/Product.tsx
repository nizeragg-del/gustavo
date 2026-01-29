import React, { useState } from 'react';
import { Product } from '../types';

interface ProductPageProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, onAddToCart }) => {
  const [activeImage, setActiveImage] = useState(product.image);
  const gallery = product.images || [product.image, product.image, product.image, product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 animate-fade-in text-white">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium">
            <span className="text-slate-500 hover:text-primary transition-colors cursor-pointer">Home</span>
            <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
            <span className="text-slate-500 hover:text-primary transition-colors cursor-pointer">{product.category}</span>
            <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
            <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Gallery */}
            <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-12 gap-4">
                    {/* Thumbnails */}
                    <div className="col-span-2 space-y-4">
                        {gallery.map((img, idx) => (
                            <div 
                                key={idx} 
                                className={`aspect-[3/4] rounded-lg border-2 overflow-hidden cursor-pointer ${activeImage === img ? 'border-primary' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                                onClick={() => setActiveImage(img)}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover"/>
                            </div>
                        ))}
                    </div>
                    {/* Main Image */}
                    <div className="col-span-10">
                        <div className="relative group overflow-hidden rounded-xl bg-white/5 aspect-[3/4]">
                            <img src={activeImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={product.name}/>
                             <div className="absolute inset-0 bg-black/5 pointer-events-none group-hover:bg-transparent transition-colors"></div>
                        </div>
                    </div>
                </div>

                {/* Details Box */}
                <div className="mt-12 p-8 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">verified_user</span>
                            Authentic Performance Tech
                        </h3>
                        <p className="text-white/70 leading-relaxed mb-6">
                            Engenharia para a elite. Esta edição autêntica possui a mesma tecnologia usada pelos profissionais em campo. Feita com nossa trama respirável exclusiva.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="material-symbols-outlined text-primary">air</span>
                                <span>Ultra-breathable AeroMesh</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="material-symbols-outlined text-primary">eco</span>
                                <span>100% Recycled Polyester</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info & Buy */}
            <div className="lg:col-span-5 flex flex-col gap-8">
                <div>
                    <span className="inline-block px-3 py-1 bg-primary text-background-dark text-xs font-bold rounded-full mb-4">NOVA TEMPORADA</span>
                    <h1 className="text-4xl lg:text-5xl font-black leading-[1.1] mb-2 tracking-tight">{product.name}</h1>
                    <p className="text-white/50 text-lg">Authentic Match Edition - {product.brand}</p>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-primary">R$ {product.price.toFixed(2)}</span>
                    <div className="flex items-center gap-1 ml-auto">
                        <span className="material-symbols-outlined text-gold fill-current">star</span>
                        <span className="font-bold">4.9</span>
                        <span className="text-slate-500 text-sm">(124 Avaliações)</span>
                    </div>
                </div>

                <div className="h-px bg-white/10"></div>

                {/* Sizes */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="font-bold text-sm uppercase tracking-widest text-white">Selecionar Tamanho</label>
                        <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">straighten</span> Guia
                        </button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {['P', 'M', 'G', 'GG', 'XG'].map(size => (
                            <button key={size} className="h-12 border border-white/10 rounded-lg flex items-center justify-center font-bold hover:border-primary transition-colors text-white hover:text-primary focus:border-primary focus:bg-primary/10">
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white/5 rounded-lg h-14 border border-white/10">
                        <button className="px-4 hover:text-primary transition-colors text-white"><span className="material-symbols-outlined">remove</span></button>
                        <span className="px-4 font-bold text-lg text-white">1</span>
                        <button className="px-4 hover:text-primary transition-colors text-white"><span className="material-symbols-outlined">add</span></button>
                    </div>
                    <button 
                        onClick={() => onAddToCart(product)}
                        className="flex-1 h-14 bg-primary text-background-dark font-black rounded-lg text-lg hover:shadow-[0_0_20px_rgba(43,238,121,0.4)] transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">shopping_cart</span>
                        ADICIONAR
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm p-4 rounded-lg bg-white/5 text-white">
                        <span className="material-symbols-outlined text-primary">local_shipping</span>
                        <span>Frete grátis para todo o Brasil</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-4 rounded-lg bg-white/5 text-white">
                        <span className="material-symbols-outlined text-primary">refresh</span>
                        <span>30 dias para trocas e devoluções</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProductPage;
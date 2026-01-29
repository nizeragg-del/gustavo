import React, { useState } from 'react';
import { Product } from '../types';

interface ProductPageProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, onAddToCart }) => {
    const [activeImage, setActiveImage] = useState(product.image);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const gallery = product.images || [product.image, product.image, product.image, product.image];

    return (
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-12 animate-fade-in text-slate-900 font-sans">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-widest italic">
                <span className="text-slate-400 hover:text-primary transition-colors cursor-pointer">Home</span>
                <span className="text-slate-200">/</span>
                <span className="text-slate-400 hover:text-primary transition-colors cursor-pointer">{product.category}</span>
                <span className="text-slate-200">/</span>
                <span className="text-primary">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Gallery */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-12 gap-6">
                        {/* Thumbnails */}
                        <div className="col-span-2 space-y-4">
                            {gallery.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`aspect-[3/4] rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-300 shadow-sm ${activeImage === img ? 'border-primary' : 'border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-300'}`}
                                    onClick={() => setActiveImage(img)}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        {/* Main Image */}
                        <div className="col-span-10">
                            <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-50 aspect-[3/4] border border-slate-100 shadow-2xl">
                                <img src={activeImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
                                <div className="absolute inset-0 bg-slate-900/5 pointer-events-none group-hover:bg-transparent transition-colors"></div>
                            </div>
                        </div>
                    </div>

                    {/* Details Box */}
                    <div className="mt-16 p-10 rounded-[2rem] bg-slate-50 border border-slate-100 relative overflow-hidden shadow-inner">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3 uppercase italic tracking-tighter">
                                <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                                Performance Elite Tech
                            </h3>
                            <p className="text-slate-500 leading-relaxed mb-8 font-medium text-lg">
                                Engenharia para a elite dos gramados. Esta edição autêntica possui a mesma tecnologia usada pelos profissionais em campo. Desenvolvida com nossa trama tecnológica exclusiva para máxima performance e conforto térmico.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-tight bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                    <span className="material-symbols-outlined text-primary">air</span>
                                    <span>AeroMesh Ultra-Transpirável</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-tight bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                    <span className="material-symbols-outlined text-primary">eco</span>
                                    <span>Poliéster 100% Reciclado</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info & Buy */}
                <div className="lg:col-span-5 flex flex-col gap-10">
                    <div className="space-y-4">
                        <span className="inline-block px-4 py-1.5 bg-primary text-white text-[10px] font-black rounded-full shadow-lg shadow-primary/20 uppercase tracking-[0.2em]">NOVA TEMPORADA</span>
                        <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] text-slate-900 tracking-tighter uppercase italic">{product.name}</h1>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Authentic Match Edition - {product.brand}</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-5xl font-black text-slate-900 italic tracking-tighter">R$ {product.price.toFixed(2)}</span>
                        <div className="flex items-center gap-2 ml-auto bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                            <span className="material-symbols-outlined text-gold fill-current text-xl">star</span>
                            <span className="font-black text-slate-900">4.9</span>
                            <span className="text-slate-400 text-xs font-bold">(124)</span>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    {/* Sizes */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <label className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 italic">Selecionar Tamanho</label>
                                <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2 italic">
                                    <span className="material-symbols-outlined text-base">straighten</span> Guia de Medidas
                                </button>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {['P', 'M', 'G', 'GG', 'XG'].map(size => {
                                    const stock = product.inventory?.[size] ?? 0;
                                    const isAvailable = stock > 0;
                                    return (
                                        <button
                                            key={size}
                                            disabled={!isAvailable}
                                            onClick={() => setSelectedSize(size)}
                                            className={`h-14 border-2 rounded-2xl flex items-center justify-center font-black transition-all
                                            ${selectedSize === size ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10 scale-105' : 'border-slate-100 text-slate-400 bg-slate-50/50 hover:border-slate-300'}
                                            ${!isAvailable ? 'opacity-20 cursor-not-allowed grayscale' : ''}
                                        `}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedSize && (
                                <p className="text-[10px] text-primary mt-3 font-black uppercase tracking-widest italic animate-fade-in">
                                    {product.inventory?.[selectedSize] || 0} unidades em estoque
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-slate-50 rounded-2xl h-16 border-2 border-slate-100 shadow-inner px-2">
                                    <button className="h-12 w-12 rounded-xl hover:bg-white hover:text-primary transition-all text-slate-900 flex items-center justify-center border border-transparent active:scale-95"><span className="material-symbols-outlined">remove</span></button>
                                    <span className="px-6 font-black text-xl text-slate-900 italic">1</span>
                                    <button className="h-12 w-12 rounded-xl hover:bg-white hover:text-primary transition-all text-slate-900 flex items-center justify-center border border-transparent active:scale-95"><span className="material-symbols-outlined">add</span></button>
                                </div>
                                <button
                                    onClick={() => selectedSize && onAddToCart({ ...product, selectedSize })}
                                    disabled={!selectedSize}
                                    className={`flex-1 h-16 font-black rounded-2xl text-lg transition-all flex items-center justify-center gap-3 uppercase italic tracking-tight shadow-xl
                                ${selectedSize ? 'bg-primary text-white hover:scale-[1.02] shadow-primary/30 active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'}
                            `}
                                >
                                    <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                                    ADICIONAR AO CARRINHO
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-tight p-5 rounded-2xl bg-slate-50 text-slate-600 border border-slate-100 shadow-sm">
                                <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
                                <div className="flex flex-col">
                                    <span>Frete Grátis</span>
                                    <span className="text-[10px] text-slate-400 font-medium">Para todo o Brasil</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-tight p-5 rounded-2xl bg-slate-50 text-slate-600 border border-slate-100 shadow-sm">
                                <span className="material-symbols-outlined text-primary text-2xl">refresh</span>
                                <div className="flex flex-col">
                                    <span>Troca Grátis</span>
                                    <span className="text-[10px] text-slate-400 font-medium">Até 30 dias após</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
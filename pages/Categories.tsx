import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface CategoriesProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    initialFilter?: string | null;
}

const Categories: React.FC<CategoriesProps> = ({ products, onProductClick, onAddToCart, initialFilter }) => {
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(initialFilter);
    const [priceRange, setPriceRange] = useState<number>(500);

    // Sync if prop changes
    useEffect(() => {
        setCategoryFilter(initialFilter);
    }, [initialFilter]);

    // Filtering logic
    const filteredProducts = products.filter(product => {
        const matchesCategory = categoryFilter ? product.category.includes(categoryFilter) || product.subcategory?.includes(categoryFilter) : true;
        const matchesTeam = selectedTeam ? product.name.includes(selectedTeam) : true;
        const matchesPrice = product.price <= priceRange;
        return matchesCategory && matchesTeam && matchesPrice;
    });

    const teams = Array.from(new Set(products.map(p => p.brand))).slice(0, 5); // Just using brands as mock teams for now

    return (
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-8 animate-fade-in">
             {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
                <span className="text-white/40">Home</span>
                <span className="text-white/20">/</span>
                <span className="text-white/40">Camisas</span>
                <span className="text-white/20">/</span>
                <span className="text-white font-medium">{categoryFilter || 'Todas'}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex flex-col gap-2 max-w-4xl">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
                        COLEÇÃO <span className="text-primary italic uppercase">{categoryFilter || 'GERAL'}</span>
                    </h1>
                    <p className="text-white/60 text-lg leading-relaxed max-w-2xl">
                        Eleve seu jogo com as edições premium da temporada. Engenharia de performance, design de classe mundial.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10 shrink-0">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider pl-4">Ordenar Por</p>
                    <select className="bg-transparent border-none text-white text-sm font-semibold focus:ring-0 cursor-pointer outline-none">
                        <option className="bg-background-dark">Lançamentos</option>
                        <option className="bg-background-dark">Preço: Maior - Menor</option>
                        <option className="bg-background-dark">Preço: Menor - Maior</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-72 shrink-0 space-y-10">
                    <div>
                        <h3 className="text-white text-lg font-bold mb-1">Filtros</h3>
                        <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Refine sua seleção</p>
                    </div>

                     {/* Main Category */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">category</span>
                            <p className="text-white font-semibold">Categoria</p>
                        </div>
                        <div className="flex flex-col gap-2 pl-2">
                             {['Nacional', 'Internacional', 'Retrô', 'Seleções'].map(cat => (
                                 <button 
                                    key={cat} 
                                    onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
                                    className={`text-left text-sm hover:text-primary transition-colors ${categoryFilter === cat ? 'text-primary font-bold' : 'text-white/60'}`}
                                 >
                                     {cat}
                                 </button>
                             ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">straighten</span>
                            <p className="text-white font-semibold">Tamanho</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {['P', 'M', 'G', 'GG', 'XG'].map(size => (
                                <button key={size} className="py-2 border border-white/10 rounded hover:border-primary hover:text-primary transition-all text-xs font-bold text-white/80">
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                     {/* Brands/Teams */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <span className="material-symbols-outlined">shield</span>
                            <p className="text-white font-semibold">Marca</p>
                        </div>
                        <div className="space-y-2">
                            {teams.map(team => (
                                <label key={team} className="flex items-center gap-3 group cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-white/20 bg-transparent text-primary focus:ring-primary h-4 w-4"
                                        checked={selectedTeam === team}
                                        onChange={() => setSelectedTeam(selectedTeam === team ? null : team)}
                                    />
                                    <span className="text-sm text-white/80 group-hover:text-white">{team}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Slider */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">payments</span>
                            <p className="text-white font-semibold">Preço Máximo: R$ {priceRange}</p>
                        </div>
                        <input 
                            type="range" 
                            min="100" 
                            max="600" 
                            value={priceRange} 
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>
                </aside>

                {/* Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-white/40 text-sm font-medium">Mostrando {filteredProducts.length} produtos</p>
                    </div>
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredProducts.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onClick={() => onProductClick(product)}
                                    onAddToCart={() => onAddToCart(product)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 border border-white/5 rounded-xl bg-white/5">
                            <span className="material-symbols-outlined text-4xl text-white/20 mb-4">search_off</span>
                            <p className="text-white/40">Nenhum produto encontrado com estes filtros.</p>
                            <button onClick={() => {setCategoryFilter(null); setSelectedTeam(null);}} className="mt-4 text-primary hover:underline text-sm font-bold">Limpar Filtros</button>
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {filteredProducts.length > 0 && (
                        <div className="flex items-center justify-center gap-4 mt-20">
                            <button className="size-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10 text-white">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="size-12 rounded-xl bg-primary text-background-dark font-black">1</button>
                            <button className="size-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10 text-white">2</button>
                            <button className="size-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10 text-white">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;
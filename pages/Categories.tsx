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
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-8 animate-fade-in font-sans">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest italic">
                <span className="text-slate-400 hover:text-primary cursor-pointer">Home</span>
                <span className="text-slate-200">/</span>
                <span className="text-slate-400 hover:text-primary cursor-pointer">Camisas</span>
                <span className="text-slate-200">/</span>
                <span className="text-primary">{categoryFilter || 'Todas'}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="flex flex-col gap-3 max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] uppercase italic">
                        COLEÇÃO <br />
                        <span className="text-primary">{categoryFilter || 'GERAL'}</span>
                    </h1>
                    <div className="h-1.5 w-24 bg-primary mt-4"></div>
                    <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl font-medium mt-2">
                        Eleve seu jogo com as edições premium da temporada. Engenharia de performance e design de classe mundial para os apaixonados por futebol.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 shrink-0 shadow-sm">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest pl-4 italic">Filtrar por</p>
                    <select className="bg-transparent border-none text-slate-900 text-sm font-bold focus:ring-0 cursor-pointer outline-none uppercase tracking-tight">
                        <option>Lançamentos</option>
                        <option>Preço: Maior - Menor</option>
                        <option>Preço: Menor - Maior</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-72 shrink-0 space-y-12">
                    <div>
                        <h3 className="text-slate-900 text-2xl font-black uppercase italic tracking-tighter">Filtros</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Refine seu manto</p>
                    </div>

                    {/* Main Category */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary shadow-inner border border-slate-100">
                                <span className="material-symbols-outlined">category</span>
                            </div>
                            <p className="text-slate-900 font-black uppercase tracking-tight italic">Categoria</p>
                        </div>
                        <div className="flex flex-col gap-3 pl-2">
                            {['Nacional', 'Internacional', 'Retrô', 'Seleções'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
                                    className={`text-left text-sm font-bold uppercase tracking-tight transition-all hover:translate-x-1 ${categoryFilter === cat ? 'text-primary scale-105 origin-left' : 'text-slate-400 hover:text-slate-700'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary shadow-inner border border-slate-100">
                                <span className="material-symbols-outlined">straighten</span>
                            </div>
                            <p className="text-slate-900 font-black uppercase tracking-tight italic">Tamanho</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {['P', 'M', 'G', 'GG', 'XG'].map(size => (
                                <button key={size} className="py-3 border border-slate-100 rounded-xl hover:border-primary hover:text-primary hover:shadow-lg transition-all text-sm font-black text-slate-400 bg-slate-50/50">
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Brands/Teams */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary shadow-inner border border-slate-100">
                                <span className="material-symbols-outlined">shield</span>
                            </div>
                            <p className="text-slate-900 font-black uppercase tracking-tight italic">Marca</p>
                        </div>
                        <div className="space-y-3">
                            {teams.map(team => (
                                <label key={team} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded-lg border-slate-200 bg-slate-50 text-primary focus:ring-primary h-5 w-5 transition-all cursor-pointer"
                                            checked={selectedTeam === team}
                                            onChange={() => setSelectedTeam(selectedTeam === team ? null : team)}
                                        />
                                    </div>
                                    <span className="text-sm font-bold uppercase tracking-tight text-slate-500 group-hover:text-slate-900 transition-colors">{team}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Slider */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary shadow-inner border border-slate-100">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <p className="text-slate-900 font-black uppercase tracking-tight italic">Preço Máximo: <span className="text-primary ml-1">R$ {priceRange}</span></p>
                        </div>
                        <div className="px-2">
                            <input
                                type="range"
                                min="100"
                                max="600"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white"
                            />
                        </div>
                    </div>
                </aside>

                {/* Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest italic">Mostrando <span className="text-slate-900">{filteredProducts.length}</span> modelos</p>
                    </div>
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
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
                        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-6">
                                <span className="material-symbols-outlined text-5xl">search_off</span>
                            </div>
                            <p className="text-slate-500 font-bold text-lg">Nenhum manto encontrado.</p>
                            <p className="text-slate-400 text-sm mt-1">Tente ajustar seus filtros para encontrar o que procura.</p>
                            <button onClick={() => { setCategoryFilter(null); setSelectedTeam(null); }} className="mt-8 bg-slate-900 text-white rounded-xl px-10 py-4 font-black text-sm uppercase italic tracking-tight hover:bg-primary transition-all shadow-xl">Limpar Todos os Filtros</button>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredProducts.length > 0 && (
                        <div className="flex items-center justify-center gap-4 mt-24">
                            <button className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center hover:bg-slate-50 transition-all border border-slate-200 text-slate-400 shadow-sm">
                                <span className="material-symbols-outlined text-2xl">chevron_left</span>
                            </button>
                            <button className="h-14 w-14 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/30 uppercase italic">1</button>
                            <button className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center hover:bg-slate-50 transition-all border border-slate-200 text-slate-400 shadow-sm font-black uppercase italic">2</button>
                            <button className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center hover:bg-slate-50 transition-all border border-slate-200 text-slate-400 shadow-sm">
                                <span className="material-symbols-outlined text-2xl">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;
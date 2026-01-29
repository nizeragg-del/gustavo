import React from 'react';
import { CartItem, Page } from '../types';

interface CartProps {
    cart: CartItem[];
    setCurrentPage: (page: Page) => void;
    isLoggedIn: boolean;
    onFinalize: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, setCurrentPage, isLoggedIn, onFinalize }) => {
    const [cep, setCep] = React.useState('');
    const [shippingCost, setShippingCost] = React.useState<number | null>(null);

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal + (shippingCost || 0);

    const handleCalculateShipping = () => {
        if (cep.length === 8) {
            // Basic mock logic: 15.00 for SP, 25.00 for others
            const cost = cep.startsWith('0') ? 15.90 : 25.90;
            setShippingCost(cost);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-white">
            {/* Stepper */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <button onClick={() => setCurrentPage('HOME')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Continuar Comprando
                </button>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-background-dark text-xs font-bold flex items-center justify-center">1</span>
                        <span className="text-sm font-semibold text-white">Carrinho</span>
                    </div>
                    <div className="w-12 h-px bg-white/10"></div>
                    <div className="flex items-center gap-2 opacity-40">
                        <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center">2</span>
                        <span className="text-sm font-medium text-white">Envio</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Items */}
                <div className="lg:col-span-8">
                    <h1 className="text-3xl font-bold mb-8">Seu Carrinho <span className="text-slate-500 font-normal">({cart.length} itens)</span></h1>

                    {cart.length === 0 ? (
                        <div className="p-12 text-center border border-white/10 rounded-xl bg-white/5">
                            <p className="text-white/60">Seu carrinho está vazio.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cart.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="bg-white/5 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center border border-white/5 hover:border-white/10 transition-all">
                                    <div className="bg-white/10 rounded-lg overflow-hidden w-full sm:w-32 aspect-square flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow w-full">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                                <p className="text-slate-400 text-sm mt-1">Tamanho: <span className="text-white">{item.size}</span></p>
                                            </div>
                                            <button className="text-slate-500 hover:text-red-400 transition-colors">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-end mt-6">
                                            <div className="flex items-center bg-background-dark/50 rounded-lg p-1 border border-white/10">
                                                <button className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors text-xl text-white">-</button>
                                                <input type="text" value={item.quantity} readOnly className="w-10 bg-transparent text-center border-none focus:ring-0 text-sm font-bold text-white" />
                                                <button className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors text-xl text-white">+</button>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-primary text-xl font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-white/5 rounded-xl p-8 border border-white/10 sticky top-28">
                        <h2 className="text-xl font-bold mb-6 text-white">Resumo do Pedido</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span className="text-white">R$ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Frete</span>
                                <span className={shippingCost === null ? "text-primary font-medium" : "text-white"}>
                                    {shippingCost === null ? 'Calcular abaixo' : `R$ ${shippingCost.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                <span className="text-lg font-bold text-white">Total</span>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">R$ {total.toFixed(2)}</p>
                                    <p className="text-xs text-slate-400 mt-1">ou 10x de R$ {(total / 10).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Calcular Frete (CEP)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="00000-000"
                                    maxLength={8}
                                    value={cep}
                                    onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                                    className="flex-grow bg-background-dark/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none font-bold text-white"
                                />
                                <button
                                    onClick={handleCalculateShipping}
                                    className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg text-sm font-bold transition-colors"
                                >
                                    Calcular
                                </button>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Cupom</label>
                            <div className="flex gap-2">
                                <input type="text" placeholder="CÓDIGO" className="flex-grow bg-background-dark/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none uppercase font-bold text-white" />
                                <button className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg text-sm font-bold transition-colors">Aplicar</button>
                            </div>
                        </div>

                        <button
                            onClick={onFinalize}
                            className="w-full bg-primary hover:bg-primary/90 text-background-dark font-black py-4 rounded-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 mb-6"
                        >
                            FINALIZAR COMPRA
                            <span className="material-symbols-outlined font-bold">arrow_forward</span>
                        </button>

                        <p className="text-[10px] text-slate-500 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm text-primary">lock</span>
                            Ambiente 100% seguro
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
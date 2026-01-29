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
    const [shippingOptions, setShippingOptions] = React.useState<any[]>([]);
    const [loadingShipping, setLoadingShipping] = React.useState(false);

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal + (shippingCost || 0);

    const handleCalculateShipping = async () => {
        if (cep.length !== 8) return;

        setLoadingShipping(true);
        try {
            const fromCep = import.meta.env.VITE_FROM_CEP || '01001000'; // Default to SP if not set

            const products = cart.map(item => ({
                id: item.id.toString(),
                width: item.width || 20,
                height: item.height || 5,
                length: item.length || 30,
                weight: item.weight || 0.3,
                insurance_value: item.price,
                quantity: item.quantity
            }));

            // Call our Vercel Function proxy instead of direct API
            const response = await fetch('/api/shipping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    from: { postal_code: fromCep },
                    to: { postal_code: cep },
                    products
                })
            });

            const data = await response.json();

            if (Array.isArray(data)) {
                // Filter relevant services (SEDEX, PAC often have specific IDs or just look for valid price)
                // Melhor Envio returns an array of services. Some might be error or restricted.
                const validOptions = data.filter((opt: any) => !opt.error && opt.price);
                setShippingOptions(validOptions);
                if (validOptions.length > 0) {
                    setShippingCost(Number(validOptions[0].price)); // Default to first (cheapest usually?)
                } else {
                    alert('Nenhuma opção de frete disponível para este CEP.');
                }
            } else {
                console.error('Shipping API Error:', data);
                // Show the specific error message from the API or Proxy
                const errorMessage = data.message || data.error || JSON.stringify(data);
                alert(`Erro na API de Frete: ${errorMessage}`);
            }
        } catch (error: any) {
            console.error('Error calculating shipping:', error);
            alert(`Erro de conexão: ${error.message}`);
        } finally {
            setLoadingShipping(false);
        }
    };

    return (
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-12 animate-fade-in text-slate-900 font-sans">
            {/* Stepper */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 pb-8 border-b border-slate-100">
                <button onClick={() => setCurrentPage('HOME')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all italic">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Voltar às compras
                </button>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary text-white text-xs font-black flex items-center justify-center shadow-lg shadow-primary/20 italic">1</div>
                        <span className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Carrinho</span>
                    </div>
                    <div className="w-16 h-1 bg-slate-100 rounded-full"></div>
                    <div className="flex items-center gap-3 opacity-30">
                        <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-500 text-xs font-black flex items-center justify-center italic">2</div>
                        <span className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Pagamento</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Items */}
                <div className="lg:col-span-8">
                    <h1 className="text-4xl font-black mb-10 uppercase italic tracking-tighter">
                        Carrinho <span className="text-primary ml-2">({cart.length})</span>
                    </h1>

                    {cart.length === 0 ? (
                        <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mx-auto mb-6">
                                <span className="material-symbols-outlined text-5xl">shopping_cart_off</span>
                            </div>
                            <p className="text-slate-500 font-bold text-lg">Seu carrinho está vazio.</p>
                            <button onClick={() => setCurrentPage('HOME')} className="mt-8 bg-slate-900 text-white rounded-xl px-10 py-4 font-black text-sm uppercase italic tracking-tight hover:bg-primary transition-all shadow-xl">Explorar Lançamentos</button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {cart.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="group bg-white rounded-[2rem] p-8 flex flex-col sm:flex-row gap-8 items-center border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                                    <div className="bg-slate-50 rounded-2xl overflow-hidden w-full sm:w-40 aspect-square flex-shrink-0 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow w-full py-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-primary text-[10px] font-black uppercase tracking-widest italic mb-1">{item.brand}</p>
                                                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">{item.name}</h3>
                                                <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Tamanho: <span className="text-slate-900">{item.size}</span></p>
                                            </div>
                                            <button className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-end mt-10">
                                            <div className="flex items-center bg-slate-50 rounded-xl px-2 h-12 border border-slate-200 shadow-inner">
                                                <button className="h-8 w-8 rounded-lg hover:bg-white hover:text-primary transition-all text-slate-900 flex items-center justify-center active:scale-95 text-lg font-black">-</button>
                                                <input type="text" value={item.quantity} readOnly className="w-10 bg-transparent text-center border-none focus:ring-0 text-sm font-black text-slate-900 italic" />
                                                <button className="h-8 w-8 rounded-lg hover:bg-white hover:text-primary transition-all text-slate-900 flex items-center justify-center active:scale-95 text-lg font-black">+</button>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-primary text-3xl font-black italic tracking-tighter">R$ {(item.price * item.quantity).toFixed(2)}</span>
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
                    <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 sticky top-28 shadow-inner">
                        <h2 className="text-2xl font-black mb-8 text-slate-900 uppercase italic tracking-tighter">Resumo</h2>
                        <div className="space-y-5 mb-8">
                            <div className="flex justify-between text-slate-500 font-bold uppercase tracking-tight text-xs">
                                <span>Subtotal</span>
                                <span className="text-slate-900">R$ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500 font-bold uppercase tracking-tight text-xs">
                                <span>Frete Estimado</span>
                                <span className={shippingCost === null ? "text-primary italic" : "text-slate-900"}>
                                    {shippingCost === null ? 'Pendente' : `R$ ${shippingCost.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
                                <span className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Total</span>
                                <div className="text-right">
                                    <p className="text-4xl font-black text-slate-900 italic tracking-tighter">R$ {total.toFixed(2)}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest italic">Ou 10x de R$ {(total / 10).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 italic">Cálculo de Entrega</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="CEP"
                                    maxLength={8}
                                    value={cep}
                                    onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none font-black text-slate-900 shadow-inner italic"
                                />
                                <button
                                    onClick={handleCalculateShipping}
                                    className="bg-slate-900 hover:bg-primary text-white px-6 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all shadow-lg active:scale-95"
                                >
                                    Calcular
                                </button>
                            </div>
                            {loadingShipping && <p className="text-[10px] text-primary mt-3 font-black uppercase italic animate-pulse">Calculando rota...</p>}
                        </div>

                        {/* Shipping Options List */}
                        {shippingOptions.length > 0 && (
                            <div className="mb-8 space-y-3">
                                {shippingOptions.map((opt: any) => {
                                    let displayName = opt.name;
                                    if (displayName === '.Package') displayName = 'PAC (Econômico)';
                                    if (displayName === '.Com') displayName = 'SEDEX (Expresso)';

                                    return (
                                        <label key={opt.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${Number(opt.price) === shippingCost ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="radio"
                                                    name="shipping"
                                                    checked={Number(opt.price) === shippingCost}
                                                    onChange={() => setShippingCost(Number(opt.price))}
                                                    className="accent-primary h-5 w-5"
                                                />
                                                <div>
                                                    <p className="font-black text-sm text-slate-900 uppercase italic tracking-tighter">{displayName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{opt.delivery_time} dias úteis</p>
                                                </div>
                                            </div>
                                            <span className="font-black text-primary italic">R$ {Number(opt.price).toFixed(2)}</span>
                                        </label>
                                    )
                                })}
                            </div>
                        )}

                        <div className="mb-10">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 italic">Cupom de Desconto</label>
                            <div className="flex gap-2">
                                <input type="text" placeholder="INSIRA O CÓDIGO" className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none uppercase font-black text-slate-900 shadow-inner italic" />
                                <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all active:scale-95">Aplicar</button>
                            </div>
                        </div>

                        <button
                            onClick={onFinalize}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl flex items-center justify-center gap-4 transition-all hover:scale-[1.02] shadow-2xl shadow-primary/30 mb-8 uppercase italic tracking-tighter text-xl"
                        >
                            Finalizar Pedido
                            <span className="material-symbols-outlined font-black">sports_score</span>
                        </button>

                        <div className="flex items-center justify-center gap-6 opacity-40">
                            <span className="material-symbols-outlined text-4xl">payments</span>
                            <span className="material-symbols-outlined text-4xl">lock</span>
                            <span className="material-symbols-outlined text-4xl">verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
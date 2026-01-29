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
            const token = import.meta.env.VITE_MELHOR_ENVIO_TOKEN;
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

            const response = await fetch('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
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
                alert('Erro ao calcular frete. Verifique o CEP.');
            }
        } catch (error) {
            console.error('Error calculating shipping:', error);
            alert('Erro de conexão com serviço de frete.');
        } finally {
            setLoadingShipping(false);
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
                        {loadingShipping && <p className="text-xs text-primary mt-2">Calculando...</p>}

                        {/* Shipping Options List */}
                        {shippingOptions.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {shippingOptions.map((opt: any) => (
                                    <label key={opt.id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${Number(opt.price) === shippingCost ? 'bg-primary/10 border-primary' : 'bg-background-dark/50 border-white/10 hover:border-white/30'}`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                checked={Number(opt.price) === shippingCost}
                                                onChange={() => setShippingCost(Number(opt.price))}
                                                className="accent-primary"
                                            />
                                            <div>
                                                <p className="font-bold text-sm text-white">{opt.name}</p>
                                                <p className="text-xs text-slate-400">Chega em até {opt.delivery_time} dias</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-primary">R$ {Number(opt.price).toFixed(2)}</span>
                                    </label>
                                ))}
                            </div>
                        )}

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
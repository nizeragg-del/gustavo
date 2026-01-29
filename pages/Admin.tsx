import React, { useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { Order, Product, Client } from '../types';
import { supabase } from '../lib/supabase';

type AdminTab = 'DASHBOARD' | 'PRODUCTS' | 'ADD_PRODUCT' | 'ORDERS' | 'CLIENTS' | 'REPORTS';

interface AdminProps {
    products?: Product[];
    orders?: Order[];
    onAddProduct?: (product: Product) => void;
    onUpdateStatus?: (orderId: string, status: string) => void;
    onNavigateHome?: () => void;
}

const Admin: React.FC<AdminProps> = ({ products = [], orders = [], onAddProduct, onUpdateStatus, onNavigateHome }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState<string | null>(null);

    React.useEffect(() => {
        checkUser();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                verifyAdmin(session.user);
            } else {
                setUser(null);
                setLoading(false);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            await verifyAdmin(session.user);
        } else {
            setLoading(false);
        }
    };

    const verifyAdmin = async (authUser: any) => {
        try {
            console.log("Verificando admin p/ UID:", authUser.id, authUser.email);
            setAuthError(null);

            // Tenta buscar por ID (UUID)
            const { data: profile, error } = await supabase
                .from('arena_profiles')
                .select('role, email')
                .eq('id', authUser.id)
                .single();

            if (error) {
                console.warn("Nenhum perfil encontrado por ID, tentando por email...", error.message);
                // Fallback por email caso o ID no banco esteja diferente
                const { data: profileByEmail, error: emailError } = await supabase
                    .from('arena_profiles')
                    .select('role, id')
                    .eq('email', authUser.email)
                    .single();

                if (emailError) {
                    console.error("Erro final ao buscar perfil:", emailError);
                    setAuthError(`Usuário não encontrado na tabela de permissões. (${emailError.message})`);
                    await supabase.auth.signOut();
                    setLoading(false);
                    return;
                }

                if (profileByEmail?.role === 'admin') {
                    console.log("Admin validado por email!");
                    setUser(authUser);
                } else {
                    setAuthError('Acesso negado: Perfil sem permissão de administrador.');
                    await supabase.auth.signOut();
                }
            } else if (profile?.role === 'admin') {
                console.log("Admin validado por ID!");
                setUser(authUser);
            } else {
                setAuthError('Acesso negado: ID de usuário não possui cargo administrativo.');
                await supabase.auth.signOut();
            }
        } catch (err: any) {
            console.error("Erro fatal no login:", err);
            setAuthError(`Erro interno: ${err.message || 'Erro desconhecido'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setAuthError('E-mail ou senha inválidos.');
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    // Form State for Add Product
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        category: 'Clubes',
        subcategory: 'Nacional'
    });

    const [clients, setClients] = useState<Client[]>([]);

    React.useEffect(() => {
        const fetchClients = async () => {
            const { data } = await supabase.from('arena_profiles').select('*');
            if (data) {
                setClients(data.map((p, i) => ({
                    id: i + 1,
                    name: p.full_name || p.email.split('@')[0],
                    email: p.email,
                    totalSpent: 0,
                    ordersCount: 0,
                    lastOrder: new Date(p.created_at).toLocaleDateString()
                })));
            }
        };
        fetchClients();
    }, []);

    const [activities, setActivities] = useState<any[]>([]);

    React.useEffect(() => {
        const fetchActivities = async () => {
            const { data } = await supabase.from('arena_activities').select('*').order('created_at', { ascending: false }).limit(5);
            if (data) setActivities(data);
        };
        fetchActivities();
    }, [orders]);

    const handleSubmitProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (onAddProduct && newProduct.name && newProduct.price && newProduct.image) {
            onAddProduct({
                id: Date.now(),
                name: newProduct.name,
                brand: newProduct.brand || "Genérica",
                price: Number(newProduct.price),
                image: newProduct.image,
                category: newProduct.category || "Clubes",
                isNew: true
            });
            setActiveTab('PRODUCTS');
            setNewProduct({ category: 'Clubes', subcategory: 'Nacional' }); // Reset
        }
    };

    // --- DYNAMIC DATA FOR DASHBOARD ---
    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
    const revenueData = [
        { name: 'Total', val: totalRevenue }
    ];

    const categorySalesData = [
        { name: 'Clubes', value: products.length },
        { name: 'Seleções', value: 0 },
    ];

    const bestSellers = products.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        sales: Math.floor(Math.random() * 10), // Mocking sales count for now
        stock: p.stock || 0,
        revenue: p.price,
        image: p.image
    }));

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-dark text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-dark p-4 font-display">
                <div className="bg-[#112218]/50 border border-[#326747] rounded-2xl p-8 max-w-md w-full animate-scale-in">
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <span className="material-symbols-outlined text-primary text-6xl">admin_panel_settings</span>
                        <h2 className="text-2xl font-black uppercase text-white tracking-widest text-center">Acesso Restrito</h2>
                        <p className="text-[#92c9a8] text-sm text-center">Entre com suas credenciais de administrador.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-xs font-bold uppercase text-[#92c9a8] mb-2">E-mail</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-[#234832]/30 border border-[#326747] rounded-lg px-4 py-4 text-white focus:border-primary outline-none transition-colors"
                                placeholder="admin@arenagolaco.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-[#92c9a8] mb-2">Senha</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-[#234832]/30 border border-[#326747] rounded-lg px-4 py-4 text-white focus:border-primary outline-none transition-colors"
                                placeholder="********"
                            />
                        </div>

                        {authError && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                                <p className="text-red-500 text-xs font-bold uppercase">{authError}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-background-dark font-black py-5 rounded-xl transition-all uppercase tracking-tighter"
                        >
                            {loading ? 'AUTENTICANDO...' : 'ENTRAR NO PAINEL'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[#326747] text-center">
                        <button onClick={onNavigateHome} className="text-[#92c9a8] text-sm font-bold hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Voltar para a Loja
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="flex h-screen overflow-hidden bg-background-dark text-white font-display">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-[#234832] bg-[#112218] flex flex-col justify-between p-4">
                <div className="flex flex-col gap-8">
                    <div onClick={onNavigateHome} className="flex gap-3 items-center px-2 cursor-pointer group">
                        <div className="bg-primary/20 p-2 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                            <span className="material-symbols-outlined text-primary text-2xl">sports_soccer</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-white text-base font-bold leading-none tracking-tight">Arena Golaço</h1>
                            <p className="text-[#92c9a8] text-xs font-normal">Voltar para Loja</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2">
                        <button onClick={() => setActiveTab('DASHBOARD')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-all ${activeTab === 'DASHBOARD' ? 'bg-primary text-background-dark' : 'text-[#92c9a8] hover:bg-[#234832] hover:text-white'}`}>
                            <span className="material-symbols-outlined fill-1">dashboard</span>
                            <p className="text-sm">Painel</p>
                        </button>
                        <button onClick={() => setActiveTab('PRODUCTS')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-all ${activeTab === 'PRODUCTS' ? 'bg-primary text-background-dark' : 'text-[#92c9a8] hover:bg-[#234832] hover:text-white'}`}>
                            <span className="material-symbols-outlined">apparel</span>
                            <p className="text-sm">Produtos</p>
                        </button>
                        <button onClick={() => setActiveTab('ORDERS')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-all ${activeTab === 'ORDERS' ? 'bg-primary text-background-dark' : 'text-[#92c9a8] hover:bg-[#234832] hover:text-white'}`}>
                            <span className="material-symbols-outlined">receipt_long</span>
                            <p className="text-sm">Pedidos</p>
                        </button>
                        <button onClick={() => setActiveTab('CLIENTS')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-all ${activeTab === 'CLIENTS' ? 'bg-primary text-background-dark' : 'text-[#92c9a8] hover:bg-[#234832] hover:text-white'}`}>
                            <span className="material-symbols-outlined">group</span>
                            <p className="text-sm">Clientes</p>
                        </button>
                    </nav>
                </div>
                <div className="flex flex-col gap-4">
                    <button onClick={() => setActiveTab('ADD_PRODUCT')} className="flex w-full cursor-pointer items-center justify-center rounded-lg h-11 bg-primary text-background-dark text-sm font-bold tracking-tight hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined mr-2 text-lg">add_circle</span> Novo Produto
                    </button>
                    <div className="flex items-center gap-3 px-3 mt-4 border-t border-[#234832] pt-6">
                        <div className="size-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Ricardo+Silva&background=random" alt="Admin" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">Ricardo Silva</span>
                            <span className="text-[10px] text-[#92c9a8] uppercase font-bold">Super Admin</span>
                        </div>
                        <button className="ml-auto text-[#92c9a8] hover:text-white">
                            <span className="material-symbols-outlined text-lg">logout</span>
                        </button>
                    </div>
                </div>
                <div className="mt-auto p-4 border-t border-[#234832]">
                    <button onClick={handleLogout} className="flex w-full items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-bold text-sm uppercase">
                        <span className="material-symbols-outlined">logout</span>
                        Sair do Painel
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-background-dark">
                <header className="h-16 flex items-center justify-between border-b border-[#234832] bg-[#112218] px-8 shrink-0">
                    <h2 className="text-white text-lg font-bold tracking-tight uppercase">
                        {activeTab === 'ADD_PRODUCT' ? 'Adicionar Produto' : activeTab === 'DASHBOARD' ? 'Dashboard' : activeTab}
                    </h2>
                    {activeTab === 'DASHBOARD' && (
                        <div className="flex-1 max-w-xl mx-8 relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92c9a8]">search</span>
                            <input className="w-full bg-[#1e382a] border border-[#326747] rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-[#5e8b72] focus:outline-none focus:border-primary" placeholder="Buscar pedidos, produtos ou clientes..." />
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <button className="text-[#92c9a8] hover:text-white transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-0 right-0 size-2 bg-primary rounded-full"></span>
                        </button>
                        <button className="text-[#92c9a8] hover:text-white transition-colors">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">

                    {activeTab === 'DASHBOARD' && (
                        <div className="animate-fade-in space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-3xl font-bold text-white">Overview</h2>
                                    <p className="text-[#92c9a8]">Monitorando performance de vendas em tempo real.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1e382a] border border-[#326747] rounded-lg text-xs font-bold text-white hover:bg-[#234832] transition-colors">
                                        <span className="material-symbols-outlined text-sm">calendar_today</span> Last 7 Days
                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1e382a] border border-[#326747] rounded-lg text-xs font-bold text-white hover:bg-[#234832] transition-colors">
                                        <span className="material-symbols-outlined text-sm">download</span> Exportar Relatório
                                    </button>
                                </div>
                            </div>

                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Vendas Hoje', val: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, trend: '+0%', icon: 'payments', good: true },
                                    { label: 'Total Pedidos', val: orders.length.toString(), trend: '+0%', icon: 'shopping_bag', good: true },
                                    { label: 'Ticket Médio', val: `R$ ${(totalRevenue / (orders.length || 1)).toFixed(2)}`, trend: '+0%', icon: 'analytics', good: true },
                                    { label: 'Envios Pendentes', val: orders.filter(o => o.status !== 'Entregue').length.toString(), trend: '0%', icon: 'local_shipping', good: false, trendLabel: 'vs meta' },
                                ].map((kpi, i) => (
                                    <div key={i} className="flex flex-col gap-2 rounded-xl p-6 border border-[#326747] bg-[#112218]/50 hover:border-primary/30 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[#92c9a8] text-sm font-medium">{kpi.label}</p>
                                            <span className="material-symbols-outlined text-primary opacity-50">{kpi.icon}</span>
                                        </div>
                                        <p className="text-white text-3xl font-black tracking-tight">{kpi.val}</p>
                                        <div className="flex items-center gap-1">
                                            <span className={`material-symbols-outlined text-sm font-bold ${kpi.good ? 'text-[#0bda43]' : 'text-[#fa5538]'}`}>{kpi.good ? 'trending_up' : 'trending_down'}</span>
                                            <p className={`text-xs font-bold ${kpi.good ? 'text-[#0bda43]' : 'text-[#fa5538]'}`}>{kpi.trend} {kpi.trendLabel || 'vs hoje'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Revenue Chart */}
                                <div className="lg:col-span-2 rounded-xl border border-[#326747] p-6 bg-[#112218]/50 h-[320px] flex flex-col">
                                    <div className="mb-6">
                                        <p className="text-[#92c9a8] text-sm font-medium">Receita Total</p>
                                        <h3 className="text-white text-2xl font-black">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                                    </div>
                                    <div className="flex-1 w-full h-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={revenueData}>
                                                <defs>
                                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#2bee79" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#2bee79" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#112218', borderColor: '#326747', borderRadius: '8px', color: '#fff' }}
                                                    itemStyle={{ color: '#2bee79' }}
                                                    labelStyle={{ color: '#92c9a8' }}
                                                    cursor={{ stroke: '#326747', strokeWidth: 1 }}
                                                />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#92c9a8', fontSize: 12 }} dy={10} />
                                                <Area type="monotone" dataKey="val" stroke="#2bee79" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Sales by Category Chart */}
                                <div className="lg:col-span-1 rounded-xl border border-[#326747] p-6 bg-[#112218]/50 h-[320px] flex flex-col">
                                    <div className="mb-6 flex justify-between items-start">
                                        <div>
                                            <p className="text-[#92c9a8] text-sm font-medium">Vendas por Categoria</p>
                                            <h3 className="text-white text-2xl font-black">Unidades Vendidas</h3>
                                        </div>
                                        <span className="bg-[#234832] text-[#0bda43] text-xs font-bold px-2 py-1 rounded">+5.7%</span>
                                    </div>
                                    <div className="flex-1 w-full h-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={categorySalesData}>
                                                <Tooltip
                                                    cursor={{ fill: '#234832', opacity: 0.4 }}
                                                    contentStyle={{ backgroundColor: '#112218', borderColor: '#326747', borderRadius: '8px', color: '#fff' }}
                                                />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#92c9a8', fontSize: 11 }} dy={10} />
                                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                    {categorySalesData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1e382a' : '#234832'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Best Sellers & Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                {/* Best Sellers */}
                                <div className="lg:col-span-2 rounded-xl border border-[#326747] bg-[#112218]/50 flex flex-col">
                                    <div className="p-6 border-b border-[#234832] flex justify-between items-center">
                                        <h3 className="font-bold text-white">Mais Vendidos</h3>
                                        <button className="text-[#0bda43] text-xs font-bold hover:underline">Ver Todos</button>
                                    </div>
                                    <div className="p-4">
                                        <table className="w-full text-left">
                                            <thead className="text-[#5e8b72] text-[10px] font-bold uppercase tracking-wider">
                                                <tr>
                                                    <th className="pb-4 pl-2">Produto</th>
                                                    <th className="pb-4">Categoria</th>
                                                    <th className="pb-4">Vendas</th>
                                                    <th className="pb-4">Estoque</th>
                                                    <th className="pb-4 text-right">Receita</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {bestSellers.map((item) => (
                                                    <tr key={item.id} className="group hover:bg-[#234832]/30 transition-colors border-b border-[#234832] last:border-0">
                                                        <td className="py-3 pl-2 flex items-center gap-3">
                                                            <div className="size-10 rounded bg-[#1e382a] overflow-hidden border border-[#326747]">
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                            <span className="font-bold text-white text-xs md:text-sm">{item.name}</span>
                                                        </td>
                                                        <td className="py-3 text-[#92c9a8] text-xs md:text-sm">{item.category}</td>
                                                        <td className="py-3 text-white font-bold">{item.sales}</td>
                                                        <td className="py-3 w-32">
                                                            <div className="w-full bg-[#1e382a] h-1.5 rounded-full overflow-hidden">
                                                                <div className={`h-full rounded-full ${item.stock < 40 ? 'bg-yellow-500' : 'bg-[#0bda43]'}`} style={{ width: `${item.stock}%` }}></div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 text-right font-bold text-white">R$ {item.revenue.toLocaleString('pt-BR')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="lg:col-span-1 rounded-xl border border-[#326747] bg-[#112218]/50 flex flex-col">
                                    <div className="p-6 border-b border-[#234832] flex justify-between items-center">
                                        <h3 className="font-bold text-white">Atividade Recente</h3>
                                        <span className="material-symbols-outlined text-[#92c9a8] text-sm cursor-pointer hover:text-white">history</span>
                                    </div>
                                    <div className="p-6 flex flex-col gap-6">
                                        {activities.map((act, i) => (
                                            <div key={i} className="flex gap-4 relative">
                                                {i !== activities.length - 1 && <div className="absolute left-[19px] top-10 bottom-[-24px] w-px bg-[#234832]"></div>}
                                                <div className="size-10 rounded-full bg-[#1e382a] border border-[#326747] flex items-center justify-center shrink-0 z-10">
                                                    <span className={`material-symbols-outlined text-lg ${act.color}`}>{act.icon}</span>
                                                </div>
                                                <div className="flex flex-col pt-0.5">
                                                    <p className="text-white text-sm font-medium">
                                                        {act.title} <span className="text-[#92c9a8] font-normal">{act.subtitle}</span>
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-[#5e8b72]">{new Date(act.created_at).toLocaleTimeString()}</span>
                                                        {act.value_label && (
                                                            <>
                                                                <span className="text-[10px] text-[#234832]">•</span>
                                                                <span className="text-[10px] font-bold text-[#92c9a8]">{act.value_label}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {activeTab === 'PRODUCTS' && (
                        <div className="animate-fade-in">
                            <div className="rounded-xl border border-[#326747] bg-[#112218]/50 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-[#234832]/30 text-[#92c9a8] text-xs font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">ID</th>
                                            <th className="px-6 py-4">Produto</th>
                                            <th className="px-6 py-4">Categoria</th>
                                            <th className="px-6 py-4">Preço</th>
                                            <th className="px-6 py-4">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#234832]">
                                        {products.map(p => (
                                            <tr key={p.id} className="hover:bg-[#234832]/20 transition-colors">
                                                <td className="px-6 py-4 text-[#92c9a8] font-mono text-xs">#{p.id}</td>
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <img src={p.image} className="w-10 h-10 rounded object-cover bg-white/5" />
                                                    <span className="text-white font-medium">{p.name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-[#92c9a8]">{p.category}</td>
                                                <td className="px-6 py-4 text-white font-bold">R$ {p.price.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <button className="text-white hover:text-primary"><span className="material-symbols-outlined">edit</span></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ADD_PRODUCT' && (
                        <div className="max-w-2xl animate-fade-in">
                            <form onSubmit={handleSubmitProduct} className="space-y-6">
                                <div className="bg-[#112218]/50 p-8 rounded-xl border border-[#326747] space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold uppercase text-[#92c9a8] mb-2">Nome do Produto</label>
                                            <input required value={newProduct.name || ''} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full bg-[#234832]/30 border border-[#326747] rounded-lg px-4 py-3 text-white focus:border-primary outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-[#92c9a8] mb-2">Marca</label>
                                            <input value={newProduct.brand || ''} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} className="w-full bg-[#234832]/30 border border-[#326747] rounded-lg px-4 py-3 text-white focus:border-primary outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-[#92c9a8] mb-2">Preço (R$)</label>
                                            <input type="number" step="0.01" required value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} className="w-full bg-[#234832]/30 border border-[#326747] rounded-lg px-4 py-3 text-white focus:border-primary outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-[#92c9a8] mb-2">Categoria</label>
                                            <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full bg-[#234832]/30 border border-[#326747] rounded-lg px-4 py-3 text-white focus:border-primary outline-none">
                                                <option>Clubes</option>
                                                <option>Seleções</option>
                                                <option>Retrô</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-[#92c9a8] mb-2">Subcategoria</label>
                                            <select value={newProduct.subcategory} onChange={e => setNewProduct({ ...newProduct, subcategory: e.target.value })} className="w-full bg-[#234832]/30 border border-[#326747] rounded-lg px-4 py-3 text-white focus:border-primary outline-none">
                                                <option>Nacional</option>
                                                <option>Internacional</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold uppercase text-[#92c9a8] mb-2">URL da Imagem</label>
                                            <input required value={newProduct.image || ''} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} className="w-full bg-[#234832]/30 border border-[#326747] rounded-lg px-4 py-3 text-white focus:border-primary outline-none" placeholder="https://..." />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-4 pt-4 border-t border-[#326747]">
                                        <button type="button" onClick={() => setActiveTab('PRODUCTS')} className="px-6 py-2 text-[#92c9a8] font-bold hover:text-white">Cancelar</button>
                                        <button type="submit" className="px-6 py-2 bg-primary text-background-dark font-bold rounded-lg hover:opacity-90">Salvar Produto</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'ORDERS' && (
                        <div className="animate-fade-in">
                            <div className="rounded-xl border border-[#326747] bg-[#112218]/50 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-[#234832]/30 text-[#92c9a8] text-xs font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">ID</th>
                                            <th className="px-6 py-4">Data</th>
                                            <th className="px-6 py-4">Cliente</th>
                                            <th className="px-6 py-4">Total</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#234832]">
                                        {orders.map(o => (
                                            <tr key={o.id} className="hover:bg-[#234832]/20 transition-colors">
                                                <td className="px-6 py-4 text-[#92c9a8] font-mono text-xs">{o.id}</td>
                                                <td className="px-6 py-4 text-white">{o.date}</td>
                                                <td className="px-6 py-4 text-white">Carlos Silva</td> {/* Mock */}
                                                <td className="px-6 py-4 text-white font-bold">R$ {o.total.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${o.status === 'Entregue' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {o.status !== 'Entregue' && (
                                                        <button
                                                            onClick={() => onUpdateStatus && onUpdateStatus(o.id, 'Entregue')}
                                                            className="text-primary text-xs font-bold hover:underline"
                                                        >
                                                            Marcar Entregue
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'CLIENTS' && (
                        <div className="animate-fade-in">
                            <div className="rounded-xl border border-[#326747] bg-[#112218]/50 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-[#234832]/30 text-[#92c9a8] text-xs font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Cliente</th>
                                            <th className="px-6 py-4">E-mail</th>
                                            <th className="px-6 py-4">Pedidos</th>
                                            <th className="px-6 py-4">Total Gasto</th>
                                            <th className="px-6 py-4">Última Compra</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#234832]">
                                        {clients.map(c => (
                                            <tr key={c.id} className="hover:bg-[#234832]/20 transition-colors">
                                                <td className="px-6 py-4 text-white font-bold">{c.name}</td>
                                                <td className="px-6 py-4 text-[#92c9a8]">{c.email}</td>
                                                <td className="px-6 py-4 text-white">{c.ordersCount}</td>
                                                <td className="px-6 py-4 text-primary font-bold">R$ {c.totalSpent.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-white/60 text-sm">{c.lastOrder}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default Admin;
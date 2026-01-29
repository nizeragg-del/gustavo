import React, { useState } from 'react';
import { Address, Order, User } from '../types';
import { supabase } from '../lib/supabase';

type ProfileTab = 'OVERVIEW' | 'DATA' | 'ORDERS' | 'ADDRESSES';

interface ProfileProps {
    user: any;
    orders: Order[];
    initialTab?: ProfileTab;
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user: authUser, orders, initialTab = 'OVERVIEW', onLogout }) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);

    // User Data State initialized from authUser
    const [user, setUser] = useState<User>({
        name: authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || "Usuário",
        email: authUser?.email || "",
        phone: "",
        cpf: "",
        addresses: [],
        isLoading: true
    });

    const [isEditing, setIsEditing] = useState(false);
    const [newAddress, setNewAddress] = useState<Partial<Address>>({});
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    // Fetch Profile Data from DB
    React.useEffect(() => {
        const fetchProfile = async () => {
            if (!authUser?.id) return;
            try {
                const { data, error } = await supabase
                    .from('arena_profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();

                if (data) {
                    const addresses: Address[] = [];
                    if (data.address) {
                        // Se for um array de endereços (novo formato)
                        if (Array.isArray(data.address)) {
                            addresses.push(...data.address);
                        } else {
                            // Se for o formato antigo/cadastro (objeto único)
                            addresses.push({
                                id: 1,
                                name: 'Principal',
                                street: data.address.street || '',
                                number: data.address.number || '',
                                district: data.address.district || '',
                                city: data.address.city || '',
                                state: data.address.state || '',
                                zip: data.address.zip || '',
                                isDefault: true
                            });
                        }
                    }

                    setUser(prev => ({
                        ...prev,
                        name: data.full_name || prev.name,
                        email: data.email || prev.email,
                        phone: data.phone || "",
                        cpf: data.cpf || "",
                        addresses: addresses,
                        isLoading: false
                    }));
                } else {
                    setUser(prev => ({ ...prev, isLoading: false }));
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };
        fetchProfile();
    }, [authUser]);

    const handleSaveData = async () => {
        setIsEditing(false);
        try {
            // Save to DB
            const { error } = await supabase
                .from('arena_profiles')
                .update({
                    full_name: user.name,
                    phone: user.phone,
                    cpf: user.cpf,
                    address: user.addresses // Salva o array completo de endereços
                })
                .eq('id', authUser.id);

            if (error) throw error;
            alert("Dados e endereços atualizados com sucesso!");
        } catch (e: any) {
            alert("Erro ao atualizar: " + e.message);
        }
    };

    const handleAddAddress = async () => {
        const address: Address = {
            id: Date.now(),
            name: newAddress.name || "Nova",
            street: newAddress.street || "",
            number: newAddress.number || "",
            district: newAddress.district || "",
            city: newAddress.city || "",
            state: newAddress.state || "",
            zip: newAddress.zip || "",
            isDefault: user.addresses.length === 0
        };
        const updatedAddresses = [...user.addresses, address];
        setUser(prev => ({ ...prev, addresses: updatedAddresses }));

        try {
            // Persistir no banco imediatamente
            await supabase.from('arena_profiles').update({ address: updatedAddresses }).eq('id', authUser.id);
            setNewAddress({});
            setIsAddingAddress(false);
        } catch (e) {
            console.error("Erro ao salvar endereço:", e);
        }
    };

    const handleSetDefaultAddress = async (id: number) => {
        const updatedAddresses = user.addresses.map(addr => ({ ...addr, isDefault: addr.id === id }));
        setUser(prev => ({ ...prev, addresses: updatedAddresses }));
        await supabase.from('arena_profiles').update({ address: updatedAddresses }).eq('id', authUser.id);
    };

    const handleRemoveAddress = async (id: number) => {
        const updatedAddresses = user.addresses.filter(addr => addr.id !== id);
        setUser(prev => ({ ...prev, addresses: updatedAddresses }));
        await supabase.from('arena_profiles').update({ address: updatedAddresses }).eq('id', authUser.id);
    };

    return (
        <div className="max-w-[1440px] mx-auto px-6 py-12 animate-fade-in text-slate-900 font-sans">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar */}
                <aside className="w-full lg:w-80 shrink-0">
                    <div className="sticky top-28 space-y-10 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-5 pb-6 border-b border-slate-50">
                            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 text-primary shadow-inner">
                                <span className="material-symbols-outlined text-3xl">person</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{user.name}</h1>
                                <p className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full w-fit mt-2 uppercase tracking-widest italic">Membro Elite</p>
                            </div>
                        </div>
                        <nav className="flex flex-col gap-3">
                            <button
                                onClick={() => setActiveTab('OVERVIEW')}
                                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all w-full text-left group ${activeTab === 'OVERVIEW' ? 'bg-primary text-white font-black shadow-lg shadow-primary/30 italic' : 'hover:bg-slate-50 text-slate-400'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined">dashboard</span>
                                    <span className="text-sm uppercase tracking-tight">Painel</span>
                                </div>
                                {activeTab === 'OVERVIEW' && <span className="material-symbols-outlined text-sm">chevron_right</span>}
                            </button>
                            <button
                                onClick={() => setActiveTab('DATA')}
                                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all w-full text-left group ${activeTab === 'DATA' ? 'bg-primary text-white font-black shadow-lg shadow-primary/30 italic' : 'hover:bg-slate-50 text-slate-400'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined">badge</span>
                                    <span className="text-sm uppercase tracking-tight">Meus Dados</span>
                                </div>
                                {activeTab === 'DATA' && <span className="material-symbols-outlined text-sm">chevron_right</span>}
                            </button>
                            <button
                                onClick={() => setActiveTab('ORDERS')}
                                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all w-full text-left group ${activeTab === 'ORDERS' ? 'bg-primary text-white font-black shadow-lg shadow-primary/30 italic' : 'hover:bg-slate-50 text-slate-400'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined">package_2</span>
                                    <span className="text-sm uppercase tracking-tight">Pedidos</span>
                                </div>
                                {activeTab === 'ORDERS' && <span className="material-symbols-outlined text-sm">chevron_right</span>}
                            </button>
                            <button
                                onClick={() => setActiveTab('ADDRESSES')}
                                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all w-full text-left group ${activeTab === 'ADDRESSES' ? 'bg-primary text-white font-black shadow-lg shadow-primary/30 italic' : 'hover:bg-slate-50 text-slate-400'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined">distance</span>
                                    <span className="text-sm uppercase tracking-tight">Endereços</span>
                                </div>
                                {activeTab === 'ADDRESSES' && <span className="material-symbols-outlined text-sm">chevron_right</span>}
                            </button>

                            <div className="pt-6 mt-6 border-t border-slate-50">
                                <button
                                    onClick={onLogout}
                                    className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all w-full group"
                                >
                                    <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">logout</span>
                                    <span className="text-sm uppercase font-black italic tracking-widest">Sair</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Content Area */}
                <div className="flex-1 space-y-12 animate-fade-in">

                    {activeTab === 'OVERVIEW' && (
                        <>
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Última Atividade</h2>
                                    <button onClick={() => setActiveTab('ORDERS')} className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic hover:translate-x-1 transition-transform flex items-center gap-2">Explorar Histórico <span className="material-symbols-outlined text-sm">trending_flat</span></button>
                                </div>
                                {orders.length > 0 ? (
                                    <div className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/40 hover:border-primary/20 transition-all duration-500">
                                        <div className="p-10">
                                            <div className="flex flex-col md:flex-row gap-12">
                                                <div className="flex-1 space-y-8">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className={`h-2.5 w-2.5 rounded-full ${orders[0].status === 'Entregue' ? 'bg-primary shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-primary animate-pulse'}`}></span>
                                                            <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] italic">{orders[0].status}</p>
                                                        </div>
                                                        <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                                                            {typeof orders[0].items[0] === 'string' ? orders[0].items[0] : orders[0].items[0].name}
                                                        </h3>
                                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                            Pedido <span className="text-slate-900">#{orders[0].id}</span> • {orders[0].date}
                                                        </p>
                                                    </div>
                                                    {/* Progress Bar */}
                                                    <div className="relative pt-4">
                                                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                                                            <div className={`h-full bg-primary transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.3)] ${orders[0].status === 'Processando' ? 'w-1/3' : orders[0].status === 'Enviado' ? 'w-2/3' : 'w-full'}`}></div>
                                                        </div>
                                                        <div className="flex justify-between mt-4 text-[9px] font-black text-slate-300 uppercase italic tracking-widest">
                                                            <span className={orders[0].status === 'Processando' ? 'text-primary' : ''}>Confirmado</span>
                                                            <span className={orders[0].status === 'Enviado' ? 'text-primary' : ''}>Em Rota</span>
                                                            <span className={orders[0].status === 'Entregue' ? 'text-primary' : ''}>No Campo</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                                        <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-slate-200 mx-auto mb-4 italic font-black shadow-sm">!</div>
                                        <p className="text-slate-400 font-bold uppercase tracking-tight">Nenhuma atividade registrada no campo.</p>
                                    </div>
                                )}
                            </section>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div onClick={() => setActiveTab('DATA')} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 cursor-pointer hover:border-primary/30 transition-all duration-500 shadow-xl shadow-slate-200/40 group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <span className="material-symbols-outlined text-4xl text-primary font-black">badge</span>
                                        <span className="material-symbols-outlined text-slate-200 group-hover:text-primary transition-colors">arrow_forward</span>
                                    </div>
                                    <h3 className="font-black text-2xl uppercase italic tracking-tighter mb-4">Meus Dados</h3>
                                    <div className="space-y-2 pb-2">
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Identificação Principal</p>
                                        <p className="text-slate-900 font-black text-lg italic tracking-tight">{user.name}</p>
                                    </div>
                                </div>
                                <div onClick={() => setActiveTab('ADDRESSES')} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 cursor-pointer hover:border-primary/30 transition-all duration-500 shadow-xl shadow-slate-200/40 group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <span className="material-symbols-outlined text-4xl text-primary font-black">distance</span>
                                        <span className="material-symbols-outlined text-slate-200 group-hover:text-primary transition-colors">arrow_forward</span>
                                    </div>
                                    <h3 className="font-black text-2xl uppercase italic tracking-tighter mb-4">Endereços</h3>
                                    <div className="space-y-2 pb-2">
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Base de Operações</p>
                                        <p className="text-slate-900 font-black text-lg italic tracking-tighter truncate">{user.addresses.find(a => a.isDefault)?.street || 'Pendente Cadastro'}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'DATA' && (
                        <section className="bg-white rounded-[2.5rem] border border-slate-100 p-12 shadow-2xl shadow-slate-200/40">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Informações Pessoais</h2>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white rounded-xl px-6 py-2.5 font-black text-[10px] uppercase italic tracking-[0.2em] hover:bg-primary transition-all shadow-lg active:scale-95 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">edit</span> Editar Perfil
                                    </button>
                                ) : (
                                    <div className="flex gap-4">
                                        <button onClick={() => setIsEditing(false)} className="text-slate-400 text-[10px] font-black uppercase italic tracking-widest px-4 hover:text-slate-900 transition-colors">Cancelar</button>
                                        <button onClick={handleSaveData} className="bg-primary text-white rounded-xl px-8 py-2.5 font-black text-[10px] uppercase italic tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Sincronizar</button>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Nome de Atleta</label>
                                    <input disabled={!isEditing} type="text" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic disabled:opacity-50 focus:border-primary outline-none shadow-inner transition-all" />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Correio Eletrônico</label>
                                    <input disabled={!isEditing} type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic disabled:opacity-50 focus:border-primary outline-none shadow-inner transition-all" />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 italic">WhatsApp p/ Contato</label>
                                    <input disabled={!isEditing} type="tel" value={user.phone} onChange={e => setUser({ ...user, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic disabled:opacity-50 focus:border-primary outline-none shadow-inner transition-all" />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Nº de Cadastro (CPF)</label>
                                    <input disabled={!isEditing} type="text" value={user.cpf} onChange={e => setUser({ ...user, cpf: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic disabled:opacity-50 focus:border-primary outline-none shadow-inner transition-all" />
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'ORDERS' && (
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Histórico de Conquistas</h2>
                            <div className="grid gap-6">
                                {orders.map((order, idx) => (
                                    <div key={idx} className="group bg-white rounded-[2.5rem] border border-slate-100 p-10 flex flex-col md:flex-row gap-8 justify-between items-center hover:border-primary/20 hover:shadow-2xl transition-all duration-500 shadow-lg shadow-slate-100">
                                        <div className="flex items-center gap-8 w-full">
                                            <div className="bg-slate-50 p-6 rounded-2xl shadow-inner group-hover:bg-primary/5 transition-colors">
                                                <span className="material-symbols-outlined text-4xl text-primary font-black">sports_score</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{order.date}</p>
                                                    <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">#{order.id}</p>
                                                </div>
                                                <h3 className="font-black text-2xl uppercase italic tracking-tighter text-slate-900">
                                                    {Array.isArray(order.items) ? (typeof order.items[0] === 'string' ? order.items[0] : `${order.items.length} Mantos Selecionados`) : order.items}
                                                </h3>
                                                <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-wide">
                                                    {Array.isArray(order.items) && order.items.length > 1 ? `E mais ${order.items.length - 1} itens especialistas` : 'Produto de alta performance'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col md:items-end gap-3 w-full md:w-auto pb-4 md:pb-0">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic ${order.status === 'Entregue' ? 'bg-green-50/80 text-green-600 border border-green-100' :
                                                order.status === 'Cancelado' ? 'bg-red-50/80 text-red-500 border border-red-100' :
                                                    'bg-primary/10 text-primary border border-primary/20'
                                                }`}>
                                                {order.status}
                                            </span>
                                            <p className="font-black text-3xl italic tracking-tighter text-slate-900">R$ {order.total.toFixed(2)}</p>
                                            <button className="text-primary text-[10px] font-black uppercase italic tracking-widest hover:underline hover:translate-x-1 transition-transform flex items-center gap-2 justify-end">Explorar Guia <span className="material-symbols-outlined text-sm">chevron_right</span></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {activeTab === 'ADDRESSES' && (
                        <section className="space-y-10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Bases de Envio</h2>
                                <button onClick={() => setIsAddingAddress(true)} className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase italic tracking-[0.2em] flex items-center gap-3 hover:bg-primary transition-all shadow-xl active:scale-95">
                                    <span className="material-symbols-outlined text-sm">add_location_alt</span> Nova Base
                                </button>
                            </div>

                            {isAddingAddress && (
                                <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-2xl animate-fade-in relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20"></div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8 relative z-10">Registrar Localização</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Identificador (Ex: Casa)</label>
                                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-slate-900 font-black italic outline-none focus:border-primary shadow-inner" value={newAddress.name || ''} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Código Postal (CEP)</label>
                                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-slate-900 font-black italic outline-none focus:border-primary shadow-inner" value={newAddress.zip || ''} onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Número</label>
                                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-slate-900 font-black italic outline-none focus:border-primary shadow-inner" value={newAddress.number || ''} onChange={e => setNewAddress({ ...newAddress, number: e.target.value })} />
                                        </div>
                                        <div className="md:col-span-3 space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Logradouro / Avenida</label>
                                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-slate-900 font-black italic outline-none focus:border-primary shadow-inner" value={newAddress.street || ''} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Bairro</label>
                                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-slate-900 font-black italic outline-none focus:border-primary shadow-inner" value={newAddress.district || ''} onChange={e => setNewAddress({ ...newAddress, district: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Cidade</label>
                                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-slate-900 font-black italic outline-none focus:border-primary shadow-inner" value={newAddress.city || ''} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Estado (UF)</label>
                                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-slate-900 font-black italic outline-none focus:border-primary shadow-inner" value={newAddress.state || ''} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-6 pt-4">
                                        <button onClick={() => setIsAddingAddress(false)} className="text-slate-400 font-black text-[10px] uppercase italic tracking-widest hover:text-slate-900">Abortar</button>
                                        <button onClick={handleAddAddress} className="bg-primary text-white rounded-xl px-10 py-3 font-black text-[10px] uppercase italic tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Ativar Localização</button>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {user.addresses.map(addr => (
                                    <div key={addr.id} className={`p-10 rounded-[2.5rem] border-2 relative group transition-all duration-500 overflow-hidden ${addr.isDefault ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' : 'border-slate-100 bg-white hover:border-slate-300 shadow-xl shadow-slate-200/40'}`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                                        {addr.isDefault && <span className="absolute top-8 right-8 text-[10px] font-black uppercase tracking-widest text-white bg-primary px-4 py-1.5 rounded-full italic shadow-lg shadow-primary/30">QG Principal</span>}
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="material-symbols-outlined text-primary text-3xl font-black">location_city</span>
                                            <h3 className="font-black text-2xl uppercase italic tracking-tighter text-slate-900">{addr.name}</h3>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{addr.street}{addr.number ? `, ${addr.number}` : ''}</p>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{addr.district} • {addr.city}/{addr.state}</p>
                                            <p className="text-slate-400 text-[10px] font-black mt-2 inline-block bg-slate-100 px-3 py-1 rounded-lg">CEP {addr.zip}</p>
                                        </div>

                                        <div className="flex gap-6 mt-10 pt-6 border-t border-slate-50 md:opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                            <button className="text-slate-900 hover:text-primary text-[10px] font-black uppercase italic tracking-widest transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-sm">edit</span> Editar</button>
                                            {!addr.isDefault && (
                                                <>
                                                    <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-slate-900 hover:text-primary text-[10px] font-black uppercase italic tracking-widest transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-sm">home</span> Setar QG</button>
                                                    <button onClick={() => handleRemoveAddress(addr.id)} className="text-red-500 hover:text-red-600 text-[10px] font-black uppercase italic tracking-widest transition-colors flex items-center gap-2 ml-auto"><span className="material-symbols-outlined text-sm">delete</span> Deletar</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Profile;
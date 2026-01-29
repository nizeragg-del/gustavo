import React, { useState } from 'react';
import { Address, Order, User } from '../types';

type ProfileTab = 'OVERVIEW' | 'DATA' | 'ORDERS' | 'ADDRESSES';

interface ProfileProps {
    orders: Order[];
    initialTab?: ProfileTab;
}

const Profile: React.FC<ProfileProps> = ({ orders, initialTab = 'OVERVIEW' }) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
    
    // Mock User Data State
    const [user, setUser] = useState<User>({
        name: "Carlos Eduardo da Silva",
        email: "carlos.silva@email.com.br",
        phone: "(11) 99999-8888",
        cpf: "123.456.789-00",
        addresses: [
            { id: 1, name: "Principal", street: "Rua das Olimpíadas, 1200 - Apto 42", district: "Vila Olímpia", city: "São Paulo/SP", zip: "04551-000", isDefault: true }
        ]
    });

    const [isEditing, setIsEditing] = useState(false);
    const [newAddress, setNewAddress] = useState<Partial<Address>>({});
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    const handleSaveData = () => {
        setIsEditing(false);
        // In a real app, API call here
    };

    const handleAddAddress = () => {
        if (newAddress.street) {
            const address: Address = {
                id: Date.now(),
                name: newAddress.name || "Nova",
                street: newAddress.street || "",
                district: newAddress.district || "",
                city: newAddress.city || "",
                zip: newAddress.zip || "",
                isDefault: user.addresses.length === 0
            };
            setUser(prev => ({ ...prev, addresses: [...prev.addresses, address] }));
            setNewAddress({});
            setIsAddingAddress(false);
        }
    };

    const handleSetDefaultAddress = (id: number) => {
        setUser(prev => ({
            ...prev,
            addresses: prev.addresses.map(addr => ({ ...addr, isDefault: addr.id === id }))
        }));
    };

    const handleRemoveAddress = (id: number) => {
        setUser(prev => ({
            ...prev,
            addresses: prev.addresses.filter(addr => addr.id !== id)
        }));
    };

    return (
    <div className="max-w-[1440px] mx-auto px-6 py-10 animate-fade-in text-white">
        <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 shrink-0">
                <div className="sticky top-28 space-y-8 bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-center bg-cover border-2 border-primary" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA-iyrW7A79lXJlve4Tz0IePm_BNhwWaGHpSPSWKdukUhu5mAv0MINhyGywxoIEjvoU1BzSMIN7jBpOU-MBftOd38dSMelU5V-NwxwsPVw8l8uFwd8oewmIT1_23sZx1m790Q3Lr8xCRI_VD961uFxuctG2uo9g8qIaQiZVwuMT7l_YfsajH1mB81Zp44mVF8CSySVGXcTEgpu71jSj5-FfRVmW4Po9WXOcKsUQhUNZD_6K7kxe2trMhaQuqNoYhE8OG5TZxiNGYg")'}}></div>
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold text-white">{user.name.split(' ')[0]} {user.name.split(' ')[1]}</h1>
                            <p className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit mt-1 uppercase tracking-wider">Membro VIP</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2">
                        <button 
                            onClick={() => setActiveTab('OVERVIEW')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left ${activeTab === 'OVERVIEW' ? 'bg-primary text-black font-semibold shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-sm">Visão Geral</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('DATA')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left ${activeTab === 'DATA' ? 'bg-primary text-black font-semibold shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined">person</span>
                            <span className="text-sm">Meus Dados</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('ORDERS')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left ${activeTab === 'ORDERS' ? 'bg-primary text-black font-semibold shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined">package_2</span>
                            <span className="text-sm font-medium">Meus Pedidos</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('ADDRESSES')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left ${activeTab === 'ADDRESSES' ? 'bg-primary text-black font-semibold shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined">location_on</span>
                            <span className="text-sm font-medium">Endereços</span>
                        </button>
                        <hr className="my-4 border-white/10"/>
                        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all w-full">
                            <span className="material-symbols-outlined">logout</span>
                            <span className="text-sm font-medium">Sair</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 space-y-8 animate-fade-in">
                
                {activeTab === 'OVERVIEW' && (
                    <>
                    <section>
                        <div className="flex items-center justify-between px-4 mb-4">
                            <h2 className="text-2xl font-bold tracking-tight">Último Pedido</h2>
                            <button onClick={() => setActiveTab('ORDERS')} className="text-sm font-medium text-primary cursor-pointer hover:underline">Ver todos</button>
                        </div>
                        {orders.length > 0 ? (
                            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-sm">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 space-y-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`size-2 rounded-full ${orders[0].status === 'Entregue' ? 'bg-green-500' : 'bg-primary animate-pulse'}`}></span>
                                                    <p className="text-primary text-xs font-bold uppercase tracking-widest">{orders[0].status}</p>
                                                </div>
                                                <h3 className="text-xl font-bold">{typeof orders[0].items[0] === 'string' ? orders[0].items[0] : orders[0].items[0].name}</h3>
                                                <p className="text-white/60 text-sm font-medium">Pedido {orders[0].id} • Realizado em {orders[0].date}</p>
                                            </div>
                                            {/* Simplified Timeline */}
                                            <div className="w-full bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
                                                <div className={`h-full bg-primary transition-all duration-1000 ${orders[0].status === 'Processando' ? 'w-1/3' : orders[0].status === 'Enviado' ? 'w-2/3' : 'w-full'}`}></div>
                                            </div>
                                            <p className="text-xs text-white/40">Status atual: {orders[0].status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                             <div className="p-8 text-center bg-white/5 rounded-xl border border-white/10">
                                <p className="text-white/60">Você ainda não fez nenhum pedido.</p>
                            </div>
                        )}
                    </section>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div onClick={() => setActiveTab('DATA')} className="bg-white/5 p-6 rounded-xl border border-white/10 cursor-pointer hover:border-primary/50 transition-colors">
                            <span className="material-symbols-outlined text-3xl text-primary mb-4">person</span>
                            <h3 className="font-bold text-lg">Meus Dados</h3>
                            <p className="text-white/60 text-sm mt-1">Gerencie suas informações pessoais.</p>
                        </div>
                        <div onClick={() => setActiveTab('ADDRESSES')} className="bg-white/5 p-6 rounded-xl border border-white/10 cursor-pointer hover:border-primary/50 transition-colors">
                            <span className="material-symbols-outlined text-3xl text-primary mb-4">location_on</span>
                            <h3 className="font-bold text-lg">Endereços</h3>
                            <p className="text-white/60 text-sm mt-1">Gerencie seus locais de entrega.</p>
                        </div>
                    </div>
                    </>
                )}

                {activeTab === 'DATA' && (
                    <section className="bg-white/5 rounded-xl border border-white/10 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Informações Pessoais</h2>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">edit</span> Editar
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                     <button onClick={() => setIsEditing(false)} className="text-white/60 text-sm font-bold hover:underline px-3">Cancelar</button>
                                     <button onClick={handleSaveData} className="text-background-dark bg-primary px-4 py-1.5 rounded text-sm font-bold">Salvar</button>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Nome Completo</label>
                                <input disabled={!isEditing} type="text" value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:border-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">E-mail</label>
                                <input disabled={!isEditing} type="email" value={user.email} onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:border-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Telefone</label>
                                <input disabled={!isEditing} type="tel" value={user.phone} onChange={e => setUser({...user, phone: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:border-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">CPF</label>
                                <input disabled={!isEditing} type="text" value={user.cpf} onChange={e => setUser({...user, cpf: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:border-primary outline-none" />
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'ORDERS' && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Histórico de Pedidos</h2>
                        <div className="space-y-4">
                            {orders.map((order, idx) => (
                                <div key={idx} className="bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col md:flex-row gap-6 justify-between items-center hover:bg-white/10 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-lg">
                                            <span className="material-symbols-outlined text-primary">inventory_2</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{order.id}</h3>
                                            <p className="text-white/60 text-sm">{order.date}</p>
                                            <p className="text-white/80 text-sm mt-1">
                                                {Array.isArray(order.items) ? (typeof order.items[0] === 'string' ? order.items.join(', ') : `${order.items.length} itens`) : order.items}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2 w-full md:w-auto">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            order.status === 'Entregue' ? 'bg-green-500/20 text-green-500' : 
                                            order.status === 'Cancelado' ? 'bg-red-500/20 text-red-500' : 
                                            'bg-yellow-500/20 text-yellow-500'
                                        }`}>
                                            {order.status}
                                        </span>
                                        <p className="font-black text-lg">R$ {order.total.toFixed(2)}</p>
                                        <button className="text-primary text-xs font-bold hover:underline">Ver Detalhes</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === 'ADDRESSES' && (
                    <section className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Meus Endereços</h2>
                            <button onClick={() => setIsAddingAddress(true)} className="bg-primary text-background-dark px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90">
                                <span className="material-symbols-outlined text-sm">add</span> Adicionar Novo
                            </button>
                        </div>
                        
                        {isAddingAddress && (
                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl animate-fade-in">
                                <h3 className="font-bold mb-4">Novo Endereço</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input placeholder="Nome (ex: Casa)" className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" value={newAddress.name || ''} onChange={e => setNewAddress({...newAddress, name: e.target.value})} />
                                    <input placeholder="CEP" className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" value={newAddress.zip || ''} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} />
                                    <input placeholder="Endereço" className="md:col-span-2 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" value={newAddress.street || ''} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                                    <input placeholder="Bairro" className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" value={newAddress.district || ''} onChange={e => setNewAddress({...newAddress, district: e.target.value})} />
                                    <input placeholder="Cidade/UF" className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" value={newAddress.city || ''} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setIsAddingAddress(false)} className="text-white/60 font-bold text-sm px-4">Cancelar</button>
                                    <button onClick={handleAddAddress} className="text-primary font-bold text-sm px-4">Salvar</button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user.addresses.map(addr => (
                                <div key={addr.id} className={`p-6 rounded-xl border relative group ${addr.isDefault ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5'}`}>
                                    {addr.isDefault && <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">Principal</span>}
                                    <h3 className="font-bold text-lg mb-2">{addr.name}</h3>
                                    <p className="text-white/60 text-sm">{addr.street}</p>
                                    <p className="text-white/60 text-sm">{addr.district} - {addr.city}</p>
                                    <p className="text-white/60 text-sm">{addr.zip}</p>
                                    
                                    <div className="flex gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-white hover:text-primary text-xs font-bold uppercase">Editar</button>
                                        {!addr.isDefault && (
                                            <>
                                                <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-white hover:text-primary text-xs font-bold uppercase">Definir Principal</button>
                                                <button onClick={() => handleRemoveAddress(addr.id)} className="text-red-500 hover:text-red-400 text-xs font-bold uppercase">Excluir</button>
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
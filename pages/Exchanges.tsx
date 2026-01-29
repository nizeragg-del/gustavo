import React from 'react';

const Exchanges: React.FC = () => {
    return (
        <div className="max-w-[1440px] mx-auto px-6 py-20 animate-fade-in text-slate-900 font-sans">
            <div className="mb-20">
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-8">
                    Trocas e Devoluções
                </h1>
                <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">
                    Sua satisfação entra em campo primeiro. Se precisar de uma substituição ou devolução do seu manto, aqui estão as regras da partida.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
                <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] text-center shadow-xl shadow-slate-200/40 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                    <span className="material-symbols-outlined text-5xl text-primary mb-6 font-black block">calendar_month</span>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">7 Dias: Estorno</h3>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">Arrependimento de compra? Você tem até 7 dias após o recebimento para o apito final.</p>
                </div>
                <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] text-center shadow-xl shadow-slate-200/40 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                    <span className="material-symbols-outlined text-5xl text-primary mb-6 font-black block">sync_alt</span>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">30 Dias: Troca</h3>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">O tamanho não serviu? Solicite a substituição ou vale-compras em até 30 dias.</p>
                </div>
                <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] text-center shadow-xl shadow-slate-200/40 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                    <span className="material-symbols-outlined text-5xl text-primary mb-6 font-black block">gpp_bad</span>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">90 Dias: Defeito</h3>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">Falha no equipamento? Oferecemos garantia de 90 dias contra qualquer erro de fábrica.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
                <div className="space-y-12">
                    <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">O Caminho do Vestiário</h2>
                    <div className="space-y-6">
                        {[
                            { step: '01', title: 'Acesse o Painel', desc: 'Entre em "Meus Pedidos" na sua área de sócio.' },
                            { step: '02', title: 'Inicie a Jogada', desc: 'Selecione o pedido e clique em "Solicitar Troca".' },
                            { step: '03', title: 'Escolha a Tática', desc: 'Defina os itens e o motivo da substituição.' },
                            { step: '04', title: 'Logística Reversa', desc: 'Use o código de postagem gratuita nos Correios.' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 items-center bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                                <span className="text-4xl font-black text-primary/20 italic italic">{item.step}</span>
                                <div>
                                    <h4 className="font-black text-slate-900 uppercase italic tracking-tight">{item.title}</h4>
                                    <p className="text-slate-500 text-sm font-bold">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-12">
                    <section className="bg-primary/5 p-10 rounded-[3rem] border-2 border-primary/10 shadow-xl shadow-primary/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 size-64 bg-primary/10 rounded-full -mr-32 -mt-32"></div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-8 flex items-center gap-3 relative">
                            <span className="material-symbols-outlined text-primary font-black">warning</span>
                            Regramento do Jogo
                        </h2>
                        <ul className="space-y-6 relative">
                            {[
                                'O produto deve estar com a etiqueta original fixada.',
                                'Sem indícios de jogo: sem lavagem, suor ou odores.',
                                'Camisas personalizadas não podem ser trocadas (exceto defeito).'
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                                    <span className="size-2 rounded-full bg-primary shrink-0"></span>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-xl shadow-slate-200/50">
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-8">Processamento do Estorno</h2>
                        <div className="space-y-6">
                            <div className="flex gap-6 items-center">
                                <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100">
                                    <span className="material-symbols-outlined text-2xl font-black">credit_card</span>
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 uppercase italic text-sm">Cartão de Crédito</h4>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Estorno em até 2 faturas</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-center">
                                <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100">
                                    <span className="material-symbols-outlined text-2xl font-black">qr_code_2</span>
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 uppercase italic text-sm">PIX ou Boleto</h4>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Reembolso em até 5 dias úteis</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Exchanges;
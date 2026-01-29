import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="max-w-[1440px] mx-auto px-6 py-20 animate-fade-in text-slate-900 font-sans">
            <div className="bg-white border border-slate-100 rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 size-96 bg-primary/5 rounded-full -mr-48 -mt-48"></div>

                <header className="relative mb-16">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-8">
                        Política de Privacidade
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="h-1.5 w-12 bg-primary rounded-full"></div>
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] italic">
                            Última atualização: 25 de Outubro de 2024
                        </p>
                    </div>
                </header>

                <div className="space-y-12 text-slate-500 font-medium leading-relaxed relative xl:pr-60">
                    <p className="text-xl text-slate-600 font-bold border-l-4 border-primary pl-6">
                        A Arena Golaço valoriza a privacidade de seus usuários e se compromete a proteger seus dados pessoais. Esta Política descreve como coletamos, usamos e protegemos sua escalada em nosso sistema.
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
                            <span className="size-2 rounded-full bg-primary"></span>
                            1. Coleta de Informações
                        </h2>
                        <p>
                            Coletamos informações que você nos fornece diretamente, como quando cria uma conta, faz um pedido, assina nossa newsletter ou entra em contato conosco. No campo de dados, incluímos: nome, e-mail, de entrega, CPF e informações de tática financeira (pagamento).
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
                            <span className="size-2 rounded-full bg-primary"></span>
                            2. Uso das Informações
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                <ul className="space-y-3">
                                    {['Processar e entregar pedidos', 'Atualizar status da partida', 'Suporte ao cliente'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                <ul className="space-y-3">
                                    {['Marketing e promoções', 'Segurança do vestiário', 'Melhoria da experiência'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
                            <span className="size-2 rounded-full bg-primary"></span>
                            3. Compartilhamento de Dados
                        </h2>
                        <p>
                            Não vendemos ou alugamos seus dados pessoais. Compartilhamos informações apenas com parceiros táticos essenciais para a operação, como transportadoras e gateways de pagamento certificados.
                        </p>
                    </section>

                    <div className="grid md:grid-cols-2 gap-8 pt-12 border-t border-slate-100">
                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">4. Segurança Blindada</h2>
                            <p className="text-sm">
                                Adotamos medidas de segurança técnicas para proteger seus dados. Utilizamos criptografia SSL em 100% das páginas do site.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">5. Cookies de Campo</h2>
                            <p className="text-sm">
                                Utilizamos cookies para melhorar sua navegação e lembrar suas preferências. Você pode gerenciar os cookies no seu navegador.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
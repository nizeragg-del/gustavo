import React from 'react';

const Contact: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
    };

    return (
        <div className="max-w-[1440px] mx-auto px-6 py-20 animate-fade-in text-slate-900 font-sans">
            <div className="grid lg:grid-cols-2 gap-20">
                <div className="space-y-12">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-8">
                            Fale Conosco
                        </h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg">
                            Tem alguma dúvida, sugestão ou precisa de ajuda com um pedido? Preencha o formulário ou utilize nossos canais diretos.
                        </p>
                    </div>

                    <div className="grid gap-10">
                        <div className="flex items-start gap-6 group">
                            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl font-black">mail</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">E-mail Oficial</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 mb-2">Resposta em até 24h úteis</p>
                                <a href="mailto:suporte@arenagolaco.com.br" className="text-primary font-black text-lg hover:underline underline-offset-4 decoration-2">suporte@arenagolaco.com.br</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-6 group">
                            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl font-black">chat</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">WhatsApp Arena</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 mb-2">Seg a Sex, 09h às 18h</p>
                                <a href="#" className="text-primary font-black text-lg hover:underline underline-offset-4 decoration-2">(11) 99999-9999</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-6 group">
                            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl font-black">location_on</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Sede Administrativa</h3>
                                <p className="text-slate-500 font-medium mt-2">
                                    Av. Paulista, 1000 - Bela Vista<br />
                                    São Paulo - SP, 01310-100
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Social Proof/Trust */}
                    <div className="pt-12 border-t border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 italic">Siga nossa escalada</p>
                        <div className="flex gap-4">
                            {['Instagram', 'Twitter', 'Facebook'].map(social => (
                                <button key={social} className="px-6 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 font-black text-[10px] uppercase italic tracking-widest hover:border-primary hover:text-primary transition-all shadow-sm">
                                    {social}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>

                    <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-8 relative">Envie sua Escalada</h2>
                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Primeiro Nome</label>
                                <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic focus:border-primary outline-none shadow-inner" placeholder="Seu nome" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Sobrenome</label>
                                <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic focus:border-primary outline-none shadow-inner" placeholder="Seu sobrenome" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">E-mail de Contato</label>
                            <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic focus:border-primary outline-none shadow-inner" placeholder="seu@email.com" />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Assunto da Tática</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic focus:border-primary outline-none shadow-inner appearance-none cursor-pointer">
                                <option>Dúvida sobre produto</option>
                                <option>Status do pedido</option>
                                <option>Troca ou Devolução</option>
                                <option>Outros</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Mensagem para o Campo</label>
                            <textarea required rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black italic focus:border-primary outline-none resize-none shadow-inner" placeholder="Como podemos ajudar?"></textarea>
                        </div>

                        <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-black py-6 rounded-2xl uppercase tracking-[0.2em] italic shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4">
                            Enviar Mensagem
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
import React from 'react';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-fade-in text-white">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Fale Conosco</h1>
            <p className="text-white/60 text-lg mb-12">
                Tem alguma dúvida, sugestão ou precisa de ajuda com um pedido? Preencha o formulário ou utilize nossos canais diretos.
            </p>

            <div className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                        <span className="material-symbols-outlined text-2xl">mail</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white">E-mail</h3>
                        <p className="text-white/60 mb-1">Resposta em até 24h úteis</p>
                        <a href="mailto:suporte@arenagolaco.com.br" className="text-primary font-bold hover:underline">suporte@arenagolaco.com.br</a>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                        <span className="material-symbols-outlined text-2xl">chat</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white">WhatsApp</h3>
                        <p className="text-white/60 mb-1">Seg a Sex, 09h às 18h</p>
                        <a href="#" className="text-primary font-bold hover:underline">(11) 99999-9999</a>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                        <span className="material-symbols-outlined text-2xl">location_on</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white">Escritório</h3>
                        <p className="text-white/60">
                            Av. Paulista, 1000 - Bela Vista<br/>
                            São Paulo - SP, 01310-100
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Social Proof/Trust */}
            <div className="mt-12 pt-12 border-t border-white/10">
                 <p className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Siga-nos</p>
                 <div className="flex gap-4">
                    <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:text-primary transition-all flex items-center justify-center">
                        <span className="font-bold">IG</span>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:text-primary transition-all flex items-center justify-center">
                        <span className="font-bold">TW</span>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:text-primary transition-all flex items-center justify-center">
                        <span className="font-bold">FB</span>
                    </button>
                 </div>
            </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-fit">
            <h2 className="text-2xl font-bold mb-6">Envie uma mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-white/60">Nome</label>
                        <input required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" placeholder="Seu nome" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-white/60">Sobrenome</label>
                        <input required className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" placeholder="Seu sobrenome" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/60">E-mail</label>
                    <input required type="email" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" placeholder="seu@email.com" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/60">Assunto</label>
                    <select className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none">
                        <option>Dúvida sobre produto</option>
                        <option>Status do pedido</option>
                        <option>Troca ou Devolução</option>
                        <option>Outros</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/60">Mensagem</label>
                    <textarea required rows={5} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none resize-none" placeholder="Como podemos ajudar?"></textarea>
                </div>

                <button type="submit" className="w-full bg-primary text-background-dark font-black py-4 rounded-lg uppercase tracking-wider hover:opacity-90 transition-opacity mt-4">
                    Enviar Mensagem
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
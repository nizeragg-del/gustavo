import React from 'react';

const HelpCenter: React.FC = () => {
  const faqs = [
    {
      category: "Pedidos e Entrega",
      questions: [
        { q: "Qual o prazo de entrega?", a: "O prazo varia de acordo com sua região, mas geralmente entregamos entre 3 a 7 dias úteis para capitais e 5 a 10 dias úteis para o interior." },
        { q: "Como rastrear meu pedido?", a: "Você pode rastrear seu pedido acessando 'Meus Pedidos' no menu do perfil ou clicando no link 'Rastrear Entrega' no rodapé do site." },
        { q: "Enviam para todo o Brasil?", a: "Sim, enviamos para todo o território nacional via transportadoras parceiras e Correios." }
      ]
    },
    {
      category: "Produtos e Qualidade",
      questions: [
        { q: "As camisas são originais?", a: "Trabalhamos apenas com produtos oficiais e licenciados, ou réplicas premium autenticadas (Player Version) quando especificado na descrição." },
        { q: "Qual a diferença entre modelo Torcedor e Jogador?", a: "O modelo Jogador possui tecido mais tecnológico, corte mais ajustado ao corpo e detalhes termocolantes para leveza. O modelo Torcedor tem corte mais solto e detalhes bordados." }
      ]
    },
    {
      category: "Pagamentos",
      questions: [
        { q: "Quais as formas de pagamento?", a: "Aceitamos cartão de crédito em até 10x sem juros, PIX com 5% de desconto e boleto bancário." },
        { q: "É seguro comprar no site?", a: "Sim, utilizamos criptografia SSL de ponta a ponta e gateway de pagamento certificado para garantir a segurança dos seus dados." }
      ]
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-20 animate-fade-in text-slate-900 font-sans">
      <div className="text-center mb-20 space-y-8">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
          Central de Ajuda
        </h1>
        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl mx-auto">
          Precisa de uma assistência tática? Encontre as respostas para as dúvidas mais comuns do campo.
        </p>
        <div className="max-w-2xl mx-auto relative mt-12">
          <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black">search</span>
          <input
            type="text"
            placeholder="Busque por dúvidas (ex: entrega, troca, tamanho)"
            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-6 pl-16 pr-8 text-slate-900 font-black italic focus:border-primary outline-none transition-all shadow-xl shadow-slate-200/50 placeholder:text-slate-300"
          />
        </div>
      </div>

      <div className="space-y-16 max-w-4xl mx-auto">
        {faqs.map((section, idx) => (
          <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
            <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-8 flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 shadow-inner">
                <span className="material-symbols-outlined font-black">
                  {section.category === "Pedidos e Entrega" ? "local_shipping" :
                    section.category === "Produtos e Qualidade" ? "verified" : "payments"}
                </span>
              </div>
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.questions.map((item, qIdx) => (
                <details key={qIdx} className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-slate-300 shadow-lg shadow-slate-200/30 open:shadow-2xl open:shadow-primary/5 open:border-primary/20">
                  <summary className="flex items-center justify-between p-8 cursor-pointer font-black text-lg text-slate-900 uppercase italic tracking-tight select-none hover:text-primary transition-colors">
                    <span className="flex-1 pr-6">{item.q}</span>
                    <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-open:bg-primary group-open:text-white transition-all duration-500 shadow-inner">
                      <span className="material-symbols-outlined transition-transform duration-500 group-open:rotate-180">expand_more</span>
                    </div>
                  </summary>
                  <div className="px-8 pb-8 text-slate-500 font-medium leading-relaxed animate-slide-down">
                    <div className="pt-6 border-t border-slate-50">
                      {item.a}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 p-12 bg-white border border-slate-100 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative">
          <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Ainda na dúvida?</h3>
          <p className="text-slate-500 text-lg font-medium">Nossa equipe de suporte está pronta para te atender.</p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white font-black px-12 py-5 rounded-[2rem] uppercase tracking-[0.2em] italic shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 relative">
          Falar com Atendente
        </button>
      </div>
    </div>
  );
};

export default HelpCenter;
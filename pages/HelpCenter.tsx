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
    <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-in text-white">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Central de Ajuda</h1>
        <p className="text-white/60 text-lg">Como podemos te ajudar hoje?</p>
        <div className="max-w-xl mx-auto relative mt-8">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">search</span>
            <input 
                type="text" 
                placeholder="Busque por dúvidas (ex: entrega, troca, tamanho)" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary outline-none transition-colors"
            />
        </div>
      </div>

      <div className="space-y-12">
        {faqs.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">
                    {section.category === "Pedidos e Entrega" ? "local_shipping" : 
                     section.category === "Produtos e Qualidade" ? "verified" : "payments"}
                </span>
                {section.category}
            </h2>
            <div className="space-y-4">
              {section.questions.map((item, qIdx) => (
                <details key={qIdx} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 open:bg-white/10 open:border-white/20">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg select-none hover:text-primary transition-colors">
                    {item.q}
                    <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-white/70 leading-relaxed border-t border-white/5 pt-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 bg-primary/10 border border-primary/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
            <h3 className="text-xl font-bold text-white">Ainda tem dúvidas?</h3>
            <p className="text-white/60">Nossa equipe de suporte está pronta para te atender.</p>
        </div>
        <button className="bg-primary text-background-dark font-black px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Falar com Atendente
        </button>
      </div>
    </div>
  );
};

export default HelpCenter;
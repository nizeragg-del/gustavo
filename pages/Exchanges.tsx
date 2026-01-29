import React from 'react';

const Exchanges: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-in text-white">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Trocas e Devoluções</h1>
        <p className="text-white/60 text-lg leading-relaxed">
            Queremos que você tenha a melhor experiência com seu manto sagrado. Se precisar trocar ou devolver, explicamos tudo aqui de forma transparente.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-4">calendar_month</span>
            <h3 className="font-bold text-lg mb-2">7 Dias para Devolução</h3>
            <p className="text-sm text-white/60">Arrependimento de compra? Você tem até 7 dias corridos após o recebimento para devolver sem custo.</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-4">sync_alt</span>
            <h3 className="font-bold text-lg mb-2">30 Dias para Troca</h3>
            <p className="text-sm text-white/60">O tamanho não serviu? Solicite a troca por outro tamanho ou vale-compras em até 30 dias.</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-4">gpp_bad</span>
            <h3 className="font-bold text-lg mb-2">Garantia de Defeito</h3>
            <p className="text-sm text-white/60">Caso o produto apresente defeito de fabricação, oferecemos garantia de 90 dias para troca.</p>
        </div>
      </div>

      <div className="space-y-12">
        <section>
            <h2 className="text-2xl font-bold mb-4">Como solicitar uma troca ou devolução?</h2>
            <ol className="list-decimal list-inside space-y-4 text-white/80 marker:text-primary marker:font-bold">
                <li className="pl-2">Acesse sua conta e vá em <strong>"Meus Pedidos"</strong>.</li>
                <li className="pl-2">Selecione o pedido que deseja trocar e clique em <strong>"Solicitar Troca/Devolução"</strong>.</li>
                <li className="pl-2">Escolha os itens e o motivo da solicitação.</li>
                <li className="pl-2">Você receberá um código de postagem reverso dos Correios por e-mail.</li>
                <li className="pl-2">Embale o produto (pode ser na mesma embalagem recebida) e leve a uma agência dos Correios com o código.</li>
            </ol>
        </section>

        <section className="bg-white/5 p-8 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gold">
                <span className="material-symbols-outlined">warning</span> Condições Importantes
            </h2>
            <ul className="space-y-2 text-white/70">
                <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-xs mt-1 text-white/40">circle</span>
                    O produto deve estar com a etiqueta original fixada.
                </li>
                <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-xs mt-1 text-white/40">circle</span>
                    Não pode haver indícios de uso, lavagem ou odores.
                </li>
                <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-xs mt-1 text-white/40">circle</span>
                    Camisas personalizadas (com nome e número) não podem ser trocadas ou devolvidas, exceto por defeito de fabricação.
                </li>
            </ul>
        </section>

        <section>
            <h2 className="text-2xl font-bold mb-4">Reembolso</h2>
            <p className="text-white/70 mb-4">
                O reembolso será processado após o recebimento e análise do produto em nosso centro de distribuição (até 3 dias úteis).
            </p>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <strong className="block text-white mb-1">Cartão de Crédito</strong>
                    <span className="text-sm text-white/60">Estorno em até 2 faturas subsequentes.</span>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <strong className="block text-white mb-1">PIX ou Boleto</strong>
                    <span className="text-sm text-white/60">Reembolso em conta corrente em até 5 dias úteis.</span>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default Exchanges;
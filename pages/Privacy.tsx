import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-in text-white">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Política de Privacidade</h1>
      
      <div className="space-y-8 text-white/70 leading-relaxed text-justify">
        <p className="text-lg text-white font-medium">
            Última atualização: 25 de Outubro de 2024
        </p>
        
        <p>
            A <strong>Arena Golaço</strong> valoriza a privacidade de seus usuários e se compromete a proteger seus dados pessoais. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e compartilhamos suas informações ao utilizar nosso site.
        </p>

        <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Coleta de Informações</h2>
            <p>
                Coletamos informações que você nos fornece diretamente, como quando cria uma conta, faz um pedido, assina nossa newsletter ou entra em contato conosco. As informações podem incluir: nome, endereço de e-mail, endereço de entrega, número de telefone, CPF e dados de pagamento.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Uso das Informações</h2>
            <p>Utilizamos suas informações para:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Processar e entregar seus pedidos;</li>
                <li>Enviar atualizações sobre o status do pedido;</li>
                <li>Responder a suas dúvidas e solicitações;</li>
                <li>Enviar comunicações de marketing (caso tenha optado por receber);</li>
                <li>Melhorar a segurança e funcionamento do site.</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Compartilhamento de Dados</h2>
            <p>
                Não vendemos ou alugamos seus dados pessoais. Compartilhamos informações apenas com parceiros essenciais para a operação, como:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Transportadoras (para entrega dos produtos);</li>
                <li>Gateways de pagamento (para processamento seguro das transações);</li>
                <li>Plataformas de e-mail marketing (se inscrito).</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Segurança</h2>
            <p>
                Adotamos medidas de segurança técnicas e administrativas para proteger seus dados contra acesso não autorizado, perda ou alteração. Utilizamos criptografia SSL (Secure Socket Layer) em todas as páginas do site.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Cookies</h2>
            <p>
                Utilizamos cookies para melhorar sua experiência de navegação, lembrar suas preferências e analisar o tráfego do site. Você pode gerenciar as preferências de cookies nas configurações do seu navegador.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Seus Direitos</h2>
            <p>
                De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a solicitar o acesso, correção ou exclusão de seus dados pessoais a qualquer momento. Para exercer esses direitos, entre em contato através do nosso canal de Fale Conosco.
            </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
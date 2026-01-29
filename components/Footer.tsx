import React from 'react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  
  const handleNotImplemented = () => {
    alert("Funcionalidade em desenvolvimento neste protótipo.");
  };

  const handleNav = (page: Page) => {
      window.scrollTo(0, 0);
      onNavigate(page);
  };

  return (
    <footer className="px-4 md:px-10 lg:px-40 py-16 bg-background-dark border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="flex flex-col gap-6">
          <button onClick={() => handleNav('HOME')} className="flex items-center gap-2 text-primary w-fit hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-3xl">sports_soccer</span>
            <h2 className="text-white text-xl font-black uppercase">Arena Golaço</h2>
          </button>
          <p className="text-white/40 text-sm leading-relaxed">
            Sua loja premium de mantos sagrados. Onde a paixão pelo futebol encontra a qualidade de elite.
          </p>
          <div className="flex gap-4">
            <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:text-primary transition-colors hover:bg-white/10"><span className="material-symbols-outlined">language</span></button>
            <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:text-primary transition-colors hover:bg-white/10"><span className="material-symbols-outlined">camera_alt</span></button>
            <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:text-primary transition-colors hover:bg-white/10"><span className="material-symbols-outlined">public</span></button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm">Links Úteis</h4>
          <nav className="flex flex-col gap-2 items-start">
            <button onClick={() => handleNav('PROFILE')} className="text-white/40 hover:text-white transition-colors text-sm text-left">Minha Conta</button>
            <button onClick={() => handleNav('ORDERS')} className="text-white/40 hover:text-white transition-colors text-sm text-left">Meus Pedidos</button>
            <button onClick={() => handleNav('ORDERS')} className="text-white/40 hover:text-white transition-colors text-sm text-left">Rastrear Entrega</button>
            <button onClick={handleNotImplemented} className="text-white/40 hover:text-white transition-colors text-sm text-left">Tabela de Medidas</button>
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm">Suporte</h4>
          <nav className="flex flex-col gap-2 items-start">
            <button onClick={() => handleNav('HELP')} className="text-white/40 hover:text-white transition-colors text-sm text-left">Central de Ajuda</button>
            <button onClick={() => handleNav('EXCHANGES')} className="text-white/40 hover:text-white transition-colors text-sm text-left">Trocas e Devoluções</button>
            <button onClick={() => handleNav('CONTACT')} className="text-white/40 hover:text-white transition-colors text-sm text-left">Fale Conosco</button>
            <button onClick={() => handleNav('PRIVACY')} className="text-white/40 hover:text-white transition-colors text-sm text-left">Privacidade</button>
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm">Pagamento</h4>
          <div className="grid grid-cols-4 gap-2">
            <div className="h-8 bg-white/5 rounded border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-xs">payments</span></div>
            <div className="h-8 bg-white/5 rounded border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-xs">credit_card</span></div>
            <div className="h-8 bg-white/5 rounded border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-xs">account_balance_wallet</span></div>
            <div className="h-8 bg-white/5 rounded border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-xs">qr_code_2</span></div>
          </div>
          <p className="text-[10px] text-white/20 mt-4">© 2024 Arena Golaço. Todos os direitos reservados. CNPJ: 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
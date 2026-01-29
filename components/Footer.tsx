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
    <footer className="px-6 md:px-10 lg:px-40 py-20 bg-slate-50 border-t border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="flex flex-col gap-8">
          <button onClick={() => handleNav('HOME')} className="flex items-center gap-2 group w-fit">
            <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">sports_soccer</span>
            <h2 className="text-slate-900 text-2xl font-black uppercase italic tracking-tighter">Arena Golaço</h2>
          </button>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Sua loja premium de mantos sagrados. Onde a paixão pelo futebol encontra a qualidade de elite e o design de alta performance.
          </p>
          <div className="flex gap-4">
            <button className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-all hover:border-primary hover:shadow-lg shadow-sm">
              <span className="material-symbols-outlined text-2xl">language</span>
            </button>
            <button className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-all hover:border-primary hover:shadow-lg shadow-sm">
              <span className="material-symbols-outlined text-2xl">camera_alt</span>
            </button>
            <button className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-all hover:border-primary hover:shadow-lg shadow-sm">
              <span className="material-symbols-outlined text-2xl">public</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-slate-900 font-black uppercase tracking-tighter text-sm italic">Navegação</h4>
          <nav className="flex flex-col gap-3 items-start">
            <button onClick={() => handleNav('PROFILE')} className="text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-tight">Minha Conta</button>
            <button onClick={() => handleNav('ORDERS')} className="text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-tight">Meus Pedidos</button>
            <button onClick={() => handleNav('ORDERS')} className="text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-tight">Rastrear Entrega</button>
            <button onClick={handleNotImplemented} className="text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-tight">Tabela de Medidas</button>
          </nav>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-slate-900 font-black uppercase tracking-tighter text-sm italic">Suporte</h4>
          <nav className="flex flex-col gap-3 items-start">
            <button onClick={() => handleNav('HELP')} className="text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-tight">Central de Ajuda</button>
            <button onClick={() => handleNav('EXCHANGES')} className="text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-tight">Trocas e Devoluções</button>
            <button onClick={() => handleNav('CONTACT')} className="text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-tight">Fale Conosco</button>
            <button onClick={() => handleNav('PRIVACY')} className="text-slate-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-tight">Privacidade</button>
          </nav>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-slate-900 font-black uppercase tracking-tighter text-sm italic">Pagamento Seguro</h4>
          <div className="grid grid-cols-4 gap-3">
            <div className="aspect-square bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors shadow-sm">
              <span className="material-symbols-outlined text-2xl">payments</span>
            </div>
            <div className="aspect-square bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors shadow-sm">
              <span className="material-symbols-outlined text-2xl">credit_card</span>
            </div>
            <div className="aspect-square bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors shadow-sm">
              <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
            </div>
            <div className="aspect-square bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors shadow-sm">
              <span className="material-symbols-outlined text-2xl">qr_code_2</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose italic">
              © 2024 Arena Golaço. <br />
              Todos os direitos reservados. <br />
              CNPJ: 00.000.000/0001-00
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigate: (page: any) => void;
}

const Home: React.FC<HomeProps> = ({ products, onProductClick, onAddToCart, onNavigate }) => {
  // Use the products passed from App.tsx instead of static constant
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="px-4 md:px-10 lg:px-40 py-6">
        <div className="@container">
          <div 
            className="flex min-h-[560px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-start justify-center px-6 md:px-16 border border-white/10"
            style={{ 
                backgroundImage: 'linear-gradient(90deg, rgba(16, 34, 23, 0.9) 0%, rgba(16, 34, 23, 0.2) 60%, rgba(16, 34, 23, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCy7WJvWCxKaCiKZUnuTZW763X24csIe0Be1_bgb6_W3JCbLHId2G8voPerucom9sW5HKD6kb1WrUlrcQDCEhsQ7nWpyVc8FcGxI_vQRSKoHVEQtJtkfjKN5V7xBkC8WQd9NwQ_uMRxvNPMJWsiDsmy8sBwWXfdxRCNE3TD4U2WvFR93TW0FJaQ4XBXPzpEZVWMQaV5WamAfV0zsfM9rvfHm-nnfuZMj6J9qiSZu7MeeWCpYtJSQhxOWFYApOp8bCmNMu2KWluUvw")' 
            }}
          >
            <div className="flex flex-col gap-4 max-w-xl">
              <span className="text-primary font-bold tracking-widest text-sm uppercase">Nova Temporada 24/25</span>
              <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-tighter">
                VISTA A SUA <br/><span className="text-primary">PAIXÃO</span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed">
                As camisas mais icônicas do futebol mundial, com qualidade premium, tecido tecnológico e envio imediato para todo o Brasil.
              </p>
              <div className="flex gap-4 mt-4">
                <button onClick={() => onNavigate('CATEGORIES')} className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-primary text-background-dark text-base font-extrabold hover:scale-105 transition-transform uppercase tracking-wider">
                  Ver Coleção
                </button>
                <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 border-2 border-white/20 text-white text-base font-bold hover:bg-white/10 transition-colors uppercase tracking-wider">
                  Promoções
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="px-4 md:px-10 lg:px-40 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(43,238,121,0.1)]">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-xl bg-background-dark border border-white/10 flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-background-dark group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(43,238,121,0.4)] shadow-inner">
                        <span className="material-symbols-outlined text-3xl">bolt</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">Entrega Veloz</h3>
                        <p className="text-white/50 text-sm mt-1 group-hover:text-white/80 transition-colors">Receba em tempo recorde.</p>
                    </div>
                </div>
            </div>

            {/* Card 2 */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(43,238,121,0.1)]">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-xl bg-background-dark border border-white/10 flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-background-dark group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(43,238,121,0.4)] shadow-inner">
                        <span className="material-symbols-outlined text-3xl">verified</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">Qualidade Elite</h3>
                        <p className="text-white/50 text-sm mt-1 group-hover:text-white/80 transition-colors">Tecido tecnológico oficial.</p>
                    </div>
                </div>
            </div>

            {/* Card 3 */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(43,238,121,0.1)]">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-xl bg-background-dark border border-white/10 flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-background-dark group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(43,238,121,0.4)] shadow-inner">
                        <span className="material-symbols-outlined text-3xl">lock</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">Compra Blindada</h3>
                        <p className="text-white/50 text-sm mt-1 group-hover:text-white/80 transition-colors">Segurança total nos dados.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Lançamentos */}
      <section className="px-4 md:px-10 lg:px-40 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-white text-3xl font-bold tracking-tight">Lançamentos</h2>
            <p className="text-white/40">As novidades mais quentes dos gramados</p>
          </div>
          <button onClick={() => onNavigate('CATEGORIES')} className="text-primary font-semibold flex items-center gap-2 hover:underline">
            Ver todos <span className="material-symbols-outlined">trending_flat</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => onProductClick(product)}
                onAddToCart={() => onAddToCart(product)}
            />
          ))}
        </div>
      </section>

      {/* Featured Banner */}
      <section className="px-4 md:px-10 lg:px-40 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-[#193324] p-8 md:p-16">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at center, #2bee79 0%, transparent 70%)'}}></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                    <span className="text-gold font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined">star</span> EDIÇÃO ESPECIAL
                    </span>
                    <h2 className="text-white text-4xl md:text-5xl font-black leading-tight uppercase">
                        Hala Madrid: <br/>O Legado Continua
                    </h2>
                    <p className="text-white/70 text-lg">
                        A nova armadura dos Merengues chegou para dominar a Europa. Sinta a grandeza do maior clube do mundo com acabamento em ouro e tecnologia Heat.Dry.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => onNavigate('PRODUCT')} className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary text-background-dark font-bold hover:scale-105 transition-transform">
                            Explorar Coleção
                        </button>
                        <button className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 border border-white/20 text-white font-bold hover:bg-white/10">
                            Ver História
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                    <div className="aspect-square bg-white/10 rounded-xl overflow-hidden">
                        <img alt="Detail 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgagiebZvvsGuHlqepd9ruT65eMDJ9XF4kmA-lnh918KdQialkpfRASrft_7Nm0-lLSggnnOii_LSh4oHU9Cmv-5nOW1-n5nw5PsFV5hrfH1uul59FUr8uHJvoOCn0RCZi0t4tKE-DmiL61z7PoQhoAruzu1rizh04E05eTyg3jT7mrZRmVX1Bs9TyjNdI1snPV-IMfVBgvNt8STfUGG8SkGKLOgLZq-va1QxYVAgNBUnURX5uDu3DHyMkbr0_R1Qd04CMMihf8w"/>
                    </div>
                    <div className="aspect-square bg-white/10 rounded-xl overflow-hidden mt-8">
                        <img alt="Detail 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLUwLkiWEfhm7A_2l-nVsaS63u7_UMXBiNbxDcDQM_NbZjzUkMctXellWrSQ2c5nr3wmpNiv1ZBJNyWhX3v30tCgfve9N8-12X1RtBGquHSOm2R_sh7cFo43Ml8S5rRbPo8hWni08q9tw207-_vRFTrEK6AMYCLanuMJZekNXbbkhXonO1VfYlkXndiN36yWpp8ZLtkGjjo5P1ONjm6ShN97yPjPRZNf4ISjEalDf4LqYy0MyQO08kUlc6MJTK5UFArRpv423YIA"/>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 md:px-10 lg:px-40 py-20 bg-primary/5 border-y border-white/5">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-8">
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic">Faça parte do time</h2>
            <p className="text-white/60 text-lg">Inscreva-se para receber avisos de lançamentos exclusivos, promoções relâmpago e conteúdos de futebol.</p>
            <form className="flex flex-col md:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                <input className="flex-1 bg-white/5 border border-white/10 rounded-lg h-14 px-6 focus:ring-primary focus:border-primary text-white outline-none" placeholder="Seu melhor e-mail" type="email"/>
                <button className="bg-primary text-background-dark font-black h-14 px-10 rounded-lg uppercase tracking-widest hover:bg-primary/90 transition-all">Assinar</button>
            </form>
            <p className="text-xs text-white/30 italic">Ao assinar, você concorda com nossos termos e política de privacidade.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
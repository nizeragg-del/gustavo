import React from 'react';
import { Product, Banner } from '../types';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  products: Product[];
  banners: Banner[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigate: (page: any) => void;
}

const Home: React.FC<HomeProps> = ({ products, banners, onProductClick, onAddToCart, onNavigate }) => {
  const [currentBanner, setCurrentBanner] = React.useState(0);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  // Auto-play logic
  React.useEffect(() => {
    if (banners.length <= 1) return;

    const duration = banners[currentBanner]?.display_duration || 5000;
    const timer = setTimeout(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentBanner, banners]);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % (banners.length || 1));
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + (banners.length || 1)) % (banners.length || 1));
  };

  // Drag handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextBanner();
    if (isRightSwipe) prevBanner();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) setTouchEnd(e.clientX);
  };

  const onMouseUp = () => {
    if (isDragging) {
      if (touchStart && touchEnd) {
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) nextBanner();
        else if (distance < -minSwipeDistance) prevBanner();
      }
      setIsDragging(false);
      setTouchStart(null);
      setTouchEnd(null);
    }
  };

  // Use the products passed from App.tsx instead of static constant
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="animate-fade-in overflow-x-hidden">
      {/* Hero Section - Edge to Edge */}
      <section
        className="relative h-[600px] w-full overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Banner Container */}
        <div className="relative h-full w-full">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out bg-cover bg-center flex flex-col items-start justify-center px-6 md:px-16 lg:px-40 ${index === currentBanner ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'}`}
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(16, 34, 23, 0.95) 0%, rgba(16, 34, 23, 0.4) 50%, rgba(16, 34, 23, 0) 100%), url("${banner.image_url}")`
              }}
            >
              <div className="flex flex-col gap-6 max-w-2xl select-none">
                <span className="text-primary font-bold tracking-widest text-sm uppercase animate-slide-up">{banner.tag}</span>
                <h1 className="text-white text-5xl md:text-8xl font-black leading-tight tracking-tighter uppercase italic animate-slide-up" style={{ animationDelay: '100ms' }}>
                  {banner.title.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line} {i < banner.title.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h1>
                <p className="text-white/80 text-lg md:text-xl font-medium max-w-lg leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
                  {banner.subtitle}
                </p>
                <div className="flex gap-4 mt-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(banner.button_primary_link || 'CATEGORIES');
                    }}
                    className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-background-dark text-base font-black hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_-10px_rgba(43,238,121,0.5)] uppercase tracking-tighter"
                  >
                    {banner.button_primary_text}
                  </button>
                  {banner.button_secondary_text && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (banner.button_secondary_link) onNavigate(banner.button_secondary_link);
                      }}
                      className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 border-2 border-white/20 text-white text-base font-bold hover:bg-white/10 transition-all uppercase tracking-tighter"
                    >
                      {banner.button_secondary_text}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators - Centered */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentBanner(i);
              }}
              className={`h-1.5 transition-all duration-300 rounded-full ${i === currentBanner ? 'w-12 bg-primary' : 'w-4 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="px-4 md:px-10 lg:px-40 py-16 bg-surface">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group relative p-8 rounded-2xl bg-white border border-slate-100 transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-xl shadow-sm">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white shadow-inner">
                <span className="material-symbols-outlined text-4xl">bolt</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight">Entrega Veloz</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">Logística de ponta para você receber seu manto em tempo recorde.</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative p-8 rounded-2xl bg-white border border-slate-100 transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-xl shadow-sm">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white shadow-inner">
                <span className="material-symbols-outlined text-4xl">verified</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight">Qualidade Elite</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">Tecido tecnológico oficial com acabamento premium de torcedor.</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative p-8 rounded-2xl bg-white border border-slate-100 transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-xl shadow-sm">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white shadow-inner">
                <span className="material-symbols-outlined text-4xl">lock</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight">Compra Blindada</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">Segurança total e criptografia de ponta a ponta nos seus dados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lançamentos */}
      <section className="px-4 md:px-10 lg:px-40 py-20 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-slate-900 text-4xl font-black tracking-tight uppercase italic">Lançamentos</h2>
            <div className="h-1 w-20 bg-primary mt-2 mx-auto md:mx-0"></div>
            <p className="text-slate-500 mt-4 font-medium">As novidades mais quentes que acabaram de chegar</p>
          </div>
          <button onClick={() => onNavigate('CATEGORIES')} className="bg-slate-900 text-white rounded-full px-8 py-3 font-bold flex items-center gap-2 hover:bg-primary transition-all shadow-lg text-sm uppercase tracking-tighter">
            Ver catálogo completo <span className="material-symbols-outlined">trending_flat</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14">
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
      <section className="px-4 md:px-10 lg:px-40 py-16 bg-surface">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 md:p-20 shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #10b981 0%, transparent 70%)' }}></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 flex flex-col gap-8">
              <span className="text-primary font-black flex items-center gap-3 tracking-widest text-xs">
                <span className="h-px w-8 bg-primary"></span> EDIÇÃO ESPECIAL
              </span>
              <h2 className="text-white text-5xl md:text-7xl font-black leading-[0.9] uppercase italic tracking-tighter">
                Hala Madrid: <br />O Legado Continua
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
                Sinta a grandeza do maior clube do mundo com acabamento em ouro e tecnologia Heat.Dry elite.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <button onClick={() => onNavigate('PRODUCT')} className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-white font-black hover:scale-105 transition-all shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] uppercase italic tracking-tight">
                  Explorar Coleção
                </button>
                <button className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 border-2 border-slate-700 text-white font-black hover:bg-slate-800 transition-all uppercase italic tracking-tight">
                  Ver História
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-6">
              <div className="aspect-[4/5] bg-white/5 rounded-3xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-all duration-700 border border-white/10">
                <img alt="Detail 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgagiebZvvsGuHlqepd9ruT65eMDJ9XF4kmA-lnh918KdQialkpfRASrft_7Nm0-lLSggnnOii_LSh4oHU9Cmv-5nOW1-n5nw5PsFV5hrfH1uul59FUr8uHJvoOCn0RCZi0t4tKE-DmiL61z7PoQhoAruzu1rizh04E05eTyg3jT7mrZRmVX1Bs9TyjNdI1snPV-IMfVBgvNt8STfUGG8SkGKLOgLZq-va1QxYVAgNBUnURX5uDu3DHyMkbr0_R1Qd04CMMihf8w" />
              </div>
              <div className="aspect-[4/5] bg-white/5 rounded-3xl overflow-hidden mt-12 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-700 border border-white/10">
                <img alt="Detail 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLUwLkiWEfhm7A_2l-nVsaS63u7_UMXBiNbxDcDQM_NbZjzUkMctXellWrSQ2c5nr3wmpNiv1ZBJNyWhX3v30tCgfve9N8-12X1RtBGquHSOm2R_sh7cFo43Ml8S5rRbPo8hWni08q9tw207-_vRFTrEK6AMYCLanuMJZekNXbbkhXonO1VfYlkXndiN36yWpp8ZLtkGjjo5P1ONjm6ShN97yPjPRZNf4ISjEalDf4LqYy0MyQO08kUlc6MJTK5UFArRpv423YIA" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 md:px-10 lg:px-40 py-24 bg-white border-y border-slate-100 overflow-hidden relative">
        <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="max-w-3xl mx-auto text-center flex flex-col gap-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">Faça parte do time</h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium">Inscreva-se para receber avisos de lançamentos exclusivos, promoções relâmpago e conteúdos de futebol.</p>
          <form className="flex flex-col md:flex-row gap-4 mt-4" onSubmit={(e) => e.preventDefault()}>
            <input className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl h-16 px-8 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 outline-none font-medium shadow-inner" placeholder="Seu melhor e-mail" type="email" />
            <button className="bg-slate-900 text-white font-black h-16 px-12 rounded-2xl uppercase italic tracking-tight hover:bg-primary transition-all shadow-xl">Assinar</button>
          </form>
          <p className="text-xs text-slate-400 italic">Ao assinar, você concorda com nossos termos e política de privacidade.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
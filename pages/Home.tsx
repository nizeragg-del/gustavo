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

        {/* Carousel Controls - Just indicators now */}
        <div className="absolute bottom-10 left-6 md:left-16 lg:left-40 flex items-center gap-6 z-20">
          <div className="flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentBanner(i);
                }}
                className={`h-1.5 transition-all duration-300 rounded-full ${i === currentBanner ? 'w-12 bg-primary' : 'w-4 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
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
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #2bee79 0%, transparent 70%)' }}></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <span className="text-gold font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">star</span> EDIÇÃO ESPECIAL
              </span>
              <h2 className="text-white text-4xl md:text-5xl font-black leading-tight uppercase">
                Hala Madrid: <br />O Legado Continua
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
                <img alt="Detail 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgagiebZvvsGuHlqepd9ruT65eMDJ9XF4kmA-lnh918KdQialkpfRASrft_7Nm0-lLSggnnOii_LSh4oHU9Cmv-5nOW1-n5nw5PsFV5hrfH1uul59FUr8uHJvoOCn0RCZi0t4tKE-DmiL61z7PoQhoAruzu1rizh04E05eTyg3jT7mrZRmVX1Bs9TyjNdI1snPV-IMfVBgvNt8STfUGG8SkGKLOgLZq-va1QxYVAgNBUnURX5uDu3DHyMkbr0_R1Qd04CMMihf8w" />
              </div>
              <div className="aspect-square bg-white/10 rounded-xl overflow-hidden mt-8">
                <img alt="Detail 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLUwLkiWEfhm7A_2l-nVsaS63u7_UMXBiNbxDcDQM_NbZjzUkMctXellWrSQ2c5nr3wmpNiv1ZBJNyWhX3v30tCgfve9N8-12X1RtBGquHSOm2R_sh7cFo43Ml8S5rRbPo8hWni08q9tw207-_vRFTrEK6AMYCLanuMJZekNXbbkhXonO1VfYlkXndiN36yWpp8ZLtkGjjo5P1ONjm6ShN97yPjPRZNf4ISjEalDf4LqYy0MyQO08kUlc6MJTK5UFArRpv423YIA" />
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
            <input className="flex-1 bg-white/5 border border-white/10 rounded-lg h-14 px-6 focus:ring-primary focus:border-primary text-white outline-none" placeholder="Seu melhor e-mail" type="email" />
            <button className="bg-primary text-background-dark font-black h-14 px-10 rounded-lg uppercase tracking-widest hover:bg-primary/90 transition-all">Assinar</button>
          </form>
          <p className="text-xs text-white/30 italic">Ao assinar, você concorda com nossos termos e política de privacidade.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
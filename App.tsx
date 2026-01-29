import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Categories from './pages/Categories';
import ProductPage from './pages/Product';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import HelpCenter from './pages/HelpCenter';
import Exchanges from './pages/Exchanges';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import { CartItem, Product, Order } from './types';
import { supabase } from './lib/supabase';

// Wrapper to use hooks inside App
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lifted State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: productsData } = await supabase.from('arena_products').select('*');
      const { data: ordersData } = await supabase.from('arena_orders').select('*, arena_order_items(*)');

      if (productsData) {
        setProducts(productsData.map(p => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: Number(p.price),
          image: p.image_url,
          category: 'Clubes',
          isNew: p.is_new,
          stock: p.stock_quantity
        })));
      }

      if (ordersData) {
        setOrders(ordersData.map(o => ({
          id: `#${o.id.slice(0, 5)}`,
          date: new Date(o.created_at).toLocaleDateString(),
          status: o.status === 'delivered' ? 'Entregue' : 'Processando',
          total: Number(o.total_amount),
          items: []
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Handlers
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/product/${product.id}`);
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, size: 'M' }];
    });
    // navigate('/cart'); // Optional: redirect to cart on add
  };

  const handleCategoryNav = (category: string) => {
    setCategoryFilter(category);
    navigate('/categories');
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      setShowAuthPopup(true);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: { data: { full_name: authEmail.split('@')[0] } }
        });
        if (error) throw error;
        alert('Cadastro realizado! Verifique seu e-mail.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
        if (error) throw error;
      }
      setShowAuthPopup(false);
    } catch (err: any) {
      setAuthError(err.message || 'Erro na autenticação');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const handleFinalizeOrder = async () => {
    if (!user) {
      setShowAuthPopup(true);
      return;
    }

    try {
      const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const { data: order, error: orderError } = await supabase
        .from('arena_orders')
        .insert({
          total_amount: subtotal,
          status: 'pending',
          user_id: user.id
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
        size: item.size
      }));

      const { error: itemsError } = await supabase.from('arena_order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      await supabase.from('arena_activities').insert({
        icon: 'shopping_cart',
        title: `Novo pedido #${order.id.slice(0, 5)}`,
        subtitle: `por ${user.email}`,
        color: 'text-primary',
        value_label: `R$ ${subtotal.toFixed(2)}`
      });

      alert('Pedido finalizado com sucesso!');
      setCart([]);
      fetchData();
      navigate('/');
    } catch (error: any) {
      console.error('Error finalizing order:', error);
      alert(`Erro ao finalizar pedido: ${error.message}`);
    }
  };

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const { data, error } = await supabase.from('arena_products').insert({
        name: newProduct.name,
        brand: newProduct.brand,
        price: newProduct.price,
        image_url: newProduct.image,
        category_id: 1,
        is_new: true,
        stock_quantity: 100
      }).select().single();

      if (error) throw error;
      fetchData();
    } catch (error: any) {
      console.error('Error adding product:', error);
      alert(`Erro ao salvar produto: ${error.message || JSON.stringify(error)}`);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };


  // Layout for Public Pages
  const Layout = () => (
    <div className="min-h-screen bg-background-dark text-white flex flex-col font-display">
      <Header
        currentPage={location.pathname === '/' ? 'HOME' : location.pathname.substring(1).toUpperCase()}
        setCurrentPage={(page) => {
          if (page === 'HOME') navigate('/');
          else if (page === 'CATEGORIES') navigate('/categories');
          // Add other mappings or make generic
        }}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onCategorySelect={handleCategoryNav}
        onProfileClick={handleProfileClick}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer onNavigate={(page) => navigate(page === 'HOME' ? '/' : `/${page.toLowerCase()}`)} />

      {/* Auth Popup (Global) */}
      {showAuthPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-dark/40 backdrop-blur-xl p-4 animate-fade-in">
          <div className="fixed inset-0 cursor-pointer" onClick={() => { setShowAuthPopup(false); setAuthError(null); }}></div>
          <div className="relative bg-[#112218]/90 border border-[#326747] rounded-3xl p-10 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scale-in">
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <h2 className="text-3xl font-black uppercase text-white tracking-tighter italic">
                  {isSignUp ? 'Criar Conta' : 'Área do Sócio'}
                </h2>
                <div className="h-1 w-12 bg-primary mt-1"></div>
              </div>
              <button onClick={() => { setShowAuthPopup(false); setAuthError(null); }} className="size-10 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-[#92c9a8] mb-10 text-sm font-medium leading-relaxed">
              {isSignUp ? 'Junte-se à Arena Golaço.' : 'Acesse sua conta para gerenciar seus pedidos.'}
            </p>
            <form className="space-y-6" onSubmit={handleAuth}>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary ml-1 text-left">E-mail</label>
                <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full bg-[#234832]/30 border border-[#326747] rounded-xl px-5 py-4 text-white focus:border-primary outline-none transition-all placeholder:text-white/20" placeholder="ex: artilheiro@gol.com" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary ml-1 text-left">Senha</label>
                <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full bg-[#234832]/30 border border-[#326747] rounded-xl px-5 py-4 text-white focus:border-primary outline-none transition-all placeholder:text-white/20" placeholder="********" />
              </div>
              {authError && <div className="text-red-500 text-xs">{authError}</div>}
              <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-background-dark font-black py-5 rounded-2xl transition-all uppercase tracking-tighter shadow-[0_10px_20px_-10px_rgba(43,238,121,0.5)] active:scale-[0.98]">
                {isSignUp ? 'FINALIZAR CADASTRO' : 'ENTRAR NA CONTA'}
              </button>
            </form>
            <div className="mt-10 pt-8 border-t border-[#326747]/50 text-center">
              <button onClick={() => { setIsSignUp(!isSignUp); setAuthError(null); }} className="text-white hover:text-primary transition-colors underline underline-offset-4 text-xs font-bold uppercase tracking-widest">
                {isSignUp ? 'Já tem conta? FAÇA LOGIN' : 'Não tem conta? CADASTRE-SE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-dark text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home products={products} onProductClick={handleProductClick} onAddToCart={handleAddToCart} onNavigate={(p) => navigate(p === 'HOME' ? '/' : `/${p.toLowerCase()}`)} />} />
        <Route path="categories" element={<Categories products={products} initialFilter={categoryFilter} onProductClick={handleProductClick} onAddToCart={handleAddToCart} />} />
        <Route path="product/:id" element={selectedProduct ? <ProductPage product={selectedProduct} onAddToCart={handleAddToCart} /> : <Navigate to="/" />} />
        <Route path="cart" element={<Cart cart={cart} setCurrentPage={(p) => navigate(p === 'HOME' ? '/' : `/${p.toLowerCase()}`)} isLoggedIn={!!user} onFinalize={handleFinalizeOrder} />} />
        <Route path="profile" element={user ? <Profile user={user} orders={orders} onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="help" element={<HelpCenter />} />
        <Route path="exchanges" element={<Exchanges />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
      </Route>
      <Route path="/admin" element={<Admin products={products} orders={orders} onAddProduct={handleAddProduct} onUpdateStatus={handleUpdateOrderStatus} onNavigateHome={() => navigate('/')} />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
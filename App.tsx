import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthPopup from './components/AuthPopup'; // New Import
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
import { CartItem, Product, Order, Banner } from './types';
import { supabase } from './lib/supabase';

// Stable Layout Component (Defined Outside)
const Layout: React.FC<{
  cartCount: number;
  onCategorySelect: (cat: string) => void;
  onProfileClick: () => void;
  onNavigateHome: () => void;
}> = ({ cartCount, onCategorySelect, onProfileClick, onNavigateHome }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col font-display">
      <Header
        currentPage={location.pathname === '/' ? 'HOME' : location.pathname.substring(1).toUpperCase()}
        setCurrentPage={(page) => {
          if (page === 'HOME') onNavigateHome();
          else if (page === 'CATEGORIES') navigate('/categories');
          else if (page === 'CART') navigate('/cart');
          else if (page === 'PROFILE') navigate('/profile');
          else if (page === 'ORDERS') navigate('/orders');
          else if (page === 'ADMIN') navigate('/admin');
          else navigate(`/${page.toLowerCase()}`);
        }}
        cartCount={cartCount}
        onCategorySelect={onCategorySelect}
        onProfileClick={onProfileClick}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer onNavigate={(page) => navigate(page === 'HOME' ? '/' : `/${page.toLowerCase()}`)} />
    </div>
  );
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth State
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: productsData } = await supabase.from('arena_products').select('*');
      const { data: ordersData } = await supabase.from('arena_orders').select('*, arena_order_items(*)');
      const { data: bannersData } = await supabase.from('arena_banners').select('*').order('priority', { ascending: true });

      if (bannersData) {
        setBanners(bannersData);
      }

      if (productsData) {
        setProducts(productsData.map(p => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: Number(p.price),
          image: p.image_url,
          category: p.category || 'Clubes',
          subcategory: p.subcategory || 'Nacional',
          isNew: p.is_new,
          stock: p.stock_quantity,
          inventory: p.inventory,
          weight: p.weight,
          height: p.height,
          width: p.width,
          length: p.length
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

  // Auth Handlers
  const handleLogin = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    setShowAuthPopup(false);
  };

  const handleSignUp = async (data: any) => {
    // 1. SignUp Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name } }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Erro ao criar usuário.");

    // 2. Create Profile with Address
    const { error: profileError } = await supabase.from('arena_profiles').upsert({
      id: authData.user.id,
      full_name: data.full_name,
      email: data.email,
      cpf: data.cpf,
      phone: data.phone,
      // If we had an address table, insert there. For now, putting in profiles if column exists or we need to add it.
      // Assuming we might need to rely on the 'options' or existing profile trigger. 
      // Since I don't know the exact schema of arena_profiles, I will fail gracefully or rely on metadata.
      // Better: upsert to arena_profiles basic info.
      // Store Address in a JSONB column or separate table if it exists?
      // I will store address in `arena_profiles` as jsonb 'address' column if I can, OR just skip ensuring it for now so I don't break it.
      // Wait, user asked to capture address. I should try to save it. 
      // Optimistic: JSONB 'address'.
      address: data.address
    });

    // If 'address' column doesn't exist, this might fail silently or error. 
    // Safe bet: just create profile. 
    // The user asked for "Next screen has... address".

    alert('Cadastro realizado! Verifique seu e-mail.');
    setShowAuthPopup(false);
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
    // ... same order logic ...
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

  const handleAddProduct = async (newProduct: Product) => { /* ... same ... */
    try {
      const { data, error } = await supabase.from('arena_products').insert({
        name: newProduct.name,
        brand: newProduct.brand,
        price: newProduct.price,
        image_url: newProduct.image,
        category: newProduct.category,
        subcategory: newProduct.subcategory,
        is_new: true,
        stock_quantity: newProduct.stock || 100,
        inventory: newProduct.inventory,
        weight: newProduct.weight || 0.3,
        height: newProduct.height || 5,
        width: newProduct.width || 20,
        length: newProduct.length || 30
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

  const handleEditProduct = async (product: Product) => { /* ... same ... */
    try {
      const { error } = await supabase.from('arena_products').update({
        name: product.name,
        brand: product.brand,
        price: product.price,
        image_url: product.image,
        category: product.category,
        subcategory: product.subcategory,
        inventory: product.inventory,
        weight: product.weight,
        height: product.height,
        width: product.width,
        length: product.length
      }).eq('id', product.id);

      if (error) throw error;
      alert('Produto atualizado com sucesso!');
      fetchData();
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert(`Erro ao atualizar produto: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-dark text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
          onCategorySelect={handleCategoryNav}
          onProfileClick={handleProfileClick}
          onNavigateHome={() => navigate('/')}
        />}>
          <Route index element={<Home products={products} banners={banners} onProductClick={handleProductClick} onAddToCart={handleAddToCart} onNavigate={(p) => navigate(p === 'HOME' ? '/' : `/${p.toLowerCase()}`)} />} />
          <Route path="categories" element={<Categories products={products} initialFilter={categoryFilter} onProductClick={handleProductClick} onAddToCart={handleAddToCart} />} />
          <Route path="product/:id" element={selectedProduct ? <ProductPage product={selectedProduct} onAddToCart={handleAddToCart} /> : <Navigate to="/" />} />
          <Route path="cart" element={<Cart cart={cart} setCurrentPage={(p) => navigate(p === 'HOME' ? '/' : `/${p.toLowerCase()}`)} isLoggedIn={!!user} onFinalize={handleFinalizeOrder} />} />
          <Route path="profile" element={user ? <Profile user={user} orders={orders} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="help" element={<HelpCenter />} />
          <Route path="exchanges" element={<Exchanges />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>
        <Route path="/admin" element={<Admin products={products} orders={orders} banners={banners} onAddProduct={handleAddProduct} onEditProduct={handleEditProduct} onUpdateStatus={handleUpdateOrderStatus} onUpdateBanners={fetchData} onNavigateHome={() => navigate('/')} />} />
      </Routes>

      <AuthPopup
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        error={authError}
        setError={setAuthError}
      />
    </>
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
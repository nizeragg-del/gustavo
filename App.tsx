import React, { useState } from 'react';
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
import { CartItem, Page, Product, Order } from './types';
import { MOCK_PRODUCTS, MOCK_ORDERS } from './constants';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('HOME');

  // Lifted State for data persistence in prototype
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from Supabase
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: productsData } = await supabase.from('products').select('*');
      const { data: ordersData } = await supabase.from('orders').select('*, order_items(*)');

      if (productsData) {
        setProducts(productsData.map(p => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: Number(p.price),
          image: p.image_url,
          category: 'Clubes', // Static for now, could fetch from categories table
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
          items: [] // Placeholder
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
    if (window.location.pathname === '/admin') {
      setCurrentPage('ADMIN');
    }
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('PRODUCT');
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

  const handleCategoryNav = (filter: string) => {
    setCategoryFilter(filter);
    setCurrentPage('CATEGORIES');
    window.scrollTo(0, 0);
  };

  // Admin Actions
  const handleAddProduct = async (newProduct: Product) => {
    try {
      const { data, error } = await supabase.from('products').insert({
        name: newProduct.name,
        brand: newProduct.brand,
        price: newProduct.price,
        image_url: newProduct.image,
        category_id: 1, // Default to first category for now
        is_new: true,
        stock_quantity: 100
      }).select().single();

      if (error) throw error;
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Erro ao salvar produto no banco.');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleFinalizeOrder = async () => {
    if (!isLoggedIn) {
      setShowAuthPopup(true);
      return;
    }

    try {
      const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_amount: subtotal,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
        size: item.size
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 3. Log Activity
      await supabase.from('admin_activities').insert({
        icon: 'shopping_cart',
        title: `Novo pedido #${order.id.slice(0, 5)}`,
        subtitle: 'por Usuário Logado',
        color: 'text-primary',
        value_label: `R$ ${subtotal.toFixed(2)}`
      });

      alert('Pedido finalizado com sucesso!');
      setCart([]);
      fetchData(); // Refresh data for dashboard
      setCurrentPage('HOME');
    } catch (error) {
      console.error('Error finalizing order:', error);
      alert('Erro ao finalizar pedido.');
    }
  };

  const renderPage = () => {
    if (isLoading && products.length === 0) {
      return (
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
      );
    }

    switch (currentPage) {
      case 'HOME':
        return <Home products={products} onProductClick={handleProductClick} onAddToCart={handleAddToCart} onNavigate={setCurrentPage} />;
      case 'CATEGORIES':
        return <Categories products={products} initialFilter={categoryFilter} onProductClick={handleProductClick} onAddToCart={handleAddToCart} />;
      case 'PRODUCT':
        return selectedProduct ? <ProductPage product={selectedProduct} onAddToCart={handleAddToCart} /> : <Home products={products} onProductClick={handleProductClick} onAddToCart={handleAddToCart} onNavigate={setCurrentPage} />;
      case 'CART':
        return (
          <Cart
            cart={cart}
            setCurrentPage={setCurrentPage}
            isLoggedIn={isLoggedIn}
            onFinalize={handleFinalizeOrder}
          />
        );
      case 'PROFILE':
        return <Profile orders={orders} />;
      case 'ADMIN':
        return <Admin products={products} orders={orders} onAddProduct={handleAddProduct} onUpdateStatus={handleUpdateOrderStatus} onNavigateHome={() => setCurrentPage('HOME')} />;
      case 'ORDERS':
        return <Profile orders={orders} initialTab="ORDERS" />;
      case 'HELP':
        return <HelpCenter />;
      case 'EXCHANGES':
        return <Exchanges />;
      case 'CONTACT':
        return <Contact />;
      case 'PRIVACY':
        return <Privacy />;
      default:
        return <Home products={products} onProductClick={handleProductClick} onAddToCart={handleAddToCart} onNavigate={setCurrentPage} />;
    }
  };

  if (currentPage === 'ADMIN') {
    return <Admin products={products} orders={orders} onAddProduct={handleAddProduct} onUpdateStatus={handleUpdateOrderStatus} onNavigateHome={() => setCurrentPage('HOME')} />;
  }

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col font-display">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onCategorySelect={handleCategoryNav}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />

      {/* Auth Popup */}
      {showAuthPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-dark/80 backdrop-blur-sm p-4">
          <div className="bg-white/10 border border-white/10 rounded-2xl p-8 max-w-md w-full animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase text-primary">Login / Cadastro</h2>
              <button onClick={() => setShowAuthPopup(false)} className="text-white/60 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-slate-400 mb-8">Para finalizar seu pedido, por favor faça login ou crie uma conta.</p>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); setShowAuthPopup(false); }}>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">E-mail</label>
                <input type="email" required className="w-full bg-background-dark/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none text-white" placeholder="seu@email.com" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Senha</label>
                <input type="password" required className="w-full bg-background-dark/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none text-white" placeholder="********" />
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-background-dark font-black py-4 rounded-lg transition-all">
                ENTRAR
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-slate-400">Não tem uma conta? <button className="text-primary font-bold hover:underline">Cadastre-se</button></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
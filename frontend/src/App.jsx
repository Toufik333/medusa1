import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Ticket,
  Megaphone,
  Package,
  Server,
  ShieldCheck,
  Sparkles,
  LogOut,
  ExternalLink,
  UserCheck,
  CheckCircle2,
  Truck,
  RotateCcw
} from 'lucide-react';
import { api, authStorage } from './api/client';
import Navbar from './components/Navbar';
import CampaignBanner from './components/CampaignBanner';
import FeaturedBoard from './components/FeaturedBoard';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import AdminLogin from './components/AdminPanel/AdminLogin';
import ProductManager from './components/AdminPanel/ProductManager';
import CouponManager from './components/AdminPanel/CouponManager';
import CampaignManager from './components/AdminPanel/CampaignManager';
import OrderManager from './components/AdminPanel/OrderManager';
import BackendStatus from './components/AdminPanel/BackendStatus';

// Initial fallback demo items
const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: 'Oud Royale Extrait de Parfum',
    subtitle: 'Pure Cambodian Oud • Damask Rose • Smoked Amber • 100ml',
    price: 5800,
    discountPrice: 4950,
    isClothing: false,
    category: 'Fragrances',
    sizes: [],
    featured: true,
    stock: 24,
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85',
    cropMeta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    id: 2,
    title: 'Velvet Santal Eau de Parfum',
    subtitle: 'Australian Sandalwood • Cardamom • Tuscan Leather • 100ml',
    price: 4200,
    discountPrice: 3650,
    isClothing: false,
    category: 'Fragrances',
    sizes: [],
    featured: true,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85',
    cropMeta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    id: 3,
    title: 'Signature PerfumeGo Embroidered Hoodie',
    subtitle: '480GSM French Terry • Gold Crest Monogram Embroidery',
    price: 3450,
    discountPrice: 2850,
    isClothing: true,
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
    cropMeta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    id: 4,
    title: 'Imperial Amber Noir',
    subtitle: 'Bourbon Vanilla • Black Amber • Tonka Bean • 50ml',
    price: 3850,
    discountPrice: null,
    isClothing: false,
    category: 'Fragrances',
    sizes: [],
    featured: false,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85',
    cropMeta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    id: 5,
    title: 'Discovery Quintet Gift Set',
    subtitle: 'Curated 5 x 10ml Travel Sprays in Luxury Velvet Box',
    price: 2950,
    discountPrice: 2450,
    isClothing: false,
    category: 'Gift Sets',
    sizes: [],
    featured: false,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=900&q=85',
    cropMeta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    id: 6,
    title: 'PerfumeGo Crest Minimalist Heavy Tee',
    subtitle: '280GSM Organic Combed Cotton • Gold Foil PG Monogram',
    price: 1650,
    discountPrice: null,
    isClothing: true,
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=85',
    cropMeta: { zoom: 1, panX: 0, panY: 0 }
  }
];

const INITIAL_COUPONS = [
  { id: 1, code: 'ROYAL15', discountPercent: 15, active: true, description: 'Grand Launch 15% Off Fragrances' },
  { id: 2, code: 'WELCOME10', discountPercent: 10, active: true, description: 'First Order 10% Welcome Discount' },
  { id: 3, code: 'VIP25', discountPercent: 25, active: false, description: 'VIP Flash Code (Currently Deactivated)' }
];

const INITIAL_CAMPAIGN = {
  active: true,
  badge: 'ROYAL DROP',
  headline: 'PERFUMEGO GRAND LAUNCH — Complimentary Delivery on all Fragrances',
  subtext: 'Handcrafted luxury extraits with pure botanical distillations. Exclusive 15% discount code.',
  promoCode: 'ROYAL15'
};

const INITIAL_ORDERS = [
  {
    id: 'ORD-9041',
    customerName: 'Tanvir Ahmed',
    phone: '01711-893412',
    address: 'House 42, Road 11, Banani',
    area: 'Dhaka Metro',
    createdAt: '2 hours ago',
    status: 'Confirmed',
    paymentMethod: 'COD',
    couponCode: 'WINTER15',
    discountAmount: 667,
    deliveryFee: 60,
    total: 3843,
    items: [
      { id: 1, title: 'Heavyweight Oversized Hoodie', isClothing: true, size: 'L', qty: 1, price: 2650 },
      { id: 4, title: 'Minimalist Leather Cardholder', isClothing: false, size: null, qty: 1, price: 1650 }
    ]
  }
];

export default function App() {
  // Path-based Routing: '/', '/admin', or '/product/:id'
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const isAdminRoute = currentPath.startsWith('/admin');
  const isProductRoute = currentPath.startsWith('/product/');
  const activeProductId = isProductRoute ? currentPath.replace('/product/', '').split('/')[0] : null;

  // Admin Auth State
  const [adminUser, setAdminUser] = useState(() => authStorage.getAdmin());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(authStorage.getToken()));

  // Admin Tab Navigation
  const [adminTab, setAdminTab] = useState('products');

  // Application Data States
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [campaign, setCampaign] = useState(INITIAL_CAMPAIGN);
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Storefront Filtering & Sizing
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [sizePromptError, setSizePromptError] = useState(null);

  const activeProduct = activeProductId
    ? products.find((p) => String(p.id) === String(activeProductId))
    : null;

  // Cart & Checkout (clean empty bag by default)
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponFeedback, setCouponFeedback] = useState(null);
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState(null);

  // Toast System
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  // Sync browser URL on popstate
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch initial data
  const refreshData = async () => {
    const [prodRes, coupRes, campRes] = await Promise.all([
      api.getProducts(),
      api.getActiveCoupons(),
      api.getCampaign()
    ]);

    if (prodRes.data && Array.isArray(prodRes.data)) {
      setProducts(prodRes.data);
    }
    if (coupRes.data && Array.isArray(coupRes.data)) {
      setCoupons(coupRes.data);
    }
    if (campRes.data) {
      setCampaign(campRes.data);
    }

    if (isAuthenticated) {
      const [ordRes, allCoupRes] = await Promise.all([
        api.getOrders(),
        api.getCoupons()
      ]);
      if (ordRes.data && Array.isArray(ordRes.data)) {
        setOrders(ordRes.data);
      }
      if (allCoupRes.data && Array.isArray(allCoupRes.data)) {
        setCoupons(allCoupRes.data);
      }
    }
  };

  useEffect(() => {
    refreshData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (appliedCoupon) {
      const live = coupons.find((c) => c.code === appliedCoupon.code);
      if (!live || !live.active) {
        setAppliedCoupon(null);
        setCouponFeedback({
          type: 'error',
          message: `Coupon "${appliedCoupon.code}" was deactivated by Admin and removed from bag.`
        });
      }
    }
  }, [coupons, appliedCoupon]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
        p.category?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured);
  }, [products]);

  // Authentication Handlers
  const handleAdminLogin = async (email, password) => {
    const res = await api.adminLogin(email, password);
    if (res.data?.token) {
      setIsAuthenticated(true);
      setAdminUser(res.data.admin);
      showToast(`Authenticated as ${res.data.admin.name}`);
      const [ordRes, allCoupRes] = await Promise.all([
        api.getOrders(),
        api.getCoupons()
      ]);
      if (ordRes.data) setOrders(ordRes.data);
      if (allCoupRes.data) setCoupons(allCoupRes.data);
      return { success: true };
    }
    return { success: false, error: res.error || 'Invalid admin credentials' };
  };

  const handleAdminLogout = () => {
    api.adminLogout();
    setIsAuthenticated(false);
    setAdminUser(null);
    showToast('Signed out');
  };

  // Cart operations
  const handleAddToCart = (product, explicitOption = null, qtyToAdd = 1, explicitPrice = null) => {
    const rawOptions = product.attributes?.options && product.attributes.options.length > 0
      ? product.attributes.options
      : (product.sizes && product.sizes.length > 0
          ? product.sizes.map((s) => ({ name: s, price: null }))
          : []);

    let chosenOption = explicitOption || selectedSizes[product.id] || null;

    if (!chosenOption && rawOptions.length > 0) {
      if (product.isClothing) {
        setSizePromptError(product.id);
        const sizesAvail = rawOptions.map((o) => o.name).join('/');
        showToast(`Please select a size (${sizesAvail}) for ${product.title}`, 'error');
        return;
      } else {
        chosenOption = rawOptions[0].name;
      }
    }

    setSizePromptError(null);

    const matchedOpt = rawOptions.find((o) => o.name === chosenOption);
    const effectivePrice = explicitPrice || (matchedOpt?.price && matchedOpt.price > 0 ? matchedOpt.price : (product.discountPrice || product.price));

    const cartItemId = chosenOption ? `${product.id}-${chosenOption}` : String(product.id);

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, qty: item.qty + qtyToAdd } : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          productId: product.id,
          title: product.title,
          price: effectivePrice,
          regularPrice: product.price,
          imageUrl: product.imageUrl,
          cropMeta: product.cropMeta,
          isClothing: Boolean(product.isClothing),
          size: chosenOption,
          attributeName: product.attributes?.name || (product.isClothing ? 'Size' : 'Volume'),
          qty: qtyToAdd
        }
      ];
    });

    showToast(`Added ${product.title}${chosenOption ? ` (${chosenOption})` : ''} to bag`);
  };

  const handleBuyNow = (cartPayload) => {
    handleAddToCart(
      cartPayload,
      cartPayload.selectedOption || cartPayload.size || null,
      cartPayload.qty || 1,
      cartPayload.price
    );
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // Coupon application
  const handleApplyCoupon = async (codeToApply) => {
    const raw = (codeToApply ?? couponInput).trim().toUpperCase();
    if (!raw) return;

    const res = await api.validateCoupon(raw);
    if (res.data) {
      setAppliedCoupon(res.data);
      setCouponInput(res.data.code);
      setCouponFeedback({
        type: 'success',
        message: `${res.data.code} applied! Saved ${res.data.discountPercent}% off.`
      });
      showToast(`Applied ${res.data.code} (${res.data.discountPercent}% OFF)`);
      return;
    }

    const matched = coupons.find((c) => c.code.toUpperCase() === raw);
    if (!matched) {
      setAppliedCoupon(null);
      setCouponFeedback({ type: 'error', message: `Coupon "${raw}" does not exist.` });
      return;
    }
    if (!matched.active) {
      setAppliedCoupon(null);
      setCouponFeedback({ type: 'error', message: `Coupon "${raw}" is currently inactive.` });
      return;
    }

    setAppliedCoupon(matched);
    setCouponInput(matched.code);
    setCouponFeedback({
      type: 'success',
      message: `${matched.code} applied! Saved ${matched.discountPercent}% off.`
    });
    showToast(`Applied ${matched.code} (${matched.discountPercent}% OFF)`);
  };

  // Order Placement (COD)
  const handlePlaceOrder = async (orderPayload) => {
    const res = await api.createOrder(orderPayload);
    const confirmedOrder = res.data || {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      ...orderPayload,
      createdAt: 'Just now',
      status: 'Pending'
    };

    setOrders((prev) => [confirmedOrder, ...prev]);
    setCheckoutSuccessOrder(confirmedOrder);
    setCart([]);
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponFeedback(null);
    showToast(`Order #${confirmedOrder.id} confirmed!`);
  };

  // Admin Actions
  const handleSaveProduct = async (editingId, payload) => {
    if (editingId) {
      const res = await api.updateProduct(editingId, payload);
      if (res.error) {
        showToast(res.error, 'error');
        return;
      }
      const updated = res.data;
      setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      showToast(`Updated "${payload.title}" with 4:5 aligned crop.`);
    } else {
      const res = await api.createProduct(payload);
      if (res.error) {
        showToast(res.error, 'error');
        return;
      }
      const created = res.data;
      setProducts((prev) => [created, ...prev]);
      showToast(`Published "${payload.title}" to Storefront!`);
    }
  };

  const handleDeleteProduct = async (id) => {
    const res = await api.deleteProduct(id);
    if (res.error) {
      showToast(res.error, 'error');
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from store.');
  };

  const handleToggleFeatured = async (id) => {
    const res = await api.toggleFeatured(id);
    if (res.error) {
      showToast(res.error, 'error');
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  const handleCreateCoupon = async (payload) => {
    const res = await api.createCoupon(payload);
    if (res.error) {
      showToast(res.error, 'error');
      return;
    }
    const created = res.data;
    setCoupons((prev) => [...prev, created]);
    showToast(`Created active coupon ${created.code} (${created.discountPercent}% OFF)`);
  };

  const handleToggleCoupon = async (id) => {
    const res = await api.toggleCoupon(id);
    if (res.error) {
      showToast(res.error, 'error');
      return;
    }
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextState = !c.active;
          showToast(`Coupon ${c.code} ${nextState ? 'activated' : 'deactivated'}.`);
          return { ...c, active: nextState };
        }
        return c;
      })
    );
  };

  const handleDeleteCoupon = async (id) => {
    const res = await api.deleteCoupon(id);
    if (res.error) {
      showToast(res.error, 'error');
      return;
    }
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Coupon removed.');
  };

  const handleUpdateCampaign = async (payload) => {
    const res = await api.updateCampaign(payload);
    if (res.data) setCampaign(res.data);
    else setCampaign((prev) => ({ ...prev, ...payload }));
    showToast('Special discount campaign updated.');
  };

  const handleToggleCampaign = async () => {
    await api.toggleCampaign();
    setCampaign((prev) => {
      const nextActive = !prev.active;
      showToast(`Campaign banner ${nextActive ? 'activated' : 'paused'}.`);
      return { ...prev, active: nextActive };
    });
  };

  const handleUpdateOrderStatus = async (id, status) => {
    await api.updateOrderStatus(id, { status });
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    showToast(`Order ${id} marked as ${status}`);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // =========================================================================
  // RENDER: ADMIN ROUTE (/admin)
  // =========================================================================
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white flex flex-col justify-between">
          <AdminLogin
            onLogin={handleAdminLogin}
            onReturnToStore={() => navigateTo('/')}
            showToast={showToast}
          />
          <Toast toast={toast} />
          <footer className="py-6 text-center text-xs text-neutral-400 border-t border-neutral-100">
            PerfumeGo • Internal Admin Access Gate
          </footer>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
        {/* Dedicated Admin Navigation Header */}
        <header className="sticky top-0 z-30 bg-neutral-950 text-white border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 p-1 flex items-center justify-center border border-amber-400/20">
                <img src="/logo.png" alt="PerfumeGo Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight block leading-tight font-serif">
                  Perfume<span className="text-amber-400">Go</span> Admin
                </span>
                <span className="text-[10px] text-amber-200/60 uppercase tracking-widest block">
                  Secure Portal (/admin)
                </span>
              </div>
            </div>

            {/* Admin identity & Sign Out */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs border border-white/10">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white">{adminUser?.name || 'Authorized Admin'}</span>
                <span className="text-neutral-400 text-[11px]">({adminUser?.email || 'admin'})</span>
              </div>

              <button
                type="button"
                onClick={() => navigateTo('/')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-neutral-200 transition flex items-center gap-1.5 cursor-pointer"
                title="View customer storefront"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Storefront</span>
              </button>

              <button
                type="button"
                onClick={handleAdminLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition flex items-center gap-1.5 border border-rose-500/30 cursor-pointer"
                title="Log out of admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Admin Dashboard Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Control Center • Authenticated Session</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Store Management & 4:5 Post Studio
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Manage inventory, clothing sizes, coupons, and seasonal campaigns.
              </p>
            </div>

            {/* Sub-tabs */}
            <div className="flex flex-wrap gap-1.5 bg-neutral-100 p-1.5 rounded-xl">
              {[
                { id: 'products', label: 'Products & 4:5 Cropper', icon: Layers, count: products.length },
                { id: 'coupons', label: 'Coupons', icon: Ticket, count: coupons.filter((c) => c.active).length },
                { id: 'campaign', label: 'Campaign Banner', icon: Megaphone },
                { id: 'orders', label: 'Orders (COD)', icon: Package, count: orders.length },
                { id: 'backend', label: 'Backend & Security', icon: Server }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = adminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAdminTab(tab.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      active
                        ? 'bg-neutral-950 text-white shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-950'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] ${
                          active ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-tab views */}
          {adminTab === 'products' && (
            <ProductManager
              products={products}
              onSaveProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
              onToggleFeatured={handleToggleFeatured}
              showToast={showToast}
            />
          )}

          {adminTab === 'coupons' && (
            <CouponManager
              coupons={coupons}
              onCreateCoupon={handleCreateCoupon}
              onToggleCoupon={handleToggleCoupon}
              onDeleteCoupon={handleDeleteCoupon}
              showToast={showToast}
            />
          )}

          {adminTab === 'campaign' && (
            <CampaignManager
              campaign={campaign}
              onUpdateCampaign={handleUpdateCampaign}
              onToggleCampaign={handleToggleCampaign}
              showToast={showToast}
            />
          )}

          {adminTab === 'orders' && (
            <OrderManager
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              showToast={showToast}
            />
          )}

          {adminTab === 'backend' && (
            <BackendStatus showToast={showToast} />
          )}
        </main>

        <Toast toast={toast} />
      </div>
    );
  }

  // =========================================================================
  // RENDER: PRODUCTION CUSTOMER STOREFRONT (/)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* 1. Special Discount Campaign Banner */}
      <CampaignBanner
        campaign={campaign}
        onApplyCoupon={(code) => {
          setCouponInput(code);
          handleApplyCoupon(code);
          setIsCartOpen(true);
        }}
      />

      {/* 2. Customer Header */}
      <Navbar
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          if (isProductRoute) navigateTo('/');
        }}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (isProductRoute) navigateTo('/');
        }}
        cartCount={cartCount}
        onOpenCart={() => {
          setCheckoutSuccessOrder(null);
          setIsCartOpen(true);
        }}
      />

      {isProductRoute ? (
        <main className="flex-1 max-w-7xl w-full mx-auto">
          {activeProduct ? (
            <ProductDetail
              product={activeProduct}
              onBack={() => navigateTo('/')}
              onAddToCart={(prod, optName, qty, price) => {
                handleAddToCart(prod, optName, qty, price);
              }}
              onBuyNow={handleBuyNow}
              showToast={showToast}
            />
          ) : (
            <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
              <Package className="w-12 h-12 text-neutral-300 mx-auto" />
              <h2 className="text-xl font-bold text-neutral-900">Product Not Found</h2>
              <p className="text-xs text-neutral-500">
                The product you are trying to view might have been moved or removed.
              </p>
              <button
                type="button"
                onClick={() => navigateTo('/')}
                className="px-5 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition cursor-pointer"
              >
                Back to Storefront
              </button>
            </div>
          )}
        </main>
      ) : (
        /* 3. Main Storefront Content */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-8 sm:space-y-12">
          {/* Sleek, Non-Distracting Banner (Thin on Mobile, Elegant on Desktop) */}
          <section className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white p-3.5 sm:p-8 overflow-hidden border border-neutral-800 shadow-sm">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
              <div className="space-y-1 sm:space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 text-[10px] sm:text-xs font-semibold tracking-wide">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>PERFUMEGO GRAND COLLECTION</span>
                </div>
                <h1 className="text-base sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-snug">
                  {campaign.active ? campaign.headline : 'Artisanal Luxury Perfumes & Signature Apparel'}
                </h1>
                <p className="hidden sm:block text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                  {campaign.active
                    ? campaign.subtext
                    : 'Handcrafted luxury extraits with pure botanical distillations. Fast Cash on Delivery across Bangladesh.'}
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href="#catalog-section"
                  className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition shadow-sm"
                >
                  Shop Collection
                </a>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          </section>

          {/* Feature Badges - Single Thin Line Bar */}
          <div className="rounded-xl sm:rounded-2xl bg-white border border-neutral-200/90 px-3 py-2 sm:py-2.5 shadow-xs">
            <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar text-[11px] sm:text-xs font-medium text-neutral-700 divide-x divide-neutral-200">
              <div className="flex items-center gap-1.5 shrink-0 px-2 first:pl-0">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                <span className="font-bold text-neutral-950">Cash on Delivery</span>
                <span className="hidden md:inline text-neutral-400 font-normal">• All over BD</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 px-2">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-neutral-950">100% Genuine Quality</span>
                <span className="hidden md:inline text-neutral-400 font-normal">• Guaranteed</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 px-2 last:pr-0">
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0" />
                <span className="font-bold text-neutral-950">Hassle-Free Exchange</span>
                <span className="hidden md:inline text-neutral-400 font-normal">• Easy Support</span>
              </div>
            </div>
          </div>

          {/* Featured Board */}
          {selectedCategory === 'All' && !searchQuery && (
            <FeaturedBoard
              featuredProducts={featuredProducts}
              selectedSizes={selectedSizes}
              onSelectSize={(prodId, size) => {
                setSelectedSizes((prev) => ({ ...prev, [prodId]: size }));
                if (sizePromptError === prodId) setSizePromptError(null);
              }}
              sizePromptError={sizePromptError}
              onAddToCart={handleAddToCart}
              onOpenProduct={(prod) => navigateTo(`/product/${prod.id}`)}
            />
          )}

          {/* Store Catalog */}
          <section id="catalog-section" className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Studio Catalog
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                  {selectedCategory === 'All' ? 'Complete Collection' : selectedCategory}
                </h2>
              </div>

              {/* Active Coupons Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-500">Active Coupons:</span>
                {coupons
                  .filter((c) => c.active)
                  .map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCouponInput(c.code);
                        handleApplyCoupon(c.code);
                        setIsCartOpen(true);
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-semibold hover:bg-emerald-100 transition cursor-pointer"
                    >
                      {c.code} ({c.discountPercent}% OFF)
                    </button>
                  ))}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-3">
                <Package className="w-10 h-10 text-neutral-300 mx-auto" />
                <h3 className="font-semibold text-base">No matching products found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try clearing your search query or choosing another category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-medium cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={`prod-${product.id}`}
                    product={product}
                    isFeatured={false}
                    selectedSize={selectedSizes[product.id]}
                    onSelectSize={(prodId, size) => {
                      setSelectedSizes((prev) => ({ ...prev, [prodId]: size }));
                      if (sizePromptError === prodId) setSizePromptError(null);
                    }}
                    needsSizePrompt={sizePromptError === product.id}
                    onAddToCart={handleAddToCart}
                    onOpenProduct={(prod) => navigateTo(`/product/${prod.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onClearCart={() => setCart([])}
        couponInput={couponInput}
        setCouponInput={setCouponInput}
        appliedCoupon={appliedCoupon}
        couponFeedback={couponFeedback}
        onApplyCoupon={handleApplyCoupon}
        onPlaceOrder={handlePlaceOrder}
        checkoutSuccessOrder={checkoutSuccessOrder}
        setCheckoutSuccessOrder={setCheckoutSuccessOrder}
      />

      {/* Toast Notification */}
      <Toast toast={toast} />

      {/* Production Brand Footer */}
      <footer className="border-t border-neutral-200 bg-white mt-20 py-12 px-4 sm:px-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-900/5 p-1 flex items-center justify-center border border-amber-900/10">
                  <img src="/logo.png" alt="PerfumeGo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-extrabold text-base text-neutral-950 tracking-tight font-serif block leading-none">
                    Perfume<span className="text-amber-700">Go</span>
                  </span>
                  <span className="text-[9.5px] text-amber-900/80 font-medium tracking-widest uppercase block mt-1">
                    Luxury Fragrance House
                  </span>
                </div>
              </div>
              <p className="text-neutral-500 max-w-sm text-xs leading-relaxed">
                Curated luxury perfumes, artisanal extraits, and premium fragrance objects crafted with exceptional essences and timeless sophistication. Based in Dhaka, Bangladesh.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">Customer Support</div>
              <div className="text-xs space-y-1.5 text-neutral-500">
                <div>Cash on Delivery available nationwide</div>
                <div>Dhaka Metro: 24–48 Hours Delivery</div>
                <div>Outside Dhaka: 3–5 Business Days</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">Studio Portal</div>
              <div className="text-xs space-y-1.5">
                <button
                  type="button"
                  onClick={() => navigateTo('/admin')}
                  className="hover:text-neutral-950 transition cursor-pointer text-neutral-500"
                >
                  Authorized Admin Login
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
            <div>
              © {new Date().getFullYear()} PerfumeGo. All rights reserved.
            </div>
            <div>
              Cash on Delivery (COD) Verified
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

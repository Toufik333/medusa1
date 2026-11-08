import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Ticket,
  Megaphone,
  Package,
  Server,
  ShieldCheck,
  Sparkles,
  Crop
} from 'lucide-react';
import { api } from './api/client';
import Navbar from './components/Navbar';
import CampaignBanner from './components/CampaignBanner';
import FeaturedBoard from './components/FeaturedBoard';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import ProductManager from './components/AdminPanel/ProductManager';
import CouponManager from './components/AdminPanel/CouponManager';
import CampaignManager from './components/AdminPanel/CampaignManager';
import OrderManager from './components/AdminPanel/OrderManager';
import BackendStatus from './components/AdminPanel/BackendStatus';

// Initial fallback demo items
const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: 'Heavyweight Oversized Hoodie',
    subtitle: '480GSM French Terry • Drop Shoulder',
    price: 3200,
    discountPrice: 2650,
    isClothing: true,
    category: 'Clothing',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    stock: 24,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
    cropMeta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    id: 2,
    title: 'Matte Black Everyday Backpack',
    subtitle: 'Ballistic Nylon • 16" Laptop Compartment',
    price: 4500,
    discountPrice: 3800,
    isClothing: false,
    category: 'Gear',
    sizes: [], // Non-clothing: strictly empty
    featured: true,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    cropMeta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    id: 3,
    title: 'Vintage Washed Cargo Pants',
    subtitle: 'Relaxed Ripstop Weave • 6-Pocket Utility',
    price: 2950,
    discountPrice: null,
    isClothing: true,
    category: 'Clothing',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85',
    cropMeta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    id: 4,
    title: 'Minimalist Leather Cardholder',
    subtitle: 'Full-Grain Vegetable Tanned • RFID Shield',
    price: 1650,
    discountPrice: null,
    isClothing: false,
    category: 'Accessories',
    sizes: [],
    featured: false,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85',
    cropMeta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    id: 5,
    title: 'Minimalist Oxford Shirt',
    subtitle: 'Organic Combed Cotton • Boxy Tailored Fit',
    price: 2450,
    discountPrice: 2100,
    isClothing: true,
    category: 'Clothing',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85',
    cropMeta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    id: 6,
    title: 'Stainless Insulated Tumbler',
    subtitle: 'Double-Wall Vacuum • 500ml Matte Powder Coat',
    price: 1850,
    discountPrice: 1490,
    isClothing: false,
    category: 'Gear',
    sizes: [],
    featured: false,
    stock: 52,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85',
    cropMeta: { zoom: 1, panX: 0, panY: 0 }
  }
];

const INITIAL_COUPONS = [
  { id: 1, code: 'WINTER15', discountPercent: 15, active: true, description: 'Seasonal Campaign 15% Off' },
  { id: 2, code: 'WELCOME10', discountPercent: 10, active: true, description: 'First Order 10% Welcome Discount' },
  { id: 3, code: 'VIP25', discountPercent: 25, active: false, description: 'VIP Flash Code (Currently Deactivated)' }
];

const INITIAL_CAMPAIGN = {
  active: true,
  badge: 'SEASONAL DROP',
  headline: 'WINTER DROP CAMPAIGN — Up to 25% OFF Selected Items',
  subtext: 'Minimalist essentials crafted for everyday utility. Free shipping on orders over ৳5,000.',
  promoCode: 'WINTER15'
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
  // Navigation & View Modes
  const [viewMode, setViewMode] = useState('storefront'); // 'storefront' | 'admin'
  const [adminTab, setAdminTab] = useState('products'); // 'products' | 'coupons' | 'campaign' | 'orders' | 'backend'

  // Application Data States
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [campaign, setCampaign] = useState(INITIAL_CAMPAIGN);
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Storefront Filtering & Sizing
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState({}); // { [productId]: 'M' }
  const [sizePromptError, setSizePromptError] = useState(null);

  // Cart & Checkout
  const [cart, setCart] = useState([
    {
      cartItemId: '1-L',
      productId: 1,
      title: 'Heavyweight Oversized Hoodie',
      price: 2650,
      regularPrice: 3200,
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
      cropMeta: { zoom: 1, panX: 0, panY: 0 },
      isClothing: true,
      size: 'L',
      qty: 1
    }
  ]);
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

  // Load initial data from backend API
  const refreshData = async () => {
    const [prodRes, coupRes, campRes, ordRes] = await Promise.all([
      api.getProducts(),
      api.getCoupons(),
      api.getCampaign(),
      api.getOrders()
    ]);

    if (prodRes.data && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
      setProducts(prodRes.data);
    }
    if (coupRes.data && Array.isArray(coupRes.data)) {
      setCoupons(coupRes.data);
    }
    if (campRes.data) {
      setCampaign(campRes.data);
    }
    if (ordRes.data && Array.isArray(ordRes.data)) {
      setOrders(ordRes.data);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // When admin toggles coupon active/inactive, sync applied coupon in cart
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

  // Filtered lists
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

  // Cart operations
  const handleAddToCart = (product) => {
    let chosenSize = null;
    if (product.isClothing) {
      chosenSize = selectedSizes[product.id];
      if (!chosenSize) {
        setSizePromptError(product.id);
        const sizesAvail = product.sizes?.length ? product.sizes.join('/') : 'S/M/L/XL';
        showToast(`Please select a size (${sizesAvail}) for ${product.title}`, 'error');
        return;
      }
    }

    setSizePromptError(null);
    const effectivePrice = product.discountPrice || product.price;
    const cartItemId = product.isClothing ? `${product.id}-${chosenSize}` : String(product.id);

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, qty: item.qty + 1 } : item
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
          isClothing: product.isClothing,
          size: chosenSize,
          qty: 1
        }
      ];
    });

    showToast(`Added ${product.title}${chosenSize ? ` (Size ${chosenSize})` : ''} to bag`);
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

    // First validate via backend
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

    // Local fallback check if backend unreachable
    const matched = coupons.find((c) => c.code.toUpperCase() === raw);
    if (!matched) {
      setAppliedCoupon(null);
      setCouponFeedback({ type: 'error', message: `Coupon "${raw}" does not exist.` });
      return;
    }
    if (!matched.active) {
      setAppliedCoupon(null);
      setCouponFeedback({ type: 'error', message: `Coupon "${raw}" is currently deactivated by Admin.` });
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

  // Order Placement
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
    showToast(`Order ${confirmedOrder.id} placed via Cash on Delivery!`);
  };

  // Admin Actions: Products
  const handleSaveProduct = async (editingId, payload) => {
    if (editingId) {
      const res = await api.updateProduct(editingId, payload);
      const updated = res.data || { id: editingId, ...payload };
      setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      showToast(`Updated "${payload.title}" with 4:5 aligned crop.`);
    } else {
      const res = await api.createProduct(payload);
      const created = res.data || { id: Date.now(), ...payload };
      setProducts((prev) => [created, ...prev]);
      showToast(`Published "${payload.title}" to Storefront!`);
    }
  };

  const handleDeleteProduct = async (id) => {
    await api.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from store.');
  };

  const handleToggleFeatured = async (id) => {
    await api.toggleFeatured(id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  // Admin Actions: Coupons
  const handleCreateCoupon = async (payload) => {
    const res = await api.createCoupon(payload);
    const created = res.data || { id: Date.now(), ...payload, active: true };
    setCoupons((prev) => [...prev, created]);
    showToast(`Created active coupon ${created.code} (${created.discountPercent}% OFF)`);
  };

  const handleToggleCoupon = async (id) => {
    await api.toggleCoupon(id);
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
    await api.deleteCoupon(id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Coupon removed.');
  };

  // Admin Actions: Campaign
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

  // Admin Actions: Orders
  const handleUpdateOrderStatus = async (id, status) => {
    await api.updateOrderStatus(id, { status });
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    showToast(`Order ${id} marked as ${status}`);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

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

      {/* 2. Sticky Header */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        onOpenCart={() => {
          setCheckoutSuccessOrder(null);
          setIsCartOpen(true);
        }}
        pendingOrdersCount={orders.filter((o) => o.status === 'Pending').length}
      />

      {/* 3. Main Content: Storefront or Admin Panel */}
      {viewMode === 'storefront' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-12">
          {/* Hero Section */}
          <section className="relative rounded-3xl bg-neutral-950 text-white p-6 sm:p-10 overflow-hidden border border-neutral-800">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Uniform 4:5 Lookbook • Conditional Size Engine</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
                {campaign.active ? campaign.headline : 'Minimalist Apparel & Everyday Carry.'}
              </h1>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                {campaign.active
                  ? campaign.subtext
                  : 'Designed for durability and clean aesthetics. Clothing items include tailored S–XL sizing; everyday carry gear ships in universal studio spec.'}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#catalog-section"
                  className="px-5 py-2.5 rounded-xl bg-white text-neutral-950 font-semibold text-xs sm:text-sm hover:bg-neutral-200 transition"
                >
                  Explore Collection
                </a>
                <button
                  type="button"
                  onClick={() => setViewMode('admin')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm border border-white/15 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Crop className="w-4 h-4 text-amber-300" />
                  <span>4:5 Admin Post & Cropper</span>
                </button>
              </div>
            </div>
            {/* Subtle glow */}
            <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-tr from-amber-500/20 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          </section>

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
            />
          )}

          {/* Store Catalog */}
          <section id="catalog-section" className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  All Products • Strict 4:5 Grid
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
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      ) : (
        /* Admin Panel */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Control Center • Full Functionality</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Store Management & 4:5 Post Studio
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Changes to products, clothing sizes, coupons, and campaigns sync directly with the storefront.
              </p>
            </div>

            {/* Sub-tabs */}
            <div className="flex flex-wrap gap-1.5 bg-neutral-100 p-1.5 rounded-xl">
              {[
                { id: 'products', label: 'Products & 4:5 Cropper', icon: Layers, count: products.length },
                { id: 'coupons', label: 'Coupons', icon: Ticket, count: coupons.filter((c) => c.active).length },
                { id: 'campaign', label: 'Campaign Banner', icon: Megaphone },
                { id: 'orders', label: 'Orders (COD / bKash)', icon: Package, count: orders.length },
                { id: 'backend', label: 'Backend & Deploy', icon: Server }
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
        onInspectOrderInAdmin={() => {
          setViewMode('admin');
          setAdminTab('orders');
        }}
      />

      {/* Toast */}
      <Toast toast={toast} />

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white mt-16 py-8 px-4 sm:px-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-950">MONO.STUDIO</span>
            <span>•</span>
            <span>Vercel Frontend + Heroku Node.js/PostgreSQL Ready</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Payment: Cash on Delivery (COD)</span>
            <span>•</span>
            <span className="text-pink-700 font-medium">bKash Webhook & API Ready in Backend</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


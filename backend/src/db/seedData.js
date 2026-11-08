// Realistic pre-seeded demo items
const DEMO_PRODUCTS = [
  {
    title: 'Heavyweight Oversized Hoodie',
    subtitle: '480GSM French Terry • Drop Shoulder',
    price: 3200,
    discount_price: 2650,
    is_clothing: true,
    category: 'Clothing',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    stock: 24,
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
    crop_meta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    title: 'Matte Black Everyday Backpack',
    subtitle: 'Ballistic Nylon • 16" Laptop Compartment',
    price: 4500,
    discount_price: 3800,
    is_clothing: false,
    category: 'Gear',
    sizes: [], // Non-clothing: strictly empty
    featured: true,
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    crop_meta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    title: 'Vintage Washed Cargo Pants',
    subtitle: 'Relaxed Ripstop Weave • 6-Pocket Utility',
    price: 2950,
    discount_price: null,
    is_clothing: true,
    category: 'Clothing',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    stock: 18,
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85',
    crop_meta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    title: 'Minimalist Leather Cardholder',
    subtitle: 'Full-Grain Vegetable Tanned • RFID Shield',
    price: 1650,
    discount_price: null,
    is_clothing: false,
    category: 'Accessories',
    sizes: [],
    featured: false,
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85',
    crop_meta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    title: 'Minimalist Oxford Shirt',
    subtitle: 'Organic Combed Cotton • Boxy Tailored Fit',
    price: 2450,
    discount_price: 2100,
    is_clothing: true,
    category: 'Clothing',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85',
    crop_meta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    title: 'Stainless Insulated Tumbler',
    subtitle: 'Double-Wall Vacuum • 500ml Matte Powder Coat',
    price: 1850,
    discount_price: 1490,
    is_clothing: false,
    category: 'Gear',
    sizes: [],
    featured: false,
    stock: 52,
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85',
    crop_meta: { zoom: 1, panX: 0, panY: 0 }
  }
];

const DEMO_COUPONS = [
  { code: 'WINTER15', discount_percent: 15, active: true, description: 'Seasonal Campaign 15% Off' },
  { code: 'WELCOME10', discount_percent: 10, active: true, description: 'First Order 10% Welcome Discount' },
  { code: 'VIP25', discount_percent: 25, active: false, description: 'VIP Flash Code (Currently Deactivated)' }
];

const DEMO_CAMPAIGN = {
  active: true,
  badge: 'SEASONAL DROP',
  headline: 'WINTER DROP CAMPAIGN — Up to 25% OFF Selected Items',
  subtext: 'Minimalist essentials crafted for everyday utility. Free shipping on orders over ৳5,000.',
  promo_code: 'WINTER15'
};

const DEMO_ORDERS = [
  {
    id: 'ORD-9041',
    customer_name: 'Tanvir Ahmed',
    phone: '01711-893412',
    address: 'House 42, Road 11, Banani',
    area: 'Dhaka Metro',
    items: [
      { id: 1, title: 'Heavyweight Oversized Hoodie', isClothing: true, size: 'L', qty: 1, price: 2650 },
      { id: 4, title: 'Minimalist Leather Cardholder', isClothing: false, size: null, qty: 1, price: 1650 }
    ],
    coupon_code: 'WINTER15',
    discount_amount: 667,
    delivery_fee: 60,
    total: 3843,
    payment_method: 'COD',
    payment_status: 'UNPAID_COD',
    status: 'Confirmed'
  }
];

module.exports = {
  DEMO_PRODUCTS,
  DEMO_COUPONS,
  DEMO_CAMPAIGN,
  DEMO_ORDERS
};

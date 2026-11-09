// Realistic pre-seeded demo items for PerfumeGo
const DEMO_PRODUCTS = [
  {
    title: 'Oud Royale Extrait de Parfum',
    subtitle: 'Pure Cambodian Oud • Damask Rose • Smoked Amber',
    price: 5800,
    discount_price: 4950,
    is_clothing: false,
    category: 'Fragrances',
    sizes: ['50ml', '100ml'],
    attributes: {
      name: 'Volume',
      options: [
        { name: '50ml', price: 4950, stock: 15 },
        { name: '100ml', price: 7800, stock: 9 }
      ]
    },
    featured: true,
    stock: 24,
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85',
    crop_meta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    title: 'Velvet Santal Eau de Parfum',
    subtitle: 'Australian Sandalwood • Cardamom • Tuscan Leather',
    price: 4200,
    discount_price: 3650,
    is_clothing: false,
    category: 'Fragrances',
    sizes: ['50ml', '100ml'],
    attributes: {
      name: 'Volume',
      options: [
        { name: '50ml', price: 3650, stock: 12 },
        { name: '100ml', price: 5400, stock: 6 }
      ]
    },
    featured: true,
    stock: 18,
    image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85',
    crop_meta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    title: 'Signature PerfumeGo Embroidered Hoodie',
    subtitle: '480GSM French Terry • Gold Crest Monogram Embroidery',
    price: 3450,
    discount_price: 2850,
    is_clothing: true,
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL'],
    attributes: {
      name: 'Size',
      options: [
        { name: 'S', price: null, stock: 5 },
        { name: 'M', price: null, stock: 10 },
        { name: 'L', price: null, stock: 7 },
        { name: 'XL', price: null, stock: 3 }
      ]
    },
    featured: true,
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
    crop_meta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    title: 'Imperial Amber Noir',
    subtitle: 'Bourbon Vanilla • Black Amber • Tonka Bean',
    price: 3850,
    discount_price: null,
    is_clothing: false,
    category: 'Fragrances',
    sizes: ['30ml', '50ml', '100ml'],
    attributes: {
      name: 'Volume',
      options: [
        { name: '30ml', price: 2800 },
        { name: '50ml', price: 3850 },
        { name: '100ml', price: 5900 }
      ]
    },
    featured: false,
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85',
    crop_meta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    title: 'Discovery Quintet Gift Set',
    subtitle: 'Curated 5 x 10ml Travel Sprays in Luxury Velvet Box',
    price: 2950,
    discount_price: 2450,
    is_clothing: false,
    category: 'Gift Sets',
    sizes: ['Standard 5x10ml'],
    attributes: {
      name: 'Set Type',
      options: [
        { name: 'Standard 5x10ml', price: 2450 },
        { name: 'Deluxe Edition with Leather Case', price: 3450 }
      ]
    },
    featured: false,
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=900&q=85',
    crop_meta: { zoom: 1, panX: 0, panY: 0 }
  },
  {
    title: 'PerfumeGo Crest Minimalist Heavy Tee',
    subtitle: '280GSM Organic Combed Cotton • Gold Foil PG Monogram',
    price: 1650,
    discount_price: null,
    is_clothing: true,
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL'],
    attributes: {
      name: 'Size',
      options: [
        { name: 'S', price: null },
        { name: 'M', price: null },
        { name: 'L', price: null },
        { name: 'XL', price: null }
      ]
    },
    featured: false,
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=85',
    crop_meta: { zoom: 1, panX: 0, panY: 0 }
  }
];

const DEMO_COUPONS = [
  { code: 'ROYAL15', discount_percent: 15, active: true, description: 'Grand Launch 15% Off Fragrances' },
  { code: 'WELCOME10', discount_percent: 10, active: true, description: 'First Order 10% Welcome Discount' },
  { code: 'VIP25', discount_percent: 25, active: false, description: 'VIP Flash Code (Currently Deactivated)' }
];

const DEMO_CAMPAIGN = {
  active: true,
  badge: 'ROYAL DROP',
  headline: 'PERFUMEGO GRAND LAUNCH — Complimentary Delivery on all Fragrances',
  subtext: 'Handcrafted luxury extraits with pure botanical distillations. Exclusive 15% discount code.',
  promo_code: 'ROYAL15'
};

const DEMO_ORDERS = [
  {
    id: 'ORD-9041',
    customer_name: 'Tanvir Ahmed',
    phone: '01711-893412',
    address: 'House 42, Road 11, Banani',
    area: 'Dhaka Metro',
    items: [
      { id: 1, title: 'Oud Royale Extrait de Parfum (100ml)', isClothing: false, size: '100ml', qty: 1, price: 7800 },
      { id: 3, title: 'Signature PerfumeGo Embroidered Hoodie (L)', isClothing: true, size: 'L', qty: 1, price: 2850 }
    ],
    coupon_code: 'ROYAL15',
    discount_amount: 1597,
    delivery_fee: 60,
    total: 9113,
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

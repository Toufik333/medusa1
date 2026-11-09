import React, { useState, useRef } from 'react';
import {
  Crop,
  Upload,
  RefreshCw,
  Move,
  ZoomIn,
  Check,
  CheckCircle2,
  Star,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import ProductImageFrame from '../ProductImageFrame';
import { formatPrice } from '../ProductCard';

const SAMPLE_STOCK_PHOTOS = [
  { label: 'Oud Royale Extrait (Fragrance)', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85' },
  { label: 'Velvet Santal Bottle (Fragrance)', url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85' },
  { label: 'PerfumeGo Crest Hoodie (Clothing)', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85' },
  { label: 'Luxury Amber Noir (Fragrance)', url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85' },
  { label: 'Discovery Gift Set (Fragrance)', url: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=900&q=85' },
  { label: 'Signature Monogram Tee (Clothing)', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=85' }
];

const ALL_SIZES = ['S', 'M', 'L', 'XL'];

export default function ProductManager({
  products,
  onSaveProduct,
  onDeleteProduct,
  onToggleFeatured,
  showToast
}) {
  const [editingProductId, setEditingProductId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDiscountPrice, setFormDiscountPrice] = useState('');
  const [formIsClothing, setFormIsClothing] = useState(false);
  const [formCategory, setFormCategory] = useState('Fragrances');
  const [formSizes, setFormSizes] = useState([]);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formStock, setFormStock] = useState('25');

  // 4:5 Image Cropper State
  const [rawImageUrl, setRawImageUrl] = useState(SAMPLE_STOCK_PHOTOS[0].url);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropPanX, setCropPanX] = useState(0);
  const [cropPanY, setCropPanY] = useState(0);
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setEditingProductId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormPrice('');
    setFormDiscountPrice('');
    setFormIsClothing(false);
    setFormCategory('Fragrances');
    setFormSizes([]);
    setFormFeatured(false);
    setFormStock('25');
    setRawImageUrl(SAMPLE_STOCK_PHOTOS[0].url);
    setCropZoom(1);
    setCropPanX(0);
    setCropPanY(0);
  };

  const handleStartEdit = (product) => {
    setEditingProductId(product.id);
    setFormTitle(product.title);
    setFormSubtitle(product.subtitle || '');
    setFormPrice(String(product.price));
    setFormDiscountPrice(product.discountPrice ? String(product.discountPrice) : '');
    setFormIsClothing(Boolean(product.isClothing));
    setFormCategory(product.category || (product.isClothing ? 'Apparel' : 'Fragrances'));
    setFormSizes(product.isClothing && product.sizes?.length ? product.sizes : (product.isClothing ? ['S', 'M', 'L', 'XL'] : []));
    setFormFeatured(Boolean(product.featured));
    setFormStock(String(product.stock || 20));
    setRawImageUrl(product.imageUrl);
    setCropZoom(product.cropMeta?.zoom || 1);
    setCropPanX(product.cropMeta?.panX || 0);
    setCropPanY(product.cropMeta?.panY || 0);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleToggleClothing = (isClothing) => {
    setFormIsClothing(isClothing);
    if (isClothing) {
      setFormCategory('Apparel');
      if (formSizes.length === 0) setFormSizes(['S', 'M', 'L', 'XL']);
    } else {
      if (formCategory === 'Apparel' || formCategory === 'Clothing') setFormCategory('Fragrances');
      setFormSizes([]); // Non-clothing: sizes strictly empty & hidden
    }
  };

  // Image Upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setRawImageUrl(ev.target.result);
        setCropZoom(1);
        setCropPanX(0);
        setCropPanY(0);
      }
    };
    reader.readAsDataURL(file);
  };

  // Pointer drag events for 4:5 frame
  const handleCropPointerDown = (e) => {
    setIsDraggingCrop(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      panX: cropPanX,
      panY: cropPanY
    };
  };

  const handleCropPointerMove = (e) => {
    if (!isDraggingCrop) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = (clientX - dragStartRef.current.x) * 0.18;
    const dy = (clientY - dragStartRef.current.y) * 0.18;
    setCropPanX(Math.max(-40, Math.min(40, Math.round(dragStartRef.current.panX + dx))));
    setCropPanY(Math.max(-40, Math.min(40, Math.round(dragStartRef.current.panY + dy))));
  };

  const handleCropPointerUp = () => {
    setIsDraggingCrop(false);
  };

  // Export 4:5 image via Canvas
  const exportCropped4x5Image = () => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const targetW = 800;
          const targetH = 1000; // Strict 4:5
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');

          ctx.fillStyle = '#f5f5f5';
          ctx.fillRect(0, 0, targetW, targetH);

          const imgRatio = img.width / img.height;
          const targetRatio = targetW / targetH;
          let drawW = targetW;
          let drawH = targetH;

          if (imgRatio > targetRatio) {
            drawH = targetH;
            drawW = targetH * imgRatio;
          } else {
            drawW = targetW;
            drawH = targetW / imgRatio;
          }

          ctx.save();
          ctx.translate(targetW / 2, targetH / 2);
          ctx.scale(cropZoom, cropZoom);
          ctx.translate((cropPanX / 100) * targetW, (cropPanY / 100) * targetH);
          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();

          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          resolve({
            imageUrl: dataUrl,
            cropMeta: { zoom: 1, panX: 0, panY: 0 }
          });
        } catch (err) {
          resolve({
            imageUrl: rawImageUrl,
            cropMeta: { zoom: cropZoom, panX: cropPanX, panY: cropPanY }
          });
        }
      };
      img.onerror = () => {
        resolve({
          imageUrl: rawImageUrl,
          cropMeta: { zoom: cropZoom, panX: cropPanX, panY: cropPanY }
        });
      };
      img.src = rawImageUrl;
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPrice) {
      showToast('Product title and price are required.', 'error');
      return;
    }
    if (formIsClothing && formSizes.length === 0) {
      showToast('Please select at least one clothing size (S, M, L, XL).', 'error');
      return;
    }

    const { imageUrl: finalImg, cropMeta: finalCrop } = await exportCropped4x5Image();

    const payload = {
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || (formIsClothing ? 'Tailored Studio Apparel' : 'Everyday Studio Utility'),
      price: Number(formPrice),
      discountPrice: formDiscountPrice ? Number(formDiscountPrice) : null,
      isClothing: formIsClothing,
      category: formCategory,
      sizes: formIsClothing ? formSizes : [],
      featured: formFeatured,
      stock: Number(formStock) || 15,
      imageUrl: finalImg,
      cropMeta: finalCrop
    };

    await onSaveProduct(editingProductId, payload);
    resetForm();
  };

  return (
    <div className="space-y-8">
      {/* Product Create / Edit Box */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
          <div>
            <h2 className="text-lg font-bold">
              {editingProductId ? 'Edit Product Post' : 'Create Customizable Product Post'}
            </h2>
            <p className="text-xs text-neutral-500">
              Toggle Clothing ON to enable S/M/L/XL size options, or OFF to hide sizes completely.
            </p>
          </div>
          {editingProductId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" /> Cancel Editing
            </button>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Metadata & Conditional Clothing Logic */}
          <div className="lg:col-span-5 space-y-5">
            {/* Classification Toggle */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                1. Product Classification (Controls Size Options)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleClothing(true)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                    formIsClothing
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="font-bold">Clothing / Apparel</div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    Enables S, M, L, XL selector
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleClothing(false)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                    !formIsClothing
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="font-bold">Non-Clothing Object</div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    Hides size options completely
                  </div>
                </button>
              </div>
            </div>

            {/* Conditional Sizing Area */}
            {formIsClothing ? (
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    Available Clothing Sizes
                  </span>
                  <span className="text-[11px] text-amber-800 font-medium">
                    Visible on Storefront
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {ALL_SIZES.map((sz) => {
                    const checked = formSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          setFormSizes((prev) =>
                            prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
                          );
                        }}
                        className={`py-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          checked
                            ? 'bg-neutral-950 text-white border-neutral-950'
                            : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3" />}
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-600 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Non-Clothing selected:</strong> Size options are hidden in both this form and the customer storefront card.
                </span>
              </div>
            )}

            {/* Title & Subtitle */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={formIsClothing ? 'e.g., Heavyweight Oversized Hoodie' : 'e.g., Matte Black Everyday Backpack'}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Subtitle / Material Spec
                </label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="e.g., 480GSM French Terry • Drop Shoulder"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-950"
                />
              </div>
            </div>

            {/* Price & Discount */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Regular Price (৳) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="3200"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-950"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Discount Price (৳ Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formDiscountPrice}
                  onChange={(e) => setFormDiscountPrice(e.target.value)}
                  placeholder="2650"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-950"
                />
              </div>
            </div>

            {/* Category & Stock */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Store Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm bg-white focus:outline-none focus:border-neutral-950 cursor-pointer"
                >
                  <option value="Fragrances">Fragrances</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Gift Sets">Gift Sets</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Clothing">Clothing</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={formStock}
                  onChange={(e) => setFormStock(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-neutral-950"
                />
              </div>
            </div>

            {/* Featured Board Pin */}
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition">
              <div className="flex items-center gap-2.5">
                <Star
                  className={`w-4 h-4 ${
                    formFeatured ? 'fill-amber-400 text-amber-400' : 'text-neutral-400'
                  }`}
                />
                <div>
                  <span className="text-xs font-bold block">Pin to Featured Board</span>
                  <span className="text-[11px] text-neutral-500">
                    Highlights this item in the curated top section
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formFeatured}
                onChange={(e) => setFormFeatured(e.target.checked)}
                className="w-4 h-4 accent-neutral-950 rounded cursor-pointer"
              />
            </label>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl bg-neutral-950 text-white font-semibold text-sm hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>
                {editingProductId
                  ? 'Save Changes & Apply 4:5 Crop'
                  : 'Publish Product with 4:5 Crop'}
              </span>
            </button>
          </div>

          {/* Right Column: 4:5 Cropper & Card Alignment Preview */}
          <div className="lg:col-span-7 bg-neutral-50 rounded-2xl p-5 border border-neutral-200/90 flex flex-col justify-between space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Crop className="w-4 h-4 text-neutral-900" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    2. Uniform 4:5 Image Cropper & Card Alignment
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Every photo is locked to 4:5 ratio so no card ever looks larger or misaligned.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-neutral-950 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-neutral-800 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCropZoom(1);
                    setCropPanX(0);
                    setCropPanY(0);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs text-neutral-600 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
                  title="Reset Zoom & Pan"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* URL input + Demo presets */}
            <div className="space-y-2">
              <input
                type="text"
                value={rawImageUrl}
                onChange={(e) => setRawImageUrl(e.target.value)}
                placeholder="Paste image URL or click Upload Photo above..."
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-xs focus:outline-none focus:border-neutral-950"
              />
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-neutral-400 mr-1">Sample Photos:</span>
                {SAMPLE_STOCK_PHOTOS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setRawImageUrl(preset.url);
                      setCropZoom(1);
                      setCropPanX(0);
                      setCropPanY(0);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Side-by-side: Interactive Crop & Live Card Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              {/* Interactive Frame */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-medium text-neutral-600">
                  <span className="flex items-center gap-1">
                    <Move className="w-3 h-3" /> Drag inside frame to pan
                  </span>
                  <span className="font-mono text-emerald-700 font-semibold">4:5 LOCKED</span>
                </div>

                <div
                  onMouseDown={handleCropPointerDown}
                  onMouseMove={handleCropPointerMove}
                  onMouseUp={handleCropPointerUp}
                  onMouseLeave={handleCropPointerUp}
                  onTouchStart={handleCropPointerDown}
                  onTouchMove={handleCropPointerMove}
                  onTouchEnd={handleCropPointerUp}
                  className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 cursor-move border-2 border-neutral-950 select-none shadow-inner"
                >
                  <img
                    src={rawImageUrl}
                    alt="Crop source"
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none"
                    style={{
                      transform: `scale(${cropZoom}) translate(${cropPanX}%, ${cropPanY}%)`,
                      transformOrigin: 'center center'
                    }}
                  />
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    <div className="border-r border-b border-white/25" />
                    <div className="border-r border-b border-white/25" />
                    <div className="border-b border-white/25" />
                    <div className="border-r border-b border-white/25" />
                    <div className="border-r border-b border-white/25" />
                    <div className="border-b border-white/25" />
                    <div className="border-r border-white/25" />
                    <div className="border-r border-white/25" />
                    <div />
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                    {Math.round(cropZoom * 100)}% • X:{cropPanX} Y:{cropPanY}
                  </div>
                </div>

                {/* Range Sliders */}
                <div className="space-y-2 bg-white p-3 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-2">
                    <ZoomIn className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="text-[11px] font-medium w-12">Zoom</span>
                    <input
                      type="range"
                      min="1"
                      max="2.5"
                      step="0.05"
                      value={cropZoom}
                      onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                      className="w-full accent-neutral-950 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Move className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="text-[11px] font-medium w-12">Pan X</span>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      step="1"
                      value={cropPanX}
                      onChange={(e) => setCropPanX(parseInt(e.target.value, 10))}
                      className="w-full accent-neutral-950 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Move className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="text-[11px] font-medium w-12">Pan Y</span>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      step="1"
                      value={cropPanY}
                      onChange={(e) => setCropPanY(parseInt(e.target.value, 10))}
                      className="w-full accent-neutral-950 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-medium text-neutral-600">
                  <span>Live Storefront Card Preview</span>
                  <span className="text-emerald-700 font-semibold">Uniform 4:5 Aligned</span>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                  <ProductImageFrame
                    src={rawImageUrl}
                    alt="Live preview"
                    cropMeta={{ zoom: cropZoom, panX: cropPanX, panY: cropPanY }}
                    featured={formFeatured}
                    badge={
                      formDiscountPrice && Number(formDiscountPrice) < Number(formPrice)
                        ? 'SALE'
                        : null
                    }
                  />
                  <div className="p-3.5 space-y-2">
                    <div className="text-[10px] uppercase tracking-widest text-neutral-400">
                      {formCategory} {formIsClothing ? '• Apparel' : '• Object'}
                    </div>
                    <div className="font-semibold text-xs text-neutral-900 truncate">
                      {formTitle || 'Untitled Product Post'}
                    </div>
                    <div className="text-sm font-bold text-neutral-950">
                      {formatPrice(formDiscountPrice || formPrice || 3200)}
                    </div>
                    {formIsClothing ? (
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {(formSizes.length ? formSizes : ['S', 'M', 'L', 'XL']).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] py-1 text-center rounded bg-neutral-100 font-semibold text-neutral-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[10px] py-1 px-2 rounded bg-neutral-50 text-neutral-400 border border-neutral-100">
                        Size selector hidden (Non-Clothing)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="font-bold text-base">Storefront Inventory ({products.length})</h3>
          <span className="text-xs text-neutral-500">
            Click star icon to pin/unpin to Featured Board
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Item (4:5)</th>
                <th className="py-3 px-4">Type & Sizes</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/80">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 text-xs">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-neutral-400">{p.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {p.isClothing ? (
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 text-white text-[10px] font-medium mr-1">
                          Clothing
                        </span>
                        {p.sizes?.map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-mono text-[10px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 text-[11px]">
                        Non-Clothing (Sizes Hidden)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {p.discountPrice ? (
                      <div>
                        <span className="text-emerald-700 font-bold">
                          {formatPrice(p.discountPrice)}
                        </span>
                        <span className="text-neutral-400 line-through ml-1.5">
                          {formatPrice(p.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold">{formatPrice(p.price)}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleFeatured(p.id)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        p.featured
                          ? 'bg-amber-50 border-amber-300 text-amber-600'
                          : 'bg-white border-neutral-200 text-neutral-400 hover:text-neutral-700'
                      }`}
                      title="Toggle Featured Board"
                    >
                      <Star
                        className={`w-4 h-4 ${p.featured ? 'fill-amber-400' : ''}`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(p)}
                        className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                        title="Edit Product & Crop"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg border border-neutral-200 hover:bg-rose-50 hover:border-rose-200 text-rose-600 cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


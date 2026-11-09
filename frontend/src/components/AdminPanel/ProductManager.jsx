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
  X,
  Plus,
  Sliders,
  Sparkles
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

  // Custom Attributes & Options State
  const [attributeEnabled, setAttributeEnabled] = useState(true);
  const [attributeName, setAttributeName] = useState('Volume');
  const [attributeOptions, setAttributeOptions] = useState([
    { id: 1, name: '50ml', price: '', stock: '15' },
    { id: 2, name: '100ml', price: '', stock: '10' }
  ]);

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
    setAttributeEnabled(true);
    setAttributeName('Volume');
    setAttributeOptions([
      { id: 1, name: '50ml', price: '', stock: '15' },
      { id: 2, name: '100ml', price: '', stock: '10' }
    ]);
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
    setFormStock(String(product.stock !== undefined && product.stock !== null ? product.stock : 0));

    // Populate custom attributes
    if (product.attributes && Array.isArray(product.attributes.options) && product.attributes.options.length > 0) {
      setAttributeEnabled(true);
      setAttributeName(product.attributes.name || 'Volume');
      setAttributeOptions(
        product.attributes.options.map((opt, idx) => ({
          id: idx + 1,
          name: typeof opt === 'object' ? opt.name : String(opt),
          price: typeof opt === 'object' && opt.price ? String(opt.price) : '',
          stock: typeof opt === 'object' && opt.stock !== undefined && opt.stock !== null ? String(opt.stock) : ''
        }))
      );
    } else if (product.isClothing && Array.isArray(product.sizes) && product.sizes.length > 0) {
      setAttributeEnabled(true);
      setAttributeName('Size');
      setAttributeOptions(
        product.sizes.map((s, idx) => ({
          id: idx + 1,
          name: s,
          price: '',
          stock: '10'
        }))
      );
    } else {
      setAttributeEnabled(false);
      setAttributeName('Volume');
      setAttributeOptions([]);
    }

    setRawImageUrl(product.imageUrl);
    setCropZoom(product.cropMeta?.zoom || 1);
    setCropPanX(product.cropMeta?.panX || 0);
    setCropPanY(product.cropMeta?.panY || 0);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Quick Preset Handlers
  const applyPerfumePreset = () => {
    setAttributeEnabled(true);
    setAttributeName('Volume');
    setAttributeOptions([
      { id: 1, name: '50ml', price: '', stock: '15' },
      { id: 2, name: '100ml', price: '', stock: '10' }
    ]);
    setFormIsClothing(false);
    setFormCategory('Fragrances');
  };

  const applyClothingPreset = () => {
    setAttributeEnabled(true);
    setAttributeName('Size');
    setAttributeOptions([
      { id: 1, name: 'S', price: '', stock: '5' },
      { id: 2, name: 'M', price: '', stock: '10' },
      { id: 3, name: 'L', price: '', stock: '8' },
      { id: 4, name: 'XL', price: '', stock: '4' }
    ]);
    setFormIsClothing(true);
    setFormCategory('Apparel');
  };

  const applySamplesPreset = () => {
    setAttributeEnabled(true);
    setAttributeName('Bottle Size');
    setAttributeOptions([
      { id: 1, name: '2ml Sample', price: '', stock: '20' },
      { id: 2, name: '5ml Travel Spray', price: '', stock: '15' },
      { id: 3, name: '10ml Decant', price: '', stock: '10' }
    ]);
    setFormIsClothing(false);
    setFormCategory('Fragrances');
  };

  const applyNoAttributesPreset = () => {
    setAttributeEnabled(false);
    setAttributeOptions([]);
    setFormIsClothing(false);
  };

  const handleAddAttributeOption = () => {
    setAttributeOptions((prev) => [
      ...prev,
      { id: Date.now(), name: '', price: '', stock: '10' }
    ]);
  };

  const handleUpdateOption = (id, field, val) => {
    setAttributeOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, [field]: val } : opt))
    );
  };

  const handleRemoveOption = (id) => {
    setAttributeOptions((prev) => prev.filter((opt) => opt.id !== id));
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

    const validOptions = attributeEnabled
      ? attributeOptions
          .filter((opt) => opt.name && opt.name.trim().length > 0)
          .map((opt) => ({
            name: opt.name.trim(),
            price: opt.price !== undefined && opt.price !== '' && !isNaN(Number(opt.price)) && Number(opt.price) > 0 ? Number(opt.price) : null,
            stock: opt.stock !== undefined && opt.stock !== '' && !isNaN(Number(opt.stock)) ? Math.max(0, parseInt(opt.stock, 10)) : null
          }))
      : [];

    const isApparel = formIsClothing || attributeName.toLowerCase().includes('size') || formCategory === 'Apparel' || formCategory === 'Clothing';

    if (isApparel && attributeEnabled && validOptions.length === 0) {
      showToast('Please specify at least one size/option for clothing.', 'error');
      return;
    }

    const { imageUrl: finalImg, cropMeta: finalCrop } = await exportCropped4x5Image();

    const attributesPayload = attributeEnabled && validOptions.length > 0
      ? {
          name: attributeName.trim() || 'Option',
          options: validOptions
        }
      : null;

    const hasOptionStock = validOptions.some((o) => o.stock !== null);
    const calculatedStock = hasOptionStock
      ? validOptions.reduce((acc, o) => acc + (o.stock || 0), 0)
      : (formStock !== '' && !isNaN(Number(formStock)) ? Math.max(0, parseInt(formStock, 10)) : 0);

    const payload = {
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || (isApparel ? 'Tailored Studio Apparel' : 'Everyday Studio Utility'),
      price: Number(formPrice),
      discountPrice: formDiscountPrice ? Number(formDiscountPrice) : null,
      isClothing: isApparel,
      category: formCategory,
      sizes: isApparel && validOptions.length > 0 ? validOptions.map((o) => o.name) : (formSizes.length > 0 ? formSizes : []),
      attributes: attributesPayload,
      featured: formFeatured,
      stock: calculatedStock,
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
              Configure product details, custom variations (Volume / ML / Size) with optional custom pricing, and 4:5 image.
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
          {/* Left Column: Metadata & Custom Attributes Logic */}
          <div className="lg:col-span-5 space-y-5">
            {/* Custom Attributes & Variations Manager */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/90 space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-600" />
                  <span>1. Attributes & Variations (ML / Size)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAttributeEnabled(!attributeEnabled)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer transition ${
                    attributeEnabled
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                  }`}
                >
                  {attributeEnabled ? 'Enabled' : 'Disabled (Single Size)'}
                </button>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                  Quick Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={applyPerfumePreset}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-900 font-medium transition cursor-pointer"
                  >
                    💧 Perfume Volume (50ml / 100ml)
                  </button>
                  <button
                    type="button"
                    onClick={applyClothingPreset}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-900 font-medium transition cursor-pointer"
                  >
                    👕 Clothing (S, M, L, XL)
                  </button>
                  <button
                    type="button"
                    onClick={applySamplesPreset}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-900 font-medium transition cursor-pointer"
                  >
                    🧪 Samples (2ml, 5ml, 10ml)
                  </button>
                  <button
                    type="button"
                    onClick={applyNoAttributesPreset}
                    className="text-[11px] px-2 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-800 cursor-pointer"
                  >
                    🚫 Single Spec
                  </button>
                </div>
              </div>

              {/* Attributes Editor Form */}
              {attributeEnabled ? (
                <div className="space-y-3 pt-2 border-t border-neutral-200">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                      Attribute Label (e.g., Volume, Size, Edition)
                    </label>
                    <input
                      type="text"
                      value={attributeName}
                      onChange={(e) => setAttributeName(e.target.value)}
                      placeholder="e.g., Volume (ml) or Size"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-xs focus:outline-none focus:border-neutral-950"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-700">
                      <span>Variation Options, Custom Price (৳) & Stock</span>
                      <span className="text-[10px] text-neutral-400 font-normal">
                        Per-variant stock & price
                      </span>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {attributeOptions.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt.name}
                            onChange={(e) => handleUpdateOption(opt.id, 'name', e.target.value)}
                            placeholder="Option name (e.g. 50ml, 100ml)"
                            className="flex-1 min-w-[100px] px-2.5 py-1.5 rounded-lg bg-white border border-neutral-300 text-xs focus:outline-none focus:border-neutral-950"
                          />
                          <div className="relative w-28 shrink-0">
                            <span className="absolute left-2.5 top-1.5 text-xs text-neutral-400">৳</span>
                            <input
                              type="number"
                              min="0"
                              value={opt.price}
                              onChange={(e) => handleUpdateOption(opt.id, 'price', e.target.value)}
                              placeholder={formDiscountPrice || formPrice || 'Base'}
                              className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-white border border-neutral-300 text-xs focus:outline-none focus:border-neutral-950"
                              title="Optional price override"
                            />
                          </div>
                          <div className="relative w-24 shrink-0">
                            <input
                              type="number"
                              min="0"
                              value={opt.stock}
                              onChange={(e) => handleUpdateOption(opt.id, 'stock', e.target.value)}
                              placeholder="Stock"
                              className={`w-full px-2.5 py-1.5 rounded-lg bg-white border text-xs focus:outline-none focus:border-neutral-950 ${
                                opt.stock === '0' || opt.stock === 0 ? 'border-rose-300 bg-rose-50/50 text-rose-700 font-bold' : 'border-neutral-300'
                              }`}
                              title="Stock quantity for this variation (set 0 for out of stock)"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(opt.id)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer shrink-0"
                            title="Remove option"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-neutral-500">
                        {attributeOptions.some((o) => o.stock !== '' && o.stock !== undefined) ? (
                          <>Total variant stock: <strong>{attributeOptions.reduce((acc, o) => acc + (parseInt(o.stock, 10) || 0), 0)} units</strong></>
                        ) : (
                          <>Uses product base stock if variant stock is blank</>
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddAttributeOption}
                      className="w-full py-1.5 rounded-lg bg-white border border-dashed border-neutral-300 text-xs font-semibold text-neutral-700 hover:border-neutral-900 hover:text-neutral-950 flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Another Option</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-white border border-neutral-200 text-xs text-neutral-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Single spec product. No size/volume pills will be shown.</span>
                </div>
              )}
            </div>

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
                    {attributeEnabled && attributeOptions.length > 0 ? (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] text-neutral-500 font-medium">{attributeName || 'Option'}:</span>
                        <div className="flex flex-wrap gap-1">
                          {attributeOptions.map((opt) => (
                            <span
                              key={opt.id}
                              className="text-[10px] py-0.5 px-2 rounded bg-neutral-100 border border-neutral-200 font-medium text-neutral-800"
                            >
                              {opt.name || '...'}
                              {opt.price ? ` (${formatPrice(opt.price)})` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] py-1 px-2 rounded bg-neutral-50 text-neutral-400 border border-neutral-100">
                        Single spec (No attributes)
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
                <th className="py-3 px-4">Type, Variations & Variant Stock</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4">Total Stock</th>
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
                    {p.attributes?.options?.length > 0 ? (
                      <div className="space-y-1">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                          {p.attributes.name || 'Attributes'}
                        </span>
                        <div className="flex flex-wrap items-center gap-1">
                          {p.attributes.options.map((opt, i) => {
                            const optName = typeof opt === 'object' ? opt.name : opt;
                            const optPrice = typeof opt === 'object' && opt.price ? ` (${formatPrice(opt.price)})` : '';
                            const optStock = typeof opt === 'object' && opt.stock !== null && opt.stock !== undefined ? opt.stock : null;
                            const isOptOut = optStock !== null && Number(optStock) <= 0;
                            return (
                              <span
                                key={i}
                                className={`px-1.5 py-0.5 rounded border text-[10px] font-medium ${
                                  isOptOut
                                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                                    : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                                }`}
                              >
                                {optName}{optPrice}
                                {optStock !== null ? (
                                  <span className={`ml-1 font-bold ${isOptOut ? 'text-rose-600' : 'text-neutral-500'}`}>
                                    [{isOptOut ? 'OUT OF STOCK' : `${optStock} in stock`}]
                                  </span>
                                ) : ''}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ) : p.isClothing && p.sizes?.length ? (
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 text-white text-[10px] font-medium mr-1">
                          Clothing
                        </span>
                        {p.sizes.map((s) => (
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
                        Single Spec
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
                    {p.stock <= 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                        Out of Stock (0)
                      </span>
                    ) : p.stock <= 5 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                        Low Stock ({p.stock})
                      </span>
                    ) : (
                      <span className="font-semibold text-neutral-800">
                        {p.stock} units
                      </span>
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


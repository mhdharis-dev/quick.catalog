import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Smartphone, 
  Package, 
  Grid2X2, 
  ClipboardList, 
  Palette, 
  QrCode, 
  BarChart3, 
  Settings as SettingsIcon, 
  Plus, 
  PlusCircle, 
  Search, 
  Bell, 
  Share2, 
  Copy, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Printer, 
  Check, 
  Sparkles, 
  Crown, 
  CheckCircle2, 
  ArrowLeft, 
  Upload, 
  Eye, 
  MessageCircle, 
  Phone, 
  TrendingUp, 
  Clock, 
  Shirt, 
  Footprints, 
  Headphones, 
  ShoppingBag, 
  Glasses, 
  Wrench, 
  Layers,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  RotateCcw,
  Building,
  Globe,
  MapPin,
  Mail,
  Calendar,
  Loader2,
  Save,
  X
} from 'lucide-react';

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YoutubeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.48V8.78a8.28 8.28 0 0 0 4.84 1.54V6.86a4.86 4.86 0 0 1-.94-.17z"/>
  </svg>
);

const WEEKDAYS = [
  { id: 'Mon', label: 'Mon', full: 'Monday' },
  { id: 'Tue', label: 'Tue', full: 'Tuesday' },
  { id: 'Wed', label: 'Wed', full: 'Wednesday' },
  { id: 'Thu', label: 'Thu', full: 'Thursday' },
  { id: 'Fri', label: 'Fri', full: 'Friday' },
  { id: 'Sat', label: 'Sat', full: 'Saturday' },
  { id: 'Sun', label: 'Sun', full: 'Sunday' }
];

const CURRENCIES = [
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: 'AED ', code: 'AED', name: 'UAE Dirham' },
  { symbol: 'SAR ', code: 'SAR', name: 'Saudi Riyal' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: 'QAR ', code: 'QAR', name: 'Qatari Riyal' },
  { symbol: 'KWD ', code: 'KWD', name: 'Kuwaiti Dinar' }
];

const STORE_CATEGORIES = [
  'Fashion & Apparel',
  'Footwear & Shoes',
  'Electronics & Gadgets',
  'Jewelry & Accessories',
  'Bags & Luggage',
  'Cosmetics & Beauty',
  'Grocery & Supermarket',
  'Restaurant & Cafe',
  'Furniture & Home Decor',
  'Automotive & Spares',
  'Services & Consulting',
  'Other Business'
];
import { 
  getProductsFromDb, 
  saveProductToDb, 
  deleteProductFromDb, 
  toggleProductStatusInDb, 
  getCategoriesFromDb, 
  saveCategoryToDb, 
  getOrdersFromDb, 
  updateOrderStatusInDb, 
  getCatalogsFromDb, 
  saveCatalogToDb, 
  getMerchantProfileFromDb, 
  saveMerchantProfileToDb,
  getMerchantLeads,
  updateLeadClassification,
  getMerchantAnalyticsStats
} from '../utils/firebase';
import { uploadToCloudinary } from '../utils/cloudinary';
import { formatPrice, encodeCatalog } from '../utils/codec';

// Optional starter items for merchants who want to seed their database
const STARTER_SAMPLE_PRODUCTS = [
  { id: 'prod_1', name: 'Cotton T-Shirt', desc: 'Premium quality cotton', price: '799', category: 'Clothing', status: true, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80' },
  { id: 'prod_2', name: 'Running Shoes', desc: 'Comfortable and stylish', price: '1,499', category: 'Footwear', status: true, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80' },
  { id: 'prod_3', name: 'Smart Watch', desc: 'Latest model series', price: '2,999', category: 'Electronics', status: true, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80' },
  { id: 'prod_4', name: 'Backpack', desc: 'Durable and spacious travel bag', price: '1,199', category: 'Bags', status: true, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop&q=80' },
  { id: 'prod_5', name: 'Sunglasses', desc: 'Trendy and UV protected', price: '899', category: 'Accessories', status: true, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&auto=format&fit=crop&q=80' },
  { id: 'prod_6', name: 'Wireless Earbuds', desc: 'Crystal clear sound & bass', price: '1,999', category: 'Electronics', status: true, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80' }
];

export default function Dashboard({ 
  user, 
  catalogs = [], 
  onEditCatalog, 
  onViewCatalog, 
  onDeleteCatalog, 
  onCreateNew, 
  onPrintQr, 
  onShareModal, 
  onShowToast, 
  onExitDashboard, 
  onUserUpdated 
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const merchantId = user?.id || 'default_merchant';

  // Business profile state
  const businessName = user?.businessName || user?.name || 'Haris Store';
  const initialCatalogUrl = catalogs[0]?.url || `${window.location.origin}/#demo`;
  const [liveCatalogUrl, setLiveCatalogUrl] = useState(initialCatalogUrl);
  const [isPublishing, setIsPublishing] = useState(false);
  const [autoSyncOnAdd, setAutoSyncOnAdd] = useState(true);

  // Products State loaded directly from Firebase database
  const [products, setProducts] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [isCloudinaryUploading, setIsCloudinaryUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('All');
  const [productStatusFilter, setProductStatusFilter] = useState('All');
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Clothing');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdStatus, setNewProdStatus] = useState(true);
  const [newProdImg, setNewProdImg] = useState('');
  const [newProdImgPublicId, setNewProdImgPublicId] = useState('');

  // Categories State
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Products', icon: 'all' },
    { id: 'clothing', name: 'Clothing', icon: 'shirt' },
    { id: 'footwear', name: 'Footwear', icon: 'footwear' },
    { id: 'electronics', name: 'Electronics', icon: 'headphones' },
    { id: 'bags', name: 'Bags', icon: 'bag' },
    { id: 'accessories', name: 'Accessories', icon: 'glasses' },
    { id: 'services', name: 'Services', icon: 'wrench' }
  ]);

  // Dynamic counts for categories based on active database inventory
  const dynamicCategories = useMemo(() => {
    return categories.map(cat => {
      if (cat.id === 'all') {
        return { ...cat, count: products.length };
      }
      const count = products.filter(p => (p.category || '').toLowerCase() === cat.name.toLowerCase()).length;
      return { ...cat, count };
    });
  }, [categories, products]);

  // Appearance State
  const [appearanceTheme, setAppearanceTheme] = useState('blue');
  const [appearanceBanner, setAppearanceBanner] = useState('');
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [appearanceToggles, setAppearanceToggles] = useState({
    searchBar: true,
    categories: true,
    descriptions: true,
    contactButtons: true
  });

  // Share & QR Tab Sub-toggle
  const [shareSubTab, setShareSubTab] = useState('link'); // 'link' | 'qr'

  // Settings Sub-tab & State
  const [settingsTab, setSettingsTab] = useState('business-info');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Custom social links input states
  const [newCustomLinkTitle, setNewCustomLinkTitle] = useState('');
  const [newCustomLinkUrl, setNewCustomLinkUrl] = useState('');

  const [businessSettings, setBusinessSettings] = useState({
    name: businessName,
    description: 'Quality products for a better you.',
    category: 'Fashion & Apparel',
    // Contact
    whatsapp: user?.mobile || '9876543210',
    phone: user?.phone || '9876543210',
    email: user?.email || '',
    address: user?.address || 'Ernakulam, Kerala',
    city: 'Kochi',
    pincode: '682001',
    googleMapsUrl: '',
    // Social Accounts
    instagram: '@harisstore',
    facebook: '',
    twitter: '',
    youtube: '',
    tiktok: '',
    website: '',
    customLinks: [], // Array of { id, title, url }
    // Working Schedule Builder
    schedulePreset: 'mon-sat', // 'everyday' | 'mon-sat' | 'mon-fri' | 'custom'
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    openTime: '09:00 AM',
    closeTime: '09:00 PM',
    isOpen24Hours: false,
    closedNote: 'Closed on Sundays',
    hours: 'Mon - Sat: 9:00 AM - 9:00 PM',
    // Preferences & Localization
    currency: '₹',
    logo: '',
    whatsappMessageTemplate: 'Hello! I would like to place an order from your catalog:'
  });

  // Orders & Real Leads State (Firestore Tracked)
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('All');
  const [leadsList, setLeadsList] = useState([]);
  const [leadFilter, setLeadFilter] = useState('All'); // 'All' | 'buyer' | 'inquiry' | 'spam'

  // Real Analytics State directly from Firestore events
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 0,
    totalLeads: 0,
    buyersCount: 0,
    spamCount: 0,
    inquiryCount: 0,
    leads: []
  });

  // Chart tooltip hover state
  const [hoveredChartPoint, setHoveredChartPoint] = useState(null);

  // Dynamic effective catalog URL
  const effectiveCatalogUrl = liveCatalogUrl || initialCatalogUrl;

  // Load from Firebase on component mount
  React.useEffect(() => {
    let isMounted = true;
    async function loadFirebaseData() {
      setLoadingDb(true);
      try {
        const [dbProds, dbCats, dbOrders, dbProfile, dbCatalogs, stats] = await Promise.all([
          getProductsFromDb(merchantId),
          getCategoriesFromDb(merchantId),
          getOrdersFromDb(merchantId),
          getMerchantProfileFromDb(merchantId),
          getCatalogsFromDb(merchantId),
          getMerchantAnalyticsStats(merchantId)
        ]);

        if (isMounted) {
          if (dbProds && dbProds.length > 0) {
            setProducts(dbProds);
          }
          if (dbCats && dbCats.length > 0) {
            setCategories(dbCats);
          }
          if (dbOrders && dbOrders.length > 0) {
            setOrders(dbOrders);
          }
          if (dbProfile) {
            setBusinessSettings(prev => ({ ...prev, ...dbProfile }));
            if (dbProfile.banner) setAppearanceBanner(dbProfile.banner);
            if (dbProfile.theme) setAppearanceTheme(dbProfile.theme);
          }
          if (dbCatalogs && dbCatalogs.length > 0) {
            setLiveCatalogUrl(dbCatalogs[0].url);
          }
          if (stats) {
            setAnalyticsData(stats);
            setLeadsList(stats.leads || []);
          }
        }
      } catch (err) {
        console.error('Initial load error:', err);
      } finally {
        if (isMounted) setLoadingDb(false);
      }
    }

    loadFirebaseData();
    return () => { isMounted = false; };
  }, [merchantId]);

  // Lead Classification Handler (Admin can tag: Buyer, Spam, General Inquiry)
  const handleLeadClassificationChange = async (leadId, classification) => {
    onShowToast?.(`Updating classification...`);
    const updated = await updateLeadClassification(merchantId, leadId, classification);
    setLeadsList(updated);
    setAnalyticsData(prev => ({
      ...prev,
      buyersCount: updated.filter(l => l.classification === 'buyer').length,
      spamCount: updated.filter(l => l.classification === 'spam').length,
      inquiryCount: updated.filter(l => l.classification === 'inquiry').length
    }));
    onShowToast?.(`Lead classified as ${classification.toUpperCase()}! 🎉`);
  };

  // Seed sample products into database
  const handleSeedStarterProducts = async () => {
    setLoadingDb(true);
    onShowToast?.('Adding sample products...');
    try {
      const seeded = [];
      for (const p of STARTER_SAMPLE_PRODUCTS) {
        const saved = await saveProductToDb(merchantId, p);
        seeded.push(saved);
      }
      setProducts(seeded);
      await handlePublishProductsToCatalog(seeded);
      onShowToast?.(`Added ${seeded.length} starter products! 🎉`);
    } catch (err) {
      console.error(err);
      onShowToast?.('Failed to seed starter products');
    } finally {
      setLoadingDb(false);
    }
  };

  // Publish / Sync products to live customer catalog
  const handlePublishProductsToCatalog = async (customItems = null) => {
    const list = customItems || (
      selectedProductIds.length > 0 
        ? products.filter(p => selectedProductIds.includes(p.id)) 
        : products.filter(p => p.status)
    );

    if (list.length === 0) {
      onShowToast?.('No active products available to publish');
      return;
    }

    setIsPublishing(true);
    try {
      const catalogObj = {
        business: {
          name: businessSettings.name || businessName,
          whatsapp: businessSettings.whatsapp || user?.mobile || '9876543210',
          phone: businessSettings.phone || user?.phone || '9876543210',
          address: businessSettings.address || user?.address || 'Ernakulam, Kerala',
          instagram: businessSettings.instagram || user?.instagram || '',
          theme: appearanceTheme,
          currency: businessSettings.currency || '₹',
          banner: appearanceBanner || ''
        },
        type: 'products',
        items: list.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          badge: p.status ? 'In Stock' : 'Out of Stock',
          image: p.image || '',
          desc: p.desc || ''
        }))
      };

      const encoded = await encodeCatalog(catalogObj);
      const fullUrl = `${window.location.origin}${window.location.pathname}#${encoded}`;
      
      // Save catalog doc in Firebase Firestore
      await saveCatalogToDb(merchantId, catalogObj, fullUrl);
      
      setLiveCatalogUrl(fullUrl);
      onShowToast?.(`Live catalog updated with ${list.length} products!`);
      return fullUrl;
    } catch (err) {
      console.error(err);
      onShowToast?.('Failed to update live catalog');
    } finally {
      setIsPublishing(false);
    }
  };

  // Copy catalog link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(effectiveCatalogUrl);
      onShowToast?.('Catalog link copied to clipboard!');
    } catch (e) {
      onShowToast?.('Could not copy link');
    }
  };

  // Add Product Handler with Cloudinary image and persistence
  const handleSaveProduct = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newProdName.trim() || !newProdPrice.trim()) {
      onShowToast?.('Please enter product name and price');
      return;
    }

    setIsSavingProduct(true);
    onShowToast?.('Saving product...');
    try {
      const prodId = `prod_${Date.now()}`;
      const newP = {
        id: prodId,
        name: newProdName.trim(),
        desc: newProdDesc.trim(),
        price: newProdPrice.trim(),
        category: newProdCategory,
        status: newProdStatus,
        image: newProdImg || '',
        imagePublicId: newProdImgPublicId || ''
      };

      const saved = await saveProductToDb(merchantId, newP);
      const updated = [saved, ...products.filter(p => p.id !== saved.id)];
      setProducts(updated);

      if (autoSyncOnAdd && newP.status) {
        await handlePublishProductsToCatalog([saved, ...products.filter(p => p.status)]);
        onShowToast?.(`Product "${saved.name}" saved and synced! 🎉`);
      } else {
        onShowToast?.(`Product "${saved.name}" added successfully! 🎉`);
      }

      // Reset and return to products table
      setNewProdName('');
      setNewProdPrice('');
      setNewProdDesc('');
      setNewProdImg('');
      setNewProdImgPublicId('');
      setActiveTab('products');
    } catch (err) {
      console.error(err);
      onShowToast?.('Error saving product');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Toggle single product status
  const toggleProductStatus = async (id) => {
    const p = products.find(prod => prod.id === id);
    if (!p) return;
    const nextStatus = !p.status;
    const updated = await toggleProductStatusInDb(merchantId, id, nextStatus);
    setProducts(updated);
    onShowToast?.(`Status set to ${nextStatus ? 'Active' : 'Inactive'}`);
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    const updated = await deleteProductFromDb(merchantId, id);
    setProducts(updated);
    setSelectedProductIds(selectedProductIds.filter(pid => pid !== id));
    onShowToast?.('Product deleted successfully');
  };

  // Delete selected products
  const handleDeleteSelected = async () => {
    if (selectedProductIds.length === 0) return;
    let current = [...products];
    for (const id of selectedProductIds) {
      current = await deleteProductFromDb(merchantId, id);
    }
    setProducts(current);
    setSelectedProductIds([]);
    onShowToast?.('Selected products deleted');
  };

  // Toggle selection
  const toggleSelectProduct = (id) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter(pid => pid !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  // Cloudinary Product Image Upload Handler
  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsCloudinaryUploading(true);
    setUploadProgress(0);
    onShowToast?.('Uploading product image to Cloudinary (dpzku41n7)...');
    try {
      const res = await uploadToCloudinary(file, (p) => setUploadProgress(p));
      setNewProdImg(res.url);
      setNewProdImgPublicId(res.publicId);
      onShowToast?.('Image uploaded to Cloudinary CDN! ☁️');
    } catch (err) {
      console.error(err);
      onShowToast?.('Cloudinary upload error: ' + err.message);
    } finally {
      setIsCloudinaryUploading(false);
    }
  };

  // Cloudinary Banner Upload Handler
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingBanner(true);
    onShowToast?.('Uploading banner to Cloudinary...');
    try {
      const res = await uploadToCloudinary(file);
      setAppearanceBanner(res.url);
      await saveMerchantProfileToDb(merchantId, { banner: res.url });
      onShowToast?.('Banner updated successfully! 🎉');
    } catch (err) {
      onShowToast?.('Banner upload error: ' + err.message);
    } finally {
      setIsUploadingBanner(false);
    }
  };

  // Cloudinary Logo Upload Handler
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingLogo(true);
    onShowToast?.('Uploading shop logo to Cloudinary...');
    try {
      const res = await uploadToCloudinary(file);
      setBusinessSettings(prev => ({ ...prev, logo: res.url }));
      await saveMerchantProfileToDb(merchantId, { logo: res.url });
      onShowToast?.('Shop logo updated successfully! 🎉');
    } catch (err) {
      onShowToast?.('Logo upload error: ' + err.message);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Working Schedule Helpers
  const applySchedulePreset = (presetKey) => {
    if (presetKey === 'mon-sat') {
      setBusinessSettings(prev => ({
        ...prev,
        schedulePreset: 'mon-sat',
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        closedNote: 'Closed on Sundays'
      }));
    } else if (presetKey === 'everyday') {
      setBusinessSettings(prev => ({
        ...prev,
        schedulePreset: 'everyday',
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        closedNote: 'Open Everyday'
      }));
    } else if (presetKey === 'mon-fri') {
      setBusinessSettings(prev => ({
        ...prev,
        schedulePreset: 'mon-fri',
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        closedNote: 'Closed on Weekends'
      }));
    } else {
      setBusinessSettings(prev => ({ ...prev, schedulePreset: 'custom' }));
    }
  };

  const toggleWorkingDay = (day) => {
    setBusinessSettings(prev => {
      const days = prev.workingDays || [];
      const exists = days.includes(day);
      const nextDays = exists ? days.filter(d => d !== day) : [...days, day];
      return {
        ...prev,
        workingDays: nextDays,
        schedulePreset: 'custom'
      };
    });
  };

  // Custom Social Platform Links
  const handleAddCustomLink = () => {
    if (!newCustomLinkTitle.trim() || !newCustomLinkUrl.trim()) return;
    const item = {
      id: `link_${Date.now()}`,
      title: newCustomLinkTitle.trim(),
      url: newCustomLinkUrl.trim()
    };
    setBusinessSettings(prev => ({
      ...prev,
      customLinks: [...(prev.customLinks || []), item]
    }));
    setNewCustomLinkTitle('');
    setNewCustomLinkUrl('');
  };

  const handleRemoveCustomLink = (id) => {
    setBusinessSettings(prev => ({
      ...prev,
      customLinks: (prev.customLinks || []).filter(l => l.id !== id)
    }));
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSavingSettings(true);
    onShowToast?.('Saving changes...');
    try {
      let finalHours = businessSettings.hours;
      if (businessSettings.isOpen24Hours) {
        finalHours = 'Open 24 Hours / 7 Days';
      } else if (businessSettings.workingDays && businessSettings.workingDays.length > 0) {
        const daysStr = businessSettings.workingDays.join(', ');
        finalHours = `${daysStr}: ${businessSettings.openTime || '09:00 AM'} - ${businessSettings.closeTime || '09:00 PM'}`;
        if (businessSettings.closedNote) {
          finalHours += ` • ${businessSettings.closedNote}`;
        }
      }

      const payload = {
        ...businessSettings,
        hours: finalHours
      };

      setBusinessSettings(payload);
      await saveMerchantProfileToDb(merchantId, payload);
      await handlePublishProductsToCatalog();
      onShowToast?.('Settings saved successfully! 🎉');
    } catch (err) {
      console.error(err);
      onShowToast?.('Error saving settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !productSearch || (p.name || '').toLowerCase().includes(productSearch.toLowerCase()) || (p.desc || '').toLowerCase().includes(productSearch.toLowerCase());
      const matchCat = productCatFilter === 'All' || p.category === productCatFilter;
      const matchStatus = productStatusFilter === 'All' || (productStatusFilter === 'Active' ? p.status : !p.status);
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, productSearch, productCatFilter, productStatusFilter]);

  return (
    <div className="qd-dashboard-layout">
      
      {/* =========================================================
          TOP NAVBAR: Matches Image 2 + Back to Home Button
         ========================================================= */}
      <header className="qd-top-nav">
        <div className="qd-top-left">
          <button 
            type="button" 
            className="qd-topbar-back-btn" 
            onClick={onExitDashboard}
            title="Return to QuickCatalog Home"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
          <a href="#" className="qd-logo-link" onClick={(e) => { e.preventDefault(); onExitDashboard(); }}>
            <img src="/logo.png" alt="QuickCatalog" className="qd-header-logo-img" />
          </a>

          {/* Search bar aligned towards left side */}
          <div className="qd-top-search-wrap">
            <Search size={16} className="qd-search-icon" />
            <input 
              type="text" 
              placeholder="Search products, categories..." 
              className="qd-global-search-input"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                if (activeTab !== 'products') setActiveTab('products');
              }}
            />
          </div>
        </div>

        <div className="qd-top-right">
          <div className="qd-user-pill">
            <img 
              src={businessSettings.logo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
              alt="Merchant Avatar" 
              className="qd-user-avatar-img" 
            />
            <div className="qd-user-info">
              <span className="qd-user-name">{businessName}</span>
              <span className="qd-user-role">Merchant</span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          SIDEBAR + MAIN CONTENT CONTAINER
         ========================================================= */}
      <div className="qd-body-split">
        
        {/* SIDEBAR */}
        <aside className="qd-sidebar">
          <nav className="qd-nav-list">
            <button 
              type="button" 
              className={`qd-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button 
              type="button" 
              className={`qd-nav-item ${activeTab === 'my-catalog' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-catalog')}
            >
              <Smartphone size={18} />
              <span>My Catalog</span>
            </button>

            <button 
              type="button" 
              className={`qd-nav-item ${activeTab === 'products' || activeTab === 'add-product' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={18} />
              <span>Products</span>
            </button>

            <button 
              type="button" 
              className={`qd-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <Grid2X2 size={18} />
              <span>Categories</span>
            </button>

            <button 
              type="button" 
              className={`qd-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ClipboardList size={18} />
              <span>Orders & Leads</span>
            </button>

            <button 
              type="button" 
              className={`qd-nav-item ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <Palette size={18} />
              <span>Appearance</span>
            </button>

            <button 
              type="button" 
              className={`qd-nav-item ${activeTab === 'share-qr' ? 'active' : ''}`}
              onClick={() => setActiveTab('share-qr')}
            >
              <QrCode size={18} />
              <span>Share & QR</span>
            </button>

            <button 
              type="button" 
              className={`qd-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </button>

            <button 
              type="button" 
              className={`qd-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <SettingsIcon size={18} />
              <span>Settings</span>
            </button>
          </nav>

          {/* Pro Features Promotion Card (matches design) */}
          <div className="qd-pro-card">
            <div className="qd-pro-badge-row">
              <Crown size={16} className="text-amber" />
              <strong>Pro Features</strong>
            </div>
            <p className="qd-pro-desc">More themes, advanced features and branding.</p>
            <button 
              type="button" 
              className="qd-pro-upgrade-btn"
              onClick={() => onShowToast?.('Pro upgrade portal coming soon!')}
            >
              Upgrade Now
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY VIEW */}
        <main className="qd-main-view">

          {/* ===================================================
              PAGE 1: DASHBOARD (Overview)
             =================================================== */}
          {activeTab === 'dashboard' && (
            <div className="qd-tab-content">
              {/* Welcome Banner */}
              <div className="qd-welcome-card">
                <div className="qd-welcome-left">
                  <h1>Welcome back, <span className="qd-text-highlight">{businessName}</span> 👋</h1>
                  <p className="qd-welcome-sub">Manage your catalog, products and settings all in one space.</p>
                </div>

                <div className="qd-welcome-right">
                  <div className="qd-link-snippet">
                    <span className="qd-link-text">{effectiveCatalogUrl.slice(0, 36)}...</span>
                    <button type="button" className="qd-icon-btn" onClick={handleCopyLink} title="Copy Link">
                      <Copy size={14} />
                    </button>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm"
                    onClick={() => window.open(effectiveCatalogUrl, '_blank', 'noopener')}
                  >
                    Open Catalog
                  </button>
                </div>
              </div>

              {/* 4 KPI Cards */}
              <div className="qd-kpi-row">
                <div className="qd-kpi-card">
                  <div className="qd-kpi-icon-wrap bg-blue-tint text-blue">
                    <Package size={22} />
                  </div>
                  <div className="qd-kpi-content">
                    <span className="qd-kpi-label">Total Products</span>
                    <strong className="qd-kpi-val">{products.length}</strong>
                    <span className="qd-kpi-change text-emerald">{products.filter(p => p.status).length} Active</span>
                  </div>
                </div>

                <div className="qd-kpi-card">
                  <div className="qd-kpi-icon-wrap bg-cyan-tint text-cyan">
                    <Eye size={22} />
                  </div>
                  <div className="qd-kpi-content">
                    <span className="qd-kpi-label">Catalog Views</span>
                    <strong className="qd-kpi-val">{analyticsData.totalViews}</strong>
                    <span className="qd-kpi-change text-emerald">Live real visitors</span>
                  </div>
                </div>

                <div className="qd-kpi-card">
                  <div className="qd-kpi-icon-wrap bg-emerald-tint text-emerald">
                    <MessageCircle size={22} />
                  </div>
                  <div className="qd-kpi-content">
                    <span className="qd-kpi-label">WhatsApp Inquiries</span>
                    <strong className="qd-kpi-val">{analyticsData.totalLeads}</strong>
                    <span className="qd-kpi-change text-emerald">Real customer inquiries</span>
                  </div>
                </div>

                <div className="qd-kpi-card">
                  <div className="qd-kpi-icon-wrap bg-orange-tint text-orange">
                    <Sparkles size={22} />
                  </div>
                  <div className="qd-kpi-content">
                    <span className="qd-kpi-label">Verified Buyers</span>
                    <strong className="qd-kpi-val">{analyticsData.buyersCount}</strong>
                    <span className="qd-kpi-change text-emerald">Classified buyers</span>
                  </div>
                </div>
              </div>

              {/* Catalog Views Chart & Quick Actions Split */}
              <div className="qd-split-row">
                
                {/* Left: Line Graph */}
                <div className="qd-panel qd-chart-panel">
                  <div className="qd-panel-header">
                    <div>
                      <h3>Catalog Views</h3>
                      <div className="qd-chart-legend">
                        <span className="legend-dot dot-views" /> Views
                        <span className="legend-dot dot-wa" style={{ marginLeft: 16 }} /> WhatsApp Clicks
                      </div>
                    </div>

                    <div className="qd-dropdown-badge">
                      <span>Last 7 days</span>
                      <ChevronDown size={14} />
                    </div>
                  </div>

                  {/* SVG Line Chart with Curve */}
                  <div className="qd-svg-chart-container">
                    <svg viewBox="0 0 600 220" className="qd-svg-chart" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="190" x2="600" y2="190" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Area Fill */}
                      <path 
                        d="M 20,180 C 80,185 140,150 200,165 C 260,180 320,140 380,110 C 440,80 500,105 580,85 L 580,200 L 20,200 Z" 
                        fill="url(#viewsGrad)" 
                      />

                      {/* Main Blue Line (Views) */}
                      <path 
                        d="M 20,180 C 80,185 140,150 200,165 C 260,180 320,140 380,110 C 440,80 500,105 580,85" 
                        fill="none" 
                        stroke="#2563eb" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                      />

                      {/* Points */}
                      {[
                        { x: 20, y: 180, label: 'Sep 15', views: 80, wa: 15 },
                        { x: 110, y: 165, label: 'Sep 16', views: 120, wa: 22 },
                        { x: 200, y: 165, label: 'Sep 17', views: 140, wa: 28 },
                        { x: 290, y: 150, label: 'Sep 18', views: 190, wa: 38 },
                        { x: 380, y: 110, label: 'Sep 19', views: 246, wa: 53 },
                        { x: 470, y: 95, label: 'Sep 20', views: 290, wa: 64 },
                        { x: 580, y: 85, label: 'Sep 21', views: 320, wa: 75 }
                      ].map((pt, idx) => (
                        <circle 
                          key={idx} 
                          cx={pt.x} 
                          cy={pt.y} 
                          r="5" 
                          fill="#ffffff" 
                          stroke="#2563eb" 
                          strokeWidth="3" 
                          className="chart-data-dot"
                          onMouseEnter={() => setHoveredChartPoint(pt)}
                          onMouseLeave={() => setHoveredChartPoint(null)}
                        />
                      ))}
                    </svg>

                    {/* Chart X-Axis Labels */}
                    <div className="qd-chart-x-labels">
                      <span>Sep 15</span>
                      <span>Sep 16</span>
                      <span>Sep 17</span>
                      <span>Sep 18</span>
                      <span>Sep 19</span>
                      <span>Sep 20</span>
                      <span>Sep 21</span>
                    </div>

                    {hoveredChartPoint && (
                      <div className="qd-chart-tooltip" style={{ left: `${(hoveredChartPoint.x / 600) * 100}%`, top: hoveredChartPoint.y - 45 }}>
                        <strong>{hoveredChartPoint.label}</strong>
                        <div>Views: {hoveredChartPoint.views}</div>
                        <div>WhatsApp: {hoveredChartPoint.wa}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Quick Actions 6-tile grid */}
                <div className="qd-panel qd-quick-actions-panel">
                  <div className="qd-panel-header">
                    <h3>Quick Actions</h3>
                  </div>

                  <div className="qd-quick-grid">
                    <button 
                      type="button" 
                      className="qd-action-box bg-tile-blue"
                      onClick={() => setActiveTab('add-product')}
                    >
                      <div className="qd-action-icon bg-blue text-white">
                        <Package size={18} />
                      </div>
                      <span>Add Product</span>
                    </button>

                    <button 
                      type="button" 
                      className="qd-action-box bg-tile-green"
                      onClick={() => setActiveTab('categories')}
                    >
                      <div className="qd-action-icon bg-emerald text-white">
                        <Grid2X2 size={18} />
                      </div>
                      <span>Add Category</span>
                    </button>

                    <button 
                      type="button" 
                      className="qd-action-box bg-tile-orange"
                      onClick={() => setActiveTab('appearance')}
                    >
                      <div className="qd-action-icon bg-orange text-white">
                        <Palette size={18} />
                      </div>
                      <span>Customize Style</span>
                    </button>

                    <button 
                      type="button" 
                      className="qd-action-box bg-tile-purple"
                      onClick={() => setActiveTab('share-qr')}
                    >
                      <div className="qd-action-icon bg-purple text-white">
                        <Share2 size={18} />
                      </div>
                      <span>Share Catalog</span>
                    </button>

                    <button 
                      type="button" 
                      className="qd-action-box bg-tile-red"
                      onClick={() => {
                        if (catalogs[0]) onPrintQr(catalogs[0]);
                        else setActiveTab('share-qr');
                      }}
                    >
                      <div className="qd-action-icon bg-rose text-white">
                        <QrCode size={18} />
                      </div>
                      <span>Generate QR</span>
                    </button>

                    <button 
                      type="button" 
                      className="qd-action-box bg-tile-gray"
                      onClick={() => setActiveTab('settings')}
                    >
                      <div className="qd-action-icon bg-slate text-white">
                        <SettingsIcon size={18} />
                      </div>
                      <span>Catalog Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              PAGE 2: MY CATALOG (Preview & Info)
             =================================================== */}
          {activeTab === 'my-catalog' && (
            <div className="qd-tab-content">
              <div className="qd-section-header">
                <div>
                  <h2>My Catalog</h2>
                  <p className="text-muted">Manage your catalog and view live preview.</p>
                </div>
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  onClick={() => window.open(effectiveCatalogUrl, '_blank', 'noopener')}
                >
                  <ExternalLink size={15} />
                  <span>Open Catalog</span>
                </button>
              </div>

              <div className="qd-mycat-grid">
                {/* Realistic Phone Preview (Left) */}
                <div className="qd-phone-preview-frame">
                  <div className="qd-phone-screen">
                    <div className="qd-phone-status-bar">
                      <span>9:41</span>
                      <div className="qd-phone-notch" />
                      <span>100%</span>
                    </div>

                    <div className="qd-phone-shop-header">
                      <div className="qd-phone-avatar">H</div>
                      <h4>{businessName}</h4>
                      <p className="qd-phone-tagline">Quality products for a better you</p>
                      
                      <div className="qd-phone-contact-row">
                        <span className="qd-phone-chip"><MessageCircle size={12} /> WhatsApp</span>
                        <span className="qd-phone-chip"><Phone size={12} /> Call</span>
                        <span className="qd-phone-chip">Instagram</span>
                      </div>
                    </div>

                    {/* Search dummy */}
                    <div className="qd-phone-search">
                      <span>🔍 Search products...</span>
                    </div>

                    {/* Category tabs */}
                    <div className="qd-phone-cat-tabs">
                      <span className="active">All</span>
                      <span>Clothing</span>
                      <span>Footwear</span>
                      <span>Electronics</span>
                    </div>

                    {/* Phone Items Grid */}
                    <div className="qd-phone-items-grid">
                      {products.slice(0, 4).map(p => (
                        <div key={p.id} className="qd-phone-item-card">
                          <img src={p.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=60'} alt={p.name} />
                          <div className="qd-phone-item-info">
                            <strong>{p.name}</strong>
                            <span>₹{p.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Catalog Info & Actions (Right) */}
                <div className="qd-mycat-sidebar-info">
                  <div className="qd-panel">
                    <h3 className="qd-subhead">Catalog Information</h3>
                    <div className="qd-info-stats-grid">
                      <div className="qd-stat-box">
                        <span>Catalog Products</span>
                        <strong>{products.length}</strong>
                      </div>
                      <div className="qd-stat-box">
                        <span>Categories</span>
                        <strong>{categories.length - 1}</strong>
                      </div>
                      <div className="qd-stat-box">
                        <span>Created On</span>
                        <strong>Sep 10, 2026</strong>
                      </div>
                      <div className="qd-stat-box">
                        <span>Last Updated</span>
                        <strong>Sep 21, 2026</strong>
                      </div>
                    </div>
                  </div>

                  <div className="qd-panel mt-3">
                    <h3 className="qd-subhead">Quick Actions</h3>
                    <div className="qd-quick-btns-col">
                      <button 
                        type="button" 
                        className="btn btn-outline btn-block"
                        onClick={onCreateNew}
                      >
                        <Edit3 size={16} />
                        <span>Edit Catalog</span>
                      </button>

                      <button 
                        type="button" 
                        className="btn btn-outline btn-block"
                        onClick={() => setActiveTab('appearance')}
                      >
                        <Palette size={16} />
                        <span>Customize Style</span>
                      </button>

                      <button 
                        type="button" 
                        className="btn btn-outline btn-block"
                        onClick={() => {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products));
                          const downloadAnchor = document.createElement('a');
                          downloadAnchor.setAttribute("href", dataStr);
                          downloadAnchor.setAttribute("download", "quickcatalog-backup.json");
                          downloadAnchor.click();
                          onShowToast?.('Catalog backup downloaded!');
                        }}
                      >
                        <Download size={16} />
                        <span>Download Backup</span>
                      </button>

                      <button 
                        type="button" 
                        className="btn btn-outline btn-block text-rose"
                        onClick={() => {
                          if (window.confirm('Reset catalog products to default template?')) {
                            setProducts(INITIAL_PRODUCTS_LIST);
                            onShowToast?.('Catalog reset to default template');
                          }
                        }}
                      >
                        <RotateCcw size={16} />
                        <span>Reset Catalog</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              PAGE 3: PRODUCTS TABLE (Manage Products)
             =================================================== */}
          {activeTab === 'products' && (
            <div className="qd-tab-content">
              <div className="qd-section-header">
                <div>
                  <h2>Products</h2>
                  <p className="text-muted">Manage all your products and services.</p>
                </div>
                <div className="qd-products-head-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline btn-sm qd-sync-catalog-btn"
                    onClick={() => handlePublishProductsToCatalog()}
                    disabled={isPublishing}
                    title="Publish all active products to your customer-facing live catalog link"
                  >
                    <Sparkles size={15} className="text-primary" />
                    <span>{isPublishing ? 'Updating Catalog...' : 'Publish to Live Catalog'}</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm"
                    onClick={() => setActiveTab('add-product')}
                  >
                    <Plus size={16} />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* Filter bar */}
              <div className="qd-table-filters-row">
                <div className="qd-table-search">
                  <Search size={15} />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>

                <div className="qd-filters-right">
                  <select 
                    value={productCatFilter} 
                    onChange={(e) => setProductCatFilter(e.target.value)}
                    className="qd-select"
                  >
                    <option value="All">All Categories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Bags">Bags</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Services">Services</option>
                  </select>

                  <select 
                    value={productStatusFilter} 
                    onChange={(e) => setProductStatusFilter(e.target.value)}
                    className="qd-select"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Products Table (Pixel-perfect to Image 2) */}
              <div className="qd-table-card">
                <table className="qd-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>
                        <input 
                          type="checkbox" 
                          checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedProductIds(filteredProducts.map(p => p.id));
                            else setSelectedProductIds([]);
                          }}
                        />
                      </th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingDb ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '50px 0' }}>
                          <div className="qd-spinner" style={{ margin: '0 auto 12px' }} />
                          <span className="text-muted" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            Loading products...
                          </span>
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: 0 }}>
                          <div className="qd-empty-state-box">
                            <div className="qd-empty-icon-wrap">
                              <Package size={28} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
                              No Products Added Yet
                            </h3>
                            <p className="text-muted" style={{ maxWidth: 440, fontSize: '0.86rem', margin: 0, lineHeight: 1.5 }}>
                              {productSearch || productCatFilter !== 'All' 
                                ? 'No products found matching your current filter. Try clearing the search or category filter.' 
                                : 'Your catalog inventory is currently empty. Add your first product or populate starter items.'}
                            </p>
                            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                              <button 
                                type="button" 
                                className="btn btn-primary btn-sm"
                                onClick={() => setActiveTab('add-product')}
                              >
                                <Plus size={15} /> Add First Product
                              </button>
                              <button 
                                type="button" 
                                className="btn btn-outline btn-sm"
                                onClick={handleSeedStarterProducts}
                              >
                                <Sparkles size={14} className="text-primary" /> Seed Starter Products
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(p => {
                        const isSelected = selectedProductIds.includes(p.id);
                        return (
                          <tr key={p.id} className={isSelected ? 'row-selected' : ''}>
                            <td>
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => toggleSelectProduct(p.id)}
                              />
                            </td>
                            <td>
                              <div className="qd-prod-cell">
                                <img 
                                  src={p.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=60'} 
                                  alt={p.name} 
                                  className="qd-prod-thumb" 
                                />
                                <div className="qd-prod-meta">
                                  <strong>{p.name}</strong>
                                  <span className="qd-prod-desc">{p.desc}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong className="qd-prod-price">₹{p.price}</strong>
                            </td>
                            <td>
                              <span className={`qd-category-badge cat-${(p.category || 'general').toLowerCase()}`}>
                                {p.category || 'General'}
                              </span>
                            </td>
                            <td>
                              <button 
                                type="button" 
                                className={`qd-status-pill ${p.status ? 'active' : 'inactive'}`}
                                onClick={() => toggleProductStatus(p.id)}
                                title="Click to toggle status"
                              >
                                <span className="dot" />
                                <span>{p.status ? 'Active' : 'Inactive'}</span>
                              </button>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="qd-actions-group">
                                <button 
                                  type="button" 
                                  className="qd-icon-action" 
                                  title="Edit product"
                                  onClick={() => {
                                    setNewProdName(p.name);
                                    setNewProdPrice(p.price);
                                    setNewProdDesc(p.desc || '');
                                    setNewProdCategory(p.category || 'Clothing');
                                    setNewProdImg(p.image || '');
                                    setNewProdStatus(p.status);
                                    setActiveTab('add-product');
                                  }}
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button 
                                  type="button" 
                                  className="qd-icon-action delete" 
                                  title="Delete product"
                                  onClick={() => handleDeleteProduct(p.id)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {/* Table Footer with Selected & Pagination */}
                <div className="qd-table-footer">
                  <div className="qd-footer-left">
                    {selectedProductIds.length > 0 && (
                      <div className="qd-batch-actions-bar">
                        <span className="qd-batch-count-tag">{selectedProductIds.length} Selected</span>
                        <button 
                          type="button" 
                          className="btn btn-primary btn-xs"
                          onClick={() => {
                            const selected = products.filter(p => selectedProductIds.includes(p.id));
                            handlePublishProductsToCatalog(selected);
                          }}
                          title="Publish only selected products to live catalog"
                        >
                          <Sparkles size={12} />
                          <span>Publish Selected ({selectedProductIds.length})</span>
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline btn-xs"
                          onClick={() => {
                            setProducts(products.map(p => selectedProductIds.includes(p.id) ? { ...p, status: true } : p));
                            onShowToast?.('Selected products marked Active');
                          }}
                        >
                          <Check size={12} /> Set Active
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline btn-xs text-rose"
                          onClick={handleDeleteSelected}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="qd-pagination">
                    <button type="button" className="page-btn"><ChevronLeft size={14} /></button>
                    <button type="button" className="page-btn active">1</button>
                    <button type="button" className="page-btn">2</button>
                    <button type="button" className="page-btn">3</button>
                    <button type="button" className="page-btn">4</button>
                    <button type="button" className="page-btn">5</button>
                    <button type="button" className="page-btn"><ChevronRight size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              PAGE 4: ADD NEW PRODUCT (Form View)
             =================================================== */}
          {activeTab === 'add-product' && (
            <div className="qd-tab-content">
              <div className="qd-section-header">
                <div className="qd-back-title">
                  <button 
                    type="button" 
                    className="qd-circle-back-btn" 
                    onClick={() => setActiveTab('products')}
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h2>Add New Product</h2>
                </div>

                <div className="qd-header-actions">
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm"
                    onClick={() => setActiveTab('products')}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveProduct}
                    disabled={isSavingProduct}
                  >
                    {isSavingProduct ? (
                      <>
                        <span className="qd-spinner-sm" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      'Save Product'
                    )}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveProduct} className="qd-add-product-grid">
                {/* Left: Image Upload Box with Cloudinary Integration */}
                <div className="qd-product-image-card qd-panel">
                  {isCloudinaryUploading ? (
                    <div className="qd-uploading-box">
                      <div className="qd-spinner" />
                      <strong style={{ fontSize: '0.88rem', color: '#166534' }}>Uploading to Cloudinary CDN...</strong>
                      <span style={{ fontSize: '0.75rem', color: '#15803d' }}>
                        Preset: quick.cotalog ({uploadProgress}%)
                      </span>
                    </div>
                  ) : (
                    <label className="qd-drop-image-zone">
                      <Upload size={32} className="text-primary mb-2" />
                      <strong>Add Product Image (Cloudinary CDN)</strong>
                      <span className="text-muted">Click to upload or drag & drop</span>
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>Direct CDN Upload (Cloud: dpzku41n7)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden-file-input"
                        onChange={handleProductImageUpload}
                      />
                    </label>
                  )}

                  {/* Thumbnail Preview Area */}
                  {newProdImg && (
                    <div className="qd-image-preview-thumb-box">
                      <img src={newProdImg} alt="Preview" />
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <span className="qd-cloudinary-badge">☁️ Cloudinary CDN: dpzku41n7</span>
                      </div>
                      <button 
                        type="button" 
                        className="qd-remove-img-btn"
                        onClick={() => { setNewProdImg(''); setNewProdImgPublicId(''); }}
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Form fields */}
                <div className="qd-product-fields-card qd-panel">
                  <div className="field-group">
                    <label className="field-label">Product Name <span className="req">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Cotton T-Shirt"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="custom-input"
                      required
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Price <span className="req">*</span></label>
                    <div className="qd-price-input-box">
                      <span className="qd-currency-prefix">₹</span>
                      <input 
                        type="text" 
                        placeholder="799"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="custom-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="qd-row-2col">
                    <div className="field-group">
                      <label className="field-label">Category</label>
                      <select 
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="custom-select"
                      >
                        <option value="Clothing">Clothing</option>
                        <option value="Footwear">Footwear</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Bags">Bags</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Services">Services</option>
                      </select>
                    </div>

                    <div className="field-group">
                      <label className="field-label">Status</label>
                      <div className="qd-toggle-switch-wrapper">
                        <label className="qd-switch">
                          <input 
                            type="checkbox" 
                            checked={newProdStatus}
                            onChange={(e) => setNewProdStatus(e.target.checked)}
                          />
                          <span className="qd-slider" />
                        </label>
                        <span className="qd-switch-label">{newProdStatus ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="field-group">
                    <div className="qd-label-with-count">
                      <label className="field-label">Short Description (Optional)</label>
                      <span className="char-count">{newProdDesc.length}/200</span>
                    </div>
                    <textarea 
                      rows="4"
                      placeholder="Premium quality cotton t-shirt. Comfortable and stylish for everyday use."
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value.slice(0, 200))}
                      className="custom-input"
                    />
                  </div>

                  <div className="field-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: '#eff6ff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #bfdbfe', marginTop: '6px' }}>
                      <input 
                        type="checkbox" 
                        checked={autoSyncOnAdd}
                        onChange={(e) => setAutoSyncOnAdd(e.target.checked)}
                        style={{ width: 16, height: 16, cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1e40af' }}>
                        ⚡ Automatically sync & update live catalog link with this product
                      </span>
                    </label>
                  </div>

                  <div className="qd-form-footer-buttons">
                    <button 
                      type="button" 
                      className="btn btn-ghost"
                      onClick={() => setActiveTab('products')}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSavingProduct}
                    >
                      {isSavingProduct ? (
                        <>
                          <span className="qd-spinner-sm" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        'Save Product'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ===================================================
              PAGE 5: CATEGORIES (Cards Grid)
             =================================================== */}
          {activeTab === 'categories' && (
            <div className="qd-tab-content">
              <div className="qd-section-header">
                <div>
                  <h2>Categories</h2>
                  <p className="text-muted">Organize your products with categories.</p>
                </div>
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const name = prompt('Enter new category name:');
                    if (name && name.trim()) {
                      const newCat = {
                        id: name.toLowerCase().replace(/\s+/g, '-'),
                        name: name.trim(),
                        count: 0,
                        icon: 'tag'
                      };
                      setCategories([...categories, newCat]);
                      onShowToast?.(`Category "${name}" added!`);
                    }
                  }}
                >
                  <Plus size={16} />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Categories Cards Grid matching Image 2 */}
              <div className="qd-categories-grid">
                {dynamicCategories.map((c) => (
                  <div 
                    key={c.id} 
                    className="qd-category-card clickable-cat-card"
                    onClick={() => {
                      setProductCatFilter(c.name === 'All Products' ? 'All' : c.name);
                      setActiveTab('products');
                      onShowToast?.(`Filtered to ${c.name} products`);
                    }}
                    title={`Click to view ${c.name} products`}
                  >
                    <div className={`qd-cat-icon-circle cat-icon-${c.icon}`}>
                      {c.icon === 'shirt' && <Shirt size={24} />}
                      {c.icon === 'footwear' && <Footprints size={24} />}
                      {c.icon === 'headphones' && <Headphones size={24} />}
                      {c.icon === 'bag' && <ShoppingBag size={24} />}
                      {c.icon === 'glasses' && <Glasses size={24} />}
                      {c.icon === 'wrench' && <Wrench size={24} />}
                      {(c.icon === 'all' || c.icon === 'tag') && <Layers size={24} />}
                    </div>

                    <h3 className="qd-cat-title">{c.name}</h3>
                    <span className="qd-cat-count">{c.count} Items</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================
              PAGE 6: ORDERS (Local)
             =================================================== */}
          {/* ===================================================
              PAGE 6: ORDERS & WHATSAPP LEADS
             =================================================== */}
          {activeTab === 'orders' && (
            <div className="qd-tab-content">
              <div className="qd-section-header">
                <div>
                  <h2>Orders & WhatsApp Leads</h2>
                  <p className="text-muted">Real-time customer inquiries from your live catalog link with Admin classification.</p>
                </div>

                <div className="qd-top-lead-stats-row" style={{ display: 'flex', gap: '12px' }}>
                  <div className="qd-mini-stat-pill" style={{ background: '#ecfdf5', color: '#047857', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', border: '1px solid #a7f3d0' }}>
                    🟢 Buyers: {analyticsData.buyersCount || 0}
                  </div>
                  <div className="qd-mini-stat-pill" style={{ background: '#eff6ff', color: '#1d4ed8', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', border: '1px solid #bfdbfe' }}>
                    🔵 Inquiries: {analyticsData.inquiryCount || 0}
                  </div>
                  <div className="qd-mini-stat-pill" style={{ background: '#fef2f2', color: '#b91c1c', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', border: '1px solid #fecaca' }}>
                    🔴 Spam: {analyticsData.spamCount || 0}
                  </div>
                </div>
              </div>

              {/* SECTION 1: LIVE WHATSAPP LEADS */}
              <div className="qd-panel mb-4" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MessageCircle size={18} className="text-emerald" />
                      <span>WhatsApp Customer Leads ({leadsList.length})</span>
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                      Tracked automatically whenever a visitor taps "Order via WhatsApp" in your catalog.
                    </p>
                  </div>

                  <div className="filter-pills-bar">
                    {[
                      { id: 'All', label: `All (${leadsList.length})` },
                      { id: 'buyer', label: `Buyers (${analyticsData.buyersCount || 0})` },
                      { id: 'inquiry', label: `Inquiries (${analyticsData.inquiryCount || 0})` },
                      { id: 'spam', label: `Spam (${analyticsData.spamCount || 0})` }
                    ].map(f => (
                      <button 
                        key={f.id}
                        type="button" 
                        className={`filter-pill-btn ${leadFilter === f.id ? 'active' : ''}`}
                        onClick={() => setLeadFilter(f.id)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {leadsList.filter(l => leadFilter === 'All' || (l.classification || 'buyer') === leadFilter).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <MessageCircle size={36} style={{ color: '#94a3b8', margin: '0 auto 12px' }} />
                    <h4 style={{ margin: '0 0 6px', color: '#1e293b' }}>No WhatsApp Leads Yet</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                      When buyers click on WhatsApp buttons in your catalog, their inquiry and classification will appear here in real-time.
                    </p>
                  </div>
                ) : (
                  <div className="qd-table-card" style={{ boxShadow: 'none', border: '1px solid #f1f5f9' }}>
                    <table className="qd-data-table">
                      <thead>
                        <tr>
                          <th>Lead ID</th>
                          <th>Inquired Product / Note</th>
                          <th>Price / Value</th>
                          <th>Classification (Admin)</th>
                          <th>Time</th>
                          <th style={{ textAlign: 'right' }}>WhatsApp Chat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadsList
                          .filter(l => leadFilter === 'All' || (l.classification || 'buyer') === leadFilter)
                          .map(lead => {
                            const currentClass = lead.classification || 'buyer';
                            const dateStr = lead.timestamp ? new Date(lead.timestamp).toLocaleString('en-IN', {
                              dateStyle: 'short',
                              timeStyle: 'short'
                            }) : 'Recent';
                            const cleanPhone = (lead.customerPhone || businessSettings.whatsapp || '9876543210').replace(/\D/g, '');

                            return (
                              <tr key={lead.id}>
                                <td>
                                  <strong className="order-id-tag">#{lead.id.slice(-6).toUpperCase()}</strong>
                                  <div style={{ fontSize: '11px', color: '#64748b' }}>{lead.visitorId || 'Visitor'}</div>
                                </td>
                                <td>
                                  <div className="customer-cell">
                                    <strong style={{ color: '#0f172a' }}>{lead.productName || lead.note || 'Catalog Inquiry'}</strong>
                                    {lead.note && lead.note !== lead.productName && (
                                      <span style={{ fontSize: '12px', color: '#64748b' }}>{lead.note}</span>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <strong className="order-total-val">₹{lead.productPrice ? Number(lead.productPrice).toLocaleString('en-IN') : '—'}</strong>
                                </td>
                                <td>
                                  <select 
                                    value={currentClass}
                                    onChange={(e) => handleLeadClassificationChange(lead.id, e.target.value)}
                                    className={`qd-lead-classify-select classify-${currentClass}`}
                                    title="Classify customer intent"
                                  >
                                    <option value="buyer">🟢 Verified Buyer</option>
                                    <option value="inquiry">🔵 General Inquiry</option>
                                    <option value="spam">🔴 Spam / Suspicious</option>
                                  </select>
                                </td>
                                <td>
                                  <span className="text-muted" style={{ fontSize: '12px' }}>{dateStr}</span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <button 
                                    type="button" 
                                    className="btn btn-whatsapp btn-xs"
                                    onClick={() => {
                                      window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello! Thank you for inquiring about ${lead.productName || 'our products'} on our QuickCatalog. How can we help you today?`)}`, '_blank', 'noopener');
                                    }}
                                  >
                                    <MessageCircle size={13} />
                                    <span>Chat</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* SECTION 2: DIRECT / LOCAL ORDERS */}
              <div className="qd-panel" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ClipboardList size={18} className="text-blue" />
                      <span>Direct Orders Log ({orders.length})</span>
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                      Full order slips submitted directly by customers.
                    </p>
                  </div>

                  <div className="filter-pills-bar">
                    {['All', 'New', 'Contacted', 'Completed'].map(st => (
                      <button 
                        key={st}
                        type="button" 
                        className={`filter-pill-btn ${orderFilter === st ? 'active' : ''}`}
                        onClick={() => setOrderFilter(st)}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="qd-table-card" style={{ boxShadow: 'none', border: '1px solid #f1f5f9' }}>
                  <table className="qd-data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items Ordered</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th style={{ textAlign: 'right' }}>WhatsApp Chat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter(o => orderFilter === 'All' || o.status === orderFilter).length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                            No orders matching the selected filter.
                          </td>
                        </tr>
                      ) : (
                        orders.filter(o => orderFilter === 'All' || o.status === orderFilter).map(ord => (
                          <tr key={ord.id}>
                            <td><strong className="order-id-tag">{ord.id}</strong></td>
                            <td>
                              <div className="customer-cell">
                                <strong>{ord.customerName}</strong>
                                <span className="customer-phone-sub">{ord.customerPhone}</span>
                              </div>
                            </td>
                            <td><div className="items-ordered-cell">{ord.items.join(', ')}</div></td>
                            <td><strong className="order-total-val">₹{ord.total.toLocaleString('en-IN')}</strong></td>
                            <td>
                              <select 
                                value={ord.status}
                                onChange={async (e) => {
                                  const updated = await updateOrderStatusInDb(merchantId, ord.id, e.target.value);
                                  setOrders(updated);
                                  onShowToast?.(`Status updated to ${e.target.value}`);
                                }}
                                className={`status-select-tag status-${ord.status.toLowerCase()}`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td><span className="text-muted">{ord.date}</span></td>
                            <td style={{ textAlign: 'right' }}>
                              <button 
                                type="button" 
                                className="btn btn-whatsapp btn-xs"
                                onClick={() => {
                                  const clean = ord.customerPhone.replace(/\D/g, '');
                                  window.open(`https://wa.me/91${clean}?text=${encodeURIComponent(`Hello ${ord.customerName}! We received your order for ${ord.items.join(', ')}. How can we assist you?`)}`, '_blank', 'noopener');
                                }}
                              >
                                <MessageCircle size={13} />
                                <span>Chat</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              PAGE 7: APPEARANCE (Customize Your Catalog)
             =================================================== */}
          {activeTab === 'appearance' && (
            <div className="qd-tab-content">
              <div className="qd-section-header">
                <div>
                  <h2>Customize Your Catalog</h2>
                  <p className="text-muted">Make your catalog look unique with your own style.</p>
                </div>
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  onClick={async () => {
                    await handlePublishProductsToCatalog();
                    onShowToast?.('Theme and appearance applied to live catalog!');
                  }}
                >
                  Save Changes
                </button>
              </div>

              <div className="qd-appearance-split">
                {/* Left Controls */}
                <div className="qd-appearance-controls qd-panel">
                  {/* Theme Color Swatches */}
                  <div className="qd-appearance-group">
                    <label className="field-label">Theme Color</label>
                    <div className="qd-palette-row">
                      {[
                        { id: 'blue', color: '#2563eb' },
                        { id: 'indigo', color: '#4f46e5' },
                        { id: 'rose', color: '#e11d48' },
                        { id: 'orange', color: '#ea580c' },
                        { id: 'amber', color: '#d97706' },
                        { id: 'emerald', color: '#059669' },
                        { id: 'cyan', color: '#0891b2' },
                        { id: 'purple', color: '#7c3aed' },
                      ].map(sw => (
                        <button 
                          key={sw.id}
                          type="button" 
                          className={`qd-color-circle ${appearanceTheme === sw.id ? 'active' : ''}`}
                          style={{ background: sw.color }}
                          onClick={() => setAppearanceTheme(sw.id)}
                        >
                          {appearanceTheme === sw.id && <Check size={14} color="#fff" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Catalog Banner Upload with Cloudinary */}
                  <div className="qd-appearance-group">
                    <label className="field-label">Catalog Banner (Cloudinary CDN)</label>
                    <label className="qd-banner-upload-box">
                      <Upload size={22} className="text-primary mb-1" />
                      <strong>{isUploadingBanner ? 'Uploading to Cloudinary...' : 'Upload Banner Image'}</strong>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {isUploadingBanner ? 'Direct CDN upload in progress...' : '1200 × 400 px (Cloudinary: dpzku41n7)'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden-file-input" 
                        onChange={handleBannerUpload}
                        disabled={isUploadingBanner}
                      />
                    </label>
                    {appearanceBanner && (
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={appearanceBanner} alt="Banner" style={{ width: 100, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }} />
                        <span className="qd-cloudinary-badge">☁️ Cloudinary Banner Live</span>
                      </div>
                    )}
                  </div>

                  {/* Display Settings Toggles */}
                  <div className="qd-appearance-group">
                    <label className="field-label">Display Settings</label>
                    <div className="qd-toggles-list">
                      <div className="qd-toggle-item">
                        <span>Show search bar</span>
                        <label className="qd-switch">
                          <input 
                            type="checkbox" 
                            checked={appearanceToggles.searchBar}
                            onChange={(e) => setAppearanceToggles({ ...appearanceToggles, searchBar: e.target.checked })}
                          />
                          <span className="qd-slider" />
                        </label>
                      </div>

                      <div className="qd-toggle-item">
                        <span>Show categories</span>
                        <label className="qd-switch">
                          <input 
                            type="checkbox" 
                            checked={appearanceToggles.categories}
                            onChange={(e) => setAppearanceToggles({ ...appearanceToggles, categories: e.target.checked })}
                          />
                          <span className="qd-slider" />
                        </label>
                      </div>

                      <div className="qd-toggle-item">
                        <span>Show product descriptions</span>
                        <label className="qd-switch">
                          <input 
                            type="checkbox" 
                            checked={appearanceToggles.descriptions}
                            onChange={(e) => setAppearanceToggles({ ...appearanceToggles, descriptions: e.target.checked })}
                          />
                          <span className="qd-slider" />
                        </label>
                      </div>

                      <div className="qd-toggle-item">
                        <span>Show contact buttons</span>
                        <label className="qd-switch">
                          <input 
                            type="checkbox" 
                            checked={appearanceToggles.contactButtons}
                            onChange={(e) => setAppearanceToggles({ ...appearanceToggles, contactButtons: e.target.checked })}
                          />
                          <span className="qd-slider" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Live Preview Phone */}
                <div className="qd-appearance-preview">
                  <span className="qd-preview-tag">Live Preview</span>
                  <div className="qd-phone-screen mini">
                    <div className="qd-phone-status-bar">
                      <span>9:41</span>
                      <div className="qd-phone-notch" />
                      <span>100%</span>
                    </div>

                    <div className="qd-phone-shop-header" style={{ borderTop: `4px solid ${appearanceTheme === 'rose' ? '#e11d48' : '#2563eb'}` }}>
                      <div className="qd-phone-avatar">H</div>
                      <h4>{businessName}</h4>
                      {appearanceToggles.descriptions && <p className="qd-phone-tagline">Quality products for a better you</p>}

                      {appearanceToggles.contactButtons && (
                        <div className="qd-phone-contact-row">
                          <span className="qd-phone-chip"><MessageCircle size={10} /> WhatsApp</span>
                          <span className="qd-phone-chip"><Phone size={10} /> Call</span>
                          <span className="qd-phone-chip">Instagram</span>
                        </div>
                      )}
                    </div>

                    {appearanceToggles.searchBar && (
                      <div className="qd-phone-search">
                        <span>🔍 Search products...</span>
                      </div>
                    )}

                    {appearanceToggles.categories && (
                      <div className="qd-phone-cat-tabs">
                        <span className="active">All</span>
                        <span>Clothing</span>
                        <span>Footwear</span>
                      </div>
                    )}

                    <div className="qd-phone-items-grid">
                      {products.slice(0, 2).map(p => (
                        <div key={p.id} className="qd-phone-item-card">
                          <img src={p.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=60'} alt={p.name} />
                          <div className="qd-phone-item-info">
                            <strong>{p.name}</strong>
                            <span>₹{p.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              PAGE 8: SHARE & QR
             =================================================== */}
          {activeTab === 'share-qr' && (
            <div className="qd-tab-content">
              <div className="qd-section-header">
                <div>
                  <h2>Share Your Catalog</h2>
                  <p className="text-muted">Share your catalog with customers using link or QR code.</p>
                </div>
              </div>

              {/* Segment Toggle */}
              <div className="qd-share-tabs-wrap">
                <button 
                  type="button" 
                  className={`qd-share-tab ${shareSubTab === 'link' ? 'active' : ''}`}
                  onClick={() => setShareSubTab('link')}
                >
                  Catalog Link
                </button>
                <button 
                  type="button" 
                  className={`qd-share-tab ${shareSubTab === 'qr' ? 'active' : ''}`}
                  onClick={() => setShareSubTab('qr')}
                >
                  <QrCode size={15} /> QR Code
                </button>
              </div>

              <div className="qd-share-card qd-panel">
                {/* QR Display */}
                <div className="qd-qr-showcase-box">
                  <div className="qd-qr-frame-clean">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(effectiveCatalogUrl)}`} 
                      alt="Catalog QR" 
                      className="qd-qr-image" 
                    />
                  </div>

                  <div className="qd-qr-cta-side">
                    <h3>Scan this QR Code</h3>
                    <p className="text-muted">Customers can scan this QR code to open your catalog instantly on mobile.</p>

                    <div className="qd-qr-actions-row">
                      <button 
                        type="button" 
                        className="btn btn-outline"
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(effectiveCatalogUrl)}`;
                          a.download = 'quickcatalog-qr.png';
                          a.click();
                          onShowToast?.('QR Code downloaded!');
                        }}
                      >
                        <Download size={16} />
                        <span>Download QR</span>
                      </button>

                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={() => {
                          const text = `Check out our digital catalog for *${businessName}* here:\n${effectiveCatalogUrl}`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
                        }}
                      >
                        <Share2 size={16} />
                        <span>Share QR</span>
                      </button>

                      {catalogs[0] && (
                        <button 
                          type="button" 
                          className="btn btn-outline text-blue"
                          onClick={() => onPrintQr(catalogs[0])}
                        >
                          <Printer size={16} />
                          <span>Print Standee Card</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Catalog Link input row */}
                <div className="qd-link-bar-section">
                  <label className="field-label">Your Catalog Link</label>
                  <div className="qd-link-input-group">
                    <input 
                      type="text" 
                      readOnly 
                      value={effectiveCatalogUrl} 
                      className="qd-link-display-input" 
                    />
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleCopyLink}
                    >
                      <Copy size={16} />
                      <span>Copy Link</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => window.open(effectiveCatalogUrl, '_blank', 'noopener')}
                    >
                      <ExternalLink size={16} />
                      <span>Open Catalog</span>
                    </button>
                  </div>
                </div>

                {/* Helpful Tip */}
                <div className="qd-tip-banner">
                  <span>💡 <strong>Tip:</strong> Print this QR code on your shop counter, business card, or packaging to let customers view your catalog instantly.</span>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              PAGE 9: ANALYTICS (Detailed Metrics & Charts)
             =================================================== */}
          {activeTab === 'analytics' && (
            <div className="qd-tab-content">
              <div className="qd-section-header">
                <div>
                  <h2>Analytics</h2>
                  <p className="text-muted">Track your catalog performance and visitor engagement.</p>
                </div>

                <div className="qd-dropdown-badge">
                  <span>Last 30 days</span>
                  <ChevronDown size={14} />
                </div>
              </div>

              {/* 4 Metric Pills */}
              <div className="qd-analytics-pills-grid">
                <div className="qd-kpi-card">
                  <div className="qd-kpi-icon-wrap bg-blue-tint text-blue">
                    <Eye size={20} />
                  </div>
                  <div>
                    <span className="qd-kpi-label">Total Views</span>
                    <strong className="qd-kpi-val">{analyticsData.totalViews || 0}</strong>
                    <span className="qd-kpi-change text-emerald">Live catalog visits</span>
                  </div>
                </div>

                <div className="qd-kpi-card">
                  <div className="qd-kpi-icon-wrap bg-emerald-tint text-emerald">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <span className="qd-kpi-label">WhatsApp Inquiries</span>
                    <strong className="qd-kpi-val">{analyticsData.totalLeads || 0}</strong>
                    <span className="qd-kpi-change text-emerald">Customer link clicks</span>
                  </div>
                </div>

                <div className="qd-kpi-card">
                  <div className="qd-kpi-icon-wrap bg-orange-tint text-orange">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <span className="qd-kpi-label">Verified Buyers</span>
                    <strong className="qd-kpi-val">{analyticsData.buyersCount || 0}</strong>
                    <span className="qd-kpi-change text-emerald">Classified buyers</span>
                  </div>
                </div>

                <div className="qd-kpi-card">
                  <div className="qd-kpi-icon-wrap bg-purple-tint text-purple">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <span className="qd-kpi-label">General Inquiries</span>
                    <strong className="qd-kpi-val">{analyticsData.inquiryCount || 0}</strong>
                    <span className="qd-kpi-change text-muted">Knowledge seekers</span>
                  </div>
                </div>
              </div>

              {/* Full Width Double Line Graph */}
              <div className="qd-panel qd-full-chart-panel mt-3">
                <div className="qd-panel-header">
                  <div>
                    <h3>Views & WhatsApp Clicks</h3>
                    <div className="qd-chart-legend">
                      <span className="legend-dot dot-views" /> Views
                      <span className="legend-dot dot-wa" style={{ marginLeft: 16 }} /> WhatsApp Clicks
                    </div>
                  </div>
                </div>

                <div className="qd-analytics-svg-wrap">
                  <svg viewBox="0 0 800 240" className="qd-svg-chart">
                    {/* Horizontal lines */}
                    <line x1="0" y1="40" x2="800" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="100" x2="800" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="160" x2="800" y2="160" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="210" x2="800" y2="210" stroke="#f1f5f9" strokeWidth="1" />

                    {/* Views Curve (Blue) */}
                    <path 
                      d="M 30,200 C 130,205 230,170 330,120 C 430,70 530,150 630,95 C 700,60 750,75 780,65" 
                      fill="none" 
                      stroke="#2563eb" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                    />

                    {/* WhatsApp Curve (Purple/Cyan) */}
                    <path 
                      d="M 30,215 C 130,215 230,200 330,175 C 430,150 530,195 630,165 C 700,150 750,155 780,140" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="3" 
                      strokeDasharray="4 2"
                      strokeLinecap="round" 
                    />

                    {/* Points on curve */}
                    {[
                      { x: 30, y: 200, date: 'Aug 22', views: 50, wa: 10 },
                      { x: 130, y: 205, date: 'Aug 26', views: 75, wa: 18 },
                      { x: 230, y: 170, date: 'Aug 30', views: 130, wa: 30 },
                      { x: 330, y: 120, date: 'Sep 03', views: 246, wa: 53 },
                      { x: 430, y: 110, date: 'Sep 07', views: 280, wa: 68 },
                      { x: 530, y: 150, date: 'Sep 11', views: 190, wa: 42 },
                      { x: 630, y: 95, date: 'Sep 15', views: 310, wa: 75 },
                      { x: 780, y: 65, date: 'Sep 19', views: 360, wa: 92 },
                    ].map((pt, i) => (
                      <circle 
                        key={i} 
                        cx={pt.x} 
                        cy={pt.y} 
                        r="5" 
                        fill="#fff" 
                        stroke="#2563eb" 
                        strokeWidth="3" 
                        className="chart-data-dot"
                      />
                    ))}
                  </svg>

                  {/* Date labels */}
                  <div className="qd-chart-x-labels">
                    <span>Aug 22</span>
                    <span>Aug 26</span>
                    <span>Aug 30</span>
                    <span>Sep 03</span>
                    <span>Sep 07</span>
                    <span>Sep 11</span>
                    <span>Sep 15</span>
                    <span>Sep 19</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              PAGE 10: REDESIGNED STORE & CATALOG SETTINGS
             =================================================== */}
          {activeTab === 'settings' && (
            <div className="qd-tab-content">
              <div className="qd-section-header">
                <div>
                  <h2>Store & Catalog Settings</h2>
                  <p className="text-muted">Configure your business profile, operating hours, social accounts, and preferences.</p>
                </div>
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                >
                  {isSavingSettings ? (
                    <>
                      <span className="qd-spinner-sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={15} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

              <div className="qd-settings-split qd-panel">
                {/* Left Sub-tabs with Icons */}
                <div className="qd-settings-nav">
                  <button 
                    type="button" 
                    className={`qd-subnav-btn ${settingsTab === 'business-info' ? 'active' : ''}`}
                    onClick={() => setSettingsTab('business-info')}
                  >
                    <Building size={16} />
                    <span>Business Info</span>
                  </button>

                  <button 
                    type="button" 
                    className={`qd-subnav-btn ${settingsTab === 'hours' ? 'active' : ''}`}
                    onClick={() => setSettingsTab('hours')}
                  >
                    <Clock size={16} />
                    <span>Business Hours</span>
                  </button>

                  <button 
                    type="button" 
                    className={`qd-subnav-btn ${settingsTab === 'social' ? 'active' : ''}`}
                    onClick={() => setSettingsTab('social')}
                  >
                    <Share2 size={16} />
                    <span>Social Media</span>
                  </button>

                  <button 
                    type="button" 
                    className={`qd-subnav-btn ${settingsTab === 'contact' ? 'active' : ''}`}
                    onClick={() => setSettingsTab('contact')}
                  >
                    <Phone size={16} />
                    <span>Contact & Location</span>
                  </button>

                  <button 
                    type="button" 
                    className={`qd-subnav-btn ${settingsTab === 'currency' ? 'active' : ''}`}
                    onClick={() => setSettingsTab('currency')}
                  >
                    <Globe size={16} />
                    <span>Currency & Region</span>
                  </button>
                </div>

                {/* Right Form Fields */}
                <form onSubmit={handleSaveSettings} className="qd-settings-form">
                  
                  {/* TAB 1: BUSINESS INFO */}
                  {settingsTab === 'business-info' && (
                    <div className="qd-form-section">
                      <div className="qd-settings-intro">
                        <h3>General Business Information</h3>
                        <p>Basic details shown to customers at the top of your catalog.</p>
                      </div>
                      
                      <div className="field-group">
                        <label className="field-label">Business Name <span className="req">*</span></label>
                        <input 
                          type="text" 
                          value={businessSettings.name}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, name: e.target.value })}
                          className="custom-input"
                          placeholder="e.g. Haris Fashion Store"
                          required
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label">Business Industry / Category</label>
                        <select 
                          value={businessSettings.category || 'Fashion & Apparel'}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, category: e.target.value })}
                          className="custom-select"
                        >
                          {STORE_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="field-group">
                        <div className="qd-label-with-count">
                          <label className="field-label">Store Bio & Tagline (Optional)</label>
                          <span className="char-count">{(businessSettings.description || '').length}/200</span>
                        </div>
                        <textarea 
                          rows="3"
                          value={businessSettings.description}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, description: e.target.value.slice(0, 200) })}
                          className="custom-input"
                          placeholder="e.g. Trendy fashion, footwear, and lifestyle essentials delivered to your door."
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label">Store Brand Logo</label>
                        <div className="qd-logo-upload-row">
                          <img 
                            src={businessSettings.logo || "/logo.png"} 
                            alt="Shop Logo" 
                            className="qd-settings-logo-preview" 
                          />
                          <label className="btn btn-outline btn-sm">
                            <Upload size={14} /> {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden-file-input" 
                              onChange={handleLogoUpload}
                              disabled={isUploadingLogo}
                            />
                          </label>
                          {businessSettings.logo && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm text-danger"
                              onClick={() => setBusinessSettings({ ...businessSettings, logo: '' })}
                              title="Remove logo"
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          )}
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>Cloud CDN Storage</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: WORKING HOURS & SCHEDULE */}
                  {settingsTab === 'hours' && (
                    <div className="qd-form-section">
                      <div className="qd-settings-intro">
                        <h3>Operating Schedule & Working Hours</h3>
                        <p>Set the days and time your business is open for customer inquiries and orders.</p>
                      </div>

                      <div className="qd-schedule-builder-card">
                        <div>
                          <label className="field-label" style={{ marginBottom: 8, display: 'block' }}>Quick Schedule Presets</label>
                          <div className="qd-presets-row">
                            <button
                              type="button"
                              className={`qd-preset-pill ${businessSettings.schedulePreset === 'everyday' ? 'active' : ''}`}
                              onClick={() => applySchedulePreset('everyday')}
                            >
                              Everyday (Mon - Sun)
                            </button>
                            <button
                              type="button"
                              className={`qd-preset-pill ${businessSettings.schedulePreset === 'mon-sat' ? 'active' : ''}`}
                              onClick={() => applySchedulePreset('mon-sat')}
                            >
                              Monday - Saturday
                            </button>
                            <button
                              type="button"
                              className={`qd-preset-pill ${businessSettings.schedulePreset === 'mon-fri' ? 'active' : ''}`}
                              onClick={() => applySchedulePreset('mon-fri')}
                            >
                              Monday - Friday (Weekdays)
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="field-label" style={{ marginBottom: 8, display: 'block' }}>Active Working Days</label>
                          <div className="qd-days-chips-row">
                            {WEEKDAYS.map(day => {
                              const isActive = (businessSettings.workingDays || []).includes(day.id);
                              return (
                                <button
                                  key={day.id}
                                  type="button"
                                  className={`qd-day-chip ${isActive ? 'active' : ''}`}
                                  onClick={() => toggleWorkingDay(day.id)}
                                  title={`Toggle ${day.full}`}
                                >
                                  {day.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
                            <input 
                              type="checkbox" 
                              checked={businessSettings.isOpen24Hours || false}
                              onChange={(e) => setBusinessSettings({ ...businessSettings, isOpen24Hours: e.target.checked })}
                              style={{ width: 16, height: 16, cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                              Open 24 Hours / Always Open Online
                            </span>
                          </label>

                          {!businessSettings.isOpen24Hours && (
                            <div className="qd-time-inputs-grid">
                              <div className="field-group" style={{ margin: 0 }}>
                                <label className="field-label">Opening Time</label>
                                <input 
                                  type="text" 
                                  value={businessSettings.openTime || '09:00 AM'}
                                  onChange={(e) => setBusinessSettings({ ...businessSettings, openTime: e.target.value })}
                                  className="custom-input"
                                  placeholder="09:00 AM"
                                />
                              </div>

                              <div className="field-group" style={{ margin: 0 }}>
                                <label className="field-label">Closing Time</label>
                                <input 
                                  type="text" 
                                  value={businessSettings.closeTime || '09:00 PM'}
                                  onChange={(e) => setBusinessSettings({ ...businessSettings, closeTime: e.target.value })}
                                  className="custom-input"
                                  placeholder="09:00 PM"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="field-group" style={{ margin: 0 }}>
                          <label className="field-label">Holiday / Weekly Off Note</label>
                          <input 
                            type="text" 
                            value={businessSettings.closedNote || ''}
                            onChange={(e) => setBusinessSettings({ ...businessSettings, closedNote: e.target.value })}
                            className="custom-input"
                            placeholder="e.g. Closed on Sundays & Public Holidays"
                          />
                        </div>

                        {/* Live Customer Preview */}
                        <div className="qd-schedule-preview-box">
                          <div className="qd-schedule-preview-icon">
                            <Clock size={20} />
                          </div>
                          <div className="qd-schedule-preview-text">
                            <strong>Customer View:</strong>
                            {businessSettings.isOpen24Hours ? (
                              <span>Open 24 Hours / 7 Days Online</span>
                            ) : (
                              <span>
                                {((businessSettings.workingDays || []).join(', ') || 'No active days')}
                                {`: ${businessSettings.openTime || '09:00 AM'} – ${businessSettings.closeTime || '09:00 PM'}`}
                                {businessSettings.closedNote ? ` • ${businessSettings.closedNote}` : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: SOCIAL MEDIA PLATFORMS */}
                  {settingsTab === 'social' && (
                    <div className="qd-form-section">
                      <div className="qd-settings-intro">
                        <h3>Social Media & Online Presence</h3>
                        <p>Connect multiple channels so customers can follow, message, and engage with your store.</p>
                      </div>

                      <div className="qd-social-grid">
                        
                        {/* WhatsApp */}
                        <div className="qd-social-card">
                          <div className="qd-social-card-head">
                            <span className="qd-social-badge">
                              <span className="qd-social-icon-box qd-icon-wa">
                                <MessageCircle size={15} />
                              </span>
                              <span>WhatsApp</span>
                            </span>
                            {businessSettings.whatsapp && (
                              <a 
                                href={`https://wa.me/${businessSettings.whatsapp.replace(/\D/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="qd-social-test-link"
                              >
                                Test <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                          <input 
                            type="tel"
                            value={businessSettings.whatsapp || ''}
                            onChange={(e) => setBusinessSettings({ ...businessSettings, whatsapp: e.target.value })}
                            className="custom-input"
                            placeholder="919876543210"
                          />
                        </div>

                        {/* Instagram */}
                        <div className="qd-social-card">
                          <div className="qd-social-card-head">
                            <span className="qd-social-badge">
                              <span className="qd-social-icon-box qd-icon-ig">
                                <InstagramIcon size={15} />
                              </span>
                              <span>Instagram</span>
                            </span>
                            {businessSettings.instagram && (
                              <a 
                                href={`https://instagram.com/${businessSettings.instagram.replace(/^@/, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="qd-social-test-link"
                              >
                                View <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={businessSettings.instagram || ''}
                            onChange={(e) => setBusinessSettings({ ...businessSettings, instagram: e.target.value })}
                            className="custom-input"
                            placeholder="@storename or link"
                          />
                        </div>

                        {/* Facebook */}
                        <div className="qd-social-card">
                          <div className="qd-social-card-head">
                            <span className="qd-social-badge">
                              <span className="qd-social-icon-box qd-icon-fb">
                                <FacebookIcon size={14} />
                              </span>
                              <span>Facebook</span>
                            </span>
                            {businessSettings.facebook && (
                              <a 
                                href={businessSettings.facebook.startsWith('http') ? businessSettings.facebook : `https://facebook.com/${businessSettings.facebook}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="qd-social-test-link"
                              >
                                View <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={businessSettings.facebook || ''}
                            onChange={(e) => setBusinessSettings({ ...businessSettings, facebook: e.target.value })}
                            className="custom-input"
                            placeholder="facebook.com/yourpage"
                          />
                        </div>

                        {/* YouTube */}
                        <div className="qd-social-card">
                          <div className="qd-social-card-head">
                            <span className="qd-social-badge">
                              <span className="qd-social-icon-box qd-icon-yt">
                                <YoutubeIcon size={14} />
                              </span>
                              <span>YouTube</span>
                            </span>
                            {businessSettings.youtube && (
                              <a 
                                href={businessSettings.youtube.startsWith('http') ? businessSettings.youtube : `https://youtube.com/${businessSettings.youtube}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="qd-social-test-link"
                              >
                                View <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={businessSettings.youtube || ''}
                            onChange={(e) => setBusinessSettings({ ...businessSettings, youtube: e.target.value })}
                            className="custom-input"
                            placeholder="youtube.com/@channel"
                          />
                        </div>

                        {/* Twitter / X */}
                        <div className="qd-social-card">
                          <div className="qd-social-card-head">
                            <span className="qd-social-badge">
                              <span className="qd-social-icon-box qd-icon-tw">
                                <TwitterIcon size={13} />
                              </span>
                              <span>Twitter / X</span>
                            </span>
                          </div>
                          <input 
                            type="text"
                            value={businessSettings.twitter || ''}
                            onChange={(e) => setBusinessSettings({ ...businessSettings, twitter: e.target.value })}
                            className="custom-input"
                            placeholder="@handle"
                          />
                        </div>

                        {/* TikTok */}
                        <div className="qd-social-card">
                          <div className="qd-social-card-head">
                            <span className="qd-social-badge">
                              <span className="qd-social-icon-box qd-icon-tt">
                                <TikTokIcon size={13} />
                              </span>
                              <span>TikTok / Threads</span>
                            </span>
                          </div>
                          <input 
                            type="text"
                            value={businessSettings.tiktok || ''}
                            onChange={(e) => setBusinessSettings({ ...businessSettings, tiktok: e.target.value })}
                            className="custom-input"
                            placeholder="@handle"
                          />
                        </div>

                        {/* Store Location / Google Maps */}
                        <div className="qd-social-card">
                          <div className="qd-social-card-head">
                            <span className="qd-social-badge">
                              <span className="qd-social-icon-box qd-icon-maps">
                                <MapPin size={15} />
                              </span>
                              <span>Google Maps Pin</span>
                            </span>
                            {businessSettings.googleMapsUrl && (
                              <a 
                                href={businessSettings.googleMapsUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="qd-social-test-link"
                              >
                                Open <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                          <input 
                            type="url"
                            value={businessSettings.googleMapsUrl || ''}
                            onChange={(e) => setBusinessSettings({ ...businessSettings, googleMapsUrl: e.target.value })}
                            className="custom-input"
                            placeholder="https://maps.google.com/?q=..."
                          />
                        </div>

                        {/* Website */}
                        <div className="qd-social-card">
                          <div className="qd-social-card-head">
                            <span className="qd-social-badge">
                              <span className="qd-social-icon-box qd-icon-web">
                                <Globe size={15} />
                              </span>
                              <span>Website / Store Link</span>
                            </span>
                            {businessSettings.website && (
                              <a 
                                href={businessSettings.website.startsWith('http') ? businessSettings.website : `https://${businessSettings.website}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="qd-social-test-link"
                              >
                                Visit <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                          <input 
                            type="url"
                            value={businessSettings.website || ''}
                            onChange={(e) => setBusinessSettings({ ...businessSettings, website: e.target.value })}
                            className="custom-input"
                            placeholder="https://yourstore.com"
                          />
                        </div>

                      </div>

                      {/* Dynamic Custom Links Section */}
                      <div className="qd-custom-link-box">
                        <label className="field-label" style={{ margin: 0 }}>Add Other Platform Links (LinkedIn, Telegram, Pinterest, etc.)</label>
                        
                        {(businessSettings.customLinks || []).length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {(businessSettings.customLinks || []).map(link => (
                              <div key={link.id} className="qd-custom-link-item">
                                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{link.title}</span>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.url}</span>
                                <button 
                                  type="button" 
                                  className="btn btn-ghost btn-sm text-danger"
                                  onClick={() => handleRemoveCustomLink(link.id)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <input 
                            type="text" 
                            placeholder="Platform Name (e.g. Telegram)"
                            value={newCustomLinkTitle}
                            onChange={(e) => setNewCustomLinkTitle(e.target.value)}
                            className="custom-input"
                            style={{ flex: 1 }}
                          />
                          <input 
                            type="url" 
                            placeholder="https://t.me/..."
                            value={newCustomLinkUrl}
                            onChange={(e) => setNewCustomLinkUrl(e.target.value)}
                            className="custom-input"
                            style={{ flex: 2 }}
                          />
                          <button 
                            type="button" 
                            className="btn btn-outline btn-sm"
                            onClick={handleAddCustomLink}
                          >
                            <Plus size={14} /> Add Link
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 4: CONTACT & LOCATION */}
                  {settingsTab === 'contact' && (
                    <div className="qd-form-section">
                      <div className="qd-settings-intro">
                        <h3>Contact Details & Store Location</h3>
                        <p>Customer communication channels and physical location.</p>
                      </div>

                      <div className="field-group">
                        <label className="field-label">WhatsApp Number (Orders & Inquiries) <span className="req">*</span></label>
                        <input 
                          type="tel" 
                          value={businessSettings.whatsapp}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, whatsapp: e.target.value })}
                          className="custom-input"
                          placeholder="e.g. 919876543210"
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label">Direct Phone Call Number</label>
                        <input 
                          type="tel" 
                          value={businessSettings.phone}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                          className="custom-input"
                          placeholder="e.g. 0484 2345678"
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label">Support Email Address</label>
                        <input 
                          type="email" 
                          value={businessSettings.email || ''}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
                          className="custom-input"
                          placeholder="e.g. contact@harisstore.com"
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label">Physical Store Street Address</label>
                        <input 
                          type="text" 
                          value={businessSettings.address}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                          className="custom-input"
                          placeholder="e.g. MG Road, Near Metro Station"
                        />
                      </div>

                      <div className="field-row">
                        <div className="field-group">
                          <label className="field-label">City / Town</label>
                          <input 
                            type="text" 
                            value={businessSettings.city || 'Kochi'}
                            onChange={(e) => setBusinessSettings({ ...businessSettings, city: e.target.value })}
                            className="custom-input"
                          />
                        </div>
                        <div className="field-group">
                          <label className="field-label">Pincode</label>
                          <input 
                            type="text" 
                            value={businessSettings.pincode || ''}
                            onChange={(e) => setBusinessSettings({ ...businessSettings, pincode: e.target.value })}
                            className="custom-input"
                            placeholder="682001"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: CURRENCY & PREFERENCES */}
                  {settingsTab === 'currency' && (
                    <div className="qd-form-section">
                      <div className="qd-settings-intro">
                        <h3>Currency & Regional Preferences</h3>
                        <p>Choose your default price symbol and customer messaging format.</p>
                      </div>

                      <div className="field-group">
                        <label className="field-label" style={{ marginBottom: 10 }}>Select Store Currency</label>
                        <div className="qd-currency-cards-grid">
                          {CURRENCIES.map(curr => (
                            <div 
                              key={curr.code}
                              className={`qd-currency-card ${businessSettings.currency === curr.symbol ? 'active' : ''}`}
                              onClick={() => setBusinessSettings({ ...businessSettings, currency: curr.symbol })}
                            >
                              <div className="qd-currency-symbol">{curr.symbol}</div>
                              <div>
                                <div className="qd-currency-name">{curr.name}</div>
                                <div className="qd-currency-code">{curr.code}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="field-group" style={{ marginTop: 20 }}>
                        <label className="field-label">Default WhatsApp Order Message Prefix</label>
                        <input 
                          type="text" 
                          value={businessSettings.whatsappMessageTemplate || 'Hello! I would like to place an order from your catalog:'}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, whatsappMessageTemplate: e.target.value })}
                          className="custom-input"
                        />
                      </div>
                    </div>
                  )}

                  {/* Bottom Save Bar */}
                  <div className="qd-settings-save-bar">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSavingSettings}
                    >
                      {isSavingSettings ? (
                        <>
                          <span className="qd-spinner-sm" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

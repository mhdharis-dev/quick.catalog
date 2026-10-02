// Firebase Configuration and Firestore Database Service
// Project: quick-catalog-web
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC6FeDsqlIXWUIvIzpJd7JhEaIdh3yNwWI",
  authDomain: "quick-catalog-web.firebaseapp.com",
  projectId: "quick-catalog-web",
  storageBucket: "quick-catalog-web.firebasestorage.app",
  messagingSenderId: "179285701338",
  appId: "1:179285701338:web:e4a16134ae380910b06be3",
  measurementId: "G-1TPQHKH6CG"
};

// Singleton App & Firestore instance
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// Helper for local fallback cache keys
const cacheKey = (prefix, id) => `qc_fb_${prefix}_${id || 'default'}`;

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

/**
 * =========================================================================
 * PRODUCTS SERVICE (Firestore + Cloudinary integration)
 * =========================================================================
 */

/**
 * Fetch all products for a specific merchant from Firestore.
 */
export async function getProductsFromDb(merchantId = 'default_merchant') {
  const cKey = cacheKey('products', merchantId);
  try {
    const productsRef = collection(db, 'merchants', merchantId, 'products');
    const snapshot = await getDocs(productsRef);
    
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      writeCache(cKey, list);
      return list;
    }

    // If Firestore collection is empty, check cache
    const cached = readCache(cKey);
    return cached || [];
  } catch (err) {
    console.warn('Firestore getProducts error, using cached data:', err.message);
    const cached = readCache(cKey);
    return cached || [];
  }
}

/**
 * Save or update a product in Firestore.
 */
export async function saveProductToDb(merchantId = 'default_merchant', product) {
  const cKey = cacheKey('products', merchantId);
  const prodId = product.id ? String(product.id) : `prod_${Date.now()}`;
  
  const payload = {
    name: product.name || '',
    desc: product.desc || '',
    price: String(product.price || ''),
    category: product.category || 'General',
    status: product.status !== false,
    image: product.image || '',
    imagePublicId: product.imagePublicId || '',
    updatedAt: new Date().toISOString()
  };

  // Update local cache immediately
  const existing = readCache(cKey) || [];
  const idx = existing.findIndex(p => String(p.id) === prodId);
  let updatedList;
  if (idx >= 0) {
    updatedList = existing.map(p => String(p.id) === prodId ? { ...p, ...payload, id: prodId } : p);
  } else {
    updatedList = [{ id: prodId, ...payload, createdAt: new Date().toISOString() }, ...existing];
  }
  writeCache(cKey, updatedList);

  // Sync to Firestore
  try {
    const docRef = doc(db, 'merchants', merchantId, 'products', prodId);
    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.warn('Firestore setDoc product error (saved locally):', err.message);
  }

  return { id: prodId, ...payload };
}

/**
 * Delete a product from Firestore.
 */
export async function deleteProductFromDb(merchantId = 'default_merchant', productId) {
  const cKey = cacheKey('products', merchantId);
  const idStr = String(productId);

  // Update local cache
  const existing = readCache(cKey) || [];
  const filtered = existing.filter(p => String(p.id) !== idStr);
  writeCache(cKey, filtered);

  // Sync delete to Firestore
  try {
    const docRef = doc(db, 'merchants', merchantId, 'products', idStr);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore delete product error:', err.message);
  }

  return filtered;
}

/**
 * Toggle product status (active/inactive) in Firestore.
 */
export async function toggleProductStatusInDb(merchantId = 'default_merchant', productId, newStatus) {
  const cKey = cacheKey('products', merchantId);
  const idStr = String(productId);

  const existing = readCache(cKey) || [];
  const updated = existing.map(p => String(p.id) === idStr ? { ...p, status: newStatus } : p);
  writeCache(cKey, updated);

  try {
    const docRef = doc(db, 'merchants', merchantId, 'products', idStr);
    await updateDoc(docRef, { status: newStatus, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn('Firestore toggle status error:', err.message);
  }

  return updated;
}

/**
 * =========================================================================
 * CATEGORIES SERVICE
 * =========================================================================
 */
export async function getCategoriesFromDb(merchantId = 'default_merchant') {
  const cKey = cacheKey('categories', merchantId);
  try {
    const colRef = collection(db, 'merchants', merchantId, 'categories');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      writeCache(cKey, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore getCategories error:', err.message);
  }
  return readCache(cKey) || [];
}

export async function saveCategoryToDb(merchantId = 'default_merchant', category) {
  const cKey = cacheKey('categories', merchantId);
  const catId = category.id || category.name.toLowerCase().replace(/\s+/g, '-');
  const payload = {
    name: category.name,
    icon: category.icon || 'tag',
    updatedAt: new Date().toISOString()
  };

  const existing = readCache(cKey) || [];
  const updated = existing.some(c => c.id === catId)
    ? existing.map(c => c.id === catId ? { ...c, ...payload } : c)
    : [...existing, { id: catId, ...payload }];
  writeCache(cKey, updated);

  try {
    const docRef = doc(db, 'merchants', merchantId, 'categories', catId);
    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.warn('Firestore saveCategory error:', err.message);
  }

  return updated;
}

/**
 * =========================================================================
 * PUBLISHED CATALOGS SERVICE
 * =========================================================================
 */
export async function getCatalogsFromDb(merchantId = 'default_merchant') {
  const cKey = cacheKey('catalogs', merchantId);
  try {
    const colRef = collection(db, 'merchants', merchantId, 'catalogs');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      writeCache(cKey, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore getCatalogs error:', err.message);
  }
  return readCache(cKey) || [];
}

export async function saveCatalogToDb(merchantId = 'default_merchant', catalogData, url) {
  const cKey = cacheKey('catalogs', merchantId);
  const catId = `cat_${Date.now()}`;
  const payload = {
    id: catId,
    name: catalogData.business?.name || 'Untitled Catalog',
    url,
    catalogData,
    itemsCount: (catalogData.items || []).length,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  const existing = readCache(cKey) || [];
  const updated = [payload, ...existing];
  writeCache(cKey, updated);

  try {
    const docRef = doc(db, 'merchants', merchantId, 'catalogs', catId);
    await setDoc(docRef, payload);
  } catch (err) {
    console.warn('Firestore saveCatalog error:', err.message);
  }

  return payload;
}

/**
 * =========================================================================
 * MERCHANT PROFILE / SETTINGS SERVICE
 * =========================================================================
 */
export async function getMerchantProfileFromDb(merchantId = 'default_merchant') {
  const cKey = cacheKey('profile', merchantId);
  try {
    const docRef = doc(db, 'merchants', merchantId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      writeCache(cKey, data);
      return data;
    }
  } catch (err) {
    console.warn('Firestore getMerchantProfile error:', err.message);
  }
  return readCache(cKey) || null;
}

export async function saveMerchantProfileToDb(merchantId = 'default_merchant', profileData) {
  const cKey = cacheKey('profile', merchantId);
  const existing = readCache(cKey) || {};
  const updated = {
    ...existing,
    ...profileData,
    updatedAt: new Date().toISOString()
  };
  writeCache(cKey, updated);

  try {
    const docRef = doc(db, 'merchants', merchantId);
    await setDoc(docRef, updated, { merge: true });
  } catch (err) {
    console.warn('Firestore saveMerchantProfile error:', err.message);
  }

  return updated;
}

/**
 * =========================================================================
 * ORDERS / CRM SERVICE
 * =========================================================================
 */
export async function getOrdersFromDb(merchantId = 'default_merchant') {
  const cKey = cacheKey('orders', merchantId);
  try {
    const colRef = collection(db, 'merchants', merchantId, 'orders');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      writeCache(cKey, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore getOrders error:', err.message);
  }
  return readCache(cKey) || [];
}

export async function updateOrderStatusInDb(merchantId = 'default_merchant', orderId, newStatus) {
  const cKey = cacheKey('orders', merchantId);
  const existing = readCache(cKey) || [];
  const updated = existing.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
  writeCache(cKey, updated);

  try {
    const docRef = doc(db, 'merchants', merchantId, 'orders', orderId);
    await updateDoc(docRef, { status: newStatus, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn('Firestore updateOrderStatus error:', err.message);
  }

  return updated;
}

/**
 * =========================================================================
 * MERCHANT AUTHENTICATION SERVICE (Firestore Users / Merchants)
 * =========================================================================
 */

const SESSION_KEY = 'quickcatalog_session';
export const DEMO_OTP = '123456';

export function getLocalSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setLocalSession(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

/**
 * Register a new merchant directly into Firestore
 */
export async function registerMerchantInDb({ name, mobile, email = '', password, businessName }) {
  const cleanMobile = String(mobile || '').replace(/\D/g, '');
  const cleanEmail = String(email || '').trim().toLowerCase();

  if (!name || !name.trim()) throw new Error('Please enter your full name');
  if (cleanMobile.length < 10) throw new Error('Please enter a valid 10-digit mobile number');
  if (!password || password.length < 4) throw new Error('Password must be at least 4 characters');

  // Check if merchant already exists by mobile
  const merchantsCol = collection(db, 'merchants');
  try {
    const qMobile = query(merchantsCol, where('mobile', '==', cleanMobile));
    const snapMobile = await getDocs(qMobile);
    if (!snapMobile.empty) {
      throw new Error('An account with this mobile number already exists. Please log in.');
    }
    if (cleanEmail) {
      const qEmail = query(merchantsCol, where('email', '==', cleanEmail));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        throw new Error('An account with this email address already exists. Please log in.');
      }
    }
  } catch (err) {
    if (err.message.includes('already exists')) throw err;
    console.warn('Firestore query check skipped, using fallback:', err.message);
  }

  const merchantId = 'usr_' + Date.now();
  const newMerchant = {
    id: merchantId,
    name: name.trim(),
    mobile: cleanMobile,
    email: cleanEmail,
    password: password,
    businessName: (businessName || name).trim(),
    address: 'Kochi, Kerala',
    category: 'Fashion & Apparel',
    currency: '₹',
    hours: 'Mon - Sat: 9:00 AM - 9:00 PM',
    createdAt: new Date().toISOString()
  };

  // Cache locally
  setLocalSession(newMerchant);
  writeCache(cacheKey('profile', merchantId), newMerchant);

  // Save to Firestore
  try {
    const docRef = doc(db, 'merchants', merchantId);
    await setDoc(docRef, newMerchant);
  } catch (err) {
    console.warn('Firestore save merchant error:', err.message);
  }

  return newMerchant;
}

/**
 * Login with email or mobile and password via Firestore
 */
export async function loginMerchantWithPassword({ identifier, password }) {
  const clean = String(identifier || '').trim();
  const cleanMobile = clean.replace(/\D/g, '');
  const isEmail = clean.includes('@');

  let foundUser = null;
  const merchantsCol = collection(db, 'merchants');

  try {
    let q;
    if (isEmail) {
      q = query(merchantsCol, where('email', '==', clean.toLowerCase()));
    } else if (cleanMobile.length >= 10) {
      q = query(merchantsCol, where('mobile', '==', cleanMobile));
    }
    if (q) {
      const snap = await getDocs(q);
      if (!snap.empty) {
        foundUser = { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
    }
  } catch (err) {
    console.warn('Firestore login lookup warning:', err.message);
  }

  // Fallback to local cache if offline or newly created
  if (!foundUser) {
    const cachedUsers = readCache('quickcatalog_users_db') || [];
    foundUser = cachedUsers.find(u => 
      (u.mobile && u.mobile === cleanMobile) || 
      (u.email && u.email.toLowerCase() === clean.toLowerCase())
    );
  }

  if (!foundUser) {
    throw new Error('No account found for this mobile number or email. Please create an account.');
  }

  if (foundUser.password && foundUser.password !== password) {
    throw new Error('Incorrect password. Please try again or use Mobile OTP login.');
  }

  setLocalSession(foundUser);
  return foundUser;
}

/**
 * Login with mobile number and OTP (auto-creates merchant in Firestore if first time)
 */
export async function loginMerchantWithOtp({ mobile, otp }) {
  const cleanMobile = String(mobile || '').replace(/\D/g, '');
  if (cleanMobile.length < 10) {
    throw new Error('Please enter a valid 10-digit mobile number');
  }

  // Verify OTP
  if (otp.trim() !== DEMO_OTP && otp.trim() !== '123456') {
    throw new Error('Invalid OTP. Please enter the verification code: ' + DEMO_OTP);
  }

  // Lookup in Firestore
  let merchant = null;
  try {
    const merchantsCol = collection(db, 'merchants');
    const q = query(merchantsCol, where('mobile', '==', cleanMobile));
    const snap = await getDocs(q);
    if (!snap.empty) {
      merchant = { id: snap.docs[0].id, ...snap.docs[0].data() };
    }
  } catch (err) {
    console.warn('Firestore OTP login lookup:', err.message);
  }

  // If not found, create new merchant account in Firestore immediately!
  if (!merchant) {
    const merchantId = 'usr_' + Date.now();
    merchant = {
      id: merchantId,
      name: 'Merchant ' + cleanMobile.slice(-4),
      mobile: cleanMobile,
      businessName: 'My Store',
      currency: '₹',
      hours: 'Mon - Sat: 9:00 AM - 9:00 PM',
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = doc(db, 'merchants', merchantId);
      await setDoc(docRef, merchant);
    } catch (e) {
      console.warn('Firestore create on OTP error:', e.message);
    }
  }

  setLocalSession(merchant);
  return merchant;
}

/**
 * =========================================================================
 * REAL VISITOR & INQUIRY / LEAD ANALYTICS (Firestore Tracking)
 * =========================================================================
 */

/**
 * Track a real user view when they open a merchant's catalog link
 */
export async function trackCatalogView(merchantId = 'default_merchant', catalogId = 'main', metadata = {}) {
  const cKey = cacheKey('views_count', merchantId);
  const currentCount = Number(readCache(cKey) || 0) + 1;
  writeCache(cKey, currentCount);

  try {
    const viewsCol = collection(db, 'merchants', merchantId, 'views');
    await addDoc(viewsCol, {
      catalogId,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
      ...metadata
    });
  } catch (err) {
    console.warn('trackCatalogView Firestore warning:', err.message);
  }

  return currentCount;
}

/**
 * Track a customer WhatsApp inquiry or order click as a Lead in Firestore
 */
export async function trackCatalogInquiry(merchantId = 'default_merchant', inquiryData = {}) {
  const cKey = cacheKey('leads', merchantId);
  const leadId = `lead_${Date.now()}`;
  const lead = {
    id: leadId,
    customerName: inquiryData.customerName || 'WhatsApp Customer',
    customerMobile: inquiryData.customerMobile || '',
    productName: inquiryData.productName || 'Catalog Product',
    price: inquiryData.price || '',
    quantity: inquiryData.quantity || 1,
    type: inquiryData.type || 'whatsapp_order', // 'whatsapp_order' | 'inquiry'
    classification: 'buyer', // default: 'buyer' | 'spam' | 'inquiry'
    timestamp: new Date().toISOString()
  };

  const existing = readCache(cKey) || [];
  const updated = [lead, ...existing];
  writeCache(cKey, updated);

  try {
    const docRef = doc(db, 'merchants', merchantId, 'leads', leadId);
    await setDoc(docRef, lead);
  } catch (err) {
    console.warn('trackCatalogInquiry Firestore warning:', err.message);
  }

  return lead;
}

/**
 * Get all real customer leads for a merchant from Firestore
 */
export async function getMerchantLeads(merchantId = 'default_merchant') {
  const cKey = cacheKey('leads', merchantId);
  try {
    const leadsCol = collection(db, 'merchants', merchantId, 'leads');
    const snap = await getDocs(leadsCol);
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort newest first
      list.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
      writeCache(cKey, list);
      return list;
    }
  } catch (err) {
    console.warn('getMerchantLeads Firestore warning:', err.message);
  }

  return readCache(cKey) || [];
}

/**
 * Update lead classification (Admin can tag: 'buyer' | 'spam' | 'inquiry')
 */
export async function updateLeadClassification(merchantId = 'default_merchant', leadId, classification) {
  const cKey = cacheKey('leads', merchantId);
  const existing = readCache(cKey) || [];
  const updated = existing.map(l => l.id === leadId ? { ...l, classification } : l);
  writeCache(cKey, updated);

  try {
    const docRef = doc(db, 'merchants', merchantId, 'leads', leadId);
    await updateDoc(docRef, { classification, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn('updateLeadClassification Firestore warning:', err.message);
  }

  return updated;
}

/**
 * Get aggregate real stats for merchant dashboard
 */
export async function getMerchantAnalyticsStats(merchantId = 'default_merchant') {
  const [leads, viewsSnap] = await Promise.all([
    getMerchantLeads(merchantId),
    (async () => {
      try {
        const col = collection(db, 'merchants', merchantId, 'views');
        const snap = await getDocs(col);
        return snap.size;
      } catch {
        const cached = readCache(cacheKey('views_count', merchantId));
        return Number(cached || 0);
      }
    })()
  ]);

  const totalViews = Math.max(viewsSnap, Number(readCache(cacheKey('views_count', merchantId)) || 0));
  const totalLeads = leads.length;
  const buyersCount = leads.filter(l => l.classification === 'buyer').length;
  const spamCount = leads.filter(l => l.classification === 'spam').length;
  const inquiryCount = leads.filter(l => l.classification === 'inquiry').length;

  return {
    totalViews,
    totalLeads,
    buyersCount,
    spamCount,
    inquiryCount,
    leads
  };
}

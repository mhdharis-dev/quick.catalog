// Authentication & Business Owner Storage Service

const USERS_KEY = 'quickcatalog_users_db';
const SESSION_KEY = 'quickcatalog_session';
const CATALOGS_KEY = 'quickcatalog_saved_catalogs';
const ORDERS_KEY = 'quickcatalog_store_orders';
const CUSTOMERS_KEY = 'quickcatalog_store_customers';

export const DEMO_OTP = '123456';

export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function registerUser({ name, mobile, password, businessName }) {
  const users = getUsers();
  const cleanMobile = String(mobile || '').replace(/\D/g, '');
  
  if (!name.trim()) throw new Error('Please enter your full name');
  if (cleanMobile.length < 10) throw new Error('Please enter a valid 10-digit mobile number');
  if (!password || password.length < 4) throw new Error('Password must be at least 4 characters');

  const existing = users.find(u => u.mobile === cleanMobile);
  if (existing) {
    throw new Error('An account with this mobile number already exists. Please log in.');
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name: name.trim(),
    mobile: cleanMobile,
    password: password,
    businessName: (businessName || '').trim(),
    address: 'Kochi, Kerala',
    instagram: '',
    currency: '₹',
    category: 'Retail & Boutique',
    upiId: `${cleanMobile}@upi`,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  return newUser;
}

export function loginWithPassword({ mobile, password }) {
  const users = getUsers();
  const cleanMobile = String(mobile || '').replace(/\D/g, '');

  const user = users.find(u => u.mobile === cleanMobile);
  if (!user) {
    throw new Error('No account found for this mobile number. Please register first.');
  }

  if (user.password !== password) {
    throw new Error('Incorrect password. Please try again or use OTP login.');
  }

  setCurrentUser(user);
  return user;
}

export function loginWithOtp({ mobile, otp }) {
  const cleanMobile = String(mobile || '').replace(/\D/g, '');
  if (cleanMobile.length < 10) {
    throw new Error('Please enter a valid 10-digit mobile number');
  }

  if (otp.trim() !== DEMO_OTP) {
    throw new Error('Invalid OTP. Please enter the demo code 123456');
  }

  const users = getUsers();
  let user = users.find(u => u.mobile === cleanMobile);

  // If user doesn't exist yet, auto-create a profile on verified OTP
  if (!user) {
    user = {
      id: 'usr_' + Date.now(),
      name: 'Business Owner',
      mobile: cleanMobile,
      password: 'otp_user',
      businessName: '',
      address: 'Kochi, Kerala',
      instagram: '',
      currency: '₹',
      category: 'Retail & Boutique',
      upiId: `${cleanMobile}@upi`,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
  }

  setCurrentUser(user);
  return user;
}

export function logoutUser() {
  setCurrentUser(null);
}

export function updateUserProfile(userId, profileData) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found');

  const updatedUser = {
    ...users[index],
    ...profileData
  };

  users[index] = updatedUser;
  saveUsers(users);
  setCurrentUser(updatedUser);
  return updatedUser;
}

// User Published Catalogs and Dashboard Analytics
export function getUserCatalogs(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`${CATALOGS_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveUserCatalog(userId, catalogData, url) {
  if (!userId) return null;
  const list = getUserCatalogs(userId);
  const now = new Date();
  
  // Calculate catalog revenue potential
  const totalValue = (catalogData.items || []).reduce((sum, it) => {
    const num = parseFloat(String(it.price || '0').replace(/[^\d.]/g, '')) || 0;
    return sum + num;
  }, 0);

  // Check if updating existing
  const existingIdx = list.findIndex(c => c.catalogData.business.name === catalogData.business.name);
  let savedEntry;

  if (existingIdx >= 0) {
    savedEntry = {
      ...list[existingIdx],
      url,
      catalogData,
      itemsCount: catalogData.items.length,
      revenuePotential: totalValue,
      lastUpdated: now.toISOString(),
      views: list[existingIdx].views + 1
    };
    list[existingIdx] = savedEntry;
  } else {
    savedEntry = {
      id: 'cat_' + Date.now(),
      name: catalogData.business.name || 'Untitled Catalog',
      url,
      catalogData,
      itemsCount: catalogData.items.length,
      views: Math.floor(Math.random() * 25) + 12,
      inquiries: Math.floor(Math.random() * 8) + 3,
      revenuePotential: totalValue,
      createdAt: now.toISOString(),
      lastUpdated: now.toISOString()
    };
    list.unshift(savedEntry);
  }

  localStorage.setItem(`${CATALOGS_KEY}_${userId}`, JSON.stringify(list));
  return savedEntry;
}

export function deleteUserCatalog(userId, catalogId) {
  const list = getUserCatalogs(userId);
  const filtered = list.filter(c => c.id !== catalogId);
  localStorage.setItem(`${CATALOGS_KEY}_${userId}`, JSON.stringify(filtered));
  return filtered;
}

// Store Orders & Inquiries (CRM)
export function getStoreOrders(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`${ORDERS_KEY}_${userId}`);
    if (raw) return JSON.parse(raw);

    // Initial seed orders for realistic merchant experience
    const initialOrders = [
      {
        id: 'ORD-1042',
        customerName: 'Ananya Sharma',
        customerPhone: '9847123450',
        items: ['Kasavu Traditional Saree (1)', 'Cotton Kurti (1)'],
        total: 3798,
        status: 'New',
        date: 'Today, 10:45 AM',
        source: 'WhatsApp'
      },
      {
        id: 'ORD-1041',
        customerName: 'Rahul Varma',
        customerPhone: '9446098765',
        items: ['Pure Cotton Kurti (2)'],
        total: 1798,
        status: 'Contacted',
        date: 'Today, 08:30 AM',
        source: 'WhatsApp'
      },
      {
        id: 'ORD-1040',
        customerName: 'Sneha Menon',
        customerPhone: '9895234567',
        items: ['Embroidered Chiffon Dupatta (2)', 'Blouse Stitching (1)'],
        total: 1550,
        status: 'Completed',
        date: 'Yesterday, 04:15 PM',
        source: 'QR Scan'
      },
      {
        id: 'ORD-1039',
        customerName: 'Mohammed Fasil',
        customerPhone: '9745112233',
        items: ['Kasavu Traditional Saree (1)'],
        total: 2899,
        status: 'Completed',
        date: '2 days ago',
        source: 'Direct Link'
      }
    ];
    localStorage.setItem(`${ORDERS_KEY}_${userId}`, JSON.stringify(initialOrders));
    return initialOrders;
  } catch (e) {
    return [];
  }
}

export function updateOrderStatus(userId, orderId, newStatus) {
  const orders = getStoreOrders(userId);
  const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
  localStorage.setItem(`${ORDERS_KEY}_${userId}`, JSON.stringify(updated));
  return updated;
}

// Store Customers (CRM)
export function getStoreCustomers(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`${CUSTOMERS_KEY}_${userId}`);
    if (raw) return JSON.parse(raw);

    const initialCustomers = [
      {
        id: 'CUST-01',
        name: 'Ananya Sharma',
        phone: '9847123450',
        city: 'Kochi',
        ordersCount: 3,
        totalSpent: 6248,
        lastActive: '10 mins ago',
        status: 'VIP'
      },
      {
        id: 'CUST-02',
        name: 'Rahul Varma',
        phone: '9446098765',
        city: 'Trivandrum',
        ordersCount: 2,
        totalSpent: 3596,
        lastActive: '2 hours ago',
        status: 'Regular'
      },
      {
        id: 'CUST-03',
        name: 'Sneha Menon',
        phone: '9895234567',
        city: 'Calicut',
        ordersCount: 4,
        totalSpent: 5900,
        lastActive: 'Yesterday',
        status: 'VIP'
      },
      {
        id: 'CUST-04',
        name: 'Mohammed Fasil',
        phone: '9745112233',
        city: 'Malappuram',
        ordersCount: 1,
        totalSpent: 2899,
        lastActive: '2 days ago',
        status: 'New'
      },
      {
        id: 'CUST-05',
        name: 'Deepa Nair',
        phone: '9496778899',
        city: 'Thrissur',
        ordersCount: 2,
        totalSpent: 4100,
        lastActive: '3 days ago',
        status: 'Regular'
      }
    ];
    localStorage.setItem(`${CUSTOMERS_KEY}_${userId}`, JSON.stringify(initialCustomers));
    return initialCustomers;
  } catch (e) {
    return [];
  }
}

export function addStoreCustomer(userId, customerData) {
  const customers = getStoreCustomers(userId);
  const newCust = {
    id: 'CUST-' + String(customers.length + 1).padStart(2, '0'),
    ordersCount: 1,
    totalSpent: 0,
    lastActive: 'Just now',
    status: 'New',
    ...customerData
  };
  customers.unshift(newCust);
  localStorage.setItem(`${CUSTOMERS_KEY}_${userId}`, JSON.stringify(customers));
  return customers;
}

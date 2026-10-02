export const PALETTES = [
  { id: 'indigo', name: 'Royal Indigo', primary: '#4f46e5', primaryDark: '#4338ca', accent: '#818cf8', tint: '#eef2ff' },
  { id: 'emerald', name: 'Emerald Forest', primary: '#059669', primaryDark: '#047857', accent: '#34d399', tint: '#ecfdf5' },
  { id: 'rose', name: 'Velvet Rose', primary: '#e11d48', primaryDark: '#be123c', accent: '#fb7185', tint: '#fff1f2' },
  { id: 'amber', name: 'Sunset Amber', primary: '#d97706', primaryDark: '#b45309', accent: '#fbbf24', tint: '#fffbeb' },
  { id: 'violet', name: 'Cyber Violet', primary: '#7c3aed', primaryDark: '#6d28d9', accent: '#a78bfa', tint: '#f5f3ff' },
  { id: 'cyan', name: 'Ocean Cyan', primary: '#0891b2', primaryDark: '#0e7490', accent: '#22d3ee', tint: '#ecfeff' },
];

export const CURRENCIES = [
  { symbol: '₹', code: 'INR', label: '₹ (INR - India)' },
  { symbol: '$', code: 'USD', label: '$ (USD - US Dollar)' },
  { symbol: '€', code: 'EUR', label: '€ (EUR - Euro)' },
  { symbol: '£', code: 'GBP', label: '£ (GBP - British Pound)' },
  { symbol: 'AED ', code: 'AED', label: 'AED (UAE Dirham)' },
  { symbol: 'SAR ', code: 'SAR', label: 'SAR (Saudi Riyal)' },
];

export const DEMO_CATALOGS = {
  boutique: {
    business: {
      name: "Meera's Handloom Boutique",
      whatsapp: "9876543210",
      phone: "+91 98765 43210",
      address: "M.G. Road, Kochi, Kerala",
      instagram: "@meerasboutique",
      theme: "rose",
      currency: "₹"
    },
    type: "products",
    items: [
      { id: 1, name: "Kasavu Traditional Saree", price: "2899", category: "Sarees", badge: "Bestseller", image: "" },
      { id: 2, name: "Handblock Pure Cotton Kurti", price: "899", category: "Kurtis", badge: "Trending", image: "" },
      { id: 3, name: "Embroidered Chiffon Dupatta", price: "450", category: "Accessories", badge: "", image: "" },
      { id: 4, name: "Custom Blouse Stitching", price: "650", category: "Tailoring", badge: "Popular", image: "" }
    ]
  },
  bakery: {
    business: {
      name: "Crumb & Co. Artisan Bakery",
      whatsapp: "9845012345",
      phone: "+91 98450 12345",
      address: "Panampilly Nagar, Ernakulam",
      instagram: "@crumbandco",
      theme: "amber",
      currency: "₹"
    },
    type: "products",
    items: [
      { id: 1, name: "Belgian Chocolate Truffle Cake", price: "750", category: "Cakes", badge: "Must Try", image: "" },
      { id: 2, name: "French Butter Croissant (Box of 2)", price: "240", category: "Pastries", badge: "Fresh", image: "" },
      { id: 3, name: "Sourdough Boule Artisan Loaf", price: "180", category: "Breads", badge: "", image: "" },
      { id: 4, name: "Caramel Iced Latte", price: "190", category: "Beverages", badge: "Special", image: "" }
    ]
  },
  agency: {
    business: {
      name: "PixelPulse Creative Studio",
      whatsapp: "971501234567",
      phone: "+971 50 123 4567",
      address: "Dubai Media City / Remote Worldwide",
      instagram: "@pixelpulse.design",
      theme: "indigo",
      currency: "AED "
    },
    type: "services",
    items: [
      { id: 1, name: "Complete Brand Identity & Logo Kit", price: "1800", category: "Branding", badge: "Full Package", image: "" },
      { id: 2, name: "High-Converting Landing Page UI/UX", price: "2400", category: "Web Design", badge: "High Demand", image: "" },
      { id: 3, name: "Social Media Reels & Posts Pack (15)", price: "950", category: "Content", badge: "Monthly", image: "" },
      { id: 4, name: "1-on-1 Design & Growth Consultation", price: "400", category: "Consulting", badge: "1 Hour", image: "" }
    ]
  }
};

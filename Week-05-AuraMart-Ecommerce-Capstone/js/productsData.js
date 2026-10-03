/* ==========================================================================
   AuraMart E-Commerce: Product Catalog Database
   ========================================================================== */

const PRODUCTS_DATA = [
  {
    id: 'prod-1',
    name: 'AuraSound Spatial Studio ANC Headphones',
    category: 'Audio',
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.9,
    reviewCount: 148,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    badge: 'Best Seller',
    stock: 15,
    description: 'Immerse yourself in high-resolution audio with custom 40mm beryllium drivers, active hybrid noise cancellation, and 45-hour ultra-extended battery life.',
    specs: {
      'Driver Size': '40mm Custom Beryllium',
      'Battery Life': 'Up to 45 Hours',
      'Connectivity': 'Bluetooth 5.3 & 3.5mm Aux',
      'Weight': '250g'
    }
  },
  {
    id: 'prod-2',
    name: 'Lumix Mechanical 75% Wireless Keyboard',
    category: 'Electronics',
    price: 149.99,
    originalPrice: 179.99,
    rating: 4.8,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    badge: 'Popular',
    stock: 22,
    description: 'Custom hot-swappable tactile switches, CNC aluminum chassis, south-facing RGB per-key illumination, and tri-mode Bluetooth / 2.4GHz connectivity.',
    specs: {
      'Form Factor': '75% Compact Layout',
      'Switch Type': 'Gateron Pro Yellow (Hot-swap)',
      'Chassis': 'CNC Anodized Aluminum',
      'Polling Rate': '1000Hz Ultra-Low Latency'
    }
  },
  {
    id: 'prod-3',
    name: 'Zenith OLED Ergonomic Ultra-Smartwatch',
    category: 'Wearables',
    price: 249.99,
    originalPrice: 289.99,
    rating: 4.7,
    reviewCount: 114,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    badge: 'New Arrival',
    stock: 18,
    description: 'Grade 5 titanium casing, always-on sapphire crystal AMOLED display, real-time SpO2, continuous ECG monitoring, and 50m water resistance.',
    specs: {
      'Display': '1.43" Super AMOLED Sapphire',
      'Water Resistance': '5 ATM / 50 Meters',
      'Battery': '14 Days Typical Use',
      'Sensors': 'Optical Heart Rate, ECG, Barometer'
    }
  },
  {
    id: 'prod-4',
    name: 'Apex Precision Ergonomic Wireless Mouse',
    category: 'Electronics',
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.6,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    badge: 'Featured',
    stock: 30,
    description: 'Engineered for all-day comfort with magnetic hyper-scroll, 26,000 DPI optical sensor, and multi-device cross-computer control.',
    specs: {
      'Sensor': '26K DPI Optical',
      'Weight': '98g Balanced',
      'Battery': '70 Days on USB-C Charge',
      'Buttons': '7 Programmable Macro Keys'
    }
  },
  {
    id: 'prod-5',
    name: 'AuraGlow Minimalist Ambient Desk Lamp',
    category: 'Home & Living',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.9,
    reviewCount: 65,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    badge: 'Design Award',
    stock: 12,
    description: 'Warm 2700K-6500K tunable lighting with stepless capacitive touch dimming and integrated 15W Qi fast wireless charging base.',
    specs: {
      'Color Temperature': '2700K - 6500K Tunable',
      'Wireless Charger': '15W Fast Qi Standard',
      'Materials': 'Matte Walnut & Brushed Steel',
      'Lifespan': '50,000 Hours LED'
    }
  },
  {
    id: 'prod-6',
    name: 'Nomad Horizon Carbon Fiber Backpack',
    category: 'Accessories',
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.8,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    badge: 'Top Rated',
    stock: 25,
    description: 'Weatherproof ballistic nylon with carbon fiber structural reinforcement, dedicated 16-inch suspended laptop pouch, and TSA checkpoint flat-fold.',
    specs: {
      'Capacity': '24 Liters Expandable',
      'Laptop Pocket': 'Fits up to 16" MacBook Pro',
      'Material': '1000D Cordura & Carbon Weave',
      'Zippers': 'YKK Weather-Proof AquaGuard'
    }
  }
];

if (typeof window !== 'undefined') {
  window.PRODUCTS_DATA = PRODUCTS_DATA;
}

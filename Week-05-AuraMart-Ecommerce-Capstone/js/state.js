/* ==========================================================================
   AuraMart E-Commerce: Reactive Centralized State Store
   ========================================================================== */

(function() {
  'use strict';

  const CART_KEY = 'auramart_cart_v1';
  const WISHLIST_KEY = 'auramart_wishlist_v1';
  const ORDERS_KEY = 'auramart_orders_v1';
  const THEME_KEY = 'auramart_theme';

  // Valid promo discount codes
  const PROMO_CODES = {
    'SAVE20': { discount: 0.20, label: '20% Off Internship Special' },
    'FREESHIP': { freeShipping: true, label: 'Free Express Shipping' },
    'AURA10': { discount: 0.10, label: '10% Welcome Discount' }
  };

  const listeners = [];

  const State = {
    cart: [],
    wishlist: [],
    orders: [],
    appliedCoupon: null,
    searchQuery: '',
    selectedCategory: 'all',
    priceMax: 350,
    minRating: 0,
    sortBy: 'featured',

    init() {
      this.loadLocalStorage();
      this.initTheme();
    },

    loadLocalStorage() {
      try {
        this.cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        this.wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
        this.orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      } catch (e) {
        this.cart = [];
        this.wishlist = [];
        this.orders = [];
      }
    },

    saveLocalStorage() {
      localStorage.setItem(CART_KEY, JSON.stringify(this.cart));
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.wishlist));
      localStorage.setItem(ORDERS_KEY, JSON.stringify(this.orders));
      this.notify();
    },

    initTheme() {
      const theme = localStorage.getItem(THEME_KEY) || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    },

    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      this.notify();
    },

    subscribe(fn) {
      listeners.push(fn);
    },

    notify() {
      listeners.forEach(fn => fn(this));
    },

    // Cart Operations
    addToCart(productId, quantity = 1) {
      const product = window.PRODUCTS_DATA.find(p => p.id === productId);
      if (!product) return;

      const existingIndex = this.cart.findIndex(item => item.id === productId);
      if (existingIndex > -1) {
        this.cart[existingIndex].quantity += quantity;
      } else {
        this.cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: quantity
        });
      }
      this.saveLocalStorage();
    },

    updateQuantity(productId, quantity) {
      const index = this.cart.findIndex(item => item.id === productId);
      if (index > -1) {
        if (quantity <= 0) {
          this.cart.splice(index, 1);
        } else {
          this.cart[index].quantity = quantity;
        }
        this.saveLocalStorage();
      }
    },

    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.id !== productId);
      this.saveLocalStorage();
    },

    clearCart() {
      this.cart = [];
      this.appliedCoupon = null;
      this.saveLocalStorage();
    },

    // Wishlist Operations
    toggleWishlist(productId) {
      const index = this.wishlist.indexOf(productId);
      if (index > -1) {
        this.wishlist.splice(index, 1);
      } else {
        this.wishlist.push(productId);
      }
      this.saveLocalStorage();
    },

    isInWishlist(productId) {
      return this.wishlist.includes(productId);
    },

    // Coupon Engine
    applyCoupon(code) {
      const clean = code.trim().toUpperCase();
      if (PROMO_CODES[clean]) {
        this.appliedCoupon = { code: clean, ...PROMO_CODES[clean] };
        this.notify();
        return { success: true, message: `Applied ${this.appliedCoupon.label}!` };
      }
      return { success: false, message: 'Invalid discount coupon code.' };
    },

    removeCoupon() {
      this.appliedCoupon = null;
      this.notify();
    },

    // Calculations
    getCartTotals() {
      const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      let discount = 0;
      let shipping = subtotal > 150 ? 0 : (subtotal > 0 ? 15.00 : 0);

      if (this.appliedCoupon) {
        if (this.appliedCoupon.discount) {
          discount = subtotal * this.appliedCoupon.discount;
        }
        if (this.appliedCoupon.freeShipping) {
          shipping = 0;
        }
      }

      const taxableAmount = Math.max(0, subtotal - discount);
      const tax = taxableAmount * 0.08; // 8% estimated sales tax
      const total = taxableAmount + shipping + tax;
      const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);

      return {
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        itemCount: count,
        freeShippingThreshold: 150,
        amountToFreeShipping: Math.max(0, 150 - subtotal).toFixed(2)
      };
    },

    // Place Order
    createOrder(orderDetails) {
      const totals = this.getCartTotals();
      const newOrder = {
        orderId: 'AUR-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        items: [...this.cart],
        totals: totals,
        shippingInfo: orderDetails.shipping,
        paymentMethod: orderDetails.paymentMethod
      };

      this.orders.unshift(newOrder);
      this.clearCart();
      return newOrder;
    }
  };

  State.init();
  window.AuraState = State;
})();

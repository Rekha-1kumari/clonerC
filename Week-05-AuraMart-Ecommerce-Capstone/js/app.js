/* ==========================================================================
   AuraMart E-Commerce: Core Application Controller & Hash Router
   ========================================================================== */

(function() {
  'use strict';

  const appRoot = document.getElementById('app-root');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartBadge = document.getElementById('cart-badge');
  const wishlistBadge = document.getElementById('wishlist-badge');
  const themeToggle = document.getElementById('theme-toggle-btn');
  const toastEl = document.getElementById('toast-msg');

  // Client-Side Hash Router
  function router() {
    const hash = window.location.hash || '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (hash === '#/' || hash === '#/home') {
      appRoot.innerHTML = window.AppViews.renderHome();
    } else if (hash.startsWith('#/products')) {
      appRoot.innerHTML = window.AppViews.renderCatalog();
      attachCatalogListeners();
    } else if (hash.startsWith('#/product/')) {
      const id = hash.replace('#/product/', '');
      appRoot.innerHTML = window.AppViews.renderProductDetail(id);
    } else if (hash === '#/cart') {
      appRoot.innerHTML = window.AppViews.renderCart();
    } else if (hash === '#/checkout') {
      appRoot.innerHTML = window.AppViews.renderCheckout();
      attachCheckoutListeners();
    } else if (hash === '#/order-success') {
      appRoot.innerHTML = window.AppViews.renderOrderSuccess();
    } else if (hash === '#/wishlist') {
      appRoot.innerHTML = window.AppViews.renderWishlist();
    } else {
      appRoot.innerHTML = window.AppViews.renderHome();
    }

    updateHeaderBadges();
  }

  function updateHeaderBadges() {
    const totals = window.AuraState.getCartTotals();
    cartBadge.textContent = totals.itemCount;
    wishlistBadge.textContent = window.AuraState.wishlist.length;
    renderCartDrawerContent();
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.style.display = 'block';
    setTimeout(() => {
      toastEl.style.display = 'none';
    }, 2800);
  }

  // Slide-out cart drawer render
  function renderCartDrawerContent() {
    const drawerItems = document.getElementById('drawer-items');
    const drawerSubtotal = document.getElementById('drawer-subtotal');
    if (!drawerItems || !drawerSubtotal) return;

    const items = window.AuraState.cart;
    const totals = window.AuraState.getCartTotals();

    drawerSubtotal.textContent = `$${totals.total}`;

    if (items.length === 0) {
      drawerItems.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          Your cart is currently empty.
        </div>
      `;
      return;
    }

    drawerItems.innerHTML = items.map(item => `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div style="flex: 1;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem;">${item.name}</h4>
          <span style="color: var(--text-muted); font-size: 0.8rem;">$${item.price.toFixed(2)}</span>
        </div>
        <div class="qty-counter">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
      </div>
    `).join('');
  }

  function openDrawer() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('active');
  }

  function closeDrawer() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('active');
  }

  // Delegated App Events
  function attachGlobalListeners() {
    window.addEventListener('hashchange', router);

    openCartBtn.addEventListener('click', openDrawer);
    closeCartBtn.addEventListener('click', closeDrawer);
    cartOverlay.addEventListener('click', closeDrawer);
    themeToggle.addEventListener('click', () => window.AuraState.toggleTheme());

    // Delegated click handling across the SPA
    document.addEventListener('click', function(e) {
      // Add to cart button
      const addBtn = e.target.closest('[data-action="add-cart"]');
      if (addBtn) {
        const id = addBtn.getAttribute('data-id');
        window.AuraState.addToCart(id, 1);
        showToast('✓ Added item to cart!');
        openDrawer();
        return;
      }

      // Add to cart from detail page
      if (e.target.id === 'detail-add-cart') {
        const id = e.target.getAttribute('data-id');
        window.AuraState.addToCart(id, 1);
        showToast('✓ Added item to cart!');
        openDrawer();
        return;
      }

      // Wishlist toggle
      const wishBtn = e.target.closest('[data-action="toggle-wish"]') || e.target.closest('#detail-toggle-wish');
      if (wishBtn) {
        const id = wishBtn.getAttribute('data-id');
        window.AuraState.toggleWishlist(id);
        wishBtn.classList.toggle('active');
        showToast(window.AuraState.isInWishlist(id) ? '♥ Saved to wishlist!' : 'Removed from wishlist.');
        updateHeaderBadges();
        return;
      }

      // Qty decrement
      const decBtn = e.target.closest('[data-action="dec"]');
      if (decBtn) {
        const id = decBtn.getAttribute('data-id');
        const item = window.AuraState.cart.find(i => i.id === id);
        if (item) {
          window.AuraState.updateQuantity(id, item.quantity - 1);
        }
        return;
      }

      // Qty increment
      const incBtn = e.target.closest('[data-action="inc"]');
      if (incBtn) {
        const id = incBtn.getAttribute('data-id');
        const item = window.AuraState.cart.find(i => i.id === id);
        if (item) {
          window.AuraState.updateQuantity(id, item.quantity + 1);
        }
        return;
      }

      // Cart delete item
      const delBtn = e.target.closest('[data-action="del"]');
      if (delBtn) {
        const id = delBtn.getAttribute('data-id');
        window.AuraState.removeFromCart(id);
        showToast('Removed from cart.');
        return;
      }

      // Apply coupon
      if (e.target.id === 'apply-coupon-btn') {
        const input = document.getElementById('coupon-input');
        if (input && input.value) {
          const res = window.AuraState.applyCoupon(input.value);
          showToast(res.message);
        }
      }
    });

    // Subscribe store changes
    window.AuraState.subscribe(() => {
      updateHeaderBadges();
      const hash = window.location.hash || '#/';
      if (hash === '#/cart') {
        appRoot.innerHTML = window.AppViews.renderCart();
      }
    });
  }

  // Catalog specific interactive filters
  function attachCatalogListeners() {
    const searchInput = document.getElementById('catalog-search');
    const priceSlider = document.getElementById('price-slider');
    const sortSelect = document.getElementById('sort-select');
    const categories = document.querySelectorAll('.category-item');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        window.AuraState.searchQuery = e.target.value.trim();
        appRoot.innerHTML = window.AppViews.renderCatalog();
        attachCatalogListeners();
      });
    }

    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        window.AuraState.priceMax = parseInt(e.target.value);
        appRoot.innerHTML = window.AppViews.renderCatalog();
        attachCatalogListeners();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        window.AuraState.sortBy = e.target.value;
        appRoot.innerHTML = window.AppViews.renderCatalog();
        attachCatalogListeners();
      });
    }

    categories.forEach(item => {
      item.addEventListener('click', function() {
        window.AuraState.selectedCategory = this.getAttribute('data-cat');
        appRoot.innerHTML = window.AppViews.renderCatalog();
        attachCatalogListeners();
      });
    });
  }

  // Checkout form submit
  function attachCheckoutListeners() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const first = document.getElementById('ship-first').value;
      const last = document.getElementById('ship-last').value;
      const street = document.getElementById('ship-street').value;
      const city = document.getElementById('ship-city').value;
      const zip = document.getElementById('ship-zip').value;
      const method = document.querySelector('input[name="pay-method"]:checked').value;

      window.AuraState.createOrder({
        shipping: { name: `${first} ${last}`, street, city, zip },
        paymentMethod: method
      });

      window.location.hash = '#/order-success';
    });
  }

  // Boot Application
  function init() {
    attachGlobalListeners();
    router();
  }

  init();
})();

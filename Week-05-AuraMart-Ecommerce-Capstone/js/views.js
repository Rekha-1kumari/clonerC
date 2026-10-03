/* ==========================================================================
   AuraMart E-Commerce: Client-Side Hash Router & View Renderers
   ========================================================================== */

(function() {
  'use strict';

  const AppViews = {
    // 1. Home View
    renderHome() {
      const featured = window.PRODUCTS_DATA.slice(0, 3);
      return `
        <!-- Hero Section -->
        <section class="hero-banner">
          <div>
            <div class="hero-pill">
              <span>&#9889;</span> Season Finale 2026 Collection
            </div>
            <h1 class="hero-title">Elevate Your Everyday Digital Lifestyle</h1>
            <p class="hero-sub">
              Engineered audio, mechanical peripherals, and ergonomic studio essentials crafted for performance and aesthetics.
            </p>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <a href="#/products" class="btn btn-primary">Browse All Products &rarr;</a>
              <a href="#/cart" class="btn btn-secondary">Review Cart</a>
            </div>
          </div>
          <div style="text-align: center;">
            <img src="${featured[0].image}" alt="Featured Headset" style="max-width: 100%; border-radius: 16px; box-shadow: var(--shadow-lg);">
          </div>
        </section>

        <!-- Featured Products Row -->
        <section>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem; flex-wrap: wrap;">
            <div>
              <h2 style="font-family: var(--font-heading); font-size: 2rem;">Featured Highlights</h2>
              <p style="color: var(--text-muted);">Top reviewed engineering peripherals</p>
            </div>
            <a href="#/products" style="color: var(--primary); font-weight: 600;">View Entire Catalog &rarr;</a>
          </div>

          <div class="products-grid">
            ${featured.map(prod => AppViews.renderProductCard(prod)).join('')}
          </div>
        </section>
      `;
    },

    // 2. Products Catalog View
    renderCatalog() {
      const state = window.AuraState;
      let list = [...window.PRODUCTS_DATA];

      // Filter by category
      if (state.selectedCategory !== 'all') {
        list = list.filter(p => p.category.toLowerCase() === state.selectedCategory.toLowerCase());
      }

      // Filter by search
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }

      // Filter by price
      list = list.filter(p => p.price <= state.priceMax);

      // Sort
      if (state.sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
      if (state.sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
      if (state.sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);

      const categories = ['all', 'Audio', 'Electronics', 'Wearables', 'Home & Living', 'Accessories'];

      return `
        <div style="margin-bottom: 2rem;">
          <h1 style="font-family: var(--font-heading); font-size: 2.2rem; margin-bottom: 0.5rem;">Explore Catalog</h1>
          <p style="color: var(--text-muted);">Showing ${list.length} premium digital hardware products</p>
        </div>

        <div class="catalog-layout">
          <!-- Sidebar Filters -->
          <aside class="filter-sidebar">
            <div class="filter-section">
              <h3 class="filter-title">Search Catalog</h3>
              <input type="text" id="catalog-search" value="${state.searchQuery}" placeholder="Filter by keyword..." style="width: 100%; padding: 0.7rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-main);">
            </div>

            <div class="filter-section">
              <h3 class="filter-title">Categories</h3>
              <ul class="category-list">
                ${categories.map(cat => `
                  <li class="category-item ${state.selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}" data-cat="${cat}">
                    <span>${cat === 'all' ? 'All Products' : cat}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="filter-section">
              <h3 class="filter-title">Max Price: $${state.priceMax}</h3>
              <input type="range" id="price-slider" min="50" max="350" step="10" value="${state.priceMax}" style="width: 100%; accent-color: var(--primary);">
            </div>

            <div class="filter-section" style="border-bottom: none; margin-bottom: 0;">
              <h3 class="filter-title">Sort By</h3>
              <select id="sort-select" style="width: 100%; padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-main);">
                <option value="featured" ${state.sortBy === 'featured' ? 'selected' : ''}>Featured Selection</option>
                <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                <option value="rating" ${state.sortBy === 'rating' ? 'selected' : ''}>Highest Customer Rating</option>
              </select>
            </div>
          </aside>

          <!-- Products Grid -->
          <main>
            ${list.length === 0 ? `
              <div style="text-align: center; padding: 4rem 2rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">&#128269;</div>
                <h3>No matching products found</h3>
                <p style="color: var(--text-muted); margin-top: 0.5rem;">Try relaxing your search query or price ceiling.</p>
              </div>
            ` : `
              <div class="products-grid">
                ${list.map(prod => AppViews.renderProductCard(prod)).join('')}
              </div>
            `}
          </main>
        </div>
      `;
    },

    // 3. Product Details View
    renderProductDetail(productId) {
      const prod = window.PRODUCTS_DATA.find(p => p.id === productId);
      if (!prod) {
        return `
          <div style="text-align: center; padding: 4rem;">
            <h2>Product Not Found</h2>
            <a href="#/products" class="btn btn-primary" style="margin-top: 1rem;">Back to Catalog</a>
          </div>
        `;
      }

      const inWishlist = window.AuraState.isInWishlist(prod.id);

      return `
        <div style="margin-bottom: 1.5rem;">
          <a href="#/products" style="color: var(--primary); font-weight: 600;">&larr; Back to Catalog</a>
        </div>

        <div class="detail-layout">
          <div class="detail-img-wrap">
            <img src="${prod.image}" alt="${prod.name}">
          </div>

          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
              <span class="card-badge" style="position: static;">${prod.badge}</span>
              <span style="color: var(--text-dim); font-size: 0.85rem; text-transform: uppercase; font-weight: 600;">${prod.category}</span>
            </div>

            <h1 style="font-family: var(--font-heading); font-size: 2.2rem; margin-bottom: 0.75rem;">${prod.name}</h1>
            
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <span style="color: var(--accent-gold); font-size: 1.1rem;">&#9733; ${prod.rating}</span>
              <span style="color: var(--text-muted); font-size: 0.9rem;">(${prod.reviewCount} verified reviews)</span>
              <span style="color: var(--accent-emerald); font-weight: 600; font-size: 0.9rem; margin-left: 1rem;">${prod.stock} In Stock</span>
            </div>

            <div style="font-size: 2rem; font-weight: 800; font-family: var(--font-heading); margin-bottom: 1.5rem;">
              $${prod.price.toFixed(2)}
              <span style="font-size: 1.1rem; color: var(--text-dim); text-decoration: line-through; margin-left: 0.5rem;">$${prod.originalPrice.toFixed(2)}</span>
            </div>

            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; margin-bottom: 2rem;">
              ${prod.description}
            </p>

            <table class="specs-table">
              <tbody>
                ${Object.entries(prod.specs).map(([k, v]) => `
                  <tr>
                    <th>${k}</th>
                    <td>${v}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="display: flex; gap: 1rem; align-items: center; margin-top: 2rem;">
              <button class="btn btn-primary" id="detail-add-cart" data-id="${prod.id}" style="flex: 1; padding: 1rem;">
                &#128722; Add to Shopping Cart
              </button>
              <button class="btn-circle wishlist-btn ${inWishlist ? 'active' : ''}" id="detail-toggle-wish" data-id="${prod.id}" style="width: 52px; height: 52px; font-size: 1.4rem;">
                &#9829;
              </button>
            </div>
          </div>
        </div>
      `;
    },

    // 4. Cart View
    renderCart() {
      const totals = window.AuraState.getCartTotals();
      const items = window.AuraState.cart;

      if (items.length === 0) {
        return `
          <div style="text-align: center; padding: 5rem 2rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
            <div style="font-size: 4rem; margin-bottom: 1rem;">&#128722;</div>
            <h2>Your Shopping Cart is Empty</h2>
            <p style="color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 2rem;">Explore our curated selection and find gear for your workspace.</p>
            <a href="#/products" class="btn btn-primary">Browse Catalog</a>
          </div>
        `;
      }

      return `
        <h1 style="font-family: var(--font-heading); font-size: 2.2rem; margin-bottom: 1.5rem;">Shopping Cart (${totals.itemCount} items)</h1>

        <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;" class="catalog-layout">
          <div>
            ${items.map(item => `
              <div class="cart-item-row" style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div style="flex: 1;">
                  <h3 style="font-size: 1.05rem; margin-bottom: 0.35rem;">${item.name}</h3>
                  <div style="color: var(--text-muted); font-size: 0.85rem;">$${item.price.toFixed(2)} each</div>
                </div>
                <div class="qty-counter">
                  <button class="qty-btn" data-action="dec" data-id="${item.id}">-</button>
                  <span class="qty-val">${item.quantity}</span>
                  <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
                </div>
                <div style="font-weight: 700; width: 80px; text-align: right;">
                  $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="btn-circle" style="width: 32px; height: 32px; font-size: 0.9rem;" data-action="del" data-id="${item.id}">
                  &times;
                </button>
              </div>
            `).join('')}
          </div>

          <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 2rem; height: fit-content;">
            <h3 style="font-family: var(--font-heading); margin-bottom: 1.25rem;">Order Summary</h3>
            
            <div class="shipping-bar-wrap">
              <div style="display: flex; justify-content: space-between;">
                <span>Free Express Shipping</span>
                <span>${totals.amountToFreeShipping > 0 ? `Add $${totals.amountToFreeShipping} more` : 'Unlocked!'}</span>
              </div>
              <div class="shipping-track">
                <div class="shipping-fill" style="width: ${Math.min(100, (parseFloat(totals.subtotal) / 150) * 100)}%;"></div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; color: var(--text-muted);">
              <span>Subtotal</span>
              <span>$${totals.subtotal}</span>
            </div>

            ${parseFloat(totals.discount) > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; color: var(--accent-emerald);">
                <span>Discount (${window.AuraState.appliedCoupon.code})</span>
                <span>-$${totals.discount}</span>
              </div>
            ` : ''}

            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; color: var(--text-muted);">
              <span>Estimated Shipping</span>
              <span>${parseFloat(totals.shipping) === 0 ? 'FREE' : '$' + totals.shipping}</span>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 1.25rem; color: var(--text-muted);">
              <span>Estimated Tax (8%)</span>
              <span>$${totals.tax}</span>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; font-size: 1.3rem; font-weight: 800; border-top: 1px solid var(--border-glass); padding-top: 1rem;">
              <span>Total</span>
              <span style="color: var(--primary);">$${totals.total}</span>
            </div>

            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
              <input type="text" id="coupon-input" placeholder="Promo code (SAVE20)" style="flex: 1; padding: 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-main);">
              <button class="btn btn-secondary" id="apply-coupon-btn" style="padding: 0.65rem 1rem;">Apply</button>
            </div>

            <a href="#/checkout" class="btn btn-primary" style="width: 100%; padding: 0.9rem;">
              Proceed to Checkout &rarr;
            </a>
          </div>
        </div>
      `;
    },

    // 5. Multi-Step Checkout View
    renderCheckout() {
      const totals = window.AuraState.getCartTotals();
      if (window.AuraState.cart.length === 0) {
        return `<div style="text-align: center; padding: 4rem;"><h2>No items in cart</h2><a href="#/products" class="btn btn-primary" style="margin-top: 1rem;">Catalog</a></div>`;
      }

      return `
        <div class="checkout-steps-bar" style="max-width: 600px; margin: 0 auto 2.5rem;">
          <div class="step-node active">
            <div class="step-circle">1</div>
            <span>Shipping</span>
          </div>
          <div class="step-node active">
            <div class="step-circle">2</div>
            <span>Payment</span>
          </div>
          <div class="step-node active">
            <div class="step-circle">3</div>
            <span>Confirmation</span>
          </div>
        </div>

        <div style="max-width: 680px; margin: 0 auto; background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-lg);">
          <h2 style="font-family: var(--font-heading); margin-bottom: 1.5rem;">Shipping & Payment Checkout</h2>

          <form id="checkout-form">
            <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--primary);">1. Delivery Address</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem;">First Name *</label>
                <input type="text" id="ship-first" required value="Rekha" style="width: 100%; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-main);">
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem;">Last Name *</label>
                <input type="text" id="ship-last" required value="Kumari" style="width: 100%; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-main);">
              </div>
            </div>

            <div style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem;">Street Address *</label>
              <input type="text" id="ship-street" required value="101 Innovation Boulevard, Tech Park" style="width: 100%; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-main);">
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; margin-bottom: 2rem;">
              <div>
                <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem;">City *</label>
                <input type="text" id="ship-city" required value="New Delhi" style="width: 100%; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-main);">
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem;">Postal Code *</label>
                <input type="text" id="ship-zip" required value="110001" style="width: 100%; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: var(--bg-surface); color: var(--text-main);">
              </div>
            </div>

            <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--primary);">2. Payment Method Simulation</h3>
            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
              <label style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-surface); padding: 0.75rem 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); cursor: pointer;">
                <input type="radio" name="pay-method" value="Credit Card" checked> Credit / Debit Card
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-surface); padding: 0.75rem 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); cursor: pointer;">
                <input type="radio" name="pay-method" value="UPI / Instant"> UPI / Digital Wallet
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-surface); padding: 0.75rem 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); cursor: pointer;">
                <input type="radio" name="pay-method" value="Cash On Delivery"> Cash on Delivery
              </label>
            </div>

            <div style="background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.2rem;">
                <span>Total Due</span>
                <span style="color: var(--primary);">$${totals.total}</span>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.05rem;">
              Complete Order & Generate Invoice ($${totals.total})
            </button>
          </form>
        </div>
      `;
    },

    // 6. Order Success / Invoice View
    renderOrderSuccess() {
      const orders = window.AuraState.orders;
      if (orders.length === 0) {
        return `<div style="text-align: center; padding: 4rem;"><h2>No recent orders found</h2><a href="#/products" class="btn btn-primary" style="margin-top: 1rem;">Shop Now</a></div>`;
      }

      const order = orders[0];

      return `
        <div class="invoice-card">
          <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 3.5rem; color: var(--accent-emerald);">&#10004;</div>
            <h1 style="font-family: var(--font-heading); font-size: 2rem;">Order Confirmed!</h1>
            <p style="color: var(--text-muted);">Thank you for shopping with AuraMart. Your official invoice is generated below.</p>
          </div>

          <div style="background: var(--bg-surface); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 2rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="color: var(--text-muted);">Invoice Number:</span>
              <strong>${order.orderId}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="color: var(--text-muted);">Date:</span>
              <span>${order.date}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="color: var(--text-muted);">Payment Method:</span>
              <span>${order.paymentMethod}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Delivery Address:</span>
              <span style="text-align: right;">${order.shippingInfo.street}, ${order.shippingInfo.city}</span>
            </div>
          </div>

          <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">Items Purchased</h3>
          <div style="margin-bottom: 2rem;">
            ${order.items.map(it => `
              <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-glass);">
                <span>${it.name} (x${it.quantity})</span>
                <strong>$${(it.price * it.quantity).toFixed(2)}</strong>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: 800; margin-bottom: 2rem;">
            <span>Grand Total</span>
            <span style="color: var(--primary);">$${order.totals.total}</span>
          </div>

          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button onclick="window.print()" class="btn btn-secondary" style="flex: 1;">
              &#128424; Print Official Receipt
            </button>
            <a href="#/products" class="btn btn-primary" style="flex: 1;">
              Continue Shopping
            </a>
          </div>
        </div>
      `;
    },

    // 7. Wishlist View
    renderWishlist() {
      const state = window.AuraState;
      const items = window.PRODUCTS_DATA.filter(p => state.isInWishlist(p.id));

      if (items.length === 0) {
        return `
          <div style="text-align: center; padding: 5rem 2rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
            <div style="font-size: 4rem; color: #ef4444; margin-bottom: 1rem;">&#9829;</div>
            <h2>Your Wishlist is Empty</h2>
            <p style="color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 2rem;">Tap the heart icon on any product card to save items for later.</p>
            <a href="#/products" class="btn btn-primary">Discover Products</a>
          </div>
        `;
      }

      return `
        <h1 style="font-family: var(--font-heading); font-size: 2.2rem; margin-bottom: 1.5rem;">Saved Wishlist (${items.length})</h1>
        <div class="products-grid">
          ${items.map(prod => AppViews.renderProductCard(prod)).join('')}
        </div>
      `;
    },

    // Reusable Product Card HTML
    renderProductCard(prod) {
      const inWishlist = window.AuraState.isInWishlist(prod.id);
      return `
        <article class="product-card" data-id="${prod.id}">
          <div class="product-media">
            <span class="card-badge">${prod.badge}</span>
            <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-action="toggle-wish" data-id="${prod.id}" title="Save to Wishlist">
              &#9829;
            </button>
            <a href="#/product/${prod.id}">
              <img src="${prod.image}" alt="${prod.name}" class="product-img" loading="lazy">
            </a>
          </div>

          <div class="product-body">
            <div class="product-category">${prod.category}</div>
            <h3 class="product-title">
              <a href="#/product/${prod.id}">${prod.name}</a>
            </h3>

            <div class="product-rating">
              <span>&#9733; ${prod.rating}</span>
              <span style="color: var(--text-dim); font-size: 0.8rem;">(${prod.reviewCount})</span>
            </div>

            <div class="product-price-row">
              <div>
                <span class="price-current">$${prod.price.toFixed(2)}</span>
                <span class="price-original">$${prod.originalPrice.toFixed(2)}</span>
              </div>
              <button class="btn btn-primary" data-action="add-cart" data-id="${prod.id}" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                + Add
              </button>
            </div>
          </div>
        </article>
      `;
    }
  };

  window.AppViews = AppViews;
})();

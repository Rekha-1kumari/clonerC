# Week 5: Full-Stack Deployment & Project Architecture (AuraMart Capstone)

**Student Developer:** Rekha Kumari  
**Repository:** [github.com/Rekha-1kumari/clonerC](https://github.com/Rekha-1kumari/clonerC)  
**Due Date:** 02 Nov 2026 (Completed)

---

## Project Overview
AuraMart is a modern, modular E-Commerce Single Page Application (SPA) combining all competencies acquired throughout the 5-week Web Development Internship:
- Strict semantic document structure & WCAG 2.1 compliance
- CSS Grid 2D layout systems and dynamic custom properties theming
- Client-side reactive state management and automatic local storage persistence
- Asynchronous API workflows and modular frontend architecture

### Key Features Implemented:
1. **Modular SPA Architecture & Client-Side Routing:**
   - Hash-based router (`#/home`, `#/products`, `#/product/:id`, `#/cart`, `#/checkout`, `#/order-success`, `#/wishlist`).
   - Decoupled modules: `productsData.js`, `state.js`, `views.js`, and `app.js`.
2. **Product Catalog & Dynamic Multi-Facet Filtering:**
   - Real-time search query matching product titles and descriptions.
   - Category filtering (Audio, Electronics, Wearables, Home & Living, Accessories).
   - Dynamic price slider and multi-criteria sorting (Price Low-to-High, High-to-Low, Customer Rating).
3. **Reactive Shopping Cart & Promotion Engine:**
   - Persistent slide-out cart drawer with quantity counters and item removal.
   - Free shipping progress bar (dynamic threshold calculator).
   - Promo discount engine (e.g. `SAVE20` for 20% off, `FREESHIP` for free shipping).
4. **Multi-Step Checkout & Invoice Receipt Generation:**
   - Simulated 3-step checkout with delivery address validation and payment method selection.
   - Automated invoice generation with printable receipt view and unique order tracking IDs.
5. **Production Deployment Ready:**
   - Includes `vercel.json` and `netlify.toml` for 1-click zero-config deployment to Vercel, Netlify, or GitHub Pages.

---

## Deployment Instructions:
### Deploying to Vercel:
```bash
npm install -g vercel
vercel
```
### Deploying to Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

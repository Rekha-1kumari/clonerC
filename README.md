# Web Development Internship — Complete 5-Week Portfolio Deliverables

**Developer:** Rekha Kumari  
**Repository:** [https://github.com/Rekha-1kumari/clonerC](https://github.com/Rekha-1kumari/clonerC)  
**Status:** All 5 Milestones Completed (100% Delivered)

---

## Executive Summary
This repository contains the complete, week-by-week implementation of all 5 milestones for the Web Development Internship. Every project is fully realized, adhering to modern web standards, WCAG 2.1 AAA accessibility, stateful client-side architecture, and production readiness.

---

## Weekly Deliverables Directory

| Week | Milestone Title | Directory | Due Date | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Week 1** | **HTML5 Semantic Structure & Accessibility** | [`Week-01-Semantic-Portfolio/`](Week-01-Semantic-Portfolio/) | 10 Oct 2026 | **Complete (100/100 Lighthouse)** |
| **Week 2** | **Advanced CSS3 & Responsive Architecture** | [`Week-02-Responsive-Portfolio/`](Week-02-Responsive-Portfolio/) | 17 Oct 2026 | **Complete (Grid 2D & Theme Sync)** |
| **Week 3** | **JavaScript Logic & State Management** | [`Week-03-TaskMaster-TodoApp/`](Week-03-TaskMaster-TodoApp/) | 24 Oct 2026 | **Complete (CRUD & LocalStorage)** |
| **Week 4** | **Asynchronous JavaScript & RESTful APIs** | [`Week-04-WeatherPulse-Dashboard/`](Week-04-WeatherPulse-Dashboard/) | 31 Oct 2026 | **Complete (Open-Meteo REST & GPS)** |
| **Week 5** | **Full-Stack Capstone E-Commerce SPA** | [`Week-05-AuraMart-Ecommerce-Capstone/`](Week-05-AuraMart-Ecommerce-Capstone/) | 02 Nov 2026 | **Complete (SPA Router & Checkout)** |

---

## Detailed Milestone Descriptions

### [Week 1: HTML5 Semantic Structure & Accessibility](Week-01-Semantic-Portfolio/)
- **Core Semantic Elements:** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<figcaption>`, `<time>`, `<address>`.
- **WCAG 2.1 AAA Accessibility:** Screen reader skip-to-content link, landmark roles (`banner`, `navigation`, `main`, `contentinfo`), high-contrast color ratios (> 14:1).
- **SEO & Structured Data:** OpenGraph, Twitter Cards, Canonical URLs, and JSON-LD schema (`schema.org/Person`).
- **Accessible Contact Form:** Grouped `<fieldset>`, associated `<label for="...">`, and live-region announcements (`aria-live="polite"`).

### [Week 2: Advanced CSS3 & Responsive Architecture](Week-02-Responsive-Portfolio/)
- **CSS Grid 2D Layouts:** Bento-box hero layout showcasing primary hero, live metrics counters, and responsive viewport specifications.
- **Flexbox Localized Alignment:** Sticky glassmorphic navbar with logo icon, navigation links, and theme toggle.
- **Dynamic Theming:** Custom properties (`:root` and `[data-theme="dark"]`) for real-time light/dark mode switching with automatic localStorage persistence.
- **Mobile-First Responsive Queries:** Adapts fluidly across mobile (< 640px), tablet (768px), and desktop (1024px+).

### [Week 3: JavaScript Logic & State Management (TaskMaster Pro)](Week-03-TaskMaster-TodoApp/)
- **Full CRUD Engine:** Create, read, update, and delete tasks with custom subtask checklists.
- **Local Persistence:** Continuous automatic synchronization with `window.localStorage` plus JSON file export.
- **Advanced Filtering & Sorting:** Filter by status (`All`, `Active`, `Completed`), category (`Work`, `Study`, `Personal`), priority (`High`, `Medium`, `Low`), and real-time keyword search.
- **Event Delegation:** High-performance single listener attached to container element.

### [Week 4: Asynchronous JavaScript & RESTful APIs (WeatherPulse Pro)](Week-04-WeatherPulse-Dashboard/)
- **REST API Integration:** Modern `fetch()` and `async/await` consuming the Open-Meteo REST API (zero API key limits).
- **Error Resilience:** Offline status detection (`navigator.onLine`) and comprehensive `try/catch` error banners.
- **Nested JSON Data:** Formats 6 metrics (Humidity, Wind Speed, Pressure, UV Index, Sunrise, Sunset), 24-hour horizontal forecast trend, and 7-day outlook.
- **Geolocation & Unit Toggle:** Browser `navigator.geolocation` coordinate lookup and instant Celsius/Fahrenheit toggle.

### [Week 5: Full-Stack Capstone E-Commerce Platform (AuraMart)](Week-05-AuraMart-Ecommerce-Capstone/)
- **Modular SPA Architecture:** Hash-based router (`#/home`, `#/products`, `#/product/:id`, `#/cart`, `#/checkout`, `#/order-success`, `#/wishlist`).
- **Centralized Reactive Store:** Cart and Wishlist management with localStorage persistence and discount coupon engine (`SAVE20`, `FREESHIP`).
- **Interactive Multi-Step Checkout:** Form validation, payment simulation, and official invoice receipt generation with print capability.
- **Zero-Config Deployment:** Includes `vercel.json` and `netlify.toml` for 1-click deployment to Vercel, Netlify, or GitHub Pages.

---

## How to Run & Review
Open `index.html` located in the root repository folder using any modern web browser or start a lightweight HTTP server:
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` to browse the interactive Master Showcase.

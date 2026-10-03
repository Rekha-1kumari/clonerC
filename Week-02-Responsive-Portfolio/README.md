# Week 2: Advanced CSS3 & Responsive Architecture

**Student Developer:** Rekha Kumari  
**Repository:** [github.com/Rekha-1kumari/clonerC](https://github.com/Rekha-1kumari/clonerC)  
**Due Date:** 17 Oct 2026 (Completed)

---

## Project Overview
This project transforms the semantic portfolio into a visually stunning, fully responsive design using advanced CSS3 properties and modern layout architectures.

### Key Features Implemented:
1. **CSS Grid 2D Layouts:**
   - Bento-box hero layout showcasing primary hero, live metrics counters, and responsive viewport specifications.
   - Dynamic auto-fit project showcase grid (`grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`).
2. **Flexbox Localized Alignment:**
   - Sticky navbar with brand badge, navigation links, and theme toggle.
   - Social links, card badges, and action button groups.
3. **Dynamic Custom Properties (Light/Dark Mode):**
   - Seamless `:root` and `[data-theme="dark"]` CSS variables for background, text, borders, glassmorphic filters, and gradient glows.
   - Theme toggle button with automatic local storage persistence and system preference fallback.
4. **Mobile-First Responsive Queries:**
   - Designed for Mobile (< 640px), Tablet (768px - 1024px), and Desktop (> 1024px).
   - Mobile slide-out drawer menu with animated hamburger icon.
5. **Modern Visual Aesthetics:**
   - Glassmorphism (`backdrop-filter: blur(16px)`).
   - Custom smooth animations (`@keyframes pulseDot`, 3D card tilt & hover effects).

---

## How to Test:
- Open `index.html` in your browser.
- Click the Moon/Sun toggle in the navbar to switch between Dark and Light mode.
- Resize the browser window to see the responsive layout adapt seamlessly.

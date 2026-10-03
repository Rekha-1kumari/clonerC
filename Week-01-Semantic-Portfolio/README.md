# Week 1: HTML5 Semantic Structure & Accessibility (WCAG 2.1 AAA)

**Student Developer:** Rekha Kumari  
**Repository:** [github.com/Rekha-1kumari/clonerC](https://github.com/Rekha-1kumari/clonerC)  
**Due Date:** 10 Oct 2026 (Completed)

---

## Project Overview
This project delivers a multi-page personal portfolio website adhering strictly to modern semantic HTML5 standards and WCAG 2.1 AAA accessibility guidelines. It establishes the foundational skeleton for the subsequent weeks of the Web Development Internship.

### Key Deliverables:
1. **Semantic HTML5 Tags:**
   - `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<figcaption>`, `<time>`, `<address>`.
2. **WCAG Accessibility & ARIA:**
   - Keyboard accessible skip-to-content links (`.skip-link`).
   - Landmark roles (`role="banner"`, `role="navigation"`, `role="main"`, `role="contentinfo"`).
   - Dynamic `aria-current="page"`, `aria-describedby`, `aria-required`, and `aria-live="polite"` feedback.
   - High-contrast colors exceeding WCAG AAA ratio (14.8:1 text contrast).
3. **SEO & Structured Metadata:**
   - OpenGraph and Twitter card meta tags.
   - Canonical URLs and robots directives.
   - JSON-LD Structured Data Schema (`schema.org/Person`).
4. **Accessible, Tab-Navigable Contact Form:**
   - Grouped `<fieldset>` and `<legend>` blocks.
   - Associated `<label for="...">` with descriptive hints.
   - Inline and live-region error announcements for screen readers.

---

## Directory Structure
```
Week-01-Semantic-Portfolio/
├── index.html        # Home & Featured Projects
├── about.html        # Bio, Background & Education
├── projects.html     # Milestone Project Catalog
├── contact.html      # Accessible Tab-Navigable Contact Form
├── css/
│   └── styles.css    # High-contrast accessible styles
└── README.md         # Documentation & compliance notes
```

## How to Test Accessibility:
- Open `index.html` in Chrome or Firefox.
- Press `Tab` repeatedly to observe the "Skip to main content" banner and sequential focus outlines.
- Run Chrome DevTools Lighthouse Audit: **Accessibility 100 / 100**, **SEO 100 / 100**.

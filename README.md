# EAX Global — eaxglobal.io

Corporate site for **EAX Global** — trust infrastructure for the digital economy. The detailed
Kweli product site lives separately at [kweli.solutions](https://kweli.solutions).

## Design

The homepage now leads with a specific issuer-to-recipient example and the company’s relationship to Kweli. The original horizon artwork remains as a restrained accent.

- Deep void, cool-white type, a single green accent used only as the *trust property*.
- **Restrained motion** — decorative artwork animates, while the hero message remains visible immediately.
- **Static-first:** the layout is complete and premium before any JavaScript runs, and fully
  degrades under `prefers-reduced-motion` and with JS disabled.

## Stack

Dependency-free static HTML/CSS/JS — no build step, no framework.

```
index / vision / products / company / insights / contact / 404 .html
assets/brand.css   design system
assets/brand.js    nav, hero ignite, scroll reveals, contact form
assets/logo.png · favicon.svg · apple-touch-icon.png · og-image.png
legacy-site/       the previous single-page site, preserved
```

## Preview locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy (Netlify)

Static, `publish = "."` (see `netlify.toml`). The contact form is the Netlify form **`eax-partner`** —
submissions appear under **Forms** in the dashboard.

## Facts used (nothing invented)

Domain eaxglobal.io · eaxexchange@gmail.com · @eaxglobal · Kweli: kweli.solutions /
info@kweli.solutions · Nairobi, Kenya. No customers, revenue, partnerships, funding or user numbers
are claimed; product maturity is stated honestly (only *Kweli Verify* is marked available now).

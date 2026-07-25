# EAX Global — eaxglobal.io

Corporate site for **EAX Global** — trust infrastructure for the digital economy. The detailed
Kweli product site lives separately at [kweli.solutions](https://kweli.solutions).

## Design

Built around one brand image — *the Museum*: six kinds of digital record (document, certificate,
contract, AI output, financial record, shipment) resting on one horizon of light, each made
trustworthy by the same layer. **One infrastructure, infinite trusted applications.**

- Deep void, cool-white type, a single green accent used only as the *trust property*.
- **One restrained motion per page** — the records igniting across the layer, once.
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

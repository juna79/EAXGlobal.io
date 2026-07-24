# EAX Global — eaxglobal.io

Corporate website for EAX Global, a technology company building **trust infrastructure for the
digital economy**. This is the company site; the detailed Kweli product site lives separately at
[kweli.solutions](https://kweli.solutions).

## Stack

Plain, dependency-free static HTML/CSS/JS. No build step, no framework, no npm install. This keeps
the site fast, easy to edit, and trivial to host anywhere.

```
EAXGLOBAL.io/
├── index.html          Homepage (vision → problem → trust layer → products → roadmap)
├── vision.html         The thesis and the documents→markets arc
├── products.html       Product ecosystem (Verify / Claims / Supply / Credentials / Marketplace)
├── company.html        Mission, origin, principles, leadership, contact
├── insights.html       Articles / updates (easy to add entries by hand)
├── contact.html        Partner & pilot enquiry form
├── 404.html            Custom not-found page
├── robots.txt, sitemap.xml
├── netlify.toml        Hosting config + security headers
└── assets/
    ├── styles.css          The whole design system (tokens, components, responsive)
    ├── main.js             Nav toggle, scroll reveal, form handling, footer year
    ├── logo.png            Official EAX Global logo (transparent background) — nav + footer
    ├── favicon.svg         Brand-green check device on near-black
    ├── apple-touch-icon.png  180×180 home-screen icon
    └── og-image.png        1200×630 social-share preview (logo on near-black)
```

### Logo & brand assets

The official logo (`assets/logo.png`) is the supplied artwork, unaltered — I only knocked out the
solid black canvas to make the background transparent and trimmed the surrounding empty margin, so
it sits cleanly on any dark surface. **The colours, proportions, typography and the full
"EAX GLOBAL / VERIFIED IMPACT. REAL VALUE." lockup are untouched, never recoloured, stretched or
cropped.** It is sized via CSS (`.brand__mark`, 38px in the nav, 50px in the footer). The source
file is `../EAX X PICS/EAX LOGO.png`; re-run the generation if you ever get a higher-res original.

- **Favicon** and **apple-touch-icon** use the logo's signature green check device (a "brand
  moment"), not a recoloured or cropped wordmark.
- **Social preview** (`og-image.png`) places the full logo on the near-black brand background.

The old single-file site (`eax_global_with_kweli_FIXED.html`) is kept for reference only and is not
part of the live site.

## Preview locally

No tooling required — just serve the folder:

```bash
cd EAXGLOBAL.io
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly also works, but a local server is closer to production and lets
relative links behave correctly.)

## Deploy (Netlify)

The site is configured for Netlify (`netlify.toml`, `publish = "."`).

- **Drag-and-drop:** drop the `EAXGLOBAL.io` folder into the Netlify dashboard.
- **Git:** connect the repo; no build command, publish directory `.`.
- Point the `eaxglobal.io` domain at the Netlify site in **Domain settings**.

### Contact form

`contact.html` uses a Netlify form named `eax-partner`. Netlify detects it from the hidden form in
the page markup and captures submissions automatically — no backend needed. View submissions under
**Forms** in the Netlify dashboard, and add a notification email there if you want alerts. The form
also works with progressive enhancement (`assets/main.js`) so users see an inline success state.

## Design system (quick reference)

- **Base:** deep charcoal `#0a0c0f`; warm-white text `#ece9e3`.
- **Accent:** the official EAX brand green `#5db665` (sampled from the logo) — used *sparingly* as a
  subtle accent: eyebrow ticks, links, the "live" stage signal, the trust-layer check, focus rings
  and hover states. It is deliberately **not** the identity. The primary CTA is warm-white and the
  pilot / in-development / future stages are neutral grey, so green appears only on genuine brand and
  "live" moments. Change `--accent` in `assets/styles.css` to retune it.
- **Type:** system font stack (fast, no dependency). Swap in a licensed typeface later by changing
  `--sans` in `assets/styles.css` — nothing else needs to change.
- **Stages:** `.stage--live` / `--pilot` / `--dev` / `--future` communicate product maturity
  honestly. Only *Available now* items are in production; the rest are labelled accordingly.
- **Motion:** restrained scroll-reveal only, and fully disabled under `prefers-reduced-motion`.

## Content to add over time

The site is production-ready with no visible placeholders. These sections are intentionally
neutral and can be enriched when the facts are public and confirmed:

1. **Homepage → "Built today":** real pilot organisations / sectors / verification counts, once they
   can be shared. (`index.html`)
2. **Products → Kweli Claims:** named insurance pilots or partners, only when public. (`products.html`)
3. **Company → Leadership:** currently shows the founder (Arjun Vidyarthi, Founder & CEO); add more
   team members as they join. (`company.html`)
4. **Insights:** currently a "check back soon" state. Add real posts by replacing the empty state in
   `insights.html` with article cards (the `.insight-card` component in `styles.css` is ready to use).
5. **Open Graph image:** `assets/og-image.png` (1200×630, logo on near-black) is generated and wired
   up. Replace it if you want a more designed share card.

## Verified facts used (nothing invented)

- Domain: eaxglobal.io · Corporate email: eaxexchange@gmail.com · X: @eaxglobal
- Kweli product site: kweli.solutions · Kweli enquiries: info@kweli.solutions
- Based in Nairobi, Kenya.

No customers, revenue, partnerships, funding, user numbers or testimonials are claimed anywhere.

## Recommended next improvements

- Add a real `og-image.png` and per-page OG images.
- Add individual insight article pages (or wire the Insights list to a lightweight CMS / Markdown).
- Add JSON-LD `Organization` structured data once legal name and logo URL are final.
- Consider self-hosting a licensed display typeface for a stronger brand signature.
- Add a cookie/privacy page and link it in the footer if analytics are introduced.

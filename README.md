# Hydrochill website

Static website (HTML, CSS, JavaScript). No build step, no framework, no server code.
Open `index.html` in a browser to preview, or upload the folder contents to any web host.

## Folder structure

```
index.html          The whole site (single page, sections: home, about, technology,
                    products, applications, why choose us, gallery, contact)
404.html            "Page not found" page
favicon.svg         Browser tab icon
robots.txt          Search engine rules (points to the sitemap)
sitemap.xml         Sitemap
_headers            Netlify only: security and caching headers (see "Hosting")
css/styles.css      All styles and the design system (colour and type tokens at the top)
js/init.js          One-line script that marks the page as JavaScript-enabled
js/main.js          Menu, scroll effects, gallery lightbox, inquiry form
image/              Photos (WebP + JPG versions), social share image, original files
```

The original photo `image/IMG-20251211-WA0057.jpg` and the original favicon
(`image/favicon-original.png`) are kept untouched. All other images in `image/` are
resized or cropped copies made from that one photo.

## Hosting

**Netlify (current host, hydrochill.netlify.app):** drag the folder contents into the
Netlify deploy area, or push to the connected repository. `_headers` is applied automatically.

**Any other host (cPanel, shared hosting, etc.):** upload everything inside this folder to
the web root (`public_html`) so that `index.html` sits at the top level. Then:
- delete `_headers` (it only works on Netlify) and, if your host supports it, set
  equivalent headers yourself;
- change the domain in the places listed under "Configuration".

## Configuration

| What | Where |
|---|---|
| WhatsApp number | `923057943633` appears in `index.html` (every `wa.me` link) and `data-whatsapp` on the form |
| Phone and email | `index.html` (contact section, footer, structured data) |
| Production domain | `https://hydrochill.netlify.app/` appears in `index.html` (canonical, Open Graph, structured data), `sitemap.xml` and `robots.txt`. Replace it everywhere if you move to a custom domain. |
| Form service | `action` and `data-endpoint` on `<form id="inquiry-form">` in `index.html` (currently Formspree form `xrbnnppq`, taken from your original site) |
| Colours and fonts | CSS variables at the top of `css/styles.css` |

## Inquiry form: how it works

- **Send inquiry** posts to Formspree. The success message appears only when Formspree
  accepts the submission. If it fails, the visitor sees an error with WhatsApp and email
  alternatives. A hidden honeypot field blocks simple spam bots.
- **Send on WhatsApp** opens WhatsApp with the form details filled in. The page says clearly
  that the message is not sent until the visitor presses send in WhatsApp.
- Formspree must be set up for it to deliver: log in to formspree.io, confirm that form
  `xrbnnppq` exists, is verified, and sends to the inbox you want. Send one real test
  inquiry after upload. Free plans have a monthly submission limit.

## Adding or replacing photos

1. Save the photo at about 1200 px wide as both `.webp` and `.jpg` into `image/`.
2. Product cards: change the `<img>`/`<source>` file names inside each `product-card` in `index.html`.
3. Gallery: copy one `<figure class="gallery-item">` block, set `data-full`, `data-alt`,
   `data-caption` and the image paths. The lightbox picks up new items automatically.
4. Keep `width`, `height` and meaningful `alt` text on every image.

## Features implemented

- Sticky header, mobile menu, "Get a quote" button, WhatsApp button in the header
- Hero with headline, two calls to action and a WhatsApp link, using your real pad photo
- Highlights, About, Technology (how evaporative cooling works, with a diagram), Products with
  comparison table, Applications (six categories), Why choose Hydrochill, Gallery with lightbox,
  Contact with form, multi-column footer
- WhatsApp: floating button, header, hero, every product card (message names that product),
  contact section, footer, and the form
- Click-to-call, email link, map link
- Form validation with inline messages, honeypot, honest success/error handling
- Responsive from 320 px to 1920 px; no horizontal scrolling at any tested width
- Accessibility: skip link, keyboard-operable menu and lightbox, visible focus, labelled form
  fields, contrast of 4.5:1 or better on text colours, reduced-motion support
- SEO: title, description, canonical, Open Graph, local business and product-list structured
  data (no ratings or reviews), semantic headings, alt text, sitemap, robots.txt
- Performance: WebP with JPG fallback, responsive image sizes, lazy loading below the fold,
  inline SVG icons (no icon-font download), no JavaScript libraries, fonts loaded with `display=swap`

## Needs your confirmation or input before you rely on it

**Claims (please verify each)**
1. Efficiency figures (up to 75%, 80%, 85%) are kept as you provided them, shown as
   "Up to X%*" with a footnote that real results depend on conditions. Confirm they are
   measured or documented figures.
2. Kept from your original text, not independently supported: pads are "treated with
   anti-rot and anti-algae compounds", "quality control at each production stage", and
   "tailored sizes and specifications" (custom sizes). Confirm or remove.
3. Removed from the original because nothing supported them: "50% energy saving" and "85%
   cooling efficiency" as headline statistics, the "Best Seller / High Efficiency / Premium"
   badges, and the promise to reply "within 24 hours".

**Product data**
4. Product names and sizes look inconsistent: 50x90 and 60x90 Pro are both listed as
   2000 x 600 x 100 mm, while 70x90 Elite is 150 mm thick. Product specifications were not
   changed. Please confirm the 60x90 Pro thickness.

**Images**
5. You have one real photo, so: all three product cards use the same pad photo, and the
   gallery shows crops of it. Please send a photo per product, plus real photos of
   installations, greenhouses, poultry houses, factory/warehouse sites and your manufacturing
   floor. Applications currently use icons, not photographs, because no real application
   photos exist and none were invented.

**Business details**
6. Confirm the production domain (currently assumed to be hydrochill.netlify.app).
7. Structured data has street address and country only. Add city/region once confirmed.
8. No official logo was supplied. The header uses a text wordmark with a simple wave mark.
   Send your logo file if you have one.
9. Facebook, Instagram and LinkedIn links in the original were empty placeholders and were
   removed. Send the real URLs if you want them back.
10. Footer company name ("Hydrochill Cooling Pad Manufacturing Company") is carried over from
    the original.

## Not done, and why

- Separate product detail pages: the product information is four specifications per product,
  so one page with cards and a comparison table serves visitors better. This can be added later.
- Gallery categories: with a single source photo, category filters would be empty. Add them
  when more photos exist.
- Customer testimonials: none were provided, so none appear.
- JavaScript/CSS minification: files are readable and small (about 41 KB together). Most hosts
  compress them automatically.

## Testing performed

Browser tests ran on a local copy at 1920, 1440, 1024, 768, 480, 375 and 320 px (no horizontal
overflow, no broken images, no script errors); all in-page links; all six WhatsApp links
(message text decoded and checked); form validation, success, server-error, network-error and
honeypot paths (using a simulated form service); the gallery lightbox with keyboard; the mobile
menu; reduced-motion behaviour; and the Content Security Policy in `_headers`.

Not tested in the build environment: the live Formspree service, live Google Fonts (no internet
there), real phones, and a Lighthouse run. Please run PageSpeed Insights on the live URL and send
one real test inquiry after upload.

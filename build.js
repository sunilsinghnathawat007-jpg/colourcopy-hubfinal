#!/usr/bin/env node
/**
 * Generate per-path static HTML for SEO subpages.
 *
 * Reads index.html, then writes one <slug>/index.html per entry in PATH_META,
 * with title/description/canonical/og/twitter tags rewritten so each path is
 * served as a real, indexable HTML file (no JS title-swap, no edge function).
 *
 * Run: node build.js
 * Re-run whenever index.html changes.
 */

const fs = require('fs');
const path = require('path');

const SITE = 'https://www.onlinecolourprint.com';

const PATH_META = {
  'mbbs-book-printing': {
    title: 'MBBS Book Printing Online — Pan-India Delivery from ₹1/page | ColourCopy Hub',
    desc: 'Print full-colour MBBS books (Anatomy, Physiology, Biochemistry, Pathology, Pharmacology) online. Pan-India delivery from Pratap Nagar, Jaipur. WhatsApp to order.',
  },
  'neet-notes-printing': {
    title: 'NEET Notes & BDS Book Printing Online | Pan-India Delivery — ColourCopy Hub',
    desc: 'Photocopy and print NEET preparation books, BDS textbooks, AIIMS coaching material. Colour or B&W with pan-India delivery from Jaipur.',
  },
  'ca-cfa-notes-printing': {
    title: 'CA, CFA & CS Notes Printing Online — ColourCopy Hub',
    desc: 'Print CA Foundation/Inter/Final notes, CFA Level 1-3 study material, CS ICSI books and MBA case studies. Pan-India delivery from Pratap Nagar, Jaipur.',
  },
  'photocopy-online-jaipur': {
    title: 'Online Photocopy & Xerox Shop — Pratap Nagar Jaipur | ColourCopy Hub',
    desc: 'Choudhary Colour Xerox Point — online photocopy & colour print delivered. WhatsApp your PDF, we print and ship anywhere in India. Starting ₹0.5/side.',
  },
  'core-btr-3': {
    title: 'Core BTR 3.0 (Official Annotated) at ₹1099 — Order Online | ColourCopy Hub',
    desc: 'Core BTR 3.0 Official Annotated Edition pre-printed and bound. ₹1099 all-inclusive with pan-India delivery. Order on WhatsApp from Choudhary Colour Xerox Point.',
  },
};

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function rewrite(html, { title, desc, canonical }) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/i,
             `<meta name="description" content="${escapeAttr(desc)}"/>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i,
             `<link rel="canonical" href="${canonical}"/>`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i,
             `<meta property="og:title" content="${escapeAttr(title)}"/>`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i,
             `<meta property="og:description" content="${escapeAttr(desc)}"/>`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i,
             `<meta property="og:url" content="${canonical}"/>`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/i,
             `<meta name="twitter:title" content="${escapeAttr(title)}"/>`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/i,
             `<meta name="twitter:description" content="${escapeAttr(desc)}"/>`);
}

const root = __dirname;
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let count = 0;

for (const [slug, meta] of Object.entries(PATH_META)) {
  const canonical = `${SITE}/${slug}`;
  const html = rewrite(indexHtml, { title: meta.title, desc: meta.desc, canonical });
  const dir = path.join(root, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`✓ ${slug}/index.html`);
  count++;
}

console.log(`\nGenerated ${count} static SEO pages.`);

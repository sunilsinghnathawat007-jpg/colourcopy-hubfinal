#!/usr/bin/env node
/**
 * Generate per-path static HTML for SEO subpages.
 *
 * Reads index.html, then writes one <slug>/index.html per entry in PATH_META,
 * with title/description/canonical/og/twitter rewritten AND a unique intro
 * section (H1 + paragraphs + FAQ) injected at the <!-- SUBPAGE_INTRO --> marker
 * so each page has unique body content (not just unique meta tags).
 *
 * Run: node build.js
 * Re-run whenever index.html changes (Vercel does this automatically on deploy).
 */

const fs = require('fs');
const path = require('path');

const SITE = 'https://www.onlinecolourprint.com';

// Reusable WhatsApp deep link
function waLink(msg) {
  return `https://wa.me/918003102135?text=${encodeURIComponent(msg)}`;
}

// Shared CTA button HTML
function ctaBtn(label, msg, source) {
  const onClick = `trackEvent('subpage_cta_click',{source:'${source}'});trackEvent('whatsapp_click',{source:'${source}'});`;
  return `<a href="${waLink(msg)}" target="_blank" rel="noopener" onclick="${onClick}" style="display:inline-flex;align-items:center;gap:10px;background:#25D366;color:white;padding:13px 28px;border-radius:50px;font-weight:700;text-decoration:none;font-size:15px;box-shadow:0 4px 14px rgba(37,211,102,0.35);font-family:Nunito,sans-serif;margin-top:8px;">💬 ${label}</a>`;
}

// Wrap intro in a consistent section template
function introSection({ badge, h1, lead, body, ctaLabel, ctaMsg, slug }) {
  return `<section style="background:linear-gradient(135deg,#fff8f5 0%,#ffe8d9 100%);padding:90px 5% 50px;">
  <div style="max-width:920px;margin:0 auto;">
    <div style="display:inline-block;background:white;color:var(--o);padding:6px 14px;border-radius:50px;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;border:1.5px solid rgba(255,107,53,0.2);margin-bottom:16px;">${badge}</div>
    <h1 style="font-family:Poppins,sans-serif;font-size:38px;line-height:1.2;margin:0 0 16px;color:#1a1a1a;">${h1}</h1>
    <p style="font-size:17px;line-height:1.6;color:var(--mu);margin:0 0 22px;">${lead}</p>
    ${body}
    ${ctaBtn(ctaLabel, ctaMsg, slug || 'subpage')}
  </div>
</section>`;
}

const PATH_META = {
  'mbbs-book-printing': {
    title: 'MBBS Book Printing Online — Pan-India Delivery from ₹1/page | ColourCopy Hub',
    desc: 'Print full-colour MBBS books (Anatomy, Physiology, Biochemistry, Pathology, Pharmacology) online. Pan-India delivery from Pratap Nagar, Jaipur. WhatsApp to order.',
    intro: introSection({
      badge: '📚 MBBS Book Printing',
      h1: 'MBBS Book Printing Online — Anatomy, Physiology, Pathology & More',
      lead: 'Get every MBBS textbook printed in vivid full colour and delivered to your doorstep anywhere in India. Crisp anatomical diagrams, sharp histology slides, and accurate pharmacology tables — exactly what medical students need.',
      body: `<p style="font-size:15px;line-height:1.65;color:var(--tx);margin:0 0 14px;">From <strong>Choudhary Colour Xerox Point</strong> in Pratap Nagar, Jaipur, we print:</p>
      <ul style="font-size:15px;line-height:1.85;color:var(--tx);padding-left:22px;margin:0 0 18px;">
        <li><strong>1st Year MBBS:</strong> Anatomy (Gray's, BD Chaurasia), Physiology (Ganong, Guyton), Biochemistry (Harper's, Lippincott)</li>
        <li><strong>2nd Year MBBS:</strong> Pathology (Robbins, Harsh Mohan), Pharmacology (KD Tripathi, Katzung), Microbiology (Ananthanarayan, Levinson)</li>
        <li><strong>3rd & Final Year:</strong> Medicine (Davidson's, Harrison), Surgery (Bailey & Love, SRB), OBG (Dutta, Shaw)</li>
        <li><strong>Coaching notes:</strong> Marrow, PrepLadder, DAMS, Egurukul handwritten notes</li>
      </ul>
      <p style="font-size:15px;line-height:1.65;color:var(--tx);margin:0 0 18px;">Just <strong>WhatsApp the PDF</strong>. We print, bind (spiral or hard cover), and ship. Most orders dispatched within 24 hours. Delivery 2–5 days across India.</p>`,
      ctaLabel: 'Order MBBS Books on WhatsApp',
      ctaMsg: 'Hi, I want to print MBBS books. Here are the details:',
      slug: 'mbbs-book-printing',
    }),
  },
  'neet-notes-printing': {
    title: 'NEET Notes & BDS Book Printing Online | Pan-India Delivery — ColourCopy Hub',
    desc: 'Photocopy and print NEET preparation books, BDS textbooks, AIIMS coaching material. Colour or B&W with pan-India delivery from Jaipur.',
    intro: introSection({
      badge: '🩺 NEET / BDS / AIIMS Printing',
      h1: 'NEET Preparation Books & BDS Notes Printed and Delivered',
      lead: 'Whether you\'re preparing for NEET-UG, NEET-PG, AIIMS, BDS, or already in dental college — we print your books and notes in colour or black & white and deliver pan-India.',
      body: `<p style="font-size:15px;line-height:1.65;color:var(--tx);margin:0 0 14px;">Popular orders from NEET aspirants and dental students:</p>
      <ul style="font-size:15px;line-height:1.85;color:var(--tx);padding-left:22px;margin:0 0 18px;">
        <li><strong>NEET-UG:</strong> Allen, Aakash, Resonance, NCERT-based modules, Biology Class 11/12 NCERT</li>
        <li><strong>NEET-PG:</strong> Marrow, PrepLadder, DAMS, DBMCI handwritten notes</li>
        <li><strong>BDS:</strong> Soben Peter (Public Health), Shafer's (Oral Pathology), Sturdevant's (Operative Dentistry)</li>
        <li><strong>AIIMS coaching:</strong> Dr Bhatia, Eduwaves, Damages — full sets and selected subjects</li>
      </ul>
      <p style="font-size:15px;line-height:1.65;color:var(--tx);margin:0 0 18px;">B&W from <strong>₹0.5/side</strong> · Colour from <strong>₹1/side</strong> (orders 100+ pages). Spiral binding ₹20/volume, hard cover ₹30/volume. Delivered safely with bubble-wrap packaging.</p>`,
      ctaLabel: 'Order NEET / BDS Notes',
      ctaMsg: 'Hi, I want to print NEET / BDS notes. Here are the details:',
      slug: 'neet-notes-printing',
    }),
  },
  'ca-cfa-notes-printing': {
    title: 'CA, CFA & CS Notes Printing Online — ColourCopy Hub',
    desc: 'Print CA Foundation/Inter/Final notes, CFA Level 1-3 study material, CS ICSI books and MBA case studies. Pan-India delivery from Pratap Nagar, Jaipur.',
    intro: introSection({
      badge: '📊 CA / CFA / CS / MBA',
      h1: 'CA, CFA & CS Notes Printing — All Levels, Pan-India Delivery',
      lead: 'Printing partner for finance and commerce students across India. CA Foundation to Final, CFA Level 1 to 3, CS Executive to Professional, MBA case studies — print exactly what you need, get it delivered fast.',
      body: `<p style="font-size:15px;line-height:1.65;color:var(--tx);margin:0 0 14px;">Most-ordered material from CA / CFA / CS aspirants:</p>
      <ul style="font-size:15px;line-height:1.85;color:var(--tx);padding-left:22px;margin:0 0 18px;">
        <li><strong>CA Foundation / Inter / Final:</strong> ICAI study material, RTPs, MTPs, Suggested Answers, scanner books</li>
        <li><strong>CFA L1/L2/L3:</strong> Schweser notes, Kaplan summaries, official curriculum highlights</li>
        <li><strong>CS Executive / Professional:</strong> ICSI study material, scanner books, case-laws compilations</li>
        <li><strong>MBA / PGDM:</strong> HBR case studies, IIM/ISB course packs, finance & marketing reference texts</li>
      </ul>
      <p style="font-size:15px;line-height:1.65;color:var(--tx);margin:0 0 18px;">WhatsApp the PDF or share the book name — we source, print and ship. Bulk orders for coaching institutes get special pricing.</p>`,
      ctaLabel: 'Order CA / CFA / CS Notes',
      ctaMsg: 'Hi, I want to print CA / CFA / CS notes. Here are the details:',
      slug: 'ca-cfa-notes-printing',
    }),
  },
  'photocopy-online-jaipur': {
    title: 'Online Photocopy & Xerox Shop — Pratap Nagar Jaipur | ColourCopy Hub',
    desc: 'Choudhary Colour Xerox Point — online photocopy & colour print delivered. WhatsApp your PDF, we print and ship anywhere in India. Starting ₹0.5/side.',
    intro: introSection({
      badge: '🖨️ Online Photocopy / Xerox',
      h1: 'Online Photocopy & Xerox Shop — Pratap Nagar, Jaipur',
      lead: 'Skip the trip to a local shop. We\'re <strong>Choudhary Colour Xerox Point</strong> in Pratap Nagar, Jaipur — and we deliver photocopies, colour prints, spiral binding, and book printing to your address anywhere in India.',
      body: `<p style="font-size:15px;line-height:1.65;color:var(--tx);margin:0 0 14px;">Why students and professionals across India choose us over walking to a nearby xerox shop:</p>
      <ul style="font-size:15px;line-height:1.85;color:var(--tx);padding-left:22px;margin:0 0 18px;">
        <li><strong>Order on WhatsApp</strong> — no app, no signup, no upload portal</li>
        <li><strong>Fair pricing:</strong> B&W ₹0.5/side, colour ₹1/side (100+ pages), no hidden fees</li>
        <li><strong>Fast turnaround:</strong> printed within 24 hrs, dispatched same/next day</li>
        <li><strong>Pan-India delivery:</strong> all 28 states + 8 UTs via trusted couriers</li>
        <li><strong>Quality guarantee:</strong> 75 GSM paper, premium colour reproduction</li>
        <li><strong>Verified:</strong> 5.0 ★ on Google · 40+ reviews · LGBTQ+ friendly · in-store pickup also available</li>
      </ul>
      <p style="font-size:15px;line-height:1.65;color:var(--tx);margin:0 0 18px;">Located at Vatsalya 2 Complex, near NRI Circle, below Xtreme Fitness Gym, Sector 19, Pratap Nagar, Jaipur — but you don\'t need to visit. WhatsApp anywhere, anytime.</p>`,
      ctaLabel: 'Order on WhatsApp',
      ctaMsg: 'Hi, I want to print / photocopy. Here are the details:',
      slug: 'photocopy-online-jaipur',
    }),
  },
  'core-btr-3': {
    title: 'Core BTR 3.0 (Official Annotated) at ₹1099 — Order Online | ColourCopy Hub',
    desc: 'Core BTR 3.0 Official Annotated Edition pre-printed and bound. ₹1099 all-inclusive with pan-India delivery. Order on WhatsApp from Choudhary Colour Xerox Point.',
    intro: introSection({
      badge: '📕 Core BTR 3.0 · In Stock',
      h1: 'Core BTR 3.0 — Official Annotated Edition at ₹1099',
      lead: 'Pre-printed, professionally bound copies of <strong>Core BTR 3.0 (Official Annotated Edition)</strong> available now from Choudhary Colour Xerox Point. ₹1099 all-inclusive — no PDF needed, no waiting.',
      body: `<p style="font-size:15px;line-height:1.65;color:var(--tx);margin:0 0 14px;">What's included in your Core BTR 3.0 order:</p>
      <ul style="font-size:15px;line-height:1.85;color:var(--tx);padding-left:22px;margin:0 0 18px;">
        <li>✓ <strong>Official annotated edition</strong> — full content, faithfully reproduced</li>
        <li>✓ <strong>Full-colour print</strong> on premium 75 GSM paper</li>
        <li>✓ <strong>Premium binding</strong> (spiral or hard cover available)</li>
        <li>✓ <strong>Pan-India delivery</strong> via trusted couriers (2–5 days)</li>
        <li>✓ <strong>Bubble-wrap packaging</strong> — arrives in perfect condition</li>
        <li>✓ <strong>All-inclusive ₹1099</strong> — printing + binding + shipping</li>
      </ul>
      <p style="font-size:15px;line-height:1.65;color:var(--tx);margin:0 0 18px;">Already ordered by 100s of medical students preparing for FMGE, MBBS exams, and clinical practice. Tap below to confirm your order on WhatsApp — we\'ll dispatch within 24 hours.</p>`,
      ctaLabel: 'Order Core BTR 3.0 — ₹1099',
      ctaMsg: 'Hi, I want to order Core BTR 3.0 (Official Annotated) @ ₹1099',
      slug: 'core-btr-3',
    }),
  },
};

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function rewrite(html, { title, desc, canonical, intro }) {
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
             `<meta name="twitter:description" content="${escapeAttr(desc)}"/>`)
    .replace('<!-- SUBPAGE_INTRO -->', intro || '');
}

const root = __dirname;
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let count = 0;

for (const [slug, meta] of Object.entries(PATH_META)) {
  const canonical = `${SITE}/${slug}`;
  const html = rewrite(indexHtml, { title: meta.title, desc: meta.desc, canonical, intro: meta.intro });
  const dir = path.join(root, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`✓ ${slug}/index.html (${(html.length / 1024).toFixed(1)}KB)`);
  count++;
}

console.log(`\nGenerated ${count} static SEO pages with unique H1 + content blocks.`);

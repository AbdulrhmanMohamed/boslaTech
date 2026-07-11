# AGENTS.md — Project Guide

## Project Identity
- **Business:** مؤسسة حافة النجوم (Hafat Alnjom) — CR 7050568158
- **Brand:** BOSLA (short brand name), حافة النجوم (legal name)
- **Location:** حي الملز، الرياض، المملكة العربية السعودية
- **Phone:** +966576704683
- **What you actually do:** WordPress websites, Shopify stores, Salla stores, Zid stores, custom e-commerce, SEO services, digital marketing, branding, maintenance
- **Who you serve:** Saudi SMEs, e-commerce brands, service businesses in Riyadh + all KSA
- **Language:** Arabic (default) + English via `?lang=en`
- **Tech stack:** SvelteKit + Tailwind (static site, adapter-static)
- **Branch:** `seo-optimize`

## Sacred Rules — Read Before Every Step

1. **No technology names in service content.** Clients don't care about SvelteKit, Tailwind, React, etc. Describe outcomes, not tools.
2. **No fake stats.** Never use "500+ clients", "4.9/5 rating", "money-back guarantee" unless verified with real data. Replace with real claims or remove.
3. **No portfolio section.** Skip it. The client doesn't want it.
4. **No team/about bios.** Skip it. The client doesn't want it.
5. **No pricing tables.** The client doesn't want pricing on the site.
6. **Contact form backend.** Leave as-is for now (does `alert()`).
7. **Always check seo-plan.md layers before any decision.** Every change must map to at least one layer.

## The 18-Layer SEO Framework
*Every decision, every piece of content, every link must serve one of these layers:*

### ── Foundation Layers ──

#### 1. Business
- Unify brand voice under "مؤسسة حافة النجوم" for legal references, BOSLA as brand name
- State explicitly who you serve: Saudi SMEs
- State explicitly what you build: WordPress, Shopify, Salla, Zid, SEO, marketing
- Every service description must name the actual platform, not the framework

#### 2. Search Intent
- Every page must answer 3 questions above the fold: "Can you do X? How much? How long?"
- Target transactional intent: "شركة تصميم مواقع في الرياض", "سعر متجر إلكتروني"
- City pages must use city name in H1 + title + description
- Remove generic tech descriptions → replace with outcome statements

#### 3. Information Architecture
```
Home
├── About
├── Services (pillar)
│   ├── Web Development
│   │   ├── Custom Websites (corporate, landing pages, portfolio)
│   │   ├── WordPress Development (themes, plugins, WooCommerce)
│   │   ├── Online Stores (Shopify, Salla, Zid, custom)
│   │   ├── Redesign & Migration
│   │   └── Maintenance & Support
│   ├── SEO
│   │   ├── Technical SEO
│   │   ├── Local SEO
│   │   ├── Content SEO
│   │   ├── Link Building
│   │   ├── SEO Audit
│   │   └── E-commerce SEO
│   └── Digital Marketing
│       ├── Social Media Marketing
│       ├── Google Ads
│       ├── Snapchat & TikTok Ads
│       ├── Content Marketing
│       ├── Email Marketing
│       └── Brand Identity
├── Blog
├── Locations (Riyadh, Jeddah, Dammam, Khobar, Mecca, Medina)
└── Contact
```

#### 4. Keyword Research
- Every page targets ONE primary keyword in title + H1 + meta description
- Keywords must be what real clients search (transactional/local)
- Reference keyword table in seo-strategy-layer-by-layer.md

#### 5. Topic Discovery
- Must include: WordPress themes, Shopify stores, Salla stores, Zid stores, E-commerce SEO, CRM Integration, GBP management, Saudi hosting, CRO
- Every missing topic from the findings must be either added or explicitly noted as deferred

#### 6. Topical Mapping
- Each sub-service page lists 3-5 child topics (potential future pages)
- The tree must show real depth, not flat lists
- Topical map for E-commerce must show Shopify → Shopify SEO → Shopify payment integration
- Topical map for SEO must show cross-links to E-commerce

#### 7. Semantic SEO
- LocalBusiness schema ✅ (verify still present)
- Service schema on every sub-service page ✅
- BreadcrumbList on every page ✅
- Organization schema with logo + sameAs + taxID — ADD if missing
- Article schema for blog posts — ADD when blog exists
- FAQPage on sub-service pages — ADD if FAQ exists on page
- Entity relationships must connect services (e.g., LocalBusiness → Service → Service)

#### 8. Content Strategy
- Blog is NOT deferred. Must have minimum 3 posts
- Posts answer real client questions with practical value
- Each blog post links to relevant service pages

### ── Technical Layers ──

#### 9. Technical SEO
- Canonical URLs ✅
- Hreflang tags ✅
- XML sitemap ✅
- Unique meta titles per page — VERIFY all pages have keyword-specific titles
- GTM ID is placeholder — needs real ID

#### 10. Internal Linking
- Every sub-service page has 2+ contextual cross-links to related services
- Cross-links placed naturally in content, not just in "Related" block
- Blog posts link to service pages
- City pages link to service pages
- "Need e-commerce? We also optimize it for SEO" — this pattern everywhere

### ── Local & Trust Layers ──

#### 11. Local SEO
- City pages with real local content (not generic)
- GBP link on contact page
- NAP consistent everywhere
- LocalBusiness schema ✅

#### 12. EEAT (Experience, Expertise, Authority, Trust)
- **NO FAKE STATS** — remove or replace with real claims
- Service descriptions show real platform expertise (Salla API, Shopify Liquid, WooCommerce)
- CR number visible ✅
- Contact form must eventually work (deferred)
- Client logo bar — try to add (extract from 3D scene)

#### 13. Authority
- Client logo bar (even without names)
- Partnership badges if applicable (Salla partner, Shopify partner)
- Blog content that demonstrates expertise

### ── Conversion & Growth Layers ──

#### 14. UX
- Remove fake trust lines — they undermine credibility
- Technology names → client benefits
- Scroll progress bar ✅
- Sticky CTA ✅
- Breadcrumbs ✅

#### 15. CRO (Conversion Rate Optimization)
- Per-service cost FAQ with REAL price ranges that the client actually charges
- Not one generic FAQ — each service category has its own cost question
- WhatsApp CTA pre-fills service name ✅
- Free consultation offer on every page
- Delivery timeline on every service card ✅

#### 16. Analytics
- Replace GTM placeholder with real container ID
- Set up GA4 property
- Track: page views, WhatsApp clicks, CTA clicks

#### 17. Reporting
- Connect GA4 → Looker Studio (after analytics is live)
- Monthly review: traffic, leads, top pages

#### 18. Scaling
- Current JSON data is fine for now
- When content exceeds ~50 pages → migrate to Strapi/Sanity
- Blog + location pages are the growth drivers

## Content Voice
- **Arabic:** Formal Saudi Arabic. No Egyptian dialect. Professional but warm.
- **English:** Professional, direct, outcome-focused.
- **Never** say "we use modern technology" — say what you BUILD.
- **Bad:** "We build fast, secure, SEO-friendly websites using SvelteKit and Tailwind CSS"
- **Good:** "نبني متاجر شوبيفاي متكاملة مع بوابات الدفع السعودية (مدى، STC Pay)"
- **Bad:** "Our team delivers production-ready solutions on time"
- **Good:** "نساعدك في إطلاق متجرك على شوبيفاي أو سلة خلال 7 أيام عمل"

## Commit Naming Convention
`Phase X: Layer — Description`
Example: `Phase 1: Business — Rewrite service content to remove tech names`

## Rollback
- `abf3807` — safe base before all SEO work
- Each phase is one commit = `git revert <hash>` to undo

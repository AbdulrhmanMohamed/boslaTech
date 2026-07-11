# SEO Optimization Checklist

> Branch: `seo-optimize`
> Based on findings from `findings.md`

---

## Phase 1: Trust & Social Proof
*Highest impact, lowest effort. Build credibility immediately.*

- [x] **1. Activate SocialProofSection** — Uncomment it on the homepage (500+ clients, 98% satisfaction, 4.9 rating, 250% avg growth)
- [x] **2. Add trust line under every CTA** — "500+ businesses trust us" or "4.9/5 client rating" next to every "Get a Quote" button
- [ ] **3. Add client logo bar** — Extract logos from the 3D scene and display as a static scrolling marquee on the homepage
- [x] **4. Fix /privacy and /terms 404s** — Either create the pages or remove the footer links
- [x] **5. Remove /portfolio from nav/CTA** — Remove the dead portfolio link until a real page exists

---

## Phase 2: Address Core Objections (CRO)
*Answer the #1 question clients have — cost — and set expectations.*

- [x] **6. Add cost as FAQ question on service pages** — Give a range (1,500-5,000 SAR) anchored to a free consultation
- [ ] **7. Add service-specific pricing FAQ per category** — Tailored cost FAQ for SEO, e-commerce, redesign (e.g., "How much does SEO cost?")
- [x] **8. Add delivery time to every service card** — "مدة التسليم: X يوم عمل" / "Delivery: X business days" under each sub-service
- [x] **9. Add FAQ section to service detail pages** — Render `services.i18n.json` FAQ on `/services/[slug]` pages
- [ ] **10. Surface the 3-step process on the homepage** — Consult → Build → Launch between hero and features

---

## Phase 3: UX & Functional Fixes
*Fix broken experiences that kill conversions.*

- [ ] **11. Fix the contact form** — Connect to a real backend (email API, CMS, or `mailto:` fallback). Currently does `alert()` with no submission
- [x] **12. Add sticky "Get a Quote" button** — Persistent floating CTA once hero scrolls past, similar to WhatsApp button
- [x] **13. Add scroll progress indicator** — Thin bar at top of page that fills on scroll (especially for long homepage)
- [x] **14. Replace homepage service modals with direct links** — Make the 8 service cards link to `/services/[slug]` instead of opening modals (better for SEO + UX)
- [x] **15. Localize the WhatsApp message** — Change from Egyptian "كنت عايز استفسر" to Saudi dialect or formal Arabic
- [x] **16. Make WhatsApp CTA contextual** — Pre-fill message with the specific service name when clicked from a service page
- [x] **17. Change hero secondary CTA** — From `/contact` (same as primary) to `/services` so clients can evaluate first

---

## Phase 4: Schema & Technical SEO
*Foundation for search engines to understand and rank the site.*

- [x] **18. Add LocalBusiness schema** — JSON-LD with company name, CR number, address (Riyadh), phone, area served. Highest-impact SEO change
- [x] **19. Add Service + BreadcrumbList schema** — Mark up each offering with `Service` type and add breadcrumb navigation path on every service detail page
- [x] **20. Add unique meta titles and descriptions per page** — Homepage, about, services, service detail, contact all have unique titles + descriptions
- [x] **21. Fix hreflang implementation** — `<link rel="alternate" hreflang="ar/en/x-default">` in layout `<head>` for every route
- [x] **22. Generate XML sitemap** — `/sitemap.xml` with 14 entries (7 pages × 2 languages), auto-prerendered
- [x] **23. Add canonical URLs** — `<link rel="canonical" />` with `$page.url.pathname` in layout
- [x] **24. Fix brand name inconsistency** — "Orcado" → "Hafat Alnjom" in about page + `about.i18n.json`

---

## Phase 5: Internal Linking & IA
*Connect the content graph for better UX and SEO.*

- [x] **25. Add contextual internal linking across all pages:**
  - [x] Link from homepage service cards to `/services/[slug]` (replacing modals)
  - [x] Add "Related Services" section on each detail page linking to the other 2 categories
  - [x] Add cross-links between related sub-services (FAQ on detail page references other services)
  - [x] Link from CTAs and content to FAQ where relevant (services page CTA below FAQ)
  - [x] Add breadcrumb navigation on every inner page (about, services, service detail, contact)
- [ ] **26. Restructure services into pillar-cluster model** — ⚠️ Needs discussion. Would create individual sub-pages per sub-service (e.g. `/services/web-development/custom-websites`). Major URL/IA change.

---

## Phase 6: Content Expansion
*Expand search footprint with targeted pages.*

- [ ] **27. Build high-intent keyword pages** — Dedicated landing pages for 9 key queries:
  - شركة تصميم مواقع في الرياض
  - سعر تصميم موقع شركة
  - تصميم متجر إلكتروني السعودية
  - شركة SEO في الرياض
  - تسويق رقمي للشركات الصغيرة
  - إعادة تصميم موقع قديم
  - صيانة مواقع إلكترونية
  - تحسين متجر سلة
  - شركة برمجة مواقع في جدة
- [ ] **28. Add missing sub-services** — Expand coverage for 9 missing topics:
  - Website maintenance & support
  - Visual identity / branding
  - Snapchat & TikTok ads
  - Salla/Zid store optimization
  - Google Business Profile management
  - Saudi hosting & domain services
  - Mobile app development
  - CRM integration
  - Conversion rate optimization
- [ ] **29. Create location pages** — City + service combinations for local SEO (Riyadh, Jeddah, Dammam, Khobar, Mecca, Medina)
- [ ] **30. Start a blog** — Publish guides that answer client questions organically: "How much does a website cost in Saudi Arabia?", "SEO tips for Riyadh businesses," "Salla vs custom e-commerce"
- [ ] **31. Create authority content** — 1-2 pieces per quarter of original research/data (e.g., "Website pricing benchmark for Saudi SMEs 2026")

---

## Phase 7: Measurement & Scale
*Make everything measurable and repeatable.*

- [ ] **32. Install GA4 + Google Tag Manager** — Track page views, scroll depth, CTA clicks, WhatsApp clicks, conversions
- [ ] **33. Set up reporting dashboard** — Connect GA4 to Looker Studio for monthly reports: traffic, leads, WhatsApp clicks, top landing pages, conversion rate
- [ ] **34. Plan for headless CMS** — Transition from hardcoded JSON to Strapi/Sanity/Google Sheets + API so non-developers can add services, blog posts, and location pages

---

## Progress Tracker

| Phase | Items | Done | Notes |
|-------|-------|------|-------|
| 1 — Trust & Social Proof | 5 | 0/5 | |
| 2 — Address Core Objections | 5 | 0/5 | |
| 3 — UX & Functional Fixes | 7 | 0/7 | |
| 4 — Schema & Technical SEO | 7 | 0/7 | |
| 5 — Internal Linking & IA | 2 | 0/2 | |
| 6 — Content Expansion | 5 | 0/5 | |
| 7 — Measurement & Scale | 3 | 0/3 | |
| **Total** | **34** | **0/34** | |

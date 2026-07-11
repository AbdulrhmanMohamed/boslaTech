# Site Audit: Client-Perspective Analysis

> **Site:** BOSLA / Hafat Alnjom (مؤسسة حافة النجوم)
> **Date:** July 2026
> **Scope:** UX, content, trust signals, conversion flow, SEO readiness

---

## 1. Business

**Status:** The business identity is fragmented. Three brand names are used interchangeably:
- **BOSLA** — layout config, site name, some fallback text
- **حافة النجوم / Hafat Alnjom** — header logo, WhatsApp tooltip, CR reference
- **Orcado** — about page English intro (stale reference, likely an old brand name)

The site never explicitly states *who* it serves (SMEs? enterprises? e-commerce brands?) or *what outcomes* clients get beyond "a website." The service descriptions are feature-focused, not outcome-focused.

**Gap:** A client doesn't know if this agency is for them. No industry specialization, no client profile, no specific problem statement.

---

## 2. Search Intent

**Status:** The site targets broad informational intent — "Web Development," "SEO," "Digital Marketing." These terms are impossibly competitive and don't match what a buyer actually types.

**Gap:**
- No pages targeting transactional/local intent: "شركة تصميم مواقع في الرياض," "سعر متجر إلكتروني السعودية," "SEO company Riyadh"
- The homepage serves as a catch-all, matching no one query well
- The most transactional content on the site (pricing) is hidden/not in use

**What a client searching for a service actually wants:** "Can you do X? How much? How long? Can I trust you?" — the site answers none of these immediately.

---

## 3. Information Architecture

**Current structure:**
```
Home
├── About
├── Services (pillar)
│   ├── Web Development
│   ├── SEO
│   └── Digital Marketing
└── Contact
```

**Gaps:**
- **Pricing** — the PricingSection component (858 lines of code) is built but used nowhere
- **FAQ** — only exists on the services pillar page, not on detail pages or homepage
- **Blog/resources** — no content engine at all
- **Location pages** — no city-specific pages (Riyadh, Jeddah, etc.)
- **Duplicate service display** — the homepage has an 8-card ServicesSection (opens modals) AND the `/services` pillar page has 3 categories. Same data, two different presentations. Confusing.

---

## 4. Keyword Research

**Status:** No visible keyword strategy. Service labels are generic.

**Missing opportunities (high-intent queries the site should target):**
- شركة تصميم مواقع في الرياض
- سعر تصميم موقع شركة
- تصميم متجر إلكتروني السعودية
- شركة SEO في الرياض
- تسويق رقمي للشركات الصغيرة
- إعادة تصميم موقع قديم
- صيانة مواقع إلكترونية
- تحسين متجر سلة
- شركة برمجة مواقع في جدة

**Gap:** Service descriptions are written for brand presence, not for ranking on specific search queries. No long-tail keyword targeting anywhere.

---

## 5. Topic Discovery

**Current topics covered:**
- Web Development (3 sub-topics)
- SEO (3 sub-topics)
- Digital Marketing (3 sub-topics)

**Missing topics clients actually search for:**
- Website maintenance & support
- Visual identity / branding
- Snapchat & TikTok ads
- Salla/Zid store optimization
- Google Business Profile management
- Saudi hosting & domain services
- Mobile app development (mentioned in footer but not as a service)
- CRM integration
- Conversion rate optimization

---

## 6. Topical Mapping

**Status:** Flat. Services are a simple list under 3 categories with no depth.

**What it should look like (example — Web Development):**
```
Web Development
├── Custom Websites
│   ├── Corporate websites
│   ├── Landing pages
│   ├── Portfolio sites
│   └── Blog/magazine sites
├── E-commerce
│   ├── Custom Salla integration
│   ├── Zid store setup
│   ├── Shopify development
│   └── Full custom e-commerce
├── Redesign & Migration
│   ├── WordPress to SvelteKit
│   ├── SEO-preserving migration
│   └── Performance overhaul
└── Maintenance & Support
    ├── Security updates
    ├── Content updates
    └── Performance monitoring
```

**Gap:** The current flat structure means thin topic coverage. No subtopics to build internal links or create pillar-cluster architecture.

---

## 7. Semantic SEO

**Status:** Minimal. Only FAQPage schema on the services pillar page.

**Missing schema markup:**
- **LocalBusiness** — this is the single most important schema for a registered Riyadh company. Not present anywhere.
- **Service** schema for each offering
- **BreadcrumbList** on every page
- **Organization** schema with logo, social profiles, CR number
- **Review** schema (if testimonials were visible)
- **Product** schema (if pricing were displayed)

---

## 8. Content Strategy

**Status:** No content strategy. The site has service descriptions and nothing else.

**Gap:**
- No blog/articles for organic traffic
- No guides/tutorials ("How to start an e-commerce store in Saudi Arabia")
- No comparison pages ("Custom website vs WordPress")
- No "vs" pages
- The FAQ is static and not expanded into individual, rankable pages
- No lead magnets (checklists, guides, ROI calculators)
- **Cost is not addressed anywhere** — the #1 question every client has is completely absent from the content

---

## 9. Technical SEO

**Status:** Modern tech stack (SvelteKit, static adapter). Speed is presumably good.

**Issues found:**
- **Title tags:** Uses `{category?.name || 'Service'} | BOSLA` — same pattern for every page, no keyword optimization
- **Meta descriptions:** Not explicitly set per page — relying on fallback text
- **Hreflang:** Uses `?lang=` query param, not proper `link rel="alternate"` hreflang tags
- **Sitemap:** Likely not auto-generated (static adapter, no sitemap plugin visible)
- **404s:** `/privacy`, `/terms` both return 404 despite being linked in the footer
- **Canonical URLs:** Not handled explicitly

---

## 10. Internal Linking

**Status:** Basic nav linking only.

**Gaps:**
- No "related services" links within content
- No cross-linking between services ("Need e-commerce? We also optimize it for SEO")
- Service detail pages don't link to each other
- Homepage service cards open modals instead of linking to `/services` pages
- No contextual links from any page to the FAQ

---

## 11. Local SEO

**Status:** Business is based in Riyadh (حي الملز). CR number visible. Google Maps embed exists.

**Gaps:**
- **No LocalBusiness schema** — this alone costs local rankings
- No location-specific landing pages (Riyadh, Jeddah, Dammam, Khobar, Mecca, Medina)
- No Google Business Profile link or recent posts display
- No local citation signals
- Service areas not explicitly listed
- WhatsApp message uses Egyptian Arabic ("كنت عايز") for a Saudi business — creates subconscious trust friction

---

## 12. EEAT (Experience, Expertise, Authoritativeness, Trustworthiness)

**This is the weakest area of the entire site.**

| Factor | Status |
|--------|--------|
| **Experience** | No case studies, no client work shown. Zero evidence anything has been built. |
| **Expertise** | Service content is generic. No deep technical detail, no methodology explained in depth, no unique point of view. |
| **Authoritativeness** | CR number helps. No client logos, no partnerships, no certifications, no press mentions, no published research. 90+ client logos exist in the 3D scene but are not displayed statically. |
| **Trustworthiness** | Social proof section is **commented out**. Contact form doesn't submit. No guarantees visible above the fold. Cost objection is completely ignored. |

**The single highest-impact fix for the entire site:** Activate the SocialProofSection and add client logo display. It's built, designed, and ready — just commented out.

---

## 13. Authority

**Status:** No authority signals anywhere.

**Gaps:**
- No backlink-worthy content (original data, research, guides)
- No guest posting or external presence visible
- No client logo bar (static)
- No awards, certifications, or partnerships displayed
- The site doesn't position itself as an authority in any niche

---

## 14. UX

**Status:** Visually stunning — glassmorphism, 3D Three.js scenes, smooth GSAP animations, polished bilingual support. The design is the strongest asset.

**Issues:**
- **Scroll fatigue:** Homepage has too many sections in sequence (Hero → 7 Features → 8 Services → 4 Pillars → CTA → 8 FAQ). Clients don't read all of this.
- **Service modals:** Clicking a service on the homepage opens a modal instead of navigating to the dedicated page. This hides content from search engines and adds friction.
- **Contact form doesn't submit:** The form does `alert("Message sent")` with no backend. A client fills everything out and their data is lost forever. This is the site's most critical functional failure.
- **No sticky "Get a Quote" button:** After scrolling past the hero, there's no persistent CTA.
- **No scroll progress indicator:** Long RTL pages without progress feedback.

---

## 15. CRO (Conversion Rate Optimization)

**Status:** CTAs exist but lack urgency and supporting trust.

**Gaps:**
- **No pricing anchoring:** Clients have zero sense of budget. The PricingSection (with 50% sale, clear package tiers, add-ons) is complete but unused.
- **No urgency signals:** No "limited time," no "starting from," no demand indicators.
- **No social proof near CTAs:** Every CTA button stands alone without a supporting trust line ("500+ happy clients," "4.9/5 rating").
- **No testimonials:** The TestimonialSection is commented out.
- **Guarantee buried:** "30-day money back" is FAQ item #6 — most clients never scroll that far.
- **CTA fatigue:** Multiple identical-looking buttons with no hierarchy — the client can't tell which action matters most.
- **WhatsApp message is generic:** Same pre-filled message regardless of which service the client is viewing.
- **Cost objection is unhandled:** The #1 conversion killer (client doesn't know if they can afford it) is never addressed anywhere in the flow.

---

## 16. Analytics

**Status:** Not visible in the codebase. No GA4, GTM, Meta Pixel, or any tracking snippet found in the layout or pages.

**Gap:** If there's no analytics, there is zero visibility into:
- Which pages get traffic
- Where users drop off
- Which CTAs convert
- What content drives inquiries
- Traffic sources and campaigns

The site cannot measure its own marketing effectiveness.

---

## 17. Reporting

**Status:** No reporting infrastructure. With no analytics, there's nothing to report on.

**Gap:** The site can't demonstrate performance to the business owner or to potential clients. No case studies can be generated from real data.

---

## 18. Scaling

**Status:** Static site, hardcoded content in JSON files. Adding new services requires developer intervention.

**Gaps:**
- No CMS for non-technical content updates
- No blog infrastructure for content scaling
- No programmatic page generation (city-specific service pages, industry-specific variations)
- Content split across `ar.json`/`en.json` and `services.i18n.json` — this fragmentation grows harder to manage over time
- Adding a new service requires: JSON data + route + page component + navigation update

---

# Recommendations (If I Were In Your Shoes)

## Tier 1: Immediate — No Code Changes Required

These are configuration/activation fixes that take minutes:

1. **Activate SocialProofSection** — Uncomment it on the homepage. The stats (500+ clients, 98% satisfaction, 4.9 rating, 250% avg growth) are your strongest trust asset and they're invisible. Place it after Features or between Services and Why Choose Us.

2. **Fix /privacy and /terms 404s** — The footer links to both. Either create the pages or remove the links (for a Saudi business, a privacy policy is legally advisable).

3. **Change hero secondary CTA** — Instead of `/contact` (same as primary), link to `/services` so the client can evaluate before committing.

4. **Replace homepage service modals with direct links to /services pages** — The 8-card ServicesSection opens modals, which hide content from search engines and add click friction. Replace the modal with a direct `href` to `/services/[slug]` so the client lands on the dedicated service page and search engines can index it.

5. **Remove /portfolio from nav/CTA references** — The nav and CTA section both reference a portfolio route that doesn't exist. Remove the link or redirect it to `/services` until a portfolio page is built.

## Tier 2: Content & Trust — Builds Credibility

6. **Add delivery time to every service card** — Under each sub-service name in the features grid, show "مدة التسليم: X يوم عمل" / "Delivery: X business days." This is what the pricing section did and it sets clear expectations.

7. **Surface the process on the homepage** — Between hero and features, add a compact 3-step visual (Consult → Build → Launch) with icons. The client needs to see your methodology immediately.

8. **Add FAQ to service detail pages** — The FAQ data already exists in `services.i18n.json`. Render it on `/services/[slug]` pages so the client has objections answered without leaving.

9. **Add one trust line under every CTA** — Even a small "500+ businesses trust us" or "4.9/5 client rating" text next to "Get a Quote" buttons significantly lifts conversion.

10. **Add cost as an FAQ question on service pages** — Address the #1 objection head-on. Don't say "هذا سعر السوق" (that commoditizes you). Instead give a range anchored to a free consultation:

    > **AR:** "كم تكلفة تصميم موقع؟"
    > **Answer:** "تختلف التكلفة حسب حجم المشروع واحتياجاتك. على سبيل المثال، تبدأ أسعارنا من 1,500 ريال للمواقع البسيطة، وتصل إلى 5,000 ريال للمواقع المتكاملة. نقدم استشارة مجانية لتحديد السعر الدقيق بناءً على متطلباتك — تواصل معنا للحصول على عرض سعر مخصص."

    > **EN:** "How much does a website cost?"
    > **Answer:** "It depends on the project scope and your needs. Our prices start from 1,500 SAR for simple sites and go up to 5,000 SAR for full-featured websites. We offer a free consultation to determine the exact price based on your requirements — contact us for a custom quote."

    **Why this works:**
    - Client gets a budget anchor (1,500-5,000 SAR) without a formal price list
    - "Starts from" leaves room for higher-end projects
    - "Free consultation" moves them to the next step
    - It's transparent and builds trust
    - The question lives in the FAQ on service pages where the client is already evaluating

11. **Add high-intent keyword pages** — Build dedicated landing pages for the 9 keywords identified in section 4 (e.g., "شركة تصميم مواقع في الرياض," "تصميم متجر إلكتروني السعودية"). Each page targets one city + service combination with specific, locally-relevant content. These are the queries real buyers type.

12. **Expand topic coverage into sub-services** — Add the 9 missing topics from section 5 (maintenance, Salla/Zid optimization, Snapchat ads, Google Business Profile management, etc.) as new sub-service pages. Each missing topic represents a searchable service clients actively look for.

13. **Restructure services into pillar-cluster model** — Instead of a flat list, organize each category as a pillar page with interlinked cluster pages for each subtopic. Use the Web Development example tree from section 6 as the template for all 3 categories.

## Tier 3: Technical SEO — Foundation for Growth

14. **Add LocalBusiness schema** — This is the highest-impact SEO change. Registered company in Riyadh with a CR number — this should be in JSON-LD on every page.

15. **Add Service + BreadcrumbList schema** — On service pages, mark up each offering with Schema.org Service type.

16. **Fix the brand name inconsistency** — Pick one name for the site (BOSLA or Hafat Alnjom) and use it consistently. "Orcado" must be removed from the about page.

17. **Add unique meta titles and descriptions per page** — Currently all pages use the same template pattern. Each page needs a unique, keyword-targeted title and description.

18. **Fix hreflang implementation** — Replace the `?lang=` query param approach with proper `<link rel="alternate" hreflang="ar" href="..." />` and `<link rel="alternate" hreflang="en" href="..." />` tags in the `<head>` of every page. Query params are not reliable for hreflang detection.

19. **Generate an XML sitemap** — Use a SvelteKit sitemap plugin or manually generate `/sitemap.xml` listing all service pages, the pillar page, and the contact page in both language variants.

20. **Add canonical URLs** — Set `<link rel="canonical" href="..." />` on every page using the base URL without `?lang=` param. This prevents duplicate content issues from the language parameter.

21. **Add contextual internal linking across all service pages** — Specifically:
    - Link from homepage service cards to `/services/[slug]` instead of opening modals
    - Add "Related Services" section at the bottom of each service detail page linking to the other 2 categories
    - Add "We also recommend" cross-links between related sub-services (e.g., "Building an e-commerce store? Check our SEO for e-commerce page")
    - Link from every CTA and content paragraph to the FAQ when relevant
    - Add breadcrumb navigation on every inner page (Services → Web Development → Custom Websites)

## Tier 4: Critical Functional Fixes

22. **Fix the contact form** — The form currently does `alert("Message sent")` with no backend submission. This is the single worst UX failure on the site. Connect it to an email service, a CMS, or at minimum a `mailto:` fallback.

23. **Localize the WhatsApp message** — Change "كنت عايز استفسر" (Egyptian) to Saudi dialect or formal Arabic. For a Saudi business in Riyadh, the WhatsApp greeting should match the audience.

24. **Make the WhatsApp CTA contextual** — When a client clicks WhatsApp from a specific service page, the pre-filled message should mention that service name.

25. **Add a sticky "Get a Quote" button on scroll** — Once the hero scrolls past, show a persistent floating CTA (like the WhatsApp button) so the client never has to scroll back up to take action.

26. **Add scroll progress indicator** — A thin colored bar at the top of the page that fills as the user scrolls. Gives the client a sense of progress on long pages (especially the homepage).

27. **Add GA4 + Google Tag Manager** — Install GA4 and GTM across the site to track page views, scroll depth, CTA clicks, WhatsApp clicks, and conversions. Without this, everything else is guesswork.

## Tier 5: Strategic — For Growth & Scaling

28. **Create location pages** — شركة تصميم مواقع في الرياض, شركة SEO في جدة, etc. Each targeting a city + service combination. This is the highest-ROI content investment for local SEO.

29. **Start a blog** — Publish guides that answer client questions: "How much does a website cost in Saudi Arabia?", "SEO tips for Riyadh businesses," "Salla vs custom e-commerce." These build organic traffic and demonstrate expertise.

30. **Add client logo bar** — The 3D scene has 90+ logos. Display them statically as a scrolling logo marquee on the homepage. This is instant social proof without naming individual clients.

31. **Create authority-building content** — Publish 1-2 pieces of original research or data-driven content per quarter (e.g., "Website pricing benchmark for Saudi SMEs 2026," "SEO ranking factors in the GCC market"). This earns backlinks and positions the agency as a thought leader.

32. **Consider service-based pricing FAQ per category** — Each service detail page could have its own cost FAQ tailored to that service (e.g., SEO pricing FAQ, e-commerce pricing FAQ), giving a more specific range per offering.

33. **Set up a reporting dashboard** — Connect GA4 to Looker Studio or a simple dashboard to track: monthly traffic, leads from contact form, WhatsApp clicks per page, top landing pages, conversion rate. Review monthly — without reporting, you can't optimize.

34. **Plan for scalability** — As content grows, transition from hardcoded JSON files to a headless CMS (Strapi, Sanity, or even a Google Sheets + API approach) so non-developers can add services, blog posts, and location pages without touching code.

---

# Mapping: Site Current State vs. SEO Plan

This section compares the site's current state against the 18-layer SEO plan structure you provided. ✓ = covered, ◐ = partial, ✗ = missing.

| SEO Plan Layer | Status | Key Gap |
|---|---|---|
| **1. Business** | ◐ | Brand name inconsistency; no client profile or industry focus |
| **2. Search Intent** | ✗ | No transactional or local-intent pages; homepage is a catch-all |
| **3. Information Architecture** | ◐ | IA exists but modals hide service content from search; missing pricing, FAQ depth, blog, location pages |
| **4. Keyword Research** | ✗ | No keyword strategy; broad terms only |
| **5. Topic Discovery** | ◐ | 9 core topics covered, 9+ missing (maintenance, Salla, Snapchat ads, etc.) |
| **6. Topical Mapping** | ✗ | Flat structure with no depth or subtopic branching |
| **7. Semantic SEO** | ✗ | Only FAQPage schema; missing LocalBusiness, Service, BreadcrumbList, Organization |
| **8. Content Strategy** | ✗ | No blog, no guides, no lead magnets, no cost content |
| **9. Technical SEO** | ◐ | Good tech stack; missing unique meta tags, hreflang, sitemap, canonical URLs |
| **10. Internal Linking** | ✗ | Nav-only linking; no contextual or cross-service links; modals break the link graph |
| **11. Local SEO** | ◐ | CR + Maps embed present; missing LocalBusiness schema, location pages, GBP integration, wrong Arabic dialect |
| **12. EEAT** | ✗ | Weakest area — no social proof (commented out), no portfolio, no case studies, no guarantees visible |
| **13. Authority** | ✗ | No external signals, no client logo bar, no partnerships or certifications, no backlink-worthy content |
| **14. UX** | ◐ | Beautiful design; scroll fatigue, modals instead of pages, broken contact form, no sticky CTA, no scroll progress |
| **15. CRO** | ✗ | No pricing anchoring, no urgency, no social proof near CTAs, cost unaddressed, generic WhatsApp messages |
| **16. Analytics** | ✗ | No GA4, GTM, or any tracking found |
| **17. Reporting** | ✗ | No data infrastructure to report on |
| **18. Scaling** | ◐ | Static site with JSON data — functional but hard to scale without CMS |

**Score: 4/18 covered (◐ or ✓) — 14/18 have major gaps. Every gap now has at least one recommendation assigned.**

## Priority Order (highest impact first):

1. **EEAT + CRO** → Activate SocialProofSection (2 mins, zero code risk, biggest trust win)
2. **CRO + Content Strategy** → Add cost FAQ + trust line under CTAs (addresses #1 objection)
3. **Semantic SEO** → Add LocalBusiness + Service + BreadcrumbList schema (highest SEO ROI, 1 day of dev)
4. **UX + Functional** → Fix contact form + add sticky CTA + fix service modals (critical user-facing failures)
5. **Technical SEO** → Fix meta titles, hreflang, sitemap, canonical URLs (foundation for organic growth)
6. **Internal Linking** → Add breadcrumbs, related services, cross-links throughout (boosts every page's SEO)
7. **Local SEO** → Create city + service landing pages + fix WhatsApp dialect (best organic growth opportunity)
8. **Keyword + Topic Expansion** → Build intent-targeted pages + add missing sub-services (expands search footprint)
9. **Content Strategy** → Start blog with cost/value guides + authority content (builds backlinks + trust)
10. **Analytics + Reporting** → Install GA4/GTM + set up monthly dashboard (makes everything measurable)
11. **Scaling** → Plan for headless CMS so non-developers can add services and location pages

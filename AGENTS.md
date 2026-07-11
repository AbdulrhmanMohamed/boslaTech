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
2. **No fake stats.** Never use "500+ clients", "4.9/5 rating", "money-back guarantee". Replace with real claims or remove.
3. **No portfolio section.** Skip it. The client doesn't want it.
4. **No team/about bios.** Skip it. The client doesn't want it.
5. **No pricing tables.** The client doesn't want pricing on the site.
6. **Contact form backend.** Leave as-is for now (does `alert()`).
7. **No "we use modern technology" language** — say what you BUILD.

---

## The 18-Layer SEO Framework
*Every decision, every piece of content, every link must serve at least one of these layers.*

### ── Foundation Layers ──

#### 1. Business
**What:** Unify brand, state who you serve, name actual platforms.
- Legal references use "مؤسسة حافة النجوم" / "Hafat Alnjom"
- Brand name use "BOSLA"
- State explicitly: "نساعد الشركات الصغيرة والمتوسطة في السعودية"
- Every service description names the actual platform (WordPress, Shopify, Salla, Zid)

#### 2. Search Intent
**What:** Target what real clients type into Google.
- Every page answers above the fold: "Can you do X? How much? How long?"
- Target transactional intent: "شركة تصميم مواقع في الرياض", "سعر متجر إلكتروني"
- City pages use city name in H1 + title + meta description
- Remove generic tech descriptions → outcome statements

**Three intent types the site must serve:**
| Intent | Example query | How the site handles it |
|--------|---------------|------------------------|
| Transactional | "شركة تصميم مواقع في الرياض" | City page with pricing + CTA |
| Commercial investigation | "شوبيفاي ولا سلة؟" | Blog comparison post |
| Informational | "كم تكلفة تصميم موقع؟" | Blog cost guide |

#### 3. Information Architecture
**Target structure:**
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
│   │   └── E-commerce SEO ← NEW (cross-link to stores)
│   └── Digital Marketing
│       ├── Social Media Marketing
│       ├── Google Ads
│       ├── Snapchat & TikTok Ads
│       ├── Content Marketing
│       ├── Email Marketing
│       └── Brand Identity
├── Blog ← NEW (3 posts minimum)
├── Locations (Riyadh, Jeddah, Dammam, Khobar, Mecca, Medina)
└── Contact
```

**Key changes from current site:**
- Add WordPress Development, Online Stores (rename E-commerce), E-commerce SEO
- Add Blog route
- City pages link to all service pages

#### 4. Keyword Research
**Every page targets ONE primary keyword in title + H1 + meta description:**

| Page | AR Primary Keyword | EN Primary Keyword |
|------|-------------------|--------------------|
| Home | شركة تصميم مواقع في الرياض | Web Design Company Riyadh |
| Services | خدمات تطوير المواقع الإلكترونية | Web Development & SEO Services |
| Custom Websites | تصميم مواقع شركات | Corporate Website Design |
| WordPress Dev | تصميم موقع ووردبريس | WordPress Website Development |
| Online Stores | تصميم متجر إلكتروني | Online Store Development |
| Shopify Stores | تصميم متجر شوبيفاي | Shopify Store Design |
| Salla Stores | تصميم متجر سلة | Salla Store Setup |
| Zid Stores | تصميم متجر زد | Zid Store Development |
| Redesign & Migration | إعادة تصميم موقع قديم | Website Redesign |
| Maintenance | صيانة مواقع إلكترونية | Website Maintenance |
| Technical SEO | تحسين محركات البحث التقني | Technical SEO Services |
| Local SEO | تحسين محركات البحث المحلي | Local SEO Riyadh |
| Content SEO | تحسين محركات البحث بالمحتوى | Content SEO Strategy |
| Link Building | بناء روابط خارجية | Link Building Services |
| SEO Audit | تدقيق وتحليل SEO | SEO Audit |
| E-commerce SEO | تحسين متجر إلكتروني لمحركات البحث | E-commerce SEO |
| Social Media | إدارة وسائل التواصل الاجتماعي | Social Media Management |
| Google Ads | إعلانات جوجل المدفوعة | Google Ads Management |
| Snapchat & TikTok | إعلانات سناب شات وتيك توك | Snapchat & TikTok Ads |
| Content Marketing | تسويق بالمحتوى | Content Marketing |
| Email Marketing | تسويق عبر البريد الإلكتروني | Email Marketing |
| Brand Identity | تصميم هوية بصرية | Brand Identity Design |
| Blog: Cost | كم تكلفة تصميم موقع في السعودية | Website Cost Saudi Arabia |
| Blog: Shopify vs Salla | شوبيفاي ولا سلة | Shopify vs Salla |
| Blog: Salla SEO | تحسين متجر سلة لمحركات البحث | Salla SEO Guide |

#### 5. Topic Discovery
**Complete service inventory — all topics the site MUST cover:**

| Topic | Status (current) | Action |
|-------|-----------------|--------|
| Custom Websites | ✅ Listed but content wrong | Rewrite — remove tech, add outcome |
| WordPress Development | ❌ MISSING | Add as sub-service under Web Dev |
| Shopify Stores | ❌ MISSING | Add under Online Stores |
| Salla Store Setup | ❌ MISSING | Add under Online Stores |
| Zid Store Setup | ❌ MISSING | Add under Online Stores |
| Online Stores (parent) | ✅ Listed as "E-commerce" | Rename to "Online Stores" |
| Website Redesign | ✅ Listed | Rewrite content |
| Maintenance & Support | ✅ Added but content wrong | Rewrite — remove tech, add real scope |
| Mobile App Development | ✅ Added | Keep but rewrite — no Flutter/React Native |
| Technical SEO | ✅ Listed | Rewrite — add Saudi-specific context |
| Local SEO | ✅ Listed | Rewrite |
| Content SEO | ✅ Listed | Rewrite |
| Link Building | ✅ Added | Rewrite |
| SEO Audit | ✅ Added | Rewrite |
| E-commerce SEO | ❌ MISSING | Add — links stores to SEO |
| Social Media Marketing | ✅ Listed | Rewrite |
| Google Ads | ✅ Listed | Rewrite |
| Snapchat & TikTok Ads | ✅ Added | Rewrite |
| Content Marketing | ✅ Listed | Rewrite |
| Email Marketing | ✅ Added | Rewrite |
| Brand Identity | ✅ Added | Rewrite |
| CRM Integration | ❌ MISSING | Add (deferred if needed) |
| GBP Management | ❌ MISSING | Add (deferred) |
| Saudi Hosting & Domain | ❌ MISSING | Add (deferred) |
| CRO | ❌ MISSING | Add under Digital Marketing (deferred) |

#### 6. Topical Mapping
**Each sub-service page lists 3-5 child topics (seeds for future pages):**

**Online Stores topical map:**
```
Online Stores
├── Shopify
│   ├── Shopify store design
│   ├── Shopify SEO optimization
│   ├── Shopify payment gateway (Mada, STC Pay)
│   └── Shopify app integration
├── Salla
│   ├── Salla store setup
│   ├── Salla SEO optimization
│   ├── Salla theme customization
│   └── Salla payment gateway setup
├── Zid
│   ├── Zid store setup
│   ├── Zid SEO optimization
│   └── Zid inventory management
└── Custom E-commerce
    ├── Full custom online store
    ├── Multi-vendor marketplace
    └── Subscription-based store
```

**Web Development topical map:**
```
Web Development
├── Custom Websites (corporate, landing pages, portfolio)
├── WordPress Development (themes, plugins, WooCommerce)
├── Online Stores (Shopify, Salla, Zid, custom)
├── Redesign & Migration (performance, SEO-preserving, platform migration)
└── Maintenance & Support (security, updates, content, monitoring)
```

**SEO topical map:**
```
SEO
├── Technical SEO (speed, core web vitals, crawl, index)
├── E-commerce SEO (product pages, categories, reviews, schema)
├── Local SEO (GBP, citations, city pages, NAP)
├── Content SEO (blog, keyword research, topical authority)
├── Link Building (GCC backlinks, guest posts, digital PR)
└── SEO Audit (technical, on-page, off-page, competitor)
```

**Rule:** Every sub-service must name 3+ child topics on its detail page as "related topics we also cover".

#### 7. Semantic SEO
**Schema checklist:**

| Schema | Location | Status |
|--------|----------|--------|
| LocalBusiness | Layout `<head>` | ✅ Verified present |
| Service | Each sub-service page | ✅ Verified present |
| BreadcrumbList | Category + sub-service pages | ✅ Verified present |
| Organization | Layout `<head>` | ❌ ADD — include logo, sameAs (social), taxID |
| Article | Blog posts | ❌ ADD when blog is created |
| FAQPage | Sub-service pages w/ FAQ | ❌ ADD on pages with FAQ |
| Review | Any page | ❌ Skip — no testimonials |

**Entity relationship (must be connected in schema):**
```
LocalBusiness (مؤسسة حافة النجوم)
  ├── Service (Web Development)
  │   ├── Service (Custom Websites)
  │   ├── Service (WordPress Development)
  │   ├── Service (Online Stores)
  │   │   ├── Service (Shopify Stores)
  │   │   ├── Service (Salla Stores)
  │   │   └── Service (Zid Stores)
  │   ├── Service (Redesign & Migration)
  │   └── Service (Maintenance & Support)
  ├── Service (SEO)
  │   ├── Service (Technical SEO)
  │   ├── Service (Local SEO)
  │   ├── Service (Content SEO)
  │   ├── Service (Link Building)
  │   ├── Service (SEO Audit)
  │   └── Service (E-commerce SEO) ← cross-entity link
  └── Service (Digital Marketing)
      ├── Service (Social Media Marketing)
      └── ...
```

#### 8. Content Strategy
**Blog is NOT deferred. Minimum 3 posts before launch:**

| # | Title | Target Query | URL | Links to | Schema |
|---|-------|-------------|-----|----------|--------|
| 1 | كم تكلفة تصميم موقع إلكتروني في السعودية 2026؟ | كم تكلفة تصميم موقع | /blog/website-cost-saudi-arabia | Custom Websites, Online Stores, Contact | Article |
| 2 | شوبيفاي ولا سلة؟ مقارنة كاملة للشركات الناشئة | شوبيفاي ولا سلة | /blog/shopify-vs-salla | Shopify Stores, Salla Stores, E-commerce SEO | Article |
| 3 | دليل تحسين متجر سلة لمحركات البحث 2026 | تحسين متجر سلة | /blog/salla-seo-guide | Salla Stores, E-commerce SEO, Technical SEO | Article + FAQPage |

**Content rules:**
- Each post answers one real client question with practical value
- Each post links to 2+ relevant service pages (Layer 10)
- URLs use English transliteration (cleaner for sitemaps)
- Posts demonstrate platform expertise (Shopify Liquid, Salla API, WooCommerce)

### ── Technical Layers ──

#### 9. Technical SEO
- Canonical URLs ✅
- Hreflang tags ✅
- XML sitemap ✅ (update after Phase A to include new slug names)
- GTM ID is placeholder `GTM-XXXXXXX` — needs real ID
- Meta titles — VERIFY every page uses keyword-specific titles from Layer 4 table

#### 10. Internal Linking
**Every sub-service page must have 2+ contextual cross-links to related services.**
Links placed naturally in the content paragraph, not in a separate block.

**Cross-link map (mandatory):**

| Page | Link 1 | Link 2 |
|------|--------|--------|
| WordPress Development | "→ تحتاج SEO لموقع ووردبريس؟" → Technical SEO | "→ ننصح بهوية بصرية متكاملة" → Brand Identity |
| Shopify Stores | "→ تحتاج متجرك يظهر في جوجل؟" → E-commerce SEO | "→ نضيف بوابات دفع سعودية" → Contact |
| Salla Stores | "→ حسّن متجر سلة لمحركات البحث" → E-commerce SEO | "→ أضف إعلانات سناب شات" → Snapchat Ads |
| Custom Websites | "→ نبني موقعك على ووردبريس" → WordPress Dev | "→ نضمن ظهورك في بحث جوجل" → Local SEO |
| Technical SEO | "→ موقعك بطيء؟ نعيد تصميمه" → Redesign & Migration | "→ ابدأ بتحليل شامل" → SEO Audit |
| Local SEO | "→ نبني موقع متوافق مع SEO" → Custom Websites | "→ ندير إعلانات جوجل المحلية" → Google Ads |
| E-commerce SEO | "→ نبني متجر شوبيفاي" → Shopify Stores | "→ ننشئ متجر على سلة" → Salla Stores |
| Snapchat Ads | "→ حملتك تحتاج موقع هبوط؟" → Custom Websites | "→ نحلل أداء الإعلانات" → Google Ads |
| Brand Identity | "→ هويتك تحتاج موقعاً يعكسها" → Custom Websites | "→ نروج هويتك على سناب شات" → Snapchat Ads |

**Additional linking rules:**
- Blog posts link to service pages they reference
- City pages link to every service page available in that city
- Every page links to Contact or WhatsApp CTA within scroll distance

### ── Local & Trust Layers ──

#### 11. Local SEO
**City pages with real local content (not generic).**

| City | Keyword Target | Local Context | Business Focus |
|------|---------------|---------------|----------------|
| Riyadh | شركة تصميم مواقع في الرياض | العاصمة، حي الملز، العليا، السفارات | شركات، مؤسسات، قطاع حكومي |
| Jeddah | شركة تصميم مواقع في جدة | العاصمة التجارية، البلد، الشاطئ | تجارة، سياحة، شحن |
| Dammam | شركة تصميم مواقع في الدمام | عاصمة الشرقية | صناعة، نفط، لوجستيات |
| Khobar | شركة تصميم مواقع في الخبر | العقربية، طريق الملك فهد | خدمات، عقارات |
| Mecca | شركة تصميم مواقع في مكة | مدينة مقدسة | ضيافة، فنادق، تجارة موسمية |
| Medina | شركة تصميم مواقع في المدينة | مدينة رسول الله | سياحة دينية، ضيافة |

**Every city page must:**
1. Use city name in H1 + title + meta description
2. Mention 2-3 local districts/business areas
3. Describe the local market context
4. Link to all 3 service categories + relevant sub-services
5. Include NAP consistent with main site

**Other Local SEO:**
- GBP link on contact page (verify if GBP exists or add placeholder)
- NAP consistent everywhere ✅
- LocalBusiness schema ✅

#### 12. EEAT (Experience, Expertise, Authority, Trust)
**The weakest area. Critical fixes:**

**Remove all fake stats:**
| Location | Current (REMOVE) | Replacement |
|----------|-----------------|-------------|
| Hero trust line | "4.9/5 · 500+ clients" | Remove or replace with "نخدم شركات في الرياض وجدة والدمام" |
| Service CTA trust line | "4.9/5 · 500+ · 30-day guarantee" | Remove entirely |
| SocialProofSection stats | "500+ clients, 98% satisfaction" | Comment out until real data exists |
| FAQ cost answer | Mentions 500+ clients | Remove that line |

**Add real EEAT signals:**
- Service descriptions name real platforms (Shopify Liquid, Salla API, WooCommerce) — shows expertise
- CR number visible ✅
- Client logo bar — extract logos from 3D scene, display as marquee on homepage (even without names)
- Partnership badges — if Salla/Shopify partner, display

#### 13. Authority
- Client logo bar (extract from 3D scene, display statically)
- Partnership badges (Salla partner, Shopify partner if applicable)
- Blog content positions as expert

### ── Conversion & Growth Layers ──

#### 14. UX
- Remove fake trust lines ← they make the site look like a template
- Replace technology names with client benefits
- Scroll progress bar ✅
- Sticky CTA ✅
- Breadcrumbs ✅

#### 15. CRO (Conversion Rate Optimization)
**Per-service cost FAQ with REAL price ranges.**

Each category gets its own cost question:

| Category | AR FAQ Question | Price Range (SAR) |
|----------|----------------|-------------------|
| Custom Websites | كم تكلفة تصميم موقع شركة؟ | 1,000 — 3,000 |
| WordPress Development | كم تكلفة تصميم موقع ووردبريس؟ | 1,000 — 2,500 |
| Online Stores | كم تكلفة تصميم متجر إلكتروني؟ | 2,000 — 5,000 |
| Shopify Stores | كم تكلفة تصميم متجر شوبيفاي؟ | 2,000 — 4,000 |
| Salla Stores | كم تكلفة تصميم متجر سلة؟ | 1,500 — 3,000 |
| SEO Services | كم تكلفة تحسين محركات البحث؟ | 1,500 — 4,000 ريال شهرياً |
| Social Media | كم تكلفة إدارة وسائل التواصل؟ | 1,000 — 3,000 ريال شهرياً |

**Other CRO:**
- WhatsApp CTA pre-fills service name ✅
- Free consultation offer on every page
- Delivery timeline on every service card ✅

#### 16. Analytics
- GTM placeholder `GTM-XXXXXXX` — client must replace with real ID
- Future: track page views, WhatsApp clicks, CTA clicks

#### 17. Reporting
- Connect GA4 → Looker Studio after analytics is live
- Monthly: traffic, leads, top pages

#### 18. Scaling
- JSON is fine now (16 sub-services, 6 cities)
- When content >50 pages → migrate to Strapi/Sanity
- Blog + location pages are the growth drivers

---

## Content Voice Guide

- **Arabic:** Formal Saudi Arabic. No Egyptian dialect. Professional but warm.
- **English:** Professional, direct, outcome-focused.
- **BAD:** "نستخدم أحدث التقنيات مثل SvelteKit وTailwind CSS لبناء مواقع سريعة وآمنة"
- **GOOD:** "نبني متاجر شوبيفاي متكاملة مع بوابات الدفع السعودية (مدى، STC Pay)"
- **BAD:** "We build fast, secure, SEO-friendly websites using modern technology"
- **GOOD:** "We create Shopify stores with Saudi payment gateways, WordPress websites with WooCommerce, and custom Salla integrations"

**Golden rule:** If the description would make sense for any agency in the world, it's too generic. You must name specific platforms, Saudi-specific features, and local market knowledge.

---

## Execution Phases (Dependency Order)

| Phase | What | Layers Served | Depends On |
|-------|------|---------------|------------|
| **A** | Rewrite all service data — remove tech names + fake stats, add real platforms (WordPress, Shopify, Salla, Zid, E-commerce SEO), per-service cost FAQ | 1, 2, 5, 12, 14, 15 | — |
| **B** | Add contextual cross-links in every service description | 10 | Phase A (content must exist) |
| **C** | Remove fake stats from CTA trust lines + homepage | 12, 14 | Phase A |
| **D** | Blog — 3 posts with Article schema + internal links | 4, 7, 8, 10, 12, 13 | Phase A (links to services) |
| **E** | Rewrite city pages with real local content | 2, 4, 10, 11 | Phase A (links to services) |
| **F** | Schema — Organization + FAQPage per sub-service | 7 | Phase A (service names finalized) |
| **G** | Technical cleanup — meta titles audit, GBP link | 9, 11 | All phases |

**Commit naming:** `Phase X: Layer N — Description`
Example: `Phase A: Layer 1,2,5 — Rewrite services data with real platforms, remove tech names and fake stats`

**Rollback:** `git revert <commit>` for any single phase. `git reset abf3807 --hard` for full revert.

---

## Files Checklist
- `services.i18n.json` — main content file (rewrite in Phase A)
- `+page.svelte` for each sub-service — auto-generated ✅
- `+layout.svelte` — schema, GTM, scroll bar ✅
- `Breadcrumbs.svelte` — component ✅
- City page `+page.svelte` — rewrite in Phase E
- Blog route — create in Phase D
- `sitemap.xml` — update after phases
- `svelte.config.js` — update prerender entries

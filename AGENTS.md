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

## Current Site State (What Exists)

### Pages Built
| Route | Status | Notes |
|-------|--------|-------|
| `/` (Home) | ✅ Built | Hero, services grid, CTA, social proof |
| `/about` | ✅ Built | Company info |
| `/services` | ✅ Built | 3 category cards + 5-step process |
| `/services/[slug]` | ✅ Built | Category page with items grid |
| `/services/[slug]/[subslug]` | ✅ Built | Detail page with features, topics, cross-links |
| `/blog` | ✅ Built | Blog listing |
| `/blog/[slug]` | ✅ Built | Blog post detail |
| `/locations/[city]` | ✅ Built | 6 city pages (Riyadh, Jeddah, Dammam, Khobar, Mecca, Medina) |
| `/contact` | ✅ Built | Contact form (client-side only) |
| `/portfolio` | ✅ Built | Exists but should be removed per sacred rules |

### Content Data Files
| File | Status | Notes |
|------|--------|-------|
| `services.i18n.json` | ✅ Built | 17 sub-services × 2 languages, with topics, features, cross-links |
| `blog.i18n.json` | ✅ Built | 3 posts × 2 languages |
| `cities.i18n.json` | ✅ Built | 6 cities × 2 languages |

### Components Built
| Component | Status | Notes |
|-----------|--------|-------|
| `Header.svelte` | ✅ Built | Desktop mega-menu with categories, groups, popular badges |
| `DrawerPanel.svelte` | ✅ Built | Mobile drawer with expandable services |
| `Breadcrumbs.svelte` | ✅ Built | RTL-aware breadcrumb navigation |
| `HeroBackground.svelte` | ✅ Built | 3D raycast animation |
| `CtaSection.svelte` | ✅ Built | WhatsApp CTA |
| `ThemeToggle.svelte` | ✅ Built | Dark/light mode |
| `SocialProofSection.svelte` | ✅ Built | Stats (FAKE — needs removal) |

### Schema Implemented
| Schema | Status | Location |
|--------|--------|----------|
| LocalBusiness | ✅ | `+layout.svelte` |
| Service | ✅ | Each sub-service page |
| BreadcrumbList | ✅ | Category + sub-service pages |
| Article | ✅ | Blog post pages |
| Organization | ❌ | Not implemented |
| FAQPage | ❌ | Not implemented |
| FAQ | ❌ | No FAQ sections on pages |

---

## Gap Analysis: Current Build vs seo-template.md

### Critical Gaps (Must Fix)

#### 1. Mega-Menu Shows Flat Links, Not Topical Authority
**Current:** 3 columns → category name → flat list of service links grouped by "Build/Improve", "Foundation/Content & Links", "Ads/Engage".

**Required per seo-template.md Section 6.1:**
The mega-menu must visually communicate the topical hierarchy:
- Which service is the **pillar** vs a **spoke**
- What **child topics** exist under each service
- The **relationships** between services (e.g., "Shopify Store" → "E-commerce SEO" → "Product Page Optimization")
- **Entry hooks** (free audit, cost calculator, consultation)

**What the mega-menu should look like:**
```
Web Development (Pillar)
├── Custom Websites
│   ├── Landing Page Design
│   ├── Corporate Sites
│   └── Portfolio Sites
├── WordPress
│   ├── WooCommerce Setup
│   ├── Theme Development
│   └── Plugin Integration
├── Online Stores
│   ├── Shopify Setup
│   ├── Salla Setup
│   └── Zid Setup
├── Redesign & Migration
└── Maintenance & Support

SEO (Pillar)
├── Technical SEO → Core Web Vitals, Schema, Site Speed
├── Local SEO → GBP, Citations, City Pages
├── Content SEO → Keywords, Blog Strategy, On-Page
├── E-commerce SEO → Product Pages, Categories, Shopping Feed
├── Link Building → Guest Posts, Digital PR
└── SEO Audit → Free Audit CTA

Digital Marketing (Pillar)
├── Google Ads → Search, Display, Shopping
├── Social Media → Instagram, Snapchat, TikTok
├── Content Marketing → Blog, Video, Infographics
└── Email Marketing → Sequences, Campaigns

[Free SEO Audit] [Cost Calculator] [Book Consultation]
```

#### 2. No Pillar Pages
**Current:** Service category pages exist (`/services/web-development`) but they're just link lists, not true pillar pages.

**Required per seo-template.md Section 8.1:**
Pillar pages anchor topical clusters. Each pillar should:
- Define the topic comprehensively (2000+ words)
- Link to all sub-topic pages
- Include FAQ section with FAQPage schema
- Target the head keyword (e.g., "تطوير المواقع الإلكترونية")
- Be the hub in the hub-and-spoke model

**Missing pillar pages:**
- `/guides/web-development` — Pillar for all web dev content
- `/guides/seo` — Pillar for all SEO content
- `/guides/digital-marketing` — Pillar for all marketing content

#### 3. Blog Content Is Generic, Not Problem-Solving
**Current:** 3 posts — cost guide, platform comparison, SEO guide. They answer generic questions.

**Required per seo-template.md Section 8.2:**
- 5-10 posts across topic clusters in first 3 months
- Content ratio: 40% educational, 25% comparisons, 15% case studies, 10% news, 10% feature
- Each post must solve a specific problem, not just overview a topic

**Current ratio:** 100% informational. Zero comparison pages. Zero case studies.

**What's wrong with current blogs:**
- "How Much Does a Website Cost?" → Generic overview, no specific solution
- "Shopify vs Salla" → Feature list comparison, not experience-based
- "Salla SEO Guide" → Checklist format, no real implementation details

**What blogs should be:**
- "Why Your Salla Store Isn't Ranking on Google (And How to Fix It)" → Problem + solution
- "We Built 20 Shopify Stores — Here's What Actually Converts" → Experience + data
- "The SEO Mistake That's Costing Saudi E-commerce Stores Thousands" → Problem + urgency

#### 4. No Comparison Pages
**Current:** Zero comparison pages.

**Required per seo-template.md Section 8.1:**
Comparison pages capture commercial investigation intent. Missing:
- Shopify vs Salla vs Zid (detailed comparison page)
- WordPress vs Custom Build
- SEO Agency vs In-House Team
- Google Ads vs Social Media Ads

#### 5. No Case Studies
**Current:** Zero case studies.

**Required per seo-template.md Section 12.1:**
Case studies are critical for EEAT (Experience signal). Need:
- 3+ real projects with before/after
- Real project photos (not stock)
- Client testimonials with names/photos
- Specific metrics (traffic increase, conversion improvement)

#### 6. No Content Tiers (Entry/Core/Premium)
**Current:** All services presented at the same level.

**Required per seo-template.md Section 1.1:**
```
Tier 1 — Entry Hook: [freemium, diagnostic, low-cost offer]
Tier 2 — Core Offering: [main product/service]
Tier 3 — Premium Upsell: [high-value add-on]
```

**What's missing:**
- No "Free SEO Audit" as entry hook
- No "Cost Calculator" as entry hook
- No clear upgrade path from basic to premium services
- No "Most Popular" or "Recommended" labels on service cards

#### 7. Internal Links Are Ad-Hoc, Not Strategic
**Current:** Inline `<a>` tags in service descriptions.

**Required per seo-template.md Section 10:**
A structured linking matrix:
| Page | Incoming From | Outgoing To | Anchor Strategy |
|------|---------------|-------------|-----------------|
| Homepage | — | All key services | Branded |
| Service Page | Homepage, blog posts | Location, FAQ, related | Partial match |
| Blog Post | Service pages, posts | Service pages, posts | Contextual |
| Location Page | Service page, homepage | Service page, contact | Location-based |

**What's missing:**
- Blog posts don't link back to service pages consistently
- Location pages don't link to individual sub-services
- No "Related Services" section on detail pages
- No "Related Blog Posts" section on blog posts
- No contextual linking from city pages to specific services

#### 8. No FAQ Sections
**Current:** No FAQ sections on any page.

**Required per seo-template.md Section 9.5:**
FAQPage schema on pages with FAQ sections. Every service page should have:
- 3-5 common questions
- Detailed answers
- FAQPage schema for rich snippets

---

### Medium Gaps (Should Fix)

#### 9. No Industry-Specific Pages
**Current:** No pages targeting specific industries.

**Required per seo-template.md Section 4.2:**
Industry pages capture niche traffic:
- `/industries/ecommerce` — E-commerce website solutions
- `/industries/healthcare` — Medical clinic websites
- `/industries/real-estate` — Property listing websites
- `/industries/restaurants` — Restaurant ordering websites

#### 10. No Downloadable Resources
**Current:** No lead magnets.

**Required per seo-template.md Section 15 Phase 3:**
- SEO checklist PDF
- E-commerce platform comparison guide
- Website cost calculator (interactive)

#### 11. Author Bios Missing
**Current:** Blog posts show "BOSLA Team" as author.

**Required per seo-template.md Section 12.2:**
- Author bio for every content creator
- Professional certifications displayed
- Academic qualifications mentioned

#### 12. No Testimonials
**Current:** Fake stats only ("500+ clients").

**Required per seo-template.md Section 12.1:**
- Real client testimonials with names/photos
- Specific project descriptions
- Measurable results

---

### Lower Gaps (Nice to Have)

#### 13. No Pricing Page
**Current:** No pricing page (per sacred rules, no pricing tables).

**Note:** Sacred rules say no pricing tables. However, the seo-template expects a pricing page. Consider a "Pricing Guide" page that explains pricing ranges without specific numbers.

#### 14. No Interactive Tools
**Current:** No calculators or tools.

**Nice to have:**
- Cost calculator
- SEO audit tool
- Platform selector quiz

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
**Current structure:**
```
Home
├── About
├── Services (index)
│   ├── Web Development (category)
│   │   ├── Custom Websites (detail)
│   │   ├── WordPress Development (detail)
│   │   ├── Online Stores (detail)
│   │   ├── Redesign & Migration (detail)
│   │   └── Maintenance & Support (detail)
│   ├── SEO (category)
│   │   ├── Technical SEO (detail)
│   │   ├── Local SEO (detail)
│   │   ├── Content SEO (detail)
│   │   ├── Link Building (detail)
│   │   ├── SEO Audit (detail)
│   │   └── E-commerce SEO (detail)
│   └── Digital Marketing (category)
│       ├── Social Media Marketing (detail)
│       ├── Google Ads (detail)
│       ├── Snapchat & TikTok Ads (detail)
│       ├── Content Marketing (detail)
│       ├── Email Marketing (detail)
│       └── Brand Identity (detail)
├── Blog (3 posts)
├── Locations (6 cities)
├── Contact
└── Portfolio (SHOULD BE REMOVED)
```

**Missing from target structure:**
- ❌ Pillar pages (`/guides/web-development`, `/guides/seo`, `/guides/digital-marketing`)
- ❌ Comparison pages
- ❌ Case studies
- ❌ Industry pages
- ❌ FAQ page
- ❌ Downloadable resources
- ❌ Portfolio (exists but should be removed)

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

| Topic | Status | Action |
|-------|--------|--------|
| Custom Websites | ✅ Built | Keep — add pillar page |
| WordPress Development | ✅ Built | Keep — add pillar page |
| Shopify Stores | ✅ Built | Keep — add comparison page |
| Salla Store Setup | ✅ Built | Keep — add comparison page |
| Zid Store Setup | ✅ Built | Keep — add comparison page |
| Online Stores (parent) | ✅ Built | Keep — add pillar page |
| Website Redesign | ✅ Built | Keep |
| Maintenance & Support | ✅ Built | Keep |
| Technical SEO | ✅ Built | Keep — add pillar page |
| Local SEO | ✅ Built | Keep — add pillar page |
| Content SEO | ✅ Built | Keep — add pillar page |
| Link Building | ✅ Built | Keep |
| SEO Audit | ✅ Built | Keep — add "Free Audit" entry hook |
| E-commerce SEO | ✅ Built | Keep — add pillar page |
| Social Media Marketing | ✅ Built | Keep |
| Google Ads | ✅ Built | Keep |
| Snapchat & TikTok Ads | ✅ Built | Keep |
| Content Marketing | ✅ Built | Keep |
| Email Marketing | ✅ Built | Keep |
| Brand Identity | ✅ Built | Keep |
| CRM Integration | ❌ MISSING | Add (deferred) |
| GBP Management | ❌ MISSING | Add (deferred) |
| Saudi Hosting & Domain | ❌ MISSING | Add (deferred) |
| CRO | ❌ MISSING | Add (deferred) |

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

**Rule:** Every sub-service must name 3+ child topics on its detail page as "related topics we also cover". ✅ DONE

#### 7. Semantic SEO
**Schema checklist:**

| Schema | Location | Status |
|--------|----------|--------|
| LocalBusiness | Layout `<head>` | ✅ Verified present |
| Service | Each sub-service page | ✅ Verified present |
| BreadcrumbList | Category + sub-service pages | ✅ Verified present |
| Article | Blog posts | ✅ Verified present |
| Organization | Layout `<head>` | ❌ ADD — include logo, sameAs (social), taxID |
| FAQPage | Sub-service pages w/ FAQ | ❌ ADD — no FAQ sections exist |
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
**Current blog posts (3 total):**

| # | Title | Target Query | Status |
|---|-------|-------------|--------|
| 1 | كم تكلفة تصميم موقع إلكتروني في السعودية 2026؟ | كم تكلفة تصميم موقع | ✅ Built — generic overview |
| 2 | شوبيفاي ولا سلة؟ مقارنة كاملة للشركات الناشئة | شوبيفاي ولا سلة | ✅ Built — feature comparison |
| 3 | دليل تحسين متجر سلة لمحركات البحث 2026 | تحسين متجر سلة | ✅ Built — checklist format |

**Content rules:**
- Each post answers one real client question with practical value
- Each post links to 2+ relevant service pages (Layer 10)
- URLs use English transliteration (cleaner for sitemaps)
- Posts demonstrate platform expertise (Shopify Liquid, Salla API, WooCommerce)

### ── Technical Layers ──

#### 9. Technical SEO
- Canonical URLs ✅
- Hreflang tags ✅
- XML sitemap ✅
- GTM ID is placeholder `GTM-XXXXXXX` — needs real ID
- Meta titles — VERIFY every page uses keyword-specific titles from Layer 4 table

#### 10. Internal Linking
**Every sub-service page must have 2+ contextual cross-links to related services.** ✅ DONE

**Cross-link map (mandatory):**

| Page | Link 1 | Link 2 |
|------|--------|--------|
| WordPress Development | → Technical SEO | → Brand Identity |
| Shopify Stores | → E-commerce SEO | → Contact |
| Salla Stores | → E-commerce SEO | → Snapchat Ads |
| Custom Websites | → WordPress Dev | → Local SEO |
| Technical SEO | → Redesign & Migration | → SEO Audit |
| Local SEO | → Custom Websites | → Google Ads |
| E-commerce SEO | → Shopify Stores | → Salla Stores |
| Snapchat Ads | → Custom Websites | → Google Ads |
| Brand Identity | → Custom Websites | → Snapchat Ads |

**Additional linking rules:**
- Blog posts link to service pages they reference ✅
- City pages link to every service page available in that city ✅
- Every page links to Contact or WhatsApp CTA within scroll distance ✅

### ── Local & Trust Layers ──

#### 11. Local SEO
**City pages with real local content (not generic).** ✅ DONE

| City | Keyword Target | Status |
|------|---------------|--------|
| Riyadh | شركة تصميم مواقع في الرياض | ✅ Built |
| Jeddah | شركة تصميم مواقع في جدة | ✅ Built |
| Dammam | شركة تصميم مواقع في الدمام | ✅ Built |
| Khobar | شركة تصميم مواقع في الخبر | ✅ Built |
| Mecca | شركة تصميم مواقع في مكة | ✅ Built |
| Medina | شركة تصميم مواقع في المدينة | ✅ Built |

**Every city page must:**
1. Use city name in H1 + title + meta description ✅
2. Mention 2-3 local districts/business areas ✅
3. Describe the local market context ✅
4. Link to all 3 service categories + relevant sub-services ✅
5. Include NAP consistent with main site ✅

**Other Local SEO:**
- GBP link on contact page (verify if GBP exists or add placeholder) ✅
- NAP consistent everywhere ✅
- LocalBusiness schema ✅

#### 12. EEAT (Experience, Expertise, Authority, Trust)
**The weakest area. Critical fixes:**

**Remove all fake stats:** ✅ DONE
- Hero trust line: "4.9/5 · 500+ clients" → Removed
- Service CTA trust line: "4.9/5 · 500+ · 30-day guarantee" → Removed
- SocialProofSection stats: "500+ clients, 98% satisfaction" → Still exists in component

**Add real EEAT signals:**
- Service descriptions name real platforms ✅
- CR number visible ✅
- Client logo bar — ❌ NOT DONE
- Partnership badges — ❌ NOT DONE
- Author bios — ❌ NOT DONE
- Case studies — ❌ NOT DONE
- Testimonials — ❌ NOT DONE

#### 13. Authority
- Client logo bar — ❌ NOT DONE
- Partnership badges — ❌ NOT DONE
- Blog content positions as expert — ⚠️ Partial (rewritten but generic)

### ── Conversion & Growth Layers ──

#### 14. UX
- Remove fake trust lines ✅
- Replace technology names with client benefits ✅
- Scroll progress bar ✅
- Sticky CTA ✅
- Breadcrumbs ✅

#### 15. CRO (Conversion Rate Optimization)
**Per-service cost FAQ with REAL price ranges.** ✅ DONE

| Category | Price Range (SAR) | Status |
|----------|-------------------|--------|
| Custom Websites | 1,000 — 3,000 | ✅ |
| WordPress Development | 1,000 — 2,500 | ✅ |
| Online Stores | 2,000 — 5,000 | ✅ |
| Shopify Stores | 2,000 — 4,000 | ✅ |
| Salla Stores | 1,500 — 3,000 | ✅ |
| SEO Services | 1,500 — 4,000/month | ✅ |
| Social Media | 1,000 — 3,000/month | ✅ |

**Other CRO:**
- WhatsApp CTA pre-fills service name ✅
- Free consultation offer on every page ✅
- Delivery timeline on every service card ✅
- Entry hook (Free Audit) — ❌ NOT DONE
- Cost Calculator — ❌ NOT DONE

#### 16. Analytics
- GTM placeholder `GTM-XXXXXXX` — client must replace with real ID
- Future: track page views, WhatsApp clicks, CTA clicks

#### 17. Reporting
- Connect GA4 → Looker Studio after analytics is live
- Monthly: traffic, leads, top pages

#### 18. Scaling
- JSON is fine now (17 sub-services, 6 cities, 3 blog posts)
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

### Completed Phases
| Phase | What | Layers Served | Status |
|-------|------|---------------|--------|
| **A** | Rewrite all service data — remove tech names + fake stats, add real platforms | 1, 2, 5, 12, 14, 15 | ✅ DONE |
| **B** | Add contextual cross-links in every service description | 10 | ✅ DONE |
| **C** | Remove fake stats from CTA trust lines + homepage | 12, 14 | ✅ DONE |
| **D** | Blog — 3 posts with Article schema + internal links | 4, 7, 8, 10, 12, 13 | ✅ DONE |
| **E** | Rewrite city pages with real local content | 2, 4, 10, 11 | ✅ DONE |
| **F** | Schema — Organization + FAQPage per sub-service | 7 | ⚠️ Partial (Organization missing) |
| **G** | Technical cleanup — meta titles audit, GBP link | 9, 11 | ✅ DONE |
| **H** | Redesign mega-menu with category descriptions, intent grouping, popular badges | 3, 6, 14 | ✅ DONE |
| **I** | Rewrite blog posts with expert experience-based content | 4, 8, 12, 13 | ✅ DONE |
| **J** | Add child topics section to all 17 service detail pages | 6 | ✅ DONE |

### Pending Phases (Must Do)
| Phase | What | Layers Served | Priority |
|-------|------|---------------|----------|
| **K** | Redesign mega-menu to show topical hierarchy (pillar → spoke → child topics) | 3, 6 | HIGH |
| **L** | Create 3 pillar pages (`/guides/web-development`, `/guides/seo`, `/guides/digital-marketing`) | 3, 6, 8 | HIGH |
| **M** | Add FAQ sections to all service pages + FAQPage schema | 7, 15 | HIGH |
| **N** | Create comparison pages (Shopify vs Salla vs Zid, WordPress vs Custom) | 2, 4, 8 | MEDIUM |
| **O** | Create 3 case studies with before/after | 12, 13 | MEDIUM |
| **P** | Add entry hooks (Free SEO Audit page, Cost Calculator) | 15 | MEDIUM |
| **Q** | Add Organization schema to layout | 7 | LOW |
| **R** | Remove portfolio page (sacred rule) | — | LOW |
| **S** | Remove SocialProofSection fake stats | 12 | LOW |

### Future Phases (Nice to Have)
| Phase | What | Layers Served | Priority |
|-------|------|---------------|----------|
| **T** | Create industry-specific pages | 2, 4 | LOW |
| **U** | Add downloadable resources (SEO checklist, platform guide) | 13 | LOW |
| **V** | Add author bios to blog posts | 12 | LOW |
| **W** | Create client testimonials section | 12, 13 | LOW |

---

## Files Checklist

### Content Files
- `services.i18n.json` — 17 sub-services × 2 languages ✅
- `blog.i18n.json` — 3 posts × 2 languages ✅
- `cities.i18n.json` — 6 cities × 2 languages ✅

### Routes
- `/` — Homepage ✅
- `/about` — About page ✅
- `/services` — Services listing ✅
- `/services/[slug]` — Category page ✅
- `/services/[slug]/[subslug]` — Detail page ✅
- `/blog` — Blog listing ✅
- `/blog/[slug]` — Blog post ✅
- `/locations/[city]` — City page ✅
- `/contact` — Contact page ✅
- `/portfolio` — SHOULD BE REMOVED ❌

### Components
- `Header.svelte` — Desktop mega-menu ✅ (needs topical hierarchy redesign)
- `DrawerPanel.svelte` — Mobile drawer ✅ (needs topical hierarchy redesign)
- `Breadcrumbs.svelte` — RTL breadcrumb ✅
- `HeroBackground.svelte` — 3D raycast ✅
- `CtaSection.svelte` — WhatsApp CTA ✅
- `ThemeToggle.svelte` — Dark/light mode ✅
- `SocialProofSection.svelte` — Stats (FAKE — needs removal) ❌

### Schema
- LocalBusiness — `+layout.svelte` ✅
- Service — Each sub-service page ✅
- BreadcrumbList — Category + sub-service pages ✅
- Article — Blog post pages ✅
- Organization — NOT IMPLEMENTED ❌
- FAQPage — NOT IMPLEMENTED ❌

---

## Pre-Publishing Checklist (Every New Page)

- [ ] Intent matches keyword
- [ ] Primary entity in first 100 words
- [ ] Secondary entities mentioned naturally
- [ ] All expected questions answered
- [ ] 3+ internal links
- [ ] Structured data installed
- [ ] Meta title + description optimized
- [ ] Clean, descriptive URL
- [ ] H1 clear with primary entity
- [ ] Heading hierarchy correct (H1 → H2 → H3)
- [ ] Images optimized (Alt, size, format WebP/AVIF)
- [ ] Core Web Vitals pass
- [ ] Mobile-friendly
- [ ] Clear CTA
- [ ] No duplicate content
- [ ] Canonical tag correct
- [ ] Indexing allowed (meta robots = index, follow)

## Post-Publishing Checklist

- [ ] Request indexing via GSC URL Inspection
- [ ] Confirm indexing after 24-48h
- [ ] Add internal links from existing pages
- [ ] Add to sitemap (if manual)
- [ ] Add to rank tracker
- [ ] Monitor performance for 2 weeks
- [ ] Analyze: impressions, clicks, CTR, avg position
- [ ] Refresh content if performance is weak

---

## Commit Naming Convention
`Phase X: Layer N — Description`
Example: `Phase A: Layer 1,2,5 — Rewrite services data with real platforms, remove tech names and fake stats`

**Rollback:** `git revert <commit>` for any single phase. `git reset abf3807 --hard` for full revert.

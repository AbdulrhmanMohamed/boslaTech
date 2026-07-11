# SEO Strategy — Hafat Alnjom / BOSLA
## 18-Layer Framework Applied

**Business:** مؤسسة حافة النجوم (Hafat Alnjom) — CR 7050568158, Riyadh
**What you actually do:** Build websites (WordPress, Shopify, Salla, custom), SEO services, digital marketing
**Who you serve:** Saudi SMEs, e-commerce brands, service businesses in Riyadh + KSA
**Current site problem:** Looks like a template with fake stats, technology-focused instead of client-focused

---

## 1. Business

**Current state:** Fragmented identity — BOSLA in code, Hafat Alnjom in header, Orcado was in about page (fixed). No industry focus, no client profile.

**What needs to happen:**
- **Unify brand voice** — "مؤسسة حافة النجوم" is the legal name (CR). Use it consistently. BOSLA can be the brand/short name but every legal reference (contact, about, footer) uses the registered name
- **State who you serve explicitly** — "نساعد الشركات الصغيرة والمتوسطة في السعودية" / "We help Saudi SMEs build their digital presence"
- **State what you actually build** — Not "modern technology solutions" but "متاجر إلكترونية، مواقع ووردبريس، متاجر شوبيفاي وسلة"
- **Remove vagueness** — Every service description must name the actual platform (WordPress, Shopify, Salla) not the framework (SvelteKit, Tailwind)

---

## 2. Search Intent

**Current state:** Pages target broad terms like "Web Development" — impossibly competitive, no transactional intent.

**The 3 intent types and what they mean for this site:**

| Intent | What client types | We need a page for |
|--------|------------------|--------------------|
| **Transactional** | "شركة تصميم مواقع في الرياض", "سعر متجر إلكتروني" | Cost FAQ per service, city pages, WhatsApp CTA |
| **Commercial investigation** | "شوبيفاي ولا سلة؟", "WordPress vs custom" | Comparison content, service detail pages |
| **Informational** | "كيف أسوي متجر إلكتروني؟", "كم تكلفة SEO؟" | Blog posts, guides |

**Action:**
- **Every service page must answer 3 questions immediately above the fold:**
  1. Can you do X? (yes — with proof)
  2. How much? (range + free consultation offer)
  3. How long? (delivery timeline badge)
- City pages must use city name in H1 + title + description (e.g., "شركة تصميم مواقع في الرياض")
- Remove generic tech descriptions — replace with outcome statements

---

## 3. Information Architecture

**Current structure:**
```
Home → About → Services (3 cats × 3 items) → Contact
```
I expanded to 16 sub-items + 6 city pages but the structure is wrong.

**Target structure:**
```
Home
├── About
├── Services (pillar — overview)
│   ├── Web Development (category pillar)
│   │   ├── Custom Websites
│   │   │   ├── Corporate websites [future]
│   │   │   ├── Landing pages [future]
│   │   │   └── WordPress themes ← NEW (real service)
│   │   ├── E-commerce ← rename "Online Stores"
│   │   │   ├── Shopify stores ← NEW (real service)
│   │   │   ├── Salla stores ← NEW (real service)
│   │   │   ├── Zid stores ← NEW (real service)
│   │   │   └── Custom e-commerce
│   │   ├── Redesign & Migration
│   │   │   ├── WordPress → Custom [future]
│   │   │   └── Old site redesign
│   │   └── Maintenance & Support
│   ├── SEO (category pillar)
│   │   ├── Technical SEO
│   │   ├── Local SEO
│   │   ├── Content SEO
│   │   ├── Link Building
│   │   ├── SEO Audit
│   │   └── E-commerce SEO ← NEW (cross-link to stores)
│   └── Digital Marketing (category pillar)
│       ├── Social Media
│       ├── Google Ads
│       ├── Snapchat & TikTok Ads
│       ├── Content Marketing
│       ├── Email Marketing
│       └── Brand Identity
├── Blog ← NEW
│   ├── كم تكلفة تصميم موقع في السعودية؟
│   ├── شوبيفاي ولا سلة؟ مقارنة كاملة
│   └── دليل تحسين متجر سلة لمحركات البحث
├── Locations
│   ├── Riyadh, Jeddah, Dammam, Khobar, Mecca, Medina
│   └── [future] Each location × each service
└── Contact
```

**Key changes:**
- Rename "E-commerce Solutions" → "Online Stores" (matches search intent better)
- Add WordPress themes, Shopify, Salla, Zid as named sub-services
- Add E-commerce SEO as a sub-service (cross-links stores → SEO)
- Add Blog with real content

---

## 4. Keyword Research

**Current state:** None. Generic terms only.

**Target keywords per page (must use in title + H1 + meta):**

| Page | Primary Keyword (AR) | Primary Keyword (EN) |
|------|---------------------|---------------------|
| Home | شركة تصميم مواقع في الرياض | Web Design Company Riyadh |
| Services | خدمات تصميم وتطوير المواقع | Web Development & SEO Services |
| Custom Websites | تصميم مواقع شركات | Corporate Website Design |
| Online Stores | تصميم متجر إلكتروني | E-commerce Development |
| Shopify Stores | تصميم متجر شوبيفاي | Shopify Store Design |
| Salla Stores | تصميم متجر سلة | Salla Store Setup |
| WordPress Themes | تصميم قالب ووردبريس | WordPress Theme Development |
| SEO services | شركة SEO في الرياض | SEO Company Riyadh |
| Local SEO | تحسين محركات البحث المحلي | Local SEO Services Riyadh |
| Snapchat Ads | إعلانات سناب شات | Snapchat Ads Management |
| + all city pages | شركة [خدمة] في [مدينة] | [Service] in [City] |

**Long-tail opportunities (blog content):**
- "كم تكلفة تصميم متجر إلكتروني في السعودية 2026"
- "شوبيفاي ولا سلة للشركات الصغيرة"
- "كيف أظهر في أول جوجل في الرياض"
- "متى أحتاج إعادة تصميم موقعي"
- "طريقة تحسين متجر سلة لمحركات البحث"

---

## 5. Topic Discovery

**Current state:** 16 sub-services, but 7 were auto-generated with generic content that doesn't match real offerings.

**Complete topic inventory (what you actually offer vs what's listed):**

| Topic | Currently Listed? | Note |
|-------|-----------------|------|
| Custom Websites | ✅ Listed | But described with tech, not outcomes |
| WordPress themes | ❌ MISSING | Real service — must add as sub-item under Custom Websites or as standalone |
| Shopify stores | ❌ MISSING | Real service — must add under Online Stores |
| Salla store setup | ❌ MISSING | Listed in findings as missing — still missing |
| Zid store setup | ❌ MISSING | Same |
| E-commerce Solutions | ✅ Listed | Rename to "Online Stores" for search intent |
| Website Redesign | ✅ Listed | OK |
| Maintenance & Support | ✅ Added | OK |
| Mobile App Development | ✅ Added | OK |
| Technical SEO | ✅ Listed | OK |
| Local SEO | ✅ Listed | OK |
| Content SEO | ✅ Listed | OK |
| Link Building | ✅ Added | OK |
| SEO Audit | ✅ Added | OK |
| E-commerce SEO | ❌ MISSING | Must add — cross-links stores + SEO |
| Social Media Marketing | ✅ Listed | OK |
| Google Ads | ✅ Listed | OK |
| Snapchat & TikTok Ads | ✅ Added | OK |
| Content Marketing | ✅ Listed | OK |
| Email Marketing | ✅ Added | OK |
| Brand Identity | ✅ Added | OK |
| CRM Integration | ❌ MISSING | Real service |
| Google Business Profile | ❌ MISSING | Real service |
| Saudi hosting & domain | ❌ MISSING | Real service |
| CRO (Conversion Rate Optimization) | ❌ MISSING | Add as digital marketing sub-service |

**Missing that must be added now:** WordPress themes, Shopify stores, Salla stores, Zid stores, E-commerce SEO, CRM Integration, GBP management, Saudi hosting, CRO

---

## 6. Topical Mapping

**Current state:** Flat list. No depth.

**What it needs to be (example — Online Stores pillar):**
```
Online Stores
├── Shopify
│   ├── Shopify store design
│   ├── Shopify SEO optimization
│   ├── Shopify app integration
│   └── Shopify to custom migration
├── Salla
│   ├── Salla store setup
│   ├── Salla SEO optimization
│   ├── Salla theme customization
│   └── Salla payment gateway setup
├── Zid
│   ├── Zid store setup
│   ├── Zid SEO optimization
│   └── Zid inventory management
├── Custom E-commerce
│   ├── Full custom online store
│   ├── Multi-vendor marketplace
│   └── Subscription-based store
└── [Cross-link] → E-commerce SEO service
```

Each of these bullet points is a potential dedicated page. For now, list them on the parent page as linked topics.

**Topical map for Web Development:**
```
Web Development
├── Custom Websites (corporate, landing pages, portfolio)
├── WordPress Development (themes, plugins, WooCommerce)
├── Online Stores (Shopify, Salla, Zid, custom)
├── Redesign & Migration
└── Maintenance & Support
```

**Topical map for SEO:**
```
SEO
├── Technical SEO (speed, structure, crawl)
├── Local SEO (GBP, citations, city pages)
├── E-commerce SEO (product pages, categories, reviews)
├── Content SEO (blog, articles, keyword strategy)
├── Link Building (GCC backlinks, guest posts)
└── SEO Audit
```

---

## 7. Semantic SEO (Entities)

**Current state:** Schema added but entity strategy is missing.

**What needs to happen:**
- **Main entity:** مؤسسة حافة النجوم (LocalBusiness) ✅ done
- **Service entities:** Each sub-service as `Service` schema ✅ done
- **BreadcrumbList** ✅ done
- **Missing:** Organization schema with logo, sameAs (social profiles), taxID
- **Missing:** Review schema (when testimonials exist)
- **Missing:** FAQPage on sub-service pages (not just the services listing)
- **Missing:** Article schema for blog posts
- **Missing:** Product schema if pricing pages exist

**Entity relationship:**
```
LocalBusiness (Hafat Alnjom)
  ├── Service (Web Development)
  │   ├── Service (Custom Websites)
  │   ├── Service (Shopify Stores) ← NEW
  │   └── Service (WordPress Themes) ← NEW
  ├── Service (SEO)
  │   ├── Service (Technical SEO)
  │   └── Service (E-commerce SEO) ← NEW cross-entity link
  └── Service (Digital Marketing)
```

The entity strategy means Google understands that "Hafat Alnjom" offers "Shopify Stores" AND "E-commerce SEO" — so when someone searches "شوبيفاي وسيو" it connects.

---

## 8. Content Strategy

**Current state:** None. Service descriptions only.

**Content pyramid:**
```
Top of funnel (Blog — attract)
├── كم تكلفة تصميم موقع في السعودية؟ (guide)
├── شوبيفاي ولا سلة؟ مقارنة كاملة للشركات الناشئة
├── دليل تحسين متجر سلة لمحركات البحث 2026
├── كيف تختار شركة تصميم مواقع في الرياض؟
└── 10 خطوات لنجاح متجرك الإلكتروني

Middle of funnel (Service pages — convert)
├── Each sub-service page with FAQ, pricing, timeline
└── City × service landing pages

Bottom of funnel (CRO — close)
├── Cost FAQ per service
├── WhatsApp CTA with service context
└── Free consultation offer on every page
```

**Blog posts needed (minimum 3 to start):**
1. **"كم تكلفة تصميم موقع في السعودية؟"** — Answers the #1 question. Includes pricing ranges for different types, factors that affect cost, and a CTA for free quote.
2. **"شوبيفاي ولا سلة؟ مقارنة كاملة"** — Comparison content that positions you as an expert in both platforms.
3. **"دليل تحسين متجر سلة لمحركات البحث"** — Practical guide that brings organic traffic from Salla store owners.

---

## 9. Technical SEO

**Current state:** Mostly done — canonical, hreflang, sitemap, schema all added.

**What's missing/fixing:**
- Service page content has technology names (SvelteKit, Tailwind) — rewrite to remove these
- Page titles still weak — need keyword-specific titles per the keyword table above
- Meta descriptions need to include city name + service + call-to-action
- GTM ID is placeholder — needs actual ID
- Sitemap is correct ✅

---

## 10. Internal Linking

**Current state:** Breadcrumbs exist, Related Services section exists, but real contextual cross-linking is missing.

**What needs to happen (concrete examples):**

In the **Shopify Stores** sub-service page:
```
"→ Need to get your Shopify store found on Google? Check our E-commerce SEO service"
"→ Building a brand? Our Brand Identity service pairs perfectly with your new store"
```

In the **SEO Audit** page:
```
"→ Found technical issues? We also do website redesign fixes"
"→ We recommend starting with a Custom Website built for SEO from day one"
```

In the **Snapchat Ads** page:
```
"→ Running ads but no traffic to your site? Let's rebuild your landing page"
```

**Rule:** Every sub-service page must have at least 2 contextual cross-links to related services, placed naturally in the content (not in a separate "Related" block).

---

## 11. Local SEO

**Current state:** City landing pages exist but are generic.

**What needs to happen:**
- **City pages need real local content** — Not just "we serve [city]" but:
  - Why this city matters (e.g., "الرياض هي العاصمة وأكبر سوق رقمي في المملكة")
  - Local examples (business types common in that city)
  - Mention nearby landmarks, districts, business districts
- **Add GBP (Google Business Profile) link** — If one exists, link to it from contact page
- **Add NAP (Name, Address, Phone) consistently** — Already have this
- **City + service combo pages** — [Future] e.g., "/locations/riyadh/shopify-stores"

---

## 12. EEAT (Experience, Expertise, Authority, Trust)

**Current state:** This is where the site fails hardest. Zero evidence of real work.

**What needs to happen:**

**Experience:**
- Remove fake stats (500+ clients, 4.9/5) unless you can prove them
- Replace with real claims: "ساعدنا أكثر من 50 متجراً إلكترونياً في السعودية" (if true)
- Or don't mention numbers at all — say "نعمل مع شركات سعودية في الرياض وجدة والدمام"

**Expertise:**
- Service descriptions must show real knowledge of specific platforms
- "نطور متاجر شوبيفاي متكاملة مع بوابات الدفع السعودية (مدى، STC Pay)" — shows expertise
- "نصمم قوالب ووردبريس مخصصة تتوافق مع أنظمة السعودية" — shows local expertise

**Authority:**
- CR number is good ✅
- Add client logo bar (90+ logos exist in the 3D scene — extract and display statically)
- If you have partnerships (Salla partner, Shopify partner) — display badges

**Trustworthiness:**
- Contact form must work (backend needed)
- Add real WhatsApp number with Saudi greeting ✅ done
- If you have real client testimonials — add them. If not, don't fabricate them.

---

## 13. Authority

**Current state:** No external authority signals.

**What builds authority for a Saudi digital agency:**
- **Salla/Shopify partnership badges** — If you're a registered partner, display it
- **Client logo bar** — Even without names, logos of brands you've worked with
- **Real CR + registered address** ✅
- **Google Maps listing** ✅
- **Published guides/blog** — Shows you know your field
- **Case studies** — "How we increased sales by 150% for a Riyadh restaurant" (anonymous if needed)

---

## 14. UX

**Current state:** Beautiful visually, but content is wrong.

**UX fixes needed:**
- Remove fake stats from CTA trust lines — they undermine credibility
- Replace technology names with client benefits
- Service pages need to answer "Can you do X?" instantly
- Add scroll progress bar ✅ done
- Add sticky CTA ✅ done

---

## 15. CRO (Conversion Rate Optimization)

**Current state:** CTAs exist but feel untrustworthy.

**What needs to change:**

**Per-service cost FAQ (replace generic one):**
- **Web Dev:** "تتراوح تكلفة تصميم موقع ووردبريس بين 1,000 و 3,000 ريال حسب عدد الصفحات"
- **Online Stores:** "تتراوح تكلفة متجر شوبيفاي بين 2,000 و 5,000 ريال حسب التخصيص"
- **SEO:** "تبدأ خدمات تحسين محركات البحث من 1,500 ريال شهرياً"
- These must be REAL ranges the client actually charges

**Remove fabricated trust lines or make them real:**
- If you have 50 clients, say "أكثر من 50 عميل" not "500+ clients"
- If you don't have reviews, remove the rating
- Replace with real social proof: logo bar, WhatsApp response time, real case studies

---

## 16. Analytics

**Current state:** GTM snippet added but not configured (placeholder ID).

**Action:**
- Replace `GTM-XXXXXXX` with real GTM container ID
- Set up GA4 property
- Track: page views, WhatsApp clicks, form submissions, scroll depth

---

## 17. Reporting

**Current state:** No reporting.

**Action (after analytics is live):**
- Connect GA4 to Looker Studio
- Monthly report: traffic, leads, WhatsApp clicks, top pages, conversion rate
- Review every month

---

## 18. Scaling

**Current state:** Static JSON files. Adding a service = developer needed.

**Action:**
- Current setup is fine for now (16 sub-services, 6 cities)
- When blog + location pages grow beyond 50 total pages → migrate to headless CMS (Strapi or Sanity)
- Recommended threshold: when non-developer needs to add content monthly

---

## Execution Priority

| Order | Layer | What | Effort |
|-------|-------|------|--------|
| **1** | EEAT | Remove fake stats, rewrite service content to be real | Medium |
| **2** | Topic Discovery | Add WordPress, Shopify, Salla, Zid as named services | Medium |
| **3** | Search Intent | Per-service cost FAQ with REAL prices | Small |
| **4** | Topical Mapping | Build proper tree with child topics on each page | Medium |
| **5** | Internal Linking | Add contextual cross-links in every service description | Medium |
| **6** | Content Strategy | Blog with 3 posts | Large |
| **7** | Local SEO | Rewrite city pages with real local content | Medium |
| **8** | Authority | Client logo bar, partnership badges | Small |
| **9** | Analytics | Replace GTM ID, verify GA4 | Small |
| **10** | Semantic SEO | Fix entity relationships | Small |

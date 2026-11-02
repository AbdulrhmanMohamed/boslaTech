const day = 86400000;
const ago = (days) => Date.now() - days * day;
const ahead = (days) => Date.now() + days * day;

export const ROLE_OPTIONS = [
  {
    id: "owner",
    label: "المالك",
    short: "Owner",
    desc: "كل الصلاحيات والبيانات والتقارير",
    tabs: ["overview", "orders", "products", "customers", "discounts", "analytics", "sales", "marketing", "affiliates", "growth", "payments", "team", "audit", "help", "settings"],
  },
  {
    id: "admin",
    label: "مدير المتجر",
    short: "Admin",
    desc: "إدارة كل العمليات اليومية",
    tabs: ["overview", "orders", "products", "customers", "discounts", "analytics", "sales", "marketing", "affiliates", "growth", "payments", "team", "audit", "help", "settings"],
  },
  {
    id: "marketing",
    label: "مدير التسويق",
    short: "Marketing",
    desc: "الحملات والشرائح والتحليلات",
    tabs: ["overview", "orders", "customers", "discounts", "analytics", "marketing", "affiliates", "growth", "help"],
  },
  {
    id: "sales",
    label: "فريق المبيعات",
    short: "Sales",
    desc: "العملاء المحتملين والطلبات والعمولات",
    tabs: ["overview", "orders", "customers", "sales", "analytics", "payments", "help"],
  },
  {
    id: "support",
    label: "خدمة العملاء",
    short: "Support",
    desc: "الطلبات وملفات العملاء",
    tabs: ["overview", "orders", "customers", "help"],
  },
  {
    id: "affiliate",
    label: "شريك التسويق",
    short: "Affiliate",
    desc: "بوابة الشريك والأرباح والروابط",
    tabs: ["affiliate-portal", "help"],
  },
  {
    id: "analyst",
    label: "محلل البيانات",
    short: "Analyst",
    desc: "قراءة الأرقام والسجل بدون تعديل",
    tabs: ["overview", "orders", "customers", "analytics", "sales", "marketing", "affiliates", "audit", "help"],
  },
];

export const PERMISSION_MODULES = [
  { id: "orders", label: "الطلبات", desc: "عرض وتحديث حالات الطلبات" },
  { id: "products", label: "المنتجات", desc: "إدارة الكتالوج والمخزون" },
  { id: "customers", label: "العملاء", desc: "عرض ملفات العملاء والشرائح" },
  { id: "marketing", label: "التسويق", desc: "الحملات والأتمتة والشرائح" },
  { id: "sales", label: "المبيعات", desc: "العملاء المحتملين والفرص" },
  { id: "affiliates", label: "الشركاء", desc: "العمولات والروابط والمدفوعات" },
  { id: "growth", label: "النمو", desc: "الولاء والإحالات وبطاقات الهدايا" },
  { id: "analytics", label: "التحليلات", desc: "التقارير والأداء" },
  { id: "team", label: "الفريق", desc: "الأعضاء والأدوار والصلاحيات" },
  { id: "settings", label: "الإعدادات", desc: "بيانات المتجر والتكاملات" },
];

const allPermissions = Object.fromEntries(PERMISSION_MODULES.map((module) => [module.id, "manage"]));

export const DEFAULT_ROLES = [
  { id: "owner", name: "المالك", desc: "صلاحية كاملة غير قابلة للتقييد", system: true, permissions: { ...allPermissions } },
  { id: "admin", name: "مدير المتجر", desc: "إدارة يومية شاملة", system: true, permissions: { ...allPermissions, settings: "view" } },
  {
    id: "marketing",
    name: "مدير التسويق",
    desc: "الحملات والشرائح والتقارير",
    system: true,
    permissions: { orders: "view", customers: "manage", marketing: "manage", analytics: "manage", affiliates: "view", growth: "manage", products: "view" },
  },
  {
    id: "sales",
    name: "فريق المبيعات",
    desc: "الفرص والمتابعة والعمولات",
    system: true,
    permissions: { orders: "view", customers: "manage", sales: "manage", analytics: "view", payments: "view" },
  },
  {
    id: "support",
    name: "خدمة العملاء",
    desc: "الطلبات والعملاء فقط",
    system: true,
    permissions: { orders: "manage", customers: "manage" },
  },
  {
    id: "affiliate",
    name: "شريك التسويق",
    desc: "بوابة الشريك فقط",
    system: true,
    permissions: { affiliates: "view" },
  },
];

export const TEAM_MEMBERS = [
  { id: "tm-1", name: "عبدالرحمن العتيبي", email: "owner@asl.sa", roleId: "owner", status: "active", lastActive: ago(0), assignedLeads: 0, campaigns: 0, commission: 0, color: "green" },
  { id: "tm-2", name: "نورة القحطاني", email: "noura@asl.sa", roleId: "marketing", status: "active", lastActive: ago(0), assignedLeads: 0, campaigns: 6, commission: 0, color: "gold" },
  { id: "tm-3", name: "خالد الشمري", email: "khaled@asl.sa", roleId: "sales", status: "active", lastActive: ago(1), assignedLeads: 4, campaigns: 0, commission: 1850, color: "ink" },
  { id: "tm-4", name: "ريم الدوسري", email: "reem@asl.sa", roleId: "sales", status: "active", lastActive: ago(0), assignedLeads: 3, campaigns: 0, commission: 1320, color: "green" },
  { id: "tm-5", name: "مازن الحربي", email: "mazen@asl.sa", roleId: "support", status: "active", lastActive: ago(2), assignedLeads: 0, campaigns: 0, commission: 0, color: "gold" },
  { id: "tm-6", name: "لمى العلي", email: "lama@asl.sa", roleId: "affiliate", status: "pending", lastActive: null, assignedLeads: 0, campaigns: 0, commission: 0, color: "ink" },
];

export const SALES_STAGES = [
  { id: "new", label: "جديد", tone: "bg-cream border-line text-muted" },
  { id: "contacted", label: "تم التواصل", tone: "bg-[#f4ead4] border-gold/30 text-[#71540f]" },
  { id: "qualified", label: "مؤهل", tone: "bg-[#e8f1ee] border-green2/20 text-green2" },
  { id: "proposal", label: "عرض سعر", tone: "bg-goldsoft border-gold/30 text-[#71540f]" },
  { id: "won", label: "تم البيع", tone: "bg-green2 border-green2 text-cream" },
  { id: "lost", label: "مغلق", tone: "bg-[#fbe9e6] border-[#e8c6c0] text-[#a33b2c]" },
];

export const SALES_LEADS = [
  {
    id: "ld-1042",
    name: "سارة المطيري",
    company: "بوتيك سارة",
    phone: "+966 55 320 4418",
    email: "sara@boutique.sa",
    source: "Instagram",
    value: 4800,
    stage: "proposal",
    ownerId: "tm-3",
    city: "الرياض",
    createdAt: ago(2),
    nextTask: "متابعة عرض السعر",
    notes: "مهتمة بمتجر سلة مع ربط مدى وSTC Pay. تفضل الاجتماع الأحد.",
    activity: [
      { id: "a1", text: "تم إرسال عرض السعر", ts: ago(1) },
      { id: "a2", text: "اجتماع تعريف بالخدمة", ts: ago(2) },
    ],
  },
  {
    id: "ld-1041",
    name: "فيصل الزهراني",
    company: "مؤسسة فيصل للتجارة",
    phone: "+966 50 884 1902",
    email: "faisal@fzt.sa",
    source: "Google",
    value: 12000,
    stage: "qualified",
    ownerId: "tm-4",
    city: "جدة",
    createdAt: ago(4),
    nextTask: "تحديد نطاق المشروع",
    notes: "يحتاج موقع تعريفي + متجر إلكتروني + تحسين محركات البحث.",
    activity: [
      { id: "a3", text: "تم التأكد من الميزانية", ts: ago(3) },
      { id: "a4", text: "اتصال أولي", ts: ago(4) },
    ],
  },
  {
    id: "ld-1040",
    name: "هند العنزي",
    company: "عيادة أسنان",
    phone: "+966 53 771 9920",
    email: "hind@clinic.sa",
    source: "Snapchat",
    value: 7600,
    stage: "contacted",
    ownerId: "tm-3",
    city: "الدمام",
    createdAt: ago(6),
    nextTask: "إرسال دراسة حالة",
    notes: "تريد تحسين الظهور المحلي في حي الشاطئ.",
    activity: [{ id: "a5", text: "تم الرد على استفسار سناب", ts: ago(5) }],
  },
  {
    id: "ld-1039",
    name: "عبدالله الغامدي",
    company: "مخبز وحلويات",
    phone: "+966 56 112 7788",
    email: "abdullah@bakery.sa",
    source: "واتساب",
    value: 3200,
    stage: "new",
    ownerId: null,
    city: "مكة",
    createdAt: ago(1),
    nextTask: "اتصال تعريفي",
    notes: "طلب عرض سعر سريع لمتجر طلبات.",
    activity: [],
  },
  {
    id: "ld-1038",
    name: "مها السبيعي",
    company: "علامة عطور",
    phone: "+966 58 400 2201",
    email: "maha@perfume.sa",
    source: "إحالة",
    value: 9500,
    stage: "won",
    ownerId: "tm-4",
    city: "الرياض",
    createdAt: ago(12),
    nextTask: "بدء التنفيذ",
    notes: "تم توقيع العقد ودفع الدفعة الأولى.",
    activity: [
      { id: "a6", text: "تم توقيع العقد", ts: ago(2) },
      { id: "a7", text: "تم استلام الدفعة الأولى", ts: ago(1) },
    ],
  },
  {
    id: "ld-1037",
    name: "تركي الشهري",
    company: "مطعم تركي",
    phone: "+966 54 660 1010",
    email: "turki@rest.sa",
    source: "Google",
    value: 4200,
    stage: "lost",
    ownerId: "tm-3",
    city: "الخبر",
    createdAt: ago(18),
    nextTask: "إعادة التواصل بعد 3 أشهر",
    notes: "أجل المشروع بسبب الميزانية.",
    activity: [{ id: "a8", text: "تم إغلاق الفرصة مؤقتًا", ts: ago(9) }],
  },
  {
    id: "ld-1036",
    name: "دانة القحطاني",
    company: "متجر هدايا",
    phone: "+966 57 310 7781",
    email: "dana@gifts.sa",
    source: "Instagram",
    value: 5600,
    stage: "proposal",
    ownerId: "tm-4",
    city: "الرياض",
    createdAt: ago(8),
    nextTask: "متابعة الملاحظات",
    notes: "تريد هوية بصرية + متجر شوبيفاي.",
    activity: [{ id: "a9", text: "تم إرسال العرض", ts: ago(3) }],
  },
];

export const SEGMENTS = [
  { id: "seg-vip", name: "عملاء VIP", rule: "إجمالي الشراء أعلى من 800 ر.س", count: 42, revenue: 48200, color: "#c9a24b", active: true },
  { id: "seg-repeat", name: "عملاء متكررون", rule: "أكثر من طلبين خلال 90 يوم", count: 118, revenue: 37600, color: "#1e5b4f", active: true },
  { id: "seg-new", name: "عملاء جدد", rule: "أول طلب خلال 30 يوم", count: 64, revenue: 12800, color: "#6f6a5e", active: true },
  { id: "seg-inactive", name: "غير نشطين", rule: "لا يوجد شراء منذ 60 يوم", count: 91, revenue: 9400, color: "#a33b2c", active: true },
  { id: "seg-high", name: "سلة عالية", rule: "متوسط الطلب أعلى من 350 ر.س", count: 37, revenue: 21900, color: "#71540f", active: true },
];

export const CAMPAIGNS = [
  { id: "cmp-1", name: "عرض العيد — VIP", channel: "WhatsApp", audience: "seg-vip", status: "active", sent: 42, revenue: 6400, opens: 88, clicks: 61, scheduledAt: ago(3), budget: 0 },
  { id: "cmp-2", name: "استرجاع السلات المتروكة", channel: "Email + WhatsApp", audience: "seg-inactive", status: "active", sent: 91, revenue: 4820, opens: 64, clicks: 38, scheduledAt: ago(8), budget: 350 },
  { id: "cmp-3", name: "إطلاق عطر العنبر", channel: "Instagram", audience: "seg-new", status: "scheduled", sent: 0, revenue: 0, opens: 0, clicks: 0, scheduledAt: ahead(2), budget: 1200 },
  { id: "cmp-4", name: "تذكير نقاط الولاء", channel: "SMS", audience: "seg-repeat", status: "draft", sent: 0, revenue: 0, opens: 0, clicks: 0, scheduledAt: ahead(5), budget: 180 },
];

export const AUTOMATIONS = [
  { id: "auto-1", name: "استرجاع السلة المتروكة", trigger: "ترك السلة أكثر من ساعة", action: "واتساب + كوبون 10%", active: true, runs: 38, revenue: 4180, conversion: 18 },
  { id: "auto-2", name: "ترحيب بالعميل الجديد", trigger: "أول تسجيل", action: "بريد ترحيبي + نقاط مضاعفة", active: true, runs: 64, revenue: 2260, conversion: 12 },
  { id: "auto-3", name: "استعادة العميل غير النشط", trigger: "60 يوم بدون شراء", action: "واتساب + عرض خاص", active: false, runs: 0, revenue: 0, conversion: 0 },
];

export const MARKETING_INTEGRATIONS = [
  { id: "ga4", name: "Google Analytics 4", desc: "تتبع الزيارات والتحويلات", status: "connected", tag: "GA4" },
  { id: "meta", name: "Meta Pixel", desc: "قياس حملات إنستغرام وفيسبوك", status: "connected", tag: "Meta" },
  { id: "snap", name: "Snapchat Pixel", desc: "تتبع حملات سناب شات", status: "demo", tag: "Snap" },
  { id: "tiktok", name: "TikTok Pixel", desc: "تتبع حملات تيك توك", status: "demo", tag: "TikTok" },
  { id: "google-ads", name: "Google Ads", desc: "ربط التحويلات بحملات البحث", status: "connected", tag: "Ads" },
  { id: "shopping", name: "Google Merchant", desc: "إرسال المنتجات إلى Shopping", status: "demo", tag: "Feed" },
];

export const AFFILIATES = [
  { id: "af-1", name: "لمى العلي", email: "lama@affiliate.sa", code: "LAMA15", status: "active", clicks: 1280, orders: 47, revenue: 18640, commission: 2796, paid: 1800, joinedAt: ago(65), platform: "Instagram" },
  { id: "af-2", name: "عمر السالم", email: "omar@affiliate.sa", code: "OMAR10", status: "active", clicks: 860, orders: 31, revenue: 11220, commission: 1683, paid: 1200, joinedAt: ago(42), platform: "TikTok" },
  { id: "af-3", name: "جواهر الحربي", email: "jawaher@affiliate.sa", code: "JAWA20", status: "pending", clicks: 0, orders: 0, revenue: 0, commission: 0, paid: 0, joinedAt: ago(3), platform: "Snapchat" },
  { id: "af-4", name: "ريان القحطاني", email: "rayan@affiliate.sa", code: "RAYAN12", status: "paused", clicks: 410, orders: 12, revenue: 4380, commission: 657, paid: 657, joinedAt: ago(90), platform: "X / Twitter" },
];

export const AFFILIATE_PAYOUTS = [
  { id: "po-1", affiliateId: "af-1", amount: 996, status: "pending", requestedAt: ago(1), method: "تحويل بنكي" },
  { id: "po-2", affiliateId: "af-2", amount: 483, status: "pending", requestedAt: ago(2), method: "STC Pay" },
  { id: "po-3", affiliateId: "af-1", amount: 800, status: "paid", requestedAt: ago(21), method: "تحويل بنكي" },
  { id: "po-4", affiliateId: "af-4", amount: 657, status: "paid", requestedAt: ago(34), method: "تحويل بنكي" },
];

export const LOYALTY_TIERS = [
  { name: "فضي", points: "0+", benefit: "نقطة لكل 1 ر.س", members: 184, color: "#8c877a" },
  { name: "ذهبي", points: "1,000+", benefit: "خصم 5% + شحن مجاني", members: 62, color: "#c9a24b" },
  { name: "ماسي", points: "3,000+", benefit: "خصم 10% + هدايا حصرية", members: 18, color: "#1e5b4f" },
];

export const GIFT_CARDS = [
  { id: "gc-1", code: "EID-500-ASL", amount: 500, balance: 300, recipient: "نورة", status: "active", createdAt: ago(12) },
  { id: "gc-2", code: "GIFT-250-ASL", amount: 250, balance: 250, recipient: "سارة", status: "active", createdAt: ago(4) },
  { id: "gc-3", code: "VIP-1000-ASL", amount: 1000, balance: 0, recipient: "مها", status: "used", createdAt: ago(30) },
];

export const GROWTH_PROGRAMS = {
  loyalty: true,
  referrals: true,
  giftCards: true,
  bundles: true,
  referralReward: "50",
  refereeReward: "25",
  pointsPerRiyal: "1",
  bundleName: "عطر + بخور + شمعة",
  bundleDiscount: "15",
};

export const AUDIT_EVENTS = [
  { id: "au-1", actor: "نورة القحطاني", action: "إطلاق حملة", detail: "عرض العيد — VIP", ts: ago(0.2), ip: "هذا المتصفح" },
  { id: "au-2", actor: "خالد الشمري", action: "تحديث فرصة", detail: "بوتيك سارة → عرض سعر", ts: ago(0.6), ip: "هذا المتصفح" },
  { id: "au-3", actor: "عبدالرحمن العتيبي", action: "دعوة عضو", detail: "لمى العلي — شريك التسويق", ts: ago(1), ip: "هذا المتصفح" },
  { id: "au-4", actor: "ريم الدوسري", action: "تحديث طلب", detail: "ASL-1042 → تم الشحن", ts: ago(1.2), ip: "هذا المتصفح" },
  { id: "au-5", actor: "النظام", action: "طلب سحب عمولة", detail: "لمى العلي — 996 ر.س", ts: ago(2), ip: "هذا المتصفح" },
  { id: "au-6", actor: "مازن الحربي", action: "تحديث عميل", detail: "إضافة صورة العميل", ts: ago(2.4), ip: "هذا المتصفح" },
];

export const NOTIFICATIONS = [
  { id: "n-1", title: "طلب سحب عمولة جديد", body: "لمى العلي طلبت صرف 996 ر.س", ts: ago(0.1), tab: "affiliates", unread: true, tone: "gold" },
  { id: "n-2", title: "فرصة بانتظار المتابعة", body: "عرض سعر بوتيك سارة منذ يوم", ts: ago(0.3), tab: "sales", unread: true, tone: "green" },
  { id: "n-3", title: "حملة العيد تعمل الآن", body: "42 رسالة واتساب — 61 نقرة", ts: ago(0.5), tab: "marketing", unread: false, tone: "green" },
  { id: "n-4", title: "دعوة معلّقة", body: "لمى العلي لم تقبل الدعوة بعد", ts: ago(1.2), tab: "team", unread: false, tone: "ink" },
];

export const HELP_ARTICLES = [
  { id: "h-1", title: "كيف تبدي أول حملة تسويقية؟", category: "التسويق", tab: "marketing", body: "اختر شريحة، اكتب الرسالة، عاين الإرسال، ثم أطلق الحملة. كل شيء هنا تجريبي ولا يتم إرسال رسائل حقيقية." },
  { id: "h-2", title: "كيف تضيف عضو فريق وتحدد صلاحياته؟", category: "الفريق", tab: "team", body: "من الفريق اختر دعوة عضو، أدخل الاسم والبريد، ثم اختر الدور. يمكنك إنشاء دور مخصص وتحديد الوصول لكل قسم." },
  { id: "h-3", title: "كيف تحرك عميلًا محتملًا في مسار المبيعات؟", category: "المبيعات", tab: "sales", body: "اسحب البطاقة بين المراحل، أو افتح الفرصة وغيّر مرحلتها. أضف ملاحظة أو مهمة متابعة لكل فرصة." },
  { id: "h-4", title: "كيف تشوف تجربة الشريك؟", category: "الشركاء", tab: "affiliates", body: "من صفحة الشركاء اضغط «معاينة بوابة الشريك». يمكنك أيضًا تغيير الدور من أعلى الصفحة إلى شريك التسويق." },
  { id: "h-5", title: "كيف تربط Google Analytics أو Meta Pixel؟", category: "التكاملات", tab: "marketing", body: "افتح التسويق ← التكاملات، واضغط ربط. هذه معاينة تجريبية، والربط الحقيقي يتم بعد ربط المتجر بالخادم." },
  { id: "h-6", title: "كيف تستخدم أدوارًا مخصصة؟", category: "الفريق", tab: "team", body: "من الفريق ← الأدوار اضغط إنشاء دور، اختر الأقسام المسموحة، ثم احفظ. هذا يوضح للعميل كيف سيدير فريقه لاحقًا." },
  { id: "h-7", title: "كيف تحفز العملاء على العودة؟", category: "النمو", tab: "growth", body: "فعّل نقاط الولاء، أنشئ برنامج إحالة، وأصدر بطاقة هدايا. كل الأدوات موجودة في صفحة النمو." },
  { id: "h-8", title: "كيف تتابع تغييرات الفريق؟", category: "الأمان", tab: "audit", body: "سجل النشاط يعرض من فعل ماذا ومتى. مناسب للمدير الذي يريد معرفة كل تغيير في المتجر." },
];

export const SETUP_STEPS = [
  { id: "store", title: "أكمل بيانات المتجر", desc: "الاسم، المدينة، الشعار وبيانات التواصل", tab: "settings" },
  { id: "product", title: "أضف أول منتج", desc: "صورة، سعر، مخزون وتصنيف", tab: "products" },
  { id: "team", title: "أضف فريقك", desc: "ادعُ مسوقًا أو مندوب مبيعات", tab: "team" },
  { id: "campaign", title: "أنشئ حملة", desc: "شريحة، رسالة، وجدولة إرسال", tab: "marketing" },
  { id: "affiliate", title: "فعّل برنامج الشركاء", desc: "روابط وعمولات ومدفوعات", tab: "affiliates" },
  { id: "growth", title: "فعّل أدوات النمو", desc: "ولاء، إحالات، وبطاقات هدايا", tab: "growth" },
  { id: "audit", title: "راجع سجل النشاط", desc: "شفافية كاملة لكل تغيير", tab: "audit" },
];

export const TOUR_STEPS = [
  { id: "overview", title: "نظرة عامة على المتجر", body: "هنا يشاهد المالك الإيرادات، الطلبات، أفضل المنتجات، وآخر التحديثات في شاشة واحدة.", tab: "overview" },
  { id: "orders", title: "الطلبات والعمليات", body: "كل طلب له ملف كامل: العميل، الدفع، المنتجات، والحالة. جرّب تغيير الحالة.", tab: "orders" },
  { id: "sales", title: "مسار المبيعات", body: "فرص مرتبة حسب المرحلة، مسندة لفريق المبيعات، مع قيمة متوقعة ومهام متابعة.", tab: "sales" },
  { id: "marketing", title: "التسويق والأتمتة", body: "حملات، شرائح، أتمتة للسلات المتروكة، وتكاملات قياس — كلها جاهزة للمعاينة.", tab: "marketing" },
  { id: "affiliates", title: "برنامج الشركاء", body: "روابط، عمولات، طلبات سحب، وبوابة كاملة للشريك. غيّر الدور لتعيش التجربة.", tab: "affiliates" },
  { id: "team", title: "الفريق والصلاحيات", body: "أدوار جاهزة وأدوار مخصصة. كل شخص يرى ما يحتاجه فقط.", tab: "team" },
  { id: "help", title: "الدعم والتوجيه", body: "مركز مساعدة، قائمة إعداد، وجولة إرشادية — العميل لا يضيع أبدًا.", tab: "help" },
];

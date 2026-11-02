const DAY = 86400000;
const daysAgo = (n) => Date.now() - n * DAY;

const item = (id, name, price, qty = 1) => ({ id, name, price, qty });
const totals = (subtotal, ship = 0, disc = 0) => ({
  subtotal,
  ship,
  disc,
  total: subtotal - disc + ship,
});
const addr = (name, phone, email, city, district, street) => ({
  name,
  phone,
  email,
  city,
  district,
  street,
});
const payment = (id, amount, company, last4, method = "card") => ({
  provider: "moyasar",
  id,
  status: "paid",
  amount: amount * 100,
  currency: "SAR",
  method,
  company,
  last4,
  message: "APPROVED",
});

export const DEMO_ORDERS = [
  {
    id: "ASL-4821",
    ts: daysAgo(0) + 3600000,
    items: [item(1, "عطر العنبر الفاخر", 249), item(2, "عطر الورد والعود", 199)],
    totals: totals(448),
    addr: addr("سارة العتيبي", "0551234567", "sara@example.com", "الرياض", "حطين", "شارع الأمير سلطان"),
    pay: "بطاقة — ميسر",
    status: "تم التوصيل",
    payment: payment("pay_4821", 448, "visa", "4231"),
  },
  {
    id: "ASL-4820",
    ts: daysAgo(0) + 9000000,
    items: [item(3, "بخور العود الفيصلي 50 غم", 149), item(6, "مزهرية زجاج مطفي", 129)],
    totals: totals(278),
    addr: addr("محمد الحربي", "0562345678", "m.harbi@example.com", "جدة", "الشاطئ", "شارع الأندلس"),
    pay: "STC Pay — ميسر",
    status: "تم الشحن",
    payment: payment("pay_4820", 278, null, "5678", "stcpay"),
  },
  {
    id: "ASL-4819",
    ts: daysAgo(1) + 7200000,
    items: [item(5, "صينية هدايا العروس", 479), item(7, "طقم كوبين زجاجي", 159)],
    totals: totals(638),
    addr: addr("نورة القحطاني", "0503456789", "noura@example.com", "الدمام", "الشاطئ الغربي", "شارع الخليج"),
    pay: "بطاقة — ميسر",
    status: "قيد التجهيز",
    payment: payment("pay_4819", 638, "mada", "8812"),
  },
  {
    id: "ASL-4818",
    ts: daysAgo(2) + 5400000,
    items: [item(4, "شمعة عود الليل 200 غم", 89)],
    totals: totals(89, 25),
    addr: addr("فيصل الشمري", "0534567890", "faisal@example.com", "الرياض", "النرجس", "شارع الياسمين"),
    pay: "الدفع عند الاستلام",
    status: "تم التوصيل",
    payment: null,
  },
  {
    id: "ASL-4817",
    ts: daysAgo(3) + 3800000,
    items: [item(8, "طقم عطور رجالية 3 قطع", 389)],
    totals: totals(389),
    addr: addr("لينا الزهراني", "0575678901", "lina@example.com", "مكة المكرمة", "العزيزية", "شارع الحج"),
    pay: "بطاقة — ميسر",
    status: "ملغي",
    payment: payment("pay_4817", 389, "visa", "1024"),
  },
  {
    id: "ASL-4816",
    ts: daysAgo(4) + 6100000,
    items: [item(2, "عطر الورد والعود", 199), item(4, "شمعة عود الليل 200 غم", 89)],
    totals: totals(288),
    addr: addr("عبدالله الدوسري", "0546789012", "abdullah@example.com", "الخبر", "العقربية", "شارع الملك فهد"),
    pay: "بطاقة — ميسر",
    status: "تم التوصيل",
    payment: payment("pay_4816", 288, "mada", "7745"),
  },
  {
    id: "ASL-4815",
    ts: daysAgo(5) + 4400000,
    items: [item(1, "عطر العنبر الفاخر", 249)],
    totals: totals(249, 25),
    addr: addr("ريم المالكي", "0517890123", "reem@example.com", "الرياض", "الملقا", "شارع التخصصي"),
    pay: "STC Pay — ميسر",
    status: "تم الشحن",
    payment: payment("pay_4815", 274, null, "0123", "stcpay"),
  },
  {
    id: "ASL-4814",
    ts: daysAgo(6) + 2700000,
    items: [item(7, "طقم كوبين زجاجي", 159)],
    totals: totals(159, 25),
    addr: addr("خالد العنزي", "0588901234", "khaled@example.com", "المدينة المنورة", "قباء", "شارع قباء"),
    pay: "تحويل بنكي",
    status: "تم التوصيل",
    payment: null,
  },
];

const dateLabel = (offset) =>
  new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
    day: "numeric",
    month: "short",
  }).format(new Date(Date.now() - offset * DAY));

const SALES_VALUES = [1860, 2380, 2140, 3120, 2760, 3580, 4210, 3890, 4620, 4180, 5140, 4870, 5860, 6420];

export const SALES_SERIES = SALES_VALUES.map((value, i) => ({
  label: dateLabel(13 - i),
  value,
}));

export const TRAFFIC_SOURCES = [
  { name: "بحث جوجل", value: 42, color: "#1e5b4f" },
  { name: "سناب شات", value: 24, color: "#c9a24b" },
  { name: "انستقرام", value: 18, color: "#2f6e5f" },
  { name: "زيارات مباشرة", value: 10, color: "#8a6a1f" },
  { name: "إحالات", value: 6, color: "#9b9488" },
];

export const FUNNEL = [
  { label: "زيارات الموقع", value: 12480, pct: 100 },
  { label: "مشاهدة منتج", value: 6240, pct: 50 },
  { label: "إضافة للسلة", value: 2180, pct: 17.5 },
  { label: "بدء الدفع", value: 940, pct: 7.5 },
  { label: "طلب مكتمل", value: 474, pct: 3.8 },
];

export const TOP_PAGES = [
  { path: "/", title: "الرئيسية", views: 8240, conversion: 4.8 },
  { path: "/shop", title: "المتجر", views: 5160, conversion: 6.2 },
  { path: "/product/1", title: "عطر العنبر الفاخر", views: 3420, conversion: 8.4 },
  { path: "/product/5", title: "صينية هدايا العروس", views: 2180, conversion: 7.1 },
  { path: "/checkout", title: "إتمام الطلب", views: 940, conversion: 50.4 },
];

export const DEVICES = [
  { name: "جوال", value: 71, color: "#1e5b4f" },
  { name: "كمبيوتر", value: 24, color: "#c9a24b" },
  { name: "تابلت", value: 5, color: "#9b9488" },
];

export const COUPONS = [
  { code: "ASL10", type: "percent", value: 10, uses: 184, limit: 500, active: true, revenue: 18420 },
  { code: "WELCOME15", type: "percent", value: 15, uses: 92, limit: 200, active: true, revenue: 11340 },
  { code: "EID25", type: "fixed", value: 25, uses: 61, limit: 100, active: false, revenue: 6125 },
];

export const PAYMENT_METHODS = [
  { name: "مدى / Visa", value: 62, color: "#1e5b4f" },
  { name: "STC Pay", value: 21, color: "#c9a24b" },
  { name: "الدفع عند الاستلام", value: 12, color: "#2f6e5f" },
  { name: "تحويل بنكي", value: 5, color: "#9b9488" },
];

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useShop } from "../store";
import { PRODUCTS, catName, riyal } from "../data/products";
import {
  COUPONS,
  DEMO_ORDERS,
  DEVICES,
  FUNNEL,
  PAYMENT_METHODS,
  SALES_SERIES,
  TOP_PAGES,
  TRAFFIC_SOURCES,
} from "../data/dashboard";
import { read, write } from "../lib/storage";
import Logo from "../components/Logo";
import ImageUploader from "../components/ImageUploader";
import useDialogBehavior from "../hooks/useDialogBehavior";
import TeamSection from "../components/dashboard/TeamSection";
import SalesSection from "../components/dashboard/SalesSection";
import MarketingSection from "../components/dashboard/MarketingSection";
import AffiliatesSection, { AffiliatePortal } from "../components/dashboard/AffiliatesSection";
import GrowthSection from "../components/dashboard/GrowthSection";
import { AuditSection, GuidedTour, HelpCenter, HelpDock, OnboardingWizard } from "../components/dashboard/HelpCenter";
import { timeAgo } from "../components/dashboard/ui";
import { NOTIFICATIONS, ROLE_OPTIONS } from "../data/dashboardPremium";

const NAV = [
  { id: "overview", group: "main", label: "نظرة عامة", icon: "grid", hint: "ملخص المتجر اليوم" },
  { id: "orders", group: "main", label: "الطلبات", icon: "bag", hint: "متابعة وتحديث الطلبات" },
  { id: "products", group: "main", label: "المنتجات", icon: "box", hint: "المخزون والأسعار" },
  { id: "customers", group: "main", label: "العملاء", icon: "users", hint: "قاعدة العملاء والشرائح" },
  { id: "discounts", group: "growth", label: "الخصومات", icon: "tag", hint: "كوبونات وعروض" },
  { id: "sales", group: "growth", label: "المبيعات", icon: "target", hint: "الفرص والمتابعة والعمولات" },
  { id: "marketing", group: "growth", label: "التسويق", icon: "sparkle", hint: "الحملات والشرائح والأتمتة" },
  { id: "affiliates", group: "growth", label: "الشركاء", icon: "users", hint: "الروابط والعمولات والسحوبات" },
  { id: "growth", group: "growth", label: "أدوات النمو", icon: "gift", hint: "الولاء والإحالات وبطاقات الهدايا" },
  { id: "analytics", group: "data", label: "التحليلات", icon: "chart", hint: "الزيارات والتحويل" },
  { id: "payments", group: "data", label: "المدفوعات", icon: "card", hint: "ميسر والمعاملات" },
  { id: "team", group: "manage", label: "الفريق", icon: "shield", hint: "الأدوار والصلاحيات والدعوات" },
  { id: "audit", group: "manage", label: "سجل النشاط", icon: "lock", hint: "من فعل ماذا ومتى" },
  { id: "settings", group: "manage", label: "الإعدادات", icon: "settings", hint: "إعدادات المتجر" },
  { id: "help", group: "manage", label: "المساعدة", icon: "help", hint: "قائمة الإعداد والجولة الإرشادية" },
  { id: "affiliate-portal", group: "portal", label: "بوابة الشريك", icon: "link", hint: "أرباحك ورابطك وطلبات السحب" },
];

const NAV_GROUPS = [
  { id: "portal", label: "بوابة الشريك" },
  { id: "main", label: "إدارة المتجر" },
  { id: "growth", label: "المبيعات والنمو" },
  { id: "data", label: "البيانات والمال" },
  { id: "manage", label: "الفريق والإدارة" },
];

const ICONS = {
  grid: ["M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"],
  bag: ["M6 7h12l1 14H5L6 7Z", "M9 7a3 3 0 0 1 6 0"],
  box: ["M21 8l-9-5-9 5 9 5 9-5Z", "M3 8v8l9 5 9-5V8", "M12 13v8"],
  users: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  tag: ["M20.59 13.41 11 3H4v7l9.59 9.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82Z", "M7 7h.01"],
  chart: ["M3 3v18h18", "M7 16v-5", "M12 16V8", "M17 16v-3"],
  card: ["M2 5h20v14H2z", "M2 10h20"],
  settings: ["M4 6h16", "M4 12h16", "M4 18h16", "M8 4v4", "M16 10v4", "M10 16v4"],
  search: ["M21 21l-4.3-4.3", "M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"],
  download: ["M12 3v12", "M7 10l5 5 5-5", "M5 21h14"],
  plus: ["M12 5v14", "M5 12h14"],
  close: ["M6 6l12 12", "M18 6 6 18"],
  arrow: ["M15 18l-6-6 6-6"],
  check: ["M20 6 9 17l-5-5"],
  logout: ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  store: ["M3 9l1.5-5h15L21 9", "M4 9h16v11H4z", "M9 20v-6h6v6"],
  bell: ["M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9", "M13.7 21a2 2 0 0 1-3.4 0"],
  trend: ["M22 7l-8.5 8.5-5-5L2 17", "M16 7h6v6"],
  wallet: ["M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15v14H5a2 2 0 0 1-2-2V5", "M18 12h.01"],
  pin: ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"],
  sparkle: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z", "M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z"],
  filter: ["M22 3H2l8 9.46V19l4 2v-8.54L22 3z"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 6v6l4 2"],
  arrowUp: ["M12 19V5", "M5 12l7-7 7 7"],
  fresh: ["M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5", "M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5"],
  target: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"],
  gift: ["M20 12v10H4V12", "M2 7h20v5H2z", "M12 22V7", "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z", "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z", "M9 12l2 2 4-4"],
  lock: ["M5 11h14v10H5z", "M8 11V7a4 4 0 0 1 8 0v4"],
  help: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"],
  link: ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"],
};

const STATUS_META = {
  "قيد التجهيز": "bg-goldsoft/80 text-[#71540f]",
  "تم الشحن": "bg-[#e8f1ee] text-green2",
  "تم التوصيل": "bg-green2 text-cream",
  ملغي: "bg-[#fbe9e6] text-[#a33b2c]",
};

const PAY_LABEL = {
  card: "بطاقة / مدى",
  stcpay: "STC Pay",
  cod: "الدفع عند الاستلام",
  bank: "تحويل بنكي",
};

const inputCls =
  "mt-1.5 w-full bg-cream border border-line rounded-2xl px-4 py-3 text-[13px] font-bold outline-none focus:border-green2 transition-colors";

const cx = (...classes) => classes.filter(Boolean).join(" ");
const fmtMoney = (value) => `${riyal(Math.round(Number(value) || 0))} ر.س`;
const fmtDate = (ts, opts = { day: "numeric", month: "short" }) =>
  new Date(ts).toLocaleDateString("ar-SA-u-ca-gregory-nu-latn", opts);
const fmtDateTime = (ts) =>
  new Date(ts).toLocaleString("ar-SA-u-ca-gregory-nu-latn", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
const payKey = (order) => {
  if (order.payment?.method) return order.payment.method;
  const label = order.pay || "";
  if (label.includes("STC")) return "stcpay";
  if (label.includes("الاستلام")) return "cod";
  if (label.includes("بنكي")) return "bank";
  return "card";
};
const download = (filename, content, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

function Icon({ name, className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {(ICONS[name] || ICONS.grid).map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-black whitespace-nowrap", STATUS_META[status] || STATUS_META["قيد التجهيز"])}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status || "قيد التجهيز"}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <section className={cx("bg-white border border-line rounded-[1.65rem] shadow-[0_18px_50px_-36px_rgba(35,36,29,.38)]", className)}>
      {children}
    </section>
  );
}

function StatCard({ icon, label, value, sub, trend, tone = "green" }) {
  const tones = {
    green: "bg-[#e8f1ee] text-green2",
    gold: "bg-goldsoft text-[#71540f]",
    ink: "bg-sand text-ink",
    cream: "bg-cream text-muted",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className={cx("w-10 h-10 rounded-2xl grid place-items-center", tones[tone])}>
          <Icon name={icon} className="w-[19px] h-[19px]" />
        </span>
        {trend && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f1ee] text-green2 px-2 py-1 text-[10px] font-black">
            <Icon name="arrowUp" className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-[11.5px] font-black text-muted mb-1">{label}</p>
      <p className="text-[25px] leading-tight font-black tracking-tight">{value}</p>
      {sub && <p className="text-[11px] font-bold text-muted mt-2">{sub}</p>}
    </Card>
  );
}

function SalesChart({ data }) {
  const W = 720;
  const H = 230;
  const pad = 20;
  const max = Math.max(...data.map((point) => point.value), 1) * 1.16;
  const x = (index) => pad + index * ((W - pad * 2) / Math.max(data.length - 1, 1));
  const y = (value) => H - pad - (value / max) * (H - pad * 2);
  const line = data.map((point, index) => `${index ? "L" : "M"}${x(index).toFixed(1)},${y(point.value).toFixed(1)}`).join(" ");
  const area = `${line} L ${x(data.length - 1).toFixed(1)},${H - pad} L ${x(0).toFixed(1)},${H - pad} Z`;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="مبيعات آخر 14 يوم">
        <defs>
          <linearGradient id="sales-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9a24b" stopOpacity="0.34" />
            <stop offset="1" stopColor="#c9a24b" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line key={ratio} x1={pad} x2={W - pad} y1={pad + ratio * (H - pad * 2)} y2={pad + ratio * (H - pad * 2)} stroke="#e7e0d2" strokeDasharray="4 7" />
        ))}
        <path d={area} fill="url(#sales-fill)" />
        <motion.path
          d={line}
          fill="none"
          stroke="#1e5b4f"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        {data.map((point, index) => (
          <circle key={`${point.label}-${index}`} cx={x(index)} cy={y(point.value)} r="3.2" fill="#f7f3ec" stroke="#1e5b4f" strokeWidth="2">
            <title>{`${point.label}: ${fmtMoney(point.value)}`}</title>
          </circle>
        ))}
      </svg>
      <div className="flex justify-between gap-1 mt-1 text-[9.5px] font-black text-muted">
        {data.map((point, index) => (
          <span key={`${point.label}-label`} className={index % 2 ? "hidden sm:inline" : ""}>
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Donut({ items, value, label, size = 176 }) {
  let offset = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90" role="img" aria-label={label}>
        <circle cx="21" cy="21" r="15.9155" fill="none" stroke="#f1ece2" strokeWidth="5.5" />
        {items.map((item) => {
          const dash = item.value;
          const current = offset;
          offset += dash;
          return (
            <circle
              key={item.name}
              cx="21"
              cy="21"
              r="15.9155"
              fill="none"
              stroke={item.color}
              strokeWidth="5.5"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray={`${Math.max(dash - 1.2, 0)} ${100 - Math.max(dash - 1.2, 0)}`}
              strokeDashoffset={-current}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <b className="text-[25px] leading-none font-black">{value}</b>
        <span className="text-[10px] font-black text-muted mt-1.5">{label}</span>
      </div>
    </div>
  );
}

function SourceBars({ items }) {
  return (
    <div className="space-y-4">
      {items.map((source) => (
        <div key={source.name}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-2 text-[11.5px] font-black">
              <span className="w-2 h-2 rounded-full" style={{ background: source.color }} />
              {source.name}
            </span>
            <span className="text-[11px] font-black text-muted">{source.value}%</span>
          </div>
          <div className="h-2 rounded-full bg-cream overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${source.value * 2.15}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: source.color, maxWidth: "100%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Modal({ open, onClose, title, subtitle, children, wide = false }) {
  useDialogBehavior(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center sm:p-5" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-ink/55 backdrop-blur-sm cursor-default" onClick={onClose} aria-label="إغلاق النافذة" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className={cx(
          "relative w-full bg-cream border border-line rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[92svh] overflow-y-auto no-scrollbar",
          wide ? "sm:max-w-3xl" : "sm:max-w-lg",
        )}
      >
        <div className="sticky top-0 z-10 bg-cream/95 backdrop-blur border-b border-line px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-black leading-snug">{title}</h2>
            {subtitle && <p className="text-[11px] font-bold text-muted mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-9 h-9 shrink-0 grid place-items-center rounded-full bg-white border border-line text-muted hover:text-ink cursor-pointer" aria-label="إغلاق">
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </motion.div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[11px] font-black text-muted">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-line last:border-0">
      <div>
        <p className="text-[12.5px] font-black">{label}</p>
        <p className="text-[10.5px] font-bold text-muted mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cx("relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0", checked ? "bg-green2" : "bg-line")}
      >
        <span className={cx("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all", checked ? "right-0.5" : "right-[22px]")} />
      </button>
    </div>
  );
}

function Empty({ icon = "box", title, text, action }) {
  return (
    <div className="text-center py-16 px-5">
      <span className="w-14 h-14 rounded-3xl bg-cream border border-line grid place-items-center mx-auto mb-4 text-muted">
        <Icon name={icon} className="w-6 h-6" />
      </span>
      <h3 className="font-black text-[15px] mb-1">{title}</h3>
      <p className="text-[12px] font-bold text-muted mb-5">{text}</p>
      {action}
    </div>
  );
}

export default function Dashboard() {
  const { user, orders, updateOrder, openAuth, logout, ping } = useShop();
  const [tab, setTab] = useState("overview");
  const [roleId, setRoleId] = useState(() => read("asl_dashboard_role", "owner"));
  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => read("asl_dashboard_notifications", NOTIFICATIONS));
  const [welcomeOpen, setWelcomeOpen] = useState(() => !read("asl_dashboard_welcome_seen", false));
  const [tourOpen, setTourOpen] = useState(false);
  const role = ROLE_OPTIONS.find((item) => item.id === roleId) || ROLE_OPTIONS[0];
  const [statusPatch, setStatusPatch] = useState(() => read("asl_dashboard_status", {}));
  const [productState, setProductState] = useState(() => read("asl_dashboard_products", PRODUCTS));
  const [coupons, setCoupons] = useState(() => read("asl_dashboard_coupons", COUPONS));
  const [customerImages, setCustomerImages] = useState(() => read("asl_dashboard_customer_images", {}));
  const [settings, setSettings] = useState(() =>
    read("asl_dashboard_settings", {
      storeName: "أصل ASL",
      email: "hello@boslatech.com",
      phone: "+966576944605",
      city: "الرياض",
      logo: "",
      freeShip: "200",
      shipCost: "25",
      cod: true,
      pickup: false,
      notes: true,
      notify: true,
    }),
  );
  const [dialog, setDialog] = useState(null);
  const [productForm, setProductForm] = useState(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: "", type: "percent", value: "10" });
  const [orderQuery, setOrderQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [productQuery, setProductQuery] = useState("");
  const [productCat, setProductCat] = useState("all");
  const [customerQuery, setCustomerQuery] = useState("");
  const [payFilter, setPayFilter] = useState("all");

  useEffect(() => {
    const previous = document.title;
    document.title = "لوحة التحكم — أصل";
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => write("asl_dashboard_role", roleId), [roleId]);
  useEffect(() => {
    if (!role.tabs.includes(tab)) setTab(role.tabs[0]);
  }, [role, tab]);

  useEffect(() => write("asl_dashboard_status", statusPatch), [statusPatch]);
  useEffect(() => write("asl_dashboard_products", productState), [productState]);
  useEffect(() => write("asl_dashboard_coupons", coupons), [coupons]);
  useEffect(() => write("asl_dashboard_customer_images", customerImages), [customerImages]);
  useEffect(() => write("asl_dashboard_settings", settings), [settings]);

  const allOrders = useMemo(() => {
    const raw = [
      ...orders.map((order) => ({ ...order, demo: false, key: `r-${order.id}` })),
      ...DEMO_ORDERS.map((order) => ({ ...order, demo: true, key: `d-${order.id}` })),
    ];
    return raw
      .map((order) => ({ ...order, status: statusPatch[order.key] || order.status || "قيد التجهيز" }))
      .sort((a, b) => (b.ts || 0) - (a.ts || 0));
  }, [orders, statusPatch]);

  const customers = useMemo(() => {
    const map = new Map();
    for (const order of allOrders) {
      const key = (order.addr?.phone || order.addr?.email || order.addr?.name || "").replace(/\D/g, "") || order.addr?.name;
      if (!key) continue;
      const entry = map.get(key) || {
        key,
        name: order.addr?.name || "عميل",
        phone: order.addr?.phone || "",
        email: order.addr?.email || "",
        city: order.addr?.city || "",
        orders: 0,
        spent: 0,
        last: 0,
        list: [],
      };
      entry.orders += 1;
      entry.spent += order.status === "ملغي" ? 0 : Number(order.totals?.total) || 0;
      entry.last = Math.max(entry.last, order.ts || 0);
      entry.list.push(order);
      map.set(key, entry);
    }
    if (user) {
      const key = (user.phone || user.email || "me").replace(/\D/g, "") || "me";
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: user.name || "عميل",
          phone: user.phone || "",
          email: user.email || "",
          city: user.city || "",
          orders: 0,
          spent: 0,
          last: Date.now(),
          list: [],
        });
      }
    }
    return [...map.values()]
      .map((customer) => ({
        ...customer,
        image: customerImages[customer.key] || "",
        segment: customer.spent >= 800 ? "VIP" : customer.orders >= 2 ? "متكرر" : "جديد",
      }))
      .sort((a, b) => b.spent - a.spent);
  }, [allOrders, user, customerImages]);

  const stats = useMemo(() => {
    const valid = allOrders.filter((order) => order.status !== "ملغي");
    const revenue = valid.reduce((sum, order) => sum + (Number(order.totals?.total) || 0), 0);
    const pending = allOrders.filter((order) => order.status === "قيد التجهيز").length;
    const uniqueCustomers = new Set(allOrders.map((order) => order.addr?.phone || order.addr?.name).filter(Boolean)).size;
    return {
      revenue,
      orders: allOrders.length,
      customers: uniqueCustomers,
      pending,
      aov: valid.length ? revenue / valid.length : 0,
      real: orders.length,
    };
  }, [allOrders, orders.length]);

  const topProducts = useMemo(() => {
    const sold = new Map();
    for (const order of allOrders) {
      if (order.status === "ملغي") continue;
      for (const item of order.items || []) {
        const current = sold.get(item.id) || { qty: 0, revenue: 0 };
        sold.set(item.id, {
          qty: current.qty + (Number(item.qty) || 0),
          revenue: current.revenue + (Number(item.price) || 0) * (Number(item.qty) || 0),
        });
      }
    }
    return productState
      .map((product) => ({
        ...product,
        sold: sold.get(product.id)?.qty || 0,
        revenue: sold.get(product.id)?.revenue || 0,
      }))
      .sort((a, b) => b.sold - a.sold);
  }, [allOrders, productState]);

  const filteredOrders = useMemo(() => {
    const query = orderQuery.trim().toLowerCase();
    return allOrders.filter((order) => {
      const byStatus = statusFilter === "الكل" || order.status === statusFilter;
      const byQuery =
        !query ||
        [order.id, order.addr?.name, order.addr?.phone, order.addr?.city, order.pay]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      return byStatus && byQuery;
    });
  }, [allOrders, orderQuery, statusFilter]);

  const filteredProducts = useMemo(() => {
    const query = productQuery.trim().toLowerCase();
    return topProducts.filter((product) => {
      const byCat = productCat === "all" || product.cat === productCat;
      const byQuery = !query || product.name.toLowerCase().includes(query) || catName(product.cat).toLowerCase().includes(query);
      return byCat && byQuery;
    });
  }, [productCat, productQuery, topProducts]);

  const filteredCustomers = useMemo(() => {
    const query = customerQuery.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((customer) =>
      [customer.name, customer.phone, customer.email, customer.city].filter(Boolean).some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [customerQuery, customers]);

  const selectedOrder = dialog?.type === "order" ? allOrders.find((order) => order.key === dialog.key) : null;
  const selectedCustomer = dialog?.type === "customer" ? customers.find((customer) => customer.key === dialog.key) : null;

  const transactions = useMemo(
    () => allOrders.filter((order) => payFilter === "all" || payKey(order) === payFilter),
    [allOrders, payFilter],
  );

  const changeStatus = (order, status) => {
    if (order.status === status) return;
    setStatusPatch((current) => ({ ...current, [order.key]: status }));
    if (!order.demo) updateOrder(order.id, { status });
    ping(`تم تحديث ${order.id} إلى «${status}»${order.demo ? " — تجريبي" : ""}`);
  };

  const exportOrders = () => {
    const rows = [
      ["رقم الطلب", "العميل", "الجوال", "المدينة", "التاريخ", "طريقة الدفع", "الحالة", "الإجمالي"],
      ...allOrders.map((order) => [
        order.id,
        order.addr?.name || "",
        order.addr?.phone || "",
        order.addr?.city || "",
        fmtDate(order.ts, { day: "numeric", month: "long", year: "numeric" }),
        order.pay || "",
        order.status,
        order.totals?.total || 0,
      ]),
    ];
    const csv = "\uFEFF" + rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    download(`asl-orders-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv;charset=utf-8");
    ping("تم تصدير الطلبات إلى CSV ✓");
  };

  const exportStore = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      store: settings,
      user,
      orders: allOrders,
      products: productState,
      customers,
      coupons,
    };
    download(`asl-store-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2), "application/json");
    ping("تم تصدير نسخة كاملة من بيانات المتجر ✓");
  };

  const openOrder = (order) => setDialog({ type: "order", key: order.key });
  const openNewProduct = () => {
    setImageBusy(false);
    setProductForm({ id: null, name: "", cat: "perfume", price: "", stock: "", img: "" });
    setDialog({ type: "product" });
  };
  const openEditProduct = (product) => {
    setImageBusy(false);
    setProductForm({
      id: product.id,
      name: product.name,
      cat: product.cat,
      price: String(product.price),
      stock: String(product.stock),
      img: product.img,
    });
    setDialog({ type: "product" });
  };

  const saveProduct = () => {
    const form = productForm;
    const price = Number(form?.price);
    const stock = Number(form?.stock);
    if (imageBusy) {
      ping("انتظر لحظة — الصورة لسه بتتجهز");
      return;
    }
    if (!form?.name?.trim() || !Number.isFinite(price) || price <= 0) {
      ping("اكتب اسم المنتج وسعرًا صحيحًا");
      return;
    }
    if (form.id) {
      setProductState((list) =>
        list.map((product) =>
          product.id === form.id
            ? { ...product, name: form.name.trim(), cat: form.cat, price, stock: Math.max(0, stock || 0), img: form.img || product.img }
            : product,
        ),
      );
      ping("تم تحديث المنتج — تجريبي ✓");
    } else {
      const base = PRODUCTS[0];
      const id = Math.max(0, ...productState.map((product) => product.id)) + 1;
      setProductState((list) => [
        {
          ...base,
          id,
          name: form.name.trim(),
          cat: form.cat,
          price,
          stock: Math.max(0, stock || 0),
          old: null,
          rating: 0,
          reviews: 0,
          brief: "منتج تجريبي مضاف من لوحة التحكم",
          desc: "",
          details: [],
          colors: null,
          sizes: null,
          img: String(form.img || "").trim() || base.img,
        },
        ...list,
      ]);
      ping("تمت إضافة منتج تجريبي ✓");
    }
    setDialog(null);
  };

  const saveCoupon = () => {
    const code = couponForm.code.trim().toUpperCase();
    const value = Number(couponForm.value);
    if (code.length < 3 || !Number.isFinite(value) || value <= 0) {
      ping("أكمل كود الكوبون وقيمة الخصم");
      return;
    }
    if (coupons.some((coupon) => coupon.code === code)) {
      ping("هذا الكود موجود مسبقًا");
      return;
    }
    setCoupons((list) => [
      { code, type: couponForm.type, value, uses: 0, limit: 100, active: true, revenue: 0 },
      ...list,
    ]);
    setCouponForm({ code: "", type: "percent", value: "10" });
    setDialog(null);
    ping(`تم إنشاء الكوبون ${code} ✓`);
  };

  const toggleCoupon = (code) => {
    setCoupons((list) => list.map((coupon) => (coupon.code === code ? { ...coupon, active: !coupon.active } : coupon)));
  };

  const copyCoupon = (code) => {
    navigator.clipboard
      ?.writeText(code)
      .then(() => ping(`تم نسخ الكوبون ${code} ✓`))
      .catch(() => ping(code));
  };

  const setSetting = (key) => (event) => {
    setSettings((current) => ({
      ...current,
      [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream relative overflow-hidden">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-[30rem] h-[30rem] rounded-full bg-green2/10 blur-3xl" />
        <header className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 h-24 flex items-center justify-between">
          <Logo size={94} />
          <Link to="/" className="inline-flex items-center gap-2 text-[12px] font-black text-muted hover:text-green2 transition-colors">
            العودة للمتجر
            <Icon name="arrow" className="w-4 h-4" />
          </Link>
        </header>
        <main className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-goldsoft text-[#71540f] px-3 py-1.5 text-[11px] font-black mb-5">
              <Icon name="sparkle" className="w-3.5 h-3.5" />
              معاينة كاملة بدون إعداد
            </span>
            <h1 className="text-[34px] sm:text-[46px] leading-[1.15] font-black mb-4">
              لوحة إدارة متجرك
              <span className="block text-green2">بكل تفاصيلها.</span>
            </h1>
            <p className="text-[14px] sm:text-[15px] font-bold text-muted leading-8 max-w-lg mb-7">
              سجّل دخولك بحساب تجريبي بأي رقم، وشاهد الطلبات، المنتجات، العملاء، الكوبونات، التحليلات والمدفوعات — كل شيء مفتوح لك.
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5 mb-8 max-w-lg">
              {["إدارة الطلبات وتحديث الحالات", "متابعة المخزون والأسعار", "تحليلات التحويل والزيارات", "مدفوعات ميسر وسجل العملاء"].map((feature) => (
                <div key={feature} className="flex items-center gap-2.5 text-[12px] font-black">
                  <span className="w-5 h-5 rounded-full bg-green2 text-cream grid place-items-center shrink-0">
                    <Icon name="check" className="w-3 h-3" />
                  </span>
                  {feature}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={openAuth}
                className="inline-flex items-center gap-2 bg-green2 text-cream font-black text-[13px] px-6 py-3.5 rounded-2xl shadow-lg shadow-green2/20 cursor-pointer"
              >
                دخول لوحة التحكم
                <Icon name="arrow" className="w-4 h-4" />
              </motion.button>
              <span className="text-[11px] font-bold text-muted">أي حساب تجريبي يحصل على صلاحية مدير</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-6 bg-gold/20 blur-3xl rounded-full" />
            <div className="relative bg-white border border-line rounded-[2rem] p-5 sm:p-6 shadow-2xl shadow-ink/10 max-w-lg mr-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-black text-muted">مبيعات اليوم</p>
                  <p className="text-[28px] font-black">6,420 ر.س</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f1ee] text-green2 px-2.5 py-1 text-[10px] font-black">
                  <Icon name="arrowUp" className="w-3 h-3" />
                  18.4%
                </span>
              </div>
              <div className="h-32 flex items-end gap-2 mb-5">
                {[34, 48, 41, 62, 55, 74, 68, 86, 79, 94, 88, 100].map((height, index) => (
                  <motion.span
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.035, duration: 0.5 }}
                    className={cx("flex-1 rounded-t-lg", index > 8 ? "bg-green2" : "bg-goldsoft")}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["الطلبات", "24"],
                  ["العملاء", "18"],
                  ["التحويل", "3.8%"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-cream rounded-2xl px-3 py-3 text-center border border-line">
                    <b className="block text-[17px] font-black">{value}</b>
                    <span className="text-[9.5px] font-black text-muted">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const current = NAV.find((item) => item.id === tab) || NAV[0];
  const allowedNav = NAV.filter((item) => role.tabs.includes(item.id));
  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: allowedNav.filter((item) => item.group === group.id),
  })).filter((group) => group.items.length > 0);
  const unread = notifications.filter((item) => item.unread).length;

  const changeRole = (nextId) => {
    const nextRole = ROLE_OPTIONS.find((item) => item.id === nextId) || ROLE_OPTIONS[0];
    setRoleId(nextRole.id);
    if (!nextRole.tabs.includes(tab)) setTab(nextRole.tabs[0]);
    setRoleOpen(false);
    ping(`تم التبديل إلى «${nextRole.label}» — تجريبي`);
  };

  const closeWelcome = () => {
    write("asl_dashboard_welcome_seen", true);
    setWelcomeOpen(false);
  };

  const startTour = () => {
    setRoleId("owner");
    if (!ROLE_OPTIONS[0].tabs.includes(tab)) setTab("overview");
    setRoleOpen(false);
    setNotifOpen(false);
    setTourOpen(true);
  };

  const markAllRead = () => {
    const next = notifications.map((item) => ({ ...item, unread: false }));
    setNotifications(next);
    write("asl_dashboard_notifications", next);
  };

  const openNotification = (notification) => {
    const next = notifications.map((item) => item.id === notification.id ? { ...item, unread: false } : item);
    setNotifications(next);
    write("asl_dashboard_notifications", next);
    setNotifOpen(false);
    setTab(notification.tab);
  };

  const storeDate = new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const renderOverview = () => (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-green text-cream p-6 sm:p-7">
        <div className="absolute -top-16 -left-10 w-52 h-52 rounded-full border border-gold/20" />
        <div className="absolute -bottom-24 left-16 w-64 h-64 rounded-full border border-cream/10" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 text-goldsoft px-3 py-1 text-[10px] font-black mb-3">
              <Icon name="sparkle" className="w-3 h-3" />
              وضع العرض التجريبي
            </span>
            <h2 className="text-[21px] sm:text-[25px] leading-snug font-black">كل ميزات الإدارة مفتوحة لك</h2>
            <p className="text-[11.5px] sm:text-[12px] font-bold text-cream/70 leading-6 mt-2 max-w-2xl">
              الأرقام تشمل بيانات توضيحية + طلباتك الحقيقية المسجلة في هذا المتصفح. جرّب تحديث حالة طلب، إضافة منتج، أو إنشاء كوبون.
            </p>
          </div>
          <Link to="/shop" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-cream text-green2 px-5 py-3 text-[12px] font-black hover:bg-white transition-colors">
            معاينة المتجر
            <Icon name="store" className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="wallet" label="إجمالي الإيرادات" value={fmtMoney(stats.revenue)} sub={`${stats.orders} طلب — بما فيها الطلبات التجريبية`} trend="18.4%" />
        <StatCard icon="bag" label="الطلبات" value={riyal(stats.orders)} sub={`${stats.pending} طلب بانتظار التجهيز`} trend="12.1%" tone="gold" />
        <StatCard icon="users" label="العملاء" value={riyal(stats.customers)} sub={`${stats.real} طلب حقيقي من متصفحك`} trend="8.7%" tone="ink" />
        <StatCard icon="chart" label="متوسط قيمة الطلب" value={fmtMoney(stats.aov)} sub="نسبة التحويل 3.8% — بيانات عرض" trend="4.2%" tone="cream" />
      </div>

      <div className="grid xl:grid-cols-[1.65fr_1fr] gap-5">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <p className="text-[10.5px] font-black text-gold mb-1">آخر 14 يوم</p>
              <h3 className="text-[16px] font-black">حركة المبيعات</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cream border border-line px-3 py-1.5 text-[10px] font-black text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-green2" />
              بيانات توضيحية
            </span>
          </div>
          <SalesChart data={SALES_SERIES} />
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10.5px] font-black text-gold mb-1">الأكثر مبيعًا</p>
              <h3 className="text-[16px] font-black">المنتجات الرابحة</h3>
            </div>
            <button onClick={() => setTab("products")} className="text-[11px] font-black text-green2 hover:text-gold transition-colors cursor-pointer">
              عرض الكل
            </button>
          </div>
          <div className="space-y-3">
            {topProducts.slice(0, 4).map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="w-5 text-[10px] font-black text-muted">{index + 1}</span>
                <img src={product.img} alt="" className="w-11 h-11 rounded-xl object-cover border border-line" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-black truncate">{product.name}</p>
                  <p className="text-[10px] font-bold text-muted">{product.sold} قطعة مباعة</p>
                </div>
                <b className="text-[11px] font-black text-green2 whitespace-nowrap">{fmtMoney(product.revenue)}</b>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid xl:grid-cols-[1.65fr_1fr] gap-5">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-5 border-b border-line">
            <div>
              <p className="text-[10.5px] font-black text-gold mb-1">متابعة مباشرة</p>
              <h3 className="text-[16px] font-black">آخر الطلبات</h3>
            </div>
            <button onClick={() => setTab("orders")} className="text-[11px] font-black text-green2 hover:text-gold transition-colors cursor-pointer">
              كل الطلبات
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-right">
              <thead>
                <tr className="text-[9.5px] font-black text-muted bg-cream/60">
                  <th className="px-5 py-3">الطلب</th>
                  <th className="px-3 py-3">العميل</th>
                  <th className="px-3 py-3">الدفع</th>
                  <th className="px-3 py-3">الإجمالي</th>
                  <th className="px-3 py-3">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.slice(0, 5).map((order) => (
                  <tr key={order.key} onClick={() => openOrder(order)} className="border-t border-line/80 hover:bg-cream/60 cursor-pointer transition-colors">
                    <td className="px-5 py-3">
                      <b dir="ltr" className="block text-[11px] font-black">{order.id}</b>
                      <span className="text-[9.5px] font-bold text-muted">{fmtDate(order.ts)}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-goldsoft text-[#71540f] grid place-items-center text-[9px] font-black">{initials(order.addr?.name)}</span>
                        <div>
                          <p className="text-[11px] font-black">{order.addr?.name}</p>
                          <p className="text-[9.5px] font-bold text-muted">{order.addr?.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[10px] font-bold text-muted">{PAY_LABEL[payKey(order)]}</td>
                    <td className="px-3 py-3 text-[11px] font-black">{fmtMoney(order.totals?.total)}</td>
                    <td className="px-3 py-3"><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10.5px] font-black text-gold mb-1">طرق الدفع</p>
                <h3 className="text-[16px] font-black">توزيع المدفوعات</h3>
              </div>
              <button onClick={() => setTab("payments")} className="text-[11px] font-black text-green2 cursor-pointer">التفاصيل</button>
            </div>
            <div className="flex items-center gap-5">
              <Donut items={PAYMENT_METHODS} value="96.8%" label="نجاح" size={140} />
              <div className="space-y-2.5 flex-1">
                {PAYMENT_METHODS.map((method) => (
                  <div key={method.name} className="flex items-center justify-between gap-2 text-[10.5px] font-black">
                    <span className="flex items-center gap-1.5 text-muted">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: method.color }} />
                      {method.name}
                    </span>
                    <span>{method.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-cream border border-line px-4 py-3 flex items-center gap-2 text-[10.5px] font-black text-muted">
              <Icon name="card" className="w-4 h-4 text-gold" />
              ميسر متصل — وضع تجريبي
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[13px] font-black mb-3">اختصارات سريعة</h3>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={openNewProduct} className="rounded-2xl bg-cream border border-line py-3 px-2 text-[10px] font-black hover:border-green2 transition-colors cursor-pointer">
                <Icon name="plus" className="w-4 h-4 mx-auto mb-1.5 text-green2" />
                منتج
              </button>
              <button onClick={() => setDialog({ type: "coupon" })} className="rounded-2xl bg-cream border border-line py-3 px-2 text-[10px] font-black hover:border-green2 transition-colors cursor-pointer">
                <Icon name="tag" className="w-4 h-4 mx-auto mb-1.5 text-gold" />
                كوبون
              </button>
              <button onClick={exportOrders} className="rounded-2xl bg-cream border border-line py-3 px-2 text-[10px] font-black hover:border-green2 transition-colors cursor-pointer">
                <Icon name="download" className="w-4 h-4 mx-auto mb-1.5 text-ink" />
                تصدير
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-black text-gold mb-1">إدارة العمليات</p>
          <h2 className="text-[22px] font-black">الطلبات</h2>
          <p className="text-[11.5px] font-bold text-muted mt-1">{filteredOrders.length} طلب ظاهر من أصل {allOrders.length}</p>
        </div>
        <button onClick={exportOrders} className="inline-flex items-center gap-2 rounded-2xl bg-green2 text-cream px-4 py-2.5 text-[11.5px] font-black hover:bg-green transition-colors cursor-pointer">
          <Icon name="download" className="w-4 h-4" />
          تصدير CSV
        </button>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center gap-4 justify-between">
          <div className="relative w-full xl:max-w-xs">
            <Icon name="search" className="absolute top-1/2 -translate-y-1/2 right-3.5 w-4 h-4 text-muted" />
            <input
              value={orderQuery}
              onChange={(event) => setOrderQuery(event.target.value)}
              placeholder="ابحث برقم الطلب، الاسم، الجوال..."
              className="w-full bg-cream border border-line rounded-2xl pr-10 pl-4 py-2.5 text-[12px] font-bold outline-none focus:border-green2"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {["الكل", "قيد التجهيز", "تم الشحن", "تم التوصيل", "ملغي"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cx(
                  "shrink-0 rounded-full px-3.5 py-2 text-[10.5px] font-black transition-colors cursor-pointer",
                  statusFilter === status ? "bg-green2 text-cream" : "bg-cream border border-line text-muted hover:text-ink",
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {filteredOrders.length === 0 ? (
          <Empty icon="bag" title="ما فيه طلبات مطابقة" text="جرّب تغيير البحث أو فلتر الحالة." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[890px] text-right">
              <thead>
                <tr className="text-[9.5px] font-black text-muted bg-cream/60">
                  <th className="px-5 py-3.5">رقم الطلب</th>
                  <th className="px-3 py-3.5">العميل</th>
                  <th className="px-3 py-3.5">المدينة</th>
                  <th className="px-3 py-3.5">التاريخ</th>
                  <th className="px-3 py-3.5">الدفع</th>
                  <th className="px-3 py-3.5">الإجمالي</th>
                  <th className="px-3 py-3.5">الحالة</th>
                  <th className="px-5 py-3.5">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.key} className="border-t border-line/80 hover:bg-cream/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <b dir="ltr" className="block text-[11.5px] font-black">{order.id}</b>
                      <span className="text-[9px] font-black text-gold">{order.demo ? "بيانات عرض" : "طلب حقيقي"}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <p className="text-[11.5px] font-black">{order.addr?.name}</p>
                      <p dir="ltr" className="text-[9.5px] font-bold text-muted text-right">{order.addr?.phone}</p>
                    </td>
                    <td className="px-3 py-3.5 text-[10.5px] font-bold text-muted">{order.addr?.city}</td>
                    <td className="px-3 py-3.5 text-[10.5px] font-bold text-muted">{fmtDate(order.ts)}</td>
                    <td className="px-3 py-3.5 text-[10.5px] font-bold text-muted">{PAY_LABEL[payKey(order)]}</td>
                    <td className="px-3 py-3.5 text-[11.5px] font-black">{fmtMoney(order.totals?.total)}</td>
                    <td className="px-3 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => openOrder(order)} className="rounded-xl border border-line bg-white px-3 py-1.5 text-[10px] font-black hover:border-green2 transition-colors cursor-pointer">
                        تفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-black text-gold mb-1">الكاتالوج والمخزون</p>
          <h2 className="text-[22px] font-black">المنتجات</h2>
          <p className="text-[11.5px] font-bold text-muted mt-1">{filteredProducts.length} منتج — التعديلات هنا تجريبية داخل اللوحة</p>
        </div>
        <button onClick={openNewProduct} className="inline-flex items-center gap-2 rounded-2xl bg-green2 text-cream px-4 py-2.5 text-[11.5px] font-black hover:bg-green transition-colors cursor-pointer">
          <Icon name="plus" className="w-4 h-4" />
          إضافة منتج
        </button>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Icon name="search" className="absolute top-1/2 -translate-y-1/2 right-3.5 w-4 h-4 text-muted" />
            <input
              value={productQuery}
              onChange={(event) => setProductQuery(event.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full bg-cream border border-line rounded-2xl pr-10 pl-4 py-2.5 text-[12px] font-bold outline-none focus:border-green2"
            />
          </div>
          <select value={productCat} onChange={(event) => setProductCat(event.target.value)} className="bg-cream border border-line rounded-2xl px-4 py-2.5 text-[11.5px] font-black outline-none focus:border-green2 cursor-pointer">
            <option value="all">كل التصنيفات</option>
            <option value="perfume">عطور</option>
            <option value="oud">بخور وشموع</option>
            <option value="gift">هدايا</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-right">
            <thead>
              <tr className="text-[9.5px] font-black text-muted bg-cream/60">
                <th className="px-5 py-3.5">المنتج</th>
                <th className="px-3 py-3.5">التصنيف</th>
                <th className="px-3 py-3.5">السعر</th>
                <th className="px-3 py-3.5">المخزون</th>
                <th className="px-3 py-3.5">المبيعات</th>
                <th className="px-3 py-3.5">التوفر</th>
                <th className="px-5 py-3.5">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t border-line/80 hover:bg-cream/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={product.img} alt="" className="w-11 h-11 rounded-xl object-cover border border-line" loading="lazy" />
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-black truncate max-w-[260px]">{product.name}</p>
                        <p className="text-[9.5px] font-bold text-muted">#{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-[10.5px] font-bold text-muted">{catName(product.cat)}</td>
                  <td className="px-3 py-3.5 text-[11.5px] font-black">{fmtMoney(product.price)}</td>
                  <td className="px-3 py-3.5 text-[11px] font-black">{product.stock}</td>
                  <td className="px-3 py-3.5">
                    <p className="text-[11px] font-black">{product.sold} قطعة</p>
                    <p className="text-[9.5px] font-bold text-muted">{fmtMoney(product.revenue)}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={cx("rounded-full px-2.5 py-1 text-[9.5px] font-black", product.stock === 0 ? "bg-[#fbe9e6] text-[#a33b2c]" : product.stock < 10 ? "bg-goldsoft/80 text-[#71540f]" : "bg-[#e8f1ee] text-green2")}>
                      {product.stock === 0 ? "نفد" : product.stock < 10 ? "منخفض" : "متوفر"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => openEditProduct(product)} className="rounded-xl border border-line bg-white px-3 py-1.5 text-[10px] font-black hover:border-green2 transition-colors cursor-pointer">
                      تعديل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-black text-gold mb-1">قاعدة العلاقات</p>
          <h2 className="text-[22px] font-black">العملاء</h2>
          <p className="text-[11.5px] font-bold text-muted mt-1">{filteredCustomers.length} عميل — مرتبين حسب قيمة الشراء</p>
        </div>
        <div className="flex gap-2">
          {[
            { label: "VIP", value: customers.filter((customer) => customer.segment === "VIP").length, cls: "bg-goldsoft text-[#71540f]" },
            { label: "متكرر", value: customers.filter((customer) => customer.segment === "متكرر").length, cls: "bg-[#e8f1ee] text-green2" },
            { label: "جديد", value: customers.filter((customer) => customer.segment === "جديد").length, cls: "bg-cream border border-line text-muted" },
          ].map((segment) => (
            <span key={segment.label} className={cx("rounded-2xl px-3 py-2 text-[10.5px] font-black", segment.cls)}>
              {segment.label} · {segment.value}
            </span>
          ))}
        </div>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="relative w-full sm:max-w-xs">
          <Icon name="search" className="absolute top-1/2 -translate-y-1/2 right-3.5 w-4 h-4 text-muted" />
          <input
            value={customerQuery}
            onChange={(event) => setCustomerQuery(event.target.value)}
            placeholder="ابحث بالاسم، الجوال، المدينة..."
            className="w-full bg-cream border border-line rounded-2xl pr-10 pl-4 py-2.5 text-[12px] font-bold outline-none focus:border-green2"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-right">
            <thead>
              <tr className="text-[9.5px] font-black text-muted bg-cream/60">
                <th className="px-5 py-3.5">العميل</th>
                <th className="px-3 py-3.5">التواصل</th>
                <th className="px-3 py-3.5">المدينة</th>
                <th className="px-3 py-3.5">الطلبات</th>
                <th className="px-3 py-3.5">إجمالي الشراء</th>
                <th className="px-3 py-3.5">آخر طلب</th>
                <th className="px-3 py-3.5">الشريحة</th>
                <th className="px-5 py-3.5">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.key} className="border-t border-line/80 hover:bg-cream/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {customer.image ? (
                        <img src={customer.image} alt={customer.name} className="w-9 h-9 rounded-full object-cover border border-line" />
                      ) : (
                        <span className="w-9 h-9 rounded-full bg-green2 text-cream grid place-items-center text-[10px] font-black">{initials(customer.name)}</span>
                      )}
                      <div>
                        <p className="text-[11.5px] font-black">{customer.name}</p>
                        <p className="text-[9px] font-bold text-muted">{customer.email || "بدون بريد"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-[10.5px] font-bold text-muted" dir="ltr">{customer.phone}</td>
                  <td className="px-3 py-3.5 text-[10.5px] font-bold text-muted">{customer.city || "—"}</td>
                  <td className="px-3 py-3.5 text-[11px] font-black">{customer.orders}</td>
                  <td className="px-3 py-3.5 text-[11px] font-black text-green2">{fmtMoney(customer.spent)}</td>
                  <td className="px-3 py-3.5 text-[10.5px] font-bold text-muted">{customer.orders ? fmtDate(customer.last) : "—"}</td>
                  <td className="px-3 py-3.5">
                    <span className={cx("rounded-full px-2.5 py-1 text-[9.5px] font-black", customer.segment === "VIP" ? "bg-goldsoft text-[#71540f]" : customer.segment === "متكرر" ? "bg-[#e8f1ee] text-green2" : "bg-cream border border-line text-muted")}>
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setDialog({ type: "customer", key: customer.key })} className="rounded-xl border border-line bg-white px-3 py-1.5 text-[10px] font-black hover:border-green2 transition-colors cursor-pointer">
                      الملف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderDiscounts = () => (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-black text-gold mb-1">تحفيز المبيعات</p>
          <h2 className="text-[22px] font-black">الخصومات والكوبونات</h2>
          <p className="text-[11.5px] font-bold text-muted mt-1">أنشئ كوبونًا، فعّله أو أوقفه، وانسخه بضغطة واحدة.</p>
        </div>
        <button onClick={() => setDialog({ type: "coupon" })} className="inline-flex items-center gap-2 rounded-2xl bg-green2 text-cream px-4 py-2.5 text-[11.5px] font-black hover:bg-green transition-colors cursor-pointer">
          <Icon name="plus" className="w-4 h-4" />
          كوبون جديد
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="tag" label="كوبونات نشطة" value={riyal(coupons.filter((coupon) => coupon.active).length)} sub={`من أصل ${coupons.length} كوبون`} tone="gold" />
        <StatCard icon="check" label="مرات الاستخدام" value={riyal(coupons.reduce((sum, coupon) => sum + coupon.uses, 0))} sub="عبر جميع الكوبونات" />
        <StatCard icon="wallet" label="إيرادات الكوبونات" value={fmtMoney(coupons.reduce((sum, coupon) => sum + coupon.revenue, 0))} sub="تقديري — بيانات عرض" tone="ink" />
        <StatCard icon="trend" label="متوسط الخصم" value={`${Math.round(coupons.reduce((sum, coupon) => sum + Number(coupon.value), 0) / Math.max(coupons.length, 1))}%`} sub="الكوبونات الحالية" tone="cream" />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.code} className={cx("p-5 relative overflow-hidden", !coupon.active && "opacity-70")}>
            <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-gold/10" />
            <div className="relative flex items-start justify-between gap-3 mb-4">
              <span className={cx("rounded-full px-2.5 py-1 text-[9.5px] font-black", coupon.active ? "bg-[#e8f1ee] text-green2" : "bg-cream border border-line text-muted")}>
                {coupon.active ? "نشط" : "متوقف"}
              </span>
              <button onClick={() => toggleCoupon(coupon.code)} className="text-[10px] font-black text-muted hover:text-ink cursor-pointer">
                {coupon.active ? "إيقاف" : "تفعيل"}
              </button>
            </div>
            <div className="relative border border-dashed border-gold/60 rounded-2xl bg-goldsoft/30 px-4 py-4 text-center mb-4">
              <p dir="ltr" className="text-[18px] font-black tracking-[0.16em] text-green2">{coupon.code}</p>
              <p className="text-[10.5px] font-black text-muted mt-1">
                {coupon.type === "percent" ? `خصم ${coupon.value}%` : `خصم ${coupon.value} ر.س`}
              </p>
            </div>
            <div className="relative flex items-center justify-between text-[10.5px] font-black mb-3">
              <span className="text-muted">الاستخدام</span>
              <span>{coupon.uses} / {coupon.limit}</span>
            </div>
            <div className="relative h-2 rounded-full bg-cream overflow-hidden mb-4">
              <div className="h-full rounded-full bg-green2" style={{ width: `${Math.min((coupon.uses / Math.max(coupon.limit, 1)) * 100, 100)}%` }} />
            </div>
            <button onClick={() => copyCoupon(coupon.code)} className="relative w-full rounded-2xl bg-cream border border-line py-2.5 text-[10.5px] font-black hover:border-green2 transition-colors cursor-pointer">
              نسخ الكود
            </button>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-black text-gold mb-1">قراءة الأرقام</p>
          <h2 className="text-[22px] font-black">التحليلات</h2>
          <p className="text-[11.5px] font-bold text-muted mt-1">آخر 14 يوم — بيانات توضيحية لمعاينة التقارير.</p>
        </div>
        <select className="bg-white border border-line rounded-2xl px-4 py-2.5 text-[11.5px] font-black outline-none focus:border-green2 cursor-pointer">
          <option>آخر 14 يوم</option>
          <option>آخر 30 يوم</option>
          <option>هذا الشهر</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="users" label="الزيارات" value="12,480" sub="جلسات فريدة" trend="22.6%" />
        <StatCard icon="trend" label="نسبة التحويل" value="3.8%" sub="474 طلب من 12,480 زيارة" trend="0.6%" tone="gold" />
        <StatCard icon="clock" label="متوسط الجلسة" value="1:42" sub="دقيقة — تجريبي" trend="9.2%" tone="ink" />
        <StatCard icon="chart" label="معدل الارتداد" value="32%" sub="أقل من متوسط السوق" trend="3.1%" tone="cream" />
      </div>

      <div className="grid xl:grid-cols-2 gap-5">
        <Card className="p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-[10.5px] font-black text-gold mb-1">اكتساب الزيارات</p>
            <h3 className="text-[16px] font-black">مصادر الزيارات</h3>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-7">
            <Donut items={TRAFFIC_SOURCES} value="12.4K" label="زيارة" />
            <div className="flex-1 w-full"><SourceBars items={TRAFFIC_SOURCES} /></div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-[10.5px] font-black text-gold mb-1">رحلة الشراء</p>
            <h3 className="text-[16px] font-black">مسار التحويل</h3>
          </div>
          <div className="space-y-3.5">
            {FUNNEL.map((step, index) => (
              <div key={step.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-black">{step.label}</span>
                  <span className="text-[10px] font-black text-muted">{riyal(step.value)} · {step.pct}%</span>
                </div>
                <div className="h-8 rounded-xl bg-cream overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(step.pct, 3)}%` }}
                    transition={{ delay: index * 0.08, duration: 0.7 }}
                    className={cx("h-full rounded-xl flex items-center justify-end pl-2", index === 0 ? "bg-green2" : index === FUNNEL.length - 1 ? "bg-gold" : "bg-green2/75")}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid xl:grid-cols-[1.4fr_1fr] gap-5">
        <Card className="p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-[10.5px] font-black text-gold mb-1">الأداء</p>
            <h3 className="text-[16px] font-black">حركة المبيعات</h3>
          </div>
          <SalesChart data={SALES_SERIES} />
        </Card>
        <Card className="overflow-hidden">
          <div className="px-5 sm:px-6 py-5 border-b border-line">
            <p className="text-[10.5px] font-black text-gold mb-1">المحتوى</p>
            <h3 className="text-[16px] font-black">أفضل الصفحات</h3>
          </div>
          <div className="divide-y divide-line/80">
            {TOP_PAGES.map((page) => (
              <div key={page.path} className="px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11.5px] font-black">{page.title}</p>
                  <p dir="ltr" className="text-[9.5px] font-bold text-muted text-right">{page.path}</p>
                </div>
                <div className="text-left">
                  <p className="text-[10.5px] font-black">{riyal(page.views)}</p>
                  <p className="text-[9px] font-black text-green2">{page.conversion}% تحويل</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 sm:px-6 py-4 bg-cream/70 border-t border-line">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10.5px] font-black text-muted">الأجهزة</span>
              <div className="flex gap-2">
                {DEVICES.map((device) => (
                  <span key={device.name} className="rounded-full bg-white border border-line px-2 py-1 text-[9px] font-black">{device.name} {device.value}%</span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-black text-gold mb-1">ميسر</p>
          <h2 className="text-[22px] font-black">المدفوعات</h2>
          <p className="text-[11.5px] font-bold text-muted mt-1">وضع تجريبي — لا يتم سحب أي مبالغ حقيقية.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-goldsoft px-3.5 py-2 text-[10.5px] font-black text-[#71540f]">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          Test Mode
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="wallet" label="المبالغ المعالجة" value={fmtMoney(allOrders.filter((order) => order.payment?.status === "paid").reduce((sum, order) => sum + (order.totals?.total || 0), 0))} sub="مدفوعات إلكترونية ناجحة" tone="green" />
        <StatCard icon="check" label="نسبة النجاح" value="96.8%" sub="آخر 14 يوم — تجريبي" trend="1.2%" tone="gold" />
        <StatCard icon="fresh" label="الاستردادات" value="0" sub="لا توجد استردادات" tone="ink" />
        <StatCard icon="card" label="متوسط الدفعة" value={fmtMoney(allOrders.filter((order) => order.payment?.status === "paid").reduce((sum, order) => sum + (order.totals?.total || 0), 0) / Math.max(allOrders.filter((order) => order.payment?.status === "paid").length, 1))} sub="للطلبات الإلكترونية" tone="cream" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { icon: "card", title: "Moyasar", value: "متصل — Test Mode", sub: "بطاقات مدى / Visa و STC Pay", ok: true },
          { icon: "bell", title: "Resend", value: "متصل", sub: "no-reply@boslatech.com", ok: true },
          { icon: "bag", title: "الدفع عند الاستلام", value: "مفعّل", sub: "متاح داخل صفحة الدفع", ok: true },
        ].map((gateway) => (
          <Card key={gateway.title} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="w-10 h-10 rounded-2xl bg-cream border border-line grid place-items-center text-green2">
                <Icon name={gateway.icon} className="w-[18px] h-[18px]" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f1ee] px-2.5 py-1 text-[9.5px] font-black text-green2">
                <span className="w-1.5 h-1.5 rounded-full bg-green2" />
                {gateway.value}
              </span>
            </div>
            <h3 className="text-[13.5px] font-black mt-4">{gateway.title}</h3>
            <p className="text-[10.5px] font-bold text-muted mt-0.5">{gateway.sub}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-5 border-b border-line">
          <div>
            <p className="text-[10.5px] font-black text-gold mb-1">سجل المعاملات</p>
            <h3 className="text-[16px] font-black">آخر المدفوعات</h3>
          </div>
          <select value={payFilter} onChange={(event) => setPayFilter(event.target.value)} className="bg-cream border border-line rounded-2xl px-3.5 py-2 text-[10.5px] font-black outline-none focus:border-green2 cursor-pointer">
            <option value="all">كل الطرق</option>
            <option value="card">بطاقة / مدى</option>
            <option value="stcpay">STC Pay</option>
            <option value="cod">عند الاستلام</option>
            <option value="bank">تحويل بنكي</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-right">
            <thead>
              <tr className="text-[9.5px] font-black text-muted bg-cream/60">
                <th className="px-5 py-3.5">الطلب</th>
                <th className="px-3 py-3.5">المرجع</th>
                <th className="px-3 py-3.5">العميل</th>
                <th className="px-3 py-3.5">الطريقة</th>
                <th className="px-3 py-3.5">المبلغ</th>
                <th className="px-3 py-3.5">التاريخ</th>
                <th className="px-5 py-3.5">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((order) => (
                <tr key={order.key} onClick={() => openOrder(order)} className="border-t border-line/80 hover:bg-cream/50 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5">
                    <b dir="ltr" className="text-[11px] font-black">{order.id}</b>
                    <p className="text-[9px] font-black text-gold">{order.demo ? "بيانات عرض" : "طلب حقيقي"}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <span dir="ltr" className="text-[9.5px] font-bold text-muted">{order.payment?.id || "—"}</span>
                  </td>
                  <td className="px-3 py-3.5 text-[10.5px] font-black">{order.addr?.name}</td>
                  <td className="px-3 py-3.5 text-[10.5px] font-bold text-muted">{PAY_LABEL[payKey(order)]}</td>
                  <td className="px-3 py-3.5 text-[11px] font-black">{fmtMoney(order.totals?.total)}</td>
                  <td className="px-3 py-3.5 text-[10px] font-bold text-muted">{fmtDateTime(order.ts)}</td>
                  <td className="px-5 py-3.5">
                    <span className={cx("rounded-full px-2.5 py-1 text-[9.5px] font-black", order.payment?.status === "paid" || payKey(order) === "cod" ? "bg-[#e8f1ee] text-green2" : "bg-goldsoft text-[#71540f]")}>
                      {order.payment?.status === "paid" ? "مدفوع" : payKey(order) === "cod" ? "عند الاستلام" : "بانتظار الدفع"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-5">
      <div>
        <p className="text-[10.5px] font-black text-gold mb-1">التحكم الكامل</p>
        <h2 className="text-[22px] font-black">الإعدادات</h2>
        <p className="text-[11.5px] font-bold text-muted mt-1">إعدادات المتجر، الشحن، والتكاملات — محفوظة في هذا المتصفح.</p>
      </div>

      <div className="grid xl:grid-cols-2 gap-5">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-9 h-9 rounded-2xl bg-[#e8f1ee] text-green2 grid place-items-center"><Icon name="store" className="w-4 h-4" /></span>
            <div>
              <h3 className="text-[14px] font-black">بيانات المتجر</h3>
              <p className="text-[10px] font-bold text-muted">تظهر في الفواتير ورسائل العملاء</p>
            </div>
          </div>
          <div className="mb-4">
            <ImageUploader
              title="شعار المتجر"
              value={settings.logo || ""}
              onChange={(image) => setSettings((current) => ({ ...current, logo: image }))}
              onError={ping}
              hint="يظهر في قائمة لوحة التحكم — رابط أو رفع مباشر"
              previewAlt="معاينة شعار المتجر"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="اسم المتجر"><input value={settings.storeName} onChange={setSetting("storeName")} className={inputCls} /></Field>
            <Field label="المدينة"><input value={settings.city} onChange={setSetting("city")} className={inputCls} /></Field>
            <Field label="البريد الإلكتروني"><input dir="ltr" value={settings.email} onChange={setSetting("email")} className={cx(inputCls, "text-left")} /></Field>
            <Field label="جوال المتجر"><input dir="ltr" value={settings.phone} onChange={setSetting("phone")} className={cx(inputCls, "text-left")} /></Field>
          </div>
          <button onClick={() => ping("تم حفظ بيانات المتجر ✓")} className="mt-5 w-full rounded-2xl bg-green2 text-cream py-3 text-[12px] font-black hover:bg-green transition-colors cursor-pointer">
            حفظ البيانات
          </button>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-9 h-9 rounded-2xl bg-goldsoft text-[#71540f] grid place-items-center"><Icon name="box" className="w-4 h-4" /></span>
            <div>
              <h3 className="text-[14px] font-black">الشحن والدفع</h3>
              <p className="text-[10px] font-bold text-muted">قواعد السلة وصفحة الدفع</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Field label="شحن مجاني فوق (ر.س)"><input type="number" value={settings.freeShip} onChange={setSetting("freeShip")} className={inputCls} /></Field>
            <Field label="تكلفة الشحن (ر.س)"><input type="number" value={settings.shipCost} onChange={setSetting("shipCost")} className={inputCls} /></Field>
          </div>
          <Toggle checked={settings.cod} onChange={(value) => setSettings((current) => ({ ...current, cod: value }))} label="الدفع عند الاستلام" desc="إظهار الخيار داخل صفحة الدفع" />
          <Toggle checked={settings.pickup} onChange={(value) => setSettings((current) => ({ ...current, pickup: value }))} label="الاستلام من المتجر" desc="خيار استلام محلي — تجريبي" />
          <Toggle checked={settings.notes} onChange={(value) => setSettings((current) => ({ ...current, notes: value }))} label="ملاحظات الطلب" desc="السماح للعميل بإضافة ملاحظة" />
          <Toggle checked={settings.notify} onChange={(value) => setSettings((current) => ({ ...current, notify: value }))} label="إشعارات الطلب" desc="إرسال بريد تأكيد بعد الدفع" />
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-9 h-9 rounded-2xl bg-cream border border-line text-green2 grid place-items-center"><Icon name="card" className="w-4 h-4" /></span>
            <div>
              <h3 className="text-[14px] font-black">التكاملات</h3>
              <p className="text-[10px] font-bold text-muted">حالة الخدمات المتصلة</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { name: "Moyasar", status: "Test Mode", detail: "بطاقات + STC Pay", color: "bg-goldsoft text-[#71540f]" },
              { name: "Resend", status: "متصل", detail: "بريد الطلبات واستعادة كلمة المرور", color: "bg-[#e8f1ee] text-green2" },
              { name: "WhatsApp", status: "متصل", detail: "+966 576 944 605", color: "bg-[#e8f1ee] text-green2" },
            ].map((integration) => (
              <div key={integration.name} className="flex items-center justify-between gap-3 rounded-2xl bg-cream border border-line px-4 py-3">
                <div>
                  <p className="text-[11.5px] font-black">{integration.name}</p>
                  <p className="text-[9.5px] font-bold text-muted">{integration.detail}</p>
                </div>
                <span className={cx("rounded-full px-2.5 py-1 text-[9px] font-black", integration.color)}>{integration.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-9 h-9 rounded-2xl bg-green2 text-cream grid place-items-center"><Icon name="users" className="w-4 h-4" /></span>
            <div>
              <h3 className="text-[14px] font-black">حساب المدير</h3>
              <p className="text-[10px] font-bold text-muted">صلاحية كاملة في وضع العرض</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-cream border border-line p-4 mb-4">
            <span className="w-12 h-12 rounded-2xl bg-green2 text-cream grid place-items-center text-[14px] font-black">{initials(user.name)}</span>
            <div className="min-w-0">
              <p className="text-[13px] font-black truncate">{user.name}</p>
              <p dir="ltr" className="text-[10px] font-bold text-muted truncate text-right">{user.email || user.phone}</p>
            </div>
            <span className="mr-auto rounded-full bg-goldsoft px-2.5 py-1 text-[9px] font-black text-[#71540f]">Admin</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={exportStore} className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-cream border border-line py-2.5 text-[10.5px] font-black hover:border-green2 transition-colors cursor-pointer">
              <Icon name="download" className="w-4 h-4" />
              تصدير بيانات المتجر
            </button>
            <button onClick={logout} className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#fbe9e6] text-[#a33b2c] py-2.5 text-[10.5px] font-black hover:bg-[#f8ddd8] transition-colors cursor-pointer">
              <Icon name="logout" className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </Card>
      </div>
    </div>
  );

  const section = {
    overview: renderOverview,
    orders: renderOrders,
    products: renderProducts,
    customers: renderCustomers,
    discounts: renderDiscounts,
    analytics: renderAnalytics,
    payments: renderPayments,
    settings: renderSettings,
    sales: () => <SalesSection onNavigate={setTab} />,
    marketing: () => <MarketingSection onNavigate={setTab} />,
    affiliates: () => <AffiliatesSection onRoleChange={changeRole} onNavigate={setTab} />,
    "affiliate-portal": () => <AffiliatePortal onNavigate={setTab} />,
    growth: () => <GrowthSection onNavigate={setTab} />,
    team: () => <TeamSection onNavigate={setTab} currentRoleId={roleId} />,
    audit: () => <AuditSection />,
    help: () => <HelpCenter onNavigate={setTab} onStartTour={startTour} currentRole={role} />,
  }[tab];

  return (
    <div className="min-h-screen bg-cream text-ink">
      <aside className="fixed inset-y-0 right-0 z-40 hidden lg:flex w-[17.5rem] flex-col bg-white border-l border-line">
        <Link to="/dashboard" className="px-6 pt-6 pb-5 border-b border-line">
          {settings.logo ? (
            <img src={settings.logo} alt={settings.storeName} className="h-[86px] w-auto max-w-[150px] object-contain" />
          ) : (
            <Logo size={86} />
          )}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[13px] font-black">لوحة التحكم</span>
            <span className="rounded-full bg-goldsoft px-2 py-0.5 text-[8.5px] font-black text-[#71540f]">تجريبي</span>
          </div>
        </Link>
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-4">
          {visibleGroups.map((group) => (
            <div key={group.id}>
              <p className="px-3 mb-2 text-[9px] font-black text-muted tracking-wider">{group.label}</p>
              <nav className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    data-tour={item.id}
                    onClick={() => setTab(item.id)}
                    className={cx(
                      "w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-right transition-colors cursor-pointer group",
                      tab === item.id ? "bg-green2 text-cream shadow-lg shadow-green2/15" : "text-muted hover:bg-cream hover:text-ink",
                    )}
                  >
                    <span className={cx("w-8 h-8 rounded-xl grid place-items-center shrink-0", tab === item.id ? "bg-cream/10 text-goldsoft" : "bg-cream text-muted group-hover:text-green2")}>
                      <Icon name={item.icon} className="w-4 h-4" />
                    </span>
                    <span className="flex-1 text-[12px] font-black">{item.label}</span>
                    {item.id === "orders" && stats.pending > 0 && (
                      <span className={cx("min-w-5 h-5 px-1 rounded-full grid place-items-center text-[9px] font-black", tab === item.id ? "bg-gold text-white" : "bg-goldsoft text-[#71540f]")}>
                        {stats.pending}
                      </span>
                    )}
                    {item.id === "affiliates" && unread > 0 && (
                      <span className={cx("min-w-5 h-5 px-1 rounded-full grid place-items-center text-[9px] font-black", tab === item.id ? "bg-gold text-white" : "bg-goldsoft text-[#71540f]")}>{unread}</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-line">
          <div className="rounded-2xl bg-green text-cream p-4 mb-3">
            <div className="flex items-center gap-2 text-goldsoft mb-1.5">
              <Icon name="sparkle" className="w-3.5 h-3.5" />
              <span className="text-[9.5px] font-black">نسخة تجريبية كاملة</span>
            </div>
            <p className="text-[10px] font-bold text-cream/70 leading-5">كل الميزات مفتوحة للمعاينة. لا توجد أي رسوم أو اشتراكات.</p>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl hover:bg-cream transition-colors p-2">
            <span className="w-9 h-9 rounded-full bg-green2 text-cream grid place-items-center text-[10px] font-black">{initials(user.name)}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black truncate">{user.name}</p>
              <p className="text-[9px] font-bold text-muted">{role.label} — تجريبي</p>
            </div>
            <button onClick={logout} className="w-8 h-8 grid place-items-center rounded-xl text-muted hover:text-[#a33b2c] hover:bg-[#fbe9e6] transition-colors cursor-pointer" aria-label="تسجيل الخروج">
              <Icon name="logout" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pr-[17.5rem]">
        <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-xl border-b border-line">
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 xl:px-8 h-[70px] flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[16px] sm:text-[18px] font-black leading-tight truncate">{current.label}</h1>
              <p className="text-[9.5px] sm:text-[10px] font-bold text-muted mt-0.5 truncate">{current.hint}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-white border border-line px-3 py-1.5 text-[9.5px] font-black text-muted">
                <Icon name="clock" className="w-3.5 h-3.5 text-gold" />
                {storeDate}
              </span>
              <Link to="/" aria-label="العودة للمتجر" className="inline-flex items-center gap-1.5 rounded-2xl bg-white border border-line px-3.5 py-2 text-[10.5px] font-black text-muted hover:text-green2 hover:border-green2 transition-colors">
                <Icon name="store" className="w-4 h-4" />
                <span className="hidden sm:inline">المتجر</span>
              </Link>
              <button onClick={() => setNotifOpen(true)} className="relative w-10 h-10 grid place-items-center rounded-2xl bg-white border border-line text-muted hover:text-green2 hover:border-green2 transition-colors cursor-pointer" aria-label="إشعارات">
                <Icon name="bell" className="w-[18px] h-[18px]" />
                {unread > 0 && <span className="absolute -top-1 -left-1 min-w-4 h-4 px-1 rounded-full bg-gold text-white grid place-items-center text-[8px] font-black">{unread}</span>}
              </button>
              <div className="relative">
                <button onClick={() => setRoleOpen((current) => !current)} className="flex items-center gap-2 rounded-2xl bg-white border border-line px-2 py-1.5 hover:border-green2 transition-colors cursor-pointer" aria-label="تبديل الدور">
                  <span className="w-8 h-8 rounded-xl bg-green2 text-cream grid place-items-center"><Icon name="shield" className="w-4 h-4" /></span>
                  <span className="hidden sm:block text-right leading-tight">
                    <span className="block text-[8px] font-black text-muted">عرض كـ</span>
                    <span className="block text-[10px] font-black">{role.label}</span>
                  </span>
                  <Icon name="arrow" className={cx("w-3.5 h-3.5 text-muted transition-transform", roleOpen ? "-rotate-90" : "rotate-90")} />
                </button>
                {roleOpen && (
                  <>
                    <button className="fixed inset-0 z-[60] cursor-default" onClick={() => setRoleOpen(false)} aria-label="إغلاق قائمة الأدوار" />
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="absolute left-0 top-[calc(100%+8px)] z-[70] w-[290px] bg-cream border border-line rounded-[1.5rem] shadow-2xl p-2.5">
                      <div className="px-2.5 py-2 border-b border-line mb-1.5">
                        <p className="text-[9px] font-black text-gold">معاينة الصلاحيات</p>
                        <p className="text-[11px] font-black mt-0.5">{role.desc}</p>
                      </div>
                      <div className="max-h-[310px] overflow-y-auto no-scrollbar space-y-1">
                        {ROLE_OPTIONS.map((item) => (
                          <button key={item.id} onClick={() => changeRole(item.id)} className={cx("w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-right transition-colors cursor-pointer", item.id === role.id ? "bg-[#e8f1ee]" : "hover:bg-white")}>
                            <span className={cx("w-7 h-7 rounded-lg grid place-items-center shrink-0", item.id === role.id ? "bg-green2 text-cream" : "bg-white border border-line text-muted")}>
                              <Icon name={item.id === "affiliate" ? "link" : item.id === "marketing" ? "sparkle" : item.id === "sales" ? "target" : item.id === "support" ? "message" : item.id === "analyst" ? "chart" : "shield"} className="w-3.5 h-3.5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-1.5"><b className="text-[10.5px] font-black">{item.label}</b><span className="text-[7.5px] font-black text-muted">{item.short}</span></span>
                              <span className="block text-[8.5px] font-bold text-muted truncate">{item.desc}</span>
                            </span>
                            {item.id === role.id && <Icon name="check" className="w-3.5 h-3.5 text-green2 shrink-0" />}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-line mt-1.5 pt-1.5">
                        <button onClick={() => { setRoleOpen(false); logout(); }} className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-right text-[#a33b2c] hover:bg-[#fbe9e6] transition-colors cursor-pointer">
                          <Icon name="logout" className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black">تسجيل الخروج</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {notifOpen && (
          <>
            <button className="fixed inset-0 z-[70] cursor-default" onClick={() => setNotifOpen(false)} aria-label="إغلاق الإشعارات" />
            <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="fixed top-[76px] right-4 sm:right-[18.5rem] z-[75] w-[calc(100vw-2rem)] sm:w-[340px] bg-cream border border-line rounded-[1.5rem] shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between gap-2 px-4 py-3.5 border-b border-line">
                <div>
                  <p className="text-[9px] font-black text-gold">الإشعارات</p>
                  <p className="text-[12px] font-black">{unread} غير مقروء</p>
                </div>
                <button onClick={markAllRead} className="text-[9px] font-black text-green2 hover:text-gold cursor-pointer">تحديد الكل كمقروء</button>
              </div>
              <div className="max-h-[380px] overflow-y-auto no-scrollbar divide-y divide-line/80">
                {notifications.map((notification) => (
                  <button key={notification.id} onClick={() => openNotification(notification)} className="w-full flex items-start gap-2.5 px-4 py-3 text-right hover:bg-white transition-colors cursor-pointer">
                    <span className={cx("w-7 h-7 rounded-xl grid place-items-center shrink-0 mt-0.5", notification.tone === "gold" ? "bg-goldsoft text-[#71540f]" : notification.tone === "green" ? "bg-[#e8f1ee] text-green2" : "bg-cream text-muted")}>
                      <Icon name={notification.tab === "affiliates" ? "card" : notification.tab === "sales" ? "target" : notification.tab === "marketing" ? "sparkle" : "users"} className="w-3.5 h-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <b className="text-[10.5px] font-black truncate">{notification.title}</b>
                        {notification.unread && <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />}
                      </span>
                      <span className="block text-[9.5px] font-bold text-muted mt-0.5 leading-4">{notification.body}</span>
                      <span className="block text-[8.5px] font-bold text-muted/70 mt-0.5">{timeAgo(notification.ts)}</span>
                    </span>
                  </button>
                ))}
              </div>
              <button onClick={() => { setNotifOpen(false); setTab("help"); }} className="w-full border-t border-line py-2.5 text-[9.5px] font-black text-green2 hover:bg-white transition-colors cursor-pointer">فتح مركز المساعدة</button>
            </motion.div>
          </>
        )}

        <div className="lg:hidden sticky top-[70px] z-20 bg-cream/95 backdrop-blur border-b border-line">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 py-2.5">
            {allowedNav.map((item) => (
              <button
                key={item.id}
                data-tour={item.id}
                onClick={() => setTab(item.id)}
                className={cx(
                  "shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[10.5px] font-black transition-colors cursor-pointer",
                  tab === item.id ? "bg-green2 text-cream" : "bg-white border border-line text-muted",
                )}
              >
                <Icon name={item.icon} className="w-3.5 h-3.5" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <main className="max-w-[1500px] mx-auto px-4 sm:px-6 xl:px-8 py-5 sm:py-7">
          {section?.()}
          <p className="text-center text-[9.5px] font-bold text-muted/70 mt-8">
            لوحة تحكم تجريبية — البيانات التوضيحية للأرقام والرسوم، وطلباتك الحقيقية محفوظة في هذا المتصفح.
          </p>
        </main>
        <HelpDock onNavigate={setTab} onStartTour={startTour} />
      </div>

      <Modal
        open={dialog?.type === "order"}
        onClose={() => setDialog(null)}
        title={selectedOrder ? `تفاصيل الطلب ${selectedOrder.id}` : "تفاصيل الطلب"}
        subtitle={selectedOrder ? `${fmtDateTime(selectedOrder.ts)} — ${selectedOrder.demo ? "بيانات عرض" : "طلب حقيقي من متصفحك"}` : ""}
        wide
      >
        {selectedOrder && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white border border-line p-4">
              <div>
                <p className="text-[10px] font-black text-muted mb-1">حالة الطلب</p>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["قيد التجهيز", "تم الشحن", "تم التوصيل", "ملغي"].map((status) => (
                  <button
                    key={status}
                    onClick={() => changeStatus(selectedOrder, status)}
                    className={cx(
                      "rounded-xl px-3 py-1.5 text-[9.5px] font-black border transition-colors cursor-pointer",
                      selectedOrder.status === status ? "bg-green2 border-green2 text-cream" : "bg-cream border-line text-muted hover:border-green2 hover:text-green2",
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white border border-line p-4">
                <h4 className="text-[11px] font-black text-gold mb-3">المنتجات</h4>
                <div className="space-y-2.5">
                  {selectedOrder.items?.map((item) => (
                    <div key={`${item.id}-${item.name}`} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-black">{item.name}</p>
                        <p className="text-[9.5px] font-bold text-muted">{item.qty} × {fmtMoney(item.price)}</p>
                      </div>
                      <b className="text-[11px] font-black whitespace-nowrap">{fmtMoney(item.qty * item.price)}</b>
                    </div>
                  ))}
                </div>
                <div className="border-t border-line mt-3 pt-3 space-y-1.5 text-[10px] font-bold">
                  <div className="flex justify-between"><span className="text-muted">المجموع</span><span>{fmtMoney(selectedOrder.totals?.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted">الخصم</span><span>{fmtMoney(selectedOrder.totals?.disc)}</span></div>
                  <div className="flex justify-between"><span className="text-muted">الشحن</span><span>{fmtMoney(selectedOrder.totals?.ship)}</span></div>
                  <div className="flex justify-between text-[12px] font-black pt-1.5"><span>الإجمالي</span><span className="text-green2">{fmtMoney(selectedOrder.totals?.total)}</span></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-white border border-line p-4">
                  <h4 className="text-[11px] font-black text-gold mb-3">العميل والتوصيل</h4>
                  <div className="space-y-2 text-[10.5px] font-bold">
                    <p className="text-[12px] font-black">{selectedOrder.addr?.name}</p>
                    <p dir="ltr" className="text-right text-muted">{selectedOrder.addr?.phone}</p>
                    <p className="text-muted">{selectedOrder.addr?.city} — {selectedOrder.addr?.district}</p>
                    <p className="text-muted">{selectedOrder.addr?.street}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white border border-line p-4">
                  <h4 className="text-[11px] font-black text-gold mb-3">الدفع</h4>
                  <div className="space-y-2 text-[10.5px] font-bold">
                    <div className="flex justify-between gap-2"><span className="text-muted">الطريقة</span><span className="font-black">{selectedOrder.pay}</span></div>
                    <div className="flex justify-between gap-2"><span className="text-muted">الحالة</span><span className="font-black text-green2">{selectedOrder.payment?.status === "paid" ? "مدفوع" : payKey(selectedOrder) === "cod" ? "عند الاستلام" : "بانتظار الدفع"}</span></div>
                    {selectedOrder.payment?.id && <div className="flex justify-between gap-2"><span className="text-muted">المرجع</span><span dir="ltr" className="font-black text-[9px] text-right break-all">{selectedOrder.payment.id}</span></div>}
                    {selectedOrder.payment?.last4 && <div className="flex justify-between gap-2"><span className="text-muted">آخر 4 أرقام</span><span dir="ltr" className="font-black">{selectedOrder.payment.last4}</span></div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={dialog?.type === "product"}
        onClose={() => setDialog(null)}
        title={productForm?.id ? "تعديل المنتج" : "إضافة منتج جديد"}
        subtitle="تعديل تجريبي داخل لوحة العرض"
      >
        {productForm && (
          <div className="space-y-4">
            <Field label="اسم المنتج"><input value={productForm.name} onChange={(event) => setProductForm((form) => ({ ...form, name: event.target.value }))} className={inputCls} placeholder="مثال: عطر العنبر الفاخر" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="التصنيف">
                <select value={productForm.cat} onChange={(event) => setProductForm((form) => ({ ...form, cat: event.target.value }))} className={inputCls}>
                  <option value="perfume">عطور</option>
                  <option value="oud">بخور وشموع</option>
                  <option value="gift">هدايا</option>
                </select>
              </Field>
              <Field label="السعر (ر.س)"><input type="number" value={productForm.price} onChange={(event) => setProductForm((form) => ({ ...form, price: event.target.value }))} className={inputCls} /></Field>
            </div>
            <Field label="المخزون"><input type="number" value={productForm.stock} onChange={(event) => setProductForm((form) => ({ ...form, stock: event.target.value }))} className={inputCls} /></Field>

            <ImageUploader
              title="صورة المنتج"
              value={productForm.img}
              onChange={(image) => setProductForm((form) => ({ ...form, img: image }))}
              onError={ping}
              onBusyChange={setImageBusy}
              previewAlt="معاينة صورة المنتج"
            />

            <div className="flex gap-2 pt-2">
              <button onClick={saveProduct} disabled={imageBusy} className="flex-1 rounded-2xl bg-green2 text-cream py-3 text-[12px] font-black hover:bg-green transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait">حفظ المنتج</button>
              <button onClick={() => setDialog(null)} className="rounded-2xl bg-white border border-line px-5 py-3 text-[12px] font-black text-muted hover:text-ink transition-colors cursor-pointer">إلغاء</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={dialog?.type === "coupon"}
        onClose={() => setDialog(null)}
        title="إنشاء كوبون جديد"
        subtitle="كوبون تجريبي — يظهر في اللوحة فقط"
      >
        <div className="space-y-4">
          <Field label="كود الكوبون"><input dir="ltr" value={couponForm.code} onChange={(event) => setCouponForm((form) => ({ ...form, code: event.target.value.toUpperCase() }))} className={cx(inputCls, "text-left tracking-[0.15em]")} placeholder="ASL20" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="نوع الخصم">
              <select value={couponForm.type} onChange={(event) => setCouponForm((form) => ({ ...form, type: event.target.value }))} className={inputCls}>
                <option value="percent">نسبة مئوية</option>
                <option value="fixed">مبلغ ثابت</option>
              </select>
            </Field>
            <Field label="القيمة"><input type="number" value={couponForm.value} onChange={(event) => setCouponForm((form) => ({ ...form, value: event.target.value }))} className={inputCls} /></Field>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={saveCoupon} className="flex-1 rounded-2xl bg-green2 text-cream py-3 text-[12px] font-black hover:bg-green transition-colors cursor-pointer">إنشاء الكوبون</button>
            <button onClick={() => setDialog(null)} className="rounded-2xl bg-white border border-line px-5 py-3 text-[12px] font-black text-muted hover:text-ink transition-colors cursor-pointer">إلغاء</button>
          </div>
        </div>
      </Modal>

      <Modal
        open={dialog?.type === "customer"}
        onClose={() => setDialog(null)}
        title={selectedCustomer ? `ملف ${selectedCustomer.name}` : "ملف العميل"}
        subtitle={selectedCustomer ? `${selectedCustomer.segment} — ${selectedCustomer.orders} طلب` : ""}
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white border border-line p-4">
              {selectedCustomer.image ? (
                <img src={selectedCustomer.image} alt={selectedCustomer.name} className="w-12 h-12 rounded-2xl object-cover border border-line" />
              ) : (
                <span className="w-12 h-12 rounded-2xl bg-green2 text-cream grid place-items-center text-[14px] font-black">{initials(selectedCustomer.name)}</span>
              )}
              <div className="min-w-0">
                <p className="text-[13px] font-black">{selectedCustomer.name}</p>
                <p dir="ltr" className="text-[10.5px] font-bold text-muted text-right">{selectedCustomer.phone}</p>
                <p className="text-[10px] font-bold text-muted">{selectedCustomer.city || "—"}</p>
              </div>
              <div className="mr-auto text-left">
                <p className="text-[13px] font-black text-green2">{fmtMoney(selectedCustomer.spent)}</p>
                <p className="text-[9px] font-bold text-muted">إجمالي الشراء</p>
              </div>
            </div>
            <ImageUploader
              title="صورة العميل"
              value={selectedCustomer.image}
              onChange={(image) => setCustomerImages((current) => ({ ...current, [selectedCustomer.key]: image }))}
              onError={ping}
              shape="circle"
              hint="تظهر في قائمة العملاء وفي ملف العميل — تُحفظ تلقائيًا"
              previewAlt={`معاينة صورة ${selectedCustomer.name}`}
            />
            <div>
              <h4 className="text-[11px] font-black text-gold mb-2.5">طلبات العميل</h4>
              {selectedCustomer.list.length === 0 ? (
                <p className="rounded-2xl bg-white border border-line p-4 text-[11px] font-bold text-muted">لا توجد طلبات مسجلة لهذا العميل بعد.</p>
              ) : (
                <div className="space-y-2">
                  {selectedCustomer.list.map((order) => (
                    <button key={order.key} onClick={() => openOrder(order)} className="w-full flex items-center justify-between gap-3 rounded-2xl bg-white border border-line p-3.5 text-right hover:border-green2 transition-colors cursor-pointer">
                      <div>
                        <b dir="ltr" className="block text-[10.5px] font-black">{order.id}</b>
                        <span className="text-[9.5px] font-bold text-muted">{fmtDate(order.ts)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10.5px] font-black">{fmtMoney(order.totals?.total)}</span>
                        <StatusBadge status={order.status} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <OnboardingWizard
        open={welcomeOpen}
        onClose={closeWelcome}
        roleId={roleId}
        onRoleChange={changeRole}
        onNavigate={setTab}
      />
      <GuidedTour open={tourOpen} onClose={() => setTourOpen(false)} onNavigate={setTab} />
    </div>
  );
}

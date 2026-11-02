import { useState } from "react";
import { motion } from "motion/react";
import useDialogBehavior from "../../hooks/useDialogBehavior";
import { read, write } from "../../lib/storage";

export const cx = (...classes) => classes.filter(Boolean).join(" ");

export const inputCls =
  "mt-1.5 w-full bg-cream border border-line rounded-2xl px-4 py-3 text-[13px] font-bold outline-none focus:border-green2 transition-colors";

export const money = (value) => `${Math.round(Number(value) || 0).toLocaleString("en-US")} ر.س`;
export const number = (value) => (Number(value) || 0).toLocaleString("en-US");
export const initials = (name = "") =>
  String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

export const timeAgo = (ts) => {
  if (!ts) return "الآن";
  const diff = Math.max(0, Date.now() - Number(ts));
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `قبل ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `قبل ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `قبل ${days} يوم`;
  return new Date(ts).toLocaleDateString("ar-SA-u-ca-gregory-nu-latn", { day: "numeric", month: "short" });
};

const PATHS = {
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
  bell: ["M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9", "M13.7 21a2 2 0 0 1-3.4 0"],
  store: ["M3 9l1.5-5h15L21 9", "M4 9h16v11H4z", "M9 20v-6h6v6"],
  trend: ["M22 7l-8.5 8.5-5-5L2 17", "M16 7h6v6"],
  wallet: ["M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15v14H5a2 2 0 0 1-2-2V5", "M18 12h.01"],
  sparkle: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z", "M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 6v6l4 2"],
  link: ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"],
  gift: ["M20 12v10H4V12", "M2 7h20v5H2z", "M12 22V7", "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z", "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z", "M9 12l2 2 4-4"],
  mail: ["M4 4h16v16H4z", "M22 6l-10 7L2 6"],
  phone: ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.78.59 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.27 1.73.47 2.63.59A2 2 0 0 1 22 16.92Z"],
  target: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"],
  layers: ["M12 2 2 7l10 5 10-5-10-5Z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
  message: ["M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"],
  help: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"],
  chevron: ["M9 18l6-6-6-6"],
  eye: ["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"],
  copy: ["M8 8h12v12H8z", "M16 8V4H4v12h4"],
  send: ["M22 2 11 13", "M22 2l-7 20-4-9-9-4 20-7Z"],
  play: ["M5 3l14 9-14 9V3Z"],
  pause: ["M6 4h4v16H6zM14 4h4v16h-4z"],
  trash: ["M3 6h18", "M8 6V4h8v2", "M19 6l-1 15H6L5 6", "M10 11v6M14 11v6"],
  edit: ["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],
  lock: ["M5 11h14v10H5z", "M8 11V7a4 4 0 0 1 8 0v4"],
  database: ["M21 5c0 2-4 3-9 3S3 7 3 5s4-3 9-3 9 1 9 3Z", "M3 5v14c0 2 4 3 9 3s9-1 9-3V5", "M3 12c0 2 4 3 9 3s9-1 9-3"],
  zap: ["M13 2 3 14h9l-1 8 10-12h-9l1-8Z"],
  alert: ["M12 9v4", "M12 17h.01", "M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z"],
  calendar: ["M4 5h16v16H4z", "M16 3v4M8 3v4M4 11h16"],
  filter: ["M22 3H2l8 9.46V19l4 2v-8.54L22 3Z"],
  checkCircle: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4 12 14l-3-3"],
};

export function Icon({ name, className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {(PATHS[name] || PATHS.grid).map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

export function Card({ children, className = "" }) {
  return <section className={cx("bg-white border border-line rounded-[1.65rem] shadow-[0_18px_50px_-36px_rgba(35,36,29,.38)]", className)}>{children}</section>;
}

export function PageHead({ kicker, title, desc, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[10.5px] font-black text-gold mb-1">{kicker}</p>
        <h2 className="text-[22px] font-black">{title}</h2>
        {desc && <p className="text-[11.5px] font-bold text-muted mt-1 max-w-2xl">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Btn({ children, onClick, variant = "primary", type = "button", className = "", disabled = false }) {
  const styles = {
    primary: "bg-green2 text-cream hover:bg-green shadow-lg shadow-green2/10",
    gold: "bg-gold text-white hover:bg-[#b8913c] shadow-lg shadow-gold/15",
    soft: "bg-cream border border-line text-ink hover:border-green2",
    ghost: "text-muted hover:bg-cream hover:text-ink",
    danger: "bg-[#fbe9e6] text-[#a33b2c] hover:bg-[#f8ddd8]",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cx("inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-[11.5px] font-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", styles[variant], className)}>
      {children}
    </button>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="text-[11px] font-black text-muted">{label}</span>
      {children}
      {hint && <span className="block text-[9.5px] font-bold text-muted/80 mt-1">{hint}</span>}
    </label>
  );
}

export function Toggle({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-line last:border-0">
      <div>
        <p className="text-[12.5px] font-black">{label}</p>
        {desc && <p className="text-[10.5px] font-bold text-muted mt-0.5">{desc}</p>}
      </div>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={cx("relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0", checked ? "bg-green2" : "bg-line")}>
        <span className={cx("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all", checked ? "right-0.5" : "right-[22px]")} />
      </button>
    </div>
  );
}

export function Modal({ open, onClose, title, subtitle, children, wide = false }) {
  useDialogBehavior(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center sm:p-5" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-ink/55 backdrop-blur-sm cursor-default" onClick={onClose} aria-label="إغلاق النافذة" />
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 28 }} className={cx("relative w-full bg-cream border border-line rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[92svh] overflow-y-auto no-scrollbar", wide ? "sm:max-w-4xl" : "sm:max-w-lg")}>
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

export function Pill({ children, tone = "green", className = "" }) {
  const tones = {
    green: "bg-[#e8f1ee] text-green2",
    gold: "bg-goldsoft text-[#71540f]",
    red: "bg-[#fbe9e6] text-[#a33b2c]",
    ink: "bg-sand text-ink",
    muted: "bg-cream border border-line text-muted",
  };
  return <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9.5px] font-black whitespace-nowrap", tones[tone], className)}>{children}</span>;
}

export function Stat({ icon = "trend", label, value, sub, tone = "green" }) {
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
        {sub && <span className="text-[9px] font-black text-muted text-left max-w-[55%] leading-4">{sub}</span>}
      </div>
      <p className="text-[11.5px] font-black text-muted mb-1">{label}</p>
      <p className="text-[23px] leading-tight font-black tracking-tight">{value}</p>
    </Card>
  );
}

export function Empty({ icon = "box", title, text, action }) {
  return (
    <div className="text-center py-14 px-5">
      <span className="w-14 h-14 rounded-3xl bg-cream border border-line grid place-items-center mx-auto mb-4 text-muted">
        <Icon name={icon} className="w-6 h-6" />
      </span>
      <h3 className="font-black text-[15px] mb-1">{title}</h3>
      <p className="text-[12px] font-bold text-muted mb-5">{text}</p>
      {action}
    </div>
  );
}

export function Avatar({ name, color = "green", size = "w-9 h-9", className = "" }) {
  const tones = {
    green: "bg-green2 text-cream",
    gold: "bg-goldsoft text-[#71540f]",
    ink: "bg-ink text-cream",
    red: "bg-[#fbe9e6] text-[#a33b2c]",
  };
  return <span className={cx("rounded-full grid place-items-center text-[10px] font-black shrink-0", tones[color] || tones.green, size, className)}>{initials(name)}</span>;
}

export function SectionTip({ id, title, text, action }) {
  const key = `asl_tip_${id}`;
  const [open, setOpen] = useState(() => !read(key, false));
  if (!open) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 rounded-2xl bg-goldsoft/35 border border-gold/25 px-4 py-3.5">
      <span className="w-8 h-8 shrink-0 rounded-xl bg-gold/15 text-[#71540f] grid place-items-center">
        <Icon name="sparkle" className="w-4 h-4" />
      </span>
      <div className="flex-1">
        <p className="text-[11.5px] font-black">{title}</p>
        <p className="text-[10.5px] font-bold text-muted leading-5 mt-0.5">{text}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {action}
        <button onClick={() => { write(key, true); setOpen(false); }} className="rounded-xl p-2 text-muted hover:text-ink hover:bg-white/50 transition-colors cursor-pointer" aria-label="إخفاء التلميح">
          <Icon name="close" className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
      {tabs.map((item) => (
        <button key={item.id} onClick={() => onChange(item.id)} className={cx("shrink-0 rounded-full px-3.5 py-2 text-[10.5px] font-black transition-colors cursor-pointer", value === item.id ? "bg-green2 text-cream" : "bg-cream border border-line text-muted hover:text-ink")}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

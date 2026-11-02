import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useShop } from "../../store";
import {
  AUDIT_EVENTS,
  HELP_ARTICLES,
  ROLE_OPTIONS,
  SETUP_STEPS,
  TOUR_STEPS,
} from "../../data/dashboardPremium";
import { read, remove, write } from "../../lib/storage";
import useDialogBehavior from "../../hooks/useDialogBehavior";
import {
  Avatar,
  Btn,
  Card,
  Empty,
  Field,
  Icon,
  Modal,
  PageHead,
  Pill,
  SectionTip,
  Stat,
  Toggle,
  cx,
  inputCls,
  timeAgo,
} from "./ui";

const RESET_KEYS = [
  "asl_dashboard_status",
  "asl_dashboard_products",
  "asl_dashboard_coupons",
  "asl_dashboard_customer_images",
  "asl_dashboard_settings",
  "asl_dashboard_team",
  "asl_dashboard_roles",
  "asl_dashboard_leads",
  "asl_dashboard_campaigns",
  "asl_dashboard_segments",
  "asl_dashboard_automations",
  "asl_dashboard_integrations",
  "asl_dashboard_affiliates",
  "asl_dashboard_affiliate_payouts",
  "asl_dashboard_affiliate_settings",
  "asl_dashboard_growth",
  "asl_dashboard_gift_cards",
  "asl_dashboard_rewards",
  "asl_dashboard_bundles",
  "asl_dashboard_audit",
  "asl_dashboard_setup",
  "asl_dashboard_welcome_seen",
  "asl_dashboard_security",
];

const actionTone = (action) => {
  if (action.includes("إطلاق") || action.includes("اعتماد") || action.includes("تفعيل") || action.includes("إنشاء")) return "green";
  if (action.includes("إيقاف") || action.includes("إغلاق")) return "red";
  if (action.includes("صرف") || action.includes("سحب")) return "gold";
  return "muted";
};

export function HelpCenter({ onNavigate, onStartTour, currentRole }) {
  const { ping } = useShop();
  const [query, setQuery] = useState("");
  const [done, setDone] = useState(() => read("asl_dashboard_setup", {}));
  const [resetOpen, setResetOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HELP_ARTICLES;
    return HELP_ARTICLES.filter((article) => [article.title, article.category, article.body].some((value) => value.toLowerCase().includes(q)));
  }, [query]);

  const completed = Object.values(done).filter(Boolean).length;
  const progress = Math.round((completed / SETUP_STEPS.length) * 100);

  const goStep = (step) => {
    const next = { ...done, [step.id]: true };
    setDone(next);
    write("asl_dashboard_setup", next);
    onNavigate(step.tab);
  };

  const resetDemo = () => {
    RESET_KEYS.forEach((key) => remove(key));
    ping("تمت إعادة تعيين بيانات العرض — سيتم تحديث الصفحة");
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="space-y-5">
      <PageHead
        kicker="الدعم والتوجيه"
        title="مركز مساعدة يمنع العميل من التوهان"
        desc="قائمة إعداد، جولة إرشادية، مقالات، وشرح لكل قسم. التجربة الكاملة لازم تكون واضحة من أول دقيقة."
        actions={
          <>
            <Btn variant="soft" onClick={() => onNavigate("overview")}><Icon name="grid" className="w-4 h-4" /> الرئيسية</Btn>
            <Btn onClick={() => onStartTour?.()}><Icon name="play" className="w-4 h-4" /> جولة إرشادية</Btn>
          </>
        }
      />

      <div className="relative overflow-hidden rounded-[1.75rem] bg-green text-cream p-6 sm:p-7">
        <div className="absolute -top-16 -left-10 w-52 h-52 rounded-full border border-gold/20" />
        <div className="absolute -bottom-24 left-20 w-64 h-64 rounded-full border border-cream/10" />
        <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <Pill tone="gold">الوضع الحالي: {currentRole?.name || "المالك"}</Pill>
            <h2 className="text-[21px] sm:text-[25px] leading-snug font-black mt-3">جاهز نكمل الإعداد؟</h2>
            <p className="text-[11.5px] font-bold text-cream/65 leading-6 mt-2 max-w-2xl">أكملت {completed} من {SETUP_STEPS.length} خطوات. كل خطوة تفتح القسم المناسب وتحفظ تقدمك تلقائيًا.</p>
            <div className="mt-4 h-2.5 rounded-full bg-cream/15 overflow-hidden max-w-md">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gold" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn variant="gold" onClick={() => onNavigate("overview")}>العودة للوحة</Btn>
            <button onClick={() => setResetOpen(true)} className="rounded-2xl border border-cream/20 px-4 py-2.5 text-[10.5px] font-black text-cream/80 hover:bg-cream/10 transition-colors cursor-pointer">إعادة تعيين العرض</button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat icon="checkCircle" label="خطوات مكتملة" value={`${completed}/${SETUP_STEPS.length}`} sub={`${progress}% من الإعداد`} />
        <Stat icon="help" label="مقالات مساعدة" value={HELP_ARTICLES.length} sub="داخل مركز المساعدة" tone="gold" />
        <Stat icon="layers" label="أقسام قابلة للشرح" value="9" sub="مع جولة إرشادية" tone="ink" />
        <Stat icon="clock" label="دعم مباشر" value="24/7" sub="واتساب عند التشغيل" tone="cream" />
      </div>

      <SectionTip
        id="help"
        title="ابدأ الجولة الإرشادية"
        text="الجولة تنقلك بين الأقسام وتشرح الميزة في مكانها. مناسبة جدًا لأول اجتماع مع العميل."
        action={<button onClick={() => onStartTour?.()} className="rounded-xl bg-white/70 px-3 py-1.5 text-[10px] font-black text-[#71540f] hover:bg-white cursor-pointer">ابدأ الآن</button>}
      />

      <div className="grid xl:grid-cols-[1.05fr_.95fr] gap-5">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div><p className="text-[10px] font-black text-gold mb-1">قائمة الإعداد</p><h3 className="text-[15px] font-black">6 خطوات ويصير المتجر جاهز</h3></div>
            <Pill tone={progress === 100 ? "green" : "gold"}>{progress}%</Pill>
          </div>
          <div className="space-y-2">
            {SETUP_STEPS.map((step) => (
              <button key={step.id} onClick={() => goStep(step)} className={cx("w-full flex items-center gap-3 rounded-2xl border p-3 text-right transition-colors cursor-pointer", done[step.id] ? "bg-[#e8f1ee] border-green2/20" : "bg-cream border-line hover:border-gold/50")}>
                <span className={cx("w-8 h-8 rounded-full grid place-items-center shrink-0", done[step.id] ? "bg-green2 text-cream" : "bg-white border border-line text-muted")}>
                  <Icon name={done[step.id] ? "check" : "chevron"} className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cx("text-[11.5px] font-black", done[step.id] && "line-through decoration-green2/40")}>{step.title}</p>
                  <p className="text-[9.5px] font-bold text-muted">{step.desc}</p>
                </div>
                <Icon name="arrow" className="w-4 h-4 text-muted rotate-180" />
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div><p className="text-[10px] font-black text-gold mb-1">مركز المساعدة</p><h3 className="text-[15px] font-black">ابحث عن أي شيء</h3></div>
            <Icon name="help" className="w-5 h-5 text-gold" />
          </div>
          <div className="relative mb-4">
            <Icon name="search" className="absolute top-1/2 -translate-y-1/2 right-3.5 w-4 h-4 text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن حملة، دور، عمولة..." className="w-full bg-cream border border-line rounded-2xl pr-10 pl-4 py-2.5 text-[11.5px] font-bold outline-none focus:border-green2" />
          </div>
          <div className="space-y-2">
            {filtered.slice(0, 6).map((article) => (
              <button key={article.id} onClick={() => onNavigate(article.tab)} className="w-full flex items-center gap-2.5 rounded-2xl bg-cream border border-line p-3 text-right hover:border-green2 transition-colors cursor-pointer">
                <span className="w-7 h-7 rounded-xl bg-white border border-line grid place-items-center text-gold shrink-0"><Icon name="help" className="w-3.5 h-3.5" /></span>
                <div className="min-w-0 flex-1"><p className="text-[10.5px] font-black truncate">{article.title}</p><p className="text-[8.5px] font-bold text-muted">{article.category}</p></div>
                <Icon name="arrow" className="w-3.5 h-3.5 text-muted rotate-180" />
              </button>
            ))}
            {filtered.length === 0 && <p className="text-center text-[10.5px] font-bold text-muted py-6">لا توجد نتيجة — جرّب كلمة أخرى.</p>}
          </div>
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div><p className="text-[10px] font-black text-gold mb-1">شرح الأدوار</p><h3 className="text-[15px] font-black">كل شخص يشوف اللي يحتاجه فقط</h3></div>
          <Btn variant="soft" onClick={() => onNavigate("team")}><Icon name="users" className="w-4 h-4" /> إدارة الفريق</Btn>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {ROLE_OPTIONS.map((role) => (
            <div key={role.id} className="rounded-2xl border border-line bg-cream p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-black">{role.label}</p>
                <Pill tone={role.id === currentRole?.id ? "green" : "muted"}>{role.id === currentRole?.id ? "الحالي" : role.short}</Pill>
              </div>
              <p className="text-[9.5px] font-bold text-muted mt-1">{role.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="إعادة تعيين بيانات العرض" subtitle="سيتم حذف تعديلاتك التجريبية فقط">
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#fbe9e6] border border-[#f0d4cf] p-4">
            <div className="flex items-center gap-2 text-[#a33b2c] mb-1"><Icon name="alert" className="w-4 h-4" /><p className="text-[11px] font-black">هذا الإجراء لا يمكن التراجع عنه</p></div>
            <p className="text-[10px] font-bold text-muted leading-5">سيتم مسح الفريق، الحملات، الفرص، الشركاء، النمو، والسجل التجريبي، وإعادة تحميل الصفحة. حسابك الحالي يبقى محفوظًا.</p>
          </div>
          <div className="flex gap-2"><Btn variant="danger" className="flex-1" onClick={resetDemo}>إعادة تعيين الآن</Btn><Btn variant="soft" onClick={() => setResetOpen(false)}>إلغاء</Btn></div>
        </div>
      </Modal>
    </div>
  );
}

export function OnboardingWizard({ open, onClose, roleId, onRoleChange, onNavigate }) {
  const [step, setStep] = useState(0);
  useDialogBehavior(open, onClose);
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);
  if (!open) return null;

  const baseFocus = [
    { id: "marketing", label: "التسويق", desc: "حملات وشرائح وأتمتة", icon: "sparkle" },
    { id: "sales", label: "المبيعات", desc: "فرص ومتابعة وعمولات", icon: "target" },
    { id: "team", label: "الفريق", desc: "أدوار وصلاحيات", icon: "users" },
    { id: "help", label: "الدعم", desc: "قائمة إعداد وجولة", icon: "help" },
  ];
  const activeRole = ROLE_OPTIONS.find((role) => role.id === roleId) || ROLE_OPTIONS[0];
  const tabMeta = {
    overview: ["نظرة عامة", "ملخص المتجر اليوم", "grid"],
    orders: ["الطلبات", "متابعة الطلبات وتحديث الحالة", "bag"],
    customers: ["العملاء", "قاعدة العملاء والشرائح", "users"],
    sales: ["المبيعات", "فرص ومتابعة وعمولات", "target"],
    marketing: ["التسويق", "حملات وشرائح وأتمتة", "sparkle"],
    affiliates: ["الشركاء", "روابط وعمولات وسحوبات", "users"],
    growth: ["أدوات النمو", "ولاء وإحالات وبطاقات هدايا", "gift"],
    analytics: ["التحليلات", "الزيارات والتحويل", "chart"],
    payments: ["المدفوعات", "ميسر والمعاملات", "card"],
    team: ["الفريق", "أدوار وصلاحيات", "users"],
    help: ["المساعدة", "قائمة إعداد وجولة", "help"],
    "affiliate-portal": ["بوابة الشريك", "أرباحك ورابطك وطلبات السحب", "link"],
  };
  const allowedFocus = baseFocus.filter((item) => activeRole.tabs.includes(item.id));
  const extraFocus = activeRole.tabs
    .filter((tab) => tab !== "overview" && !allowedFocus.some((item) => item.id === tab))
    .map((tab) => {
      const [label, desc, icon] = tabMeta[tab] || [tab, "انتقل مباشرة إلى هذا القسم", "arrow"];
      return { id: tab, label, desc, icon };
    });
  const focus = (activeRole.id === "affiliate" ? [...extraFocus, ...allowedFocus] : [...allowedFocus, ...extraFocus]).slice(0, 4);

  return (
    <div className="fixed inset-0 z-[140] flex items-end sm:items-center justify-center sm:p-5" role="dialog" aria-modal="true" aria-label="مرحبًا بك">
      <div className="absolute inset-0 bg-ink/65 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative w-full sm:max-w-2xl bg-cream border border-line rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[92svh] overflow-y-auto no-scrollbar">
        <div className="p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((item) => <span key={item} className={cx("h-1.5 rounded-full transition-all", item === step ? "w-7 bg-green2" : item < step ? "w-4 bg-gold" : "w-4 bg-line")} />)}
            </div>
            <button onClick={onClose} className="text-[10px] font-black text-muted hover:text-ink cursor-pointer">تخطي</button>
          </div>

          {step === 0 && (
            <div>
              <span className="w-14 h-14 rounded-3xl bg-green2 text-cream grid place-items-center mb-5"><Icon name="sparkle" className="w-7 h-7" /></span>
              <p className="text-[10px] font-black text-gold mb-1">أهلًا بك في أصل</p>
              <h2 className="text-[26px] sm:text-[32px] leading-tight font-black">متجرك صار فريق كامل، مش لوحة أرقام.</h2>
              <p className="text-[12px] font-bold text-muted leading-7 mt-3 max-w-lg">جرّب المبيعات، التسويق، الشركاء، الفريق، النمو، والدعم. كل شيء يعمل كتجربة كاملة، وقابل للربط ببياناتك الحقيقية لاحقًا.</p>
              <div className="grid grid-cols-2 gap-2 mt-5">
                {["مسار مبيعات", "حملات وأتمتة", "أدوار وصلاحيات", "بوابة شركاء", "ولاء وإحالات", "مركز مساعدة"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-xl bg-white border border-line px-3 py-2 text-[10px] font-black"><span className="w-4 h-4 rounded-full bg-green2 text-cream grid place-items-center"><Icon name="check" className="w-2.5 h-2.5" /></span>{item}</div>
                ))}
              </div>
              <div className="flex gap-2 mt-6"><Btn className="flex-1" onClick={() => setStep(1)}>يلا نبدأ <Icon name="arrow" className="w-4 h-4" /></Btn><Btn variant="soft" onClick={onClose}>استكشف بنفسي</Btn></div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-[10px] font-black text-gold mb-1">الخطوة 2 من 3</p>
              <h2 className="text-[24px] sm:text-[28px] leading-tight font-black">كيف تحب تشوف المتجر؟</h2>
              <p className="text-[11.5px] font-bold text-muted leading-6 mt-2">اختر الدور الذي تريد تجربته الآن. تقدر تغيّره في أي لحظة من أعلى الصفحة.</p>
              <div className="grid sm:grid-cols-2 gap-2.5 mt-5">
                {ROLE_OPTIONS.filter((role) => ["owner", "marketing", "sales", "affiliate"].includes(role.id)).map((role) => (
                  <button key={role.id} onClick={() => onRoleChange(role.id)} className={cx("rounded-2xl border p-4 text-right transition-colors cursor-pointer", roleId === role.id ? "bg-[#e8f1ee] border-green2" : "bg-white border-line hover:border-gold/50")}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12px] font-black">{role.label}</p>
                      {roleId === role.id && <span className="w-5 h-5 rounded-full bg-green2 text-cream grid place-items-center"><Icon name="check" className="w-3 h-3" /></span>}
                    </div>
                    <p className="text-[9.5px] font-bold text-muted mt-1">{role.desc}</p>
                    <div className="flex flex-wrap gap-1 mt-2">{role.tabs.slice(0, 4).map((tab) => <span key={tab} className="rounded-md bg-cream border border-line px-1.5 py-0.5 text-[7.5px] font-black text-muted">{tab}</span>)}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-6"><Btn className="flex-1" onClick={() => setStep(2)}>متابعة <Icon name="arrow" className="w-4 h-4" /></Btn><Btn variant="soft" onClick={() => setStep(0)}>رجوع</Btn></div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-[10px] font-black text-gold mb-1">الخطوة 3 من 3</p>
              <h2 className="text-[24px] sm:text-[28px] leading-tight font-black">من وين نبدأ؟</h2>
              <p className="text-[11.5px] font-bold text-muted leading-6 mt-2">اختر نقطة البداية وسنأخذك مباشرة لها. قائمة الإعداد الكاملة موجودة في مركز المساعدة.</p>
              <div className="grid sm:grid-cols-2 gap-2.5 mt-5">
                {focus.map((item) => (
                  <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }} className="rounded-2xl bg-white border border-line p-4 text-right hover:border-green2 transition-colors cursor-pointer">
                    <span className="w-9 h-9 rounded-xl bg-cream border border-line text-green2 grid place-items-center mb-2"><Icon name={item.icon} className="w-4 h-4" /></span>
                    <p className="text-[12px] font-black">{item.label}</p>
                    <p className="text-[9.5px] font-bold text-muted mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-6"><Btn className="flex-1" onClick={() => { onNavigate("help"); onClose(); }}><Icon name="help" className="w-4 h-4" /> افتح قائمة الإعداد</Btn><Btn variant="soft" onClick={() => setStep(1)}>رجوع</Btn></div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function GuidedTour({ open, onClose, onNavigate }) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const step = TOUR_STEPS[index];

  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open || !step) return;
    onNavigate(step.tab);
    let frame = 0;
    const measure = () => {
      const target = document.querySelector(`[data-tour="${step.tab}"]`);
      if (!target) {
        setRect(null);
        return;
      }
      target.scrollIntoView({ block: "nearest", inline: "nearest" });
      const box = target.getBoundingClientRect();
      setRect({ top: box.top - 6, left: box.left - 6, width: box.width + 12, height: box.height + 12 });
    };
    frame = requestAnimationFrame(() => requestAnimationFrame(measure));
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [onNavigate, open, step]);

  if (!open || !step) return null;

  const finish = () => { onClose(); };

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-ink/20 pointer-events-none" />
      {rect && <div className="fixed z-[95] rounded-2xl border-2 border-gold bg-gold/10 shadow-[0_0_0_5px_rgba(201,162,75,0.18)] pointer-events-none transition-all duration-200" style={rect} />}
      <motion.div key={step.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-5 left-4 right-4 sm:right-auto sm:left-5 z-[100] sm:w-[360px] bg-cream border border-line rounded-[1.6rem] shadow-2xl p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <Pill tone="gold">جولة {index + 1} / {TOUR_STEPS.length}</Pill>
          <button onClick={finish} className="w-8 h-8 grid place-items-center rounded-full bg-white border border-line text-muted hover:text-ink cursor-pointer" aria-label="إنهاء الجولة"><Icon name="close" className="w-3.5 h-3.5" /></button>
        </div>
        <h3 className="text-[16px] font-black">{step.title}</h3>
        <p className="text-[11px] font-bold text-muted leading-6 mt-1.5">{step.body}</p>
        <div className="flex items-center gap-1.5 mt-4">
          {TOUR_STEPS.map((item, itemIndex) => <span key={item.id} className={cx("h-1.5 rounded-full transition-all", itemIndex === index ? "w-6 bg-green2" : itemIndex < index ? "w-3 bg-gold" : "w-3 bg-line")} />)}
        </div>
        <div className="flex gap-2 mt-4">
          {index > 0 && <Btn variant="soft" onClick={() => setIndex((current) => current - 1)}>السابق</Btn>}
          {index < TOUR_STEPS.length - 1 ? (
            <Btn className="flex-1" onClick={() => setIndex((current) => current + 1)}>التالي <Icon name="arrow" className="w-4 h-4" /></Btn>
          ) : (
            <Btn className="flex-1" onClick={finish}><Icon name="check" className="w-4 h-4" /> تم</Btn>
          )}
        </div>
      </motion.div>
    </>
  );
}

export function HelpDock({ onNavigate, onStartTour }) {
  const [open, setOpen] = useState(false);
  const items = [
    ["marketing", "الحملات والتسويق", "sparkle"],
    ["sales", "مسار المبيعات", "target"],
    ["affiliates", "برنامج الشركاء", "users"],
    ["team", "الفريق والصلاحيات", "shield"],
    ["help", "مركز المساعدة", "help"],
  ];
  return (
    <>
      <button onClick={() => setOpen((current) => !current)} className="fixed bottom-4 left-4 z-[80] inline-flex items-center gap-2 rounded-full bg-green2 text-cream px-4 py-3 text-[10.5px] font-black shadow-xl shadow-green2/25 hover:bg-green transition-colors cursor-pointer" aria-label="المساعدة والتوجيه">
        <Icon name="help" className="w-4 h-4" />
        <span className="hidden sm:inline">مساعدة</span>
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="fixed bottom-[4.5rem] left-4 z-[80] w-[calc(100vw-2rem)] sm:w-[310px] bg-cream border border-line rounded-[1.6rem] shadow-2xl p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div><p className="text-[9px] font-black text-gold">مركز التوجيه</p><p className="text-[13px] font-black">تحتاج مساعدة؟</p></div>
            <button onClick={() => setOpen(false)} className="w-7 h-7 grid place-items-center rounded-full bg-white border border-line text-muted cursor-pointer" aria-label="إغلاق"><Icon name="close" className="w-3 h-3" /></button>
          </div>
          <button onClick={() => { setOpen(false); onStartTour?.(); }} className="w-full rounded-2xl bg-green2 text-cream py-2.5 text-[10.5px] font-black mb-3 cursor-pointer">ابدأ الجولة الإرشادية</button>
          <div className="space-y-1">
            {items.map(([tab, label, icon]) => (
              <button key={tab} onClick={() => { setOpen(false); onNavigate(tab); }} className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-right hover:bg-white transition-colors cursor-pointer">
                <span className="w-7 h-7 rounded-lg bg-white border border-line text-green2 grid place-items-center"><Icon name={icon} className="w-3.5 h-3.5" /></span>
                <span className="text-[10.5px] font-black">{label}</span>
                <Icon name="arrow" className="w-3 h-3 text-muted mr-auto rotate-180" />
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-goldsoft/40 border border-gold/20 p-2.5">
            <p className="text-[8.5px] font-black text-[#71540f]">وضع تجريبي</p>
            <p className="text-[9px] font-bold text-muted leading-4 mt-0.5">كل الدعوات والمدفوعات والرسائل معاينات. الربط الحقيقي عند التشغيل.</p>
          </div>
        </motion.div>
      )}
    </>
  );
}

export function AuditSection() {
  const { ping } = useShop();
  const [events, setEvents] = useState(() => read("asl_dashboard_audit", AUDIT_EVENTS));
  const [query, setQuery] = useState("");
  const [security, setSecurity] = useState(() => read("asl_dashboard_security", { twoFactor: true, loginAlerts: true, approval: false }));

  useEffect(() => {
    const refresh = () => setEvents(read("asl_dashboard_audit", AUDIT_EVENTS));
    window.addEventListener("asl:audit", refresh);
    return () => window.removeEventListener("asl:audit", refresh);
  }, []);

  const saveSecurity = (next) => {
    setSecurity(next);
    write("asl_dashboard_security", next);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((event) => [event.actor, event.action, event.detail].some((value) => String(value).toLowerCase().includes(q)));
  }, [events, query]);

  const exportLog = () => {
    const rows = [
      ["الوقت", "العضو", "الإجراء", "التفاصيل", "المصدر"],
      ...events.map((event) => [new Date(event.ts).toISOString(), event.actor, event.action, event.detail, event.ip]),
    ];
    const csv = "\uFEFF" + rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `asl-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    logAudit("تصدير سجل", "سجل النشاط CSV");
    ping("تم تصدير سجل النشاط ✓");
  };

  return (
    <div className="space-y-5">
      <PageHead
        kicker="الأمان والشفافية"
        title="سجل نشاط لكل تغيير"
        desc="من عدّل الطلب؟ من أطلق الحملة؟ من صرف العمولة؟ كل شيء مسجل — وهذا يبني ثقة العميل ويمنحه رقابة كاملة."
        actions={<Btn onClick={exportLog}><Icon name="download" className="w-4 h-4" /> تصدير السجل</Btn>}
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat icon="shield" label="أحداث مسجلة" value={events.length} sub="آخر 120 حدثًا" />
        <Stat icon="users" label="أعضاء نشطون" value={new Set(events.map((event) => event.actor)).size} sub="خلال الفترة" tone="gold" />
        <Stat icon="clock" label="آخر تغيير" value={events[0] ? timeAgo(events[0].ts) : "—"} sub={events[0]?.action || "لا يوجد"} tone="ink" />
        <Stat icon="lock" label="حماية الحساب" value={security.twoFactor ? "مفعّلة" : "تحتاج تفعيل"} sub="التحقق بخطوتين" tone="cream" />
      </div>

      <div className="grid xl:grid-cols-[1.45fr_.55fr] gap-5">
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-line">
            <div><p className="text-[10px] font-black text-gold mb-1">النشاط</p><h3 className="text-[15px] font-black">آخر الأحداث</h3></div>
            <div className="relative w-full sm:max-w-[230px]">
              <Icon name="search" className="absolute top-1/2 -translate-y-1/2 right-3 w-3.5 h-3.5 text-muted" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث في السجل..." className="w-full bg-cream border border-line rounded-xl pr-9 pl-3 py-2 text-[10.5px] font-bold outline-none focus:border-green2" />
            </div>
          </div>
          <div className="divide-y divide-line/80">
            {filtered.map((event) => (
              <div key={event.id} className="flex items-start gap-3 px-5 sm:px-6 py-3.5">
                <span className={cx("w-8 h-8 rounded-xl grid place-items-center shrink-0", event.action.includes("حملة") || event.action.includes("إطلاق") ? "bg-goldsoft text-[#71540f]" : event.action.includes("عمولة") || event.action.includes("سحب") ? "bg-[#fbe9e6] text-[#a33b2c]" : "bg-[#e8f1ee] text-green2")}>
                  <Icon name={event.action.includes("حملة") ? "sparkle" : event.action.includes("عضو") || event.action.includes("شريك") ? "users" : event.action.includes("عمولة") ? "wallet" : "shield"} className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] font-black">{event.action}</p>
                    <Pill tone={actionTone(event.action)}>{event.actor}</Pill>
                  </div>
                  <p className="text-[10px] font-bold text-muted mt-0.5">{event.detail}</p>
                  <p className="text-[8.5px] font-bold text-muted/70 mt-0.5">{timeAgo(event.ts)} · {event.ip}</p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <Empty icon="shield" title="لا توجد أحداث مطابقة" text="جرّب بحثًا آخر." />}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3"><span className="w-9 h-9 rounded-2xl bg-green2 text-cream grid place-items-center"><Icon name="lock" className="w-4 h-4" /></span><div><h3 className="text-[13px] font-black">أمان الحساب</h3><p className="text-[9.5px] font-bold text-muted">إعدادات تجريبية</p></div></div>
            <Toggle checked={security.twoFactor} onChange={(value) => saveSecurity({ ...security, twoFactor: value })} label="التحقق بخطوتين" desc="مطلوب لكل عضو إداري" />
            <Toggle checked={security.loginAlerts} onChange={(value) => saveSecurity({ ...security, loginAlerts: value })} label="تنبيهات الدخول" desc="إشعار عند دخول جديد" />
            <Toggle checked={security.approval} onChange={(value) => saveSecurity({ ...security, approval: value })} label="موافقة على السحوبات" desc="المالك يعتمد قبل الصرف" />
          </Card>
          <Card className="p-5">
            <p className="text-[10px] font-black text-gold mb-1">آخر الدخول</p>
            <h3 className="text-[13px] font-black mb-3">جلسات المتصفح</h3>
            <div className="space-y-2">
              {[
                ["Mac · Chrome", "الآن", true],
                ["iPhone · Safari", "أمس", false],
                ["Windows · Chrome", "قبل 3 أيام", false],
              ].map(([device, when, current]) => (
                <div key={device} className="flex items-center justify-between gap-2 rounded-xl bg-cream border border-line px-3 py-2">
                  <span className="text-[9.5px] font-black">{device}</span>
                  <span className={cx("text-[8.5px] font-black", current ? "text-green2" : "text-muted")}>{current ? "هذه الجلسة" : when}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

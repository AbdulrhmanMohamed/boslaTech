import { useMemo, useState } from "react";
import { useShop } from "../../store";
import { AFFILIATE_PAYOUTS, AFFILIATES } from "../../data/dashboardPremium";
import { read, write } from "../../lib/storage";
import { logAudit } from "../../lib/audit";
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
  Tabs,
  cx,
  inputCls,
  money,
  number,
  timeAgo,
} from "./ui";

const statusTone = (status) => (status === "active" ? "green" : status === "pending" ? "gold" : "muted");
const statusLabel = (status) => (status === "active" ? "نشط" : status === "pending" ? "قيد المراجعة" : "موقوف");

const blankAffiliate = { name: "", email: "", platform: "Instagram", commission: "15" };

export default function AffiliatesSection({ onRoleChange, onNavigate }) {
  const { ping } = useShop();
  const [affiliates, setAffiliates] = useState(() => read("asl_dashboard_affiliates", AFFILIATES));
  const [payouts, setPayouts] = useState(() => read("asl_dashboard_affiliate_payouts", AFFILIATE_PAYOUTS));
  const [settings, setSettings] = useState(() => read("asl_dashboard_affiliate_settings", { rate: "15", cookie: "30", minPayout: "300" }));
  const [tab, setTab] = useState("affiliates");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blankAffiliate);
  const [selected, setSelected] = useState(null);

  const saveAffiliates = (next) => {
    setAffiliates(next);
    write("asl_dashboard_affiliates", next);
  };
  const savePayouts = (next) => {
    setPayouts(next);
    write("asl_dashboard_affiliate_payouts", next);
  };
  const saveSettings = (next) => {
    setSettings(next);
    write("asl_dashboard_affiliate_settings", next);
  };

  const stats = useMemo(() => {
    const active = affiliates.filter((item) => item.status === "active");
    return {
      active: active.length,
      clicks: affiliates.reduce((sum, item) => sum + Number(item.clicks || 0), 0),
      orders: affiliates.reduce((sum, item) => sum + Number(item.orders || 0), 0),
      revenue: affiliates.reduce((sum, item) => sum + Number(item.revenue || 0), 0),
      pending: payouts.filter((item) => item.status === "pending").reduce((sum, item) => sum + Number(item.amount || 0), 0),
    };
  }, [affiliates, payouts]);

  const copy = (text, message) => {
    navigator.clipboard?.writeText(text).then(() => ping(message)).catch(() => ping(text));
  };

  const createAffiliate = () => {
    if (!form.name.trim() || !form.email.trim()) {
      ping("أكمل اسم الشريك والبريد");
      return;
    }
    const base = form.name.trim().split(/\s+/)[0].toUpperCase().replace(/[^A-Za-z]/g, "") || "ASL";
    const affiliate = {
      id: `af-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      code: `${base}${Math.floor(10 + Math.random() * 89)}`,
      status: "pending",
      clicks: 0,
      orders: 0,
      revenue: 0,
      commission: 0,
      paid: 0,
      joinedAt: Date.now(),
      platform: form.platform,
      rate: Number(form.commission) || 15,
    };
    saveAffiliates([affiliate, ...affiliates]);
    logAudit("إضافة شريك", `${affiliate.name} — ${affiliate.platform}`);
    setForm(blankAffiliate);
    setOpen(false);
    ping("تمت إضافة طلب انضمام شريك — تجريبي ✓");
  };

  const setStatus = (affiliate, status) => {
    saveAffiliates(affiliates.map((item) => item.id === affiliate.id ? { ...item, status } : item));
    logAudit(status === "active" ? "اعتماد شريك" : "إيقاف شريك", affiliate.name);
    ping(status === "active" ? `تم اعتماد ${affiliate.name} ✓` : `تم إيقاف ${affiliate.name}`);
  };

  const payPayout = (payout) => {
    savePayouts(payouts.map((item) => item.id === payout.id ? { ...item, status: "paid", paidAt: Date.now() } : item));
    saveAffiliates(affiliates.map((item) => item.id === payout.affiliateId ? { ...item, paid: Number(item.paid || 0) + Number(payout.amount || 0) } : item));
    const affiliate = affiliates.find((item) => item.id === payout.affiliateId);
    logAudit("صرف عمولة", `${affiliate?.name || "شريك"} — ${money(payout.amount)}`);
    ping("تم تسجيل صرف العمولة — تجريبي ✓");
  };

  return (
    <div className="space-y-5">
      <PageHead
        kicker="برنامج الشركاء"
        title="حوّل المؤثرين إلى قناة مبيعات"
        desc={`${stats.active} شريك نشط · ${number(stats.clicks)} نقرة · ${money(stats.revenue)} مبيعات منسوبة. كل شيء جاهز للعرض، من رابط الإحالة حتى صرف العمولة.`}
        actions={
          <>
            <Btn variant="soft" onClick={() => onRoleChange?.("affiliate")}><Icon name="eye" className="w-4 h-4" /> معاينة بوابة الشريك</Btn>
            <Btn onClick={() => setOpen(true)}><Icon name="plus" className="w-4 h-4" /> شريك جديد</Btn>
          </>
        }
      />

      <SectionTip
        id="affiliates"
        title="جرّب تجربة الشريك بنفسك"
        text="اضغط «معاينة بوابة الشريك» لتتحول إلى واجهة الشريك: رابط الإحالة، الأرباح، طلبات السحب، والمواد التسويقية. ثم ارجع للمالك من مبدّل الدور."
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat icon="users" label="شركاء نشطون" value={stats.active} sub={`${affiliates.length} شريك إجمالًا`} />
        <Stat icon="link" label="نقرات الإحالة" value={number(stats.clicks)} sub={`${stats.orders} طلب منسوب`} tone="gold" />
        <Stat icon="wallet" label="مبيعات الشركاء" value={money(stats.revenue)} sub="إيرادات منسوبة" tone="ink" />
        <Stat icon="card" label="سحوبات معلقة" value={money(stats.pending)} sub="بانتظار الاعتماد" tone="cream" />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Tabs tabs={[{ id: "affiliates", label: "الشركاء" }, { id: "payouts", label: "طلبات السحب" }, { id: "settings", label: "إعدادات العمولة" }]} value={tab} onChange={setTab} />
        <div className="flex gap-2">
          <Btn variant="soft" onClick={() => setTab("settings")}><Icon name="settings" className="w-4 h-4" /> قواعد العمولة</Btn>
        </div>
      </div>

      {tab === "affiliates" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-right">
              <thead>
                <tr className="text-[9.5px] font-black text-muted bg-cream/60">
                  <th className="px-5 py-3.5">الشريك</th>
                  <th className="px-3 py-3.5">الرابط / الكود</th>
                  <th className="px-3 py-3.5">المنصة</th>
                  <th className="px-3 py-3.5">النقرات</th>
                  <th className="px-3 py-3.5">الطلبات</th>
                  <th className="px-3 py-3.5">المبيعات</th>
                  <th className="px-3 py-3.5">العمولة</th>
                  <th className="px-3 py-3.5">الحالة</th>
                  <th className="px-5 py-3.5">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((affiliate) => (
                  <tr key={affiliate.id} className="border-t border-line/80 hover:bg-cream/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelected(affiliate)} className="flex items-center gap-2.5 text-right cursor-pointer">
                        <Avatar name={affiliate.name} color={affiliate.status === "active" ? "green" : affiliate.status === "pending" ? "gold" : "ink"} />
                        <div>
                          <p className="text-[11px] font-black">{affiliate.name}</p>
                          <p dir="ltr" className="text-[9px] font-bold text-muted text-right">{affiliate.email}</p>
                        </div>
                      </button>
                    </td>
                    <td className="px-3 py-3.5">
                      <button onClick={() => copy(`https://asl.sa/?ref=${affiliate.code}`, "تم نسخ رابط الإحالة ✓")} className="rounded-lg bg-cream border border-line px-2 py-1 text-[9px] font-black text-green2 hover:border-green2 cursor-pointer" dir="ltr">{affiliate.code}</button>
                    </td>
                    <td className="px-3 py-3.5 text-[10px] font-bold text-muted">{affiliate.platform}</td>
                    <td className="px-3 py-3.5 text-[11px] font-black">{number(affiliate.clicks)}</td>
                    <td className="px-3 py-3.5 text-[11px] font-black">{affiliate.orders}</td>
                    <td className="px-3 py-3.5 text-[11px] font-black text-green2">{money(affiliate.revenue)}</td>
                    <td className="px-3 py-3.5 text-[11px] font-black">{money(affiliate.commission)}</td>
                    <td className="px-3 py-3.5"><Pill tone={statusTone(affiliate.status)}>{statusLabel(affiliate.status)}</Pill></td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5">
                        {affiliate.status === "pending" && <button onClick={() => setStatus(affiliate, "active")} className="rounded-xl bg-[#e8f1ee] px-2.5 py-1.5 text-[9px] font-black text-green2 cursor-pointer">اعتماد</button>}
                        {affiliate.status === "active" && <button onClick={() => setStatus(affiliate, "paused")} className="rounded-xl border border-line bg-white px-2.5 py-1.5 text-[9px] font-black text-muted hover:border-green2 cursor-pointer">إيقاف</button>}
                        {affiliate.status === "paused" && <button onClick={() => setStatus(affiliate, "active")} className="rounded-xl bg-[#e8f1ee] px-2.5 py-1.5 text-[9px] font-black text-green2 cursor-pointer">تفعيل</button>}
                        <button onClick={() => setSelected(affiliate)} className="rounded-xl border border-line bg-white px-2.5 py-1.5 text-[9px] font-black text-muted hover:border-green2 cursor-pointer">ملف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "payouts" && (
        <Card className="overflow-hidden">
          <div className="px-5 sm:px-6 py-5 border-b border-line">
            <p className="text-[10px] font-black text-gold mb-1">المدفوعات</p>
            <h3 className="text-[15px] font-black">طلبات سحب العمولات</h3>
          </div>
          <div className="divide-y divide-line/80">
            {payouts.map((payout) => {
              const affiliate = affiliates.find((item) => item.id === payout.affiliateId);
              return (
                <div key={payout.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={affiliate?.name || "شريك"} color={payout.status === "paid" ? "green" : "gold"} />
                    <div>
                      <p className="text-[11.5px] font-black">{affiliate?.name || "شريك"}</p>
                      <p className="text-[9.5px] font-bold text-muted">{payout.method} · {timeAgo(payout.requestedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <b className="text-[13px] font-black">{money(payout.amount)}</b>
                    <Pill tone={payout.status === "paid" ? "green" : "gold"}>{payout.status === "paid" ? "تم الصرف" : "بانتظار الاعتماد"}</Pill>
                    {payout.status !== "paid" && <button onClick={() => payPayout(payout)} className="rounded-xl bg-green2 px-3 py-1.5 text-[9.5px] font-black text-cream cursor-pointer">صرف تجريبي</button>}
                  </div>
                </div>
              );
            })}
            {payouts.length === 0 && <Empty icon="wallet" title="لا توجد طلبات سحب" text="ستظهر هنا طلبات الشركاء." />}
          </div>
        </Card>
      )}

      {tab === "settings" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-9 h-9 rounded-2xl bg-goldsoft text-[#71540f] grid place-items-center"><Icon name="card" className="w-4 h-4" /></span>
              <div><h3 className="text-[14px] font-black">قواعد العمولة</h3><p className="text-[10px] font-bold text-muted">تُطبق على جميع الشركاء</p></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="نسبة العمولة %"><input type="number" value={settings.rate} onChange={(event) => saveSettings({ ...settings, rate: event.target.value })} className={inputCls} /></Field>
              <Field label="مدة الكوكيز (يوم)"><input type="number" value={settings.cookie} onChange={(event) => saveSettings({ ...settings, cookie: event.target.value })} className={inputCls} /></Field>
              <Field label="أقل مبلغ سحب"><input type="number" value={settings.minPayout} onChange={(event) => saveSettings({ ...settings, minPayout: event.target.value })} className={inputCls} /></Field>
            </div>
            <div className="mt-4 rounded-2xl bg-cream border border-line p-3.5">
              <p className="text-[10px] font-black text-muted">مثال: طلب بقيمة 500 ر.س</p>
              <p className="text-[15px] font-black text-green2 mt-1">{money(Math.round(500 * (Number(settings.rate) || 15) / 100))} عمولة للشريك</p>
            </div>
            <Btn className="mt-4 w-full" onClick={() => { logAudit("تحديث إعدادات الشركاء", `${settings.rate}% — ${settings.cookie} يوم`); ping("تم حفظ قواعد العمولة ✓"); }}>حفظ الإعدادات</Btn>
          </Card>
          <Card className="p-5 sm:p-6">
            <p className="text-[10px] font-black text-gold mb-1">نمو البرنامج</p>
            <h3 className="text-[15px] font-black mb-4">أفضل الشركاء</h3>
            <div className="space-y-2.5">
              {[...affiliates].sort((a, b) => b.revenue - a.revenue).map((affiliate, index) => (
                <div key={affiliate.id} className="flex items-center gap-3 rounded-2xl bg-cream border border-line p-3">
                  <span className="w-5 text-[10px] font-black text-muted">{index + 1}</span>
                  <Avatar name={affiliate.name} color={index === 0 ? "gold" : "green"} />
                  <div className="min-w-0 flex-1"><p className="text-[10.5px] font-black">{affiliate.name}</p><p className="text-[9px] font-bold text-muted">{affiliate.orders} طلب · {number(affiliate.clicks)} نقرة</p></div>
                  <b className="text-[11px] font-black text-green2">{money(affiliate.revenue)}</b>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة شريك جديد" subtitle="أنشئ كود إحالة وحالة انتظار — تجريبي">
        <div className="space-y-4">
          <Field label="اسم الشريك"><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={inputCls} placeholder="مثال: جواهر الحربي" /></Field>
          <Field label="البريد الإلكتروني"><input dir="ltr" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className={cx(inputCls, "text-left")} placeholder="name@affiliate.sa" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="المنصة">
              <select value={form.platform} onChange={(event) => setForm((current) => ({ ...current, platform: event.target.value }))} className={inputCls}>
                {["Instagram", "TikTok", "Snapchat", "X / Twitter", "YouTube", "مدونة"].map((platform) => <option key={platform}>{platform}</option>)}
              </select>
            </Field>
            <Field label="نسبة العمولة %"><input type="number" value={form.commission} onChange={(event) => setForm((current) => ({ ...current, commission: event.target.value }))} className={inputCls} /></Field>
          </div>
          <div className="flex gap-2"><Btn className="flex-1" onClick={createAffiliate}>إضافة الشريك</Btn><Btn variant="soft" onClick={() => setOpen(false)}>إلغاء</Btn></div>
        </div>
      </Modal>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `ملف الشريك — ${selected.name}` : "ملف الشريك"} subtitle="الأداء والعمولات والرابط" wide>
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white border border-line p-4">
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} color={selected.status === "active" ? "green" : "gold"} size="w-12 h-12" />
                <div><p className="text-[13px] font-black">{selected.name}</p><p dir="ltr" className="text-[10px] font-bold text-muted text-right">{selected.email}</p><p className="text-[9.5px] font-bold text-muted">{selected.platform}</p></div>
              </div>
              <Pill tone={statusTone(selected.status)}>{statusLabel(selected.status)}</Pill>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[["نقرات", number(selected.clicks)], ["طلبات", selected.orders], ["مبيعات", money(selected.revenue)], ["عمولة", money(selected.commission)]].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-cream border border-line p-3 text-center"><b className="block text-[15px] font-black">{value}</b><span className="text-[9px] font-black text-muted">{label}</span></div>
              ))}
            </div>
            <div className="rounded-2xl bg-white border border-line p-4">
              <p className="text-[10px] font-black text-gold mb-2">رابط الإحالة</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <code dir="ltr" className="flex-1 rounded-xl bg-cream border border-line px-3 py-2 text-[9.5px] font-bold text-muted break-all text-left">https://asl.sa/?ref={selected.code}</code>
                <Btn variant="soft" onClick={() => copy(`https://asl.sa/?ref=${selected.code}`, "تم نسخ رابط الإحالة ✓")}>نسخ</Btn>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white border border-line p-4">
                <p className="text-[10px] font-black text-gold mb-2">العمولة</p>
                <p className="text-[17px] font-black text-green2">{money(selected.commission)}</p>
                <p className="text-[9.5px] font-bold text-muted mt-1">تم صرف {money(selected.paid)} · متبقي {money(Number(selected.commission) - Number(selected.paid))}</p>
              </div>
              <div className="rounded-2xl bg-white border border-line p-4">
                <p className="text-[10px] font-black text-gold mb-2">تاريخ الانضمام</p>
                <p className="text-[12px] font-black">{new Date(selected.joinedAt).toLocaleDateString("ar-SA-u-ca-gregory-nu-latn", { day: "numeric", month: "long", year: "numeric" })}</p>
                <p className="text-[9.5px] font-bold text-muted mt-1">{timeAgo(selected.joinedAt)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {selected.status === "pending" && <Btn className="flex-1" onClick={() => { setStatus(selected, "active"); setSelected({ ...selected, status: "active" }); }}>اعتماد الشريك</Btn>}
              <Btn variant="soft" className="flex-1" onClick={() => { onRoleChange?.("affiliate"); setSelected(null); }}><Icon name="eye" className="w-4 h-4" /> معاينة بوابته</Btn>
              <Btn variant="soft" onClick={() => setSelected(null)}>إغلاق</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export function AffiliatePortal({ onNavigate }) {
  const { ping } = useShop();
  const [affiliates] = useState(() => read("asl_dashboard_affiliates", AFFILIATES));
  const [payouts, setPayouts] = useState(() => read("asl_dashboard_affiliate_payouts", AFFILIATE_PAYOUTS));
  const affiliate = affiliates.find((item) => item.status === "active") || affiliates[0];
  const mine = payouts.filter((item) => item.affiliateId === affiliate?.id);
  const available = Math.max(0, Number(affiliate?.commission || 0) - Number(affiliate?.paid || 0));
  const link = `https://asl.sa/?ref=${affiliate?.code || "ASL"}`;
  const chart = [38, 52, 44, 68, 61, 82, 74, 96, 88, 100];

  const copy = (text, message) => {
    navigator.clipboard?.writeText(text).then(() => ping(message)).catch(() => ping(text));
  };

  const requestPayout = () => {
    if (available <= 0) {
      ping("لا يوجد رصيد متاح للسحب حاليًا");
      return;
    }
    const payout = {
      id: `po-${Date.now()}`,
      affiliateId: affiliate.id,
      amount: available,
      status: "pending",
      requestedAt: Date.now(),
      method: "تحويل بنكي",
    };
    const next = [payout, ...payouts];
    setPayouts(next);
    write("asl_dashboard_affiliate_payouts", next);
    logAudit("طلب سحب عمولة", `${affiliate.name} — ${money(available)}`, affiliate.name);
    ping("تم إرسال طلب السحب — تجريبي ✓");
  };

  if (!affiliate) {
    return <Empty icon="users" title="لا يوجد شريك" text="أضف شريكًا أولًا من لوحة المالك." />;
  }

  return (
    <div className="space-y-5">
      <PageHead
        kicker="بوابة الشريك"
        title={`أهلًا ${affiliate.name.split(" ")[0]} — أرباحك في مكان واحد`}
        desc="شارك رابطك، تابع النقرات والطلبات، واطلب سحب عمولتك. هذه تجربة الشريك الكاملة."
        actions={<Btn onClick={() => copy(link, "تم نسخ رابط الإحالة ✓")}><Icon name="link" className="w-4 h-4" /> نسخ رابطي</Btn>}
      />

      <div className="relative overflow-hidden rounded-[1.75rem] bg-green text-cream p-6 sm:p-7">
        <div className="absolute -top-16 -left-10 w-52 h-52 rounded-full border border-gold/20" />
        <div className="absolute -bottom-24 left-20 w-64 h-64 rounded-full border border-cream/10" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <Pill tone="gold">شريك نشط · {affiliate.platform}</Pill>
            <h2 className="text-[21px] sm:text-[25px] leading-snug font-black mt-3">رصيدك المتاح</h2>
            <p className="text-[34px] sm:text-[42px] font-black tracking-tight mt-1">{money(available)}</p>
            <p className="text-[11px] font-bold text-cream/60 mt-1">إجمالي العمولة {money(affiliate.commission)} · تم صرف {money(affiliate.paid)}</p>
          </div>
          <div className="flex flex-col gap-2 min-w-[190px]">
            <Btn variant="gold" onClick={requestPayout} className="w-full"><Icon name="wallet" className="w-4 h-4" /> طلب سحب</Btn>
            <button onClick={() => copy(`استخدم كود ${affiliate.code} للحصول على خصم من أصل`, "تم نسخ رسالة المشاركة ✓")} className="rounded-2xl border border-cream/20 px-4 py-2.5 text-[10.5px] font-black text-cream/80 hover:bg-cream/10 transition-colors cursor-pointer">نسخ رسالة مشاركة</button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat icon="link" label="نقرات رابطك" value={number(affiliate.clicks)} sub="آخر 30 يومًا" />
        <Stat icon="bag" label="طلبات منسوبة" value={affiliate.orders} sub="من رابطك" tone="gold" />
        <Stat icon="wallet" label="مبيعات منسوبة" value={money(affiliate.revenue)} sub="قبل العمولة" tone="ink" />
        <Stat icon="card" label="عمولتك" value={money(affiliate.commission)} sub="15% من المبيعات" tone="cream" />
      </div>

      <div className="grid xl:grid-cols-[1.4fr_1fr] gap-5">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div><p className="text-[10px] font-black text-gold mb-1">أداؤك</p><h3 className="text-[15px] font-black">الطلبات من رابطك</h3></div>
            <Pill tone="green">+24% هذا الشهر</Pill>
          </div>
          <div className="h-40 flex items-end gap-2">
            {chart.map((height, index) => (
              <div key={index} className="flex-1 rounded-t-lg bg-green2/85" style={{ height: `${height}%`, opacity: 0.55 + index * 0.045 }} />
            ))}
          </div>
          <div className="flex justify-between text-[8.5px] font-black text-muted mt-2"><span>قبل 10 أيام</span><span>اليوم</span></div>
        </Card>
        <Card className="p-5 sm:p-6">
          <p className="text-[10px] font-black text-gold mb-1">رابطك</p>
          <h3 className="text-[15px] font-black mb-3">شارك في ثانية</h3>
          <div className="rounded-2xl bg-cream border border-line p-3">
            <p dir="ltr" className="text-[9.5px] font-bold text-muted break-all text-left">{link}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Btn variant="soft" onClick={() => copy(link, "تم نسخ الرابط ✓")}><Icon name="copy" className="w-4 h-4" /> نسخ</Btn>
            <Btn variant="soft" onClick={() => copy(affiliate.code, "تم نسخ الكود ✓")}><Icon name="tag" className="w-4 h-4" /> {affiliate.code}</Btn>
          </div>
          <div className="mt-3 rounded-2xl bg-[#e8f1ee] border border-green2/15 p-3">
            <p className="text-[9px] font-black text-green2">نصيحة</p>
            <p className="text-[10px] font-bold text-muted leading-5 mt-1">استخدم رابطًا واحدًا لكل قناة، وشارك تجربتك الحقيقية مع المتابعين.</p>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <div className="px-5 sm:px-6 py-5 border-b border-line"><p className="text-[10px] font-black text-gold mb-1">السجل</p><h3 className="text-[15px] font-black">طلبات السحب</h3></div>
          <div className="divide-y divide-line/80">
            {mine.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div><p className="text-[11px] font-black">{money(payout.amount)}</p><p className="text-[9px] font-bold text-muted">{payout.method} · {timeAgo(payout.requestedAt)}</p></div>
                <Pill tone={payout.status === "paid" ? "green" : "gold"}>{payout.status === "paid" ? "تم الصرف" : "قيد المراجعة"}</Pill>
              </div>
            ))}
            {mine.length === 0 && <p className="px-5 py-8 text-center text-[11px] font-bold text-muted">لا توجد طلبات سحب بعد.</p>}
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <p className="text-[10px] font-black text-gold mb-1">مواد جاهزة</p>
          <h3 className="text-[15px] font-black mb-4">سوّق بسهولة</h3>
          <div className="space-y-2.5">
            {[
              ["رسالة واتساب", "مرحبًا! استخدم رابطي للحصول على خصم من أصل."],
              ["ستوري إنستغرام", "اكتشفت متجر أصل — عطور وبخور بجودة عالية."],
              ["كود الخصم", `استخدم ${affiliate.code} عند الشراء.`],
            ].map(([label, text]) => (
              <button key={label} onClick={() => copy(text, `تم نسخ «${label}» ✓`)} className="w-full flex items-center justify-between gap-2 rounded-2xl bg-cream border border-line p-3 text-right hover:border-green2 transition-colors cursor-pointer">
                <span className="text-[10.5px] font-black">{label}</span>
                <Icon name="copy" className="w-3.5 h-3.5 text-muted" />
              </button>
            ))}
          </div>
          <button onClick={() => onNavigate?.("help")} className="mt-4 w-full rounded-2xl border border-line bg-white py-2.5 text-[10px] font-black text-muted hover:border-green2 transition-colors cursor-pointer">تحتاج مساعدة؟</button>
        </Card>
      </div>
    </div>
  );
}

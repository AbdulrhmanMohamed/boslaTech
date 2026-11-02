import { useMemo, useState } from "react";
import { useShop } from "../../store";
import { GIFT_CARDS, GROWTH_PROGRAMS, LOYALTY_TIERS } from "../../data/dashboardPremium";
import { read, write } from "../../lib/storage";
import { logAudit } from "../../lib/audit";
import {
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
  Toggle,
  cx,
  inputCls,
  money,
  number,
} from "./ui";

const starterRewards = [
  { id: "rw-1", name: "خصم 10%", points: 500, active: true },
  { id: "rw-2", name: "شحن مجاني", points: 800, active: true },
  { id: "rw-3", name: "هدية عينية", points: 1500, active: true },
];

const starterBundles = [
  { id: "bd-1", name: "باقة العطور", items: "عطر + بخور + شمعة", discount: 15, sales: 42, revenue: 18900, active: true },
  { id: "bd-2", name: "باقة الهدايا", items: "عطر + بطاقة هدايا", discount: 10, sales: 28, revenue: 11200, active: true },
];

export default function GrowthSection({ onNavigate }) {
  const { ping } = useShop();
  const [tab, setTab] = useState("loyalty");
  const [programs, setPrograms] = useState(() => read("asl_dashboard_growth", GROWTH_PROGRAMS));
  const [giftCards, setGiftCards] = useState(() => read("asl_dashboard_gift_cards", GIFT_CARDS));
  const [rewards, setRewards] = useState(() => read("asl_dashboard_rewards", starterRewards));
  const [bundles, setBundles] = useState(() => read("asl_dashboard_bundles", starterBundles));
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftForm, setGiftForm] = useState({ amount: "250", recipient: "", note: "" });
  const [rewardOpen, setRewardOpen] = useState(false);
  const [rewardForm, setRewardForm] = useState({ name: "", points: "500" });
  const [bundleOpen, setBundleOpen] = useState(false);
  const [bundleForm, setBundleForm] = useState({ name: "", items: "", discount: "15" });

  const save = (key, setter, value) => {
    setter(value);
    write(key, value);
  };

  const stats = useMemo(() => {
    const points = rewards.reduce((sum, reward) => sum + Number(reward.points || 0), 0);
    const liability = giftCards.filter((card) => card.status === "active").reduce((sum, card) => sum + Number(card.balance || 0), 0);
    return {
      members: LOYALTY_TIERS.reduce((sum, tier) => sum + tier.members, 0),
      rewards: points,
      liability,
      referralRevenue: bundles.reduce((sum, bundle) => sum + Number(bundle.revenue || 0), 0),
    };
  }, [giftCards, bundles, rewards]);

  const toggleProgram = (key) => {
    const next = { ...programs, [key]: !programs[key] };
    save("asl_dashboard_growth", setPrograms, next);
    logAudit(programs[key] ? "إيقاف برنامج نمو" : "تفعيل برنامج نمو", key);
    ping(programs[key] ? "تم إيقاف البرنامج" : "تم تفعيل البرنامج ✓");
  };

  const createGiftCard = () => {
    const amount = Number(giftForm.amount) || 0;
    if (amount <= 0) {
      ping("حدد قيمة بطاقة الهدية");
      return;
    }
    const card = {
      id: `gc-${Date.now()}`,
      code: `GIFT-${amount}-${Math.floor(100 + Math.random() * 899)}`,
      amount,
      balance: amount,
      recipient: giftForm.recipient.trim() || "عميل",
      status: "active",
      createdAt: Date.now(),
    };
    save("asl_dashboard_gift_cards", setGiftCards, [card, ...giftCards]);
    logAudit("إصدار بطاقة هدايا", `${card.code} — ${money(amount)}`);
    setGiftOpen(false);
    setGiftForm({ amount: "250", recipient: "", note: "" });
    ping("تم إصدار بطاقة الهدية ✓");
  };

  const createReward = () => {
    if (!rewardForm.name.trim()) {
      ping("اكتب اسم المكافأة");
      return;
    }
    const reward = { id: `rw-${Date.now()}`, name: rewardForm.name.trim(), points: Number(rewardForm.points) || 0, active: true };
    save("asl_dashboard_rewards", setRewards, [...rewards, reward]);
    logAudit("إضافة مكافأة ولاء", reward.name);
    setRewardOpen(false);
    setRewardForm({ name: "", points: "500" });
    ping("تمت إضافة المكافأة ✓");
  };

  const createBundle = () => {
    if (!bundleForm.name.trim() || !bundleForm.items.trim()) {
      ping("أكمل اسم الباقة والمنتجات");
      return;
    }
    const bundle = { id: `bd-${Date.now()}`, name: bundleForm.name.trim(), items: bundleForm.items.trim(), discount: Number(bundleForm.discount) || 10, sales: 0, revenue: 0, active: true };
    save("asl_dashboard_bundles", setBundles, [bundle, ...bundles]);
    logAudit("إنشاء باقة", bundle.name);
    setBundleOpen(false);
    setBundleForm({ name: "", items: "", discount: "15" });
    ping("تم إنشاء الباقة ✓");
  };

  const copy = (text, message) => {
    navigator.clipboard?.writeText(text).then(() => ping(message)).catch(() => ping(text));
  };

  return (
    <div className="space-y-5">
      <PageHead
        kicker="أدوات النمو"
        title="خلّي العميل يرجع ويشتري أكثر"
        desc="برنامج ولاء، إحالات، بطاقات هدايا، وباقات — أدوات تحفّز التكرار وترفع قيمة العميل."
        actions={<Btn variant="soft" onClick={() => onNavigate("marketing")}><Icon name="sparkle" className="w-4 h-4" /> ربط بحملة</Btn>}
      />

      <SectionTip
        id="growth"
        title="كل برنامج قابل للتشغيل والإيقاف"
        text="جرّب إصدار بطاقة هدايا، إضافة مكافأة، أو إنشاء باقة. الأرقام تجريبية، لكن التجربة والإجراءات كاملة."
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat icon="users" label="أعضاء الولاء" value={number(stats.members)} sub="3 مستويات" />
        <Stat icon="sparkle" label="نقاط قابلة للاستبدال" value={number(stats.rewards)} sub={`${rewards.length} مكافأة`} tone="gold" />
        <Stat icon="gift" label="رصيد بطاقات الهدايا" value={money(stats.liability)} sub="التزام على المتجر" tone="ink" />
        <Stat icon="trend" label="إيراد الباقات" value={money(stats.referralRevenue)} sub="آخر 30 يومًا" tone="cream" />
      </div>

      <Tabs
        tabs={[
          { id: "loyalty", label: "الولاء" },
          { id: "referrals", label: "الإحالات" },
          { id: "giftcards", label: "بطاقات الهدايا" },
          { id: "bundles", label: "الباقات" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "loyalty" && (
        <div className="grid xl:grid-cols-[1.2fr_1fr] gap-4">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div><p className="text-[10px] font-black text-gold mb-1">البرنامج</p><h3 className="text-[15px] font-black">نقاط الولاء والمستويات</h3></div>
              <Pill tone={programs.loyalty ? "green" : "muted"}>{programs.loyalty ? "مفعّل" : "متوقف"}</Pill>
            </div>
            <div className="grid sm:grid-cols-3 gap-2.5">
              {LOYALTY_TIERS.map((tier) => (
                <div key={tier.name} className="rounded-2xl border border-line bg-cream p-3.5">
                  <span className="w-2.5 h-2.5 rounded-full block mb-2" style={{ background: tier.color }} />
                  <p className="text-[12px] font-black">{tier.name}</p>
                  <p className="text-[9px] font-bold text-muted mt-0.5">{tier.points} نقطة</p>
                  <p className="text-[9.5px] font-black mt-2">{tier.benefit}</p>
                  <p className="text-[8.5px] font-bold text-muted mt-1">{tier.members} عضو</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <Field label="نقاط لكل 1 ر.س"><input type="number" value={programs.pointsPerRiyal} onChange={(event) => save("asl_dashboard_growth", setPrograms, { ...programs, pointsPerRiyal: event.target.value })} className={inputCls} /></Field>
              <Field label="نسبة استبدال النقاط %"><input type="number" value="5" readOnly className={inputCls} /></Field>
            </div>
            <Toggle checked={programs.loyalty} onChange={() => toggleProgram("loyalty")} label="برنامج الولاء" desc="يمنح العميل نقاطًا مع كل طلب" />
          </Card>
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div><p className="text-[10px] font-black text-gold mb-1">المكافآت</p><h3 className="text-[15px] font-black">ما يمكن استبداله</h3></div>
              <button onClick={() => setRewardOpen(true)} className="rounded-xl bg-green2 px-2.5 py-1.5 text-[9px] font-black text-cream cursor-pointer">إضافة</button>
            </div>
            <div className="space-y-2.5">
              {rewards.map((reward) => (
                <div key={reward.id} className="flex items-center gap-3 rounded-2xl bg-cream border border-line p-3">
                  <span className="w-8 h-8 rounded-xl bg-goldsoft text-[#71540f] grid place-items-center"><Icon name="gift" className="w-4 h-4" /></span>
                  <div className="min-w-0 flex-1"><p className="text-[11px] font-black">{reward.name}</p><p className="text-[9px] font-bold text-muted">{number(reward.points)} نقطة</p></div>
                  <Pill tone={reward.active ? "green" : "muted"}>{reward.active ? "متاح" : "متوقف"}</Pill>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "referrals" && (
        <div className="grid xl:grid-cols-[1.15fr_.85fr] gap-4">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div><p className="text-[10px] font-black text-gold mb-1">الإحالات</p><h3 className="text-[15px] font-black">اجعل كل عميل يجلب صديقًا</h3></div>
              <Pill tone={programs.referrals ? "green" : "muted"}>{programs.referrals ? "مفعّل" : "متوقف"}</Pill>
            </div>
            <div className="rounded-2xl bg-cream border border-line p-4 mb-4">
              <p className="text-[10px] font-black text-muted">رابط الإحالة العام</p>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <code dir="ltr" className="flex-1 rounded-xl bg-white border border-line px-3 py-2 text-[9.5px] font-bold text-muted break-all text-left">https://asl.sa/?ref=friends</code>
                <Btn variant="soft" onClick={() => copy("https://asl.sa/?ref=friends", "تم نسخ رابط الإحالة ✓")}>نسخ</Btn>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="مكافأة صاحب الإحالة (ر.س)"><input type="number" value={programs.referralReward} onChange={(event) => save("asl_dashboard_growth", setPrograms, { ...programs, referralReward: event.target.value })} className={inputCls} /></Field>
              <Field label="مكافأة الصديق (ر.س)"><input type="number" value={programs.refereeReward} onChange={(event) => save("asl_dashboard_growth", setPrograms, { ...programs, refereeReward: event.target.value })} className={inputCls} /></Field>
            </div>
            <Toggle checked={programs.referrals} onChange={() => toggleProgram("referrals")} label="برنامج الإحالة" desc="مكافأة الطرفين عند أول طلب" />
          </Card>
          <Card className="p-5 sm:p-6">
            <p className="text-[10px] font-black text-gold mb-1">النتائج</p>
            <h3 className="text-[15px] font-black mb-4">أفضل المُحيلين</h3>
            <div className="space-y-2.5">
              {[
                ["نورة القحطاني", 14, 3200],
                ["خالد الشمري", 9, 2100],
                ["ريم الدوسري", 7, 1640],
              ].map(([name, count, revenue], index) => (
                <div key={name} className="flex items-center gap-3 rounded-2xl bg-cream border border-line p-3">
                  <span className="w-5 text-[10px] font-black text-muted">{index + 1}</span>
                  <span className="w-8 h-8 rounded-full bg-green2 text-cream grid place-items-center text-[9px] font-black">{String(name).split(" ").map((part) => part[0]).join("")}</span>
                  <div className="min-w-0 flex-1"><p className="text-[10.5px] font-black">{name}</p><p className="text-[9px] font-bold text-muted">{count} إحالة</p></div>
                  <b className="text-[11px] font-black text-green2">{money(revenue)}</b>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "giftcards" && (
        <div className="space-y-4">
          <div className="flex justify-end"><Btn onClick={() => setGiftOpen(true)}><Icon name="gift" className="w-4 h-4" /> إصدار بطاقة</Btn></div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {giftCards.map((card) => (
              <Card key={card.id} className="p-5 relative overflow-hidden">
                <div className="absolute -left-5 -bottom-5 w-24 h-24 rounded-full bg-gold/10" />
                <div className="relative flex items-start justify-between gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-goldsoft text-[#71540f] grid place-items-center"><Icon name="gift" className="w-5 h-5" /></span>
                  <Pill tone={card.status === "active" ? "green" : "muted"}>{card.status === "active" ? "نشطة" : "مستخدمة"}</Pill>
                </div>
                <p className="relative text-[21px] font-black mt-4">{money(card.amount)}</p>
                <p className="relative text-[10px] font-bold text-muted">الرصيد المتبقي {money(card.balance)}</p>
                <div className="relative mt-3 rounded-xl border border-dashed border-gold/50 bg-goldsoft/25 px-3 py-2 text-center">
                  <code dir="ltr" className="text-[11px] font-black tracking-[0.1em] text-green2">{card.code}</code>
                </div>
                <div className="relative flex items-center justify-between gap-2 mt-3">
                  <span className="text-[9px] font-bold text-muted">لـ {card.recipient}</span>
                  <button onClick={() => copy(card.code, "تم نسخ كود البطاقة ✓")} className="text-[9px] font-black text-green2 hover:text-gold cursor-pointer">نسخ الكود</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "bundles" && (
        <div className="space-y-4">
          <div className="flex justify-end"><Btn onClick={() => setBundleOpen(true)}><Icon name="box" className="w-4 h-4" /> باقة جديدة</Btn></div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {bundles.map((bundle) => (
              <Card key={bundle.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-[#e8f1ee] text-green2 grid place-items-center"><Icon name="layers" className="w-5 h-5" /></span>
                  <Pill tone={bundle.active ? "green" : "muted"}>{bundle.active ? "نشطة" : "متوقفة"}</Pill>
                </div>
                <h3 className="text-[14px] font-black mt-4">{bundle.name}</h3>
                <p className="text-[10px] font-bold text-muted mt-1">{bundle.items}</p>
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-line">
                  <div><b className="block text-[16px] font-black text-green2">-{bundle.discount}%</b><span className="text-[8.5px] font-black text-muted">{bundle.sales} عملية بيع</span></div>
                  <div className="text-left"><b className="block text-[12px] font-black">{money(bundle.revenue)}</b><span className="text-[8.5px] font-black text-muted">إيراد</span></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Modal open={giftOpen} onClose={() => setGiftOpen(false)} title="إصدار بطاقة هدايا" subtitle="بطاقة تجريبية — تُحفظ في هذا المتصفح">
        <div className="space-y-4">
          <Field label="قيمة البطاقة (ر.س)"><input type="number" value={giftForm.amount} onChange={(event) => setGiftForm((form) => ({ ...form, amount: event.target.value }))} className={inputCls} /></Field>
          <Field label="اسم المستلم"><input value={giftForm.recipient} onChange={(event) => setGiftForm((form) => ({ ...form, recipient: event.target.value }))} className={inputCls} placeholder="مثال: نورة" /></Field>
          <Field label="رسالة هدية"><input value={giftForm.note} onChange={(event) => setGiftForm((form) => ({ ...form, note: event.target.value }))} className={inputCls} placeholder="كل عام وأنت بخير" /></Field>
          <div className="flex gap-2"><Btn className="flex-1" onClick={createGiftCard}>إصدار البطاقة</Btn><Btn variant="soft" onClick={() => setGiftOpen(false)}>إلغاء</Btn></div>
        </div>
      </Modal>

      <Modal open={rewardOpen} onClose={() => setRewardOpen(false)} title="مكافأة ولاء جديدة" subtitle="حدد الاسم وعدد النقاط">
        <div className="space-y-4">
          <Field label="اسم المكافأة"><input value={rewardForm.name} onChange={(event) => setRewardForm((form) => ({ ...form, name: event.target.value }))} className={inputCls} placeholder="مثال: خصم 20%" /></Field>
          <Field label="النقاط المطلوبة"><input type="number" value={rewardForm.points} onChange={(event) => setRewardForm((form) => ({ ...form, points: event.target.value }))} className={inputCls} /></Field>
          <div className="flex gap-2"><Btn className="flex-1" onClick={createReward}>إضافة المكافأة</Btn><Btn variant="soft" onClick={() => setRewardOpen(false)}>إلغاء</Btn></div>
        </div>
      </Modal>

      <Modal open={bundleOpen} onClose={() => setBundleOpen(false)} title="باقة جديدة" subtitle="اجمع منتجات بعرض واحد">
        <div className="space-y-4">
          <Field label="اسم الباقة"><input value={bundleForm.name} onChange={(event) => setBundleForm((form) => ({ ...form, name: event.target.value }))} className={inputCls} placeholder="مثال: باقة العطور" /></Field>
          <Field label="المنتجات"><input value={bundleForm.items} onChange={(event) => setBundleForm((form) => ({ ...form, items: event.target.value }))} className={inputCls} placeholder="عطر + بخور + شمعة" /></Field>
          <Field label="نسبة الخصم %"><input type="number" value={bundleForm.discount} onChange={(event) => setBundleForm((form) => ({ ...form, discount: event.target.value }))} className={inputCls} /></Field>
          <div className="flex gap-2"><Btn className="flex-1" onClick={createBundle}>إنشاء الباقة</Btn><Btn variant="soft" onClick={() => setBundleOpen(false)}>إلغاء</Btn></div>
        </div>
      </Modal>
    </div>
  );
}

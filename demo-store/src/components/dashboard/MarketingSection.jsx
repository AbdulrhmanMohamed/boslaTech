import { useMemo, useState } from "react";
import { useShop } from "../../store";
import {
  AUTOMATIONS,
  CAMPAIGNS,
  MARKETING_INTEGRATIONS,
  SEGMENTS,
} from "../../data/dashboardPremium";
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
  cx,
  inputCls,
  money,
  number,
  timeAgo,
} from "./ui";

const channelTone = (channel) => {
  if (channel?.includes("WhatsApp")) return "green";
  if (channel?.includes("Instagram")) return "gold";
  if (channel?.includes("SMS")) return "ink";
  return "muted";
};

const campaignTone = (status) => {
  if (status === "active") return "green";
  if (status === "scheduled") return "gold";
  if (status === "paused") return "muted";
  return "ink";
};

const blankCampaign = {
  name: "",
  channel: "WhatsApp",
  audience: "seg-vip",
  message: "",
  budget: "",
  scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
};

const blankSegment = { name: "", rule: "", count: "" };
const blankAutomation = { name: "", trigger: "", action: "" };

export default function MarketingSection({ onNavigate }) {
  const { ping } = useShop();
  const [tab, setTab] = useState("campaigns");
  const [campaigns, setCampaigns] = useState(() => read("asl_dashboard_campaigns", CAMPAIGNS));
  const [segments, setSegments] = useState(() => read("asl_dashboard_segments", SEGMENTS));
  const [automations, setAutomations] = useState(() => read("asl_dashboard_automations", AUTOMATIONS));
  const [integrations, setIntegrations] = useState(() => read("asl_dashboard_integrations", MARKETING_INTEGRATIONS));
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState(blankCampaign);
  const [preview, setPreview] = useState(null);
  const [segmentOpen, setSegmentOpen] = useState(false);
  const [segmentForm, setSegmentForm] = useState(blankSegment);
  const [automationOpen, setAutomationOpen] = useState(false);
  const [automationForm, setAutomationForm] = useState(blankAutomation);
  const [utm, setUtm] = useState({ base: "https://asl.sa/shop", source: "instagram", medium: "social", campaign: "eid-offer" });

  const save = (key, setter, value) => {
    setter(value);
    write(key, value);
  };

  const stats = useMemo(() => {
    const active = campaigns.filter((campaign) => campaign.status === "active");
    const revenue = campaigns.reduce((sum, campaign) => sum + Number(campaign.revenue || 0), 0);
    const opens = campaigns.filter((campaign) => campaign.sent).reduce((sum, campaign) => sum + Number(campaign.opens || 0), 0);
    const sent = campaigns.reduce((sum, campaign) => sum + Number(campaign.sent || 0), 0);
    return {
      revenue,
      active: active.length,
      openRate: Math.round((opens / Math.max(sent, 1)) * 100),
      automationRevenue: automations.reduce((sum, item) => sum + Number(item.revenue || 0), 0),
    };
  }, [campaigns, automations]);

  const createCampaign = () => {
    if (!campaignForm.name.trim() || !campaignForm.message.trim()) {
      ping("اكتب اسم الحملة ونص الرسالة");
      return;
    }
    const campaign = {
      ...campaignForm,
      id: `cmp-${Date.now()}`,
      status: "draft",
      sent: 0,
      revenue: 0,
      opens: 0,
      clicks: 0,
      scheduledAt: new Date(campaignForm.scheduledAt).getTime(),
      budget: Number(campaignForm.budget) || 0,
    };
    save("asl_dashboard_campaigns", setCampaigns, [campaign, ...campaigns]);
    logAudit("إنشاء حملة", campaign.name);
    setCampaignOpen(false);
    setCampaignForm(blankCampaign);
    ping("تم حفظ الحملة كمسودة ✓");
  };

  const updateCampaign = (id, patch) => {
    save("asl_dashboard_campaigns", setCampaigns, campaigns.map((campaign) => campaign.id === id ? { ...campaign, ...patch } : campaign));
  };

  const launchCampaign = (campaign) => {
    const segment = segments.find((item) => item.id === campaign.audience);
    updateCampaign(campaign.id, { status: "active", sent: segment?.count || 0, opens: Math.round((segment?.count || 0) * 0.68), clicks: Math.round((segment?.count || 0) * 0.31) });
    logAudit("إطلاق حملة", campaign.name);
    ping(`تم إطلاق «${campaign.name}» — تجريبي ✓`);
  };

  const createSegment = () => {
    if (!segmentForm.name.trim() || !segmentForm.rule.trim()) {
      ping("اكتب اسم الشريحة وقاعدة التحديد");
      return;
    }
    const segment = {
      id: `seg-${Date.now()}`,
      name: segmentForm.name.trim(),
      rule: segmentForm.rule.trim(),
      count: Number(segmentForm.count) || 0,
      revenue: 0,
      color: "#1e5b4f",
      active: true,
    };
    save("asl_dashboard_segments", setSegments, [segment, ...segments]);
    logAudit("إنشاء شريحة", segment.name);
    setSegmentOpen(false);
    setSegmentForm(blankSegment);
    ping("تم إنشاء الشريحة ✓");
  };

  const createAutomation = () => {
    if (!automationForm.name.trim() || !automationForm.trigger.trim() || !automationForm.action.trim()) {
      ping("أكمل اسم الأتمتة والمشغّل والإجراء");
      return;
    }
    const automation = { ...automationForm, id: `auto-${Date.now()}`, active: true, runs: 0, revenue: 0, conversion: 0 };
    save("asl_dashboard_automations", setAutomations, [automation, ...automations]);
    logAudit("إنشاء أتمتة", automation.name);
    setAutomationOpen(false);
    setAutomationForm(blankAutomation);
    ping("تم إنشاء الأتمتة ✓");
  };

  const toggleAutomation = (automation) => {
    save("asl_dashboard_automations", setAutomations, automations.map((item) => item.id === automation.id ? { ...item, active: !item.active } : item));
    logAudit(automation.active ? "إيقاف أتمتة" : "تفعيل أتمتة", automation.name);
    ping(automation.active ? "تم إيقاف الأتمتة مؤقتًا" : "تم تفعيل الأتمتة ✓");
  };

  const runAutomation = (automation) => {
    save("asl_dashboard_automations", setAutomations, automations.map((item) => item.id === automation.id ? { ...item, runs: item.runs + 1, revenue: item.revenue + 240, conversion: Math.max(item.conversion, 12) } : item));
    logAudit("تشغيل أتمتة", automation.name);
    ping("تم تنفيذ الأتمتة — نتيجة تجريبية ✓");
  };

  const toggleIntegration = (integration) => {
    save("asl_dashboard_integrations", setIntegrations, integrations.map((item) => item.id === integration.id ? { ...item, status: item.status === "connected" ? "demo" : "connected" } : item));
    logAudit("تحديث تكامل", integration.name);
    ping(integration.status === "connected" ? "تم فصل التكامل — تجريبي" : "تم ربط التكامل — معاينة تجريبية");
  };

  const utmUrl = `${utm.base}${utm.base.includes("?") ? "&" : "?"}utm_source=${encodeURIComponent(utm.source)}&utm_medium=${encodeURIComponent(utm.medium)}&utm_campaign=${encodeURIComponent(utm.campaign)}`;

  const copy = (text, message) => {
    navigator.clipboard?.writeText(text).then(() => ping(message)).catch(() => ping(text));
  };

  return (
    <div className="space-y-5">
      <PageHead
        kicker="التسويق والنمو"
        title="حملات، شرائح، وأتمتة في مكان واحد"
        desc={`${stats.active} حملة نشطة الآن. ${money(stats.revenue)} إيرادات منسوبة للتسويق، ومعدل فتح ${stats.openRate}% — كلها بيانات عرض قابلة للتجربة.`}
        actions={
          <>
            <Btn variant="soft" onClick={() => onNavigate("analytics")}><Icon name="chart" className="w-4 h-4" /> التحليلات</Btn>
            <Btn onClick={() => setCampaignOpen(true)}><Icon name="plus" className="w-4 h-4" /> حملة جديدة</Btn>
          </>
        }
      />

      <SectionTip
        id="marketing"
        title="كل زر هنا يعطي نتيجة"
        text="أنشئ حملة، جرّب الجمهور، أطلقها، وشاهد الأرقام تتحدث. الأتمتة والسلات المتروكة والتكاملات كلها معاينات حقيقية للفكرة — بدون إرسال فعلي."
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat icon="sparkle" label="حملات نشطة" value={stats.active} sub={`${campaigns.length} حملة إجمالًا`} />
        <Stat icon="wallet" label="إيرادات منسوبة" value={money(stats.revenue)} sub="تقديري من الحملات" tone="gold" />
        <Stat icon="mail" label="معدل الفتح" value={`${stats.openRate}%`} sub="آخر الحملات" tone="ink" />
        <Stat icon="zap" label="إيرادات الأتمتة" value={money(stats.automationRevenue)} sub={`${automations.filter((item) => item.active).length} أتمتة مفعلة`} tone="cream" />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Tabs
          tabs={[
            { id: "campaigns", label: "الحملات" },
            { id: "segments", label: "الشرائح" },
            { id: "automations", label: "الأتمتة" },
            { id: "integrations", label: "التكاملات والقياس" },
          ]}
          value={tab}
          onChange={setTab}
        />
        <span className="text-[10px] font-bold text-muted">لا يتم إرسال رسائل أو سحب مبالغ حقيقية</span>
      </div>

      {tab === "campaigns" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {campaigns.map((campaign) => {
              const segment = segments.find((item) => item.id === campaign.audience);
              return (
                <Card key={campaign.id} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Pill tone={campaignTone(campaign.status)}>
                      {campaign.status === "active" ? "نشطة" : campaign.status === "scheduled" ? "مجدولة" : campaign.status === "paused" ? "متوقفة" : "مسودة"}
                    </Pill>
                    <Pill tone={channelTone(campaign.channel)}>{campaign.channel}</Pill>
                  </div>
                  <h3 className="text-[14px] font-black leading-snug">{campaign.name}</h3>
                  <p className="text-[10px] font-bold text-muted mt-1">{segment?.name || "شريحة مخصصة"} · {campaign.sent || 0} مستلم</p>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="rounded-xl bg-cream border border-line p-2 text-center"><b className="block text-[12px] font-black">{campaign.opens || 0}</b><span className="text-[8px] font-black text-muted">فتح</span></div>
                    <div className="rounded-xl bg-cream border border-line p-2 text-center"><b className="block text-[12px] font-black">{campaign.clicks || 0}</b><span className="text-[8px] font-black text-muted">نقر</span></div>
                    <div className="rounded-xl bg-cream border border-line p-2 text-center"><b className="block text-[12px] font-black text-green2">{money(campaign.revenue || 0)}</b><span className="text-[8px] font-black text-muted">إيراد</span></div>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-line">
                    <button onClick={() => setPreview(campaign)} className="text-[10px] font-black text-green2 hover:text-gold cursor-pointer">معاينة الرسالة</button>
                    <div className="flex gap-1.5">
                      {campaign.status === "draft" || campaign.status === "scheduled" ? (
                        <button onClick={() => launchCampaign(campaign)} className="rounded-xl bg-green2 px-2.5 py-1.5 text-[9px] font-black text-cream cursor-pointer">إطلاق</button>
                      ) : (
                        <button onClick={() => updateCampaign(campaign.id, { status: campaign.status === "active" ? "paused" : "active" })} className="rounded-xl border border-line bg-white px-2.5 py-1.5 text-[9px] font-black text-muted hover:border-green2 cursor-pointer">{campaign.status === "active" ? "إيقاف" : "استئناف"}</button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-[10px] font-black text-gold mb-1">أداة سريعة</p>
                  <h3 className="text-[15px] font-black">مُنشئ روابط UTM</h3>
                  <p className="text-[10.5px] font-bold text-muted mt-1">أنشئ رابطًا قابلًا للتتبع لحملاتك.</p>
                </div>
                <Icon name="link" className="w-5 h-5 text-gold" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <Field label="الرابط الأساسي"><input dir="ltr" value={utm.base} onChange={(event) => setUtm((current) => ({ ...current, base: event.target.value }))} className={cx(inputCls, "text-left")} /></Field>
                <Field label="المصدر"><input dir="ltr" value={utm.source} onChange={(event) => setUtm((current) => ({ ...current, source: event.target.value }))} className={cx(inputCls, "text-left")} /></Field>
                <Field label="الوسيط"><input dir="ltr" value={utm.medium} onChange={(event) => setUtm((current) => ({ ...current, medium: event.target.value }))} className={cx(inputCls, "text-left")} /></Field>
                <Field label="اسم الحملة"><input dir="ltr" value={utm.campaign} onChange={(event) => setUtm((current) => ({ ...current, campaign: event.target.value }))} className={cx(inputCls, "text-left")} /></Field>
              </div>
              <div className="mt-3 rounded-2xl bg-cream border border-line p-3">
                <p dir="ltr" className="text-[9px] font-bold text-muted break-all text-left">{utmUrl}</p>
              </div>
              <Btn variant="soft" className="mt-3 w-full" onClick={() => copy(utmUrl, "تم نسخ رابط UTM ✓")}><Icon name="copy" className="w-4 h-4" /> نسخ الرابط</Btn>
            </Card>

            <Card className="p-5 sm:p-6">
              <p className="text-[10px] font-black text-gold mb-1">اختبار A/B</p>
              <h3 className="text-[15px] font-black mb-4">أي عنوان أفضل؟</h3>
              <div className="space-y-2.5">
                <div className="rounded-2xl border border-green2/35 bg-[#e8f1ee] p-3.5">
                  <div className="flex items-center justify-between gap-2"><p className="text-[10.5px] font-black">النسخة A</p><Pill tone="green">الفاتح</Pill></div>
                  <p className="text-[10px] font-bold text-muted mt-1">«عطرك المفضل وصل — خصم 15% اليوم فقط»</p>
                  <div className="flex items-center gap-3 mt-2 text-[9px] font-black text-muted"><span>فتح 72%</span><span>نقر 34%</span></div>
                </div>
                <div className="rounded-2xl border border-line bg-cream p-3.5">
                  <div className="flex items-center justify-between gap-2"><p className="text-[10.5px] font-black">النسخة B</p><Pill tone="muted">مغلق</Pill></div>
                  <p className="text-[10px] font-bold text-muted mt-1">«وصل حديثًا: عطر العنبر الفاخر»</p>
                  <div className="flex items-center gap-3 mt-2 text-[9px] font-black text-muted"><span>فتح 68%</span><span>نقر 29%</span></div>
                </div>
              </div>
              <Btn variant="soft" className="mt-3 w-full" onClick={() => { logAudit("اعتماد اختبار A/B", "النسخة A"); ping("تم اعتماد النسخة A — تجريبي ✓"); }}>اعتماد النسخة الفائزة</Btn>
            </Card>
          </div>
        </div>
      )}

      {tab === "segments" && (
        <div className="space-y-4">
          <div className="flex justify-end"><Btn onClick={() => setSegmentOpen(true)}><Icon name="plus" className="w-4 h-4" /> شريحة جديدة</Btn></div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {segments.map((segment) => (
              <Card key={segment.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="w-10 h-10 rounded-2xl grid place-items-center" style={{ background: `${segment.color}18`, color: segment.color }}><Icon name="users" className="w-[18px] h-[18px]" /></span>
                  <Pill tone="muted">{segment.active ? "نشطة" : "متوقفة"}</Pill>
                </div>
                <h3 className="text-[14px] font-black mt-4">{segment.name}</h3>
                <p className="text-[10px] font-bold text-muted mt-1 min-h-10">{segment.rule}</p>
                <div className="flex items-end justify-between gap-3 mt-4 pt-3 border-t border-line">
                  <div><b className="block text-[20px] font-black">{number(segment.count)}</b><span className="text-[9px] font-black text-muted">عميل</span></div>
                  <div className="text-left"><b className="block text-[13px] font-black text-green2">{money(segment.revenue)}</b><span className="text-[9px] font-black text-muted">إيراد</span></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "automations" && (
        <div className="space-y-4">
          <div className="flex justify-end"><Btn onClick={() => setAutomationOpen(true)}><Icon name="plus" className="w-4 h-4" /> أتمتة جديدة</Btn></div>
          <div className="grid md:grid-cols-2 gap-4">
            {automations.map((automation) => (
              <Card key={automation.id} className={cx("p-5", !automation.active && "opacity-75")}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className={cx("w-10 h-10 rounded-2xl grid place-items-center", automation.active ? "bg-[#e8f1ee] text-green2" : "bg-cream text-muted")}><Icon name="zap" className="w-[18px] h-[18px]" /></span>
                  <button onClick={() => toggleAutomation(automation)} className={cx("relative w-11 h-6 rounded-full transition-colors cursor-pointer", automation.active ? "bg-green2" : "bg-line")} aria-label="تبديل الأتمتة">
                    <span className={cx("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all", automation.active ? "right-0.5" : "right-[22px]")} />
                  </button>
                </div>
                <h3 className="text-[14px] font-black">{automation.name}</h3>
                <div className="mt-3 space-y-2">
                  <div className="rounded-xl bg-cream border border-line px-3 py-2"><span className="text-[8.5px] font-black text-muted">المشغّل</span><p className="text-[10px] font-black mt-0.5">{automation.trigger}</p></div>
                  <div className="rounded-xl bg-cream border border-line px-3 py-2"><span className="text-[8.5px] font-black text-muted">الإجراء</span><p className="text-[10px] font-black mt-0.5">{automation.action}</p></div>
                </div>
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-line">
                  <span className="text-[9px] font-bold text-muted">{automation.runs} تشغيل · {money(automation.revenue)}</span>
                  <button onClick={() => runAutomation(automation)} className="rounded-xl bg-white border border-line px-2.5 py-1.5 text-[9px] font-black text-muted hover:border-green2 cursor-pointer">تشغيل الآن</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "integrations" && (
        <div className="space-y-4">
          <Card className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-[10px] font-black text-gold mb-1">قياس الإعلانات</p>
                <h3 className="text-[15px] font-black">اربط مصادر الزيارات والتحويلات</h3>
                <p className="text-[10.5px] font-bold text-muted mt-1">هذه معاينات للتكامل. الربط الفعلي يتم بعد ربط المتجر بالخادم.</p>
              </div>
              <Pill tone="gold">Demo preview</Pill>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {integrations.map((integration) => (
                <div key={integration.id} className="rounded-2xl bg-cream border border-line p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="w-9 h-9 rounded-xl bg-white border border-line grid place-items-center text-[9px] font-black text-green2">{integration.tag}</span>
                    <Pill tone={integration.status === "connected" ? "green" : "gold"}>{integration.status === "connected" ? "متصل" : "معاينة"}</Pill>
                  </div>
                  <p className="text-[11.5px] font-black mt-3">{integration.name}</p>
                  <p className="text-[9.5px] font-bold text-muted mt-0.5">{integration.desc}</p>
                  <button onClick={() => toggleIntegration(integration)} className={cx("mt-3 w-full rounded-xl py-2 text-[9.5px] font-black transition-colors cursor-pointer", integration.status === "connected" ? "bg-white border border-line text-muted hover:border-green2" : "bg-green2 text-cream")}>
                    {integration.status === "connected" ? "فصل التكامل" : "ربط تجريبي"}
                  </button>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black text-gold mb-1">تقرير القياس</p>
                <h3 className="text-[14px] font-black">آخر 14 يومًا</h3>
                <p className="text-[10.5px] font-bold text-muted mt-1">3,820 زيارة من الحملات · 142 تحويلًا · ROAS 3.4x</p>
              </div>
              <Btn variant="soft" onClick={() => onNavigate("analytics")}><Icon name="chart" className="w-4 h-4" /> تقرير كامل</Btn>
            </div>
          </Card>
        </div>
      )}

      <Modal open={campaignOpen} onClose={() => setCampaignOpen(false)} title="حملة تسويقية جديدة" subtitle="حملة تجريبية — لا يتم إرسال رسائل حقيقية" wide>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Field label="اسم الحملة"><input value={campaignForm.name} onChange={(event) => setCampaignForm((form) => ({ ...form, name: event.target.value }))} className={inputCls} placeholder="مثال: عرض نهاية الأسبوع" /></Field></div>
          <Field label="القناة">
            <select value={campaignForm.channel} onChange={(event) => setCampaignForm((form) => ({ ...form, channel: event.target.value }))} className={inputCls}>
              {["WhatsApp", "Email", "SMS", "Instagram", "Email + WhatsApp"].map((channel) => <option key={channel}>{channel}</option>)}
            </select>
          </Field>
          <Field label="الشريحة">
            <select value={campaignForm.audience} onChange={(event) => setCampaignForm((form) => ({ ...form, audience: event.target.value }))} className={inputCls}>
              {segments.map((segment) => <option key={segment.id} value={segment.id}>{segment.name} — {segment.count}</option>)}
            </select>
          </Field>
          <Field label="موعد الإرسال"><input type="date" value={campaignForm.scheduledAt} onChange={(event) => setCampaignForm((form) => ({ ...form, scheduledAt: event.target.value }))} className={inputCls} /></Field>
          <Field label="الميزانية الإعلانية (ر.س)"><input type="number" value={campaignForm.budget} onChange={(event) => setCampaignForm((form) => ({ ...form, budget: event.target.value }))} className={inputCls} placeholder="0" /></Field>
          <div className="sm:col-span-2"><Field label="نص الرسالة"><textarea value={campaignForm.message} onChange={(event) => setCampaignForm((form) => ({ ...form, message: event.target.value }))} rows={4} className={inputCls} placeholder="اكتب رسالة قصيرة وواضحة..." /></Field></div>
          <div className="sm:col-span-2 rounded-2xl bg-white border border-line p-4">
            <p className="text-[10px] font-black text-gold mb-2">معاينة</p>
            <div className="rounded-2xl bg-[#e8f1ee] border border-green2/15 p-3.5">
              <p className="text-[10.5px] font-black">{campaignForm.name || "اسم الحملة"}</p>
              <p className="text-[10.5px] font-bold text-muted mt-1 leading-5">{campaignForm.message || "ستظهر رسالتك هنا..."}</p>
              <p className="text-[8.5px] font-black text-green2 mt-2">أصل ASL · {campaignForm.channel}</p>
            </div>
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <Btn className="flex-1" onClick={createCampaign}><Icon name="send" className="w-4 h-4" /> حفظ كمسودة</Btn>
            <Btn variant="soft" onClick={() => setCampaignOpen(false)}>إلغاء</Btn>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(preview)} onClose={() => setPreview(null)} title="معاينة الحملة" subtitle={preview ? `${preview.channel} · ${preview.sent || 0} مستلم` : ""}>
        {preview && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-line p-4">
              <p className="text-[10px] font-black text-gold mb-2">الرسالة</p>
              <p className="text-[12px] font-bold leading-6">{preview.name}</p>
              <p className="text-[11px] font-bold text-muted leading-6 mt-2">مرحبًا {`{{الاسم}}`}، لديك عرض خاص من أصل. استخدم الكود ASL15 قبل نهاية الأسبوع.</p>
            </div>
            <div className="rounded-2xl bg-[#e8f1ee] border border-green2/15 p-3.5">
              <p className="text-[9px] font-black text-green2">هذه معاينة فقط</p>
              <p className="text-[10px] font-bold text-muted mt-1">لن يتم إرسال أي رسالة حقيقية من النسخة التجريبية.</p>
            </div>
            <Btn className="w-full" onClick={() => { if (preview.status !== "active") launchCampaign(preview); setPreview(null); }}>إطلاق الحملة</Btn>
          </div>
        )}
      </Modal>

      <Modal open={segmentOpen} onClose={() => setSegmentOpen(false)} title="شريحة عملاء جديدة" subtitle="حدد قاعدة واضحة وسيتم حساب العملاء">
        <div className="space-y-4">
          <Field label="اسم الشريحة"><input value={segmentForm.name} onChange={(event) => setSegmentForm((form) => ({ ...form, name: event.target.value }))} className={inputCls} placeholder="مثال: عملاء الرياض" /></Field>
          <Field label="قاعدة التحديد"><input value={segmentForm.rule} onChange={(event) => setSegmentForm((form) => ({ ...form, rule: event.target.value }))} className={inputCls} placeholder="مثال: المدينة = الرياض وآخر طلب أقل من 30 يوم" /></Field>
          <Field label="عدد العملاء المتوقع"><input type="number" value={segmentForm.count} onChange={(event) => setSegmentForm((form) => ({ ...form, count: event.target.value }))} className={inputCls} placeholder="0" /></Field>
          <div className="flex gap-2"><Btn className="flex-1" onClick={createSegment}>حفظ الشريحة</Btn><Btn variant="soft" onClick={() => setSegmentOpen(false)}>إلغاء</Btn></div>
        </div>
      </Modal>

      <Modal open={automationOpen} onClose={() => setAutomationOpen(false)} title="أتمتة جديدة" subtitle="مشغّل واحد وإجراء واضح — تجريبي">
        <div className="space-y-4">
          <Field label="اسم الأتمتة"><input value={automationForm.name} onChange={(event) => setAutomationForm((form) => ({ ...form, name: event.target.value }))} className={inputCls} placeholder="مثال: متابعة العميل بعد الشراء" /></Field>
          <Field label="المشغّل"><input value={automationForm.trigger} onChange={(event) => setAutomationForm((form) => ({ ...form, trigger: event.target.value }))} className={inputCls} placeholder="مثال: مر 7 أيام على آخر طلب" /></Field>
          <Field label="الإجراء"><input value={automationForm.action} onChange={(event) => setAutomationForm((form) => ({ ...form, action: event.target.value }))} className={inputCls} placeholder="مثال: واتساب + كوبون 10%" /></Field>
          <div className="flex gap-2"><Btn className="flex-1" onClick={createAutomation}>إنشاء الأتمتة</Btn><Btn variant="soft" onClick={() => setAutomationOpen(false)}>إلغاء</Btn></div>
        </div>
      </Modal>
    </div>
  );
}

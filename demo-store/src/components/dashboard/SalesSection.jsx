import { useMemo, useState } from "react";
import { useShop } from "../../store";
import { SALES_LEADS, SALES_STAGES, TEAM_MEMBERS } from "../../data/dashboardPremium";
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
  cx,
  inputCls,
  money,
  number,
  timeAgo,
} from "./ui";

const blankLead = {
  name: "",
  company: "",
  phone: "",
  email: "",
  source: "Instagram",
  value: "",
  stage: "new",
  ownerId: "",
  city: "الرياض",
  nextTask: "اتصال تعريفي",
  notes: "",
};

const sourceTone = (source) => {
  if (source === "Google") return "green";
  if (source === "Snapchat") return "gold";
  if (source === "Instagram") return "gold";
  if (source === "إحالة") return "ink";
  return "muted";
};

const stageMeta = (id) => SALES_STAGES.find((stage) => stage.id === id) || SALES_STAGES[0];

export default function SalesSection({ onNavigate }) {
  const { ping } = useShop();
  const [leads, setLeads] = useState(() => read("asl_dashboard_leads", SALES_LEADS));
  const [team] = useState(() => read("asl_dashboard_team", TEAM_MEMBERS));
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [dragId, setDragId] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blankLead);
  const [selectedId, setSelectedId] = useState(null);
  const [taskDraft, setTaskDraft] = useState("");

  const selected = leads.find((lead) => lead.id === selectedId) || null;
  const agents = team.filter((member) => ["sales", "owner", "admin"].includes(member.roleId));

  const save = (next) => {
    setLeads(next);
    write("asl_dashboard_leads", next);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const byOwner = ownerFilter === "all" || lead.ownerId === ownerFilter;
      const byQuery = !q || [lead.name, lead.company, lead.phone, lead.city, lead.source].filter(Boolean).some((value) => String(value).toLowerCase().includes(q));
      return byOwner && byQuery;
    });
  }, [leads, ownerFilter, query]);

  const stats = useMemo(() => {
    const openLeads = leads.filter((lead) => !["won", "lost"].includes(lead.stage));
    const won = leads.filter((lead) => lead.stage === "won");
    const lost = leads.filter((lead) => lead.stage === "lost");
    return {
      pipeline: openLeads.reduce((sum, lead) => sum + Number(lead.value || 0), 0),
      won: won.reduce((sum, lead) => sum + Number(lead.value || 0), 0),
      wonCount: won.length,
      conversion: Math.round((won.length / Math.max(won.length + lost.length, 1)) * 100),
      open: openLeads.length,
    };
  }, [leads]);

  const performance = useMemo(() => {
    return agents.map((agent) => {
      const mine = leads.filter((lead) => lead.ownerId === agent.id);
      const won = mine.filter((lead) => lead.stage === "won");
      return {
        ...agent,
        total: mine.length,
        won: won.length,
        value: won.reduce((sum, lead) => sum + Number(lead.value || 0), 0),
      };
    }).sort((a, b) => b.value - a.value);
  }, [agents, leads]);

  const updateLead = (id, patch) => {
    save(leads.map((lead) => lead.id === id ? { ...lead, ...patch } : lead));
    if (selectedId === id) setSelectedId(id);
  };

  const moveLead = (id, stage) => {
    const lead = leads.find((item) => item.id === id);
    if (!lead || lead.stage === stage) return;
    updateLead(id, {
      stage,
      activity: [{ id: `a-${Date.now()}`, text: `تم نقل الفرصة إلى «${stageMeta(stage).label}»`, ts: Date.now() }, ...(lead.activity || [])],
    });
    logAudit("تحديث فرصة", `${lead.name} → ${stageMeta(stage).label}`);
    ping(`تم نقل ${lead.name} إلى «${stageMeta(stage).label}»`);
  };

  const createLead = () => {
    if (!form.name.trim() || !form.company.trim()) {
      ping("اكتب اسم العميل والشركة");
      return;
    }
    const lead = {
      ...form,
      id: `ld-${Math.floor(1000 + Math.random() * 9000)}`,
      value: Number(form.value) || 0,
      createdAt: Date.now(),
      activity: [{ id: `a-${Date.now()}`, text: "تم إنشاء الفرصة يدويًا", ts: Date.now() }],
    };
    save([lead, ...leads]);
    logAudit("إضافة فرصة", `${lead.name} — ${lead.company}`);
    setForm(blankLead);
    setOpen(false);
    ping("تمت إضافة الفرصة إلى المسار ✓");
  };

  const addTask = () => {
    if (!selected || !taskDraft.trim()) return;
    updateLead(selected.id, {
      activity: [{ id: `a-${Date.now()}`, text: `مهمة جديدة: ${taskDraft.trim()}`, ts: Date.now() }, ...(selected.activity || [])],
      nextTask: taskDraft.trim(),
    });
    setTaskDraft("");
    ping("تمت إضافة مهمة المتابعة ✓");
  };

  const convert = () => {
    if (!selected) return;
    updateLead(selected.id, {
      stage: "won",
      activity: [{ id: `a-${Date.now()}`, text: "تم تحويل الفرصة إلى طلب تجريبي", ts: Date.now() }, ...(selected.activity || [])],
    });
    logAudit("تحويل فرصة", `${selected.name} → طلب تجريبي`);
    ping("تم تحويل الفرصة إلى طلب — تجريبي ✓");
  };

  return (
    <div className="space-y-5">
      <PageHead
        kicker="فريق المبيعات"
        title="مسار مبيعات واضح لكل فرصة"
        desc={`${stats.open} فرصة مفتوحة بقيمة ${money(stats.pipeline)}. اسحب البطاقات بين المراحل، أو افتح الفرصة لمتابعة التفاصيل.`}
        actions={
          <>
            <Btn variant="soft" onClick={() => onNavigate("team")}><Icon name="users" className="w-4 h-4" /> الفريق</Btn>
            <Btn onClick={() => { setForm(blankLead); setOpen(true); }}><Icon name="plus" className="w-4 h-4" /> فرصة جديدة</Btn>
          </>
        }
      />

      <SectionTip
        id="sales"
        title="جرّب سحب البطاقة إلى «تم البيع»"
        text="ستتحدث قيمة المسار والأداء تلقائيًا. على الجوال استخدم القائمة أسفل البطاقة لتحريك الفرصة بدل السحب."
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat icon="target" label="قيمة المسار" value={money(stats.pipeline)} sub={`${stats.open} فرصة مفتوحة`} />
        <Stat icon="wallet" label="مبيعات مغلقة" value={money(stats.won)} sub={`${stats.wonCount} فرصة ناجحة`} tone="gold" />
        <Stat icon="trend" label="نسبة الإغلاق" value={`${stats.conversion}%`} sub="من الفرص المغلقة" tone="ink" />
        <Stat icon="clock" label="مهام متابعة" value={leads.filter((lead) => lead.nextTask && !["won", "lost"].includes(lead.stage)).length} sub="تحتاج إجراء تالي" tone="cream" />
      </div>

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col xl:flex-row gap-3 xl:items-center justify-between">
          <div className="relative w-full xl:max-w-xs">
            <Icon name="search" className="absolute top-1/2 -translate-y-1/2 right-3.5 w-4 h-4 text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم العميل أو الشركة..." className="w-full bg-cream border border-line rounded-2xl pr-10 pl-4 py-2.5 text-[12px] font-bold outline-none focus:border-green2" />
          </div>
          <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)} className="bg-cream border border-line rounded-2xl px-4 py-2.5 text-[11px] font-black outline-none focus:border-green2 cursor-pointer">
            <option value="all">كل مندوبي المبيعات</option>
            {agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
          </select>
        </div>
      </Card>

      <div className="overflow-x-auto no-scrollbar pb-2">
        <div className="flex gap-3 min-w-max">
          {SALES_STAGES.map((stage) => {
            const items = filtered.filter((lead) => lead.stage === stage.id);
            const value = items.reduce((sum, lead) => sum + Number(lead.value || 0), 0);
            return (
              <div
                key={stage.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => { if (dragId) moveLead(dragId, stage.id); setDragId(null); }}
                className="w-[252px] xl:w-[272px] shrink-0 rounded-[1.5rem] bg-white/55 border border-line p-2.5"
              >
                <div className="flex items-center justify-between gap-2 px-2 py-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={cx("rounded-full border px-2 py-1 text-[9px] font-black", stage.tone)}>{stage.label}</span>
                    <span className="text-[9px] font-black text-muted">{items.length}</span>
                  </div>
                  <span className="text-[9px] font-black text-muted">{money(value)}</span>
                </div>
                <div className="space-y-2 min-h-[140px]">
                  {items.map((lead) => {
                    const owner = agents.find((agent) => agent.id === lead.ownerId);
                    return (
                      <article
                        key={lead.id}
                        draggable
                        onDragStart={() => setDragId(lead.id)}
                        onDragEnd={() => setDragId(null)}
                        onClick={() => setSelectedId(lead.id)}
                        className={cx("group bg-white border border-line rounded-2xl p-3.5 cursor-grab active:cursor-grabbing hover:border-gold/50 hover:shadow-lg hover:shadow-ink/5 transition-all", dragId === lead.id && "opacity-50")}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[11.5px] font-black truncate">{lead.name}</p>
                            <p className="text-[9.5px] font-bold text-muted truncate">{lead.company}</p>
                          </div>
                          <Pill tone={sourceTone(lead.source)}>{lead.source}</Pill>
                        </div>
                        <p className="text-[13px] font-black text-green2 mt-3">{money(lead.value)}</p>
                        <div className="flex items-center justify-between gap-2 mt-2.5">
                          <span className="text-[9px] font-bold text-muted">{timeAgo(lead.createdAt)}</span>
                          {owner ? (
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-muted">
                              <Avatar name={owner.name} color={owner.color} size="w-5 h-5" />
                              {owner.name.split(" ")[0]}
                            </span>
                          ) : (
                            <span className="text-[8.5px] font-black text-[#a33b2c]">غير مسند</span>
                          )}
                        </div>
                        {lead.nextTask && (
                          <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-cream border border-line px-2.5 py-1.5">
                            <Icon name="clock" className="w-3 h-3 text-gold shrink-0" />
                            <span className="text-[8.5px] font-black text-muted truncate">{lead.nextTask}</span>
                          </div>
                        )}
                        <select
                          value={lead.stage}
                          onClick={(event) => event.stopPropagation()}
                          onChange={(event) => moveLead(lead.id, event.target.value)}
                          className="mt-2.5 w-full rounded-xl border border-line bg-white px-2 py-1.5 text-[8.5px] font-black text-muted outline-none cursor-pointer"
                          aria-label={`نقل ${lead.name}`}
                        >
                          {SALES_STAGES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                        </select>
                      </article>
                    );
                  })}
                  {items.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-line p-3 text-center text-[9px] font-bold text-muted">اسحب فرصة هنا</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.2fr_1fr] gap-5">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] font-black text-gold mb-1">أداء الفريق</p>
              <h3 className="text-[15px] font-black">ترتيب المبيعات</h3>
            </div>
            <button onClick={() => onNavigate("team")} className="text-[10px] font-black text-green2 hover:text-gold cursor-pointer">إدارة الفريق</button>
          </div>
          <div className="space-y-2.5">
            {performance.map((agent, index) => (
              <div key={agent.id} className="flex items-center gap-3 rounded-2xl bg-cream border border-line p-3">
                <span className="w-5 text-[10px] font-black text-muted">{index + 1}</span>
                <Avatar name={agent.name} color={agent.color} />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black truncate">{agent.name}</p>
                  <p className="text-[9px] font-bold text-muted">{agent.total} فرصة · {agent.won} ناجحة</p>
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-black text-green2">{money(agent.value)}</p>
                  <p className="text-[8.5px] font-bold text-muted">مبيعات مغلقة</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <p className="text-[10px] font-black text-gold mb-1">الفرص القادمة</p>
          <h3 className="text-[15px] font-black mb-4">مهام تحتاج إجراء</h3>
          <div className="space-y-2.5">
            {leads.filter((lead) => lead.nextTask && !["won", "lost"].includes(lead.stage)).slice(0, 5).map((lead) => (
              <button key={lead.id} onClick={() => setSelectedId(lead.id)} className="w-full flex items-center gap-2.5 rounded-2xl bg-cream border border-line p-3 text-right hover:border-green2 transition-colors cursor-pointer">
                <span className="w-7 h-7 rounded-xl bg-goldsoft text-[#71540f] grid place-items-center shrink-0"><Icon name="clock" className="w-3.5 h-3.5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-black truncate">{lead.nextTask}</p>
                  <p className="text-[9px] font-bold text-muted truncate">{lead.name} · {lead.company}</p>
                </div>
                <Icon name="chevron" className="w-3.5 h-3.5 text-muted rotate-180" />
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة فرصة جديدة" subtitle="فرصة تجريبية داخل مسار المبيعات" wide>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="اسم العميل"><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={inputCls} placeholder="مثال: سارة المطيري" /></Field>
          <Field label="الشركة / المتجر"><input value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} className={inputCls} placeholder="بوتيك سارة" /></Field>
          <Field label="رقم الجوال"><input dir="ltr" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className={cx(inputCls, "text-left")} placeholder="+966 5x xxx xxxx" /></Field>
          <Field label="البريد الإلكتروني"><input dir="ltr" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className={cx(inputCls, "text-left")} placeholder="name@store.sa" /></Field>
          <Field label="المدينة"><input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} className={inputCls} /></Field>
          <Field label="قيمة الفرصة (ر.س)"><input type="number" value={form.value} onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))} className={inputCls} placeholder="4500" /></Field>
          <Field label="المصدر">
            <select value={form.source} onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))} className={inputCls}>
              {["Instagram", "Google", "Snapchat", "واتساب", "إحالة", "زيارة مباشرة"].map((source) => <option key={source}>{source}</option>)}
            </select>
          </Field>
          <Field label="المندوب المسؤول">
            <select value={form.ownerId} onChange={(event) => setForm((current) => ({ ...current, ownerId: event.target.value }))} className={inputCls}>
              <option value="">غير مسند</option>
              {agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
            </select>
          </Field>
          <div className="sm:col-span-2"><Field label="ملاحظات"><textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} rows={3} className={inputCls} placeholder="ما الذي يحتاجه العميل؟" /></Field></div>
          <div className="sm:col-span-2 flex gap-2">
            <Btn className="flex-1" onClick={createLead}><Icon name="plus" className="w-4 h-4" /> إضافة الفرصة</Btn>
            <Btn variant="soft" onClick={() => setOpen(false)}>إلغاء</Btn>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(selected)} onClose={() => setSelectedId(null)} title={selected ? `${selected.name} — ${selected.company}` : "تفاصيل الفرصة"} subtitle={selected ? `${money(selected.value)} · ${selected.city} · ${selected.source}` : ""} wide>
        {selected && (
          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-5">
            <div className="space-y-4">
              <div className="rounded-2xl bg-white border border-line p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {SALES_STAGES.map((stage) => (
                      <button key={stage.id} onClick={() => moveLead(selected.id, stage.id)} className={cx("rounded-xl border px-2.5 py-1.5 text-[9px] font-black transition-colors cursor-pointer", selected.stage === stage.id ? "bg-green2 border-green2 text-cream" : "bg-cream border-line text-muted hover:border-green2")}>
                        {stage.label}
                      </button>
                    ))}
                  </div>
                  <Pill tone={selected.stage === "won" ? "green" : selected.stage === "lost" ? "red" : "gold"}>{stageMeta(selected.stage).label}</Pill>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="المندوب المسؤول">
                  <select value={selected.ownerId || ""} onChange={(event) => updateLead(selected.id, { ownerId: event.target.value })} className={inputCls}>
                    <option value="">غير مسند</option>
                    {agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
                  </select>
                </Field>
                <Field label="قيمة الفرصة (ر.س)">
                  <input type="number" value={selected.value} onChange={(event) => updateLead(selected.id, { value: Number(event.target.value) || 0 })} className={inputCls} />
                </Field>
              </div>
              <Field label="ملاحظات المتابعة">
                <textarea value={selected.notes || ""} onChange={(event) => updateLead(selected.id, { notes: event.target.value })} rows={4} className={inputCls} />
              </Field>
              <div className="rounded-2xl bg-white border border-line p-4">
                <p className="text-[10.5px] font-black text-gold mb-2">المهمة القادمة</p>
                <div className="flex gap-2">
                  <input value={taskDraft} onChange={(event) => setTaskDraft(event.target.value)} placeholder={selected.nextTask || "أضف مهمة متابعة..."} className={cx(inputCls, "mt-0 flex-1")} />
                  <Btn onClick={addTask}><Icon name="plus" className="w-4 h-4" /></Btn>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-muted">
                  <Icon name="clock" className="w-3.5 h-3.5 text-gold" />
                  {selected.nextTask || "لا توجد مهمة محددة"}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-white border border-line p-4">
                <p className="text-[10.5px] font-black text-gold mb-3">بيانات التواصل</p>
                <div className="space-y-2 text-[10.5px] font-bold">
                  <div className="flex items-center gap-2"><Icon name="phone" className="w-3.5 h-3.5 text-muted" /><span dir="ltr">{selected.phone || "—"}</span></div>
                  <div className="flex items-center gap-2"><Icon name="mail" className="w-3.5 h-3.5 text-muted" /><span dir="ltr" className="truncate">{selected.email || "—"}</span></div>
                  <div className="flex items-center gap-2"><Icon name="store" className="w-3.5 h-3.5 text-muted" /><span>{selected.company}</span></div>
                  <div className="flex items-center gap-2"><Icon name="target" className="w-3.5 h-3.5 text-muted" /><span>{selected.city} · {selected.source}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <a href={`https://wa.me/${String(selected.phone || "").replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="rounded-xl bg-[#e8f1ee] py-2 text-center text-[9.5px] font-black text-green2 hover:bg-[#dcece7] transition-colors">واتساب</a>
                  <button onClick={() => ping("تم تسجيل اتصال تجريبي ✓")} className="rounded-xl bg-cream border border-line py-2 text-[9.5px] font-black text-muted hover:border-green2 transition-colors cursor-pointer">تسجيل اتصال</button>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-line p-4">
                <p className="text-[10.5px] font-black text-gold mb-3">النشاط</p>
                <div className="space-y-3">
                  {(selected.activity || []).length === 0 && <p className="text-[10px] font-bold text-muted">لا توجد أنشطة بعد.</p>}
                  {(selected.activity || []).slice(0, 6).map((entry) => (
                    <div key={entry.id} className="flex gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black">{entry.text}</p>
                        <p className="text-[8.5px] font-bold text-muted">{timeAgo(entry.ts)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                {selected.stage !== "won" && <Btn className="flex-1" onClick={convert}><Icon name="bag" className="w-4 h-4" /> تحويل لطلب</Btn>}
                <Btn variant="soft" onClick={() => setSelectedId(null)}>إغلاق</Btn>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

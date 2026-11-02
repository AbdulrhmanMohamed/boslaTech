import { useMemo, useState } from "react";
import { useShop } from "../../store";
import {
  DEFAULT_ROLES,
  PERMISSION_MODULES,
  TEAM_MEMBERS,
} from "../../data/dashboardPremium";
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
  timeAgo,
} from "./ui";

const permissionCount = (permissions = {}) => Object.values(permissions).filter(Boolean).length;
const permissionLabel = (value) => (value === "manage" ? "إدارة" : value === "view" ? "عرض" : "بدون وصول");
const permissionTone = (value) => (value === "manage" ? "green" : value === "view" ? "gold" : "muted");

export default function TeamSection({ onNavigate, currentRoleId }) {
  const { ping } = useShop();
  const [team, setTeam] = useState(() => read("asl_dashboard_team", TEAM_MEMBERS));
  const [roles, setRoles] = useState(() => read("asl_dashboard_roles", DEFAULT_ROLES));
  const [tab, setTab] = useState("members");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState({ name: "", email: "", roleId: "sales" });
  const [inviteLink, setInviteLink] = useState("");
  const [roleOpen, setRoleOpen] = useState(false);
  const [roleForm, setRoleForm] = useState({ id: null, name: "", desc: "", permissions: {} });
  const [selected, setSelected] = useState(null);

  const saveTeam = (next) => {
    setTeam(next);
    write("asl_dashboard_team", next);
  };
  const saveRoles = (next) => {
    setRoles(next);
    write("asl_dashboard_roles", next);
  };

  const roleById = (id) => roles.find((item) => item.id === id) || roles[0];
  const currentRole = roleById(currentRoleId);
  const membersByRole = useMemo(() => {
    const map = {};
    for (const member of team) map[member.roleId] = (map[member.roleId] || 0) + 1;
    return map;
  }, [team]);

  const activeMembers = team.filter((member) => member.status === "active").length;
  const pendingMembers = team.filter((member) => member.status === "pending").length;
  const totalCommission = team.reduce((sum, member) => sum + Number(member.commission || 0), 0);

  const copy = (text, message) => {
    navigator.clipboard?.writeText(text).then(() => ping(message)).catch(() => ping(text));
  };

  const sendInvite = () => {
    if (!invite.name.trim() || !invite.email.trim()) {
      ping("أكمل اسم العضو والبريد الإلكتروني");
      return;
    }
    if (team.some((member) => member.email.toLowerCase() === invite.email.trim().toLowerCase())) {
      ping("هذا البريد موجود في الفريق بالفعل");
      return;
    }
    const role = roleById(invite.roleId);
    const token = Math.random().toString(36).slice(2, 9).toUpperCase();
    const member = {
      id: `tm-${Date.now()}`,
      name: invite.name.trim(),
      email: invite.email.trim(),
      roleId: role.id,
      status: "pending",
      lastActive: null,
      assignedLeads: 0,
      campaigns: 0,
      commission: 0,
      color: role.id === "sales" ? "ink" : role.id === "marketing" ? "gold" : "green",
      inviteToken: token,
    };
    saveTeam([...team, member]);
    setInviteLink(`${window.location.origin}/dashboard?invite=${token}`);
    logAudit("دعوة عضو", `${member.name} — ${role.name}`);
    ping("تم إنشاء الدعوة التجريبية ✓");
  };

  const acceptMember = (member) => {
    saveTeam(team.map((item) => item.id === member.id ? { ...item, status: "active", lastActive: Date.now() } : item));
    logAudit("تفعيل عضو", member.name);
    ping(`تم تفعيل ${member.name} — تجريبي`);
  };

  const toggleMember = (member) => {
    const nextStatus = member.status === "suspended" ? "active" : "suspended";
    saveTeam(team.map((item) => item.id === member.id ? { ...item, status: nextStatus } : item));
    logAudit(nextStatus === "active" ? "تفعيل عضو" : "إيقاف عضو", member.name);
    ping(nextStatus === "active" ? `تم تفعيل ${member.name}` : `تم إيقاف ${member.name} — تجريبي`);
  };

  const changeMemberRole = (member, roleId) => {
    const role = roleById(roleId);
    saveTeam(team.map((item) => item.id === member.id ? { ...item, roleId } : item));
    if (selected?.id === member.id) setSelected({ ...selected, roleId });
    logAudit("تغيير دور عضو", `${member.name} → ${role.name}`);
    ping(`تم تغيير دور ${member.name} إلى ${role.name}`);
  };

  const openRole = (role = null) => {
    setRoleForm(
      role && !role.system
        ? { id: role.id, name: role.name, desc: role.desc, permissions: { ...role.permissions } }
        : { id: null, name: "", desc: "", permissions: {} },
    );
    setRoleOpen(true);
  };

  const cyclePermission = (moduleId) => {
    setRoleForm((form) => {
      const value = form.permissions[moduleId];
      const next = value === "manage" ? null : value === "view" ? "manage" : "view";
      const permissions = { ...form.permissions };
      if (next) permissions[moduleId] = next;
      else delete permissions[moduleId];
      return { ...form, permissions };
    });
  };

  const saveRole = () => {
    if (!roleForm.name.trim()) {
      ping("اكتب اسم الدور");
      return;
    }
    if (roleForm.id) {
      saveRoles(roles.map((role) => role.id === roleForm.id ? { ...role, name: roleForm.name.trim(), desc: roleForm.desc.trim(), permissions: roleForm.permissions } : role));
      logAudit("تعديل دور", roleForm.name.trim());
      ping("تم تحديث الدور والصلاحيات ✓");
    } else {
      const id = `role-${Date.now()}`;
      saveRoles([...roles, { id, name: roleForm.name.trim(), desc: roleForm.desc.trim() || "دور مخصص", system: false, permissions: roleForm.permissions }]);
      logAudit("إنشاء دور مخصص", roleForm.name.trim());
      ping("تم إنشاء الدور المخصص ✓");
    }
    setRoleOpen(false);
  };

  return (
    <div className="space-y-5">
      <PageHead
        kicker="الفريق والصلاحيات"
        title="شغّل المتجر بفريق، مش لوحدك"
        desc={`أنت الآن تشاهد اللوحة بصفة «${currentRole.name}». كل عضو يقدر يشوف الأقسام المسموحة له فقط، والأدوار المخصصة تجعل التجربة قابلة للتوسع.`}
        actions={
          <>
            <Btn variant="soft" onClick={() => onNavigate("audit")}>
              <Icon name="shield" className="w-4 h-4" />
              سجل النشاط
            </Btn>
            <Btn onClick={() => { setInviteLink(""); setInvite({ name: "", email: "", roleId: "sales" }); setInviteOpen(true); }}>
              <Icon name="plus" className="w-4 h-4" />
              دعوة عضو
            </Btn>
          </>
        }
      />

      <SectionTip
        id="team"
        title="كل دور له تجربة مختلفة"
        text="جرّب تغيير «عرض كـ» من أعلى الصفحة إلى مدير التسويق أو فريق المبيعات أو شريك التسويق. ثم ارجع هنا وأنشئ دورًا مخصصًا."
        action={<button onClick={() => setTab("roles")} className="rounded-xl bg-white/70 px-3 py-1.5 text-[10px] font-black text-[#71540f] hover:bg-white transition-colors cursor-pointer">استعرض الأدوار</button>}
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat icon="users" label="أعضاء الفريق" value={team.length} sub={`${activeMembers} نشط`} />
        <Stat icon="mail" label="دعوات معلقة" value={pendingMembers} sub="بانتظار القبول" tone="gold" />
        <Stat icon="shield" label="أدوار مخصصة" value={roles.filter((role) => !role.system).length} sub={`${roles.length} دور كلي`} tone="ink" />
        <Stat icon="wallet" label="عمولات الفريق" value={money(totalCommission)} sub="تقديري — بيانات عرض" tone="cream" />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Tabs tabs={[{ id: "members", label: "الأعضاء" }, { id: "roles", label: "الأدوار والصلاحيات" }]} value={tab} onChange={setTab} />
        <span className="text-[10px] font-bold text-muted">الدعوات والصلاحيات هنا تجريبية — تُربط بالخادم عند التشغيل الفعلي</span>
      </div>

      {tab === "members" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-right">
              <thead>
                <tr className="text-[9.5px] font-black text-muted bg-cream/60">
                  <th className="px-5 py-3.5">العضو</th>
                  <th className="px-3 py-3.5">الدور</th>
                  <th className="px-3 py-3.5">الحالة</th>
                  <th className="px-3 py-3.5">آخر نشاط</th>
                  <th className="px-3 py-3.5">فرص</th>
                  <th className="px-3 py-3.5">حملات</th>
                  <th className="px-3 py-3.5">عمولة</th>
                  <th className="px-5 py-3.5">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {team.map((member) => {
                  const role = roleById(member.roleId);
                  return (
                    <tr key={member.id} className="border-t border-line/80 hover:bg-cream/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <button onClick={() => setSelected(member)} className="flex items-center gap-2.5 text-right cursor-pointer">
                          <Avatar name={member.name} color={member.color} />
                          <div>
                            <p className="text-[11.5px] font-black">{member.name}</p>
                            <p dir="ltr" className="text-[9px] font-bold text-muted text-right">{member.email}</p>
                          </div>
                        </button>
                      </td>
                      <td className="px-3 py-3.5">
                        <Pill tone={member.roleId === "owner" ? "gold" : "muted"}>{role.name}</Pill>
                      </td>
                      <td className="px-3 py-3.5">
                        <Pill tone={member.status === "active" ? "green" : member.status === "pending" ? "gold" : "red"}>
                          {member.status === "active" ? "نشط" : member.status === "pending" ? "دعوة معلقة" : "موقوف"}
                        </Pill>
                      </td>
                      <td className="px-3 py-3.5 text-[10px] font-bold text-muted">{member.lastActive ? timeAgo(member.lastActive) : "لم ينضم بعد"}</td>
                      <td className="px-3 py-3.5 text-[11px] font-black">{member.assignedLeads || "—"}</td>
                      <td className="px-3 py-3.5 text-[11px] font-black">{member.campaigns || "—"}</td>
                      <td className="px-3 py-3.5 text-[11px] font-black text-green2">{member.commission ? money(member.commission) : "—"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {member.status === "pending" && <button onClick={() => acceptMember(member)} className="rounded-xl bg-[#e8f1ee] px-2.5 py-1.5 text-[9.5px] font-black text-green2 cursor-pointer">قبول</button>}
                          {member.roleId !== "owner" && (
                            <button onClick={() => toggleMember(member)} className="rounded-xl border border-line bg-white px-2.5 py-1.5 text-[9.5px] font-black text-muted hover:border-green2 cursor-pointer">
                              {member.status === "suspended" ? "تفعيل" : "إيقاف"}
                            </button>
                          )}
                          <button onClick={() => setSelected(member)} className="rounded-xl border border-line bg-white px-2.5 py-1.5 text-[9.5px] font-black text-muted hover:border-green2 cursor-pointer">ملف</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "roles" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Btn onClick={() => openRole()}><Icon name="plus" className="w-4 h-4" /> دور مخصص</Btn>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {roles.map((role) => {
              const count = permissionCount(role.permissions);
              return (
                <Card key={role.id} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className={cx("w-10 h-10 rounded-2xl grid place-items-center", role.system ? "bg-green2 text-cream" : "bg-goldsoft text-[#71540f]")}>
                      <Icon name={role.id === "owner" ? "shield" : role.system ? "users" : "layers"} className="w-[18px] h-[18px]" />
                    </span>
                    <div className="flex items-center gap-1.5">
                      {role.system && <Pill tone="muted">جاهز</Pill>}
                      {!role.system && <button onClick={() => openRole(role)} className="rounded-xl border border-line bg-white px-2.5 py-1.5 text-[9px] font-black text-muted hover:border-green2 cursor-pointer">تعديل</button>}
                    </div>
                  </div>
                  <h3 className="text-[14px] font-black">{role.name}</h3>
                  <p className="text-[10.5px] font-bold text-muted mt-1 leading-5 min-h-10">{role.desc}</p>
                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-line">
                    <div className="flex items-center gap-2 text-[10px] font-black text-muted">
                      <Icon name="users" className="w-3.5 h-3.5" />
                      {membersByRole[role.id] || 0} عضو
                    </div>
                    <Pill tone="gold">{count} صلاحية</Pill>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {PERMISSION_MODULES.filter((module) => role.permissions?.[module.id]).slice(0, 5).map((module) => (
                      <span key={module.id} className="rounded-lg bg-cream border border-line px-2 py-1 text-[8.5px] font-black text-muted">{module.label}</span>
                    ))}
                    {count > 5 && <span className="rounded-lg bg-cream border border-line px-2 py-1 text-[8.5px] font-black text-muted">+{count - 5}</span>}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black text-gold mb-1">توزيع العمل</p>
            <h3 className="text-[15px] font-black">الفريق مرتبط بالمبيعات والتسويق تلقائيًا</h3>
            <p className="text-[11px] font-bold text-muted mt-1">كل مندوب مبيعات يظهر في مسار الفرص، وكل مسوق يظهر في الحملات والتقارير.</p>
          </div>
          <div className="flex gap-2">
            <Btn variant="soft" onClick={() => onNavigate("sales")}><Icon name="target" className="w-4 h-4" /> مسار المبيعات</Btn>
            <Btn variant="soft" onClick={() => onNavigate("marketing")}><Icon name="sparkle" className="w-4 h-4" /> التسويق</Btn>
          </div>
        </div>
      </Card>

      <Modal open={inviteOpen} onClose={() => { setInviteOpen(false); setInviteLink(""); }} title={inviteLink ? "الدعوة جاهزة" : "دعوة عضو جديد"} subtitle="دعوة تجريبية — لا يتم إرسال بريد حقيقي">
        {inviteLink ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#e8f1ee] border border-green2/20 p-4">
              <div className="flex items-center gap-2 text-green2 mb-2">
                <Icon name="checkCircle" className="w-4 h-4" />
                <p className="text-[12px] font-black">تم إنشاء رابط الدعوة</p>
              </div>
              <p className="text-[10.5px] font-bold text-muted leading-5">شارك الرابط مع العضو. في النسخة الفعلية سيصل عبر البريد أو واتساب، وبعد القبول تُطبق الصلاحيات.</p>
            </div>
            <div className="rounded-2xl bg-white border border-line p-3">
              <p dir="ltr" className="text-[9.5px] font-bold text-muted text-left break-all">{inviteLink}</p>
            </div>
            <div className="flex gap-2">
              <Btn className="flex-1" onClick={() => copy(inviteLink, "تم نسخ رابط الدعوة ✓")}><Icon name="copy" className="w-4 h-4" /> نسخ الرابط</Btn>
              <Btn variant="soft" onClick={() => { setInviteOpen(false); setInviteLink(""); }}>إغلاق</Btn>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="اسم العضو"><input value={invite.name} onChange={(event) => setInvite((form) => ({ ...form, name: event.target.value }))} className={inputCls} placeholder="مثال: نورة القحطاني" /></Field>
            <Field label="البريد الإلكتروني"><input dir="ltr" value={invite.email} onChange={(event) => setInvite((form) => ({ ...form, email: event.target.value }))} className={cx(inputCls, "text-left")} placeholder="name@store.sa" /></Field>
            <Field label="الدور">
              <select value={invite.roleId} onChange={(event) => setInvite((form) => ({ ...form, roleId: event.target.value }))} className={inputCls}>
                {roles.filter((role) => role.id !== "owner").map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
              </select>
            </Field>
            <div className="rounded-2xl bg-cream border border-line p-3.5">
              <p className="text-[10px] font-black text-muted">سيشاهد هذا العضو:</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {PERMISSION_MODULES.filter((module) => roleById(invite.roleId).permissions?.[module.id]).map((module) => (
                  <span key={module.id} className="rounded-lg bg-white border border-line px-2 py-1 text-[8.5px] font-black">{module.label}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Btn className="flex-1" onClick={sendInvite}><Icon name="send" className="w-4 h-4" /> إنشاء الدعوة</Btn>
              <Btn variant="soft" onClick={() => setInviteOpen(false)}>إلغاء</Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={roleOpen} onClose={() => setRoleOpen(false)} title={roleForm.id ? "تعديل الدور" : "إنشاء دور مخصص"} subtitle="حدد ما يمكن لهذا الدور رؤيته أو إدارته" wide>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="اسم الدور"><input value={roleForm.name} onChange={(event) => setRoleForm((form) => ({ ...form, name: event.target.value }))} className={inputCls} placeholder="مثال: مدير المحتوى" /></Field>
            <Field label="وصف مختصر"><input value={roleForm.desc} onChange={(event) => setRoleForm((form) => ({ ...form, desc: event.target.value }))} className={inputCls} placeholder="ماذا يفعل هذا الشخص؟" /></Field>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black text-muted">اضغط على القسم لتبديل المستوى: عرض ← إدارة ← بدون وصول</p>
            <button onClick={() => setRoleForm((form) => ({ ...form, permissions: Object.fromEntries(PERMISSION_MODULES.map((module) => [module.id, "manage"])) }))} className="text-[10px] font-black text-green2 hover:text-gold cursor-pointer">منح الكل</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {PERMISSION_MODULES.map((module) => {
              const value = roleForm.permissions[module.id];
              return (
                <button key={module.id} onClick={() => cyclePermission(module.id)} className={cx("rounded-2xl border p-3.5 text-right transition-colors cursor-pointer", value ? "bg-white border-green2/35" : "bg-cream border-line hover:border-gold/40")}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11.5px] font-black">{module.label}</p>
                      <p className="text-[9.5px] font-bold text-muted mt-0.5">{module.desc}</p>
                    </div>
                    <Pill tone={permissionTone(value)}>{permissionLabel(value)}</Pill>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 pt-1">
            <Btn className="flex-1" onClick={saveRole}><Icon name="check" className="w-4 h-4" /> حفظ الدور</Btn>
            <Btn variant="soft" onClick={() => setRoleOpen(false)}>إلغاء</Btn>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `ملف ${selected.name}` : "ملف العضو"} subtitle="نشاط وأداء العضو داخل المتجر">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white border border-line p-4">
              <Avatar name={selected.name} color={selected.color} size="w-12 h-12" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-black">{selected.name}</p>
                <p dir="ltr" className="text-[10px] font-bold text-muted text-right truncate">{selected.email}</p>
                <p className="text-[9.5px] font-bold text-muted mt-0.5">{roleById(selected.roleId).name}</p>
              </div>
              <Pill tone={selected.status === "active" ? "green" : selected.status === "pending" ? "gold" : "red"}>
                {selected.status === "active" ? "نشط" : selected.status === "pending" ? "معلق" : "موقوف"}
              </Pill>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-cream border border-line p-3 text-center"><b className="block text-[17px] font-black">{selected.assignedLeads || 0}</b><span className="text-[9px] font-black text-muted">فرص</span></div>
              <div className="rounded-2xl bg-cream border border-line p-3 text-center"><b className="block text-[17px] font-black">{selected.campaigns || 0}</b><span className="text-[9px] font-black text-muted">حملات</span></div>
              <div className="rounded-2xl bg-cream border border-line p-3 text-center"><b className="block text-[17px] font-black text-green2">{selected.commission ? money(selected.commission) : "—"}</b><span className="text-[9px] font-black text-muted">عمولة</span></div>
            </div>
            <Field label="الدور الحالي">
              <select value={selected.roleId} disabled={selected.roleId === "owner"} onChange={(event) => changeMemberRole(selected, event.target.value)} className={cx(inputCls, selected.roleId === "owner" && "opacity-60")}>
                {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
              </select>
            </Field>
            <div className="rounded-2xl bg-white border border-line p-4">
              <p className="text-[10.5px] font-black text-gold mb-2">آخر نشاط</p>
              <p className="text-[11px] font-bold text-muted">{selected.lastActive ? `${timeAgo(selected.lastActive)} — ${selected.status === "pending" ? "بانتظار قبول الدعوة" : "آخر دخول للوحة"}` : "لم يسجل دخول بعد"}</p>
            </div>
            <div className="flex gap-2">
              {selected.status === "pending" && <Btn className="flex-1" onClick={() => { acceptMember(selected); setSelected(null); }}>قبول العضو</Btn>}
              {selected.roleId !== "owner" && <Btn variant="soft" className="flex-1" onClick={() => { toggleMember(selected); setSelected({ ...selected, status: selected.status === "suspended" ? "active" : "suspended" }); }}>{selected.status === "suspended" ? "تفعيل الحساب" : "إيقاف الحساب"}</Btn>}
              <Btn variant="soft" onClick={() => setSelected(null)}>إغلاق</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

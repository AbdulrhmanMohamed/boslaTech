import { read, write } from "./storage";
import { AUDIT_EVENTS } from "../data/dashboardPremium";

export function getAudit() {
  return read("asl_dashboard_audit", AUDIT_EVENTS);
}

export function logAudit(action, detail, actor = "أنت") {
  const list = getAudit();
  const entry = {
    id: `au-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actor,
    action,
    detail,
    ts: Date.now(),
    ip: "هذا المتصفح",
  };
  write("asl_dashboard_audit", [entry, ...list].slice(0, 120));
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("asl:audit", { detail: entry }));
  return entry;
}

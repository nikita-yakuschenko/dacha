import type { Format, ProjectId } from "./data";
export type FunnelEvent = { event: "format_select" | "project_select" | "calculation_open" | "step_complete" | "lead_accepted"; project?: ProjectId; format?: Format; step?: number };
export function track(event: FunnelEvent) {
  // Only explicit, non-personal fields are emitted. Connect an approved adapter here.
  window.dispatchEvent(new CustomEvent("dacha:analytics", { detail: event }));
}
export function getAttribution(): Record<string, string> {
  const search = new URLSearchParams(window.location.search);
  return Object.fromEntries(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].flatMap(key => search.has(key) ? [[key, search.get(key)!.slice(0, 200)]] : []));
}

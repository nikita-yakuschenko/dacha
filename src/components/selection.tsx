"use client";
import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";

import { IconArrowUpRight, IconPackage, IconTools } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { projects, type ProjectId, type Format } from "@/lib/data";
import { track } from "@/lib/analytics";
type Selection = { format: Format; project: ProjectId; terrace: boolean };
const defaults: Selection = { format: "kit", project: "dacha-24", terrace: false };
const Context = createContext<{ selection: Selection; update: (patch: Partial<Selection>) => void }>({ selection: defaults, update: () => {} });
function safeSelection(value: unknown): Partial<Selection> {
  if (!value || typeof value !== "object") return {};
  const v = value as Record<string, unknown>;
  return { ...(v.format === "kit" || v.format === "assembly" || v.format === "help" ? { format: v.format } : {}), ...(v.project === "custom" || projects.some(p => p.slug === v.project) ? { project: v.project as ProjectId } : {}), ...(typeof v.terrace === "boolean" ? { terrace: v.terrace } : {}) };
}
export function SelectionProvider({ children }: { children: ReactNode }) {

  const [selection, dispatch] = useReducer((state: Selection, patch: Partial<Selection>) => ({ ...state, ...patch }), defaults);
  useEffect(() => {
    let saved: Partial<Selection> = {};
    try { saved = safeSelection(JSON.parse(localStorage.getItem("dacha:selection") || "{}")); } catch {}

    dispatch(saved);
  }, []);
  function update(patch: Partial<Selection>) { dispatch(patch); try { localStorage.setItem("dacha:selection", JSON.stringify({ ...selection, ...patch })); } catch {} }
  return <Context.Provider value={{ selection, update }}>{children}</Context.Provider>;
}
export const useSelection = () => useContext(Context);
export function FormatSwitch() {
  const { selection, update } = useSelection();
  return <div className="format-switch" role="group" aria-label="Формат заказа">{(["kit", "assembly"] as const).map(format => <button key={format} type="button" aria-pressed={selection.format === format} onClick={() => { update({ format }); track({ event: "format_select", format }); }}>{format === "kit" ? <IconPackage size={18} /> : <IconTools size={18} />}{format === "kit" ? "Комплект с доставкой" : "Дом с монтажом"}</button>)}</div>;
}
export function CalculateButton({ children = "Получить расчёт", project, format, className, variant = "default" }: { children?: ReactNode; project?: ProjectId; format?: Format; className?: string; variant?: "default" | "outline" | "ghost" | "light" }) {
  const { selection, update } = useSelection();
  return <Button className={className} variant={variant} onClick={() => {
    const patch = { ...(project ? { project } : {}), ...(format ? { format } : {}) };
    update(patch); track({ event: "calculation_open", project: project || selection.project, format: format || selection.format });
    window.dispatchEvent(new CustomEvent("dacha:calculate", { detail: patch }));
    const target = document.getElementById("calculation");
    target?.scrollIntoView({ behavior: "instant", block: "start" });
    target?.focus({ preventScroll: true });
  }}>{children}<IconArrowUpRight size={18} aria-hidden="true" /></Button>;
}



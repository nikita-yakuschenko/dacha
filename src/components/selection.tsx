"use client";
import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import { projects, type ProjectId, type Format } from "@/lib/data";
type Selection = { format: Format; project: ProjectId; terrace: boolean; extras: string[] };
const defaults: Selection = { format: "kit", project: "dacha-24", terrace: false, extras: [] };
const Context = createContext<{ selection: Selection; update: (patch: Partial<Selection>) => void }>({ selection: defaults, update: () => {} });
function safeSelection(value: unknown): Partial<Selection> {
  if (!value || typeof value !== "object") return {};
  const v = value as Record<string, unknown>;
  const visibleExtras = new Set(projects.flatMap(project => project.extras.map(item => item.id)));
  const extras = Array.isArray(v.extras) ? v.extras.filter((item): item is string => typeof item === "string" && visibleExtras.has(item)) : undefined;
  return { ...(v.format === "kit" || v.format === "assembly" || v.format === "help" ? { format: v.format } : {}), ...(v.project === "custom" || projects.some(p => p.slug === v.project) ? { project: v.project as ProjectId } : {}), ...(typeof v.terrace === "boolean" ? { terrace: v.terrace } : {}), ...(extras ? { extras } : {}) };
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



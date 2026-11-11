"use client";
import { useEffect, useRef, useState } from "react";
import { IconCheck, IconPackage, IconTruck } from "@tabler/icons-react";
import { assemblyPrice, formatPrice, specification, terracePrice, type Project } from "@/lib/data";
import { track } from "@/lib/analytics";
import { dachaId, switchGoalId } from "@/lib/metrika-goals";
import { metrikaGoal, plain } from "@/lib/metrika";
import { useSelection } from "./selection";
import { AnimatedPrice } from "./animated-price";

// База — домокомплект; сборка и терраса — одинаковые переключатели-добавки
export function ProjectPackages({ project }: { project: Project }) {
  const [kitOpen, setKitOpen] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!kitOpen) return;
    const reveal = revealRef.current;
    if (!reveal) return;
    let timer = 0;
    const close = () => { metrikaGoal(dachaId("kit_close", project.area)); setKitOpen(false); };
    const onPointerDown = (event: PointerEvent) => { if (!reveal.contains(event.target as Node)) close(); };
    const onLeave = (event: PointerEvent) => { if (event.pointerType !== "mouse") return; window.clearTimeout(timer); timer = window.setTimeout(close, 3000); };
    const onEnter = () => window.clearTimeout(timer);
    document.addEventListener("pointerdown", onPointerDown);
    reveal.addEventListener("pointerleave", onLeave);
    reveal.addEventListener("pointerenter", onEnter);
    return () => { window.clearTimeout(timer); document.removeEventListener("pointerdown", onPointerDown); reveal.removeEventListener("pointerleave", onLeave); reveal.removeEventListener("pointerenter", onEnter); };
  }, [kitOpen, project.area]);
  const { selection, update } = useSelection();
  const format = selection.format === "assembly" ? "assembly" : "kit";
  const house = plain(project.name);
  function switched(id: string, on: boolean) { metrikaGoal(switchGoalId(id, on), { project: house }); }
  const addons = [
    ...(terracePrice(project) > 0 ? [{ name: "Добавить террасу", add: terracePrice(project), checked: selection.terrace, toggle: (on: boolean) => { switched("terrace", on); update({ terrace: on }); } }] : []),
    { name: "Добавить сборку", add: assemblyPrice(project, selection.terrace), checked: format === "assembly", toggle: (on: boolean) => { const next = on ? "assembly" : "kit"; switched("assembly", on); update({ format: next }); track({ event: "format_select", format: next }); } },
  ];
  return <div className="project-packages">
    <h3 className="package-heading">Комплектация</h3>
    <div className="package-reveal" ref={revealRef}>
      <button type="button" className="package-base" aria-expanded={kitOpen} onClick={() => { metrikaGoal(dachaId(kitOpen ? "kit_close" : "kit_open", project.area)); setKitOpen(open => !open); }}>
        <strong className="package-name"><IconPackage size={18} stroke={1.6} />Домокомплект</strong>
        <span className="package-price">{formatPrice(project.prices.kit)}</span>
        <small className="package-note">{"Комплект для\u00a0сборки самостоятельно"}</small>
        <span className="package-more">Что входит?</span>
      </button>
      <div className="package-kit" data-open={kitOpen}>
        <div><ul className="package-includes">{specification.map(item => <li key={item.name}><span className="package-tick"><IconCheck size={13} stroke={2.4} /></span><span><strong>{item.name}</strong><small>{item.note}</small></span></li>)}</ul></div>
      </div>
    </div>
    <div className="package-addons">{addons.map(addon => <label className="addon-switch" key={addon.name}>
      <span><strong>{addon.name}</strong><small>{"+\u00a0"}<AnimatedPrice value={addon.add} /></small></span>
      <input type="checkbox" role="switch" checked={addon.checked} onChange={e => addon.toggle(e.target.checked)} />
    </label>)}
    {project.extras.map(item => <label className="addon-switch" key={item.id}>
      <span><strong>{item.name}</strong><small>{item.onRequest ? "Стоимость по\u00a0запросу" : <>{"+\u00a0"}<AnimatedPrice value={item.price} /></>}</small></span>
      <input type="checkbox" role="switch" checked={selection.extras.includes(item.id)} onChange={e => { switched(item.id, e.target.checked); update({ extras: e.target.checked ? [...selection.extras, item.id] : selection.extras.filter(id => id !== item.id) }); }} />
    </label>)}</div>
    <p className="package-extra"><IconTruck size={20} stroke={1.6} aria-hidden="true" />{"Доставка в\u00a0стоимость не\u00a0включена и\u00a0оплачивается отдельно."}</p>
  </div>;
}

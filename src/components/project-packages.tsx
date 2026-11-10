"use client";
import { useState } from "react";
import { IconCheck, IconPackage, IconTruck } from "@tabler/icons-react";
import { assemblyPrice, formatPrice, specification, terracePrice, type Project } from "@/lib/data";
import { track } from "@/lib/analytics";
import { actionGoal, plain } from "@/lib/metrika";
import { useSelection } from "./selection";
import { AnimatedPrice } from "./animated-price";

// База — домокомплект; сборка и терраса — одинаковые переключатели-добавки
export function ProjectPackages({ project }: { project: Project }) {
  const [kitOpen, setKitOpen] = useState(false);
  const { selection, update } = useSelection();
  const format = selection.format === "assembly" ? "assembly" : "kit";
  const house = plain(project.name);
  function switched(name: string, on: boolean) { actionGoal(`${on ? "Включить" : "Выключить"} «${name}»`, { project: house }); }
  const addons = [
    ...(terracePrice(project) > 0 ? [{ name: "Добавить террасу", add: terracePrice(project), checked: selection.terrace, toggle: (on: boolean) => { switched("Добавить террасу", on); update({ terrace: on }); } }] : []),
    { name: "Добавить сборку", add: assemblyPrice(project, selection.terrace), checked: format === "assembly", toggle: (on: boolean) => { const next = on ? "assembly" : "kit"; switched("Добавить сборку", on); update({ format: next }); track({ event: "format_select", format: next }); } },
  ];
  return <div className="project-packages">
    <h3 className="package-heading">Комплектация</h3>
    <div className="package-reveal">
      <button type="button" className="package-base" aria-expanded={kitOpen} onClick={() => { actionGoal(`${kitOpen ? "Закрыть" : "Открыть"} «Что входит?», ${house}`); setKitOpen(open => !open); }}>
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
      <span><strong>{item.name}</strong><small>{"+\u00a0"}<AnimatedPrice value={item.price} /></small></span>
      <input type="checkbox" role="switch" checked={selection.extras.includes(item.id)} onChange={e => { switched(item.name, e.target.checked); update({ extras: e.target.checked ? [...selection.extras, item.id] : selection.extras.filter(id => id !== item.id) }); }} />
    </label>)}</div>
    <p className="package-extra"><IconTruck size={20} stroke={1.6} aria-hidden="true" />{"Доставка в\u00a0стоимость не\u00a0включена и\u00a0оплачивается отдельно."}</p>
  </div>;
}

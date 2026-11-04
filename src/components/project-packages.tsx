"use client";
import { IconCheck, IconPackage, IconTruck } from "@tabler/icons-react";
import { formatPrice, specification, type Project } from "@/lib/data";
import { track } from "@/lib/analytics";
import { useSelection } from "./selection";

// База — домокомплект; сборка и терраса — одинаковые переключатели-добавки
export function ProjectPackages({ project }: { project: Project }) {
  const { selection, update } = useSelection();
  const format = selection.format === "assembly" ? "assembly" : "kit";
  const addons = [
    { name: "Добавить террасу", add: project.terracePrices[format], checked: selection.terrace, toggle: (on: boolean) => update({ terrace: on }) },
    { name: "Добавить сборку", add: project.prices.assembly - project.prices.kit, checked: format === "assembly", toggle: (on: boolean) => { const next = on ? "assembly" : "kit"; update({ format: next }); track({ event: "format_select", format: next }); } },
  ];
  return <div className="project-packages">
    <h3 className="package-heading">Комплектация</h3>
    <div className="package-base">
      <span className="package-text"><strong><IconPackage size={18} stroke={1.6} />Домокомплект</strong><small>{"Комплект для\u00a0сборки самостоятельно"}</small></span>
      <span className="package-price">{formatPrice(project.prices.kit)}</span>
    </div>
    <div className="package-addons">{addons.map(addon => <label className="addon-switch" key={addon.name}>
      <span><strong>{addon.name}</strong><small className="swap-in" key={addon.add}>{"+\u00a0"}{formatPrice(addon.add)}</small></span>
      <input type="checkbox" role="switch" checked={addon.checked} onChange={e => addon.toggle(e.target.checked)} />
    </label>)}</div>
    <h3 className="package-heading">Что входит</h3>
    <ul className="package-includes">{specification.map(item => <li key={item.name}><span className="package-tick"><IconCheck size={13} stroke={2.4} /></span><span><strong>{item.name}</strong><small>{item.note}</small></span></li>)}</ul>
    <p className="package-extra"><IconTruck size={20} stroke={1.6} aria-hidden="true" />{"Доставка в\u00a0стоимость не\u00a0включена и\u00a0оплачивается отдельно."}</p>
  </div>;
}

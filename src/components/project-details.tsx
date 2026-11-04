"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plan } from "./plan";
import { FormatSwitch, useSelection } from "./selection";
import { specification, type Project } from "@/lib/data";
export function ProjectDetails({ project }: { project: Project }) {
  const { selection, update } = useSelection();
  return <div className="project-details"><div className="project-title"><h2>{project.name}</h2><span>Сезонный дом</span></div><p className="project-dimensions">{project.width} × {project.depth} м <span>{project.area} м² по наружному контуру</span></p><p className="project-price">Стоимость уточняется</p><Tabs defaultValue="plan"><TabsList aria-label="Сведения о доме"><TabsTrigger value="plan">Контур и размеры</TabsTrigger><TabsTrigger value="spec">Характеристики</TabsTrigger></TabsList><TabsContent value="plan"><Plan project={project} /></TabsContent><TabsContent value="spec"><dl className="project-specs"><div><dt>Материал</dt><dd>Сухой профилированный мини-брус</dd></div><div><dt>Использование</dt><dd>Сезонное</dd></div><div><dt>Толщина стен</dt><dd>Уточняется</dd></div><div><dt>Полезная площадь</dt><dd>Уточняется</dd></div><div><dt>Терраса</dt><dd>Отдельный расчёт</dd></div><div><dt>Планировка</dt><dd>Не утверждена</dd></div></dl></TabsContent></Tabs><div className="project-options"><FormatSwitch /><label className="check-label"><input type="checkbox" checked={selection.terrace} onChange={e => update({ terrace: e.target.checked })} /><span>Рассчитать террасу отдельно</span></label><p className="small muted">Кровля, окна, отделка и другие опции согласуются в спецификации, до расчёта стоимости.</p></div></div>;
}
export function ProjectSpecification() { return <div className="project-full-spec"><h2>Состав — по спецификации</h2><p>Перечень ниже — структура согласования. Точный состав поставки, материалы и конструктивные параметры ещё не утверждены.</p><div className="spec-table">{specification.map(item => <div className="spec-row" key={item.name}><div><strong>{item.name}</strong><p>{item.note}</p></div><span>Уточняется</span></div>)}</div></div>; }



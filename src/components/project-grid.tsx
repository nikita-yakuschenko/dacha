"use client";
import { useState } from "react";
import Image from "next/image";
import { ProjectTrigger } from "./project-trigger";
import { areaGroups, formatMeters, formatPrice, projects } from "@/lib/data";
import { actionGoal, plain } from "@/lib/metrika";

export function ProjectGrid() {
  const [groupId, setGroupId] = useState<(typeof areaGroups)[number]["id"]>("all");
  const group = areaGroups.find(g => g.id === groupId)!;
  const visible = projects.filter(group.test);
  return <>
    <div className="project-filter" role="group" aria-label="Площадь дома">
      {areaGroups.map(g => <button key={g.id} type="button" aria-pressed={g.id === groupId} onClick={() => { setGroupId(g.id); actionGoal(`Фильтр «${plain(g.label)}»`); }}>{g.label}<span>{projects.filter(g.test).length}</span></button>)}
    </div>
    <ul className="project-grid">
      {visible.map(p => <li key={p.slug}><article className="project-tile">
        <div className="project-tile-image"><Image src={p.thumbnail} alt="" fill sizes="(max-width: 767px) 50vw, (max-width: 1200px) 33vw, 480px" unoptimized /></div>
        <div className="project-tile-body">
          <h3><ProjectTrigger project={p.slug} className="project-tile-trigger">{"Просто дача\u00a0"}<span className="name-mark">{p.area}</span></ProjectTrigger></h3>
          <span>{formatMeters(p.width)} × {formatMeters(p.depth)} м · {p.area} м²</span>
          <strong className="project-tile-price">от {formatPrice(p.prices.kit)}</strong>
        </div>
      </article></li>)}
    </ul>
  </>;
}

"use client";
import { useState } from "react";
import Image from "next/image";
import { ProjectTrigger } from "./project-trigger";
import { areaGroups, formatPrice, projects } from "@/lib/data";

export function ProjectGrid() {
  const [groupId, setGroupId] = useState<(typeof areaGroups)[number]["id"]>("all");
  const group = areaGroups.find(g => g.id === groupId)!;
  const visible = projects.filter(group.test);
  return <>
    <div className="project-filter" role="group" aria-label="Площадь дома">
      {areaGroups.map(g => <button key={g.id} type="button" aria-pressed={g.id === groupId} onClick={() => setGroupId(g.id)}>{g.label}<span>{projects.filter(g.test).length}</span></button>)}
    </div>
    <ul className="project-grid">
      {visible.map(p => <li key={p.slug}><article className="project-tile">
        <div className="project-tile-image"><Image src={p.thumbnail} alt="" fill sizes="(max-width: 767px) 50vw, (max-width: 1200px) 33vw, 340px" /></div>
        <div className="project-tile-body">
          <h3><ProjectTrigger project={p.slug} className="project-tile-trigger">{"Просто дача\u00a0"}<span className="name-mark">{p.area}</span></ProjectTrigger></h3>
          <span>{p.width} × {p.depth} м · {p.area} м²</span>
          <strong className="project-tile-price">от {formatPrice(p.prices.kit)}</strong>
        </div>
      </article></li>)}
    </ul>
  </>;
}

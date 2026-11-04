import Image from "next/image";
import { ProjectTrigger } from "./project-trigger";
import { IconArrowRight } from "@tabler/icons-react";
import { projects } from "@/lib/data";

export function QuickProjects() {
  return <nav className="quick-projects" aria-label="Быстрый выбор проекта">
    <div className="quick-projects-heading"><p>Выберите подходящий проект</p><IconArrowRight size={23} stroke={1.5} /></div>
    <div className="quick-projects-grid">{projects.map(project => <ProjectTrigger project={project.slug} key={project.slug} className="quick-project" aria-label={`${project.name}, ${project.width} на ${project.depth} метров, ${project.area} м²`}>
      <div className="quick-project-image"><Image src={project.thumbnail} alt={project.name} fill sizes="(max-width: 767px) 30vw, 200px" /></div>
      <strong>{project.name}</strong><span>{project.width} × {project.depth} м · {project.area} м²</span>
    </ProjectTrigger>)}</div>

  </nav>;
}




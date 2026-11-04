import { IconLayout } from "@tabler/icons-react";
import type { Project } from "@/lib/data";
export function Plan({ project }: { project: Project }) { return <div className="plan-panel"><div className="plan-outline" style={{ aspectRatio: `${project.width}/${project.depth}` }} role="img" aria-label={`Наружный прямоугольный контур ${project.width} на ${project.depth} метров; не планировка`}><span className="dimension-top">{project.width} м</span><span className="dimension-side">{project.depth} м</span><IconLayout size={26} stroke={1.3} /><span>Планировка<br />уточняется</span></div><p>Только наружный контур.<br />Расположение комнат не утверждено.</p></div>; }


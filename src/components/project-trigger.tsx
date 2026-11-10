"use client";
import type { ComponentProps } from "react";
import { useSelection } from "./selection";
import { track } from "@/lib/analytics";
import { projects, type ProjectId } from "@/lib/data";
import { actionGoal, plain } from "@/lib/metrika";
import { openProject } from "@/lib/project-dialog-store";
export function ProjectTrigger({ project, children, onClick, ...props }: ComponentProps<"button"> & { project: ProjectId }) {
  const { update } = useSelection();
  return <button {...props} type="button" aria-haspopup="dialog" onClick={event => { onClick?.(event); update({ project }); track({ event: "project_select", project }); const name = projects.find(item => item.slug === project)?.name ?? project; actionGoal(`Открыть проект «${plain(name)}»`); openProject(project, event.currentTarget); }}>{children}</button>;
}

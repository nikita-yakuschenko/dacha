"use client";
import type { ComponentProps } from "react";
import { useSelection } from "./selection";
import { track } from "@/lib/analytics";
import { type ProjectId } from "@/lib/data";
import { metrikaGoal } from "@/lib/metrika";
import { openProject } from "@/lib/project-dialog-store";
export function ProjectTrigger({ project, children, onClick, ...props }: ComponentProps<"button"> & { project: ProjectId }) {
  const { update } = useSelection();
  return <button {...props} type="button" aria-haspopup="dialog" onClick={event => { onClick?.(event); update({ project, format: "kit", terrace: false, extras: [] }); track({ event: "project_select", project }); metrikaGoal("project_dialog", { project, action: "open" }); openProject(project, event.currentTarget); }}>{children}</button>;
}

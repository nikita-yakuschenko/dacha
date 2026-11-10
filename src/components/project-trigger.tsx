"use client";
import type { ComponentProps } from "react";
import { useSelection } from "./selection";
import { track } from "@/lib/analytics";
import { type ProjectId } from "@/lib/data";
import { dachaId } from "@/lib/metrika-goals";
import { metrikaGoal } from "@/lib/metrika";
import { openProject } from "@/lib/project-dialog-store";
export function ProjectTrigger({ project, children, onClick, ...props }: ComponentProps<"button"> & { project: ProjectId }) {
  const { update } = useSelection();
  return <button {...props} type="button" aria-haspopup="dialog" onClick={event => { onClick?.(event); update({ project }); track({ event: "project_select", project }); metrikaGoal(dachaId("open", project.replace("dacha-", ""))); openProject(project, event.currentTarget); }}>{children}</button>;
}

"use client";
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { closeProject, getOpenProject, getServerProject, subscribeProject } from "@/lib/project-dialog-store";
const ProjectModal = dynamic(() => import("./project-modal").then(module => module.ProjectModal), { ssr: false });
export function ProjectModalLoader() {
  const opened = useSyncExternalStore(subscribeProject, getOpenProject, getServerProject);
  return opened ? <ProjectModal slug={opened.slug} returnFocus={opened.trigger} onClose={closeProject} /> : null;
}

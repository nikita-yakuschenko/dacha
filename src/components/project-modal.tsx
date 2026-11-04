"use client";
import { useState } from "react";
import { Dialog } from "radix-ui";
import Image from "next/image";
import { IconX, IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { projects, type ProjectId } from "@/lib/data";
import { ProjectDetails } from "./project-details";
import { CalculationForm } from "./calculation-form";
import { useSelection } from "./selection";

export function ProjectModal({ slug, onClose, returnFocus }: { slug: ProjectId; onClose: () => void; returnFocus: HTMLElement }) {
  const [activeSlug, setActiveSlug] = useState(slug);
  const { update } = useSelection();
  const project = projects.find(item => item.slug === activeSlug);
  if (!project) return null;
  const index = projects.indexOf(project);
  function navigate(direction: number) { const next = projects[(index + direction + projects.length) % projects.length]; update({ project: next.slug }); setActiveSlug(next.slug); }
  return <Dialog.Root open onOpenChange={open => { if (!open) onClose(); }}><Dialog.Portal><Dialog.Overlay className="project-modal-overlay" /><Dialog.Content className="project-modal" aria-describedby={undefined} onCloseAutoFocus={event => { event.preventDefault(); returnFocus?.focus(); }}>
    <Dialog.Title className="sr-only">{project.name} — проект и расчёт</Dialog.Title>
    <div className="project-modal-toolbar"><span>Выберите свой дом</span><div><button type="button" onClick={() => navigate(-1)} aria-label="Предыдущий проект"><IconArrowLeft size={20} /></button><span>{index + 1} из {projects.length}</span><button type="button" onClick={() => navigate(1)} aria-label="Следующий проект"><IconArrowRight size={20} /></button><Dialog.Close className="project-modal-close" aria-label="Закрыть проект"><IconX size={22} /></Dialog.Close></div></div>
    <div className="project-modal-body" key={project.slug}><div className="project-modal-image"><Image src={project.thumbnail} alt={project.name} fill sizes="(max-width: 767px) 90vw, 40vw" /></div><ProjectDetails project={project} /><section className="project-modal-form" aria-label="Расчёт выбранного проекта"><CalculationForm compact initialProject={project.slug} /></section></div>
  </Dialog.Content></Dialog.Portal></Dialog.Root>;
}

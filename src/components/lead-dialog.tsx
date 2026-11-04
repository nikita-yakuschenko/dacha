"use client";
import type { ReactNode } from "react";
import { Dialog } from "radix-ui";
import { IconArrowUpRight, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type { ProjectId, Format } from "@/lib/data";
import { track } from "@/lib/analytics";
import { ProjectLeadForm } from "./project-lead-form";
import { useSelection } from "./selection";

// Кнопка расчёта открывает окно с формой заявки прямо на месте
export function CalculateButton({ children = "Получить расчёт", project, format, className, variant = "default" }: { children?: ReactNode; project?: ProjectId; format?: Format; className?: string; variant?: "default" | "outline" | "ghost" | "light" }) {
  const { selection, update } = useSelection();
  function open() {
    update({ ...(project ? { project } : {}), ...(format ? { format } : {}) });
    track({ event: "calculation_open", project: project || selection.project, format: format || selection.format });
  }
  return <Dialog.Root onOpenChange={isOpen => { if (isOpen) open(); }}>
    <Dialog.Trigger asChild><Button className={className} variant={variant}>{children}<IconArrowUpRight size={18} aria-hidden="true" /></Button></Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="project-modal-overlay" />
      <Dialog.Content className="lead-panel lead-dialog" aria-describedby={undefined}>
        <Dialog.Title asChild><h3>Заявка на расчёт</h3></Dialog.Title>
        <ProjectLeadForm />
        <Dialog.Close className="lead-dialog-close" aria-label="Закрыть"><IconX size={20} /></Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

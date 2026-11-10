"use client";
import type { ReactNode } from "react";
import { Dialog } from "radix-ui";
import { IconArrowUpRight, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type { ProjectId, Format } from "@/lib/data";
import { track } from "@/lib/analytics";
import { actionGoal } from "@/lib/metrika";
import { ProjectLeadForm } from "./project-lead-form";
import { useSelection } from "./selection";

// Окно держится над экранной клавиатурой: запоминаем её высоту и видимую высоту экрана
function liftAboveKeyboard(node: HTMLDivElement | null) {
  const viewport = window.visualViewport;
  if (!node || !viewport) return;
  function fit() {
    node!.style.setProperty("--keyboard", `${Math.max(0, window.innerHeight - viewport!.height - viewport!.offsetTop)}px`);
    node!.style.setProperty("--viewport", `${viewport!.height}px`);
  }
  fit();
  viewport.addEventListener("resize", fit);
  viewport.addEventListener("scroll", fit);
  return () => { viewport.removeEventListener("resize", fit); viewport.removeEventListener("scroll", fit); };
}

// Кнопка расчёта открывает окно с формой заявки прямо на месте
export function CalculateButton({ children = "Получить расчёт", project, format, className, variant = "default", action }: { children?: ReactNode; project?: ProjectId; format?: Format; className?: string; variant?: "default" | "outline" | "ghost" | "light"; action: string }) {
  const { selection, update } = useSelection();
  function open() {
    update({ ...(project ? { project } : {}), ...(format ? { format } : {}) });
    track({ event: "calculation_open", project: project || selection.project, format: format || selection.format });
    actionGoal(`Открыть окно заявки «${action}»`);
  }
  return <Dialog.Root onOpenChange={isOpen => { if (isOpen) open(); else actionGoal("Закрыть окно заявки"); }}>
    <Dialog.Trigger asChild><Button className={className} variant={variant}>{children}<IconArrowUpRight size={18} aria-hidden="true" /></Button></Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="project-modal-overlay" />
      <Dialog.Content ref={liftAboveKeyboard} className="lead-panel lead-dialog" aria-describedby={undefined} onOpenAutoFocus={event => { event.preventDefault(); (event.currentTarget as HTMLElement).focus(); }}>
        <Dialog.Title asChild><h3>Заявка на расчёт</h3></Dialog.Title>
        <ProjectLeadForm formName="Заявка на расчёт в окне" />
        <Dialog.Close className="lead-dialog-close" aria-label="Закрыть"><IconX size={20} /></Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

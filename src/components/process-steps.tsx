"use client";

import { useState } from "react";
import { HouseImage } from "@/components/house-image";

const steps = [
  { title: "Выбираем", text: "Проект и\u00a0комплектацию", src: "/images/step-choose.webp", cutout: true },
  { title: "Согласовываем", text: "Условия и\u00a0сроки", src: "/images/step-agree.webp", cutout: true },
  { title: "Изготавливаем", text: "Ваш дачный дом", src: "/images/step-make.webp", cutout: true },
  { title: "Отправляем", text: "Комплект на\u00a0участок", src: "/images/step-deliver.webp", cutout: true },
  { title: "Собираем", text: "Своими силами или\u00a0нашей бригадой", src: "/images/step-assemble.webp", cutout: true },
] as const;

// Раскрытый шаг — карточка. Наведение или фокус переключает её на этот пункт.
export function ProcessSteps() {
  const [open, setOpen] = useState(4);
  return <ol className="process-list">{steps.map((step, i) => {
    const on = open === i;
    return <li key={step.title} data-open={on || undefined}>
      <button type="button" aria-expanded={on} onPointerEnter={() => setOpen(i)} onFocus={() => setOpen(i)}>
        <span className="process-index">{String(i + 1).padStart(2, "0")}</span>
        <span className="process-copy"><h3>{step.title}</h3><p>{step.text}</p><span className="process-mark" aria-hidden="true" /></span>
      </button>
      {on ? <HouseImage className={"cutout" in step ? "process-photo process-photo-cut" : "process-photo"} src={"src" in step ? step.src : undefined} sizes="(max-width: 900px) 46vw, 480px" /> : null}
    </li>;
  })}</ol>;
}

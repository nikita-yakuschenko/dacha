"use client";

import { useState, type CSSProperties } from "react";
import { HouseImage } from "@/components/house-image";

const steps = [
  { title: "Выбираем", text: "Проект и\u00a0комплектацию", src: "/images/step-choose.webp", aspect: "2 / 1" },
  { title: "Согласовываем", text: "Условия и\u00a0сроки", src: "/images/step-agree.webp", aspect: "3 / 2" },
  { title: "Изготавливаем", text: "Ваш дачный дом", src: "/images/step-joint.webp", aspect: "1 / 1" },
  { title: "Отправляем", text: "Комплект на\u00a0участок", src: "/images/step-deliver.webp", aspect: "2 / 1" },
  { title: "Собираем", text: "Своими силами или\u00a0нашей бригадой", src: "/images/step-assemble.webp", aspect: "3 / 2" },
] as const;

// Раскрытый шаг — карточка. Наведение или фокус переключает её на этот пункт.
export function ProcessSteps() {
  const [open, setOpen] = useState(0);
  return <ol className="process-list">{steps.map((step, i) => {
    const on = open === i;
    return <li key={step.title} data-open={on || undefined} style={{ "--step-aspect": step.aspect } as CSSProperties}>
      <button type="button" aria-expanded={on} onPointerEnter={() => setOpen(i)} onFocus={() => setOpen(i)}>
        <span className="process-index">{String(i + 1).padStart(2, "0")}</span>
        <span className="process-copy"><h3>{step.title}</h3><p>{step.text}</p><span className="process-mark" aria-hidden="true" /></span>
      </button>
      <HouseImage className="process-photo process-photo-cut" src={step.src} sizes="(max-width: 900px) 46vw, 420px" />
    </li>;
  })}</ol>;
}

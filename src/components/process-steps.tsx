"use client";

import { useState } from "react";
import { HouseImage } from "@/components/house-image";

const steps = [
  ["Выбираем", "Проект и\u00a0комплектацию"],
  ["Согласовываем", "Условия и\u00a0сроки"],
  ["Изготавливаем", "Ваш дачный дом"],
  ["Отправляем", "Комплект на\u00a0участок"],
  ["Собираем", "Своими силами или\u00a0нашей бригадой"],
] as const;

// Раскрытый шаг — карточка. Наведение или фокус переключает её на этот пункт.
export function ProcessSteps() {
  const [open, setOpen] = useState(4);
  return <ol className="process-list">{steps.map(([title, text], i) => {
    const on = open === i;
    return <li key={title} data-open={on || undefined}>
      <button type="button" aria-expanded={on} onPointerEnter={() => setOpen(i)} onFocus={() => setOpen(i)}>
        <span className="process-index">{String(i + 1).padStart(2, "0")}</span>
        <span className="process-copy"><h3>{title}</h3><p>{text}</p><span className="process-mark" aria-hidden="true" /></span>
      </button>
      {on ? <HouseImage className="process-photo" sizes="(max-width: 900px) 46vw, 480px" /> : null}
    </li>;
  })}</ol>;
}

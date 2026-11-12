"use client";

import { useState } from "react";

const steps = [
  { title: "Выбираем", text: "Проект и\u00a0комплектацию" },
  { title: "Согласовываем", text: "Условия и\u00a0сроки" },
  { title: "Изготавливаем", text: "Ваш дачный дом" },
  { title: "Отправляем", text: "Комплект на\u00a0участок" },
  { title: "Собираем", text: "Своими силами или\u00a0нашей бригадой" },
] as const;

// Раскрытый шаг — плашка. Наведение или фокус переключает её на этот пункт.
export function ProcessSteps() {
  const [open, setOpen] = useState(0);
  return <ol className="process-list">{steps.map((step, i) => {
    const on = open === i;
    return <li key={step.title} data-open={on || undefined}>
      <button type="button" aria-expanded={on} onPointerEnter={() => setOpen(i)} onFocus={() => setOpen(i)}>
        <span className="process-index">{String(i + 1).padStart(2, "0")}</span>
        <span className="process-copy"><h3>{step.title}</h3><p>{step.text}</p><span className="process-mark" aria-hidden="true" /></span>
      </button>
    </li>;
  })}</ol>;
}

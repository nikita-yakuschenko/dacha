"use client";
import { useId, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { faqGoalId } from "@/lib/metrika-goals";
import { metrikaGoal } from "@/lib/metrika";

// Вопросы с плавным раскрытием высоты ответа
export function FaqList({ items }: { items: readonly (readonly string[])[] }) {
  const id = useId();
  const [open, setOpen] = useState<ReadonlySet<number>>(new Set());
  function toggle(index: number) {
    metrikaGoal(faqGoalId(index, !open.has(index)));
    setOpen(prev => { const next = new Set(prev); if (!next.delete(index)) next.add(index); return next; });
  }
  return <div className="faq-list">{items.map(([question, answer], i) => {
    const isOpen = open.has(i);
    return <div className="faq-item" data-open={isOpen} key={question}>
      <h3><button type="button" id={`${id}-q${i}`} aria-expanded={isOpen} aria-controls={`${id}-a${i}`} onClick={() => toggle(i)}>{question}<IconPlus size={20} stroke={1.4} aria-hidden="true" /></button></h3>
      <div className="faq-answer" id={`${id}-a${i}`} role="region" aria-labelledby={`${id}-q${i}`} inert={!isOpen}><div><p>{answer}</p></div></div>
    </div>;
  })}</div>;
}

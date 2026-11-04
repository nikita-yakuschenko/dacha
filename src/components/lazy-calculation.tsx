"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ProjectId } from "@/lib/data";
const Form = dynamic(() => import("./calculation-form").then(module => module.CalculationForm), { ssr: false, loading: () => <div className="calculation form-placeholder" role="status">Загружаем расчёт…</div> });
export function LazyCalculation() {
  const target = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [initialStep, setInitialStep] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { setReady(true); observer.disconnect(); } }, { rootMargin: "400px" });
    if (target.current) observer.observe(target.current);
    function open(event: Event) { const patch = (event as CustomEvent<{ project?: ProjectId }>).detail; setInitialStep(patch.project === "custom" ? 1 : patch.project ? 2 : 0); setReady(true); }
    window.addEventListener("dacha:calculate", open);
    return () => { observer.disconnect(); window.removeEventListener("dacha:calculate", open); };
  }, []);
  return <div ref={target} className="lazy-calculation">{ready ? <Form initialStep={initialStep} /> : <div className="calculation form-placeholder"><p>Четыре шага к вашему варианту</p><p className="muted small">Формат → проект → населённый пункт → один контакт.</p><noscript>Для интерактивного расчёта включите JavaScript. Демонстрационная форма не отправляет заявки.</noscript></div>}</div>;
}


"use client";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/data";

// Цена досчитывается до нового значения: быстрый старт, плавная остановка, шаг — тысяча рублей
export function AnimatedPrice({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const current = useRef(value);
  useEffect(() => {
    const from = current.current;
    if (from === value) return;
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650;
    const start = performance.now();
    let frame = 0;
    function tick(now: number) {
      const t = duration ? Math.min(1, (now - start) / duration) : 1;
      const next = t < 1 ? Math.round((from + (value - from) * (1 - (1 - t) ** 4)) / 1000) * 1000 : value;
      current.current = next;
      setShown(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{formatPrice(shown)}</>;
}

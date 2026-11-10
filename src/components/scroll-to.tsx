"use client";
import { useEffect, type ComponentProps } from "react";
import { usePathname, useRouter } from "next/navigation";
import { metrikaGoal } from "@/lib/metrika";

// Раздел, к которому нужно докрутить после перехода на главную
let pending: string | null = null;

// Резкий старт и долгое мягкое торможение (ease-out quint)
const easeOut = (t: number) => 1 - (1 - t) ** 5;
let cancelScroll: (() => void) | null = null;

function animateScroll(top: number) {
  cancelScroll?.();
  const from = scrollY, distance = top - from;
  if (Math.abs(distance) < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) { scrollTo(0, top); return; }
  const duration = Math.min(1100, Math.max(500, Math.abs(distance) * 0.35));
  const start = performance.now();
  let frame = requestAnimationFrame(function step(now) {
    const t = Math.min(1, (now - start) / duration);
    scrollTo(0, from + distance * easeOut(t));
    frame = t < 1 ? requestAnimationFrame(step) : 0;
    if (!frame) stop();
  });
  // Пользователь сам крутит — сразу отдаём ему управление
  const events = ["wheel", "touchstart", "keydown"] as const;
  function stop() { cancelAnimationFrame(frame); events.forEach(e => removeEventListener(e, stop)); cancelScroll = null; }
  events.forEach(e => addEventListener(e, stop, { passive: true }));
  cancelScroll = stop;
}

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return false;
  const offset = (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + (parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
  const maxTop = document.documentElement.scrollHeight - innerHeight;
  animateScroll(Math.min(maxTop, Math.max(0, target.getBoundingClientRect().top + scrollY - offset)));
  if (target.tabIndex < 0 && !target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  return true;
}

// Кнопка-переход к разделу главной без ссылок с #
export function ScrollTo({ to, goal, onClick, ...props }: ComponentProps<"button"> & { to: string; goal?: string }) {
  const router = useRouter();
  return <button type="button" {...props} onClick={event => {
    onClick?.(event);
    if (goal) metrikaGoal(goal);
    if (scrollToSection(to)) return;
    pending = to;
    router.push("/", { scroll: false });
  }} />;
}

// Докручивает до запомненного раздела, когда главная открылась
export function PendingScroll() {
  const pathname = usePathname();
  useEffect(() => {
    if (pending && scrollToSection(pending)) pending = null;
  }, [pathname]);
  return null;
}

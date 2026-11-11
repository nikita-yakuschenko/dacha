"use client";
import { useCallback, useEffect, useRef, useState, type PointerEvent, type UIEvent } from "react";
import { flushSync } from "react-dom";
import { Dialog } from "radix-ui";
import Image from "next/image";
import { IconChevronLeft, IconChevronRight, IconX, IconArrowRight } from "@tabler/icons-react";
import { assemblyPrice, extrasTotal, formatMeters, priceFor, projects, terracePrice, type ProjectId } from "@/lib/data";
import { AnimatedPrice } from "./animated-price";
import { ProjectPackages } from "./project-packages";
import { ProjectLeadForm } from "./project-lead-form";
import { useSelection } from "./selection";
import { dachaId } from "@/lib/metrika-goals";
import { metrikaGoal, plain } from "@/lib/metrika";

export function ProjectModal({ slug, onClose, returnFocus }: { slug: ProjectId; onClose: () => void; returnFocus: HTMLElement }) {
  const [slide, setSlide] = useState(0);
  const [leadVisible, setLeadVisible] = useState(false);
  const { selection } = useSelection();
  // Просмотрщик фото и планировки поверх окна; остаётся в разметке, чтобы плавно закрываться
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [thumbsNear, setThumbsNear] = useState(false);
  const viewerIndexRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sliding = useRef(false);
  const viewerTrigger = useRef<HTMLButtonElement | null>(null);
  const viewerClose = useRef<HTMLButtonElement>(null);
  const viewerDrag = useRef<{ x: number; moved: boolean } | null>(null);
  const viewerIgnoreClick = useRef(false);
  const seenSlide = useRef(0);
  useEffect(() => { if (viewerOpen) viewerClose.current?.focus(); }, [viewerOpen]);
  const houseName = plain(projects.find(item => item.slug === slug)?.name ?? slug);
  const area = slug.replace("dacha-", "");
  function openViewer(index: number, trigger: HTMLButtonElement) { viewerTrigger.current = trigger; viewerIndexRef.current = index; sliding.current = false; setViewerIndex(index); setViewerOpen(true); const photos = projects.find(item => item.slug === slug)?.photos.length ?? index; metrikaGoal(index >= photos ? dachaId("open_plan", area) : dachaId(`open_photo_${index + 1}`, area)); }
  function closeViewer() { metrikaGoal(dachaId("close_viewer", area)); setViewerOpen(false); setThumbsNear(false); viewerTrigger.current?.focus({ preventScroll: true }); }
  // Прячем нижнюю панель на мобилке, когда форма уже на экране
  const dialogNode = useRef<HTMLDivElement | null>(null);
  const measureGeneration = useRef(0);
  // Высота окна — чек со всеми строками, но не выше экрана. Если не влезает, ужимаем плотность, а не скроллим
  function lockModalHeight(node: HTMLDivElement) {
    const media = node.querySelector<HTMLElement>(".project-media");
    const desktop = matchMedia("(min-width: 1024px)").matches;
    node.style.height = "";
    if (media) media.style.height = "";
    if (!desktop) {
      delete node.dataset.density;
      delete node.dataset.receipt;
      return;
    }
    const generation = ++measureGeneration.current;
    const max = Math.floor(window.innerHeight - 32);
    const steps: { density?: string; receipt?: string }[] = [
      {},
      { density: "compact" },
      { density: "compact", receipt: "compact" },
      { density: "tight", receipt: "compact" },
      { density: "tight", receipt: "shorter" },
      { density: "tightest", receipt: "shorter" },
    ];
    // Колонки не сжимаются, поэтому высота берётся по ним, а не по уже обрезанному окну
    const needed = () => {
      const header = node.querySelector<HTMLElement>(".project-modal-header");
      const config = node.querySelector<HTMLElement>(".project-config");
      const lead = node.querySelector<HTMLElement>(".lead-panel");
      if (!header || !config || !lead) return node.scrollHeight;
      const headerBlock = header.offsetHeight + parseFloat(getComputedStyle(header).marginBottom);
      const pad = parseFloat(getComputedStyle(node).paddingBottom);
      return Math.ceil(headerBlock + Math.max(config.offsetHeight, lead.offsetHeight) + pad);
    };
    node.dataset.measure = "open";
    let height = needed();
    for (const step of steps) {
      if (step.density) node.dataset.density = step.density;
      else delete node.dataset.density;
      if (step.receipt) node.dataset.receipt = step.receipt;
      else delete node.dataset.receipt;
      height = needed();
      if (height <= max) break;
    }
    node.dataset.measure = "hold";
    node.style.height = `${Math.min(height, max)}px`;
    requestAnimationFrame(() => requestAnimationFrame(() => { if (generation === measureGeneration.current) delete node.dataset.measure; }));
  }
  const dialogRef = useCallback((node: HTMLDivElement | null) => { dialogNode.current = node; if (node) lockModalHeight(node); }, []);
  useEffect(() => {
    const onResize = () => { if (dialogNode.current) lockModalHeight(dialogNode.current); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const leadRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setLeadVisible(entry.isIntersecting), { root: node.closest(".project-modal"), threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const project = projects.find(item => item.slug === slug);
  if (!project) return null;
  const format = selection.format === "assembly" ? "assembly" : "kit";
  const total = priceFor(project, format, selection.terrace) + extrasTotal(project, selection.extras);
  // Позиции чека: добавки всегда в разметке, выключенные плавно свёрнуты
  const receipt = [
    { name: "Домокомплект", price: project.prices.kit, note: undefined, on: true },
    ...(terracePrice(project) > 0 ? [{ name: "Терраса", price: terracePrice(project), note: undefined, on: selection.terrace }] : []),
    { name: "Сборка", price: assemblyPrice(project, selection.terrace), note: undefined, on: format === "assembly" },
    ...project.extras.map(item => ({ name: item.id === "piles" ? "Винтовые сваи" : item.id === "deck" ? "Крашенный профнастил" : item.name, price: item.price, note: item.onRequest ? "+\u00a0Запрос стоимости покраски" : undefined, on: selection.extras.includes(item.id) })),
  ];
  // Короткая подпись для нижней панели на телефоне
  const parts = [selection.terrace && "террасой", format === "assembly" && "сборкой"].filter(Boolean);
  const withExtras = selection.extras.length > 0;
  const shortVariant = parts.length ? `${parts[0] === "сборкой" ? "Со" : "С"}\u00a0${parts.join(" и\u00a0")}${withExtras ? " и\u00a0дополнениями" : ""}` : withExtras ? "С\u00a0дополнениями" : "Домокомплект";
  const media = [...project.photos.map((src, index) => ({ src, kind: "photo" as const, label: `Фото ${index + 1}`, open: `Открыть фото ${index + 1}` })), { src: project.plan, kind: "plan" as const, label: "Планировка", open: "Открыть планировку" }];
  const current = media[viewerIndex];
  const planSlide = media.length - 1;
  function showSlide(target: number, from: HTMLElement) { const gallery = from.closest(".project-media")?.querySelector(".project-media-track"); gallery?.scrollTo({ left: target * gallery.clientWidth, behavior: "smooth" }); }
  function commitStep(dir: 1 | -1) {
    const next = (viewerIndexRef.current + dir + media.length) % media.length;
    const track = trackRef.current;
    viewerIndexRef.current = next;
    if (track) track.dataset.drag = "true";
    flushSync(() => setViewerIndex(next));
    if (track) track.style.transform = "translateX(-100%)";
    sliding.current = false;
  }
  function goalLand(index: number) {
    const item = media[index];
    metrikaGoal(item.kind === "plan" ? dachaId("slide_plan", area) : dachaId(`slide_photo_${index + 1}`, area));
  }
  // Сдвиг на один кадр: лента уезжает, затем кадры переставляются без скачка
  function animateStep(dir: 1 | -1) {
    if (sliding.current) return;
    const track = trackRef.current;
    const width = stageRef.current?.clientWidth ?? 0;
    if (!track || !width || matchMedia("(prefers-reduced-motion: reduce)").matches) { commitStep(dir); return; }
    sliding.current = true;
    delete track.dataset.drag;
    track.style.transform = `translateX(calc(-100% + ${dir === 1 ? -width : width}px))`;
    const finish = () => { track.removeEventListener("transitionend", finish); commitStep(dir); };
    track.addEventListener("transitionend", finish);
  }
  function goViewer(next: number) {
    const index = viewerIndexRef.current;
    if (next === index || sliding.current) return;
    goalLand(next);
    const forward = (next - index + media.length) % media.length;
    if (forward === 1) animateStep(1);
    else if (forward === media.length - 1) animateStep(-1);
    else { viewerIndexRef.current = next; setViewerIndex(next); }
  }
  function stepViewer(delta: number) { if (sliding.current) return; const dir: 1 | -1 = delta < 0 ? -1 : 1; goalLand((viewerIndexRef.current + dir + media.length) % media.length); animateStep(dir); }
  function viewerPointerDown(event: PointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("button") || event.pointerType !== "touch" || sliding.current) return;
    const width = stageRef.current?.clientWidth ?? 0;
    if (!width) return;
    const pointerId = event.pointerId;
    viewerDrag.current = { x: event.clientX, moved: false };
    const track = trackRef.current;
    if (track) { track.dataset.drag = "true"; track.style.transform = "translateX(-100%)"; }
    const move = (native: globalThis.PointerEvent) => {
      if (native.pointerId !== pointerId) return;
      const drag = viewerDrag.current;
      if (!drag) return;
      const dx = native.clientX - drag.x;
      if (Math.abs(dx) > 8) drag.moved = true;
      if (track) track.style.transform = `translateX(calc(-100% + ${dx}px))`;
    };
    const up = (native: globalThis.PointerEvent) => {
      if (native.pointerId !== pointerId) return;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      const drag = viewerDrag.current;
      viewerDrag.current = null;
      if (!drag) return;
      const dx = native.clientX - drag.x;
      if (drag.moved) viewerIgnoreClick.current = true;
      if (!track || Math.abs(dx) < Math.min(64, width * 0.16)) {
        if (track) { delete track.dataset.drag; track.style.transform = "translateX(-100%)"; }
        return;
      }
      const dir: 1 | -1 = dx < 0 ? 1 : -1;
      goalLand((viewerIndexRef.current + dir + media.length) % media.length);
      sliding.current = true;
      delete track.dataset.drag;
      track.style.transform = `translateX(calc(-100% + ${dir === 1 ? -width : width}px))`;
      const finish = () => { track.removeEventListener("transitionend", finish); commitStep(dir); };
      track.addEventListener("transitionend", finish);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }
  function openLead() {
    metrikaGoal(dachaId("cta", area));
    const lead = document.querySelector<HTMLElement>(".project-modal .lead-panel");
    lead?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function onMediaScroll(event: UIEvent<HTMLDivElement>) {
    const width = event.currentTarget.clientWidth || 1;
    const next = Math.round(event.currentTarget.scrollLeft / width);
    if (next === seenSlide.current || !media[next]) return;
    seenSlide.current = next;
    setSlide(next);
    const item = media[next];
    metrikaGoal(item.kind === "plan" ? "card_plan" : `card_photo_${next + 1}`, { project: houseName });
  }
  return <Dialog.Root open onOpenChange={open => { if (!open) { metrikaGoal(dachaId("close", area)); onClose(); } }}><Dialog.Portal><Dialog.Overlay className="project-modal-overlay" /><Dialog.Content ref={dialogRef} className="project-modal" aria-describedby={undefined} onEscapeKeyDown={event => { if (viewerOpen) { event.preventDefault(); closeViewer(); } }} onCloseAutoFocus={event => { event.preventDefault(); returnFocus?.focus(); }}>
    <Dialog.Close className="project-modal-close" aria-label="Закрыть проект"><IconX size={20} /></Dialog.Close>
    <header className="project-modal-header">
      <div className="project-title"><Dialog.Title asChild><h2>{"Просто дача\u00a0"}<span className="name-mark">{project.area}</span></h2></Dialog.Title><p><span>{formatMeters(project.width)} × {formatMeters(project.depth)} м</span><span>{project.area} м²</span></p></div>
      <p className="project-column-label">Комплектация</p>
      <p className="project-column-label">Заявка на расчёт</p>
    </header>
    <div className="project-modal-grid">
      <section className="project-media" aria-label="Фото и планировка">
        <div className="project-media-track" onScroll={onMediaScroll}>
          {media.map((item, index) => <figure key={item.src} className={item.kind === "plan" ? "project-plan" : "project-photo"}><Image src={item.src} alt={item.kind === "plan" ? `Планировка, ${project.name}` : project.name} fill sizes="(max-width: 1023px) 100vw, 720px" unoptimized priority={index === 0} /><button type="button" className="project-media-open" aria-label={item.open} onClick={e => openViewer(index, e.currentTarget)} /></figure>)}
        </div>
        <button type="button" className="project-media-switch" data-hidden={slide === planSlide} inert={slide === planSlide} onClick={e => showSlide(planSlide, e.currentTarget)}>Планировка</button>
        <div className="project-media-dots">{media.map((item, i) => <button key={item.src} type="button" aria-label={item.label} aria-current={slide === i} onClick={e => showSlide(i, e.currentTarget)} />)}</div>
      </section>
      <section className="project-config" aria-label="Комплектация и цены"><ProjectPackages project={project} /></section>
      <aside className="lead-panel" ref={leadRef} aria-label="Заявка на расчёт">
        <h3>Заявка на расчёт</h3>
        <ul className="lead-receipt">{receipt.map(line => <li key={line.name} data-on={line.on} inert={!line.on}><div><p>
          {line.note ? <strong>{line.note}</strong> : <><strong>{line.name}</strong><span className="lead-receipt-price"><AnimatedPrice value={line.price} currency={false} /></span></>}
        </p></div></li>)}</ul>
        <p className="lead-total"><span>Итого</span><strong className="lead-price"><AnimatedPrice value={total} currency={false} /></strong></p>
        <ProjectLeadForm project={project} goal={dachaId("lead", area)} />
      </aside>
    </div>
    <div className="project-viewer" data-open={viewerOpen} data-kind={current.kind} data-thumbs={thumbsNear ? "near" : "away"} inert={!viewerOpen} role="group" aria-label={current.label} onKeyDown={event => { if (event.key === "ArrowRight") { event.preventDefault(); stepViewer(1); } if (event.key === "ArrowLeft") { event.preventDefault(); stepViewer(-1); } }} onPointerMove={event => { if (event.pointerType !== "mouse") return; const thumbs = event.currentTarget.querySelector(".project-viewer-thumbs"); if (!thumbs) return; const rect = thumbs.getBoundingClientRect(); const pad = 72; const near = event.clientX >= rect.left - pad && event.clientX <= rect.right + pad && event.clientY >= rect.top - pad && event.clientY <= rect.bottom + 24; setThumbsNear(value => value === near ? value : near); }} onPointerLeave={() => setThumbsNear(false)} onPointerDown={viewerPointerDown} onClick={event => { if ((event.target as HTMLElement).closest("button")) return; if (viewerIgnoreClick.current) { viewerIgnoreClick.current = false; return; } closeViewer(); }}>
      <div className="project-viewer-stage" ref={stageRef}><div className="project-viewer-track" ref={trackRef}>{[media[(viewerIndex - 1 + media.length) % media.length], current, media[(viewerIndex + 1) % media.length]].map((item, slot) => <div className="project-viewer-item" data-kind={item.kind} key={slot}><Image src={item.src} alt={item.kind === "plan" ? `Планировка, ${project.name}` : project.name} fill sizes="1360px" unoptimized /></div>)}</div></div>
      <button type="button" className="project-viewer-nav project-viewer-prev" aria-label="Предыдущее изображение" onPointerDown={event => { event.stopPropagation(); viewerIgnoreClick.current = true; }} onClick={event => { event.stopPropagation(); viewerIgnoreClick.current = false; stepViewer(-1); }}><IconChevronLeft size={22} /></button>
      <button type="button" className="project-viewer-nav project-viewer-next" aria-label="Следующее изображение" onPointerDown={event => { event.stopPropagation(); viewerIgnoreClick.current = true; }} onClick={event => { event.stopPropagation(); viewerIgnoreClick.current = false; stepViewer(1); }}><IconChevronRight size={22} /></button>
      <div className="project-viewer-thumbs" onClick={event => event.stopPropagation()}>{media.map((item, index) => <button key={item.src} type="button" aria-label={item.label} aria-current={viewerIndex === index} onPointerDown={() => { viewerIgnoreClick.current = true; }} onClick={() => goViewer(index)}>
        <Image src={item.src} alt="" fill sizes="80px" unoptimized />
      </button>)}</div>
      <button ref={viewerClose} type="button" className="project-viewer-close" aria-label="Закрыть просмотр" onClick={event => { event.stopPropagation(); closeViewer(); }}><IconX size={20} /></button>
    </div>
    <div className="project-modal-cta" data-hidden={leadVisible} inert={leadVisible}><p><strong><AnimatedPrice value={total} currency={false} /></strong><span>{shortVariant}</span></p><button type="button" onClick={openLead}>Оставить заявку<IconArrowRight size={18} /></button></div>
  </Dialog.Content></Dialog.Portal></Dialog.Root>;
}

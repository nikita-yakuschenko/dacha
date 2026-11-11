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
  const zoom = useRef({ scale: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const seenSlide = useRef(0);
  const zoomTarget = useCallback(() => trackRef.current?.querySelector(".project-viewer-item:nth-child(2) img") as HTMLElement | null, []);
  const paintZoom = useCallback(() => {
    const img = zoomTarget();
    if (!img) return;
    const { scale, x, y } = zoom.current;
    img.style.transform = scale === 1 ? "" : `translate(${x}px, ${y}px) scale(${scale})`;
  }, [zoomTarget]);
  const resetZoom = useCallback(() => {
    zoom.current = { scale: 1, x: 0, y: 0 };
    pinch.current = null;
    trackRef.current?.querySelectorAll("img").forEach(node => { (node as HTMLElement).style.transform = ""; });
  }, []);
  useEffect(() => { if (viewerOpen) viewerClose.current?.focus(); }, [viewerOpen]);
  useEffect(() => {
    const stage = stageRef.current;
    if (!viewerOpen || !stage) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const next = Math.min(4, Math.max(1, zoom.current.scale * (event.deltaY < 0 ? 1.08 : 1 / 1.08)));
      zoom.current.scale = next;
      if (next === 1) { zoom.current.x = 0; zoom.current.y = 0; }
      paintZoom();
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [viewerOpen, paintZoom]);
  const houseName = plain(projects.find(item => item.slug === slug)?.name ?? slug);
  const area = slug.replace("dacha-", "");
  function openViewer(index: number, trigger: HTMLButtonElement) { viewerTrigger.current = trigger; viewerIndexRef.current = index; sliding.current = false; setViewerIndex(index); setViewerOpen(true); const photos = projects.find(item => item.slug === slug)?.photos.length ?? index; metrikaGoal(index >= photos ? dachaId("open_plan", area) : dachaId(`open_photo_${index + 1}`, area)); }
  function closeViewer() { metrikaGoal(dachaId("close_viewer", area)); resetZoom(); setViewerOpen(false); setThumbsNear(false); viewerTrigger.current?.focus({ preventScroll: true }); }
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
    resetZoom();
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
    const finish = () => { if (!sliding.current) return; track.removeEventListener("transitionend", finish); commitStep(dir); };
    track.addEventListener("transitionend", finish);
    window.setTimeout(finish, 480);
  }
  function goViewer(next: number) {
    const index = viewerIndexRef.current;
    if (next === index || sliding.current) return;
    goalLand(next);
    const forward = (next - index + media.length) % media.length;
    if (forward === 1) animateStep(1);
    else if (forward === media.length - 1) animateStep(-1);
    else { viewerIndexRef.current = next; setViewerIndex(next); resetZoom(); }
  }
  function stepViewer(delta: number) { if (sliding.current) return; const dir: 1 | -1 = delta < 0 ? -1 : 1; goalLand((viewerIndexRef.current + dir + media.length) % media.length); animateStep(dir); }
  function viewerPointerDown(event: PointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("button") || sliding.current) return;
    // Иначе телефон отдаёт жест прокрутке или перетаскиванию картинки, и лента не едет
    if (event.pointerType === "touch") { event.preventDefault(); try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* указатель уже отпущен */ } }
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, scale: zoom.current.scale };
      viewerDrag.current = null;
      if (trackRef.current) { delete trackRef.current.dataset.drag; trackRef.current.style.transform = "translateX(-100%)"; }
      return;
    }
    if (event.pointerType !== "touch" || zoom.current.scale > 1) {
      if (event.pointerType !== "touch") { pointers.current.delete(event.pointerId); return; }
    }
    const width = stageRef.current?.clientWidth ?? 0;
    if (!width) return;
    const pointerId = event.pointerId;
    const origin = { x: event.clientX, y: event.clientY, moved: false, panX: zoom.current.x, panY: zoom.current.y };
    viewerDrag.current = { x: event.clientX, moved: false };
    const track = trackRef.current;
    const panning = zoom.current.scale > 1;
    if (track && !panning) { track.dataset.drag = "true"; track.style.transform = "translateX(-100%)"; }
    const move = (native: globalThis.PointerEvent) => {
      const point = pointers.current.get(native.pointerId);
      if (point) { point.x = native.clientX; point.y = native.clientY; }
      if (pinch.current && pointers.current.size >= 2) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        zoom.current.scale = Math.min(4, Math.max(1, pinch.current.scale * dist / pinch.current.dist));
        if (zoom.current.scale === 1) { zoom.current.x = 0; zoom.current.y = 0; }
        paintZoom();
        return;
      }
      if (native.pointerId !== pointerId) return;
      const dx = native.clientX - origin.x;
      const dy = native.clientY - origin.y;
      if (Math.hypot(dx, dy) > 8) { origin.moved = true; if (viewerDrag.current) viewerDrag.current.moved = true; }
      if (panning) { zoom.current.x = origin.panX + dx; zoom.current.y = origin.panY + dy; paintZoom(); return; }
      if (track) track.style.transform = `translateX(calc(-100% + ${dx}px))`;
    };
    const up = (native: globalThis.PointerEvent) => {
      pointers.current.delete(native.pointerId);
      if (pointers.current.size < 2) pinch.current = null;
      if (native.pointerId !== pointerId) return;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      const drag = viewerDrag.current;
      viewerDrag.current = null;
      if (!drag || panning) { if (origin.moved) viewerIgnoreClick.current = true; return; }
      const dx = native.clientX - origin.x;
      if (drag.moved) viewerIgnoreClick.current = true;
      if (!track || Math.abs(dx) < Math.min(64, width * 0.16)) {
        if (track) { delete track.dataset.drag; track.style.transform = "translateX(-100%)"; }
        if (!drag.moved && native.pointerType === "touch") closeViewer();
        return;
      }
      const dir: 1 | -1 = dx < 0 ? 1 : -1;
      goalLand((viewerIndexRef.current + dir + media.length) % media.length);
      sliding.current = true;
      delete track.dataset.drag;
      track.style.transform = `translateX(calc(-100% + ${dir === 1 ? -width : width}px))`;
      const finish = () => { if (!sliding.current) return; track.removeEventListener("transitionend", finish); commitStep(dir); };
      track.addEventListener("transitionend", finish);
      window.setTimeout(finish, 480);
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
      <div className="project-viewer-stage" ref={stageRef}><div className="project-viewer-track" ref={trackRef}>{[media[(viewerIndex - 1 + media.length) % media.length], current, media[(viewerIndex + 1) % media.length]].map((item, slot) => <div className="project-viewer-item" data-kind={item.kind} key={slot}><Image src={item.src} alt={item.kind === "plan" ? `Планировка, ${project.name}` : project.name} fill sizes="1360px" draggable={false} unoptimized /></div>)}</div>
        <button type="button" className="project-viewer-nav project-viewer-prev" aria-label="Предыдущее изображение" onPointerDown={event => { event.stopPropagation(); viewerIgnoreClick.current = true; }} onClick={event => { event.stopPropagation(); viewerIgnoreClick.current = false; stepViewer(-1); }}><IconChevronLeft size={22} /></button>
        <button type="button" className="project-viewer-nav project-viewer-next" aria-label="Следующее изображение" onPointerDown={event => { event.stopPropagation(); viewerIgnoreClick.current = true; }} onClick={event => { event.stopPropagation(); viewerIgnoreClick.current = false; stepViewer(1); }}><IconChevronRight size={22} /></button>
      </div>
      <div className="project-viewer-thumbs" onClick={event => event.stopPropagation()}>{media.map((item, index) => <button key={item.src} type="button" aria-label={item.label} aria-current={viewerIndex === index} onPointerDown={() => { viewerIgnoreClick.current = true; }} onClick={() => goViewer(index)}>
        <Image src={item.src} alt="" fill sizes="80px" unoptimized />
      </button>)}</div>
      <button ref={viewerClose} type="button" className="project-viewer-close" aria-label="Закрыть просмотр" onClick={event => { event.stopPropagation(); closeViewer(); }}><IconX size={20} /></button>
    </div>
    <div className="project-modal-cta" data-hidden={leadVisible} inert={leadVisible}><p><strong><AnimatedPrice value={total} currency={false} /></strong><span>{shortVariant}</span></p><button type="button" onClick={openLead}>Оставить заявку<IconArrowRight size={18} /></button></div>
  </Dialog.Content></Dialog.Portal></Dialog.Root>;
}

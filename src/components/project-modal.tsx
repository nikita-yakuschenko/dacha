"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import Image from "next/image";
import { IconX, IconArrowRight } from "@tabler/icons-react";
import { assemblyPrice, priceFor, projects, terracePrice, type ProjectId } from "@/lib/data";
import { AnimatedPrice } from "./animated-price";
import { Plan } from "./plan";
import { ProjectPackages } from "./project-packages";
import { ProjectLeadForm } from "./project-lead-form";
import { useSelection } from "./selection";

export function ProjectModal({ slug, onClose, returnFocus }: { slug: ProjectId; onClose: () => void; returnFocus: HTMLElement }) {
  const [slide, setSlide] = useState(0);
  const [leadVisible, setLeadVisible] = useState(false);
  const { selection } = useSelection();
  // Просмотрщик фото и планировки поверх окна; остаётся в разметке, чтобы плавно закрываться
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerItem, setViewerItem] = useState<"photo" | "plan">("photo");
  const viewerTrigger = useRef<HTMLButtonElement | null>(null);
  const viewerClose = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (viewerOpen) viewerClose.current?.focus(); }, [viewerOpen]);
  function openViewer(item: "photo" | "plan", trigger: HTMLButtonElement) { viewerTrigger.current = trigger; setViewerItem(item); setViewerOpen(true); }
  function closeViewer() { setViewerOpen(false); viewerTrigger.current?.focus({ preventScroll: true }); }
  // Прячем нижнюю панель на мобилке, когда форма уже на экране
  const leadRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setLeadVisible(entry.isIntersecting), { root: node.closest(".project-modal"), threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  // На десктопе окно не прокручивается: включаем всё более плотный режим, пока содержимое не поместится
  const fitRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const grid = node.querySelector<HTMLElement>(".project-modal-grid")!;
    const lead = node.querySelector<HTMLElement>(".project-modal-grid > .lead-panel")!;
    // Высоту окна задают фото и комплектация, форма в этом не участвует
    function fit() {
      node!.removeAttribute("data-density");
      if (window.innerWidth >= 1024) for (const level of ["compact", "tight", "tightest"]) {
        if (node!.scrollHeight <= node!.clientHeight + 1) break;
        node!.dataset.density = level;
      }
      fitReceipt();
    }
    // Чек растёт только до низа ряда: плотность формы считаем по худшему случаю — все позиции раскрыты
    function fitReceipt() {
      node!.removeAttribute("data-receipt");
      if (window.innerWidth < 1024) return;
      node!.dataset.measure = "open";
      for (const level of ["short", "shorter"]) {
        if (lead.scrollHeight <= grid.clientHeight + 1) break;
        node!.dataset.receipt = level;
      }
      // Возвращаем строки без анимации, затем снова включаем переходы
      node!.dataset.measure = "still";
      void lead.offsetHeight;
      delete node!.dataset.measure;
    }
    fit();
    void document.fonts.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  const project = projects.find(item => item.slug === slug);
  if (!project) return null;
  const format = selection.format === "assembly" ? "assembly" : "kit";
  const total = priceFor(project, format, selection.terrace);
  // Позиции чека: добавки всегда в разметке, выключенные плавно свёрнуты
  const receipt = [
    { name: "Домокомплект", price: project.prices.kit, on: true },
    { name: "Терраса", price: terracePrice(project), on: selection.terrace },
    { name: "Сборка", price: assemblyPrice(project, selection.terrace), on: format === "assembly" },
  ];
  // Короткая подпись для нижней панели на телефоне
  const extras = [selection.terrace && "террасой", format === "assembly" && "сборкой"].filter(Boolean);
  const shortVariant = extras.length ? `${extras[0] === "сборкой" ? "Со" : "С"}\u00a0${extras.join(" и\u00a0")}` : "Домокомплект";
  const slides = ["Фото", "Планировка"];
  const planSlide = slides.length - 1;
  function showSlide(target: number, from: HTMLElement) { const gallery = from.closest(".project-media")?.querySelector(".project-media-track"); gallery?.scrollTo({ left: target * gallery.clientWidth, behavior: "smooth" }); }
  function openLead() {
    const lead = document.querySelector<HTMLElement>(".project-modal .lead-panel");
    lead?.scrollIntoView({ behavior: "smooth", block: "start" });
    lead?.querySelector("input")?.focus({ preventScroll: true });
  }
  return <Dialog.Root open onOpenChange={open => { if (!open) onClose(); }}><Dialog.Portal><Dialog.Overlay className="project-modal-overlay" /><Dialog.Content ref={fitRef} className="project-modal" aria-describedby={undefined} onEscapeKeyDown={event => { if (viewerOpen) { event.preventDefault(); closeViewer(); } }} onCloseAutoFocus={event => { event.preventDefault(); returnFocus?.focus(); }}>
    <header className="project-modal-header">
      <div className="project-title"><Dialog.Title asChild><h2>{"Просто дача\u00a0"}<span className="name-mark">{project.area}</span></h2></Dialog.Title><p><span>{project.width} × {project.depth} м</span><span>{project.area} м²</span></p></div>
      <Dialog.Close className="project-modal-close" aria-label="Закрыть проект"><IconX size={20} /></Dialog.Close>
    </header>
    <div className="project-modal-grid">
      <section className="project-media" aria-label="Фото и планировка">
        <div className="project-media-track" onScroll={e => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
          <figure className="project-photo"><Image src={project.thumbnail} alt={project.name} fill sizes="(max-width: 767px) 100vw, 34vw" priority /><button type="button" className="project-media-open" aria-label="Открыть фото" onClick={e => openViewer("photo", e.currentTarget)} /></figure>
          <figure className="project-plan"><Plan project={project} /><button type="button" className="project-media-open" aria-label="Открыть планировку" onClick={e => openViewer("plan", e.currentTarget)} /></figure>
        </div>
        <button type="button" className="project-media-switch" data-hidden={slide === planSlide} inert={slide === planSlide} onClick={e => showSlide(planSlide, e.currentTarget)}>Планировка</button>
        <div className="project-media-dots">{slides.map((label, i) => <button key={label} type="button" aria-label={label} aria-current={slide === i} onClick={e => showSlide(i, e.currentTarget)} />)}</div>
      </section>
      <section className="project-config" aria-label="Комплектация и цены"><ProjectPackages project={project} /></section>
      <aside className="lead-panel" ref={leadRef} aria-label="Заявка на расчёт">
        <h3>Заявка на расчёт</h3>
        <ul className="lead-receipt">{receipt.map(line => <li key={line.name} data-on={line.on} inert={!line.on}><div><p>
          <strong>{line.name}</strong>
          <span className="lead-receipt-price"><AnimatedPrice value={line.price} /></span>
        </p></div></li>)}</ul>
        <p className="lead-total"><span>Итого</span><strong className="lead-price"><AnimatedPrice value={total} /></strong></p>
        <ProjectLeadForm project={project} />
      </aside>
      <div className="project-viewer" data-open={viewerOpen} data-item={viewerItem} inert={!viewerOpen} role="group" aria-label={viewerItem === "photo" ? "Фото" : "Планировка"} onClick={closeViewer}>
        <div className="project-viewer-stage"><div className="project-viewer-item" key={viewerItem}>{viewerItem === "photo" ? <Image src={project.thumbnail} alt={project.name} fill sizes="(max-width: 1023px) 100vw, 1360px" /> : <Plan project={project} />}</div></div>
        {/* Миниатюры: переключают картинку и не закрывают просмотр */}
        <div className="project-viewer-thumbs" onClick={event => event.stopPropagation()}>{(["photo", "plan"] as const).map(item => <button key={item} type="button" aria-label={item === "photo" ? "Фото" : "Планировка"} aria-current={viewerItem === item} onClick={() => setViewerItem(item)}>
          {item === "photo" ? <Image src={project.thumbnail} alt="" fill sizes="80px" /> : <Plan project={project} />}
        </button>)}</div>
        <button ref={viewerClose} type="button" className="project-viewer-close" aria-label="Закрыть просмотр"><IconX size={20} /></button>
      </div>
    </div>
    <div className="project-modal-cta" data-hidden={leadVisible} inert={leadVisible}><p><strong><AnimatedPrice value={total} /></strong><span>{shortVariant}</span></p><button type="button" onClick={openLead}>Оставить заявку<IconArrowRight size={18} /></button></div>
  </Dialog.Content></Dialog.Portal></Dialog.Root>;
}

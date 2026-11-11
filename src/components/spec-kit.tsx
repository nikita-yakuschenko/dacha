"use client";

import { useState } from "react";
import Image from "next/image";

const parts = [
  { area: "walls", tone: "lead", name: "Стены и\u00a0перегородки", image: "/images/spec-walls-olive.webp", text: "Стопа из\u00a0профилированного бруса 45×145\u00a0мм, камерной сушки, строганный. Настил террасы и\u00a0крыльца\u00a0— палубная доска 35\u00a0мм, камерной сушки, строганная." },
  { area: "foundation", name: "Фундамент", image: "/images/spec-foundation.webp", text: "Блочно-точечные опоры из\u00a0газосиликата или\u00a0его аналога." },
  { area: "floor", name: "Обвязка, лаги и\u00a0пол", image: "/images/spec-floor.webp", text: "Обвязка и\u00a0лаги\u00a0— пиломатериал естественной влажности. Настил пола\u00a0— шпунтованная доска толщиной 35\u00a0мм." },
  { area: "roof", name: "Крыша", image: "/images/spec-roof-gable.webp", text: "Стропильная система из\u00a0профилированного бруса 45×145\u00a0мм. Настил кровли\u00a0— рулонная черепица ТЕХНОНИКОЛЬ с\u00a0металлическими карнизными и\u00a0торцевыми планками." },
  { area: "windows", name: "Окна и\u00a0двери", image: "/images/spec-windows-frame.webp", text: "Окна\u00a0— деревянные летние, одинарный стеклопакет. Двери\u00a0— деревянные филенчатые, входные и\u00a0межкомнатные. Размеры и\u00a0количество\u00a0— по\u00a0проекту." },
  { area: "fasteners", name: "Крепёж и\u00a0документация", image: "/images/spec-fasteners.webp", text: "Набор крепежа, документация и\u00a0инструкция для\u00a0самостоятельной сборки дома." },
  { area: "delivery", name: "Доставка", image: "/images/spec-delivery.webp", text: "Доставку можно заказать у\u00a0нас или\u00a0организовать своими силами. Габариты домокомплекта уточняйте у\u00a0менеджера." },
  { area: "paint", name: "Монтаж и\u00a0покраска", image: "/images/spec-paint-sage.webp", text: "Можно заказать сборку дома или\u00a0покраску деталей, а\u00a0также дополнения и\u00a0изменения в\u00a0составе проекта. Полный перечень\u00a0— в\u00a0карточке проекта." },
] as const;

export function SpecKit() {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());
  function toggle(area: string) {
    setOpen(prev => { const next = new Set(prev); if (!next.delete(area)) next.add(area); return next; });
  }
  return <div className="spec-bento">{parts.map(item => {
    const isOpen = open.has(item.area);
    const wide = item.area === "fasteners" || item.area === "walls" || item.area === "paint" || item.area === "windows";
    return <button key={item.area} type="button" className="spec-card" data-area={item.area} data-tone={"tone" in item ? item.tone : undefined} data-open={isOpen} aria-expanded={isOpen} onClick={() => toggle(item.area)}>
      <span className="spec-face"><Image className="spec-figure" src={item.image} alt="" fill unoptimized={item.area === "walls"} sizes={wide ? "(max-width: 1023px) 100vw, 960px" : "(max-width: 1023px) 100vw, 400px"} quality={item.area === "paint" || item.area === "windows" ? 90 : 75} /><strong>{item.name}</strong></span>
      <span className="spec-detail"><span><p>{item.text}</p></span></span>
    </button>;
  })}</div>;
}

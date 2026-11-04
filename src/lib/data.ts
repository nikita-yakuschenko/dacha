export type Format = "kit" | "assembly" | "help";
export type ProjectId = "dacha-20" | "dacha-24" | "dacha-30" | "custom";
export type Project = { slug: Exclude<ProjectId, "custom">; name: string; width: number; depth: number; area: number; description: string; price: number | null; plan: string | null; usableArea: number | null; wallThickness: number | null; terraceArea: number | null; specification: "pending"; image: string; thumbnail: string };
export const projects: Project[] = [
  { slug: "dacha-20", thumbnail: "/images/dacha-20-thumbnail.webp", name: "Дача 20", width: 4, depth: 5, area: 20, description: "Небольшой дом для вашего места за городом.", price: null, plan: null, usableArea: null, wallThickness: null, terraceArea: null, specification: "pending", image: "/images/garden-concept.webp" },
  { slug: "dacha-24", thumbnail: "/images/dacha-24-thumbnail.webp", name: "Дача 24", width: 4, depth: 6, area: 24, description: "Чуть больше пространства для дачных выходных.", price: null, plan: null, usableArea: null, wallThickness: null, terraceArea: null, specification: "pending", image: "/images/garden-concept.webp" },
  { slug: "dacha-30", thumbnail: "/images/dacha-30-thumbnail.webp", name: "Дача 30", width: 5, depth: 6, area: 30, description: "Самый просторный из трёх пилотных размеров.", price: null, plan: null, usableArea: null, wallThickness: null, terraceArea: null, specification: "pending", image: "/images/garden-concept.webp" },
];
export const formats: Record<Format, string> = { kit: "Комплект с доставкой", assembly: "Дом с монтажом", help: "Нужна помощь с выбором" };
export const specification = [
  { name: "Стены и перегородки", note: "Сечение, профиль и состав — по проекту" },
  { name: "Обвязка, лаги и пол", note: "Конструкция и настил — после согласования" },
  { name: "Крыша и кровля", note: "Материал, марка и основание уточняются" },
  { name: "Окна и двери", note: "Размеры, количество и материал уточняются" },
  { name: "Крепёж и документация", note: "Ведомость и инструкция — по спецификации" },
];
export const separate = ["Основание и подготовка участка", "Доставка и разгрузка", "Монтаж и покраска", "Электрика, вода и канализация"];
export const faq = [
  ["Можно ли жить в таком доме зимой?", "Базовая линейка — сезонные дома из одинарного мини-бруса. Для зимнего проживания нужна отдельно спроектированная утеплённая конструкция. Одного утепления пола и крыши недостаточно."],
  ["Что входит в стоимость?", "Цена пока не утверждена. Точный состав материалов и работ фиксируется в спецификации выбранного дома. Доставка, разгрузка, основание и монтаж должны быть явно включены или рассчитаны отдельно."],
  ["Какой нужен фундамент?", "Основание подбирается по проекту и условиям участка. Для расчёта потребуются место установки и доступные сведения о грунте. Отсутствие капитального фундамента не обещаем."],
  ["Кто организует разгрузку?", "Способ разгрузки согласуется до отгрузки. Он зависит от размеров упаковки, транспорта и подъезда к участку; стоимость указывается отдельно."],
  ["Можно ли собрать комплект самостоятельно?", "Можно выбрать поставку комплекта для самостоятельной сборки. Состав документации, необходимые инструменты и формат поддержки нужно согласовать до заказа."],
  ["Какие гарантийные условия и уход?", "Гарантийные условия должны быть закреплены в договоре, рекомендации по защитной обработке и уходу — в документации к дому. Конкретные сроки ещё не утверждены."],
];
export const siteConfig = { endpoint: process.env.NEXT_PUBLIC_LEAD_ENDPOINT || null, policyUrl: process.env.NEXT_PUBLIC_PRIVACY_URL || null, siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null };


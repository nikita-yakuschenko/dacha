export type Format = "kit" | "assembly" | "help";
export type ProjectId = string;
export type Project = { slug: string; name: string; width: number; depth: number; area: number; description: string; prices: { kit: number; assembly: number }; terracePrices: { kit: number; assembly: number }; plan: string | null; usableArea: number | null; wallThickness: number | null; terraceArea: number | null; specification: "pending"; image: string; thumbnail: string };
// Размеры-заглушки, кроме 4×5, 4×6 и 5×6 из брифа; заменить на утверждённую линейку
const sizes: [width: number, depth: number, description: string][] = [
  [3, 4, "Минимальный домик для инструмента и отдыха."],
  [3, 5, "Компактный дом для небольшого участка."],
  [4, 4, "Квадратный план для одной комнаты."],
  [4, 5, "Небольшой дом для вашего места за городом."],
  [4, 6, "Чуть больше пространства для дачных выходных."],
  [5, 5, "Просторная комната в квадратном контуре."],
  [4, 7, "Вытянутый план для двух зон."],
  [5, 6, "Место для семьи на дачный сезон."],
  [6, 6, "Большой квадратный дом для компании."],
  [5, 8, "Длинный дом под несколько комнат."],
  [6, 7, "Простор для гостей и хранения."],
  [6, 8, "Самый большой дом в линейке."],
];
const thumbnails = ["/images/dacha-20-thumbnail.webp", "/images/dacha-24-thumbnail.webp", "/images/dacha-30-thumbnail.webp"];
// Цены-заглушки от площади; заменить на утверждённый прайс
const roundPrice = (value: number) => Math.round(value / 5000) * 5000;
const pricesFor = (area: number) => ({ kit: roundPrice(area * 19500 + 60000), assembly: roundPrice(area * 27500 + 110000) });
// Терраса-заглушка: площадка 2 м вдоль фасада
const terracePricesFor = (width: number) => ({ kit: roundPrice(width * 2 * 9000), assembly: roundPrice(width * 2 * 14000) });
// Итоговая цена варианта с учётом террасы
export const priceFor = (project: Project, format: "kit" | "assembly", terrace: boolean) => project.prices[format] + (terrace ? project.terracePrices[format] : 0);
// Терраса стоит одинаково при любом варианте; её сборка входит в стоимость сборки
export const terracePrice = (project: Project) => project.terracePrices.kit;
export const assemblyPrice = (project: Project, terrace: boolean) => project.prices.assembly - project.prices.kit + (terrace ? project.terracePrices.assembly - project.terracePrices.kit : 0);
export const formatPrice = (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)}\u00a0руб.`;
export const projects: Project[] = sizes.map(([width, depth, description], i) => ({ slug: `dacha-${width * depth}`, name: `Просто дача\u00a0${width * depth}`, width, depth, area: width * depth, description, prices: pricesFor(width * depth), terracePrices: terracePricesFor(width), plan: null, usableArea: null, wallThickness: null, terraceArea: null, specification: "pending", image: "/images/garden-concept.webp", thumbnail: thumbnails[i % thumbnails.length] }));
// Группы для фильтра плитки по площади наружного контура
export const areaGroups = [
  { id: "all", label: "Все", test: () => true },
  { id: "xs", label: "До 16 м²", test: (p: Project) => p.area <= 16 },
  { id: "s", label: "20–25 м²", test: (p: Project) => p.area >= 17 && p.area <= 25 },
  { id: "m", label: "28–36 м²", test: (p: Project) => p.area >= 26 && p.area <= 36 },
  { id: "l", label: "От 40 м²", test: (p: Project) => p.area >= 37 },
] as const;
export const formats: Record<Format, string> = { kit: "Комплект с доставкой", assembly: "Дом с монтажом", help: "Нужна помощь с выбором" };
export const specification = [
  { name: "Стены и перегородки", note: "Профилированный мини-брус по проекту" },
  { name: "Обвязка, лаги и пол", note: "Несущее основание и настил пола" },
  { name: "Крыша и кровля", note: "Стропильная система и кровельное покрытие" },
  { name: "Окна и двери", note: "Оконные и дверные блоки" },
  { name: "Крепёж и документация", note: "Крепёж, ведомость и инструкция по сборке" },
];
export const separate = ["Доставка", "Монтаж и покраска"];
export const faq = [
  ["Можно ли жить в таком доме зимой?", "Нет. Дачный дом подразумевает пребывание в тёплое время года. Если на улице непогода, можно воспользоваться обогревателем, но для пребывания в холодное время года в штатной комплектации дом не пригоден."],
  ["Что входит в стоимость комплекта?", "Комплектация включает стеновой комплект из мини-бруса, элементы стропильной системы и кровли, элементы цокольного перекрытия, окна, двери, крепёж и документацию по сборке дома. Доставка рассчитывается отдельно, дополнительно можно заказать сборку."],
  ["Можно ли собрать комплект самостоятельно?", "Да. Комплект изначально рассчитан на самостоятельную сборку или сборку лицами, не обладающими глубокими техническими знаниями и навыками в области строительства. Вся необходимая документация и инструкции прилагаются к поставке."],
  ["Какие гарантийные условия и уход?", "Гарантийные обязательства устанавливаются договором и зависят от формата поставки. Кроме того, приложения к договору содержат рекомендации и правила по эксплуатации и уходу за домом."],
];
export const siteConfig = { endpoint: process.env.NEXT_PUBLIC_LEAD_ENDPOINT || null, policyUrl: process.env.NEXT_PUBLIC_PRIVACY_URL || null, siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://dacha-prosto.ru" };


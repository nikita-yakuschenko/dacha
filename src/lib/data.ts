export type Format = "kit" | "assembly" | "help";
export type ProjectId = string;
export type ProjectExtra = { id: string; name: string; price: number; onRequest?: boolean };
export type Project = { slug: string; name: string; width: number; depth: number; area: number; description: string; prices: { kit: number; assembly: number }; terracePrices: { kit: number; assembly: number }; extras: ProjectExtra[]; plan: string; photos: string[]; usableArea: number | null; wallThickness: number | null; terraceArea: number | null; specification: "pending"; image: string; thumbnail: string };
const sizes: Record<number, { width: number; depth: number }> = {
  10: { width: 4, depth: 3 }, 16: { width: 6, depth: 3 }, 24: { width: 6, depth: 4.5 }, 25: { width: 6, depth: 4.5 },
  26: { width: 7.35, depth: 4.83 }, 27: { width: 6, depth: 5 }, 33: { width: 6, depth: 6 }, 36: { width: 8.5, depth: 3.6 },
  40: { width: 6, depth: 6 }, 43: { width: 7.9, depth: 6 }, 47: { width: 8.95, depth: 5.75 }, 50: { width: 3.38, depth: 4.3 },
};
// Специальная цена домокомплекта и стоимость сборки из прайса «НН МБ»
const offers: Record<number, { kit: number; build: number }> = {
  10: { kit: 267000, build: 89000 },
  16: { kit: 351000, build: 116000 },
  24: { kit: 491000, build: 131000 },
  25: { kit: 523000, build: 147000 },
  26: { kit: 708000, build: 197000 },
  27: { kit: 580000, build: 156000 },
  33: { kit: 723000, build: 197000 },
  36: { kit: 557000, build: 170000 },
  40: { kit: 776000, build: 230000 },
  43: { kit: 891000, build: 258000 },
  47: { kit: 822000, build: 238000 },
  50: { kit: 806000, build: 234000 },
};
// Допы из прайса, кроме сборки: она уже переключается отдельно
const extras: Record<number, { name: string; price: number }[]> = {
  10: [
    { name: "Замена фундамента на винтовые сваи", price: 77000 },
    { name: "Утепление пола", price: 43000 },
    { name: "Утепление кровли", price: 49000 },
    { name: "Замена кровли на крашенный профнастил", price: 3000 },
    { name: "Водосточная система ПВХ", price: 33000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 38000 },
  ],
  16: [
    { name: "Замена фундамента на винтовые сваи", price: 93000 },
    { name: "Утепление пола", price: 52000 },
    { name: "Утепление кровли", price: 59000 },
    { name: "Замена кровли на крашенный профнастил", price: 6000 },
    { name: "Водосточная система ПВХ", price: 41000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 38000 },
  ],
  24: [
    { name: "Замена фундамента на винтовые сваи", price: 145000 },
    { name: "Утепление пола", price: 60000 },
    { name: "Утепление кровли", price: 69000 },
    { name: "Замена кровли на крашенный профнастил", price: 11000 },
    { name: "Водосточная система ПВХ", price: 41000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 38000 },
  ],
  25: [
    { name: "Замена фундамента на винтовые сваи", price: 169000 },
    { name: "Утепление пола", price: 62000 },
    { name: "Утепление кровли", price: 68000 },
    { name: "Замена кровли на крашенный профнастил", price: 12000 },
    { name: "Водосточная система ПВХ", price: 43000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 38000 },
  ],
  26: [
    { name: "Замена фундамента на винтовые сваи", price: 178000 },
    { name: "Утепление пола", price: 65000 },
    { name: "Утепление кровли", price: 94000 },
    { name: "Замена кровли на крашенный профнастил", price: 21000 },
    { name: "Водосточная система ПВХ", price: 48000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 38000 },
  ],
  27: [
    { name: "Замена фундамента на винтовые сваи", price: 145000 },
    { name: "Утепление пола", price: 69000 },
    { name: "Утепление кровли", price: 81000 },
    { name: "Замена кровли на крашенный профнастил", price: 14000 },
    { name: "Водосточная система ПВХ", price: 41000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 38000 },
  ],
  33: [
    { name: "Замена фундамента на винтовые сваи", price: 169000 },
    { name: "Утепление пола", price: 75000 },
    { name: "Утепление кровли", price: 88000 },
    { name: "Замена кровли на крашенный профнастил", price: 17000 },
    { name: "Водосточная система ПВХ", price: 41000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 38000 },
  ],
  36: [
    { name: "Замена фундамента на винтовые сваи", price: 201000 },
    { name: "Утепление пола", price: 59000 },
    { name: "Утепление кровли", price: 71000 },
    { name: "Замена кровли на крашенный профнастил", price: 14000 },
    { name: "Водосточная система ПВХ", price: 26000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 38000 },
  ],
  40: [
    { name: "Замена фундамента на винтовые сваи", price: 187000 },
    { name: "Утепление пола", price: 73000 },
    { name: "Утепление кровли", price: 96000 },
    { name: "Замена кровли на крашенный профнастил", price: 24000 },
    { name: "Водосточная система ПВХ", price: 56000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 38000 },
  ],
  43: [
    { name: "Замена фундамента на винтовые сваи", price: 227000 },
    { name: "Утепление пола", price: 81000 },
    { name: "Утепление кровли", price: 93000 },
    { name: "Замена кровли на крашенный профнастил", price: 25000 },
    { name: "Водосточная система ПВХ", price: 50000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 38000 },
  ],
  47: [
    { name: "Замена фундамента на винтовые сваи", price: 226000 },
    { name: "Утепление пола", price: 93000 },
    { name: "Утепление кровли", price: 104000 },
    { name: "Замена кровли на крашенный профнастил", price: 26000 },
    { name: "Водосточная система ПВХ", price: 67000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 38000 },
  ],
  50: [
    { name: "Замена фундамента на винтовые сваи", price: 243000 },
    { name: "Утепление пола", price: 73000 },
    { name: "Утепление кровли", price: 90000 },
    { name: "Замена кровли на крашенный профнастил", price: 14000 },
    { name: "Водосточная система ПВХ", price: 48000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 38000 },
  ],
};
// Итоговая цена варианта с учётом террасы
export const priceFor = (project: Project, format: "kit" | "assembly", terrace: boolean) => project.prices[format] + (terrace ? project.terracePrices[format] : 0);
export const extrasTotal = (project: Project, ids: string[]) => project.extras.filter(item => ids.includes(item.id)).reduce((sum, item) => sum + item.price, 0);
// Терраса стоит одинаково при любом варианте; её сборка входит в стоимость сборки
export const terracePrice = (project: Project) => project.terracePrices.kit;
export const assemblyPrice = (project: Project, terrace: boolean) => project.prices.assembly - project.prices.kit + (terrace ? project.terracePrices.assembly - project.terracePrices.kit : 0);
export const formatAmount = (value: number) => new Intl.NumberFormat("ru-RU").format(value);
export const formatPrice = (value: number) => `${formatAmount(value)}\u00a0руб.`;
export const formatMeters = (value: number) => String(value).replace(".", ",");
export const projects: Project[] = Object.keys(offers).map(Number).sort((a, b) => a - b).map(area => {
  const size = sizes[area];
  const offer = offers[area];
  const photos = [`/images/houses/dacha-${area}-1.webp`, `/images/houses/dacha-${area}-2.webp`];
  const extraIds = ["piles", "plinth", "roof", "deck", "gutters", "windows", "cabin"];
  // Окна и аренда бытовки пока не показываем. Утепление цокольной панели в прайсе — это утепление пола.
  const hiddenExtras = new Set(["windows", "cabin"]);
  return { slug: `dacha-${area}`, name: `Просто дача\u00a0${area}`, width: size.width, depth: size.depth, area, description: "", prices: { kit: offer.kit, assembly: offer.kit + offer.build }, terracePrices: { kit: 0, assembly: 0 }, extras: [...extras[area].map((item, index) => ({ ...item, id: extraIds[index] })).filter(item => !hiddenExtras.has(item.id)), { id: "paint", name: "Заводская покраска стен", price: 0, onRequest: true }], plan: `/images/houses/dacha-${area}-plan.webp`, photos, usableArea: area, wallThickness: null, terraceArea: null, specification: "pending" as const, image: photos[0], thumbnail: photos[0] };
});
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
  { name: "Фундамент", note: "Точечные блочные опоры" },
  { name: "Стены и перегородки", note: "Профилированный мини-брус 45×135" },
  { name: "Обвязка, лаги и пол", note: "Несущее основание и настил пола" },
  { name: "Крыша", note: "Стропильная система и настил кровли" },
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
const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://dacha-prosto.ru").replace(/\/$/, "");
export const siteConfig = { endpoint: process.env.NEXT_PUBLIC_LEAD_ENDPOINT || null, policyUrl: process.env.NEXT_PUBLIC_PRIVACY_URL || null, siteUrl: configuredSiteUrl.replace(/^http:\/\/dacha-prosto\.ru/, "https://dacha-prosto.ru") };


export type Format = "kit" | "assembly" | "help";
export type ProjectId = string;
export type ProjectExtra = { id: string; name: string; price: number; onRequest?: boolean };
export type Project = { slug: string; name: string; width: number; depth: number; area: number; description: string; prices: { kit: number; assembly: number }; terracePrices: { kit: number; assembly: number }; extras: ProjectExtra[]; plan: string; photos: string[]; usableArea: number | null; wallThickness: number | null; terraceArea: number | null; specification: "pending"; image: string; thumbnail: string };
const sizes: Record<number, { width: number; depth: number }> = {
  10: { width: 4, depth: 3 }, 16: { width: 6, depth: 3 }, 24: { width: 6, depth: 4.5 }, 25: { width: 6, depth: 4.5 },
  26: { width: 7.35, depth: 4.83 }, 27: { width: 6, depth: 5 }, 33: { width: 6, depth: 6 }, 36: { width: 8.5, depth: 3.6 },
  40: { width: 6, depth: 6 }, 43: { width: 7.9, depth: 6 }, 47: { width: 8.95, depth: 5.75 }, 50: { width: 3.38, depth: 4.3 },
};
// Базовая стоимость домокомплекта и сборка из прайса «НН МБ»
const offers: Record<number, { kit: number; build: number }> = {
  10: { kit: 266000, build: 94000 },
  16: { kit: 351000, build: 122000 },
  24: { kit: 488000, build: 142000 },
  25: { kit: 513000, build: 154000 },
  26: { kit: 682000, build: 198000 },
  27: { kit: 583000, build: 173000 },
  33: { kit: 712000, build: 209000 },
  36: { kit: 543000, build: 173000 },
  40: { kit: 760000, build: 237000 },
  43: { kit: 864000, build: 261000 },
  47: { kit: 826000, build: 260000 },
  50: { kit: 786000, build: 240000 },
};
// Допы из прайса, кроме сборки: она уже переключается отдельно
const extras: Record<number, { name: string; price: number }[]> = {
  10: [
    { name: "Замена фундамента на винтовые сваи", price: 66000 },
    { name: "Утепление пола", price: 37000 },
    { name: "Утепление кровли", price: 42000 },
    { name: "Замена кровли на крашенный профнастил", price: 3000 },
    { name: "Водосточная система ПВХ", price: 28000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 32000 },
  ],
  16: [
    { name: "Замена фундамента на винтовые сваи", price: 80000 },
    { name: "Утепление пола", price: 45000 },
    { name: "Утепление кровли", price: 51000 },
    { name: "Замена кровли на крашенный профнастил", price: 5000 },
    { name: "Водосточная система ПВХ", price: 35000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 32000 },
  ],
  24: [
    { name: "Замена фундамента на винтовые сваи", price: 124000 },
    { name: "Утепление пола", price: 51000 },
    { name: "Утепление кровли", price: 59000 },
    { name: "Замена кровли на крашенный профнастил", price: 9000 },
    { name: "Водосточная система ПВХ", price: 35000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 32000 },
  ],
  25: [
    { name: "Замена фундамента на винтовые сваи", price: 145000 },
    { name: "Утепление пола", price: 53000 },
    { name: "Утепление кровли", price: 58000 },
    { name: "Замена кровли на крашенный профнастил", price: 11000 },
    { name: "Водосточная система ПВХ", price: 37000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 32000 },
  ],
  26: [
    { name: "Замена фундамента на винтовые сваи", price: 153000 },
    { name: "Утепление пола", price: 56000 },
    { name: "Утепление кровли", price: 81000 },
    { name: "Замена кровли на крашенный профнастил", price: 18000 },
    { name: "Водосточная система ПВХ", price: 41000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 32000 },
  ],
  27: [
    { name: "Замена фундамента на винтовые сваи", price: 124000 },
    { name: "Утепление пола", price: 60000 },
    { name: "Утепление кровли", price: 69000 },
    { name: "Замена кровли на крашенный профнастил", price: 12000 },
    { name: "Водосточная система ПВХ", price: 35000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 32000 },
  ],
  33: [
    { name: "Замена фундамента на винтовые сваи", price: 145000 },
    { name: "Утепление пола", price: 64000 },
    { name: "Утепление кровли", price: 75000 },
    { name: "Замена кровли на крашенный профнастил", price: 14000 },
    { name: "Водосточная система ПВХ", price: 35000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 32000 },
  ],
  36: [
    { name: "Замена фундамента на винтовые сваи", price: 172000 },
    { name: "Утепление пола", price: 50000 },
    { name: "Утепление кровли", price: 61000 },
    { name: "Замена кровли на крашенный профнастил", price: 12000 },
    { name: "Водосточная система ПВХ", price: 22000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 32000 },
  ],
  40: [
    { name: "Замена фундамента на винтовые сваи", price: 160000 },
    { name: "Утепление пола", price: 63000 },
    { name: "Утепление кровли", price: 82000 },
    { name: "Замена кровли на крашенный профнастил", price: 20000 },
    { name: "Водосточная система ПВХ", price: 48000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 32000 },
  ],
  43: [
    { name: "Замена фундамента на винтовые сваи", price: 194000 },
    { name: "Утепление пола", price: 69000 },
    { name: "Утепление кровли", price: 80000 },
    { name: "Замена кровли на крашенный профнастил", price: 21000 },
    { name: "Водосточная система ПВХ", price: 43000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 32000 },
  ],
  47: [
    { name: "Замена фундамента на винтовые сваи", price: 194000 },
    { name: "Утепление пола", price: 79000 },
    { name: "Утепление кровли", price: 89000 },
    { name: "Замена кровли на крашенный профнастил", price: 23000 },
    { name: "Водосточная система ПВХ", price: 57000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 32000 },
  ],
  50: [
    { name: "Замена фундамента на винтовые сваи", price: 209000 },
    { name: "Утепление пола", price: 62000 },
    { name: "Утепление кровли", price: 77000 },
    { name: "Замена кровли на крашенный профнастил", price: 12000 },
    { name: "Водосточная система ПВХ", price: 41000 },
    { name: "Окна «по проекту» (белые)", price: 0 },
    { name: "Аренда бытовки", price: 32000 },
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
  // В карточке остаются сборка и покраска. Остальные допы из прайса скрыты.
  const hiddenExtras = new Set(["windows", "cabin", "piles", "plinth", "roof", "deck", "gutters"]);
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


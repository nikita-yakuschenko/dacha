export type MetrikaGoal = { id: string; name: string };

const houses = [10, 16, 24, 25, 26, 27, 33, 36, 40, 43, 47, 50];

function lead(id: string, title: string): MetrikaGoal {
  return { id, name: `JS:Заявка - ${title}` };
}

function action(id: string, title: string): MetrikaGoal {
  return { id, name: `JS:Действие - ${title}` };
}

export function dachaId(kind: string, area: number | string) {
  return `${kind}_dacha_${area}`;
}

const houseKinds: [string, (house: string) => string, "lead" | "action"][] = [
  ["lead", house => `Заявка на расчёт, ${house}`, "lead"],
  ["open", house => `Открыть проект ${house}`, "action"],
  ["close", house => `Закрыть проект ${house}`, "action"],
  ["close_viewer", house => `Закрыть просмотр ${house}`, "action"],
  ["cta", house => `Оставить заявку ${house}`, "action"],
  ["open_photo_1", house => `Открыть фото 1 ${house}`, "action"],
  ["open_photo_2", house => `Открыть фото 2 ${house}`, "action"],
  ["open_plan", house => `Открыть планировку ${house}`, "action"],
  ["slide_photo_1", house => `Листать к фото 1 ${house}`, "action"],
  ["slide_photo_2", house => `Листать к фото 2 ${house}`, "action"],
  ["slide_plan", house => `Листать к планировке ${house}`, "action"],
  ["kit_open", house => `Открыть Что входит, ${house}`, "action"],
  ["kit_close", house => `Закрыть Что входит, ${house}`, "action"],
];

const switches = [
  ["assembly", "Добавить сборку"],
  ["piles", "Замена фундамента на винтовые сваи"],
  ["plinth", "Утепление пола"],
  ["roof", "Утепление кровли"],
  ["deck", "Замена кровли на крашенный профнастил"],
  ["gutters", "Водосточная система ПВХ"],
  ["paint", "Заводская покраска стен"],
] as const;

const questions = [
  ["winter", "Можно ли жить в таком доме зимой?"],
  ["contents", "Что входит в стоимость комплекта?"],
  ["self_build", "Можно ли собрать комплект самостоятельно?"],
  ["warranty", "Какие гарантийные условия и уход?"],
] as const;

export const filterGoalId = { all: "filter_all", xs: "filter_to_16", s: "filter_20_25", m: "filter_28_36", l: "filter_from_40" } as const;

export function faqGoalId(index: number, open: boolean) {
  return `faq_${questions[index][0]}_${open ? "open" : "close"}`;
}

export function switchGoalId(id: string, on: boolean) {
  return `switch_${id}_${on ? "on" : "off"}`;
}

export const metrikaGoals: MetrikaGoal[] = [
  lead("lead_page", "Заявка на расчёт на странице"),
  lead("lead_popup", "Заявка на расчёт в окне"),
  ...houses.flatMap(area => {
    const house = `Просто дача ${area}`;
    return houseKinds.map(([kind, title, type]) => type === "lead" ? lead(dachaId(kind, area), title(house)) : action(dachaId(kind, area), title(house)));
  }),
  action("lead_popup_header", "Открыть окно заявки Получить расчёт в шапке"),
  action("lead_popup_hero", "Открыть окно заявки Получить расчёт на первом экране"),
  action("lead_popup_specification", "Открыть окно заявки Обсудить комплектацию"),
  action("lead_popup_faq", "Открыть окно заявки Обсудить свой вопрос"),
  action("lead_popup_custom", "Открыть окно заявки Рассчитать мой вариант"),
  action("lead_popup_contacts", "Открыть окно заявки Получить расчёт на странице контактов"),
  action("lead_popup_close", "Закрыть окно заявки"),
  action("card_photo_1", "Показать фото 1 в карточке"),
  action("card_photo_2", "Показать фото 2 в карточке"),
  action("card_plan", "Показать планировку в карточке"),
  ...switches.flatMap(([id, name]) => [action(switchGoalId(id, true), `Включить ${name}`), action(switchGoalId(id, false), `Выключить ${name}`)]),
  ...questions.flatMap(([id, name]) => [action(faqGoalId(questions.findIndex(item => item[0] === id), true), `Открыть вопрос ${name}`), action(`faq_${id}_close`, `Закрыть вопрос ${name}`)]),
  action("filter_all", "Фильтр Все"),
  action("filter_to_16", "Фильтр До 16 м²"),
  action("filter_20_25", "Фильтр 20-25 м²"),
  action("filter_28_36", "Фильтр 28-36 м²"),
  action("filter_from_40", "Фильтр От 40 м²"),
  action("nav_projects", "Перейти к разделу Проекты"),
  action("nav_specification", "Перейти к разделу Комплектация"),
  action("nav_faq", "Перейти к разделу Вопросы и ответы"),
  action("choose_house", "Выбрать свой дом"),
  action("view_houses", "Посмотреть дома"),
  action("skip_to_content", "Перейти к содержимому"),
  action("logo_header", "Логотип в шапке"),
  action("logo_footer", "Логотип в подвале"),
];

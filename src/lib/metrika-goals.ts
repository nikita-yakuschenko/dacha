export const metrikaGoals = {
  lead_accepted: "Подтверждённое обращение",
  calculation_open: "Переход к форме расчёта",
  project_dialog: "Взаимодействие с карточкой проекта",
  project_media: "Взаимодействие с галереей проекта",
  project_option_change: "Изменение опции проекта",
  catalog_filter_change: "Изменение фильтра каталога",
} as const;

export type MetrikaGoal = keyof typeof metrikaGoals;

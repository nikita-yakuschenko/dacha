export const metrikaId = 114175449;

type MetrikaFn = ((...args: unknown[]) => void) & { a?: unknown[][] };

// Та же очередь, что ставит сам счётчик, если tag.js ещё не загрузился
function ym(): MetrikaFn {
  const host = window as Window & { ym?: MetrikaFn };
  if (!host.ym) {
    const queue = function (...args: unknown[]) { (queue.a = queue.a || []).push(args); } as MetrikaFn;
    host.ym = queue;
  }
  return host.ym;
}

export function reachGoal(name: string, params?: Record<string, string>) {
  if (params) ym()(metrikaId, "reachGoal", name, params);
  else ym()(metrikaId, "reachGoal", name);
}

export function leadGoal(form: string) {
  reachGoal(`JS:Заявка - "${form}"`);
}

export function actionGoal(action: string, params?: Record<string, string>) {
  reachGoal(`JS:Действие - "${action}"`, params);
}

export function plain(text: string) {
  return text.replaceAll("\u00a0", " ");
}

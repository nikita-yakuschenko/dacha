import type { ProjectId } from "./data";
type OpenProject = { slug: ProjectId; trigger: HTMLElement } | null;
let current: OpenProject = null;
const listeners = new Set<() => void>();
export function openProject(slug: ProjectId, trigger: HTMLElement) { current = { slug, trigger }; listeners.forEach(notify => notify()); }
export function closeProject() { current = null; listeners.forEach(notify => notify()); }
export const getOpenProject = () => current;
export const getServerProject = () => null;
export function subscribeProject(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }

import { ScrollTo } from "@/components/scroll-to";
export default function NotFound() { return <main id="main" className="container section"><h1>Такой страницы нет</h1><p>Посмотрите все проекты в каталоге.</p><ScrollTo to="projects" className="text-link" goal="view_houses">Посмотреть дома</ScrollTo></main>; }

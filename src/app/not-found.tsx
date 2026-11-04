import Link from "next/link";
export default function NotFound() { return <main id="main" className="container section"><h1>Такого проекта пока нет</h1><p>В нашей линейке три пилотных размера.</p><Link prefetch={false} className="text-link" href="/#projects">Посмотреть дома</Link></main>; }


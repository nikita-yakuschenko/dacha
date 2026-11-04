import Image from "next/image";
export function HouseImage({ priority = false, className = "", src = "/images/garden-concept.webp" }: { priority?: boolean; className?: string; caption?: string; src?: string }) {
  return <figure className={`house-figure ${className}`}><Image src={src} alt="Концептуальный образ сезонного деревянного дома в летнем саду; не утверждённый фасад модели" fill sizes="(max-width: 767px) 100vw, (max-width: 1200px) 60vw, 850px" priority={priority} fetchPriority={priority ? "high" : undefined} /></figure>;
}




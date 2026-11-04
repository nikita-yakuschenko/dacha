import Image from "next/image";
export function HouseImage({ priority = false, className = "", src = "/images/garden-concept.webp", sizes = "(max-width: 767px) 100vw, (max-width: 1200px) 60vw, 850px" }: { priority?: boolean; className?: string; caption?: string; src?: string; sizes?: string }) {
  return <figure className={`house-figure ${className}`}><Image src={src} alt="Деревянный дачный дом в саду" fill sizes={sizes} priority={priority} fetchPriority={priority ? "high" : undefined} /></figure>;
}




"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const gallery = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeImage = gallery[activeIndex] ?? gallery[0];

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  return (
    <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl border border-slate-200 bg-white p-2 min-w-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-4 min-w-0">
        {/* На мобільному — горизонтальний скрол мініатюр; на sm+ — вертикальний ряд */}
        <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible overflow-y-hidden sm:overflow-y-visible no-scrollbar pb-1 sm:pb-0 flex-shrink-0 sm:flex-shrink">
          <div className="flex flex-nowrap sm:flex-col gap-2 min-w-0 sm:min-w-[64px]">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative w-16 h-16 flex-shrink-0 rounded-lg border ${
                  index === activeIndex ? "border-[#7dd3fc]" : "border-slate-200"
                } bg-white overflow-hidden`}
              >
                <Image src={image} alt={alt} fill className="object-contain p-1" sizes="64px" />
              </button>
            ))}
          </div>
        </div>
        <div className="w-full min-w-0">
          <div className="relative h-[280px] sm:h-[360px] md:h-[440px] lg:h-[520px] w-full max-w-full rounded-lg sm:rounded-xl lg:rounded-2xl bg-white overflow-hidden">
            <div
              ref={containerRef}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              className="relative h-full w-full rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden"
              style={{
                backgroundImage: activeImage ? `url(${activeImage})` : "none",
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundRepeat: "no-repeat",
                backgroundSize: isZoomed ? "220%" : "cover",
              }}
            >
              {activeImage && (
                <Image
                  src={activeImage}
                  alt={alt}
                  fill
                  sizes="100vw"
                  className={`object-cover transition-opacity duration-200 ${
                    isZoomed ? "opacity-0" : "opacity-100"
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

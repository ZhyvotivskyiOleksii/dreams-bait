"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  image: string;
  /** На мобільному показується imageMobile, якщо задано (наприклад 1.png, 2.png…) */
  imageMobile?: string;
  title: string;
  href?: string;
};

type HeroSliderProps = {
  slides: HeroSlide[];
  ctaLabel: string;
  ctaHref: string;
};

export default function HeroSlider({ slides, ctaLabel, ctaHref }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrentIndex((index + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => goTo(currentIndex + 1), 5000);
    return () => clearInterval(interval);
  }, [currentIndex, goTo]);

  if (!slides.length) return null;

  return (
    <section className="relative h-[374px] sm:min-h-[60vh] md:min-h-[68vh] overflow-hidden bg-slate-950 text-white">
      {/* Слайди */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.image + index}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === currentIndex ? "opacity-100 z-0" : "opacity-0 z-0"
            }`}
          >
            {/* Мобільні картинки (1.png, 2.png …) — видно тільки при ширині екрана < 640px */}
            {slide.imageMobile && (
              <Image
                src={slide.imageMobile}
                alt={slide.title}
                fill
                className="object-cover object-top sm:object-center sm:hidden"
                priority={index === 0}
                sizes="100vw"
                unoptimized
              />
            )}
            {/* Десктоп або fallback */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className={`object-cover object-center ${slide.imageMobile ? "hidden sm:block" : ""}`}
              priority={index === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.4)_0%,transparent_50%)]" />

            {/* Мінімум тексту на слайді */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 pb-20 sm:pb-24">
              <div className="container mx-auto">
                {slide.href ? (
                  <Link
                    href={slide.href}
                    className="inline-block font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white hover:text-[#7dd3fc] transition-colors"
                  >
                    {slide.title}
                  </Link>
                ) : (
                  <span className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white">
                    {slide.title}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Стрілки */}
      <button
        type="button"
        onClick={() => goTo(currentIndex - 1)}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
        aria-label="Попередній слайд"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        type="button"
        onClick={() => goTo(currentIndex + 1)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
        aria-label="Наступний слайд"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Точки + CTA внизу */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center gap-4 pb-6 sm:pb-8">
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 sm:w-8 bg-[#7dd3fc]"
                  : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Слайд ${index + 1}`}
            />
          ))}
        </div>
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-black bg-[#7dd3fc] hover:bg-[#38bdf8] transition-colors text-sm sm:text-base"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}

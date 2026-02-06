import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowRight, ChevronRight, BadgeCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import BestsellersGrid from "@/components/BestsellersGrid";
import HeroSlider from "@/components/HeroSlider";
import { getBestsellersHitProducts } from "@/lib/catalogData";
import type { Locale } from "@/i18n";

function BestsellersSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 p-3 bg-white">
          <div className="aspect-square rounded-xl bg-slate-200 mb-2" />
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
          <div className="h-5 bg-slate-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

async function BestsellersSection({ locale }: { locale: Locale }) {
  const [bestsellers, t] = await Promise.all([
    getBestsellersHitProducts(locale),
    getTranslations(),
  ]);
  const toLocalePath = (path: string) => `/${locale}${path}`;
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="font-heading text-3xl md:text-4xl text-slate-800">
            {t("home.bestsellers.title")}
          </h2>
          <Link
            href={toLocalePath("/catalog/bestsellers")}
            className="text-[#7dd3fc] font-semibold hover:underline flex items-center gap-1"
          >
            {t("home.bestsellers.viewAll")}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="hidden sm:flex gap-2">
          <button type="button" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <button type="button" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="col-span-2 md:col-span-1 relative rounded-2xl overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100 p-6 flex flex-col justify-between min-h-[320px]">
          <p className="font-heading text-2xl text-slate-800 leading-tight whitespace-pre-line">
            {t("home.bestsellers.promoTitle")}
          </p>
          <Link
            href={toLocalePath("/catalog")}
            className="inline-flex items-center gap-2 bg-[#7dd3fc] text-white font-bold px-5 py-2.5 rounded-full w-fit hover:bg-[#38bdf8] transition-colors"
          >
            {t("home.bestsellers.more")}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="absolute top-4 right-4 text-4xl">❄️</div>
          <div className="absolute bottom-20 right-8 w-20 h-20 bg-orange-500 rounded-full" />
        </div>
        <div className="col-span-2 md:col-span-2 lg:col-span-5">
          <BestsellersGrid products={bestsellers} />
        </div>
      </div>
    </>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const p = typeof (params as Promise<{ locale: string }>).then === "function" ? await (params as Promise<{ locale: string }>) : (params as { locale: string });
  const locale = (p.locale ?? "en") as Locale;
  const t = await getTranslations();
  const toLocalePath = (path: string) => `/${locale}${path}`;

  const categories = [
    {
      id: "rods",
      name: t("megaMenu.categories.rods"),
      image: "/category/wendka.webp",
    },
    {
      id: "reels",
      name: t("megaMenu.categories.reels"),
      image: "/category/kolowrotek.webp",
    },
    {
      id: "lines",
      name: t("megaMenu.categories.lines"),
      image: "/category/zylki.jpg",
    },
    {
      id: "bait",
      name: t("megaMenu.categories.bait"),
      image: "/category/zenety.jpg",
    },
    {
      id: "boilie-ingredients",
      name: t("megaMenu.subcategories.boilieIngredients"),
      image: "/category/carp_boilies.png",
    },
    {
      id: "accessories",
      name: t("megaMenu.categories.accessories"),
      image: "/category/aksesoria.jpg",
    },
    {
      id: "landing-nets",
      name: t("megaMenu.subcategories.landingNets"),
      image: "/category/podbierak.jpg",
    },
    {
      id: "rod-pods",
      name: t("megaMenu.subcategories.rodPods"),
      image: "/category/rodpod.webp",
    },
    {
      id: "bite-alarms",
      name: t("megaMenu.subcategories.biteAlarms"),
      image: "/category/sygnalizator.jpg",
    },
    {
      id: "camping",
      name: t("megaMenu.categories.camping"),
      image: "/category/camping.webp",
    },
  ];

  return (
    <>
      {/* Hero — слайдер, мінімум тексту */}
      <HeroSlider
        ctaLabel={t("hero.cta")}
        ctaHref={toLocalePath("/catalog")}
        slides={[
          { image: "/hero-images/3.jpg", imageMobile: "/hero-images/1.png", title: t("hero.slide1"), href: toLocalePath("/catalog/rods") },
          { image: "/hero-images/4.jpg", imageMobile: "/hero-images/2.png", title: t("hero.slide2"), href: toLocalePath("/catalog/reels") },
          { image: "/hero-images/86825-banner_fox_suit_1920_590-kopiya-novaya.jpg", imageMobile: "/hero-images/3.png", title: t("hero.slide3"), href: toLocalePath("/catalog/bait") },
          { image: "/hero-images/baner_daiwa_1920x590-kopiya.jpg", imageMobile: "/hero-images/4.png", title: t("hero.slide4"), href: toLocalePath("/catalog/accessories") },
          { image: "/hero-images/ca700-baner_ryukzak-sr_1920h590-kopiya.jpg", imageMobile: "/hero-images/5.png", title: t("hero.slide5"), href: toLocalePath("/catalog") },
        ]}
      />

      {/* Популярні категорії */}
      <section className="py-16 bg-[#f2f4f8]">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl text-slate-800 mb-8 italic">
            {t("home.popular.title")}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={toLocalePath(`/catalog/${category.id}`)}
                className="group relative aspect-square rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Фонове зображення */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Градієнтний оверлей */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                
                {/* Текст */}
                <div className="absolute inset-0 flex items-end p-4">
                  <h3 className="font-heading text-white text-sm md:text-base leading-tight uppercase tracking-wide">
                    {category.name}
                  </h3>
                </div>
                
                {/* Hover ефект */}
                <div className="absolute inset-0 bg-[#7dd3fc]/0 group-hover:bg-[#7dd3fc]/20 transition-colors duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Хіт продажів — потоково, не блокує перший екран */}
      <section className="py-16 bg-[#f2f4f8]">
        <div className="container mx-auto px-4">
          <Suspense fallback={<BestsellersSkeleton />}>
            <BestsellersSection locale={locale} />
          </Suspense>
        </div>
      </section>

      {/* Секція про бренд — liquid glass, фон з /12.png */}
      <section className="py-16 md:py-20 bg-[#f2f4f8]">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl overflow-hidden relative min-h-[340px] md:min-h-[400px] lg:min-h-[420px]">
            {/* Фон: картинка з public/12.png */}
            <div className="absolute inset-0">
              <Image
                src="/12.png"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1200px"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/75 via-slate-900/50 to-slate-900/30" />

            {/* Контент поверх: скляна панель + кнопки */}
            <div className="relative z-10 p-6 md:p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 min-h-[340px] md:min-h-[400px] lg:min-h-[420px]">
              <div className="rounded-2xl p-6 md:p-8 lg:max-w-2xl w-full border border-white/30 bg-white/10 backdrop-blur-2xl backdrop-saturate-150">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 border border-[#7dd3fc]/50 bg-[#7dd3fc]/20 backdrop-blur-md">
                  <BadgeCheck className="w-4 h-4 shrink-0" style={{ color: "#7dd3fc" }} />
                  <span style={{ color: "#bae6fd" }} className="text-xs font-semibold uppercase tracking-wider">{t("home.partner.badge")}</span>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-white mb-3 leading-tight">
                  {t("home.partner.title")}
                </h2>
                <p className="text-white/95 text-sm md:text-base max-w-xl mb-6 leading-relaxed">
                  {t("home.partner.description")}
                </p>
                <div className="flex gap-6 md:gap-8">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-heading text-white">100%</div>
                    <div className="text-white/80 text-xs">{t("home.partner.stats.original")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-heading text-white">24/7</div>
                    <div className="text-white/80 text-xs">{t("home.partner.stats.support")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-heading text-white">2+</div>
                    <div className="text-white/80 text-xs">{t("home.partner.stats.warranty")}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 shrink-0">
                <Link
                  href={toLocalePath("/catalog/bait")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 font-bold text-base rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                  style={{ backgroundColor: "#7dd3fc", color: "#0f0f0f" }}
                >
                  {t("home.partner.primaryCta")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={toLocalePath("/about")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 font-semibold text-base rounded-xl border-2 border-white/50 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/70 transition-all duration-300"
                >
                  {t("home.partner.secondaryCta")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Акційний банер */}
      <section className="py-12 bg-[#f2f4f8]">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl overflow-hidden relative" style={{ backgroundColor: "#7dd3fc" }}>
            <div className="relative z-10 p-6 md:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-md text-center lg:text-left">
                  <span className="inline-block px-3 py-1.5 bg-black/20 rounded-full text-white text-xs font-semibold uppercase tracking-wider mb-4">
                    {t("home.promo.badge")}
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl text-white mb-4 leading-tight">
                    {t("home.promo.title")}
                  </h2>
                  <p className="text-white/90 text-base mb-6 max-w-sm">
                    {t("home.promo.discountPrefix")} <span className="font-bold text-black">-30%</span> {t("home.promo.discountSuffix")}
                  </p>
                  <div className="flex gap-3 justify-center lg:justify-start">
                    <Link href={toLocalePath("/promotions")} className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-all duration-300 hover:scale-105">
                      {t("home.promo.cta")}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                
                {/* Колаж товарів */}
                <div className="flex gap-3">
                  {[
                    { image: "/category/wendka.webp", name: t("categories.rods"), href: toLocalePath("/catalog/rods") },
                    { image: "/category/kolowrotek.webp", name: t("categories.reels"), href: toLocalePath("/catalog/reels") },
                    { image: "/category/camping.webp", name: t("categories.camping"), href: toLocalePath("/catalog/tents") },
                    { image: "/category/zenety.jpg", name: t("categories.bait"), href: toLocalePath("/catalog/baits") },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="group relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-white hover:scale-110 transition-transform duration-300"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.name}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

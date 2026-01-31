import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Award, 
  Truck, 
  Headphones, 
  Shield,
  ChevronRight,
  BadgeCheck,
  MapPin,
  Check
} from "lucide-react";
import BestsellersGrid from "@/components/BestsellersGrid";

export default function HomePage() {
  const t = useTranslations();

  const categories = [
    {
      id: "carp-rods",
      name: t("home.categories.carpRods"),
      image: "/category/wendka.webp",
    },
    {
      id: "carp-reels",
      name: t("home.categories.carpReels"),
      image: "/category/kolowrotek.webp",
    },
    {
      id: "feeder-rods",
      name: t("home.categories.feederRods"),
      image: "/category/wendka.webp",
    },
    {
      id: "feeder-reels",
      name: t("home.categories.feederReels"),
      image: "/category/kolowrotek.webp",
    },
    {
      id: "lines",
      name: t("home.categories.lines"),
      image: "/category/zylki.jpg",
    },
    {
      id: "hooks",
      name: t("home.categories.hooks"),
      image: "/category/aksesoria.jpg",
    },
    {
      id: "baits",
      name: t("home.categories.baits"),
      image: "/category/zenety.jpg",
    },
    {
      id: "accessories",
      name: t("home.categories.accessories"),
      image: "/category/aksesoria.jpg",
    },
    {
      id: "clothing",
      name: t("home.categories.clothing"),
      image: "/category/camping.webp",
    },
    {
      id: "camping",
      name: t("home.categories.camping"),
      image: "/category/camping.webp",
    },
  ];

  const bestsellers = [
    { id: "hit-1", name: t("home.bestsellers.items.hit1"), oldPrice: 20250, price: 16200, discount: 20, image: "/category/namiot.jpg" },
    { id: "hit-2", name: t("home.bestsellers.items.hit2"), oldPrice: 153, price: 115, discount: 25, image: "/category/zenety.jpg" },
    { id: "hit-3", name: t("home.bestsellers.items.hit3"), oldPrice: 16848, price: 13478, discount: 20, image: "/category/camping.webp" },
    { id: "hit-4", name: t("home.bestsellers.items.hit4"), oldPrice: 1700, price: 1275, discount: 25, image: "/category/camping.webp" },
    { id: "hit-5", name: t("home.bestsellers.items.hit5"), oldPrice: 4257, price: 3406, discount: 20, image: "/category/aksesoria.jpg" },
  ];

  return (
    <>
      {/* Hero секція */}
      <section className="relative h-[80vh] overflow-hidden bg-slate-900 text-white">
        {/* Фонове зображення */}
        <div className="absolute inset-0">
          <Image
            src="/hero-images/hero-bg.png"
            alt={t("home.hero.backgroundAlt")}
            fill
            priority
            className="object-fill object-center"
          />
        </div>

        {/* Абстрактний фон */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(125,211,252,0.25),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.18),transparent_40%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_45%,rgba(125,211,252,0.15)_60%,rgba(255,255,255,0)_100%)] opacity-70" />
        <div className="absolute inset-0 opacity-[0.07] mix-blend-soft-light [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.18)_0px,rgba(255,255,255,0.18)_1px,rgba(255,255,255,0)_2px,rgba(255,255,255,0)_4px)]" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-10 left-10 h-40 w-40 rounded-full border border-white/25" />
          <div className="absolute top-10 right-16 h-28 w-28 rounded-full border border-white/15" />
          <div className="absolute bottom-20 left-20 h-24 w-24 rounded-full border border-white/15" />
          <div className="absolute top-20 left-1/2 h-64 w-[2px] bg-white/15" />
          <div className="absolute bottom-10 right-1/3 h-[2px] w-48 bg-white/15" />
        </div>
        <div className="absolute -top-48 left-1/2 w-[720px] h-[720px] -translate-x-1/2 rounded-full bg-[#7dd3fc]/18 blur-3xl" />
        <div className="absolute -bottom-48 right-[-10%] w-[520px] h-[520px] rounded-full bg-white/10 blur-3xl" />
        

        <div className="relative z-10 container mx-auto px-4 pt-28 pb-8 lg:pt-32 lg:pb-10">
          <div className="grid lg:grid-cols-[1fr] gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left lg:max-w-3xl">

              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-4 leading-[0.92] tracking-tight">
                {t("hero.title")}
              </h1>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight gradient-text">
                {t("hero.subtitle")}
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto lg:mx-0 mb-8 font-medium">
                {t("hero.description")}
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                <div className="group flex items-center gap-3 text-white text-sm font-semibold px-5 py-2.5 rounded-full border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:bg-white/20 transition">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#7dd3fc]/20 border border-[#7dd3fc]/40">
                    <Check className="w-4 h-4 text-[#7dd3fc]" />
                  </span>
                  {t("home.hero.bullets.original")}
                </div>
                <div className="group flex items-center gap-3 text-white text-sm font-semibold px-5 py-2.5 rounded-full border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:bg-white/20 transition">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#7dd3fc]/20 border border-[#7dd3fc]/40">
                    <Check className="w-4 h-4 text-[#7dd3fc]" />
                  </span>
                  {t("home.hero.bullets.warranty")}
                </div>
                <div className="group flex items-center gap-3 text-white text-sm font-semibold px-5 py-2.5 rounded-full border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:bg-white/20 transition">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#7dd3fc]/20 border border-[#7dd3fc]/40">
                    <Check className="w-4 h-4 text-[#7dd3fc]" />
                  </span>
                  {t("home.hero.bullets.delivery")}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Популярні категорії */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl text-slate-800 mb-8 italic">
            {t("home.popular.title")}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/uk/catalog/${category.id}`}
                className="group relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
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
                  <h3 className="font-heading text-white text-sm md:text-base leading-tight uppercase tracking-wide drop-shadow-lg">
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

      {/* Хіт продажів */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Заголовок */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="font-heading text-3xl md:text-4xl text-slate-800">
                {t("home.bestsellers.title")}
              </h2>
              <Link 
                href="/uk/catalog/bestsellers" 
                className="text-[#7dd3fc] font-semibold hover:underline flex items-center gap-1"
              >
                {t("home.bestsellers.viewAll")}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden sm:flex gap-2">
              <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Контент */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Промо банер */}
            <div className="col-span-2 md:col-span-1 relative rounded-2xl overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100 p-6 flex flex-col justify-between min-h-[320px]">
              <div>
                <p className="font-heading text-2xl text-slate-800 leading-tight whitespace-pre-line">
                  {t("home.bestsellers.promoTitle")}
                </p>
              </div>
              <Link 
                href="/uk/catalog" 
                className="inline-flex items-center gap-2 bg-[#7dd3fc] text-white font-bold px-5 py-2.5 rounded-full w-fit hover:bg-[#38bdf8] transition-colors"
              >
                {t("home.bestsellers.more")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              {/* Декоративні елементи */}
              <div className="absolute top-4 right-4 text-4xl">❄️</div>
              <div className="absolute bottom-20 right-8 w-20 h-20 bg-orange-500 rounded-full" />
            </div>

            <div className="col-span-2 md:col-span-2 lg:col-span-5">
              <BestsellersGrid products={bestsellers} />
            </div>
          </div>
        </div>
      </section>

      {/* Банер партнерства */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl overflow-hidden relative" style={{ backgroundColor: "#0b1e2e" }}>
            {/* Декоративне зображення */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 hidden lg:block">
              <Image src="/hero-images/5.jpg" alt="" fill className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e2e] via-[#0b1e2e]/95 to-transparent" />
            
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="text-center lg:text-left max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: "rgba(125, 211, 252, 0.2)", border: "1px solid rgba(125, 211, 252, 0.4)" }}>
                    <BadgeCheck className="w-5 h-5" style={{ color: "#7dd3fc" }} />
                    <span style={{ color: "#bae6fd" }} className="text-sm font-semibold uppercase tracking-wider">{t("home.partner.badge")}</span>
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                    {t("home.partner.title")}
                  </h2>
                  <p className="text-white/80 text-lg max-w-xl mb-8">
                    {t("home.partner.description")}
                  </p>
                  
                  {/* Переваги */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-heading text-white mb-1">100%</div>
                      <div className="text-white/60 text-sm">{t("home.partner.stats.original")}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-heading text-white mb-1">24/7</div>
                      <div className="text-white/60 text-sm">{t("home.partner.stats.support")}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-heading text-white mb-1">2+</div>
                      <div className="text-white/60 text-sm">{t("home.partner.stats.warranty")}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Link href="/uk/catalog" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: "#7dd3fc", color: "#0f0f0f" }}>
                    {t("home.partner.primaryCta")}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/uk/about" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 hover:border-white text-white font-bold text-lg rounded-xl transition-all duration-300 hover:bg-white/10">
                    {t("home.partner.secondaryCta")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Акційний банер */}
      <section className="py-12 bg-white">
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
                    <Link href="/uk/catalog?sale=true" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-all duration-300 hover:scale-105">
                      {t("home.promo.cta")}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                
                {/* Колаж товарів */}
                <div className="flex gap-3">
                  {[
                    { image: "/category/wendka.png", name: t("categories.rods"), href: "/uk/catalog/rods" },
                    { image: "/category/kolowrotek.webp", name: t("categories.reels"), href: "/uk/catalog/reels" },
                    { image: "/category/namiot.jpg", name: t("categories.camping"), href: "/uk/catalog/tents" },
                    { image: "/category/baits.webp", name: t("categories.bait"), href: "/uk/catalog/baits" },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="group relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-white shadow-lg hover:scale-110 transition-transform duration-300"
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

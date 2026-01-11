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
  Check,
  ShoppingCart
} from "lucide-react";
import HeroSlider from "@/components/HeroSlider";

export default function HomePage() {
  const t = useTranslations();

  const categories = [
    {
      id: "carp-rods",
      name: "КАРПОВІ ВУДКИ",
      image: "/category/wendka.png",
    },
    {
      id: "carp-reels",
      name: "КАРПОВІ КОТУШКИ",
      image: "/category/kolowrotek.webp",
    },
    {
      id: "feeder-rods",
      name: "ФІДЕРНІ ВУДКИ",
      image: "/category/wendka.png",
    },
    {
      id: "feeder-reels",
      name: "ФІДЕРНІ КОТУШКИ",
      image: "/category/kolowrotek.webp",
    },
    {
      id: "spinning-rods",
      name: "СПІНІНГОВІ ВУДКИ",
      image: "/category/wendka.png",
    },
    {
      id: "spinning-reels",
      name: "СПІНІНГОВІ КОТУШКИ",
      image: "/category/kolowrotek.webp",
    },
    {
      id: "lines",
      name: "ЛЕСКИ, ШНУРИ",
      image: "/category/lead-core.png",
    },
    {
      id: "hooks",
      name: "ГАЧКИ",
      image: "/category/baits.webp",
    },
    {
      id: "baits",
      name: "ПРИМАНКИ",
      image: "/category/baits.webp",
    },
    {
      id: "accessories",
      name: "ЗИМОВЕ ОСНАЩЕННЯ",
      image: "/category/acsesoria.jpg",
    },
    {
      id: "clothing",
      name: "ОДЯГ, ВЗУТТЯ",
      image: "/category/odziezh.png",
    },
    {
      id: "camping",
      name: "ТУРИЗМ, КЕМПІНГ",
      image: "/category/namiot.jpg",
    },
  ];

  return (
    <>
      {/* Hero секція */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Слайдер фонових зображень */}
        <HeroSlider />


        {/* Контент */}
        <div className="relative z-10 container mx-auto px-4 py-32 text-center">
          <div className="max-w-5xl mx-auto">
            {/* Бейдж партнерства */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/60 backdrop-blur-sm rounded-full mb-8 animate-fade-in" style={{ border: '2px solid #5cd915' }}>
              <BadgeCheck className="w-5 h-5" style={{ color: '#5cd915' }} />
              <span className="text-white font-semibold text-sm uppercase tracking-wider">
                Офіційний партнер Carp Pro в Польщі
              </span>
              <MapPin className="w-4 h-4" style={{ color: '#5cd915' }} />
            </div>

            {/* Головний заголовок */}
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white mb-4 leading-[0.9] animate-fade-in tracking-tight">
              {t("hero.title")}
            </h1>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-8 animate-fade-in tracking-tight gradient-text" style={{ animationDelay: "0.1s" }}>
              {t("hero.subtitle")}
            </h2>
            
            {/* Опис */}
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-6 animate-fade-in font-medium" style={{ animationDelay: "0.2s" }}>
              {t("hero.description")}
            </p>

            {/* Переваги партнерства */}
            <div className="flex flex-wrap justify-center gap-8 mb-10 animate-fade-in" style={{ animationDelay: "0.25s" }}>
              <div className="flex items-center gap-2 text-white text-sm font-bold">
                <Check className="w-6 h-6" style={{ color: '#5cd915' }} />
                Оригінальна продукція
              </div>
              <div className="flex items-center gap-2 text-white text-sm font-bold">
                <Check className="w-6 h-6" style={{ color: '#5cd915' }} />
                Офіційна гарантія
              </div>
              <div className="flex items-center gap-2 text-white text-sm font-bold">
                <Check className="w-6 h-6" style={{ color: '#5cd915' }} />
                Доставка по Європі
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link 
                href="/uk/catalog" 
                className="group inline-flex items-center gap-2 px-8 py-4 text-black font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#5cd915' }}
              >
                {t("hero.cta")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/uk/about" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-xl transition-all duration-300 hover:bg-white hover:text-black">
                {t("hero.secondary")}
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Переваги - на границі hero секції */}
      <section className="relative z-30 -mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 text-center shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(92, 217, 21, 0.15)' }}>
                <Award className="w-7 h-7" style={{ color: '#5cd915' }} />
              </div>
              <h3 className="font-heading text-base text-gray-900">{t("features.quality.title")}</h3>
              <p className="text-sm text-gray-500 mt-1">Тільки оригінал</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(92, 217, 21, 0.15)' }}>
                <Truck className="w-7 h-7" style={{ color: '#5cd915' }} />
              </div>
              <h3 className="font-heading text-base text-gray-900">{t("features.delivery.title")}</h3>
              <p className="text-sm text-gray-500 mt-1">1-3 дні по Європі</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(92, 217, 21, 0.15)' }}>
                <Headphones className="w-7 h-7" style={{ color: '#5cd915' }} />
              </div>
              <h3 className="font-heading text-base text-gray-900">{t("features.support.title")}</h3>
              <p className="text-sm text-gray-500 mt-1">Завжди на зв&apos;язку</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(92, 217, 21, 0.15)' }}>
                <Shield className="w-7 h-7" style={{ color: '#5cd915' }} />
              </div>
              <h3 className="font-heading text-base text-gray-900">{t("features.warranty.title")}</h3>
              <p className="text-sm text-gray-500 mt-1">Офіційна гарантія</p>
            </div>
          </div>
        </div>
      </section>

      {/* Популярні категорії */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl text-slate-800 mb-8 italic">
            Популярні категорії
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
                <div className="absolute inset-0 bg-[#5cd915]/0 group-hover:bg-[#5cd915]/20 transition-colors duration-300" />
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
                Хіт продажів
              </h2>
              <Link 
                href="/uk/catalog/bestsellers" 
                className="text-[#5cd915] font-semibold hover:underline flex items-center gap-1"
              >
                Всі товари
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
                <p className="font-heading text-2xl text-slate-800 leading-tight">
                  ХОЧУ<br/>ТАКЕ<br/>САМЕ
                </p>
              </div>
              <Link 
                href="/uk/catalog" 
                className="inline-flex items-center gap-2 bg-[#5cd915] text-white font-bold px-5 py-2.5 rounded-full w-fit hover:bg-[#4bc010] transition-colors"
              >
                Більше
                <ArrowRight className="w-4 h-4" />
              </Link>
              {/* Декоративні елементи */}
              <div className="absolute top-4 right-4 text-4xl">❄️</div>
              <div className="absolute bottom-20 right-8 w-20 h-20 bg-orange-500 rounded-full" />
            </div>

            {/* Картки товарів */}
            {[
              { name: "Намет Carp Pro Diamond Dome 2 Man", oldPrice: 20250, price: 16200, discount: 20, image: "/category/namiot.jpg" },
              { name: "Світлячки Flagman 4.5x39мм 2шт", oldPrice: 153, price: 115, discount: 25, image: "/category/baits.webp" },
              { name: "Шатер карповий Carp Pro Maxi Shelter", oldPrice: 16848, price: 13478, discount: 20, image: "/category/namiot.jpg" },
              { name: "Парасолька рибальська Flagman", oldPrice: 1700, price: 1275, discount: 25, image: "/category/namiot.jpg" },
              { name: "Род-под Carp Pro на 3 вудки 123 DL", oldPrice: 4257, price: 3406, discount: 20, image: "/category/acsesoria.jpg" },
            ].map((product, idx) => (
              <div key={idx} className="relative bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Бейдж ХІТ */}
                <span className="absolute top-3 left-3 z-10 bg-[#5cd915] text-white text-xs font-bold px-2 py-1 rounded">
                  ХІТ
                </span>
                
                {/* Зображення */}
                <div className="h-32 relative mb-4 rounded-lg overflow-hidden bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="200px"
                    className="object-contain p-2"
                  />
                </div>
                
                {/* Назва */}
                <h3 className="text-sm text-gray-800 mb-3 line-clamp-2 min-h-[40px] font-medium">
                  {product.name}
                </h3>
                
                {/* Ціни */}
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-400 line-through text-xs">{product.oldPrice}</span>
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">-{product.discount}%</span>
                    </div>
                    <span className="text-[#5cd915] font-bold text-base">{product.price} грн</span>
                  </div>
                  <button className="w-9 h-9 rounded-full border-2 border-[#5cd915] text-[#5cd915] flex items-center justify-center hover:bg-[#5cd915] hover:text-white transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Банер партнерства */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl overflow-hidden relative" style={{ backgroundColor: '#1a2e1a' }}>
            {/* Декоративне зображення */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 hidden lg:block">
              <Image src="/hero-images/5.jpg" alt="" fill className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e1a] via-[#1a2e1a]/95 to-transparent" />
            
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="text-center lg:text-left max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(92, 217, 21, 0.2)', border: '1px solid rgba(92, 217, 21, 0.4)' }}>
                    <BadgeCheck className="w-5 h-5" style={{ color: '#5cd915' }} />
                    <span style={{ color: '#8cff47' }} className="text-sm font-semibold uppercase tracking-wider">Офіційний дистриб&apos;ютор</span>
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                    CARP PRO — ЯКІСТЬ БЕЗ КОМПРОМІСІВ
                  </h2>
                  <p className="text-white/80 text-lg max-w-xl mb-8">
                    Ми є офіційним партнером компанії Carp Pro в Польщі. Гарантуємо 100% оригінальну продукцію, 
                    офіційну гарантію та сервісне обслуговування.
                  </p>
                  
                  {/* Переваги */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-heading text-white mb-1">100%</div>
                      <div className="text-white/60 text-sm">Оригінал</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-heading text-white mb-1">24/7</div>
                      <div className="text-white/60 text-sm">Підтримка</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-heading text-white mb-1">2+</div>
                      <div className="text-white/60 text-sm">Роки гарантії</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Link href="/uk/catalog" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#5cd915', color: '#0f0f0f' }}>
                    Переглянути каталог
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/uk/about" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 hover:border-white text-white font-bold text-lg rounded-xl transition-all duration-300 hover:bg-white/10">
                    Про партнерство
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
          <div className="rounded-2xl overflow-hidden relative" style={{ backgroundColor: '#5cd915' }}>
            <div className="relative z-10 p-6 md:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-md text-center lg:text-left">
                  <span className="inline-block px-3 py-1.5 bg-black/20 rounded-full text-white text-xs font-semibold uppercase tracking-wider mb-4">
                    🎣 Сезон відкрито
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl text-white mb-4 leading-tight">
                    ГОТОВИЙ ДО СЕЗОНУ?
                  </h2>
                  <p className="text-white/90 text-base mb-6 max-w-sm">
                    Знижки до <span className="font-bold text-black">-30%</span> на топові бренди!
                  </p>
                  <div className="flex gap-3 justify-center lg:justify-start">
                    <Link href="/uk/catalog?sale=true" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-all duration-300 hover:scale-105">
                      Дивитись акції
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                
                {/* Колаж товарів */}
                <div className="flex gap-3">
                  {[
                    { image: "/category/wendka.png", name: "Вудки", href: "/uk/catalog/rods" },
                    { image: "/category/kolowrotek.webp", name: "Котушки", href: "/uk/catalog/reels" },
                    { image: "/category/namiot.jpg", name: "Намети", href: "/uk/catalog/tents" },
                    { image: "/category/baits.webp", name: "Приманки", href: "/uk/catalog/baits" },
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

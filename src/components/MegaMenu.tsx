"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { 
  X, 
  ChevronRight, 
  Fish,
} from "lucide-react";
import clsx from "clsx";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: { name: string; slug: string }[];
  topProducts: { name: string; image: string; price: number; href: string }[];
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<string>("rods");

  const categories: Category[] = [
    { 
      id: "rods", 
      name: "Вудки",
      image: "/category/wendka.png",
      subcategories: [
        { name: "Карпові вудки", slug: "carp-rods" },
        { name: "Фідерні вудки", slug: "feeder-rods" },
        { name: "Спінінги", slug: "spinning" },
        { name: "Телескопічні", slug: "telescopic" },
        { name: "Матчеві", slug: "match" },
      ],
      topProducts: [
        { name: "Carp Pro D-Carp 3.9m", image: "/category/wendka.png", price: 2850, href: "/uk/product/1" },
        { name: "Shimano Alivio 3.6m", image: "/category/wendka.png", price: 1950, href: "/uk/product/2" },
        { name: "Fox Horizon X4", image: "/category/wendka.png", price: 4200, href: "/uk/product/3" },
      ]
    },
    { 
      id: "reels", 
      name: "Котушки",
      image: "/category/kolowrotek.webp",
      subcategories: [
        { name: "Карпові котушки", slug: "carp-reels" },
        { name: "Фідерні котушки", slug: "feeder-reels" },
        { name: "Спінінгові котушки", slug: "spinning-reels" },
        { name: "Байтранери", slug: "baitrunner" },
      ],
      topProducts: [
        { name: "Shimano Ultegra 5500", image: "/category/kolowrotek.webp", price: 3250, href: "/uk/product/4" },
        { name: "Daiwa Black Widow", image: "/category/kolowrotek.webp", price: 1850, href: "/uk/product/5" },
        { name: "Carp Pro Blackpool", image: "/category/kolowrotek.webp", price: 1450, href: "/uk/product/6" },
      ]
    },
    { 
      id: "lines", 
      name: "Волосінь та шнури",
      image: "/category/lead-core.png",
      subcategories: [
        { name: "Монофільна волосінь", slug: "mono" },
        { name: "Плетений шнур", slug: "braided" },
        { name: "Флюорокарбон", slug: "fluoro" },
        { name: "Лідкор", slug: "leadcore" },
      ],
      topProducts: [
        { name: "Carp Pro Line 0.30mm", image: "/category/lead-core.png", price: 320, href: "/uk/product/7" },
        { name: "Fox Camotex 25lb", image: "/category/lead-core.png", price: 450, href: "/uk/product/8" },
        { name: "Korda Touchdown", image: "/category/lead-core.png", price: 380, href: "/uk/product/9" },
      ]
    },
    { 
      id: "bait", 
      name: "Прикормки та насадки",
      image: "/category/baits.webp",
      subcategories: [
        { name: "Бойли", slug: "boilies" },
        { name: "Пелети", slug: "pellets" },
        { name: "Прикормки", slug: "groundbait" },
        { name: "Pop-up", slug: "popup" },
      ],
      topProducts: [
        { name: "Starbaits SK30 20mm", image: "/category/baits.webp", price: 280, href: "/uk/product/10" },
        { name: "CCMoore Live System", image: "/category/baits.webp", price: 320, href: "/uk/product/11" },
        { name: "Dynamite Baits", image: "/category/baits.webp", price: 195, href: "/uk/product/12" },
      ]
    },
    { 
      id: "accessories", 
      name: "Аксесуари",
      image: "/category/acsesoria.jpg",
      subcategories: [
        { name: "Підсаки", slug: "landing-nets" },
        { name: "Родподи", slug: "rod-pods" },
        { name: "Сигналізатори", slug: "bite-alarms" },
        { name: "Гачки", slug: "hooks" },
      ],
      topProducts: [
        { name: "Fox RX+ 3 Rod Set", image: "/category/acsesoria.jpg", price: 8500, href: "/uk/product/13" },
        { name: "Carp Pro Landing Net", image: "/category/acsesoria.jpg", price: 1250, href: "/uk/product/14" },
        { name: "Nash Siren S5R", image: "/category/acsesoria.jpg", price: 2100, href: "/uk/product/15" },
      ]
    },
    { 
      id: "clothing", 
      name: "Одяг та взуття",
      image: "/category/odziezh.png",
      subcategories: [
        { name: "Куртки", slug: "jackets" },
        { name: "Штани", slug: "pants" },
        { name: "Термобілизна", slug: "thermal" },
        { name: "Взуття", slug: "footwear" },
      ],
      topProducts: [
        { name: "Fox Chunk Jacket", image: "/category/odziezh.png", price: 2450, href: "/uk/product/16" },
        { name: "Nash ZT Boots", image: "/category/odziezh.png", price: 1850, href: "/uk/product/17" },
        { name: "Carp Pro Thermal", image: "/category/odziezh.png", price: 980, href: "/uk/product/18" },
      ]
    },
    { 
      id: "camping", 
      name: "Кемпінг",
      image: "/category/namiot.jpg",
      subcategories: [
        { name: "Намети", slug: "tents" },
        { name: "Розкладачки", slug: "bedchairs" },
        { name: "Спальники", slug: "sleeping-bags" },
        { name: "Крісла", slug: "chairs" },
      ],
      topProducts: [
        { name: "Carp Pro Diamond Dome", image: "/category/namiot.jpg", price: 16200, href: "/uk/product/19" },
        { name: "Fox EOS 2 Bivvy", image: "/category/namiot.jpg", price: 12500, href: "/uk/product/20" },
        { name: "Nash Indulgence SS4", image: "/category/namiot.jpg", price: 8900, href: "/uk/product/21" },
      ]
    },
    { 
      id: "electronics", 
      name: "Електроніка",
      image: "/category/signal.jpg",
      subcategories: [
        { name: "Ехолоти", slug: "fish-finders" },
        { name: "Кораблики", slug: "bait-boats" },
        { name: "Рації", slug: "radios" },
        { name: "Ліхтарі", slug: "lights" },
      ],
      topProducts: [
        { name: "Deeper Pro+", image: "/category/signal.jpg", price: 7500, href: "/uk/product/22" },
        { name: "Carp Pro Boat", image: "/category/signal.jpg", price: 15800, href: "/uk/product/23" },
        { name: "Ridgemonkey Headtorch", image: "/category/signal.jpg", price: 950, href: "/uk/product/24" },
      ]
    },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const activeData = categories.find(c => c.id === activeCategory);

  return (
    <>
      {/* Оверлей */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Панель меню */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full w-full max-w-5xl bg-white z-50 shadow-2xl transition-transform duration-500 ease-out flex",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Ліва колонка - Категорії */}
        <div className="w-80 bg-slate-900 flex flex-col">
          {/* Шапка */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#5cd915' }}>
                  <Fish className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-heading text-xl text-white">КАТАЛОГ</span>
                  <div className="text-[10px] font-medium tracking-wider" style={{ color: '#5cd915' }}>ТОВАРІВ</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Список категорій */}
          <nav className="flex-1 overflow-y-auto py-2">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onMouseEnter={() => setActiveCategory(category.id)}
                  onClick={() => setActiveCategory(category.id)}
                  className={clsx(
                    "w-full flex items-center justify-between px-4 py-3 transition-all duration-200",
                    isActive 
                      ? "bg-white text-slate-900" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-semibold text-sm">{category.name}</span>
                  </div>
                  <ChevronRight className={clsx(
                    "w-4 h-4 transition-transform",
                    isActive ? "translate-x-1" : ""
                  )} style={{ color: isActive ? '#5cd915' : undefined }} />
                </button>
              );
            })}
          </nav>

          {/* Нижні посилання */}
          <div className="p-4 border-t border-white/10 space-y-1">
            <Link
              href={`/${locale}/about`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
            >
              Про нас
            </Link>
            <Link
              href={`/${locale}/contact`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
            >
              Контакти
            </Link>
          </div>
        </div>

        {/* Права колонка - Підкатегорії */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {activeData && (
            <>
              {/* Заголовок з картинкою */}
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={activeData.image}
                  alt={activeData.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/60" />
                <div className="absolute inset-0 flex items-center px-8">
                  <h2 className="font-heading text-3xl text-white">
                    {activeData.name}
                  </h2>
                </div>
              </div>

              {/* Контент */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Підкатегорії */}
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {activeData.subcategories.map((sub, index) => (
                    <Link
                      key={index}
                      href={`/${locale}/catalog/${sub.slug}`}
                      onClick={onClose}
                      className="group flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-200"
                    >
                      <span className="text-slate-700 group-hover:text-slate-900 font-medium text-sm">
                        {sub.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-all" style={{ color: '#5cd915' }} />
                    </Link>
                  ))}
                </div>

                {/* Топ продажів */}
                <div>
                  <h3 className="font-heading text-lg text-slate-800 mb-4 flex items-center gap-2">
                    🔥 Топ продажів
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {activeData.topProducts.map((product, index) => (
                      <Link
                        key={index}
                        href={product.href}
                        onClick={onClose}
                        className="group bg-white border border-slate-200 rounded-xl p-3 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 mb-3">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={150}
                            height={150}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="text-sm text-slate-700 font-medium line-clamp-2 mb-2 min-h-[40px]">
                          {product.name}
                        </h4>
                        <div className="font-bold" style={{ color: '#5cd915' }}>
                          {product.price} грн
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

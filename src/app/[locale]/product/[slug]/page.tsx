import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createTranslator } from "use-intl/core";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import {
  getCategoryBySlug,
  getProductBySlugOrId,
  getProductsByCategory,
  getProductSlugs,
} from "@/lib/catalogData";
import ProductGallery from "@/components/ProductGallery";
import FavoriteButton from "@/components/FavoriteButton";
import ProductDescription from "@/components/ProductDescription";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import ShareButton from "@/components/ShareButton";
import ProductPurchaseActions from "@/components/ProductPurchaseActions";
import { locales, type Locale } from "@/i18n";

type ProductPageProps = {
  params: { slug: string; locale: Locale };
};

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale } = params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages });
  const product = await getProductBySlugOrId(params.slug);

  if (!product) {
    notFound();
  }

  const [category, categoryProducts] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getProductsByCategory(product.categorySlug),
  ]);
  const related = (categoryProducts ?? []).filter((item) => item.id !== product.id);
  const gallery = product.gallery.length
    ? product.gallery
    : [product.image];
  const galleryImages =
    gallery[0] === product.image ? gallery : [product.image, ...gallery];

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const detailsTitle = {
    uk: "Характеристики і опис",
    pl: "Specyfikacja i opis",
    en: "Specs & description",
  } as const;
  const moreLabel = {
    uk: "Докладніше",
    pl: "Więcej",
    en: "Read more",
  } as const;
  const lessLabel = {
    uk: "Згорнути",
    pl: "Zwiń",
    en: "Show less",
  } as const;
  const productDescription = product.description?.[locale];
  const availableQty =
    typeof product.stockCount === "number"
      ? product.stockCount - (typeof product.purchasedCount === "number" ? product.purchasedCount : 0)
      : null;
  const inStock = availableQty === null || availableQty > 0;
  const paymentMethods = [
    { label: "Visa", src: "/paymant/visa.svg" },
    { label: "Mastercard", src: "/paymant/mastercard.svg" },
    { label: "BLIK", src: "/paymant/blik.svg" },
    { label: "Apple Pay", src: "/paymant/icons8-apple-pay-100.png" },
    { label: "Google Pay", src: "/paymant/google-pay-96.png" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-0 pb-16 min-w-0 overflow-x-hidden">
      <div className="container mx-auto px-4 w-full max-w-[100vw] min-w-0">
        <BreadcrumbsBar
          items={[
            {
              label: t("breadcrumbs.home"),
              href: `/${locale}`,
              isHome: true,
            },
            {
              label: t("breadcrumbs.catalog"),
            },
            ...(category
              ? [
                  {
                    label: t(category.titleKey),
                    href: `/${locale}/catalog/${category.slug}`,
                  },
                ]
              : []),
            {
              label: product.name[locale],
            },
          ]}
        />

        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] min-w-0">
          <div className="space-y-6 min-w-0">
            <ProductGallery
              images={galleryImages}
              alt={product.name[locale]}
            />

            {productDescription && (
              <ProductDescription
                title={detailsTitle[locale]}
                description={productDescription}
                moreLabel={moreLabel[locale]}
                lessLabel={lessLabel[locale]}
              />
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 min-w-0">
            <div className="flex items-start justify-between gap-3 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-heading text-slate-900 break-words min-w-0 flex-1">
              {product.name[locale]}
            </h1>
            <Suspense fallback={null}>
              <FavoriteButton
                ariaLabel={t("productPage.favorites")}
                item={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name[locale],
                  image: product.image,
                  price: product.price,
                  categorySlug: product.categorySlug,
                }}
                className="w-10 h-10 rounded-full border-0 bg-transparent flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors pointer-events-auto cursor-pointer"
                iconClassName="w-5 h-5 mx-auto"
              />
            </Suspense>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <span>{t("productPage.productCode")}</span>
              <span className="font-medium text-slate-700">{product.code}</span>
            </div>

            <div
              className={`mt-3 inline-flex items-center gap-2 text-sm font-medium ${
                inStock ? "text-emerald-600" : "text-rose-500"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {inStock ? t("productPage.readyToShip") : t("productPage.outOfStock")}
            </div>

            <div className="mt-4 border-t border-slate-200" />

            <div className="mt-4 flex items-end justify-between gap-3">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-black">
                  {product.price} {t("currency.uah")}
                </span>
                {product.oldPrice && (
                  <div className="text-sm text-slate-400">
                    <span className="line-through">
                      {product.oldPrice} {t("currency.uah")}
                    </span>
                    {discount > 0 && (
                      <span className="ml-2 text-red-500 font-semibold">
                        -{discount}%
                      </span>
                    )}
                  </div>
                )}
              </div>
              <ShareButton
                label={t("productPage.share")}
                copiedLabel={t("productPage.copied")}
              />
            </div>

            <div className="mt-2 text-sm text-slate-500">
              {t("productPage.discountEnds", { days: 36 })}
            </div>

            <ProductPurchaseActions
              product={{
                id: product.id,
                name: product.name[locale],
                price: product.price,
                image: product.image,
              }}
              addLabel={t("productPage.buy")}
              buyNowLabel={t("productPage.buyNow")}
              cartUrl={`/${locale}/cart`}
              isDisabled={!inStock}
            />

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-800">
                {t("productPage.paymentTitle")}
              </div>
              <div className="mt-3 flex flex-nowrap items-center justify-between gap-1 sm:gap-2">
                {paymentMethods.map((item) => (
                  <span
                    key={item.label}
                    className="flex-1 min-w-0 flex items-center justify-center rounded-full bg-white py-1.5 px-1 sm:py-2 sm:px-3"
                  >
                    <span className="relative h-5 w-9 sm:h-6 sm:w-11 lg:h-7 lg:w-14">
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        sizes="(max-width: 640px) 36px, (max-width: 1024px) 44px, 56px"
                        className="object-contain"
                      />
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start gap-3 text-sm font-semibold text-slate-800">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div className="flex flex-col">
                    <span>{t("productPage.warrantyTitle")}</span>
                    <span className="text-xs text-slate-500 mt-1">
                      {t("productPage.warrantyText")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start gap-3 text-sm font-semibold text-slate-800">
                  <span className="icon-usp-freedelivery-lg mt-0.5" aria-hidden="true" />
                  <div className="flex flex-col">
                    <span>{t("productPage.freeDeliveryTitle")}</span>
                    <span className="text-xs text-slate-500 mt-1">
                      {t("productPage.freeDeliveryText", { amount: 200 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-heading text-slate-900 mb-4">
              {t("megaMenu.topSales")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/product/${item.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 p-4 transition-all"
                >
                  <div className="relative h-40 rounded-xl bg-slate-50 overflow-hidden mb-3">
                    <Image
                      src={item.image}
                      alt={item.name[locale]}
                      fill
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px]">
                    {item.name[locale]}
                  </div>
                  <div className="mt-2 text-black font-bold">
                    {item.price} {t("currency.uah")}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import {
  getCategoryBySlug,
  getProductBySlugOrId,
  getProductsByCategory,
} from "@/lib/catalogData";
import ProductGallery from "@/components/ProductGallery";
import FavoriteButton from "@/components/FavoriteButton";
import ProductDescription from "@/components/ProductDescription";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import ShareButton from "@/components/ShareButton";
import ProductPurchaseActions from "@/components/ProductPurchaseActions";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: { slug: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const locale = (await getLocale()) as "uk" | "pl" | "en";
  const t = await getTranslations();
  const product = await getProductBySlugOrId(params.slug);

  if (!product) {
    notFound();
  }

  const category = await getCategoryBySlug(product.categorySlug);
  const related = (await getProductsByCategory(product.categorySlug)).filter(
    (item) => item.id !== product.id
  );
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
  const inStock =
    typeof product.stockCount === "number" &&
    typeof product.purchasedCount === "number"
      ? product.purchasedCount < product.stockCount
      : true;
  const paymentMethods = [
    { label: "Visa", src: "/paymant/visa.svg" },
    { label: "Mastercard", src: "/paymant/mastercard.svg" },
    { label: "BLIK", src: "/paymant/blik.svg" },
    { label: "Apple Pay", src: "/paymant/icons8-apple-pay-100.png" },
    { label: "Google Pay", src: "/paymant/google-pay-96.png" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-14 sm:pt-28 pb-16">
      <div className="container mx-auto px-4">
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

        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
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

          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-heading text-slate-900">
                {product.name[locale]}
              </h1>
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
                className="w-10 h-10 rounded-full border-0 bg-transparent shadow-none flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors pointer-events-auto cursor-pointer"
                iconClassName="w-5 h-5 mx-auto"
              />
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
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {paymentMethods.map((item) => (
                  <span
                    key={item.label}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm"
                  >
                    <span className="relative h-7 w-16">
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        sizes="64px"
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
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-xl transition-all"
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

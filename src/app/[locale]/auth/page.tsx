"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

function AuthPageContent() {
  const t = useTranslations("auth");
  const commonT = useTranslations("common");
  const breadcrumbsT = useTranslations("breadcrumbs");
  const navT = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const modeParam = searchParams.get("mode");
  const returnToParam = searchParams.get("returnTo");
  const safeReturnTo =
    returnToParam &&
    (returnToParam === `/${locale}` || returnToParam.startsWith(`/${locale}/`))
      ? returnToParam
      : null;

  useEffect(() => {
    if (modeParam === "login" || modeParam === "register") {
      setMode(modeParam);
    }
  }, [modeParam]);

  const countries = [
    { value: "albania", label: t("countries.albania") },
    { value: "andorra", label: t("countries.andorra") },
    { value: "armenia", label: t("countries.armenia") },
    { value: "austria", label: t("countries.austria") },
    { value: "azerbaijan", label: t("countries.azerbaijan") },
    { value: "belarus", label: t("countries.belarus") },
    { value: "belgium", label: t("countries.belgium") },
    { value: "bosniaHerzegovina", label: t("countries.bosniaHerzegovina") },
    { value: "bulgaria", label: t("countries.bulgaria") },
    { value: "croatia", label: t("countries.croatia") },
    { value: "cyprus", label: t("countries.cyprus") },
    { value: "czechia", label: t("countries.czechia") },
    { value: "denmark", label: t("countries.denmark") },
    { value: "estonia", label: t("countries.estonia") },
    { value: "finland", label: t("countries.finland") },
    { value: "france", label: t("countries.france") },
    { value: "georgia", label: t("countries.georgia") },
    { value: "germany", label: t("countries.germany") },
    { value: "greece", label: t("countries.greece") },
    { value: "hungary", label: t("countries.hungary") },
    { value: "iceland", label: t("countries.iceland") },
    { value: "ireland", label: t("countries.ireland") },
    { value: "italy", label: t("countries.italy") },
    { value: "kosovo", label: t("countries.kosovo") },
    { value: "latvia", label: t("countries.latvia") },
    { value: "liechtenstein", label: t("countries.liechtenstein") },
    { value: "lithuania", label: t("countries.lithuania") },
    { value: "luxembourg", label: t("countries.luxembourg") },
    { value: "malta", label: t("countries.malta") },
    { value: "moldova", label: t("countries.moldova") },
    { value: "monaco", label: t("countries.monaco") },
    { value: "montenegro", label: t("countries.montenegro") },
    { value: "netherlands", label: t("countries.netherlands") },
    { value: "northMacedonia", label: t("countries.northMacedonia") },
    { value: "norway", label: t("countries.norway") },
    { value: "poland", label: t("countries.poland") },
    { value: "portugal", label: t("countries.portugal") },
    { value: "romania", label: t("countries.romania") },
    { value: "russia", label: t("countries.russia") },
    { value: "sanMarino", label: t("countries.sanMarino") },
    { value: "serbia", label: t("countries.serbia") },
    { value: "slovakia", label: t("countries.slovakia") },
    { value: "slovenia", label: t("countries.slovenia") },
    { value: "spain", label: t("countries.spain") },
    { value: "sweden", label: t("countries.sweden") },
    { value: "switzerland", label: t("countries.switzerland") },
    { value: "turkey", label: t("countries.turkey") },
    { value: "ukraine", label: t("countries.ukraine") },
    { value: "unitedKingdom", label: t("countries.unitedKingdom") },
    { value: "vatican", label: t("countries.vatican") },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const emailValue = email.trim();
    const passwordValue = password.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    if (!emailValid) {
      setError(t("validation.email"));
      setLoading(false);
      return;
    }

    if (!passwordValue) {
      setError(t("validation.passwordRequired"));
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: emailValue, password: passwordValue });
      if (signInError) {
        setError(signInError.message);
      } else {
        router.push(safeReturnTo ?? `/${locale}/account`);
      }
    } else {
      if (!firstName.trim()) {
        setError(t("validation.firstName"));
        setLoading(false);
        return;
      }
      if (!lastName.trim()) {
        setError(t("validation.lastName"));
        setLoading(false);
        return;
      }
      if (!phone.trim()) {
        setError(t("validation.phone"));
        setLoading(false);
        return;
      }
      if (!country.trim()) {
        setError(t("validation.country"));
        setLoading(false);
        return;
      }
      if (!address.trim()) {
        setError(t("validation.address"));
        setLoading(false);
        return;
      }
      if (!postalCode.trim()) {
        setError(t("validation.postalCode"));
        setLoading(false);
        return;
      }
      if (!city.trim()) {
        setError(t("validation.city"));
        setLoading(false);
        return;
      }
      if (passwordValue.length < 8) {
        setError(t("validation.passwordLength"));
        setLoading(false);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: emailValue,
        password: passwordValue,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            country: country.trim(),
            address: address.trim(),
            postal_code: postalCode.trim(),
            city: city.trim(),
          },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            email: emailValue,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            country: country.trim(),
            address: address.trim(),
            postal_code: postalCode.trim(),
            city: city.trim(),
            favorites: [],
          });
        }
        router.push(safeReturnTo ?? `/${locale}/account`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-0 pb-16">
      <div className="container mx-auto px-4">
        <BreadcrumbsBar
          items={[
            {
              label: breadcrumbsT("home"),
              href: `/${locale}`,
              isHome: true,
            },
            {
              label: navT("auth"),
            },
          ]}
        />
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-heading mb-2">{t("title")}</h1>
            <p className="text-slate-500 text-sm">{t("subtitle")}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
                mode === "login" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {t("login")}
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
                mode === "register" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {t("register")}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-2xl p-6">
            {mode === "register" && (
              <>
                <label className="block text-sm font-medium text-slate-700">
                  {t("firstName")} <span className="text-red-500">*</span>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  {t("lastName")} <span className="text-red-500">*</span>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  {t("phone")} <span className="text-red-500">*</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  {t("country")} <span className="text-red-500">*</span>
                  <div className="relative mt-2">
                    <select
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm bg-white"
                    >
                      <option value="">{t("countryPlaceholder")}</option>
                      {countries.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  </div>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  {t("address")} <span className="text-red-500">*</span>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  {t("postalCode")} <span className="text-red-500">*</span>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  {t("city")} <span className="text-red-500">*</span>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
              </>
            )}
            <label className="block text-sm font-medium text-slate-700">
              {t("email")} <span className="text-red-500">*</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </label>
            <label className="block text-sm font-medium text-slate-700">
              {t("password")} <span className="text-red-500">*</span>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#7dd3fc] text-black font-semibold py-2 hover:bg-[#f5c542] transition-colors disabled:opacity-60"
        >
          {loading ? commonT("loading") : mode === "login" ? t("login") : t("register")}
        </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            <Link href={`/${locale}`}>{t("backToSite")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}

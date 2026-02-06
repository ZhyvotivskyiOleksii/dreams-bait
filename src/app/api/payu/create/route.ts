import { NextResponse } from "next/server";

type CartItemPayload = {
  name: string;
  price: number;
  qty: number;
};

const getBaseUrl = (request: Request) => {
  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  if (!host) return "";
  return `${proto}://${host}`;
};

const getClientIp = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const first = forwarded.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "127.0.0.1";
};

const toMinor = (value: number) => Math.round(value * 100);

const getPayuConfig = () => {
  const posId = process.env.PAYU_POS_ID;
  const clientId = process.env.PAYU_CLIENT_ID;
  const clientSecret = process.env.PAYU_CLIENT_SECRET;
  const env = process.env.PAYU_ENV ?? "production";
  const currency = process.env.PAYU_CURRENCY ?? "PLN";
  const baseUrl =
    env === "sandbox" ? "https://secure.snd.payu.com" : "https://secure.payu.com";

  if (!posId || !clientId || !clientSecret) {
    return null;
  }

  return { posId, clientId, clientSecret, baseUrl, currency };
};

export async function POST(request: Request) {
  const config = getPayuConfig();
  if (!config) {
    return NextResponse.json({ error: "PAYU_CONFIG_MISSING" }, { status: 500 });
  }

  const payload = await request.json().catch(() => null);
  const items = Array.isArray(payload?.items) ? (payload.items as CartItemPayload[]) : [];
  const locale = typeof payload?.locale === "string" ? payload.locale : "uk";
  const buyerEmail = typeof payload?.email === "string" ? payload.email : undefined;

  const sanitized = items
    .filter((item) => item && item.qty > 0 && item.price > 0)
    .map((item) => ({
      name: item.name?.slice(0, 127) || "Product",
      unitPrice: toMinor(item.price),
      quantity: item.qty,
    }));

  if (sanitized.length === 0) {
    return NextResponse.json({ error: "EMPTY_CART" }, { status: 400 });
  }

  const totalAmount = sanitized.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const baseUrl = getBaseUrl(request);
  const notifyUrl = baseUrl ? `${baseUrl}/api/payu/notify` : undefined;

  const tokenResponse = await fetch(
    `${config.baseUrl}/pl/standard/user/oauth/authorize`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }).toString(),
    }
  );

  const tokenData = await tokenResponse.json().catch(() => null);
  if (!tokenResponse.ok || !tokenData?.access_token) {
    return NextResponse.json(
      { error: "PAYU_TOKEN_FAILED", details: tokenData },
      { status: 502 }
    );
  }

  const orderPayload = {
    ...(notifyUrl ? { notifyUrl } : {}),
    customerIp: getClientIp(request),
    merchantPosId: config.posId,
    description: "Dreams Bait order",
    currencyCode: config.currency,
    totalAmount: totalAmount.toString(),
    extOrderId: `db-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    products: sanitized.map((item) => ({
      name: item.name,
      unitPrice: item.unitPrice.toString(),
      quantity: item.quantity.toString(),
    })),
    ...(buyerEmail ? { buyer: { email: buyerEmail, language: locale === "pl" ? "pl" : "en" } } : {}),
  };

  // PayU przy udanym zamówieniu zwraca 302 z redirectUri w JSON — nie podążamy za przekierowaniem
  const orderResponse = await fetch(`${config.baseUrl}/api/v2_1/orders`, {
    method: "POST",
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData.access_token}`,
    },
    body: JSON.stringify(orderPayload),
  });

  const orderData = await orderResponse.json().catch(() => null);
  const successStatuses = [200, 201, 302];
  const isSuccess = successStatuses.includes(orderResponse.status) && orderData?.redirectUri;

  if (!isSuccess) {
    return NextResponse.json(
      {
        error: "PAYU_ORDER_FAILED",
        details: orderData,
        status: orderResponse.status,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ redirectUri: orderData.redirectUri });
}

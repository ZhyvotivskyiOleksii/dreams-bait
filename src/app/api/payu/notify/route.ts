import crypto from "node:crypto";
import { NextResponse } from "next/server";

const getSignature = (headerValue: string | null) => {
  if (!headerValue) return null;
  const match = headerValue.match(/signature=([^;]+)/i);
  return match?.[1] ?? null;
};

export async function POST(request: Request) {
  const secondKey = process.env.PAYU_SECOND_KEY;
  const body = await request.text();

  if (secondKey) {
    const header = request.headers.get("OpenPayu-Signature");
    const signature = getSignature(header);
    if (signature) {
      const expected = crypto
        .createHash("md5")
        .update(body + secondKey)
        .digest("hex");
      if (signature !== expected) {
        return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
      }
    }
  }

  // TODO: Persist order status in the database if needed.
  return NextResponse.json({ status: "ok" });
}

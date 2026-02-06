import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

const LOCALES = ["uk", "pl", "en"] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const slugs = (body.slugs ?? request.nextUrl.searchParams.get("slugs")?.split(",") ?? []).filter(
      (s: string) => typeof s === "string" && s.trim()
    );
    if (slugs.length === 0) {
      return Response.json({ revalidated: false, error: "slugs required" }, { status: 400 });
    }
    for (const locale of LOCALES) {
      for (const slug of slugs) {
        revalidatePath(`/${locale}/catalog/${slug}`);
      }
    }
    return Response.json({ revalidated: true, slugs });
  } catch (e) {
    return Response.json({ revalidated: false, error: String(e) }, { status: 500 });
  }
}

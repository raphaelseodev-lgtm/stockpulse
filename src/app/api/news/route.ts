import { NextResponse } from "next/server";
import { getCompanyNews } from "@/lib/finnhub";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol")?.trim().toUpperCase();

  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol is required", code: "INVALID_INPUT" },
      { status: 400 }
    );
  }

  try {
    const news = await getCompanyNews(symbol);
    return NextResponse.json(news);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch news", code: "FETCH_ERROR" },
      { status: 502 }
    );
  }
};

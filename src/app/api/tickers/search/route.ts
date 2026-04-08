import { NextResponse } from "next/server";
import { searchTickers } from "@/lib/finnhub";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 1) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchTickers(query);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: "Failed to search tickers", code: "FETCH_ERROR" },
      { status: 502 }
    );
  }
};

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { watchlists } from "@/db/schema";

const createSchema = z.object({
  ticker: z.string().min(1).max(10),
  name: z.string().max(100).nullable(),
});

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", code: "INVALID_INPUT" }, { status: 400 });
    }

    const [item] = await db
      .insert(watchlists)
      .values({
        userId: session.user.id,
        ticker: parsed.data.ticker,
        name: parsed.data.name,
      })
      .returning();

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
};

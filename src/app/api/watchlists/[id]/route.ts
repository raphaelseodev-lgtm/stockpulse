import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { watchlists } from "@/db/schema";

export const DELETE = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    await db
      .delete(watchlists)
      .where(
        and(
          eq(watchlists.id, params.id),
          eq(watchlists.userId, session.user.id)
        )
      );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
};

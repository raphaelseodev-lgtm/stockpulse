import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { watchlists, subscriptions, accounts } from "@/db/schema";
import { ProfileSection } from "@/components/features/profile-section";
import { WatchlistSection } from "@/components/features/watchlist-section";
import { SubscriptionSection } from "@/components/features/subscription-section";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "마이페이지 — StockPulse",
  description: "프로필, 워치리스트, 구독 상태를 관리하세요.",
};

const DashboardPage = async () => {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id!;

  const [userWatchlists, userSubscription, userAccounts] = await Promise.all([
    db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, userId)),
    db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .then((rows) => rows[0] ?? null),
    db
      .select({ provider: accounts.provider })
      .from(accounts)
      .where(eq(accounts.userId, userId)),
  ]);

  const connectedProviders = userAccounts.map((a) => a.provider);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">마이페이지</h1>
        <p className="mt-1 text-muted-foreground">
          프로필, 관심 종목, 구독 상태를 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 왼쪽: 프로필 + 구독 */}
        <div className="space-y-6 lg:col-span-1">
          <ProfileSection
            name={session.user.name ?? ""}
            email={session.user.email ?? ""}
            image={session.user.image ?? ""}
            providers={connectedProviders}
          />
          <SubscriptionSection subscription={userSubscription} />
        </div>

        {/* 오른쪽: 워치리스트 */}
        <div className="lg:col-span-2">
          <WatchlistSection watchlists={userWatchlists} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

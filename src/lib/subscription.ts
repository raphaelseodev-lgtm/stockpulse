import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export type PlanType = "free" | "pro";

interface SubscriptionInfo {
    plan: PlanType;
    isActive: boolean;
    currentPeriodEnd: Date | null;
    canSearch: boolean;       // 검색 가능 여부
    maxWatchlist: number;     // 워치리스트 최대 개수
}

/** 현재 로그인된 유저의 구독 정보를 조회합니다 */
export async function getSubscriptionInfo(): Promise<SubscriptionInfo> {
    const FREE_DEFAULTS: SubscriptionInfo = {
        plan: "free",
        isActive: false,
        currentPeriodEnd: null,
        canSearch: true, // Free도 제한된 검색 가능
        maxWatchlist: 5,
    };

    const session = await auth();
    if (!session?.user?.id) return FREE_DEFAULTS;

    const [sub] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, session.user.id))
        .limit(1);

    if (!sub || sub.status !== "active") return FREE_DEFAULTS;

    return {
        plan: "pro",
        isActive: true,
        currentPeriodEnd: sub.currentPeriodEnd,
        canSearch: true,
        maxWatchlist: Infinity,
    };
}

/** Pro 플랜인지 확인하는 간단한 헬퍼 */
export async function isPro(): Promise<boolean> {
    const info = await getSubscriptionInfo();
    return info.plan === "pro";
}

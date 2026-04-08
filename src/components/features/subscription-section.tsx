"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCardIcon, CalendarIcon, ArrowUpRightIcon } from "lucide-react";

interface Subscription {
  id: string;
  status: string;
  stripePriceId: string | null;
  currentPeriodEnd: Date | null;
}

interface SubscriptionSectionProps {
  subscription: Subscription | null;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "활성", variant: "default" },
  trialing: { label: "체험 중", variant: "secondary" },
  past_due: { label: "결제 지연", variant: "destructive" },
  canceled: { label: "해지됨", variant: "outline" },
  inactive: { label: "비활성", variant: "outline" },
};

/** stripePriceId → 표시 이름 매핑은 서버에서 전달받거나, 존재 여부로 판단 */

export const SubscriptionSection = ({ subscription }: SubscriptionSectionProps) => {
  const [loading, setLoading] = useState(false);
  const isActive = subscription?.status === "active" || subscription?.status === "trialing";
  const statusInfo = statusMap[subscription?.status ?? "inactive"] ?? statusMap.inactive;

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCardIcon className="size-4" />
          구독 상태
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription && isActive ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">플랜</span>
              <span className="text-sm font-medium">Pro</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">상태</span>
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>
            {subscription.currentPeriodEnd && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">갱신일</span>
                <span className="flex items-center gap-1 text-sm">
                  <CalendarIcon className="size-3" />
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                    "ko-KR"
                  )}
                </span>
              </div>
            )}
            <Separator />
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleManageSubscription}
              disabled={loading}
            >
              {loading ? "처리 중..." : "구독 관리"}
              {!loading && <ArrowUpRightIcon className="ml-1 size-3" />}
            </Button>
          </>
        ) : (
          <div className="space-y-4 text-center">
            <div className="rounded-lg bg-muted/50 px-4 py-6">
              <Badge variant="outline" className="mb-2">Free</Badge>
              <p className="text-sm font-medium">무료 플랜 이용 중</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pro로 업그레이드하면 무제한 검색과 실시간 알림을 이용할 수 있습니다.
              </p>
            </div>
            <Button
              className="w-full"
              render={<Link href="/#pricing" />}
            >
              Pro 업그레이드
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

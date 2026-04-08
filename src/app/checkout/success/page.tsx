import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2Icon } from "lucide-react";

export const metadata = {
  title: "결제 완료 — StockPulse",
};

const CheckoutSuccessPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2Icon className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold">결제가 완료되었습니다!</h1>
          <p className="mt-2 text-muted-foreground">
            Pro 플랜이 활성화되었습니다. 무제한 검색과 실시간 알림을 이용해보세요.
          </p>
          <Button className="mt-8" render={<Link href="/dashboard" />}>
            대시보드로 이동
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutSuccessPage;

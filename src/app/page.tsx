import Link from "next/link";
import { PopularTickers } from "@/components/features/popular-tickers";
import { PricingCard } from "@/components/features/pricing-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUpIcon,
  BellIcon,
  SearchIcon,
  ZapIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  ArrowRightIcon,
} from "lucide-react";

const features = [
  {
    icon: SearchIcon,
    title: "실시간 뉴스 검색",
    description:
      "티커를 입력하면 해당 종목의 최신 뉴스를 즉시 확인할 수 있습니다.",
  },
  {
    icon: BellIcon,
    title: "맞춤 알림",
    description:
      "관심 종목에 중요 뉴스가 나오면 실시간으로 알림을 받아보세요.",
  },
  {
    icon: TrendingUpIcon,
    title: "시장 트렌드 분석",
    description:
      "뉴스 흐름을 분석하여 시장의 방향성을 한눈에 파악할 수 있습니다.",
  },
  {
    icon: ZapIcon,
    title: "빠른 속도",
    description:
      "글로벌 뉴스 소스를 실시간으로 수집하여 가장 빠르게 전달합니다.",
  },
  {
    icon: ShieldCheckIcon,
    title: "신뢰할 수 있는 소스",
    description:
      "검증된 뉴스 매체만 선별하여 허위 정보를 걸러냅니다.",
  },
  {
    icon: BarChart3Icon,
    title: "포트폴리오 대시보드",
    description:
      "관심 종목을 한곳에서 관리하고 뉴스 흐름을 모니터링하세요.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "주식 뉴스를 시작해보세요",
    features: [
      "일 10회 뉴스 검색",
      "관심 종목 3개",
      "기본 뉴스 피드",
      "커뮤니티 지원",
    ],
    cta: "무료로 시작하기",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "9,900",
    description: "본격적인 투자 리서치를 위해",
    badge: "인기",
    features: [
      "무제한 뉴스 검색",
      "관심 종목 무제한",
      "실시간 알림",
      "시장 트렌드 분석",
      "이메일 뉴스레터",
      "우선 고객 지원",
    ],
    cta: "Pro 시작하기",
    highlighted: true,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  {
    name: "Team",
    price: "29,900",
    description: "팀을 위한 공유 워크스페이스",
    features: [
      "Pro의 모든 기능",
      "팀원 5명 포함",
      "공유 워치리스트",
      "팀 대시보드",
      "API 접근",
      "전담 매니저",
    ],
    cta: "팀 플랜 시작하기",
    highlighted: false,
  },
];

const HomePage = () => {
  return (
    <div className="-mx-4 -mt-6 sm:-mx-6 lg:-mx-8">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/30">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              Beta 오픈 — 지금 무료로 사용해보세요
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              관심 주식 뉴스를
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                한눈에
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              티커만 입력하면 전 세계 뉴스를 실시간으로 모아봅니다.
              <br className="hidden sm:block" />
              더 빠르고, 더 똑똑한 투자 리서치를 경험하세요.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" render={<Link href="/login" />}>
                무료로 시작하기
                <ArrowRightIcon className="ml-1 size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={<Link href="#features" />}
              >
                기능 살펴보기
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              신용카드 없이 시작 · 언제든 취소 가능
            </p>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section id="features" className="border-b py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              투자에 필요한 뉴스, 전부 여기에
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              StockPulse가 제공하는 핵심 기능을 소개합니다.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="size-5 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 인기 종목 섹션 */}
      <section className="border-b py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PopularTickers />
        </div>
      </section>

      {/* 가격표 섹션 */}
      <section id="pricing" className="border-b bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              심플한 가격 정책
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              필요한 만큼만 선택하세요. 언제든 업그레이드할 수 있습니다.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary px-6 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              더 똑똑한 투자, 지금 시작하세요
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              매일 쏟아지는 뉴스 속에서 진짜 중요한 정보만 골라드립니다.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                render={<Link href="/login" />}
              >
                무료로 시작하기
                <ArrowRightIcon className="ml-1 size-4" />
              </Button>
            </div>
            <p className="mt-4 text-sm text-primary-foreground/60">
              가입은 30초면 충분합니다
            </p>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="size-5 text-primary" />
              <span className="font-bold">StockPulse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 StockPulse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

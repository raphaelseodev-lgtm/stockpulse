"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  badge?: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  priceId?: string;
}

export const PricingCard = ({
  name,
  price,
  description,
  badge,
  features,
  cta,
  highlighted,
  priceId,
}: PricingCardProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (!priceId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={highlighted ? "relative ring-2 ring-primary" : ""}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge>{badge}</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight">
            &#8361;{price}
          </span>
          <span className="text-sm text-muted-foreground">/ 월</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <CheckIcon className="size-4 shrink-0 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        {priceId ? (
          <Button
            variant={highlighted ? "default" : "outline"}
            className="w-full"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "처리 중..." : cta}
          </Button>
        ) : (
          <Button
            variant={highlighted ? "default" : "outline"}
            className="w-full"
            render={<Link href="/login" />}
          >
            {cta}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

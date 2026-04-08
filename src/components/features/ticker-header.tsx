"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon, StarIcon, CheckIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

interface TickerHeaderProps {
  symbol: string;
}

export const TickerHeader = ({ symbol }: TickerHeaderProps) => {
  const { data: session } = useSession();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToWatchlist = async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/watchlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: symbol, name: null }),
      });
      if (res.ok) setAdded(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Link
          href="/search"
          className="flex size-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <TrendingUpIcon className="size-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{symbol}</h1>
            <Badge variant="secondary">US</Badge>
          </div>
          <p className="text-sm text-muted-foreground">최근 7일 뉴스</p>
        </div>
      </div>

      {session?.user && (
        <Button
          variant={added ? "secondary" : "default"}
          onClick={handleAddToWatchlist}
          disabled={loading || added}
        >
          {added ? (
            <>
              <CheckIcon className="size-4" />
              추가됨
            </>
          ) : (
            <>
              <StarIcon className="size-4" />
              워치리스트에 추가
            </>
          )}
        </Button>
      )}
    </div>
  );
};

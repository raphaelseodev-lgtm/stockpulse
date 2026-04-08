"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  StarIcon,
  PlusIcon,
  XIcon,
  TrendingUpIcon,
  SearchIcon,
} from "lucide-react";

interface WatchlistItem {
  id: string;
  ticker: string;
  name: string | null;
  createdAt: Date;
}

interface TickerResult {
  symbol: string;
  name: string;
}

interface WatchlistSectionProps {
  watchlists: WatchlistItem[];
}

export const WatchlistSection = ({ watchlists }: WatchlistSectionProps) => {
  const [items, setItems] = useState(watchlists);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  /** 검색 관련 상태 */
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TickerResult[]>([]);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /** 디바운스된 검색어로 API 호출 */
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `/api/tickers/search?q=${encodeURIComponent(debouncedQuery)}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setOpen(data.length > 0);
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [debouncedQuery]);

  /** 외부 클릭 시 드롭다운 닫기 */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** 검색 결과에서 종목 선택하여 추가 */
  const handleSelect = async (ticker: TickerResult) => {
    setLoading(true);
    setOpen(false);
    try {
      const res = await fetch("/api/watchlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: ticker.symbol, name: ticker.name }),
      });
      if (res.ok) {
        const newItem = await res.json();
        setItems((prev) => [...prev, newItem]);
        setQuery("");
        setIsAdding(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    const res = await fetch(`/api/watchlists/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <StarIcon className="size-4" />
              관심 종목
            </CardTitle>
            <CardDescription className="mt-1">
              {items.length}개 종목을 관심 목록에 추가했습니다.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant={isAdding ? "ghost" : "outline"}
            onClick={() => {
              setIsAdding(!isAdding);
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
          >
            {isAdding ? (
              <XIcon className="size-4" />
            ) : (
              <>
                <PlusIcon className="size-4" />
                추가
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 종목 검색 추가 */}
        {isAdding && (
          <div ref={wrapperRef} className="relative">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="티커 또는 종목명 검색 (예: AAPL, Apple)"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!e.target.value.trim()) setOpen(false);
                }}
                onFocus={() => {
                  if (results.length > 0) setOpen(true);
                }}
                className="pl-9"
                autoFocus
              />
            </div>

            {open && (
              <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border bg-popover shadow-lg">
                <ul>
                  {results.map((result) => {
                    const alreadyAdded = items.some(
                      (item) => item.ticker === result.symbol
                    );
                    return (
                      <li key={result.symbol}>
                        <button
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted disabled:opacity-50"
                          onClick={() => handleSelect(result)}
                          disabled={alreadyAdded || loading}
                        >
                          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                            <TrendingUpIcon className="size-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">
                              {result.symbol}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {result.name}
                            </p>
                          </div>
                          {alreadyAdded ? (
                            <span className="text-xs text-muted-foreground">
                              추가됨
                            </span>
                          ) : (
                            <PlusIcon className="size-4 shrink-0 text-muted-foreground" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 워치리스트 */}
        {items.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <Link
                  href={`/ticker/${item.ticker}`}
                  className="flex items-center gap-3"
                >
                  <div className="flex size-9 items-center justify-center rounded-md bg-primary/10">
                    <TrendingUpIcon className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{item.ticker}</p>
                    {item.name && (
                      <p className="text-xs text-muted-foreground">
                        {item.name}
                      </p>
                    )}
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={() => handleRemove(item.id)}
                >
                  <XIcon className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <StarIcon className="mb-3 size-8 text-muted-foreground/50" />
            <p className="font-medium">관심 종목이 없습니다</p>
            <p className="mt-1 text-sm text-muted-foreground">
              상단의 추가 버튼으로 종목을 추가해보세요.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

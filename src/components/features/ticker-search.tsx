"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchIcon, TrendingUpIcon } from "lucide-react";

interface TickerResult {
  symbol: string;
  name: string;
}

interface TickerSearchProps {
  initialQuery: string;
}

export const TickerSearch = ({ initialQuery }: TickerSearchProps) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<TickerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  /** 자동완성 검색 */
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
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

  const handleSelect = (symbol: string) => {
    setQuery(symbol);
    setOpen(false);
    router.push(`/ticker/${encodeURIComponent(symbol)}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      {/* 검색 입력 */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="티커 또는 종목명 검색 (예: AAPL, Tesla)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value.trim()) setOpen(false);
          }}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          className="h-12 pl-10 text-base"
        />
      </div>

      {/* 자동완성 드롭다운 */}
      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border bg-popover shadow-lg">
          {loading ? (
            <div className="space-y-1 p-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2">
                  <Skeleton className="size-8 rounded-md" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul>
              {results.map((result) => (
                <li key={result.symbol}>
                  <button
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted"
                    onClick={() => handleSelect(result.symbol)}
                  >
                    <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                      <TrendingUpIcon className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{result.symbol}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {result.name}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

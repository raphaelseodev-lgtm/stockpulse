"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { SearchIcon, TrendingUpIcon } from "lucide-react";

interface TickerResult {
  symbol: string;
  name: string;
}

export const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TickerResult[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

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
    setQuery("");
    setOpen(false);
    router.push(`/ticker/${encodeURIComponent(symbol)}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <SearchIcon className="absolute left-2.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="티커 또는 종목명 검색 (예: AAPL)"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!e.target.value.trim()) setOpen(false);
        }}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        className="pl-9"
      />

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border bg-popover shadow-lg">
          <ul>
            {results.map((result) => (
              <li key={result.symbol}>
                <button
                  className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-muted"
                  onClick={() => handleSelect(result.symbol)}
                >
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                    <TrendingUpIcon className="size-3.5 text-primary" />
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
        </div>
      )}
    </div>
  );
};

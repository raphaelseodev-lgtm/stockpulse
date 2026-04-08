import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FlameIcon, TrendingUpIcon } from "lucide-react";

const popularTickers = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "기술" },
  { symbol: "MSFT", name: "Microsoft Corp.", sector: "기술" },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "기술" },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "소비재" },
  { symbol: "NVDA", name: "NVIDIA Corp.", sector: "반도체" },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "자동차" },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "기술" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "금융" },
  { symbol: "V", name: "Visa Inc.", sector: "금융" },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "헬스케어" },
  { symbol: "WMT", name: "Walmart Inc.", sector: "소비재" },
  { symbol: "MA", name: "Mastercard Inc.", sector: "금융" },
];

const sectorColors: Record<string, string> = {
  기술: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  반도체: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  소비재: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  자동차: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  금융: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  헬스케어: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

export const PopularTickers = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlameIcon className="size-4 text-orange-500" />
          인기 종목
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {popularTickers.map((ticker) => (
            <Link
              key={ticker.symbol}
              href={`/ticker/${ticker.symbol}`}
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10">
                <TrendingUpIcon className="size-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{ticker.symbol}</span>
                  <span
                    className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium ${sectorColors[ticker.sector] ?? ""}`}
                  >
                    {ticker.sector}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {ticker.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

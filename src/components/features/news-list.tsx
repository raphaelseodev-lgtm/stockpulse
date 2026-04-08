"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLinkIcon,
  NewspaperIcon,
  ClockIcon,
} from "lucide-react";

interface NewsItem {
  id: number;
  headline: string;
  source: string;
  url: string;
  image: string;
  summary: string;
  datetime: number;
  category: string;
}

interface NewsListProps {
  symbol: string;
}

/** 상대 시간 포맷 */
const timeAgo = (timestamp: number): string => {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  if (seconds < 60) return "방금 전";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
};

export const NewsList = ({ symbol }: NewsListProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(
          `/api/news?symbol=${encodeURIComponent(symbol)}`
        );
        if (res.ok) {
          setNews(await res.json());
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [symbol]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex gap-4 py-4">
              <Skeleton className="hidden size-24 shrink-0 rounded-lg sm:block" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <NewspaperIcon className="mb-3 size-8 text-muted-foreground/50" />
          <p className="font-medium">뉴스를 불러올 수 없습니다</p>
          <p className="mt-1 text-sm text-muted-foreground">
            잠시 후 다시 시도해주세요.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (news.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <NewspaperIcon className="mb-3 size-8 text-muted-foreground/50" />
          <p className="font-medium">최근 뉴스가 없습니다</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {symbol}에 대한 최근 7일간 뉴스가 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {news.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex gap-4 py-4">
              {/* 썸네일 */}
              {item.image && (
                <div className="relative hidden size-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:block">
                  <Image
                    src={item.image}
                    alt={item.headline}
                    fill
                    className="object-cover"
                    sizes="96px"
                    unoptimized
                  />
                </div>
              )}

              {/* 내용 */}
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <h3 className="line-clamp-2 text-sm font-medium leading-snug">
                    {item.headline}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <Badge variant="outline" className="text-[10px]">
                    {item.source}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ClockIcon className="size-3" />
                    {timeAgo(item.datetime)}
                  </span>
                  <ExternalLinkIcon className="ml-auto size-3 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
};

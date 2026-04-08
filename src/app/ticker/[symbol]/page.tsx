import { TickerHeader } from "@/components/features/ticker-header";
import { NewsList } from "@/components/features/news-list";

interface TickerPageProps {
  params: { symbol: string };
}

export const generateMetadata = ({ params }: TickerPageProps) => ({
  title: `${params.symbol.toUpperCase()} 뉴스 — StockPulse`,
  description: `${params.symbol.toUpperCase()} 관련 최신 뉴스를 확인하세요.`,
});

const TickerPage = ({ params }: TickerPageProps) => {
  const symbol = params.symbol.toUpperCase();

  return (
    <div className="space-y-6">
      <TickerHeader symbol={symbol} />
      <NewsList symbol={symbol} />
    </div>
  );
};

export default TickerPage;

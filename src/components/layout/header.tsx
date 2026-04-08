import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { SearchBar } from "@/components/layout/search-bar";
import { UserMenu } from "@/components/layout/user-menu";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Button } from "@/components/ui/button";

export const Header = async () => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6 text-primary"
          >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          <span className="text-lg font-bold">StockPulse</span>
        </Link>

        {/* 검색 바 (데스크톱) */}
        <div className="hidden flex-1 px-8 md:block">
          <SearchBar />
        </div>

        {/* 우측 영역 */}
        <div className="flex items-center gap-2">
          {session?.user ? (
            <UserMenu
              name={session.user.name ?? ""}
              email={session.user.email ?? ""}
              image={session.user.image ?? ""}
              signOutAction={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" render={<Link href="/login" />}>
                로그인
              </Button>
              <Button render={<Link href="/login" />}>
                시작하기
              </Button>
            </div>
          )}

          {/* 모바일 메뉴 */}
          <MobileMenu isLoggedIn={!!session?.user} />
        </div>
      </div>

      {/* 검색 바 (모바일) */}
      <div className="border-t px-4 py-2 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
};

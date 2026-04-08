"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";

interface MobileMenuProps {
  isLoggedIn: boolean;
}

export const MobileMenu = ({ isLoggedIn }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="메뉴 열기"
      >
        {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
      </Button>

      {open && (
        <div className="absolute left-0 top-14 z-50 w-full border-b bg-background p-4">
          <nav className="flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  대시보드
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  설정
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  로그인
                </Link>
                <Button
                  render={<Link href="/login" />}
                  className="mt-1"
                  onClick={() => setOpen(false)}
                >
                  시작하기
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
};

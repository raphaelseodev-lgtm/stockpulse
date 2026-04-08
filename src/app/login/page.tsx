import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/features/login-form";

export const metadata = {
  title: "로그인 — StockPulse",
  description: "StockPulse에 로그인하여 관심 주식 뉴스를 받아보세요.",
};

const LoginPage = async () => {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage;

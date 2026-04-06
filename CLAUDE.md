# StockPulse — 주식 뉴스 웹서비스

## 프로젝트 개요
관심 주식 티커의 최신 뉴스를 한눈에 보여주는 SaaS 웹서비스.
1인 개발(솔로프리너) 프로젝트이며, 빠른 MVP 출시가 목표.

## 테크 스택
- **프레임워크**: Next.js 14 (App Router, Server Components 우선)
- **언어**: TypeScript (strict 모드)
- **스타일링**: Tailwind CSS + shadcn/ui
- **데이터베이스**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM (타입 세이프 쿼리, 마이그레이션 관리)
- **인증**: NextAuth.js v5 (Google, GitHub OAuth)
- **결제**: Stripe (Checkout, Customer Portal)
- **이메일**: Resend + React Email
- **배포**: Vercel
- **모니터링**: Sentry (에러), PostHog (분석)
- **소스 관리**: GitHub

## 디렉토리 구조
```text
src/
├── app/                    # App Router 페이지
│   ├── (auth)/            # 인증 관련 (로그인, 회원가입)
│   ├── (dashboard)/       # 로그인 후 페이지
│   ├── api/               # API Routes
│   └── layout.tsx         # Root Layout
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트
│   ├── layout/            # Header, Footer, Sidebar
│   └── features/          # 기능별 컴포넌트
├── lib/
│   ├── supabase.ts        # Supabase 클라이언트
│   ├── stripe.ts          # Stripe 설정
│   ├── auth.ts            # NextAuth 설정
│   └── utils.ts           # 유틸리티 함수
├── db/
│   ├── index.ts           # Drizzle 클라이언트 인스턴스
│   ├── schema.ts          # Drizzle 테이블 스키마 정의
│   └── migrations/        # Drizzle 마이그레이션 파일
├── types/                 # TypeScript 타입 정의
└── hooks/                 # 커스텀 훅
```

## 코딩 컨벤션
- **컴포넌트**: 함수형 컴포넌트 + Arrow Function
- **네이밍**: 파일은 kebab-case, 컴포넌트는 PascalCase
- **상태 관리**: Server Components 최대 활용, 필요시 zustand
- **에러 처리**: 모든 API 호출에 try-catch, Sentry 연동
- **주석**: 한국어로 작성, JSDoc 스타일
- **import 순서**: react → next → 외부 라이브러리 → 내부 모듈 → 타입
- **DB 쿼리**: Drizzle ORM으로 타입 세이프 쿼리 작성, raw SQL 사용 금지

## API 설계 원칙
- RESTful 패턴 준수
- API Route에서 입력 검증 필수 (zod 사용)
- Rate Limiting 적용 (upstash/ratelimit)
- 에러 응답은 `{ error: string, code: string }` 형식

## 데이터베이스 테이블
- `profiles`: 사용자 프로필 (Supabase Auth 연동)
- `watchlists`: 관심 티커 목록
- `subscriptions`: Stripe 구독 정보
- `search_history`: 검색 기록

## 환경 변수
.env.local 에 저장하며, 절대 커밋하지 않는다.
필요한 환경 변수:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
- GITHUB_ID / GITHUB_SECRET
- STRIPE_SECRET_KEY / STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET
- RESEND_API_KEY
- FINNHUB_API_KEY
- NEXT_PUBLIC_POSTHOG_KEY
- NEXT_PUBLIC_POSTHOG_HOST
- SENTRY_DSN
- DATABASE_URL (Supabase PostgreSQL 연결 문자열 — Drizzle ORM용)

## Drizzle ORM 규칙
- 스키마 정의는 `src/db/schema.ts`에 집중
- 마이그레이션은 `drizzle-kit`으로 관리 (`pnpm drizzle-kit generate`, `pnpm drizzle-kit migrate`)
- 쿼리 시 항상 Drizzle의 타입 세이프 빌더 사용 (eq, and, desc 등)
- Supabase 클라이언트는 Auth/RLS/Realtime에만 사용하고, 데이터 CRUD는 Drizzle로 처리

## 주의사항
- 가능한 한 Server Component를 사용하고, 클라이언트 컴포넌트는 최소화
- "use client"는 반드시 필요한 경우에만 선언
- 이미지는 next/image 사용
- 링크는 next/link 사용
- 모든 페이지에 메타데이터(title, description) 필수
- 반응형 디자인 (모바일 우선)
- 다크 모드 지원 (tailwind dark: 접두사)

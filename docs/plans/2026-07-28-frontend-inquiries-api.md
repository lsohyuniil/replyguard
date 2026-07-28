# Frontend Inquiries API Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 문의함과 대시보드의 확인 필요 문의를 FastAPI `GET /inquiries` 응답으로 표시한다.

**Architecture:** 브라우저에서 공개 API 주소로 FastAPI를 호출하는 공통 client를 만들고 TanStack Query가 로딩, 오류, 캐시와 재시도를 관리한다. 문의 feature 안에서 API 응답 타입, 화면 mapper, query hook, 필터 상태를 분리하며 대시보드는 동일 query hook을 재사용한다.

**Tech Stack:** Next.js 16.2.10 App Router, React 19.2.4, TypeScript, TanStack Query, Tailwind CSS

## Global Constraints

- 실제 `.env` 파일은 읽거나 수정하지 않는다.
- 공개 API 주소만 `NEXT_PUBLIC_API_BASE_URL`로 클라이언트 번들에 노출한다.
- Supabase Secret/Service Role 키는 프론트에 포함하지 않는다.
- 기존 `frontend/src/components/` 컴포넌트와 디자인 시스템을 재사용한다.
- 검색, 상태, 유형, 페이지네이션은 전체 Mock 배열이 아니라 FastAPI 쿼리 파라미터로 처리한다.
- 사용자가 요청하기 전에는 커밋하지 않는다.

---

### Task 1: Query 기반과 문의 API client

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/package-lock.json`
- Create: `frontend/src/components/query-provider.tsx`
- Modify: `frontend/src/app/layout.tsx`
- Create: `frontend/src/lib/api/client.ts`
- Modify: `frontend/src/lib/inquiries/types.ts`
- Create: `frontend/src/lib/inquiries/api.ts`
- Create: `frontend/src/hooks/inquiries/use-inquiries-query.ts`

**Interfaces:**
- Produces: `fetchInquiryList(params: InquiryListParams): Promise<InquiryListResponse>`
- Produces: `useInquiriesQuery(params: InquiryListParams)`

- [ ] **Step 1:** `@tanstack/react-query`를 설치하고 lockfile 변경을 확인한다.
- [ ] **Step 2:** 브라우저별 `QueryClient`를 한 번만 만드는 `QueryProvider`를 작성한다.
- [ ] **Step 3:** 성공하지 않은 응답을 `ApiError`로 변환하고 JSON을 반환하는 공통 `apiFetch`를 작성한다.
- [ ] **Step 4:** 백엔드 snake_case 응답과 화면 camelCase 모델을 분리해 타입을 정의한다.
- [ ] **Step 5:** 검색·상태·유형·페이지를 `URLSearchParams`로 직렬화하는 문의 client를 작성한다.
- [ ] **Step 6:** query key에 모든 검색 조건을 포함하는 `useInquiriesQuery`를 작성한다.
- [ ] **Step 7:** `npm run lint`와 `npm run build`로 타입 및 App Router 경계를 검증한다.

### Task 2: 문의함 서버 필터와 상태 UI

**Files:**
- Modify: `frontend/src/hooks/inquiries/use-inquiry-filters.ts`
- Modify: `frontend/src/components/inquiries/inbox/inquiry-inbox.tsx`
- Modify: `frontend/src/app/(dashboard)/inquiries/page.tsx`
- Modify: `frontend/src/lib/inquiries/mapper.ts`
- Modify: `frontend/src/lib/inquiries/constants.ts`
- Modify: `frontend/src/lib/inquiries/index.ts`
- Delete: `frontend/src/lib/inquiries/mock-query.ts`
- Delete: `frontend/src/lib/inquiries/filters.ts`

**Interfaces:**
- Consumes: `useInquiriesQuery(params)`
- Produces: 검색·상태·유형·현재 페이지를 API 파라미터로 전달하는 문의함

- [ ] **Step 1:** 필터 hook이 전체 배열을 받지 않고 query params만 관리하도록 변경한다.
- [ ] **Step 2:** API source를 기존 `InquiryListItem`으로 변환하고 nullable 고객명을 이메일로 대체한다.
- [ ] **Step 3:** 문의함에서 query 결과의 `items`, `total_count`, `total_pages`, `status_counts`를 렌더링한다.
- [ ] **Step 4:** 최초 로딩, 재조회, 오류·재시도, 빈 결과 UI를 기존 카드 디자인으로 표시한다.
- [ ] **Step 5:** 초기 `status` URL 파라미터가 확인 필요 문의함 진입에 유지되는지 확인한다.
- [ ] **Step 6:** `npm run lint`와 `npm run build`를 실행한다.

### Task 3: 대시보드 확인 필요 문의 연동

**Files:**
- Create: `frontend/src/components/dashboard/attention/dashboard-attention-list.tsx`
- Modify: `frontend/src/components/dashboard/index.ts`
- Modify: `frontend/src/app/(dashboard)/page.tsx`
- Modify: `frontend/src/lib/dashboard/mapper.ts`
- Modify: `frontend/src/lib/dashboard/mock-query.ts`

**Interfaces:**
- Consumes: `useInquiriesQuery({status: "ACTION_REQUIRED", page: 1, pageSize: 4})`
- Produces: 실데이터 기반 `AttentionList`

- [ ] **Step 1:** API 문의를 기존 `AttentionInquiry`로 변환하는 mapper를 작성한다.
- [ ] **Step 2:** 확인 필요 문의 4건을 요청하는 client component를 작성한다.
- [ ] **Step 3:** 대시보드 fixture에서는 확인 필요 목록 조립만 제거하고 차트·요약 데이터는 유지한다.
- [ ] **Step 4:** 로딩·오류·빈 상태에서도 대시보드 레이아웃이 유지되는지 확인한다.
- [ ] **Step 5:** 전체 보기 링크가 `/inquiries?status=ACTION_REQUIRED`로 이동하는지 확인한다.

### Task 4: 통합 검증

**Files:**
- Modify: `frontend/.env.example` if it already exists; otherwise create it with only the public API URL example.

**Interfaces:**
- Consumes: FastAPI `GET /inquiries`
- Produces: 로컬 실행 문서화와 검증 결과

- [ ] **Step 1:** `.env.example`에 `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000`만 기록한다.
- [ ] **Step 2:** `npm run lint`를 실행해 ESLint 오류가 0개인지 확인한다.
- [ ] **Step 3:** `npm run build`를 실행해 Next.js 16 production build가 성공하는지 확인한다.
- [ ] **Step 4:** 백엔드 실행 상태에서 문의함의 검색·필터·페이지 이동을 데스크톱과 모바일 너비로 확인한다.
- [ ] **Step 5:** `git diff --check`와 `git status --short`로 환경파일이나 범위 밖 변경이 없는지 확인한다.

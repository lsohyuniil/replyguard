# Frontend Error and Session Expiry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 사용자용 오류 안내를 통일하고 만료된 인증 세션을 정리한 뒤 로그인 화면에서 토스트로 안내한다.

**Architecture:** API 오류를 사용자 문구로 바꾸는 순수 함수와 세션 만료 부수 효과를 담당하는 함수를 분리한다. 로그인 화면은 URL 사유를 받아 공통 토스트를 표시하며, 조회 화면은 공통 오류 안내를 재사용한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase Auth, TanStack Query, Vitest

## Global Constraints

- 새 패키지를 설치하지 않는다.
- 실제 `.env` 파일을 읽거나 수정하지 않는다.
- `401` 세션 만료만 자동 로그아웃하며 `403`과 일반 장애는 로그아웃하지 않는다.
- 기존 디자인 토큰과 컴포넌트 구조를 따른다.
- 사용자가 요청하지 않았으므로 커밋하지 않는다.

---

### Task 1: 오류 안내와 세션 만료 도메인 로직

**Files:**
- Create: `frontend/src/lib/api/error-message.ts`
- Create: `frontend/src/lib/api/error-message.test.ts`
- Create: `frontend/src/lib/auth/session-expiry.ts`
- Create: `frontend/src/lib/auth/session-expiry.test.ts`
- Modify: `frontend/src/lib/api/client.ts`

**Interfaces:**
- Produces: `getUserFacingErrorMessage(error): string`
- Produces: `createSessionExpiryHandler(dependencies): () => Promise<void>`
- Produces: `SESSION_EXPIRED_LOGIN_URL`

- [ ] 오류 유형별 사용자 문구 테스트를 먼저 작성하고 실패를 확인한다.
- [ ] 중복 호출 시 로그아웃과 이동이 한 번만 일어나는 테스트를 먼저 작성하고 실패를 확인한다.
- [ ] 최소 구현을 추가하고 관련 테스트 통과를 확인한다.
- [ ] API 클라이언트의 인증 만료 처리를 새 핸들러로 통합한다.

### Task 2: 로그인 만료 토스트

**Files:**
- Create: `frontend/src/components/ui/toast.tsx`
- Create: `frontend/src/lib/auth/login-notice.ts`
- Create: `frontend/src/lib/auth/login-notice.test.ts`
- Modify: `frontend/src/app/login/page.tsx`

**Interfaces:**
- Consumes: `/login?reason=session-expired`
- Produces: `getLoginNotice(reason): string | null`
- Produces: `Toast`

- [ ] 로그인 사유 변환 테스트를 먼저 작성하고 실패를 확인한다.
- [ ] 사유 변환 함수와 자동 종료·수동 닫기 가능한 토스트를 구현한다.
- [ ] Next.js 16의 비동기 `searchParams` 규칙에 맞춰 로그인 페이지에서 토스트를 표시한다.

### Task 3: 조회 화면 오류 문구 통일

**Files:**
- Create: `frontend/src/components/ui/query-error-state.tsx`
- Modify: `frontend/src/components/dashboard/overview/dashboard-overview.tsx`
- Modify: `frontend/src/components/dashboard/attention/attention-list.tsx`
- Modify: `frontend/src/components/inquiries/inbox/inquiry-inbox.tsx`
- Modify: `frontend/src/components/inquiries/detail/inquiry-detail.tsx`

**Interfaces:**
- Consumes: TanStack Query의 `error`
- Produces: `QueryErrorState`

- [ ] 공통 오류 상태 컴포넌트를 추가한다.
- [ ] 대시보드, 확인 필요 문의, 문의함, 문의 상세에 공통 오류 문구를 적용한다.
- [ ] `404` 상세 조회는 기존의 문의 없음 화면을 유지한다.

### Task 4: 전체 검증

**Files:**
- Verify: `frontend/src/**/*`

- [ ] `npm test`를 실행한다.
- [ ] `npm run lint`를 실행한다.
- [ ] `npm run build`를 실행한다.
- [ ] 변경 파일만 검토하고 기존 미커밋 변경을 보존했는지 확인한다.


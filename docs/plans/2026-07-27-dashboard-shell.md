---
title: ReplyGuard 공통 레이아웃과 대시보드 구현 계획
created_at: 2026-07-27
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
---

# ReplyGuard Common Shell and Dashboard

## Goal Capsule

- **Objective:** 접고 펼칠 수 있는 공통 사이드바, 라이트·다크 테마, Mock 집계 데이터를 사용하는 운영 대시보드를 완성한다.
- **Authority:** `AGENTS.md`, `data/seeds/dashboard.json`, 기존 `frontend/src/components/theme-provider.tsx`와 Next.js 16 로컬 문서를 따른다.
- **Execution profile:** 새 패키지를 추가하지 않는 작은 프론트엔드 작업으로 진행한다.
- **Stop conditions:** 디자인 방향을 새로 정해야 하거나 기존 Mock 데이터 계약을 바꿔야 하는 상황이 나오면 구현을 멈추고 확인한다.
- **Tail ownership:** 구현 후 lint, production build, 실제 브라우저의 데스크톱·모바일·테마 상태를 확인한다.

## Product Contract

### Summary

운영자가 ReplyGuard에 접속하면 모든 관리자 화면에서 동일한 사이드바와 상단 영역을 사용한다. 첫 화면인 대시보드에서는 문의량, 자동 처리, 확인 필요, 평균 처리 시간과 최근 추이·문의 유형·확인 필요 문의를 빠르게 파악할 수 있어야 한다.

### Requirements

**공통 레이아웃**

- R1. 데스크톱 사이드바는 펼침·접힘 전환이 가능하고, 접힌 상태에서도 아이콘과 접근 가능한 메뉴 이름을 제공한다.
- R2. 작은 화면에서는 사이드바가 콘텐츠 위로 열리는 drawer로 동작하고 바깥 영역 또는 닫기 버튼으로 닫힌다.
- R3. 사이드바 메뉴는 대시보드, 문의함, 정책 관리, 연동 및 자동화를 포함하며 현재 경로를 구분한다.
- R4. 관리자 페이지가 늘어나도 동일한 레이아웃을 재사용하고 로그인 같은 비관리자 페이지에는 강제 적용하지 않는다.

**테마와 디자인**

- R5. 기존 `next-themes` 기반 라이트·다크·시스템 테마 동작을 유지하고 모든 신규 컴포넌트가 공통 색상 토큰을 사용한다.
- R6. 테마 전환과 사이드바 제어는 키보드, focus 표시, `aria-label`, `aria-expanded`를 제공한다.

**대시보드**

- R7. `data/seeds/dashboard.json`의 summary와 comparison을 KPI 카드로 표시한다.
- R8. 최근 7일 처리 추이, 상태·유형 분포, 완료 방식 데이터를 화면 폭에 맞게 표시한다.
- R9. `attention_inquiry_ids`를 `data/seeds/inquiries.json`과 연결해 확인 필요 문의 목록을 표시한다.
- R10. 데이터가 비어 있어도 레이아웃이 깨지지 않고 명시적인 빈 상태를 표시한다.

### Scope Boundaries

- Supabase 실시간 조회와 FastAPI 대시보드 API는 이번 작업에 포함하지 않는다.
- 문의함·문의 상세·정책·연동 페이지 본문은 만들지 않고 사이드바 링크 경로만 준비한다.
- Recharts나 아이콘 패키지를 새로 설치하지 않는다.
- 사이드바 접힘 상태의 영구 저장은 이번 범위에 포함하지 않는다.

## Planning Contract

### Key Technical Decisions

- KTD1. 관리자 공통 UI는 root layout에 직접 넣지 않고 `frontend/src/app/(dashboard)/layout.tsx` route group에 둔다. 이후 로그인 화면을 별도 레이아웃으로 만들 수 있다.
- KTD2. 상호작용이 필요한 shell과 테마 버튼만 Client Component로 만들고, 대시보드 페이지와 데이터 조합은 Server Component에 유지한다.
- KTD3. Mock JSON 접근은 `frontend/src/lib/dashboard-data.ts` 한 곳에서 담당한다. UI 컴포넌트는 원본 JSON 경로를 알지 못하며 이후 FastAPI 응답으로 교체할 수 있다.
- KTD4. 차트 라이브러리 없이 CSS 막대와 작은 SVG 선 그래프를 사용한다. 현재 범위에 필요한 시각화는 단순 분포와 7개 점뿐이다.
- KTD5. 색상은 Tailwind 클래스에 개별 hex 값을 반복하지 않고 `frontend/src/app/globals.css`의 의미 기반 CSS 변수로 확장한다.

### High-Level Technical Design

```text
app/(dashboard)/layout
        │
        ▼
components/app-shell (client state)
   ├── components/sidebar
   ├── components/app-header
   └── route page content
              │
              ▼
       app/(dashboard)/page
              │
              ▼
       lib/dashboard-data
          ├── data/seeds/dashboard.json
          └── data/seeds/inquiries.json
```

데스크톱에서는 shell이 sidebar 열 너비를 전환하고, 모바일에서는 동일한 sidebar를 overlay drawer로 표현한다. 데이터 로더는 JSON을 화면용 모델로 조합하고 대시보드 컴포넌트는 모델만 렌더링한다.

### Sequencing

1. 디자인 토큰과 관리자 route group을 먼저 준비한다.
2. shell·sidebar·header 상호작용을 완성한다.
3. Mock 데이터 로더와 대시보드 섹션을 연결한다.
4. 반응형·테마·접근성·빌드를 검증한다.

## Implementation Units

### U1. 관리자 공통 shell 구축

- **Goal:** 이후 모든 관리자 화면이 재사용할 수 있는 반응형 공통 레이아웃을 만든다.
- **Requirements:** R1, R2, R3, R4, R6
- **Files:**
  - `frontend/src/app/(dashboard)/layout.tsx`
  - `frontend/src/components/app-shell.tsx`
  - `frontend/src/components/sidebar.tsx`
  - `frontend/src/components/app-header.tsx`
  - `frontend/src/components/icons.tsx`
- **Approach:** route group layout에서 shell을 적용하고, shell이 데스크톱 접힘 상태와 모바일 drawer 상태를 소유한다. 메뉴 정의는 sidebar 내부의 단일 배열에서 렌더링하고 Next.js 현재 경로로 활성 항목을 결정한다.
- **Test scenarios:**
  - 넓은 화면에서 토글을 누르면 사이드바가 축소되고 본문 너비가 자연스럽게 확장된다.
  - 접힌 상태에서 각 링크는 시각적 아이콘과 스크린리더용 이름을 유지한다.
  - 작은 화면에서 메뉴 버튼으로 drawer를 열고 닫기 버튼·overlay·Escape로 닫는다.
  - `/` 경로에서 대시보드 메뉴만 활성 상태로 표시된다.
- **Verification:** 브라우저 데스크톱·모바일 viewport 점검과 ESLint를 통과한다.
- **Dependencies:** 없음

### U2. 테마와 디자인 토큰 정리

- **Goal:** 신규 관리자 UI가 라이트·다크 모드에서 일관된 색상과 focus 상태를 갖게 한다.
- **Requirements:** R5, R6
- **Files:**
  - `frontend/src/app/globals.css`
  - `frontend/src/app/layout.tsx`
  - `frontend/src/components/theme-toggle.tsx`
  - `frontend/src/components/theme-provider.tsx`
- **Approach:** 배경, surface, border, muted text, accent, success, warning, danger 토큰을 정의한다. 기존 ThemeProvider는 유지하고 토글의 hydration 초기 상태와 접근 가능한 라벨을 정리한다. 문서 언어와 metadata도 ReplyGuard에 맞춘다.
- **Test scenarios:**
  - 시스템 테마 초기 진입에서 hydration 경고나 잘못된 아이콘 깜빡임이 없다.
  - 라이트와 다크 전환 시 sidebar, 카드, 차트, focus ring의 대비가 유지된다.
  - 키보드 Tab과 Enter만으로 테마와 sidebar 버튼을 조작할 수 있다.
- **Verification:** 두 테마의 브라우저 점검, 개발 콘솔 경고 확인, production build를 통과한다.
- **Dependencies:** U1

### U3. Mock 대시보드 구현

- **Goal:** 집계 데이터와 확인 필요 문의를 운영자가 빠르게 해석할 수 있는 첫 화면으로 구성한다.
- **Requirements:** R7, R8, R9, R10
- **Files:**
  - `frontend/src/app/(dashboard)/page.tsx`
  - `frontend/src/lib/dashboard-data.ts`
  - `frontend/src/components/dashboard/summary-card.tsx`
  - `frontend/src/components/dashboard/inquiry-trend-chart.tsx`
  - `frontend/src/components/dashboard/distribution-chart.tsx`
  - `frontend/src/components/dashboard/attention-list.tsx`
- **Approach:** 서버 데이터 로더가 dashboard summary와 문의 레코드를 조합한다. 페이지는 인사/기간, KPI 카드, 7일 추이, 유형·완료 분포, 확인 필요 목록 순으로 배치한다. 차트에는 색상뿐 아니라 텍스트 값과 라벨을 함께 표시한다.
- **Test scenarios:**
  - KPI가 전체 48건, 자동 발송 24건, 확인 필요 8건, 평균 7분 42초로 표시된다.
  - 7일 추이의 합계와 상태 분포가 Mock 데이터와 일치한다.
  - 확인 필요 목록의 네 ID가 문의 제목·유형·세부 단계와 연결된다.
  - 빈 배열 또는 0 값에서도 나눗셈 오류나 폭 계산 오류 없이 빈 상태를 표시한다.
  - 모바일에서는 카드와 차트가 한 열로 쌓이고 가로 스크롤이 생기지 않는다.
- **Verification:** 데이터 값 대조, 반응형 브라우저 점검, ESLint와 production build를 통과한다.
- **Dependencies:** U1, U2

## Verification Contract

- `frontend`에서 `npm run lint`가 오류 없이 끝나야 한다.
- `frontend`에서 `npm run build`가 성공해야 한다.
- 브라우저에서 데스크톱과 모바일 크기로 sidebar 펼침·접힘·drawer를 확인한다.
- 라이트·다크·시스템 테마 전환 후 콘솔에 hydration 오류가 없어야 한다.
- 대시보드 KPI와 차트 합계를 `data/seeds/dashboard.json` 원본과 대조한다.
- `.env`를 읽거나 수정하지 않고 새 패키지를 설치하지 않는다.

## Definition of Done

- 공통 관리자 route group에서 접이식 데스크톱 sidebar와 모바일 drawer가 동작한다.
- 테마 전환이 shell과 모든 대시보드 컴포넌트에 일관되게 적용된다.
- 대시보드가 Mock 집계 및 확인 필요 문의를 정확히 표시한다.
- 키보드 조작, focus 상태, 접근 가능한 버튼 이름을 제공한다.
- lint와 production build가 통과하고 브라우저에서 반응형·테마 상태를 확인했다.
- 생성 중 사용하지 않게 된 컴포넌트나 임시 스타일이 남아 있지 않다.

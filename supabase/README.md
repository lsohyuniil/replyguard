# Supabase bootstrap

ReplyGuard 로컬 개발 DB의 초기 schema와 Mock seed입니다.

## 파일

- `migrations/20260727000000_initial_schema.sql`: 테이블, 제약조건, 인덱스, RLS 활성화
- `seed.sql`: `data/seeds`의 6개 상세 문의 시나리오를 고정 UUID로 변환한 데이터

`data/seeds/dashboard.json`은 DB 원본이 아니라 대시보드 집계 API의 Mock 응답이므로
`seed.sql`에 직접 저장하지 않습니다. 실제 Supabase 대시보드는 `inquiries`,
`answer_drafts`, `email_deliveries`를 조회해 집계합니다.

## 고정 UUID 규칙

Mock 데이터는 reset 후에도 관계가 동일하도록 종류별 UUID prefix를 사용합니다.

| Prefix | 데이터 |
| --- | --- |
| `00000000` | 운영자와 Gmail 연결 |
| `10000000` | 주문 |
| `11000000` | 주문 상품 |
| `12000000` | 배송 |
| `20000000` | 정책 |
| `21000000` | 정책 버전 |
| `22000000` | 정책 chunk |
| `30000000` | 문의 |
| `31000000` | 문의 메시지 |
| `40000000` | Agent 실행 |
| `41000000` | 답변 초안 |
| `42000000` | Tool 호출 |
| `43000000` | 이메일 발송 |
| `44000000` | 추가정보 요청 |

이 UUID는 로컬 fixture 전용이며 실제 운영 데이터 ID로 사용하지 않습니다.

## 로컬 적용

Supabase CLI와 Docker를 준비한 뒤 프로젝트 루트에서 실행합니다.

```bash
supabase start
supabase db reset
```

`db reset`은 로컬 DB를 초기화한 후 migration과 `seed.sql`을 차례대로
적용합니다. 실행 후 로컬 Supabase Studio에서 테이블과 6개 문의를 확인합니다.

현재 migration은 모든 업무 테이블에 RLS를 활성화하지만 클라이언트용 정책은
아직 만들지 않았습니다. 프론트에서 Supabase에 직접 접근하지 않고 FastAPI가
service role로 접근하는 MVP 구조를 전제로 합니다.

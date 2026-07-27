# ReplyGuard Mock data

프론트엔드 화면 개발과 이후 Supabase seed 변환에 사용할 가상 데이터입니다.
모든 이메일과 식별자는 테스트 전용이며 실제 개인정보를 포함하지 않습니다.

## 파일 구성

| 파일 | 역할 |
| --- | --- |
| `dashboard.json` | 대시보드 KPI, 이전 기간 비교, 7일 추이와 분포 집계 |
| `inquiries.json` | 문의의 현재 상태, 유형, 연결된 주문·정책·Agent 실행 |
| `messages.json` | Gmail thread에 포함되는 수신·발신 메시지 |
| `orders.json` | 고객과 주문 상품 정보 |
| `shipments.json` | 주문별 Mock 배송 조회 결과 |
| `policies.json` | 정책 문서와 불변 버전 |
| `agent-runs.json` | LangGraph checkpoint, 재개 횟수, Tool 호출, AI 초안 |

## 데이터 관계

```text
inquiry 1 ─ N messages
inquiry N ─ 0..1 order
inquiry N ─ N order candidates
order   1 ─ 1 shipment
inquiry 1 ─ 1 active agent run
inquiry N ─ N policy versions
```

각 파일은 ID로 연결합니다. 예를 들어 `inquiries.json`의 `order_id`는
`orders.json`의 `id`를, `active_agent_run_id`는 `agent-runs.json`의 `id`를
참조합니다. 주문이 아직 확정되지 않은 문의는 `order_id`가 `null`이고
`order_candidate_ids`에 후보 주문 ID가 들어갑니다.

## 포함된 시나리오

1. `inq_delivery_auto_sent`: 주문·배송·정책 조회 성공 후 배송 답변 자동 발송
2. `inq_exchange_waiting_customer`: 교환 필수정보를 요청하고 고객 회신 대기
3. `inq_exchange_resumed`: 같은 Gmail thread의 회신으로 checkpoint를 재개하고 승인 대기
4. `inq_refund_waiting_approval`: 배송 지연 환불 요청을 운영자 승인으로 전환
5. `inq_multiple_orders`: 이메일로 여러 주문이 검색되어 운영자가 주문 선택
6. `inq_shipment_tool_failed`: 배송 Tool을 두 번 시도한 뒤 실패하여 재시도 필요

## 상태 규칙

| 사용자 상태 | 허용되는 내부 단계 |
| --- | --- |
| `IN_PROGRESS` | `ANALYZING`, `WAITING_CUSTOMER`, `SENDING` |
| `ACTION_REQUIRED` | `WAITING_APPROVAL`, `MANUAL_REQUIRED`, `FAILED` |
| `COMPLETED` | `DONE` |

`completion_type`은 완료된 문의에서만 사용하며 `AUTO_SENT`,
`APPROVED_SENT`, `MANUAL_SENT` 중 하나입니다.

## 프론트엔드 사용 방식

대시보드는 `dashboard.json`을 집계 API 응답처럼 사용합니다. 대시보드의
확인 필요 목록은 `attention_inquiry_ids`를 이용해 `inquiries.json`의 상세
문의와 연결합니다.

문의 목록 화면은 `inquiries.json`을 기준으로 표시합니다. 상세 화면에서는 선택한
문의 ID와 연결되는 메시지, 주문, 배송, 정책 버전, Agent 실행을 각 파일에서
조합합니다. 아직 실제 API 계약은 아니므로 프론트 타입을 정의할 때 이 구조를
기준으로 삼고, Supabase 스키마 확정 시 필드명을 다시 대조합니다.

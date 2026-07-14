# Initial architecture

## Responsibilities

- `frontend`: 문의 관리와 Agent 실행 상태를 표시하는 Next.js 애플리케이션
- `backend`: Gmail, RAG, LangGraph 실행을 연결하는 FastAPI 애플리케이션
- `Supabase PostgreSQL`: 주문, 문의, 실행 상태, 정책 metadata 저장
- `pgvector`: 정책 chunk embedding 저장과 유사도 검색
- `LangSmith`: Agent 노드와 Tool 실행 trace 확인

## First vertical slice

1. Mock 문의 한 건을 불러온다.
2. 고객 이메일 또는 주문번호로 주문을 조회한다.
3. 문의와 관련된 정책 문서를 검색한다.
4. 주문정보와 정책 근거가 포함된 답변 초안을 만든다.
5. 문의 상세 화면에 이메일, 주문, 정책, 답변, 실행 상태를 표시한다.


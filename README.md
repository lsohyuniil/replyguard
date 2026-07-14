# RAG Email Support Agent

Gmail로 접수된 고객 문의를 주문정보와 정책 문서를 바탕으로 처리하는 AI Agent 프로젝트입니다.

## Workspace

```text
.
├── frontend/        # Next.js 관리 화면
├── backend/         # FastAPI, LangChain, LangGraph
├── data/
│   ├── policies/    # RAG 정책 문서
│   └── seeds/       # 주문·문의 Mock 데이터
└── docs/            # 설계와 개발 기록
```

## Run frontend

```bash
cd frontend
npm run dev
```

## Run backend

Python 3.11 이상을 사용합니다.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

서버가 실행되면 `GET http://localhost:8000/health`에서 상태를 확인할 수 있습니다.

## Initial MVP

- 문의함, 문의 상세, 승인함, AI 작업 기록, 대시보드
- Supabase PostgreSQL + pgvector 기반 주문·정책 데이터
- LangGraph 기반 자동 발송·담당자 확인 분기
- Gmail API 기반 문의 수신과 답장
- LangSmith 기반 실행 추적


# ReplyGuard Agent Instructions

## Project overview

ReplyGuard는 Gmail 고객 문의를 주문·배송 정보와 정책 문서를 기반으로 처리하는 AI 고객지원 관리자 서비스다.

- `frontend/`: Next.js 관리자 화면
- `backend/`: FastAPI, LangGraph, Gmail 및 Supabase 연동
- `data/`: Mock 데이터와 RAG 정책 문서
- `docs/`: 기획, 설계, 개발 문서

## General rules

- 작업 전에 현재 코드와 관련 문서를 먼저 확인한다.
- 기존 구조와 명명 규칙을 우선하며, 같은 역할의 코드나 컴포넌트를 중복 생성하지 않는다.
- 요청 범위를 벗어난 리팩터링이나 의존성 추가는 하지 않는다.
- 새로운 패키지가 필요하면 설치하기 전에 사용자에게 이유와 대안을 설명한다.
- 실제 `.env` 파일은 읽거나 수정하거나 커밋하지 않는다.
- 비밀 키, OAuth token, 고객 개인정보를 코드·fixture·로그에 포함하지 않는다.
- Mock 개인정보는 `example.com` 이메일과 명백한 가상 값을 사용한다.
- 사용자가 요청하지 않았다면 커밋, push, PR 생성은 하지 않는다.

## Next.js version

This is NOT the Next.js you know.

This project uses Next.js 16 and may contain breaking API, convention, and file-structure changes.

Before writing Next.js code:

1. Read the relevant guide in `frontend/node_modules/next/dist/docs/`.
2. Follow the installed version's documentation instead of relying on memory.
3. Heed all deprecation notices.

## Commands

### Frontend

```bash
cd frontend
npm run dev
npm run lint
npm run build
```

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

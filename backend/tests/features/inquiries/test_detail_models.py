from app.features.inquiries.detail_models import InquiryDetailResponse


def test_inquiry_detail_response_validates_related_data() -> None:
    detail = InquiryDetailResponse.model_validate(
        {
            "id": "30000000-0000-4000-8000-000000000003",
            "gmail_thread_id": "thread_exchange_resumed",
            "customer_name": "최유나",
            "customer_email": "yuna.choi@example.com",
            "subject": "셔츠를 다른 사이즈로 교환하고 싶습니다",
            "preview": "M 사이즈로 교환하고 싶습니다.",
            "intent": "EXCHANGE",
            "status": "ACTION_REQUIRED",
            "stage": "WAITING_APPROVAL",
            "completion_type": None,
            "collected_information": {
                "desired_size": "M",
                "worn_or_washed": False,
            },
            "required_action": {
                "type": "REVIEW_DRAFT",
                "label": "교환 답변 검토",
            },
            "received_at": "2026-07-16T02:10:00Z",
            "updated_at": "2026-07-16T03:02:12Z",
            "messages": [
                {
                    "id": "31000000-0000-4000-8000-000000000005",
                    "direction": "INBOUND",
                    "sender_name": "최유나",
                    "sender_email": "yuna.choi@example.com",
                    "body_text": "셔츠를 교환하고 싶습니다.",
                    "occurred_at": "2026-07-16T02:10:00Z",
                    "attachments": [],
                }
            ],
            "order": {
                "id": "10000000-0000-4000-8000-000000001003",
                "order_number": "RG-20260709-1003",
                "customer_email": "yuna.choi@example.com",
                "status": "COMPLETED",
                "ordered_at": "2026-07-09T01:00:00Z",
                "currency": "KRW",
                "total_amount": 59000,
                "items": [
                    {
                        "id": "11000000-0000-4000-8000-000000001003",
                        "sku": "SHIRT-LINEN-L",
                        "name": "린넨 셔츠",
                        "quantity": 1,
                        "unit_price": 59000,
                    }
                ],
                "shipment": {
                    "id": "12000000-0000-4000-8000-000000001003",
                    "carrier": "CJ대한통운",
                    "tracking_number": "555000000003",
                    "status": "DELIVERED",
                    "shipped_at": "2026-07-10T01:00:00Z",
                    "estimated_delivery_at": "2026-07-12T09:00:00Z",
                    "delivered_at": "2026-07-12T03:00:00Z",
                    "latest_event": "배송 완료",
                },
            },
            "order_candidates": [],
            "policies": [
                {
                    "policy_id": "20000000-0000-4000-8000-000000000002",
                    "category": "EXCHANGE",
                    "title": "의류 교환 정책",
                    "version_id": "21000000-0000-4000-8000-000000000002",
                    "version": 2,
                    "status": "ACTIVE",
                    "content": "교환 정책 원문",
                    "published_at": "2026-07-02T00:00:00Z",
                    "chunks": [
                        {
                            "id": "22000000-0000-4000-8000-000000000002",
                            "chunk_index": 0,
                            "content": "교환 가능 조건",
                            "metadata": {"section": "교환 가능 조건"},
                        }
                    ],
                }
            ],
            "agent_run": {
                "id": "40000000-0000-4000-8000-000000000003",
                "status": "INTERRUPTED",
                "step_count": 8,
                "resume_count": 1,
                "error_code": None,
                "started_at": "2026-07-16T02:10:01Z",
                "resumed_at": "2026-07-16T03:02:01Z",
                "finished_at": None,
            },
            "answer_draft": {
                "id": "41000000-0000-4000-8000-000000000002",
                "version": 1,
                "ai_content": "교환 접수를 안내드리겠습니다.",
                "final_content": None,
                "evidence": [],
                "status": "WAITING_APPROVAL",
                "created_at": "2026-07-16T03:02:10Z",
            },
        }
    )

    assert detail.order is not None
    assert detail.order.shipment is not None
    assert detail.order.shipment.status == "DELIVERED"
    assert detail.policies[0].chunks[0].chunk_index == 0
    assert detail.answer_draft is not None
    assert detail.answer_draft.status == "WAITING_APPROVAL"

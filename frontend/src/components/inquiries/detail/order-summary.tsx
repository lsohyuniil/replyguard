import LocalShippingIcon from "@mui/icons-material/LocalShippingRounded";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagRounded";
import { DetailSection } from "@/components/inquiries/detail/detail-section";
import {
  formatCurrency,
  formatDetailDateTime,
} from "@/lib/inquiries/detail-formatters";
import type { InquiryOrder } from "@/lib/inquiries";

const orderStatusLabels = {
  PENDING: "결제 대기",
  PAID: "결제 완료",
  SHIPPED: "배송 중",
  COMPLETED: "주문 완료",
  CANCELLED: "주문 취소",
};

const shipmentStatusLabels = {
  READY: "배송 준비",
  IN_TRANSIT: "배송 중",
  DELIVERED: "배송 완료",
  DELAYED: "배송 지연",
  LOOKUP_FAILED: "배송 조회 실패",
};

export function OrderSummary({
  order,
  candidates,
}: {
  order: InquiryOrder | null;
  candidates: InquiryOrder[];
}) {
  return (
    <DetailSection
      title="주문·배송 정보"
      icon={<ShoppingBagIcon className="size-5 text-accent" />}
    >
      {order ? (
        <OrderContent order={order} />
      ) : candidates.length > 0 ? (
        <div>
          <p className="text-sm font-semibold text-warning">
            연결할 주문을 확인해야 합니다.
          </p>
          <ul className="mt-4 space-y-3">
            {candidates.map((candidate) => (
              <li
                key={candidate.id}
                className="rounded-xl bg-surface-muted p-4"
              >
                <p className="font-bold text-foreground">
                  {candidate.order_number}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {candidate.items.map((item) => item.name).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-muted-foreground">
          연결된 주문이 없습니다.
        </p>
      )}
    </DetailSection>
  );
}

function OrderContent({ order }: { order: InquiryOrder }) {
  return (
    <div className="space-y-5">
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">주문번호</dt>
          <dd className="mt-1 font-bold text-foreground">
            {order.order_number}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">주문 상태</dt>
          <dd className="mt-1 font-bold text-foreground">
            {orderStatusLabels[order.status]}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">주문일</dt>
          <dd className="mt-1 font-semibold text-foreground">
            {formatDetailDateTime(order.ordered_at)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">결제 금액</dt>
          <dd className="mt-1 font-semibold text-foreground">
            {formatCurrency(order.total_amount, order.currency)}
          </dd>
        </div>
      </dl>

      <ul className="space-y-2 border-t border-border pt-4">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 text-sm">
            <div>
              <p className="font-semibold text-foreground">{item.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.sku} · {item.quantity}개
              </p>
            </div>
            <span className="shrink-0 font-semibold text-foreground">
              {formatCurrency(
                item.unit_price * item.quantity,
                order.currency,
              )}
            </span>
          </li>
        ))}
      </ul>

      {order.shipment && (
        <div className="rounded-xl bg-surface-muted p-4">
          <div className="flex items-center gap-2">
            <LocalShippingIcon className="size-5 text-accent" />
            <p className="font-bold text-foreground">
              {shipmentStatusLabels[order.shipment.status]}
            </p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {order.shipment.carrier} · {order.shipment.tracking_number}
          </p>
          {order.shipment.latest_event && (
            <p className="mt-2 text-sm text-foreground">
              {order.shipment.latest_event}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

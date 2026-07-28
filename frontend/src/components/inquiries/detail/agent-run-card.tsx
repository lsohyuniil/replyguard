import SmartToyIcon from "@mui/icons-material/SmartToyRounded";
import { DetailSection } from "@/components/inquiries/detail/detail-section";
import { formatDetailDateTime } from "@/lib/inquiries/detail-formatters";
import type { InquiryDetailResponse } from "@/lib/inquiries";

type AgentRun = InquiryDetailResponse["agent_run"];

const agentStatusLabels = {
  RUNNING: "실행 중",
  INTERRUPTED: "대기 중",
  COMPLETED: "실행 완료",
  FAILED: "실행 실패",
};

export function AgentRunCard({ agentRun }: { agentRun: AgentRun }) {
  return (
    <DetailSection
      title="Agent 실행"
      icon={<SmartToyIcon className="size-5 text-accent" />}
    >
      {!agentRun ? (
        <p className="text-sm text-muted-foreground">
          연결된 Agent 실행 정보가 없습니다.
        </p>
      ) : (
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">실행 상태</dt>
            <dd className="mt-1 font-bold text-foreground">
              {agentStatusLabels[agentRun.status]}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">실행 단계</dt>
            <dd className="mt-1 font-bold text-foreground">
              {agentRun.step_count}/12
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">재개 횟수</dt>
            <dd className="mt-1 font-semibold text-foreground">
              {agentRun.resume_count}회
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">시작 시각</dt>
            <dd className="mt-1 font-semibold text-foreground">
              {formatDetailDateTime(agentRun.started_at)}
            </dd>
          </div>
          {agentRun.error_code && (
            <div className="col-span-2 rounded-xl bg-danger-soft p-3">
              <dt className="text-xs font-bold text-danger">오류 코드</dt>
              <dd className="mt-1 font-mono text-xs text-foreground">
                {agentRun.error_code}
              </dd>
            </div>
          )}
        </dl>
      )}
    </DetailSection>
  );
}

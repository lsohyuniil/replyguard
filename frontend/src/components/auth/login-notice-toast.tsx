"use client";

import { useEffect } from "react";
import { Toast } from "@/components/ui/toast";

export function LoginNoticeToast({ message }: { message: string }) {
  useEffect(() => {
    window.history.replaceState(null, "", "/login");
  }, []);

  return <Toast message={message} />;
}


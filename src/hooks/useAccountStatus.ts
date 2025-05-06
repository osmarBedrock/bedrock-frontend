import { useState } from "react";

type AccountStatus = "inactive" | "active" | "pending";

export function useAccountStatus() {
  // Estado hardcodeado
  const [status, setStatus] = useState<AccountStatus>("active");

  return { status, setStatus };
}
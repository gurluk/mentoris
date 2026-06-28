import { PropsWithChildren } from "react";

import AuthLayout from "@/components/layout/AuthLayout";

export default function AuthPagesLayout({ children }: PropsWithChildren) {
  return <AuthLayout>{children}</AuthLayout>;
}

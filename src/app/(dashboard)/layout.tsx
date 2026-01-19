import * as React from "react";

// This file is intentionally left minimal to resolve a route conflict.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

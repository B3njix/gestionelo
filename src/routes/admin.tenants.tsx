import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/tenants")({
  component: TenantsLayout,
});

function TenantsLayout() {
  return <Outlet />;
}

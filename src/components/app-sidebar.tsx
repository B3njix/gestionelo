import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, CalendarDays, PackageSearch, FileText,
  CalendarRange, Boxes, BarChart3, Sparkles,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";

const items = [
  { title: "Panel Principal", url: "/", icon: LayoutDashboard, exact: true },
  { title: "Clientes (CRM)", url: "/clientes", icon: Users },
  { title: "Eventos", url: "/eventos", icon: CalendarDays },
  { title: "Catálogo", url: "/catalogo", icon: PackageSearch },
  { title: "Cotizaciones", url: "/cotizaciones", icon: FileText },
  { title: "Calendario", url: "/calendario", icon: CalendarRange },
  { title: "Inventario", url: "/inventario", icon: Boxes },
  { title: "Reportes", url: "/reportes", icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-md"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">Gestionelo</span>
            <span className="text-[11px] text-muted-foreground">Eventos & Decoración</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operaciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.exact)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:hidden">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">SA</div>
          <div className="flex flex-col text-xs leading-tight">
            <span className="font-medium">Sofía Aguilar</span>
            <span className="text-muted-foreground">Administradora</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
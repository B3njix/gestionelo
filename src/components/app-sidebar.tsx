import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  PackageSearch,
  FileText,
  CalendarRange,
  Boxes,
  BarChart3,
  Sparkles,
  Building2,
  Shield,
  Sun,
  Moon,
  Bell,
  LogOut,
  Pin,
  PinOff,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";

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

const adminItems = [
  { title: "Panel Admin", url: "/admin", icon: Shield, exact: true },
  { title: "Tenants", url: "/admin/tenants", icon: Building2 },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const { user, tenantId, isSuperAdmin, signOut } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { setOpen, state } = useSidebar();
  const [pinned, setPinned] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar-pinned") === "true";
  });
  const hoverRef = useRef(false);

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const userName = (user?.user_metadata?.name as string | undefined) ?? user?.email ?? "Usuario";
  const userInitials = userName.substring(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.navigate({ to: "/login" });
  };

  const handlePinToggle = useCallback(() => {
    setPinned((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-pinned", String(next));
      if (next) {
        setOpen(true);
      } else if (!hoverRef.current) {
        setOpen(false);
      }
      return next;
    });
  }, [setOpen]);

  const handleMouseEnter = useCallback(() => {
    hoverRef.current = true;
    if (!pinned) setOpen(true);
  }, [pinned, setOpen]);

  const handleMouseLeave = useCallback(() => {
    hoverRef.current = false;
    if (!pinned) setOpen(false);
  }, [pinned, setOpen]);

  return (
    <Sidebar collapsible="icon" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url, item.exact)}
                    tooltip={item.title}
                  >
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
        {isSuperAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url, item.exact)}
                      tooltip={item.title}
                    >
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
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handlePinToggle}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              pinned && "bg-accent text-accent-foreground",
            )}
            title={pinned ? "Desfijar sidebar" : "Fijar sidebar abierta"}
          >
            {pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </button>
          <button
            onClick={toggleTheme}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title={resolvedTheme === "dark" ? "Modo claro" : "Modo oscuro"}
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold" />
          </button>
          <button
            onClick={handleSignOut}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 px-1 group-data-[collapsible=icon]:hidden">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
              {userInitials}
            </div>
            <div className="flex flex-col text-xs leading-tight">
              <span className="font-medium truncate max-w-[120px]">{userName}</span>
              <span className="text-muted-foreground">
                {isSuperAdmin
                  ? "Super Admin"
                  : tenantId
                    ? `Tenant: ${tenantId.substring(0, 8)}...`
                    : "Cargando..."}
              </span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

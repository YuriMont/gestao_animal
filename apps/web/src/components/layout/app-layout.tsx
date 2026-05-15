import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import {
  BarChart3,
  Beef,
  DollarSign,
  Heart,
  LayoutDashboard,
  Leaf,
  Menu,
  Stethoscope,
} from "lucide-react";
import type * as React from "react";
import { useEffect, useState } from "react";
import { initialAuthAtom, isAuthenticatedAtom } from "@/atoms/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./app-sidebar";

const mobileNavItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Animais", href: "/animals", icon: Beef },
  { label: "Saúde", href: "/health", icon: Stethoscope },
  { label: "Reprodução", href: "/reproduction", icon: Heart },
  { label: "Produção", href: "/production", icon: BarChart3 },
  { label: "Financeiro", href: "/financial", icon: DollarSign },
] as const;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const initialAuth = useAtomValue(initialAuthAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const navigate = useNavigate();

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady && !initialAuth) {
      navigate({ to: "/login" });
    }
  }, [isReady, initialAuth, navigate]);

  if (!isReady) return null;
  if (!initialAuth) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 border-b bg-sidebar text-sidebar-foreground safe-bottom">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Leaf className="size-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-base font-bold">AgroGestão</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="touch-target text-sidebar-foreground"
              aria-label="Abrir menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 sm:w-80">
            <AppSidebar mobile />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-16 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border safe-bottom"
        aria-label="Navegação principal"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map(({ label, href, icon: Icon }) => (
            <MobileNavItem key={href} href={href} label={label} icon={Icon} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function MobileNavItem({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";
  const isActive =
    href === "/" ? currentPath === "/" : currentPath.startsWith(href);

  return (
    <a
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-lg transition-colors touch-target min-w-[56px]",
        isActive
          ? "text-sidebar-primary"
          : "text-sidebar-foreground/60 hover:text-sidebar-foreground",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="size-5" />
      <span className="text-[10px] font-medium leading-tight">{label}</span>
    </a>
  );
}

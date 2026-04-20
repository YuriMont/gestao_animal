import { logoutAtom, userAtom } from "@/atoms/auth";
import { sidebarCollapsedAtom } from "@/atoms/sidebar";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import {
	BarChart3,
	Beef,
	Bell,
	DollarSign,
	Heart,
	LayoutDashboard,
	Leaf,
	LogOut,
	PanelLeftClose,
	PanelLeftOpen,
	Stethoscope,
} from "lucide-react";

const navItems = [
	{ label: "Dashboard", href: "/", icon: LayoutDashboard },
	{ label: "Animais", href: "/animals", icon: Beef },
	{ label: "Saúde", href: "/health", icon: Stethoscope },
	{ label: "Reprodução", href: "/reproduction", icon: Heart },
	{ label: "Produção", href: "/production", icon: BarChart3 },
	{ label: "Financeiro", href: "/financial", icon: DollarSign },
	{ label: "Alertas", href: "/alerts", icon: Bell },
] as const;

export function AppSidebar({ mobile = false }: { mobile?: boolean }) {
	const user = useAtomValue(userAtom);
	const logout = useSetAtom(logoutAtom);
	const isCollapsed = useAtomValue(sidebarCollapsedAtom);
	const setCollapsed = useSetAtom(sidebarCollapsedAtom);
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	return (
		<aside
			className={cn(
				"flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
				// Mobile: sempre visível, sem esconder
				mobile && "w-full h-full",
				// Desktop: escondido em mobile, flex em lg+
				!mobile && "hidden lg:flex h-screen",
				// Desktop collapsed state
				!mobile && !isCollapsed && "w-60",
				!mobile && isCollapsed && "w-16",
			)}
		>
			{/* Logo Section */}
			<div
				className={cn(
					"flex items-center px-6 py-5 border-b border-sidebar-border shrink-0",
					!mobile && isCollapsed && "justify-center px-0",
					mobile && "px-4",
				)}
			>
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary shrink-0">
					<Leaf className="size-4 text-sidebar-primary-foreground" />
				</div>
				{/* Mobile: sempre mostra texto */}
				{/* Desktop: mostra apenas se não collapsed */}
				{(mobile || !isCollapsed) && (
					<span className="ml-2 text-lg font-bold text-sidebar-foreground truncate">
						AgroGestão
					</span>
				)}
			</div>

			{/* Navigation */}
			<nav className="flex-1 overflow-y-auto px-3 py-4">
				<ul className="flex flex-col gap-1">
					{navItems.map(({ label, href, icon: Icon }) => {
						const isActive =
							href === "/" ? currentPath === "/" : currentPath.startsWith(href);
						return (
							<li key={href}>
								<Link
									to={href}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
										isActive
											? "bg-sidebar-primary text-sidebar-primary-foreground"
											: "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
										// Desktop collapsed: centraliza ícone
										!mobile && isCollapsed && "justify-center px-2",
										// Mobile: alinhamento normal
										mobile && "justify-start",
									)}
								>
									<Icon className="size-4 shrink-0" />
									{/* Mobile: sempre mostra texto */}
									{/* Desktop: mostra apenas se não collapsed */}
									{(mobile || !isCollapsed) && <span>{label}</span>}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* User Info & Logout */}
			<div className="border-t border-sidebar-border p-4 shrink-0">
				{/* User Info - Esconder no desktop collapsed */}
				{(mobile || !isCollapsed) && (
					<div className="mb-3 px-1">
						<p className="text-sm font-medium text-sidebar-foreground truncate">
							{user?.name ?? "Usuário"}
						</p>
						<p className="text-xs text-sidebar-foreground/50 truncate">
							{user?.email ?? ""}
						</p>
					</div>
				)}

				{/* Logout Button */}
				<button
					type="button"
					onClick={logout}
					className={cn(
						"flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full",
						!mobile && isCollapsed && "justify-center px-2",
						mobile && "justify-start",
					)}
				>
					<LogOut className="size-4 shrink-0" />
					{(mobile || !isCollapsed) && <span>Sair</span>}
				</button>
			</div>

			{/* Collapse Toggle - Desktop only */}
			{!mobile && (
				<button
					type="button"
					onClick={() => setCollapsed(!isCollapsed)}
					className="flex items-center justify-center p-4 border-t border-sidebar-border text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors shrink-0"
				>
					{isCollapsed ? (
						<PanelLeftOpen className="size-5" />
					) : (
						<PanelLeftClose className="size-5" />
					)}
				</button>
			)}
		</aside>
	);
}

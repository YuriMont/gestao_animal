import { Link, useRouterState } from "@tanstack/react-router"
import {
	BarChart3,
	Bell,
	DollarSign,
	Heart,
	LayoutDashboard,
	Leaf,
	LogOut,
	Stethoscope,
	Beef,
} from "lucide-react"
import { useAtomValue, useSetAtom } from "jotai"
import { userAtom, logoutAtom } from "@/atoms/auth"
import { cn } from "@/lib/utils"

const navItems = [
	{ label: "Dashboard", href: "/", icon: LayoutDashboard },
	{ label: "Animais", href: "/animals", icon: Beef },
	{ label: "Saúde", href: "/health", icon: Stethoscope },
	{ label: "Reprodução", href: "/reproduction", icon: Heart },
	{ label: "Produção", href: "/production", icon: BarChart3 },
	{ label: "Financeiro", href: "/financial", icon: DollarSign },
	{ label: "Alertas", href: "/alerts", icon: Bell },
] as const

export function AppSidebar() {
	const user = useAtomValue(userAtom)
	const logout = useSetAtom(logoutAtom)
	const routerState = useRouterState()
	const currentPath = routerState.location.pathname

	return (
		<aside className="flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground">
			<div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
					<Leaf className="size-4 text-sidebar-primary-foreground" />
				</div>
				<span className="text-lg font-bold text-sidebar-foreground">AgroGestão</span>
			</div>

			<nav className="flex-1 overflow-y-auto px-3 py-4">
				<ul className="flex flex-col gap-1">
					{navItems.map(({ label, href, icon: Icon }) => {
						const isActive = href === "/" ? currentPath === "/" : currentPath.startsWith(href)
						return (
							<li key={href}>
								<Link
									to={href}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
										isActive
											? "bg-sidebar-primary text-sidebar-primary-foreground"
											: "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
									)}
								>
									<Icon className="size-4 shrink-0" />
									{label}
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>

			<div className="border-t border-sidebar-border p-4">
				<div className="mb-3 px-1">
					<p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name ?? "Usuário"}</p>
					<p className="text-xs text-sidebar-foreground/50 truncate">{user?.email ?? ""}</p>
				</div>
				<button
					type="button"
					onClick={logout}
					className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
				>
					<LogOut className="size-4" />
					Sair
				</button>
			</div>
		</aside>
	)
}

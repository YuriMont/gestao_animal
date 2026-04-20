import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { Leaf } from "lucide-react";
import type * as React from "react";
import { useEffect } from "react";
import { isAuthenticatedAtom } from "@/atoms/auth";
import { AppSidebar } from "./app-sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
	const isAuthenticated = useAtomValue(isAuthenticatedAtom);
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate({ to: "/login" });
		}
	}, [isAuthenticated, navigate]);

	if (!isAuthenticated) return null;

	return (
		<div className="flex h-screen overflow-hidden bg-background">
			<div className="lg:hidden flex items-center p-4 border-b bg-sidebar text-sidebar-foreground">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
					<Leaf className="size-4 text-sidebar-primary-foreground" />
				</div>
				<span className="ml-2 text-lg font-bold">AgroGestão</span>
			</div>
			<AppSidebar />
			<main className="flex-1 overflow-y-auto">
				<div className="lg:hidden flex justify-end p-4">
					{/* Botão para abrir sidebar mobile pode ser adicionado aqui */}
				</div>
				{children}
			</main>
		</div>
	);
}

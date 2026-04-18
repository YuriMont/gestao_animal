import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
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
			<AppSidebar />
			<main className="flex-1 overflow-y-auto">{children}</main>
		</div>
	);
}

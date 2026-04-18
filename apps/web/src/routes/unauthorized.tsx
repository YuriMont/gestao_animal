import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { AlertCircle, LogOut, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { isAuthenticatedAtom, logoutAtom } from "@/atoms/auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/unauthorized")({
	component: UnauthorizedPage,
});

function UnauthorizedPage() {
	const isAuthenticated = useAtomValue(isAuthenticatedAtom);
	const logout = useSetAtom(logoutAtom);

	useEffect(() => {
		if (isAuthenticated) redirect({ to: "/" });
	}, [isAuthenticated]);

	return (
		<div className="min-h-screen bg-muted/40 flex items-center justify-center">
			<div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-300">
				<div className="flex flex-col items-center text-center gap-4">
					<AlertCircle className="size-12 text-muted-foreground" />
					<h1 className="text-2xl font-bold tracking-tight">Acceso Negado</h1>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Parece que você não tem permissão para acessar este recurso.
					</p>
					<div className="flex flex-col gap-2 w-full">
						<Button className="w-full group" onClick={logout}>
							<LogOut className="mr-2 size-4 transition-transform group-hover:rotate-45" />
							Fazer Login
						</Button>

						<Link
							to="/"
							className="w-full flex items-center justify-center gap-2 text-muted-foreground cursor-pointer hover:text-foreground"
						>
							<RefreshCw className="size-4" />
							Tentar Nova ACESSO
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Route;

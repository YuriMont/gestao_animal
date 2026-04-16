import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => (
		<>
			<h1>App</h1>
			<Outlet />
		</>
	),
});

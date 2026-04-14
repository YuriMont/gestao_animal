import { createRouter } from "@tanstack/react-router";
import { animalsRoute } from "./routes/animals";
import { indexRoute } from "./routes/index";
import { rootRoute } from "./routes/root";
import { settingsRoute } from "./routes/settings";
import { usersRoute } from "./routes/users";

export const router = createRouter({
	routeTree: rootRoute.addChildren([
		indexRoute,
		animalsRoute,
		usersRoute,
		settingsRoute,
	]),
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

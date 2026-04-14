import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { DashboardPage } from "@/pages/DashboardPage";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

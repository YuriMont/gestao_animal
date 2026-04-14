import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { SettingsPage } from "@/pages/SettingsPage";

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

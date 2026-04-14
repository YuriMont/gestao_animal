import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { AnimalsPage } from "@/pages/AnimalsPage";

export const animalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/animals",
  component: AnimalsPage,
});

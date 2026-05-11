import { Link } from "@tanstack/react-router";
import { Beef, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetV1Animals } from "@/gen/hooks/animalsController/useGetV1Animals";
import { cn } from "@/lib/utils";

function statusBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" | "success" | "warning" | "outline" {
  const variants: Record<
    string,
    "default" | "secondary" | "destructive" | "success" | "warning" | "outline"
  > = {
    ACTIVE: "success",
    INACTIVE: "warning",
    QUARANTINE: "warning",
    SOLD: "secondary",
    DECEASED: "destructive",
  };
  return variants[status] ?? "outline";
}

export function RecentAnimals() {
  const animalsQuery = useGetV1Animals({ limit: 8, page: 1 });
  const animals = animalsQuery.data?.data ?? [];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-base">Rebanho</CardTitle>
          <Link
            to="/animals"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Ver todos
            <ChevronRight className="size-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {animalsQuery.isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-20 sm:h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : animals.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 sm:py-12 px-4 text-muted-foreground">
            <div className="p-3 sm:p-4 rounded-2xl bg-muted">
              <Beef className="size-7 sm:size-8" />
            </div>
            <p className="text-sm font-medium">Nenhum animal cadastrado</p>
            <p className="text-xs">Comece adicionando animais ao seu rebanho</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4">
            {animals.map((animal, index) => (
              <div
                key={animal.id}
                className={cn(
                  "group relative p-3 sm:p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-200 cursor-pointer",
                  "animate-slide-up",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                  <span className="font-mono font-semibold text-xs sm:text-sm">
                    {animal.tag}
                  </span>
                  <Badge
                    variant={statusBadgeVariant(animal.status.key)}
                    className="text-[9px] sm:text-[10px] px-1 py-0"
                  >
                    {animal.status.label}
                  </Badge>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {animal.species.label}
                  </p>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span
                      className={cn(
                        "text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full",
                        animal.sex.key === "MALE"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-rose-500/10 text-rose-600",
                      )}
                    >
                      {animal.sex.key === "MALE" ? "M" : "F"}
                    </span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                      {animal.breed?.name ?? "—"}
                    </span>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

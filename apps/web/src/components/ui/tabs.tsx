import { Tabs } from "radix-ui"
import type * as React from "react"
import { cn } from "@/lib/utils"

function TabsRoot({ className, ...props }: React.ComponentProps<typeof Tabs.Root>) {
  return <Tabs.Root data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<typeof Tabs.List>) {
  return (
    <Tabs.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg p-1",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof Tabs.Trigger>) {
  return (
    <Tabs.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all",
        "focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof Tabs.Content>) {
  return (
    <Tabs.Content
      data-slot="tabs-content"
      className={cn("mt-2 focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-2", className)}
      {...props}
    />
  )
}

export { TabsRoot as Tabs, TabsList, TabsTrigger, TabsContent }

import { Separator } from "radix-ui"
import type * as React from "react"
import { cn } from "@/lib/utils"

function SeparatorUI({ className, orientation = "horizontal", decorative = true, ...props }: React.ComponentProps<typeof Separator.Root>) {
  return (
    <Separator.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
}

export { SeparatorUI as Separator }

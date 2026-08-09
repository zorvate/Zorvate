import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-[var(--radius-sm)] border border-border bg-surface-secondary/70 px-3 py-2 text-[11px] text-foreground placeholder:text-muted-foreground-2 transition-all duration-200 outline-none focus-visible:border-primary/60 focus-visible:ring-1 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-40 resize-y",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

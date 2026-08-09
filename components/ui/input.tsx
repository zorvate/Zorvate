import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full rounded-[var(--radius-sm)] border border-border bg-surface-secondary/70 px-3 py-1 text-[11px] text-foreground placeholder:text-muted-foreground-2 transition-all duration-200 outline-none focus-visible:border-primary/60 focus-visible:ring-1 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

export { Input }

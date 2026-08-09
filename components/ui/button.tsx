import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] border text-[10px] font-semibold uppercase tracking-[0.24em] transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default:
          "border-primary/45 bg-primary text-primary-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] hover:-translate-y-px hover:bg-primary/90 active:scale-[0.98]",
        engineering:
          "border-border bg-surface-secondary/80 text-foreground hover:border-border-hover hover:bg-surface-tertiary active:scale-[0.98]",
        outline:
          "border-border bg-transparent text-foreground hover:bg-surface/70 hover:border-border-hover active:scale-[0.98]",
        secondary:
          "border-border bg-surface-secondary/70 text-foreground hover:bg-surface-tertiary active:scale-[0.98]",
        ghost:
          "text-muted-foreground hover:bg-surface hover:text-foreground active:scale-[0.98] border border-transparent",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline lowercase tracking-normal font-normal border-0 bg-transparent p-0 h-auto",
      },
      size: {
        default: "h-9 px-4 gap-2",
        xs: "h-7 px-2.5 text-[10px] gap-1",
        sm: "h-8 px-3 text-[11px] gap-1.5",
        lg: "h-11 px-6 text-sm gap-2.5",
        icon: "size-9 p-0",
        "icon-xs": "size-7 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

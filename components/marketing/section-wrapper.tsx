import { cn } from "@/lib/utils";

type SectionWrapperProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  gridLines?: boolean;
};

export function SectionWrapper({
  children,
  className,
  id,
  gridLines = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full py-24 md:py-32 px-6 sm:px-8 lg:px-12 relative overflow-hidden",
        gridLines && "grid-pattern",
        className
      )}
    >
      <div className="mx-auto max-w-7xl relative z-10">{children}</div>
    </section>
  );
}
import { cn } from "@/lib/utils";

type SectionWrapperProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function SectionWrapper({
  children,
  className,
  id,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full py-20 px-4 md:py-28",
        className
      )}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
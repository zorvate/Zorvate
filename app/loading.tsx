export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background select-none text-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl border border-primary/20 bg-card flex items-center justify-center shadow-card">
          <span className="text-primary font-black text-2xl tracking-tighter">Z</span>
        </div>
        <div className="text-center space-y-1">
          <span className="text-[10px] font-black tracking-widest text-primary uppercase block">
            Loading Zorvate
          </span>
          <span className="text-[9px] font-medium text-muted-foreground font-mono block">
            preparing workspace
          </span>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F4F0] px-6 text-[#121316] selection:bg-[#FF4D00]/20 font-mono">
      <div className="max-w-md w-full border border-[#E0DDD6] bg-[#EFECE5]/40 p-8 space-y-6">
        <div className="flex items-center justify-between text-xs tracking-[0.18em] text-[#FF4D00] pb-4 border-b border-[#E0DDD6]">
          <span className="flex items-center gap-2">
            <span className="signal-dot" />
            <span>ERROR 404</span>
          </span>
          <span>SYSTEM / PAGE_NOT_FOUND</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight text-[#121316]">
            404
          </h1>
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#121316]">
            PAGE BOUNDARY NOT FOUND
          </h2>
          <p className="text-xs text-[#5C5D61] leading-relaxed pt-2">
            The requested route path does not exist in the Zorvate digital engineering system.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.14em] font-semibold bg-[#121316] text-[#F5F4F0] hover:bg-[#FF4D00] transition-colors duration-200"
          >
            <ArrowLeft className="size-3.5 text-[#FF4D00]" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

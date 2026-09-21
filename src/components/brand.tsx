import { cn } from "@/lib/utils";
import Image from "next/image";

export function Brand({ className }: { className?: string }) {
  return (
    <Image
      src="/mediawave-logo.png"
      width={256}
      height={256}
      alt="mediawave logo"
      className={cn("max-h-11 shrink-0 object-contain", className)}
    />
  );
}

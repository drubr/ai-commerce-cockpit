import { cn } from "@/lib/utils";
import Image from "next/image";

export function Brand({ className }: { className?: string }) {
  return (
    <Image
      src="/trodat_logo_de.png"
      width={256}
      height={256}
      alt="Trodat Logo DE"
      className={cn(className)}
    />
  );
}

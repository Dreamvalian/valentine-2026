import { cn } from "@/lib/utils";

interface PaperTextureProps {
  className?: string;
}

export default function PaperTexture({ className }: PaperTextureProps) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]", className)}>
      {/* Base Grain */}
      <div className="absolute inset-0 paper-grain" />
      
      {/* Subtle Fibers */}
      <div className="absolute inset-0 paper-fiber" />
      
      {/* Soft highlight/shadow for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/[0.02]" />
    </div>
  );
}

import Image from "next/image";
import { asset } from "@/lib/asset";

export function Thumb({
  src,
  alt,
  className,
  sizes = "64px",
  shadow = false,
}: {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  shadow?: boolean;
}) {
  return (
    <div
      className={`relative grid flex-none place-items-center border ${className ?? ""}`}
      style={{ background: "var(--img)", borderColor: "var(--ln)" }}
    >
      {src ? (
        <Image
          src={asset(src)}
          alt={alt}
          fill
          sizes={sizes}
          className="object-contain p-1"
          style={
            shadow
              ? { filter: "drop-shadow(-6px 3px 0 rgba(0,0,0,.45))" }
              : undefined
          }
        />
      ) : (
        <div className="hatch h-[72%] w-[30%]" />
      )}
    </div>
  );
}

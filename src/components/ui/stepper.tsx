"use client";

export function Stepper({
  qty,
  onInc,
  onDec,
  onSet,
  size = "md",
  accentPlus = false,
}: {
  qty: number;
  onInc: () => void;
  onDec: () => void;
  onSet?: (qty: number) => void;
  size?: "sm" | "md";
  accentPlus?: boolean;
}) {
  const height = size === "sm" ? "h-[30px]" : "h-[34px]";
  const border = size === "sm" ? "1.5px solid var(--ink)" : "2px solid var(--ink)";
  const btn = size === "sm" ? "w-7 text-sm" : "w-[30px] text-base";

  return (
    <div
      className={`mono flex items-center ${height}`}
      style={{ border }}
    >
      <button
        onClick={onDec}
        className={`${btn} h-full cursor-pointer border-0 bg-transparent`}
        aria-label="−"
      >
        −
      </button>
      {onSet ? (
        <input
          value={qty}
          onChange={(e) => onSet(parseInt(e.target.value, 10))}
          inputMode="numeric"
          aria-label="Qty"
          className="h-full w-9 border-0 bg-transparent text-center text-xs font-semibold outline-0"
          style={{
            borderLeft: border,
            borderRight: border,
          }}
        />
      ) : (
        <span
          className="grid h-full min-w-[26px] place-items-center px-1 text-center text-xs font-semibold"
          style={{ borderLeft: border, borderRight: border }}
        >
          {qty}
        </span>
      )}
      <button
        onClick={onInc}
        className={`${btn} h-full cursor-pointer border-0`}
        style={
          accentPlus
            ? { background: "var(--ac)", color: "var(--act)" }
            : { background: "transparent" }
        }
        aria-label="+"
      >
        +
      </button>
    </div>
  );
}

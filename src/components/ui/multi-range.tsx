import React, { useMemo } from "react";
import { useRanger } from "react-ranger";

type MultiRangeProps = {
  values: number[];
  onChange: (v: number[]) => void;
  className?: string;
  max?: number;
};

const min = 0;
const maxValue = 100;
const tickCount = 5;
const absMin = 16; // used in clamp

export function MultiRange({
  values,
  onChange,
  className = "",
}: MultiRangeProps) {
  // clamp all numbers to the abs min
  const clamp = (n: number[]) => n.map((v) => Math.max(v, absMin));

  const { getTrackProps, ticks, segments, handles } = useRanger({
    min,
    max: maxValue,
    stepSize: 1,
    values,
    onChange: (numbers) => {
      onChange(clamp(numbers));
    },
  });

  // manual ticks (visual)
  const manualTicks =
    typeof tickCount === "number" && tickCount >= 2
      ? Array.from({ length: tickCount }).map((_, idx) => {
          const fraction = idx / (tickCount - 1);
          const value = Math.round(min + fraction * (maxValue - min));
          const left = `${fraction * 100}%`;
          return { value, left };
        })
      : null;

  // compute primary segments: read left/width percents from segment props
  const primaryInfo = useMemo(() => {
    const primaryRanges: { from: number; to: number; length: number }[] = [];

    segments.forEach(({ getSegmentProps }, i) => {
      // getSegmentProps may accept an object; we call it to retrieve style
      const props = getSegmentProps({ style: {} }) as any;
      const style = props?.style || {};

      // left and width can be strings like "25%" or numbers
      const leftRaw = style.left ?? style.leftPercent ?? props?.left;
      const widthRaw = style.width ?? style.widthPercent ?? props?.width;

      // fallback: if react-ranger encoded as transform/translate, try parse from props
      const parsePct = (v: any) => {
        if (typeof v === "string" && v.endsWith("%")) return parseFloat(v);
        if (typeof v === "number") return v;
        return null;
      };

      const leftPct = parsePct(leftRaw);
      const widthPct = parsePct(widthRaw);

      if (leftPct == null || widthPct == null) {
        // cannot compute — skip
        return;
      }

      // decide whether this segment is "primary" by the same logic you use for classes
      // Your class logic: i === 0 ? bg-secondary : i === segments.length - 1 ? ... : i % 2 === 0 ? bg-secondary : bg-primary
      // So primary occurs when: i % 2 === 1 && i !== segments.length -1
      const isPrimary =
        !(i === 0) && !(i === segments.length - 1) && i % 2 === 1;

      if (!isPrimary) return;

      const from = min + (leftPct / 100) * (maxValue - min);
      const to = from + (widthPct / 100) * (maxValue - min);
      const length = to - from;

      primaryRanges.push({ from, to, length });
    });

    const total = primaryRanges.reduce((s, r) => s + r.length, 0);

    return { primaryRanges, total };
  }, [segments]);

  const trackProps = getTrackProps({
    style: {
      position: "relative",
      width: "100%",
      height: 8,
    },
  });
  // Extract key from trackProps to avoid spreading it
  const { key, ...restTrackProps } = trackProps;

  return (
    <div className={`w-full ${className}`}>
      <div {...restTrackProps} className="relative w-full rounded-full">
        {/* ticks */}
        {manualTicks
          ? manualTicks.map((t, i) => (
              <div
                key={i}
                style={{ position: "absolute", left: t.left }}
                className="absolute"
              >
                <div
                  className="bg-gray-400"
                  style={{
                    width: 2,
                    height: 8,
                    transform: "translate(-50%, 24px)",
                  }}
                />
                <div
                  style={{ transform: "translate(-50%, 32px)" }}
                  className="text-xs text-gray-500 whitespace-nowrap"
                >
                  {t.value >= 0 ? t.value : 0}
                </div>
              </div>
            ))
          : ticks.map(({ value, getTickProps }, i) => {
              const { key, ...tickProps } = getTickProps({
                style: { position: "absolute" },
              });
              return (
                <div key={key} {...tickProps} className="absolute">
                  <div
                    className="bg-gray-400"
                    style={{
                      width: 2,
                      height: 8,
                      transform: "translate(-50%, 24px)",
                    }}
                  />
                  <div
                    style={{ transform: "translate(-50%, 32px)" }}
                    className="text-xs text-gray-500 whitespace-nowrap"
                  >
                    {value >= 0 ? value : 0}
                  </div>
                </div>
              );
            })}

        {/* segments */}
        {segments.map(({ getSegmentProps }, i) => {
          const segmentProps = getSegmentProps({
            style: { position: "absolute", height: "100%" },
          });
          // Extract key from segmentProps to avoid spreading it
          const { key, ...restSegmentProps } = segmentProps;

          return (
            <div
              key={i}
              {...restSegmentProps}
              className={`rounded-full ${
                i === 0
                  ? "bg-secondary"
                  : i === segments.length - 1
                  ? "bg-[#C1D9F6]"
                  : i % 2 === 0
                  ? "bg-secondary"
                  : "bg-primary"
              }`}
            />
          );
        })}

        {/* handles */}
        {handles.map(({ value, active, getHandleProps }, idx) => {
          const { key, ...handleProps } = getHandleProps({
            style: {
              position: "absolute",
              appearance: "none",
              border: "none",
              background: "transparent",
              outline: "none",
            },
          });
          return (
            <button key={key} {...handleProps} className="focus:outline-none">
              <div
                className={`bg-primary cursor-pointer flex items-center justify-center w-8 h-8 rounded-full text-xs text-white shadow-lg transform transition-all ${
                  active
                    ? "translate-y-[-100%] scale-110"
                    : "translate-y-0 scale-90"
                }`}
              >
                {value >= 0 ? value : 0}
              </div>
            </button>
          );
        })}
      </div>

      {/* legenda + wynik */}
      <div className="mt-16 flex flex-col gap-4">
        <div className="flex items-center gap-6">
          <LegendItem colorClass="bg-primary" label="Okres pracy" />
          <LegendItem colorClass="bg-secondary" label="Okres bez pracy" />
          <LegendItem colorClass="bg-[#C1D9F6]" label="Okres emerytalny" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({
  colorClass,
  label,
}: {
  colorClass: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`inline-block w-6 h-3 rounded-full ${colorClass} shadow-sm`}
        aria-hidden="true"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

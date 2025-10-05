import React, { useMemo } from "react";
import { Button } from "@/components/ui/button"; // Twój Button

type Range = { start: number; end: number; index: number; length: number };

function normalizePairs(values: number[]): Range[] {
  const ranges: Range[] = [];
  for (let i = 0; i < values.length; i += 2) {
    const a = values[i];
    const b = values[i + 1];
    if (typeof a === "number" && typeof b === "number") {
      const start = Math.min(a, b);
      const end = Math.max(a, b);
      ranges.push({ start, end, index: i / 2, length: end - start });
    }
  }
  return ranges;
}

export default function RangesPanel({
  values,
  setValues,
}: {
  values: number[];
  setValues: (v: number[]) => void;
}) {
  const ranges = useMemo(() => normalizePairs(values), [values]);
  const total = useMemo(
    () => ranges.reduce((s, r) => s + r.length, 0),
    [ranges],
  );

  const removeRange = (rangeIndex: number) => {
    // never remove last range
    if (ranges.length <= 1) return;

    const target = ranges[rangeIndex];
    if (!target) return;

    const idx = values.findIndex((v, i) => {
      if (i % 2 !== 0) return false;
      const a = values[i];
      const b = values[i + 1];
      if (typeof b !== "number") return false;
      const s = Math.min(a, b);
      const e = Math.max(a, b);
      return s === target.start && e === target.end;
    });

    if (idx === -1) {
      const pairIndex = 2 * rangeIndex;
      // if removing would leave zero pairs, don't do it
      if (values.length <= 2) return;
      const newVals = values.filter(
        (_, i) => i !== pairIndex && i !== pairIndex + 1,
      );
      setValues(newVals);
      return;
    }

    // safe remove (but protect last pair)
    if (values.length <= 2) return;
    const newValues = values.filter((_, i) => i !== idx && i !== idx + 1);
    setValues(newValues);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-3">Zakresy pracy</h3>

      <div className="flex flex-col gap-3">
        {ranges.length === 0 && (
          <div className="text-sm text-gray-500">Brak zakresów</div>
        )}

        {ranges.map((r, idx) => {
          const isOnlyOne = ranges.length === 1;
          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded"
            >
              <div>
                <div className="text-sm text-gray-600">Zakres #{idx + 1}</div>
                <div className="text-base font-medium">
                  {r.start} — {r.end} ({r.length} lat)
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  onClick={() => removeRange(idx)}
                  disabled={isOnlyOne}
                  title={
                    isOnlyOne
                      ? "Musisz zostawić przynajmniej jeden zakres"
                      : "Usuń zakres"
                  }
                >
                  Usuń
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <div className="text-sm text-gray-600">Łączny okres pracy</div>
        <div className="text-2xl font-semibold">{total} lat</div>
      </div>
    </div>
  );
}

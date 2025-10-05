import React, { useMemo, useState } from "react";
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
  onAddToChat,
}: {
  values: number[];
  setValues: (v: number[]) => void;
  onAddToChat?: (message: string) => void;
}) {
  const ranges = useMemo(() => normalizePairs(values), [values]);
  const total = useMemo(
    () => ranges.reduce((s, r) => s + r.length, 0),
    [ranges]
  );
  const [rangeSelections, setRangeSelections] = useState<
    Record<string, string>
  >({});

  const gaps = useMemo(() => {
    if (ranges.length <= 1) return [];

    const sortedRanges = [...ranges].sort((a, b) => a.start - b.start);
    const gaps: { start: number; end: number; length: number }[] = [];

    for (let i = 0; i < sortedRanges.length - 1; i++) {
      const currentEnd = sortedRanges[i].end;
      const nextStart = sortedRanges[i + 1].start;

      if (nextStart > currentEnd) {
        gaps.push({
          start: currentEnd,
          end: nextStart,
          length: nextStart - currentEnd,
        });
      }
    }

    return gaps;
  }, [ranges]);

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
        (_, i) => i !== pairIndex && i !== pairIndex + 1
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

        {[...ranges]
          .sort((a, b) => a.start - b.start)
          .map((r, idx, sortedRanges) => {
            const isOnlyOne = ranges.length === 1;
            const originalIndex = ranges.findIndex(
              (orig) => orig.start === r.start && orig.end === r.end
            );

            return (
              <React.Fragment key={`${r.start}-${r.end}`}>
                <div className="flex items-center justify-between gap-3 bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-sm text-green-600">
                        Praca #{idx + 1}
                      </div>
                      <div className="text-base font-medium">
                        {r.start} — {r.end} ({r.length} lat)
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">
                        Wybierz typ zatrudnienia:
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={rangeSelections[`${r.start}-${r.end}`] || ""}
                          onChange={(e) =>
                            setRangeSelections((prev) => ({
                              ...prev,
                              [`${r.start}-${r.end}`]: e.target.value,
                            }))
                          }
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
                        >
                          <option value="">Brak informacji</option>
                          <option value="umowa-o-prace">Umowa o pracę</option>
                          <option value="zlecenie">Zlecenie</option>
                          <option value="wlasna-dzialalnosc">
                            Własna działalność
                          </option>
                          <option value="sluzby-mundurowe">
                            Służby Mundurowe
                          </option>
                          <option value="staz">Staż</option>
                        </select>
                        {rangeSelections[`${r.start}-${r.end}`] &&
                          rangeSelections[`${r.start}-${r.end}`] !== "" &&
                          onAddToChat && (
                            <button
                              onClick={() => {
                                const selectedType =
                                  rangeSelections[`${r.start}-${r.end}`];
                                const questions = {
                                  "umowa-o-prace":
                                    "Jak umowa o pracę wpływa na wysokość emerytury?",
                                  zlecenie:
                                    "Jaka jest różnica w emeryturze między umową o pracę a zleceniem?",
                                  "wlasna-dzialalnosc":
                                    "Jak składki ZUS z własnej działalności wpływają na emeryturę?",
                                  "sluzby-mundurowe":
                                    "Jakie są korzyści emerytalne dla służb mundurowych?",
                                  staz: "Czy okresy stażu liczą się do emerytury?",
                                };
                                const question =
                                  questions[
                                    selectedType as keyof typeof questions
                                  ] ||
                                  `Jak ${selectedType} wpływa na emeryturę?`;
                                onAddToChat(question);
                              }}
                              className="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs rounded transition-colors cursor-pointer border border-green-300 whitespace-nowrap"
                            >
                              Jak to wpływa?
                            </button>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isOnlyOne && (
                      <Button
                        variant="destructive"
                        onClick={() => removeRange(originalIndex)}
                        title="Usuń zakres"
                      >
                        Usuń
                      </Button>
                    )}
                  </div>
                </div>

                {/* Show gap after this range if it exists */}
                {idx < sortedRanges.length - 1 &&
                  (() => {
                    const currentEnd = r.end;
                    const nextStart = sortedRanges[idx + 1].start;

                    if (nextStart > currentEnd) {
                      const gapLength = nextStart - currentEnd;
                      return (
                        <div className="flex items-center justify-between gap-3 bg-red-50 p-3 rounded border-l-4 border-red-500">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="text-sm text-red-600">
                                Przerwa
                              </div>
                              <div className="text-base font-medium">
                                {currentEnd} — {nextStart} ({gapLength} lat)
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600 mb-1">
                                Wybierz typ:
                              </div>
                              <div className="flex items-center gap-2">
                                <select
                                  value={
                                    rangeSelections[
                                      `gap-${currentEnd}-${nextStart}`
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    setRangeSelections((prev) => ({
                                      ...prev,
                                      [`gap-${currentEnd}-${nextStart}`]:
                                        e.target.value,
                                    }))
                                  }
                                  className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
                                >
                                  <option value="">Brak informacji</option>
                                  <option value="przerwa-rodzicielska">
                                    Przerwa rodzicielska
                                  </option>
                                  <option value="bezrobocie">Bezrobocie</option>
                                  <option value="choroba">Choroba</option>
                                  <option value="studia">Studia</option>
                                  <option value="inna">Inna</option>
                                </select>
                                {rangeSelections[
                                  `gap-${currentEnd}-${nextStart}`
                                ] &&
                                  rangeSelections[
                                    `gap-${currentEnd}-${nextStart}`
                                  ] !== "" &&
                                  onAddToChat && (
                                    <button
                                      onClick={() => {
                                        const selectedType =
                                          rangeSelections[
                                            `gap-${currentEnd}-${nextStart}`
                                          ];
                                        const questions = {
                                          "przerwa-rodzicielska":
                                            "Jak urlop rodzicielski wpływa na wysokość emerytury?",
                                          bezrobocie:
                                            "Czy okresy bezrobocia liczą się do emerytury?",
                                          choroba:
                                            "Jak długotrwała choroba wpływa na emeryturę?",
                                          studia:
                                            "Czy studia wyższe zwiększają wysokość emerytury?",
                                          inna: "Jak przerwy w pracy wpływają na wysokość emerytury?",
                                        };
                                        const question =
                                          questions[
                                            selectedType as keyof typeof questions
                                          ] ||
                                          `Jak ${selectedType} wpływa na emeryturę?`;
                                        onAddToChat(question);
                                      }}
                                      className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded transition-colors cursor-pointer border border-red-300 whitespace-nowrap"
                                    >
                                      Jak to wpływa?
                                    </button>
                                  )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="destructive"
                              onClick={() => {
                                // Merge the current range with the next range by removing the gap
                                const currentRangeIndex = ranges.findIndex(
                                  (orig) =>
                                    orig.start === r.start && orig.end === r.end
                                );
                                const nextRangeIndex = ranges.findIndex(
                                  (orig) => orig.start === nextStart
                                );

                                if (
                                  currentRangeIndex !== -1 &&
                                  nextRangeIndex !== -1
                                ) {
                                  const newValues = [...values];
                                  const currentPairIndex =
                                    currentRangeIndex * 2;
                                  const nextPairIndex = nextRangeIndex * 2;

                                  // Get the end of the next range
                                  const nextRangeEnd =
                                    newValues[nextPairIndex + 1];

                                  // Update current range end to next range end (merging ranges)
                                  newValues[currentPairIndex + 1] =
                                    nextRangeEnd;

                                  // Remove the next range pair entirely
                                  const filteredValues = newValues.filter(
                                    (_, i) =>
                                      i !== nextPairIndex &&
                                      i !== nextPairIndex + 1
                                  );

                                  setValues(filteredValues);
                                }
                              }}
                              title="Usuń przerwę (połącz zakresy)"
                            >
                              Usuń
                            </Button>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
              </React.Fragment>
            );
          })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-blue-700 mb-1">
              Łączny okres pracy
            </div>
            <div className="text-lg font-semibold text-blue-900">
              {total} lat
            </div>
          </div>
          {onAddToChat && (
            <button
              onClick={() =>
                onAddToChat("Jak okres pracy wpływa na emeryturę?")
              }
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded-full transition-colors cursor-pointer border border-blue-300"
            >
              Jak okres pracy wpływa na emeryturę?
            </button>
          )}
        </div>
      </div>

      {/* Łączny okres przerwy - Break Period Summary */}
      {gaps.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-red-700 mb-1">
                Łączny okres przerwy
              </div>
              <div className="text-lg font-semibold text-red-900">
                {gaps.reduce((sum, gap) => sum + gap.length, 0)} lat
              </div>
            </div>
            {onAddToChat && (
              <button
                onClick={() =>
                  onAddToChat("Jak okres przerwy wpływa na emeryturę?")
                }
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded-full transition-colors cursor-pointer border border-red-300"
              >
                Jak okres przerwy wpływa na emeryturę?
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

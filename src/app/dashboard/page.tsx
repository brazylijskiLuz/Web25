"use client";

import { useEffect, useState } from "react";
import useAvatar from "@/stores/useAvatar";
import useUserData from "@/stores/useUserData";
import useResultsData from "@/stores/useResultsData";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { SelectionField } from "@/components/ui/selection-field";
import { ChatPanel } from "@/components/ui/chat-panel";
import { RetirementQuota } from "@/components/ui/retirement-quota";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiRange } from "@/components/ui/multi-range";
import RangesPanel from "@/components/ui/ranges-list";
import { UserDataPanel } from "@/components/ui/user-data-panel";
import { ChildrenPanel } from "@/components/ui/children-panel";
import { useFormatted } from "@/stores/useFormatted";

const DATA = {
  emerytura_nominalna_miesieczna_brutto: 3250.88,
  emerytura_nominalna_miesieczna_netto: 2958.3,
  emerytura_urealniona_miesieczna_brutto: 3250.88,
  emerytura_urealniona_miesieczna_netto: 2958.3,
  rok_przejscia_na_emeryture: 2021,
  wiek_przejscia_na_emeryture: 65,
  stopa_zastapienia_procent: 58.29,
  procent_przecietnego_wynagrodzenia: 57.42,
  przecietne_wynagrodzenie_w_roku: 5662.53,
  wynagrodzenie_w_roku_emerytury: 5578.34,
  kapital_emerytalny: {
    konto: 508432.67,
    subkonto: 111567.33,
    suma: 620000.0,
  },
  srednie_dalsze_trwanie_zycia_miesiace: 190.7,
  lata_skladkowe: 33.0,
  inflacja_skumulowana: 1.0,
  wplyw_przerw: {
    miesiace_przerw: 60,
    strata_kapital_pln: 88027.35,
    strata_emerytura_miesieczna_brutto_pln: 461.52,
    strata_emerytura_miesieczna_netto_pln: 419.98,
  },
  scenariusze_dluzszej_pracy: [
    {
      dodatkowe_lata: 1,
      rok_emerytury: 2022,
      wiek: 66,
      emerytura_nominalna_brutto: 3628.32,
      emerytura_nominalna_netto: 3301.77,
      emerytura_urealniona_brutto: 3172.1,
      emerytura_urealniona_netto: 2886.61,
      wzrost_procent_brutto: 11.61,
      wzrost_procent_netto: 11.61,
      kapital_emerytalny: 737463.14,
      srednie_dalsze_trwanie_zycia: 203.3,
    },
    {
      dodatkowe_lata: 2,
      rok_emerytury: 2023,
      wiek: 67,
      emerytura_nominalna_brutto: 4064.66,
      emerytura_nominalna_netto: 3698.84,
      emerytura_urealniona_brutto: 3268.72,
      emerytura_urealniona_netto: 2974.54,
      wzrost_procent_brutto: 25.03,
      wzrost_procent_netto: 25.03,
      kapital_emerytalny: 859667.89,
      srednie_dalsze_trwanie_zycia: 211.5,
    },
    {
      dodatkowe_lata: 5,
      rok_emerytury: 2026,
      wiek: 70,
      emerytura_nominalna_brutto: 5352.78,
      emerytura_nominalna_netto: 4870.03,
      emerytura_urealniona_brutto: 3875.92,
      emerytura_urealniona_netto: 3525.09,
      wzrost_procent_brutto: 64.67,
      wzrost_procent_netto: 64.67,
      kapital_emerytalny: 1208893.24,
      srednie_dalsze_trwanie_zycia: 225.8,
    },
  ],
  komunikaty: [
    "Twoja prognozowana emerytura: 3 250,88 PLN brutto / 2 958,30 PLN netto miesięcznie (w cenach z 2021 roku)",
    "W dzisiejszych pieniądzach (2025) to około: 3 250,88 PLN brutto / 2 958,30 PLN netto miesięcznie",
    "To 58,29% Twojego ostatniego wynagrodzenia (stopa zastąpienia)",
    "Twoja emerytura to 57,42% przeciętnego wynagrodzenia w 2021 roku",
    "Zgromadzony kapitał emerytalny: 620 000,00 PLN (w tym podane przez Ciebie: konto 480 000 PLN + subkonto 120 000 PLN)",
    "UWAGA: Podałeś rok przejścia na emeryturę 2021, który już minął. W 2025 roku już jesteś na emeryturze",
    "Gdybyś pracował 5 lat dłużej (do 2026), zwiększyłbyś emeryturę o 64,67%",
    "Przerwy w pracy (60 miesięcy = 5 lat) zmniejszyły Twoją emeryturę o 461,52 PLN brutto / 419,98 PLN netto miesięcznie",
    "Przepracowałeś 33 lata składkowe (38 lat kalendarzowych minus 5 lat przerw), co spełnia warunek minimalnej emerytury dla mężczyzn (25 lat)",
  ],
};

const Dashboard = () => {
  const { setAvatarPosition, setAvatarAssistant, setAvatarSize } = useAvatar();
  const { userData, setUserData } = useUserData();
  const { setResultsData, resultsData } = useResultsData();
  const router = useRouter();
  console.log("tusoo", userData);
  const [numberOfChildren, setNumberOfChildren] = useState(3);
  const rokStartuPracy = userData.rok_rozpoczecia_pracy || 0;
  console.log("---------------");
  console.log("rokStartuPracy", rokStartuPracy);
  // const rokPrzejsciaNaEmeryture = resultsData?.rok_przejscia_na_emeryture || 0;
  const wiekPrzejsciaNaEmeryture =
    resultsData?.wiek_przejscia_na_emeryture || 0;

  const rokUrodzenia = 2025 - userData.age;
  const [start, setStart] = useState(rokStartuPracy - rokUrodzenia);
  const [end, setEnd] = useState(userData.gender === "male" ? 65 : 60);

  const [values, setValues] = useState<number[]>([start, end]);
  const [startAge, setStartAge] = useState<number | null>();
  const [endAge, setEndAge] = useState<number | null>();
  const [validationError, setValidationError] = useState<string>("");

  // Calculate gaps from values and update userData
  const updatePrzeruuData = (currentValues: number[]) => {
    const ranges: Array<{ start: number; end: number }> = [];
    for (let i = 0; i < currentValues.length; i += 2) {
      const a = currentValues[i];
      const b = currentValues[i + 1];
      if (typeof a === "number" && typeof b === "number") {
        const start = Math.min(a, b);
        const end = Math.max(a, b);
        ranges.push({ start, end });
      }
    }

    const gaps: Array<{ start: number; end: number; length: number }> = [];
    if (ranges.length > 1) {
      const sortedRanges = [...ranges].sort((a, b) => a.start - b.start);
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
    }

    const hasPrzerwy = gaps.length > 0;
    const totalGapYears = gaps.reduce((sum, gap) => sum + gap.length, 0);
    const totalGapMonths = totalGapYears * 12;

    setUserData({
      przerwy_w_pracy: hasPrzerwy,
      przerwy_laczna_liczba_miesiecy: totalGapMonths,
    });
  };

  // Update przerwy data when values change
  useEffect(() => {
    updatePrzeruuData(values);
  }, [values, setUserData]);
  const [kodPocztowy, setKodPocztowy] = useState(userData.kod_pocztowy || null);

  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // TODO: Replace with API call
  const [messages, setMessages] = useState([]);

  const sendReportToAPI = async () => {
    try {
      const payload = {
        expectedPension: userData.desired_pension_amount,
        sex: userData.gender === "male" ? 1 : 2,
        salaryAmount: userData.current_salary,
        consideredSickLeave: true,
        accountBalance: userData.konto_zus,
        subAccountBalance: userData.subkonto_zus,
        pension: resultsData?.emerytura_nominalna_miesieczna_brutto || 0,
        realPension: resultsData?.emerytura_urealniona_miesieczna_brutto || 0,
        postalCode: userData.kod_pocztowy || kodPocztowy,
        age: userData.age,
        data: resultsData?.scenariusze_dluzszej_pracy,
      };

      const response = await fetch("/api/report/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Report created successfully:", result);

      if (result && result.value.pdfFile) {
        let url = result.value.pdfFile;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "https://" + url;
        }
        setReportUrl(url);
      }
    } catch (error) {
      console.error("Error sending report to API:", error);
    }
  };

  useEffect(() => {
    sendReportToAPI();
  }, [userData, resultsData]);

  const downloadReport = () => {
    if (reportUrl) {
      window.open(reportUrl, "_blank");
    }
  };

  const { formatted } = useFormatted();

  const regenerateWithNewConditions = async () => {
    setIsRegenerating(true);

    try {
      // Create formatted content from userData
      let formattedContent = "Dane użytkownika (obowiązkowe):\n";
      formattedContent += `wiek: ${userData.age || ""}\n`;
      formattedContent += `plec: "${userData.gender || ""}"\n`;
      formattedContent += `wynagrodzenie_brutto: ${
        userData.current_salary || ""
      }\n`;
      formattedContent += `rok_rozpoczecia_pracy: ${
        userData.rok_rozpoczecia_pracy || ""
      }\n`;

      // Calculate rok_zakonczenia_pracy based on gender
      const endAge = userData.gender === "male" ? 65 : 60;
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - userData.age;
      const rok_zakonczenia_pracy = birthYear + endAge;
      formattedContent += `rok_zakonczenia_pracy: ${rok_zakonczenia_pracy}`;

      // Add optional data if present
      if (
        userData.przerwy_w_pracy ||
        userData.przerwy_laczna_liczba_miesiecy ||
        userData.konto_zus ||
        userData.subkonto_zus
      ) {
        formattedContent += "\n\nDane użytkownika (opcjonalne):";
        if (userData.przerwy_w_pracy !== undefined) {
          formattedContent += `\nprzerwy_w_pracy: ${userData.przerwy_w_pracy}`;
        }
        if (userData.przerwy_laczna_liczba_miesiecy) {
          formattedContent += `\nprzerwy_laczna_liczba_miesiecy: ${userData.przerwy_laczna_liczba_miesiecy}`;
        }
        if (userData.konto_zus) {
          formattedContent += `\nsrodki_na_koncie_zus: ${userData.konto_zus}`;
        }
        if (userData.subkonto_zus) {
          formattedContent += `\nsrodki_na_subkoncie_zus: ${userData.subkonto_zus}`;
        }
      }
      console.warn(formattedContent);
      const response = await fetch("/api/regenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          beforeInput: formatted,
          afterInput: formattedContent,
          beforeOutput: resultsData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullResponse += new TextDecoder().decode(value);
        }
      }

      // Parse the JSON response
      try {
        // The streaming response might have extra data, so we need to extract just the JSON
        // Find the last complete JSON object in the response
        const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
        console.log("jsonMatch", jsonMatch);
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0]);
          console.log("Parsed data:", parsedData);

          // Validate that the parsed data has the required fields
          if (
            parsedData &&
            typeof parsedData === "object" &&
            "emerytura_nominalna_miesieczna_brutto" in parsedData &&
            "kapital_emerytalny" in parsedData
          ) {
            // Update the results data with the new calculation
            setResultsData(parsedData);
            console.log(
              "Successfully updated results data with regenerated values"
            );
          } else {
            console.error(
              "Parsed data is missing required fields:",
              parsedData
            );
            console.error("Regeneration failed - invalid response format");
          }
        } else {
          console.error("No JSON found in response:", fullResponse);
        }
      } catch (parseError) {
        console.error("Error parsing regenerate response:", parseError);
        console.error("Full response was:", fullResponse);
      }
    } catch (error) {
      console.error("Error regenerating with new conditions:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleAddToChat = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      title: message,
      description: "",
      isUser: true,
    };
    //@ts-ignore
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleAddRange = () => {
    if (startAge && endAge && startAge >= 16 && startAge < endAge) {
      const newValues = [...values, startAge, endAge].sort((a, b) => a - b);
      setValues(newValues);
      setStartAge(null);
      setEndAge(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddRange();
    }
  };

  useEffect(() => {
    setAvatarPosition("right");
    setAvatarSize("small");
    setAvatarAssistant("pointing-up");

    // Set initial data from constant if no data exists
    if (!resultsData) {
      setResultsData(DATA);
    }

    sendReportToAPI();
  }, [resultsData, setResultsData]);

  return (
    <div
      className={`flex w-full h-screen overflow-hidden mt-14 relative ${
        isRegenerating ? "cursor-wait" : ""
      }`}
    >
      {/* Loading Overlay */}
      {isRegenerating && (
        <div className="absolute top-4 left-4 right-4 bg-white bg-opacity-95 border border-gray-200 rounded-lg shadow-lg z-50 p-6">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary flex-shrink-0"></div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Obliczam nowe prognozy
              </h3>
              <p className="text-sm text-gray-600">
                Analizuję zaktualizowane dane...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-[60%] overflow-y-auto pr-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="w-full text-[36px] font-bold">
            Twój panel <span className="text-primary">emerytalny</span>
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={regenerateWithNewConditions}
              variant="outline"
              disabled={isRegenerating}
            >
              {isRegenerating
                ? "Obliczam..."
                : "Oblicz ponownie z nowymi warunkami"}
            </Button>
            {reportUrl && (
              <Button onClick={downloadReport}>Pobierz raport</Button>
            )}
          </div>
        </div>
        <RetirementQuota
          expectedAmount={userData.desired_pension_amount}
          calculatedAmount={
            resultsData?.emerytura_urealniona_miesieczna_brutto || 0
          }
          onAddToChat={handleAddToChat}
        />
        <div className="w-full rounded-2xl p-6 bg-white shadow-2x mt-10">
          <h2 className="items-center flex font-bold text-[24px] mb-8">
            Ścieżka życia <Info className="w-4 h-4 ml-2 " />
          </h2>
          <MultiRange values={values} onChange={setValues} className={"mt-8"} />
          <RangesPanel
            values={values}
            setValues={setValues}
            onAddToChat={handleAddToChat}
          />
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Dodaj zakres
            </h3>
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Początek (min. 16)"
                min={16}
                max={100}
                value={startAge || ""}
                onChange={(e) => setStartAge(parseInt(e.target.value))}
                onKeyPress={handleKeyPress}
              />
              <Input
                type="number"
                placeholder="Koniec"
                min={16}
                max={100}
                value={endAge || ""}
                onChange={(e) => setEndAge(parseInt(e.target.value))}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleAddRange}>Dodaj zakres</Button>
            </div>
          </div>
        </div>

        <UserDataPanel
          userData={userData}
          onUserDataChange={setUserData}
          kodPocztowy={kodPocztowy}
          onKodPocztowyChange={(kod) => {
            setKodPocztowy(kod);
            setUserData({ kod_pocztowy: kod });
          }}
        />

        <ChildrenPanel
          numberOfChildren={numberOfChildren}
          onNumberOfChildrenChange={setNumberOfChildren}
          onAddToChat={handleAddToChat}
        />

        {/* Komunikaty */}
        {resultsData?.komunikaty && resultsData.komunikaty.length > 0 && (
          <div className="w-full rounded-2xl p-6 bg-white shadow-2x mt-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-secondary-foreground rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Komunikaty
              </h3>
            </div>
            <div className="space-y-4">
              {resultsData.komunikaty.slice(0, 5).map((komunikat, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 py-3 border-b border-gray-200 last:border-b-0"
                >
                  <div className="w-2 h-2 bg-chart-1 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">{komunikat}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-[40%] h-full overflow-visible">
        <div className="sticky top-16 w-full h-[640px] overflow-hidden">
          <ChatPanel
            messages={messages}
            userData={userData}
            resultsData={resultsData}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

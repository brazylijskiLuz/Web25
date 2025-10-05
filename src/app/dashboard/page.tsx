"use client";

import { useEffect, useState } from "react";
import useAvatar from "@/stores/useAvatar";
import { Info } from "lucide-react";
import { SelectionField } from "@/components/ui/selection-field";
import { ChatPanel } from "@/components/ui/chat-panel";
import { RetirementQuota } from "@/components/ui/retirement-quota";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiRange } from "@/components/ui/multi-range";
import RangesPanel from "@/components/ui/ranges-list";
import { UserDataPanel } from "@/components/ui/user-data-panel";

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

const USER_DATA = {
  desired_pension_amount: 5000,
  age: 35,
  gender: "male",
  current_salary: 8000,
  konto_zus: DATA.kapital_emerytalny.konto,
  subkonto_zus: DATA.kapital_emerytalny.subkonto,
};

const Dashboard = () => {
  const { setAvatarPosition, setAvatarAssistant, setAvatarSize } = useAvatar();
  const [numberOfChildren, setNumberOfChildren] = useState(3);
  const [values, setValues] = useState<number[]>([25, 65]);
  const [startAge, setStartAge] = useState<number | null>();
  const [endAge, setEndAge] = useState<number | null>();
  const [validationError, setValidationError] = useState<string>("");
  const [kodPocztowy, setKodPocztowy] = useState(null);

  const [userData, setUserData] = useState(USER_DATA);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

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
        pension: DATA.emerytura_nominalna_miesieczna_brutto,
        realPension: DATA.emerytura_urealniona_miesieczna_brutto,
        postalCode: kodPocztowy
      };

      const response = await fetch('/api/report/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Report created successfully:', result);
      
      if (result && result.value) {
        let url = result.value;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        setReportUrl(url);
      }
    } catch (error) {
      console.error('Error sending report to API:', error);
    }
  };

  const downloadReport = () => {
    if (reportUrl) {
      window.open(reportUrl, '_blank');
    }
  };

  const handleAddToChat = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      title: message,
      description: "",
      isUser: true,
    };
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
    sendReportToAPI();
  }, []);

  return (
    <div className="flex w-full h-screen overflow-hidden mt-14">
      <div className="w-[60%] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="w-full text-[36px] font-bold">
            Twój panel <span className="text-primary">emerytalny</span>
          </h1>
          {reportUrl && (
            <Button onClick={downloadReport} className="ml-4">
              Pobierz raport
            </Button>
          )}
        </div>
        <RetirementQuota
          expectedAmount={7829}
          calculatedAmount={4829}
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
              Dodaj nowy zakres pracy
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
          onKodPocztowyChange={setKodPocztowy}
        />

        {/* Ilość dzieci - separate component */}
        <div className="w-full rounded-2xl p-6 bg-white shadow-2x mt-10">
          <SelectionField
            title="Ilość dzieci"
            description="Tutaj opis jak to wpływa na kwotę wyliczonej emerytury"
            value={numberOfChildren}
            displayValue={`${numberOfChildren} dzieci`}
            options={[
              { value: "umowa-o-prace", label: "Umowa o pracę" },
              { value: "zlecenie", label: "Zlecenie" },
              { value: "wlasna-dzialalnosc", label: "Własna działalność" },
              { value: "sluzby-mundurowe", label: "Służby Mundurowe" },
              { value: "staz", label: "Staż" },
            ]}
            onChange={(value: string | number) =>
              setNumberOfChildren(value as number)
            }
            onInfoClick={() => console.log("Info clicked")}
          />
        </div>
      </div>
      <div className="w-[40%] h-full overflow-visible">
        <div className="sticky top-16 w-full h-[640px] overflow-hidden">
          <ChatPanel messages={messages} userData={DATA} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

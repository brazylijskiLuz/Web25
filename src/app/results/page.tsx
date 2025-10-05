"use client";
import { AlertCircle } from "lucide-react";
import useAvatar from "@/stores/useAvatar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useResultsData from "@/stores/useResultsData";
import { useHideAvatarGraphics } from "@/hooks/useHideAvatarGraphics";

interface ScenariuszDluzszejPracy {
  dodatkowe_lata: number;
  rok_emerytury: number;
  wiek: number;
  emerytura_nominalna_brutto: number;
  emerytura_nominalna_netto: number;
  emerytura_urealniona_brutto: number;
  emerytura_urealniona_netto: number;
  wzrost_procent_brutto: number;
  wzrost_procent_netto: number;
  kapital_emerytalny: number;
  srednie_dalsze_trwanie_zycia: number;
}

interface WplywPrzerw {
  miesiace_przerw: number;
  strata_kapital_pln: number;
  strata_emerytura_miesieczna_brutto_pln: number;
  strata_emerytura_miesieczna_netto_pln: number;
}

interface ResultsData {
  emerytura_nominalna_miesieczna_brutto: number;
  emerytura_urealniona_miesieczna_brutto: number;
  emerytura_nominalna_miesieczna_netto: number;
  emerytura_urealniona_miesieczna_netto: number;
  rok_przejscia_na_emeryture: number;
  wiek_przejscia_na_emeryture?: number;
  stopa_zastapienia_procent: number;
  procent_przecietnego_wynagrodzenia?: number;
  przecietne_wynagrodzenie_w_roku?: number;
  wynagrodzenie_w_roku_emerytury?: number;
  kapital_emerytalny: {
    konto: number;
    subkonto: number;
    suma: number;
  };
  srednie_dalsze_trwanie_zycia_miesiace?: number;
  lata_skladkowe?: number;
  inflacja_skumulowana?: number;
  wplyw_przerw?: WplywPrzerw;
  scenariusze_dluzszej_pracy?: ScenariuszDluzszejPracy[];
  komunikaty?: string[];
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDecimal = (value: number, decimals = 1): string => {
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

const Results = () => {
  useHideAvatarGraphics(800, true);
  const { setAvatarPosition, setAvatarAssistant, setAvatarSize } = useAvatar();
  const router = useRouter();
  const { resultsData } = useResultsData();

  useEffect(() => {
    setAvatarPosition("right");
    setAvatarAssistant("pointing-left");
    setAvatarSize("large");
  }, []);

  // Use data from context or fallback to mock data
  const data: ResultsData = resultsData || {};

  return (
    <>
      <div className="mt-20 flex w-full px-4 pb-10">
        <div className="w-full md:w-[60%]">
          <label className="text-[17px] md:text-[20px] font-semibold">
            Kwota nominalna
          </label>
          <h1 className="text-[48px] lg:text-[108px] font-black leading-[108px] text-primary">
            {formatCurrency(data.emerytura_nominalna_miesieczna_brutto)} zł
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Kwota netto:{" "}
            {formatCurrency(data.emerytura_nominalna_miesieczna_netto)} zł
          </p>

          <label className="flex items-center gap-2 mt-12">
            <p className="text-[17px] md:text-[20px] font-semibold">
              Kwota urealniona
            </p>
            <AlertCircle className="w-4 h-4" />
          </label>
          <h2 className="font-black text-[32px] lg:text-[80px] text-chart-1 leading-[80px]">
            {formatCurrency(data.emerytura_urealniona_miesieczna_brutto)} zł
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Kwota netto:{" "}
            {formatCurrency(data.emerytura_urealniona_miesieczna_netto)} zł (w
            cenach {new Date().getFullYear()})
          </p>

          {/* Brakuje Ci X lat pracy */}
          <div className="mt-12">
            <p className="text-xl text-gray-900">
              Brakuje Ci{" "}
              <span className="text-orange-500 font-bold">7 lat</span> pracy do
              osiągnięcia oczekiwanej kwoty
            </p>
          </div>

          {/* Stopa zastąpienia emerytury */}
          <div className="mt-8 bg-white p-8 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="md:w-8 w-9 h-9 md:h-8 bg-chart-1/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Stopa zastąpienia emerytury
              </h3>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-bold text-chart-1">
                {formatDecimal(data.stopa_zastapienia_procent)}%
              </span>
              <div className="w-6 h-6 bg-chart-1/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-chart-1 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(data.stopa_zastapienia_procent, 100)}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Wartość emerytury bez uwzględnienia okresu chorobowego */}
          <div className="mt-8 bg-white p-8 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="md:w-8 w-9 h-9 md:h-8 bg-chart-1/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Wartość emerytury bez uwzględnienia okresu chorobowego
              </h3>
            </div>

            <div className="space-y-4">
              {/* Licząc okres chorobowy */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-6 bg-chart-1 rounded"></div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(data.emerytura_nominalna_miesieczna_brutto)}{" "}
                  zł
                </span>
                <span className="text-sm text-gray-500">
                  Licząc okres chorobowy
                </span>
              </div>

              {/* Bez okresu chorobowego */}
              <div className="flex items-center gap-4">
                <div className="w-32 h-6 bg-primary rounded"></div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(data.emerytura_urealniona_miesieczna_brutto)}{" "}
                  zł
                </span>
                <span className="text-sm text-gray-500">
                  Bez okresu chorobowego
                </span>
              </div>
            </div>
          </div>

          {/* Różnica wysokości składki */}
          <div className="mt-8 bg-white p-8 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="md:w-8 w-9 h-9 md:h-8 bg-chart-1/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Różnica wysokości składki w zależności od odłożenia decyzji o
                przejściu na emeryturę
              </h3>
            </div>

            <div className="overflow-y-hidden overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-200">
                      Lata opóźnienia
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                      Składka miesięczna
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                      Emerytura miesięczna
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                      Różnica w stosunku do teraz
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                      Teraz
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      2 450 zł
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      {formatCurrency(
                        data.emerytura_nominalna_miesieczna_brutto
                      )}{" "}
                      zł
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900">
                      -
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                      +1 rok
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      2 680 zł
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      13 420 zł
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-primary font-medium">
                      +768 zł
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                      +2 lata
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      2 920 zł
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      14 680 zł
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-primary font-medium">
                      +2 028 zł
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                      +5 lat
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      3 580 zł
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      18 240 zł
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-primary font-medium">
                      +5 588 zł
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                      +10 lat
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      4 890 zł
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      24 960 zł
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-primary font-medium">
                      +12 308 zł
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Różnica wygenerowanej emerytury */}
          <div className="mt-8 bg-white p-8 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-chart-1/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Różnica wygenerowanej emerytury względem średniej prognozowanej
                emerytury
              </h3>
            </div>

            <div className="space-y-4">
              {/* Licząc okres chorobowy */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-6 bg-chart-1 rounded"></div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(data.emerytura_nominalna_miesieczna_brutto)}{" "}
                  zł
                </span>
                <span className="text-sm text-gray-500">
                  Licząc okres chorobowy
                </span>
              </div>

              {/* Bez okresu chorobowego */}
              <div className="flex items-center gap-4">
                <div className="w-32 h-6 bg-primary rounded"></div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(data.emerytura_urealniona_miesieczna_brutto)}{" "}
                  zł
                </span>
                <span className="text-sm text-gray-500">
                  Bez okresu chorobowego
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed CTA Button in bottom right corner */}
      <button
        onClick={() => router.push("/dashboard")}
        className="fixed bottom-8 right-8 bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg z-50 border border-gray-200"
      >
        Przejść do panelu głównego
      </button>
    </>
  );
};

export default Results;

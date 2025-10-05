import useAvatar from "@/stores/useAvatar";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

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

interface ResultsProps {
  data: {
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
  };
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

export const Results = ({ data }: ResultsProps) => {
  const { setAvatarPosition, setAvatarAssistant, setAvatarSize } = useAvatar();
  useEffect(() => {
    setAvatarPosition("right");
    setAvatarAssistant("pointing-left");
    setAvatarSize("large");
  }, []);

  return (
    <div className="mt-20 flex w-full  mx-auto px-4">
      <div className="w-full">
        <label className="text-[20px] font-semibold">Kwota nominalna</label>
        <h1 className="text-[108px] font-black leading-[108px] text-primary">
          {formatCurrency(data.emerytura_nominalna_miesieczna_brutto)} zł
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Kwota netto:{" "}
          {formatCurrency(data.emerytura_nominalna_miesieczna_netto)} zł
        </p>

        <label className="flex items-center gap-2 mt-12">
          <p className="text-[20px] font-semibold">Kwota urealniona</p>
          <AlertCircle className="w-4 h-4" />
        </label>
        <h2 className="font-black text-[80px] text-chart-4 leading-[80px]">
          {formatCurrency(data.emerytura_urealniona_miesieczna_brutto)} zł
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Kwota netto:{" "}
          {formatCurrency(data.emerytura_urealniona_miesieczna_netto)} zł (w
          cenach {new Date().getFullYear()})
        </p>
      </div>
    </div>
  );
};

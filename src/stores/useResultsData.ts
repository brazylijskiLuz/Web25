import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface ResultsDataStore {
  resultsData: ResultsData | null;
  setResultsData: (data: ResultsData) => void;
  clearResultsData: () => void;
}

const useResultsData = create<ResultsDataStore>()(
  persist(
    (set) => ({
      resultsData: null,
      setResultsData: (data) => {
        console.log("setResultsData called with:", data);
        set({ resultsData: data });
      },
      clearResultsData: () => set({ resultsData: null }),
    }),
    {
      name: "results-data-storage",
    }
  )
);

export default useResultsData;
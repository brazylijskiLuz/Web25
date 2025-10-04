import { AlertCircle } from "lucide-react";

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

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Stopa zastąpienia</p>
            <p className="text-2xl font-bold">
              {formatDecimal(data.stopa_zastapienia_procent)}%
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Kapitał emerytalny</p>
            <p className="text-2xl font-bold">
              {formatCurrency(data.kapital_emerytalny.suma)} zł
            </p>
          </div>

          {data.lata_skladkowe && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Lata składkowe</p>
              <p className="text-2xl font-bold">
                {formatDecimal(data.lata_skladkowe, 0)} lat
              </p>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Rok emerytury</p>
            <p className="text-2xl font-bold">
              {data.rok_przejscia_na_emeryture}
            </p>
          </div>
        </div>

        {data.wplyw_przerw && data.wplyw_przerw.miesiace_przerw > 0 && (
          <div className="mt-6 bg-destructive/10 border border-destructive/20 p-4 rounded-lg max-w-2xl">
            <p className="text-sm font-semibold text-destructive mb-2">
              Wpływ przerw w pracy ({data.wplyw_przerw.miesiace_przerw}{" "}
              miesięcy)
            </p>
            <p className="text-sm text-muted-foreground">
              Strata emerytury:{" "}
              {formatCurrency(
                data.wplyw_przerw.strata_emerytura_miesieczna_brutto_pln
              )}{" "}
              zł brutto /{" "}
              {formatCurrency(
                data.wplyw_przerw.strata_emerytura_miesieczna_netto_pln
              )}{" "}
              zł netto miesięcznie
            </p>
          </div>
        )}

        {data.scenariusze_dluzszej_pracy &&
          data.scenariusze_dluzszej_pracy.length > 0 && (
            <div className="mt-6 max-w-2xl">
              <p className="text-lg font-semibold mb-3">
                Scenariusze dłuższej pracy
              </p>
              <div className="space-y-3">
                {data.scenariusze_dluzszej_pracy.map((scenariusz) => (
                  <div
                    key={scenariusz.dodatkowe_lata}
                    className="bg-primary/5 border border-primary/20 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          +{scenariusz.dodatkowe_lata}{" "}
                          {scenariusz.dodatkowe_lata === 1 ? "rok" : "lata"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(
                            scenariusz.emerytura_nominalna_brutto
                          )}{" "}
                          zł brutto
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          +{formatDecimal(scenariusz.wzrost_procent_brutto)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

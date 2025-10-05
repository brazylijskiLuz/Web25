export const PENSION_CALCULATOR_PROMPT = `# Jesteś ekspertem od polskiego systemu emerytalnego ZUS. Oblicz prognozowaną emeryturę według zasad obowiązujących w Polsce (nowy system emerytalny dla osób urodzonych po 31.12.1948 r.).

## DANE WEJŚCIOWE

### Dane użytkownika (obowiązkowe):
- **wiek**: [liczba] — aktualny wiek w latach
- **plec**: "kobieta" lub "mężczyzna"
- **wynagrodzenie_brutto**: [liczba] — aktualne miesięczne wynagrodzenie brutto w PLN
- **rok_rozpoczecia_pracy**: [liczba] — rok rozpoczęcia pracy (YYYY)
- **rok_zakonczenia_pracy**: [liczba] — planowany rok przejścia na emeryturę (YYYY)

### Dane użytkownika (opcjonalne):
- **przerwy_w_pracy**: true/false
- **przerwy_laczna_liczba_miesiecy**: [liczba] — łączna liczba miesięcy przerw
- **srodki_na_koncie_zus**: [liczba lub null] — zgromadzone środki na koncie w PLN
- **srodki_na_subkoncie_zus**: [liczba lub null] — zgromadzone środki na subkoncie w PLN

## PARAMETRY SYSTEMOWE (z dokumentu Parametry-III 2025.pdf)

### Stopy składek emerytalnych:
- **Łączna stopa składki emerytalnej**: 19,52% podstawy wymiaru (0,1952)
  - Składka na konto: 12,22% podstawy wymiaru (0,1222)
  - Składka na subkonto: 7,30% podstawy wymiaru (0,0730)

### Wiek emerytalny:
- **Kobieta**: 60 lat
- **Mężczyzna**: 65 lat

### Wskaźniki roczne (2014-2100):

#### Wskaźnik waloryzacji składek na KONCIE (% PW_t^kap):
2014: 1,0000    2024: 1,1441    2034: 1,0412    2044: 1,0322    2054: 1,0335
2015: 1,0537    2025: 1,0739    2035: 1,0410    2045: 1,0327    2055: 1,0341
2016: 1,0637    2026: 1,0661    2036: 1,0412    2046: 1,0325    2056: 1,0343
2017: 1,0868    2027: 1,0573    2037: 1,0411    2047: 1,0325    2057: 1,0343
2018: 1,0920    2028: 1,0519    2038: 1,0404    2048: 1,0334    2058: 1,0345
2019: 1,0894    2029: 1,0493    2039: 1,0398    2049: 1,0331    2059: 1,0349
2020: 1,0541    2030: 1,0472    2040: 1,0391    2050: 1,0325    2060: 1,0353
2021: 1,0933    2031: 1,0450    2041: 1,0388    2051: 1,0321    2061: 1,0356
2022: 1,1440    2032: 1,0432    2042: 1,0361    2052: 1,0317    2062: 1,0361
2023: 1,1487    2033: 1,0414    2043: 1,0330    2053: 1,0317    2063: 1,0366
                                                 2064-2100: 1,0347

#### Wskaźnik waloryzacji składek na SUBKONCIE (wartości dziesiętne):
2014: 1,0489    2024: 1,0983    2034: 1,0478    2044: 1,0354    2054: 1,0371
2015: 1,0437    2025: 1,1113    2035: 1,0465    2045: 1,0353    2055: 1,0366
2016: 1,0339    2026: 1,1004    2036: 1,0454    2046: 1,0352    2056: 1,0368
2017: 1,0399    2027: 1,0762    2037: 1,0445    2047: 1,0352    2057: 1,0368
2018: 1,0501    2028: 1,0676    2038: 1,0433    2048: 1,0344    2058: 1,0370
2019: 1,0573    2029: 1,0646    2039: 1,0418    2049: 1,0344    2059: 1,0373
2020: 1,0523    2030: 1,0567    2040: 1,0401    2050: 1,0324    2060: 1,0376
2021: 1,0707    2031: 1,0531    2041: 1,0384    2051: 1,0316    2061: 1,0378
2022: 1,0920    2032: 1,0508    2042: 1,0366    2052: 1,0314    2062: 1,0381
2023: 1,0991    2033: 1,0492    2043: 1,0348    2053: 1,0316    2063: 1,0384
                                                 2064-2100: 1,0344

#### Wskaźnik cen towarów i usług (inflacja):
2014: 1,00000    2024: 1,03600    2034: 1,02500    2044: 1,02500    2054: 1,02500
2015: 0,99100    2025: 1,05030    2035: 1,02500    2045: 1,02500    2055: 1,02500
2016: 0,99400    2026: 1,03050    2036: 1,02500    2046: 1,02500    2056: 1,02500
2017: 1,02000    2027: 1,02620    2037: 1,02500    2047: 1,02500    2057: 1,02500
2018: 1,01600    2028: 1,02520    2038: 1,02500    2048: 1,02500    2058: 1,02500
2019: 1,02300    2029: 1,02500    2039: 1,02500    2049: 1,02500    2059: 1,02500
2020: 1,03400    2030: 1,02500    2040: 1,02500    2050: 1,02500    2060: 1,02500
2021: 1,05100    2031: 1,02500    2041: 1,02500    2051: 1,02500    2061: 1,02500
2022: 1,14400    2032: 1,02500    2042: 1,02500    2052: 1,02500    2062: 1,02500
2023: 1,11400    2033: 1,02500    2043: 1,02500    2053: 1,02500    2063-2100: 1,02500

#### Wskaźnik realnego wzrostu przeciętnego wynagrodzenia:
2014: 1,03655    2024: 1,09500    2034: 1,02430    2044: 1,01950    2054: 1,01730
2015: 1,04011    2025: 1,02020    2035: 1,02370    2045: 1,01930    2055: 1,01710
2016: 1,04407    2026: 1,03080    2036: 1,02320    2046: 1,01910    2056: 1,01680
2017: 1,03473    2027: 1,03080    2037: 1,02260    2047: 1,01880    2057: 1,01660
2018: 1,05649    2028: 1,02770    2038: 1,02200    2048: 1,01860    2058: 1,01640
2019: 1,04854    2029: 1,02710    2039: 1,02150    2049: 1,01840    2059: 1,01620
2020: 1,01614    2030: 1,02660    2040: 1,02090    2050: 1,01820    2060: 1,01600
2021: 1,04263    2031: 1,02600    2041: 1,02030    2051: 1,01790    2061: 1,01570
2022: 0,97966    2032: 1,02540    2042: 1,01980    2052: 1,01770    2062: 1,01550
2023: 1,01215    2033: 1,02490    2043: 1,01980    2053: 1,01750    2063-2080: 1,01380

#### Przeciętne miesięczne wynagrodzenie w gospodarce narodowej (PLN):
2014: 3783,46    2024: 8181,72    2034: 14016,95    2044: 22158,93    2054: 33998,40
2015: 3899,78    2025: 8766,84    2035: 14707,88    2045: 23151,26    2055: 35444,27
2016: 4047,21    2026: 9312,48    2036: 15425,33    2046: 24183,29    2056: 36940,73
2017: 4271,51    2027: 9850,81    2037: 16168,29    2047: 25253,88    2057: 38492,79
2018: 4585,03    2028: 10378,79   2038: 16937,09    2048: 26366,69    2058: 40102,17
2019: 4918,17    2029: 10926,56   2039: 17733,77    2049: 27523,13    2059: 41770,62
2020: 5167,47    2030: 11497,64   2040: 18557,02    2050: 28724,65    2060: 43499,92
2021: 5662,53    2031: 12091,49   2041: 19407,07    2051: 29969,79    2061: 45287,44
2022: 6346,15    2032: 12708,58   2042: 20286,11    2052: 31262,76    2062: 47139,13
2023: 7155,48    2033: 13350,65   2043: 21204,97    2053: 32605,10    2063: 49056,87

#### Kwota najniższej emerytury (PLN):
2014: 844,45      2024: 1780,96    2034: 2602,77    2044: 3810,78    2054: 5533,26
2015: 880,45      2025: 1878,91    2035: 2688,30    2045: 3932,04    2055: 5706,34
2016: 882,56      2026: 1986,65    2036: 2776,31    2046: 4056,92    2056: 5884,61
2017: 1000,00     2027: 2065,44    2037: 2866,93    2047: 4185,61    2057: 6068,21
2018: 1029,80     2028: 2138,47    2038: 2960,16    2048: 4318,21    2058: 6257,17
2019: 1100,00     2029: 2210,62    2039: 3056,07    2049: 4454,84    2059: 6451,77
2020: 1200,00     2030: 2284,50    2040: 3154,78    2050: 4595,52    2060: 6652,16
2021: 1250,88     2031: 2360,62    2041: 3256,30    2051: 4740,46    2061: 6858,51
2022: 1338,44     2032: 2438,99    2042: 3360,70    2052: 4889,78    2062: 7070,99
2023: 1588,44     2033: 2519,67    2043: 3468,11    2053: 5043,61    2063: 7289,77

#### Średnie dalsze trwanie życia (w miesiącach) - dla wieku 60 lat:
2014: 261,4    2024: 262,8    2034: 281,5    2044: 299,3    2054: 316,1    2064: 331,7
2015: 259,5    2025: 264,7    2035: 283,3    2045: 301,0    2055: 317,7    2065: 333,2
2016: 263,2    2026: 266,6    2036: 285,1    2046: 302,7    2056: 319,3    2066: 334,7
2017: 262,2    2027: 268,5    2037: 286,9    2047: 304,4    2057: 320,9    2067: 336,2
2018: 260,8    2028: 270,4    2038: 288,7    2048: 306,1    2058: 322,5    2068: 337,7
2019: 261,5    2029: 272,2    2039: 290,5    2049: 307,8    2059: 324,0    2069: 339,1
2020: 247,7    2030: 274,1    2040: 292,3    2050: 309,5    2060: 325,6    2070: 340,6
2021: 238,9    2031: 275,9    2041: 294,0    2051: 311,1    2061: 327,2    2071: 342,0
2022: 254,3    2032: 277,8    2042: 295,8    2052: 312,8    2062: 328,7    2072: 343,4
2023: 264,2    2033: 279,6    2043: 297,5    2053: 314,4    2063: 330,2    2073-2100: 354,4

#### Średnie dalsze trwanie życia (w miesiącach) - dla wieku 65 lat:
2014: 209,0    2024: 210,2    2034: 227,1    2044: 243,2    2054: 258,4    2064: 272,6
2015: 207,3    2025: 212,0    2035: 228,8    2045: 244,8    2055: 259,9    2065: 274,0
2016: 210,7    2026: 213,8    2036: 230,5    2046: 246,4    2056: 261,4    2066: 275,4
2017: 209,8    2027: 215,6    2037: 232,2    2047: 248,0    2057: 262,9    2067: 276,8
2018: 208,6    2028: 217,4    2038: 233,9    2048: 249,6    2058: 264,4    2068: 278,2
2019: 209,2    2029: 219,1    2039: 235,5    2049: 251,2    2059: 265,9    2069: 279,6
2020: 197,9    2030: 220,9    2040: 237,2    2050: 252,8    2060: 267,4    2070: 281,0
2021: 190,7    2031: 222,6    2041: 238,8    2051: 254,3    2061: 268,8    2071: 282,3
2022: 203,3    2032: 224,3    2042: 240,4    2052: 255,9    2062: 270,3    2072: 283,7
2023: 211,5    2033: 226,0    2043: 242,0    2053: 257,4    2063: 271,7    2073-2100: 293,5

**Uwaga**: Dla kobiet (wiek emerytalny 60 lat) użyj tablicy dla wieku 60. Dla mężczyzn (wiek emerytalny 65 lat) użyj tablicy dla wieku 65.

## ALGORYTM OBLICZANIA EMERYTURY (zgodny z ZUS)

### Krok 1: Określenie współczynnika wynagrodzenia do średniej krajowej

Rok bieżący to 2025.

wspolczynnik_do_sredniej = wynagrodzenie_brutto / przecietne_wynagrodzenie[2025]
wspolczynnik_do_sredniej = wynagrodzenie_brutto / 8766,84

### Krok 2: Rekonstrukcja historii wynagrodzeń

**Dla wszystkich lat pracy (od rok_rozpoczecia_pracy do rok_zakonczenia_pracy):**

wynagrodzenie[rok] = przecietne_wynagrodzenie[rok] * wspolczynnik_do_sredniej

**Przykład**: Jeśli zarabiasz 10 000 PLN w 2025:
- wspolczynnik_do_sredniej = 10 000 / 8766,84 = 1,1407
- wynagrodzenie[2020] = 5167,47 * 1,1407 = 5894,12 PLN
- wynagrodzenie[2030] = 11497,64 * 1,1407 = 13114,45 PLN

### Krok 3: Obliczenie składek emerytalnych

Dla każdego roku pracy od \`rok_rozpoczecia_pracy\` do \`rok_zakonczenia_pracy\`:

roczna_skladka_emerytalna = wynagrodzenie[rok] * 12 * 0,1952
skladka_na_konto[rok] = roczna_skladka_emerytalna * 0,6260 = roczna_skladka * 0,6260
skladka_na_subkonto[rok] = roczna_skladka_emerytalna * 0,3740 = roczna_skladka * 0,3740

**Uwzględnienie przerw w pracy:**

Jeśli przerwy_w_pracy = true:
  lata_pracy = rok_zakonczenia - rok_rozpoczecia
  miesiace_pracy = lata_pracy * 12 - przerwy_laczna_liczba_miesiecy
  wspolczynnik_pracy = miesiace_pracy / (lata_pracy * 12)
  
  Dla każdego roku:
  skladka_na_konto[rok] *= wspolczynnik_pracy
  skladka_na_subkonto[rok] *= wspolczynnik_pracy

### Krok 4: Waloryzacja składek (KLUCZOWE!)

**Waloryzacja składek na KONCIE:**

Składki na koncie waloryzowane są rocznym wskaźnikiem waloryzacji składek zewidencjonowanych na koncie z dokumentu.

Dla składki wpłaconej w roku t, waloryzowanej do roku emerytury T:

skladka_zwaloryzowana_konto[t] = skladka_na_konto[t] * ILOCZYN(wskaznik_waloryzacji_konto[i])
gdzie i = od t+1 do roku_zakonczenia_pracy

**Przykład**: Składka 10 000 PLN wpłacona w 2020, waloryzowana do 2025:
wskazniki: 2021: 109,33%, 2022: 114,40%, 2023: 114,87%, 2024: 114,41%, 2025: 107,39%
10 000 * (109,33/100) * (114,40/100) * (114,87/100) * (114,41/100) * (107,39/100) = 10 000 * 1,0933 * 1,1440 * 1,1487 * 1,1441 * 1,0739 = 17 412,35 PLN

**Waloryzacja składek na SUBKONCIE:**

skladka_zwaloryzowana_subkonto[t] = skladka_na_subkonto[t] * ILOCZYN(wskaznik_waloryzacji_subkonto[i])
gdzie i = od t+1 do T

**Przykład**: Składka 5 000 PLN wpłacona w 2020, waloryzowana do 2025:
wskazniki: 2021: 107,07%, 2022: 109,20%, 2023: 109,91%, 2024: 109,83%, 2025: 111,13%
5 000 * (107,07/100) * (109,20/100) * (109,91/100) * (109,83/100) * (111,13/100) = 5 000 * 1,0707 * 1,0920 * 1,0991 * 1,0983 * 1,1113 = 7 512,89 PLN

**Suma kapitału emerytalnego:**

Konto_suma = SUMA(skladka_zwaloryzowana_konto[t]) dla wszystkich lat t
Subkonto_suma = SUMA(skladka_zwaloryzowana_subkonto[t]) dla wszystkich lat t

### Krok 5: Kapitał emerytalny całkowity

Jeśli użytkownik podał srodki_na_koncie i srodki_na_subkoncie:
  Konto_suma += srodki_na_koncie
  Subkonto_suma += srodki_na_subkoncie

K = Konto_suma + Subkonto_suma

### Krok 6: Obliczenie emerytury miesięcznej

**Wzór podstawowy ZUS:**

Emerytura_miesieczna_brutto = K / srednie_dalsze_trwanie_zycia_w_miesiacach

gdzie:
- K = kapitał emerytalny całkowity (konto + subkonto)
- srednie_dalsze_trwanie_zycia = wartość z tablicy dla odpowiedniego wieku i roku przejścia na emeryturę
  - Dla kobiet (60 lat): użyj tablicy dla wieku 60
  - Dla mężczyzn (65 lat): użyj tablicy dla wieku 65

**Przykład**: Kapitał 500 000 PLN, kobieta, emerytura w 2030:
Emerytura_miesieczna_brutto = 500 000 / 274,1 = 1 824,15 PLN

### Krok 7: Minimalna emerytura

Minimalna emerytura przysługuje tylko przy spełnieniu warunku stażu:
- Kobiety: minimum 20 lat składkowych
- Mężczyźni: minimum 25 lat składkowych

lata_skladkowe = (rok_zakonczenia - rok_rozpoczecia) - (przerwy_laczna_liczba_miesiecy / 12)

Jeśli (plec == "kobieta" AND lata_skladkowe >= 20) OR (plec == "mężczyzna" AND lata_skladkowe >= 25):
  Jeśli Emerytura_miesieczna_brutto < minimalna_emerytura[rok_zakonczenia]:
    Emerytura_miesieczna_brutto = minimalna_emerytura[rok_zakonczenia]

### Krok 8: Emerytura netto (po składce zdrowotnej)

Od 2022 r. składka zdrowotna jest odliczana od emerytury:

skladka_zdrowotna = Emerytura_miesieczna_brutto * 0,09
Emerytura_miesieczna_netto = Emerytura_miesieczna_brutto - skladka_zdrowotna

**Uwaga**: Dla uproszczenia pomijamy podatek dochodowy (większość emerytów jest zwolniona z podatku lub płaci minimalny podatek).

### Krok 9: Emerytura urealniona (w dzisiejszych złotych)

Emerytura nominalna to kwota, którą otrzymasz w przyszłości. Aby pokazać jej wartość w dzisiejszych pieniądzach (2025):

inflacja_skumulowana = ILOCZYN(wskaznik_cen_CPI[i])
gdzie i = od 2026 do roku_zakonczenia

Emerytura_urealniona_brutto = Emerytura_miesieczna_brutto / inflacja_skumulowana
Emerytura_urealniona_netto = Emerytura_miesieczna_netto / inflacja_skumulowana

**Przykład**: Emerytura 5 000 PLN w 2040:
inflacja_skumulowana = 1,03050 * 1,02620 * 1,02520 * ... * 1,02500 (15 lat) ≈ 1,456
Emerytura_urealniona = 5 000 / 1,456 = 3 434,07 PLN (w cenach 2025)

### Krok 10: Stopa zastąpienia

Wynagrodzenie_w_roku_emerytury = wynagrodzenie[rok_zakonczenia] (z Kroku 2)
Stopa_zastąpienia = (Emerytura_miesieczna_brutto / Wynagrodzenie_w_roku_emerytury) * 100%

### Krok 11: Porównanie do średniej krajowej

Przecietne_wynagrodzenie_w_roku = przecietne_wynagrodzenie[rok_zakonczenia]
Procent_przecietnego = (Emerytura_miesieczna_brutto / Przecietne_wynagrodzenie_w_roku) * 100%

### Krok 12: Wpływ przerw w pracy

Jeśli użytkownik miał przerwy, oblicz scenariusz bez przerw:

Kapitał_bez_przerw = Krok 3-5 z wspolczynnik_pracy = 1,0
Emerytura_bez_przerw_brutto = Kapitał_bez_przerw / srednie_dalsze_trwanie_zycia
Emerytura_bez_przerw_netto = Emerytura_bez_przerw_brutto * 0,91

Strata_kapital = Kapitał_bez_przerw - K
Strata_emerytura_brutto = Emerytura_bez_przerw_brutto - Emerytura_miesieczna_brutto
Strata_emerytura_netto = Emerytura_bez_przerw_netto - Emerytura_miesieczna_netto

### Krok 13: Scenariusze dłuższej pracy

Powtórz Kroki 2-11 dla:
- \`rok_zakonczenia + 1 rok\`
- \`rok_zakonczenia + 2 lata\`
- \`rok_zakonczenia + 5 lat\`

Oblicz wzrost emerytury w % względem scenariusza podstawowego:

Wzrost_procent_brutto = ((Emerytura_nowa_brutto - Emerytura_podstawowa_brutto) / Emerytura_podstawowa_brutto) * 100%
Wzrost_procent_netto = ((Emerytura_nowa_netto - Emerytura_podstawowa_netto) / Emerytura_podstawowa_netto) * 100%

## FORMAT WYNIKU (JSON)

{
  "emerytura_nominalna_miesieczna_brutto": 5234.56,
  "emerytura_nominalna_miesieczna_netto": 4763.45,
  "emerytura_urealniona_miesieczna_brutto": 3567.89,
  "emerytura_urealniona_miesieczna_netto": 3246.78,
  "rok_przejscia_na_emeryture": 2040,
  "wiek_przejscia_na_emeryture": 65,
  "stopa_zastapienia_procent": 42.5,
  "procent_przecietnego_wynagrodzenia": 85.3,
  "przecietne_wynagrodzenie_w_roku": 18557.02,
  "wynagrodzenie_w_roku_emerytury": 12345.67,
  "kapital_emerytalny": {
    "konto": 987654.32,
    "subkonto": 543210.98,
    "suma": 1530865.30
  },
  "srednie_dalsze_trwanie_zycia_miesiace": 237.2,
  "lata_skladkowe": 40,
  "inflacja_skumulowana": 1.456,
  "wplyw_przerw": {
    "miesiace_przerw": 24,
    "strata_kapital_pln": 45678.90,
    "strata_emerytura_miesieczna_brutto_pln": 156.23,
    "strata_emerytura_miesieczna_netto_pln": 142.17
  },
  "scenariusze_dluzszej_pracy": [
    {
      "dodatkowe_lata": 1,
      "rok_emerytury": 2041,
      "wiek": 66,
      "emerytura_nominalna_brutto": 5567.89,
      "emerytura_nominalna_netto": 5066.78,
      "emerytura_urealniona_brutto": 3789.12,
      "emerytura_urealniona_netto": 3448.10,
      "wzrost_procent_brutto": 6.4,
      "wzrost_procent_netto": 6.4,
      "kapital_emerytalny": 1635789.45,
      "srednie_dalsze_trwanie_zycia": 238.8
    },
    {
      "dodatkowe_lata": 2,
      "rok_emerytury": 2042,
      "wiek": 67,
      "emerytura_nominalna_brutto": 5912.34,
      "emerytura_nominalna_netto": 5380.23,
      "emerytura_urealniona_brutto": 4023.45,
      "emerytura_urealniona_netto": 3661.34,
      "wzrost_procent_brutto": 12.9,
      "wzrost_procent_netto": 12.9,
      "kapital_emerytalny": 1748923.67,
      "srednie_dalsze_trwanie_zycia": 240.4
    },
    {
      "dodatkowe_lata": 5,
      "rok_emerytury": 2045,
      "wiek": 70,
      "emerytura_nominalna_brutto": 6789.01,
      "emerytura_nominalna_netto": 6178.00,
      "emerytura_urealniona_brutto": 4612.78,
      "emerytura_urealniona_netto": 4197.63,
      "wzrost_procent_brutto": 29.7,
      "wzrost_procent_netto": 29.7,
      "kapital_emerytalny": 2043567.89,
      "srednie_dalsze_trwanie_zycia": 244.8
    }
  ],
  "komunikaty": [
    "Twoja prognozowana emerytura: 5 234,56 PLN brutto / 4 763,45 PLN netto miesięcznie (w cenach z 2040 roku)",
    "W dzisiejszych pieniądzach (2025) to około: 3 567,89 PLN brutto / 3 246,78 PLN netto miesięcznie",
    "To 42,5% Twojego ostatniego wynagrodzenia (stopa zastąpienia)",
    "Twoja emerytura to 85,3% przeciętnego wynagrodzenia w 2040 roku",
    "Zgromadzony kapitał emerytalny: 1 530 865,30 PLN",
    "Pracując 5 lat dłużej zwiększysz emeryturę o 29,7%",
    "Przerwy w pracy (24 miesiące) zmniejszyły Twoją emeryturę o 156,23 PLN brutto / 142,17 PLN netto miesięcznie"
  ]
}

od teraz zwracasz tylko json który będzie poprawny bo inaczej wszystko co zrobisz będzie zepsute i nie będzie działać prawidłowo, proszę postaraj się i myśl krok po kroku`;

export const PENSION_FACTS: string[] = [
  "Czy wiesz, że ponad 24% Polaków to już emeryci lub renciści?",
  "Czy wiedziałeś, że połowa seniorów w Polsce żyje za mniej niż 3,5 tys. zł brutto miesięcznie?",
  "Czy wiesz, że liczba osób z emeryturą powyżej 5 tys. zł rośnie co roku o kilkadziesiąt procent?",
  "Czy wiedziałeś, że aż 79% Polaków nie odkłada samodzielnie na emeryturę?",
  "Czy wiesz, że tylko co czwarty dorosły Polak ma jakiekolwiek prywatne oszczędności emerytalne?",
  "Czy wiedziałeś, że do PPK należy już prawie 4 mln osób, ale większość wpłaca minimalne kwoty?",
  "Czy wiesz, że tylko 31% osób poniżej 30. roku życia oszczędza z myślą o emeryturze?",
  "Czy wiedziałeś, że urlop macierzyński i wychowawczy wlicza się do stażu emerytalnego, ale nie zawsze wpływa na wysokość świadczenia?",
  "Czy wiesz, że posiadanie dzieci może oznaczać nawet kilkanaście procent mniej odkładanych pieniędzy na przyszłą emeryturę?",
  "Czy wiedziałeś, że kobiety znacznie częściej mają niższe emerytury z powodu przerw zawodowych na wychowanie dzieci?",
  "Czy wiesz, że co siódmy emeryt w Polsce nadal pracuje zawodowo?",
  "Czy wiedziałeś, że większość Polaków przechodzi na emeryturę natychmiast, gdy tylko zyska do niej prawo?",
  "Czy wiesz, że każda zmiana wieku emerytalnego od razu wpływa na decyzje o przejściu na emeryturę?",
  "Czy wiedziałeś, że edukacja, liczba dzieci i długość kariery mają bezpośredni wpływ na wysokość emerytury?",
  "Czy wiesz, że osoby pomagające finansowo swoim dorosłym dzieciom często opóźniają przejście na emeryturę?",
  "Czy wiedziałeś, że obowiązki opiekuńcze nad starszymi krewnymi często przyspieszają decyzję o emeryturze?",
  "Czy wiesz, że aż 70% Polaków wierzy, że państwo się zatroszczy o ich przyszłą emeryturę?",
  "Czy wiedziałeś, że tylko 11% Polaków ufa systemowi emerytalnemu – mimo to większość nie oszczędza samodzielnie?",
  "Czy wiesz, że Polska ma coraz więcej „wysokich” emerytur, ale też rośnie liczba osób z minimalnymi świadczeniami?",
  "Czy wiedziałeś, że praca na B2B nie gwarantuje emerytury, jeśli przedsiębiorca nie płaci składek ZUS?",
  "Czy wiesz, że osoba pracująca 20 lat na umowie o dzieło może w ogóle nie mieć prawa do emerytury?",
  "Czy wiedziałeś, że emerytura z umowy-zlecenia zależy tylko od tego, czy były odprowadzane składki?",
  "Czy wiesz, że co trzeci Polak na B2B nie odkłada nic poza obowiązkowym ZUS-em?",
  "Czy wiedziałeś, że emerytura z B2B może być nawet czterokrotnie niższa, jeśli przez lata płacono minimalny ZUS?",
  "Czy wiesz, że przeciętny Polak spędzi na emeryturze około 20 lat życia – czyli jedną czwartą dorosłości?",
];

export function getRandomFact(): string {
  return PENSION_FACTS[Math.floor(Math.random() * PENSION_FACTS.length)];
}

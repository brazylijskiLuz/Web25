# Dostępność WCAG 2.0 - Symulator Emerytalny

## Przegląd

Ta aplikacja została zaprojektowana zgodnie z wytycznymi Web Content Accessibility Guidelines (WCAG) 2.0 na poziomie AA, zapewniając dostępność dla wszystkich użytkowników, w tym osób z niepełnosprawnościami.

## Funkcje Dostępności

### 1. Panel Dostępności

Aplikacja zawiera dedykowany panel dostępności, dostępny przez ikonę dostępności w nagłówku. Panel oferuje następujące opcje:

#### Rozmiar Tekstu

- **Normalny**: Standardowy rozmiar czcionki (16px)
- **Duży**: Zwiększony rozmiar czcionki (18px)
- **Bardzo duży**: Największy rozmiar czcionki (20px)

#### Wysokość Linii

- **Normalna**: Standardowa wysokość linii
- **Luźna**: Zwiększona wysokość linii (1.75)
- **Bardzo luźna**: Największa wysokość linii (2.0)

#### Ustawienia Wizualne

- **Wysoki kontrast**: Zwiększa kontrast kolorów do maksimum
- **Tryb ciemny**: Zmienia schemat kolorów na ciemny

#### Wskaźniki Fokusa

- **Standardowy**: Domyślne wskaźniki fokusa
- **Wysoka widoczność**: Zwiększone wskaźniki fokusa z czerwoną ramką

#### Animacje

- **Ograniczone animacje**: Wyłącza animacje dla użytkowników wrażliwych na ruch

#### Czytnik Ekranu

- **Optymalizacja**: Dodatkowe wsparcie dla technologii wspomagających

#### Nawigacja Klawiaturą

- **Włączona**: Zapewnia pełną nawigację za pomocą klawiatury

### 2. Nawigacja Klawiaturą

#### Klawisze Nawigacji

- **Tab**: Przesuwanie między elementami interaktywnymi
- **Shift + Tab**: Powrót do poprzedniego elementu
- **Enter**: Aktywacja przycisków i linków
- **Spacja**: Aktywacja przycisków
- **Escape**: Zamknięcie modali i paneli

#### Skip Links

- **"Przejdź do głównej treści"**: Pozwala pominąć nawigację i przejść bezpośrednio do treści

### 3. Wsparcie dla Czytników Ekranu

#### Semantyczne Znaczniki HTML

- Używanie odpowiednich elementów HTML (`<header>`, `<main>`, `<nav>`, `<section>`)
- Właściwa hierarchia nagłówków (h1, h2, h3, itd.)
- Opisywanie linków i przycisków

#### Atrybuty ARIA

- `aria-label`: Opisy elementów interaktywnych
- `aria-describedby`: Łączenie elementów z opisami
- `aria-live`: Regiony na żywo dla dynamicznych treści
- `role`: Definiowanie ról elementów

### 4. Kontrast Kolorów

#### Standardowe Tryby

- Wszystkie kolory spełniają wymagania WCAG 2.0 AA (stosunek kontrastu 4.5:1)
- Tekst na tle ma stosunek kontrastu co najmniej 7:1 dla dużego tekstu

#### Tryb Wysokiego Kontrastu

- Czarne tło z białym tekstem
- Zwiększone obramowania elementów
- Wszystkie elementy interaktywne mają wyraźne kontrasty

### 5. Responsywność

#### Różne Rozmiary Ekranów

- Elastyczny layout dostosowujący się do rozmiaru ekranu
- Minimalne rozmiary dotykowych elementów (44x44px)
- Czytelność na urządzeniach mobilnych

### 6. Formularze

#### Dostępne Pola Formularzy

- Jasne etykiety dla wszystkich pól
- Opisy błędów dostępne dla czytników ekranu
- Walidacja w czasie rzeczywistym z komunikatami

## Zgodność z WCAG 2.0

### Poziom AA - Zaimplementowane Kryteria

#### 1. Percepcja

- **1.1.1**: Alternatywny tekst dla obrazów
- **1.3.1**: Informacje i relacje
- **1.3.2**: Znacząca sekwencja
- **1.4.3**: Kontrast (minimum)
- **1.4.4**: Zmiana rozmiaru tekstu
- **1.4.5**: Obrazy tekstu

#### 2. Funkcjonalność

- **2.1.1**: Klawiatura
- **2.1.2**: Brak pułapki klawiatury
- **2.4.1**: Pomijanie bloków
- **2.4.2**: Strony z tytułami
- **2.4.3**: Porządek fokusa
- **2.4.4**: Cel linku (w kontekście)
- **2.4.6**: Nagłówki i etykiety
- **2.4.7**: Widoczny fokus

#### 3. Zrozumiałość

- **3.1.1**: Język strony
- **3.2.1**: Po fokusie
- **3.2.2**: Po wprowadzeniu danych
- **3.3.1**: Identyfikacja błędu
- **3.3.2**: Etykiety lub instrukcje

#### 4. Niezawodność

- **4.1.1**: Parsowanie
- **4.1.2**: Nazwa, rola, wartość

## Testowanie Dostępności

### Narzędzia Testowe

- **axe-core**: Automatyczne testy dostępności
- **WAVE**: Web Accessibility Evaluation Tool
- **Lighthouse**: Audyt dostępności w Chrome DevTools
- **Czytniki ekranu**: NVDA, JAWS, VoiceOver

### Testowanie Ręczne

1. **Nawigacja klawiaturą**: Sprawdzenie wszystkich funkcji za pomocą klawiatury
2. **Czytnik ekranu**: Testowanie z różnymi czytnikami ekranu
3. **Zoom**: Sprawdzenie działania przy powiększeniu do 200%
4. **Kontrast**: Weryfikacja kontrastu kolorów

## Wsparcie Przeglądarek

### Obsługiwane Przeglądarki

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Funkcje Dostępności

- Obsługa preferencji systemowych (reduced-motion)
- Wsparcie dla wysokiego kontrastu systemowego
- Integracja z technologiami wspomagającymi

## Zasoby Dodatkowe

### Dokumentacja

- [WCAG 2.0 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/)

### Narzędzia Deweloperskie

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse Accessibility](https://developers.google.com/web/tools/lighthouse)

## Kontakt i Wsparcie

W przypadku problemów z dostępnością lub sugestii ulepszeń, prosimy o kontakt z zespołem deweloperskim.

---

**Ostatnia aktualizacja**: 2024
**Wersja**: 1.0
**Standard**: WCAG 2.0 AA

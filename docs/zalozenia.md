# Założenia projektowe – sklep internetowy z elektroniką

## 1. Cel i zakres

Serwis WWW – sklep internetowy z elektroniką użytkową (audio, komputery, smartfony, akcesoria), który oprócz
standardowej sprzedaży proponuje każdemu klientowi produkty i oferty dobrane na podstawie jego profilu
i aktywności.

Zakres:

- katalog produktów z wyszukiwaniem, filtrowaniem, sortowaniem i stronicowaniem,
- konta klientów z uwierzytelnianiem,
- koszyk, składanie zamówień z symulowaną płatnością, historia zamówień,
- inteligentne usługi: rekomendacje produktów, spersonalizowane oferty i asystent AI dobierający sprzęt do budżetu.

Poza zakresem: prawdziwe płatności online (bramka płatności jest symulowana) oraz integracja z firmami
kurierskimi.

## 2. Architektura i technologie

Aplikacja webowa składa się z trzech części:

- **Frontend** – strona sklepu w przeglądarce (React, TypeScript),
- **Backend** – serwer z logiką sklepu (Java, Spring Boot) i bazą danych PostgreSQL,
- **Keycloak** – osobny serwer odpowiedzialny za rejestrację i logowanie użytkowników.

## 3. Role użytkowników

| Rola                 | Uprawnienia                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| Gość (niezalogowany) | przeglądanie i wyszukiwanie produktów, koszyk, ogólne rekomendacje (bestsellery, nowości)      |
| Klient (`user`)      | jak gość + składanie zamówień, historia zamówień, konto, rekomendacje i oferty personalizowane |

Role są rolami realmu w Keycloak i trafiają do tokenu JWT (`realm_access.roles`); backend sprawdza je przy
każdym żądaniu.

## 4. Wymagania funkcjonalne

| Wymaganie                                                                                          | Rola    |
| -------------------------------------------------------------------------------------------------- | ------- |
| Rejestracja i logowanie przez Keycloak (własny motyw strony logowania)                             | gość    |
| Katalog produktów ze stronicowaniem                                                                | wszyscy |
| Wyszukiwanie po nazwie, filtry (kategoria, marka, cena, łączność), sortowanie                      | wszyscy |
| Karta produktu: opis, cena, dostępność, galeria zdjęć, specyfikacja techniczna                     | wszyscy |
| Podobne produkty na karcie produktu                                                                | wszyscy |
| Koszyk: dodawanie, zmiana ilości, usuwanie, podsumowanie                                           | wszyscy |
| Złożenie zamówienia: dane kontaktowe, adres, metoda dostawy, płatność (BLIK, karta), faktura       | klient  |
| Wycena zamówienia na serwerze z aktualnych cen (z VAT), rezerwacja i zwolnienie stanu magazynowego | klient  |
| Historia zamówień i szczegóły zamówienia ze statusem                                               | klient  |
| Strona konta: dane klienta, ostatnie zamówienia, statystyki, zapisany adres                        | klient  |
| Sekcja „Polecane dla Ciebie” (rekomendacje)                                                        | wszyscy |
| Spersonalizowane rabaty na stronie konta, naliczane w koszyku                                      | klient  |
| Rejestrowanie aktywności klienta (wyświetlenia, wyszukiwania, dodania do koszyka)                  | klient  |
| Oceny i opinie produktów                                                                           | klient  |
| Czat z asystentem AI dobierającym sprzęt do budżetu                                                | wszyscy |

## 5. Inteligentne usługi

Sklep zapamiętuje, co klient ogląda i kupuje, i na tej podstawie podpowiada mu produkty i rabaty. Każdy
pomysł ma prosty scenariusz, w którym od razu widać jego działanie.

### 5.1. Rekomendacje produktów

| Pomysł                    | Jak to sprawdzić                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| „Polecane dla Ciebie”     | klient kupuje słuchawki Sony → na stronie głównej pojawiają się inne produkty audio i produkty Sony |
| „Bestsellery dla gościa”  | niezalogowany użytkownik widzi najczęściej kupowane produkty                                        |
| „Często kupowane razem”   | na karcie smartfona widać etui i ładowarki, które inni klienci kupili razem z nim                   |
| „Na podstawie oglądanych” | klient ogląda kilka laptopów → w polecanych pojawiają się inne laptopy w podobnej cenie             |

### 5.2. Spersonalizowane rabaty

Rabaty widoczne na stronie konta w sekcji „Oferty dla Ciebie” i naliczane automatycznie w koszyku:

| Pomysł             | Jak to sprawdzić                                                             |
| ------------------ | ---------------------------------------------------------------------------- |
| Rabat na akcesoria | klient kupuje smartfon → dostaje 10% rabatu na akcesoria do niego            |
| Ulubiona kategoria | klient ogląda dużo produktów audio → dostaje rabat na wybrane produkty audio |
| Stały klient       | od trzeciego zamówienia klient ma darmową dostawę                            |

### 5.3. Asystent AI – czat doboru sprzętu

W rogu strony jest czat z asystentem. Klient pisze swoimi słowami, czego potrzebuje, np. _„mam 3000 zł,
chcę komputer do gier”_ albo _„szukam słuchawek do biegania do 300 zł”_. Asystent:

- dopytuje, jeśli czegoś brakuje (np. w jakie gry klient gra, czy ma już monitor),
- proponuje produkty lub zestaw z oferty sklepu mieszczący się w budżecie i krótko uzasadnia wybór,
- pokazuje propozycje jako karty produktów z przyciskiem „Dodaj do koszyka”,
- pozwala poprawiać propozycję w rozmowie (np. _„a coś tańszego?”_, _„wolę AMD”_).

Asystent proponuje tylko produkty dostępne w sklepie, w aktualnych cenach.

## 6. Bezpieczeństwo

- **Uwierzytelnianie** – OAuth 2.0 / OpenID Connect przez Keycloak (przepływ Authorization Code + PKCE);
  frontend dostaje token JWT i wysyła go w nagłówku `Authorization: Bearer`.
- **Weryfikacja tokenu** – backend działa jako OAuth2 Resource Server: sprawdza podpis, ważność i wystawcę
  tokenu; sesje są bezstanowe.
- **Hasła** – przechowuje i haszuje Keycloak; aplikacja nigdy ich nie widzi.
- **Autoryzacja** – role realmu mapowane na role Spring Security; publiczne są tylko odczyt produktów
  i opcji zamówienia, zamówienia wymagają roli `user`.
- **Izolacja danych** – klient widzi wyłącznie własne zamówienia (filtrowanie po identyfikatorze z tokenu).
- **Walidacja** – Bean Validation na wejściu endpointów, zapytania JPA z parametrami (ochrona przed SQL
  injection), ceny liczone wyłącznie na serwerze.
- **Testy bezpieczeństwa** – testy integracyjne sprawdzają dostęp do endpointów bez tokenu i z tokenem.

## 7. Wymagania niefunkcjonalne

- Odpowiedź API na typowe żądanie poniżej 500 ms przy danych testowych.
- Interfejs responsywny (telefon, tablet, komputer), w języku polskim.
- Całe środowisko uruchamiane jedną komendą (`task dev`).
- Kontrakt API generowany z kodu (OpenAPI), klient frontendu generowany z kontraktu.
- Testy integracyjne backendu na prawdziwej bazie PostgreSQL (Testcontainers).

# Założenia projektowe – sklep internetowy z elektroniką

## 1. Cel i zakres

Celem jest serwis WWW – sklep internetowy z elektroniką użytkową. Oprócz zwykłej sprzedaży będzie on dobierał
klientowi produkty na podstawie jego zachowania i pomagał mu wybrać sprzęt w rozmowie z asystentem AI.

Poza zakresem: prawdziwe płatności online (płatność będzie symulowana), integracja z firmami kurierskimi,
wysyłka e-maili, opinie o produktach.

## 2. Technologie

| Element        | Technologia                                                | Zastosowanie                              |
| -------------- | ---------------------------------------------------------- | ----------------------------------------- |
| Frontend       | React, TypeScript, Mantine, Tailwind CSS                   | strona sklepu i panel administratora      |
| Backend        | Java, Spring Boot                                          | logika sklepu i inteligentnych usług      |
| Baza danych    | PostgreSQL z rozszerzeniem pgvector                        | dane sklepu i wektory opisów produktów    |
| Logowanie      | Keycloak (OAuth 2.0 / OpenID Connect)                      | rejestracja, logowanie, role              |
| Model językowy | Claude Opus 5.5 (API Anthropic)                            | asystent AI                               |
| Wektory opisów | wielojęzyczny model `bge-m3` uruchamiany lokalnie w Ollama | wyszukiwanie produktów po znaczeniu opisu |
| Uruchamianie   | Docker Compose                                             | całe środowisko uruchamiane jedną komendą |

## 3. Role użytkowników

| Rola          | Uprawnienia                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------- |
| Gość          | przeglądanie i wyszukiwanie produktów, koszyk, bestsellery, czat z asystentem                |
| Klient        | jak gość + składanie zamówień, historia zamówień, strona konta, rekomendacje personalizowane |
| Administrator | zarządzanie produktami i stanami magazynowymi, zmiana statusów zamówień                      |

## 4. Dane produktów

Każdy produkt będzie miał:

- nazwę, markę, kategorię, cenę brutto i stan magazynowy,
- opis i zdjęcia,
- specyfikację do wyświetlenia na karcie produktu,
- **atrybuty techniczne**, z których korzystają dopasowanie (6.5) i zestawy (6.6),
- **ocenę jakości** w skali 1–100, według której będzie wybierany najlepszy zestaw.

Przykładowe grupy kategorii: audio (słuchawki, głośniki), smartfony i smartwatche, komputery (laptopy, tablety),
monitory i peryferia (myszy, klawiatury), akcesoria (etui, ładowarki, kable, stacje dokujące).

Zakładane atrybuty techniczne:

| Kategoria        | Atrybuty                                            |
| ---------------- | --------------------------------------------------- |
| smartfon         | model, złącze ładowania                             |
| etui             | model telefonu, do którego pasuje                   |
| ładowarka, kabel | złącze, moc                                         |
| laptop           | wyjścia wideo, USB-C z obrazem                      |
| monitor          | wejścia wideo, przekątna, częstotliwość odświeżania |
| stacja dokująca  | wymagane USB-C z obrazem                            |

Sklep będzie miał przygotowane dane startowe, wystarczające do pokazania wszystkich funkcji.

## 5. Sklep – wymagania funkcjonalne

| Wymaganie                                                                                                                                          | Rola    |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Rejestracja i logowanie przez Keycloak z własnym motywem strony logowania                                                                          | gość    |
| Katalog produktów ze stronicowaniem                                                                                                                | wszyscy |
| Filtry (kategoria, marka, cena, łączność) i sortowanie (trafność, cena, nowość, popularność)                                                       | wszyscy |
| Wyszukiwarka działająca jak w punkcie 6.4                                                                                                          | wszyscy |
| Karta produktu: zdjęcia, cena, dostępność, opis, specyfikacja, rekomendacje z punktu 6.3                                                           | wszyscy |
| Koszyk: dodawanie, zmiana ilości, usuwanie, podsumowanie                                                                                           | wszyscy |
| Zamówienie: dane kontaktowe, adres, metoda dostawy (kurier, odbiór osobisty), płatność (BLIK, karta), faktura                                      | klient  |
| Cena zamówienia liczona po stronie serwera z aktualnych cen; rezerwacja towaru przy zamówieniu, zwolnienie przy nieudanej płatności lub anulowaniu | klient  |
| Historia zamówień i szczegóły zamówienia ze statusem                                                                                               | klient  |
| Strona konta: dane klienta, ostatnie zamówienia, podsumowanie zakupów, zapisany adres                                                              | klient  |
| Panel: dodawanie, edycja i usuwanie produktów, zmiana stanów magazynowych                                                                          | admin   |
| Panel: lista zamówień, zmiana statusu                                                                                                              | admin   |

Statusy zamówienia i dozwolone przejścia:

| Status               | Może przejść do             | Kto zmienia      |
| -------------------- | --------------------------- | ---------------- |
| Oczekuje na płatność | Opłacone, Płatność nieudana | system płatności |
| Opłacone             | Wysłane, Anulowane          | administrator    |
| Wysłane              | –                           | –                |
| Płatność nieudana    | –                           | –                |
| Anulowane            | –                           | –                |

## 6. Inteligentne usługi

### 6.1. Rejestrowanie aktywności

Sklep będzie zapisywał zdarzenia zalogowanych klientów: wyświetlenie produktu, wyszukiwanie (z treścią
zapytania), dodanie do koszyka i zakup. Na tych danych będą się opierać rekomendacje i ich ocena.

### 6.2. Symulator klientów

Sklep nie będzie miał prawdziwych klientów, więc dane o aktywności wygeneruje symulator. Przy każdym
uruchomieniu da te same wyniki, żeby ocena jakości była powtarzalna.

Każdy symulowany klient będzie miał jeden typ:

| Typ klienta       | Czym się interesuje                                     |
| ----------------- | ------------------------------------------------------- |
| gracz             | laptopy do gier, monitory, myszy, klawiatury, słuchawki |
| biegacz           | słuchawki sportowe, smartwatche                         |
| student           | laptopy, tablety, słuchawki, myszy                      |
| fan muzyki        | słuchawki, głośniki                                     |
| pracownik biurowy | laptopy, monitory, stacje dokujące, klawiatury, myszy   |
| fan smartfonów    | smartfony, smartwatche, akcesoria do telefonów          |

Zasady zachowania symulowanych klientów:

- większość oglądanych produktów pochodzi z kategorii ich typu, reszta jest losowa,
- każdy klient ma ulubione marki, które wybiera częściej,
- każdy klient ma budżet zależny od typu,
- tylko część obejrzanych produktów trafia do koszyka i tylko część koszyków kończy się zakupem,
- po zakupie smartfona lub laptopa klient często dokupuje pasujące akcesorium (punkt 6.5).

### 6.3. Rekomendacje produktów

| Sekcja                    | Gdzie                      | Jak liczona                                                                          | Gdy brak danych                                                   |
| ------------------------- | -------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| „Polecane dla Ciebie”     | strona główna zalogowanego | filtrowanie kolaboratywne (opis niżej)                                               | mało historii: reguła kategoria/marka; brak historii: bestsellery |
| „Na podstawie oglądanych” | strona główna zalogowanego | produkty z kategorii ostatnio oglądanych, w podobnej cenie                           | sekcja ukryta                                                     |
| „Bestsellery”             | strona główna gościa       | najczęściej kupowane produkty z ostatniego miesiąca                                  | najnowsze produkty                                                |
| „Często kupowane razem”   | karta produktu             | produkty, które najczęściej trafiały do tych samych zamówień                         | pasujące akcesoria z punktu 6.5                                   |
| „Podobne produkty”        | karta produktu             | produkty z tej samej kategorii o najbardziej podobnym opisie (6.4) i zbliżonej cenie | ta sama kategoria, najbliższa cena                                |

Rekomendacje nie będą pokazywać produktów niedostępnych ani już kupionych przez klienta.

**Reguła kategoria/marka** – prosty punkt odniesienia przy ocenie jakości. Polecane są produkty z kategorii
i marek, które klient już kupował, przy czym zgodność kategorii liczy się bardziej niż zgodność marki.

**Filtrowanie kolaboratywne** – „klienci, którzy interesowali się tym co Ty, interesowali się też…”:

1. Każdy kontakt klienta z produktem ma wagę: zakup waży więcej niż dodanie do koszyka, a to więcej niż
   wyświetlenie.
2. Dwa produkty są podobne, gdy interesują się nimi ci sami klienci (podobieństwo cosinusowe).
3. Klient dostaje produkty najbardziej podobne do tych, z którymi miał kontakt, z uwzględnieniem wag kontaktów.
4. Podobieństwa będą przeliczane okresowo, a nie przy każdym wyświetleniu strony.

### 6.4. Wyszukiwanie po opisie potrzeb

Wyszukiwarka połączy dwa sposoby szukania:

| Sposób       | Na czym polega                                                               | Przykład, który ma zadziałać |
| ------------ | ---------------------------------------------------------------------------- | ---------------------------- |
| po słowach   | podobieństwo zapytania do nazwy, marki i kategorii, odporne na literówki     | „sony xm5”                   |
| po znaczeniu | opis produktu i zapytanie zamieniane na wektory, porównanie ich podobieństwa | „cicha klawiatura do biura”  |

- Wyniki obu sposobów łączymy metodą RRF: na górę trafiają produkty, które są wysoko na obu listach.
- Kwoty w zapytaniu („do 300 zł”, „od 1000 do 2000 zł”) działają jak filtr ceny.
- Filtry i sortowanie z katalogu działają też na wynikach wyszukiwania.

### 6.5. Dopasowanie akcesoriów

Sklep sprawdzi, czy akcesoria pasują do urządzenia, według stałych zasad opartych na atrybutach z rozdziału 4:

| Para                        | Zasada                          |
| --------------------------- | ------------------------------- |
| etui – smartfon             | etui pasuje do modelu smartfona |
| ładowarka, kabel – smartfon | to samo złącze                  |
| stacja dokująca – laptop    | laptop ma USB-C z obrazem       |
| monitor – laptop            | mają wspólne złącze wideo       |

Dopasowanie będzie widoczne w trzech miejscach:

- karta smartfona i laptopa – sekcja „Pasujące akcesoria” z akcesoriami, które pasują do tego urządzenia,
- koszyk – ostrzeżenie z powodem, gdy akcesorium nie pasuje do urządzenia w koszyku, np. „Etui pasuje do
  iPhone 15, a w koszyku jest iPhone 16”,
- czat z asystentem – asystent sprawdzi dopasowanie, zanim zaproponuje akcesoria lub zestaw.

### 6.6. Zestawy w budżecie

Zestawy będą dostępne w czacie z asystentem. Klient napisze, czego potrzebuje i ile chce wydać, np. _„mam
5000 zł, potrzebuję stanowiska do pracy z laptopem”_. Asystent pokaże zestaw jako karty produktów z łączną
ceną i przyciskiem „Dodaj cały zestaw”.

Zestaw będzie składany według jednego z szablonów:

| Szablon                | Części (od najważniejszej)                         |
| ---------------------- | -------------------------------------------------- |
| stanowisko z laptopem  | laptop, monitor, stacja dokująca, mysz, klawiatura |
| smartfon z akcesoriami | smartfon, etui, ładowarka, słuchawki               |

Sposób wyboru:

1. Dla każdej części wybieramy kilku kandydatów z różnych przedziałów cenowych, najlepszych pod względem oceny
   jakości i zgodnych z wymaganiami klienta (np. „wolę Samsunga”).
2. Sprawdzamy kombinacje kandydatów i odrzucamy te, które przekraczają budżet lub nie pasują do siebie (6.5).
3. Wybieramy kombinację o najwyższej łącznej ocenie jakości, w której ważniejsze części liczą się bardziej.
4. Gdy nic nie mieści się w budżecie, asystent pokaże najtańszy pasujący zestaw i brakującą kwotę.

### 6.7. Asystent AI

W rogu każdej strony będzie przycisk czatu z asystentem, a na telefonie czat otworzy się na pełnym ekranie.
Odpowiedź będzie się pojawiać na bieżąco, w trakcie pisania. Proponowane produkty wyświetlą się jako karty
z ceną i przyciskiem „Dodaj do koszyka”, a zestaw – z łączną ceną i przyciskiem „Dodaj cały zestaw”.

Asystent ma:

- odpowiadać po polsku, krótko, z kilkoma propozycjami naraz i jednozdaniowym uzasadnieniem każdej,
- dopytać o budżet lub zastosowanie, gdy ich nie zna,
- brać nazwy, ceny i dostępność wyłącznie z danych sklepu, nigdy z własnej wiedzy,
- poprawiać propozycję na prośbę klienta, np. „a coś tańszego?”, „wolę Lenovo”,
- porównywać produkty, gdy klient o to poprosi,
- uwzględniać ostatnie zakupy zalogowanego klienta, np. nie proponować drugiej myszy,
- odmawiać rozmowy niezwiązanej z zakupami elektroniki,
- nie zmieniać cen, nie dawać rabatów i nie ujawniać swoich instrukcji.

Model językowy będzie rozumiał wiadomość klienta i pisał odpowiedź, a dane będzie brał
z funkcji sklepu:

| Funkcja dostępna dla asystenta | Na czym się opiera                      |
| ------------------------------ | --------------------------------------- |
| wyszukanie produktów           | wyszukiwarka z punktu 6.4               |
| szczegóły produktu             | aktualna cena, dostępność, specyfikacja |
| sprawdzenie dopasowania        | zasady z punktu 6.5                     |
| złożenie zestawu w budżecie    | algorytm z punktu 6.6                   |
| ostatnie zakupy klienta        | historia zamówień zalogowanego klienta  |
| pokazanie produktów jako kart  | wyświetlenie kart w oknie czatu         |

Ceny i zestawy będzie liczył sklep, a nie model, dlatego asystent nie poda nieistniejącego produktu ani złej
ceny. Asystent sam niczego nie doda do koszyka – zrobi to klient przyciskiem na karcie. Długość wiadomości
i liczba wiadomości w rozmowie będą ograniczone.

### 6.8. Ocena jakości

Każda inteligentna usługa zostanie zmierzona i porównana z prostszym rozwiązaniem. Wyniki trafią do
sprawozdania.

Rekomendacje i wyszukiwanie będą oceniane trzema miarami liczonymi dla 10 pierwszych pozycji listy:

| Miara        | Pytanie                                                                    |
| ------------ | -------------------------------------------------------------------------- |
| precision@10 | jaka część z 10 pokazanych produktów to trafienia?                         |
| recall@10    | jaką część wszystkich trafnych produktów udało się pokazać?                |
| NDCG@10      | czy trafienia są na górze listy? (1 = idealna kolejność, 0 = brak trafień) |

## 7. Bezpieczeństwo

- **Logowanie** – wyłącznie przez Keycloak (OAuth 2.0 / OpenID Connect). Aplikacja nie będzie przechowywać
  haseł.
- **Uprawnienia** – backend będzie sprawdzał tożsamość i rolę przy każdym żądaniu, zgodnie z tabelą ról
  z rozdziału 3.
- **Izolacja danych** – klient zobaczy tylko własne zamówienia.
- **Dane wejściowe** – każde żądanie będzie walidowane, a baza chroniona przed SQL injection.
- **Ceny** – liczone wyłącznie na serwerze, niezależnie od tego, co wyśle przeglądarka.
- **Asystent AI** – będzie tylko odczytywał dane sklepu, nie zobaczy danych osobowych klientów i nie będzie
  mógł zmieniać cen, koszyka ani zamówień. Klucz do API modelu językowego będzie tylko na serwerze.
- **Testy** – testy automatyczne sprawdzą dostęp do każdej funkcji bez logowania, jako klient i jako
  administrator.

## 8. Wymagania niefunkcjonalne

- Typowa odpowiedź serwera poniżej 0,5 s.
- Pierwsze słowa odpowiedzi asystenta w ciągu kilku sekund.
- Interfejs responsywny (telefon, tablet, komputer), w języku polskim.
- Całe środowisko uruchamiane jedną komendą na Windows, Linux i macOS.
- Opis API generowany automatycznie z kodu backendu, a na jego podstawie klient API we frontendzie.
- Testy integracyjne backendu na prawdziwej bazie PostgreSQL.

## 9. Podział pracy

Każda osoba odpowiada za swój obszar w całości: backend, frontend, testy i część sprawozdania. Każda ma
porównywalną ilość pracy przy sklepie i przy inteligentnych usługach.

| Osoba | Obszar                   | Sklep                                                                                   | Inteligentne usługi                                                                            |
| ----- | ------------------------ | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| A     | zakupy i asystent        | środowisko uruchomieniowe, koszyk, zamówienie z płatnością symulowaną                   | asystent AI (6.7), ocena asystenta                                                             |
| B     | katalog i wyszukiwanie   | dane produktów z atrybutami, katalog, filtry, sortowanie, karta produktu                | wyszukiwanie (6.4), dopasowanie akcesoriów (6.5), zestawy (6.6), ocena wyszukiwania i zestawów |
| C     | klienci i personalizacja | Keycloak (role, motyw logowania), historia zamówień, strona konta, panel administratora | aktywność (6.1), symulator (6.2), rekomendacje (6.3), ocena rekomendacji                       |

Funkcje, z których korzysta asystent, dostarczają osoby B i C. Osoba A podłącza je do asystenta.

## 10. Kolejność prac

| Tydzień | Osoba A                                                                  | Osoba B                                                                  | Osoba C                                                                                       |
| ------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| 1–2     | środowisko uruchomieniowe, szkielet backendu i frontendu                 | model danych produktu z atrybutami, pierwsze dane                        | Keycloak, role, logowanie we frontendzie                                                      |
| 3–5     | koszyk, zamówienie, płatność                                             | katalog, filtry, karta produktu, komplet danych                          | strona konta, panel administratora (produkty), rejestrowanie aktywności                       |
| 6–8     | czat z asystentem: rozmowa, odpowiedź na bieżąco, wyszukiwanie produktów | wektory opisów, wyszukiwanie po słowach i po znaczeniu, łączenie wyników | historia zamówień, panel administratora (zamówienia), symulator klientów                      |
| 9–11    | pozostałe funkcje asystenta, karty produktów i zestawów w czacie         | dopasowanie akcesoriów, zestawy w budżecie, „Pasujące akcesoria”         | bestsellery, reguła kategoria/marka, filtrowanie kolaboratywne, pozostałe sekcje rekomendacji |
| 12–13   | rozmowy testowe, ocena asystenta, poprawki                               | zapytania testowe, ocena wyszukiwania i zestawów                         | ocena rekomendacji                                                                            |
| 14–15   | sprawozdanie, scenariusze pokazowe, prezentacja                          | sprawozdanie, scenariusze pokazowe, prezentacja                          | sprawozdanie, scenariusze pokazowe, prezentacja                                               |

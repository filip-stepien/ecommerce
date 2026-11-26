#import "@preview/fletcher:0.5.8" as fletcher: diagram, edge, node

#set document(
  title: "Sprawozdanie z realizacji projektu – sklep internetowy z elektroniką",
  author: ("Filip Stępień", "Rafał Grot", "Bartłomiej Karkoszka"),
)
#set page(paper: "a4", margin: 2cm, numbering: "1")
#set text(font: "New Computer Modern", size: 11pt, lang: "pl")
#set par(justify: true, leading: 0.58em, spacing: 0.85em)
#set list(indent: 0.6em, spacing: 0.6em)
#set enum(indent: 0.6em, spacing: 0.6em)
#show raw: set text(font: "DejaVu Sans Mono", size: 0.86em)

#set heading(numbering: "1.1")
#show heading: it => {
  set text(weight: "bold")
  let size = if it.level == 1 { 14pt } else { 12pt }
  block(above: if it.level == 1 { 1.8em } else { 1.4em }, below: 0.9em, text(size: size, {
    if it.numbering != none {
      counter(heading).display(it.numbering)
      h(0.9em)
    }
    it.body
  }))
}

#let link-color = rgb("#24427a")
#show link: set text(fill: link-color)
#show ref: set text(fill: link-color)

#show outline.entry.where(level: 1): it => {
  v(0.7em, weak: true)
  strong(it)
}

#set table(stroke: none, inset: (x: 5pt, y: 3.2pt), align: left + top)
#show table: set text(size: 9pt)
#show table: set par(justify: false, leading: 0.5em)
#show figure.where(kind: table): set figure.caption(position: top)
#show figure.caption: set text(size: 10pt)
#set figure(gap: 0.8em)

#let rule(weight) = table.hline(stroke: weight)
#let booktabs(columns: (), header: (), align: left + top, ..rows) = table(
  columns: columns,
  align: align,
  rule(0.8pt),
  table.header(..header.map(strong)),
  rule(0.4pt),
  ..rows,
  rule(0.8pt),
)
#let group(title) = table.cell(colspan: 3, inset: (x: 5pt, top: 7pt, bottom: 3pt), emph(title))

#let done = [zrealizowane]
#let partial = [częściowo]
#let missing = [brak]

#let screenshots = json("img/screenshots.json")
#let shot(name, width: 100%, max-height: 20cm) = if name in screenshots {
  layout(region => {
    let path = "img/" + name + ".png"
    let natural = measure(image(path))
    let w = calc.min(width * region.width, max-height * (natural.width / natural.height))
    block(stroke: 0.4pt + luma(170), image(path, width: w))
  })
} else {
  block(
    width: 100%,
    height: 3.5cm,
    stroke: (paint: luma(170), thickness: 0.4pt, dash: "dashed"),
    align(center + horizon, text(size: 9pt, fill: luma(100))[
      Zrzut „#name” nie został wykonany. \
      Wymaga klucza API asystenta, zob. rozdz. 10.
    ]),
  )
}

#align(center)[
  #v(1.2cm)
  #text(size: 17pt)[Sprawozdanie z realizacji projektu]
  #v(0.25em)
  #text(size: 12pt)[Sklep internetowy z elektroniką]
  #v(1.1em)
  #text(size: 11pt)[Filip Stępień #h(1.2em) Rafał Grot #h(1.2em) Bartłomiej Karkoszka]
  #v(0.5em)
  #text(size: 11pt)[26 listopada 2026]
]
#v(1.2cm)
#outline(depth: 2, indent: auto)
#pagebreak()

= Wstęp

Sprawozdanie przedstawia stan projektu po ośmiu tygodniach prac i odnosi go do dokumentu
_Założenia projektowe_ (`docs/zalozenia`). Odwołania w rodzaju „zał. 6.4” wskazują punkty tego
dokumentu. W tabelach stanu każde wymaganie jest opisane jako _zrealizowane_, zrealizowane
_częściowo_ albo jako _brak_, gdy prac nad nim jeszcze nie rozpoczęto.

Zrzuty ekranu z rozdziału 4 wykonują automatycznie testy Playwright na uruchomionej aplikacji
(rozdz. 7.3), dlatego odpowiadają bieżącej wersji kodu.

= Architektura

== Komponenty

System składa się z aplikacji działającej w przeglądarce, backendu udostępniającego API REST oraz
trzech usług zewnętrznych (@fig-architektura[rys.]). Przeglądarka komunikuje się tylko z backendem
i z serwerem Keycloak. Do bazy danych i modelu językowego ma dostęp wyłącznie backend, który przy
każdym żądaniu sprawdza token wydany przez Keycloak.

#figure(
  diagram(
    spacing: (7mm, 11mm),
    node-stroke: 0.5pt,
    node-fill: white,
    node-inset: 7pt,
    edge-stroke: 0.5pt,
    label-size: 8.5pt,
    node((0, 0), align(center)[*Przeglądarka* \ #text(9pt)[React, Mantine]], name: <web>),
    node((2, 0), align(center)[*Backend* \ #text(9pt)[Spring Boot, Java 21]], name: <api>),
    node((4, 0), align(center)[*PostgreSQL 18* \ #text(9pt)[dane sklepu]], name: <db>),
    node((1, 1.2), align(center)[*Keycloak 26* \ #text(9pt)[realm `ecommerce`]], name: <kc>),
    node((3, 1.2), align(center)[*API Anthropic* \ #text(9pt)[Claude Haiku 5.5]], name: <llm>),
    edge(<web>, <api>, "-|>", [REST, SSE \ token JWT]),
    edge(<api>, <db>, "-|>", [JPA]),
    edge(<web>, <kc>, "-|>", [OIDC + PKCE], label-side: right),
    edge(<api>, <kc>, "-|>", [klucze JWKS], label-side: left),
    edge(<api>, <llm>, "-|>", [narzędzia, \ strumień], label-side: right),
  ),
  caption: [Komponenty systemu i połączenia między nimi],
) <fig-architektura>

== Technologie

Zastosowane technologie pokrywają się z planem z wyjątkiem wyszukiwania po znaczeniu, którego
infrastruktura (pgvector i model `bge-m3`) nie została jeszcze dodana (@tab-technologie[tab.]).

#figure(
  booktabs(
    columns: (auto, 1.5fr, auto, 1fr),
    header: ([Element], [Zastosowane], [Stan], [Uwagi]),
    [Frontend],
    [React 19, TypeScript 6, Vite 8, Mantine 9, Tailwind CSS 4, TanStack Query 5, React Router 8],
    done,
    [],

    [Backend],
    [Java 21, Spring Boot 4.1, Spring Data JPA, Spring Security, Spring AI, MapStruct, Lombok],
    done,
    [],

    [Baza danych], [PostgreSQL 18], partial, [bez rozszerzenia pgvector],
    [Logowanie], [Keycloak 26.8, OAuth 2.0 / OpenID Connect], done, [],
    [Model językowy], [Claude Haiku 5.5 przez Spring AI], done, [],
    [Wektory opisów], [–], missing, [brak Ollamy i modelu `bge-m3`],
    [Uruchamianie],
    [Docker Compose, Task],
    done,
    [w kontenerach działa baza i Keycloak, całość uruchamia `task dev`],
  ),
  caption: [Technologie zaplanowane w zał. 2 i zastosowane],
) <tab-technologie>

== Struktura kodu

Cały kod znajduje się w jednym repozytorium (@tab-repozytorium[tab.]). Polecenia budowania,
uruchamiania i testów są zdefiniowane w `Taskfile.yml`, a środowisko z kompletem narzędzi dla
Nixa w `flake.nix`.

#figure(
  booktabs(
    columns: (auto, 1fr),
    header: ([Katalog], [Zawartość]),
    [`apps/backend`], [backend Spring Boot (Maven) z testami integracyjnymi],
    [`apps/frontend`], [frontend React (Vite, pnpm) z testami Playwright w `e2e`],
    [`keycloak`], [konfiguracja realmu `ecommerce` i motyw strony logowania `volt`],
    [`openapi`], [specyfikacja API generowana z kodu backendu],
    [`docs`], [założenia projektowe i niniejsze sprawozdanie],
  ),
  caption: [Struktura repozytorium],
) <tab-repozytorium>

Backend jest podzielony na moduły odpowiadające obszarom sklepu (@tab-moduly[tab.]). Każdy moduł
ma warstwę `api` z kontrolerami i obiektami DTO, `application` z przypadkami użycia, `domain`
z encjami i regułami oraz `infrastructure` z adapterami. Moduły zależą od siebie tylko przez
interfejsy z warstwy domeny: moduł rekomendacji odczytuje na przykład statystyki sprzedaży przez
interfejs `SalesStatistics`, który implementuje moduł zamówień.

#figure(
  booktabs(
    columns: (auto, 1fr),
    header: ([Moduł], [Odpowiedzialność]),
    [`catalog`], [produkty, filtrowanie, stany magazynowe i ich rezerwacja],
    [`ordering`], [składanie zamówień, wycena, statusy, historia zamówień klienta],
    [`payment`], [wybór procesora płatności dla metody płatności, symulowany procesor `fake`],
    [`recommendation`], [łączenie strategii rekomendacji],
    [`assistant`], [rozmowa z modelem językowym i narzędzia udostępnione modelowi],
    [`user`], [dane zalogowanego użytkownika odczytywane z tokenu],
    [`config`, `shared`], [bezpieczeństwo, obsługa błędów (RFC 9457), OpenAPI, wspólne wyjątki],
  ),
  caption: [Moduły backendu],
) <tab-moduly>

= Stan realizacji założeń

@tab-podsumowanie[Tab.] podaje liczbę wymagań w każdym stanie, a kolejne tabele omawiają je
pojedynczo. Funkcje sklepu są w większości gotowe; brakuje przede wszystkim panelu administratora.
Z inteligentnych usług działa asystent AI i uproszczona wersja rekomendacji, pozostałe usługi są
zaplanowane na kolejne tygodnie (rozdz. 9).

#figure(
  booktabs(
    columns: (1fr, auto, auto, auto),
    align: (left, center, center, center).map(a => a + top),
    header: ([Obszar], [zrealizowane], [częściowo], [brak]),
    [Sklep (zał. 5)], [5], [6], [2],
    [Inteligentne usługi (zał. 6)], [0], [5], [8],
    [Bezpieczeństwo (zał. 7)], [5], [2], [0],
    [Wymagania niefunkcjonalne (zał. 8)], [4], [1], [1],
  ),
  caption: [Liczba wymagań według stanu realizacji],
) <tab-podsumowanie>

#figure(
  booktabs(
    columns: (1.15fr, auto, 1.6fr),
    header: ([Wymaganie], [Stan], [Uwagi]),
    [Rejestracja i logowanie przez Keycloak z własnym motywem],
    partial,
    [logowanie i motyw `volt` działają, rejestracja nowych kont nie jest włączona w realmie],

    [Katalog ze stronicowaniem], done, [6, 12 lub 24 produkty na stronie],
    [Filtry i sortowanie],
    partial,
    [filtry: kategoria, marka, cena, łączność, dostępność; sortowanie po cenie i nazwie, bez
      sortowania po trafności, nowości i popularności],

    [Wyszukiwarka (zał. 6.4)],
    partial,
    [wyszukuje fragment nazwy produktu, bez wyszukiwania po znaczeniu i odporności na literówki],

    [Karta produktu],
    partial,
    [zdjęcia, cena, opis, specyfikacja i produkty z tej samej kategorii; brak informacji
      o dostępności],

    [Koszyk], done, [dodawanie, zmiana ilości, usuwanie, suma; zawartość zapisywana w przeglądarce],
    [Zamówienie: dane, adres, dostawa, płatność, faktura],
    done,
    [kurier lub odbiór osobisty, BLIK lub karta, osobne dane do faktury],

    [Cena z serwera, rezerwacja i zwolnienie towaru],
    partial,
    [wycena i rezerwacja przy zamówieniu, zwolnienie po nieudanej płatności; anulowanie nie istnieje],

    [Historia i szczegóły zamówień], done, [],
    [Strona konta],
    done,
    [dane klienta, ostatnie zamówienia, liczba zamówień i suma zakupów, ostatni adres, polecane
      produkty],

    [Panel: produkty i stany magazynowe], missing, [brak roli administratora],
    [Panel: zamówienia i statusy], missing, [],
    [Statusy zamówienia],
    partial,
    [Oczekuje na płatność, Opłacone, Płatność nieudana; brak statusów Wysłane i Anulowane],
  ),
  caption: [Stan wymagań sklepu (zał. 5)],
)

#figure(
  booktabs(
    columns: (1.15fr, auto, 1.6fr),
    header: ([Wymaganie], [Stan], [Uwagi]),
    [Rejestrowanie aktywności (6.1)], missing, [],
    [Symulator klientów (6.2)], missing, [],
    [„Polecane dla Ciebie” (6.3)],
    partial,
    [reguła kategoria/marka na podstawie zakupów, uzupełniana bestsellerami i nowościami; brak
      filtrowania kolaboratywnego],

    [„Na podstawie oglądanych” (6.3)], missing, [wymaga rejestrowania aktywności],
    [„Bestsellery” (6.3)],
    partial,
    [liczone ze wszystkich opłaconych zamówień zamiast z ostatniego miesiąca, pokazywane w sekcji
      polecanych],

    [„Często kupowane razem” (6.3)], missing, [],
    [„Podobne produkty” (6.3)], partial, [produkty z tej samej kategorii, bez porównania opisu i ceny],
    [Pomijanie niedostępnych i kupionych (6.3)],
    partial,
    [działa w polecanych; wśród produktów powiązanych pojawiają się niedostępne],

    [Wyszukiwanie po opisie potrzeb (6.4)], missing, [],
    [Dopasowanie akcesoriów (6.5)], missing, [produkty nie mają jeszcze atrybutów technicznych],
    [Zestawy w budżecie (6.6)], missing, [produkty nie mają jeszcze oceny jakości],
    [Asystent AI (6.7)],
    partial,
    [rozmowa, odpowiedź na bieżąco, karty produktów, wyszukiwanie, szczegóły, ostatnie zakupy; bez
      sprawdzania dopasowania i zestawów],

    [Ocena jakości (6.8)], missing, [],
  ),
  caption: [Stan inteligentnych usług (zał. 6)],
)

#figure(
  booktabs(
    columns: (1.15fr, auto, 1.6fr),
    header: ([Wymaganie], [Stan], [Uwagi]),
    group[Bezpieczeństwo (zał. 7)],
    [Logowanie wyłącznie przez Keycloak], done, [aplikacja nie przechowuje haseł],
    [Sprawdzanie tożsamości i roli przy każdym żądaniu],
    partial,
    [dla gościa i klienta; roli administratora jeszcze nie ma],

    [Izolacja danych klientów], done, [zamówienie jest wyszukiwane po numerze i identyfikatorze klienta],
    [Walidacja danych i ochrona przed SQL injection],
    done,
    [Bean Validation dla każdego DTO, zapytania JPA z parametrami],

    [Ceny liczone na serwerze], done, [przeglądarka przesyła tylko identyfikatory i ilości],
    [Asystent tylko do odczytu],
    done,
    [narzędzia nie zmieniają danych i nie zwracają danych osobowych, klucz API tylko na serwerze],

    [Testy dostępu dla każdej roli], partial, [gość i klient (rozdz. 7); administrator po dodaniu roli],
    group[Wymagania niefunkcjonalne (zał. 8)],
    [Odpowiedź serwera poniżej 0,5 s], missing, [nie wykonano pomiarów],
    [Pierwsze słowa asystenta w ciągu kilku sekund],
    partial,
    [odpowiedź przesyłana strumieniowo (SSE); nie wykonano pomiarów],

    [Interfejs responsywny, w języku polskim], done, [],
    [Uruchamianie jedną komendą], done, [`task dev` w systemach Windows, Linux i macOS],
    [Opis API z kodu i klient API z opisu], done, [springdoc-openapi i Orval],
    [Testy integracyjne na PostgreSQL], done, [Testcontainers],
  ),
  caption: [Stan wymagań bezpieczeństwa (zał. 7) i niefunkcjonalnych (zał. 8)],
)

= Zrealizowane funkcje

== Katalog produktów

Dane startowe obejmują 100 produktów z 16 kategorii i 35 marek, w tym 8 niedostępnych. Każdy
produkt ma nazwę, podtytuł, opis, markę, kategorię, cenę brutto, stan magazynowy, trzy zdjęcia,
specyfikację i listę sposobów łączności. Hibernate wczytuje je przy starcie z pliku `import.sql`.
Zdjęcia są na razie zastępcze.

Strona główna pokazuje katalog z panelem filtrów (@fig-katalog[rys.]). Zapytanie do
`GET /api/products` jest wysyłane 300 ms po ostatniej zmianie filtra, a w czasie ładowania karty
produktów zastępują szkielety, dzięki czemu układ strony nie przeskakuje. Filtry, wyszukiwanie
i sortowanie można łączyć (@fig-filtry[rys.]).

#figure(shot("catalog"), caption: [Katalog produktów w widoku gościa]) <fig-katalog>

#figure(
  shot("catalog-filters"),
  caption: [Słuchawki do 1000 zł, tylko dostępne, od najtańszych],
) <fig-filtry>

== Karta produktu

Karta produktu (@fig-produkt[rys.]) zawiera galerię zdjęć, cenę z VAT, pole ilości z przyciskiem
„Dodaj do koszyka”, opis, specyfikację oraz karuzelę „Powiązane produkty” z tej samej kategorii.

#figure(shot("product", max-height: 21cm), caption: [Karta produktu]) <fig-produkt>

== Koszyk

Z koszyka może korzystać zarówno gość, jak i zalogowany klient. Zawartość jest zapisywana
w `localStorage`, więc nie znika po odświeżeniu strony. Dodanie produktu potwierdza
powiadomienie, a sam koszyk otwiera się jako panel boczny ze zmianą ilości, usuwaniem pozycji
i sumą z VAT (@fig-koszyk[rys.]).

#figure(shot("cart"), caption: [Koszyk z trzema produktami]) <fig-koszyk>

== Logowanie

Logowanie obsługuje Keycloak w realmie `ecommerce`. Frontend korzysta z biblioteki
`oidc-client-ts` (przepływ Authorization Code z PKCE) i dołącza token do każdego żądania do API.
Strona logowania ma własny motyw `volt`, utrzymany w stylu sklepu (@fig-logowanie[rys.]). Realm
definiuje rolę `user` oraz użytkownika testowego `user` z hasłem `password`.

#figure(shot("sign-in"), caption: [Strona logowania Keycloak z motywem `volt`]) <fig-logowanie>

== Zamówienie i płatność

Złożenie zamówienia wymaga zalogowania. Formularz (@fig-zamowienie[rys.]) zbiera dane kontaktowe,
adres dostawy, opcjonalnie osobne dane do faktury z numerem NIP, sposób dostawy (kurier za
14,99 zł albo odbiór osobisty) i metodę płatności (BLIK albo karta). Poprawność pól sprawdza
w przeglądarce schemat Zod, a na serwerze Bean Validation.

Przeglądarka przesyła tylko identyfikatory produktów i ilości. Backend w jednej transakcji:

+ rezerwuje towar i odrzuca zamówienie, jeśli brakuje go w magazynie,
+ wylicza cenę na podstawie aktualnych cen katalogowych, kosztu dostawy i stawki VAT 23%,
+ zapisuje zamówienie ze statusem „Oczekuje na płatność”,
+ przekazuje płatność procesorowi przypisanemu do wybranej metody płatności.

Procesor `fake` od razu kończy płatność sukcesem, a po ustawieniu
`shop.payments.fake.decline=true` odmową. Po odmowie zamówienie otrzymuje status „Płatność
nieudana”, a zdarzenie `OrderPaymentFailedEvent` zwalnia zarezerwowany towar
(@tab-statusy[tab.]). Interfejs procesora przewiduje też płatność wymagającą dodatkowego kroku
klienta, więc prawdziwego operatora płatności można dodać bez zmian w logice zamówienia. Po
złożeniu zamówienia klient trafia na stronę z jego szczegółami (@fig-szczegoly[rys.]).

#figure(
  booktabs(
    columns: (auto, auto, 1fr),
    header: ([Status], [Następny status], [Kto zmienia]),
    [Oczekuje na płatność], [Opłacone, Płatność nieudana], [procesor płatności],
    [Opłacone], [–], [–],
    [Płatność nieudana], [–], [–],
  ),
  caption: [Zaimplementowane statusy zamówienia],
) <tab-statusy>

#figure(shot("checkout", max-height: 21cm), caption: [Formularz zamówienia]) <fig-zamowienie>

#figure(shot("order-details", max-height: 21cm), caption: [Szczegóły złożonego zamówienia]) <fig-szczegoly>

== Historia zamówień i konto klienta

Lista zamówień (@fig-historia[rys.]) pokazuje zamówienia klienta od najnowszego wraz ze statusem
i kwotą. Strona konta (@fig-konto[rys.]) zawiera dane z tokenu, liczbę zamówień, sumę zakupów,
ostatni adres dostawy, ostatnie zamówienia i polecane produkty.

#figure(shot("order-history", max-height: 18cm), caption: [Historia zamówień]) <fig-historia>

#figure(shot("account", max-height: 21cm), caption: [Strona konta klienta]) <fig-konto>

== Rekomendacje

Rekomendacje udostępnia endpoint `GET /api/products/recommended`, dostępny dla gościa i klienta.
Komponent `ProductRecommender` odpytuje po kolei strategie z @tab-strategie[tab.] i uzupełnia
listę produktami, których jeszcze na niej nie ma. Pomija przy tym produkty kupione przez klienta,
a każda strategia zwraca wyłącznie produkty dostępne.

#figure(
  booktabs(
    columns: (auto, auto, 1fr),
    header: ([Kolejność], [Strategia], [Zasada]),
    [1],
    [`PurchaseHistoryStrategy`],
    [produkty z kategorii i marek kupowanych przez klienta; zgodność kategorii ma wagę 2, marki 1,
      przy remisie decyduje sprzedaż],

    [2], [`BestsellerStrategy`], [najwięcej sprzedanych sztuk w opłaconych zamówieniach],
    [3], [`NewestProductsStrategy`], [najnowsze produkty, dzięki czemu lista nie jest pusta bez sprzedaży],
  ),
  caption: [Strategie rekomendacji],
) <tab-strategie>

Pierwsza strategia to reguła kategoria/marka, która według zał. 6.3 ma być punktem odniesienia
przy ocenie filtrowania kolaboratywnego. Gość nie ma historii zakupów, więc otrzymuje bestsellery.
@fig-rekomendacje[Rys.] pokazuje sekcję „Proponowane dla Ciebie” po zakupie klawiatury i myszy
Logitech.

#figure(
  shot("recommendations"),
  caption: [Sekcja „Proponowane dla Ciebie” zalogowanego klienta],
) <fig-rekomendacje>

== Asystent AI

Przycisk czatu znajduje się w prawym dolnym rogu każdej strony. Na komputerze czat otwiera się
w oknie (@fig-asystent[rys.]), a na telefonie na pełnym ekranie (@fig-mobile[rys.]). Pusty czat
podpowiada przykładowe pytania. Odpowiedź pojawia się w trakcie generowania i można ją przerwać,
a produkty zaproponowane przez asystenta są wyświetlane pod odpowiedzią jako karty z ceną
i przyciskiem „Dodaj do koszyka”.

#figure(shot("assistant"), caption: [Rozmowa z asystentem na komputerze]) <fig-asystent>

Backend wywołuje model Claude Haiku 5.5 przez Spring AI. Model nie zna oferty sklepu i korzysta
z narzędzi wymienionych w @tab-narzedzia[tab.]. Wszystkie narzędzia jedynie odczytują dane, a ceny
i stany magazynowe pochodzą z bazy, więc model nie może podać ceny ani produktu spoza sklepu.
Identyfikator zalogowanego klienta trafia do narzędzi z tokenu, a nie od modelu.

#figure(
  booktabs(
    columns: (auto, 1fr, auto),
    header: ([Narzędzie], [Działanie], [Funkcja z zał. 6.7]),
    [`list_catalog`], [nazwy kategorii, marek i rodzajów łączności], [–],
    [`search_products`],
    [do 10 dostępnych produktów według fragmentu nazwy, kategorii, marki i ceny],
    [wyszukanie produktów],

    [`get_product_details`], [opis, specyfikacja, cena i stan do 5 produktów], [szczegóły produktu],
    [`get_recent_purchases`],
    [nazwy, ilości i daty ostatnich zakupów, bez danych osobowych],
    [ostatnie zakupy klienta],

    [`show_products`], [wyświetlenie do 6 produktów jako kart], [karty produktów],
    [–], [–], [sprawdzenie dopasowania (brak)],
    [–], [–], [zestaw w budżecie (brak)],
  ),
  caption: [Narzędzia dostępne dla asystenta],
) <tab-narzedzia>

Instrukcja systemowa (`assistant/system-prompt.md`) przenosi na polecenia dla modelu zasady
z zał. 6.7: krótkie odpowiedzi po polsku, od dwóch do czterech propozycji z uzasadnieniem,
najwyżej jedno pytanie o budżet lub zastosowanie, nazwy i ceny wyłącznie z narzędzi, sprawdzenie
ostatnich zakupów przed propozycją, odmowa rozmowy na tematy niezwiązane z zakupami, brak rabatów
i nieujawnianie instrukcji.

Endpoint `POST /api/assistant/chat` przyjmuje całą rozmowę i zwraca strumień zdarzeń SSE: `text`
z fragmentem odpowiedzi, `products` z kartami produktów oraz `done` albo `error` na końcu.
Rozmowa może liczyć najwyżej 20 wiadomości, a wiadomość klienta 1000 znaków. Frontend odsyła
identyfikatory pokazanych kart, a backend dołącza je do wcześniejszych odpowiedzi asystenta, więc
model wie, o których produktach była mowa. Jeśli klucz API nie jest ustawiony albo model zwróci
błąd, czat informuje o niedostępności asystenta, a reszta sklepu działa bez zmian.

== Interfejs na telefonie

Wszystkie widoki dostosowują się do szerokości ekranu. Na telefonie filtry znajdują się nad listą
produktów, karty produktów układają się w jednej kolumnie, a czat zajmuje cały ekran
(@fig-mobile[rys.]).

#figure(
  grid(
    columns: (1fr, 1fr, 1fr),
    column-gutter: 6mm,
    shot("mobile-catalog"), shot("mobile-product"), shot("mobile-assistant"),
  ),
  caption: [Katalog, karta produktu i czat z asystentem na telefonie],
) <fig-mobile>

= Kontrakt API

Specyfikację OpenAPI generuje springdoc na podstawie kontrolerów i obiektów DTO
(`task backend:openapi`) i zapisuje ją w pliku `openapi/openapi.json`. Z niej Orval generuje we
frontendzie hooki TanStack Query i schematy Zod (`task api:generate`), dlatego zmiana w API od
razu powoduje błąd kompilacji tam, gdzie frontend jej nie uwzględnia. Endpointy zestawia
@tab-endpointy[tab.]; dokumentację można też przeglądać w Swagger UI z logowaniem przez Keycloak
(@fig-swagger[rys.]).

#figure(
  booktabs(
    columns: (auto, auto, 1fr, auto),
    header: ([Metoda], [Ścieżka], [Opis], [Dostęp]),
    [GET], [`/api/products`], [lista produktów z filtrami, sortowaniem i stronicowaniem], [wszyscy],
    [GET], [`/api/products/{id}`], [szczegóły produktu], [wszyscy],
    [GET], [`/api/products/{id}/related`], [produkty z tej samej kategorii], [wszyscy],
    [GET], [`/api/products/recommended`], [rekomendacje dla wywołującego], [wszyscy],
    [GET], [`/api/products/categories`], [kategorie], [wszyscy],
    [GET], [`/api/products/filter-options`], [marki i rodzaje łączności], [wszyscy],
    [GET], [`/api/checkout/options`], [metody dostawy i płatności, stawka VAT], [wszyscy],
    [POST], [`/api/assistant/chat`], [strumień odpowiedzi asystenta (SSE)], [wszyscy],
    [POST], [`/api/orders`], [złożenie zamówienia i rozpoczęcie płatności], [klient],
    [GET], [`/api/orders`], [zamówienia klienta od najnowszego], [klient],
    [GET], [`/api/orders/{id}`], [szczegóły zamówienia klienta], [klient],
    [GET], [`/api/me`], [dane zalogowanego użytkownika], [zalogowany],
  ),
  caption: [Endpointy API],
) <tab-endpointy>

#figure(shot("swagger"), caption: [Dokumentacja API w Swagger UI]) <fig-swagger>

= Bezpieczeństwo

Backend działa jako serwer zasobów OAuth 2.0. Sprawdza podpis tokenu JWT, jego wystawcę
i odbiorcę (`ecommerce-api`), a role z pola `realm_access` zamienia na uprawnienia Spring
Security. Sesja jest bezstanowa, więc ochrona przed CSRF nie jest potrzebna.

Endpointy zamówień wymagają roli `user`. Identyfikator klienta pochodzi wyłącznie z tokenu
(adnotacja `@CurrentUserId`), a zamówienie jest wyszukiwane po numerze i identyfikatorze klienta,
dlatego próba odczytu cudzego zamówienia kończy się odpowiedzią 404. Błędy są zwracane w formacie
Problem Details (RFC 9457) i nie ujawniają szczegółów wewnętrznych, również w strumieniu
asystenta. Klucz API Anthropic jest zmienną środowiskową backendu (`ANTHROPIC_API_KEY`) i nigdy
nie trafia do przeglądarki.

= Testy <testy>

== Testy backendu

Backend ma 65 testów w 16 klasach (@tab-testy[tab.]). Testy API uruchamiają całą aplikację na
bazie PostgreSQL w kontenerze (Testcontainers) i wysyłają żądania z tokenami JWT o wybranych
rolach, a model językowy jest w nich zastąpiony atrapą. Wszystkie testy przechodzą
(`task backend:test`).

#figure(
  booktabs(
    columns: (auto, auto, 1fr),
    align: (left, center, left).map(a => a + top),
    header: ([Klasa], [Testy], [Zakres]),
    [`ApiSecurityTests`], [7], [dostęp do API bez tokenu, z tokenem bez roli i jako klient],
    [`OrderApiTests`],
    [10],
    [wycena z katalogu, brak towaru, faktura, walidacja, historia, brak dostępu do cudzego zamówienia],

    [`DeclinedPaymentApiTests`], [1], [nieudana płatność zostawia zamówienie i zwalnia towar],
    [`OrderStatusTests`], [2], [dozwolone przejścia między statusami],
    [`PaymentProcessorRegistryTests`], [3], [wybór procesora płatności dla metody],
    [`ProductApiTests`], [9], [stronicowanie, filtry, sortowanie, wyszukiwanie, szczegóły, błędy],
    [`RecommendationApiTests`], [4], [rekomendacje dla gościa i klienta, walidacja limitu],
    [`ProductRecommenderTests`], [4], [łączenie strategii, limit, pomijanie kupionych produktów],
    [`AssistantApiTests`], [5], [strumień SSE, klient z tokenu, historia rozmowy, błędy, walidacja],
    [`AssistantChatServiceTests`], [3], [przekazanie rozmowy do modelu, pusta odpowiedź],
    [`ConversationPromptMapperTests`], [4], [przekształcenie rozmowy w wiadomości dla modelu],
    [`CatalogToolsTests`], [6], [wyszukiwanie i szczegóły produktów w narzędziach asystenta],
    [`ProductCardToolsTests`], [3], [kolejność i limit kart produktów],
    [`PurchaseToolsTests`], [2], [ostatnie zakupy tylko zalogowanego klienta],
    [`CurrentUserIdTests`], [1], [identyfikator klienta nie jest parametrem w opisie API],
    [`BackendApplicationTests`], [1], [uruchomienie kontekstu aplikacji],
  ),
  caption: [Testy backendu],
) <tab-testy>

== Testy funkcjonalne

Testy w katalogu `apps/frontend/e2e/functional` sprawdzają wymagania z założeń z perspektywy
użytkownika (@tab-funkcjonalne[tab.]). Działają w przeglądarce Chromium na prawdziwym backendzie
i serwerze Keycloak: logują się użytkownikiem testowym, składają zamówienia i porównują zawartość
strony z danymi zwracanymi przez API. Polecenie `task frontend:e2e` samo uruchamia brakujące
elementy środowiska.

Wymaganie, które nie zostało jeszcze zrealizowane, ma test oznaczony `test.fixme`. Taki test
opisuje oczekiwane zachowanie, ale jest pomijany; po dodaniu funkcji wystarczy usunąć oznaczenie.
Znana niezgodność z założeniami ma test oznaczony `test.fail`, który jest wykonywany i powinien
zakończyć się niepowodzeniem, a po usunięciu błędu Playwright zgłosi zmianę. Test korzystający
z modelu językowego ma etykietę `@llm` i jest pomijany, gdy backend nie ma klucza API.

#figure(
  booktabs(
    columns: (auto, auto, 1fr, auto, auto),
    align: (left, left, left, center, center).map(a => a + top),
    header: ([Plik], [Zał.], [Zakres], [Aktywne], [`fixme`]),
    [`catalog`],
    [5, 6.4],
    [stronicowanie, filtry kategorii, marki, łączności, ceny i dostępności, sortowanie po cenie,
      wyszukiwanie po nazwie razem z filtrami],
    [9],
    [4],

    [`product`],
    [5, 6.3, 6.5],
    [zdjęcia, cena, opis i specyfikacja zgodne z API, produkty z tej samej kategorii, nieistniejący
      produkt; `fail`: niedostępne produkty wśród powiązanych],
    [3 + 1],
    [3],

    [`cart`], [5, 6.5], [dodawanie i suma, zmiana ilości, usuwanie, zachowanie po odświeżeniu], [3], [1],
    [`checkout`],
    [5, 7],
    [wymóg logowania, walidacja, kurier z BLIK, odbiór osobisty z kartą i fakturą, cena z serwera
      mimo zmienionej ceny w przeglądarce, rezerwacja towaru, zamówienie ponad stan],
    [7],
    [0],

    [`account`],
    [3, 5],
    [logowanie z motywem i wylogowanie, błędne hasło, przekierowanie gościa, historia i szczegóły
      zamówienia, strona konta, cudze zamówienie],
    [6],
    [1],

    [`admin`], [5], [–], [0], [5],
    [`recommendations`],
    [6.3],
    [bestsellery dla gościa, tylko dostępne produkty, propozycje podobne do kupionych bez kupionych],
    [3],
    [1],

    [`assistant`],
    [6.5–6.7],
    [przycisk na każdej stronie, limit długości wiadomości, pełny ekran na telefonie, karty
      z cenami ze sklepu i dodawanie do koszyka (`@llm`)],
    [4],
    [2],

    [`security`],
    [7],
    [katalog dostępny dla gościa, odpowiedź 401 bez tokenu i z fałszywym tokenem, dostęp klienta
      do jego danych],
    [4],
    [2],

    [`responsive`], [8], [język strony, brak poziomego przewijania na telefonie i tablecie], [5], [0],
    table.hline(stroke: 0.4pt),
    table.cell(colspan: 3)[Razem], [45], [19],
  ),
  caption: [Testy funkcjonalne według wymagań],
) <tab-funkcjonalne>

Testy oznaczone `fixme` dotyczą funkcji wymienionych w rozdz. 3 jako brakujące: sortowania po
trafności, nowości i popularności, wyszukiwania z literówkami i po znaczeniu, kwot w zapytaniu,
dostępności na karcie produktu, sekcji „Często kupowane razem”, „Pasujące akcesoria” i „Na
podstawie oglądanych”, ostrzeżenia o niepasującym akcesorium, rejestracji, panelu administratora,
dopasowania akcesoriów i zestawów w czacie oraz uprawnień administratora.

Części wymagań nie da się sprawdzić przez przeglądarkę. Zwolnienie towaru po nieudanej płatności
wymaga przełączenia procesora płatności, więc sprawdza je test backendu `DeclinedPaymentApiTests`.
Zasady zachowania asystenta, takie jak odpowiedź po polsku, dopytywanie o budżet czy odmowa
tematów niezwiązanych ze sklepem, wymagają oceny wielu rozmów i należą do oceny jakości
(rozdz. 8), podobnie jak symulator klientów i filtrowanie kolaboratywne.

== Zrzuty ekranu

Testy w katalogu `apps/frontend/e2e/screenshots` przechodzą przez główne scenariusze sklepu
i zapisują zrzuty ekranu w `docs/spr/img` (@tab-zrzuty[tab.]). Przed każdym zrzutem test czeka na
załadowanie danych i zdjęć oraz na zniknięcie powiadomień, a każdy krok sprawdza, czy strona
zawiera oczekiwane elementy. Dzięki temu do sprawozdania nie trafia zrzut niepełnej strony.

#figure(
  booktabs(
    columns: (auto, 1fr, auto),
    header: ([Test], [Scenariusz], [Rysunki]),
    [`catalog`], [katalog w widoku gościa], [@fig-katalog],
    [`catalog filters and sorting`], [kategoria, cena, dostępność, sortowanie], [@fig-filtry],
    [`product details`], [karta produktu], [@fig-produkt],
    [`cart`], [dodanie trzech produktów i otwarcie koszyka], [@fig-koszyk],
    [`sign in page`], [strona logowania Keycloak], [@fig-logowanie],
    [`checkout, orders and account`],
    [logowanie, zamówienie, historia, konto, rekomendacje],
    [@fig-zamowienie–@fig-rekomendacje],

    [`assistant`], [pytanie do asystenta i odpowiedź z kartami produktów], [@fig-asystent],
    [`swagger ui`], [dokumentacja API], [@fig-swagger],
    [`mobile …`], [katalog, karta produktu i czat na ekranie telefonu], [@fig-mobile],
  ),
  caption: [Testy wykonujące zrzuty ekranu],
) <tab-zrzuty>

= Ocena jakości <ocena>

Ocena inteligentnych usług (zał. 6.8) nie została jeszcze przeprowadzona. Wyznaczenie miar
precision\@10, recall\@10 i NDCG\@10 dla rekomendacji wymaga danych o aktywności z symulatora
klientów (zał. 6.1 i 6.2), a dla wyszukiwania – wyszukiwania po znaczeniu (zał. 6.4). Punkt
odniesienia dla rekomendacji, czyli reguła kategoria/marka, jest już zaimplementowany jako
`PurchaseHistoryStrategy`. Wyniki zostaną przedstawione w końcowej wersji sprawozdania.

= Dalsze prace

Pozostałe prace wynikają bezpośrednio z tabel w rozdziale 3.

*Sklep.* Rola administratora i panel do zarządzania produktami, stanami magazynowymi
i zamówieniami, a wraz z nim statusy „Wysłane” i „Anulowane” oraz zwalnianie towaru po
anulowaniu. Ponadto rejestracja kont, informacja o dostępności na karcie produktu, sortowanie po
trafności, nowości i popularności oraz pomijanie niedostępnych produktów wśród powiązanych.

*Inteligentne usługi.* Atrybuty techniczne i ocena jakości produktów, rejestrowanie aktywności
i symulator klientów, filtrowanie kolaboratywne z sekcjami „Na podstawie oglądanych” i „Często
kupowane razem”, bestsellery z ostatniego miesiąca, wyszukiwanie po słowach i po znaczeniu
(pgvector, `bge-m3`, łączenie wyników metodą RRF, kwoty w zapytaniu), dopasowanie akcesoriów,
zestawy w budżecie oraz udostępnienie obu tych funkcji asystentowi.

*Ocena.* Pomiar miar z zał. 6.8 dla rekomendacji i wyszukiwania, ocena asystenta i zestawów na
zestawie rozmów testowych oraz pomiar czasów odpowiedzi serwera i asystenta.

= Uruchomienie

Do uruchomienia potrzebne są JDK 21, Node.js 22+ z pnpm, Docker, Task i Typst. Wszystkie te
narzędzia, razem z przeglądarką dla Playwright, dostarcza też środowisko `nix develop`.
Najważniejsze polecenia zestawia @tab-polecenia[tab.].

#figure(
  booktabs(
    columns: (auto, 1fr),
    header: ([Polecenie], [Działanie]),
    [`task dev`], [uruchamia PostgreSQL, Keycloak, backend (port 8080) i frontend (port 5173)],
    [`task backend:test`], [testy backendu],
    [`task frontend:e2e`], [testy funkcjonalne; brakujące elementy środowiska uruchamia samo],
    [`task api:generate`], [specyfikacja OpenAPI i klient API we frontendzie],
    [`task docs:report`],
    [sprawozdanie w PDF; gdy kod się zmienił, najpierw wykonuje zrzuty ekranu, uruchamiając
      w razie potrzeby całe środowisko],
  ),
  caption: [Najważniejsze polecenia],
) <tab-polecenia>

Zrzuty i test asystenta wymagają klucza `ANTHROPIC_API_KEY` w pliku `apps/backend/.env`. Bez
niego są pomijane, a w sprawozdaniu w miejscu zrzutów czatu pojawia się informacja o ich braku.
Ponowne wykonanie wszystkich zrzutów wymusza polecenie `task docs:screenshots --force`.

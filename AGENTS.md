# AGENTS.md

Sklep internetowy z elektroniką: frontend React, backend Spring Boot, logowanie przez Keycloak,
asystent AI na Claude. Monorepo zarządzane przez [Task](https://taskfile.dev).

Źródłem prawdy dla funkcji są założenia: `docs/zalozenia/zalozenia.md`. Stan realizacji opisuje
sprawozdanie `docs/spr/sprawozdanie.typ`.

## Struktura

| Ścieżka                                 | Zawartość                                                        |
| --------------------------------------- | ---------------------------------------------------------------- |
| `apps/backend`                          | Java 21, Spring Boot 4.1, Maven (`./mvnw`)                       |
| `apps/frontend`                         | React 19, TypeScript, Vite, Mantine 9, Tailwind 4, pnpm          |
| `apps/frontend/e2e`                     | testy Playwright: `functional` i `screenshots`                   |
| `keycloak`                              | realm `ecommerce` (import przy starcie) i motyw logowania `volt` |
| `openapi/openapi.json`                  | specyfikacja API generowana z backendu                           |
| `docs/zalozenia`                        | założenia: `.md`, `.tex` i `.pdf` (zmieniać razem)               |
| `docs/spr`                              | sprawozdanie w Typst, zrzuty ekranu w `img`                      |
| `docker-compose.yml`                    | PostgreSQL 18 i Keycloak 26                                      |
| `flake.nix`                             | środowisko Nix z całym zestawem narzędzi                         |

## Polecenia

| Polecenie                                     | Działanie                                                    |
| --------------------------------------------- | ------------------------------------------------------------ |
| `task dev`                                    | infrastruktura + backend `:8080` + frontend `:5173`          |
| `task infra:up` / `infra:down` / `infra:reset` | kontenery; `reset` usuwa dane bazy                           |
| `task backend:test`                           | testy backendu (Testcontainers, wymaga Dockera)              |
| `task frontend:build`                         | `tsc -b` i build Vite, sprawdza też typy testów e2e          |
| `task frontend:lint` / `frontend:format`      | oxlint / Prettier                                            |
| `task api:generate`                           | specyfikacja OpenAPI i klient API we frontendzie             |
| `task frontend:e2e`                           | testy funkcjonalne Playwright, sam uruchamia brakujące usługi |
| `task docs:screenshots`                       | zrzuty do `docs/spr/img`, tylko po zmianie kodu (`--force`)  |
| `task docs:report`                            | zrzuty, jeśli trzeba, i kompilacja sprawozdania do PDF       |

Użytkownik testowy: `user` / `password`. Keycloak admin: `admin` / `admin` na `:8081`.

## Backend

- Pakiet `xyz.cursedman.psk.ecommerce`, moduły według obszarów (`catalog`, `ordering`,
  `payment`, `recommendation`, `assistant`, `user`), w każdym warstwy `api`, `application`,
  `domain`, `infrastructure`. Moduły rozmawiają przez interfejsy z `domain`.
- DTO to rekordy `*Dto` z `@Schema(name = ...)` bez sufiksu, mapowanie przez MapStruct,
  wstrzykiwanie przez `@RequiredArgsConstructor`.
- Błędy domenowe dziedziczą po wyjątkach z `shared.domain.exception`, a `ApiExceptionHandler`
  zamienia je na Problem Details.
- Identyfikator klienta zawsze z tokenu przez `@CurrentUserId`, nigdy z parametru żądania.
- Schemat bazy tworzy Hibernate (`ddl-auto: create`), dane startowe są w
  `src/main/resources/import.sql`. Każdy restart backendu czyści bazę.
- Wcięcia tabami (`.editorconfig`).
- Po zmianie kontrolera lub DTO uruchom `task api:generate` i dołącz zmiany w
  `openapi/openapi.json`, `apps/frontend/src/api/generated` i `apps/frontend/src/api/zod`.
- Asystent: instrukcja w `src/main/resources/assistant/system-prompt.md`, narzędzia w
  `assistant/infrastructure/tool`. Narzędzia mogą tylko odczytywać dane i nie zwracają danych
  osobowych. Klucz `ANTHROPIC_API_KEY` trzymaj w `apps/backend/.env` (poza repozytorium).

## Frontend

- Kod funkcji w `src/features/<obszar>/{components,hooks,lib,providers,contexts}`, strony
  w `src/pages`, wspólne komponenty w `src/components`. Alias `@/` wskazuje na `src`.
- `src/api/generated` i `src/api/zod` generuje Orval. Nie edytuj ich ręcznie.
- `VITE_DEBUG=true` (domyślnie w `.env.development`) włącza hooki `debug_*` z danymi statycznymi
  i udawane logowanie. Do pracy z backendem i Keycloakiem ustaw `VITE_DEBUG=false`
  w `.env.development.local`.
- Teksty w interfejsie po polsku. Stylowanie: komponenty Mantine plus klasy Tailwind w `className`.
- Prettier: 4 spacje, pojedyncze cudzysłowy, bez przecinków na końcu, szerokość 100.

## Testy e2e (Playwright)

- `e2e/functional` sprawdza wymagania z założeń. Wymaganie, którego jeszcze nie ma, jest
  oznaczone `test.fixme`. Po zaimplementowaniu funkcji usuń `fixme` i dopasuj test. Znana
  niezgodność z założeniami jest oznaczona `test.fail`.
- Testy z tagiem `@llm` i zrzuty czatu wywołują prawdziwe API Anthropic. Bez
  `ANTHROPIC_API_KEY` w `apps/backend/.env` są pomijane.
- Testy działają na prawdziwym stacku i tworzą zamówienia użytkownika `user`. Brakujące
  kontenery uruchamia Task, a backend i frontend Playwright (`webServer`), po czym je zatrzymuje.
- **Nie zwiększaj `workers` powyżej 1.** Kilka równoległych przeglądarek obok backendu i Keycloaka
  wyczerpuje pamięć.
- Pod Nixem przeglądarki pochodzą z nixpkgs (`PLAYWRIGHT_BROWSERS_PATH` z `flake.nix`), dlatego
  `@playwright/test` jest przypięty do wersji `playwright-driver` z nixpkgs. Aktualizuj je razem.
  Bez Nixa: `pnpm exec playwright install chromium`.

## Konwencje

- Commity w stylu Conventional Commits, po angielsku, z zakresem obszaru: `backend`, `frontend`,
  `keycloak`, `api`, `docs`, np. `feat(backend): list customer orders`. Bez stopek o AI.
- Komentarze tylko dla nieoczywistego „dlaczego”. Bez komentarzy opisujących, co robi kod.
  Opisy w adnotacjach OpenAPI są dokumentacją API i są w porządku.

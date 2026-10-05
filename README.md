# Ecommerce

## Wymagania

- JDK 21
- Node.js 22+ i pnpm 10
- Docker/Docker Compose
- [Task](https://taskfile.dev/installation/)

## Start

```sh
task dev
```

Uruchamia infrastrukturę, backend i frontend.

| Co               | Adres                                                          |
| ---------------- | -------------------------------------------------------------- |
| Frontend         | http://localhost:5173                                          |
| Backend          | http://localhost:8080                                          |
| Swagger UI       | http://localhost:8080/swagger-ui                               |
| Keycloak (admin) | http://localhost:8081 - `admin` / `admin`                      |
| PostgreSQL       | `localhost:5432`, baza `ecommerce` - `ecommerce` / `ecommerce` |

Użytkownik testowy w realmie `ecommerce`: **`user` / `password`** (rola `user`).

## Kontrakt API

Frontendowe hooki pobierające dane z backendu powstają ze specyfikacji OpenAPI:

```sh
task api:generate
```

Po każdej zmianie w kontrolerach lub DTO należy uruchomić to zadanie.

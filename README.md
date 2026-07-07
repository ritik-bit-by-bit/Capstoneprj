# JustEat Food Ordering - Capstone Backend

Spring Boot backend implementing core Module 6 capstone user stories for authentication, customer ordering, restaurant owner management, and secure APIs.

## Tech Stack
- Java 17
- Spring Boot 3.3
- Spring Security + JWT
- Spring Data JPA
- H2 (default local) / PostgreSQL (runtime)
- Swagger UI (`/api-docs`)

## Implemented Features
- Role-based login with JWT token and redirect hint
- Password reset via token workflow with password complexity checks
- Role-based API authorization (`CUSTOMER` and `OWNER`)
- Customer features:
  - restaurant search by name/cuisine/location
  - view menus
  - place orders and view history/status
  - save preferences and view recommendations
- Owner features:
  - create/update restaurants
  - CRUD menu items
  - mark specials (`TODAYS_SPECIAL`, `DEAL_OF_THE_DAY`)
  - auto-flag `MOSTLY_ORDERED` items from order frequency
  - view/update order status (`PENDING -> PREPARING -> READY -> COMPLETED`)
- Swagger docs available at `/api-docs`

## Test Coverage
Includes 10+ unit tests under `src/test/java`.

## Run Locally
```bash
./mvnw spring-boot:run
```

On Windows PowerShell:
```powershell
.\mvnw.cmd spring-boot:run
```

## Default Seed Users
- `customer1 / Customer@123`
- `owner1 / Owner@123`

## Key Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/password-reset/request`
- `POST /api/auth/password-reset/confirm`
- `GET /api/customer/restaurants`
- `POST /api/customer/orders`
- `GET /api/owner/orders`
- `PUT /api/owner/orders/{orderId}/status`

## Docker
Build jar first, then image:
```powershell
.\mvnw.cmd clean package

docker build -t justeat-backend .
docker run -p 8080:8080 justeat-backend
```

## Azure Deployment Note
Use Azure App Service or Azure Container Apps for deployment. Capture deployment screenshots for submission and stop/delete resources after evaluation.


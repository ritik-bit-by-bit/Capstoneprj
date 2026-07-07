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
The backend Dockerfile now builds the JAR inside the image, so you can build directly from source:
```powershell
docker build -t justeat-backend .
docker run -p 8080:8080 justeat-backend
```

## Azure Deployment with ACR + App Service

This project is set up for a GitHub Actions pipeline that:
1. Runs backend tests and frontend build checks.
2. Builds Docker images for the backend and frontend.
3. Pushes both images to Azure Container Registry (ACR).
4. Updates two Azure App Service instances to pull the latest images.

### Required Azure resources
- Azure Container Registry
- Backend Linux App Service using Docker
- Frontend Linux App Service using Docker
- A database reachable from the backend App Service

### GitHub secrets required by `.github/workflows/azure-cd.yml`
- `AZURE_CREDENTIALS` - service principal JSON for `azure/login`
- `AZURE_RESOURCE_GROUP`
- `AZURE_BACKEND_WEBAPP_NAME`
- `AZURE_FRONTEND_WEBAPP_NAME`
- `ACR_LOGIN_SERVER` - for example `myregistry.azurecr.io`
- `ACR_USERNAME`
- `ACR_PASSWORD`
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`

### Environment variables used in Azure App Service
- Backend: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`
- Frontend: the React bundle is built with `VITE_API_URL` pointing to the backend App Service URL

### Important note for CORS
Set `CORS_ALLOWED_ORIGINS` to your frontend App Service URL, for example:
`https://your-frontend-app.azurewebsites.net`

### One-time Azure setup
Create the App Services, enable container-based Linux hosting, and ensure the backend can reach its database. After that, every push to `main` will rebuild and redeploy automatically.


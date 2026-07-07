# JustEat Food Ordering - React Frontend

A role-based React TypeScript application for customers and restaurant owners to order and manage food delivery.

## Features

### Customer Portal
- 🔐 Secure login with JWT tokens
- 🔍 Browse and search restaurants by name, cuisine, location
- 🍽️ View restaurant menus with prices and descriptions
- 🛒 Add items to cart and place orders
- 📋 Track order status (Pending → Preparing → Ready → Completed)
- 📜 View complete order history
- ⭐ Save favorite restaurants and cuisines
- 🚫 Manage dietary restrictions

### Owner Portal
- 📱 Create and manage multiple restaurants
- 🍴 Add, edit, and delete menu items
- 🏷️ Mark items as "Today's Special", "Deal of the Day", or "Mostly Ordered"
- 📦 View incoming orders
- ✅ Update order status through the workflow

### Common Features
- 🔔 Toast notifications for all actions (success/error/info)
- 🔐 Role-based access control (CUSTOMER vs OWNER)
- 📱 Responsive design for mobile and desktop
- 🎨 Clean and intuitive UI

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router v7
- **HTTP Client**: Axios with JWT interceptors
- **Notifications**: React-Toastify
- **Styling**: Custom CSS with responsive design

## Setup & Installation

### Prerequisites

- Node.js 20+ and npm 10+
- Backend Spring Boot server running on `http://localhost:8080`

### Installation Steps

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:8080/api" > .env

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the `frontend` directory:

```
VITE_API_URL=http://localhost:8080/api
```

## Testing Credentials

**Customer Account:**
- Username: `customer1`
- Password: `Customer@123`

**Owner Account:**
- Username: `owner1`
- Password: `Owner@123`

## Project Structure

```
frontend/
├── index.html
├── public/
├── src/
│   ├── api/
│   │   └── apiService.ts           # API client with interceptors
│   ├── utils/
│   │   └── toast.ts                # Toast notification utilities
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── customer/
│   │   │   ├── CustomerDashboard.tsx
│   │   │   ├── BrowseRestaurants.tsx
│   │   │   ├── OrderHistory.tsx
│   │   │   └── Preferences.tsx
│   │   └── owner/
│   │       ├── OwnerDashboard.tsx
│   │       ├── ManageRestaurants.tsx
│   │       ├── ManageMenu.tsx
│   │       └── ManageOrders.tsx
│   ├── App.tsx                     # Main app with routing
│   ├── App.css                     # Global styles
│   ├── index.tsx                   # React entry point
│   └── tsconfig.json
├── package.json
└── README.md
```

## Key API Endpoints Used

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/password-reset/request` - Request password reset
- `POST /api/auth/password-reset/confirm` - Confirm password reset

### Customer APIs
- `GET /api/customer/restaurants` - Browse restaurants
- `GET /api/customer/restaurants/{id}/menu` - View restaurant menu
- `POST /api/customer/orders` - Place order
- `GET /api/customer/orders/history` - Order history
- `GET /api/customer/orders/{id}/status` - Check order status
- `PUT /api/customer/preferences` - Save preferences
- `GET /api/customer/recommendations` - Get recommendations

### Owner APIs
- `GET /api/owner/restaurants` - List owner's restaurants
- `POST /api/owner/restaurants` - Create restaurant
- `PUT /api/owner/restaurants/{id}` - Update restaurant
- `GET /api/owner/menu-items` - List menu items
- `POST /api/owner/menu-items` - Add menu item
- `PUT /api/owner/menu-items/{id}` - Update menu item
- `DELETE /api/owner/menu-items/{id}` - Delete menu item
- `GET /api/owner/orders` - View owner's orders
- `PUT /api/owner/orders/{id}/status` - Update order status

## Building for Production

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory.

## Docker Deployment (Optional)

The frontend folder now includes a production-ready multi-stage `Dockerfile` and `nginx.conf`.

```bash
docker build --build-arg VITE_API_URL=https://<backend-app>.azurewebsites.net/api -t justeat-frontend .
docker run -p 3000:80 justeat-frontend
```

When deploying to Azure App Service, make sure `VITE_API_URL` points to the backend App Service URL so the React bundle talks to the live API.

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure the backend is running and `VITE_API_URL` points to the correct backend URL.

### Port Already in Use
If port 3000 is busy:
```bash
npm run dev -- --port 3001
```

### API Connection Failed
Check that:
1. Backend is running on `http://localhost:8080`
2. `.env` file has correct `VITE_API_URL`
3. Network connectivity to backend

## Notes

- JWT tokens are stored in localStorage
- Tokens are automatically included in all API requests via Axios interceptor
- Users are redirected to login if token is invalid or expired


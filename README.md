# Order Management System

A full-stack order management application developed using ASP.NET Core, React, and MySQL.

The application supports two user roles: **Admin** and **Courier**.

## Features

### Admin
- Log in using JWT authentication.
- Create, view, update, and delete orders.
- Create courier accounts.
- Assign orders to couriers.
- View order statuses.

### Courier
- Log in using JWT authentication.
- View assigned orders.
- Update order status from Pending to InTransit and then Delivered.

## Technologies

**Backend**
- ASP.NET Core Web API (.NET 10)
- C#
- Entity Framework Core
- MySQL
- JWT Authentication

**Frontend**
- React
- JavaScript
- Vite
- CSS

## Prerequisites

- .NET 10 SDK
- Node.js and npm
- MySQL Server
- EF Core CLI tools

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/BlendaPonxhaj/OrderManagementApp
cd OrderManagementApp
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Configure the MySQL connection string using .NET User Secrets:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Port=3306;Database=OrderManagementDB;User=root;Password=YOUR_MYSQL_PASSWORD;"
```

Configure the JWT signing key. The key must be a securely generated Base64-encoded value containing at least 32 random bytes:

```bash
dotnet user-secrets set "Jwt:Key" "YOUR_BASE64_JWT_KEY"
```

Configure the password for the initial Admin account:

```bash
dotnet user-secrets set "SeedAdmin:Password" "YOUR_STRONG_ADMIN_PASSWORD"
```

Replace all placeholder values with your own configuration. Do not commit passwords or JWT signing keys to GitHub.

### 3. Create the Database

Run the Entity Framework Core migrations:

```bash
dotnet ef database update
```

This creates the required database tables.

### 4. Run the Backend

```bash
dotnet run
```

The frontend is configured to communicate with the API at:

`http://localhost:5157`

If the backend uses a different port, update the API URLs in `frontend/src/App.jsx`.

On the first backend startup, an Admin account is created automatically if no Admin exists in the database.

Initial Admin username: `admin`

Initial Admin password: The value configured in `SeedAdmin:Password`.

### 5. Configure and Run the Frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open:

`http://localhost:5173`

## Authentication and Authorization

The application uses JWT authentication and role-based authorization.

- Admin endpoints can only be accessed by Admin users.
- Courier endpoints can only be accessed by Courier users.
- Couriers can only view and update orders assigned to them.

## Order Status Flow

Orders follow this status progression:

`Pending → InTransit → Delivered`

A delivered order cannot be moved back to a previous status.

## Notes

- Application secrets are managed through .NET User Secrets for local development.
- Database migrations are included in the backend.
- The initial Admin account is created only when no Admin user exists.
- The frontend and backend must both be running to use the application locally.
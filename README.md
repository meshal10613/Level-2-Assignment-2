# 🚗 Vehicle Rental System

[Live URL](https://level-2-assignment-2-smoky.vercel.app/)

---

## 🎯 Project Overview

A backend API for a vehicle rental management system that handles:

-   **Vehicles** - Manage vehicle inventory with availability tracking
-   **Customers** - Manage customer accounts and profiles
-   **Bookings** - Handle vehicle rentals, returns and cost calculation
-   **Authentication** - Secure role-based access control (Admin and Customer roles)

---

## 🛠️ Technology Stack

-   Node.js + TypeScript
-   Express.js (web framework)
-   PostgreSQL (database)
-   bcrypt (password hashing)
-   jsonwebtoken (JWT authentication)

---

## ⭐ Key Features

### 🔐 Authentication & Authorization

-   Secure JWT login
-   Role-based access control (Admin / Customer)
-   Protected routes

### 🚙 Vehicle Management

-   CRUD operations
-   Availability status updates
-   Daily rent price tracking

### 👤 Customer Management

-   Account creation
-   Profile updates
-   View booking history

### 📅 Booking System

-   Book a vehicle with start & end dates
-   Automatic total price calculation
-   Prevent double-booking
-   Manage returns

---

## 📁 Project Structure

```bash
project-root/
│── node_modules/
│── src/
│ ├── config/
│ ├── middlewares/
│ ├── modules/
│ ├── types/
│ ├── app.ts
│ └── server.ts
│── .env
│── .gitignore
│── package-lock.json
│── package.json
│── README.md
│── tsconfig.json
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/meshal10613/Level-2-Assignment-2.git

cd assignment-2
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Environment setup
Create a .env file in the project root:
```bash
PORT=5000

PSQL_STRING=postgresql://neondb_owner:npg_wF96ZCQifYtb@ep-long-flower-a4fwno8s-pooler.us-east-1.aws.neon.tech/assignment-2?sslmode=require&channel_binding=require

JWT_SECRET=022342b5bac0f5bae42508c3ece4d62896b31b2e46eb8fda1ebcaae589a4a94308be7d9f7dd7abe2abe614bb1fd64ac8a90b2996ff92234aaccef0e29337f3c38ecef7621939947e989d831081f3fd27443ebd277c325c39a7ffa74b3d174b98cca2536bde3acbce3abd4cfa6d02b23412b8000f89b307449737cd604caad2ac
```
### 4️⃣ Start the development server
```bash
npm run dev
```
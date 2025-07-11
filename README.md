# Energy Consumption Calculator (IoT Simulator)

## Description

This application helps users calculate and monitor the electricity usage of their household devices. At first, users can manually add and set up each device by choosing its usage method and power consumption. The app then displays energy consumption per device, along with total usage per day, month, and year.

In future updates, the system will simulate real-time energy data from IoT devices, making the experience more automated, interactive, and closer to real-world scenarios.


## Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JSON Web Tokens (JWT), bcrypt for password hashing
- **Database:** MongoDB with Mongoose 
- **Testing:** Jest, Supertest
- **Logging:** Winston (with daily rotate & MongoDB transports)
- **Scheduled Tasks:** node-cron
- **API Documentation:** Swagger (swagger-ui-express)

### Development Tools

- **Environment Variables:** dotenv
- **Live Reloading:** nodemon
- **Unique IDs:** nanoid

### Frontend *(Planned)*

- **Library:** React (to be developed)


## Installation

Follow the steps below to run the project locally:

1. **Clone the repository**

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Install the depedencies**
```bash
npm install
```

3. **Set up environment variables**

Create a .env file in the root directory and add the following:

    PORT = 3000
    MONGODB_URI=mongodb://localhost:27017/your-db-dame
    JWT_SECRET =your_secret_key

4. **Run the development server**
```bash
npm run dev
```

****The server should now be running at http://localhost:3000**

## Features

- 🔐 **User Authentication**
  - Secure registration and login using JWT tokens
  - Passwords are hashed using bcrypt

- ⚙️ **Device Management**
  - Users can create and configure virtual devices
  - Each device includes a name, type, usage mode, and power consumption (Watts)

- 📊 **Energy Consumption Tracking**
  - Calculates energy usage per device
  - Provides aggregated consumption data by day, month, and year

- 📅 **Scheduled Jobs**
  - Uses `node-cron` to perform daily background tasks (data calculations)

- 📝 **API Documentation**
  - Swagger documentation of all available endpoints

- 📦 **Logging**
  - Request and error logging using Winston (with MongoDB and daily rotation)

- 🧪 **Testing**
  - Unit and integration tests using Jest and Supertest


## Time Series Data Architecture

Storing energy usage efficiently over time is a key challenge in systems that deal with device monitoring and historical analytics.

To address this, the application uses **MongoDB Time Series Collections** — a feature designed specifically for handling time-based measurements like electricity consumption.

### Why Time Series?

Instead of storing each energy entry in a generic collection, which can become slow and expensive over time, we use MongoDB’s native time series collection to:

- 📈 Optimize storage for high-volume, time-based data
- ⚡ Enable fast and efficient queries over time ranges (e.g., "last 24 hours")
- 🔧 Automatically organize data by time and device metadata

## API Architecture

This project follows a **RESTful API design**. All backend endpoints are structured around resources (such as `users`, `devices`, and `energy consumption`) and use standard HTTP methods for interaction (GET, POST, PUT, DELETE). 

Authentication is stateless, using JSON Web Tokens (JWT), and all responses are provided in JSON format with appropriate HTTP status codes.

This ensures a scalable and interoperable structure, compatible with any frontend or client that supports HTTP.



## Usage

Before interacting with the system, users must first register and log in.

### 1. Register a new user
**Endpoint:** `POST /api/users`

### 2. Log in
**Endpoint:** `POST /api/auth/login`

### 3. Add a device
**Endpoint:** `POST /api/devices`

### 4. View energy consumption
After authentication, you can retrieve your energy consumption data in the following ways:

#### 🔹 Daily Consumption

- **All Devices (Total):**  
  `GET /api/consumption/daily`

- **By Device ID:**  
  `GET /api/consumption/daily/:id`

#### 🔹 Monthly Consumption

- **All Devices (Total):**  
  `GET /api/consumption/monthly`

- **By Device ID:**  
  `GET /api/consumption/monthly/:id`

#### 🔹 Yearly Consumption

- **All Devices (Total):**  
  `GET /api/consumption/year`

- **By Device ID:**  
  `GET /api/consumption/year/:id`

## API Documentation

This project includes full, interactive API documentation using **Swagger**.

After starting the application locally, you can access the docs at:

👉 [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)

---

#### Note
This project is currently in active development. The backend is undergoing improvements, and the frontend is planned to be built using React. 

Ι expect the project to be completed and ready by early August.
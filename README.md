# Jobify

Jobify is a full stack job portal application where users can create accounts and post job listings. This project is built with a React frontend and an Express backend, and it uses MongoDB for data storage.

## Table of Contents

- [Pictures](#pictures)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Scripts](#scripts)

## Pictures

## Features

- User authentication and authorization
- Job posting and management
- Responsive design
- Notifications and alerts
- Secure data handling

## Tech Stack

### Client

- React
- React Router
- Styled Components
- Axios
- Dayjs
- Recharts
- React Toastify
- Vite

### Server

- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Bcrypt
- Cloudinary
- Multer
- Helmet
- Morgan

## Installation

### Prerequisites

- Node.js
- MongoDB

### Clone the Repository

```sh
git clone https://github.com/huzaifaghazali/jobify.git
cd jobify
```
### Install Dependencies

#### Client

```sh
cd client
npm install
```

#### Sever

```sh
cd server
npm install
```

## Environment Variables

Create a .env file in the root of your server directory and add the following environment variables:

```sh
NODE_ENV=development
PORT=5000
MONGO_URL=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=your_jwt_expiration_time
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

## Usage

### Running Client

```sh
cd client
npm ruv dev
```

### Running Sever

```sh
cd server
npm run dev
```

The application will be available at `http://localhost:5000.`

## Scripts

### Client

- `npm run build:` Build the project for production
- `npm run dev`: Start the development server
- `npm run lint`: Lint the codebase
- `npm run preview`: Preview the production build

### Sever

- `npm run build`: Start the development server with nodemon
- `npm run watch`: Watch for file changes and restart the server

# Project Link - Senior Housing Companion

A platform connecting senior citizens with potential roommates, fostering intergenerational living arrangements and companionship. We hope this platform can also allow people to explore more affordable ways to live.

## Features

- User authentication for seniors and potential roommates
- Profile management with detailed preferences and requirements
- Room/space listing creation and management
- Advanced search and filtering
- In-app messaging system
- Reviews and ratings
- Safety verification system

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **Additional Tools**: ESLint, Prettier

## Project Structure

```
project-link-seniors-housing/
├── client/                 # Frontend React application
├── server/                 # Backend Node.js application
├── shared/                 # Shared types and utilities
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` in both client and server directories
   - Fill in the required environment variables

4. Start the development servers:

   ```bash
   # Start backend server (from server directory)
   npm run dev

   # Start frontend server (from client directory)
   npm run dev
   ```

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

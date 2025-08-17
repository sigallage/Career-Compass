# Career Compass Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Ballerina (for backend services)

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Configure Auth0 Environment Variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and fill in your Auth0 credentials:
     ```
     VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
     VITE_AUTH0_CLIENT_ID=your-auth0-client-id
     VITE_AUTH0_CALLBACK_URL=http://localhost:5173
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Auth0 Setup (Required for Sign Up/Login functionality)

1. Create a free Auth0 account at [https://auth0.com](https://auth0.com)
2. Create a new application (Single Page Application)
3. Configure the following in your Auth0 dashboard:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
4. Copy your Domain and Client ID to the `.env` file

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Install Node.js dependencies:
   ```bash
   npm install
   ```

4. Start the Ballerina backend:
   ```bash
   bal run
   ```

## Important Notes

- The `.env` file is not committed to Git for security reasons
- Each developer needs to create their own `.env` file using the `.env.example` template
- Auth0 credentials are required for the sign-up/login functionality to work
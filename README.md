# Bridge

**Inclusive learning powered by AI.**

Bridge is a full-stack web application designed to enhance learning and accessibility using advanced AI capabilities, specifically built to aid people with learning disabilities. It provides tools for text summarization, image description, and analysis of various file types (PDF, Audio), wrapped in an accessible and user-friendly interface.

## 🌐 Live Demo

You can try the live version of the application here: **[Bridge Learning App](https://bridge-learning-app.onrender.com)**

## 🚀 Key Features

- **AI-Powered Summarization & Analysis:**
  - **Text Summarization:** Paste text and get concise AI-generated summaries.
  - **Image Description:** Upload images to receive detailed textual descriptions.
  - **File Analysis:** Extract and analyze content from PDF documents and Audio files.
- **Accessibility First:**
  - Built-in accessibility menu.
  - Toggle options for **High Contrast** mode and **Dyslexic-friendly Fonts**.
  - "Skip to Content" links for keyboard navigation.
- **User Accounts & History:**
  - Secure local Signup/Login.
  - Google OAuth integration.
  - Password recovery via security questions.
  - Save and view history of your AI summaries and analyses.

## 🛠️ Tech Stack

### Frontend
- **React.js** with **Vite** for fast, modern UI development.
- **React Router** for seamless navigation (`/`, `/dashboard`, `/history`).
- **Material UI (MUI)** for accessible and responsive components.

### Backend
- **Node.js** & **Express.js** for a robust RESTful API.
- **MongoDB** & **Mongoose** for data storage (Users, Summaries).
- **Passport.js** for authentication (Local & Google OAuth).
- **Google Gemini API** (`@google/generative-ai`) for AI operations.
- **Bcrypt.js** for secure password hashing.

## 📂 Project Structure

- **`frontend/`**: The React + Vite application (UI).
- **`backend/`**: The Node.js + Express application (API).

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- A running instance of MongoDB (Local or Atlas)
- Required API Keys (Google OAuth, Gemini API)

### 1. Environment Setup

Create a `.env` file in the `backend/` directory and configure the following variables:

```env
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GEMINI_API_KEY=your_gemini_api_key
COOKIE_KEY=any_random_secure_string_for_session_cookies
PORT=5000 # Optional, defaults to 5001 if omitted
```

### 2. Start the Backend

Open a terminal and run the following commands to install dependencies and start the backend server:

```bash
cd backend
npm install
npm start
```

The backend server will run on `http://localhost:5000` (or the port specified in `.env`).

### 3. Start the Frontend

Open a **new** terminal window and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`. You can verify the exact URL in your terminal output.

## 🧪 Usage & Testing

1. Open the frontend URL (`http://localhost:5173`) in your web browser.
2. Sign up for a new account or log in (using either Local Auth or Google).
3. Navigate to the **Dashboard** to:
   - Paste text to get AI summaries.
   - Upload an image for AI description.
   - Upload a PDF or Audio file for content analysis.
4. Toggle accessibility settings using the accessibility menu.
5. Visit the **History** page to view your past queries and AI responses.

---

*Bridge is built to connect users with the information they need in a format that works best for them.*
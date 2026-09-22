# 🚀 Interview AI — AI-Powered Interview Preparation & Resume Builder

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-3.7_Flash-4285F4?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

An end-to-end full-stack AI web application designed to help job seekers crack their dream technical interviews. Upload your resume, provide a target job description, and get a **personalized 7+ day preparation roadmap**, **tailored technical and behavioral question bank with model answers**, **skill gap analysis**, **one-click plan regeneration**, and a **downloadable tailored resume PDF with clickable live links**.

---

## ✨ Key Features

- 🧠 **Tailored Technical & Behavioral Questions**: Generates at least 5 technical and 5 behavioral questions tailored precisely to your resume and target job description, complete with interview intentions and model answers.
- 🗺️ **Personalized Preparation Roadmap**: Produces an actionable, multi-day preparation schedule (minimum 7 days) detailing daily focus areas and concrete checklist tasks.
- 🎯 **Role Match Score & Skill Gap Analysis**: Calculates an overall match score percentage and highlights critical skill gaps categorized by severity (`high`, `medium`, `low`).
- 📄 **Tailored Resume PDF Generator**: Uses Puppeteer to create an ATS-friendly, beautifully formatted resume PDF featuring **clickable project links and contact URLs** (GitHub, LinkedIn, Live Demos).
- 🔄 **One-Click Plan Regeneration**: Re-run AI analysis on demand to get fresh questions, updated roadmaps, and deeper insights without re-uploading documents.
- 🔐 **Secure Authentication**: User registration and login protected with bcrypt password hashing and JWT stored in secure HTTP-only cookies.
- 📱 **100% Mobile Responsive Modern UI**: Handcrafted dark-mode aesthetic with fluid typography, responsive 3-column desktop layout, and seamless mobile touch navigation.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) with [Vite 7](https://vitejs.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/) (Single Page Application with client-side routing)
- **Styling**: Vanilla SCSS (Sass) with modular components and responsive breakpoints
- **HTTP Client**: [Axios](https://axios-http.com/) with credentials and environment-aware baseURL

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose 9](https://mongoosejs.com/)
- **AI Integration**: [Google GenAI SDK (`@google/genai`)](https://www.npmjs.com/package/@google/genai) with Zod structured output validation
- **PDF Generation**: [Puppeteer](https://pptr.dev/) & [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- **File Uploads**: [Multer](https://www.npmjs.com/package/multer) (Memory Storage)

---

## 📁 Repository Structure

```
interview-ai-yt/
├── Backend/                     # Express REST API
│   ├── server.js                # Server entry point (exports app for Vercel)
│   ├── package.json             # Backend dependencies & scripts
│   └── src/
│       ├── app.js               # Express app config, CORS & routes
│       ├── config/              # MongoDB connection (cached for serverless)
│       ├── controllers/         # Auth & Interview request handlers
│       ├── middlewares/         # JWT auth & Multer file upload
│       ├── models/              # Mongoose schemas (User, InterviewReport, Blacklist)
│       ├── routes/              # Express API routers (/api/auth, /api/interview)
│       └── services/            # AI generation (Gemini) & PDF creation
├── Frontend/                    # React 19 + Vite SPA
│   ├── index.html               # Main HTML entry
│   ├── package.json             # Frontend dependencies & build scripts
│   ├── vercel.json              # SPA rewrite configuration
│   ├── vite.config.js           # Vite build configuration
│   └── src/
│       ├── App.jsx              # Main React Router switch
│       ├── features/            # Feature-based architecture (auth, interview)
│       └── style/               # Global SCSS stylesheets
├── vercel.json                  # Root monorepo deployment config (builds + SPA routes)
└── README.md                    # Project documentation
```

---

## ⚙️ Environment Variables

### Backend (`Backend/.env`)
Create a `.env` file inside the `Backend/` directory:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
BASE_URL=https://gemini-web2api-production-7299.up.railway.app # Optional custom proxy baseUrl
FRONTEND_URL=http://localhost:5173                             # For CORS allowed origins
```

### Frontend (`Frontend/.env`)
Create a `.env` file inside the `Frontend/` directory:

```env
# Optional: In development, defaults to http://localhost:3000.
# In production on Vercel, defaults to "" (same domain relative routing).
VITE_BASE_URL=http://localhost:3000
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (Local or MongoDB Atlas cluster)
- npm or yarn

### 2. Clone the Repository
```bash
git clone https://github.com/<your-username>/interview-ai-yt.git
cd interview-ai-yt
```

### 3. Setup Backend
```bash
cd Backend
npm install
# Create .env file with your credentials (see above)
npm run dev
```
Backend will run at `http://localhost:3000`.

### 4. Setup Frontend
Open a new terminal window:
```bash
cd Frontend
npm install
npm run dev
```
Frontend will run at `http://localhost:5173`.

---

## ☁️ Deployment on Vercel

This repository is pre-configured with a root [`vercel.json`](./vercel.json) to deploy both the **Frontend** and **Backend** together as a single unified Vercel project with complete SPA client-side routing support.

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push your repository to **GitHub**.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import your GitHub repository.
4. **Project Settings**:
   - **Framework Preset**: Leave as *Other* or *Vite* (the root `vercel.json` will automatically orchestrate the builds).
   - **Root Directory**: `./` (leave as default root).
5. **Environment Variables**:
   Under **Environment Variables**, add the backend environment keys:
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random secret string for token signing.
   - `GOOGLE_GENAI_API_KEY`: Your Google Gemini API Key.
   - `BASE_URL`: *(Optional)* Custom Gemini API proxy base URL if applicable.
   - `NODE_ENV`: `production`
6. Click **Deploy**.

Vercel will automatically build the Vite static assets, deploy the Express API as a serverless function, and route:
- `/api/*` ➔ Backend Express serverless function (`Backend/server.js`)
- `/assets/*` ➔ Pre-built static bundles (`Frontend/dist/assets/`)
- `/*` ➔ Client-side SPA fallback (`Frontend/dist/index.html`)

### Option 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from root folder
vercel

# Deploy to production
vercel --prod
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account with `username`, `email`, `password` |
| `POST` | `/api/auth/login` | Public | Authenticate user & set JWT HTTP-only cookie |
| `GET` | `/api/auth/logout` | Public | Clear auth cookie & blacklist token |
| `GET` | `/api/auth/get-me` | Private | Retrieve currently authenticated user profile |

### Interview & Resume (`/api/interview`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/interview/` | Private | Generate new interview report (expects `jobDescription`, `selfDescription`, `resume` PDF file) |
| `GET` | `/api/interview/` | Private | Get all saved interview reports for logged-in user |
| `GET` | `/api/interview/report/:interviewId` | Private | Get single interview report details by ID |
| `POST` | `/api/interview/regenerate/:interviewId` | Private | Re-generate interview plan using stored resume & job description |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Private | Generate and download tailored PDF resume |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/<your-username>/interview-ai-yt/issues).

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

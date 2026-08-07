# HOW TO RUN — ASR Digital Client Dashboard

---

## Architecture

| Layer    | Technology              | Hosting             |
|----------|-------------------------|---------------------|
| Frontend | React 18 + Vite         | **Vercel**          |
| Backend  | FastAPI + Python        | **Vercel / Railway**|
| Database | MongoDB Atlas (Motor)   | **MongoDB Atlas**   |
| Crawler  | httpx + BS4             | Auto on startup     |

---

## Option A — Run Locally (Development)

### Prerequisites
| Tool       | Version  |
|------------|----------|
| Python     | 3.11+    |
| Node.js    | 18+      |

### 0 — MongoDB Atlas Setup

1. Create a free cluster at https://cloud.mongodb.com
2. Create a database user and whitelist your IP (or use 0.0.0.0/0 for dev)
3. Click **Connect → Drivers** and copy your URI
4. Create `asr-dashboard/backend/.env` from `.env.example` and paste the URI

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=asr_dashboard
```

### 1 — Start the Backend

```bash
cd asr-dashboard/backend
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend → http://localhost:8000  
API docs → http://localhost:8000/docs

### 2 — Start the Frontend

```bash
cd asr-dashboard/frontend
npm install
npm run dev
```

Frontend → http://localhost:5173

### 3 — Login

```
Email:    admin@asr.digital
Password: demo1234
```

---

## Option B — Deploy to Vercel

Both frontend and backend are deployed as separate Vercel projects from the same repo.

### Step 1 — Push to GitHub

```bash
cd asr-dashboard
git init
git add .
git commit -m "Initial commit — ASR Digital Dashboard"
git remote add origin https://github.com/YOUR_USERNAME/asr-dashboard.git
git push -u origin main
```

---

### Step 2 — Deploy Backend on Vercel

1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Set Root Directory to `backend`
4. Framework Preset: **Other**
5. Under Environment Variables add:

| Key               | Value                                          |
|-------------------|------------------------------------------------|
| `MONGODB_URI`     | Your MongoDB Atlas connection string           |
| `MONGODB_DB`      | `asr_dashboard`                                |
| `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app`             |

6. Click Deploy

Copy your backend URL, e.g. `https://asr-dashboard-backend.vercel.app`

---

### Step 3 — Deploy Frontend on Vercel

1. Go to https://vercel.com → New Project
2. Import the same repo
3. Set Root Directory to `frontend`
4. Framework Preset: **Vite**
5. Under Environment Variables add:

| Key            | Value                                              |
|----------------|----------------------------------------------------|
| `VITE_API_URL` | `https://asr-dashboard-backend.vercel.app`         |

6. Click Deploy

---

### Step 4 — Update Backend CORS

Once you have your frontend URL, go to your backend Vercel project:

1. Settings → Environment Variables
2. Update `ALLOWED_ORIGINS` to your frontend URL
3. Redeploy (Vercel → Deployments → Redeploy)

---

## File Structure

```
asr-dashboard/
├── frontend/
│   ├── vercel.json           ← Vercel SPA config
│   ├── .env.example          ← Copy to .env.local for local dev
│   ├── .env.local            ← Local dev (blank VITE_API_URL)
│   ├── vite.config.js        ← Reads VITE_API_URL
│   └── src/utils/api.js      ← Uses VITE_API_URL in production
│
└── backend/
    ├── vercel.json           ← Vercel Python serverless config
    ├── requirements.txt      ← Python dependencies (Motor, FastAPI…)
    ├── .env.example          ← Copy to .env for local dev
    ├── mongodb.py            ← Motor connection module
    ├── repositories.py       ← Data-access layer (all collections)
    ├── crawler.py            ← Web crawler (writes to MongoDB)
    └── main.py               ← FastAPI app entry point
```

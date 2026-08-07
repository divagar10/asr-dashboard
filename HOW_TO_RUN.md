# HOW TO RUN — ASR Digital Client Dashboard

---

## Architecture

| Layer    | Technology            | Hosting           |
|----------|-----------------------|-------------------|
| Frontend | React 18 + Vite       | **Firebase Hosting** |
| Backend  | FastAPI + Python 3.11 | **Railway**       |
| Database | MongoDB Atlas (Motor) | **MongoDB Atlas** |
| Crawler  | httpx + BS4           | Auto on startup   |

---

## Option A — Run Locally

### Prerequisites
| Tool    | Version |
|---------|---------|
| Python  | 3.11+   |
| Node.js | 18+     |

### 1 — Backend

```bash
cd asr-dashboard/backend

# Copy and fill in your MongoDB URI
cp .env.example .env

python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend → http://localhost:8000  
API docs → http://localhost:8000/docs

### 2 — Frontend

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

## Option B — Deploy to Production

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "deploy: Railway + Firebase"
git push
```

---

### Step 2 — Deploy Backend on Railway

1. Go to https://railway.app → New Project → Deploy from GitHub repo
2. Select your repo, set Root Directory to `asr-dashboard/backend`
3. Railway auto-detects Python via nixpacks + `requirements.txt`
4. In the service → **Variables** tab, add:

| Key               | Value                                              |
|-------------------|----------------------------------------------------|
| `MONGODB_URI`     | Your MongoDB Atlas connection string               |
| `MONGODB_DB`      | `asr_dashboard`                                    |
| `ALLOWED_ORIGINS` | `https://your-app.web.app` *(fill after Firebase deploy)* |

> Railway sets `PORT` automatically — do not add it manually.

5. Click **Deploy** — Railway uses `railway.toml` / `Procfile` to start:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

Copy your Railway backend URL, e.g.:
```
https://asr-dashboard-backend.up.railway.app
```

---

### Step 3 — Deploy Frontend on Firebase Hosting

#### Install Firebase CLI (once)

```bash
npm install -g firebase-tools
firebase login
```

#### Build and deploy

```bash
cd asr-dashboard/frontend

# Set your Railway backend URL for the production build
VITE_API_URL=https://asr-dashboard-backend.up.railway.app npm run build

# Initialise Firebase project (first time only)
# Edit .firebaserc and replace "your-firebase-project-id" with your real project ID

firebase deploy --only hosting
```

Your dashboard is live at:
```
https://your-app.web.app
```

---

### Step 4 — Update Railway CORS

Once you have your Firebase URL, go to Railway → Variables and update:

| Key               | Value                                  |
|-------------------|----------------------------------------|
| `ALLOWED_ORIGINS` | `https://your-app.web.app`             |

Redeploy to apply.

---

## File Structure

```
asr-dashboard/
├── frontend/
│   ├── firebase.json         ← Firebase Hosting config (SPA rewrites + cache headers)
│   ├── .firebaserc           ← Firebase project ID
│   ├── .env.example          ← Copy to .env.local for local dev
│   ├── .env.local            ← Local dev (blank VITE_API_URL uses Vite proxy)
│   ├── vite.config.js        ← Reads VITE_API_URL at build time
│   └── src/utils/api.js      ← Uses VITE_API_URL in production
│
└── backend/
    ├── railway.toml          ← Railway build + start config
    ├── Procfile              ← Process start command fallback
    ├── runtime.txt           ← Python version hint
    ├── requirements.txt      ← Python dependencies
    ├── .env.example          ← Copy to .env for local dev
    ├── mongodb.py            ← Motor connection module
    ├── repositories.py       ← Data-access layer
    ├── crawler.py            ← Web crawler
    └── main.py               ← FastAPI app entry point
```

---

## Environment Variables Reference

### Backend (Railway Variables tab)

| Variable          | Required | Description                              |
|-------------------|----------|------------------------------------------|
| `MONGODB_URI`     | Yes      | MongoDB Atlas SRV connection string      |
| `MONGODB_DB`      | No       | Database name (default: `asr_dashboard`) |
| `ALLOWED_ORIGINS` | Yes      | Comma-separated frontend URLs            |
| `PORT`            | Auto     | Set by Railway — do not override         |

### Frontend (build-time env)

| Variable       | Required | Description                                    |
|----------------|----------|------------------------------------------------|
| `VITE_API_URL` | Yes (prod) | Railway backend URL, e.g. `https://x.railway.app` |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| CORS error in browser | Add Firebase URL to `ALLOWED_ORIGINS` on Railway |
| `Network Error` on all API calls | Check `VITE_API_URL` was set at build time |
| MongoDB auth failed | Verify `MONGODB_URI` password and IP whitelist in Atlas |
| Railway build fails | Check Python version — use 3.11 in `runtime.txt` |
| Firebase deploy fails | Run `firebase login` and check `.firebaserc` project ID |

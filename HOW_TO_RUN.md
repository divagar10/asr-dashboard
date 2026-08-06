# HOW TO RUN — ASR Digital Client Dashboard

---

## Architecture

| Layer    | Technology        | Hosting        |
|----------|-------------------|----------------|
| Frontend | React 18 + Vite   | **Netlify**    |
| Backend  | FastAPI + Python  | **Render.com** |
| Database | SQLite            | Render disk    |
| Crawler  | httpx + BS4       | Auto on startup|

---

## Option A — Run Locally (Development)

### Prerequisites
| Tool       | Version  | Download |
|------------|----------|----------|
| Python     | 3.10+    | https://python.org |
| Node.js    | 18+      | https://nodejs.org |

### 1 — Start the Backend

```bash
cd asr-dashboard/backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install packages
pip install -r requirements.txt

# Start server
uvicorn main:app --reload --port 8000
```

Backend runs at → **http://localhost:8000**
API docs at → **http://localhost:8000/docs**

On first start it automatically crawls `cisprotraining.com`.

### 2 — Start the Frontend

Open a **second terminal**:

```bash
cd asr-dashboard/frontend

npm install
npm run dev
```

Frontend runs at → **http://localhost:5173**

### 3 — Login

```
Email:    admin@asr.digital
Password: demo1234
```

Or click **Demo Login** to skip credentials.

### Windows one-click
Double-click `start-all.bat` — opens both servers in separate windows.

---

## Option B — Deploy to Production

### Overview

```
GitHub Repo
    │
    ├── frontend/  ──────────► Netlify  (auto-deploy on push)
    │
    └── backend/   ──────────► Render   (auto-deploy on push)
```

---

### Step 1 — Push to GitHub

```bash
cd asr-dashboard

git init
git add .
git commit -m "Initial commit — ASR Digital Dashboard"

# Create a new repo on GitHub then:
git remote add origin https://github.com/YOUR_USERNAME/asr-dashboard.git
git push -u origin main
```

---

### Step 2 — Deploy Backend on Render

1. Go to **https://render.com** → Sign up / Log in
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Fill in these settings:

| Setting         | Value                              |
|-----------------|------------------------------------|
| Name            | `asr-dashboard-api`                |
| Root Directory  | `backend`                          |
| Runtime         | `Python 3`                         |
| Build Command   | `pip install -r requirements.txt`  |
| Start Command   | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Plan            | Free                               |

5. Under **Environment Variables** add:

| Key               | Value                                      |
|-------------------|--------------------------------------------|
| `ALLOWED_ORIGINS` | `https://YOUR-SITE.netlify.app` *(fill in after Netlify deploy)* |
| `PYTHON_VERSION`  | `3.11.0`                                   |

6. Click **Create Web Service**

Render will build and deploy. Wait ~2–3 minutes.

Copy your backend URL — it looks like:
```
https://asr-dashboard-api.onrender.com
```

---

### Step 3 — Deploy Frontend on Netlify

1. Go to **https://netlify.com** → Sign up / Log in
2. Click **Add new site → Import an existing project**
3. Connect your GitHub repo
4. Fill in these settings:

| Setting         | Value          |
|-----------------|----------------|
| Base directory  | `frontend`     |
| Build command   | `npm run build`|
| Publish directory | `frontend/dist` |

5. Under **Site configuration → Environment variables** add:

| Key            | Value                                          |
|----------------|------------------------------------------------|
| `VITE_API_URL` | `https://asr-dashboard-api.onrender.com`       |

6. Click **Deploy site**

Netlify will build and deploy. Wait ~1–2 minutes.

Your dashboard will be live at:
```
https://YOUR-SITE-NAME.netlify.app
```

---

### Step 4 — Update Render CORS

Once you have your Netlify URL, go back to Render:

1. Open your web service → **Environment**
2. Update `ALLOWED_ORIGINS`:
   ```
   https://YOUR-SITE-NAME.netlify.app
   ```
3. Click **Save Changes** — Render redeploys automatically

---

### Step 5 — Verify Everything Works

Open your Netlify URL in a browser.
- Login with `admin@asr.digital` / `demo1234`
- Dashboard should load with live data from cisprotraining.com
- Check **Website Overview** — should show LIVE crawled data

You can also test the backend directly:
```
https://asr-dashboard-api.onrender.com/api/status
https://asr-dashboard-api.onrender.com/docs
```

---

## Custom Domain on Netlify (Optional)

1. Netlify → Site configuration → **Domain management**
2. Click **Add a domain**
3. Enter your domain e.g. `dashboard.yourdomain.com`
4. Follow the DNS instructions
5. Update `ALLOWED_ORIGINS` on Render to include your custom domain:
   ```
   https://dashboard.yourdomain.com,https://YOUR-SITE.netlify.app
   ```

---

## Re-deploy After Code Changes

Both Netlify and Render auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Your change description"
git push
```

- Netlify rebuilds the frontend automatically
- Render rebuilds the backend automatically

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `CORS error` in browser | Add your Netlify URL to `ALLOWED_ORIGINS` on Render |
| `Network Error` on all API calls | Check `VITE_API_URL` is set correctly on Netlify |
| Backend shows "No website data" | Backend is cold-starting — wait 30s and refresh (Render free tier sleeps) |
| Render spins up slowly | Free tier sleeps after 15min inactivity — first request takes ~30s |
| Build fails on Netlify | Check Node version is 20 in `netlify.toml` |
| `Module not found` errors | Run `npm install` locally, commit `package-lock.json` |

---

## Render Free Tier Note

Render's free plan **spins down** after 15 minutes of inactivity.
The first request after sleep takes **20–30 seconds** to wake up.

To avoid this:
- Upgrade to Render's paid plan ($7/month), or
- Use an uptime monitor like [UptimeRobot](https://uptimerobot.com) to ping `/api/status` every 14 minutes (free)

Add this URL to UptimeRobot:
```
https://asr-dashboard-api.onrender.com/api/status
```

---

## File Structure Reference

```
asr-dashboard/
├── frontend/
│   ├── netlify.toml          ← Netlify build config
│   ├── .env.example          ← Copy to .env for local dev
│   ├── .env.local            ← Local dev (blank VITE_API_URL)
│   ├── vite.config.js        ← Reads VITE_API_URL
│   └── src/utils/api.js      ← Uses VITE_API_URL in production
│
└── backend/
    ├── render.yaml           ← Render one-click deploy config
    ├── Procfile              ← Process start command
    ├── runtime.txt           ← Python version for Render
    ├── requirements.txt      ← Python dependencies
    ├── .env.example          ← Copy to .env for local dev
    └── main.py               ← Reads ALLOWED_ORIGINS from env
```


 C:\Users\devda\AppData\Local\Python\bin\python3.exe -m uvicorn main:app --host 0.0.0.0 --port 8000


 PS D:\projects\cispro dashboard\asr-dashboard\frontend> .\node_modules\.bin\vite.cmd --host 0.0.0.0 --port 5173


Start-Sleep -Seconds 10; Write-Host "done"
 C:\Users\devda\AppData\Local\Python\bin\python3.exe "D:\projects\cispro dashboard\asr-dashboard\run_output.py"<!--  -->


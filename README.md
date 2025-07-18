# GOSEL MVP — PayHack 2025

This repository contains the MVP for the GOSEL orchestration layer demo.

We use Python + virtual environment (`payhackenv`) + requirements.txt for reproducible setup.

---

## 🚀 Setup Instructions

### 1️⃣ Clone the repo

```bash
git clone https://github.com/yourteam/gosel-mvp.git
cd payhack2025
```

### 2️⃣ Create & activate virtual environment (payhackenv)

**For macOS / Linux:**

```bash
python3 -m venv payhackenv
source payhackenv/bin/activate
```

**For Windows (cmd/powershell):**

```bash
python -m venv payhackenv
payhackenv\Scripts\activate
```

You should see `(payhackenv)` in your terminal prompt.

### 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

## 🧹 Notes

✅ Do NOT commit the `payhackenv/` folder — it is specific to your machine.  
✅ Add it to `.gitignore`.

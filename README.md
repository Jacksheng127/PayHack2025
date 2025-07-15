# PayHack2025

---

# 🧩 GOSEL MVP Development Plan

**Goal**: Showcase the GOSEL orchestration layer + merchant onboarding innovation (passport), including smart routing, fallback, and blockchain-backed audit logs.

---

## ⚙️ 1. 🏗️ **Project Setup**

### Tech Stack:

- **Framework**: React + Vite
- **Language**: JavaScript + SWC
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **Development Tool**: Cursor with Vibe Coding
- **Data Persistence**: Simulated using `mockLedger.js` (JSON)

### Suggested Folder Structure:

/src
/pages
Onboard.jsx
Passport.jsx
Integrate.jsx
Payments.jsx
Ledger.jsx
/components
Navbar.jsx
PSPCard.jsx
LedgerViewer.jsx
/utils
mockLedger.js
generateSignature.js

---

## 🧾 2. 📄 **Feature Planning by Page**

### 🔹 `/onboard` – Merchant Onboarding

**Purpose**: Create merchant + store verified attestation

#### Features:

- Form: Merchant name, reg. number, verifying bank (dropdown)
- On submit:

  - Generate GOSEL ID
  - Call `generateSignature()`
  - Save to `mockLedger.js` with type `"passport"`
  - Redirect to `/passport`

---

### 🔹 `/passport` – Passport View

**Purpose**: Display merchant’s verified onboarding record

#### Features:

- Fetch last passport from `mockLedger.js`
- Show:

  - GOSEL ID
  - Bank that verified
  - Timestamp
  - Signature hash

- “🔍 View on Ledger” → `/ledger/:id`

---

### 🔹 `/integrate` – Connect to PSP/Bank

**Purpose**: Simulate reusing passport to onboard with new PSPs

#### Features:

- Display list of PSPs (e.g., PSP A, PSP B, PSP C)
- When clicked:

  - Simulate reading passport from ledger
  - Show:

    - ✅ Accepted
    - ⚠️ More info needed (if random chance or fallback simulation)

---

### 🔹 `/payments` – Transaction Routing + Fallback

**Purpose**: Show orchestration layer in action

#### Features:

- Simulate 2 routing paths:

  - FX rate, latency, success rate

- Let user select or auto-select
- Randomly simulate failure → fallback to 2nd route
- Log result to `mockLedger.js` (type: `"payment"`)

---

### 🔹 `/ledger/:id` – Blockchain Simulation

**Purpose**: Display the immutable metadata of onboarding/payment

#### Features:

- Show JSON record:

  - ID
  - Type
  - Details (passport or payment)
  - Signature
  - Timestamp

- Label: “📦 Simulated Blockchain Entry”

---

## 🔐 3. 📚 **Core Logic & Utils**

### `/utils/generateSignature.js`

- Simulates hashing input to generate a signature
- Use merchant info or transaction string

### `/utils/mockLedger.js`

- Export an array or in-memory object to simulate blockchain
- Functions:

  - `addLedgerEntry(entry)`
  - `getEntryById(id)`
  - `getLatestEntry(type)`

---

## 🎨 4. 🖼️ UX Touches (Optional but Polished)

- Status chips: ✅ Verified / ⚠️ Needs review
- Copyable GOSEL ID
- Ledger viewer with syntax highlighting (`<pre><code>`)
- Animated fallback transitions (e.g., “Routing failed → retrying…”)

---

# 🚀 SkillBridge Assignment

A full-stack role-based training & attendance management system built using:

- ⚡ Next.js (Frontend)
- 🔐 Clerk Authentication
- 🟢 Node.js + Express (Backend)
- 🐘 PostgreSQL (Neon DB)
- 🎨 Tailwind CSS

---

## 📌 Features

### 🔐 Authentication
- Clerk-based login & signup
- Secure protected routes using middleware

### 👥 Role-Based Access
Users can select roles:
- Student
- Trainer
- Institution
- Programme Manager
- Monitoring Officer

---

## 🏫 Institution
- Create batches
- Assign trainers to batches
- View batch summary

---

## 👨‍🏫 Trainer
- View assigned batches
- Create sessions per batch
- Generate invite links

---

## 🎓 Student
- Join batch using invite link (`/join/:id`)
- View ONLY enrolled batch sessions
- Mark attendance

---

## 📊 Manager & Officer
- View aggregated summaries
- Monitoring dashboards

---

## 🔗 Invite Flow
Trainer generates link:
http://localhost:3000/join/:batchId

Student:
- Opens link
- Clicks "Join Batch"
- Gets added to DB

---

## 🗄️ Database Schema

Tables implemented:

- `users`
- `batches`
- `batch_trainers`
- `batch_students`
- `sessions`
- `attendance`

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo
```bash
git clone <your-repo-url>
cd skillbridge-assignment
```
--- 

## 2️⃣ Backend Setup

cd submission/backend
npm install

## Create .env file:
DATABASE_URL=your_neon_database_url

## Run Backend:
node index.js

---

## 3️⃣ Frontend Setup
cd ../frontend
npm install
npm run dev

## Backend .env
DATABASE_URL=postgresql://...

## Frontend (.env.local)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key 

--- 

## 🧠 Key Design Decisions
Role stored in DB + localStorage
Middleware protects dashboard routes
Backend enforces role-based APIs
Student sessions filtered by batch membership

--- 

## ⚠️ Notes
Role is selected AFTER login (can be extended to signup flow)
Uses Neon serverless PostgreSQL
No ORM used (raw SQL for clarity)

---

## 🚀 Future Improvements
Role selection during signup
UI improvements for dashboards
Attendance status tracking (present/absent)
Multi-institution support
Pagination for sessions

---

## 🧪 Test Flow
Sign up using Clerk
Select role
Institution creates batch
Assign trainer
Trainer generates invite
Student joins batch
Student views sessions & marks attendance

---

## 📦 Tech Stack 
| Layer    | Tech           |
| -------- | -------------- |
| Frontend | Next.js        |
| Auth     | Clerk          |
| Backend  | Node + Express |
| Database | PostgreSQL     |
| Hosting  | Local          |

---

## 🙌 Author

Samiksha Singh
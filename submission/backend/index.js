const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= ROLE CHECK ================= */
const checkRole = (roles) => (req, res, next) => {
  const role = req.headers.role;
  if (!role || !roles.includes(role)) {
    return res.status(403).send("Forbidden");
  }
  next();
};

/* ================= SAVE ROLE ================= */
app.post("/save-role", async (req, res) => {
  const { userId, email, role } = req.body;

  try {
    await pool.query(
      `INSERT INTO users (clerk_user_id, email, role)
       VALUES ($1,$2,$3)
       ON CONFLICT (clerk_user_id)
       DO UPDATE SET role = EXCLUDED.role`,
      [userId, email, role]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving role");
  }
});

/* ================= CREATE BATCH ================= */
app.post("/batches", checkRole(["institution"]), async (req, res) => {
  const { name, institutionId } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO batches (name, institution_id)
       VALUES ($1,$2) RETURNING *`,
      [name, institutionId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating batch");
  }
});

/* ================= ASSIGN TRAINER ================= */
app.post("/batches/:id/assign-trainer", checkRole(["institution"]), async (req, res) => {
  const batchId = req.params.id;
  const { trainerId } = req.body;

  try {
    await pool.query(
      `INSERT INTO batch_trainers (batch_id, trainer_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [batchId, trainerId]
    );

    res.json({ message: "Trainer assigned" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error assigning trainer");
  }
});

/* ================= TRAINER BATCHES ================= */
app.get("/trainer/batches/:trainerId", checkRole(["trainer"]), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.* FROM batches b
       JOIN batch_trainers bt ON b.id = bt.batch_id
       WHERE bt.trainer_id = $1`,
      [req.params.trainerId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching batches");
  }
});

/* ================= INVITE ================= */
app.post("/batches/:id/invite", checkRole(["trainer"]), (req, res) => {
  const link = `http://localhost:3000/join/${req.params.id}`;
  res.json({ link });
});

/* ================= JOIN ================= */
app.post("/batches/:id/join", checkRole(["student"]), async (req, res) => {
  const { userId, email } = req.body;

  try {
    await pool.query(
      `INSERT INTO batch_students (batch_id, student_id, email)
       VALUES ($1,$2,$3)
       ON CONFLICT DO NOTHING`,
      [req.params.id, userId, email]
    );

    res.json({ message: "Joined batch" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error joining");
  }
});

/* ================= CREATE SESSION ================= */
app.post("/sessions", checkRole(["trainer"]), async (req, res) => {
  const { title, batchId, trainerId } = req.body;

  try {
    // ✅ Check trainer is assigned to this batch
    const check = await pool.query(
      `SELECT * FROM batch_trainers
       WHERE batch_id=$1 AND trainer_id=$2`,
      [batchId, trainerId]
    );

    if (check.rows.length === 0) {
      return res.status(403).send("Trainer not assigned to this batch");
    }

    const result = await pool.query(
      `INSERT INTO sessions (title, batch_id)
       VALUES ($1,$2) RETURNING *`,
      [title, batchId]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating session");
  }
});

/* ================= GET SESSIONS ================= */
app.get("/sessions/:batchId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sessions WHERE batch_id=$1",
      [req.params.batchId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching sessions");
  }
});

/* ================= ATTENDANCE ================= */
app.post("/attendance/mark", checkRole(["student"]), async (req, res) => {
  const { sessionId, userId } = req.body;

  try {
    await pool.query(
      `INSERT INTO attendance (session_id, student_id, status)
       VALUES ($1,$2,$3)`,
      [sessionId, userId, "present"]
    );

    res.send("Attendance marked");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error marking attendance");
  }
});

/* ================= START ================= */
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
/* ================= STUDENT SESSIONS ================= */
app.get("/student/sessions/:studentId", checkRole(["student"]), async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // 🔹 Step 1: get all batches joined by student
    const batchRes = await pool.query(
      "SELECT batch_id FROM batch_students WHERE student_id = $1",
      [studentId]
    );

    const batchIds = batchRes.rows.map((b) => b.batch_id);

    if (batchIds.length === 0) {
      return res.json([]); // no batches → no sessions
    }

    // 🔹 Step 2: fetch sessions from those batches
    const sessionRes = await pool.query(
      "SELECT * FROM sessions WHERE batch_id = ANY($1)",
      [batchIds]
    );

    res.json(sessionRes.rows);

  } catch (err) {
    console.error("❌ Student sessions error:", err);
    res.status(500).send("Error fetching student sessions");
  }
});
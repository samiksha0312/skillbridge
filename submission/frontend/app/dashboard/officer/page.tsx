"use client";

import { useEffect, useState } from "react";
import BackButton from "@/app/components/BackButton";
import LogoutButton from "@/app/components/LogoutButton";
import { useUser } from "@clerk/nextjs";

const BASE_URL = "https://skillbridge-backend-ocxy.onrender.com";

export default function StudentDashboard() {
  const { user } = useUser();

  const [sessions, setSessions] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<number | null>(null);

  /* ================= LOAD SESSIONS ================= */
  useEffect(() => {
    if (!user) return;

    const r = localStorage.getItem("role") || "";
    setRole(r);

    fetch(`${BASE_URL}/student/sessions/${user.id}`, {
      headers: { role: r },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setSessions)
      .catch((err) => {
        console.error(err);
        alert("❌ Error loading sessions");
      })
      .finally(() => setLoading(false));
  }, [user]);

  /* ================= MARK ATTENDANCE ================= */
  const markAttendance = async (id: number) => {
    try {
      setMarkingId(id);

      const res = await fetch(`${BASE_URL}/attendance/mark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          role,
        },
        body: JSON.stringify({
          sessionId: id,
          userId: user?.id,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      alert("✅ Attendance marked");

    } catch (err) {
      console.error(err);
      alert("❌ Error marking attendance");
    } finally {
      setMarkingId(null);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <BackButton />
        <LogoutButton />
      </div>

      <h1 className="text-3xl font-bold">🎓 Student Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : sessions.length === 0 ? (
        <p>No sessions available (join a batch first)</p>
      ) : (
        sessions.map((s) => (
          <div key={s.id} className="glass p-4 flex justify-between">
            <span>{s.title}</span>

            <button
              className="btn"
              onClick={() => markAttendance(s.id)}
              disabled={markingId === s.id}
            >
              {markingId === s.id ? "Marking..." : "Mark"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import BackButton from "@/app/components/BackButton";
import LogoutButton from "@/app/components/LogoutButton";
import { useUser } from "@clerk/nextjs";

/* ✅ YOUR DEPLOYED BACKEND URL */
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

    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);

    const loadSessions = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/student/sessions/${user.id}`,
          {
            headers: { role: storedRole },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch sessions");

        const data = await res.json();
        setSessions(data);

      } catch (err) {
        console.error(err);
        alert("❌ Error loading sessions");
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
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

      if (!res.ok) throw new Error("Failed to mark attendance");

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

      {/* 🔙 BACK + LOGOUT */}
      <div className="flex justify-between items-center">
        <BackButton />
        <LogoutButton />
      </div>

      {/* 🎓 TITLE */}
      <h1 className="text-3xl font-bold">
        Student Dashboard 🎓
      </h1>

      {/* 📦 CONTENT */}
      {loading ? (
        <p>Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p>No sessions available (join a batch first)</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="glass p-4 flex justify-between items-center"
            >
              <span>{s.title}</span>

              <button
                className="btn"
                onClick={() => markAttendance(s.id)}
                disabled={markingId === s.id}
              >
                {markingId === s.id ? "Marking..." : "Mark"}
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
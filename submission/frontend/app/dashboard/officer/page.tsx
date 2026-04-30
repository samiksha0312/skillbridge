"use client";

import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const r = localStorage.getItem("role") || "";
      setRole(r);

      fetch("http://localhost:5000/sessions", {
        headers: { role: r },
      })
        .then((res) => res.json())
        .then(setSessions)
        .catch(console.error);
    }
  }, []);

  const markAttendance = async (id: number) => {
    try {
      await fetch("http://localhost:5000/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          role,
        },
        body: JSON.stringify({
          sessionId: id,
          userId: "student1",
        }),
      });

      alert("Attendance marked");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">🎓 Student Dashboard</h1>

      {sessions.map((s) => (
        <div key={s.id} className="glass p-4 flex justify-between">
          <span>{s.title}</span>
          <button className="btn" onClick={() => markAttendance(s.id)}>
            Mark
          </button>
        </div>
      ))}
    </div>
  );
}
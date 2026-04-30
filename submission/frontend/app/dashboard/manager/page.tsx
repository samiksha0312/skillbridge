"use client";

import { useEffect, useState } from "react";
import BackButton from "@/app/components/BackButton";
import LogoutButton from "@/app/components/LogoutButton";

export default function ManagerDashboard() {
  const [data, setData] = useState<any>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);

    const loadData = async () => {
      try {
        const res = await fetch(
          "https://skillbridge-backend-ocxy.onrender.com/institutions/1/summary",
          {
            headers: { role: storedRole },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch summary");

        const result = await res.json();
        setData(result);

      } catch (err) {
        console.error(err);
        alert("❌ Error loading manager data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-6">

      {/* 🔙 BACK + LOGOUT */}
      <div className="flex justify-between items-center">
        <BackButton />
        <LogoutButton />
      </div>

      {/* 📊 TITLE */}
      <h1 className="text-3xl font-bold">
        Manager Dashboard 📊
      </h1>

      {/* 📦 DATA CARD */}
      <div className="glass p-6">

        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <div className="space-y-2">
            <p>Total Sessions: {data.totalSessions}</p>
            <p>Total Attendance: {data.totalAttendance}</p>
          </div>
        ) : (
          <p>No data available</p>
        )}

      </div>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import BackButton from "@/app/components/BackButton";
import LogoutButton from "@/app/components/LogoutButton";
import { useUser } from "@clerk/nextjs";

export default function TrainerDashboard() {
  const { user } = useUser();

  const [batches, setBatches] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD BATCHES ================= */
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/trainer/batches/${user.id}`, {
      headers: { role: "trainer" },
    })
      .then((res) => res.json())
      .then(setBatches)
      .catch(console.error);
  }, [user]);

  /* ================= LOAD SESSIONS ================= */
  const loadSessions = async (batchId: number) => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/sessions/${batchId}`
      );

      const data = await res.json();
      setSessions(data);
      setSelectedBatch(batchId);

    } catch (err) {
      console.error(err);
      alert("Error loading sessions");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE SESSION ================= */
  const createSession = async () => {
    if (!title || !selectedBatch) {
      return alert("Select batch and enter title");
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          role: "trainer",
        },
        body: JSON.stringify({
          title,
          batchId: selectedBatch,
          trainerId: user?.id, // ✅ FIXED
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      setTitle("");
      loadSessions(selectedBatch);

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error creating session");
    } finally {
      setLoading(false);
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

      <h1 className="text-3xl font-bold">Trainer Dashboard</h1>

      {/* SELECT BATCH */}
      <div className="glass p-4">
        <h2 className="mb-2 font-semibold">Select Batch</h2>

        <select
          className="input"
          onChange={(e) => loadSessions(Number(e.target.value))}
        >
          <option value="">Select Batch</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* CREATE SESSION */}
      <div className="glass p-4">
        <h2 className="mb-2 font-semibold">Create Session</h2>

        <input
          className="input mb-3"
          value={title}
          placeholder="Session Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="btn"
          onClick={createSession}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Session"}
        </button>
      </div>

      {/* SESSION LIST */}
      <div className="glass p-4">
        <h2 className="mb-2 font-semibold">Sessions</h2>

        {loading ? (
          <p>Loading...</p>
        ) : sessions.length === 0 ? (
          <p>No sessions found</p>
        ) : (
          sessions.map((s) => (
            <p key={s.id}>{s.title}</p>
          ))
        )}
      </div>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import BackButton from "@/app/components/BackButton";
import LogoutButton from "@/app/components/LogoutButton";
import { useUser } from "@clerk/nextjs";

const BASE_URL = "https://skillbridge-backend-ocxy.onrender.com";

export default function TrainerDashboard() {
  const { user } = useUser();

  const [batches, setBatches] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetch(`${BASE_URL}/trainer/batches/${user.id}`, {
      headers: { role: "trainer" },
    })
      .then((res) => res.json())
      .then(setBatches)
      .catch(console.error);
  }, [user]);

  const loadSessions = async (batchId: number) => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/sessions/${batchId}`);
      const data = await res.json();

      setSessions(data);
      setSelectedBatch(batchId);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async () => {
    if (!title || !selectedBatch) {
      return alert("Select batch and enter title");
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          role: "trainer",
        },
        body: JSON.stringify({
          title,
          batchId: selectedBatch,
          trainerId: user?.id,
        }),
      });

      if (!res.ok) throw new Error();

      setTitle("");
      loadSessions(selectedBatch);

    } catch {
      alert("Error creating session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <BackButton />
        <LogoutButton />
      </div>

      <h1 className="text-3xl font-bold">Trainer Dashboard</h1>

      <div className="glass p-4">
        <select
          className="input"
          onChange={(e) => loadSessions(Number(e.target.value))}
        >
          <option>Select Batch</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="glass p-4">
        <input
          className="input mb-3"
          value={title}
          placeholder="Session Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <button className="btn" onClick={createSession}>
          Create Session
        </button>
      </div>

      <div className="glass p-4">
        {sessions.map((s) => (
          <p key={s.id}>{s.title}</p>
        ))}
      </div>
    </div>
  );
}
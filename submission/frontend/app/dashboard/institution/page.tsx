"use client";

import { useState } from "react";
import BackButton from "@/app/components/BackButton";
import LogoutButton from "@/app/components/LogoutButton";
import { useUser } from "@clerk/nextjs";

export default function InstitutionDashboard() {
  const [batchName, setBatchName] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const { user } = useUser();

  const createBatch = async () => {
    const res = await fetch("http://localhost:5000/batches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        role: "institution",
      },
      body: JSON.stringify({
        name: batchName,
        institutionId: user?.id,
      }),
    });

    const batch = await res.json();

    // assign trainer
    await fetch(
      `http://localhost:5000/batches/${batch.id}/assign-trainer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          role: "institution",
        },
        body: JSON.stringify({ trainerId }),
      }
    );

    alert("Batch + Trainer assigned");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <BackButton />
        <LogoutButton />
      </div>

      <h1 className="text-3xl font-bold">Institution Dashboard</h1>

      <input
        className="input"
        placeholder="Batch Name"
        value={batchName}
        onChange={(e) => setBatchName(e.target.value)}
      />

      <input
        className="input"
        placeholder="Trainer ID"
        value={trainerId}
        onChange={(e) => setTrainerId(e.target.value)}
      />

      <button className="btn" onClick={createBatch}>
        Create Batch
      </button>
    </div>
  );
}
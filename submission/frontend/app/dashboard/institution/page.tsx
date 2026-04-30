"use client";

import { useState } from "react";
import BackButton from "@/app/components/BackButton";
import LogoutButton from "@/app/components/LogoutButton";
import { useUser } from "@clerk/nextjs";

/* ✅ YOUR DEPLOYED BACKEND URL */
const BASE_URL = "https://skillbridge-backend-ocxy.onrender.com";

export default function InstitutionDashboard() {
  const [batchName, setBatchName] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const { user } = useUser();

  const createBatch = async () => {
    try {
      if (!batchName || !trainerId) {
        alert("Please fill all fields");
        return;
      }

      /* 🔹 CREATE BATCH */
      const res = await fetch(`${BASE_URL}/batches`, {
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

      if (!res.ok) throw new Error("Failed to create batch");

      const batch = await res.json();

      /* 🔹 ASSIGN TRAINER */
      const assignRes = await fetch(
        `${BASE_URL}/batches/${batch.id}/assign-trainer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            role: "institution",
          },
          body: JSON.stringify({ trainerId }),
        }
      );

      if (!assignRes.ok) throw new Error("Failed to assign trainer");

      alert("✅ Batch created & trainer assigned");

      /* ✅ Reset fields */
      setBatchName("");
      setTrainerId("");

    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    }
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
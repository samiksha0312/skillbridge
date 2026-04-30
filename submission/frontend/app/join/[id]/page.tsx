"use client";

import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import BackButton from "@/app/components/BackButton";

export default function JoinPage() {
  const { id } = useParams();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleJoin = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/batches/${id}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            role: "student", // ✅ REQUIRED
          },
          body: JSON.stringify({
            userId: user?.id,
            email: user?.primaryEmailAddress?.emailAddress,
          }),
        }
      );

      if (!res.ok) throw new Error("Join failed");

      setJoined(true);

    } catch (err) {
      console.error(err);
      alert("❌ Failed to join batch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">

      <div className="absolute top-6 left-6">
        <BackButton />
      </div>

      <div className="glass p-10 w-96 text-center space-y-4">

        <h1 className="text-2xl font-semibold">
          Join Batch #{id}
        </h1>

        {joined ? (
          <p className="text-green-400">
            ✅ Successfully joined!
          </p>
        ) : (
          <button
            onClick={handleJoin}
            className="btn w-full"
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Batch"}
          </button>
        )}

      </div>
    </div>
  );
}
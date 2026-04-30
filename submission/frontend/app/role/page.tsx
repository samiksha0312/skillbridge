"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import BackButton from "@/app/components/BackButton";

const BASE_URL = "https://skillbridge-backend-ocxy.onrender.com";

export default function RolePage() {
  const [role, setRole] = useState("");
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  /* ✅ Redirect if not logged in */
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  /* ✅ Skip if role already exists */
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      router.push(`/dashboard/${savedRole}`);
    }
  }, [router]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <h2>Loading user...</h2>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!role) return alert("Select role");

    try {
      localStorage.setItem("role", role);

      const res = await fetch(`${BASE_URL}/save-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          role,
        },
        body: JSON.stringify({
          role,
          userId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });

      if (!res.ok) throw new Error("Failed to save role");

      router.push(`/dashboard/${role}`);
    } catch (err) {
      console.error(err);
      alert("❌ Error saving role");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-[#0f172a] to-[#020617]">

      <div className="absolute top-6 left-6">
        <BackButton />
      </div>

      <div className="glass p-10 w-96 text-white shadow-lg rounded-2xl">
        <h2 className="text-2xl mb-6 text-center font-semibold">
          Select Role
        </h2>

        {/* ✅ FIXED DROPDOWN */}
        <select
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="" className="text-gray-400">
            Select role
          </option>
          <option value="student">Student</option>
          <option value="trainer">Trainer</option>
          <option value="institution">Institution</option>
          <option value="manager">Manager</option>
          <option value="officer">Officer</option>
        </select>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:opacity-90 transition"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
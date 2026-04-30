"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import BackButton from "@/app/components/BackButton";

export default function RolePage() {
  const [role, setRole] = useState("");
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  /* ✅ Redirect if not logged in */
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn]);

  /* ✅ Skip if role already exists */
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      router.push(`/dashboard/${savedRole}`);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2>Loading user...</h2>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!role) return alert("Select role");

    try {
      localStorage.setItem("role", role);

      const res = await fetch("http://localhost:5000/save-role", {
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

      if (!res.ok) throw new Error();

      router.push(`/dashboard/${role}`);
    } catch {
      alert("Error saving role");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">

      <div className="absolute top-6 left-6">
        <BackButton />
      </div>

      <div className="glass p-10 w-96">
        <h2 className="text-2xl mb-6 text-center">Select Role</h2>

        <select
          className="input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select role</option>
          <option value="student">Student</option>
          <option value="trainer">Trainer</option>
          <option value="institution">Institution</option>
          <option value="manager">Manager</option>
          <option value="officer">Officer</option>
        </select>

        <button onClick={handleSubmit} className="btn mt-6 w-full">
          Continue →
        </button>
      </div>
    </div>
  );
}
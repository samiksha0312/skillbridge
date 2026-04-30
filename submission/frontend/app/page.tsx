"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center">

      <div className="glass p-12 w-[420px] text-center">

        <h1 className="text-4xl font-bold mb-4">
          🚀 SkillBridge
        </h1>

        <p className="text-gray-400 mb-8">
          Training. Tracking. Growth.
        </p>

        <button
          className="btn mb-4"
          onClick={() => router.push("/sign-in")}
        >
          Login
        </button>

        <button
          className="btn"
          onClick={() => router.push("/sign-up")}
        >
          Create Account
        </button>

      </div>

    </div>
  );
}
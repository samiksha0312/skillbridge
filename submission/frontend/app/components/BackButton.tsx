"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/"); // fallback if no history
    }
  };

  return (
    <button
      onClick={handleBack}
      className="mb-4 text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
    >
      <span>←</span>
      <span>Back</span>
    </button>
  );
}
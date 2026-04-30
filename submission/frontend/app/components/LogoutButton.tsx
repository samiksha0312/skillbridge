"use client";

import { useClerk } from "@clerk/nextjs";

export default function LogoutButton() {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    // Clear saved role
    localStorage.removeItem("role");

    // Sign out and redirect
    await signOut({
      redirectUrl: "/sign-in",
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 transition"
    >
      Sign Out
    </button>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  return (
    <div className="flex justify-between p-4 bg-black/40 backdrop-blur">
      <h2>SkillBridge</h2>

      <div>
        <a href="/role" className="mr-4">Role</a>
        {role && <a href={`/dashboard/${role}`}>Dashboard</a>}
      </div>
    </div>
  );
}
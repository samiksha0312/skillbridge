"use client";

export default function AuthLayout({ children }: any) {
  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-10">
        <div className="glass p-10 w-full h-full flex flex-col justify-end">
          <h1 className="text-3xl font-bold mb-4">
            Your Journey
          </h1>

          <p className="text-gray-400">
            Beautifully framed experience
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">

        {/* ❌ REMOVE glass here */}
        <div className="w-full max-w-md">
          {children}
        </div>

      </div>
    </div>
  );
}
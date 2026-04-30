"use client";

import { SignIn } from "@clerk/nextjs";
import AuthLayout from "@/app/components/AuthLayout";
import BackButton from "@/app/components/BackButton";

export default function SignInPage() {
  return (
    <AuthLayout>
      <div className="glass p-6 w-full max-w-md">
        
        <BackButton />

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-white mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-gray-400 text-sm">
            Login to continue your journey
          </p>
        </div>

        {/* Clerk SignIn */}
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/role"
          appearance={{
            elements: {
              /* Container */
              rootBox: "w-full",
              card: "bg-transparent shadow-none border-none p-0",

              /* 🔥 TEXT FIXES */
              headerTitle: "text-white text-lg font-semibold",
              headerSubtitle: "text-gray-300",

              formFieldLabel: "text-white",

              /* Input */
              formFieldInput:
                "bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500",

              /* Buttons */
              formButtonPrimary:
                "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90",

              socialButtonsBlockButton:
                "bg-white/10 border border-white/20 text-white hover:bg-white/20",

              /* Footer */
              footer: "bg-transparent border-none mt-4",
              footerActionText: "text-gray-300",
              footerActionLink:
                "text-indigo-400 hover:text-indigo-300",
            },
          }}
        />

      </div>
    </AuthLayout>
  );
}
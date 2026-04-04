"use client";
import React, { useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // 🔐 Google Login
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.email) {
        setError("Unable to fetch email from Google account.");
        setLoading(false);
        return;
      }

      // ✅ ENV Emails
      const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
      const allowedEmails = envEmails
        .split(",")
        .map((email) => email.trim().toLowerCase());

      console.log("Logged in as:", user.email);
      console.log("Allowed list:", allowedEmails);

      // ✅ AUTH CHECK
      if (allowedEmails.includes(user.email.toLowerCase())) {
        console.log("Login Successful");

        // ✅ Redirect (NO setTimeout needed now)
        router.replace("/admin");
        return;
      } else {
        await signOut(auth);
        setError(`Access Denied: ${user.email} is not authorized.`);
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Auth Error:", err);

      if (err.code === "auth/operation-not-allowed") {
        setError("Google login is not enabled in Firebase.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Popup closed. Try again.");
      } else {
        setError("Login failed. Check connection.");
      }

      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-stone-200 rounded-3xl p-10 shadow-2xl text-center space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-red-900" size={32} />
          </div>

          <h1 className="text-4xl font-serif text-stone-900 uppercase">
            Clothiva <span className="italic text-stone-500">Admin</span>
          </h1>

          <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold">
            Secure Management Portal
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-900 p-4 rounded-xl text-xs flex items-center gap-3 border border-red-100">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-stone-900 text-white py-5 rounded-2xl text-xs uppercase tracking-[0.2em] font-bold hover:bg-red-900 transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Authenticating...
            </>
          ) : (
            <>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg"
                className="w-5 h-5 bg-white p-0.5 rounded-full"
                alt="Google"
              />
              Continue with Google
            </>
          )}
        </button>

        {/* Footer */}
        <div className="pt-6 border-t border-stone-100 flex items-center justify-center gap-2 text-stone-400">
          <ShieldCheck size={14} />
          <span className="text-[9px] uppercase tracking-widest">
            Authorized Personnel Only
          </span>
        </div>
      </div>
    </main>
  );
}
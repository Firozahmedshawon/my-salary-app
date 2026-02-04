import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // এখানে আপনি আপনার পছন্দমতো পাসওয়ার্ড সেট করতে পারেন
    if (password === "1234") { 
      localStorage.setItem("loggedIn", "true");
      onLogin();
    } else {
      setError("ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-600 px-4">
      <div className="bg-white p-8 rounded-[30px] shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-black text-center text-slate-800 mb-6">লগইন করুন</h2>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="পাসওয়ার্ড দিন"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-100 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition active:scale-95"
          >
            প্রবেশ করুন
          </button>
        </div>
      </div>
    </div>
  );
}


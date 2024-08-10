import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth.login(email, password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-surface rounded shadow-md"
      >
        <h2 className="text-2xl font-bold text-heading mb-4">Admin Login</h2>
        <div className="mb-4">
          <label className="block text-default mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-default rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-default mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-default rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-accent text-contrast rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

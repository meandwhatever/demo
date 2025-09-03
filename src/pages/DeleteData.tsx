import React, { useState } from "react";

export default function DeleteData() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState("");

  // If your backend is on a different origin, set this via .env:
  // VITE_API_BASE_URL=https://your-backend.example.com
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

  async function handleDelete() {
    const ok = window.confirm(
      "This will delete ALL data in the database (tables truncated). Continue?"
    );
    if (!ok) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`/api/delete/all_data`, {
        method: "POST",

      });

      const body = await res.json();

      if (!res.ok) {
        setError(body?.error || "Request failed");
      } else {
        setResult(
          `Deleted data from tables: ${Array.isArray(body.truncatedTables) ? body.truncatedTables.join(", ") : "unknown"}`
        );
      }
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-4">
        <h1 className="text-2xl font-semibold">Delete All Data</h1>
        <p className="text-sm text-gray-600">
          This will truncate all user tables and reset identities, preserving schema and migrations.
        </p>



        <button
          onClick={handleDelete}
          className="w-full py-3 rounded text-white"
          style={{ background: "#dc2626", opacity: loading || token.trim().length === 0 ? 0.6 : 1 }}
        >
          {loading ? "Deleting…" : "DELETE ALL DATA"}
        </button>

        {result && <div className="p-3 rounded bg-green-50 text-green-800 text-sm">{result}</div>}
        {error && <div className="p-3 rounded bg-red-50 text-red-800 text-sm">{error}</div>}
      </div>
    </div>
  );
}

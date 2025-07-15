"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLobbyStore } from "@/lib/realtime/lobbyStore";

export default function JoinLobbyPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const joinLobby = useLobbyStore(s => s.joinLobby);
  const lobby = useLobbyStore(s => s.lobby);
  const router = useRouter();

  const handleJoin = () => {
    if (!name.trim() || !code.trim()) {
      setError("Veuillez entrer un nom et un code de lobby");
      return;
    }
    joinLobby(code.trim().toUpperCase(), name.trim());
  };

  // Rediriger vers le lobby dès qu'il est rejoint
  if (lobby) {
    router.replace(`/lobby/${lobby.code}`);
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Rejoindre un lobby</h1>
        <label className="block mb-2 text-gray-700 font-medium">Code du lobby</label>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 uppercase focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: ABC123"
        />
        <label className="block mb-2 text-gray-700 font-medium">Votre nom</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Bob"
        />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Rejoindre le lobby
        </button>
      </div>
    </div>
  );
} 
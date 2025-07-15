"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLobbyStore } from "@/lib/realtime/lobbyStore";

export default function LobbyPage() {
  const router = useRouter();
  const params = useParams();
  const code = typeof params.code === "string" ? params.code : Array.isArray(params.code) ? params.code[0] : "";

  const lobby = useLobbyStore(s => s.lobby);
  const player = useLobbyStore(s => s.player);
  const setReady = useLobbyStore(s => s.setReady);
  const startGame = useLobbyStore(s => s.startGame);
  const leaveLobby = useLobbyStore(s => s.leaveLobby);

  // Rediriger si pas dans le lobby ou mauvais code
  useEffect(() => {
    if (!lobby || lobby.code !== code) {
      router.replace("/lobby");
    }
  }, [lobby, code, router]);

  // Rediriger vers la page de jeu si la partie a démarré
  useEffect(() => {
    if (lobby && lobby.state === 'playing') {
      router.push(`/game/lobby/${lobby.code}`);
    }
  }, [lobby, router]);

  if (!lobby || !player) return null;

  const isHost = player.isHost;
  const allReady = lobby.players.length > 1 && lobby.players.every(p => p.isReady);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-8 w-full max-w-lg animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl md:text-2xl font-bold">Lobby <span className="text-blue-600">#{lobby.code}</span></h1>
          <button
            onClick={leaveLobby}
            className="text-sm text-gray-500 hover:text-red-600"
          >
            Quitter
          </button>
        </div>
        <div className="mb-4 md:mb-6">
          <div className="text-gray-700 mb-2 text-sm md:text-base">Joueurs ({lobby.players.length})</div>
          <ul className="space-y-2">
            {lobby.players.map(p => (
              <li key={p.id} className="flex items-center gap-2">
                <span className={`font-medium ${p.id === player.id ? 'text-blue-700' : ''}`}>{p.name}</span>
                {p.isHost && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">Hôte</span>}
                {p.isReady && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Prêt</span>}
                {p.id === player.id && <span className="text-xs text-gray-400">(vous)</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4 md:mb-6">
          <div className="text-gray-600 text-sm mb-2">En attente de joueurs...</div>
          {isHost ? (
            <button
              onClick={startGame}
              disabled={!allReady}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Démarrer la partie
            </button>
          ) : (
            <button
              onClick={() => setReady(!player.isReady)}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${player.isReady ? 'bg-gray-400 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {player.isReady ? 'Annuler prêt' : 'Je suis prêt'}
            </button>
          )}
        </div>
        <div className="text-center text-gray-400 text-xs">Partagez ce code avec vos amis pour qu&apos;ils rejoignent le lobby.</div>
      </div>
    </div>
  );
} 
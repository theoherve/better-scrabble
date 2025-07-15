import { Player } from "@/lib/realtime/lobbyTypes";

interface PlayerScoresProps {
  players: Player[];
  scores: { [playerId: string]: number };
  currentTurn: string;
  className?: string;
}

export const PlayerScores = ({ players, scores, currentTurn, className = "" }: PlayerScoresProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {players.map((player) => (
        <div
          key={player.id}
          className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
            player.id === currentTurn
              ? "bg-blue-50 border-2 border-blue-200 shadow-sm"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{player.name}</span>
              {player.isHost && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Hôte
                </span>
              )}
              {player.id === currentTurn && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full animate-pulse">
                  Tour
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600">
              {scores[player.id] || 0}
            </div>
            <div className="text-xs text-gray-500">points</div>
          </div>
        </div>
      ))}
    </div>
  );
}; 
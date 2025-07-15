interface GameStatsProps {
  placedLetters: number;
  remainingLetters: number;
  currentTurn: string;
  isGameOver: boolean;
  className?: string;
}

export const GameStats = ({ 
  placedLetters, 
  remainingLetters, 
  currentTurn, 
  isGameOver,
  className = "" 
}: GameStatsProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{placedLetters}</div>
          <div className="text-xs text-gray-500">Lettres placées</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{remainingLetters}</div>
          <div className="text-xs text-gray-500">Lettres restantes</div>
        </div>
      </div>
      
      {!isGameOver && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700">
              Tour actuel
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {currentTurn}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 
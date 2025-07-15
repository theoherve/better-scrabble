import { WordScore } from "@/lib/dictionary/scoreCalculator";

interface ScoreDetailsProps {
  wordScores: WordScore[];
  className?: string;
}

export const ScoreDetails = ({ wordScores, className = "" }: ScoreDetailsProps) => {
  if (wordScores.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Détails des scores</h3>
      
      <div className="space-y-3">
        {wordScores.map((wordScore, index) => (
          <div key={index} className="border border-gray-200 rounded p-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium text-gray-900">{wordScore.word}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({wordScore.positions.length} lettres)
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {wordScore.finalScore} pts
                </div>
                {wordScore.baseScore !== wordScore.finalScore && (
                  <div className="text-xs text-gray-500">
                    Base: {wordScore.baseScore}
                  </div>
                )}
              </div>
            </div>

            {/* Détails des bonus */}
            {(wordScore.letterMultipliers.some(m => m > 1) || 
              wordScore.wordMultipliers.length > 0 || 
              wordScore.word.length >= 7) && (
              <div className="text-xs text-gray-600 space-y-1">
                {wordScore.letterMultipliers.map((multiplier, i) => {
                  if (multiplier > 1) {
                    return (
                      <div key={i} className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                        <span>Lettre {i + 1}: x{multiplier}</span>
                      </div>
                    );
                  }
                  return null;
                })}
                
                {wordScore.wordMultipliers.map((multiplier, i) => (
                  <div key={`word-${i}`} className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                    <span>Mot: x{multiplier}</span>
                  </div>
                ))}
                
                {wordScore.word.length >= 7 && (
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <span>Bingo (+50 points)</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Légende */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Légende</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
            <span>Lettre x2/x3</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
            <span>Mot x2/x3</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
            <span>Bingo (7+ lettres)</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 
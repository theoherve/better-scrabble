import { WordValidationResult } from "@/lib/dictionary/wordValidator";

interface WordDebugProps {
  validation: WordValidationResult;
  isVisible?: boolean;
  className?: string;
}

export const WordDebug = ({ validation, isVisible = false, className = "" }: WordDebugProps) => {
  if (!isVisible) return null;

  return (
    <div className={`bg-gray-100 border border-gray-300 rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Debug - Mots détectés</h4>
      <div className="space-y-2 text-xs">
        {validation.words.length === 0 ? (
          <p className="text-gray-500">Aucun mot détecté</p>
        ) : (
          validation.words.map((word, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className={`font-mono ${word.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {word.word}
              </span>
              <span className="text-gray-500">({word.direction})</span>
              <span className="text-gray-400">
                {word.isValid ? '✅' : '❌'}
              </span>
              <span className="text-blue-600 font-medium">
                {word.score} pts
              </span>
            </div>
          ))
        )}
        <div className="pt-2 border-t border-gray-300">
          <p className="text-sm font-medium">
            Total: {validation.totalScore} points | 
            Valide: {validation.isValid ? '✅' : '❌'}
          </p>
          {validation.errors.length > 0 && (
            <div className="mt-1">
              <p className="text-red-600 text-xs">Erreurs:</p>
              {validation.errors.map((error, index) => (
                <p key={index} className="text-red-500 text-xs">• {error}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
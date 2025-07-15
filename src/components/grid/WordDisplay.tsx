import { WordInfo } from "@/lib/dictionary/wordValidator";

interface WordDisplayProps {
  words: WordInfo[];
  totalScore: number;
  className?: string;
}

export const WordDisplay = ({ words, totalScore, className = "" }: WordDisplayProps) => {
  if (words.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <p className="text-gray-500 text-sm text-center">
          Aucun mot formé pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Mots formés</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{totalScore}</div>
          <div className="text-xs text-gray-500">points</div>
        </div>
      </div>

      <div className="space-y-2">
        {words.map((word, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-2 rounded ${
              word.isValid 
                ? "bg-green-50 border border-green-200" 
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                word.isValid ? "text-green-800" : "text-red-800"
              }`}>
                {word.word}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                word.direction === 'horizontal' 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-purple-100 text-purple-700"
              }`}>
                {word.direction === 'horizontal' ? 'H' : 'V'}
              </span>
              {!word.isValid && (
                <span className="text-xs text-red-600">
                  ❌
                </span>
              )}
            </div>
            <div className="text-sm font-medium text-gray-700">
              {word.score} pts
            </div>
          </div>
        ))}
      </div>

      {words.some(word => !word.isValid) && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">
            <strong>Attention :</strong> Certains mots ne sont pas valides dans le dictionnaire.
          </p>
        </div>
      )}
    </div>
  );
}; 
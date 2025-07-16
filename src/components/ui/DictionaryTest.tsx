import { useState } from "react";
import { isValidWord, getDictionarySize } from "@/lib/dictionary/dictionary";

interface DictionaryTestProps {
  isVisible?: boolean;
  className?: string;
}

export const DictionaryTest = ({ isVisible = false, className = "" }: DictionaryTestProps) => {
  const [testWord, setTestWord] = useState("");
  const [testedWord, setTestedWord] = useState("");
  const [testResults, setTestResults] = useState<{
    isValid: boolean;
    dictionarySize: number;
  } | null>(null);

  const handleTestWord = () => {
    if (testWord.trim()) {
      const isValid = isValidWord(testWord);
      const dictionarySize = getDictionarySize();
      setTestedWord(testWord);
      setTestResults({
        isValid,
        dictionarySize
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTestWord();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`bg-blue-50 border border-blue-300 rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-blue-700 mb-3">Test du Dictionnaire</h4>
      <div className="space-y-3">
        {/* Test de mot */}
        <div>
          <label className="block text-xs font-medium text-blue-600 mb-1">
            Tester un mot:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={testWord}
              onChange={(e) => setTestWord(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-2 py-1 text-xs border border-blue-300 rounded"
              placeholder="Entrez un mot..."
            />
            <button
              onClick={handleTestWord}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Tester
            </button>
          </div>
        </div>
        {/* Résultats */}
        {testResults && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="text-xs space-y-2">
              <p className="font-medium text-blue-700">
                Taille du dictionnaire: {testResults.dictionarySize} mots
              </p>
              {testedWord && (
                <p className={`font-medium ${testResults.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  &quot;{testedWord}&quot; est {testResults.isValid ? 'valide' : 'invalide'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 
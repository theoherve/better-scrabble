import { useState, useEffect } from 'react';

interface WordContestProps {
  isOpen: boolean;
  onClose: () => void;
  onContest: (isValid: boolean) => void;
  contestedWord: string;
  timeoutSeconds: number;
  challengerName: string;
}

export const WordContest = ({
  isOpen,
  onClose,
  onContest,
  contestedWord,
  timeoutSeconds,
  challengerName
}: WordContestProps) => {
  const [timeLeft, setTimeLeft] = useState(timeoutSeconds);
  const [hasResponded, setHasResponded] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timeout - mot considéré comme valide
          if (!hasResponded) {
            setHasResponded(true);
            onContest(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, hasResponded, onContest]);

  const handleResponse = async (isValid: boolean) => {
    if (hasResponded) return;
    setHasResponded(true);
    setIsValidating(true);

    // Simuler une vérification dans le dictionnaire
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsValidating(false);
    onContest(isValid);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Contestation de mot
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">{challengerName}</span> conteste le mot :
          </p>
          <p className="text-lg font-bold text-blue-600 mb-4">
            "{contestedWord}"
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm font-medium text-yellow-800">Temps restant :</span>
              <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-yellow-800'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="w-full bg-yellow-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / timeoutSeconds) * 100}%` }}
              />
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              Si aucun joueur ne répond, le mot sera considéré comme valide
            </p>
          </div>
        </div>

        {isValidating ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Vérification en cours...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => handleResponse(true)}
              disabled={hasResponded}
              className={`
                w-full py-3 px-4 rounded-lg font-medium transition-colors
                ${hasResponded
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
                }
              `}
            >
              ✓ Mot valide
            </button>
            
            <button
              onClick={() => handleResponse(false)}
              disabled={hasResponded}
              className={`
                w-full py-3 px-4 rounded-lg font-medium transition-colors
                ${hasResponded
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
                }
              `}
            >
              ✗ Mot invalide
            </button>
          </div>
        )}

        {hasResponded && !isValidating && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Réponse enregistrée
            </p>
          </div>
        )}

        {timeLeft === 0 && !hasResponded && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-sm text-red-600">
              Temps écoulé - Le mot est considéré comme valide
            </p>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>• Mot invalide : Le joueur reprend ses lettres (0 point)</p>
          <p>• Contestation incorrecte : -10 points au contestataire</p>
        </div>
      </div>
    </div>
  );
}; 
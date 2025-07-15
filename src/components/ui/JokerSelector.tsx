import { useState } from 'react';

interface JokerSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLetter: (letter: string) => void;
  availableLetters?: string[];
}

export const JokerSelector = ({
  isOpen,
  onClose,
  onSelectLetter,
  availableLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
}: JokerSelectorProps) => {
  const [selectedLetter, setSelectedLetter] = useState<string>('');

  const handleConfirm = () => {
    if (selectedLetter) {
      onSelectLetter(selectedLetter);
      setSelectedLetter('');
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedLetter('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Choisissez une lettre pour le joker
        </h3>
        
        <div className="grid grid-cols-7 gap-2 mb-6 max-h-60 overflow-y-auto">
          {availableLetters.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`
                w-10 h-10 rounded border-2 font-bold text-lg transition-colors
                ${selectedLetter === letter
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                }
              `}
              aria-label={`Sélectionner la lettre ${letter}`}
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedLetter}
            className={`
              px-4 py-2 rounded transition-colors
              ${selectedLetter
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}; 
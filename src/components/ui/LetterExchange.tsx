import { useState } from 'react';
import { Letter } from '@/lib/dictionary/letters';

interface LetterExchangeProps {
  isOpen: boolean;
  onClose: () => void;
  onExchange: (letterIds: string[]) => void;
  playerRack: Letter[];
  maxExchangeCount: number;
}

export const LetterExchange = ({
  isOpen,
  onClose,
  onExchange,
  playerRack,
  maxExchangeCount
}: LetterExchangeProps) => {
  const [selectedLetters, setSelectedLetters] = useState<Set<string>>(new Set());

  const handleLetterToggle = (letterId: string) => {
    const newSelected = new Set(selectedLetters);
    if (newSelected.has(letterId)) {
      newSelected.delete(letterId);
    } else if (newSelected.size < maxExchangeCount) {
      newSelected.add(letterId);
    }
    setSelectedLetters(newSelected);
  };

  const handleConfirm = () => {
    if (selectedLetters.size > 0) {
      onExchange(Array.from(selectedLetters));
      setSelectedLetters(new Set());
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedLetters(new Set());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Échanger des lettres
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 text-center">
          Sélectionnez jusqu'à {maxExchangeCount} lettres à échanger
        </p>

        <div className="grid grid-cols-7 gap-2 mb-6 max-h-60 overflow-y-auto">
          {playerRack.map((letter) => (
            <button
              key={letter.id}
              onClick={() => handleLetterToggle(letter.id)}
              className={`
                w-10 h-10 rounded border-2 font-bold text-lg transition-colors relative
                ${selectedLetters.has(letter.id)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                }
                ${letter.letter === ' ' ? 'bg-yellow-100 border-yellow-300' : ''}
              `}
              aria-label={`Sélectionner ${letter.letter === ' ' ? 'joker' : `la lettre ${letter.letter}`}`}
            >
              {letter.letter === ' ' ? '★' : letter.letter}
              {letter.score > 0 && (
                <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full w-4 h-4 flex items-center justify-center border border-gray-300">
                  {letter.score}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            {selectedLetters.size} lettre{selectedLetters.size > 1 ? 's' : ''} sélectionnée{selectedLetters.size > 1 ? 's' : ''}
          </span>
          <span className="text-sm text-gray-600">
            {maxExchangeCount - selectedLetters.size} restante{maxExchangeCount - selectedLetters.size > 1 ? 's' : ''}
          </span>
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
            disabled={selectedLetters.size === 0}
            className={`
              px-4 py-2 rounded transition-colors
              ${selectedLetters.size > 0
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Échanger ({selectedLetters.size})
          </button>
        </div>
      </div>
    </div>
  );
}; 
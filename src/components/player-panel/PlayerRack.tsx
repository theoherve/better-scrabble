import { Tile } from "../tile/Tile";
import { Letter } from "@/lib/dictionary/letters";

export type PlayerLetter = Letter;

interface PlayerRackProps {
  letters: PlayerLetter[];
  selectedLetterId?: string;
  onLetterClick?: (letterId: string) => void;
  onJokerSelect?: (letterId: string) => void;
  className?: string;
  isMyTurn?: boolean;
  showActions?: boolean;
  onPassTurn?: () => void;
  onExchangeLetters?: () => void;
  onChallengeWord?: () => void;
  canExchange?: boolean;
  canChallenge?: boolean;
}

export const PlayerRack = ({
  letters,
  selectedLetterId,
  onLetterClick,
  onJokerSelect,
  className = "",
  isMyTurn = false,
  showActions = false,
  onPassTurn,
  onExchangeLetters,
  onChallengeWord,
  canExchange = true,
  canChallenge = true,
}: PlayerRackProps) => {
  const handleLetterClick = (letterId: string) => {
    const letter = letters.find(l => l.id === letterId);
    if (letter?.letter === ' ') {
      // C'est un joker
      onJokerSelect?.(letterId);
    } else {
      onLetterClick?.(letterId);
    }
  };

  return (
    <div className={`bg-amber-800 p-4 rounded-lg ${className}`}>
      <h3 className="text-white font-medium mb-3">Vos lettres</h3>
      <div className="flex gap-1 justify-center flex-wrap">
        {letters.map((letter) => (
          <Tile
            key={letter.id}
            type="letter"
            letter={letter.letter === ' ' ? '★' : letter.letter}
            score={letter.score}
            isSelected={selectedLetterId === letter.id}
            onClick={() => handleLetterClick(letter.id)}
            className={`
              w-8 h-8 sm:w-10 sm:h-10 cursor-pointer hover:scale-105 active:scale-95 transition-transform
              ${letter.letter === ' ' ? 'bg-yellow-100 border-yellow-300' : ''}
            `}
          />
        ))}
      </div>
      <div className="text-white text-sm text-center mt-2">
        {letters.length}/7 lettres
      </div>

      {/* Actions du joueur */}
      {showActions && isMyTurn && (
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={onPassTurn}
              className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Passer
            </button>
            <button
              onClick={onExchangeLetters}
              disabled={!canExchange}
              className={`
                flex-1 py-2 px-3 rounded text-sm transition-colors
                ${canExchange
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }
              `}
            >
              Échanger
            </button>
          </div>
          {canChallenge && (
            <button
              onClick={onChallengeWord}
              className="w-full bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Contester
            </button>
          )}
        </div>
      )}

      {/* Indicateur de tour */}
      {isMyTurn && (
        <div className="mt-2 text-center">
          <span className="inline-block bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
            Votre tour
          </span>
        </div>
      )}
    </div>
  );
}; 
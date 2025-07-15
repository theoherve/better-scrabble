import Link from "next/link";

interface MobileNavProps {
  onPass?: () => void;
  onNewGame?: () => void;
  onLeave?: () => void;
  onValidateWord?: () => void;
  onCancelWord?: () => void;
  backUrl?: string;
  backLabel?: string;
  isMyTurn?: boolean;
  isPlacingWord?: boolean;
  className?: string;
}

export const MobileNav = ({
  onPass,
  onNewGame,
  onLeave,
  onValidateWord,
  onCancelWord,
  backUrl,
  backLabel = "Retour",
  isMyTurn = false,
  isPlacingWord = false,
  className = ""
}: MobileNavProps) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 md:p-4 z-50 ${className}`}>
      <div className="flex items-center justify-between max-w-md mx-auto text-xs md:text-sm">
        {/* Bouton retour */}
        {backUrl && (
          <Link
            href={backUrl}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">{backLabel}</span>
          </Link>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-1 md:gap-2">
          {isPlacingWord && onValidateWord && (
            <button
              onClick={onValidateWord}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              Valider
            </button>
          )}
          
          {isPlacingWord && onCancelWord && (
            <button
              onClick={onCancelWord}
              className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Annuler
            </button>
          )}
          
          {onPass && (
            <button
              onClick={onPass}
              disabled={!isMyTurn || isPlacingWord}
              className="px-2 py-1 md:px-3 md:py-2 bg-gray-600 text-white text-xs md:text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Passer
            </button>
          )}
          
          {onNewGame && (
            <button
              onClick={onNewGame}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nouvelle
            </button>
          )}
          
          {onLeave && (
            <button
              onClick={onLeave}
              className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Quitter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 
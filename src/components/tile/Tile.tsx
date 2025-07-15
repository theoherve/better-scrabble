

export type TileType = 
  | "empty"
  | "letter"
  | "word-2x"
  | "word-3x"
  | "letter-2x"
  | "letter-3x"
  | "center";

export type TileBonus = {
  type: "word" | "letter";
  multiplier: 2 | 3;
};

interface TileProps {
  type: TileType;
  letter?: string;
  score?: number;
  isSelected?: boolean;
  isPlaced?: boolean;
  isTemporary?: boolean;
  onClick?: () => void;
  className?: string;
}

const getTileBackground = (type: TileType): string => {
  switch (type) {
    case "center":
      return "bg-yellow-400";
    case "word-3x":
      return "bg-red-400";
    case "word-2x":
      return "bg-pink-400";
    case "letter-3x":
      return "bg-blue-400";
    case "letter-2x":
      return "bg-cyan-400";
    case "letter":
      return "bg-amber-100";
    default:
      return "bg-white";
  }
};

const getTileText = (type: TileType): string => {
  switch (type) {
    case "center":
      return "★";
    case "word-3x":
      return "TW";
    case "word-2x":
      return "DW";
    case "letter-3x":
      return "TL";
    case "letter-2x":
      return "DL";
    default:
      return "";
  }
};

const getTileTextColor = (type: TileType): string => {
  switch (type) {
    case "center":
      return "text-yellow-900";
    case "word-3x":
      return "text-red-900";
    case "word-2x":
      return "text-pink-900";
    case "letter-3x":
      return "text-blue-900";
    case "letter-2x":
      return "text-cyan-900";
    default:
      return "text-gray-600";
  }
};

export const Tile = ({
  type,
  letter,
  score,
  isSelected = false,
  isPlaced = false,
  isTemporary = false,
  onClick,
  className = "",
}: TileProps) => {
  const hasLetter = letter && letter !== "";
  const isInteractive = onClick && !isPlaced;

  return (
    <div
      className={`
        w-full h-full aspect-square flex items-center justify-center relative border border-gray-300
        ${getTileBackground(type)}
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}
        ${isInteractive ? "cursor-pointer hover:ring-2 hover:ring-blue-300 active:scale-95 transition-transform" : ""}
        ${isPlaced ? "shadow-md" : ""}
        ${isTemporary ? "border-2 border-dashed border-blue-400 bg-blue-50" : ""}
        ${className}
      `}
      onClick={isInteractive ? onClick : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? "button" : undefined}
      aria-label={isInteractive ? `Placer une lettre sur ${type}` : undefined}
      onKeyDown={isInteractive ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Bonus indicator */}
      {!hasLetter && type !== "empty" && (
        <div className={`
          absolute inset-0 flex items-center justify-center text-[0.6em] md:text-xs font-bold
          ${getTileTextColor(type)}
        `}>
          {getTileText(type)}
        </div>
      )}

      {/* Letter */}
      {hasLetter && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[1em] sm:text-base md:text-lg font-bold text-gray-900 leading-none">
            {letter}
          </div>
          {score && (
            <div className="text-[0.6em] text-gray-600 absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1">
              {score}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 
import { Tile, TileType } from "../tile/Tile";

export type GridPosition = {
  row: number;
  col: number;
};

export type PlacedLetter = {
  letter: string;
  score: number;
  position: GridPosition;
  isTemporary?: boolean;
};

interface GridProps {
  placedLetters: PlacedLetter[];
  selectedPosition?: GridPosition;
  onTileClick?: (position: GridPosition) => void;
  className?: string;
}

// Configuration officielle de la grille Scrabble
const GRID_SIZE = 15;
const CENTER_POSITION = 7; // 0-indexed

const getTileType = (row: number, col: number): TileType => {
  // Centre de la grille
  if (row === CENTER_POSITION && col === CENTER_POSITION) {
    return "center";
  }

  // Cases Word x3 (rouge)
  const word3xPositions = [
    [0, 0], [0, 7], [0, 14],
    [7, 0], [7, 14],
    [14, 0], [14, 7], [14, 14]
  ];
  if (word3xPositions.some(([r, c]) => r === row && c === col)) {
    return "word-3x";
  }

  // Cases Word x2 (rose)
  const word2xPositions = [
    [1, 1], [1, 13], [2, 2], [2, 12], [3, 3], [3, 11], [4, 4], [4, 10],
    [10, 4], [10, 10], [11, 3], [11, 11], [12, 2], [12, 12], [13, 1], [13, 13]
  ];
  if (word2xPositions.some(([r, c]) => r === row && c === col)) {
    return "word-2x";
  }

  // Cases Letter x3 (bleu)
  const letter3xPositions = [
    [1, 5], [1, 9], [5, 1], [5, 5], [5, 9], [5, 13],
    [9, 1], [9, 5], [9, 9], [9, 13], [13, 5], [13, 9]
  ];
  if (letter3xPositions.some(([r, c]) => r === row && c === col)) {
    return "letter-3x";
  }

  // Cases Letter x2 (cyan)
  const letter2xPositions = [
    [0, 3], [0, 11], [2, 6], [2, 8], [3, 0], [3, 7], [3, 14],
    [6, 2], [6, 6], [6, 8], [6, 12], [7, 3], [7, 11],
    [8, 2], [8, 6], [8, 8], [8, 12], [11, 0], [11, 7], [11, 14],
    [12, 6], [12, 8], [14, 3], [14, 11]
  ];
  if (letter2xPositions.some(([r, c]) => r === row && c === col)) {
    return "letter-2x";
  }

  return "empty";
};

const getLetterAtPosition = (
  position: GridPosition,
  placedLetters: PlacedLetter[]
): { letter: string; score: number; isTemporary: boolean } | null => {
  const letter = placedLetters.find(
    (l) => l.position.row === position.row && l.position.col === position.col
  );
  return letter ? { 
    letter: letter.letter, 
    score: letter.score, 
    isTemporary: letter.isTemporary || false 
  } : null;
};

export const Grid = ({
  placedLetters,
  selectedPosition,
  onTileClick,
  className = "",
}: GridProps) => {
  const handleTileClick = (row: number, col: number) => {
    if (onTileClick) {
      onTileClick({ row, col });
    }
  };

  return (
    <div
      className={`w-full max-w-full aspect-square max-h-[80vh] mx-auto ${className}`}
      style={{ touchAction: 'manipulation' }}
    >
      <div className="grid grid-cols-15 grid-rows-15 w-full h-full aspect-square">
        {Array.from({ length: GRID_SIZE }, (_, row) =>
          Array.from({ length: GRID_SIZE }, (_, col) => {
            const position = { row, col };
            const tileType = getTileType(row, col);
            const letterData = getLetterAtPosition(position, placedLetters);
            const isSelected = selectedPosition?.row === row && selectedPosition?.col === col;

            return (
              <div key={`${row}-${col}`} className="w-full h-full aspect-square">
                <Tile
                  type={letterData ? "letter" : tileType}
                  letter={letterData?.letter}
                  score={letterData?.score}
                  isSelected={isSelected}
                  isPlaced={!!letterData}
                  isTemporary={letterData?.isTemporary}
                  onClick={() => handleTileClick(row, col)}
                  className="border-gray-800"
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}; 
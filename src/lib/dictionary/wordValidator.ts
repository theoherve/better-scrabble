import { GridPosition, PlacedLetter } from "@/components/grid/Grid";
import { isValidWord } from "./dictionary";
import { ScoreCalculator, WordScore } from "./scoreCalculator";

export type WordInfo = {
  word: string;
  score: number;
  positions: GridPosition[];
  isValid: boolean;
  direction: "horizontal" | "vertical";
};

export type WordValidationResult = {
  words: WordInfo[];
  totalScore: number;
  isValid: boolean;
  errors: string[];
};

export class WordValidator {
  private static readonly GRID_SIZE = 15;

  /**
   * Valide tous les mots formés sur la grille
   */
  static validateGrid(placedLetters: PlacedLetter[]): WordValidationResult {
    const words: WordInfo[] = [];
    const errors: string[] = [];

    // Extraire les mots horizontaux et verticaux
    const horizontalWords = this.extractHorizontalWords(placedLetters);
    const verticalWords = this.extractVerticalWords(placedLetters);

    // Valider chaque mot et calculer les scores avec bonus
    const allWords = [...horizontalWords, ...verticalWords];
    const wordScores = ScoreCalculator.calculateTotalScore(
      allWords.map((word) => ({ word: word.word, positions: word.positions })),
      placedLetters
    );

    allWords.forEach((wordInfo, index) => {
      const isValid = isValidWord(wordInfo.word);
      const wordScore = wordScores.wordScores[index];

      words.push({
        ...wordInfo,
        isValid,
        score: wordScore.finalScore,
      });

      if (!isValid) {
        errors.push(`"${wordInfo.word}" n'est pas un mot valide`);
      }
    });

    // Utiliser le score total calculé avec bonus
    const totalScore = wordScores.totalScore;
    const isValid = errors.length === 0;

    return {
      words,
      totalScore,
      isValid,
      errors,
    };
  }

  /**
   * Extrait les mots horizontaux de la grille
   */
  private static extractHorizontalWords(
    placedLetters: PlacedLetter[]
  ): WordInfo[] {
    const words: WordInfo[] = [];
    const grid = this.createGridMatrix(placedLetters);

    for (let row = 0; row < this.GRID_SIZE; row++) {
      let currentWord = "";
      let currentPositions: GridPosition[] = [];
      let inWord = false;

      for (let col = 0; col < this.GRID_SIZE; col++) {
        const letter = grid[row][col];

        if (letter) {
          currentWord += letter;
          currentPositions.push({ row, col });
          inWord = true;
        } else {
          // Fin d'un mot
          if (inWord && currentWord.length >= 2) {
            words.push({
              word: currentWord,
              score: 0, // Sera calculé plus tard
              positions: [...currentPositions],
              isValid: false, // Sera validé plus tard
              direction: "horizontal",
            });
          }
          currentWord = "";
          currentPositions = [];
          inWord = false;
        }
      }

      // Vérifier le dernier mot de la ligne
      if (inWord && currentWord.length >= 2) {
        words.push({
          word: currentWord,
          score: 0,
          positions: [...currentPositions],
          isValid: false,
          direction: "horizontal",
        });
      }
    }

    return words;
  }

  /**
   * Extrait les mots verticaux de la grille
   */
  private static extractVerticalWords(
    placedLetters: PlacedLetter[]
  ): WordInfo[] {
    const words: WordInfo[] = [];
    const grid = this.createGridMatrix(placedLetters);

    for (let col = 0; col < this.GRID_SIZE; col++) {
      let currentWord = "";
      let currentPositions: GridPosition[] = [];
      let inWord = false;

      for (let row = 0; row < this.GRID_SIZE; row++) {
        const letter = grid[row][col];

        if (letter) {
          currentWord += letter;
          currentPositions.push({ row, col });
          inWord = true;
        } else {
          // Fin d'un mot
          if (inWord && currentWord.length >= 2) {
            words.push({
              word: currentWord,
              score: 0,
              positions: [...currentPositions],
              isValid: false,
              direction: "vertical",
            });
          }
          currentWord = "";
          currentPositions = [];
          inWord = false;
        }
      }

      // Vérifier le dernier mot de la colonne
      if (inWord && currentWord.length >= 2) {
        words.push({
          word: currentWord,
          score: 0,
          positions: [...currentPositions],
          isValid: false,
          direction: "vertical",
        });
      }
    }

    return words;
  }

  /**
   * Crée une matrice de la grille pour faciliter l'analyse
   */
  private static createGridMatrix(
    placedLetters: PlacedLetter[]
  ): (string | null)[][] {
    const grid: (string | null)[][] = Array(this.GRID_SIZE)
      .fill(null)
      .map(() => Array(this.GRID_SIZE).fill(null));

    placedLetters.forEach((letter) => {
      grid[letter.position.row][letter.position.col] = letter.letter;
    });

    return grid;
  }

  /**
   * Vérifie si un nouveau placement est valide
   */
  static validateNewPlacement(
    newLetter: PlacedLetter,
    existingLetters: PlacedLetter[]
  ): WordValidationResult {
    const allLetters = [...existingLetters, newLetter];
    return this.validateGrid(allLetters);
  }

  /**
   * Vérifie si un placement respecte les règles du Scrabble
   */
  static isValidPlacement(
    position: GridPosition,
    existingLetters: PlacedLetter[],
    isFirstMove: boolean = false
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Vérifier si la position est déjà occupée
    const isOccupied = existingLetters.some(
      (letter) =>
        letter.position.row === position.row &&
        letter.position.col === position.col
    );
    if (isOccupied) {
      errors.push("Cette position est déjà occupée");
    }

    // Pour le premier coup, la lettre doit être placée au centre
    if (isFirstMove && (position.row !== 7 || position.col !== 7)) {
      errors.push("Le premier mot doit passer par le centre de la grille");
    }

    // Vérifier que la lettre est connectée à un mot existant (sauf premier coup)
    if (!isFirstMove && existingLetters.length > 0) {
      const isConnected = this.isConnectedToExistingWord(
        position,
        existingLetters
      );
      if (!isConnected) {
        errors.push("La lettre doit être connectée à un mot existant");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Vérifie si une position est connectée à un mot existant
   */
  private static isConnectedToExistingWord(
    position: GridPosition,
    existingLetters: PlacedLetter[]
  ): boolean {
    const adjacentPositions = [
      { row: position.row - 1, col: position.col },
      { row: position.row + 1, col: position.col },
      { row: position.row, col: position.col - 1 },
      { row: position.row, col: position.col + 1 },
    ];

    return adjacentPositions.some((adjacent) =>
      existingLetters.some(
        (letter) =>
          letter.position.row === adjacent.row &&
          letter.position.col === adjacent.col
      )
    );
  }
}

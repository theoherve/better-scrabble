import { GridPosition, PlacedLetter } from "@/components/grid/Grid";
import { Letter } from "@/lib/dictionary/letters";
import { isValidWord } from "@/lib/dictionary/dictionary";
import { WordValidator } from "@/lib/dictionary/wordValidator";
import { ruleValidator } from "@/lib/gameRules";

export type AIDifficulty = "easy" | "medium" | "hard";

export type AIMove = {
  letter: Letter;
  position: GridPosition;
  word: string;
  score: number;
};

export class SimpleAI {
  private difficulty: AIDifficulty;
  private playerName: string;

  constructor(difficulty: AIDifficulty = "medium", playerName: string = "IA") {
    this.difficulty = difficulty;
    this.playerName = playerName;
  }

  /**
   * Trouve le meilleur coup possible pour l'IA
   */
  findBestMove(
    aiRack: Letter[],
    placedLetters: PlacedLetter[],
    isFirstMove: boolean = false
  ): AIMove | null {
    const possibleMoves: AIMove[] = [];

    // Générer tous les mots possibles avec les lettres disponibles
    const possibleWords = this.generatePossibleWords(aiRack);

    // Pour chaque mot, trouver toutes les positions possibles
    possibleWords.forEach((word) => {
      const positions = this.findValidPositions(
        word,
        placedLetters,
        isFirstMove
      );

      positions.forEach((position) => {
        const move = this.createMove(word, position, aiRack, placedLetters);
        if (move) {
          possibleMoves.push(move);
        }
      });
    });

    if (possibleMoves.length === 0) {
      return null;
    }

    // Trier les coups selon la difficulté
    return this.selectBestMove(possibleMoves);
  }

  /**
   * Génère tous les mots possibles avec les lettres disponibles
   */
  private generatePossibleWords(rack: Letter[]): string[] {
    const words: string[] = [];
    const letters = rack.map((l) => l.letter.toLowerCase());

    // Mots de 2 lettres
    for (let i = 0; i < letters.length; i++) {
      for (let j = i + 1; j < letters.length; j++) {
        const word1 = letters[i] + letters[j];
        const word2 = letters[j] + letters[i];

        if (isValidWord(word1)) words.push(word1);
        if (isValidWord(word2)) words.push(word2);
      }
    }

    // Mots de 3 lettres
    for (let i = 0; i < letters.length; i++) {
      for (let j = i + 1; j < letters.length; j++) {
        for (let k = j + 1; k < letters.length; k++) {
          const permutations = this.getPermutations([
            letters[i],
            letters[j],
            letters[k],
          ]);
          permutations.forEach((word) => {
            if (isValidWord(word)) words.push(word);
          });
        }
      }
    }

    // Mots de 4+ lettres (limité pour les performances)
    if (this.difficulty === "hard") {
      for (let len = 4; len <= Math.min(6, letters.length); len++) {
        const combinations = this.getCombinations(letters, len);
        combinations.forEach((combo) => {
          const permutations = this.getPermutations(combo);
          permutations.forEach((word) => {
            if (isValidWord(word)) words.push(word);
          });
        });
      }
    }

    return [...new Set(words)]; // Supprimer les doublons
  }

  /**
   * Trouve toutes les positions valides pour un mot
   */
  private findValidPositions(
    word: string,
    placedLetters: PlacedLetter[],
    isFirstMove: boolean
  ): GridPosition[] {
    const positions: GridPosition[] = [];

    // Pour le premier coup, seule la position centrale est valide
    if (isFirstMove) {
      if (word.length <= 15) {
        positions.push({ row: 7, col: 7 });
      }
      return positions;
    }

    // Pour les coups suivants, chercher les positions connectées
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        // Vérifier si le mot peut être placé horizontalement
        if (col + word.length <= 15) {
          if (
            this.canPlaceWordHorizontally(word, { row, col }, placedLetters)
          ) {
            positions.push({ row, col });
          }
        }

        // Vérifier si le mot peut être placé verticalement
        if (row + word.length <= 15) {
          if (this.canPlaceWordVertically(word, { row, col }, placedLetters)) {
            positions.push({ row, col });
          }
        }
      }
    }

    return positions;
  }

  /**
   * Vérifie si un mot peut être placé horizontalement
   */
  private canPlaceWordHorizontally(
    word: string,
    startPos: GridPosition,
    placedLetters: PlacedLetter[]
  ): boolean {
    // Générer les positions du mot
    const positions: GridPosition[] = [];
    for (let i = 0; i < word.length; i++) {
      positions.push({ row: startPos.row, col: startPos.col + i });
    }

    // Utiliser le GameRuleValidator pour valider le placement
    const isFirstMove = placedLetters.length === 0;
    const validation = ruleValidator.validateWordPlacement(
      word,
      positions,
      placedLetters,
      isFirstMove
    );

    return validation.isValid;
  }

  /**
   * Vérifie si un mot peut être placé verticalement
   */
  private canPlaceWordVertically(
    word: string,
    startPos: GridPosition,
    placedLetters: PlacedLetter[]
  ): boolean {
    // Générer les positions du mot
    const positions: GridPosition[] = [];
    for (let i = 0; i < word.length; i++) {
      positions.push({ row: startPos.row + i, col: startPos.col });
    }

    // Utiliser le GameRuleValidator pour valider le placement
    const isFirstMove = placedLetters.length === 0;
    const validation = ruleValidator.validateWordPlacement(
      word,
      positions,
      placedLetters,
      isFirstMove
    );

    return validation.isValid;
  }

  /**
   * Crée un coup à partir d'un mot et d'une position
   */
  private createMove(
    word: string,
    position: GridPosition,
    rack: Letter[],
    placedLetters: PlacedLetter[]
  ): AIMove | null {
    // Simuler le placement des lettres
    const newLetters: PlacedLetter[] = [];
    for (let i = 0; i < word.length; i++) {
      const letter = rack.find((l) => l.letter.toLowerCase() === word[i]);
      if (!letter) return null;
      newLetters.push({
        letter: letter.letter,
        score: letter.score,
        position: { row: position.row, col: position.col + i },
      });
    }
    // Grille simulée = lettres déjà posées + lettres du coup
    const simulatedGrid = [...placedLetters, ...newLetters];
    const validation = WordValidator.validateGrid(simulatedGrid);
    if (!validation.isValid) return null;
    // Calculer le score
    const score = validation.totalScore;
    return {
      letter: rack.find((l) => l.letter.toLowerCase() === word[0])!,
      position,
      word,
      score,
    };
  }

  /**
   * Sélectionne le meilleur coup selon la difficulté
   */
  private selectBestMove(moves: AIMove[]): AIMove {
    // Trier par score décroissant
    moves.sort((a, b) => b.score - a.score);

    switch (this.difficulty) {
      case "easy":
        // Choisir un coup aléatoire parmi les 50% meilleurs
        const topHalf = moves.slice(0, Math.ceil(moves.length / 2));
        return topHalf[Math.floor(Math.random() * topHalf.length)];

      case "medium":
        // Choisir un coup aléatoire parmi les 30% meilleurs
        const topThird = moves.slice(0, Math.ceil(moves.length * 0.3));
        return topThird[Math.floor(Math.random() * topThird.length)];

      case "hard":
        // Choisir le meilleur coup
        return moves[0];

      default:
        return moves[0];
    }
  }

  /**
   * Génère toutes les permutations d'un tableau
   */
  private getPermutations(arr: string[]): string[] {
    if (arr.length <= 1) return [arr.join("")];

    const result: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
      const perms = this.getPermutations(remaining);

      perms.forEach((perm) => {
        result.push(current + perm);
      });
    }

    return result;
  }

  /**
   * Génère toutes les combinaisons de k éléments d'un tableau
   */
  private getCombinations(arr: string[], k: number): string[][] {
    if (k === 1) return arr.map((item) => [item]);
    if (k === arr.length) return [arr];

    const result: string[][] = [];
    for (let i = 0; i <= arr.length - k; i++) {
      const head = arr[i];
      const tailCombos = this.getCombinations(arr.slice(i + 1), k - 1);
      tailCombos.forEach((combo) => {
        result.push([head, ...combo]);
      });
    }

    return result;
  }

  /**
   * Change la difficulté de l'IA
   */
  setDifficulty(difficulty: AIDifficulty): void {
    this.difficulty = difficulty;
  }

  /**
   * Obtient le nom de l'IA
   */
  getName(): string {
    return this.playerName;
  }

  /**
   * Obtient la difficulté actuelle
   */
  getDifficulty(): AIDifficulty {
    return this.difficulty;
  }
}

import { GridPosition, PlacedLetter } from "@/components/grid/Grid";
import { PlayerLetter } from "@/components/player-panel/PlayerRack";
import { gameRules } from "@/lib/gameRules";

export type ScoreMultiplier = {
  type: "word" | "letter";
  multiplier: 2 | 3;
};

export type WordScore = {
  word: string;
  baseScore: number;
  letterMultipliers: number[];
  wordMultipliers: number[];
  finalScore: number;
  positions: GridPosition[];
  isBingo: boolean;
};

export class ScoreCalculator {
  private static readonly GRID_SIZE = gameRules.GRID_SIZE;
  private static readonly CENTER_POSITION = Math.floor(gameRules.GRID_SIZE / 2);

  /**
   * Calcule le score d'un mot en tenant compte des bonus
   */
  static calculateWordScore(
    word: string,
    positions: GridPosition[],
    placedLetters: PlacedLetter[]
  ): WordScore {
    const letterScores = this.getLetterScores(word);
    const letterMultipliers = this.getLetterMultipliers(positions);
    const wordMultipliers = this.getWordMultipliers(positions);

    // Vérifier si le mot contient des lettres placées
    console.log(placedLetters);

    // Calculer le score de base avec les multiplicateurs de lettres
    let baseScore = 0;
    for (let i = 0; i < word.length; i++) {
      const letterScore = letterScores[i];
      const letterMultiplier = letterMultipliers[i];
      baseScore += letterScore * letterMultiplier;
    }

    // Appliquer les multiplicateurs de mots
    let finalScore = baseScore;
    wordMultipliers.forEach((multiplier) => {
      finalScore *= multiplier;
    });

    // Vérifier si c'est un bingo (mot de 7 lettres)
    const isBingo = word.length >= 7;

    return {
      word,
      baseScore,
      letterMultipliers,
      wordMultipliers,
      finalScore,
      positions,
      isBingo,
    };
  }

  /**
   * Calcule le score total de tous les mots formés
   */
  static calculateTotalScore(
    words: Array<{ word: string; positions: GridPosition[] }>,
    placedLetters: PlacedLetter[]
  ): { totalScore: number; wordScores: WordScore[]; bingoCount: number } {
    const wordScores = words.map((wordInfo) =>
      this.calculateWordScore(wordInfo.word, wordInfo.positions, placedLetters)
    );

    const totalScore = wordScores.reduce(
      (sum, wordScore) => sum + wordScore.finalScore,
      0
    );

    const bingoCount = wordScores.filter((score) => score.isBingo).length;

    return {
      totalScore,
      wordScores,
      bingoCount,
    };
  }

  /**
   * Calcule les scores finaux selon les règles officielles
   */
  static calculateFinalScores(
    playerScores: { [playerId: string]: number },
    playerRacks: { [playerId: string]: PlayerLetter[] },
    lastPlayerToPlay: string
  ): { scores: { [playerId: string]: number }; reason: string } {
    const finalScores = { ...playerScores };

    // Le joueur qui a terminé reçoit les points des lettres restantes des autres joueurs
    const remainingLettersPoints: { [playerId: string]: number } = {};

    Object.entries(playerRacks).forEach(([playerId, rack]) => {
      if (playerId !== lastPlayerToPlay) {
        const rackPoints = rack.reduce((sum, letter) => sum + letter.score, 0);
        remainingLettersPoints[playerId] = rackPoints;
        finalScores[playerId] -= rackPoints; // Déduire les lettres restantes
      }
    });

    // Ajouter les points des lettres restantes au joueur qui a terminé
    const totalRemainingPoints = Object.values(remainingLettersPoints).reduce(
      (sum, points) => sum + points,
      0
    );
    finalScores[lastPlayerToPlay] += totalRemainingPoints;

    const reason =
      totalRemainingPoints > 0
        ? `Le joueur qui a terminé reçoit ${totalRemainingPoints} points des lettres restantes`
        : "Fin de partie normale";

    return {
      scores: finalScores,
      reason,
    };
  }

  /**
   * Obtient les scores de base des lettres
   */
  private static getLetterScores(word: string): number[] {
    const letterScores: { [key: string]: number } = {
      a: 1,
      e: 1,
      i: 1,
      l: 1,
      n: 1,
      o: 1,
      r: 1,
      s: 1,
      t: 1,
      u: 1,
      d: 2,
      g: 2,
      m: 2,
      b: 3,
      c: 3,
      p: 3,
      f: 4,
      h: 4,
      v: 4,
      j: 8,
      q: 8,
      k: 10,
      w: 10,
      x: 10,
      y: 10,
      z: 10,
    };

    return word
      .toLowerCase()
      .split("")
      .map((letter) => letterScores[letter] || 0);
  }

  /**
   * Obtient les multiplicateurs de lettres pour chaque position
   */
  private static getLetterMultipliers(positions: GridPosition[]): number[] {
    return positions.map((position) => {
      const tileType = this.getTileType(position.row, position.col);
      if (tileType === "letter-2x") return 2;
      if (tileType === "letter-3x") return 3;
      return 1;
    });
  }

  /**
   * Obtient les multiplicateurs de mots pour chaque position
   */
  private static getWordMultipliers(positions: GridPosition[]): number[] {
    const multipliers: number[] = [];

    positions.forEach((position) => {
      const tileType = this.getTileType(position.row, position.col);
      if (tileType === "word-2x") multipliers.push(2);
      if (tileType === "word-3x") multipliers.push(3);
    });

    return multipliers;
  }

  /**
   * Détermine le type de case selon la position
   */
  private static getTileType(row: number, col: number): string {
    // Centre de la grille
    if (row === this.CENTER_POSITION && col === this.CENTER_POSITION) {
      return "center";
    }

    // Cases Word x3 (rouge)
    const word3xPositions = [
      [0, 0],
      [0, 7],
      [0, 14],
      [7, 0],
      [7, 14],
      [14, 0],
      [14, 7],
      [14, 14],
    ];
    if (word3xPositions.some(([r, c]) => r === row && c === col)) {
      return "word-3x";
    }

    // Cases Word x2 (rose)
    const word2xPositions = [
      [1, 1],
      [1, 13],
      [2, 2],
      [2, 12],
      [3, 3],
      [3, 11],
      [4, 4],
      [4, 10],
      [10, 4],
      [10, 10],
      [11, 3],
      [11, 11],
      [12, 2],
      [12, 12],
      [13, 1],
      [13, 13],
    ];
    if (word2xPositions.some(([r, c]) => r === row && c === col)) {
      return "word-2x";
    }

    // Cases Letter x3 (bleu)
    const letter3xPositions = [
      [1, 5],
      [1, 9],
      [5, 1],
      [5, 5],
      [5, 9],
      [5, 13],
      [9, 1],
      [9, 5],
      [9, 9],
      [9, 13],
      [13, 5],
      [13, 9],
    ];
    if (letter3xPositions.some(([r, c]) => r === row && c === col)) {
      return "letter-3x";
    }

    // Cases Letter x2 (cyan)
    const letter2xPositions = [
      [0, 3],
      [0, 11],
      [2, 6],
      [2, 8],
      [3, 0],
      [3, 7],
      [3, 14],
      [6, 2],
      [6, 6],
      [6, 8],
      [6, 12],
      [7, 3],
      [7, 11],
      [8, 2],
      [8, 6],
      [8, 8],
      [8, 12],
      [11, 0],
      [11, 7],
      [11, 14],
      [12, 6],
      [12, 8],
      [14, 3],
      [14, 11],
    ];
    if (letter2xPositions.some(([r, c]) => r === row && c === col)) {
      return "letter-2x";
    }

    return "empty";
  }

  /**
   * Calcule le bonus pour un mot de 7 lettres (bingo)
   */
  static calculateBingoBonus(wordLength: number): number {
    return wordLength >= 7 ? gameRules.BINGO_BONUS : 0;
  }

  /**
   * Formate un score pour l'affichage
   */
  static formatScore(score: number): string {
    return score.toLocaleString("fr-FR");
  }

  /**
   * Obtient une description des bonus appliqués
   */
  static getBonusDescription(wordScore: WordScore): string[] {
    const descriptions: string[] = [];

    // Multiplicateurs de lettres
    wordScore.letterMultipliers.forEach((multiplier, index) => {
      if (multiplier > 1) {
        descriptions.push(`Lettre ${index + 1}: x${multiplier}`);
      }
    });

    // Multiplicateurs de mots
    wordScore.wordMultipliers.forEach((multiplier) => {
      descriptions.push(`Mot: x${multiplier}`);
    });

    // Bonus bingo
    if (wordScore.isBingo) {
      descriptions.push(`Bingo (+${gameRules.BINGO_BONUS} points)`);
    }

    return descriptions;
  }
}

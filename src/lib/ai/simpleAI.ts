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
  strategy?: string; // Description de la stratégie utilisée
};

export type WordAnalysis = {
  word: string;
  positions: GridPosition[];
  direction: "horizontal" | "vertical";
  score: number;
  bonusUsed: boolean;
  connectionPoints: number;
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

    // Analyser les mots existants pour trouver des opportunités
    const existingWords = this.analyzeExistingWords(placedLetters);

    // Générer des mots intelligents basés sur l'analyse
    const smartWords = this.generateSmartWords(
      aiRack,
      existingWords,
      isFirstMove
    );

    // Pour chaque mot, trouver toutes les positions possibles
    smartWords.forEach((word) => {
      const positions = this.findValidPositions(
        word,
        placedLetters,
        isFirstMove
      );

      positions.forEach((position) => {
        const move = this.createMove(word, position, aiRack, placedLetters);
        if (move) {
          // Analyser la stratégie du coup
          const strategy = this.analyzeMoveStrategy(
            move,
            existingWords,
            placedLetters
          );
          move.strategy = strategy;
          possibleMoves.push(move);
        }
      });
    });

    if (possibleMoves.length === 0) {
      return null;
    }

    // Trier les coups selon la difficulté et la stratégie
    return this.selectBestMove(possibleMoves);
  }

  /**
   * Analyse les mots existants sur la grille
   */
  private analyzeExistingWords(placedLetters: PlacedLetter[]): WordAnalysis[] {
    if (placedLetters.length === 0) return [];

    const words: WordAnalysis[] = [];

    // Extraire les mots horizontaux et verticaux
    const horizontalWords = this.extractHorizontalWords(placedLetters);
    const verticalWords = this.extractVerticalWords(placedLetters);

    // Analyser chaque mot
    [...horizontalWords, ...verticalWords].forEach((wordInfo) => {
      const analysis: WordAnalysis = {
        word: wordInfo.word,
        positions: wordInfo.positions,
        direction: horizontalWords.includes(wordInfo)
          ? "horizontal"
          : "vertical",
        score: 0,
        bonusUsed: false,
        connectionPoints: 0,
      };

      // Calculer le score et identifier les bonus
      analysis.score = this.calculateWordScore(
        wordInfo.word,
        wordInfo.positions
      );
      analysis.bonusUsed = this.hasBonus(wordInfo.positions);
      analysis.connectionPoints = this.countConnectionPoints(
        wordInfo.positions,
        placedLetters
      );

      words.push(analysis);
    });

    return words;
  }

  /**
   * Génère des mots intelligents basés sur l'analyse
   */
  private generateSmartWords(
    rack: Letter[],
    existingWords: WordAnalysis[],
    isFirstMove: boolean
  ): string[] {
    const words: string[] = [];
    const letters = rack.map((l) => l.letter.toLowerCase());

    // 1. Mots de base (comme avant)
    const baseWords = this.generatePossibleWords(rack);
    words.push(...baseWords);

    // 2. Mots basés sur les mots existants (anagrammes, extensions)
    if (!isFirstMove && existingWords.length > 0) {
      const extensionWords = this.generateExtensionWords(
        letters,
        existingWords
      );
      words.push(...extensionWords);
    }

    // 3. Mots utilisant les jokers de manière optimale
    const jokerWords = this.generateJokerWords(rack);
    words.push(...jokerWords);

    // 4. Mots courts mais stratégiques (pour les difficultés élevées)
    if (this.difficulty === "hard") {
      const strategicWords = this.generateStrategicWords(
        letters,
        existingWords
      );
      words.push(...strategicWords);
    }

    return [...new Set(words)]; // Supprimer les doublons
  }

  /**
   * Génère des mots qui étendent les mots existants
   */
  private generateExtensionWords(
    letters: string[],
    existingWords: WordAnalysis[]
  ): string[] {
    const words: string[] = [];

    existingWords.forEach((existingWord) => {
      // Chercher des préfixes possibles
      for (let len = 1; len <= Math.min(3, letters.length); len++) {
        const combinations = this.getCombinations(letters, len);
        combinations.forEach((combo) => {
          const prefix = combo.join("");
          const extendedWord = prefix + existingWord.word;
          if (isValidWord(extendedWord)) {
            words.push(extendedWord);
          }
        });
      }

      // Chercher des suffixes possibles
      for (let len = 1; len <= Math.min(3, letters.length); len++) {
        const combinations = this.getCombinations(letters, len);
        combinations.forEach((combo) => {
          const suffix = combo.join("");
          const extendedWord = existingWord.word + suffix;
          if (isValidWord(extendedWord)) {
            words.push(extendedWord);
          }
        });
      }
    });

    return words;
  }

  /**
   * Génère des mots optimaux avec les jokers
   */
  private generateJokerWords(rack: Letter[]): string[] {
    const words: string[] = [];
    const jokers = rack.filter((l) => l.letter === " ");
    const otherLetters = rack
      .filter((l) => l.letter !== " ")
      .map((l) => l.letter.toLowerCase());

    if (jokers.length === 0) return words;

    // Utiliser les jokers pour former des mots de haute valeur
    const highValueLetters = ["J", "Q", "K", "W", "X", "Y", "Z"];

    jokers.forEach(() => {
      highValueLetters.forEach((highValueLetter) => {
        const extendedRack = [...otherLetters, highValueLetter.toLowerCase()];
        const jokerWords = this.generatePossibleWords(
          extendedRack.map((l) => ({ letter: l, score: 0, id: "temp" }))
        );
        words.push(...jokerWords);
      });
    });

    return words;
  }

  /**
   * Génère des mots stratégiques pour les placements difficiles
   */
  private generateStrategicWords(
    letters: string[],
    existingWords: WordAnalysis[]
  ): string[] {
    const words: string[] = [];

    // Mots de 2-3 lettres qui peuvent créer des connexions multiples
    const shortWords = [
      "ET",
      "DE",
      "LE",
      "LA",
      "UN",
      "SE",
      "NE",
      "CE",
      "JE",
      "TE",
    ];

    shortWords.forEach((shortWord) => {
      const shortWordLetters = shortWord.toLowerCase().split("");
      if (this.canFormWord(shortWordLetters, letters)) {
        words.push(shortWord.toLowerCase());
      }
    });

    return words;
  }

  /**
   * Vérifie si on peut former un mot avec les lettres disponibles
   */
  private canFormWord(
    wordLetters: string[],
    availableLetters: string[]
  ): boolean {
    const available = [...availableLetters];

    for (const letter of wordLetters) {
      const index = available.indexOf(letter);
      if (index === -1) return false;
      available.splice(index, 1);
    }

    return true;
  }

  /**
   * Analyse la stratégie d'un coup
   */
  private analyzeMoveStrategy(
    move: AIMove,
    existingWords: WordAnalysis[],
    placedLetters: PlacedLetter[]
  ): string {
    const strategies: string[] = [];

    // Vérifier si le coup utilise des bonus
    if (this.hasBonus([move.position])) {
      strategies.push("Bonus utilisé");
    }

    // Vérifier le nombre de connexions
    const connections = this.countConnectionPoints(
      [move.position],
      placedLetters
    );
    if (connections > 1) {
      strategies.push(`${connections} connexions`);
    }

    // Vérifier si c'est un mot de 7 lettres (Bingo)
    if (move.word.length === 7) {
      strategies.push("Bingo (+50 points)");
    }

    // Vérifier si le mot étend un mot existant
    const extendsExisting = existingWords.some(
      (existing) =>
        move.word.includes(existing.word) || existing.word.includes(move.word)
    );
    if (extendsExisting) {
      strategies.push("Extension de mot");
    }

    return strategies.length > 0 ? strategies.join(", ") : "Placement standard";
  }

  /**
   * Extrait les mots horizontaux de la grille
   */
  private extractHorizontalWords(
    placedLetters: PlacedLetter[]
  ): { word: string; positions: GridPosition[] }[] {
    const words: { word: string; positions: GridPosition[] }[] = [];
    const grid = this.createGrid(placedLetters);

    for (let row = 0; row < 15; row++) {
      let currentWord = "";
      let currentPositions: GridPosition[] = [];

      for (let col = 0; col < 15; col++) {
        const letter = grid[row][col];
        if (letter) {
          currentWord += letter;
          currentPositions.push({ row, col });
        } else {
          if (currentWord.length > 1) {
            words.push({ word: currentWord, positions: currentPositions });
          }
          currentWord = "";
          currentPositions = [];
        }
      }

      if (currentWord.length > 1) {
        words.push({ word: currentWord, positions: currentPositions });
      }
    }

    return words;
  }

  /**
   * Extrait les mots verticaux de la grille
   */
  private extractVerticalWords(
    placedLetters: PlacedLetter[]
  ): { word: string; positions: GridPosition[] }[] {
    const words: { word: string; positions: GridPosition[] }[] = [];
    const grid = this.createGrid(placedLetters);

    for (let col = 0; col < 15; col++) {
      let currentWord = "";
      let currentPositions: GridPosition[] = [];

      for (let row = 0; row < 15; row++) {
        const letter = grid[row][col];
        if (letter) {
          currentWord += letter;
          currentPositions.push({ row, col });
        } else {
          if (currentWord.length > 1) {
            words.push({ word: currentWord, positions: currentPositions });
          }
          currentWord = "";
          currentPositions = [];
        }
      }

      if (currentWord.length > 1) {
        words.push({ word: currentWord, positions: currentPositions });
      }
    }

    return words;
  }

  /**
   * Crée une grille 2D à partir des lettres placées
   */
  private createGrid(placedLetters: PlacedLetter[]): (string | null)[][] {
    const grid: (string | null)[][] = Array(15)
      .fill(null)
      .map(() => Array(15).fill(null));

    placedLetters.forEach((letter) => {
      grid[letter.position.row][letter.position.col] = letter.letter;
    });

    return grid;
  }

  /**
   * Calcule le score d'un mot
   */
  private calculateWordScore(word: string, positions: GridPosition[]): number {
    // Score de base (simplifié)
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

    let score = 0;
    word
      .toLowerCase()
      .split("")
      .forEach((letter) => {
        score += letterScores[letter] || 0;
      });

    // Bonus pour les mots de 7 lettres
    if (word.length === 7) {
      score += 50;
    }

    return score;
  }

  /**
   * Vérifie si des positions utilisent des bonus
   */
  private hasBonus(positions: GridPosition[]): boolean {
    // Cases bonus simplifiées (en réalité, il faudrait vérifier les vraies cases bonus)
    const bonusPositions = [
      { row: 0, col: 0 },
      { row: 0, col: 7 },
      { row: 0, col: 14 },
      { row: 7, col: 0 },
      { row: 7, col: 14 },
      { row: 14, col: 0 },
      { row: 14, col: 7 },
      { row: 14, col: 14 },
    ];

    return positions.some((pos) =>
      bonusPositions.some(
        (bonus) => bonus.row === pos.row && bonus.col === pos.col
      )
    );
  }

  /**
   * Compte le nombre de points de connexion
   */
  private countConnectionPoints(
    positions: GridPosition[],
    placedLetters: PlacedLetter[]
  ): number {
    let connections = 0;

    positions.forEach((pos) => {
      const adjacentPositions = [
        { row: pos.row - 1, col: pos.col },
        { row: pos.row + 1, col: pos.col },
        { row: pos.row, col: pos.col - 1 },
        { row: pos.row, col: pos.col + 1 },
      ];

      adjacentPositions.forEach((adjPos) => {
        if (
          placedLetters.some(
            (letter) =>
              letter.position.row === adjPos.row &&
              letter.position.col === adjPos.col
          )
        ) {
          connections++;
        }
      });
    });

    return connections;
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
   * Trouve toutes les positions valides pour placer un mot
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
      console.log(
        `🔍 IA: Premier coup pour "${word}" - position centrale (7,7)`
      );
      return positions;
    }

    console.log(
      `🔍 IA: Recherche de positions valides pour "${word}" (non-premier coup)`
    );
    console.log(`🔍 IA: Nombre de lettres placées: ${placedLetters.length}`);

    // Pour les coups suivants, chercher les positions connectées
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        // Vérifier si le mot peut être placé horizontalement
        if (col + word.length <= 15) {
          if (
            this.canPlaceWordHorizontally(word, { row, col }, placedLetters)
          ) {
            positions.push({ row, col });
            console.log(
              `✅ IA: Position horizontale valide pour "${word}": (${row}, ${col})`
            );
          }
        }

        // Vérifier si le mot peut être placé verticalement
        if (row + word.length <= 15) {
          if (this.canPlaceWordVertically(word, { row, col }, placedLetters)) {
            positions.push({ row, col });
            console.log(
              `✅ IA: Position verticale valide pour "${word}": (${row}, ${col})`
            );
          }
        }
      }
    }

    console.log(
      `🔍 IA: ${positions.length} positions valides trouvées pour "${word}"`
    );
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

    // Utiliser le GameRuleValidator pour valider le placement (même que le joueur)
    const isFirstMove = placedLetters.length === 0;

    // Log de débogage
    console.log(
      `🔍 IA: Validation horizontale de "${word}" à (${startPos.row}, ${startPos.col})`
    );
    console.log(
      `🔍 IA: isFirstMove = ${isFirstMove}, placedLetters.length = ${placedLetters.length}`
    );

    const ruleValidation = ruleValidator.validateWordPlacement(
      word,
      positions,
      placedLetters,
      isFirstMove
    );

    if (!ruleValidation.isValid) {
      console.log(
        `❌ IA: Règles de placement rejetées pour "${word}":`,
        ruleValidation.errors
      );
      return false;
    }

    // Simuler le placement des lettres (même que le joueur)
    const simulatedLetters: PlacedLetter[] = [];
    for (let i = 0; i < word.length; i++) {
      simulatedLetters.push({
        letter: word[i].toUpperCase(),
        score: 0,
        position: positions[i],
      });
    }

    // Validation des mots formés (même que le joueur)
    const allLetters = [...placedLetters, ...simulatedLetters];
    const wordValidation = WordValidator.validateGrid(allLetters);

    if (!wordValidation.isValid) {
      console.log(
        `❌ IA: Validation des mots échouée pour "${word}":`,
        wordValidation.errors
      );
      return false;
    }

    // Vérification que tous les mots sont valides (même que le joueur)
    const invalidWords = wordValidation.words.filter((word) => !word.isValid);
    if (invalidWords.length > 0) {
      console.log(
        `❌ IA: Mots invalides détectés pour "${word}":`,
        invalidWords.map((w) => w.word)
      );
      return false;
    }

    // Vérification qu'il y a au moins un mot formé (même que le joueur)
    if (wordValidation.words.length === 0) {
      console.log(`❌ IA: Aucun mot formé pour "${word}"`);
      return false;
    }

    console.log(
      `✅ IA: Placement horizontal accepté pour "${word}" (${wordValidation.words.length} mots valides)`
    );
    return true;
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

    // Utiliser le GameRuleValidator pour valider le placement (même que le joueur)
    const isFirstMove = placedLetters.length === 0;

    // Log de débogage
    console.log(
      `🔍 IA: Validation verticale de "${word}" à (${startPos.row}, ${startPos.col})`
    );
    console.log(
      `🔍 IA: isFirstMove = ${isFirstMove}, placedLetters.length = ${placedLetters.length}`
    );

    const ruleValidation = ruleValidator.validateWordPlacement(
      word,
      positions,
      placedLetters,
      isFirstMove
    );

    if (!ruleValidation.isValid) {
      console.log(
        `❌ IA: Règles de placement rejetées pour "${word}":`,
        ruleValidation.errors
      );
      return false;
    }

    // Simuler le placement des lettres (même que le joueur)
    const simulatedLetters: PlacedLetter[] = [];
    for (let i = 0; i < word.length; i++) {
      simulatedLetters.push({
        letter: word[i].toUpperCase(),
        score: 0,
        position: positions[i],
      });
    }

    // Validation des mots formés (même que le joueur)
    const allLetters = [...placedLetters, ...simulatedLetters];
    const wordValidation = WordValidator.validateGrid(allLetters);

    if (!wordValidation.isValid) {
      console.log(
        `❌ IA: Validation des mots échouée pour "${word}":`,
        wordValidation.errors
      );
      return false;
    }

    // Vérification que tous les mots sont valides (même que le joueur)
    const invalidWords = wordValidation.words.filter((word) => !word.isValid);
    if (invalidWords.length > 0) {
      console.log(
        `❌ IA: Mots invalides détectés pour "${word}":`,
        invalidWords.map((w) => w.word)
      );
      return false;
    }

    // Vérification qu'il y a au moins un mot formé (même que le joueur)
    if (wordValidation.words.length === 0) {
      console.log(`❌ IA: Aucun mot formé pour "${word}"`);
      return false;
    }

    console.log(
      `✅ IA: Placement vertical accepté pour "${word}" (${wordValidation.words.length} mots valides)`
    );
    return true;
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
    // Vérifier d'abord si c'est le premier coup
    const isFirstMove = placedLetters.length === 0;

    // Pour le premier coup, on peut placer horizontalement ou verticalement
    if (isFirstMove) {
      // Essayer horizontalement d'abord
      const horizontalMove = this.createMoveWithOrientation(
        word,
        position,
        rack,
        placedLetters,
        "horizontal"
      );
      if (horizontalMove) return horizontalMove;

      // Essayer verticalement
      const verticalMove = this.createMoveWithOrientation(
        word,
        position,
        rack,
        placedLetters,
        "vertical"
      );
      if (verticalMove) return verticalMove;

      return null;
    }

    // Pour les coups suivants, vérifier les deux orientations
    const horizontalMove = this.createMoveWithOrientation(
      word,
      position,
      rack,
      placedLetters,
      "horizontal"
    );
    const verticalMove = this.createMoveWithOrientation(
      word,
      position,
      rack,
      placedLetters,
      "vertical"
    );

    // Retourner le meilleur des deux coups valides
    if (horizontalMove && verticalMove) {
      return horizontalMove.score >= verticalMove.score
        ? horizontalMove
        : verticalMove;
    }

    return horizontalMove || verticalMove;
  }

  /**
   * Crée un coup avec une orientation spécifique
   */
  private createMoveWithOrientation(
    word: string,
    position: GridPosition,
    rack: Letter[],
    placedLetters: PlacedLetter[],
    orientation: "horizontal" | "vertical"
  ): AIMove | null {
    // Vérifier si le placement est possible dans cette orientation
    const canPlace =
      orientation === "horizontal"
        ? this.canPlaceWordHorizontally(word, position, placedLetters)
        : this.canPlaceWordVertically(word, position, placedLetters);

    if (!canPlace) return null;

    // Simuler le placement des lettres
    const newLetters: PlacedLetter[] = [];
    const usedLetters: Letter[] = [];

    for (let i = 0; i < word.length; i++) {
      const letter = rack.find(
        (l) =>
          l.letter.toLowerCase() === word[i] &&
          !usedLetters.some((used) => used.id === l.id)
      );
      if (!letter) return null;

      // Générer la position correcte selon l'orientation
      const letterPosition =
        orientation === "horizontal"
          ? { row: position.row, col: position.col + i }
          : { row: position.row + i, col: position.col };

      newLetters.push({
        letter: letter.letter,
        score: letter.score,
        position: letterPosition,
      });

      usedLetters.push(letter);
    }

    // Calculer le score en utilisant la même validation que le joueur
    const allLetters = [...placedLetters, ...newLetters];
    const wordValidation = WordValidator.validateGrid(allLetters);
    const score = wordValidation.totalScore;

    return {
      letter: usedLetters[0],
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

    // Filtrer les coups selon la difficulté
    let filteredMoves = moves;

    switch (this.difficulty) {
      case "easy":
        // Choisir un coup aléatoire parmi les 50% meilleurs
        const topHalf = moves.slice(0, Math.ceil(moves.length / 2));
        return topHalf[Math.floor(Math.random() * topHalf.length)];

      case "medium":
        // Prioriser les coups avec stratégies intéressantes
        const strategicMoves = moves.filter(
          (move) =>
            move.strategy &&
            (move.strategy.includes("Bingo") ||
              move.strategy.includes("Bonus") ||
              move.strategy.includes("Extension"))
        );

        if (strategicMoves.length > 0) {
          // Choisir parmi les coups stratégiques
          const topStrategic = strategicMoves.slice(
            0,
            Math.ceil(strategicMoves.length * 0.3)
          );
          return topStrategic[Math.floor(Math.random() * topStrategic.length)];
        } else {
          // Choisir parmi les 30% meilleurs coups normaux
          const topThird = moves.slice(0, Math.ceil(moves.length * 0.3));
          return topThird[Math.floor(Math.random() * topThird.length)];
        }

      case "hard":
        // Prioriser les coups avec le meilleur score et les meilleures stratégies
        const highScoreMoves = moves.filter(
          (move) => move.score >= moves[0].score * 0.8
        );

        // Parmi les coups à haut score, prioriser ceux avec des stratégies
        const bestStrategicMoves = highScoreMoves.filter(
          (move) =>
            move.strategy &&
            (move.strategy.includes("Bingo") ||
              move.strategy.includes("Bonus") ||
              move.strategy.includes("Extension") ||
              move.strategy.includes("connexions"))
        );

        if (bestStrategicMoves.length > 0) {
          return bestStrategicMoves[0]; // Le meilleur coup stratégique
        } else {
          return moves[0]; // Le meilleur coup par score
        }

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

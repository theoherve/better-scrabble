import { PlacedLetter } from "@/components/grid/Grid";
import { PlayerLetter } from "@/components/player-panel/PlayerRack";

interface GameState {
  currentTurn: string;
  gameOver: boolean;
  letterBagCount: number;
  playerRacks: { [playerId: string]: PlayerLetter[] };
  consecutivePasses?: number;
}

// Règles officielles du Scrabble français
export interface GameRules {
  // Règles de base
  readonly GRID_SIZE: number;
  readonly RACK_SIZE: number;
  readonly BINGO_BONUS: number;
  readonly CHALLENGE_PENALTY: number;

  // Règles de fin de partie
  readonly END_GAME_CONDITION: "last_letter_placed" | "pass_consecutive";
  readonly CONSECUTIVE_PASSES_TO_END: number;

  // Règles de placement
  readonly FIRST_WORD_MUST_PASS_CENTER: boolean;
  readonly WORDS_MUST_BE_CONNECTED: boolean;
  readonly DIAGONAL_PLACEMENT_ALLOWED: boolean;
  readonly FIRST_WORD_MIN_LENGTH: number;

  // Règles de jokers
  readonly JOKERS_CAN_REPRESENT_ANY_LETTER: boolean;
  readonly JOKERS_HAVE_ZERO_VALUE: boolean;
  readonly JOKERS_CAN_BE_REPLACED: boolean;

  // Règles de contestation
  readonly CHALLENGE_ALLOWED: boolean;
  readonly CHALLENGE_TIMEOUT: number; // en secondes
  readonly INVALID_WORD_PENALTY: number;
  readonly FALSE_CHALLENGE_PENALTY: number;

  // Règles d'actions
  readonly EXCHANGE_LOSES_TURN: boolean;
  readonly PASS_LOSES_TURN: boolean;
}

// Règles officielles du Scrabble français
export const OFFICIAL_FRENCH_RULES: GameRules = {
  // Règles de base
  GRID_SIZE: 15,
  RACK_SIZE: 7,
  BINGO_BONUS: 50, // Bonus pour un mot de 7 lettres
  CHALLENGE_PENALTY: 10, // Pénalité pour contestation incorrecte

  // Règles de fin de partie
  END_GAME_CONDITION: "last_letter_placed",
  CONSECUTIVE_PASSES_TO_END: 6, // 3 passes consécutifs par joueur

  // Règles de placement
  FIRST_WORD_MUST_PASS_CENTER: true,
  WORDS_MUST_BE_CONNECTED: true,
  DIAGONAL_PLACEMENT_ALLOWED: false,
  FIRST_WORD_MIN_LENGTH: 2, // Le premier mot doit faire au moins 2 lettres

  // Règles de jokers
  JOKERS_CAN_REPRESENT_ANY_LETTER: true,
  JOKERS_HAVE_ZERO_VALUE: true,
  JOKERS_CAN_BE_REPLACED: false, // Un joker placé ne peut pas être remplacé

  // Règles de contestation
  CHALLENGE_ALLOWED: true,
  CHALLENGE_TIMEOUT: 30, // 30 secondes pour contester
  INVALID_WORD_PENALTY: 0, // Le joueur reprend ses lettres
  FALSE_CHALLENGE_PENALTY: 10, // Pénalité pour contestation incorrecte

  // Règles d'actions
  EXCHANGE_LOSES_TURN: true, // Échanger des lettres fait perdre le tour
  PASS_LOSES_TURN: true, // Passer son tour fait perdre le tour
};

// Types pour les actions de jeu
export type GameAction =
  | "place_word"
  | "pass_turn"
  | "exchange_letters"
  | "challenge_word"
  | "end_game";

export interface GameActionData {
  action: GameAction;
  playerId: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

// Validation des règles
export class GameRuleValidator {
  private rules: GameRules;

  constructor(rules: GameRules = OFFICIAL_FRENCH_RULES) {
    this.rules = rules;
  }

  /**
   * Vérifie si un placement respecte les règles de placement
   */
  validatePlacement(
    position: { row: number; col: number },
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
    if (isFirstMove && this.rules.FIRST_WORD_MUST_PASS_CENTER) {
      const centerPosition = Math.floor(this.rules.GRID_SIZE / 2);
      if (position.row !== centerPosition || position.col !== centerPosition) {
        errors.push("Le premier mot doit passer par le centre de la grille");
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
  private isConnectedToExistingWord(
    position: { row: number; col: number },
    existingLetters: PlacedLetter[]
  ): boolean {
    const adjacentPositions = [
      { row: position.row - 1, col: position.col },
      { row: position.row + 1, col: position.col },
      { row: position.row, col: position.col - 1 },
      { row: position.row, col: position.col + 1 },
    ];

    return adjacentPositions.some((pos) =>
      existingLetters.some(
        (letter) =>
          letter.position.row === pos.row && letter.position.col === pos.col
      )
    );
  }

  /**
   * Vérifie si la fin de partie est atteinte
   */
  validateEndGameCondition(
    playerRacks: { [playerId: string]: PlayerLetter[] },
    letterBagCount: number,
    consecutivePasses: number
  ): { isEndGame: boolean; reason: string } {
    // Condition 1: Un joueur a placé toutes ses lettres et le sac est vide
    const hasEmptyRack = Object.values(playerRacks).some(
      (rack) => rack.length === 0
    );
    if (hasEmptyRack && letterBagCount === 0) {
      return {
        isEndGame: true,
        reason: "Un joueur a placé toutes ses lettres et le sac est vide",
      };
    }

    // Condition 2: Passes consécutifs (optionnel selon les règles)
    if (consecutivePasses >= this.rules.CONSECUTIVE_PASSES_TO_END) {
      return {
        isEndGame: true,
        reason: "Nombre maximum de passes consécutifs atteint",
      };
    }

    return {
      isEndGame: false,
      reason: "",
    };
  }

  /**
   * Calcule les scores finaux selon les règles officielles
   */
  calculateFinalScores(
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
   * Vérifie si une action est valide selon les règles
   */
  validateAction(
    action: GameAction,
    gameState: GameState,
    playerId: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (action) {
      case "place_word":
        // Vérifications de base pour placer un mot
        if (gameState.currentTurn !== playerId) {
          errors.push("Ce n'est pas votre tour");
        }
        if (gameState.gameOver) {
          errors.push("La partie est terminée");
        }
        break;

      case "pass_turn":
        // Toujours autorisé
        break;

      case "exchange_letters":
        // Vérifier qu'il y a assez de lettres dans le sac
        if (
          gameState.letterBagCount < gameState.playerRacks[playerId]?.length
        ) {
          errors.push("Pas assez de lettres dans le sac pour échanger");
        }
        break;

      case "challenge_word":
        // Vérifier que la contestation est autorisée
        if (!this.rules.CHALLENGE_ALLOWED) {
          errors.push("Les contestations ne sont pas autorisées");
        }
        break;

      case "end_game":
        // Seulement si les conditions de fin sont remplies
        const endGameCheck = this.validateEndGameCondition(
          gameState.playerRacks,
          gameState.letterBagCount,
          gameState.consecutivePasses || 0
        );
        if (!endGameCheck.isEndGame) {
          errors.push("Les conditions de fin de partie ne sont pas remplies");
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Vérifie si un mot respecte les règles de placement
   */
  validateWordPlacement(
    word: string,
    positions: { row: number; col: number }[],
    existingLetters: PlacedLetter[],
    isFirstMove: boolean = false
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Vérifier la longueur minimale du premier mot
    if (isFirstMove && word.length < this.rules.FIRST_WORD_MIN_LENGTH) {
      errors.push(
        `Le premier mot doit faire au moins ${this.rules.FIRST_WORD_MIN_LENGTH} lettres`
      );
    }

    // Vérifier que toutes les lettres sont alignées horizontalement ou verticalement
    if (positions.length > 1) {
      const isHorizontal = positions.every(
        (pos, i) => i === 0 || pos.row === positions[0].row
      );
      const isVertical = positions.every(
        (pos, i) => i === 0 || pos.col === positions[0].col
      );

      if (!isHorizontal && !isVertical) {
        errors.push(
          "Les lettres doivent être alignées horizontalement ou verticalement"
        );
      }
    }

    // Vérifier que toutes les positions sont valides
    positions.forEach((position, index) => {
      const placementValidation = this.validatePlacement(
        position,
        existingLetters,
        isFirstMove && index === 0
      );
      if (!placementValidation.isValid) {
        errors.push(...placementValidation.errors);
      }
    });

    // Vérifier la connexion avec les mots existants (sauf premier coup)
    if (!isFirstMove && existingLetters.length > 0) {
      // Vérifier que le mot est connecté aux mots existants
      const hasConnection = this.isWordConnectedToExistingWords(
        positions,
        existingLetters
      );
      if (!hasConnection) {
        errors.push("Le mot doit être connecté à un mot existant");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Vérifie si un mot est connecté aux mots existants
   */
  private isWordConnectedToExistingWords(
    positions: { row: number; col: number }[],
    existingLetters: PlacedLetter[]
  ): boolean {
    // Si aucune lettre existante, pas de connexion possible
    if (existingLetters.length === 0) {
      return false;
    }

    // Vérifier que au moins une lettre du nouveau mot est adjacente à une lettre existante
    const hasAdjacentConnection = positions.some((position) =>
      this.isConnectedToExistingWord(position, existingLetters)
    );

    if (!hasAdjacentConnection) {
      return false;
    }

    // Vérifier que toutes les lettres du nouveau mot sont connectées entre elles
    // (soit adjacentes, soit faisant partie du même mot)

    // Créer un graphe de connexion pour les nouvelles lettres
    const connectedGroups = this.findConnectedGroups(positions);

    // Vérifier que toutes les lettres sont dans le même groupe connecté
    if (connectedGroups.length > 1) {
      return false; // Le mot n'est pas connecté en un seul groupe
    }

    return true;
  }

  /**
   * Trouve les groupes de lettres connectées
   */
  private findConnectedGroups(
    positions: { row: number; col: number }[]
  ): Set<string>[] {
    if (positions.length === 0) return [];

    const groups: Set<string>[] = [];
    const visited = new Set<string>();

    positions.forEach((position) => {
      const posKey = `${position.row},${position.col}`;
      if (!visited.has(posKey)) {
        const group = new Set<string>();
        this.dfsConnectedPositions(position, positions, group, visited);
        groups.push(group);
      }
    });

    return groups;
  }

  /**
   * Parcours en profondeur pour trouver les positions connectées
   */
  private dfsConnectedPositions(
    position: { row: number; col: number },
    allPositions: { row: number; col: number }[],
    group: Set<string>,
    visited: Set<string>
  ): void {
    const posKey = `${position.row},${position.col}`;
    if (visited.has(posKey)) return;

    visited.add(posKey);
    group.add(posKey);

    // Trouver les positions adjacentes dans le même mot
    const adjacentPositions = [
      { row: position.row - 1, col: position.col },
      { row: position.row + 1, col: position.col },
      { row: position.row, col: position.col - 1 },
      { row: position.row, col: position.col + 1 },
    ];

    adjacentPositions.forEach((adjPos) => {
      const adjPosKey = `${adjPos.row},${adjPos.col}`;
      const isInSameWord = allPositions.some(
        (pos) => pos.row === adjPos.row && pos.col === adjPos.col
      );

      if (isInSameWord && !visited.has(adjPosKey)) {
        this.dfsConnectedPositions(adjPos, allPositions, group, visited);
      }
    });
  }
}

// Export des règles par défaut
export const gameRules = OFFICIAL_FRENCH_RULES;
export const ruleValidator = new GameRuleValidator();

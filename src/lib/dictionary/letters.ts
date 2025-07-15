// Distribution des lettres du Scrabble français officiel
export const LETTER_DISTRIBUTION = {
  A: { count: 9, score: 1 },
  B: { count: 2, score: 3 },
  C: { count: 2, score: 3 },
  D: { count: 3, score: 2 },
  E: { count: 15, score: 1 },
  F: { count: 2, score: 4 },
  G: { count: 2, score: 2 },
  H: { count: 2, score: 4 },
  I: { count: 8, score: 1 },
  J: { count: 1, score: 8 },
  K: { count: 1, score: 10 },
  L: { count: 5, score: 1 },
  M: { count: 3, score: 2 },
  N: { count: 6, score: 1 },
  O: { count: 6, score: 1 },
  P: { count: 2, score: 3 },
  Q: { count: 1, score: 8 },
  R: { count: 6, score: 1 },
  S: { count: 6, score: 1 },
  T: { count: 6, score: 1 },
  U: { count: 6, score: 1 },
  V: { count: 2, score: 4 },
  W: { count: 1, score: 10 },
  X: { count: 1, score: 10 },
  Y: { count: 1, score: 10 },
  Z: { count: 1, score: 10 },
  // Jokers (blancs)
  " ": { count: 2, score: 0 },
};

export type Letter = {
  letter: string;
  score: number;
  id: string;
};

export class LetterBag {
  private letters: Letter[] = [];

  constructor() {
    this.initializeBag();
  }

  private initializeBag(): void {
    this.letters = [];
    let idCounter = 0;

    Object.entries(LETTER_DISTRIBUTION).forEach(([letter, config]) => {
      for (let i = 0; i < config.count; i++) {
        this.letters.push({
          letter,
          score: config.score,
          id: `${letter}_${idCounter++}`,
        });
      }
    });
  }

  public shuffle(): void {
    // Algorithme de mélange Fisher-Yates
    for (let i = this.letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.letters[i], this.letters[j]] = [this.letters[j], this.letters[i]];
    }
  }

  public draw(count: number): Letter[] {
    const drawn: Letter[] = [];
    for (let i = 0; i < count && this.letters.length > 0; i++) {
      drawn.push(this.letters.pop()!);
    }
    return drawn;
  }

  public returnLetters(letters: Letter[]): void {
    this.letters.push(...letters);
  }

  public getRemainingCount(): number {
    return this.letters.length;
  }

  public reset(): void {
    this.initializeBag();
  }
}

// Fonction utilitaire pour créer un rack de lettres
export const createPlayerRack = (letterBag: LetterBag): Letter[] => {
  return letterBag.draw(7);
};

// Fonction pour remplacer des lettres
export const exchangeLetters = (
  letterBag: LetterBag,
  rack: Letter[],
  letterIdsToExchange: string[]
): Letter[] => {
  const lettersToReturn = rack.filter((letter) =>
    letterIdsToExchange.includes(letter.id)
  );

  const newLetters = letterBag.draw(lettersToReturn.length);
  letterBag.returnLetters(lettersToReturn);

  return [
    ...rack.filter((letter) => !letterIdsToExchange.includes(letter.id)),
    ...newLetters,
  ];
};

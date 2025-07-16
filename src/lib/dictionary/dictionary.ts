// Dictionnaire français complet pour la validation des mots
// Utilise le fichier JSON dictionnaire.json

import wordsData from "./dictionnaire.json";

// Créer un Set pour une recherche rapide
const FRENCH_WORDS = new Set<string>();

// Charger tous les mots du JSON dans le Set
// Le nouveau format est un tableau simple de mots
wordsData.forEach((word: string) => {
  FRENCH_WORDS.add(word.toLowerCase());
});

console.log(`Dictionnaire chargé: ${FRENCH_WORDS.size} mots français`);

/**
 * Vérifie si un mot est valide dans le dictionnaire français
 */
export const isValidWord = (word: string): boolean => {
  return FRENCH_WORDS.has(word.toLowerCase());
};

/**
 * Calcule le score d'un mot basé sur les valeurs des lettres
 */
export const getWordScore = (word: string): number => {
  const letterValues: { [key: string]: number } = {
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
    w: 4,
    y: 4,
    k: 10,
    j: 8,
    q: 8,
    x: 10,
    z: 10,
  };

  return word
    .toLowerCase()
    .split("")
    .reduce((score, letter) => {
      return score + (letterValues[letter] || 0);
    }, 0);
};

/**
 * Obtient un mot aléatoire du dictionnaire
 */
export const getRandomWord = (): string => {
  const words = Array.from(FRENCH_WORDS);
  return words[Math.floor(Math.random() * words.length)];
};

/**
 * Obtient tous les mots commençant par une lettre donnée
 */
export const getWordsStartingWith = (letter: string): string[] => {
  const words: string[] = [];
  const targetLetter = letter.toLowerCase();

  FRENCH_WORDS.forEach((word) => {
    if (word.startsWith(targetLetter)) {
      words.push(word);
    }
  });

  return words;
};

/**
 * Obtient le nombre total de mots dans le dictionnaire
 */
export const getDictionarySize = (): number => {
  return FRENCH_WORDS.size;
};

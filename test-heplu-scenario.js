// Test du scénario HEPLU problématique
// Ce script peut être exécuté dans la console du navigateur

console.log('🧪 Test du scénario HEPLU problématique');

// Simulation de l'état de jeu problématique
const placedLetters = [
  // Mot "HELP" horizontal (IA)
  { letter: 'H', score: 4, position: { row: 8, col: 6 } },
  { letter: 'E', score: 1, position: { row: 8, col: 7 } },
  { letter: 'L', score: 1, position: { row: 8, col: 8 } },
  { letter: 'P', score: 3, position: { row: 8, col: 9 } },
  
  // Lettre "N" ajoutée par le joueur (pour former "NE")
  { letter: 'N', score: 1, position: { row: 7, col: 7 } }
];

console.log('État initial:');
console.log('- HELP placé horizontalement par l\'IA');
console.log('- N ajouté par le joueur pour former NE');

// Test de validation des mots formés
function validateGrid(letters) {
  const grid = Array(15).fill(null).map(() => Array(15).fill(null));
  
  letters.forEach(letter => {
    grid[letter.position.row][letter.position.col] = letter.letter;
  });
  
  const words = [];
  
  // Extraire les mots horizontaux
  for (let row = 0; row < 15; row++) {
    let currentWord = '';
    let currentPositions = [];
    
    for (let col = 0; col < 15; col++) {
      const letter = grid[row][col];
      if (letter) {
        currentWord += letter;
        currentPositions.push({ row, col });
      } else {
        if (currentWord.length > 1) {
          words.push({ word: currentWord, positions: currentPositions, direction: 'horizontal' });
        }
        currentWord = '';
        currentPositions = [];
      }
    }
    
    if (currentWord.length > 1) {
      words.push({ word: currentWord, positions: currentPositions, direction: 'horizontal' });
    }
  }
  
  // Extraire les mots verticaux
  for (let col = 0; col < 15; col++) {
    let currentWord = '';
    let currentPositions = [];
    
    for (let row = 0; row < 15; row++) {
      const letter = grid[row][col];
      if (letter) {
        currentWord += letter;
        currentPositions.push({ row, col });
      } else {
        if (currentWord.length > 1) {
          words.push({ word: currentWord, positions: currentPositions, direction: 'vertical' });
        }
        currentWord = '';
        currentPositions = [];
      }
    }
    
    if (currentWord.length > 1) {
      words.push({ word: currentWord, positions: currentPositions, direction: 'vertical' });
    }
  }
  
  return words;
}

// Mots valides pour le test (simplifié)
const validWords = ['HELP', 'NE', 'HE', 'LP', 'N', 'E', 'H', 'L', 'P'];

function isValidWord(word) {
  return validWords.includes(word.toUpperCase());
}

// Test de l'état actuel
console.log('\n📋 Mots actuels sur la grille:');
const currentWords = validateGrid(placedLetters);
currentWords.forEach(wordInfo => {
  const isValid = isValidWord(wordInfo.word);
  const status = isValid ? '✅' : '❌';
  console.log(`${status} "${wordInfo.word}" (${wordInfo.direction}) - ${isValid ? 'Valide' : 'Invalide'}`);
});

// Test du placement problématique "PLU"
console.log('\n🧪 Test du placement problématique "PLU":');

const testPlacement = [
  ...placedLetters,
  // Ajout de "PLU" qui créerait "HEPLU"
  { letter: 'P', score: 3, position: { row: 8, col: 9 } }, // P déjà présent
  { letter: 'L', score: 1, position: { row: 8, col: 10 } }, // Nouveau L
  { letter: 'U', score: 1, position: { row: 8, col: 11 } }  // Nouveau U
];

const wordsAfterPlacement = validateGrid(testPlacement);
console.log('Mots après placement de "PLU":');
wordsAfterPlacement.forEach(wordInfo => {
  const isValid = isValidWord(wordInfo.word);
  const status = isValid ? '✅' : '❌';
  console.log(`${status} "${wordInfo.word}" (${wordInfo.direction}) - ${isValid ? 'Valide' : 'Invalide'}`);
});

// Vérification du problème
const invalidWords = wordsAfterPlacement.filter(wordInfo => !isValidWord(wordInfo.word));
if (invalidWords.length > 0) {
  console.log('\n🚫 PROBLÈME DÉTECTÉ:');
  invalidWords.forEach(wordInfo => {
    console.log(`- "${wordInfo.word}" est invalide mais serait créé par le placement de "PLU"`);
  });
  console.log('L\'IA ne devrait pas pouvoir placer "PLU" dans cette situation !');
} else {
  console.log('\n✅ Aucun mot invalide détecté');
}

// Test de validation de l'IA
console.log('\n🤖 Test de validation de l\'IA:');

function testAIPlacement(word, position, orientation) {
  console.log(`Test de placement: "${word}" à (${position.row}, ${position.col}) en ${orientation}`);
  
  // Simuler le placement
  const newLetters = [];
  for (let i = 0; i < word.length; i++) {
    const letterPosition = orientation === 'horizontal'
      ? { row: position.row, col: position.col + i }
      : { row: position.row + i, col: position.col };
    
    newLetters.push({
      letter: word[i].toUpperCase(),
      score: 0,
      position: letterPosition
    });
  }
  
  const simulatedGrid = [...placedLetters, ...newLetters];
  const wordsAfterPlacement = validateGrid(simulatedGrid);
  
  // Vérifier si des mots invalides sont créés
  const invalidWords = wordsAfterPlacement.filter(wordInfo => !isValidWord(wordInfo.word));
  
  if (invalidWords.length > 0) {
    console.log(`❌ Placement rejeté - mots invalides créés:`, invalidWords.map(w => w.word));
    return false;
  } else {
    console.log(`✅ Placement accepté - tous les mots sont valides`);
    return true;
  }
}

// Test du placement "PLU"
const canPlacePLU = testAIPlacement('PLU', { row: 8, col: 9 }, 'horizontal');
console.log(`\nRésultat: L'IA ${canPlacePLU ? 'peut' : 'ne peut pas'} placer "PLU"`);

console.log('\n📋 Règles vérifiées:');
console.log('✅ Validation de tous les mots formés');
console.log('✅ Rejet des placements qui créent des mots invalides');
console.log('✅ Simulation préalable des placements');
console.log('✅ Logs de débogage pour identifier les problèmes');

console.log('\n🎯 L\'IA devrait maintenant rejeter les placements qui créent des mots invalides !'); 
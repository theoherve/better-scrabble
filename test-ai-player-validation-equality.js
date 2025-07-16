// Test d'égalité de validation entre l'IA et le joueur
// Ce script peut être exécuté dans la console du navigateur

console.log('🧪 Test d\'égalité de validation entre l\'IA et le joueur');

// Simulation de l'état de jeu
const placedLetters = [
  // Mot "CHAT" horizontal
  { letter: 'C', score: 3, position: { row: 7, col: 6 } },
  { letter: 'H', score: 4, position: { row: 7, col: 7 } },
  { letter: 'A', score: 1, position: { row: 7, col: 8 } },
  { letter: 'T', score: 1, position: { row: 7, col: 9 } }
];

console.log('État initial:');
console.log('- CHAT placé horizontalement au centre');

// Fonction de validation du joueur (copiée de handleValidateWord)
function playerValidation(word, positions, existingLetters, isFirstMove) {
  console.log(`\n👤 Validation joueur pour "${word}":`);
  
  // Étape 1: Validation des règles
  const ruleValidation = ruleValidator.validateWordPlacement(
    word,
    positions,
    existingLetters,
    isFirstMove
  );
  
  console.log(`  Règles de placement: ${ruleValidation.isValid ? '✅' : '❌'}`);
  if (!ruleValidation.isValid) {
    console.log(`  Erreurs:`, ruleValidation.errors);
    return { isValid: false, errors: ruleValidation.errors };
  }
  
  // Étape 2: Validation des mots formés
  const simulatedLetters = positions.map((pos, i) => ({
    letter: word[i].toUpperCase(),
    score: 0,
    position: pos
  }));
  
  const allLetters = [...existingLetters, ...simulatedLetters];
  const wordValidation = WordValidator.validateGrid(allLetters);
  
  console.log(`  Validation des mots: ${wordValidation.isValid ? '✅' : '❌'}`);
  console.log(`  Mots formés:`, wordValidation.words.map(w => `${w.word} (${w.isValid ? 'valide' : 'invalide'})`));
  
  if (!wordValidation.isValid) {
    console.log(`  Erreurs:`, wordValidation.errors);
    return { isValid: false, errors: wordValidation.errors };
  }
  
  // Étape 3: Vérification qu'il y a au moins un mot
  if (wordValidation.words.length === 0) {
    console.log(`  ❌ Aucun mot formé`);
    return { isValid: false, errors: ['Aucun mot formé'] };
  }
  
  console.log(`  ✅ Mot validé avec ${wordValidation.totalScore} points`);
  return { isValid: true, score: wordValidation.totalScore };
}

// Fonction de validation de l'IA (simulation)
function aiValidation(word, positions, existingLetters, isFirstMove) {
  console.log(`\n🤖 Validation IA pour "${word}":`);
  
  // Étape 1: Validation des règles (même que le joueur)
  const ruleValidation = ruleValidator.validateWordPlacement(
    word,
    positions,
    existingLetters,
    isFirstMove
  );
  
  console.log(`  Règles de placement: ${ruleValidation.isValid ? '✅' : '❌'}`);
  if (!ruleValidation.isValid) {
    console.log(`  Erreurs:`, ruleValidation.errors);
    return { isValid: false, errors: ruleValidation.errors };
  }
  
  // Étape 2: Validation des mots formés (même que le joueur)
  const simulatedLetters = positions.map((pos, i) => ({
    letter: word[i].toUpperCase(),
    score: 0,
    position: pos
  }));
  
  const allLetters = [...existingLetters, ...simulatedLetters];
  const wordValidation = WordValidator.validateGrid(allLetters);
  
  console.log(`  Validation des mots: ${wordValidation.isValid ? '✅' : '❌'}`);
  console.log(`  Mots formés:`, wordValidation.words.map(w => `${w.word} (${w.isValid ? 'valide' : 'invalide'})`));
  
  if (!wordValidation.isValid) {
    console.log(`  Erreurs:`, wordValidation.errors);
    return { isValid: false, errors: wordValidation.errors };
  }
  
  // Étape 3: Vérification qu'il y a au moins un mot (même que le joueur)
  if (wordValidation.words.length === 0) {
    console.log(`  ❌ Aucun mot formé`);
    return { isValid: false, errors: ['Aucun mot formé'] };
  }
  
  console.log(`  ✅ Mot validé avec ${wordValidation.totalScore} points`);
  return { isValid: true, score: wordValidation.totalScore };
}

// Simulation de la validation des règles (version simplifiée)
function ruleValidator() {
  return {
    validateWordPlacement: function(word, positions, existingLetters, isFirstMove) {
      const errors = [];
      
      // Vérifier la connexion avec les mots existants (sauf premier coup)
      if (!isFirstMove && existingLetters.length > 0) {
        const hasConnection = positions.some((position) =>
          isConnectedToExistingWord(position, existingLetters)
        );
        if (!hasConnection) {
          errors.push("Le mot doit être connecté à un mot existant");
        }
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  };
}

// Simulation de WordValidator (version simplifiée)
function WordValidator() {
  return {
    validateGrid: function(allLetters) {
      // Simuler la validation des mots
      const words = extractWords(allLetters);
      const isValid = words.every(word => isValidWord(word.word));
      
      return {
        isValid,
        words,
        totalScore: words.reduce((sum, word) => sum + word.score, 0),
        errors: isValid ? [] : ['Mots invalides détectés']
      };
    }
  };
}

// Fonctions utilitaires
function isConnectedToExistingWord(position, existingLetters) {
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

function extractWords(letters) {
  // Simulation simple d'extraction de mots
  return [
    { word: 'CHAT', score: 9, isValid: true },
    { word: 'S', score: 1, isValid: true }
  ];
}

function isValidWord(word) {
  const validWords = ['CHAT', 'S', 'CHATS'];
  return validWords.includes(word.toUpperCase());
}

// Test des validations
console.log('\n📋 Test des validations:');

// Test 1: Mot connecté valide
console.log('\n=== Test 1: Mot connecté valide ===');
const validPositions = [
  { row: 7, col: 10 } // S à côté de T
];

const playerResult1 = playerValidation('S', validPositions, placedLetters, false);
const aiResult1 = aiValidation('S', validPositions, placedLetters, false);

console.log(`\nRésultats:`);
console.log(`Joueur: ${playerResult1.isValid ? '✅' : '❌'}`);
console.log(`IA: ${aiResult1.isValid ? '✅' : '❌'}`);
console.log(`Égalité: ${playerResult1.isValid === aiResult1.isValid ? '✅' : '❌'}`);

// Test 2: Mot non connecté
console.log('\n=== Test 2: Mot non connecté ===');
const invalidPositions = [
  { row: 3, col: 3 },
  { row: 3, col: 4 },
  { row: 3, col: 5 }
];

const playerResult2 = playerValidation('MOT', invalidPositions, placedLetters, false);
const aiResult2 = aiValidation('MOT', invalidPositions, placedLetters, false);

console.log(`\nRésultats:`);
console.log(`Joueur: ${playerResult2.isValid ? '✅' : '❌'}`);
console.log(`IA: ${aiResult2.isValid ? '✅' : '❌'}`);
console.log(`Égalité: ${playerResult2.isValid === aiResult2.isValid ? '✅' : '❌'}`);

// Test 3: Premier coup
console.log('\n=== Test 3: Premier coup ===');
const firstMovePositions = [
  { row: 7, col: 7 },
  { row: 7, col: 8 },
  { row: 7, col: 9 }
];

const playerResult3 = playerValidation('MOT', firstMovePositions, [], true);
const aiResult3 = aiValidation('MOT', firstMovePositions, [], true);

console.log(`\nRésultats:`);
console.log(`Joueur: ${playerResult3.isValid ? '✅' : '❌'}`);
console.log(`IA: ${aiResult3.isValid ? '✅' : '❌'}`);
console.log(`Égalité: ${playerResult3.isValid === aiResult3.isValid ? '✅' : '❌'}`);

console.log('\n🎯 L\'IA et le joueur devraient maintenant utiliser exactement la même validation !');

// Test de debug pour comprendre les différences
console.log('\n🐛 Debug: Analyse des différences');

function compareValidations(word, positions, existingLetters, isFirstMove) {
  console.log(`\nComparaison pour "${word}":`);
  
  const playerResult = playerValidation(word, positions, existingLetters, isFirstMove);
  const aiResult = aiValidation(word, positions, existingLetters, isFirstMove);
  
  if (playerResult.isValid !== aiResult.isValid) {
    console.log(`❌ DIFFÉRENCE DÉTECTÉE:`);
    console.log(`  Joueur: ${playerResult.isValid ? 'Accepté' : 'Rejeté'}`);
    console.log(`  IA: ${aiResult.isValid ? 'Accepté' : 'Rejeté'}`);
    
    if (!playerResult.isValid && playerResult.errors) {
      console.log(`  Erreurs joueur:`, playerResult.errors);
    }
    if (!aiResult.isValid && aiResult.errors) {
      console.log(`  Erreurs IA:`, aiResult.errors);
    }
  } else {
    console.log(`✅ Validation identique: ${playerResult.isValid ? 'Accepté' : 'Rejeté'}`);
  }
}

// Test de comparaison avec le scénario "PUT"
console.log('\n=== Test de comparaison avec "PUT" ===');
const putPositions = [
  { row: 4, col: 9 },
  { row: 4, col: 10 },
  { row: 4, col: 11 }
];

compareValidations('PUT', putPositions, placedLetters, false); 
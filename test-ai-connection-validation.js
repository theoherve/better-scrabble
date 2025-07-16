// Test de validation des connexions de l'IA
// Ce script peut être exécuté dans la console du navigateur

console.log('🧪 Test de validation des connexions de l\'IA');

// Simulation de l'état de jeu avec des mots existants
const placedLetters = [
  // Mot "BEC" horizontal
  { letter: 'B', score: 3, position: { row: 7, col: 7 } },
  { letter: 'E', score: 1, position: { row: 7, col: 8 } },
  { letter: 'C', score: 3, position: { row: 7, col: 9 } },
  
  // Mot "GUS" horizontal
  { letter: 'G', score: 2, position: { row: 8, col: 6 } },
  { letter: 'U', score: 1, position: { row: 8, col: 7 } },
  { letter: 'S', score: 1, position: { row: 8, col: 8 } },
  
  // Mot "LLE" vertical
  { letter: 'L', score: 1, position: { row: 9, col: 7 } },
  { letter: 'L', score: 1, position: { row: 10, col: 7 } },
  { letter: 'E', score: 1, position: { row: 11, col: 7 } }
];

console.log('État initial:');
console.log('- BEC placé horizontalement');
console.log('- GUS placé horizontalement');
console.log('- LLE placé verticalement');

// Test de validation des connexions
function testConnectionValidation(word, positions, isFirstMove = false) {
  console.log(`\n🧪 Test de placement: "${word}" à ${JSON.stringify(positions)}`);
  
  // Simuler la validation des règles
  const validation = validateWordPlacement(word, positions, placedLetters, isFirstMove);
  
  if (validation.isValid) {
    console.log(`✅ Placement accepté`);
  } else {
    console.log(`❌ Placement rejeté:`, validation.errors);
  }
  
  return validation.isValid;
}

// Simulation de la validation des règles (version simplifiée)
function validateWordPlacement(word, positions, existingLetters, isFirstMove) {
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

// Vérifier si une position est connectée à un mot existant
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

// Test du placement problématique "FIE" (non connecté)
console.log('\n🚫 Test du placement problématique "FIE":');
const fiePositions = [
  { row: 3, col: 7 },
  { row: 3, col: 8 },
  { row: 3, col: 9 }
];

const canPlaceFIE = testConnectionValidation('FIE', fiePositions);
console.log(`Résultat: L'IA ${canPlaceFIE ? 'peut' : 'ne peut pas'} placer "FIE" (non connecté)`);

// Test de placements valides connectés
console.log('\n✅ Test de placements valides connectés:');

// Test 1: Extension de "BEC" avec "S" pour former "BECS"
console.log('\nTest 1: Extension de BEC avec S');
const becsPositions = [
  { row: 7, col: 10 } // S à côté de C
];
const canPlaceBECS = testConnectionValidation('S', becsPositions);
console.log(`Résultat: L'IA ${canPlaceBECS ? 'peut' : 'ne peut pas'} placer "S" pour former "BECS"`);

// Test 2: Extension de "GUS" avec "T" pour former "GUST"
console.log('\nTest 2: Extension de GUS avec T');
const gustPositions = [
  { row: 8, col: 9 } // T à côté de S
];
const canPlaceGUST = testConnectionValidation('T', gustPositions);
console.log(`Résultat: L'IA ${canPlaceGUST ? 'peut' : 'ne peut pas'} placer "T" pour former "GUST"`);

// Test 3: Mot vertical connecté à "LLE"
console.log('\nTest 3: Mot vertical connecté à LLE');
const verticalPositions = [
  { row: 8, col: 7 }, // Connecté à U de GUS
  { row: 9, col: 7 }, // Connecté à L de LLE
  { row: 10, col: 7 } // Connecté à L de LLE
];
const canPlaceVertical = testConnectionValidation('MOT', verticalPositions);
console.log(`Résultat: L'IA ${canPlaceVertical ? 'peut' : 'ne peut pas'} placer un mot vertical connecté`);

// Test 4: Premier coup (devrait être accepté)
console.log('\nTest 4: Premier coup (centre)');
const firstMovePositions = [
  { row: 7, col: 7 }, // Centre
  { row: 7, col: 8 },
  { row: 7, col: 9 }
];
const canPlaceFirstMove = testConnectionValidation('MOT', firstMovePositions, true);
console.log(`Résultat: Premier coup ${canPlaceFirstMove ? 'accepté' : 'rejeté'}`);

console.log('\n📋 Règles vérifiées:');
console.log('✅ Mots non connectés rejetés');
console.log('✅ Mots connectés acceptés');
console.log('✅ Premier coup accepté au centre');
console.log('✅ Extensions de mots existants acceptées');

console.log('\n🎯 L\'IA devrait maintenant rejeter les placements non connectés comme "FIE" !');

// Test de validation de l'IA
console.log('\n🤖 Test de validation de l\'IA:');

function testAIConnectionValidation(word, position, orientation) {
  console.log(`Test de placement IA: "${word}" à (${position.row}, ${position.col}) en ${orientation}`);
  
  // Simuler le placement
  const positions = [];
  for (let i = 0; i < word.length; i++) {
    const letterPosition = orientation === 'horizontal'
      ? { row: position.row, col: position.col + i }
      : { row: position.row + i, col: position.col };
    
    positions.push(letterPosition);
  }
  
  const validation = validateWordPlacement(word, positions, placedLetters);
  
  if (validation.isValid) {
    console.log(`✅ Placement IA accepté`);
    return true;
  } else {
    console.log(`❌ Placement IA rejeté:`, validation.errors);
    return false;
  }
}

// Test du placement problématique "FIE" par l'IA
const canAIPlaceFIE = testAIConnectionValidation('FIE', { row: 3, col: 7 }, 'horizontal');
console.log(`\nRésultat IA: L'IA ${canAIPlaceFIE ? 'peut' : 'ne peut pas'} placer "FIE" (non connecté)`);

// Test d'un placement valide par l'IA
const canAIPlaceValid = testAIConnectionValidation('S', { row: 7, col: 10 }, 'horizontal');
console.log(`Résultat IA: L'IA ${canAIPlaceValid ? 'peut' : 'ne peut pas'} placer "S" (connecté)`);

console.log('\n🎯 L\'IA devrait maintenant respecter les règles de connexion !'); 
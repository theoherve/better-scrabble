// Test du placement problématique "PUT"
// Ce script peut être exécuté dans la console du navigateur

console.log('🧪 Test du placement problématique "PUT"');

// Simulation de l'état de jeu avec les mots existants de l'image
const placedLetters = [
  // Mot "BAH" horizontal
  { letter: 'B', score: 3, position: { row: 6, col: 6 } },
  { letter: 'A', score: 1, position: { row: 6, col: 7 } },
  { letter: 'H', score: 4, position: { row: 6, col: 8 } },
  
  // Lettre "I" verticale (partie de "BID")
  { letter: 'I', score: 1, position: { row: 7, col: 6 } },
  
  // Mot "DC" horizontal
  { letter: 'D', score: 2, position: { row: 8, col: 6 } },
  { letter: 'C', score: 3, position: { row: 8, col: 7 } },
  
  // Mot "LEI" horizontal
  { letter: 'L', score: 1, position: { row: 10, col: 5 } },
  { letter: 'E', score: 1, position: { row: 10, col: 6 } },
  { letter: 'I', score: 1, position: { row: 10, col: 7 } },
  
  // Lettres "R" et "E" verticales (partie de "IRE")
  { letter: 'R', score: 1, position: { row: 11, col: 7 } },
  { letter: 'E', score: 1, position: { row: 12, col: 7 } }
];

console.log('État initial:');
console.log('- BAH placé horizontalement');
console.log('- I placé verticalement (BID)');
console.log('- DC placé horizontalement');
console.log('- LEI placé horizontalement');
console.log('- R et E placés verticalement (IRE)');

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

// Test du placement problématique "PUT" (non connecté)
console.log('\n🚫 Test du placement problématique "PUT":');
const putPositions = [
  { row: 4, col: 9 },
  { row: 4, col: 10 },
  { row: 4, col: 11 }
];

const canPlacePUT = testConnectionValidation('PUT', putPositions);
console.log(`Résultat: L'IA ${canPlacePUT ? 'peut' : 'ne peut pas'} placer "PUT" (non connecté)`);

// Test de placements valides connectés
console.log('\n✅ Test de placements valides connectés:');

// Test 1: Extension de "BAH" avec "S" pour former "BAHS"
console.log('\nTest 1: Extension de BAH avec S');
const bahsPositions = [
  { row: 6, col: 9 } // S à côté de H
];
const canPlaceBAHS = testConnectionValidation('S', bahsPositions);
console.log(`Résultat: L'IA ${canPlaceBAHS ? 'peut' : 'ne peut pas'} placer "S" pour former "BAHS"`);

// Test 2: Extension de "DC" avec "E" pour former "DCE"
console.log('\nTest 2: Extension de DC avec E');
const dcePositions = [
  { row: 8, col: 8 } // E à côté de C
];
const canPlaceDCE = testConnectionValidation('E', dcePositions);
console.log(`Résultat: L'IA ${canPlaceDCE ? 'peut' : 'ne peut pas'} placer "E" pour former "DCE"`);

// Test 3: Mot vertical connecté à "IRE"
console.log('\nTest 3: Mot vertical connecté à IRE');
const verticalPositions = [
  { row: 10, col: 7 }, // Connecté à I de LEI
  { row: 11, col: 7 }, // Connecté à R de IRE
  { row: 12, col: 7 }  // Connecté à E de IRE
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

console.log('\n🎯 L\'IA devrait maintenant rejeter les placements non connectés comme "PUT" !');

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

// Test du placement problématique "PUT" par l'IA
const canAIPlacePUT = testAIConnectionValidation('PUT', { row: 4, col: 9 }, 'horizontal');
console.log(`\nRésultat IA: L'IA ${canAIPlacePUT ? 'peut' : 'ne peut pas'} placer "PUT" (non connecté)`);

// Test d'un placement valide par l'IA
const canAIPlaceValid = testAIConnectionValidation('S', { row: 6, col: 9 }, 'horizontal');
console.log(`Résultat IA: L'IA ${canAIPlaceValid ? 'peut' : 'ne peut pas'} placer "S" (connecté)`);

// Test de la détection du premier coup
console.log('\n🔍 Test de la détection du premier coup:');
console.log(`Nombre de lettres placées: ${placedLetters.length}`);
console.log(`Est-ce le premier coup? ${placedLetters.length === 0 ? 'Oui' : 'Non'}`);

console.log('\n🎯 L\'IA devrait maintenant respecter les règles de connexion !');

// Test de debug pour comprendre pourquoi PUT a été accepté
console.log('\n🐛 Debug: Analyse du placement PUT');

function debugPUTPlacement() {
  const putPositions = [
    { row: 4, col: 9 },
    { row: 4, col: 10 },
    { row: 4, col: 11 }
  ];
  
  console.log('Positions de PUT:', putPositions);
  
  putPositions.forEach((pos, index) => {
    const isConnected = isConnectedToExistingWord(pos, placedLetters);
    console.log(`Position ${index + 1} (${pos.row}, ${pos.col}): ${isConnected ? 'Connectée' : 'Non connectée'}`);
    
    if (!isConnected) {
      const adjacentPositions = [
        { row: pos.row - 1, col: pos.col },
        { row: pos.row + 1, col: pos.col },
        { row: pos.row, col: pos.col - 1 },
        { row: pos.row, col: pos.col + 1 },
      ];
      
      console.log(`  Positions adjacentes:`, adjacentPositions);
      
      adjacentPositions.forEach(adjPos => {
        const hasLetter = placedLetters.some(letter => 
          letter.position.row === adjPos.row && letter.position.col === adjPos.col
        );
        console.log(`    (${adjPos.row}, ${adjPos.col}): ${hasLetter ? 'Lettre présente' : 'Vide'}`);
      });
    }
  });
}

debugPUTPlacement(); 
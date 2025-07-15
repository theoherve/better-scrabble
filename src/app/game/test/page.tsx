"use client";

import { useState } from "react";
import Link from "next/link";
import { Grid, GridPosition, PlacedLetter } from "@/components/grid/Grid";
import { PlayerRack, PlayerLetter } from "@/components/player-panel/PlayerRack";
import { LetterBag } from "@/lib/dictionary/letters";
import { WordValidator, WordValidationResult } from "@/lib/dictionary/wordValidator";
import { WordDisplay } from "@/components/grid/WordDisplay";
import { ScoreDetails } from "@/components/grid/ScoreDetails";
import { ScoreCalculator, WordScore } from "@/lib/dictionary/scoreCalculator";

export default function TestGamePage() {
  const [letterBag] = useState(() => {
    const bag = new LetterBag();
    bag.shuffle();
    return bag;
  });

  const [playerRack, setPlayerRack] = useState<PlayerLetter[]>(() => {
    return letterBag.draw(7).map(letter => ({
      letter: letter.letter,
      score: letter.score,
      id: letter.id
    }));
  });

  const [placedLetters, setPlacedLetters] = useState<PlacedLetter[]>([]);
  const [selectedLetterId, setSelectedLetterId] = useState<string | undefined>();
  const [selectedPosition, setSelectedPosition] = useState<GridPosition | undefined>();
  const [wordValidation, setWordValidation] = useState<WordValidationResult>({
    words: [],
    totalScore: 0,
    isValid: true,
    errors: []
  });
  const [wordScores, setWordScores] = useState<WordScore[]>([]);

  const handleLetterClick = (letterId: string) => {
    setSelectedLetterId(letterId);
  };

  const handleTileClick = (position: GridPosition) => {
    if (!selectedLetterId) return;

    // Vérifier si la position est déjà occupée
    const isOccupied = placedLetters.some(
      letter => letter.position.row === position.row && letter.position.col === position.col
    );

    if (isOccupied) return;

    // Trouver la lettre sélectionnée
    const selectedLetter = playerRack.find(letter => letter.id === selectedLetterId);
    if (!selectedLetter) return;

    // Placer la lettre
    const newPlacedLetter: PlacedLetter = {
      letter: selectedLetter.letter,
      score: selectedLetter.score,
      position
    };

    const newPlacedLetters = [...placedLetters, newPlacedLetter];
    setPlacedLetters(newPlacedLetters);
    
    // Valider les mots formés
    const validation = WordValidator.validateGrid(newPlacedLetters);
    setWordValidation(validation);
    
    // Calculer les scores détaillés
    if (validation.words.length > 0) {
      const scores = ScoreCalculator.calculateTotalScore(
        validation.words.map(word => ({ word: word.word, positions: word.positions })),
        newPlacedLetters
      );
      setWordScores(scores.wordScores);
    } else {
      setWordScores([]);
    }
    
    // Retirer la lettre du rack et en tirer une nouvelle
    const newRack = playerRack.filter(letter => letter.id !== selectedLetterId);
    const newLetter = letterBag.draw(1)[0];
    if (newLetter) {
      setPlayerRack([
        ...newRack,
        {
          letter: newLetter.letter,
          score: newLetter.score,
          id: newLetter.id
        }
      ]);
    } else {
      setPlayerRack(newRack);
    }

    setSelectedLetterId(undefined);
    setSelectedPosition(undefined);
  };

  const handleValidateWord = () => {
    // La validation se fait maintenant automatiquement à chaque placement
    const validation = WordValidator.validateGrid(placedLetters);
    setWordValidation(validation);
    
    if (validation.isValid) {
      alert(`✅ Tous les mots sont valides !\nScore total: ${validation.totalScore} points`);
    } else {
      alert(`❌ Erreurs détectées:\n${validation.errors.join('\n')}`);
    }
  };

  const handleReset = () => {
    setPlacedLetters([]);
    setSelectedLetterId(undefined);
    setSelectedPosition(undefined);
    setWordValidation({
      words: [],
      totalScore: 0,
      isValid: true,
      errors: []
    });
    setWordScores([]);
    
    // Remettre toutes les lettres dans le sac et redonner un nouveau rack
    letterBag.reset();
    letterBag.shuffle();
    setPlayerRack(
      letterBag.draw(7).map(letter => ({
        letter: letter.letter,
        score: letter.score,
        id: letter.id
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Test de la Grille</h1>
          <p className="text-gray-600 mt-2">
            Testez le placement des lettres et la validation des mots
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grille de jeu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Grille de Scrabble</h2>
              <div className="flex justify-center">
                <Grid
                  placedLetters={placedLetters}
                  selectedPosition={selectedPosition}
                  onTileClick={handleTileClick}
                />
              </div>
              
              <div className="mt-6 flex gap-4 justify-center">
                <button
                  onClick={handleValidateWord}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Valider le mot
                </button>
                <button
                  onClick={handleReset}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réinitialiser
                </button>
              </div>

              {wordValidation.words.length > 0 && (
                <div className="mt-4">
                  <WordDisplay 
                    words={wordValidation.words}
                    totalScore={wordValidation.totalScore}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Panneau du joueur */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <PlayerRack
                letters={playerRack}
                selectedLetterId={selectedLetterId}
                onLetterClick={handleLetterClick}
              />

              {/* Mots formés */}
              <WordDisplay 
                words={wordValidation.words}
                totalScore={wordValidation.totalScore}
              />

              {/* Détails des scores */}
              <ScoreDetails wordScores={wordScores} />

              {/* Informations de jeu */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Lettres placées:</span> {placedLetters.length}
                  </div>
                  <div>
                    <span className="font-medium">Lettres restantes:</span> {letterBag.getRemainingCount()}
                  </div>
                  <div>
                    <span className="font-medium">Lettre sélectionnée:</span> {
                      selectedLetterId ? playerRack.find(l => l.id === selectedLetterId)?.letter : "Aucune"
                    }
                  </div>
                  <div>
                    <span className="font-medium">Mots formés:</span> {wordValidation.words.length}
                  </div>
                  <div>
                    <span className="font-medium">Score total:</span> {wordValidation.totalScore}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Comment jouer</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Cliquez sur une lettre de votre rack</li>
                  <li>2. Cliquez sur une case de la grille pour la placer</li>
                  <li>3. Formez des mots valides</li>
                  <li>4. Cliquez sur &quot;Valider le mot&quot; pour tester</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
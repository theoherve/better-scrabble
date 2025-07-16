"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Grid, GridPosition, PlacedLetter } from "@/components/grid/Grid";
import { PlayerRack, PlayerLetter } from "@/components/player-panel/PlayerRack";
import { WordDisplay } from "@/components/grid/WordDisplay";
import { ScoreDetails } from "@/components/grid/ScoreDetails";
import { MobileNav } from "@/components/ui/MobileNav";
import { LetterBag } from "@/lib/dictionary/letters";
import { WordValidator, WordValidationResult } from "@/lib/dictionary/wordValidator";
import { ScoreCalculator, WordScore } from "@/lib/dictionary/scoreCalculator";
import { useLobbyStore } from "@/lib/realtime/lobbyStore";

interface GameState {
  placedLetters: PlacedLetter[];
  currentTurn: string; // ID du joueur actuel
  playerScores: { [playerId: string]: number };
  playerRacks: { [playerId: string]: PlayerLetter[] };
  gameOver: boolean;
  winner: string | null;
}

export default function MultiplayerGamePage() {
  const router = useRouter();
  const params = useParams();
  const code = typeof params.code === "string" ? params.code : Array.isArray(params.code) ? params.code[0] : "";

  const lobby = useLobbyStore(s => s.lobby);
  const player = useLobbyStore(s => s.player);
  const leaveLobby = useLobbyStore(s => s.leaveLobby);

  const [letterBag] = useState(() => {
    const bag = new LetterBag();
    bag.shuffle();
    return bag;
  });

  const [gameState, setGameState] = useState<GameState>(() => ({
    placedLetters: [],
    currentTurn: lobby?.players[0]?.id || "",
    playerScores: {},
    playerRacks: {},
    gameOver: false,
    winner: null
  }));

  const [selectedLetterId, setSelectedLetterId] = useState<string | undefined>();
  const [wordValidation, setWordValidation] = useState<WordValidationResult>({
    words: [],
    totalScore: 0,
    isValid: true,
    errors: []
  });
  const [wordScores, setWordScores] = useState<WordScore[]>([]);

  // Initialiser les racks des joueurs si pas encore fait
  useEffect(() => {
    if (lobby && Object.keys(gameState.playerRacks).length === 0) {
      const racks: { [playerId: string]: PlayerLetter[] } = {};
      const scores: { [playerId: string]: number } = {};
      
      lobby.players.forEach(p => {
        racks[p.id] = letterBag.draw(7).map(letter => ({
          letter: letter.letter,
          score: letter.score,
          id: letter.id
        }));
        scores[p.id] = 0;
      });

      setGameState(prev => ({
        ...prev,
        playerRacks: racks,
        playerScores: scores,
        currentTurn: lobby.players[0].id
      }));
    }
  }, [lobby, letterBag, gameState.playerRacks]);

  // Rediriger si pas dans le lobby ou mauvais code
  useEffect(() => {
    if (!lobby || lobby.code !== code || lobby.state !== 'playing') {
      router.replace("/lobby");
    }
  }, [lobby, code, router]);

  if (!lobby || !player) return null;

  const isMyTurn = gameState.currentTurn === player.id;
  const myRack = gameState.playerRacks[player.id] || [];
  const myScore = gameState.playerScores[player.id] || 0;

  const handleLetterClick = (letterId: string) => {
    if (!isMyTurn) return;
    setSelectedLetterId(letterId);
  };

  const handleLetterDragStart = (letterId: string, e: React.DragEvent) => {
    if (!isMyTurn) {
      e.preventDefault();
      return;
    }

    const letter = myRack.find(l => l.id === letterId);
    if (letter?.letter === ' ') {
      // Empêcher le drag des jokers non sélectionnés
      e.preventDefault();
      return;
    }

    console.log('Début du drag pour la lettre:', letterId);
  };

  const handleLetterDrop = (letterId: string, position: GridPosition) => {
    if (!isMyTurn) return;

    // Vérifier si la position est déjà occupée
    const isOccupied = gameState.placedLetters.some(
      letter => letter.position.row === position.row && letter.position.col === position.col
    );

    if (isOccupied) return;

    // Trouver la lettre sélectionnée
    const selectedLetter = myRack.find(letter => letter.id === letterId);
    if (!selectedLetter) return;

    // Placer la lettre
    const newPlacedLetter: PlacedLetter = {
      letter: selectedLetter.letter,
      score: selectedLetter.score,
      position
    };

    const newPlacedLetters = [...gameState.placedLetters, newPlacedLetter];
    
    // Valider les mots formés
    const validation = WordValidator.validateGrid(newPlacedLetters);
    setWordValidation(validation);
    
    if (validation.isValid && validation.words.length > 0) {
      // Calculer les scores détaillés
      const scores = ScoreCalculator.calculateTotalScore(
        validation.words.map(word => ({ word: word.word, positions: word.positions })),
        newPlacedLetters
      );
      setWordScores(scores.wordScores);

      // Mettre à jour l'état du jeu
      const newScore = myScore + validation.totalScore;
      const newRack = myRack.filter(letter => letter.id !== letterId);
      const newLetter = letterBag.draw(1)[0];
      
      if (newLetter) {
        newRack.push({
          letter: newLetter.letter,
          score: newLetter.score,
          id: newLetter.id
        });
      }

      // Passer au tour suivant
      const currentPlayerIndex = lobby.players.findIndex(p => p.id === player.id);
      const nextPlayerIndex = (currentPlayerIndex + 1) % lobby.players.length;
      const nextPlayer = lobby.players[nextPlayerIndex];

      setGameState(prev => ({
        ...prev,
        placedLetters: newPlacedLetters,
        playerScores: {
          ...prev.playerScores,
          [player.id]: newScore
        },
        playerRacks: {
          ...prev.playerRacks,
          [player.id]: newRack
        },
        currentTurn: nextPlayer.id
      }));

      setSelectedLetterId(undefined);
    } else {
      // Coup invalide, remettre la lettre
      setSelectedLetterId(undefined);
    }
  };

  const handleTileClick = (position: GridPosition) => {
    if (!isMyTurn || !selectedLetterId) return;

    // Vérifier si la position est déjà occupée
    const isOccupied = gameState.placedLetters.some(
      letter => letter.position.row === position.row && letter.position.col === position.col
    );

    if (isOccupied) return;

    // Trouver la lettre sélectionnée
    const selectedLetter = myRack.find(letter => letter.id === selectedLetterId);
    if (!selectedLetter) return;

    // Placer la lettre
    const newPlacedLetter: PlacedLetter = {
      letter: selectedLetter.letter,
      score: selectedLetter.score,
      position
    };

    const newPlacedLetters = [...gameState.placedLetters, newPlacedLetter];
    
    // Valider les mots formés
    const validation = WordValidator.validateGrid(newPlacedLetters);
    setWordValidation(validation);
    
    if (validation.isValid && validation.words.length > 0) {
      // Calculer les scores détaillés
      const scores = ScoreCalculator.calculateTotalScore(
        validation.words.map(word => ({ word: word.word, positions: word.positions })),
        newPlacedLetters
      );
      setWordScores(scores.wordScores);

      // Mettre à jour l'état du jeu
      const newScore = myScore + validation.totalScore;
      const newRack = myRack.filter(letter => letter.id !== selectedLetterId);
      const newLetter = letterBag.draw(1)[0];
      
      if (newLetter) {
        newRack.push({
          letter: newLetter.letter,
          score: newLetter.score,
          id: newLetter.id
        });
      }

      // Passer au tour suivant
      const currentPlayerIndex = lobby.players.findIndex(p => p.id === player.id);
      const nextPlayerIndex = (currentPlayerIndex + 1) % lobby.players.length;
      const nextPlayer = lobby.players[nextPlayerIndex];

      setGameState(prev => ({
        ...prev,
        placedLetters: newPlacedLetters,
        playerScores: {
          ...prev.playerScores,
          [player.id]: newScore
        },
        playerRacks: {
          ...prev.playerRacks,
          [player.id]: newRack
        },
        currentTurn: nextPlayer.id
      }));

      setSelectedLetterId(undefined);
    } else {
      // Coup invalide, remettre la lettre
      setSelectedLetterId(undefined);
    }
  };

  const handlePassTurn = () => {
    if (!isMyTurn) return;

    // Passer au tour suivant
    const currentPlayerIndex = lobby.players.findIndex(p => p.id === player.id);
    const nextPlayerIndex = (currentPlayerIndex + 1) % lobby.players.length;
    const nextPlayer = lobby.players[nextPlayerIndex];

    setGameState(prev => ({
      ...prev,
      currentTurn: nextPlayer.id
    }));
  };

  const currentPlayer = lobby.players.find(p => p.id === gameState.currentTurn);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/lobby/${code}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Retour au lobby
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Partie Multijoueur</h1>
              <p className="text-gray-600 mt-2">
                Lobby #{code} • {lobby.players.length} joueurs
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handlePassTurn}
                disabled={!isMyTurn}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Passer
              </button>
              <button
                onClick={leaveLobby}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>

        {/* Scores des joueurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {lobby.players.map(p => (
            <div 
              key={p.id} 
              className={`bg-white rounded-lg shadow-sm border p-4 ${
                p.id === gameState.currentTurn ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{p.name}</span>
                {p.id === gameState.currentTurn && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Tour</span>
                )}
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {gameState.playerScores[p.id] || 0}
              </div>
              <div className="text-xs text-gray-500">
                {gameState.playerRacks[p.id]?.length || 0}/7 lettres
              </div>
            </div>
          ))}
        </div>

        {/* Tour actuel */}
        <div className="mb-6">
          <div className={`inline-block px-4 py-2 rounded-lg font-medium ${
            isMyTurn 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isMyTurn ? 'Votre tour' : `Tour de ${currentPlayer?.name}`}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Grille de jeu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Grille de jeu</h2>
              <div className="flex justify-center overflow-x-auto">
                <Grid
                  placedLetters={gameState.placedLetters}
                  onTileClick={handleTileClick}
                  onLetterDrop={handleLetterDrop}
                  isMyTurn={isMyTurn}
                />
              </div>
            </div>
          </div>

          {/* Panneau latéral */}
          <div className="lg:col-span-2">
            <div className="space-y-4 md:space-y-6">
              {/* Rack du joueur */}
              <PlayerRack
                letters={myRack}
                selectedLetterId={selectedLetterId}
                onLetterClick={handleLetterClick}
                onLetterDragStart={handleLetterDragStart}
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
                    <span className="font-medium">Lettres placées:</span> {gameState.placedLetters.length}
                  </div>
                  <div>
                    <span className="font-medium">Lettres restantes:</span> {letterBag.getRemainingCount()}
                  </div>
                  <div>
                    <span className="font-medium">Tour:</span> {currentPlayer?.name || 'Inconnu'}
                  </div>
                  <div>
                    <span className="font-medium">Votre score:</span> {myScore}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation mobile */}
      <MobileNav
        onPass={handlePassTurn}
        onLeave={leaveLobby}
        backUrl={`/lobby/${code}`}
        backLabel="Lobby"
        isMyTurn={isMyTurn}
      />
    </div>
  );
} 
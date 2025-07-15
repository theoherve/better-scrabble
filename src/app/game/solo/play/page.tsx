"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Grid, GridPosition, PlacedLetter } from "@/components/grid/Grid";
import { PlayerRack, PlayerLetter } from "@/components/player-panel/PlayerRack";
import { WordDisplay } from "@/components/grid/WordDisplay";
import { ScoreDetails } from "@/components/grid/ScoreDetails";
import { MobileNav } from "@/components/ui/MobileNav";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { GameStats } from "@/components/ui/GameStats";
import { DictionaryTest } from "@/components/ui/DictionaryTest";
import { useToast } from "@/hooks/useToast";
import { LetterBag, Letter } from "@/lib/dictionary/letters";
import { WordValidator, WordValidationResult } from "@/lib/dictionary/wordValidator";
import { ScoreCalculator, WordScore } from "@/lib/dictionary/scoreCalculator";
import { SimpleAI } from "@/lib/ai/simpleAI";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { JokerSelector } from "@/components/ui/JokerSelector";
import { LetterExchange } from "@/components/ui/LetterExchange";
import { ruleValidator } from "@/lib/gameRules";

interface GameState {
  playerRack: PlayerLetter[];
  aiRack: Letter[];
  placedLetters: PlacedLetter[];
  currentTurn: 'player' | 'ai';
  playerScore: number;
  aiScore: number;
  gameOver: boolean;
  winner: 'player' | 'ai' | null;
  // Nouvelles propriétés pour le placement temporaire
  tempPlacedLetters: PlacedLetter[];
  isPlacingWord: boolean;
  // Nouvelles propriétés pour les règles officielles
  consecutivePasses: number;
  lastPlayerToPlay: string;
}

function SoloPlayPageContent() {
  const searchParams = useSearchParams();
  const difficulty = (searchParams.get('difficulty') as string) || 'medium';
  const { toasts, success, error, info, removeToast } = useToast();

  const [letterBag] = useState(() => {
    const bag = new LetterBag();
    bag.shuffle();
    return bag;
  });

  const [ai] = useState(() => new SimpleAI(difficulty as 'easy' | 'medium' | 'hard', `IA ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`));

  const [gameState, setGameState] = useState<GameState>(() => ({
    playerRack: letterBag.draw(7).map(letter => ({
      letter: letter.letter,
      score: letter.score,
      id: letter.id
    })),
    aiRack: letterBag.draw(7),
    placedLetters: [],
    currentTurn: 'player',
    playerScore: 0,
    aiScore: 0,
    gameOver: false,
    winner: null,
    tempPlacedLetters: [],
    isPlacingWord: false,
    consecutivePasses: 0,
    lastPlayerToPlay: '',
  }));

  const [selectedLetterId, setSelectedLetterId] = useState<string | undefined>();
  const [wordValidation, setWordValidation] = useState<WordValidationResult>({
    words: [],
    totalScore: 0,
    isValid: true,
    errors: []
  });
  const [wordScores, setWordScores] = useState<WordScore[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // États pour les nouvelles fonctionnalités
  const [showJokerSelector, setShowJokerSelector] = useState(false);
  const [jokerLetterId, setJokerLetterId] = useState<string>('');
  const [showLetterExchange, setShowLetterExchange] = useState(false);

  // Vérifier la fin de partie
  useEffect(() => {
    if (gameState.gameOver) return;

    const endGameCheck = ruleValidator.validateEndGameCondition(
      { player: gameState.playerRack, ai: gameState.aiRack },
      letterBag.getRemainingCount(),
      gameState.consecutivePasses
    );

    if (endGameCheck.isEndGame) {
      const finalScores = ScoreCalculator.calculateFinalScores(
        { player: gameState.playerScore, ai: gameState.aiScore },
        { player: gameState.playerRack, ai: gameState.aiRack },
        gameState.lastPlayerToPlay || 'player'
      );

      const winner = finalScores.scores.player > finalScores.scores.ai ? 'player' : 
                    finalScores.scores.ai > finalScores.scores.player ? 'ai' : null;

      setGameState(prev => ({
        ...prev,
        gameOver: true,
        winner,
        playerScore: finalScores.scores.player,
        aiScore: finalScores.scores.ai
      }));

      if (winner === 'player') {
        success('Félicitations ! Vous avez gagné ! 🎉', undefined, 'right');
      } else if (winner === 'ai') {
        error(`${ai.getName()} a gagné ! 😔`, undefined, 'left');
      } else {
        info('Match nul ! 🤝', undefined, 'right');
      }

      info(`Fin de partie : ${finalScores.reason}`, undefined, 'right');
    }
  }, [gameState.playerRack, gameState.aiRack, gameState.consecutivePasses, gameState.gameOver, letterBag, ai, success, error, info, gameState.lastPlayerToPlay, gameState.playerScore, gameState.aiScore]);

  // Valider les mots en temps réel pendant le placement
  useEffect(() => {
    if (gameState.isPlacingWord && gameState.tempPlacedLetters.length > 0) {
      const allLetters = [...gameState.placedLetters, ...gameState.tempPlacedLetters];
      const validation = WordValidator.validateGrid(allLetters);
      setWordValidation(validation);
      
      if (validation.words.length > 0) {
        const scores = ScoreCalculator.calculateTotalScore(
          validation.words.map(word => ({ word: word.word, positions: word.positions })),
          allLetters
        );
        setWordScores(scores.wordScores);
      }
    } else {
      setWordValidation({
        words: [],
        totalScore: 0,
        isValid: true,
        errors: []
      });
      setWordScores([]);
    }
  }, [gameState.tempPlacedLetters, gameState.placedLetters]);

  // Gestion du tour de l'IA
  useEffect(() => {
    if (gameState.currentTurn === 'ai' && !gameState.gameOver && !isThinking) {
      handleAITurn();
    }
  }, [gameState.currentTurn, gameState.gameOver, isThinking, ai, gameState.aiRack, gameState.placedLetters, letterBag]);

  const handleAITurn = async () => {
    setIsThinking(true);
    
    // Simuler un délai de réflexion
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const aiMove = ai.findBestMove(
      gameState.aiRack,
      gameState.placedLetters,
      gameState.placedLetters.length === 0
    );

    if (aiMove) {
      // Placer le mot de l'IA
      const newPlacedLetters: PlacedLetter[] = [...gameState.placedLetters];
      const usedLetters: Letter[] = [];
      
      // Simuler le placement du mot complet
      for (let i = 0; i < aiMove.word.length; i++) {
        const letter = gameState.aiRack.find(l => 
          l.letter.toLowerCase() === aiMove.word[i] && 
          !usedLetters.some(used => used.id === l.id)
        );
        
        if (letter) {
          newPlacedLetters.push({
            letter: letter.letter,
            score: letter.score,
            position: { 
              row: aiMove.position.row, 
              col: aiMove.position.col + i 
            }
          });
          usedLetters.push(letter);
        }
      }

      // Mettre à jour le rack de l'IA
      const newAIRack = gameState.aiRack.filter(letter => 
        !usedLetters.some(used => used.id === letter.id)
      );
      
      // Tirer de nouvelles lettres
      const newLetters = letterBag.draw(usedLetters.length);
      newAIRack.push(...newLetters);

      setGameState(prev => ({
        ...prev,
        aiRack: newAIRack,
        placedLetters: newPlacedLetters,
        aiScore: prev.aiScore + aiMove.score,
        currentTurn: 'player',
        consecutivePasses: 0,
        lastPlayerToPlay: 'ai'
      }));

      // Afficher le coup de l'IA
      success(`${ai.getName()} joue "${aiMove.word}" pour ${aiMove.score} points !`, undefined, 'left');
    } else {
      // L'IA passe son tour
      setGameState(prev => ({
        ...prev,
        currentTurn: 'player',
        consecutivePasses: prev.consecutivePasses + 1
      }));
      info(`${ai.getName()} passe son tour (aucun coup possible)`, undefined, 'left');
    }

    setIsThinking(false);
  };

  const handleLetterClick = (letterId: string) => {
    if (gameState.currentTurn !== 'player' || gameState.gameOver) return;
    
    const letter = gameState.playerRack.find(l => l.id === letterId);
    if (letter?.letter === ' ') {
      // C'est un joker
      setJokerLetterId(letterId);
      setShowJokerSelector(true);
    } else {
      setSelectedLetterId(letterId);
    }
  };

  const handleJokerSelect = (selectedLetter: string) => {
    // Créer une nouvelle lettre avec la lettre sélectionnée
    const jokerLetter = gameState.playerRack.find(l => l.id === jokerLetterId);
    if (jokerLetter) {
      const newLetter: PlayerLetter = {
        ...jokerLetter,
        letter: selectedLetter,
        score: 0 // Les jokers ont toujours 0 point
      };
      
      setGameState(prev => ({
        ...prev,
        playerRack: prev.playerRack.map(l => 
          l.id === jokerLetterId ? newLetter : l
        )
      }));
      
      setSelectedLetterId(jokerLetterId);
    }
    setShowJokerSelector(false);
    setJokerLetterId('');
  };

  const handleTileClick = (position: GridPosition) => {
    if (gameState.currentTurn !== 'player' || !selectedLetterId || gameState.gameOver) return;

    // Vérifier si la position est déjà occupée (par des lettres permanentes ou temporaires)
    const isOccupied = [...gameState.placedLetters, ...gameState.tempPlacedLetters].some(
      letter => letter.position.row === position.row && letter.position.col === position.col
    );

    if (isOccupied) {
      error('Cette position est déjà occupée', undefined, 'right');
      return;
    }

    // Valider le placement selon les règles
    const isFirstMove = gameState.placedLetters.length === 0 && gameState.tempPlacedLetters.length === 0;
    const placementValidation = ruleValidator.validatePlacement(
      position,
      gameState.placedLetters, // Seules les lettres permanentes pour la connexion
      isFirstMove
    );

    if (!placementValidation.isValid) {
      error(placementValidation.errors[0], undefined, 'right');
      return;
    }

    // Trouver la lettre sélectionnée
    const selectedLetter = gameState.playerRack.find(letter => letter.id === selectedLetterId);
    if (!selectedLetter) return;

    // Placer la lettre temporairement
    const newTempLetter: PlacedLetter = {
      letter: selectedLetter.letter,
      score: selectedLetter.score,
      position,
      isTemporary: true
    };

    const newTempPlacedLetters = [...gameState.tempPlacedLetters, newTempLetter];
    
    // Mettre à jour l'état avec les lettres temporaires
    setGameState(prev => ({
      ...prev,
      tempPlacedLetters: newTempPlacedLetters,
      isPlacingWord: true
    }));

    // Retirer la lettre du rack temporairement
    const newPlayerRack = gameState.playerRack.filter(letter => letter.id !== selectedLetterId);
    setGameState(prev => ({
      ...prev,
      playerRack: newPlayerRack
    }));

    setSelectedLetterId(undefined);
  };

  const handleValidateWord = () => {
    if (!gameState.isPlacingWord || gameState.tempPlacedLetters.length === 0) return;

    // Vérifier que les lettres temporaires sont connectées aux lettres permanentes
    const allLetters = [...gameState.placedLetters, ...gameState.tempPlacedLetters];
    const isFirstMove = gameState.placedLetters.length === 0;
    
    // Valider le placement selon les règles officielles
    const placementValidation = ruleValidator.validateWordPlacement(
      gameState.tempPlacedLetters.map(l => l.letter).join(''),
      gameState.tempPlacedLetters.map(l => l.position),
      gameState.placedLetters,
      isFirstMove
    );

    if (!placementValidation.isValid) {
      error(placementValidation.errors[0], undefined, 'right');
      return;
    }

    // Utiliser la validation en temps réel déjà calculée
    if (wordValidation.isValid && wordValidation.words.length > 0) {
      // Mettre à jour l'état du jeu
      const newPlayerScore = gameState.playerScore + wordValidation.totalScore;
      
      // Tirer de nouvelles lettres
      const newLetters = letterBag.draw(gameState.tempPlacedLetters.length);
      const newPlayerRack = [...gameState.playerRack, ...newLetters.map(letter => ({
        letter: letter.letter,
        score: letter.score,
        id: letter.id
      }))];

      setGameState(prev => ({
        ...prev,
        placedLetters: allLetters,
        playerRack: newPlayerRack,
        playerScore: newPlayerScore,
        tempPlacedLetters: [],
        isPlacingWord: false,
        currentTurn: 'ai',
        consecutivePasses: 0,
        lastPlayerToPlay: 'player'
      }));

      success(`Mot validé ! Score : ${wordValidation.totalScore} points`, undefined, 'right');
    } else {
      error('Mot invalide. Vérifiez que tous les mots formés sont valides.', undefined, 'right');
    }
  };

  const handleCancelWord = () => {
    if (!gameState.isPlacingWord) return;

    // Remettre les lettres dans le rack
    const tempLetters = gameState.tempPlacedLetters.map(letter => ({
      letter: letter.letter,
      score: letter.score,
      id: `temp_${Math.random().toString(36).substr(2, 9)}`
    }));

    setGameState(prev => ({
      ...prev,
      playerRack: [...prev.playerRack, ...tempLetters],
      tempPlacedLetters: [],
      isPlacingWord: false
    }));

    setWordValidation({
      words: [],
      totalScore: 0,
      isValid: true,
      errors: []
    });
    setWordScores([]);
  };

  const handlePassTurn = () => {
    if (gameState.currentTurn !== 'player' || gameState.isPlacingWord) return;
    setGameState(prev => ({
      ...prev,
      currentTurn: 'ai',
      consecutivePasses: prev.consecutivePasses + 1,
      isPlacingWord: false,
      tempPlacedLetters: []
    }));
    info('Vous passez votre tour', undefined, 'right');
  };

  const handleExchangeLetters = () => {
    if (gameState.currentTurn === 'player' && !gameState.gameOver) {
      setShowLetterExchange(true);
    }
  };

  const handleExchangeConfirm = (letterIds: string[]) => {
    if (letterIds.length === 0) return;
    setGameState(prev => ({
      ...prev,
      playerRack: prev.playerRack.filter(l => !letterIds.includes(l.id)),
      currentTurn: 'ai',
      consecutivePasses: 0,
      isPlacingWord: false,
      tempPlacedLetters: []
    }));
    info(`Vous avez échangé ${letterIds.length} lettre${letterIds.length > 1 ? 's' : ''}`, undefined, 'right');
  };

  const handleNewGame = () => {
    letterBag.reset();
    letterBag.shuffle();
    const playerRack = letterBag.draw(7);
    const aiRack = letterBag.draw(7);
    
    setGameState({
      playerRack: playerRack.map(letter => ({
        ...letter,
        id: letter.id
      })),
      aiRack: aiRack.map(letter => ({
        ...letter,
        id: letter.id
      })),
      placedLetters: [],
      currentTurn: 'player',
      playerScore: 0,
      aiScore: 0,
      gameOver: false,
      winner: null,
      tempPlacedLetters: [],
      isPlacingWord: false,
      consecutivePasses: 0,
      lastPlayerToPlay: '',
    });

    setSelectedLetterId(undefined);
    setWordValidation({
      words: [],
      totalScore: 0,
      isValid: true,
      errors: []
    });
    setWordScores([]);
    success('Nouvelle partie commencée !', undefined, 'right');
  };

  const isMyTurn = gameState.currentTurn === 'player' && !gameState.gameOver;
  const canExchange = letterBag.getRemainingCount() >= gameState.playerRack.length;

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link 
            href="/game/solo" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Retour à la configuration
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Partie Solo</h1>
              <p className="text-gray-600 mt-2">
                Contre {ai.getName()} ({ai.getDifficulty()})
              </p>
            </div>
            <div className="flex gap-4">
              {gameState.isPlacingWord && (
                <>
                  <button
                    onClick={handleValidateWord}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Valider le mot
                  </button>
                  <button
                    onClick={handleCancelWord}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Annuler
                  </button>
                </>
              )}
              <button
                onClick={handlePassTurn}
                disabled={gameState.currentTurn !== 'player' || gameState.isPlacingWord}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Passer
              </button>
              <button
                onClick={handleNewGame}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Nouvelle partie
              </button>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Votre score</h2>
            <div className="text-2xl md:text-3xl font-bold text-blue-600">{gameState.playerScore}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Score de l&apos;IA</h2>
            <div className="text-2xl md:text-3xl font-bold text-red-600">{gameState.aiScore}</div>
          </div>
        </div>

        {/* Tour actuel, Fin de partie ou État du mot */}
        <div className="mb-6">
          {gameState.gameOver ? (
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 text-center">
              <h2 className="text-xl font-bold text-yellow-800 mb-2">
                {gameState.winner === 'player' ? '🎉 Vous avez gagné !' : 
                 gameState.winner === 'ai' ? `😔 ${ai.getName()} a gagné !` : 
                 '🤝 Match nul !'}
              </h2>
              <p className="text-yellow-700">
                Score final : Vous {gameState.playerScore} - {ai.getName()} {gameState.aiScore}
              </p>
            </div>
          ) : gameState.isPlacingWord ? (
            <div className={`inline-block px-4 py-2 rounded-lg font-medium ${
              wordValidation.isValid && wordValidation.words.length > 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {wordValidation.isValid && wordValidation.words.length > 0
                ? `✅ Mot valide (${wordValidation.totalScore} points)`
                : '❌ Mot invalide'
              }
            </div>
          ) : (
            <div className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium shadow-sm transition-all duration-300 ${
              gameState.currentTurn === 'player' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
            }`}>
              {gameState.currentTurn === 'player' ? (
                <>
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span>Votre tour</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                  <span>{ai.getName()} réfléchit...</span>
                  {isThinking && <span className="text-2xl">🤔</span>}
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Grille de jeu */}
          <div className="lg:col-span-2">
            <div className={`bg-white rounded-lg shadow-sm border p-4 md:p-6 transition-all duration-300 ${
              gameState.currentTurn === 'ai' && !gameState.gameOver
                ? 'border-purple-300 bg-purple-50'
                : 'border-gray-200'
            }`}>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                Grille de jeu
                {gameState.currentTurn === 'ai' && !gameState.gameOver && (
                  <span className="text-sm text-purple-600 font-normal animate-pulse">
                    (Tour de {ai.getName()})
                  </span>
                )}
              </h2>
              <div className="flex justify-center">
                <Grid
                  placedLetters={[...gameState.placedLetters, ...gameState.tempPlacedLetters]}
                  onTileClick={handleTileClick}
                  className={`max-w-full transition-all duration-300 ${
                    gameState.currentTurn === 'ai' && !gameState.gameOver
                      ? 'opacity-75'
                      : 'opacity-100'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Panneau latéral */}
          <div className="lg:col-span-2">
            <div className="space-y-4 md:space-y-6">
              {/* Rack du joueur */}
              <PlayerRack
                letters={gameState.playerRack}
                selectedLetterId={selectedLetterId}
                onLetterClick={handleLetterClick}
                isMyTurn={isMyTurn}
                showActions={true}
                onPassTurn={handlePassTurn}
                onExchangeLetters={handleExchangeLetters}
                canExchange={canExchange}
              />

              {/* Rack de l'IA */}
              <div className={`p-4 rounded-lg transition-all duration-300 ${
                gameState.currentTurn === 'ai' && !gameState.gameOver
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700'
                  : 'bg-gray-800'
              }`}>
                <h3 className={`font-medium mb-3 flex items-center gap-2 ${
                  gameState.currentTurn === 'ai' && !gameState.gameOver
                    ? 'text-white'
                    : 'text-white'
                }`}>
                  Lettres de {ai.getName()}
                  {gameState.currentTurn === 'ai' && !gameState.gameOver && (
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  )}
                </h3>
                <div className="flex gap-1 justify-center">
                  {gameState.aiRack.map((letter) => (
                    <div
                      key={letter.id}
                      className={`w-10 h-10 border rounded flex items-center justify-center font-bold transition-all duration-300 ${
                        gameState.currentTurn === 'ai' && !gameState.gameOver
                          ? 'bg-purple-500 border-purple-400 text-white'
                          : 'bg-gray-700 border-gray-600 text-white'
                      }`}
                    >
                      ?
                    </div>
                  ))}
                </div>
                <div className={`text-sm text-center mt-2 ${
                  gameState.currentTurn === 'ai' && !gameState.gameOver
                    ? 'text-purple-100'
                    : 'text-white'
                }`}>
                  {gameState.aiRack.length}/7 lettres
                </div>
              </div>

              {/* Mots formés */}
              <WordDisplay 
                words={wordValidation.words}
                totalScore={wordValidation.totalScore}
              />

              {/* Détails des scores */}
              <ScoreDetails wordScores={wordScores} />

              {/* Test du dictionnaire (visible seulement en développement) */}
              <DictionaryTest 
                isVisible={process.env.NODE_ENV === 'development'}
              />

              {/* Statistiques de jeu */}
              <GameStats
                placedLetters={gameState.placedLetters.length}
                remainingLetters={letterBag.getRemainingCount()}
                currentTurn={gameState.currentTurn === 'player' ? 'Joueur' : ai.getName()}
                isGameOver={gameState.gameOver}
                className="text-xs md:text-base"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation mobile */}
      <MobileNav
        onPass={handlePassTurn}
        onNewGame={handleNewGame}
        onValidateWord={handleValidateWord}
        onCancelWord={handleCancelWord}
        backUrl="/game/solo"
        backLabel="Configuration"
        isMyTurn={gameState.currentTurn === 'player'}
        isPlacingWord={gameState.isPlacingWord}
        className="md:text-base text-xs py-2 md:py-4"
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Modales */}
      <JokerSelector
        isOpen={showJokerSelector}
        onClose={() => setShowJokerSelector(false)}
        onSelectLetter={handleJokerSelect}
      />

      <LetterExchange
        isOpen={showLetterExchange}
        onClose={() => setShowLetterExchange(false)}
        onExchange={handleExchangeConfirm}
        playerRack={gameState.playerRack}
        maxExchangeCount={gameState.playerRack.length}
      />

      {/* Indicateur de chargement pour l'IA */}
      {isThinking && (
        <div className="fixed top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center gap-3 z-50 animate-fade-in">
          <LoadingSpinner />
          <div>
            <div className="font-medium text-gray-900">{ai.getName()} réfléchit...</div>
            <div className="text-sm text-gray-500">Trouve le meilleur coup</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SoloPlayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SoloPlayPageContent />
    </Suspense>
  );
} 
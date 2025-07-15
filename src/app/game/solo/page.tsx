"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SoloGamePage() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleStartGame = () => {
    router.push(`/game/solo/play?difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Mode Solo</h1>
          <p className="text-gray-600 mt-2">
            Jouez contre l'IA avec différents niveaux de difficulté
          </p>
        </div>

        {/* Game Setup */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Configuration de la partie
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre d'IA
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="1">1 IA</option>
                <option value="2">2 IA</option>
                <option value="3">3 IA</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau de difficulté
              </label>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </div>

            <button 
              onClick={handleStartGame}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Commencer la partie
            </button>
          </div>
        </div>

        {/* Game Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Comment jouer</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Cliquez sur une lettre de votre rack pour la sélectionner</li>
            <li>• Cliquez sur une case de la grille pour placer la lettre</li>
            <li>• Formez des mots valides pour marquer des points</li>
            <li>• L'IA jouera automatiquement après votre tour</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
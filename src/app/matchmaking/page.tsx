import Link from "next/link";

export default function MatchmakingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Matchmaking</h1>
          <p className="text-gray-600 mt-2">
            Rejoignez automatiquement une partie 1v1 ou 2v2
          </p>
        </div>

        {/* Game Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-3xl mb-4">⚔️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">1v1</h2>
              <p className="text-gray-600 text-sm mb-4">
                Affrontez un autre joueur en duel
              </p>
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Rechercher un adversaire
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-3xl mb-4">👥</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">2v2</h2>
              <p className="text-gray-600 text-sm mb-4">
                Jouez en équipe de 2 contre 2
              </p>
              <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Rechercher une équipe
              </button>
            </div>
          </div>
        </div>

        {/* Player Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vos statistiques</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Parties jouées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Victoires</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">0%</div>
              <div className="text-sm text-gray-600">Taux de victoire</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Score moyen</div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Paramètres</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre nom de joueur
              </label>
              <input 
                type="text" 
                placeholder="Entrez votre nom"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Région préférée
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="auto">Automatique</option>
                <option value="eu">Europe</option>
                <option value="na">Amérique du Nord</option>
                <option value="asia">Asie</option>
              </select>
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="ranked" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="ranked" className="ml-2 block text-sm text-gray-700">
                Parties classées uniquement
              </label>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Bientôt disponible :</strong> Le système de matchmaking sera disponible dans la prochaine version.
          </p>
        </div>
      </div>
    </div>
  );
} 
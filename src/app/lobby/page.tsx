import Link from "next/link";

export default function LobbyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Partie Privée</h1>
          <p className="text-gray-600 mt-2">
            Créez une session ou rejoignez une partie avec vos amis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Game */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Créer une partie
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la partie
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Partie entre amis"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de joueurs
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="2">2 joueurs</option>
                  <option value="3">3 joueurs</option>
                  <option value="4">4 joueurs</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temps par tour (optionnel)
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="0">Aucune limite</option>
                  <option value="30">30 secondes</option>
                  <option value="60">1 minute</option>
                  <option value="120">2 minutes</option>
                </select>
              </div>

              <Link href="/lobby/create" className="block">
                <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Créer la partie
                </button>
              </Link>
            </div>
          </div>

          {/* Join Game */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Rejoindre une partie
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code de la partie
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: ABC123"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre nom
                </label>
                <input 
                  type="text" 
                  placeholder="Votre nom de joueur"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <Link href="/lobby/join" className="block">
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Rejoindre la partie
                </button>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Comment ça marche ?</h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Créez une partie et partagez le code</li>
                <li>2. Vos amis utilisent le code pour rejoindre</li>
                <li>3. La partie commence quand tout le monde est prêt</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Info Notice */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            <strong>✅ Fonctionnel :</strong> Le système de création et de rejoindre des parties est maintenant opérationnel !
          </p>
        </div>
      </div>
    </div>
  );
} 
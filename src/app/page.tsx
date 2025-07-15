import Link from "next/link";

const GameModeCard = ({ 
  title, 
  description, 
  href, 
  icon, 
  comingSoon = false 
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
  comingSoon?: boolean;
}) => {
  const CardContent = () => (
    <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      {comingSoon && (
        <span className="inline-block mt-3 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
          Bientôt disponible
        </span>
      )}
    </div>
  );

  if (comingSoon) {
    return <CardContent />;
  }

  return (
    <Link href={href} className="block">
      <CardContent />
    </Link>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Better Scrabble
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Jouez au Scrabble en ligne avec une interface épurée et intuitive. 
            Créez des parties privées ou affrontez l&apos;IA.
          </p>
        </div>

        {/* Game Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          <GameModeCard
            title="Mode Solo"
            description="Jouez contre 1 à 3 IA avec différents niveaux de difficulté"
            href="/game/solo"
            icon="🤖"
          />
          
          <GameModeCard
            title="Partie Privée"
            description="Créez une session via lien ou code pour jouer entre amis"
            href="/lobby"
            icon="👥"
          />
          
          <GameModeCard
            title="Matchmaking"
            description="Rejoignez automatiquement une partie 1v1 ou 2v2"
            href="/matchmaking"
            icon="🎯"
            comingSoon={true}
          />
        </div>

        {/* Features Preview */}
        <div className="mt-12 md:mt-16 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 md:mb-8">
            Fonctionnalités
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl mb-2">📱</div>
              <p className="text-sm text-gray-600">Responsive</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-sm text-gray-600">Temps réel</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm text-gray-600">Validation</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-sm text-gray-600">Scores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

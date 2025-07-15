# Better Scrabble 🎯

Une application de Scrabble en ligne avec une interface épurée et intuitive, inspirée de Wordle et Lichess.

## 🚀 Fonctionnalités

### ✅ Implémentées

- **Règles officielles du Scrabble français** complètement respectées
- **Distribution des lettres officielle** (102 jetons, 2 jokers)
- **Grille de Scrabble 15x15** avec bonus officiels et animations
- **Système de placement de lettres** interactif avec validation stricte
- **Jokers (lettres blanches)** avec sélection de lettre
- **Rack de lettres du joueur** avec actions (Passer, Échanger)
- **Dictionnaire français complet** (JSON) pour validation des mots
- **Système de score officiel** avec bonus de cases et bingo (+50 points)
- **Mode solo contre IA** avec 3 niveaux de difficulté
- **IA intelligente** qui respecte strictement les mêmes règles que le joueur
- **Parties multijoueur privées** avec lobby et synchronisation
- **Règles de fin de partie officielles** (bonus des lettres restantes)
- **Système de notifications** avec toasts élégants
- **Navigation mobile** optimisée avec barre d'actions
- **Animations et transitions** fluides

### 🔄 En développement

- Contestation de mots avec timer
- Matchmaking public
- Chat en temps réel
- Mode spectateur
- Système de classement
- Historique des parties

## 🛠️ Technologies

- **Next.js 15** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS v4** pour le styling
- **React 19** avec hooks modernes

## 📦 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd better-scrabble

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

L'application sera disponible sur `http://localhost:3000`

## 🎮 Comment jouer

### Mode Solo

1. **Accueil** → **Mode Solo** → Choisissez la difficulté
2. **Placement** : Cliquez sur une lettre puis sur une case de la grille
3. **Jokers** : Cliquez sur un joker (★) pour choisir la lettre à représenter
4. **Actions** : Utilisez "Passer" ou "Échanger" si nécessaire
5. **Validation** : Les mots sont automatiquement validés et scorés
6. **Tour de l'IA** : L'IA joue automatiquement après votre tour
7. **Fin de partie** : Quand un joueur termine ET le sac est vide, le gagnant est déterminé

### Mode Multijoueur

1. **Accueil** → **Partie Privée** → Créez ou rejoignez un lobby
2. **Lobby** : Attendez que tous les joueurs soient prêts
3. **Jeu** : Jouez à tour de rôle avec synchronisation en temps réel

## 📁 Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── game/              # Pages de jeu
│   ├── lobby/             # Pages de lobby
│   └── matchmaking/       # Pages de matchmaking
├── components/            # Composants React
│   ├── grid/             # Composants de grille
│   ├── tile/             # Composants de cases
│   ├── player-panel/     # Composants d'interface joueur
│   └── chat/             # Composants de chat
└── lib/                  # Utilitaires et logique métier
    ├── dictionary/       # Dictionnaire JSON et validation
    ├── ai/              # Logique IA
    └── realtime/        # Communication temps réel
```

## 🎨 Design System

- **Couleurs** : Fond clair (#f5f5f5), accents doux (#3b82f6, #4ade80)
- **Typographie** : Inter, sans-serif
- **Responsive** : Mobile-first design
- **Accessibilité** : Support clavier et lecteurs d'écran

## 🚧 Prochaines étapes

1. **Matchmaking public** : Système de recherche de parties
2. **Chat en temps réel** : Communication entre joueurs
3. **Mode spectateur** : Observer les parties en cours
4. **Système de classement** : Classements et statistiques
5. **Historique des parties** : Sauvegarde et replay
6. **Optimisations IA** : Algorithmes plus avancés

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- Signaler des bugs
- Proposer des améliorations
- Ajouter de nouvelles fonctionnalités

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

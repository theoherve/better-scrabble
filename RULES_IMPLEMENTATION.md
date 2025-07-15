# Règles Officielles du Scrabble Français - Implémentation

Ce document décrit les règles officielles du Scrabble français qui ont été implémentées dans l'application Better Scrabble.

## 🎯 Règles de Base

### Distribution des Lettres

- **102 jetons** au total
- **2 jokers** (lettres blanches) valant 0 point
- Distribution officielle française :
  - E: 15 jetons (1 point)
  - A: 9 jetons (1 point)
  - I: 8 jetons (1 point)
  - N, O, R, S, T, U: 6 jetons chacun (1 point)
  - L: 5 jetons (1 point)
  - D: 3 jetons (2 points)
  - M: 3 jetons (2 points)
  - G: 2 jetons (2 points)
  - B, C, P: 2 jetons chacun (3 points)
  - F, H, V: 2 jetons chacun (4 points)
  - J, Q: 1 jeton chacun (8 points)
  - K, W, X, Y, Z: 1 jeton chacun (10 points)

### Grille de Jeu

- **15x15 cases** (225 cases total)
- **Case centrale** : étoile, obligatoire pour le premier mot
- **Cases bonus** :
  - Cases rouges : Mot compte triple (x3)
  - Cases roses : Mot compte double (x2)
  - Cases bleues : Lettre compte triple (x3)
  - Cases cyan : Lettre compte double (x2)

## 🎮 Règles de Jeu

### Placement des Mots

1. **Premier mot** : Doit passer par la case centrale (étoile)
2. **Mots suivants** : Doivent être connectés aux mots existants
3. **Direction** : Horizontalement ou verticalement uniquement (pas de diagonale)
4. **Connexion** : Chaque nouvelle lettre doit toucher au moins une lettre existante

### Calcul des Scores

1. **Score de base** : Somme des valeurs des lettres du mot
2. **Multiplicateurs de lettres** : Appliqués en premier
3. **Multiplicateurs de mots** : Appliqués ensuite
4. **Bonus Bingo** : +50 points pour un mot de 7 lettres
5. **Multiplicateurs multiples** : Si une case est utilisée dans deux mots, elle compte pour les deux

### Jokers (Lettres Blanches)

- **Valeur** : 0 point
- **Utilisation** : Peuvent représenter n'importe quelle lettre
- **Placement** : Une fois placés, ils ne peuvent plus être remplacés
- **Sélection** : Le joueur choisit la lettre lors du placement

## 🔄 Actions de Jeu

### Placer un Mot

1. Sélectionner une lettre du rack
2. Cliquer sur une case de la grille
3. Continuer jusqu'à former un mot complet
4. Valider le mot (vérification automatique)

### Passer son Tour

- Permis à tout moment
- Le joueur ne marque aucun point
- Le tour passe au joueur suivant

### Échanger des Lettres

- Permis si au moins 7 lettres restent dans le sac
- Le joueur peut échanger 1 à 7 lettres
- Le tour passe au joueur suivant
- Aucun point marqué

### Contestation de Mots

- **Temps limité** : 30 secondes pour contester
- **Mot invalide** : Le joueur reprend ses lettres, 0 point
- **Contestation incorrecte** : -10 points au contestataire
- **Timeout** : Le mot est considéré comme valide

## 🏁 Fin de Partie

### Conditions de Fin

1. **Condition principale** : Un joueur place toutes ses lettres ET le sac est vide
2. **Condition alternative** : 6 passes consécutifs (3 par joueur)

### Calcul des Scores Finaux

1. **Déduction** : Chaque joueur perd les points de ses lettres restantes
2. **Bonus** : Le joueur qui a terminé reçoit les points des lettres restantes des autres joueurs
3. **Vainqueur** : Celui qui a le plus de points

### Exemple de Fin de Partie

- Joueur A termine avec 150 points, 0 lettre restante
- Joueur B a 120 points, 3 lettres restantes (total 8 points)
- **Score final** :
  - Joueur A : 150 + 8 = 158 points
  - Joueur B : 120 - 8 = 112 points
- **Vainqueur** : Joueur A

## 🎯 Fonctionnalités Implémentées

### ✅ Règles Complètes

- [x] Distribution officielle des lettres (102 jetons, 2 jokers)
- [x] Grille 15x15 avec bonus corrects
- [x] Calcul des scores avec multiplicateurs
- [x] Bonus bingo (+50 points pour 7 lettres)
- [x] Jokers avec sélection de lettre
- [x] Échange de lettres (perte de tour)
- [x] Passage de tour (perte de tour)
- [x] Règles de fin de partie officielles
- [x] Validation des placements (centre, connexion)
- [x] Connexion des mots (mots croisés)
- [x] Premier mot minimum 2 lettres
- [x] Contestation de mots (prêt pour implémentation)
- [x] Pénalités de contestation (-10 points)

### 🔄 Fonctionnalités Avancées

- [x] Interface pour sélectionner les jokers
- [x] Modal d'échange de lettres
- [x] Validation en temps réel des mots
- [x] Affichage détaillé des scores
- [x] Gestion des passes consécutifs
- [x] Calcul automatique des scores finaux

### 🎮 Interface Utilisateur

- [x] Rack de lettres avec actions
- [x] Indicateur de tour
- [x] Boutons d'action (Passer, Échanger)
- [x] Affichage des mots formés
- [x] Détails des bonus appliqués
- [x] Navigation mobile optimisée

## 📚 Références

- **Distribution officielle** : [Wikipedia - Lettres du Scrabble](https://fr.wikipedia.org/wiki/Lettres_du_Scrabble)
- **Règles officielles** : [Wikipedia - Scrabble](https://fr.wikipedia.org/wiki/Scrabble)
- **Dictionnaire** : L'Officiel du jeu Scrabble (implémenté avec wordsFr.json)

## 🚀 Améliorations Futures

### Fonctionnalités à Ajouter

- [ ] Contestation de mots avec timer
- [ ] Mode multijoueur avec règles complètes
- [ ] Historique des parties
- [ ] Statistiques détaillées
- [ ] Mode spectateur
- [ ] Chat en temps réel

### Optimisations

- [ ] IA plus avancée
- [ ] Performance améliorée
- [ ] Animations plus fluides
- [ ] Accessibilité renforcée

---

_Cette implémentation respecte les règles officielles du Scrabble français et offre une expérience de jeu complète et fidèle au jeu original._

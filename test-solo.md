# Test du Mode Solo 🧪

## Prérequis

- Serveur de développement lancé (`pnpm dev`)
- Navigateur ouvert sur `http://localhost:3000`

## Tests à effectuer

### 1. Navigation et Configuration

- [ ] Accéder à la page d'accueil
- [ ] Cliquer sur "Mode Solo"
- [ ] Vérifier que la page de configuration s'affiche
- [ ] Sélectionner différents niveaux de difficulté
- [ ] Cliquer sur "Commencer la partie"

### 2. Interface de Jeu

- [ ] Vérifier que la grille 15x15 s'affiche correctement
- [ ] Vérifier que le rack du joueur contient 7 lettres
- [ ] Vérifier que le rack de l'IA affiche des "?"
- [ ] Vérifier que les scores sont à 0

### 3. Placement de Lettres

- [ ] Cliquer sur une lettre du rack (doit être sélectionnée)
- [ ] Cliquer sur une case de la grille (doit placer la lettre)
- [ ] Vérifier que la lettre disparaît du rack
- [ ] Vérifier qu'une nouvelle lettre apparaît dans le rack

### 4. Validation des Mots

- [ ] Placer plusieurs lettres pour former un mot
- [ ] Vérifier que le mot est validé automatiquement
- [ ] Vérifier que le score est calculé et affiché
- [ ] Vérifier que les détails du score s'affichent

### 5. Tour de l'IA

- [ ] Après avoir placé un mot valide, vérifier que l'IA joue
- [ ] Vérifier que le message de l'IA s'affiche en toast
- [ ] Vérifier que le score de l'IA augmente
- [ ] Vérifier que le tour revient au joueur

### 6. Règles de Placement

- [ ] Essayer de placer une lettre sur une case occupée (doit être refusé)
- [ ] Essayer de placer une lettre non connectée (doit être refusé)
- [ ] Vérifier que les messages d'erreur s'affichent

### 7. Fin de Partie

- [ ] Continuer à jouer jusqu'à épuisement des lettres
- [ ] Vérifier que l'écran de fin de partie s'affiche
- [ ] Vérifier que le gagnant est correctement déterminé
- [ ] Vérifier que les scores finaux sont calculés

### 8. Responsive Design

- [ ] Tester sur mobile (réduire la fenêtre)
- [ ] Vérifier que la navigation mobile s'affiche
- [ ] Vérifier que la grille s'adapte correctement
- [ ] Tester les interactions tactiles

### 9. Nouvelles Parties

- [ ] Cliquer sur "Nouvelle partie"
- [ ] Vérifier que tout est réinitialisé
- [ ] Vérifier que les scores sont remis à 0

## Problèmes connus

- Aucun problème majeur identifié

## Notes

- L'IA peut prendre quelques secondes à réfléchir
- Les toasts s'affichent en haut à droite
- La navigation mobile apparaît en bas d'écran sur mobile

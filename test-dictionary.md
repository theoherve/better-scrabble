# Test du Dictionnaire JSON 🧪

## Prérequis

- Serveur de développement lancé (`pnpm dev`)
- Navigateur ouvert sur `http://localhost:3000`

## Tests à effectuer

### 1. Chargement du dictionnaire

- [ ] Vérifier dans la console du navigateur le message "Dictionnaire chargé: X mots français"
- [ ] Le nombre devrait être supérieur à 0 et correspondre à votre fichier JSON

### 2. Test de validation de mots

- [ ] Aller en mode solo : Accueil → Mode Solo → Commencer
- [ ] En bas à droite, vous devriez voir "Test du Dictionnaire"
- [ ] Tester des mots connus comme "maison", "voiture", "chat"
- [ ] Vérifier qu'ils sont marqués comme "valide"
- [ ] Tester des mots inventés comme "xyzabc"
- [ ] Vérifier qu'ils sont marqués comme "invalide"

### 3. Test de recherche par lettre

- [ ] Dans le test du dictionnaire, entrer une lettre (ex: "a")
- [ ] Cliquer sur "Chercher"
- [ ] Vérifier que des mots commençant par cette lettre s'affichent
- [ ] Tester avec différentes lettres

### 4. Test en jeu

- [ ] Placer des lettres pour former des mots valides
- [ ] Vérifier que la validation fonctionne en temps réel
- [ ] Tester avec des mots longs et courts
- [ ] Vérifier que l'IA utilise aussi le nouveau dictionnaire

## Mots de test recommandés

### Mots valides (devraient être acceptés)

- "maison"
- "voiture"
- "chat"
- "chien"
- "table"
- "livre"
- "porte"
- "fenetre"

### Mots invalides (devraient être refusés)

- "xyzabc"
- "qwerty"
- "abcdef"
- "123456"

## Problèmes connus

- Aucun problème majeur identifié

## Notes

- Le dictionnaire est chargé au démarrage de l'application
- La validation est insensible à la casse
- L'IA utilise automatiquement le nouveau dictionnaire

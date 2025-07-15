# Test des Règles de l'IA 🧪

## Problème identifié

L'IA pouvait placer des mots non connectés aux mots existants, ce qui violait les règles officielles du Scrabble.

## Correction apportée

L'IA utilise maintenant le même `GameRuleValidator` que le joueur pour valider ses placements.

## Test à effectuer

### 1. Test du premier coup

- [ ] L'IA place son premier mot au centre
- [ ] Le mot fait au moins 2 lettres
- [ ] Le mot est valide dans le dictionnaire

### 2. Test des coups suivants

- [ ] L'IA ne peut plus placer de mots isolés
- [ ] Tous les mots de l'IA sont connectés aux mots existants
- [ ] Les mots sont alignés horizontalement ou verticalement
- [ ] Au moins une lettre du nouveau mot touche un mot existant

### 3. Scénario de test recommandé

1. **Premier coup joueur** : Placez "MAISON" au centre
2. **Premier coup IA** : L'IA devrait placer un mot connecté à "MAISON"
3. **Deuxième coup joueur** : Placez un mot connecté
4. **Vérification** : L'IA ne devrait jamais placer de mots isolés

## Règles vérifiées

- ✅ Premier mot au centre
- ✅ Premier mot minimum 2 lettres
- ✅ Connexion obligatoire après le premier coup
- ✅ Alignement horizontal/vertical uniquement
- ✅ Validation avec le même système que le joueur

## Résultat attendu

L'IA respecte maintenant strictement les règles officielles du Scrabble français, exactement comme le joueur.

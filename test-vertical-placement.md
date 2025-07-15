# Test du Placement Vertical 🧪

## Problème identifié

Le système ne permettait que le placement horizontal des mots, empêchant le placement vertical qui est pourtant autorisé dans les règles du Scrabble.

## Correction apportée

Suppression de la validation de cohérence trop restrictive qui forçait le joueur à continuer dans la même direction dès la première lettre.

## Test à effectuer

### 1. Test du placement vertical libre

- [ ] Allez en mode solo : `http://localhost:3000/game/solo`
- [ ] Placez votre premier mot horizontalement au centre (ex: "MAISON")
- [ ] Pour votre deuxième mot, placez une lettre au-dessus ou en-dessous d'une lettre de "MAISON"
- [ ] Placez une deuxième lettre dans la même colonne pour former un mot vertical
- [ ] Validez le mot - cela devrait fonctionner

### 2. Test du placement horizontal

- [ ] Placez une lettre à gauche ou à droite d'une lettre existante
- [ ] Placez une deuxième lettre dans la même ligne
- [ ] Validez le mot - cela devrait fonctionner

### 3. Test de la liberté de direction

- [ ] Vous devriez pouvoir choisir librement la direction de votre mot
- [ ] Horizontal : lettres alignées sur la même ligne
- [ ] Vertical : lettres alignées sur la même colonne
- [ ] Pas de contrainte de direction imposée par le système

## Exemples de placements valides

### Premier coup (au centre)

```
    M A I S O N
```

### Deuxième coup (vertical)

```
    M
    A
    I
    S
    O
    N
    C
    H
    A
    T
```

### Troisième coup (horizontal)

```
    M A I S O N
    C H A T
```

## Règles vérifiées

- ✅ Placement horizontal autorisé
- ✅ Placement vertical autorisé
- ✅ Liberté de choix de direction
- ✅ Connexion aux mots existants respectée
- ✅ Validation finale du mot cohérente

## Résultat attendu

Vous pouvez maintenant placer des mots dans n'importe quelle direction (horizontale ou verticale) tant qu'ils respectent les règles de connexion du Scrabble.

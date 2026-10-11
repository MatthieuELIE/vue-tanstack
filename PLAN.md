# Plan — Data Table TanStack

Table de données locale (mock, pas d'API) avec tri, filtre, pagination et sélection de lignes, stylée avec Tailwind CSS.

## 1. Tailwind

- Ajouter `tailwindcss` + `@tailwindcss/vite` (v4, plugin Vite natif)
- Plugin dans `vite.config.ts`
- `@import "tailwindcss";` dans un CSS global importé depuis `main.ts`

## 2. Données

- `src/data/people.ts` : interface `Person` + tableau mock typé

## 3. Colonnes

- `src/components/data-table/selectColumn.ts` et `src/components/data-table/actionsColumn.ts` : une factory par colonne `display` **générique**, une par fichier (single responsibility), composées directement autour des colonnes métier reçues en entrée (détail dans la section 5, "Colonnes générique + métier") :
    - `selectColumn()` (tout à gauche) : header = checkbox "tout sélectionner", cell = checkbox de ligne, toutes deux rendues par `DataTableRowCheckbox.vue`
    - `actionsColumn()` (tout à droite) : cell rendue via le slot `row-actions` (défaut `DataTableRowActions.vue`)
- Fichiers séparés du composant (single responsibility : définition de colonnes ≠ rendu). Les colonnes accessor propres à `Person` sont définies à côté de `usePeople.ts`, pas ici (voir section 6, Métier people du backlog).

## 4. Composants (SOLID, single responsibility, dumb/générique)

Voir `README.md` pour les conventions de code.

- `DataTable.vue` : composant conteneur générique, orchestration uniquement — reçoit `data`/`columns` en props, appelle `useDataTable` (cf. section Composables) pour tout le state UI, compose les sous-composants ci-dessous via props/events, remonte les intentions métier (`edit`, `delete`, `save` — avec le `patch` des valeurs éditées, `cancel`, `action`, ...) à l'appelant sans les interpréter, et remonte la sélection courante via `update:selectedIds` (ids métier des lignes sélectionnées)
- `DataTableTitleBar.vue` : bandeau titre en haut du tableau — prop `title` (défaut, ex. `"Data table"`) affiché si aucun contenu n'est fourni ; expose un slot nommé `header` pour injecter un composant précis à la place du titre par défaut
- `DataTableToolbar.vue` : input de filtre global — reçoit `modelValue`, émet `update:modelValue`, aucune logique de filtrage
- `DataTableColumnHeader.vue` : rendu d'un header de colonne cliquable pour le tri — reçoit l'état de tri de la colonne en props, émet un event au clic, n'appelle pas l'API TanStack directement
- `DataTableBody.vue` : rendu des lignes/cellules à partir des `rows` fournies en props
- `DataTableRowCheckbox.vue` : checkbox de sélection générique — `modelValue` / `update:modelValue` — réutilisée pour le "select all" en header de colonne et pour chaque ligne
- `DataTableRowActions.vue` : cellule actions générique tout à droite d'une ligne — prop `editing: boolean`. Deux états exclusifs : `editing === false` → boutons éditer/supprimer (events `edit`, `delete`) ; `editing === true` → boutons sauvegarder/annuler (events `save`, `cancel`). Ne connaît ni la ligne ni la table.
- `DataTableCell.vue` : cellule générique pour les colonnes de données — prop `editing: boolean` + `modelValue`. `editing === false` → `<p>{{ modelValue }}</p>` ; `editing === true` → `<input type="text" v-model="..." />` (emit `update:modelValue`). Aucune connaissance de la ligne/colonne/table.
- `DataTableFooterBar.vue` : bandeau bas du tableau, layout deux zones (gauche/droite) — slot `actions` à gauche (défaut : `DataTableFooterActions`), slot `pagination` à droite (défaut : `DataTablePagination`), chaque zone individuellement écrasable
- `DataTableFooterActions.vue` : actions génériques à gauche du footer — reçoit une prop `actions` (liste `{ key, label, disabled? }`), émet un event générique `action(key)`, ne connaît pas la nature de l'action ; la liste concrète vient de `usePeople` (composant lui-même toujours générique)
- `DataTablePagination.vue` : contrôles de pagination à droite du footer — première/dernière page, page précédente/suivante, sélection du nombre d'items par page ; reçoit l'état de pagination en props, émet des events (`first`, `prev`, `next`, `last`, `update:pageSize`), aucun accès direct à la table

Chaque sous-composant est "dumb" : il reçoit des données/état en props et remonte des intentions via events, sans connaître `useVueTable`. Seul `DataTable.vue` connaît TanStack Table.

`DataTable.vue` reçoit lui-même une prop `title` et un slot `header`, qu'il transmet tels quels à `DataTableTitleBar.vue` (pass-through) — c'est l'appelant (`App.vue`) qui décide d'un titre texte ou d'un composant custom.

Même principe pour le footer : `DataTable.vue` expose les slots `actions` et `pagination` en pass-through vers `DataTableFooterBar.vue`, pour que l'appelant puisse remplacer soit la zone actions, soit la zone pagination, soit les deux, par un composant particulier.

Même principe pour la cellule actions de ligne : `DataTableBody.vue` expose un slot scoped `row-actions` (props : la ligne, `editing`, et les handlers `onEdit`/`onDelete`/`onSave`/`onCancel`) avec `DataTableRowActions.vue` en contenu par défaut, remonté en pass-through par `DataTable.vue` — l'appelant peut fournir un composant d'actions différent.

`DataTable.vue` détient l'état d'édition (`editingRowId`, une seule ligne éditable à la fois) en plus du state TanStack. `edit` passe la ligne en mode édition (`editing: true` propagé à `DataTableRowActions` et à chaque `DataTableCell` de la ligne, qui bascule alors de `<p>` à `<input>`), `cancel`/`save` en sortent. Cliquer sur `edit` d'une autre ligne alors qu'une ligne est déjà en édition annule (`cancel`) implicitement la première avant de passer la nouvelle en édition — une seule ligne éditable à la fois, imposé par `startEditing(rowId)` dans `useDataTable`.

Pendant l'édition d'une ligne, sa checkbox de sélection (`DataTableRowCheckbox` dans la colonne `select`) est masquée, pas juste désactivée.

Écriture des valeurs au `save` : `DataTableBody.vue` bufferise les valeurs tapées dans les `DataTableCell` de la ligne en édition (par id de colonne, réinitialisé à chaque changement de ligne éditée) et les remonte comme second argument de l'event `save` (`patch: Record<string, string>`), relayé tel quel par `DataTable.vue`. C'est l'appelant (`usePeople`/`App.vue`) qui persiste ce `patch` (`savePerson(id, patch)`) — `DataTable.vue` ne connaît toujours pas `Person`.

## 5. Composables

- `useDataTable.ts` : composable **générique**, réutilisable pour n'importe quelle donnée — reçoit `data` et `columns` (refs/computed), instancie `useVueTable` en interne, détient tout le state UI générique (`sorting`, `globalFilter`, `pagination`, `rowSelection`, `editingRowId`), expose l'instance de table + le state + des helpers génériques (`startEditing(rowId)`, `stopEditing()`). Aucune connaissance du métier (pas de "Person", pas de sens donné à "delete"/"save"). C'est ce composable que `DataTable.vue` appelle en interne.
- `usePeople.ts` : composable **métier**, propre à ce cas d'usage — détient les données mock `Person[]`, fournit les colonnes people-spécifiques (accessor, définies à côté de `usePeople`, pas dans `data-table/`), implémente la logique métier des actions (`savePerson` sur une ligne, ...) déclenchée par les events remontés depuis `DataTable.vue`. Appelé par la vue consommatrice (`App.vue`), pas par `DataTable.vue` lui-même — c'est ce qui garde `DataTable.vue` générique et réutilisable pour d'autres données que `Person`.
    - Fournit la liste d'actions du footer (clés remontées par `action(key)`) :
        - `reload` — recharge les données
        - `add` — ouvre la `Modal` avec `PeopleForm` pour créer une ligne
        - `delete` — supprime les lignes sélectionnées (désactivée si aucune sélection)
        - `duplicate` — duplique la/les ligne(s) sélectionnée(s), plusieurs lignes à la fois autorisé (désactivée si aucune sélection)
        - `export-csv` — exporte les lignes sélectionnées en CSV (désactivée si aucune sélection)
    - Chaque action passe par `fakeApi` (cf. plus bas) : `loading` pendant l'appel simulé (→ `Loader`), `error` en cas d'échec simulé (→ `Banner` superposée au tableau)

### Colonnes générique + métier

Pour rester cohérent avec la séparation composable générique/métier : `usePeople` ne fournit que les colonnes accessor propres à `Person` (nom, email, etc.). C'est `useDataTable` qui compose, autour de ces colonnes métier, `selectColumn()` et `actionsColumn()` — génériques, valables pour n'importe quel jeu de colonnes (`[selectColumn(), ...columns, actionsColumn()]`) ; les colonnes `Person` vivent à côté de `usePeople.ts`.

### Simulation d'API (fake)

- `src/lib/fakeApi.ts` : le plus simple possible — un wrapper `Promise` autour d'un `setTimeout` pour simuler la latence, avec un taux d'échec aléatoire pour déclencher le cas d'erreur. Pas de vraie couche HTTP.
- `usePeople` enveloppe chacune de ses actions (`reload`, `add`, `delete`, `duplicate`, `save`, `export-csv`) avec `fakeApi`, expose `loading`/`error` en `ref`, consommés respectivement par `Loader` et `Banner`.

## 6. Composants globaux (réutilisables, pas spécifiques à la data table)

- `src/components/ui/BaseLoader.vue` : indicateur de chargement générique, dumb, aucune logique métier
- `src/components/ui/BaseModal.vue` : contenu au premier plan avec backdrop — `<Teleport to="body">` (natif Vue), prop `modelValue: boolean` (v-model), un unique slot par défaut pour le contenu, ferme au clic sur le backdrop, émet `update:modelValue`. La modale ne connaît que son ouverture/fermeture, rien du contenu injecté (ex : un futur `PeopleForm.vue` pour créer/éditer un `Person`, branché côté `usePeople`/`App.vue`).
- `src/components/ui/BaseBanner.vue` : bannière superposée par-dessus le tableau (pas plein écran, contrairement à la modal) pour signaler l'échec d'un appel API — prop `message: string`

Composants indépendants du domaine `DataTable`, réutilisables ailleurs dans l'app. Leur branchement réel (ex: `Banner` affichée automatiquement quand `usePeople` échoue) viendra quand la gestion d'erreurs/API sera dans le scope — pour l'instant la donnée est un mock local, pas d'appel API.

## 7. Intégration

- `App.vue` déclare `selectedIds` et appelle `usePeople(selectedIds)` pour obtenir data/columns/actions, et les passe en props/listeners à `<DataTable>`
- `<DataTable :data :columns @edit @delete @save @action @update:selected-ids>` reste agnostique du métier ; c'est `usePeople` qui sait ce que "delete" ou "save" (avec son `patch`) signifient pour un `Person`
- L'édition d'une ligne existante se fait entièrement via le mécanisme inline de `DataTable` (`edit`/`save`/`cancel`) ; la `Modal`/`PeopleForm` ne sert qu'à la création (action `add`)

## Hors scope pour l'instant

- Pas de Pinia/store
- Pas de vraie couche fetch/API (juste `fakeApi`, cf. section Composables)
- Pas de fichier de types séparé
- Pas de colonnes réordonnables/resizables
- Pas de framework de test (vitest/vue-test-utils) — vérification manuelle via l'"Attendu" de chaque US

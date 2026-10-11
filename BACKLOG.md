# Backlog — Data Table TanStack

Découpage de `PLAN.md` en US indépendantes, chacune implémentable par une session différente. Respecter `README.md` (SOLID, composants dumb/génériques) sur toutes les US.

## Suivi

Une case cochée = US implémentée ET vérifiée (attendu respecté). Une session ne doit démarrer une US que si toutes ses dépendances (indiquées dans chaque fiche) sont déjà cochées. Cocher la case ici fait foi de l'avancement — c'est la première chose qu'une nouvelle session doit lire.

- [x] US-01 — Intégrer Tailwind CSS
- [x] US-02 — Mock data `Person`
- [x] US-03 — `fakeApi`
- [x] US-04 — `useDataTable`
- [x] US-05 — Colonnes génériques `select` + `actions`
- [x] US-06 — `BaseLoader.vue`
- [x] US-07 — `BaseModal.vue`
- [x] US-08 — `BaseBanner.vue`
- [x] US-09 — `DataTableRowCheckbox.vue`
- [x] US-10 — `DataTableCell.vue`
- [x] US-11 — `DataTableRowActions.vue`
- [x] US-12 — `DataTableColumnHeader.vue`
- [x] US-13 — `DataTableToolbar.vue`
- [x] US-14 — `DataTableTitleBar.vue`
- [x] US-15 — `DataTableFooterActions.vue`
- [x] US-16 — `DataTablePagination.vue`
- [x] US-17 — `DataTableFooterBar.vue`
- [x] US-18 — `DataTableBody.vue`
- [x] US-19 — `DataTable.vue`
- [x] US-20 — Colonnes `Person`
- [x] US-21 — `usePeople.ts`
- [x] US-22 — `PeopleForm.vue`
- [x] US-23 — Branchement `App.vue`

Convention par US :
- **Dépend de** : US à avoir mergées avant de commencer
- **Fichiers** : ce que l'US touche (et rien d'autre)
- **Quoi faire** : les étapes
- **Attendu** : critères d'acceptation, ce qui doit être observable/vrai une fois l'US terminée

Les US d'une même phase sont indépendantes entre elles (parallélisables). Une phase dépend en général de la précédente.

---

## Phase 0 — Setup

### US-01 — Intégrer Tailwind CSS

- **Dépend de** : aucune
- **Fichiers** : `package.json`, `vite.config.ts`, un CSS global (nouveau, ex. `src/assets/main.css`), `src/main.ts`
- **Quoi faire** :
  - Ajouter `tailwindcss` + `@tailwindcss/vite`
  - Enregistrer le plugin dans `vite.config.ts`
  - `@import "tailwindcss";` dans le CSS global, importé dans `main.ts`
- **Attendu** :
  - `npm run dev` démarre sans erreur
  - Une classe Tailwind (ex. `text-red-500`) appliquée dans `App.vue` produit visuellement l'effet attendu

---

## Phase 1 — Fondations données & composable générique

### US-02 — Mock data `Person`

- **Dépend de** : aucune
- **Fichiers** : `src/data/people.ts` (nouveau)
- **Quoi faire** : interface `Person` (id, et quelques champs texte simples type nom/email) + tableau mock d'une dizaine d'entrées, typé
- **Attendu** : `import { people } from '@/data/people'` retourne un tableau de `Person[]` valide en TS, `npm run type-check` passe

### US-03 — `fakeApi` (simulation d'appel réseau)

- **Dépend de** : aucune
- **Fichiers** : `src/lib/fakeApi.ts` (nouveau)
- **Quoi faire** : une fonction générique `fakeApi<T>(result: T, opts?: { delayMs?: number; failRate?: number }): Promise<T>` qui résout après un `setTimeout`, et rejette aléatoirement selon `failRate` (défaut raisonnable, ex. 300ms / 10%)
- **Attendu** :
  - Appelée sans erreur simulée, elle résout avec `result` après le délai
  - Sur un grand nombre d'appels, une proportion proche de `failRate` rejette (test manuel ou petit script, pas besoin de suite de tests)

### US-04 — `useDataTable` (composable générique)

- **Dépend de** : aucune (mais consommé par US-19 et suivants)
- **Fichiers** : `src/composables/useDataTable.ts` (nouveau)
- **Quoi faire** :
  - Reçoit `data: Ref<TData[]>` et `columns: ColumnDef<TData>[]` (génériques, aucune référence à `Person`)
  - Instancie `useVueTable` avec `getCoreRowModel`, `getSortedRowModel`, `getFilteredRowModel`, `getPaginationRowModel`
  - State interne en `ref` : `sorting`, `globalFilter`, `pagination`, `rowSelection`, `editingRowId`
  - Expose : l'instance de table, les refs de state, `startEditing(rowId)` (annule l'édition en cours s'il y en a une, puis démarre la nouvelle), `stopEditing()`
- **Attendu** :
  - Utilisable avec n'importe quel type de données (vérifier avec un type autre que `Person` dans un mini test/exemple)
  - `startEditing('a')` puis `startEditing('b')` laisse `editingRowId === 'b'` uniquement
  - Aucun import ni référence métier dans le fichier

### US-05 — Colonnes génériques `select` + `actions`

- **Dépend de** : US-09 (`DataTableRowCheckbox.vue`) pour le rendu de la colonne `select`
- **Fichiers** : `src/components/data-table/selectColumn.ts`, `src/components/data-table/actionsColumn.ts` (nouveaux)
- **Quoi faire** : une factory par colonne — `selectColumn<TData>(): ColumnDef<TData>` (header + cell = `DataTableRowCheckbox`) et `actionsColumn<TData>(): ColumnDef<TData>` (cell = marqueur/placeholder consommé plus tard par le slot `row-actions` de `DataTableBody`). Composées directement là où les colonnes de la table sont montées (ex. `[selectColumn(), ...columns, actionsColumn()]`), pas via un helper intermédiaire
- **Attendu** : chaque factory, appelée avec un type factice (pas `Person`), retourne un `ColumnDef` valide et sans aucune mention de `Person` dans les fichiers ; composées avec un tableau de colonnes `Person` factice, on obtient bien 2 colonnes de plus (une au début, une à la fin)

---

## Phase 2 — Composants globaux UI (indépendants entre eux)

### US-06 — `BaseLoader.vue`

- **Dépend de** : US-01
- **Fichiers** : `src/components/ui/BaseLoader.vue` (nouveau)
- **Quoi faire** : spinner générique en Tailwind (`animate-spin`), pas de props obligatoires, pas de logique
- **Attendu** : monté seul dans une page de test, affiche un spinner animé

### US-07 — `BaseModal.vue`

- **Dépend de** : US-01
- **Fichiers** : `src/components/ui/BaseModal.vue` (nouveau)
- **Quoi faire** : `<Teleport to="body">`, prop `modelValue: boolean` (v-model), backdrop plein écran semi-transparent, contenu centré au premier plan, un unique slot par défaut, ferme au clic sur le backdrop (`emit('update:modelValue', false)`)
- **Attendu** :
  - `v-model:open="show"` avec du contenu texte dans le slot : rien à l'écran si `show === false`, backdrop + contenu si `true`
  - Clic sur le backdrop repasse `show` à `false`
  - Clic sur le contenu ne ferme pas la modale

### US-08 — `BaseBanner.vue`

- **Dépend de** : US-01
- **Fichiers** : `src/components/ui/BaseBanner.vue` (nouveau)
- **Quoi faire** : bandeau superposé (positionnement absolu/sticky par-dessus son conteneur, pas plein écran), prop `message: string`
- **Attendu** : placé au-dessus d'un bloc de contenu quelconque avec un `message`, s'affiche visuellement par-dessus sans repousser le layout

---

## Phase 3 — Composants dumb `DataTable` (feuilles, indépendants entre eux)

### US-09 — `DataTableRowCheckbox.vue`

- **Dépend de** : US-01
- **Fichiers** : `src/components/data-table/DataTableRowCheckbox.vue` (nouveau)
- **Quoi faire** : checkbox générique, prop `modelValue: boolean`, emit `update:modelValue`
- **Attendu** : `v-model` fonctionnel dans un test isolé (cocher/décocher met à jour la valeur parente)

### US-10 — `DataTableCell.vue`

- **Dépend de** : US-01
- **Fichiers** : `src/components/data-table/DataTableCell.vue` (nouveau)
- **Quoi faire** : prop `editing: boolean`, prop `modelValue: string`. `editing === false` → `<p>{{ modelValue }}</p>` ; `editing === true` → `<input type="text" />` avec `v-model` local, emit `update:modelValue`
- **Attendu** : bascule visuellement entre `<p>` et `<input>` selon `editing` ; taper dans l'input émet bien la nouvelle valeur

### US-11 — `DataTableRowActions.vue`

- **Dépend de** : US-01
- **Fichiers** : `src/components/data-table/DataTableRowActions.vue` (nouveau)
- **Quoi faire** : prop `editing: boolean`. `editing === false` → boutons "Éditer"/"Supprimer" (events `edit`, `delete`) ; `editing === true` → boutons "Sauvegarder"/"Annuler" (events `save`, `cancel`)
- **Attendu** : les deux états s'affichent correctement selon `editing`, chaque bouton émet le bon event au clic, aucune prop `row`/`id` requise

### US-12 — `DataTableColumnHeader.vue`

- **Dépend de** : US-01
- **Fichiers** : `src/components/data-table/DataTableColumnHeader.vue` (nouveau)
- **Quoi faire** : affiche un label + indicateur de tri (prop, ex. `sortDirection: 'asc' | 'desc' | false`), clic émet un event (ex. `toggle-sort`), aucun appel direct à TanStack
- **Attendu** : l'indicateur visuel change selon la prop, le clic émet l'event sans argument métier

### US-13 — `DataTableToolbar.vue`

- **Dépend de** : US-01
- **Fichiers** : `src/components/data-table/DataTableToolbar.vue` (nouveau)
- **Quoi faire** : `<input>` texte, prop `modelValue: string`, emit `update:modelValue`
- **Attendu** : `v-model` fonctionnel, aucune logique de filtrage dans le composant

### US-14 — `DataTableTitleBar.vue`

- **Dépend de** : US-01
- **Fichiers** : `src/components/data-table/DataTableTitleBar.vue` (nouveau)
- **Quoi faire** : prop `title?: string` (défaut ex. `"Data table"`), slot nommé `header` qui remplace l'affichage du titre par défaut s'il est fourni
- **Attendu** : sans slot rempli → affiche `title` (ou le défaut) ; avec slot `header` rempli → affiche le contenu du slot à la place, `title` ignoré visuellement

### US-15 — `DataTableFooterActions.vue`

- **Dépend de** : US-01
- **Fichiers** : `src/components/data-table/DataTableFooterActions.vue` (nouveau)
- **Quoi faire** : prop `actions: { key: string; label: string; disabled?: boolean }[]`, affiche un bouton par action, clic emit `action(key)`, respecte `disabled`
- **Attendu** : donner une liste de 3 actions factices affiche 3 boutons, cliquer un bouton non désactivé émet `action` avec la bonne clé, un bouton `disabled: true` ne déclenche rien au clic

### US-16 — `DataTablePagination.vue`

- **Dépend de** : US-01
- **Fichiers** : `src/components/data-table/DataTablePagination.vue` (nouveau)
- **Quoi faire** : props `pageIndex: number`, `pageCount: number`, `pageSize: number`. Boutons première page / précédente / suivante / dernière page (émettent `first`, `prev`, `next`, `last`), select de taille de page (emit `update:pageSize`). Boutons désactivés en butée (première page → "précédente"/"première" désactivés, etc.)
- **Attendu** : avec `pageIndex: 0`, les boutons "précédente"/"première" sont désactivés ; avec `pageIndex === pageCount - 1`, "suivante"/"dernière" désactivés ; chaque bouton actif émet le bon event

---

## Phase 4 — Composants composites `DataTable`

### US-17 — `DataTableFooterBar.vue`

- **Dépend de** : US-15, US-16
- **Fichiers** : `src/components/data-table/DataTableFooterBar.vue` (nouveau)
- **Quoi faire** : layout flex deux zones (gauche/droite), slot `actions` à gauche avec `DataTableFooterActions` en contenu par défaut, slot `pagination` à droite avec `DataTablePagination` en contenu par défaut
- **Attendu** :
  - Sans rien fournir aux slots, les deux composants par défaut s'affichent (nécessite de leur passer des props factices dans ce test isolé, ou des props par défaut vides)
  - Fournir un contenu au slot `actions` remplace uniquement la zone gauche, la zone `pagination` reste inchangée

### US-18 — `DataTableBody.vue`

- **Dépend de** : US-09, US-10, US-11
- **Fichiers** : `src/components/data-table/DataTableBody.vue` (nouveau)
- **Quoi faire** :
  - Prop `rows` (rows TanStack) + `editingRowId`
  - Pour chaque ligne : cellule `select` → `DataTableRowCheckbox` (masquée, pas juste désactivée, si `row.id === editingRowId`), cellules de données → `DataTableCell` (`editing` = `row.id === editingRowId`), cellule `actions` → slot scoped `row-actions` (props : `row`, `editing`, `onEdit`, `onDelete`, `onSave`, `onCancel`) avec `DataTableRowActions` en défaut
  - Pour la ligne en édition, accumule les valeurs tapées dans chaque `DataTableCell` (`update:modelValue`, bufferisé par id de colonne, réinitialisé à chaque changement de `editingRowId`) et les remonte comme second argument de l'event `save` (`patch: Record<string, string>`) — c'est ce qui permet à l'appelant de persister l'édition inline (voir US-23)
- **Attendu** :
  - Avec des rows factices et `editingRowId: null`, toutes les lignes affichent leurs checkboxes et des `<p>` (pas d'input)
  - Avec `editingRowId` pointant une ligne, cette ligne cache sa checkbox, ses cellules deviennent des `<input>`, ses actions basculent en sauvegarder/annuler
  - Remplacer le slot `row-actions` affiche le composant custom fourni à la place de `DataTableRowActions`
  - Taper dans un `<input>` de la ligne en édition puis déclencher `save` émet le `patch` avec les valeurs modifiées ; les autres lignes ne sont jamais affectées par ce buffer

---

## Phase 5 — Orchestrateur

### US-19 — `DataTable.vue`

- **Dépend de** : US-04, US-05, US-13, US-14, US-17, US-18
- **Fichiers** : `src/components/data-table/DataTable.vue` (nouveau)
- **Quoi faire** :
  - Props : `data`, `columns` (métier, sans `select`/`actions`), `title?`
  - Slots : `header` (pass-through vers `DataTableTitleBar`), `actions` et `pagination` (pass-through vers `DataTableFooterBar`), `row-actions` (pass-through vers `DataTableBody`)
  - Appelle `useDataTable(data, withSelectAndActionsColumns(columns))`
  - Compose `DataTableTitleBar`, `DataTableToolbar` (branché sur `globalFilter`), en-têtes de colonnes via `DataTableColumnHeader`, `DataTableBody`, `DataTableFooterBar`
  - Remonte les events métier tels quels vers l'appelant : `edit`, `delete`, `save` (avec le `patch` remonté par `DataTableBody`), `cancel`, `action` — sans les interpréter
  - Remonte aussi la sélection courante via `update:selectedIds` (ids métier des lignes sélectionnées, dérivés de `table.getSelectedRowModel()`) — nécessaire pour que l'appelant sache quelles lignes sont sélectionnées (`delete`/`duplicate`/`export-csv`)
- **Attendu** :
  - Monté avec un jeu de données/colonnes factice (pas `Person`), affiche un tableau fonctionnel : tri au clic sur un header, filtre global qui réduit les lignes, pagination qui change les lignes affichées, sélection qui coche/décoche
  - Cliquer "éditer" sur une ligne bascule cette ligne en édition (inputs + save/cancel + checkbox masquée) et n'importe quelle autre ligne déjà en édition repasse en lecture
  - Fournir un composant custom au slot `header` (ou `row-actions`) l'affiche à la place du défaut

---

## Phase 6 — Métier people

### US-20 — Colonnes `Person`

- **Dépend de** : US-02
- **Fichiers** : `src/features/people/columns.ts` (nouveau)
- **Quoi faire** : `columnHelper<Person>()`, colonnes accessor pour les champs de `Person` (pas de `select`/`actions`, ajoutées par `DataTable`/`useDataTable`)
- **Attendu** : tableau de `ColumnDef<Person>[]` valide, utilisable tel quel comme prop `columns` de `DataTable.vue`

### US-21 — `usePeople.ts`

- **Dépend de** : US-02, US-03, US-20
- **Fichiers** : `src/features/people/usePeople.ts` (nouveau)
- **Quoi faire** :
  - State `people: Ref<Person[]>` initialisé avec le mock
  - `loading` / `error` en `ref`
  - `reload`, `addPerson`, `deletePeople(ids)`, `duplicatePeople(ids)`, `savePerson(id, patch)`, `exportCsv(ids)` — chacune enveloppée dans `fakeApi`, met à jour `loading`/`error`
  - Expose la liste d'actions du footer : `{ key: 'reload' | 'add' | 'delete' | 'duplicate' | 'export-csv', label, disabled }[]`, `delete`/`duplicate`/`export-csv` désactivées si aucune ligne sélectionnée
- **Attendu** :
  - `reload()` passe `loading` à `true` puis `false` après le délai simulé, `error` renseigné sur échec simulé
  - `deletePeople(['id1'])` retire bien l'entrée correspondante de `people` sur succès
  - `duplicatePeople(['id1', 'id2'])` ajoute deux nouvelles entrées avec des ids distincts
  - Liste d'actions correcte selon qu'il y a une sélection ou non

### US-22 — `PeopleForm.vue`

- **Dépend de** : US-02, US-07
- **Fichiers** : `src/features/people/PeopleForm.vue` (nouveau)
- **Quoi faire** : formulaire simple pour créer/éditer un `Person` (un champ par propriété), prop `person?: Person` (édition) ou vide (création), emit `submit(person)` et `cancel`
- **Attendu** : rempli avec un `Person`, les champs sont pré-remplis ; soumis, émet `submit` avec les valeurs du formulaire ; utilisable dans le slot par défaut de `Modal.vue`

---

## Phase 7 — Intégration finale

### US-23 — Branchement `App.vue`

- **Dépend de** : toutes les précédentes
- **Fichiers** : `src/App.vue`
- **Quoi faire** :
  - Appelle `usePeople(selectedIds)`, passe `people`/colonnes/actions à `<DataTable>`
  - `<Loader>` affiché quand `loading`, `<Banner>` affichée par-dessus le tableau quand `error`
  - `<Modal>` avec `<PeopleForm>` ouverte uniquement sur l'action `add` (création) ; l'édition d'une ligne existante passe par le mécanisme inline de `DataTable` (`edit` bascule la ligne en `<input>`, `save` remonte le `patch` tapé, branché sur `usePeople().savePerson(id, patch)`) — pas de modale pour ce cas
  - `selectedIds` alimenté par l'event `update:selectedIds` de `<DataTable>`, consommé par `usePeople` pour activer/désactiver `delete`/`duplicate`/`export-csv`
- **Attendu** : parcours complet manuel dans le navigateur — charger, trier, filtrer, paginer, sélectionner, éditer une ligne inline puis sauvegarder/annuler (seule la ligne éditée est affectée), créer via la modale, supprimer, dupliquer, exporter en CSV, voir le loader et (en relançant si besoin pour tomber sur l'échec simulé) la bannière d'erreur

---

_Ce backlog découle de `PLAN.md`. Toute modification d'architecture doit être répercutée dans les deux fichiers._

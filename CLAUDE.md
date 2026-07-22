# CLAUDE.md

## Workflow

Ce projet avance par petites US, décrites et suivies dans `BACKLOG.md` (section "Suivi" = état d'avancement, source de vérité). Le détail d'architecture complet est dans `PLAN.md`. Avant de commencer à coder, toujours vérifier `BACKLOG.md` pour savoir quelle US traiter et si ses dépendances sont déjà faites. Voir `PROMPT.md` pour le prompt de reprise de session.

## Workflow git

Ce projet est un **POC** : on code directement sur `main`, pas de branche ni de PR par US. Avant tout `git commit` puis `git push`, toujours montrer le `git diff` (et `git status`) pour relecture — ne jamais commit/push sans validation explicite de ce diff.

## Stack

- Vue 3 (Composition API, `<script setup lang="ts">`)
- Vite
- TanStack Vue Table (`@tanstack/vue-table`)
- Tailwind CSS v4
- TypeScript

Pas d'autre lib UI/state/table à ajouter sans discussion préalable.

## Commandes

- `npm run dev` — serveur de dev
- `npm run type-check` — vérification TypeScript (`vue-tsc`)
- `npm run lint` — oxlint + eslint (`--fix`)
- `npm run format` — prettier
- `npm run build` — type-check + build

Une US n'est considérée terminée que si `type-check` et `lint` passent, en plus de son "Attendu" dans `BACKLOG.md`.

## Arborescence

- `src/components/data-table/` — composants dumb génériques du tableau (`DataTable.vue` et ses sous-composants), + `useDataTable.ts` s'il est co-localisé
- `src/components/ui/` — composants globaux génériques, réutilisables hors data-table (`Loader.vue`, `Modal.vue`, `Banner.vue`, ...)
- `src/features/<domaine>/` — tout ce qui est métier pour un domaine donné (ex. `src/features/people/` : `usePeople.ts`, `columns.ts`, `PeopleForm.vue`)
- `src/lib/` — utilitaires génériques transverses, sans dépendance à Vue ni au métier (ex. `fakeApi.ts`)
- `src/data/` — données mock

Un composant générique ne référence jamais un type métier (`Person`, etc.). Un composant métier ne réimplémente jamais ce qu'un composant générique fait déjà.

## Conventions de code

- Principes SOLID, en particulier single responsibility : chaque composant a une seule responsabilité.
- Composants "dumb" / génériques au maximum : logique métier hors du composant (props en entrée, events en sortie), pas de logique métier codée en dur dans le template ou le composant. Les composants dumb du data-table n'appellent jamais `useVueTable`/`useDataTable` directement — seul l'orchestrateur (`DataTable.vue`) le fait.
- Découpage fin plutôt que composants monolithiques.
- Pattern slot + défaut : toute zone personnalisable expose un slot nommé avec un composant par défaut en fallback (ex. `<slot name="header"><DataTableTitleBar :title /></slot>`). L'orchestrateur transmet ces slots en pass-through à l'appelant, qui décide de surcharger ou non.
- Tout composant contrôlé suit la convention `v-model` standard de Vue : prop `modelValue` + event `update:modelValue` (ou `v-model:xxx` nommé si plusieurs valeurs contrôlées).

## Langue

Code (variables, fonctions, composants, types, props, events) en anglais. Texte affiché à l'utilisateur (labels, boutons, messages) en français.

## Conventions Vue 3

- `<script setup lang="ts">` systématique, pas d'Options API.
- Props typées via `defineProps<{ ... }>()` (+ `withDefaults` si valeurs par défaut nécessaires), jamais via l'API runtime (`defineProps({ ... })`) sauf besoin de validateur runtime spécifique.
- Events typés via `defineEmits<{ ... }>()`.
- Un composant par fichier, nom de fichier en PascalCase identique au nom du composant.
- Composants multi-mots (PascalCase en JS/TS, kebab-case dans le template : `<DataTablePagination />`).
- `computed` pour toute valeur dérivée d'un state réactif, jamais recalculée à la main dans le template ou une méthode.
- Composables préfixés `use`, retournent des `ref`/`computed` (jamais d'objets réactifs bruts non enveloppés), et sont appelables en dehors de tout composant.
- Pas de logique dans le template au-delà d'une expression simple ; toute logique non triviale part dans un `computed` ou une fonction du `<script setup>`.

# vue-tanstack

Data table générique construite avec **Vue 3** (Composition API) et **TanStack Table**, stylée avec **Tailwind CSS v4** — tri, filtre global, pagination, sélection multiple et édition inline, appliquée à un cas d'usage métier (gestion de personnes).

POC réalisé pour explorer une architecture de composants "dumb" / génériques (SOLID, single responsibility) découplée du métier : le composant `DataTable` et ses sous-composants ne connaissent aucun type métier, toute la logique `Person` (CRUD, colonnes) vit dans `src/features/people/`.

## Fonctionnalités

- Tri par colonne, filtre global, pagination
- Sélection multiple de lignes
- Édition inline (une ligne à la fois) avec sauvegarde/annulation
- Création via formulaire modal, suppression, duplication, export CSV
- États de chargement / erreur simulés (`fakeApi`, pas de backend réel)

## Stack

- [Vue 3](https://vuejs.org/) (`<script setup lang="ts">`)
- [TanStack Vue Table](https://tanstack.com/table/latest)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Vite + TypeScript

Pas d'autre lib UI/state/table à ajouter sans discussion préalable.

## Démarrer

```sh
npm install
npm run dev
```

Autres commandes :

- `npm run type-check` — vérification TypeScript (`vue-tsc`)
- `npm run lint` — oxlint + eslint (`--fix`)
- `npm run format` — prettier
- `npm run build` — type-check + build

Une US n'est considérée terminée que si `type-check` et `lint` passent, en plus de son "Attendu" dans `BACKLOG.md`.

## Architecture

Voir [`PLAN.md`](./PLAN.md) pour le détail de l'architecture des composants et [`BACKLOG.md`](./BACKLOG.md) pour le découpage en user stories.
La section "Suivi" de `BACKLOG.md` est la source de vérité de l'avancement : la consulter avant de coder pour savoir quelle US traiter et si ses dépendances sont faites. `PROMPT.md` donne le prompt de reprise de session.

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

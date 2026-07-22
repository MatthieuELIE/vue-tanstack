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

## Démarrer

```sh
npm install
npm run dev
```

Autres commandes : `npm run type-check`, `npm run lint`, `npm run format`, `npm run build`.

## Architecture

Voir [`PLAN.md`](./PLAN.md) pour le détail de l'architecture des composants et [`BACKLOG.md`](./BACKLOG.md) pour le découpage en user stories.

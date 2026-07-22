import { createColumnHelper, type ColumnDef } from '@tanstack/vue-table'
import type { Person } from '@/data/people'

const columnHelper = createColumnHelper<Person>()

export const peopleColumns = [
    columnHelper.accessor('firstName', { header: 'Prénom' }),
    columnHelper.accessor('lastName', { header: 'Nom' }),
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('jobTitle', { header: 'Poste' }),
] as ColumnDef<Person>[]

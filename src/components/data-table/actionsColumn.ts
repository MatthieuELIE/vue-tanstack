import type { ColumnDef } from '@tanstack/vue-table'

export const actionsColumn = <TData,>(): ColumnDef<TData> => ({
    id: 'actions',
    cell: () => null,
})

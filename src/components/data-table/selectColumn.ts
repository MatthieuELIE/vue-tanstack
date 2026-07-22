import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import DataTableRowCheckbox from './DataTableRowCheckbox.vue'

export const selectColumn = <TData,>(): ColumnDef<TData> => ({
    id: 'select',
    header: ({ table }) =>
        h(DataTableRowCheckbox, {
            modelValue: table.getIsAllRowsSelected(),
            'onUpdate:modelValue': (value: boolean) => table.toggleAllRowsSelected(value),
        }),
    cell: ({ row }) =>
        h(DataTableRowCheckbox, {
            modelValue: row.getIsSelected(),
            'onUpdate:modelValue': (value: boolean) => row.toggleSelected(value),
        }),
})

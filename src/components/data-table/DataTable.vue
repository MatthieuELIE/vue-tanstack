<template>
    <div>
        <slot name="header">
            <DataTableTitleBar :title="title" />
        </slot>
        <DataTableToolbar v-model="globalFilter" />
        <table>
            <thead>
                <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                    <th v-for="header in headerGroup.headers" :key="header.id">
                        <FlexRender
                            v-if="header.column.id === 'select' || header.column.id === 'actions'"
                            :render="header.column.columnDef.header"
                            :props="header.getContext()"
                        />
                        <DataTableColumnHeader
                            v-else
                            :label="columnLabel(header.column)"
                            :sort-direction="header.column.getIsSorted()"
                            @toggle-sort="header.column.toggleSorting()"
                        />
                    </th>
                </tr>
            </thead>
            <DataTableBody
                :rows="table.getRowModel().rows"
                :editing-row-id="editingRowId"
                @edit="onEdit"
                @delete="(row) => emit('delete', row)"
                @save="onSave"
                @cancel="onCancel"
            >
                <template #row-actions="slotProps">
                    <slot name="row-actions" v-bind="slotProps" />
                </template>
            </DataTableBody>
        </table>
        <DataTableFooterBar
            :page-index="pagination.pageIndex"
            :page-count="table.getPageCount()"
            :page-size="pagination.pageSize"
            @first="table.setPageIndex(0)"
            @prev="table.previousPage()"
            @next="table.nextPage()"
            @last="table.setPageIndex(table.getPageCount() - 1)"
            @update:page-size="(size) => table.setPageSize(size)"
        >
            <template #actions><slot name="actions" /></template>
            <template #pagination><slot name="pagination" /></template>
        </DataTableFooterBar>
    </div>
</template>

<script setup lang="ts" generic="TData extends { id: string }">
import { computed, toRef, watch } from 'vue'
import { FlexRender, type Column, type ColumnDef, type Row } from '@tanstack/vue-table'
import { useDataTable } from '@/composables/useDataTable'
import { selectColumn } from './selectColumn'
import { actionsColumn } from './actionsColumn'
import DataTableTitleBar from './DataTableTitleBar.vue'
import DataTableToolbar from './DataTableToolbar.vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableBody from './DataTableBody.vue'
import DataTableFooterBar from './DataTableFooterBar.vue'

const props = defineProps<{
    data: TData[]
    columns: ColumnDef<TData>[]
    title?: string
}>()

const emit = defineEmits<{
    edit: [row: Row<TData>]
    delete: [row: Row<TData>]
    save: [row: Row<TData>, patch: Record<string, string>]
    cancel: [row: Row<TData>]
    'update:selectedIds': [ids: string[]]
}>()

const { table, globalFilter, pagination, editingRowId, startEditing, stopEditing } = useDataTable(
    toRef(props, 'data'),
    [selectColumn<TData>(), ...props.columns, actionsColumn<TData>()],
)

const selectedIds = computed(() => table.getSelectedRowModel().rows.map((row) => row.original.id))
watch(selectedIds, (ids) => emit('update:selectedIds', ids), { immediate: true })

const columnLabel = (column: Column<TData, unknown>) =>
    typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id

const onEdit = (row: Row<TData>) => {
    startEditing(row.id)
    emit('edit', row)
}

const onSave = (row: Row<TData>, patch: Record<string, string>) => {
    stopEditing()
    emit('save', row, patch)
}

const onCancel = (row: Row<TData>) => {
    stopEditing()
    emit('cancel', row)
}
</script>

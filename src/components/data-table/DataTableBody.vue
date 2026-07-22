<template>
    <tbody>
        <tr v-for="row in rows" :key="row.id">
            <td v-for="cell in row.getVisibleCells()" :key="cell.id">
                <template v-if="cell.column.id === 'select'">
                    <DataTableRowCheckbox
                        v-if="row.id !== editingRowId"
                        :model-value="row.getIsSelected()"
                        @update:model-value="row.toggleSelected($event)"
                    />
                </template>
                <slot
                    v-else-if="cell.column.id === 'actions'"
                    name="row-actions"
                    :row="row"
                    :editing="row.id === editingRowId"
                    :on-edit="() => emit('edit', row)"
                    :on-delete="() => emit('delete', row)"
                    :on-save="() => emitSave(row)"
                    :on-cancel="() => emit('cancel', row)"
                >
                    <DataTableRowActions
                        :editing="row.id === editingRowId"
                        @edit="emit('edit', row)"
                        @delete="emit('delete', row)"
                        @save="emitSave(row)"
                        @cancel="emit('cancel', row)"
                    />
                </slot>
                <DataTableCell
                    v-else
                    :editing="row.id === editingRowId"
                    :model-value="cellValue(row, cell)"
                    @update:model-value="editValues[cell.column.id] = $event"
                />
            </td>
        </tr>
    </tbody>
</template>

<script setup lang="ts" generic="TData">
import { reactive, watch } from 'vue'
import type { Cell, Row } from '@tanstack/vue-table'
import DataTableRowCheckbox from './DataTableRowCheckbox.vue'
import DataTableCell from './DataTableCell.vue'
import DataTableRowActions from './DataTableRowActions.vue'

const props = defineProps<{
    rows: Row<TData>[]
    editingRowId: string | null
}>()

const emit = defineEmits<{
    edit: [row: Row<TData>]
    delete: [row: Row<TData>]
    save: [row: Row<TData>, patch: Record<string, string>]
    cancel: [row: Row<TData>]
}>()

const editValues = reactive<Record<string, string>>({})

watch(
    () => props.editingRowId,
    () => {
        Object.keys(editValues).forEach((key) => delete editValues[key])
    },
)

const emitSave = (row: Row<TData>) => {
    emit('save', row, { ...editValues })
}

const cellValue = (row: Row<TData>, cell: Cell<TData, unknown>) =>
    row.id === props.editingRowId ? (editValues[cell.column.id] ?? String(cell.getValue())) : String(cell.getValue())
</script>

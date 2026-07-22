import { ref, type Ref } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type PaginationState,
  type RowSelectionState,
  type Updater,
} from '@tanstack/vue-table'

const applyUpdater = <T>(state: Ref<T>, updater: Updater<T>) => {
  state.value = typeof updater === 'function' ? (updater as (old: T) => T)(state.value) : updater
}

export const useDataTable = <TData>(data: Ref<TData[]>, columns: ColumnDef<TData>[]) => {
  const sorting = ref<SortingState>([])
  const globalFilter = ref('')
  const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const rowSelection = ref<RowSelectionState>({})
  const editingRowId = ref<string | null>(null)

  const table = useVueTable({
    data,
    columns,
    state: {
      get sorting() {
        return sorting.value
      },
      get globalFilter() {
        return globalFilter.value
      },
      get pagination() {
        return pagination.value
      },
      get rowSelection() {
        return rowSelection.value
      },
    },
    onSortingChange: (updater) => applyUpdater(sorting, updater),
    onGlobalFilterChange: (updater) => applyUpdater(globalFilter, updater),
    onPaginationChange: (updater) => applyUpdater(pagination, updater),
    onRowSelectionChange: (updater) => applyUpdater(rowSelection, updater),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const startEditing = (rowId: string) => {
    editingRowId.value = rowId
  }

  const stopEditing = () => {
    editingRowId.value = null
  }

  return {
    table,
    globalFilter,
    pagination,
    editingRowId,
    startEditing,
    stopEditing,
  }
}

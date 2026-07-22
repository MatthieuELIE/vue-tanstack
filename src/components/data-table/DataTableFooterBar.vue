<template>
    <div class="flex items-center justify-between px-2 py-1">
        <slot name="actions" />
        <slot name="pagination">
            <DataTablePagination
                :page-index="pageIndex"
                :page-count="pageCount"
                :page-size="pageSize"
                @first="emit('first')"
                @prev="emit('prev')"
                @next="emit('next')"
                @last="emit('last')"
                @update:page-size="emit('update:pageSize', $event)"
            />
        </slot>
    </div>
</template>

<script setup lang="ts">
import DataTablePagination from './DataTablePagination.vue'

defineProps<{
    pageIndex: number
    pageCount: number
    pageSize: number
}>()

const emit = defineEmits<{
    first: []
    prev: []
    next: []
    last: []
    'update:pageSize': [size: number]
}>()
</script>

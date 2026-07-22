<template>
    <div class="flex items-center gap-2">
        <select
            class="rounded border border-gray-300 px-2 py-1"
            :value="pageSize"
            @change="emit('update:pageSize', Number(($event.target as HTMLSelectElement).value))"
        >
            <option v-for="size in [10, 20, 50]" :key="size" :value="size">{{ size }} / page</option>
        </select>
        <button
            v-for="button in leftButtons"
            :key="button.key"
            type="button"
            class="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="button.disabled"
            @click="emit(button.key)"
        >
            {{ button.label }}
        </button>
        <span>Page {{ pageIndex + 1 }} / {{ pageCount }}</span>
        <button
            v-for="button in rightButtons"
            :key="button.key"
            type="button"
            class="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="button.disabled"
            @click="emit(button.key)"
        >
            {{ button.label }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    pageIndex: number
    pageCount: number
    pageSize: number
}>()

const emit = defineEmits<{
    (e: 'first' | 'prev' | 'next' | 'last'): void
    (e: 'update:pageSize', size: number): void
}>()

const leftButtons = computed(() => {
    const disabled = props.pageIndex === 0
    return [
        { key: 'first' as const, label: '«', disabled },
        { key: 'prev' as const, label: '‹', disabled },
    ]
})

const rightButtons = computed(() => {
    const disabled = props.pageIndex >= props.pageCount - 1
    return [
        { key: 'next' as const, label: '›', disabled },
        { key: 'last' as const, label: '»', disabled },
    ]
})
</script>

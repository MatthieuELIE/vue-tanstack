<template>
    <button type="button" class="flex items-center gap-1 font-medium hover:underline" @click="emit('toggle-sort')">
        <span>{{ label }}</span>
        <span v-if="sortDirection" class="text-xs">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    label: string
    sortDirection: 'asc' | 'desc' | false
}>()

const emit = defineEmits<{
    'toggle-sort': []
}>()
</script>

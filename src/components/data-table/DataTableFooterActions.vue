<template>
    <div class="flex gap-2">
        <button
            v-for="action in actions"
            :key="action.key"
            type="button"
            :disabled="action.disabled"
            class="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            @click="emit('action', action.key)"
        >
            {{ action.label }}
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    actions: { key: string; label: string; disabled?: boolean }[]
}>()

const emit = defineEmits<{
    action: [key: string]
}>()
</script>

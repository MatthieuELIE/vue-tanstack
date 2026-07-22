<template>
    <input
        type="text"
        placeholder="Filtrer..."
        class="rounded border border-gray-300 px-2 py-1"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
</template>

<script setup lang="ts">
defineProps<{
    modelValue: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>

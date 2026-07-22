<template>
    <Teleport to="body">
        <div
            v-if="modelValue"
            class="fixed inset-0 flex items-center justify-center bg-black/50"
            @click="emit('update:modelValue', false)"
        >
            <div class="rounded bg-white p-6 shadow-lg" @click.stop>
                <slot></slot>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()
</script>

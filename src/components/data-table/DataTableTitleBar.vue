<template>
    <div class="flex items-center px-2 py-1">
        <slot name="header">
            <h2 class="text-lg font-semibold">{{ title }}</h2>
        </slot>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        title?: string
    }>(),
    {
        title: 'Data table',
    },
)
</script>

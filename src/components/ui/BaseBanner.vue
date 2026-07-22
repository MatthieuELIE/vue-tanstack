<template>
    <div class="absolute inset-x-0 top-0 z-10 bg-red-100 px-4 py-2 text-red-800 shadow" role="alert">
        {{ message }}
    </div>
</template>

<script setup lang="ts">
defineProps<{
    message: string
}>()
</script>

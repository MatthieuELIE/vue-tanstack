<template>
    <div class="flex gap-2">
        <button
            v-for="action in actions"
            :key="action.label"
            type="button"
            :class="action.class"
            @click="action.onClick"
        >
            {{ action.label }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    editing: boolean
}>()

const emit = defineEmits<{
    edit: []
    delete: []
    save: []
    cancel: []
}>()

const actions = computed(() =>
    props.editing
        ? [
              { label: 'Sauvegarder', class: 'text-green-600 hover:underline', onClick: () => emit('save') },
              { label: 'Annuler', class: 'text-gray-600 hover:underline', onClick: () => emit('cancel') },
          ]
        : [
              { label: 'Éditer', class: 'text-blue-600 hover:underline', onClick: () => emit('edit') },
              { label: 'Supprimer', class: 'text-red-600 hover:underline', onClick: () => emit('delete') },
          ],
)
</script>

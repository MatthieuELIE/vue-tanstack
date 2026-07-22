<template>
    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <label class="flex flex-col gap-1">
            Prénom
            <input v-model="form.firstName" type="text" class="rounded border border-gray-300 px-2 py-1" required />
        </label>
        <label class="flex flex-col gap-1">
            Nom
            <input v-model="form.lastName" type="text" class="rounded border border-gray-300 px-2 py-1" required />
        </label>
        <label class="flex flex-col gap-1">
            Email
            <input v-model="form.email" type="email" class="rounded border border-gray-300 px-2 py-1" required />
        </label>
        <label class="flex flex-col gap-1">
            Poste
            <input v-model="form.jobTitle" type="text" class="rounded border border-gray-300 px-2 py-1" required />
        </label>
        <div class="flex justify-end gap-2">
            <button type="button" class="rounded border border-gray-300 px-3 py-1" @click="emit('cancel')">
                Annuler
            </button>
            <button type="submit" class="rounded bg-blue-600 px-3 py-1 text-white">Enregistrer</button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Person } from '@/data/people'

const props = defineProps<{
    person?: Person
}>()

const emit = defineEmits<{
    submit: [person: Person]
    cancel: []
}>()

const emptyForm = (): Person => ({ id: '', firstName: '', lastName: '', email: '', jobTitle: '' })

const form = reactive<Person>(props.person ? { ...props.person } : emptyForm())

watch(
    () => props.person,
    (person) => {
        Object.assign(form, person ? { ...person } : emptyForm())
    },
)

const onSubmit = () => {
    emit('submit', { ...form })
}
</script>

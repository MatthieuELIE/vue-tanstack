<template>
    <div class="relative mx-auto max-w-4xl p-6">
        <BaseBanner v-if="error" :message="error" />
        <BaseLoader v-if="loading" class="mb-4" />

        <DataTable
            :data="people"
            :columns="peopleColumns"
            title="Personnes"
            @update:selected-ids="selectedIds = $event"
            @delete="(row) => deletePeople([row.original.id])"
            @save="(row, patch) => savePerson(row.original.id, patch)"
        >
            <template #actions>
                <DataTableFooterActions :actions="actions" @action="onAction" />
            </template>
        </DataTable>

        <BaseModal v-model="showForm">
            <PeopleForm @submit="onCreate" @cancel="showForm = false" />
        </BaseModal>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataTable from '@/components/data-table/DataTable.vue'
import DataTableFooterActions from '@/components/data-table/DataTableFooterActions.vue'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import BaseBanner from '@/components/ui/BaseBanner.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import PeopleForm from '@/features/people/PeopleForm.vue'
import { usePeople } from '@/features/people/usePeople'
import { peopleColumns } from '@/features/people/columns'
import type { Person } from '@/data/people'

const selectedIds = ref<string[]>([])
const { people, loading, error, actions, reload, addPerson, deletePeople, duplicatePeople, savePerson, exportCsv } =
    usePeople(selectedIds)

const showForm = ref(false)

const onCreate = (person: Person) => {
    addPerson({
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        jobTitle: person.jobTitle,
    })
    showForm.value = false
}

const onAction = (key: string) => {
    switch (key) {
        case 'reload':
            reload()
            break
        case 'add':
            showForm.value = true
            break
        case 'delete':
            deletePeople(selectedIds.value)
            break
        case 'duplicate':
            duplicatePeople(selectedIds.value)
            break
        case 'export-csv':
            exportCsv(selectedIds.value)
            break
    }
}
</script>

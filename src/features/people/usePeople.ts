import { computed, ref, type Ref } from 'vue'
import { fakeApi } from '@/lib/fakeApi'
import { people as mockPeople, type Person } from '@/data/people'

export interface PeopleFooterAction {
    key: 'reload' | 'add' | 'delete' | 'duplicate' | 'export-csv'
    label: string
    disabled?: boolean
}

export const usePeople = (selectedIds: Ref<string[]>) => {
    const people = ref<Person[]>([...mockPeople])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const runAction = async (mutate: () => void) => {
        loading.value = true
        error.value = null
        try {
            await fakeApi(null)
            mutate()
        } catch {
            error.value = 'Une erreur est survenue.'
        } finally {
            loading.value = false
        }
    }

    const reload = () =>
        runAction(() => {
            people.value = [...mockPeople]
        })

    const addPerson = (person: Omit<Person, 'id'>) =>
        runAction(() => {
            people.value = [...people.value, { ...person, id: crypto.randomUUID() }]
        })

    const deletePeople = (ids: string[]) =>
        runAction(() => {
            people.value = people.value.filter((person) => !ids.includes(person.id))
        })

    const duplicatePeople = (ids: string[]) =>
        runAction(() => {
            const duplicates = people.value
                .filter((person) => ids.includes(person.id))
                .map((person) => ({ ...person, id: crypto.randomUUID() }))
            people.value = [...people.value, ...duplicates]
        })

    const savePerson = (id: string, patch: Partial<Omit<Person, 'id'>>) =>
        runAction(() => {
            people.value = people.value.map((person) =>
                person.id === id ? { ...person, ...patch } : person,
            )
        })

    const exportCsv = (ids: string[]) =>
        runAction(() => {
            const rows = people.value.filter((person) => ids.includes(person.id))
            const header = 'id,firstName,lastName,email,jobTitle'
            const lines = rows.map((person) =>
                [person.id, person.firstName, person.lastName, person.email, person.jobTitle].join(','),
            )
            const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = 'people.csv'
            anchor.click()
            URL.revokeObjectURL(url)
        })

    const actions = computed<PeopleFooterAction[]>(() => {
        const hasSelection = selectedIds.value.length > 0
        return [
            { key: 'reload', label: 'Recharger' },
            { key: 'add', label: 'Ajouter' },
            { key: 'delete', label: 'Supprimer', disabled: !hasSelection },
            { key: 'duplicate', label: 'Dupliquer', disabled: !hasSelection },
            { key: 'export-csv', label: 'Exporter en CSV', disabled: !hasSelection },
        ]
    })

    return {
        people,
        loading,
        error,
        actions,
        reload,
        addPerson,
        deletePeople,
        duplicatePeople,
        savePerson,
        exportCsv,
    }
}

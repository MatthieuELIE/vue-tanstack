export interface Person {
  id: string
  firstName: string
  lastName: string
  email: string
  jobTitle: string
}

export const people: Person[] = [
  { id: '1', firstName: 'Alice', lastName: 'Martin', email: 'alice.martin@example.com', jobTitle: 'Développeuse' },
  { id: '2', firstName: 'Bruno', lastName: 'Durand', email: 'bruno.durand@example.com', jobTitle: 'Designer' },
  { id: '3', firstName: 'Camille', lastName: 'Petit', email: 'camille.petit@example.com', jobTitle: 'Chef de projet' },
  { id: '4', firstName: 'David', lastName: 'Bernard', email: 'david.bernard@example.com', jobTitle: 'Développeur' },
  { id: '5', firstName: 'Élise', lastName: 'Robert', email: 'elise.robert@example.com', jobTitle: 'Product Owner' },
  { id: '6', firstName: 'Farid', lastName: 'Moreau', email: 'farid.moreau@example.com', jobTitle: 'Testeur QA' },
  { id: '7', firstName: 'Gabrielle', lastName: 'Simon', email: 'gabrielle.simon@example.com', jobTitle: 'UX Researcher' },
  { id: '8', firstName: 'Hugo', lastName: 'Laurent', email: 'hugo.laurent@example.com', jobTitle: 'DevOps' },
  { id: '9', firstName: 'Inès', lastName: 'Lefebvre', email: 'ines.lefebvre@example.com', jobTitle: 'Développeuse' },
  { id: '10', firstName: 'Julien', lastName: 'Michel', email: 'julien.michel@example.com', jobTitle: 'Designer' },
]

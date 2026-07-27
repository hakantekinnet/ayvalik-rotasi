import { type SchemaTypeDefinition } from 'sanity'
import { news } from './news'
import { place } from './place'
import { poll } from './poll'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [news, place, poll],
}

import { type SchemaTypeDefinition } from 'sanity'
import { news } from './news'
import { place } from './place'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [news, place],
}

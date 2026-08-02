import { type SchemaTypeDefinition } from 'sanity'
import { news } from './news'
import { place } from './place'
import { poll } from './poll'
import { curatedRoute } from './curatedRoute'
import { event } from './event'
import { userPhoto } from './userPhoto'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [news, place, poll, curatedRoute, event, userPhoto],
}

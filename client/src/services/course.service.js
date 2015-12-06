import { getJSON } from '../lib/utils'

export function findBySlug(slug) {
  return getJSON('/api/courses/'+slug)
}

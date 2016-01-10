import { getJSON, putJSON } from '../lib/utils'

export function findBySlug(slug) {
  return getJSON('/api/courses/'+slug)
}

export function update(object) {
  return putJSON('/api/courses/'+object.slug, object)
}

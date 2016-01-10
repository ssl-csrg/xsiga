import { getJSON, putJSON } from '../lib/utils'

export function findBySlug(slug) {
  return getJSON('/api/teachers/'+slug)
}

export function update(object) {
  return putJSON('/api/teachers/'+object.slug, object)
}

export function like(slug) {
  return putJSON('/api/teachers/'+slug+'/like')
}

export function dislike(slug) {
  return putJSON('/api/teachers/'+slug+'/dislike')
}

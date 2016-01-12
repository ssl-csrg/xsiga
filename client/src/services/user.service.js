import { getJSON } from '../lib/utils'

export function get() {
  return getJSON('/api/users')
}

export function getTags() {
  return getJSON('/api/users/tags')
}

import { getJSON } from '../lib/utils'

export function get() {
  return getJSON('/api/users')
}

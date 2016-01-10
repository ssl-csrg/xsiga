import { getJSON, postJSON, putJSON } from '../lib/utils'

export function send(object){
  return postJSON('/api/comments/'+object.parent, object)
}

export function reply(object, commentId){
  return putJSON('/api/comments/'+commentId, object)
}

export function vote(vote, commentId){
  return putJSON('/api/comments/'+commentId+'/'+vote)
}

export function voteReply(vote, commentId, replyId){
  return putJSON('/api/comments/'+commentId+'/'+replyId+'/'+vote)
}

export function list(slug){
  return getJSON('/api/comments/'+slug)
}

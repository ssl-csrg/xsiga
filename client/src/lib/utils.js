function createJSONXHR(method, url, resolve, reject) {
  let xhr = new XMLHttpRequest()
  xhr.open(method, url)
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.onload = () => {
    if (xhr.status == 200) resolve(JSON.parse(xhr.response))
    else reject(Error(xhr.statusText))
  }
  xhr.onerror = () => {
    reject(Error('Network Error'))
  }
  return xhr
}

function sendJSON(method, url, obj){
  return new Promise((resolve, reject) => {
    let xhr = createJSONXHR(method, url, resolve, reject)
    xhr.send(JSON.stringify(obj))
  })
}

export function getJSON(url){
  return new Promise((resolve, reject) => {
    let xhr = createJSONXHR('GET', url, resolve, reject)
    xhr.send()
  })
}

export function putJSON(url, obj){
  return sendJSON('PUT', url, obj)
}

export function postJSON(url, obj){
  return sendJSON('POST', url, obj)
}

export function shortenURL(value){
  let a = value.indexOf('/', 8)
  return value.substring(0, a == -1? value.length : a) + (a == -1? '/' : '/…')
}

export function sortComments(comments) {
  //los comentarios están ya ordenados, pero hay que ordenar las replies
  return comments.map((elem) => {
    if (elem.replies.length > 1) {
      elem.replies.sort((a, b) => b.score - a.score)
    }
    return elem
  })
}

export var SharedStore = {
  state: {}
}

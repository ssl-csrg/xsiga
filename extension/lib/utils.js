export function log(string) {
  console.log('XSIGA :: '+string)
}

export function error(err) {
  if(err.message) console.error('XSIGA !! '+message)
  console.error('XSIGA !! '+err)
}

export function stripObject(obj) {
  let rtn = {}
  for(let prop in obj) {
    if(obj.hasOwnProperty(prop) && !(obj[prop] instanceof HTMLElement)) {
      rtn[prop] = obj[prop]
    }
  }
  return rtn
}

export function postDataAsJSON(data, url){
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onload = () => {
      if(xhr.status == 200) resolve(JSON.parse(xhr.response))
      else reject(Error(xhr.statusText))
    }
    xhr.onerror = () => {
      reject(Error('Network Error'))
    }
    xhr.send(JSON.stringify(data))
  })
}

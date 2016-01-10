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

export function fixTeacherName(name) {
  let parts = name.toLowerCase().split(' ')
  let delIdx = parts.indexOf('del')
  if(delIdx > -1 && delIdx < parts.length - 1) {
    let newParts = []
    for(let i = 0; i < parts.length; i++) {
      if(i != delIdx) newParts.push(parts[i])
      else parts[i+1] = `${parts[i]} ${parts[i+1]}`
    }
    parts = newParts
  }
  switch(parts.length){
    case 2: {
      parts = parts.reverse()
      break
    }
    case 3: {
      parts = [parts[2], parts[0], parts[1]]
      break
    }
    case 4: {
      parts = [parts[2], parts[3], parts[0], parts[1]]
      break
    }
  }

  let lower = parts.filter((elem) => elem !== '.').join(' ')
  return lower.replace(/(\S)(\S+\s?)/g,
    (_, initial, rest) => initial.toUpperCase() + rest.toLowerCase())
}

export function toTitleCase(name) {
  return name.toUpperCase().split(' ')
    .map((elem) => {
     if(elem.match(/^(I+|I-A)$/)) return elem
     if(elem.match(/^(Y|EN?|DEL?|LAS?)$/)) return elem.toLowerCase()
     if(elem === 'DE') return 'de'
     return elem[0].toUpperCase() + elem.substring(1).toLowerCase()
    }).join(' ')
}

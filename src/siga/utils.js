export function getFrameWithDelay(name, delay, callback, retries) {
  window.setTimeout(function(){
    try {
      var frame = window.parent.frames[name].document
      callback(frame)
    } catch (ex) {
      if(retries){
        getFrameWithDelay(name, delay, callback, --retries)
      } else throw new Error(`done retrying for ${name}`)
    }
  }, delay)
}

export function onFrameReady(name, callback) {
  var frame = window.parent.frames[name].document
  if(frame.readyState != 'loading'){
    callback(frame)
  } else {
    frame.addEventListener('DOMContentLoaded', (event) => {
      callback(frame)
    })
  }
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

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

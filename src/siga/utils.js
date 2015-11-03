export function getFrameWithDelay(name, delay, callback) {
  window.setTimeout(function(){
    var frame = window.parent.frames[name].document
    callback(frame)
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

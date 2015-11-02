export default {
  getFrameWithDelay: (name, delay, callback) => {
    window.setTimeout(function(){
      var frame = window.parent.frames[name].document
      callback(frame)
    }, delay)
  },

  onFrameReady: (name, callback) => {
    var frame = window.parent.frames[name].document
    if(frame.readyState != 'loading'){
      callback(frame)
    } else {
      frame.addEventListener('DOMContentLoaded', (event) => {
        callback(frame)
      })
    }
  }
}

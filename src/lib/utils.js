export default {
  log: (string) => {
    console.log('XSIGA :: '+string)
  },

  error: (err) => {
    if(err.message) console.error('XSIGA !! '+message)
    console.error('XSIGA !! '+err)
  },

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

module.exports = {
  log: function(string){
    console.log('XSIGA :: '+string);
  },

  error: function(string){
    console.error('XSIGA !! '+string);
  },

  getFrameWithDelay: function(name, delay, callback){
    window.setTimeout(function(){
      var frame = window.parent.frames[name].document;
      if(frame) callback(null, frame);
      else callback('no se cargó el marco');
    }, delay);
  },

  onFrameReady: function(name, callback){
    var frame = window.parent.frames[name].document;
    if(frame.readyState != 'loading'){
      callback(frame);
    } else {
      frame.addEventListener('DOMContentLoaded', function(event){
        callback(frame);
      });
    }
  }
};

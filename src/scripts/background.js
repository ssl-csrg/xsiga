import utils from '../lib/utils'

var processMessage = function(req, sender, callback){
  console.log(req)
  console.log(sender)
  callback(null)
}

chrome.runtime.onMessage.addListener(processMessage)

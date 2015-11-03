import utils from '../lib/utils'

var processMessage = function(req, sender, callback){
  console.log(req)
  console.log(sender)
  callback(null)
}

chrome.runtime.onMessage.addListener(processMessage)
chrome.tabs.insertCSS(null, {file: 'xs-style.css'}, () => {
  utils.log('estilo cargado')
})

import utils from '../lib/utils'

let popupURL = chrome.extension.getURL('popup.html')

let toQueryString = function(object) {
    return '?' +
    Object.keys(object).map(function(key) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`
    }).join('&');
}

let processMessage = function(req, sender, callback){
  if(req.type === 'info'){
    let obj = req.data
    obj.kind = req.kind
    delete obj.teacherNode
    delete obj.courseNode
    delete obj.node
    chrome.windows.create({
      'url': `${popupURL}${toQueryString(obj)}`,
      'type': 'popup',
      'width': 550,
      'height': 400,
      'top': 200,
      'left': 500
    }, function(wnd) {
      callback(wnd)
    })
  }
}

chrome.runtime.onMessage.addListener(processMessage)

import * as utils from '../lib/utils'

const serverHost = 'http://localhost:3000'

function postData(obj, kind, callback){
  let xhr = new XMLHttpRequest()
  xhr.open('POST', serverHost + '/scrap', true)
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
  xhr.send(JSON.stringify(obj))

  let err = null
  let response = {}
  let success = false

  xhr.addEventListener('error', (ev) => {
    console.error(ev)
    err = ev
  })

  xhr.addEventListener('load', (ev) => {
    console.log(ev)
    success = true
    response['url'] = `${serverHost}/${kind}/${obj.code}`
  })

  xhr.addEventListener('loadend', (ev) => {
    console.log(success)
    callback(err, response)
  })
}

function processMessage(req, sender, callback){
  if(req.type === 'info'){
    let obj = utils.stripObject(req.data)
    postData(obj, req.kind, (err, response) => {
      chrome.windows.create({
        'url': response.url,
        'type': 'popup',
        'width': 550,
        'height': 400,
        'top': 200,
        'left': 500
      }, (popup) => { callback(popup) })
    })
  }
}


chrome.runtime.onMessage.addListener(processMessage)

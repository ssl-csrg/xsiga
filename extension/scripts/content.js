import * as utils from '../lib/utils'
import siga from '../siga'

var activity = siga.detectActivity()
utils.log(activity.name)

if(activity.name === 'Horario Asignaturas'){
  activity.onListChange((list) => {
    list.filter((elem) => elem.hasOwnProperty('courseNode'))
      .map((elem, idx, array) => {
        makeNode(elem, 'course')
      })
    list.filter((elem) => elem.hasOwnProperty('teacherNode'))
      .map((elem, idx, array) => {
        makeNode(elem, 'teacher')
      })
  })
}

function makeNode(obj, kind){
  let anchor = document.createElement('a')
  anchor.dataset.kind = kind
  anchor.classList.add('xs-link')
  anchor.appendChild(document.createTextNode(obj[kind]))

  let node = obj[`${kind}Node`]
  node.innerHTML = ''
  node.appendChild(anchor)

  anchor.addEventListener('click', (evt) => {
    requestInfo(kind, obj)
    evt.preventDefault()
  })
}

function requestInfo(kind, elem){
  chrome.runtime.sendMessage({
    type: 'info',
    kind: kind,
    data: elem
  }, (response) => {
    /* nothing */
  });
}

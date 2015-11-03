import utils from '../lib/utils'
import siga from '../siga'

var activity = siga.detectActivity()
utils.log(activity.name)

if(activity.name === 'Horario Asignaturas'){
  activity.onListChange((list) => {
    list.filter((elem) => elem.hasOwnProperty('nameNode'))
      .map((elem, idx, array) => {
        let node = elem.nameNode
        node.innerHTML = `<a class="xs-link">${elem.name}</a>`
      })
    list.filter((elem) => elem.hasOwnProperty('teacherNode'))
      .map((elem, idx, array) => {
        let node = elem.teacherNode
        node.innerHTML = `<a class="xs-link">${elem.teacher}</a>`
      })
  })
}

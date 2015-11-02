import utils from '../lib/utils'
import siga from '../siga'

var activity = siga.detectActivity()
utils.log(activity.name)

if(activity.name === 'Horario Asignaturas'){
  activity.onListChange((err, list) => {
    console.log(list)
  })
}

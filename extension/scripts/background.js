import * as utils from '../lib/utils'

const serverAddress = 'http://localhost:3000'
const apiURL = serverAddress + '/api'

var popup = undefined

//retorna un array [course, teacher]
function createPayloads(obj){
  let teacher = null
  let course = {}

  course['name'] = obj.course
  course['daytime'] = obj.daytime
  course['short'] = obj.short
  course['dept'] = obj.dept

  if(obj.teacherName){
    course['teacher'] = {
      name: obj.teacherName,
      code: obj.code,
      semester: obj.semester,
      year: obj.year,
      campus: obj.campus,
      room: obj.room
    }

    teacher = {
      name: obj.teacherName,
      course: {
        name: obj.course,
        short: obj.short,
        dept: obj.dept,
        code: obj.code,
        semester: obj.semester,
        year: obj.year,
        campus: obj.campus,
        room: obj.room
      }
    }
  }

  return [course, teacher]
}

function postData(obj){
  let [course, teacher] = createPayloads(obj)
  let response = {}

  return utils.postDataAsJSON(course, apiURL + '/courses').then((data) => {
    if (teacher) teacher.course['_id'] = data._id
    response['course'] = data.slug
    if(teacher) return utils.postDataAsJSON(teacher, apiURL + '/teachers')
    else return response
  }).then((data) => {
    if(data.slug) response['teacher'] = data.slug
    return response
  })
}

function processMessage(req, sender, callback){
  if(req.type === 'info'){
    let obj = utils.stripObject(req.data)
    popup ? chrome.windows.remove(popup.id) : null
    postData(obj).then((response) => {
      console.log(response)
      chrome.windows.create({
        'url': `${serverAddress}/${req.kind}/${response[req.kind]}`,
        'type': 'popup',
        'width': 768,
        'height': 475,
      }, (newPopup) => {
        popup = newPopup
        callback(newPopup)
      })
    })
  }
}


chrome.runtime.onMessage.addListener(processMessage)

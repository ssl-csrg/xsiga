import * as utils from './utils'

export default class HorarioAsignaturas {
  constructor(){
    this.name = 'Horario Asignaturas'
    this.listTypes = [null, 'full', 'course', 'dept', 'teacher']
    this.selectedType = 0
    this.order = 'name'
  }

  parseList(frame, type) {
    let listMap = {
      full: { short: 0, name: 1, dept: 2, room: 3, teacher: 4 },
      course: { short: 0, dept: 1, room: 2, teacher: 3 },
      dept: { short: 0, name: 1, room: 2, teacher: 3 },
      teacher: { short: 0, name: 1, dept: 2, room: 3 }
    }
    let listType = this.listTypes[type] || type
    let courseCodes = []

    function parseElem(elem) {
      let obj = {}
      let inherited = undefined
      obj.node = elem
      try {
        obj.code = elem.querySelector('input[name=cod_asign]').value
        if(!courseCodes[obj.code]){
          inherited = false
          obj.name = elem.querySelector('input[name=nom_asign]').value.trim()
          courseCodes[obj.code] = {name: obj.name}
        } else {
          obj.name = courseCodes[obj.code].name
          inherited = true
        }
        let dataNodes = elem.querySelectorAll('td')
        let map = listMap[listType]
        obj.short = dataNodes[0].innerText.trim()
        if(map.hasOwnProperty('dept'))
          obj.dept = dataNodes[map.dept].innerText.trim()
        obj.room = dataNodes[map.room].innerText.trim()
        if(map.hasOwnProperty('teacher')){
          let teacherText = dataNodes[map.teacher].innerText.trim()
            if(!teacherText.toLowerCase().match(/^(proceso interno|nn|sin información)$/)){
              obj.teacher = teacherText
              obj.teacherNode = dataNodes[map.teacher]
            }
        }
        if(inherited === false){
          if(map.hasOwnProperty('name'))
            obj.nameNode = dataNodes[map.name]
          courseCodes[obj.code] = {
            name: courseCodes[obj.code].name,
            dept: obj.dept,
            short: obj.short
          }
        } else if(inherited === true){
          obj.dept = courseCodes[obj.code].dept
          obj.short = courseCodes[obj.code].short
        }
      } catch(ex) {
        console.error(ex)
        console.log({obj: obj, inherited: inherited})
       }
      return obj
    }

    if(!listType) return []

    return Array.prototype.map.call(
      frame.querySelectorAll('tr[valign=top]'), parseElem)
  }

  onListChange(callback) {
    let self = this

    function setupMain(frame) {
      try {
        frame.querySelector('select[name=op]')
        .addEventListener('change', mainListener)
        frame.querySelector('select[name=op_asig]')
        .addEventListener('change', orderListener)
      } catch(ex){ throw new Error('problema configurando controles') }
    }

    function setupSub() {
      utils.getFrameWithDelay('frame6', 500, (frame) => {
        try {
          frame.querySelector('select[name=opc]')
          .addEventListener('change', subListener)
        } catch(ex){ /* fail silently */ }
      })
    }

    function mainListener(event) {
      self.selectedType = event.target.selectedIndex
      event.target.selectedIndex > 1 ? setupSub() : grabCourseList()
    }

    function subListener(event) {
      utils.getFrameWithDelay('frame5', 500, (frame) => {
        setupMain(frame)
      })
      setupSub()
      grabCourseList()
    }

    function orderListener(event) {
      self.order = event.target.selectedIndex === 0 ? 'name' : 'code'
      setupSub()
      grabCourseList()
    }

    function grabCourseList() {
      utils.getFrameWithDelay('frame3', 2000, (frame) => {
        callback(self.parseList(frame, self.selectedType))
      })
    }

    utils.getFrameWithDelay('frame5', 200, (frame) => {
      setupMain(frame)
    })
  }
}

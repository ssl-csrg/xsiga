import * as utils from './utils'

export default class HorarioAsignaturas {
  constructor(){
    this.name = 'Horario Asignaturas'
    this.listTypes = [null, 'full', 'course', 'dept', 'teacher']
  }

  onListChange(callback) {
    let self = this

    function parseList(frame, type, next) {
      let listType = self.listTypes[type] || type
      if(!listType) next(null)

      let listMap = {
        full: { short: 0, course: 1, dept: 2, room: 3, teacher: 4 },
        course: { short: 0, dept: 1, room: 2, teacher: 3 },
        dept: { short: 0, course: 1, room: 2, teacher: 3 },
        teacher: { short: 0, course: 1, dept: 2, room: 3 }
      }

      let courseCodes = []

      function parseElem(elem, idx, array) {
        let obj = {}
        let inherited = undefined
        obj.node = elem
        try {
          obj.code = elem.querySelector('input[name=cod_asign]').value
          obj.semester = elem.querySelector('input[name=semestre]').value
          obj.year = elem.querySelector('input[name=ano]').value
          let campusCode = elem.querySelector('input[name=cod_sede]').value
          let timeCode = elem.querySelector('input[name=cod_jornada]').value

          obj.daytime = timeCode == 1 ? true : false
          obj.campus = self.campuses[campusCode]

          if(!courseCodes[obj.code]){
            inherited = false
            obj.course = elem.querySelector('input[name=nom_asign]').value.trim()
            courseCodes[obj.code] = {course: obj.course}
          } else {
            obj.course = courseCodes[obj.code].course
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
            if(map.hasOwnProperty('course'))
              obj.courseNode = dataNodes[map.course]
            courseCodes[obj.code] = {
              course: courseCodes[obj.code].course,
              dept: obj.dept,
              short: obj.short
            }
          } else if(inherited === true){
            obj.dept = courseCodes[obj.code].dept
            obj.short = courseCodes[obj.code].short
          }
        } catch(ex) {
          throw new Error(`node ${idx} was nos parseable`)
        }
        return obj
      }

      let elements = frame.querySelectorAll('tr[valign=top]')

      try {
        let list = Array.prototype.map.call(elements, parseElem)
        next(list)
      } catch(ex) {
        window.setTimeout(() => {
          parseList(frame, type, next)
        }, 1000)
      }
    }

    function setupTop(next) {
      utils.getFrameWithDelay('frame1', 1000, (frame) => {
        try {
          let selectsElements = frame.querySelectorAll('select')
          if(selectsElements.length < 3) throw new Error('not completed')

          Array.prototype.map.call(selectsElements, (elem) => {
            elem.addEventListener('change', (evt) => {
              setupMain(next)
            })
          })

          if(!self.campuses){
            self.campuses = []
            Array.prototype.filter.call(selectsElements[2], (e) => e.value > 0)
            .map((elem) => {
              self.campuses[elem.value] = elem.text
            })
          }

          setupMain(next)

        } catch(ex) { throw new Error('problema configurando controles') }
      }, 5)
    }

    function setupMain(next) {
      utils.getFrameWithDelay('frame5', 200, (frame) => {
        try {
          frame.querySelector('select[name=op_asig]')
          .addEventListener('change', orderListener)

          let operation = frame.querySelector('select[name=op]')
          operation.addEventListener('change', mainListener)

          setupSub(() => {
            next(operation.value)
          })
        } catch(ex){ throw new Error('problema configurando controles') }
      }, 5)
    }

    function setupSub(next) {
      utils.getFrameWithDelay('frame6', 500, (frame) => {
        try {
          frame.querySelector('select[name=opc]')
          .addEventListener('change', subListener)
        } catch(ex){ /* fail silently */ }
        next()
      })
    }

    function mainListener(event) {
      setupTop((type) => {
        grabCourseList(type, callback)
      })
    }

    function subListener(event) {
      setupTop((type) => {
        grabCourseList(type, callback)
      })
    }

    function orderListener(event) {
      setupTop((type) => {
        grabCourseList(type, callback)
      })
    }

    function grabCourseList(type, next) {
      utils.getFrameWithDelay('frame3', 500, (frame) => {
        utils.onFrameReady('frame3', (frame) => {
          parseList(frame, type, (list) => {
            next(list)
          })
        })
      })
    }

    setupTop((type) => {
      grabCourseList(type, callback)
    })
  }
}

import utils from './utils'

export default {
  name: 'Horario Asignaturas',
  listTypes: [null, 'full', 'course', 'dept', 'teacher'],
  selectedType: null,
  order: 'name',
  onListChange: function(callback){
    var __grabCourseList = () => {
      utils.getFrameWithDelay('frame3', 1000, (frame) => {
        callback(null, __parseList(frame, this.selectedType))
      })
    }

    //TODO
    var __parseList = (frame, type) => {
      return null
    }

    var __listenMainChange = (event) => {
      this.selectedType = event.target.selectedIndex
      if (event.target.selectedIndex > 1) {
        __setupSub()
      } else {
        __grabCourseList()
      }
    }

    var __listenSubChange = (event) => {
      utils.getFrameWithDelay('frame5', 500, (frame) => {
        __setupMain(frame)
      })
      __setupSub()
      __grabCourseList()
    }

    var __listenOrderChange = (event) => {
      this.order = event.target.selectedIndex === 0 ? 'name' : 'code'
      __setupSub()
      __grabCourseList()
    }

    var __setupMain = (frame) => {
      try {
        frame.querySelector('select[name=op]')
        .addEventListener('change', __listenMainChange)
        frame.querySelector('select[name=op_asig]')
        .addEventListener('change', __listenOrderChange)
      } catch(ex){ throw new Error('problema configurando controles') }
    }

    var __setupSub = () => {
      utils.getFrameWithDelay('frame6', 500, (frame) => {
        try {
          frame.querySelector('select[name=opc]')
          .addEventListener('change', __listenSubChange)
        } catch(ex){ /* fail silently */ }
      })
    }

    utils.onFrameReady('frame5', (frame) => {
      __setupMain(frame)
    })
  }
}

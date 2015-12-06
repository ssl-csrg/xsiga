import Router from 'express'
import cors from 'cors'
import * as controller from './course.controller'

var router = Router()

router.get('/:slug', controller.show)
router.options('/', cors())
router.get('/', cors(), controller.index)
router.post('/', cors(), controller.create)

export default router

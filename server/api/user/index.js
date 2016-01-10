import Router from 'express'
import * as controller from './user.controller'

var router = Router()

router.get('/', controller.get)

export default router

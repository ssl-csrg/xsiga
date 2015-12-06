import Router from 'express'
import * as controller from './comment.controller'

var router = Router()

router.get('/:id', controller.list)
router.post('/:id', controller.add)

export default router

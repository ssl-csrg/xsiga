import Router from 'express'
import * as controller from './comment.controller'

var router = Router()

router.put('/:id/:reply/:vote(up|down)', controller.voteReply)
router.put('/:id/:vote(up|down)', controller.vote)
router.put('/:id', controller.checkSession, controller.reply)
router.get('/:slug', controller.list)
router.post('/:slug', controller.checkSession, controller.add)

export default router

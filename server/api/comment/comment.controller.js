import mongojs, { ObjectId } from 'mongojs'

let db = mongojs('localhost/xsiga-dev', ['comment'])

export function list(req, res, next) {
  const slug = req.params.slug

  db.comment.find({parent: slug}).sort({score: -1, created: -1, 'replies.score': -1}, (err, comments) => {
    if (err) return next(err)
    res.json(comments)
  })
}

export function checkSession(req, res, next){
  const sess = req.session

  if (req.body.user && !req.body.user.hasOwnProperty('_id')){
    req.body.user._id = sess.id
  }

  if(!sess.name){
    sess.name = req.body.user.name
    sess.email = req.body.user.email
    sess.save()
  } else {
    req.body.user.name = sess.name
    req.body.user.email = sess.email
  }

  next()
}

export function reply(req, res, next) {
  let obj = req.body
  obj._id = new ObjectId()

  const commentId = ObjectId(req.params.id)

  obj.score = 1
  obj.positives = [req.session.id]
  obj.negatives = []

  db.comment.findAndModify({
    query: { _id: commentId },
    update: {
      $push: { replies: {
        $each: [obj],
        $sort: { score: -1, created: -1 }
      } }
    },
    new: true
  }, (err, comment) => {
    if (err) return next(err)
    if (!comment) return res.sendStatus(404)
    else res.json(comment)
  })
}

export function vote(req, res, next) {
  const commentId = ObjectId(req.params.id)
  const sess = req.session
  const positive = req.params.vote == 'up' ? true : req.params.vote == 'down' ? false : res.sendStatus(400)

  db.comment.findOne({ _id: commentId }, (err, comment) => {
    if (err) return next(err)
    if (!comment) return res.sendStatus(404)

    let updateStmt = {
      $inc: { score: 0 },
    }

    if (comment['positives'].indexOf(sess.id) > -1) {
      updateStmt.$pull = { positives: sess.id }
      if (positive) {
        updateStmt.$inc.score = -1
      } else {
        updateStmt.$push = { negatives: sess.id }
        updateStmt.$inc.score = -2
      }
    } else if (comment['negatives'].indexOf(sess.id) > -1) {
      updateStmt.$pull = { negatives: sess.id }
      if (positive) {
        updateStmt.$push = { positives: sess.id }
        updateStmt.$inc.score = 2
      } else {
        updateStmt.$inc.score = 1
      }
    } else {
      updateStmt = {
        $inc: { score: positive ? 1 : -1 },
        $push: {}
      }
      updateStmt.$push[positive ? 'positives' : 'negatives'] = sess.id
    }

    db.comment.update({ _id: commentId }, updateStmt, (err, result) => {
      if (err) return next(err)
      if (result && result.nModified == 1) {
        res.json({ success: true })
      } else res.sendStatus(400)
    })
  })
}

export function voteReply(req, res, next) {
  const commentId = ObjectId(req.params.id)
  const replyId = ObjectId(req.params.reply)
  const sess = req.session
  const positive = req.params.vote == 'up' ? true : req.params.vote == 'down' ? false : res.sendStatus(500)

  db.comment.findOne({ _id: commentId, 'replies._id': replyId }, {'replies.$': 1}, (err, comment) => {
    if (err) return next(err)
    if (!comment) return res.sendStatus(404)

    let updateStmt = {
      $inc: { 'replies.$.score': 0},
    }

    let reply = comment.replies[0]

    if (reply['positives'].indexOf(sess.id) > -1) {
      updateStmt.$pull = { 'replies.$.positives': sess.id }
      if (positive) {
        updateStmt.$inc['replies.$.score'] = -1
      } else {
        updateStmt.$push = { 'replies.$.negatives': sess.id }
        updateStmt.$inc['replies.$.score'] = -2
      }
    } else if (reply['negatives'].indexOf(sess.id) > -1) {
      updateStmt.$pull = { 'replies.$.negatives': sess.id }
      if (positive) {
        updateStmt.$push = { 'replies.$.positives': sess.id }
        updateStmt.$inc['replies.$.score'] = 2
      } else {
        updateStmt.$inc['replies.$.score'] = 1
      }
    } else {
      updateStmt = {
        $inc: { ['replies.$.score']: positive ? 1 : -1 },
        $push: {}
      }
      updateStmt.$push['replies.$.'+(positive ? 'positives' : 'negatives')] = sess.id
    }

    db.comment.update({ _id: commentId, 'replies._id': replyId }, updateStmt, (err, result) => {
      if (err) return next(err)
      if (result && result.nModified == 1) {
        res.json({ success: true })
      } else res.sendStatus(400)
    })
  })
}

export function add(req, res, next) {
  const obj = req.body

  if (!obj.hasOwnProperty('parent') && req.params.slug){
    obj.parent = req.params.slug
  }

  obj.score = 1
  obj.positives = [req.session.id]
  obj.negatives = []
  obj.replies = []

  db.comment.insert(obj, (err, doc) => {
    if (err) return next(err)
    if (!doc) return res.sendStatus(500)
    res.json(doc)
  })
}

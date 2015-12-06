import mongojs from 'mongojs'

let db = mongojs('localhost/xsiga-dev', ['comment'])

export function list(req, res, next) {
  const id = req.params.id

  db.comment.find({parent: id}).sort({created: false}, (err, docs) => {
    if (err) return next(err)
    res.json(docs)
  })
}

export function add(req, res, next) {
  const obj = req.body

  db.comment.insert(obj, (err, doc) => {
    if (err) return next(err)
    if (!doc) return res.sendStatus(500)
    res.json(doc)
  })
}

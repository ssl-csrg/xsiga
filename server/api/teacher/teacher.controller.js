import mongojs from 'mongojs'
import slug from 'slug'

let db = mongojs('localhost/xsiga-dev', ['teacher'])
slug.defaults.modes['pretty'].lower = true

export function index(req, res, next) {
  db.teacher.find({}, {name: 1, slug: 1}).sort({name: 1}, (err, docs) => {
    if (err) return next(err)
    res.json(docs)
  })
}

export function show(req, res, next) {
  const slug = req.params.slug.toLowerCase()
  db.teacher.findOne({slug: slug}, (err, doc) => {
    if (err) return next(err)
    if (!doc) return res.sendStatus(404)
    res.json(doc)
  })
}

export function create(req, res, next) {
  const obj = req.body
  const teacherSlug = slug(obj.name)

  let updateStmt = {
    $setOnInsert: {
      created: new Date(),
      name: obj.name
    }
  }

  if(obj.course) {
    updateStmt['$addToSet'] = {
      courses: {
        _id: obj.course._id,
        name: obj.course.name,
        slug: slug(obj.course.short+'-'+obj.course.name)
      }
    }
  }

  db.teacher.findAndModify({
    query: { slug: teacherSlug },
    update: updateStmt,
    new: true,
    upsert: true
  }, (err, doc) => {
    if (err) return next(err)
    if (!doc) return res.sendStatus(500)
    res.json(doc)
  })
}

export function update(req, res, next){
  const obj = req.body
  const teacherId = obj.id

  updateStmt = {
    name: obj.name,
    tags: obj.tags,
    updated: new Date()
  }

  db.teacher.findAndModify({
    query: { _id: teacherId },
    update: updateStmt,
    new: true
  }, (err, doc) => {
    if (err) return next(err)
    if (!doc) return res.sendStatus(404)
    res.json(doc)
  })
}

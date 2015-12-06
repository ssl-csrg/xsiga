import mongojs from 'mongojs'
import slug from 'slug'

let db = mongojs('localhost/xsiga-dev', ['course'])
slug.defaults.modes['pretty'].lower = true

export function index(req, res, next) {
  db.course.find({}, {name: 1, slug: 1}).sort({short: 1}, (err, docs) => {
    if (err) return next(err)
    res.json(docs)
  })
}

export function show(req, res, next) {
  const slug = req.params.slug.toLowerCase()
  db.course.findOne({slug: slug}, (err, doc) => {
    if (err) return next(err)
    if (!doc) return res.sendStatus(404)
    res.json(doc)
  })
}

export function create(req, res, next) {
  const obj = req.body
  const courseSlug = slug(obj.short+'-'+obj.name)

  let updateStmt = {
    $setOnInsert: {
      created: new Date(),
      name: obj.name,
      short: obj.short,
      dept: obj.dept,
      tags: [obj.dept]
    }
  }

  if(obj.teacher) {
    updateStmt['$addToSet'] = {
      teachers: {
        name: obj.teacher.name,
        slug: slug(obj.teacher.name),
      }
    }
  }

  db.course.findAndModify({
    query: { slug: courseSlug },
    update: updateStmt,
    new: true,
    upsert: true
  }, (err, doc) => {
    if (err) return next(err)
    if (!doc) return res.sendStatus(500)
    res.json(doc)
  })
}

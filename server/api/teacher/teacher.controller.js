import mongojs, { ObjectId } from 'mongojs'
import slug from 'slug'

let db = mongojs('localhost/xsiga-dev', ['teacher', 'course', 'sessions'])
slug.defaults.modes['pretty'].lower = true

function getRecommended(userId, currentTeacherId) {
  function jaccard(a, b) {
    let intersect = a.filter(x => b.indexOf(x) > -1).length
    return Number(intersect/(a.length + b.length - intersect))
  }

  function getLikesList(id) {
    return new Promise((resolve, reject) => {
      db.teacher.find({ likes: id }, { _id: 1 }, (err, list) => {
        if (err) reject(err)
        resolve([id, list.map(e => e._id.toString())])
      })
    })
  }

  function getAllSessionsBut(id) {
    return new Promise((resolve, reject) => {
      db.sessions.find({ _id: { $ne: userId }}, { _id: 1}, (err, sessions) => {
        if(err) reject(err)
        resolve(sessions)
      })
    })
  }

  function getAllLikesLists(sessions) {
    let promises = [getLikesList(userId)]
    sessions.forEach((elem, idx, arr) => {
      promises.push(getLikesList(elem._id))
    })
    return Promise.all(promises)
  }

  function getRecs(list) {
    let near = []
    let [self] = list.splice(0, 1)
    let likes = self[1]
    list.forEach(([otherId, otherLikes]) => {
      if(otherLikes.length == 0) return
      near.push({ _id: otherId, likes: otherLikes, coef: jaccard(likes, otherLikes)})
    })
    near = near.sort((a, b) => b.coef - a.coef).slice(0, 5)
    return [... new Set(near.map(x => x.likes)
      .reduce((p, c) => p.concat(c), []))]
      .filter(x => likes.indexOf(x) == -1)
      .map(x => ObjectId(x))
  }

  function getTeachers(recommended) {
    return new Promise((resolve, reject) => {
      db.teacher.find(
        { _id: { $in: recommended, $ne: currentTeacherId }},
        { slug: 1, name: 1 }, (err, teachers) => {
          if(err) reject(err)
          resolve(teachers)
        })
    })
  }

  return getAllSessionsBut(userId)
    .then(getAllLikesLists)
    .then(getRecs)
    .then(getTeachers)
}

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
    if (req.session) {
      getRecommended(req.session.id, doc._id).then((teachers) => {
        doc['recommended'] = teachers
        res.json(doc)
      })
    } else res.json(doc)
  })
}

export function create(req, res, next) {
  const obj = req.body
  const teacherSlug = slug(obj.name)

  db.teacher.findAndModify({
    query: { slug: teacherSlug },
    update: {
      $setOnInsert: {
        created: new Date(),
        name: obj.name,
        courses: [],
        likes: []
      }
    },
    new: true,
    upsert: true
  }, (err, doc) => {
    if (err) return next(err)
    if (!doc) return res.sendStatus(500)
    if (obj.course) {
      db.teacher.findAndModify({
        query: {
          _id: doc._id,
          'courses._id': {
            $ne: obj.course._id
          }
        },
        update: {
          $push: {
            courses: {
              _id: obj.course._id,
              name: obj.course.name,
              slug: slug(obj.course.short+'-'+obj.course.name)
            }
          }
        },
        new: true
      }, (err2, doc2) => {
        if (err2) return next(err2)
        res.json(doc)
      })
    } else {
      res.json(doc)
    }
  })
}

export function update(req, res, next) {
  const obj = req.body

  let updateStmt = {
    $set: {
      name: obj.name,
      email: obj.email,
      description: obj.description,
      links: obj.links,
      tags: obj.tags,
      updated: new Date()
    }
  }

  let queryStmt = obj._id ? { _id: obj._id } : req.params.slug? { slug: req.params.slug.toLowerCase() } : res.sendStatus(400)

  db.teacher.findAndModify({
    query: queryStmt,
    update: updateStmt,
    new: true
  }, (err, doc) => {
    if (err) return next(err)
    if (!doc) return res.sendStatus(404)
    else {
      res.json(doc)

      db.course.update(
        { "teachers.slug": doc.slug },
        { $set: { "teachers.$.name": obj.name, "teachers.$._id": doc._id }},
        { multi: true }, (err, value) => { /*do nothing*/ })
    }
  })
}

export function like(req, res, next) {
  const sess = req.session
  const slug = req.params.slug

  if(!sess) res.sendStatus(400)

  db.teacher.update(
    { slug: slug, likes: { $ne: sess.id } },
    { $push: { likes: sess.id }, $inc: { score: 1 } }, (err, value) => {
      if(err) next(err)
      else res.json({ success: true })
    })
}

export function dislike(req, res, next) {
  const sess = req.session
  const slug = req.params.slug

  if(!sess) res.sendStatus(400)

  db.teacher.update(
    { slug: slug, likes: sess.id },
    { $pull: { likes: sess.id }, $inc: { score: -1 } }, (err, value) => {
      if(err) next(err)
      else res.json({ success: true })
    })
}

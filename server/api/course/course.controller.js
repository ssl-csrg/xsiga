import mongojs from 'mongojs'
import slug from 'slug'
import request from 'request'

let db = mongojs('localhost/xsiga-dev', ['course', 'teacher'])
slug.defaults.modes['pretty'].lower = true

function getSummaryFromCIME(short){
  return new Promise((resolve, reject) => {
    request(`http://www.cime.cl/api/ramo/${short}/resumen`, (err, res, body) => {
      if(!err && res.statusCode == 200){
        let json = JSON.parse(body)
        if(!json.hasOwnProperty('sigla')){
          reject(new Error('no existe el ramo en CIME'))
        } else {
          resolve(json)
        }
      } else reject(new Error('error en la red'))
    })
  })
}

function addCIMELink(doc) {
  if(doc.links){
    for(let link of doc.links){
      if(link.title.toUpperCase().indexOf('CIME') > -1){
        return new Error('ya existe el link')
      }
    }
  }

  return getSummaryFromCIME(doc.short).then((summary) => {
    if (summary.ultimos_archivos.length == 0) return new Error('no hay archivos')
    return new Promise((resolve, reject) => {
      db.course.findAndModify({
        query: { _id: doc._id },
        update: {
          $addToSet: {
            links: {
              title: 'Archivos en CIME',
              address: 'http://www.cime.cl/ramos/#/'+doc.short
            }
          }
        }
      }, (err, value) => {
        if (err) reject(err)
        else resolve(value)
      })
    })
  })
}

function getRelated(courseDoc) {
  let teacherSlugs = courseDoc.teachers.map(x => x.slug)
  function jaccard(a, b) {
    let intersect = a.filter(x => b.indexOf(x) > -1).length
    return Number(intersect/(a.length + b.length - intersect))
  }

  function getProximity(elem){
    let hisTags = elem.tags
    let hisTeacherSlugs = elem.teachers.map(x => x.slug)
    let close = jaccard(courseDoc.tags, hisTags) + jaccard(teacherSlugs, hisTeacherSlugs)

    return {
      name: elem.name,
      slug: elem.slug,
      close: close
    }
  }

  function getOtherCourses() {
    return new Promise((resolve, reject) => {
      db.course.find({
        _id: { $ne: courseDoc._id }
      }, {
        tags: 1, teachers: 1, name: 1, slug: 1
      }, (err, courses) => {
        if (err) reject(err)
        resolve(courses)
      })
    })
  }

  return getOtherCourses().then((courses) => {
    return courses.map(getProximity)
      .filter(x => x.close > 0)
      .sort((a, b) => b.close - a.close)
      .slice(0, 3)
  })
}

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
    getRelated(doc).then((related) => {
      doc.related = related
      res.json(doc)
    })
  })
}

export function create(req, res, next) {
  const obj = req.body
  const courseSlug = slug(obj.short+'-'+obj.name)

  db.course.findAndModify({
    query: { slug: courseSlug },
    update: {
      $setOnInsert: {
        created: new Date(),
        name: obj.name,
        short: obj.short,
        dept: obj.dept,
        tags: [obj.dept]
      }
    },
    new: true,
    upsert: true
  }, (err, doc) => {
    if (err) return next(err)
    if (!doc) return res.sendStatus(500)

    if(obj.teacher) {
      const teacherSlug = slug(obj.teacher.name)
      db.course.findAndModify({
        query: {
          _id: doc._id,
          'teachers.slug': {
            $ne: teacherSlug
          }
        },
        update: {
          $push: {
            teachers: {
              name: obj.teacher.name,
              slug: teacherSlug
            }
          }
        }
      }, (err2, doc2) => {
        if (err2) return next(err2)
        res.json(doc)
      })
    } else {
      res.json(doc)
    }

    addCIMELink(doc)
  })
}

export function update(req, res, next) {
  const obj = req.body

  let updateStmt = {
    $set: {
      name: obj.name,
      description: obj.description,
      links: obj.links,
      tags: obj.tags,
      updated: new Date()
    }
  }

  let queryStmt = obj._id ? { _id: obj._id } : req.params.slug? { slug: req.params.slug.toLowerCase() } : res.sendStatus(400)

  db.course.findAndModify({
    query: queryStmt,
    update: updateStmt,
    new: true
  }, (err, doc) => {
    if (err) return next(err)
    if (!doc) return res.sendStatus(404)
    else {
      res.json(doc)

      db.teacher.update(
        { "courses.slug": doc.slug },
        { $set: { "courses.$.name": obj.name }},
        { multi: true }, (err, value) => { /*do nothing*/ })

      addCIMELink(doc)
    }
  })
}

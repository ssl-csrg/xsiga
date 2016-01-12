import mongojs from 'mongojs'
let db = mongojs('localhost/xsiga-dev', ['course', 'teacher'])

export function get(req, res, next){
  const sess = req.session
  
  if(sess.visits) sess.visits++
  else sess.visits = 1
  sess.save()

  if(sess.name){
    res.json({
      name: sess.name,
      email: sess.email,
      _id: sess.id
    })
  } else {
    res.json({_id: sess.id})
  }
}

export function getTags(req, res, next) {
  let tags = []
  db.course.find({
    tags: { $exists: true, $ne: []}
  }, {tags: 1}, (err, courses) => {
    if (err) next(err)
    tags = courses.map(x => x.tags).reduce((p,c) => p.concat(c), [])
    db.teacher.find({
      tags: { $exists: true, $ne: []}
    }, {tags: 1}, (err, teachers) => {
      if (err) next(err)
      tags.concat(teachers.map(x => x.tags).reduce((p,c) => p.concat(c), []))
      res.json({tags: [...new Set(tags)]})
    })
  })
}

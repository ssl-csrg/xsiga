import mongojs from 'mongojs'

let db = mongojs('localhost/xsiga-dev', ['comment', 'teacher'])
db.comment.remove({}, (err, result) => {
  console.log('Comments removed: '+result.n)
  db.teacher.update({},
    { $set: { score: 0, likes: [] } },
    { multi: true }, (err, result) => {
      console.log('Teachers restored: '+result.nModified)
      process.exit()
    })
})

import mongojs from 'mongojs'

let db = mongojs('localhost/xsiga-dev', ['course'])

let updated = 0

function checkProximity(elem, idx, arr){
  return new Promise((resolve, reject) => {
    let myTags = elem.tags
    let closeness = []
    arr.forEach((other, idy) => {
      if (idx === idy) return
      let hisTags = other.tags
      let close = 0
      for (let tag of myTags) {
        if (hisTags.indexOf(tag) > -1) close += 1
      }
      if(close > 0) closeness.push({
        _id: other._id,
        name: other.name,
        slug: other.slug,
        close: close
      })
    })

    db.course.update({ _id: elem._id }, {
      $set: { related: closeness.sort((a, b) => b.close - a.close).slice(0, 3) }
    }, (err, result) => {
      if (err) reject(err)
      resolve(result.nModified)
    })
  })
}

db.course.find({ tags: { $exists: true, $ne: [] } }, (err, courses) => {
  let promises = []
  courses.forEach((elem, idx, arr) => {
    promises.push(checkProximity(elem, idx, arr))
  })
  Promise.all(promises).then((values) => {
    console.log('courses updated: ', values.reduce((p, c) => p + c, 0))
    process.exit()
  })
})

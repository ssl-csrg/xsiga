import express from 'express'
import favicon from 'serve-favicon'
import path from 'path'

import teacher from './api/teacher'
import course from './api/course'
import comment from './api/comment'

export default function(app){
  /* API */
  app.use('/api/teachers', teacher)
  app.use('/api/courses', course)
  app.use('/api/comment', comment)

  /* Static files */
  let root = path.normalize(__dirname + '/../dist')
  app.use(express.static(path.join(root, 'client')));
  app.use(favicon(__dirname + '/favicon.ico'));

  /* All other routes load the app */
  app.route('/*').get((req, res) => {
    res.sendFile(path.join(root, 'client', 'index.html'))
  })
}

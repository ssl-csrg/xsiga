import express from 'express'

import routes from './routes'
import config from './config'

let app = express()

config(app)
routes(app)

app.listen(3000, () => {
  console.log('server listening at port 3000')
})

export default app

import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import routes from './routes'

let app = express()

app.use(bodyParser.json())
app.use(morgan('tiny'))

routes(app)

app.listen(3000, () => {
  console.log('server listening at port 3000')
})

export default app

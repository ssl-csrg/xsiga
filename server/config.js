import bodyParser from 'body-parser'
import morgan from 'morgan'
import session from 'express-session'
import connectMongo from 'connect-mongo'

const MongoStore = connectMongo(session)

export default function(app) {
  app.use(bodyParser.json())
  app.use(morgan('tiny'))
  app.use(session({
    secret: 'xsiga rocks',
    store: new MongoStore({
      url: 'mongodb://localhost/xsiga-dev'
    }),
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365
    }
  }))
}

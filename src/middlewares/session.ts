import * as s from 'express-session'
import ems from 'express-mysql-session'
import session from 'express-session'
import { createPool } from 'mysql'
import { SESSION_SECRET, DATABASE_URL } from '../configurations'

const databaseURL = new URL(DATABASE_URL)
const MySQLStore = ems(s)

const connection = createPool({
  host: databaseURL.hostname,
  port: parseInt(databaseURL.port, 10),
  database: databaseURL.pathname.substring(1),
  user: decodeURIComponent(databaseURL.username),
  password: decodeURIComponent(databaseURL.password),
  ssl: { rejectUnauthorized: true }
})

const store = new MySQLStore(
  {
    createDatabaseTable: true,
    expiration: 10800000
  },
  connection
)

const _session = session({
  secret: SESSION_SECRET,
  store,
  saveUninitialized: false,
  resave: false
})

export { _session as session }

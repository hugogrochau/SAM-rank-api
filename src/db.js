import knex from 'knex'
import bookshelf from 'bookshelf'
import knexConfig from '../knexfile'

const environment = process.env.NODE_ENV || 'development'
const bs = bookshelf(knex(knexConfig[environment]))

export default bs

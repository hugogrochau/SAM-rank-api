import knex from 'knex'
import bookshelf from 'bookshelf'
import knexConfig from '../../knexfile'

const environment = process.env.NODE_ENV || 'development'
const bs = bookshelf(knex(knexConfig[environment]))
bs.plugin('virtuals')
bs.plugin('pagination')
// bs.plugin('visibility') TODO use this when making user model

export default bs

const knex = require('knex')

const knexConfig = require('../knexfile')

const db = knex(knexConfig.development)


module.exports = {
    find: (user) => {
        return db('users').select('id', 'username')
 },
    insert: (user) => {
        return db('users').insert(user);
    },
        findByUser: (username) => {
            return db('users').where('username', username);
        }

}